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
  "Floral & Natur – Holo-Highlights",
  "Feuer, Sturm & Elementarkräfte",
  "Klassische Full-Art Trainerkarten",
  "Epische TCG-Szenen (MIT Pokémon)",
  "Ultra Rare & Secret Rare",
  "Neue Kunststile",
  "Rückseite",
];

export const PROMPTS: PromptTemplate[] = [

  // ════════════════════════════════════════════════════════════════════════
  // KATEGORIE: FLORAL & NATUR – HOLO-HIGHLIGHTS
  // (Designs die auf Holo-Vinyl-Folie extrem gut wirken)
  // ════════════════════════════════════════════════════════════════════════

  {
    id: 28,
    name: "Blüten-Paradies (MIT Pokémon)",
    subtitle: "Tropisches Full-Art – inspiriert von SIR-Karten",
    category: "Floral & Natur – Holo-Highlights",
    hasPokemon: true,
    icon: "🌸",
    color: "from-pink-400 to-green-400",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand. Vollständige Full-Art-Illustration bis an alle Ränder.

**Kunststil:** Authentischer Pokémon TCG Special Illustration Rare (SIR) Stil. Lebendiges Anime-Cel-Shading mit klaren, kräftigen schwarzen Outlines. Der Hintergrund ist eine üppige tropische Blütenpracht – riesige leuchtende Blüten in Magenta, Koralle, Smaragdgrün und Sonnengelb füllen die gesamte Karte. Organische, fließende Formen. Sehr reich an Kontrast und Sättigung – perfekt für Holo-Vinyl.

**Header-Bereich (Kartenkopf):**
* Oben Links: Kleines goldenes Banner mit dem Text 'BASIS'.
* Titel: '[HOLDER_NAME] & [POKEMON_NAME]' (groß, fett, schwarz, serifenlos).
* Oben Rechts: '120 HP' (groß, rot), gefolgt von einem Gras/Natur-Symbol.

**Haupt-Artwork:**
Üppige tropische Blütenparadies-Szene. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person und ihr [POKEMON_NAME] sind vollständig in die blühende Natur integriert – gigantische tropische Blüten und Blätter rahmen die Szene, Blütenblätter fliegen durch die Luft, ein warmes goldenes Licht bricht durch das Blätterdach. Die Person ist als detaillierter Anime-Charakter gezeichnet, im TCG-Full-Art-Stil. Tautropfen auf Blättern fangen das Licht – ideal für Holo-Folie.

**Textfelder (Unteres Drittel):**
* Angriff 1: [Gras-Symbol] 'Blütensturm' (fett, schwarz), rechtsbündig '60'. Text: 'Heile 20 Schadenspunkte von diesem Pokémon.'
* Angriff 2: [Zwei Gras-Symbole] 'Paradieshüter' (fett, schwarz), rechtsbündig '100'.
* Werte unten: Schwäche Feuer (Symbol x2), Resistenz (Symbol -30), Rückzug (1 Stern).

**Details:** Unten links 'Illustr. FloralMRC', Set-Infos 'MRC-SIR 01 ★★★★'. Copyright: '© My Rookie Card'.`,
  },

  {
    id: 29,
    name: "Sakura-Festival (TRAINER)",
    subtitle: "Japanischer Frühling – Kirschblüten Full-Art",
    category: "Floral & Natur – Holo-Highlights",
    hasPokemon: false,
    icon: "🌸",
    color: "from-rose-300 to-pink-500",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand. Vollständige Full-Art-Illustration bis an alle Ränder.

**Kunststil:** Authentischer Pokémon TCG Full-Art Trainer Stil, Japanischer Anime-Look. Warme Pastellfarben – zartes Rosa, Creme, Gold. Kirschblüten fallen wie Schnee. Weiche Cel-Shading-Technik mit klaren Outlines. Extrem reich an feinen Details – auf Holo-Vinyl-Folie erscheinen die Blütenblätter wie echtes Schimmern.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Kirschblütenzeit' (groß, fett, schwarz).

**Haupt-Artwork:**
Wunderschöne japanische Frühlings-Szene unter einem alten Kirschblütenbaum. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person steht unter einem riesigen blühenden Kirschbaum, zarte rosa Blütenblätter tanzen um sie herum. Goldenes Frühlingslicht filtert durch die Blüten. Traditioneller japanischer Garten im Hintergrund – Holzbrücke, ruhiger Teich mit Spiegelung. Anime-Stil mit feinen, zarten Linien. Stimmung: friedvoll, wunderschön, zeitlos.

**Textfelder:**
* Zentraler Regeltext: 'Frühlings-Neubeginn: Ziehe 4 Karten. Du kannst bis zu 2 Karten aus deiner Hand abwerfen und danach erneut ziehen.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. SakuraMRC', Set-Infos 'MRC-SPRING 01/10'. Copyright: '© My Rookie Card'.`,
  },

  {
    id: 30,
    name: "Herbst-Champion (TRAINER)",
    subtitle: "Goldener Herbstwald – Holo-Shimmer-Meisterwerk",
    category: "Floral & Natur – Holo-Highlights",
    hasPokemon: false,
    icon: "🍁",
    color: "from-amber-400 to-red-500",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand. Vollständige Full-Art-Illustration bis an alle Ränder.

**Kunststil:** Authentischer Pokémon TCG Full-Art Trainer Stil, Ultra Rare. Warme, gesättigte Herbstfarben – tiefes Orangerot, Goldgelb, Bordeaux. Ahornblätter wirbeln dynamisch. Kräftiges Cel-Shading, dicke schwarze Outlines. Das Gold und Orange der Blätter macht dieses Design auf Holo-Vinyl-Folie außergewöhnlich – der Schimmer lässt die Blätter zu funkeln scheinen.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Ernte-Triumph' (groß, fett, schwarz).

**Haupt-Artwork:**
Epische Herbstwald-Szene. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person steht selbstbewusst in einem feuerfarbenen Herbstwald, hunderte goldene und rote Ahornblätter wirbeln um sie herum. Dramatisches Nachmittagslicht bricht durch das Blätterdach und taucht alles in goldenes Licht. Mächtige alte Ahornbäume säumen den Weg. Anime-Stil, dynamische Blätter-Komposition. Die Person strahlt Stärke und Würde aus.

**Textfelder:**
* Zentraler Regeltext: 'Ernte-Zeit: Suche dein Deck nach 2 Energiekarten und nimm sie auf die Hand. Dein aktives Pokémon erhält 20 zusätzliche Schadenpunkte für jeden Angriff diesen Zug.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. HarvestMRC', Set-Infos 'MRC-FALL 02/10'. Copyright: '© My Rookie Card'.`,
  },

  {
    id: 31,
    name: "Waldgeist (TRAINER)",
    subtitle: "Magischer Urwald mit Biolumineszenz",
    category: "Floral & Natur – Holo-Highlights",
    hasPokemon: false,
    icon: "🌿",
    color: "from-emerald-500 to-teal-600",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand. Vollständige Full-Art-Illustration bis an alle Ränder.

**Kunststil:** Authentischer Pokémon TCG Illustration Rare Stil. Mystischer, magischer Urwald-Look. Tiefes Smaragdgrün und Blaugrün, durchzogen von leuchtendem Biolumineszenz-Grün und sanftem goldenen Licht. Glühende Glühwürmchen und leuchtende Pilze. Weiche, aber kontrastreiche Beleuchtung. Auf Holo-Vinyl-Folie wirkt das Leuchten der Waldmagie außergewöhnlich.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Waldgeheimnis' (groß, fett, schwarz).

**Haupt-Artwork:**
Mystische Szene in einem uralten, leuchtenden Urwald. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person steht in einem geheimnisvollen Urwald, umgeben von riesigen moosbedeckten Baumstämmen. Biolumineszente blaue und grüne Pilze leuchten am Boden, hunderte Glühwürmchen tanzen in der Luft. Goldene Lichtstrahlen (God Rays) brechen von oben durch das dichte Blätterdach. Farne und Moos überall. Die Stimmung ist magisch, geheimnisvoll, natürlich.

**Textfelder:**
* Zentraler Regeltext: 'Waldmystik: Durchsuche dein Deck nach bis zu 2 Pokémon deiner Wahl und lege sie verdeckt auf deine Bank. Mische dein Deck danach.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. ForestSpiritMRC', Set-Infos 'MRC-FOREST 03/10'. Copyright: '© My Rookie Card'.`,
  },

  {
    id: 32,
    name: "Eiswald-Duo (MIT Pokémon)",
    subtitle: "Verzauberter Winterwald mit Nordlichtern",
    category: "Floral & Natur – Holo-Highlights",
    hasPokemon: true,
    icon: "❄️",
    color: "from-sky-300 to-blue-600",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand. Vollständige Full-Art-Illustration bis an alle Ränder.

**Kunststil:** Authentischer Pokémon TCG Full-Art SIR Stil. Kühle Blau-Weiß-Palette mit tiefen Indigo-Tönen. Kristallklare Eisstrukturen und vereiste Äste reflektieren das Licht. Naturphänomen Nordlicht (Aurora Borealis) am Himmel in sanftem Grün und Violett. Auf Holo-Vinyl-Folie: Die Eiskristalle und Nordlichtfarben schimmern und spiegeln außergewöhnlich.

**Header-Bereich (Kartenkopf):**
* Oben Links: Kleines silbernes Banner mit dem Text 'BASIS'.
* Titel: '[HOLDER_NAME] & [POKEMON_NAME]' (groß, fett, weiß mit silbernem Outline).
* Oben Rechts: '130 HP' (groß, blau), gefolgt von Eis/Wasser-Symbol.

**Haupt-Artwork:**
Verzauberter Winterwaldszene. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person und ihr [POKEMON_NAME] stehen auf einem zugefrorenen Bergsee. Ringsherum ein Wald aus vereisten Bäumen – jeder Ast mit Eiskristallen überzogen, die in allen Richtungen reflektieren. Am Himmel die grün-violetten Nordlichter (Aurora Borealis). Eiskristalle fliegen durch die Luft. Ruhige, majestätische Stimmung mit dramatischer Beleuchtung.

**Textfelder (Unteres Drittel):**
* Angriff 1: [Wasser-Symbol] 'Eishauch' (fett, schwarz), rechtsbündig '40'. Text: 'Das gegnerische Pokémon ist jetzt eingefroren.'
* Angriff 2: [Zwei Wasser-Symbole] 'Polarwirbel' (fett, schwarz), rechtsbündig '90'.
* Werte unten: Schwäche Feuer (Symbol x2), Resistenz (Symbol -30), Rückzug (2 Sterne).

**Details:** Unten links 'Illustr. FrostMRC', Set-Infos 'MRC-WINTER 04/10 ★★★'. Copyright: '© My Rookie Card'.`,
  },


  // ════════════════════════════════════════════════════════════════════════
  // KATEGORIE: FEUER, STURM & ELEMENTARKRÄFTE
  // ════════════════════════════════════════════════════════════════════════

  {
    id: 33,
    name: "Vulkan-Duo (MIT Pokémon)",
    subtitle: "Aktiver Vulkan – Feuer & Lava Full-Art",
    category: "Feuer, Sturm & Elementarkräfte",
    hasPokemon: true,
    icon: "🌋",
    color: "from-red-600 to-orange-500",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand. Vollständige Full-Art-Illustration bis an alle Ränder.

**Kunststil:** Authentischer Pokémon TCG Full-Art Rare Stil. Extrem dramatische Feuer-Komposition. Intensives Rot, Orange und Gelb gegen tiefstes Schwarz. Glühende Lavaströme, aufsteigende Funken und Asche. Dramatischer Kontrast – ideal für Holo-Vinyl, wo Feuer und Lava regelrecht zu leuchten scheinen.

**Header-Bereich (Kartenkopf):**
* Oben Links: Kleines goldenes Banner mit dem Text 'BASIS'.
* Titel: '[HOLDER_NAME] & [POKEMON_NAME]' (groß, fett, schwarz, serifenlos).
* Oben Rechts: '150 HP' (groß, rot), gefolgt von Feuer-Symbol.

**Haupt-Artwork:**
Epische Vulkan-Szene. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person steht an einem Lavasee, hinter ihr bricht ein Vulkan in dramatischer Eruption aus. Ihr [POKEMON_NAME] ist groß im Vordergrund, umhüllt von Flammen und Hitzeflirren. Glühende Lavabrocken fliegen durch die Luft, Aschepartikel tanzen. Das Licht der Lava taucht alles in intensives Orange. Anime Full-Art Stil, dramatisch und imposant.

**Textfelder (Unteres Drittel):**
* Angriff 1: [Feuer-Symbol] 'Lava-Stoß' (fett, schwarz), rechtsbündig '50'. Text: 'Der Gegner ist jetzt verbrannt.'
* Angriff 2: [Drei Feuer-Symbole] 'Eruptions-Inferno' (fett, schwarz), rechtsbündig '130'.
* Werte unten: Schwäche Wasser (Symbol x2), Resistenz (Symbol -30), Rückzug (3 Sterne).

**Details:** Unten links 'Illustr. VolcanoMRC', Set-Infos 'MRC-FIRE 01/06 ★★★'. Copyright: '© My Rookie Card'.`,
  },

  {
    id: 34,
    name: "Donner-Duell (MIT Pokémon)",
    subtitle: "Naturgewalt Gewitter – Elektrisch & Dramatisch",
    category: "Feuer, Sturm & Elementarkräfte",
    hasPokemon: true,
    icon: "⚡",
    color: "from-yellow-400 to-purple-600",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand. Vollständige Full-Art-Illustration bis an alle Ränder.

**Kunststil:** Authentischer Pokémon TCG Full-Art Stil. Dramatisches Naturgewitter. Tiefe lila-graue Sturmwolken, grelle Blitze zucken durch den Himmel. Elektrisch geladene Luft. Der intensive Kontrast zwischen dem dunklen Himmel und den gleißenden Blitzen macht dieses Design auf Holo-Vinyl spektakulär.

**Header-Bereich (Kartenkopf):**
* Oben Links: Kleines goldenes Banner mit dem Text 'BASIS'.
* Titel: '[HOLDER_NAME] & [POKEMON_NAME]' (groß, fett, schwarz).
* Oben Rechts: '140 HP' (groß, gelb), gefolgt von Blitz-Symbol.

**Haupt-Artwork:**
Dramatische Gewitterszene auf einer Bergkuppe. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person und ihr [POKEMON_NAME] stehen auf dem Gipfel eines Berges, ein gewaltiges Naturgewitter tobt um sie. Blitze schlagen in die Umgebung ein und erleuchten die Szene grell. Der Wind peitscht, die Stimmung ist episch. Im Hintergrund dramatische Sturmwolken über einer zerklüfteten Berglandschaft. Rein natürliche Elementargewalt – keine Technik, nur Natur in ihrer mächtigsten Form.

**Textfelder (Unteres Drittel):**
* Angriff 1: [Blitz-Symbol] 'Sturmladung' (fett, schwarz), rechtsbündig '30'. Text: 'Lade 3 Energien auf dieses Pokémon.'
* Angriff 2: [Drei Blitz-Symbole] 'Gewitterschlag' (fett, schwarz), rechtsbündig '150'. Text: 'Lege alle Energien ab.'
* Werte unten: Schwäche Kampf (Symbol x2), Resistenz Stahl (Symbol -30), Rückzug (1 Stern).

**Details:** Unten links 'Illustr. StormMRC', Set-Infos 'MRC-THUNDER 02/06 ★★★'. Copyright: '© My Rookie Card'.`,
  },

  {
    id: 35,
    name: "Naturgewalt – Sturmhüter (TRAINER)",
    subtitle: "Dramatisches Gewitter – Epische Trainer-Karte",
    category: "Feuer, Sturm & Elementarkräfte",
    hasPokemon: false,
    icon: "⛈️",
    color: "from-slate-500 to-purple-700",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand. Vollständige Full-Art-Illustration bis an alle Ränder.

**Kunststil:** Authentischer Pokémon TCG Secret Rare Full-Art Trainer Stil. Dramatisches Naturgewitter-Setting. Dunkle blaugraue Wolken, Blitze, Regen. Fühlt sich an wie eine ultra-seltene Trainer-Karte. Die kontrastreichen Blitze auf Holo-Vinyl sind spektakulär.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Blitz-Urteil' (groß, fett, schwarz).

**Haupt-Artwork:**
Epische Gewitterszene auf einer Felsklippe. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person steht mit ausgestreckten Armen auf einer Klippe, während ein gewaltiges Naturgewitter tobt. Mächtige Blitze zucken hinter ihr, der Wind peitscht die Kleidung. Regen und elektrische Energie in der Luft. Dramatische Froschperspektive, die die Person heroisch wirken lässt. Rein natürliche Gewalt, mächtig und imposant.

**Textfelder:**
* Zentraler Regeltext: 'Blitz-Urteil: Wirf 3 Münzen. Für jeden Kopf erleidet das aktive Pokémon des Gegners 80 Schadenspunkte. Für jede Zahl füge deinem aktiven Pokémon 20 Schadenspunkte zu.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. StormMRC', Set-Infos 'MRC-THUNDER 03/06 ★★★'. Copyright: '© My Rookie Card'.`,
  },

  {
    id: 36,
    name: "Feuer-Meisterin (TRAINER)",
    subtitle: "Vulkan-Schmiede – Warme Feuer-Trainer-Karte",
    category: "Feuer, Sturm & Elementarkräfte",
    hasPokemon: false,
    icon: "🔥",
    color: "from-orange-500 to-red-600",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand. Vollständige Full-Art-Illustration bis an alle Ränder.

**Kunststil:** Authentischer Pokémon TCG Full-Art Trainer Stil. Warme Feuer-Komposition. Intensives Orange, Gelb und Rot. Flammen und Funken als Gestaltungselemente. Anime-Cel-Shading mit starken Kontrasten. Auf Holo-Vinyl: Die Flammen und Funken glänzen wie echtes Feuer.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Feuer-Wille' (groß, fett, schwarz).

**Haupt-Artwork:**
Dramatische Schmiede/Feuer-Szene. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person steht vor einem gewaltigen, natürlichen Feuer – vielleicht einem Lagerfeuer oder einer Schmiede. Flammen und Funken umringen sie. Das Feuerlicht taucht alles in warmes Orange und Gold. Die Person blickt entschlossen und kraftvoll. Anime-Stil, dynamisch, warm, energetisch. Fliegende Funken und Rauchschwaden verleihen der Szene Tiefe.

**Textfelder:**
* Zentraler Regeltext: 'Feuerwille: Verteile 6 Feuer-Energien aus deiner Hand beliebig auf deine Pokémon im Spiel. Diese Karte kannst du erneut einsetzen, wenn du in diesem Zug ein Pokémon entwickelt hast.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. FlameMRC', Set-Infos 'MRC-FIRE 04/06'. Copyright: '© My Rookie Card'.`,
  },


  // ════════════════════════════════════════════════════════════════════════
  // KATEGORIE: KLASSISCHE FULL-ART TRAINERKARTEN
  // ════════════════════════════════════════════════════════════════════════

  {
    id: 1,
    name: "Der Eiscreme-Klassiker",
    subtitle: "Japanischer TCG Full-Art Stil",
    category: "Klassische Full-Art Trainerkarten",
    hasPokemon: false,
    icon: "🍦",
    color: "from-rose-400 to-pink-500",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Authentischer japanischer Pokémon TCG Full-Art-Stil. Anime-Illustration mit klaren Konturen, lebendigem Cel-Shading, warmen Pastellfarben. Wie eine offizielle Pokémon-Trainerkarte.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv, sportlich).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Ermutigung' (groß, fett, schwarz).

**Haupt-Artwork:**
Detaillierte Anime-Illustration. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Festlicher Hintergrund mit bunten Luftballons und Konfetti. Person hält ein aufwendiges Eisbecher-Dessert mit bunten Früchten (KEIN Pokémon-Maskottchen). Die Stimmung ist fröhlich und festlich. Warme, bunte Farben.

**Textfelder:**
* Zentraler Regeltext: 'Du kannst diese Karte nur einsetzen, wenn du mehr verbleibende Preiskarten hast als dein Gegner. Lege bis zu 2 Basis-Energiekarten aus deinem Ablagestapel an 1 deiner Phase-2-Pokémon an.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. Iori Suzuki', 'J POR DE 123/088'. Copyright: '© My Rookie Card'.`,
  },

  {
    id: 2,
    name: "Die Rookie Card (Stadion)",
    subtitle: "Anime-Illustration im Fußballstadion",
    category: "Klassische Full-Art Trainerkarten",
    hasPokemon: false,
    icon: "⚽",
    color: "from-green-500 to-emerald-600",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Authentischer Pokémon TCG Full-Art Trainer Stil. Anime-Illustration mit klaren Konturen, kräftigen Farben. Dynamische Beleuchtung durch Stadionflutlicht.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Rookiekarten-Erfolg' (groß, fett, schwarz).

**Haupt-Artwork:**
Dynamische Anime-Illustration. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person trägt sportliches Trikot und steht stolz im Mittelpunkt eines ausverkauften Fußballstadions unter blendend hellem Flutlicht. Konfetti fliegt, die Tribünen jubeln. Dramatische Perspektive von unten. Anime-Stil mit lebendigem Cel-Shading.

**Textfelder:**
* Zentraler Regeltext: 'Spezialfähigkeit: Spielmacher. [HOLDER_NAME] bringt sofortige Energie auf das Feld. Wenn diese Karte gespielt wird, ziehe 2 zusätzliche Karten.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. DynamicArts', Set-Infos 'RC-Edition 01/99'. Copyright: '© My Rookie Card'.`,
  },

  {
    id: 3,
    name: "Der E-Sports Champion",
    subtitle: "Gaming-Anime mit LED-Licht-Atmosphäre",
    category: "Klassische Full-Art Trainerkarten",
    hasPokemon: false,
    icon: "🎮",
    color: "from-violet-500 to-purple-600",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Authentischer Pokémon TCG Full-Art Trainer Stil. Anime-Illustration mit kräftigem Cel-Shading, leuchtenden LED-Lichtakzenten in Magenta und Cyan. Konzentrierte, fokussierte Atmosphäre.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Champion-Override' (groß, fett, schwarz).

**Haupt-Artwork:**
Fokussierte Anime-Illustration in einem Gaming-Setup. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person sitzt oder steht mit Gaming-Headset und Controller in einem aufwendig ausgestatteten Gaming-Raum. RGB-Beleuchtung in Magenta und Cyan taucht den Raum in Farbe. Konzentrierter, entschlossener Blick. Anime-Stil mit leuchtenden Farbakzenten.

**Textfelder:**
* Zentraler Regeltext: 'System-Override: [HOLDER_NAME] kann diese Karte nutzen, um einen gegnerischen Zug zu blockieren. Lege 1 Energiekarte ab, um den Effekt zu aktivieren.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. NeoPixel', Set-Infos 'CYBER-GEN 10/150'. Copyright: '© My Rookie Card'.`,
  },

  {
    id: 4,
    name: "Der Meister-Tüftler",
    subtitle: "Warme Anime-Werkstatt-Illustration",
    category: "Klassische Full-Art Trainerkarten",
    hasPokemon: false,
    icon: "🔧",
    color: "from-yellow-500 to-amber-600",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Authentischer Pokémon TCG Full-Art Trainer Stil. Warme, detailreiche Anime-Illustration. Gemütliche Werkstatt-Atmosphäre mit warmem Lampenlicht.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Meister-Werkstatt' (groß, fett, schwarz).

**Haupt-Artwork:**
Fröhliche, detaillierte Anime-Illustration. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person an einer vollgepackten Werkbank präsentiert stolz ein selbst gebautes 3D-Modell oder Gadget. Warmes Lampenlicht, überall Werkzeuge und Baupläne. Gemütliche, kreative Atmosphäre. Die Person strahlt Stolz und Freude aus.

**Textfelder:**
* Zentraler Regeltext: '[HOLDER_NAME] erlaubt es dir, dein Deck nach einer beliebigen Item-Karte zu durchsuchen und sie auf die Hand zu nehmen.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. Creator Guild', Set-Infos 'BUILD-IT 07/88'. Copyright: '© My Rookie Card'.`,
  },


  // ════════════════════════════════════════════════════════════════════════
  // KATEGORIE: EPISCHE TCG-SZENEN (MIT POKÉMON)
  // ════════════════════════════════════════════════════════════════════════

  {
    id: 11,
    name: "Elementar-Schnitt / Doppel-Attacke",
    subtitle: "TCG Full-Art SIR Stil – Epische Kampfszene",
    category: "Epische TCG-Szenen (MIT Pokémon)",
    hasPokemon: true,
    icon: "⚔️",
    color: "from-orange-500 to-red-500",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Authentischer Pokémon TCG Full-Art Special Illustration Rare (SIR) Stil. Dynamische Anime-Kampf-Illustration mit ultra-scharfen Konturen. Naturgewalten als Hintergrund – zerborstener Felsboden, Blitze, elementare Explosion.

**Header-Bereich (Kartenkopf):**
* Oben Links: Kleines goldenes Banner mit dem Text 'BASIS'.
* Titel: '[HOLDER_NAME] & [POKEMON_NAME]' (groß, fett, schwarz, serifenlose Schrift).
* Oben Rechts: '150 HP' (rot), gefolgt von einem Element-Symbol.

**Haupt-Artwork:**
Epische Action-Szene (Weitwinkel). WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person und ihr Partner-[POKEMON_NAME] vollführen einen mächtigen, synchronisierten Angriff. Der Fels-Boden splittert unter der Kraft des Angriffs, Energie-Blitze und Trümmer fliegen. Dynamische Komposition im Anime-Stil.

**Textfelder:**
* Angriff 1: [Energie-Symbol] 'Synchron-Schlag' (fett, schwarz), rechtsbündig '50'. Text: 'Fügt 30 Schadenspunkte mehr zu, wenn dieses Pokémon in diesem Zug eingewechselt wurde.'
* Angriff 2: [Zwei Energie-Symbole] 'Krasse Elementar-Zerstörung' (fett, schwarz), rechtsbündig '120'.
* Werte unten: Schwäche (Symbol x2), Resistenz (Symbol -30), Rückzugskosten (2 Sterne).

**Details:** Unten links 'Illustr. MyRookieCard Studio', Set-Infos 'MRC-ACT 01/05 ★★★★'. Copyright: '© My Rookie Card'.`,
  },

  {
    id: 12,
    name: "Donner-Legende / Naturgewalt-Duo",
    subtitle: "Episches Naturgewitter – TCG Hyper-Rare Stil",
    category: "Epische TCG-Szenen (MIT Pokémon)",
    hasPokemon: true,
    icon: "🌩️",
    color: "from-yellow-500 to-slate-700",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Authentischer Pokémon TCG Hyper-Rare Full-Art Stil. Dramatisches Naturgewitter auf einem Gebirgskamm. Tiefe blaugraue Sturmwolken, grelle Naturblitze, peitschender Wind und Regen. Extrem kontrastreiche Beleuchtung – auf Holo-Vinyl wirken die Blitze wie echtes Leuchten.

**Header-Bereich:**
* Oben Links: Kleines goldenes Banner mit dem Text 'TAG TEAM'.
* Titel: '[HOLDER_NAME] & [POKEMON_NAME]' (groß, fett, schwarz).
* Oben Rechts: '180 HP' (rot), gefolgt von einem Blitz/Sturm-Symbol.

**Haupt-Artwork:**
Monumentale Naturgewitter-Szene auf einem Gebirgskamm. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person und [POKEMON_NAME] stehen entschlossen auf einer Bergkuppe, während ein gewaltiges Naturgewitter um sie tobt. Mächtige Naturblitze erhellen dramatisch den Himmel hinter ihnen. Peitschender Wind, Regen. Das Pokémon lädt Energie auf, die Person hebt den Arm. Rein natürliche Elementargewalt.

**Textfelder:**
* Angriff 1: [Zwei Energie-Symbole] 'Gebirgsblitz' (fett, schwarz), rechtsbündig '90'.
* Angriff 2: [Drei Energie-Symbole] 'Sturmbrecher-Stoß' (fett, schwarz), rechts '160'. Text: 'Lege alle Energiekarten von diesem Pokémon ab.'
* Werte unten: Schwäche (Symbol x2), Resistenz (Symbol -30), Rückzug (3 Sterne).

**Details:** Unten links 'Illustr. StormMRC', Set-Infos 'MRC-ACT 02/05 ★★★★'. Copyright: '© My Rookie Card'.`,
  },

  {
    id: 13,
    name: "Titanen-Erwachen / Urzeit-Beschwörung",
    subtitle: "Episch auf stürmischem Berg – TCG Full-Art",
    category: "Epische TCG-Szenen (MIT Pokémon)",
    hasPokemon: true,
    icon: "🏔️",
    color: "from-amber-600 to-orange-700",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Authentischer Pokémon TCG Full-Art Stil. Epische Anime-Illustration mit extremen Größenunterschieden zwischen Person und Pokémon. God Rays durch dramatische Wolken. Natürliche Elementargewalt – Sturm, Magma, Fels.

**Header-Bereich:**
* Oben Links: Kleines goldenes Banner mit dem Text 'PHASE 1'.
* Titel: '[HOLDER_NAME]s [POKEMON_NAME]' (groß, fett, schwarz).
* Oben Rechts: '160 HP' (rot), gefolgt von Energie-Symbol.

**Haupt-Artwork:**
Atemberaubende Szene auf einem stürmischen Berg. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person steht furchtlos im Vordergrund, hinter ihr wächst das [POKEMON_NAME] zu titanenhafter Größe heran. Wirbelstürme, Magma, ein mächtiger Lichtstrahl bricht durch die Wolken. Anime Full-Art mit extremen Kontrasten.

**Textfelder:**
* Angriff 1: [Energie-Symbol] 'Urzeitlicher Ruf' (fett, schwarz). Text: 'Durchsuche dein Deck nach einer Item-Karte und nimm sie auf die Hand.'
* Angriff 2: [Drei Energie-Symbole] 'Zorn der Titanen' (fett, schwarz), rechtsbündig '140'.
* Werte unten: Schwäche (Symbol x2), Resistenz (Symbol -30), Rückzug (3 Sterne).

**Details:** Unten links 'Illustr. TitanForge MRC', Set-Infos 'MRC-ACT 03/05 ★★★★'. Copyright: '© My Rookie Card'.`,
  },

  {
    id: 14,
    name: "Überschall-Sturzflug / Extrem-Racer",
    subtitle: "High-Speed TCG Anime – Speedlines & Dynamik",
    category: "Epische TCG-Szenen (MIT Pokémon)",
    hasPokemon: true,
    icon: "🚀",
    color: "from-sky-400 to-blue-600",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** High-Speed Pokémon TCG Anime-Stil. Extreme Dynamik durch Speedlines und Motion Blur. Lebhafte Farben, kräftige Outlines. Stadt oder Wolken-Kulisse im Hintergrund, komplett natürlich (kein Cyber/Tech).

**Header-Bereich:**
* Oben Links: Kleines goldenes Banner mit dem Text 'BASIS'.
* Titel: '[HOLDER_NAME] & [POKEMON_NAME]' (groß, fett, schwarz).
* Oben Rechts: '130 HP' (rot), gefolgt von Wind/Elektro-Symbol.

**Haupt-Artwork:**
Action-Szene in der Luft. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person reitet auf dem Rücken ihres [POKEMON_NAME] im Sturzflug durch Wolken über Wolkenkratzern. Speedlines strahlen von der Mitte aus. Peitschender Wind, Dynamik pur. Anime Full-Art Stil.

**Textfelder:**
* Angriff 1: [Energie-Symbol] 'Schallmauer-Durchbruch' (fett, schwarz), rechtsbündig '40'. Text: 'Dieses Pokémon kann im nächsten Zug nicht angegriffen werden.'
* Angriff 2: [Zwei Energie-Symbole] 'Überschall-Sturm-Anschlag' (fett, schwarz), rechtsbündig '100'.
* Werte unten: Schwäche (Symbol x2), Resistenz (Symbol -30), Rückzug (1 Stern).

**Details:** Unten links 'Illustr. VelocityMRC', Set-Infos 'MRC-ACT 04/05 ★★★★'. Copyright: '© My Rookie Card'.`,
  },

  {
    id: 15,
    name: "Tiefsee-Abgrund / Der Mahlstrom",
    subtitle: "Unterwasser Secret-Rare – Biolumineszenz",
    category: "Epische TCG-Szenen (MIT Pokémon)",
    hasPokemon: true,
    icon: "🌊",
    color: "from-teal-500 to-blue-700",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Premium Pokémon TCG Secret-Rare Stil. Unterwasser-Illustration mit Caustics (Lichtbrechungs-Muster), tiefen Blautönen und biolumineszenten Akzenten. Organische Unterwasserwelt. Auf Holo-Vinyl: Die Caustics-Muster und das Leuchten wirken wie echtes Wasser.

**Header-Bereich:**
* Oben Links: Kleines goldenes Banner mit dem Text 'BASIS'.
* Titel: '[HOLDER_NAME] & [POKEMON_NAME]' (groß, fett, schwarz).
* Oben Rechts: '140 HP' (rot), gefolgt von Wasser/Drachen-Symbol.

**Haupt-Artwork:**
Epische Unterwasser-Kampfszene. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person und [POKEMON_NAME] im Zentrum eines wirbelnden Unterwasser-Mahlstroms. Glühende Korallen in Magenta und Orange, uralte versunkene Ruinen, aufsteigende Luftblasen. Sonnenlicht bricht von oben durch das Wasser in Caustics-Mustern.

**Textfelder:**
* Angriff 1: [Energie-Symbol] 'Tiefsee-Sog' (fett, schwarz). Text: 'Tausche das aktive Pokémon deines Gegners gegen 1 Pokémon von seiner Bank aus.'
* Angriff 2: [Drei Energie-Symbole] 'Abyssale Ozean-Explosion' (fett, schwarz), rechtsbündig '130'.
* Werte unten: Schwäche (Symbol x2), Resistenz (Symbol -30), Rückzug (2 Sterne).

**Details:** Unten links 'Illustr. AbyssalMRC', Set-Infos 'MRC-ACT 05/05 ★★★★'. Copyright: '© My Rookie Card'.`,
  },


  // ════════════════════════════════════════════════════════════════════════
  // KATEGORIE: ULTRA RARE & SECRET RARE
  // ════════════════════════════════════════════════════════════════════════

  {
    id: 5,
    name: "Elementar-Ausbruch (Secret Rare)",
    subtitle: "Hochemotionale Anime-Kampf-Illustration",
    category: "Ultra Rare & Secret Rare",
    hasPokemon: false,
    icon: "🌟",
    color: "from-red-500 to-orange-600",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Pokémon TCG Secret Rare Full-Art Trainer Stil. Hochemotionale Anime-Kampf-Illustration. Elementare Energie – Feuer, Blitz – umgibt die Person. Dramatische Froschperspektive. Auf Holo-Vinyl spektakulär wegen des Energieleuchten.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Elementar-Zorn' (groß, fett, schwarz).

**Haupt-Artwork:**
Epische Anime-Illustration (Froschperspektive). WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person in kraftvoller Pose auf einem Felsvorsprung, umgeben von aufsteigenden Feuerfunken und natürlichen Blitzen. Das Licht der Elementarenergie taucht die Szene in warmes Orange und Gelb. Dramatisch, hochemotional, episch.

**Textfelder:**
* Zentraler Regeltext: 'Absoluter Fokus: Wenn diese Karte gespielt wird, verdopple die Angriffsenergie deines aktiven Pokémons in diesem Zug. [HOLDER_NAME] schützt dein Team vor jeglichem Schaden.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. UltimateStudio', Set-Infos 'SECRET-ELM 99/088 ★★★'. Copyright: '© My Rookie Card'.`,
  },

  {
    id: 6,
    name: "Phönix-Aufstieg (Hyper Rare)",
    subtitle: "Sonnenaufgang & Phönix-Energie – Kein Space",
    category: "Ultra Rare & Secret Rare",
    hasPokemon: false,
    icon: "🦅",
    color: "from-yellow-400 to-orange-500",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Pokémon TCG Hyper Rare Full-Art Trainer Stil. Dramatischer Sonnenaufgang über einem Berggipfel. Intensive warme Farben – Gold, Orange, tiefes Rosa. Der Himmel leuchtet in tausend Farben. KEIN Weltall, KEIN Universum – rein natürliche Stimmung. Auf Holo-Vinyl: Die Farben des Sonnenaufgangs schimmern außergewöhnlich.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Phönix-Aufstieg' (groß, fett, schwarz).

**Haupt-Artwork:**
Kinoreife Illustration eines dramatischen Sonnenaufgangs. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person steht auf dem Gipfel eines Berges beim Sonnenaufgang. Hinter ihr öffnet sich ein Himmel in leuchtendem Gold und Orange, riesige abstrakte Lichtflügel (wie ein Phönix) formen sich aus dem Morgenlicht. Tiefe unter ihr liegt ein Meer aus Wolken. Kein Weltall, nur pure natürliche Majestic.

**Textfelder:**
* Zentraler Regeltext: 'Neubeginn: Mische dein Deck komplett neu. Ziehe danach 7 Karten. Heile 30 Schadenspunkte von all deinen Pokémon im Spiel.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. DawnMRC', Set-Infos 'PHOENIX-HR 100/088 ★★★'. Copyright: '© My Rookie Card'.`,
  },

  {
    id: 7,
    name: "Phönix-Erwachen (Rainbow Rare)",
    subtitle: "Regenbogen & Licht – Ultra-Premium",
    category: "Ultra Rare & Secret Rare",
    hasPokemon: false,
    icon: "🌈",
    color: "from-rose-400 via-purple-400 to-cyan-400",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Pokémon TCG Rainbow Rare Full-Art Stil. Gesamte Karte in leuchtenden Pastell-Regenbogenfarben. Licht-Flügel aus prismatischem Licht. Wunderschöne Farbübergänge. Auf Holo-Vinyl: Ein Rainbow Rare Design, das die Folie perfekt nutzt – die Farben scheinen je nach Blickwinkel zu wechseln.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Phönix-Erwachen' (groß, fett, schwarz).

**Haupt-Artwork:**
Actiongeladene, leuchtende Anime-Illustration. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person stürmt nach vorne durch eine Wiesenlandschaft in vollem Sonnenlicht. Hinter ihr entfalten sich riesige Flügel aus prismatischem, regenbogenfarbenem Licht – natürlich und wunderschön. Blumen und Lichtpartikel fliegen auf. Stimmung: überwältigend schön, kraftvoll, lebendig.

**Textfelder:**
* Zentraler Regeltext: 'Unendliche Wiedergeburt: Heile allen Schaden von all deinen Pokémon im Spiel. Lege diese Karte nicht auf den Ablagestapel, sondern mische sie zurück in dein Deck.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. PhoenixStudio', 'RAINBOW-LEGEND 120/088 ★★★★'. Copyright: '© My Rookie Card'.`,
  },

  {
    id: 37,
    name: "Gold-Legende (Gold Rare)",
    subtitle: "Vollgold-Karte – TCG Gold Rare Stil",
    category: "Ultra Rare & Secret Rare",
    hasPokemon: false,
    icon: "🏆",
    color: "from-yellow-500 to-amber-400",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Authentischer Pokémon TCG Gold Rare Stil. Die gesamte Karte ist in sattem Goldton gehalten – wie echtes, poliertes Gold. Alle Elemente (Rahmen, Text, Artwork) sind in verschiedenen Goldtönen ausgeführt: von hellgolden bis tiefes Kupfergold. Dezente Reliefstruktur im Hintergrund. Auf Holo-Vinyl-Folie ist dieser Stil der absolute Höhepunkt – die gesamte Karte glänzt wie Gold.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (dunkelgold, fett, kursiv).
* Oben Rechts: 'TRAINER' (dunkelgold, serifenlos, geprägt).
* Titel: '[HOLDER_NAME]s Goldene Ära' (groß, fett, tiefstes Gold).

**Haupt-Artwork:**
Edles, goldenes Porträt im Gold-Rare-Stil. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person ist als goldenes Relief-Porträt dargestellt – wie eine antike Münze oder ein Medaillon, aber im modernen Anime/TCG-Stil. Hinter ihr ein abstraktes Muster aus goldenen geometrischen Formen und Ranken. Dezenter Glanz-Effekt. Zeitlos, edel, premium.

**Textfelder:**
* Zentraler Regeltext: 'Goldene Ära: Wenn diese Karte gespielt wird, kannst du alle deine Preiskarten ansehen und eine davon sofort nehmen.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. GoldMRC', Set-Infos 'GOLD-LEGEND 200/088 ★★★★★'. Copyright: '© My Rookie Card'.`,
  },

  {
    id: 38,
    name: "Kristall-Tera (MIT Pokémon)",
    subtitle: "Tera-Kristall-Effekt – Ultra Premium",
    category: "Ultra Rare & Secret Rare",
    hasPokemon: true,
    icon: "💎",
    color: "from-cyan-300 to-violet-500",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Pokémon TCG Tera-Karten-Stil. Die gesamte Karte hat eine kristalline, prismatische Qualität. Der Hintergrund besteht aus geometrischen Kristallformen in tiefen Juwelen-Tönen (Saphirblau, Smaragdgrün, Rubyrot, Amethystviolett). Alles erscheint durch Kristallfacetten gebrochen. Auf Holo-Vinyl ist dieser Stil der ultimative Flex – die Kristallstrukturen schimmern von jedem Blickwinkel anders.

**Header-Bereich (Kartenkopf):**
* Oben Links: Kleines Kristall-Banner mit dem Text 'TERA'.
* Titel: '[HOLDER_NAME]s [POKEMON_NAME]' (groß, fett, kristallweiß mit Regenbogen-Schimmer).
* Oben Rechts: '200 HP' (groß, kristallblau), Tera-Symbol.

**Haupt-Artwork:**
Kristall-Tera-Szene. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person steht neben ihrem [POKEMON_NAME] in einer Tera-Kristall-Formation – gigantische prismatische Kristalle in allen Juwelenfarben ragen aus dem Boden. Das Pokémon ist in kristallines Licht gehüllt (Tera-Form). Lichtstrahlen brechen sich in tausend Farben an den Kristallflächen. Anime-Stil, ultra-premium.

**Textfelder (Unteres Drittel):**
* Fähigkeit (Banner): 'Tera-Kristall' Text: 'Solange dieses Pokémon eine Tera-Energiekarte trägt, nimmt es 20 Schadenspunkte weniger.'
* Angriff: [Vier Energie-Symbole] 'Kristall-Brecher' (fett, schwarz), rechtsbündig '180'.
* Werte unten: Schwäche (Symbol x2), Resistenz (Symbol -30), Rückzug (2 Sterne).

**Details:** Unten links 'Illustr. TeraMRC', Set-Infos 'TERA-CRYSTAL 001/001 ★★★★★'. Copyright: '© My Rookie Card'.`,
  },


  // ════════════════════════════════════════════════════════════════════════
  // KATEGORIE: NEUE KUNSTSTILE
  // ════════════════════════════════════════════════════════════════════════

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
* Titel: '[HOLDER_NAME] & [POKEMON_NAME]' (groß, fett, schwarz, serifenlos).
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

**Kunststil:** Flacher, Vektor-basierter Pop-Art-Stil. Klare, vollflächige Farben, dicke Outlines und geometrische Formen. Sehr grafisch, bunt und fröhlich.

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
* Titel: '[HOLDER_NAME] & [POKEMON_NAME] ex' (groß, fett, schwarz, mit glänzendem "ex" Symbol).
* Oben Rechts: '170 HP' (groß, schwarz), gefolgt von einem Element-Symbol.

**Haupt-Artwork:**
Eine übertrieben coole und verspielte Illustration mit fetten Linien. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person und ihr [POKEMON_NAME] geben sich ein High-Five oder machen eine witzige Pose. Der Hintergrund ist ein farbenfrohes Chaos aus Doodle-Kunst (Sterne, Blitze, Blumenmuster).

**Textfelder (Unteres Drittel):**
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

**Kunststil:** Wilder, graffiti-ähnlicher Doodle-Stil mit extrem dicken, markanten schwarzen Outlines. Sehr farbenfroh. Komplett vollgepackter Hintergrund mit niedlichen Mustern, Sternen und Symbolen.

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
    name: "Neon Energy Burst (MIT Pokémon)",
    subtitle: "Intensive Energie & Aura – Kein Cyber/Space",
    category: "Neue Kunststile",
    hasPokemon: true,
    icon: "💫",
    color: "from-cyan-400 to-fuchsia-500",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Extrem lebendiger, energetischer Pokémon-TCG-Kunststil. Intensive, gesättigte Farben – leuchtendes Magenta, Cyan, Neongelb. KEINE Technik, KEIN Cyber, KEIN Weltall – die Energie ist natürlich-elementar, wie eine Aura aus reiner Kraft. Kontrastreiche Schatten, dicke Outlines.

**Header-Bereich (Kartenkopf):**
* Oben Links: Kleines silbernes Banner mit dem Text 'MEGA'.
* Titel: 'Mega [POKEMON_NAME] & [HOLDER_NAME]' (groß, fett, leuchtend).
* Oben Rechts: '310 HP' (groß, rot), gefolgt von einem Element-Symbol.

**Haupt-Artwork:**
Monumentale, energiegeladene Anime-Illustration. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person steht episch neben ihrem massiven [POKEMON_NAME]. Beide sind von einer gewaltigen elementaren Energie-Aura umhüllt – wie Flammen oder Blitze, aber in intensivem Magenta und Cyan. Der Hintergrund zeigt eine dramatische Naturlandschaft (Gebirge, offene Ebene), die durch die Energiewellen in Fragmente bricht. Anime Full-Art, überwältigend, episch.

**Textfelder (Unteres Drittel):**
* Angriff 1: [Drei Energie-Symbole] 'Energie-Welle' (fett, schwarz), rechtsbündig '200'.
* Angriff 2: [Fünf Energie-Symbole] 'Überlastungs-Strahl' (fett, schwarz). Text: 'Wirf eine Münze. Bei Kopf fügt dieser Angriff jedem Pokémon des Gegners 150 Schaden zu.'
* Werte unten: Schwäche (Symbol x2), Resistenz (Symbol -30), Rückzug (3 Sterne).

**Details:** Unten links 'Illustr. EnergyMRC', Set-Infos 'MRC-PROMO 05'. Copyright: '© My Rookie Card'.`,
  },

  {
    id: 21,
    name: "Energie-Aufladung (OHNE Pokémon)",
    subtitle: "Reine Energie-Aura – Trainer-Karte",
    category: "Neue Kunststile",
    hasPokemon: false,
    icon: "🌐",
    color: "from-cyan-400 to-fuchsia-500",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Intensives, leuchtendes Pokémon TCG Trainer-Karten-Artwork. Elementare Energie-Aura, keine Technik. Sehr hohe Kontraste, intensive Farben – Magenta, Cyan, Neongelb. Die Person steht im Zentrum eines natürlichen Energiewirbels.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv, sportlich).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Überladung' (groß, fett, schwarz, serifenlos).

**Haupt-Artwork:**
Monumentale, strahlende Illustration. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person steht in einer extrem kraftvollen Pose in einer Naturlandschaft. Sie ist von einer massiven, elementaren Energie-Aura umhüllt – wie Blitze oder Flammen aus dem Boden schießend. Keine Technologie, reine natürliche Energie. Anime Full-Art Stil.

**Textfelder:**
* Zentraler Regeltext: 'Lege alle Energiekarten aus deiner Hand an deine Pokémon im Spiel an, wie es dir gefällt. Dein Zug endet danach sofort.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. EnergyMRC', Set-Infos 'MRC-PROMO 06'. Copyright: '© My Rookie Card'.`,
  },

  {
    id: 8,
    name: "Nacht-Champion (TRAINER)",
    subtitle: "Dramatische Nacht – Anime-Tournament-Vibe",
    category: "Neue Kunststile",
    hasPokemon: false,
    icon: "🌃",
    color: "from-indigo-600 to-blue-800",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Authentischer Pokémon TCG Full-Art Trainer Stil bei Nacht. Dramatische Nacht-Beleuchtung – warme Stadtlichter, farbige Lampions oder Festivallichter. KEIN Cyberpunk, KEINE Hologramme – mehr wie ein nächtliches japanisches Festival oder ein abendliches Pokémon-Turnier im Freien. Anime-Cel-Shading.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Nacht-Sieg' (groß, fett, schwarz).

**Haupt-Artwork:**
Stimmungsvolle Nacht-Szene. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Die Person steht selbstbewusst in einer Nacht-Atmosphäre – vielleicht ein japanisches Sommerfest (Matsuri) mit bunten Lampions, oder ein nächtliches Outdoor-Turnier unter Flutlicht. Warme, stimmungsvolle Nacht-Beleuchtung, Anime-Stil.

**Textfelder:**
* Zentraler Regeltext: 'Nacht-Strategie: Ziehe Karten, bis du 6 auf der Hand hast. Dein Gegner muss in seinem nächsten Zug 1 Energiekarte ablegen.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. NightMRC', Set-Infos 'NIGHT-CHAMP 88/088 ★★★'. Copyright: '© My Rookie Card'.`,
  },

  {
    id: 9,
    name: "Prismatischer Splitter-Sturm",
    subtitle: "Explosive Kristall-Anime-Illustration",
    category: "Neue Kunststile",
    hasPokemon: false,
    icon: "💎",
    color: "from-sky-400 to-indigo-500",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Pokémon TCG High-End Spezial-Stil. Explosive Anime-Illustration mit natürlichen Kristall-/Eissplittern. Helle, klare Farben – Eisblau, Weiß, Silber. Die Kristallsplitter entstehen aus einer natürlichen Quelle (Eis, Fels). Auf Holo-Vinyl spektakulär.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Prisma-Barriere' (groß, fett, schwarz).

**Haupt-Artwork:**
Hochexplosive Action-Illustration. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person steht in einer Abwehrpose, eine Barriere aus natürlichen Eiskristallen und Felsssplittern zerspringt explosiv um sie herum. Dramatisches Licht bricht sich in den Kristallflächen in tausend Farben.

**Textfelder:**
* Zentraler Regeltext: 'Prismatischer Schutz: Verhindere alle Effekte von Angriffen die Pokémon deines Teams im nächsten Zug des Gegners.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. CrystalStudio', Set-Infos 'PRISM-STORM 77/077 ★★★★'. Copyright: '© My Rookie Card'.`,
  },

  {
    id: 10,
    name: "Chroma-Explosion",
    subtitle: "Street-Art meets TCG-Anime",
    category: "Neue Kunststile",
    hasPokemon: false,
    icon: "🎆",
    color: "from-yellow-400 to-red-500",
    template: `WICHTIGES FORMAT: Exaktes vertikales Sammelkarten-Format (Seitenverhältnis 2.5:3.5). Kein Rand.

**Kunststil:** Street-Art meets Pokémon TCG-Anime. Splash-Art mit Graffiti-Outlines. Extrem bunte, spontane Farb-Explosionen wie bei Graffiti und Street-Art. Hohe Energie, viel Bewegung.

**Header-Bereich:**
* Oben Links: 'Unterstützer' (leuchtend orange-rot, fett, kursiv).
* Oben Rechts: 'TRAINER' (groß, dunkel, serifenlos).
* Titel: '[HOLDER_NAME]s Chroma-Angriff' (groß, fett, schwarz).

**Haupt-Artwork:**
Extrem farbenfrohe Anime-Illustration. WICHTIG: Übernimm die exakten Gesichtsmerkmale aus dem Referenzbild! [FOTO_BESCHREIBUNG_DER_PERSON]. Person springt nach vorne, eine Explosion aus leuchtender Tinte bricht um sie herum aus – wie eine riesige, farbige Paint-Explosion. Graffiti-artige Linien und Spritzer. Energie pur.

**Textfelder:**
* Zentraler Regeltext: 'Farb-Splat: Wirf eine Münze. Bei "Kopf" ist das aktive Pokémon des Gegners jetzt gelähmt und vergiftet. Bei "Zahl" ziehe 3 Karten.'
* Restriction Box: 'Du kannst während deines Zuges nur 1 Unterstützerkarte spielen.'

**Details:** Unten Links: 'Illustr. InkSplash Inc.', Set-Infos 'CHROMA-X 105/100 ★★★'. Copyright: '© My Rookie Card'.`,
  },


  // ════════════════════════════════════════════════════════════════════════
  // KATEGORIE: RÜCKSEITE
  // ════════════════════════════════════════════════════════════════════════

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
* **Hintergrund-Effekte:** Zwei gewaltige Energie-Ströme wirbeln spiralförmig nach außen. Einer in tiefem Königsblau, der andere in feurigem Gold-Orange. Sternenstaub-Partikel füllen den Hintergrund aus.

**Details:** Keine Texte oder Werte am Rand. Das Design ist absolut perfekt zentriert und spiegelverkehrbar.`,
  },
];
