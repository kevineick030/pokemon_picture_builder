"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { PROMPTS, CATEGORIES, type PromptTemplate } from "@/data/prompts";

// ── Types ──────────────────────────────────────────────────────────────────

interface HistoryEntry {
  imageBase64: string;
  mimeType: string;
  promptName: string;
  holderName: string;
  pokemonName: string;
}

interface CardStats {
  type: string;
  hp: string;
  abilityName: string;
  abilityText: string;
  attack1Name: string;
  attack1Damage: string;
  attack2Name: string;
  attack2Damage: string;
}

interface PrintCard {
  id: string;
  imageBase64: string;
  mimeType: string;
  label: string;
}

interface GalleryCard {
  id: string;
  timestamp: number;
  imageBase64: string;
  mimeType: string;
  promptName: string;
  holderName: string;
  pokemonName: string;
}

// ── Constants ──────────────────────────────────────────────────────────────

const POKEMON_TYPES = [
  "Feuer", "Wasser", "Gras", "Elektro", "Psycho", "Kampf",
  "Dunkel", "Stahl", "Eis", "Drachen", "Fee", "Normal",
  "Gift", "Boden", "Flug", "Gestein", "Käfer", "Geist",
];

const GALLERY_KEY = "mrc_gallery";
const MAX_GALLERY = 12;

// 63mm × 88mm at 300 DPI
const PRINT_W = Math.round((63 / 25.4) * 300); // 744 px
const PRINT_H = Math.round((88 / 25.4) * 300); // 1039 px

// ── Utilities ──────────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve({ base64: result.split(",")[1], mimeType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function crc32(data: Uint8Array): number {
  const table: number[] = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
    table[n] = c;
  }
  let crc = 0xffffffff;
  for (const byte of data) crc = (crc >>> 8) ^ table[(crc ^ byte) & 0xff];
  return (crc ^ 0xffffffff) >>> 0;
}

function addDpiMetadataToPng(base64: string, dpi: number): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  const ppm = Math.round((dpi * 10000) / 254); // pixels per meter

  const physData = new Uint8Array(9);
  const dv = new DataView(physData.buffer);
  dv.setUint32(0, ppm, false);
  dv.setUint32(4, ppm, false);
  physData[8] = 1; // unit = meter

  const typeBytes = new TextEncoder().encode("pHYs");
  const crcInput = new Uint8Array(4 + 9);
  crcInput.set(typeBytes, 0);
  crcInput.set(physData, 4);
  const crc = crc32(crcInput);

  // 4(len) + 4(type) + 9(data) + 4(crc) = 21 bytes
  const chunk = new Uint8Array(21);
  const cdv = new DataView(chunk.buffer);
  cdv.setUint32(0, 9, false);
  chunk.set(typeBytes, 4);
  chunk.set(physData, 8);
  cdv.setUint32(17, crc, false);

  // Insert after 8-byte signature + 25-byte IHDR = offset 33
  const result = new Uint8Array(bytes.length + 21);
  result.set(bytes.slice(0, 33), 0);
  result.set(chunk, 33);
  result.set(bytes.slice(33), 54);

  let out = "";
  for (let i = 0; i < result.length; i++) out += String.fromCharCode(result[i]);
  return btoa(out);
}

function buildStatsAppendix(stats: CardStats): string {
  const parts: string[] = [];
  if (stats.type) parts.push(`Karten-Typ: ${stats.type}`);
  if (stats.hp) parts.push(`HP: exakt '${stats.hp} HP' oben rechts auf der Karte`);
  if (stats.abilityName)
    parts.push(`Fähigkeit: '${stats.abilityName}'${stats.abilityText ? ` – ${stats.abilityText}` : ""}`);
  if (stats.attack1Name)
    parts.push(`Angriff 1: '${stats.attack1Name}'${stats.attack1Damage ? ` – Schaden: ${stats.attack1Damage}` : ""}`);
  if (stats.attack2Name)
    parts.push(`Angriff 2: '${stats.attack2Name}'${stats.attack2Damage ? ` – Schaden: ${stats.attack2Damage}` : ""}`);
  if (parts.length === 0) return "";
  return (
    "\n\nWICHTIGE KARTEN-DETAILS (müssen exakt so auf der Karte erscheinen):\n" +
    parts.map((p) => `• ${p}`).join("\n")
  );
}

function loadGallery(): GalleryCard[] {
  try {
    const raw = localStorage.getItem(GALLERY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGallery(cards: GalleryCard[]) {
  let toSave = [...cards];
  while (toSave.length > 0) {
    try {
      localStorage.setItem(GALLERY_KEY, JSON.stringify(toSave));
      return;
    } catch {
      toSave = toSave.slice(1);
    }
  }
}

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function openPrintWindow(imageBase64: string, mimeType: string) {
  const win = window.open("", "_blank");
  if (!win) {
    alert("Popup wurde blockiert – bitte Pop-ups für diese Seite erlauben.");
    return;
  }
  win.document.write(`<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8"/>
  <title>Karte drucken – My Rookie Card</title>
  <style>
    @page { size: 105mm 148mm; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 105mm; height: 148mm; background: white; display: flex; align-items: center; justify-content: center; }
    .card { width: 63mm; height: 88mm; overflow: hidden; }
    .card img { width: 63mm; height: 88mm; display: block; object-fit: fill; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .hint { position: fixed; bottom: 12px; left: 0; right: 0; text-align: center; font-family: sans-serif; font-size: 11px; color: #666; }
    @media print { .hint { display: none; } }
  </style>
</head>
<body>
  <div class="card"><img src="data:${mimeType};base64,${imageBase64}" alt="My Rookie Card"/></div>
  <p class="hint">Drucker: A6 · Skalierung: 100% (Ist-Größe) · Randlos drucken aktivieren</p>
  <script>window.onload = function() { setTimeout(function() { window.print(); }, 400); };<\/script>
</body>
</html>`);
  win.document.close();
}

function openMultiPrint(cards: PrintCard[], layout: "a4" | "a6") {
  if (cards.length === 0) return;
  const isA4 = layout === "a4";
  const maxCards = isA4 ? 4 : 2;

  const filled = [...cards];
  while (filled.length < maxCards) filled.push(cards[cards.length - 1]);
  const subset = filled.slice(0, maxCards);

  const pageStyle = isA4
    ? "@page { size: 210mm 297mm; margin: 0; }"
    : "@page { size: 148mm 105mm; margin: 0; }";

  const bodyStyle = isA4
    ? "width: 210mm; height: 297mm;"
    : "width: 148mm; height: 105mm;";

  const gridStyle = isA4
    ? "grid-template-columns: 63mm 63mm; grid-template-rows: 88mm 88mm; gap: 5mm;"
    : "grid-template-columns: 63mm 63mm; grid-template-rows: 88mm; gap: 5mm;";

  const hint = isA4
    ? "A4 · 4 Karten · Skalierung 100% · Randlos oder kleinstmöglicher Rand"
    : "A6 quer · 2 Karten nebeneinander · Skalierung 100%";

  const win = window.open("", "_blank");
  if (!win) {
    alert("Popup blockiert – bitte Pop-ups erlauben.");
    return;
  }

  win.document.write(`<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8"/>
  <title>Karten drucken – My Rookie Card</title>
  <style>
    ${pageStyle}
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { background: white; ${bodyStyle} display: flex; align-items: center; justify-content: center; }
    .grid { display: grid; ${gridStyle} }
    .card { width: 63mm; height: 88mm; overflow: hidden; border: 0.3pt solid #ccc; }
    .card img { width: 100%; height: 100%; display: block; object-fit: fill; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .hint { position: fixed; bottom: 8px; left: 0; right: 0; text-align: center; font-family: sans-serif; font-size: 10px; color: #666; }
    @media print { .hint { display: none; } }
  </style>
</head>
<body>
  <div class="grid">
    ${subset
      .map(
        (c) =>
          `<div class="card"><img src="data:${c.mimeType};base64,${c.imageBase64}" alt="${c.label}"/></div>`
      )
      .join("\n    ")}
  </div>
  <p class="hint">${hint}</p>
  <script>window.onload = function() { setTimeout(function() { window.print(); }, 400); };<\/script>
</body>
</html>`);
  win.document.close();
}

async function exportPrintPng(imageBase64: string, mimeType: string, filename: string) {
  return new Promise<void>((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = PRINT_W;
    canvas.height = PRINT_H;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, PRINT_W, PRINT_H);
      const pngBase64 = canvas.toDataURL("image/png").split(",")[1];
      const pngWithDpi = addDpiMetadataToPng(pngBase64, 300);
      const link = document.createElement("a");
      link.href = `data:image/png;base64,${pngWithDpi}`;
      link.download = filename;
      link.click();
      resolve();
    };
    img.src = `data:${mimeType};base64,${imageBase64}`;
  });
}

// ── Sub-components ─────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    "Floral & Natur – Holo-Highlights": "bg-green-900/50 text-green-300 border-green-700",
    "Feuer, Sturm & Elementarkräfte": "bg-orange-900/50 text-orange-300 border-orange-700",
    "Klassische Full-Art Trainerkarten": "bg-rose-900/50 text-rose-300 border-rose-700",
    "Epische TCG-Szenen (MIT Pokémon)": "bg-yellow-900/50 text-yellow-300 border-yellow-700",
    "Ultra Rare & Secret Rare": "bg-purple-900/50 text-purple-300 border-purple-700",
    "Neue Kunststile": "bg-fuchsia-900/50 text-fuchsia-300 border-fuchsia-700",
    "Rückseite": "bg-blue-900/50 text-blue-300 border-blue-700",
  };
  return (
    <span
      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
        colors[category] ?? "bg-slate-800 text-slate-300 border-slate-600"
      }`}
    >
      {category}
    </span>
  );
}

function PromptCard({
  prompt,
  selected,
  onClick,
}: {
  prompt: PromptTemplate;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl border transition-all duration-150 ${
        selected
          ? "border-purple-500 bg-purple-950/60 shadow-lg shadow-purple-900/30"
          : "border-slate-700 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-800/60"
      }`}
    >
      <div className="flex items-start gap-2">
        <span className="text-xl mt-0.5 shrink-0">{prompt.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            {selected && <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />}
            <span className="font-semibold text-sm text-slate-100 leading-tight">{prompt.name}</span>
          </div>
          <p className="text-xs text-slate-400 leading-tight mb-1.5">{prompt.subtitle}</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <CategoryBadge category={prompt.category} />
            {prompt.hasPokemon && (
              <span className="text-[10px] px-1.5 py-0.5 rounded border bg-yellow-900/40 text-yellow-300 border-yellow-700">
                + Pokémon
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-purple-900" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-xl">✨</span>
      </div>
      <div className="text-center">
        <p className="text-purple-300 font-semibold">Karte wird generiert…</p>
        <p className="text-slate-500 text-sm mt-1">Kann 15–40 Sekunden dauern</p>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function Home() {
  const [selectedPrompt, setSelectedPrompt] = useState<PromptTemplate | null>(null);
  const [holderName, setHolderName] = useState("");
  const [pokemonName, setPokemonName] = useState("");
  const [personDescription, setPersonDescription] = useState("");
  const [useReferenceImage, setUseReferenceImage] = useState(false);
  const [referenceImageFile, setReferenceImageFile] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultMimeType, setResultMimeType] = useState("image/png");
  const [autoDescription, setAutoDescription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(CATEGORIES.map((c) => [c, true]))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [exporting, setExporting] = useState(false);

  // Stats editor
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<CardStats>({
    type: "", hp: "", abilityName: "", abilityText: "",
    attack1Name: "", attack1Damage: "", attack2Name: "", attack2Damage: "",
  });

  // Print queue
  const [printQueue, setPrintQueue] = useState<PrintCard[]>([]);

  // Persistent gallery
  const [gallery, setGallery] = useState<GalleryCard[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setGallery(loadGallery());
  }, []);

  const updateStat = (field: keyof CardStats, value: string) =>
    setStats((prev) => ({ ...prev, [field]: value }));

  const filteredPrompts = PROMPTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageUpload = useCallback((file: File) => {
    setReferenceImageFile(file);
    setReferenceImagePreview(URL.createObjectURL(file));
    setAutoDescription(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith("image/")) handleImageUpload(file);
    },
    [handleImageUpload]
  );

  const runGenerate = async () => {
    if (!selectedPrompt || !holderName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      let referenceImageBase64: string | undefined;
      let referenceImageMimeType: string | undefined;

      if (useReferenceImage && referenceImageFile) {
        const { base64, mimeType } = await fileToBase64(referenceImageFile);
        referenceImageBase64 = base64;
        referenceImageMimeType = mimeType;
      }

      const statsAppendix = buildStatsAppendix(stats);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptId: selectedPrompt.id,
          holderName: holderName.trim(),
          pokemonName: pokemonName.trim(),
          personDescription: useReferenceImage ? personDescription.trim() : "",
          referenceImageBase64,
          referenceImageMimeType,
          statsAppendix,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Fehler bei der Generierung.");
        return;
      }

      setResultImage(data.imageBase64);
      setResultMimeType(data.mimeType || "image/png");
      if (data.personDescription) setAutoDescription(data.personDescription);

      setHistory((prev) => [
        {
          imageBase64: data.imageBase64,
          mimeType: data.mimeType || "image/png",
          promptName: selectedPrompt.name,
          holderName: holderName.trim(),
          pokemonName: pokemonName.trim(),
        },
        ...prev.slice(0, 7),
      ]);

      // Save to persistent gallery
      const newCard: GalleryCard = {
        id: uid(),
        timestamp: Date.now(),
        imageBase64: data.imageBase64,
        mimeType: data.mimeType || "image/png",
        promptName: selectedPrompt.name,
        holderName: holderName.trim(),
        pokemonName: pokemonName.trim(),
      };
      setGallery((prev) => {
        const updated = [newCard, ...prev].slice(0, MAX_GALLERY);
        saveGallery(updated);
        return updated;
      });
    } catch (err: any) {
      setError(err.message || "Netzwerkfehler");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedPrompt) { setError("Bitte wähle zuerst ein Design aus."); return; }
    if (!holderName.trim()) { setError("Bitte gib den Namen der Person ein."); return; }
    if (selectedPrompt.hasPokemon && !pokemonName.trim()) {
      setError("Dieses Design benötigt einen Pokémon-Namen."); return;
    }
    if (useReferenceImage && !referenceImageFile && !personDescription.trim()) {
      setError("Bitte lade ein Referenzbild hoch oder gib eine Personenbeschreibung ein."); return;
    }
    await runGenerate();
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const ext = resultMimeType.includes("png") ? "png" : "jpg";
    const link = document.createElement("a");
    link.href = `data:${resultMimeType};base64,${resultImage}`;
    link.download = `${holderName || "karte"}_${selectedPrompt?.id ?? ""}.${ext}`;
    link.click();
  };

  const handlePrint = () => {
    if (!resultImage) return;
    openPrintWindow(resultImage, resultMimeType);
  };

  const handleExportPrint = async () => {
    if (!resultImage) return;
    setExporting(true);
    await exportPrintPng(
      resultImage,
      resultMimeType,
      `${holderName || "karte"}_63x88mm_300dpi.png`
    );
    setExporting(false);
  };

  const addToPrintQueue = () => {
    if (!resultImage) return;
    const card: PrintCard = {
      id: uid(),
      imageBase64: resultImage,
      mimeType: resultMimeType,
      label: `${holderName}${selectedPrompt ? ` · ${selectedPrompt.name}` : ""}`,
    };
    setPrintQueue((prev) => [...prev, card].slice(-8));
  };

  const removeFromQueue = (id: string) =>
    setPrintQueue((prev) => prev.filter((c) => c.id !== id));

  const clearGallery = () => {
    saveGallery([]);
    setGallery([]);
  };

  const toggleCategory = (cat: string) =>
    setOpenCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));

  const canGenerate = selectedPrompt && holderName.trim() && !loading;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-slate-800 bg-[#09090f]/95 backdrop-blur px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🃏</span>
          <div>
            <h1 className="text-xl font-bold text-yellow-400 tracking-tight">My Rookie Card</h1>
            <p className="text-xs text-slate-400">Personalisierter TCG-Kartengenerator · Druck auf A4 / A6 / 63×88 mm</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
            <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">
              {PROMPTS.length} Designs
            </span>
          </div>
        </div>
      </header>

      {/* Main 3-column layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left column: Prompt selector ── */}
        <aside className="w-80 shrink-0 border-r border-slate-800 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-800">
            <input
              type="text"
              placeholder="Design suchen…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {searchQuery ? (
              <div className="space-y-2">
                {filteredPrompts.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">Keine Designs gefunden</p>
                ) : (
                  filteredPrompts.map((p) => (
                    <PromptCard
                      key={p.id}
                      prompt={p}
                      selected={selectedPrompt?.id === p.id}
                      onClick={() => {
                        setSelectedPrompt(p);
                        if (!p.hasPokemon) setPokemonName("");
                        setError(null);
                      }}
                    />
                  ))
                )}
              </div>
            ) : (
              CATEGORIES.map((cat) => {
                const prompts = PROMPTS.filter((p) => p.category === cat);
                if (prompts.length === 0) return null;
                const isOpen = openCategories[cat];
                return (
                  <div key={cat}>
                    <button
                      onClick={() => toggleCategory(cat)}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-widest hover:text-slate-200 transition-colors"
                    >
                      <span>
                        {cat}{" "}
                        <span className="text-slate-600 normal-case tracking-normal font-normal">
                          ({prompts.length})
                        </span>
                      </span>
                      <span className="text-slate-600">{isOpen ? "▲" : "▼"}</span>
                    </button>
                    {isOpen && (
                      <div className="space-y-1.5 mt-1">
                        {prompts.map((p) => (
                          <PromptCard
                            key={p.id}
                            prompt={p}
                            selected={selectedPrompt?.id === p.id}
                            onClick={() => {
                              setSelectedPrompt(p);
                              if (!p.hasPokemon) setPokemonName("");
                              setError(null);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* ── Middle column: Form ── */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-lg mx-auto space-y-5">

            {/* Selected prompt info */}
            {selectedPrompt ? (
              <div
                className={`p-4 rounded-xl bg-gradient-to-r ${selectedPrompt.color} bg-opacity-10 border border-slate-700`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedPrompt.icon}</span>
                  <div>
                    <h2 className="font-bold text-slate-100">{selectedPrompt.name}</h2>
                    <p className="text-sm text-slate-300">{selectedPrompt.subtitle}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-slate-700 text-center">
                <p className="text-slate-500 text-sm">← Wähle links ein Design aus</p>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                Name der Person <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="z.B. Kevin"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
              />
            </div>

            {/* Pokemon Name */}
            {selectedPrompt?.hasPokemon && (
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                  Pokémon / Kreatur <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="z.B. Glumanda  –  oder neutral: Feuer-Eidechse"
                  value={pokemonName}
                  onChange={(e) => setPokemonName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                />
                <p className="text-xs text-yellow-600 mt-1.5 flex items-start gap-1">
                  <span className="mt-0.5">⚠</span>
                  <span>
                    Bei Content-Filter-Problemen neutrale Begriffe verwenden (z.B. &quot;Feuer-Echse&quot; statt Markennamen)
                  </span>
                </p>
              </div>
            )}

            {/* Reference Image Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-700">
              <div>
                <p className="font-semibold text-slate-200 text-sm">Referenzfoto verwenden</p>
                <p className="text-xs text-slate-400 mt-0.5">Gesicht der Person für bessere Ähnlichkeit</p>
              </div>
              <button
                onClick={() => {
                  setUseReferenceImage(!useReferenceImage);
                  if (useReferenceImage) {
                    setReferenceImageFile(null);
                    setReferenceImagePreview(null);
                    setPersonDescription("");
                  }
                }}
                className={`w-12 h-6 rounded-full transition-all duration-200 relative shrink-0 ${
                  useReferenceImage ? "bg-purple-600" : "bg-slate-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${
                    useReferenceImage ? "left-6" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Reference image section */}
            {useReferenceImage && (
              <div className="space-y-4">
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-950/10 transition-all"
                >
                  {referenceImagePreview ? (
                    <div className="flex items-center gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={referenceImagePreview}
                        alt="Referenz"
                        className="w-16 h-16 object-cover rounded-lg border border-slate-600"
                      />
                      <div className="text-left">
                        <p className="text-sm text-slate-200 font-medium">{referenceImageFile?.name}</p>
                        <p className="text-xs text-slate-400">Klicken zum Ändern</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="text-3xl block mb-2">📷</span>
                      <p className="text-slate-300 text-sm font-medium">Foto hochladen</p>
                      <p className="text-slate-500 text-xs mt-1">Drag & Drop oder klicken · JPG, PNG, WEBP</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImageUpload(f);
                  }}
                />

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                    Personenbeschreibung
                    <span className="text-slate-500 font-normal ml-1.5">
                      (optional – wird sonst aus Foto generiert)
                    </span>
                  </label>
                  <textarea
                    placeholder="z.B. Junger Mann mit kurzen dunklen Haaren, braunen Augen, leichtem Bart…"
                    value={personDescription}
                    onChange={(e) => setPersonDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 resize-none text-sm"
                  />
                </div>

                {autoDescription && (
                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                    <p className="text-xs font-semibold text-slate-400 mb-1">✨ Auto-Beschreibung aus Foto:</p>
                    <p className="text-xs text-slate-300">{autoDescription}</p>
                  </div>
                )}
              </div>
            )}

            {/* Card Stats Editor */}
            <div className="rounded-xl border border-slate-700 overflow-hidden">
              <button
                onClick={() => setShowStats(!showStats)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-900 hover:bg-slate-800/80 transition-colors"
              >
                <span className="font-semibold text-sm text-slate-200">
                  🎯 Karten-Stats
                  {(stats.hp || stats.type || stats.attack1Name) && (
                    <span className="ml-2 text-xs text-purple-400 font-normal">• aktiv</span>
                  )}
                </span>
                <span className="text-slate-500 text-xs">{showStats ? "▲ schließen" : "▼ öffnen"}</span>
              </button>

              {showStats && (
                <div className="p-4 bg-slate-950 space-y-3 border-t border-slate-700">
                  <p className="text-xs text-slate-500">
                    Diese Werte werden dem Prompt angehängt. Der Bildgenerator versucht sie einzubauen.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Typ</label>
                      <select
                        value={stats.type}
                        onChange={(e) => updateStat("type", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                      >
                        <option value="">– Kein Typ –</option>
                        {POKEMON_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">HP</label>
                      <input
                        type="number"
                        placeholder="z.B. 80"
                        value={stats.hp}
                        onChange={(e) => updateStat("hp", e.target.value)}
                        min="10"
                        max="999"
                        step="10"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Fähigkeit (Name)</label>
                    <input
                      type="text"
                      placeholder="z.B. Schutzschild der Natur"
                      value={stats.abilityName}
                      onChange={(e) => updateStat("abilityName", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Fähigkeit (Beschreibung)
                    </label>
                    <input
                      type="text"
                      placeholder="z.B. Einmal pro Runde: schütze einen deiner Pokémon vor Schaden"
                      value={stats.abilityText}
                      onChange={(e) => updateStat("abilityText", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-[1fr_80px] gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Angriff 1</label>
                      <input
                        type="text"
                        placeholder="z.B. Flammen-Stoß"
                        value={stats.attack1Name}
                        onChange={(e) => updateStat("attack1Name", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Schaden</label>
                      <input
                        type="text"
                        placeholder="60"
                        value={stats.attack1Damage}
                        onChange={(e) => updateStat("attack1Damage", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_80px] gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Angriff 2</label>
                      <input
                        type="text"
                        placeholder="z.B. Inferno"
                        value={stats.attack2Name}
                        onChange={(e) => updateStat("attack2Name", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Schaden</label>
                      <input
                        type="text"
                        placeholder="120"
                        value={stats.attack2Damage}
                        onChange={(e) => updateStat("attack2Damage", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-sm space-y-1">
                <p>
                  <span className="font-semibold">Fehler:</span> {error}
                </p>
                {error.toLowerCase().includes("filter") || error.toLowerCase().includes("content") ? (
                  <p className="text-red-400 text-xs">
                    💡 Tipp: Pokémon-Namen neutraler formulieren, Referenzbild deaktivieren oder anderen Stil wählen.
                  </p>
                ) : null}
              </div>
            )}

            {/* Generate + Retry */}
            <div className="flex gap-2">
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={`flex-1 py-4 rounded-xl font-bold text-base transition-all duration-200 ${
                  canGenerate
                    ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-lg active:scale-[0.98]"
                    : "bg-slate-800 text-slate-600 cursor-not-allowed"
                }`}
              >
                {loading ? "Wird generiert…" : "✨ Karte generieren"}
              </button>
              {resultImage && !loading && (
                <button
                  onClick={runGenerate}
                  title="Nochmal generieren (gleiche Einstellungen)"
                  className="px-4 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors font-bold"
                >
                  🔄
                </button>
              )}
            </div>

            {/* Prompt preview */}
            {selectedPrompt && (
              <details className="group">
                <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-400 select-none">
                  Prompt-Vorschau anzeigen
                </summary>
                <pre className="mt-2 p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 whitespace-pre-wrap leading-relaxed overflow-auto max-h-48">
                  {selectedPrompt.template
                    .replace(/\[HOLDER_NAME\]/g, holderName || "[NAME]")
                    .replace(/\[POKEMON_NAME\]/g, pokemonName || "[POKÉMON]")
                    .replace(/\[FOTO_BESCHREIBUNG_DER_PERSON\]/g, personDescription || "[BESCHREIBUNG]")}
                  {buildStatsAppendix(stats)}
                </pre>
              </details>
            )}
          </div>
        </main>

        {/* ── Right column: Result + Print queue + Gallery ── */}
        <aside className="w-96 shrink-0 border-l border-slate-800 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-slate-200 text-sm">Generiertes Bild</h3>
            {resultImage && (
              <button
                onClick={handleDownload}
                title="PNG herunterladen"
                className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-300 hover:text-white transition-colors"
              >
                ⬇ PNG
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Result area */}
            <div className="p-4 space-y-3">
              {loading ? (
                <LoadingSpinner />
              ) : resultImage ? (
                <>
                  {/* Card preview */}
                  <div className="card-aspect w-full max-w-[240px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`data:${resultMimeType};base64,${resultImage}`}
                      alt="Generierte Karte"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <p className="text-center text-xs text-slate-500">
                    {selectedPrompt?.name} · {holderName}
                    {pokemonName && ` & ${pokemonName}`}
                  </p>

                  {/* Action buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={handlePrint}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      🖨️ Einzeln drucken (A6 · 63×88 mm)
                    </button>

                    <button
                      onClick={addToPrintQueue}
                      className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-purple-700/50 text-purple-300 hover:text-purple-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      + Zur Druckliste hinzufügen
                    </button>

                    <button
                      onClick={handleExportPrint}
                      disabled={exporting}
                      className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      {exporting ? "Exportiere…" : "💾 PNG Druckgröße (300 DPI · 744×1039 px)"}
                    </button>

                    <button
                      onClick={handleDownload}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 text-sm transition-all"
                    >
                      ⬇ Web-Qualität herunterladen
                    </button>
                  </div>

                  {/* Print info */}
                  <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-900/50 text-xs text-blue-300 space-y-1">
                    <p className="font-semibold text-blue-200">📐 Druckanleitung</p>
                    <p>1. Papierformat: <strong>A6 (105×148mm)</strong> oder A4</p>
                    <p>2. Skalierung: <strong>100% (Ist-Größe)</strong></p>
                    <p>3. Ränder: <strong>Randlos</strong> (wenn möglich)</p>
                    <p>4. Ergebnis: Karte exakt <strong>63×88 mm</strong></p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center gap-3">
                  <div className="w-20 h-28 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center">
                    <span className="text-4xl opacity-30">🃏</span>
                  </div>
                  <p className="text-slate-500 text-sm">Hier erscheint deine Karte</p>
                </div>
              )}

              {/* Session history */}
              {history.length > 1 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                    Sitzungs-Verlauf
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {history.slice(1).map((entry, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setResultImage(entry.imageBase64);
                          setResultMimeType(entry.mimeType);
                        }}
                        className="relative group rounded-lg overflow-hidden border border-slate-700 hover:border-purple-500 transition-all"
                        title={`${entry.promptName} · ${entry.holderName}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`data:${entry.mimeType};base64,${entry.imageBase64}`}
                          alt={entry.promptName}
                          className="w-full aspect-[5/7] object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Print queue */}
            {printQueue.length > 0 && (
              <div className="border-t border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
                    Druckliste ({printQueue.length})
                  </p>
                  <button
                    onClick={() => setPrintQueue([])}
                    className="text-xs text-slate-600 hover:text-red-400 transition-colors"
                  >
                    Leeren
                  </button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {printQueue.map((c) => (
                    <div key={c.id} className="relative shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`data:${c.mimeType};base64,${c.imageBase64}`}
                        alt={c.label}
                        className="w-10 h-14 object-cover rounded border border-slate-600"
                        title={c.label}
                      />
                      <button
                        onClick={() => removeFromQueue(c.id)}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-800 hover:bg-red-600 text-white text-[10px] flex items-center justify-center leading-none transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openMultiPrint(printQueue, "a6")}
                    className="py-2.5 rounded-lg bg-indigo-800 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    🖨️ A6 quer · 2 Karten
                  </button>
                  <button
                    onClick={() => openMultiPrint(printQueue, "a4")}
                    className="py-2.5 rounded-lg bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    🖨️ A4 · 4 Karten
                  </button>
                </div>

                <p className="text-[10px] text-slate-600">
                  Bei weniger als 2/4 Karten wird die letzte Karte wiederholt.
                </p>
              </div>
            )}

            {/* Persistent gallery */}
            {gallery.length > 0 && (
              <div className="border-t border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
                    Galerie ({gallery.length}/{MAX_GALLERY})
                  </p>
                  <button
                    onClick={clearGallery}
                    className="text-xs text-slate-600 hover:text-red-400 transition-colors"
                  >
                    Alles löschen
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {gallery.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => {
                        setResultImage(card.imageBase64);
                        setResultMimeType(card.mimeType);
                      }}
                      className="relative group rounded-lg overflow-hidden border border-slate-700 hover:border-purple-500 transition-all"
                      title={`${card.promptName} · ${card.holderName}${card.pokemonName ? ` & ${card.pokemonName}` : ""}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`data:${card.mimeType};base64,${card.imageBase64}`}
                        alt={card.promptName}
                        className="w-full aspect-[5/7] object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-600">
                  Gespeichert im Browser-Speicher · max. {MAX_GALLERY} Karten
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
