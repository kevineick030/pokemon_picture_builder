"use client";

import { useState, useRef, useCallback } from "react";
import { PROMPTS, CATEGORIES, type PromptTemplate } from "@/data/prompts";

// ── Hilfsfunktionen ────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Sub-Komponenten ────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    "Neue Kunststile": "bg-fuchsia-900/50 text-fuchsia-300 border-fuchsia-700",
    "Epische Action-Szenen": "bg-orange-900/50 text-orange-300 border-orange-700",
    "Klassische Trainer-Karten": "bg-green-900/50 text-green-300 border-green-700",
    "Ultra Rare Trainer": "bg-purple-900/50 text-purple-300 border-purple-700",
    "Holo-Vinyl Spezial": "bg-cyan-900/50 text-cyan-300 border-cyan-700",
    "Rückseite": "bg-blue-900/50 text-blue-300 border-blue-700",
  };
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${colors[category] ?? "bg-slate-800 text-slate-300 border-slate-600"}`}>
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
            {selected && (
              <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
            )}
            <span className="font-semibold text-sm text-slate-100 leading-tight">
              {prompt.name}
            </span>
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
        <p className="text-slate-500 text-sm mt-1">Das kann 10–30 Sekunden dauern</p>
      </div>
    </div>
  );
}

// ── Haupt-Komponente ───────────────────────────────────────────────────────

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
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(CATEGORIES.map((c) => [c, true]))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredPrompts = PROMPTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageUpload = useCallback((file: File) => {
    setReferenceImageFile(file);
    const url = URL.createObjectURL(file);
    setReferenceImagePreview(url);
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

  const handleGenerate = async () => {
    if (!selectedPrompt) {
      setError("Bitte wähle zuerst ein Design aus.");
      return;
    }
    if (!holderName.trim()) {
      setError("Bitte gib den Namen der Person ein.");
      return;
    }
    if (selectedPrompt.hasPokemon && !pokemonName.trim()) {
      setError("Dieses Design benötigt einen Pokémon-Namen.");
      return;
    }
    if (useReferenceImage && !referenceImageFile && !personDescription.trim()) {
      setError("Bitte lade ein Referenzbild hoch oder gib eine Personenbeschreibung ein.");
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);
    setAutoDescription(null);

    try {
      let referenceImageBase64: string | undefined;
      let referenceImageMimeType: string | undefined;

      if (useReferenceImage && referenceImageFile) {
        const { base64, mimeType } = await fileToBase64(referenceImageFile);
        referenceImageBase64 = base64;
        referenceImageMimeType = mimeType;
      }

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
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Fehler bei der Generierung.");
        return;
      }

      setResultImage(data.imageBase64);
      setResultMimeType(data.mimeType || "image/png");
      if (data.personDescription) {
        setAutoDescription(data.personDescription);
      }
    } catch (err: any) {
      setError(err.message || "Netzwerkfehler");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const ext = resultMimeType.includes("png") ? "png" : "jpg";
    const link = document.createElement("a");
    link.href = `data:${resultMimeType};base64,${resultImage}`;
    link.download = `${holderName || "karte"}_${selectedPrompt?.id ?? ""}.${ext}`;
    link.click();
  };

  const toggleCategory = (cat: string) => {
    setOpenCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const canGenerate = selectedPrompt && holderName.trim() && !loading;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-slate-800 bg-[#09090f]/95 backdrop-blur px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🃏</span>
          <div>
            <h1 className="text-xl font-bold text-yellow-400 tracking-tight">
              My Rookie Card
            </h1>
            <p className="text-xs text-slate-400">Personalisierter TCG-Kartengenerator</p>
          </div>
        </div>
      </header>

      {/* Main 3-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Linke Spalte: Prompt-Auswahl ── */}
        <aside className="w-80 shrink-0 border-r border-slate-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800">
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
                const isOpen = openCategories[cat];
                return (
                  <div key={cat}>
                    <button
                      onClick={() => toggleCategory(cat)}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-widest hover:text-slate-200 transition-colors"
                    >
                      <span>{cat}</span>
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

        {/* ── Mittlere Spalte: Formular ── */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-lg mx-auto space-y-6">
            {/* Selected prompt info */}
            {selectedPrompt ? (
              <div className={`p-4 rounded-xl bg-gradient-to-r ${selectedPrompt.color} bg-opacity-10 border border-slate-700`}>
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
              <label className="block text-sm font-semibold text-slate-300 mb-2">
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

            {/* Pokemon Name (conditional) */}
            {selectedPrompt?.hasPokemon && (
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Pokémon-Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="z.B. Glumanda (oder: Feuer-Eidechse)"
                  value={pokemonName}
                  onChange={(e) => setPokemonName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                />
                <p className="text-xs text-yellow-600 mt-1.5 flex items-center gap-1">
                  <span>⚠</span>
                  Tipp: Bei Content-Filter-Problemen neutrale Beschreibung verwenden (z.B. "Feuer-Echse" statt Markenname)
                </p>
              </div>
            )}

            {/* Reference Image Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-700">
              <div>
                <p className="font-semibold text-slate-200 text-sm">Referenzfoto verwenden</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Gesicht der Person für bessere Ähnlichkeit
                </p>
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
                className={`w-12 h-6 rounded-full transition-all duration-200 relative ${
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
                {/* Upload area */}
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
                        <p className="text-sm text-slate-200 font-medium">
                          {referenceImageFile?.name}
                        </p>
                        <p className="text-xs text-slate-400">Klicken zum Ändern</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="text-3xl block mb-2">📷</span>
                      <p className="text-slate-300 text-sm font-medium">Foto hochladen</p>
                      <p className="text-slate-500 text-xs mt-1">
                        Drag & Drop oder klicken · JPG, PNG, WEBP
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />

                {/* Manual description (optional override) */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Personenbeschreibung
                    <span className="text-slate-500 font-normal ml-1.5">
                      (optional – wird sonst automatisch aus dem Foto generiert)
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
                    <p className="text-xs font-semibold text-slate-400 mb-1">
                      ✨ Auto-generierte Beschreibung:
                    </p>
                    <p className="text-xs text-slate-300">{autoDescription}</p>
                  </div>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-sm">
                <span className="font-semibold">Fehler: </span>
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-200 ${
                canGenerate
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-lg hover:shadow-purple-900/50 active:scale-[0.98]"
                  : "bg-slate-800 text-slate-600 cursor-not-allowed"
              }`}
            >
              {loading ? "Wird generiert…" : "✨ Karte generieren"}
            </button>

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
                </pre>
              </details>
            )}
          </div>
        </main>

        {/* ── Rechte Spalte: Ergebnis ── */}
        <aside className="w-96 shrink-0 border-l border-slate-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-slate-200 text-sm">Generiertes Bild</h3>
            {resultImage && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 hover:text-white transition-colors"
              >
                <span>⬇</span> Download
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <LoadingSpinner />
            ) : resultImage ? (
              <div className="space-y-3">
                <div className="card-aspect w-full max-w-[280px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`data:${resultMimeType};base64,${resultImage}`}
                    alt="Generierte Karte"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500">
                    {selectedPrompt?.name} · {holderName}
                    {pokemonName && ` & ${pokemonName}`}
                  </p>
                  <button
                    onClick={handleDownload}
                    className="mt-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-semibold text-sm transition-all"
                  >
                    ⬇ Als PNG speichern
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 gap-3">
                <div className="w-24 h-32 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center">
                  <span className="text-4xl opacity-30">🃏</span>
                </div>
                <p className="text-slate-500 text-sm">
                  Hier erscheint deine generierte Karte
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
