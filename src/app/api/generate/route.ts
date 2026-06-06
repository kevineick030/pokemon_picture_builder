import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Modality } from "@google/genai";
import { PROMPTS } from "@/data/prompts";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Primary: gemini-3-pro-image-preview — best quality, paid tier required.
// Falls back automatically to gemini-2.5-flash-image (free tier) if not available.
// Override via GEMINI_IMAGE_MODEL env var if needed.
const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-3-pro-image-preview";

// Vision model for describing the reference photo. gemini-2.0-flash was retired
// by Google; gemini-2.5-flash is the current, widely available successor.
const VISION_MODEL = process.env.GEMINI_VISION_MODEL || "gemini-2.5-flash";

// Prepended to every prompt to enforce anime style for people and correct text spelling.
const GLOBAL_STYLE_PREFIX = `ÜBERGEORDNETE STILREGELN (höchste Priorität, überschreiben alles andere):

1. PERSONENSTIL: Jede Person auf dieser Karte MUSS vollständig im authentischen Pokémon TCG Anime-Illustrationsstil gezeichnet sein – als handgezeichneter Anime-Charakter mit Cel-Shading, sauberen schwarzen Outlines und stilisierten Zügen. ABSOLUT KEIN fotografischer Realismus. KEINE Foto-Montage. KEIN Photo-Compositing. Die Person ist eine GEZEICHNETE Anime-Figur, nicht ein eingearbeitetes Foto. Die Gesichtsmerkmale aus der Beschreibung werden übernommen, aber komplett im Anime/TCG-Zeichenstil neu interpretiert und gemalt.

2. TEXTE – SEHR WICHTIG: Schreibe ausschließlich die explizit vorgegebenen Texte (Kartentitel, Angriffsnamen, HP-Wert, Schadenswerte). Jeder Buchstabe muss korrekt und gut lesbar sein – KEINE erfundenen Wörter, KEINE verdrehten Buchstaben, KEIN Pseudo-Latein, KEIN Kauderwelsch. Erfinde KEINEN zusätzlichen Fließtext. Wenn kleiner Text (z.B. Illustrator-Zeile, Set-Nummer, Flavor-Text) nicht sauber und korrekt lesbar dargestellt werden kann, lasse ihn lieber ganz weg, statt unleserliche Fantasiebuchstaben zu malen.

3. ICONS STATT KLAMMERTEXT: Ausdrücke in eckigen Klammern wie [Feuer-Symbol], [Gras-Symbol], [Zwei Energie-Symbole], [Wasser-Symbol] sind ANWEISUNGEN, an dieser Stelle ein passendes rundes Energie-ICON zu zeichnen. Schreibe diese Klammer-Ausdrücke NIEMALS als Buchstaben auf die Karte – zeichne stattdessen das Symbol.

4. KORREKTE DEUTSCHE KARTEN-BEGRIFFE in der unteren Werte-Zeile: 'Schwäche', 'Resistenz', 'Rückzug' (exakt so buchstabiert). 'BASIS' für Basis-Pokémon. Diese Begriffe immer korrekt und lesbar schreiben.

---

`;

interface CardStats {
  type?: string;
  hp?: string;
  abilityName?: string;
  abilityText?: string;
  attack1Name?: string;
  attack1Damage?: string;
  attack2Name?: string;
  attack2Damage?: string;
}

// Builds a fresh "Textfelder" section from the user's stats. This replaces the
// template's hardcoded attacks so the user's values actually appear on the card.
function buildTextfelderBlock(stats: CardStats): string {
  const lines: string[] = [
    "**Textfelder (Unteres Drittel) – DIESE WERTE SIND VERBINDLICH. GENAU UND NUR DIESE Texte erscheinen auf der Karte:**",
  ];
  if (stats.abilityName) {
    lines.push(
      `* Fähigkeit (farbiges Banner): 'Fähigkeit: ${stats.abilityName}'`
        + (stats.abilityText ? ` mit Beschreibungstext: '${stats.abilityText}'` : "")
    );
  }
  if (stats.attack1Name) {
    lines.push(
      `* Angriff 1: [Energie-Symbol] '${stats.attack1Name}' (fett, schwarz)`
        + (stats.attack1Damage ? `, Schaden rechtsbündig '${stats.attack1Damage}'` : "")
        + "."
    );
  }
  if (stats.attack2Name) {
    lines.push(
      `* Angriff 2: [zwei Energie-Symbole] '${stats.attack2Name}' (fett, schwarz)`
        + (stats.attack2Damage ? `, Schaden rechtsbündig '${stats.attack2Damage}'` : "")
        + "."
    );
  }
  lines.push("* Untere Werte-Zeile: 'Schwäche' ×2, 'Resistenz' −30, 'Rückzug' (Kosten-Symbole).");
  lines.push("WICHTIG: Es dürfen AUSSCHLIESSLICH die oben genannten Angriffe und Fähigkeiten auf der Karte stehen – keine weiteren, keine doppelten, keine erfundenen.");
  return lines.join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { promptId, holderName, pokemonName, personDescription, referenceImageBase64, referenceImageMimeType, statsAppendix, stats, finalPromptOverride } = body;

    let fotoDescription = personDescription || "";
    let finalPrompt: string;

    if (finalPromptOverride) {
      finalPrompt = finalPromptOverride;
    } else {
      const template = PROMPTS.find((p) => p.id === promptId);
      if (!template) {
        return NextResponse.json({ error: "Prompt nicht gefunden" }, { status: 400 });
      }

      // Step 1: Auto-describe person from reference image (always when photo uploaded).
      // Non-fatal: if the vision step fails, fall back to the manual description
      // (or no description) so image generation is still attempted.
      if (referenceImageBase64) {
        try {
          // gemini-2.0-flash was retired by Google — use a current vision model.
          const visionResult = await ai.models.generateContent({
            model: VISION_MODEL,
            contents: [{
              role: "user",
              parts: [
                { inlineData: { mimeType: referenceImageMimeType || "image/jpeg", data: referenceImageBase64 } },
                { text: `Beschreibe die Person auf diesem Foto in 2-3 Sätzen für eine Anime/TCG-Karten-Illustration. Fokussiere dich auf: Geschlecht, Haarfarbe, Haarstil, Augenfarbe, Hautton, markante Gesichtsmerkmale. Formuliere die Beschreibung so, dass ein Bildgenerator damit die Person erkennen und zeichnen kann. Beispiel: "Eine junge Frau mit langen dunklen Haaren, braunen Augen, heller Haut und einem freundlichen Lächeln." Antworte nur mit der Beschreibung, ohne Erklärungen.` },
              ],
            }],
          });
          const autoDesc = (visionResult.text ?? "").trim();
          if (autoDesc) {
            fotoDescription = personDescription ? `${autoDesc} ${personDescription}` : autoDesc;
          }
        } catch (visionErr) {
          console.error("Vision step failed, continuing without auto-description:", visionErr);
          // fotoDescription stays as the manual personDescription (may be empty)
        }
      }

      // Step 2: Replace placeholders in the template
      let templateText = template.template
        .replace(/\[HOLDER_NAME\]/g, holderName || "")
        .replace(/\[POKEMON_NAME\]/g, pokemonName || "")
        .replace(/\[FOTO_BESCHREIBUNG_DER_PERSON\]/g, fotoDescription);

      // Override HP in the header with the user's value.
      if (stats?.hp) {
        templateText = templateText.replace(/\d{2,3}\s*HP/g, `${stats.hp} HP`);
      }

      // If the user provided their own attacks/ability, REPLACE the template's
      // hardcoded Textfelder section entirely. This is the key fix: previously the
      // template's hardcoded attacks (e.g. 'Blütensturm') stayed in the prompt and
      // the user's attacks were only appended as a note at the end, so the model
      // rendered the template ones. Now the user values take the template's place.
      const hasUserCardData = stats && (stats.attack1Name || stats.attack2Name || stats.abilityName);
      if (hasUserCardData) {
        const newBlock = buildTextfelderBlock(stats);
        // Replace from the "**Textfelder...**" heading up to (but not including) "**Details:".
        const replaced = templateText.replace(/\*\*Textfelder[^\n]*\*\*[\s\S]*?(?=\n\*\*Details:)/, newBlock);
        // If the template had no Textfelder section (e.g. some layouts), append instead.
        templateText = replaced !== templateText ? replaced : `${templateText}\n\n${newBlock}`;
      }

      // Build the final prompt. statsAppendix (type/palette hints) still goes on top
      // as a non-conflicting style hint when present.
      const typeHint = stats?.type && statsAppendix
        ? statsAppendix.replace(
            "WICHTIGE KARTEN-DETAILS (müssen exakt so auf der Karte erscheinen):",
            "STIL-HINWEIS (Typ & Farbpalette):"
          ) + "\n\n---\n\n"
        : "";
      finalPrompt = GLOBAL_STYLE_PREFIX + typeHint + templateText;
    }

    // Step 3: Generate the image.
    // The reference photo is intentionally NOT sent to the image model — only the
    // text description from the vision step is used. Sending the raw photo causes
    // the model to paste the person in photorealistically instead of drawing them
    // in the anime/TCG illustration style.
    const contentParts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
      { text: finalPrompt },
    ];

    // Build the ordered list of image models to try. Start with the configured
    // one, then fall back to other known image-capable model IDs. This makes the
    // route resilient to model IDs being renamed / gated per API key.
    const candidateModels = Array.from(new Set([
      IMAGE_MODEL,
      "gemini-3-pro-image-preview",
      "gemini-3.1-flash-image-preview",
      "gemini-2.5-flash-image",
      "gemini-2.0-flash-preview-image-generation",
    ]));

    const tryGenerate = async (model: string) => {
      const result = await ai.models.generateContent({
        model,
        contents: [{ role: "user", parts: contentParts }],
        config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
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
      return { imageData, imageMimeType, textResponse };
    };

    let imageData: string | null = null;
    let imageMimeType = "image/png";
    let textResponse = "";
    let usedModel = "";
    const modelErrors: Record<string, string> = {};

    for (const model of candidateModels) {
      try {
        const out = await tryGenerate(model);
        textResponse = out.textResponse;
        if (out.imageData) {
          imageData = out.imageData;
          imageMimeType = out.imageMimeType;
          usedModel = model;
          break;
        }
        // No image but model responded (content filter) — stop trying others.
        usedModel = model;
        break;
      } catch (e: any) {
        const msg = e?.message || String(e);
        modelErrors[model] = msg;
        // Only fall through to the next candidate on availability errors.
        if (!/not found|NOT_FOUND|404|not supported|PERMISSION|403/i.test(msg)) {
          throw e;
        }
      }
    }

    if (!imageData) {
      // If every model was unavailable, ask the key what it actually offers.
      if (Object.keys(modelErrors).length === candidateModels.length) {
        let available: string[] = [];
        try {
          const pager = await ai.models.list({ config: { queryBase: true } });
          for await (const m of pager) {
            const name = (m.name ?? "").replace(/^models\//, "");
            const actions = m.supportedActions ?? [];
            if (name.includes("image") || actions.includes("predict")) available.push(name);
          }
        } catch { /* listing may also be denied */ }
        return NextResponse.json(
          {
            error: available.length
              ? `Keines der getesteten Bild-Modelle ist für diesen API-Key freigeschaltet. Verfügbare Bild-Modelle für deinen Key: ${available.join(", ")}. Setze GEMINI_IMAGE_MODEL auf eines davon.`
              : `Dieser API-Key hat KEINEN Zugriff auf Bild-Generierungs-Modelle. Das ist meist ein Region-/Billing-Problem: In Google AI Studio muss für das Projekt die Abrechnung aktiviert sein, oder Bild-Generierung ist in deiner Region (EU) nur mit Billing verfügbar.`,
            details: JSON.stringify(modelErrors),
            availableImageModels: available,
          },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Kein Bild generiert. Möglicherweise hat der Content-Filter angesprochen. Versuche es ohne Referenzbild oder ändere den Pokémon-Namen.", details: textResponse },
        { status: 422 }
      );
    }

    return NextResponse.json({
      imageBase64: imageData,
      mimeType: imageMimeType,
      personDescription: fotoDescription,
      usedModel,
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
