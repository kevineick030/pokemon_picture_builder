import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PROMPTS } from "@/data/prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { promptId, holderName, pokemonName, personDescription, referenceImageBase64, referenceImageMimeType } = body;

    const template = PROMPTS.find((p) => p.id === promptId);
    if (!template) {
      return NextResponse.json({ error: "Prompt nicht gefunden" }, { status: 400 });
    }

    let fotoDescription = personDescription || "";

    // Step 1: If reference image provided but no manual description → auto-describe via Gemini Vision
    if (referenceImageBase64 && !personDescription) {
      const visionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const visionResult = await visionModel.generateContent([
        {
          inlineData: {
            mimeType: referenceImageMimeType || "image/jpeg",
            data: referenceImageBase64,
          },
        },
        {
          text: `Beschreibe die Person auf diesem Foto in 2-3 Sätzen für eine Anime/TCG-Karten-Illustration. Fokussiere dich auf: Geschlecht, Haarfarbe, Haarstil, Augenfarbe, Hautton, markante Gesichtsmerkmale. Formuliere die Beschreibung so, dass ein Bildgenerator damit die Person erkennen und zeichnen kann. Beispiel: "Eine junge Frau mit langen dunklen Haaren, braunen Augen, heller Haut und einem freundlichen Lächeln." Antworte nur mit der Beschreibung, ohne Erklärungen.`,
        },
      ]);
      fotoDescription = visionResult.response.text().trim();
    }

    // Step 2: Replace placeholders in the template
    let finalPrompt = template.template
      .replace(/\[HOLDER_NAME\]/g, holderName || "")
      .replace(/\[POKEMON_NAME\]/g, pokemonName || "")
      .replace(/\[FOTO_BESCHREIBUNG_DER_PERSON\]/g, fotoDescription);

    // Step 3: Generate the image
    const imageModel = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-preview-image-generation",
    });

    const contentParts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
      { text: finalPrompt },
    ];

    // Optionally include the reference image directly in the generation prompt
    if (referenceImageBase64) {
      contentParts.push({
        inlineData: {
          mimeType: referenceImageMimeType || "image/jpeg",
          data: referenceImageBase64,
        },
      });
    }

    const result = await (imageModel as any).generateContent({
      contents: [{ role: "user", parts: contentParts }],
      generationConfig: {
        responseModalities: ["IMAGE", "TEXT"],
      },
    });

    const response = result.response;
    let imageData: string | null = null;
    let imageMimeType = "image/png";
    let textResponse = "";

    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData?.data) {
          imageData = part.inlineData.data;
          imageMimeType = part.inlineData.mimeType || "image/png";
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
    return NextResponse.json(
      { error: err.message || "Unbekannter Fehler bei der Bildgenerierung" },
      { status: 500 }
    );
  }
}
