@AGENTS.md

# My Rookie Card – Wichtige Debugging-Historie

## Kritischer Fehler: "Bild-Modell nicht verfügbar" (War NICHT das Bildmodell!)

**Was passierte:** Stundenlanger Fehler-Loop, bei dem scheinbar das Bild-Generierungsmodell nicht verfügbar war.

**Echte Ursache:** `gemini-2.0-flash` (das VISION-Modell für Foto-Beschreibungen) wurde von Google **eingestellt (retired)**. Der Fehler wurde an der falschen Stelle gecatcht und als "Bild-Modell nicht verfügbar" angezeigt.

**Fix:** Vision-Modell auf `gemini-2.5-flash` geändert + Vision-Step in `try/catch` gewickelt (non-fatal).

**Lesson learned:** Bei "Bild-Modell"-Fehlern ZUERST das VISION-Modell prüfen (`VISION_MODEL` in `route.ts`), nicht nur `IMAGE_MODEL`. Vercel-Logs zeigen den echten Modellnamen.

**Aktuelle Modelle** (in `src/app/api/generate/route.ts`):
- `IMAGE_MODEL` = `gemini-3-pro-image-preview` (Fallback-Chain zu älteren Modellen)
- `VISION_MODEL` = `gemini-2.5-flash`
- Kein `GEMINI_IMAGE_MODEL` Env-Var in Vercel gesetzt → Code-Default wird genutzt

---

## Architektur: Referenzfoto-Flow

```
Foto hochladen
  → Vision-Modell (gemini-2.5-flash): generiert Textbeschreibung der Person
  → Text ersetzt [FOTO_BESCHREIBUNG_DER_PERSON] im Prompt
  → Bildmodell bekommt: Textprompt + (optional) das Foto direkt
```

**AKTUELL (experimentell):** Das Foto wird ZUSÄTZLICH zur Textbeschreibung ans Bildmodell geschickt.
- Vorteil: Bessere Ähnlichkeit
- Risiko: Modell könnte Person fotorealistisch statt im Anime-Stil zeichnen
- Der `GLOBAL_STYLE_PREFIX` hat verstärkte Anime-Stil-Regeln um das zu verhindern
- **Revert:** In `route.ts` die `referenceImageBase64`-Zeile in `contentParts` auskommentieren

**FRÜHER (sicher, aber generisch):** Foto wurde nur für Textbeschreibung genutzt, NICHT ans Bildmodell geschickt.
- Ergebnis: Person sieht aus wie "irgendein Anime-Junge/-Mädchen", keine echte Ähnlichkeit
- Revert: `contentParts` auf nur `[{ text: finalPrompt }]` reduzieren

---

## Supabase / Bildspeicherung

Noch nicht implementiert. Plan:
- JPEG 85% für Supabase-Storage (Cloud-Backup, geräteübergreifend)
- JPEG 90% für "Druck"-Download
- JPEG 80% für "Web/Teilen"-Download
- PNG wird von Gemini geliefert, Browser-Canvas konvertiert zu JPEG

---

## Tech Stack

- Next.js App Router + TypeScript + Tailwind CSS
- `@google/genai` v2.8.0 — `GoogleGenAI`, `ai.models.generateContent()`, `Modality.IMAGE`
- Vercel Deployment, Branch: `claude/zen-babbage-42g1C` + `main`
- `GEMINI_API_KEY` in Vercel Env Vars (bezahltes Google AI Studio Konto)
