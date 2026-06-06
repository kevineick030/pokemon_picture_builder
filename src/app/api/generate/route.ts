import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Modality } from "@google/genai";
import { PROMPTS } from "@/data/prompts";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Override via GEMINI_IMAGE_MODEL env var if needed.
const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-3-pro-image";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { promptId, holderName, pokemonName, personDescription, referenceImageBase64, referenceImageMimeType, statsAppendix, finalPromptOverride } = body;

    let fotoDescription = personDescription || "";
    let finalPrompt: string;

    if (finalPromptOverride) {
      finalPrompt = finalPromptOverride;
    } else {
      const template = PROMPTS.find((p) => p.id === promptId);
      if (!template) {
        return NextResponse.json({ error: "Prompt nicht gefunden" }, { status: 400 });
      }

      // Step 1: Auto-describe person from reference image (always runs when photo is uploaded)
      if (referenceImageBase64) {
        const visionResult = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{
            role: "user",
            parts: [
              { inlineData: { mimeType: referenceImageMimeType || "image/jpeg", data: referenceImageBase64 } },
              { text: `Beschreibe die Person auf diesem Foto in 2-3 Sätzen für eine Anime/TCG-Karten-Illustration. Fokussiere dich auf: Geschlecht, Haarfarbe, Haarstil, Augenfarbe, Hautton, markante Gesichtsmerkmale. Formuliere die Beschreibung so, dass ein Bildgenerator damit die Person erkennen und zeichnen kann. Beispiel: "Eine junge Frau mit langen dunklen Haaren, braunen Augen, heller Haut und einem freundlichen Lächeln." Antworte nur mit der Beschreibung, ohne Erklärungen.` },
            ],
          }],
        });
        const autoDesc = (visionResult.text ?? "").trim();
        // Combine auto-description with any manual additions from the user
        fotoDescription = personDescription
          ? `${autoDesc} ${personDescription}`
          : autoDesc;
      }

      // Step 2: Replace placeholders in the template
      let templateText = template.template
        .replace(/\[HOLDER_NAME\]/g, holderName || "")
        .replace(/\[POKEMON_NAME\]/g, pokemonName || "")
        .replace(/\[FOTO_BESCHREIBUNG_DER_PERSON\]/g, fotoDescription);

      if (statsAppendix) {
        // Extract HP from appendix and replace it directly in the template so it overrides the hardcoded value
        const hpMatch = statsAppendix.match(/HP: exakt '(\d+) HP'/);
        if (hpMatch) {
          templateText = templateText.replace(/'?\d{2,3} HP'?/g, `'${hpMatch[1]} HP'`);
        }

        // Put user stats BEFORE the template so they take priority over hardcoded template values
        const overrideBlock = statsAppendix
          .replace(
            "WICHTIGE KARTEN-DETAILS (müssen exakt so auf der Karte erscheinen):",
            "VERBINDLICHE KARTEN-WERTE – diese überschreiben alle anderen Werte weiter unten:"
          );
        finalPrompt = overrideBlock + "\n\n---\n\n" + templateText;
      } else {
        finalPrompt = templateText;
      }
    }

    // Step 3: Generate the image — try each model/method until one works
    let imageData: string | null = null;
    let imageMimeType = "image/jpeg";

    const modelsToTry = [
      IMAGE_MODEL,
      ...(IMAGE_MODEL !== "gemini-3-pro-image" ? ["gemini-3-pro-image"] : []),
      "gemini-2.5-flash-image",
      "gemini-3.1-flash-image",
    ];

    const errors: string[] = [];

    for (const model of modelsToTry) {
      if (imageData) break;

      // Try generateContent (works for gemini image models)
      try {
        const result = await ai.models.generateContent({
          model,
          contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
          config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
        });
        for (const candidate of result.candidates ?? []) {
          for (const part of candidate.content?.parts ?? []) {
            if (part.inlineData?.data) {
              imageData = part.inlineData.data;
              imageMimeType = part.inlineData.mimeType ?? "image/jpeg";
            }
          }
        }
        if (imageData) break;
      } catch (e: any) {
        errors.push(`${model}/generateContent: ${e?.message}`);
      }

      if (imageData) break;

      // Try generateImages (works for imagen-style models)
      try {
        const imgResult = await ai.models.generateImages({
          model,
          prompt: finalPrompt,
          config: { numberOfImages: 1, outputMimeType: "image/jpeg" } as any,
        });
        const raw = imgResult.generatedImages?.[0]?.image?.imageBytes;
        if (raw) {
          imageData = typeof raw === "string" ? raw : Buffer.from(raw as Uint8Array).toString("base64");
          imageMimeType = "image/jpeg";
        }
      } catch (e: any) {
        errors.push(`${model}/generateImages: ${e?.message}`);
      }
    }

    if (!imageData) {
      return NextResponse.json(
        { error: "Kein Bild generiert – alle Modelle fehlgeschlagen.", details: errors.join(" | ") },
        { status: 422 }
      );
    }

    if (!imageData) {
      return NextResponse.json({ error: "Kein Bild generiert." }, { status: 422 });
    }

    return NextResponse.json({
      imageBase64: imageData,
      mimeType: imageMimeType,
      personDescription: fotoDescription,
    });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    const raw = err?.message || "Unbekannter Fehler";
    const status = err?.status ?? err?.httpError?.status ?? 500;
    if (/not found|NOT_FOUND|404/i.test(raw) || status === 404) {
      return NextResponse.json(
        {
          error: `Das Bild-Modell '${IMAGE_MODEL}' ist für diesen API-Key nicht verfügbar.`,
          details: raw,
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: raw, details: String(err) }, { status: 500 });
  }
}
