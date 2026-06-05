export interface PromptTemplate {
  id: number;
  name: string;
  subtitle: string;
  category: string;
  hasPokemon: boolean;
  icon: string;
  color: string;
  template: string;
}

export const CATEGORIES = [
  "Neue Kunststile",
  "Epische Action-Szenen",
  "Klassische Trainer-Karten",
  "Ultra Rare Trainer",
  "Holo-Vinyl Spezial",
  "Rückseite",
];

export const PROMPTS: PromptTemplate[] = [
  // ── TEIL 1: NEUE KUNSTSTILE ──────────────────────────────────────────────
  {
    id: 16,
    name: "Pop-Art Vektor (MIT Pokémon)",
    subtitle: "Glumanda-Stil / Flächig & Bunt",
    category: "Neue Kunststile",
    hasPokemon: true,
    icon: "🎨",
    color: "from-pink-500 to-yellow-400",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Flacher, Vektor-basierter Pop-Art-Stil. Keine weichen Schattierungen, sondern klare, vollflächige Farben, dicke Outlines und geometrische Formen. Sehr grafisch, bunt und fröhlich, ähnlich einem modernen Retro-Game-Poster.

**Header-Bereich (Kartenkopf):**
* Oben Links: Kleines goldenes Banner mit dem Text 'BASIS'.
* Titel daneben: '[HOLDER_NAME] & [POKEMON_NAME]' (groß, fett, schwarz, serifenlos).
* Oben Rechts: '80 HP' (groß, rot), gefolgt von einem Element-Symbol.

**Haupt-Artwork:**
Eine extrem stilisierte, grafische Illustration. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person und ihr Partner-[POKEMON_NAME] springen fröhlich zusammen in die Luft. Der Hintergrund besteht aus bunten, geometrischen Blöcken, Treppenstufen und grafischen Mustern.

**Textfelder (Unteres Drittel):**
* Angriff 1: [Energie-Symbol] 'Bunter Funke' (fett, schwarz), rechtsbündig '30'. Text: 'Lege 1 Energiekarte von diesem Pokémon ab.'
* Werte unten: Schwäche (Symbol x2), Resistenz (Symbol -30), Rückzug (1 Stern).

**Details:** Unten links 'Illustr. VectorStudio', Set-Infos 'MRC-PROMO 01'. Copyright: '© My Rookie Card'.`,
  },
  {
    id: 17,
    name: "Pop-Art Vektor (OHNE Pokémon)",
    subtitle: "Glumanda-Stil / Unterstützer",
    category: "Neue Kunststile",
    hasPokemon: false,
    icon: "🖼️",
    color: "from-pink-500 to-yellow-400",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Flacher, Vektor-basierter Pop-Art-Stil. Keine weichen Schattierungen, sondern klare, vollflächige Farben, dicke Outlines und geometrische Formen. Sehr grafisch, bunt und fröhlich.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv, sportlich).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Farbenwelt' (groß, fett, schwarz, serifenlos).

**Haupt-Artwork:**
Eine extrem stilisierte, grafische Illustration. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person nimmt eine dynamische Pose ein, umgeben von flachen, bunten geometrischen Objekten und stilisierten Alltagsgegenständen.

**Textfelder:**
* Zentraler Regeltext: 'Ziehe 3 Karten. Wenn du mindestens 1 Basis-Pokémon gezogen hast, mische deine Handkarten neu.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. VectorStudio', Set-Infos 'MRC-PROMO 02'. Copyright: '© My Rookie Card'.`,
  },
  {
    id: 18,
    name: "Doodle Outline-Stil (MIT Pokémon)",
    subtitle: "Mauzi-Stil / Cartoon & Graffiti",
    category: "Neue Kunststile",
    hasPokemon: true,
    icon: "✏️",
    color: "from-green-400 to-cyan-400",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Wilder, graffiti-ähnlicher Doodle-Stil mit extrem dicken, markanten schwarzen Outlines. Sehr farbenfroh. Der Hintergrund ist komplett vollgepackt mit chaotischen, aber niedlichen Mustern, Sternen, Kreisen und abstrakten Symbolen.

**Header-Bereich (Kartenkopf):**
* Oben Links: Kleines silbernes Banner mit dem Text 'BASIS'.
* Titel daneben: '[HOLDER_NAME] & [POKEMON_NAME] ex' (groß, fett, schwarz, mit glänzendem "ex" Symbol).
* Oben Rechts: '170 HP' (groß, schwarz), gefolgt von einem Element-Symbol.

**Haupt-Artwork:**
Eine übertrieben coole und verspielte Illustration mit fetten Linien. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person und ihr [POKEMON_NAME] geben sich ein High-Five oder machen eine witzige Pose. Der Hintergrund ist ein farbenfrohes Chaos aus Doodle-Kunst (Sterne, Blitze, Blumenmuster).

**Textfelder (Unteres Drittel, roter/gelber Hintergrund):**
* Fähigkeit (Rotes Banner): 'Fähigkeit: Letzter Ausweg' Text: 'Einmal während deines Zuges kannst du dein Deck nach einer Unterstützerkarte durchsuchen.'
* Angriff: [Drei Energie-Symbole] 'Doodle-Schlag' (fett, schwarz), rechtsbündig '60'.
* Werte unten: Schwäche (Symbol x2), Resistenz (Symbol -30), Rückzug (1 Stern).

**Details:** Unten links 'Illustr. DoodleArt', Set-Infos 'MRC-PROMO 03'. Copyright: '© My Rookie Card'.`,
  },
  {
    id: 19,
    name: "Doodle Outline-Stil (OHNE Pokémon)",
    subtitle: "Mauzi-Stil / Unterstützer",
    category: "Neue Kunststile",
    hasPokemon: false,
    icon: "🖊️",
    color: "from-green-400 to-cyan-400",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Wilder, graffiti-ähnlicher Doodle-Stil mit extrem dicken, markanten schwarzen Outlines. Sehr farbenfroh. Der Hintergrund ist komplett vollgepackt mit chaotischen, aber niedlichen Mustern, Sternen und Symbolen.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv, sportlich).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Kreativität' (groß, fett, schwarz, serifenlos).

**Haupt-Artwork:**
Eine coole, verspielte Illustration mit fetten Linien. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person zwinkert lässig und zeigt mit dem Finger Richtung Kamera. Der Hintergrund ist ein farbenfrohes Graffiti-Doodle-Muster.

**Textfelder:**
* Zentraler Regeltext: 'Wirf 2 Münzen. Für jeden Kopf kannst du eine Karte vom Ablagestapel auf deine Hand nehmen.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. DoodleArt', Set-Infos 'MRC-PROMO 04'. Copyright: '© My Rookie Card'.`,
  },
  {
    id: 20,
    name: "Neon Cyber Shatter (MIT Pokémon)",
    subtitle: "Zygarde-Stil / Intense Energy",
    category: "Neue Kunststile",
    hasPokemon: true,
    icon: "⚡",
    color: "from-cyan-400 to-fuchsia-500",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Extrem übertriebenes, leuchtendes Cyber-Neon-Artwork. Sehr hohe Kontraste (viel Schwarz gepaart mit grellem Magenta, Cyan und Neongrün). Splitternde Glas-Effekte, massive Energiestrahlen und eine gewaltige, fast überwältigende Aura.

**Header-Bereich (Kartenkopf):**
* Oben Links: Kleines silbernes Banner mit dem Text 'MEGA'.
* Titel daneben: 'Mega [POKEMON_NAME] & [HOLDER_NAME]' (groß, fett, leuchtend).
* Oben Rechts: '310 HP' (groß, rot), gefolgt von einem Element-Symbol.

**Haupt-Artwork:**
Eine monumentale, strahlende Action-Illustration. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person steht epischen Ausmaßes direkt neben dem hochpowerten, massiven [POKEMON_NAME]. Beide sind von einer gewaltigen, geometrischen Neon-Aura (Magenta/Cyan) umhüllt. Der Hintergrund zersplittert in abstrakte, digitale Fragmente und Lichtstrahlen.

**Textfelder (Unteres Drittel, leuchtender Hintergrund):**
* Angriff 1: [Drei Energie-Symbole] 'Cyber-Welle' (fett, schwarz), rechtsbündig '200'. Text: 'Während des nächsten Zuges deines Gegners erleidet dieses Pokémon 30 Schadenspunkte weniger.'
* Angriff 2: [Fünf Energie-Symbole] 'Nullifizierungs-Strahl' (fett, schwarz). Text: 'Wirf eine Münze. Bei Kopf fügt dieser Angriff jedem Pokémon des Gegners 150 Schaden zu.'
* Werte unten: Schwäche (Symbol x2), Resistenz (Symbol -30), Rückzug (3 Sterne).

**Details:** Unten links 'Illustr. CyberShatter', Set-Infos 'MRC-PROMO 05'. Copyright: '© My Rookie Card'.`,
  },
  {
    id: 21,
    name: "Neon Cyber Shatter (OHNE Pokémon)",
    subtitle: "Zygarde-Stil / Unterstützer",
    category: "Neue Kunststile",
    hasPokemon: false,
    icon: "🌐",
    color: "from-cyan-400 to-fuchsia-500",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Extrem übertriebenes, leuchtendes Cyber-Neon-Artwork. Sehr hohe Kontraste (viel Schwarz gepaart mit grellem Magenta, Cyan und Neongrün). Splitternde Glas-Effekte, massive Energiestrahlen und eine gewaltige Aura.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv, sportlich).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Überladung' (groß, fett, schwarz, serifenlos).

**Haupt-Artwork:**
Eine monumentale, strahlende Illustration. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person steht in einer extrem kraftvollen Pose. Sie ist von einer massiven, geometrischen Neon-Aura (Magenta/Cyan) umhüllt. Energie blitzt aus dem Boden auf, und der Hintergrund zersplittert in digitale Licht-Fragmente.

**Textfelder:**
* Zentraler Regeltext: 'Lege alle Energiekarten aus deiner Hand an deine Pokémon im Spiel an, wie es dir gefällt. Dein Zug endet danach sofort.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. CyberShatter', Set-Infos 'MRC-PROMO 06'. Copyright: '© My Rookie Card'.`,
  },

  // ── TEIL 3: EPISCHE ACTION-SZENEN ────────────────────────────────────────
  {
    id: 11,
    name: "Elementar-Schnitt / Doppel-Attacke",
    subtitle: "TCG Full-Art SIR Stil",
    category: "Epische Action-Szenen",
    hasPokemon: true,
    icon: "⚔️",
    color: "from-orange-500 to-red-500",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Authentischer TCG Full-Art Special Illustration Rare (SIR) Stil. Dynamische Anime-Kampf-Illustration mit ultra-scharfen Konturen.

**Header-Bereich (Kartenkopf):**
* Oben Links: Kleines goldenes Banner mit dem Text 'BASIS'.
* Titel daneben: '[HOLDER_NAME] & [POKEMON_NAME]' (groß, fett, schwarz, serifenlose Schrift).
* Oben Rechts: '150 HP' (rot), gefolgt von einem Element-Symbol.

**Haupt-Artwork:**
Epische Action-Szene (Weitwinkel). WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person und ihr Partner-[POKEMON_NAME] vollführen einen mächtigen Angriff. Person nutzt Energiewaffe, Pokémon entfesselt Elementar-Explosion. Boden splittert, grelle Blitze.

**Textfelder:**
* Angriff 1: [Energie-Symbol] 'Synchron-Schlag' (fett, schwarz), rechtsbündig '50'. Text: 'Fügt 30 Schadenspunkte mehr zu, wenn dieses Pokémon in diesem Zug eingewechselt wurde.'
* Angriff 2: [Zwei Energie-Symbole] 'Krasse Elementar-Zerstörung' (fett, schwarz), rechtsbündig '120'.
* Werte unten: Schwäche (Symbol x2), Resistenz (Symbol -30), Rückzugskosten (2 Sterne).

**Details:** Unten links 'Illustr. MyRookieCard Studio', Set-Infos 'MRC-ACT 01/05 ★★★★'. Copyright: '© My Rookie Card'.`,
  },
  {
    id: 12,
    name: "Kosmischer Overdrive / Hyper-Modus",
    subtitle: "TCG Hyper-Rare Stil",
    category: "Epische Action-Szenen",
    hasPokemon: true,
    icon: "🌌",
    color: "from-indigo-500 to-purple-600",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Authentischer TCG Hyper-Rare-Stil. Ultimatives, leuchtendes Anime-Artwork mit extremen Kontrasten, Sternenstaub-Effekte.

**Header-Bereich:**
* Oben Links: Kleines goldenes Banner mit dem Text 'TAG TEAM'.
* Titel: '[HOLDER_NAME] & [POKEMON_NAME]' (groß, fett, schwarz).
* Oben Rechts: '180 HP' (rot), gefolgt von einem Element-Symbol.

**Haupt-Artwork:**
Monumentale Science-Fiction Szene im Weltraum. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person und [POKEMON_NAME] schweben schwerelos in einer Galaxie, umgeben von Neon-Aura. Person schießt Energiestrahl. Asteroid explodiert.

**Textfelder:**
* Angriff 1: [Zwei Energie-Symbole] 'Hyper-Strahler' (fett, schwarz), rechtsbündig '90'.
* Angriff 2: [Drei Energie-Symbole] 'Galaktischer Overdrive-Stoß' (fett, schwarz), rechts '160'. Text: 'Lege alle Energiekarten von diesem Pokémon ab.'
* Werte unten: Schwäche (Symbol x2), Resistenz (Symbol -30), Rückzug (3 Sterne).

**Details:** Unten links 'Illustr. CosmicMRC', Set-Infos 'MRC-ACT 02/05 ★★★★'. Copyright: '© My Rookie Card'.`,
  },
  {
    id: 13,
    name: "Titanen-Erwachen / Urzeit-Beschwörung",
    subtitle: "TCG Full-Art Stil",
    category: "Epische Action-Szenen",
    hasPokemon: true,
    icon: "🏔️",
    color: "from-amber-600 to-orange-700",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Authentischer TCG Full-Art Stil. Epische Anime-Illustration, Fokus auf Größenunterschiede, God Rays.

**Header-Bereich:**
* Oben Links: Kleines goldenes Banner mit dem Text 'PHASE 1'.
* Titel: '[HOLDER_NAME]s [POKEMON_NAME]' (groß, fett, schwarz).
* Oben Rechts: '160 HP' (rot), gefolgt von Energie-Symbol.

**Haupt-Artwork:**
Atemberaubende Szene auf einem stürmischen Berg. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person steht furchtlos im Vordergrund, hinter ihr wächst das [POKEMON_NAME] zu titanenhafter Größe heran. Wirbelstürme, Magma, Lichtstrahl durch Wolken.

**Textfelder:**
* Angriff 1: [Energie-Symbol] 'Urzeitlicher Ruf' (fett, schwarz). Text: 'Durchsuche dein Deck nach einer Item-Karte und nimm sie auf die Hand.'
* Angriff 2: [Drei Energie-Symbole] 'Zorn der Titanen' (fett, schwarz), rechtsbündig '140'.
* Werte unten: Schwäche (Symbol x2), Resistenz (Symbol -30), Rückzug (3 Sterne).

**Details:** Unten links 'Illustr. TitanForge MRC', Set-Infos 'MRC-ACT 03/05 ★★★★'. Copyright: '© My Rookie Card'.`,
  },
  {
    id: 14,
    name: "Überschall-Sturzflug / Extrem-Racer",
    subtitle: "High-Speed TCG Anime-Stil",
    category: "Epische Action-Szenen",
    hasPokemon: true,
    icon: "🚀",
    color: "from-sky-400 to-blue-600",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** High-Speed TCG Anime-Stil. Extreme Dynamik durch Speedlines, Motion Blur.

**Header-Bereich:**
* Oben Links: Kleines goldenes Banner mit dem Text 'BASIS'.
* Titel: '[HOLDER_NAME] & [POKEMON_NAME]' (groß, fett, schwarz).
* Oben Rechts: '130 HP' (rot), gefolgt von Wind/Elektro-Symbol.

**Haupt-Artwork:**
Action-Szene in der Luft. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person reitet auf dem Rücken ihres [POKEMON_NAME] (oder bewegt sich mit extremer Geschwindigkeit daneben). Senkrechter Sturzflug durch Wolkenkratzer, Speedlines.

**Textfelder:**
* Angriff 1: [Energie-Symbol] 'Schallmauer-Durchbruch' (fett, schwarz), rechtsbündig '40'. Text: 'Dieses Pokémon kann im nächsten Zug nicht angegriffen werden.'
* Angriff 2: [Zwei Energie-Symbole] 'Überschall-Sturm-Anschlag' (fett, schwarz), rechtsbündig '100'.
* Werte unten: Schwäche (Symbol x2), Resistenz (Symbol -30), Rückzug (1 Stern).

**Details:** Unten links 'Illustr. VelocityMRC', Set-Infos 'MRC-ACT 04/05 ★★★★'. Copyright: '© My Rookie Card'.`,
  },
  {
    id: 15,
    name: "Tiefsee-Abgrund / Der Mahlstrom",
    subtitle: "Premium TCG Secret-Rare-Stil",
    category: "Epische Action-Szenen",
    hasPokemon: true,
    icon: "🌊",
    color: "from-teal-500 to-blue-700",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Premium TCG Secret-Rare-Stil. Unterwasser-Illustration mit Caustics, tiefen Blautönen und biolumineszenten Effekten.

**Header-Bereich:**
* Oben Links: Kleines goldenes Banner mit dem Text 'BASIS'.
* Titel: '[HOLDER_NAME] & [POKEMON_NAME]' (groß, fett, schwarz).
* Oben Rechts: '140 HP' (rot), gefolgt von Wasser/Drachen-Symbol.

**Haupt-Artwork:**
Epische Unterwasser-Kampfszene. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person und [POKEMON_NAME] im Zentrum eines wirbelnden Unterwasser-Mahlstroms. Glühende Korallen, antike Ruinen, Luftblasen.

**Textfelder:**
* Angriff 1: [Energie-Symbol] 'Tiefsee-Sog' (fett, schwarz). Text: 'Tausche das aktive Pokémon deines Gegners gegen 1 Pokémon von seiner Bank aus.'
* Angriff 2: [Drei Energie-Symbole] 'Abyssale Ozean-Explosion' (fett, schwarz), rechtsbündig '130'.
* Werte unten: Schwäche (Symbol x2), Resistenz (Symbol -30), Rückzug (2 Sterne).

**Details:** Unten links 'Illustr. AbyssalMRC', Set-Infos 'MRC-ACT 05/05 ★★★★'. Copyright: '© My Rookie Card'.`,
  },

  // ── TEIL 4: KLASSISCHE TRAINER-KARTEN ────────────────────────────────────
  {
    id: 1,
    name: "Der Eiscreme-Klassiker",
    subtitle: "Japanischer TCG Full-Art Stil",
    category: "Klassische Trainer-Karten",
    hasPokemon: false,
    icon: "🍦",
    color: "from-rose-400 to-pink-500",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Authentischer japanischer TCG Full-Art-Stil. Anime-Illustration mit klaren Konturen, lebendigem Cel-Shading.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv, sportlich).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Ermutigung' (groß, fett, schwarz).

**Haupt-Artwork:**
Detaillierte Anime-Illustration. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Festlicher Hintergrund mit Ballons. Person isst aufwendiges Eiscreme-Dessert (KEIN Pokémon-Maskottchen).

**Textfelder:**
* Zentraler Regeltext: 'Du kannst diese Karte nur einsetzen, wenn du mehr verbleibende Preiskarten hast als dein Gegner. Lege bis zu 2 Basis-Energiekarten aus deinem Ablagestapel an 1 deiner Phase-2-Pokémon an.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. Iori Suzuki', 'J POR DE 123/088'. Copyright: '© My Rookie Card'.`,
  },
  {
    id: 2,
    name: "Die Rookie Card (Stadion)",
    subtitle: "Anime-Illustration im Fußballstadion",
    category: "Klassische Trainer-Karten",
    hasPokemon: false,
    icon: "⚽",
    color: "from-green-500 to-emerald-600",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Authentischer TCG Full-Art-Stil. Anime-Illustration mit klaren Konturen, kräftigen Farben.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Rookiekarten-Erfolg' (groß, fett, schwarz).

**Haupt-Artwork:**
Dynamische Anime-Illustration. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person trägt sportliches Trikot im Zentrum eines Fußballstadions unter Flutlicht.

**Textfelder:**
* Zentraler Regeltext: 'Spezialfähigkeit: Spielmacher. [HOLDER_NAME] bringt sofortige Energie auf das Feld. Wenn diese Karte gespielt wird, ziehe 2 zusätzliche Karten.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. DynamicArts', Set-Infos 'RC-Edition 01/99'. Copyright: '© My Rookie Card'.`,
  },
  {
    id: 3,
    name: "Der E-Sports Champion",
    subtitle: "Gaming-Anime mit Neon-Akzenten",
    category: "Klassische Trainer-Karten",
    hasPokemon: false,
    icon: "🎮",
    color: "from-violet-500 to-purple-600",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Authentischer TCG Full-Art-Stil. Anime-Illustration mit kräftigem Cel-Shading, leuchtenden Farbakzenten.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Champion-Override' (groß, fett, schwarz).

**Haupt-Artwork:**
Fokussierte Anime-Illustration. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person mit Gaming-Headset/Controller. Setup mit LED-Lichtern in Magenta und Cyan.

**Textfelder:**
* Zentraler Regeltext: 'System-Override: [HOLDER_NAME] kann diese Karte nutzen, um einen gegnerischen Zug zu blockieren. Lege 1 Energiekarte ab, um den Effekt zu aktivieren.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. NeoPixel', Set-Infos 'CYBER-GEN 10/150'. Copyright: '© My Rookie Card'.`,
  },
  {
    id: 4,
    name: "Der Meister-Tüftler",
    subtitle: "Warme Anime-Werkstatt-Illustration",
    category: "Klassische Trainer-Karten",
    hasPokemon: false,
    icon: "🔧",
    color: "from-yellow-500 to-amber-600",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Authentischer TCG Full-Art-Stil. Warme Anime-Illustration mit detailreicher Ausarbeitung.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Meister-Werkstatt' (groß, fett, schwarz).

**Haupt-Artwork:**
Fröhliche Anime-Illustration. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person an Werkbank präsentiert 3D-Modell in heller Werkstatt.

**Textfelder:**
* Zentraler Regeltext: 'Du kannst diese Karte nur spielen, wenn du etwas Neues aufbauen willst. [HOLDER_NAME] erlaubt es dir, dein Deck nach einer beliebigen Item-Karte zu durchsuchen und sie auf die Hand zu nehmen.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. Creator Guild', Set-Infos 'BUILD-IT 07/88'. Copyright: '© My Rookie Card'.`,
  },

  // ── TEIL 5: ULTRA RARE TRAINER ────────────────────────────────────────────
  {
    id: 5,
    name: "Elementar-Ausbruch (Secret Rare)",
    subtitle: "Hochemotionale Anime-Kampf-Illustration",
    category: "Ultra Rare Trainer",
    hasPokemon: false,
    icon: "🔥",
    color: "from-red-500 to-orange-600",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Secret Rare TCG Full-Art-Stil. Hochemotionale Anime-Kampf-Illustration.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Elementar-Zorn' (groß, fett, schwarz).

**Haupt-Artwork:**
Epische Anime-Illustration (Froschperspektive). WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person in kraftvoller Pose, umgeben von feurigen Funken/Blitzen.

**Textfelder:**
* Zentraler Regeltext: 'Absoluter Fokus: Wenn diese Karte gespielt wird, verdopple die Angriffsenergie deines aktiven Pokémons in diesem Zug. [HOLDER_NAME] schützt dein Team vor jeglichem Schaden.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. UltimateStudio', Set-Infos 'SECRET-ELM 99/088 ★★★'. Copyright: '© My Rookie Card'.`,
  },
  {
    id: 6,
    name: "Kosmischer Overdrive (Hyper Rare)",
    subtitle: "Leuchtendes Anime mit Regenbogen-Farbverläufen",
    category: "Ultra Rare Trainer",
    hasPokemon: false,
    icon: "🌠",
    color: "from-purple-500 to-pink-500",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Hyper Rare TCG Full-Art-Stil. Leuchtendes Anime-Artwork mit Regenbogen-Farbverläufen.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: 'KOSMISCHER OVERDRIVE: [HOLDER_NAME]' (groß, fett, schwarz).

**Haupt-Artwork:**
Kinoreife Anime-Illustration. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person schwebt schwerelos im Weltraum, schießt kosmische Energiestrahlen. Galaxie-Hintergrund in Magenta und Cyan.

**Textfelder:**
* Zentraler Regeltext: 'Galaktische Präsenz: Durchbrich alle Barrieren. Durchsuche dein gesamtes Deck nach bis zu 3 beliebigen Karten und nimm sie sofort auf die Hand. Mische dein Deck danach.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. InfinityArt', Set-Infos 'COSMIC-HR 100/088 ★★★'. Copyright: '© My Rookie Card'.`,
  },
  {
    id: 7,
    name: "Phönix-Erwachen (Rainbow Rare)",
    subtitle: "Pastell- und Regenbogenfarben",
    category: "Ultra Rare Trainer",
    hasPokemon: false,
    icon: "🌈",
    color: "from-rose-400 via-purple-400 to-cyan-400",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Rainbow Rare TCG Full-Art-Stil. Gesamte Karte besteht aus Pastell- und Regenbogenfarben.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Phönix-Erwachen' (groß, fett, schwarz).

**Haupt-Artwork:**
Actiongeladene Anime-Illustration. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person stürmt nach vorne. Hinter ihr entfalten sich riesige Anime-Flügel aus Licht und Spektralfarben.

**Textfelder:**
* Zentraler Regeltext: 'Unendliche Wiedergeburt: Heile allen Schaden von all deinen Pokémon im Spiel. Lege diese Karte nicht auf den Ablagestapel, sondern mische sie zurück in dein Deck.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. PhoenixStudio', 'RAINBOW-LEGEND 120/088 ★★★★'. Copyright: '© My Rookie Card'.`,
  },

  // ── TEIL 6: HOLO-VINYL SPEZIAL ────────────────────────────────────────────
  {
    id: 8,
    name: "Neon Cyber Wave",
    subtitle: "Synthwave / Dunkles Tokyo bei Nacht",
    category: "Holo-Vinyl Spezial",
    hasPokemon: false,
    icon: "🌃",
    color: "from-cyan-500 to-blue-600",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Moderner TCG Full-Art-Stil. Ultra-scharfe schwarze Outlines, max Farbsättigung.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Cyber-Netzwerk' (groß, fett, schwarz).

**Haupt-Artwork:**
Coole Anime-Illustration im Synthwave-Stil. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person blickt selbstbewusst nach vorne, umgeben von Neon-Linien, Hologramm-Displays (Elektro-Pink, Cyan). Dunkles Tokyo bei Nacht.

**Textfelder:**
* Zentraler Regeltext: 'Daten-Übertragung: Ziehe Karten, bis du 6 Karten auf der Hand hast. Dein Gegner muss in seinem nächsten Zug 1 Energiekarte von seinem aktiven Pokémon ablegen.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. CyberTCG Lab', Set-Infos 'NEON-WAVE 88/088 ★★★'. Copyright: '© My Rookie Card'.`,
  },
  {
    id: 9,
    name: "Prismatischer Splitter-Sturm",
    subtitle: "Explosive Kristall-Anime-Illustration",
    category: "Holo-Vinyl Spezial",
    hasPokemon: false,
    icon: "💎",
    color: "from-sky-400 to-indigo-500",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** High-End TCG Spezial-Stil. Explosive Anime-Illustration mit geometrischen Formen.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Prisma-Barriere' (groß, fett, schwarz).

**Haupt-Artwork:**
Hochexplosive Action Anime-Illustration. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person steht in einer Abwehrpose, Barriere aus transparenten Kristallsplittern zerspringt.

**Textfelder:**
* Zentraler Regeltext: 'Prismatischer Schutz: Verhindere alle Effekte von Angriffen, einschließlich Schaden, die den Pokémon deines Teams im nächsten Zug des Gegners zugefügt werden.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. CrystalStudio', Set-Infos 'PRISM-STORM 77/077 ★★★★'. Copyright: '© My Rookie Card'.`,
  },
  {
    id: 10,
    name: "Chroma-Explosion",
    subtitle: "Street-Art meets TCG-Anime",
    category: "Holo-Vinyl Spezial",
    hasPokemon: false,
    icon: "🎆",
    color: "from-yellow-400 to-red-500",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Street-Art meets TCG-Anime. Splash-Art mit Graffiti-Outlines.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Chroma-Angriff' (groß, fett, schwarz).

**Haupt-Artwork:**
Extrem farbenfrohe Anime-Illustration. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person vollführt einen Sprung nach vorne, Explosion aus leuchtender Tinte bricht aus.

**Textfelder:**
* Zentraler Regeltext: 'Farb-Splat: Wirf eine Münze. Bei "Kopf" ist das aktive Pokémon deines Gegners jetzt gelähmt und vergiftet. Bei "Zahl" ziehe 3 Karten.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. InkSplash Inc.', Set-Infos 'CHROMA-X 105/100 ★★★'. Copyright: '© My Rookie Card'.`,
  },

  // ── RÜCKSEITE ─────────────────────────────────────────────────────────────
  {
    id: 22,
    name: "My Rookie Card – Rückseite",
    subtitle: "Einheitliches TCG-Rückseiten-Design",
    category: "Rückseite",
    hasPokemon: false,
    icon: "🃏",
    color: "from-blue-700 to-indigo-900",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5, Hochformat). Vollkommen symmetrisches Design, flache Vorderansicht, sauberes Print-Design ohne Mockup-Effekte.

**Kunststil:** Authentischer, klassischer Sammelkarten-Rückseiten-Stil. Scharfe Vektor-Linien, sattes Cel-Shading und extreme Hell-Dunkel-Kontraste. Perfekt optimiert für spiegelnde Holo-Vinyl-Folie.

**Layout & Visuelle Elemente:**
* **Äußerer Rand:** Ein breiter, tiefblauer bis dunkelvioletter Rahmen, getrennt durch eine feine, leuchtend neonblaue Trennlinie zum inneren Bereich.
* **Zentrales Emblem:** Im Mittelpunkt ein monumentales, kreisrundes, metallisch glänzendes Emblem mit einem dicken goldenen Ring.
* **Zentraler Text:** Quer über das goldene Emblem verläuft der Schriftzug 'MY ROOKIE CARD' in einer fetten, dreidimensionalen, gold-silber glänzenden Blockschrift mit harten, tiefschwarzen Schlagschatten.
* **Hintergrund-Effekte:** Zwei gewaltige Energie-Ströme wirbeln spiralförmig nach außen. Einer in kosmischem Dunkelblau, der andere in feurigem Gold-Orange. Sternenstaub-Partikel füllen den Hintergrund aus.

**Details:** Keine Texte oder Werte am Rand. Das Design ist absolut perfekt zentriert und spiegelverkehrbar.`,
  },
];
