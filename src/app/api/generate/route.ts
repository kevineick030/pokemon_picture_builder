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

      // Step 1: Auto-describe person from reference image (always when photo uploaded)
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
        fotoDescription = personDescription ? `${autoDesc} ${personDescription}` : autoDesc;
      }

      // Step 2: Replace placeholders in the template
      let templateText = template.template
        .replace(/\[HOLDER_NAME\]/g, holderName || "")
        .replace(/\[POKEMON_NAME\]/g, pokemonName || "")
        .replace(/\[FOTO_BESCHREIBUNG_DER_PERSON\]/g, fotoDescription);

      if (statsAppendix) {
        // Replace HP value directly in template so it overrides hardcoded value
        const hpMatch = statsAppendix.match(/HP: exakt '(\d+) HP'/);
        if (hpMatch) {
          templateText = templateText.replace(/'?\d{2,3} HP'?/g, `'${hpMatch[1]} HP'`);
        }
        // Extract user attack names to avoid duplicates with template hardcoded attacks
        const attack1Match = statsAppendix.match(/Angriff 1: '([^']+)'/);
        const attack2Match = statsAppendix.match(/Angriff 2: '([^']+)'/);
        const hasCustomAttacks = attack1Match || attack2Match;

        // Put user stats BEFORE the template so they take priority
        let overrideBlock = statsAppendix.replace(
          "WICHTIGE KARTEN-DETAILS (müssen exakt so auf der Karte erscheinen):",
          "VERBINDLICHE KARTEN-WERTE – diese überschreiben alle anderen Werte weiter unten:"
        );
        if (hasCustomAttacks) {
          const attackNames = [attack1Match?.[1], attack2Match?.[1]].filter(Boolean).join(" und ");
          overrideBlock += `\n\nWICHTIG: Auf der Karte dürfen NUR die oben genannten Angriffe erscheinen (${attackNames}). Alle anderen Angriffsnamen aus dem Template darunter werden IGNORIERT und dürfen NICHT auf der Karte erscheinen. Kein Angriff darf doppelt vorkommen.`;
        }
        finalPrompt = overrideBlock + "\n\n---\n\n" + templateText;
      } else {
        finalPrompt = templateText;
      }
    }

    // Step 3: Generate the image
    const contentParts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
      { text: finalPrompt },
    ];

    if (referenceImageBase64) {
      contentParts.push({
        inlineData: {
          mimeType: referenceImageMimeType || "image/jpeg",
          data: referenceImageBase64,
        },
      });
    }

    const result = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: [{ role: "user", parts: contentParts }],
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let imageData: string | null = null;
    let imageMimeType = "image/png";
    let textResponse = "";

    for (const candidate of result.candidates ?? []) {
      for (const part of candidate.content?.parts ?? []) {
        if (part.inlineData?.data) {
          imageData = part.inlineData.data;
          imageMimeType = part.inlineData.mimeType ?? "image/png";
        } else if (part.text) {
          textResponse += part.text;
        }
      }
    }

    if (!imageData) {
      return NextResponse.json(
        { error: "Kein Bild generiert. Möglicherweise hat der Content-Filter angesprochen. Versuche es ohne Referenzbild oder ändere den Pokémon-Namen.", details: textResponse },
        { status: 422 }
      );
    }

    return NextResponse.json({
      imageBase64: imageData,
      mimeType: imageMimeType,
      personDescription: fotoDescription,
    });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    const raw = err?.message || "Unbekannter Fehler bei der Bildgenerierung";
    if (/not found|NOT_FOUND|404/i.test(raw)) {
      return NextResponse.json(
        {
          error: `Das Bild-Modell '${IMAGE_MODEL}' ist für diesen API-Key nicht verfügbar. Prüfe in Google AI Studio, ob das Modell freigeschaltet ist, oder setze die Umgebungsvariable GEMINI_IMAGE_MODEL auf ein verfügbares Modell.`,
          details: raw,
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: raw }, { status: 500 });
  }
}
