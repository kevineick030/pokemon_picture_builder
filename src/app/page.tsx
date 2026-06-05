"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { PROMPTS, CATEGORIES, type PromptTemplate } from "@/data/prompts";
import { addDpiMetadataToPng } from "@/lib/zip-png";
import BatchPanel from "@/components/BatchPanel";

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

interface GenerateResult {
  imageBase64: string;
  mimeType: string;
  personDescription: string;
}

type ActiveTab = "designs" | "form" | "result";

// ── Constants ──────────────────────────────────────────────────────────────

const POKEMON_TYPES = [
  "Feuer", "Wasser", "Gras", "Elektro", "Psycho", "Kampf",
  "Dunkel", "Stahl", "Eis", "Drachen", "Fee", "Normal",
  "Gift", "Boden", "Flug", "Gestein", "Käfer", "Geist",
];

// Each type maps to: emoji for UI, glow color for card preview, and palette description for prompt
const TYPE_CONFIG: Record<string, { emoji: string; glow: string; palette: string }> = {
  Feuer:   { emoji: "🔥", glow: "rgba(234,88,12,0.55)",    palette: "dominating warm fire palette: deep crimson red, molten orange, golden ember glow, charcoal edges" },
  Wasser:  { emoji: "💧", glow: "rgba(37,99,235,0.55)",    palette: "cool water palette: deep ocean blue, cyan shimmer, seafoam highlights, silver ripple" },
  Gras:    { emoji: "🌿", glow: "rgba(22,163,74,0.55)",    palette: "lush nature palette: forest emerald, spring leaf highlights, golden sunlight rays, earthy brown accents" },
  Elektro: { emoji: "⚡", glow: "rgba(234,179,8,0.55)",    palette: "electric palette: brilliant yellow, lightning white flash, electric blue sparks, charged gold" },
  Psycho:  { emoji: "🔮", glow: "rgba(219,39,119,0.55)",   palette: "psychic palette: hot magenta pink, deep violet, iridescent cosmic shimmer, ethereal starlight" },
  Kampf:   { emoji: "👊", glow: "rgba(185,28,28,0.55)",    palette: "fighting palette: warrior crimson, burnt sienna, bronze gold, ash grey smoke" },
  Dunkel:  { emoji: "🌑", glow: "rgba(88,28,135,0.55)",    palette: "dark palette: obsidian black, deep shadow violet, midnight indigo, barely-visible dark red" },
  Stahl:   { emoji: "⚙️", glow: "rgba(148,163,184,0.55)", palette: "steel palette: metallic chrome silver, iron grey, titanium white gleam, industrial navy" },
  Eis:     { emoji: "❄️", glow: "rgba(125,211,252,0.55)", palette: "ice palette: arctic frost white, pale sky blue, crystal-clear shimmer, snow diamond sparkle" },
  Drachen: { emoji: "🐉", glow: "rgba(99,102,241,0.55)",   palette: "dragon palette: royal indigo, deep violet, ancient jade green accents, draconic gold trim" },
  Fee:     { emoji: "✨", glow: "rgba(244,114,182,0.55)",  palette: "fairy palette: soft pastel pink, rose gold shimmer, lavender mist, magical sparkle white" },
  Normal:  { emoji: "⭐", glow: "rgba(156,163,175,0.55)",  palette: "neutral palette: warm cream, soft grey, gentle amber highlights, clean ivory" },
  Gift:    { emoji: "☠️", glow: "rgba(147,51,234,0.55)",  palette: "poison palette: toxic purple, acid green accents, dark magenta, venomous black-violet" },
  Boden:   { emoji: "🏔️", glow: "rgba(180,83,9,0.55)",   palette: "ground palette: earthy terracotta, sandy desert yellow, stone grey, dry canyon brown" },
  Flug:    { emoji: "🌬️", glow: "rgba(56,189,248,0.55)", palette: "flying palette: open sky blue, cloud white, breezy cyan, twilight horizon purple" },
  Gestein: { emoji: "🪨", glow: "rgba(120,113,108,0.55)", palette: "rock palette: rough granite grey, warm sandstone, dark obsidian, mineral shimmer" },
  Käfer:   { emoji: "🐛", glow: "rgba(101,163,13,0.55)",  palette: "bug palette: iridescent chitin green, forest canopy brown, sunlit lime, deep forest shadow" },
  Geist:   { emoji: "👻", glow: "rgba(109,40,217,0.55)",  palette: "ghost palette: spectral pale violet, ethereal mist white, phantom blue-grey, soul-light glow" },
};

const GALLERY_KEY = "mrc_gallery";
const MAX_GALLERY = 12;
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

function buildStatsAppendix(stats: CardStats): string {
  const parts: string[] = [];
  if (stats.type) {
    const tc = TYPE_CONFIG[stats.type];
    parts.push(
      `Karten-Typ: ${stats.type}${tc ? ` ${tc.emoji}` : ""}`
        + (tc ? ` – Farbpalette: ${tc.palette}` : "")
    );
  }
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
  } catch { return []; }
}

function saveGallery(cards: GalleryCard[]) {
  let toSave = [...cards];
  while (toSave.length > 0) {
    try { localStorage.setItem(GALLERY_KEY, JSON.stringify(toSave)); return; }
    catch { toSave = toSave.slice(1); }
  }
}

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function openPrintWindow(imageBase64: string, mimeType: string) {
  const win = window.open("", "_blank");
  if (!win) { alert("Popup blockiert – bitte Pop-ups erlauben."); return; }
  win.document.write(`<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"/>
<style>@page{size:105mm 148mm;margin:0}*{margin:0;padding:0;box-sizing:border-box}
html,body{width:105mm;height:148mm;background:white;display:flex;align-items:center;justify-content:center}
.card{width:63mm;height:88mm;overflow:hidden}.card img{width:63mm;height:88mm;display:block;object-fit:fill;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.hint{position:fixed;bottom:12px;left:0;right:0;text-align:center;font-family:sans-serif;font-size:11px;color:#666}
@media print{.hint{display:none}}</style></head>
<body><div class="card"><img src="data:${mimeType};base64,${imageBase64}"/></div>
<p class="hint">A6 · 100% Skalierung · Randlos</p>
<script>window.onload=()=>setTimeout(()=>window.print(),400)<\/script></body></html>`);
  win.document.close();
}

function openMultiPrint(cards: PrintCard[], layout: "a4" | "a6") {
  if (cards.length === 0) return;
  const isA4 = layout === "a4";
  const maxCards = isA4 ? 4 : 2;
  const filled = [...cards];
  while (filled.length < maxCards) filled.push(cards[cards.length - 1]);
  const subset = filled.slice(0, maxCards);
  const pageStyle = isA4 ? "@page{size:210mm 297mm;margin:0}" : "@page{size:148mm 105mm;margin:0}";
  const bodyStyle = isA4 ? "width:210mm;height:297mm" : "width:148mm;height:105mm";
  const gridStyle = isA4
    ? "grid-template-columns:63mm 63mm;grid-template-rows:88mm 88mm;gap:5mm"
    : "grid-template-columns:63mm 63mm;grid-template-rows:88mm;gap:5mm";
  const hint = isA4 ? "A4 · 4 Karten · 100% · Randlos" : "A6 quer · 2 Karten · 100%";
  const win = window.open("", "_blank");
  if (!win) { alert("Popup blockiert."); return; }
  win.document.write(`<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"/>
<style>${pageStyle}*{margin:0;padding:0;box-sizing:border-box}html,body{background:white;${bodyStyle};display:flex;align-items:center;justify-content:center}
.grid{display:grid;${gridStyle}}.card{width:63mm;height:88mm;overflow:hidden;border:.3pt solid #ccc}
.card img{width:100%;height:100%;display:block;object-fit:fill;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.hint{position:fixed;bottom:8px;left:0;right:0;text-align:center;font-family:sans-serif;font-size:10px;color:#666}
@media print{.hint{display:none}}</style></head>
<body><div class="grid">${subset.map((c) => `<div class="card"><img src="data:${c.mimeType};base64,${c.imageBase64}"/></div>`).join("")}</div>
<p class="hint">${hint}</p>
<script>window.onload=()=>setTimeout(()=>window.print(),400)<\/script></body></html>`);
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
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${colors[category] ?? "bg-slate-800 text-slate-300 border-slate-600"}`}>
      {category}
    </span>
  );
}

function PromptCard({ prompt, selected, onClick }: { prompt: PromptTemplate; selected: boolean; onClick: () => void }) {
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

function LoadingSpinner({ label = "Karte wird generiert…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-purple-900" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-xl">✨</span>
      </div>
      <div className="text-center">
        <p className="text-purple-300 font-semibold">{label}</p>
        <p className="text-slate-500 text-sm mt-1">Kann 15–40 Sekunden dauern</p>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function Home() {
  // Core form state
  const [selectedPrompt, setSelectedPrompt] = useState<PromptTemplate | null>(null);
  const [holderName, setHolderName] = useState("");
  const [pokemonName, setPokemonName] = useState("");
  const [personDescription, setPersonDescription] = useState("");
  const [useReferenceImage, setUseReferenceImage] = useState(false);
  const [referenceImageFile, setReferenceImageFile] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);

  // Result state
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultMimeType, setResultMimeType] = useState("image/png");
  const [autoDescription, setAutoDescription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Variant mode
  const [variantMode, setVariantMode] = useState(false);
  const [variants, setVariants] = useState<GenerateResult[] | null>(null);
  const [variantLoading, setVariantLoading] = useState(false);

  // Stats editor
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<CardStats>({
    type: "", hp: "", abilityName: "", abilityText: "",
    attack1Name: "", attack1Damage: "", attack2Name: "", attack2Damage: "",
  });

  // Editable prompt
  const [showPromptPreview, setShowPromptPreview] = useState(false);
  const [customPrompt, setCustomPrompt] = useState<string | null>(null);

  // History + gallery + print queue
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [gallery, setGallery] = useState<GalleryCard[]>([]);
  const [printQueue, setPrintQueue] = useState<PrintCard[]>([]);

  // UI state
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(CATEGORIES.map((c) => [c, true]))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [exporting, setExporting] = useState(false);
  const [showBatch, setShowBatch] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("form");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setGallery(loadGallery()); }, []);

  const updateStat = (field: keyof CardStats, value: string) =>
    setStats((prev) => ({ ...prev, [field]: value }));

  const filteredPrompts = PROMPTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Assembled prompt text (used for preview and as seed for customPrompt)
  const assembledPromptText = selectedPrompt
    ? selectedPrompt.template
        .replace(/\[HOLDER_NAME\]/g, holderName || "[NAME]")
        .replace(/\[POKEMON_NAME\]/g, pokemonName || "[POKÉMON]")
        .replace(
          /\[FOTO_BESCHREIBUNG_DER_PERSON\]/g,
          personDescription || autoDescription || "[BESCHREIBUNG]"
        ) + buildStatsAppendix(stats)
    : "";

  const typeGlow = stats.type ? TYPE_CONFIG[stats.type]?.glow : undefined;

  // ── API call helper ──────────────────────────────────────────────────────

  const callGenerateApi = async (): Promise<GenerateResult> => {
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
        promptId: selectedPrompt!.id,
        holderName: holderName.trim(),
        pokemonName: pokemonName.trim(),
        personDescription: useReferenceImage ? personDescription.trim() : "",
        referenceImageBase64,
        referenceImageMimeType,
        statsAppendix,
        ...(customPrompt != null ? { finalPromptOverride: customPrompt } : {}),
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Fehler bei der Generierung.");
    return {
      imageBase64: data.imageBase64,
      mimeType: data.mimeType || "image/png",
      personDescription: data.personDescription || "",
    };
  };

  const persistResult = (result: GenerateResult) => {
    setResultImage(result.imageBase64);
    setResultMimeType(result.mimeType);
    if (result.personDescription) setAutoDescription(result.personDescription);
    setHistory((prev) => [
      { imageBase64: result.imageBase64, mimeType: result.mimeType,
        promptName: selectedPrompt?.name ?? "", holderName: holderName.trim(), pokemonName: pokemonName.trim() },
      ...prev.slice(0, 7),
    ]);
    setGallery((prev) => {
      const updated = [
        { id: uid(), timestamp: Date.now(), imageBase64: result.imageBase64, mimeType: result.mimeType,
          promptName: selectedPrompt?.name ?? "", holderName: holderName.trim(), pokemonName: pokemonName.trim() },
        ...prev,
      ].slice(0, MAX_GALLERY);
      saveGallery(updated);
      return updated;
    });
    setActiveTab("result");
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleImageUpload = useCallback((file: File) => {
    setReferenceImageFile(file);
    setReferenceImagePreview(URL.createObjectURL(file));
    setAutoDescription(null);
    setCustomPrompt(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleImageUpload(file);
  }, [handleImageUpload]);

  const validate = (): string | null => {
    if (!selectedPrompt) return "Bitte wähle zuerst ein Design aus.";
    if (!holderName.trim()) return "Bitte gib den Namen der Person ein.";
    if (selectedPrompt.hasPokemon && !pokemonName.trim()) return "Dieses Design benötigt einen Pokémon-Namen.";
    if (useReferenceImage && !referenceImageFile && !personDescription.trim())
      return "Bitte lade ein Referenzbild hoch oder gib eine Personenbeschreibung ein.";
    return null;
  };

  const runGenerate = async () => {
    setLoading(true);
    setError(null);
    setVariants(null);
    try {
      const result = await callGenerateApi();
      persistResult(result);
    } catch (err: any) {
      setError(err.message || "Netzwerkfehler");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    await runGenerate();
  };

  const runVariants = async () => {
    setVariantLoading(true);
    setError(null);
    setVariants(null);
    setResultImage(null);
    try {
      const [v1, v2] = await Promise.all([callGenerateApi(), callGenerateApi()]);
      setVariants([v1, v2]);
      setActiveTab("result");
    } catch (err: any) {
      setError(err.message || "Netzwerkfehler");
    } finally {
      setVariantLoading(false);
    }
  };

  const handleGenerateVariants = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    await runVariants();
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const ext = resultMimeType.includes("png") ? "png" : "jpg";
    const link = document.createElement("a");
    link.href = `data:${resultMimeType};base64,${resultImage}`;
    link.download = `${holderName || "karte"}_${selectedPrompt?.id ?? ""}.${ext}`;
    link.click();
  };

  const handleExportPrint = async () => {
    if (!resultImage) return;
    setExporting(true);
    await exportPrintPng(resultImage, resultMimeType, `${holderName || "karte"}_63x88mm_300dpi.png`);
    setExporting(false);
  };

  const addToPrintQueue = () => {
    if (!resultImage) return;
    setPrintQueue((prev) =>
      [...prev, { id: uid(), imageBase64: resultImage, mimeType: resultMimeType,
        label: `${holderName}${selectedPrompt ? ` · ${selectedPrompt.name}` : ""}` }].slice(-8)
    );
  };

  const toggleCategory = (cat: string) =>
    setOpenCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));

  const isLoading = loading || variantLoading;
  const canGenerate = !!(selectedPrompt && holderName.trim() && !isLoading);

  // ── Shared card preview with type glow ────────────────────────────────────

  const cardStyle: React.CSSProperties = typeGlow
    ? { boxShadow: `0 0 22px ${typeGlow}, 0 0 44px ${typeGlow.replace("0.55", "0.2")}`,
        border: `1px solid ${typeGlow.replace("0.55", "0.7")}` }
    : {};

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {showBatch && (
        <BatchPanel selectedPrompt={selectedPrompt} stats={stats} onClose={() => setShowBatch(false)} />
      )}

      <div className="flex flex-col h-screen overflow-hidden">

        {/* Header */}
        <header className="shrink-0 border-b border-slate-800 bg-[#09090f]/95 backdrop-blur px-4 lg:px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🃏</span>
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-yellow-400 tracking-tight">My Rookie Card</h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                TCG-Kartengenerator · A4/A6/63×88 mm
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setShowBatch(true)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors hidden sm:block"
              >
                📋 Batch
              </button>
              <span className="text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-500">
                {PROMPTS.length} Designs
              </span>
            </div>
          </div>
        </header>

        {/* 3-column layout (desktop) / tab-based (mobile) */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Left column: Design selector ── */}
          <aside
            className={`border-r border-slate-800 flex flex-col overflow-hidden
              w-full lg:w-80 lg:shrink-0
              ${activeTab === "designs" ? "flex" : "hidden"} lg:flex`}
          >
            <div className="p-3 border-b border-slate-800">
              <input
                type="text"
                placeholder="Design suchen…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 pb-20 lg:pb-3">
              {searchQuery ? (
                <div className="space-y-2">
                  {filteredPrompts.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-4">Keine Designs gefunden</p>
                  ) : (
                    filteredPrompts.map((p) => (
                      <PromptCard key={p.id} prompt={p} selected={selectedPrompt?.id === p.id}
                        onClick={() => { setSelectedPrompt(p); if (!p.hasPokemon) setPokemonName(""); setError(null); setCustomPrompt(null); setActiveTab("form"); }} />
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
                        <span>{cat} <span className="text-slate-600 normal-case tracking-normal font-normal">({prompts.length})</span></span>
                        <span className="text-slate-600">{isOpen ? "▲" : "▼"}</span>
                      </button>
                      {isOpen && (
                        <div className="space-y-1.5 mt-1">
                          {prompts.map((p) => (
                            <PromptCard key={p.id} prompt={p} selected={selectedPrompt?.id === p.id}
                              onClick={() => { setSelectedPrompt(p); if (!p.hasPokemon) setPokemonName(""); setError(null); setCustomPrompt(null); setActiveTab("form"); }} />
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
          <main
            className={`flex-1 overflow-y-auto
              w-full
              ${activeTab === "form" ? "block" : "hidden"} lg:block`}
          >
            <div className="max-w-lg mx-auto p-4 lg:p-6 space-y-5 pb-24 lg:pb-8">

              {/* Selected design banner */}
              {selectedPrompt ? (
                <div className={`p-4 rounded-xl bg-gradient-to-r ${selectedPrompt.color} bg-opacity-10 border border-slate-700`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedPrompt.icon}</span>
                    <div>
                      <h2 className="font-bold text-slate-100">{selectedPrompt.name}</h2>
                      <p className="text-sm text-slate-300">{selectedPrompt.subtitle}</p>
                    </div>
                    <button onClick={() => setActiveTab("designs")} className="ml-auto lg:hidden text-xs text-purple-400 border border-purple-700 rounded-lg px-2 py-1">
                      Ändern
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setActiveTab("designs")}
                  className="w-full p-4 rounded-xl border border-dashed border-slate-700 text-center hover:border-purple-600 transition-colors"
                >
                  <p className="text-slate-400 text-sm">🎨 Design auswählen</p>
                </button>
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
                    <span>Bei Content-Filter-Problemen neutrale Begriffe verwenden</span>
                  </p>
                </div>
              )}

              {/* Reference image toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-700">
                <div>
                  <p className="font-semibold text-slate-200 text-sm">Referenzfoto verwenden</p>
                  <p className="text-xs text-slate-400 mt-0.5">Gesicht für bessere Ähnlichkeit</p>
                </div>
                <button
                  onClick={() => {
                    setUseReferenceImage(!useReferenceImage);
                    if (useReferenceImage) { setReferenceImageFile(null); setReferenceImagePreview(null); setPersonDescription(""); }
                  }}
                  className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${useReferenceImage ? "bg-purple-600" : "bg-slate-700"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${useReferenceImage ? "left-6" : "left-0.5"}`} />
                </button>
              </div>

              {/* Reference image upload */}
              {useReferenceImage && (
                <div className="space-y-3">
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-600 rounded-xl p-5 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-950/10 transition-all"
                  >
                    {referenceImagePreview ? (
                      <div className="flex items-center gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={referenceImagePreview} alt="Referenz" className="w-14 h-14 object-cover rounded-lg border border-slate-600" />
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
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />

                  <textarea
                    placeholder="Personenbeschreibung (optional – sonst aus Foto generiert)"
                    value={personDescription}
                    onChange={(e) => setPersonDescription(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 resize-none text-sm"
                  />

                  {autoDescription && (
                    <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                      <p className="text-xs font-semibold text-slate-400 mb-1">✨ Auto-Beschreibung:</p>
                      <p className="text-xs text-slate-300">{autoDescription}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Karten-Stats Editor */}
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
                    {stats.type && TYPE_CONFIG[stats.type] && (
                      <span className="ml-1 text-sm">{TYPE_CONFIG[stats.type].emoji}</span>
                    )}
                  </span>
                  <span className="text-slate-500 text-xs">{showStats ? "▲" : "▼"}</span>
                </button>

                {showStats && (
                  <div className="p-4 bg-slate-950 space-y-3 border-t border-slate-700">
                    <p className="text-xs text-slate-500">Werte werden dem Prompt angehängt und beeinflussen das generierte Bild.</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Typ</label>
                        <select
                          value={stats.type}
                          onChange={(e) => { updateStat("type", e.target.value); setCustomPrompt(null); }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                          style={stats.type && TYPE_CONFIG[stats.type]
                            ? { borderColor: TYPE_CONFIG[stats.type].glow.replace("0.55", "0.8") }
                            : undefined}
                        >
                          <option value="">– Kein Typ –</option>
                          {POKEMON_TYPES.map((t) => (
                            <option key={t} value={t}>{TYPE_CONFIG[t]?.emoji ?? ""} {t}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">HP</label>
                        <input type="number" placeholder="z.B. 80" value={stats.hp}
                          onChange={(e) => updateStat("hp", e.target.value)}
                          min="10" max="999" step="10"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Fähigkeit (Name)</label>
                      <input type="text" placeholder="z.B. Schutzschild der Natur" value={stats.abilityName}
                        onChange={(e) => updateStat("abilityName", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Fähigkeit (Beschreibung)</label>
                      <input type="text" placeholder="z.B. Schütze einmal pro Runde einen deiner Pokémon" value={stats.abilityText}
                        onChange={(e) => updateStat("abilityText", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div className="grid grid-cols-[1fr_80px] gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Angriff 1</label>
                        <input type="text" placeholder="z.B. Flammen-Stoß" value={stats.attack1Name}
                          onChange={(e) => updateStat("attack1Name", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Schaden</label>
                        <input type="text" placeholder="60" value={stats.attack1Damage}
                          onChange={(e) => updateStat("attack1Damage", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-[1fr_80px] gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Angriff 2</label>
                        <input type="text" placeholder="z.B. Inferno" value={stats.attack2Name}
                          onChange={(e) => updateStat("attack2Name", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Schaden</label>
                        <input type="text" placeholder="120" value={stats.attack2Damage}
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
                  <p><span className="font-semibold">Fehler:</span> {error}</p>
                  {(error.toLowerCase().includes("filter") || error.toLowerCase().includes("content")) && (
                    <p className="text-red-400 text-xs">💡 Pokémon-Namen neutraler formulieren oder anderen Stil wählen.</p>
                  )}
                </div>
              )}

              {/* Generate buttons */}
              <div className="space-y-2">
                {/* Checklist: what's still missing */}
                {!canGenerate && !isLoading && (
                  <div className="flex flex-col gap-1 px-1">
                    <p className="text-xs font-semibold text-slate-500 mb-0.5">Noch ausstehend:</p>
                    <p className={`text-xs flex items-center gap-1.5 ${selectedPrompt ? "text-green-500" : "text-slate-500"}`}>
                      {selectedPrompt ? "✓" : "○"} Design auswählen
                      {!selectedPrompt && (
                        <button onClick={() => setActiveTab("designs")} className="underline text-purple-400 hover:text-purple-300">
                          → Designs
                        </button>
                      )}
                    </p>
                    <p className={`text-xs flex items-center gap-1.5 ${holderName.trim() ? "text-green-500" : "text-slate-500"}`}>
                      {holderName.trim() ? "✓" : "○"} Name der Person eingeben
                    </p>
                  </div>
                )}

                {/* Variant mode toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    className={`flex-1 py-4 rounded-xl font-bold text-base transition-all ${
                      canGenerate
                        ? variantMode
                          ? "bg-slate-800 hover:bg-slate-700 border border-purple-600 text-purple-300"
                          : "bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-lg active:scale-[0.98]"
                        : "bg-slate-800 text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    {loading ? "Wird generiert…" : "✨ Karte generieren"}
                  </button>

                  {resultImage && !isLoading && (
                    <button onClick={runGenerate} title="Nochmal generieren"
                      className="px-4 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors font-bold">
                      🔄
                    </button>
                  )}
                </div>

                {/* Variant mode button */}
                <button
                  onClick={variantMode ? handleGenerateVariants : () => setVariantMode(!variantMode)}
                  disabled={variantMode && !canGenerate}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all border ${
                    variantMode
                      ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white border-transparent shadow-lg"
                      : "bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
                  } ${variantMode && !canGenerate ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {variantLoading
                    ? "2 Varianten werden generiert…"
                    : variantMode
                    ? "⚡ 2 Varianten generieren (doppelte API-Zeit)"
                    : "🔀 Varianten-Modus aktivieren"}
                </button>

                {variantMode && (
                  <button onClick={() => setVariantMode(false)}
                    className="w-full text-xs text-slate-600 hover:text-slate-400 py-1 transition-colors">
                    Varianten-Modus deaktivieren
                  </button>
                )}
              </div>

              {/* Editable prompt */}
              {selectedPrompt && (
                <div className="rounded-xl border border-slate-700 overflow-hidden">
                  <button
                    onClick={() => setShowPromptPreview(!showPromptPreview)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-900 hover:bg-slate-800 transition-colors text-xs"
                  >
                    <span className="text-slate-400">
                      Prompt{customPrompt != null && <span className="ml-1.5 text-yellow-400 font-semibold">✏ bearbeitet</span>}
                    </span>
                    <span className="flex items-center gap-2 text-slate-500">
                      {customPrompt != null && (
                        <span
                          onClick={(e) => { e.stopPropagation(); setCustomPrompt(null); }}
                          className="text-[10px] text-red-400 hover:text-red-300 border border-red-800 rounded px-1.5 py-0.5"
                        >
                          ↺ Reset
                        </span>
                      )}
                      {showPromptPreview ? "▲" : "▼ anzeigen / bearbeiten"}
                    </span>
                  </button>
                  {showPromptPreview && (
                    <div>
                      <textarea
                        value={customPrompt ?? assembledPromptText}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        onFocus={() => { if (customPrompt == null) setCustomPrompt(assembledPromptText); }}
                        rows={8}
                        className="w-full bg-slate-950 border-0 px-4 py-3 text-xs text-slate-300 font-mono resize-y focus:outline-none leading-relaxed"
                      />
                      {customPrompt != null && (
                        <div className="px-4 py-2 bg-yellow-950/30 border-t border-yellow-900/30 text-[10px] text-yellow-600">
                          ✏ Custom-Prompt aktiv – Referenzfoto-Beschreibung wird nicht automatisch eingefügt
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Batch button (mobile only) */}
              <button
                onClick={() => setShowBatch(true)}
                className="w-full py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-sm font-semibold transition-colors sm:hidden"
              >
                📋 Batch-Modus (CSV → mehrere Karten)
              </button>
            </div>
          </main>

          {/* ── Right column: Result ── */}
          <aside
            className={`border-l border-slate-800 flex flex-col overflow-hidden
              w-full lg:w-96 lg:shrink-0
              ${activeTab === "result" ? "flex" : "hidden"} lg:flex`}
          >
            <div className="p-3 border-b border-slate-800 flex items-center justify-between shrink-0">
              <h3 className="font-semibold text-slate-200 text-sm">
                {variantMode && variants ? "Varianten – Wähle eine aus" : "Generiertes Bild"}
              </h3>
              {resultImage && (
                <button onClick={handleDownload} title="PNG herunterladen"
                  className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-300 hover:text-white transition-colors">
                  ⬇ PNG
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">
              <div className="p-4 space-y-3">
                {/* Loading state */}
                {(loading || variantLoading) && (
                  <LoadingSpinner label={variantLoading ? "2 Varianten werden generiert…" : "Karte wird generiert…"} />
                )}

                {/* Variant comparison */}
                {!isLoading && variants && (
                  <div className="space-y-3">
                    <p className="text-xs text-center text-slate-400">
                      Welche gefällt dir besser?
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {variants.map((v, i) => (
                        <div key={i} className="space-y-2">
                          <div className="card-aspect rounded-xl overflow-hidden" style={cardStyle}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={`data:${v.mimeType};base64,${v.imageBase64}`} alt={`Variante ${i + 1}`}
                              className="w-full h-full object-contain" />
                          </div>
                          <button
                            onClick={() => { persistResult(v); setVariants(null); }}
                            className="w-full py-2 rounded-lg bg-purple-800 hover:bg-purple-700 text-white text-xs font-bold transition-colors"
                          >
                            ✓ Variante {i + 1}
                          </button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setVariants(null)}
                      className="w-full text-xs text-slate-600 hover:text-slate-400 py-1">
                      Verwerfen
                    </button>
                  </div>
                )}

                {/* Single result */}
                {!isLoading && !variants && resultImage && (
                  <>
                    <div className="card-aspect w-full max-w-[240px] mx-auto rounded-2xl overflow-hidden shadow-2xl" style={cardStyle}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`data:${resultMimeType};base64,${resultImage}`} alt="Generierte Karte"
                        className="w-full h-full object-contain" />
                    </div>

                    <p className="text-center text-xs text-slate-500">
                      {selectedPrompt?.name} · {holderName}{pokemonName && ` & ${pokemonName}`}
                    </p>

                    {/* Action buttons */}
                    <div className="space-y-2">
                      <button onClick={() => openPrintWindow(resultImage, resultMimeType)}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
                        🖨️ Einzeln drucken (A6 · 63×88 mm)
                      </button>

                      <button onClick={addToPrintQueue}
                        className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-purple-700/50 text-purple-300 hover:text-purple-200 font-semibold text-sm transition-all">
                        + Zur Druckliste hinzufügen
                      </button>

                      <button onClick={handleExportPrint} disabled={exporting}
                        className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-semibold text-sm transition-all">
                        {exporting ? "Exportiere…" : "💾 PNG 300 DPI (744×1039 px)"}
                      </button>

                      <button onClick={handleDownload}
                        className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 text-sm transition-all">
                        ⬇ Web-Qualität herunterladen
                      </button>
                    </div>

                    {/* Print info */}
                    <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-900/50 text-xs text-blue-300 space-y-0.5">
                      <p className="font-semibold text-blue-200">📐 Drucktipps</p>
                      <p>Papier: A6 (105×148mm) · Skalierung: 100% · Randlos</p>
                      <p>Ergebnis: exakt <strong>63×88 mm</strong></p>
                    </div>
                  </>
                )}

                {/* Empty state */}
                {!isLoading && !variants && !resultImage && (
                  <div className="flex flex-col items-center justify-center h-40 text-center gap-3">
                    <div className="w-20 h-28 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center">
                      <span className="text-4xl opacity-30">🃏</span>
                    </div>
                    <p className="text-slate-500 text-sm">Hier erscheint deine Karte</p>
                  </div>
                )}

                {/* Session history */}
                {history.length > 1 && !isLoading && !variants && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Sitzungs-Verlauf</p>
                    <div className="grid grid-cols-4 gap-2">
                      {history.slice(1).map((entry, i) => (
                        <button key={i}
                          onClick={() => { setResultImage(entry.imageBase64); setResultMimeType(entry.mimeType); }}
                          className="relative group rounded-lg overflow-hidden border border-slate-700 hover:border-purple-500 transition-all"
                          title={`${entry.promptName} · ${entry.holderName}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={`data:${entry.mimeType};base64,${entry.imageBase64}`} alt={entry.promptName}
                            className="w-full aspect-[5/7] object-cover" />
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
                    <button onClick={() => setPrintQueue([])}
                      className="text-xs text-slate-600 hover:text-red-400 transition-colors">
                      Leeren
                    </button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {printQueue.map((c) => (
                      <div key={c.id} className="relative shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`data:${c.mimeType};base64,${c.imageBase64}`} alt={c.label}
                          className="w-10 h-14 object-cover rounded border border-slate-600" title={c.label} />
                        <button onClick={() => setPrintQueue((prev) => prev.filter((x) => x.id !== c.id))}
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-800 hover:bg-red-600 text-white text-[10px] flex items-center justify-center transition-colors">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => openMultiPrint(printQueue, "a6")}
                      className="py-2.5 rounded-lg bg-indigo-800 hover:bg-indigo-700 text-white text-xs font-bold transition-colors">
                      🖨️ A6 quer · 2 Karten
                    </button>
                    <button onClick={() => openMultiPrint(printQueue, "a4")}
                      className="py-2.5 rounded-lg bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold transition-colors">
                      🖨️ A4 · 4 Karten
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-600">Fehlende Plätze werden mit der letzten Karte aufgefüllt.</p>
                </div>
              )}

              {/* Persistent gallery */}
              {gallery.length > 0 && (
                <div className="border-t border-slate-800 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
                      Galerie ({gallery.length}/{MAX_GALLERY})
                    </p>
                    <button onClick={() => { saveGallery([]); setGallery([]); }}
                      className="text-xs text-slate-600 hover:text-red-400 transition-colors">
                      Alles löschen
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {gallery.map((card) => (
                      <button key={card.id}
                        onClick={() => { setResultImage(card.imageBase64); setResultMimeType(card.mimeType); setActiveTab("result"); }}
                        className="relative group rounded-lg overflow-hidden border border-slate-700 hover:border-purple-500 transition-all"
                        title={`${card.promptName} · ${card.holderName}${card.pokemonName ? ` & ${card.pokemonName}` : ""}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`data:${card.mimeType};base64,${card.imageBase64}`} alt={card.promptName}
                          className="w-full aspect-[5/7] object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-600">Browser-Speicher · max. {MAX_GALLERY} Karten</p>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* ── Mobile bottom tab bar ── */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090f]/95 backdrop-blur border-t border-slate-800 flex shrink-0">
          {(
            [
              { tab: "designs" as const, icon: "🎨", label: "Designs" },
              { tab: "form" as const,    icon: "✏️",  label: "Formular" },
              { tab: "result" as const,  icon: "🃏",  label: "Ergebnis" },
            ] as const
          ).map(({ tab, icon, label }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-xs font-medium transition-colors relative ${
                activeTab === tab ? "text-purple-400" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <span className="text-lg leading-none">{icon}</span>
              <span>{label}</span>
              {tab === "result" && (resultImage || variants) && (
                <span className="absolute top-2 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
