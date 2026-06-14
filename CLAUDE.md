@AGENTS.md

## 🚦 Regeln für KI-Sessions (immer befolgen)
Kevin ist Endnutzer mit ADHS und will keine Deployment-Überraschungen. Für JEDE Session (lokal wie Cloud):

1. **Zuerst diese CLAUDE.md + START-HIER.md lesen.**
2. **Direkt auf `main` arbeiten.** Push nach `main` = live/produktiv. **KEINE Preview-Branches oder Pull Requests** erstellen, außer Kevin fragt ausdrücklich danach.
3. **Deployment:** Push nach `main` → Vercel baut automatisch live. Datenbank: Supabase-Projekt „Pokemon Picture Builder".
4. **Dauerhaftes Wissen hierher schreiben:** Wenn Kevin etwas erklärt, das künftig gelten soll, in diese CLAUDE.md aufnehmen – nicht nur im Chat lassen.
5. **Einfache Sprache, keine unnötigen Fachbegriffe.**

---

# Pokémon Picture Builder – Projektkontext

**Was ist das?** Eine Web-App (Next.js auf Vercel), die aus einem hochgeladenen Foto eine
Pokémon-artige Sammelkarte im Anime-Stil generiert: Nutzer wählt ein Design, lädt ein Foto
hoch → Gemini erzeugt die Karte. Die Ergebnisse landen in einer eigenen Supabase-DB.

> ⚠️ Trotz „MRC"/„My rookie card" in manchen Namen ist das ein **eigenständiges** Projekt mit
> **eigener** Supabase-DB (`csmxozlcpuuzqlprgdps`) – nicht mit der Fußball-Website vermischen.

---

## Wichtige Debugging-Historie

### Kritischer Fehler: "Bild-Modell nicht verfügbar" (War NICHT das Bildmodell!)

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

## Supabase / Bildspeicherung (IMPLEMENTIERT)

**Eigenes Projekt** "Pokemon Picture Builder" (`csmxozlcpuuzqlprgdps`, eu-west-1) –
GETRENNT vom Fußball-Business-Projekt "My rookie card v2". Nicht vermischen!
- Bucket `mrc-cards` (public), Tabelle `mrc_generated_cards`.
- **Upload läuft SERVER-SEITIG** in `route.ts` via `SUPABASE_SERVICE_ROLE_KEY`
  (NICHT `NEXT_PUBLIC_`). Grund: neue Supabase-Projekte blocken direkten
  Browser-Zugriff per Anon-Key ("Host not in allowlist" / 403). Der service_role
  Key umgeht das und bleibt server-seitig.
- `route.ts` gibt `supabaseUrl` in der JSON-Antwort zurück → Galerie zeigt ☁.
- Vercel Env-Vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  (für evtl. Lesen), `SUPABASE_SERVICE_ROLE_KEY` (für Upload).

---

## Karten-Mechaniken (WICHTIG)

- **KP statt HP:** Deutsche Karten nutzen "KP" (Kraftpunkte), nicht "HP".
  `route.ts` konvertiert automatisch jedes "XXX HP" → "XXX KP".
- **Mit/ohne Pokémon pro Design:** UI-Toggle `withPokemon`. JEDES Design kann
  mit Begleit-Pokémon ODER Person solo (im Pokémon-Stil mit KP/Angriffen)
  generiert werden. `applyPokemonMode()` in `route.ts`:
  - Marker `[[POKE:…]]` = nur MIT Pokémon, `[[SOLO:…]]` = nur ohne.
  - Templates ohne Marker: Fallback-Regex strippt "& [POKEMON_NAME]" etc.
  - Solo-Modus hängt starke "Person allein"-Anweisung an.
- **Premium-Designs (id 43–46):** Kategorie "Premium Alt-Art ⭐", basierend auf
  Recherche zu echten SIR/IR/Tera-Karten (full-bleed, cinematisch, Stimmung).
- **GLOBAL_STYLE_PREFIX Regeln** in `route.ts`: 1 Anime-Stil, 2 Texte, 3 Icons,
  4 dt. Begriffe, 5 Fähigkeit-Box, 6 transparenter Kopf, 7 max 3 Sterne,
  8 KP statt HP, 9 cinematische Full-Art-Komposition, 10 Silber-Rahmen.

---

## Tech Stack

- Next.js App Router + TypeScript + Tailwind CSS
- `@google/genai` v2.8.0 — `GoogleGenAI`, `ai.models.generateContent()`, `Modality.IMAGE`
- Vercel Deployment, Branch: **`main`** (nur `main` = produktiv; kein Preview-Branch mehr — der alte `claude/zen-…`-Branch wurde am 14.06.2026 bereinigt)
- Einzige API-Route: `src/app/api/generate/route.ts`. Env-Vars (Vercel): `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`; optional `GEMINI_IMAGE_MODEL` / `GEMINI_VISION_MODEL` zum Übersteuern.
- `GEMINI_API_KEY` in Vercel Env Vars (bezahltes Google AI Studio Konto)
