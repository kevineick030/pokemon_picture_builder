"use client";

import { useState, useRef } from "react";
import { buildZip } from "@/lib/zip-png";
import { type PromptTemplate } from "@/data/prompts";

// ── Types ──────────────────────────────────────────────────────────────────

interface CardStats {
  type: string; hp: string; abilityName: string; abilityText: string;
  attack1Name: string; attack1Damage: string; attack2Name: string; attack2Damage: string;
}

interface BatchItem {
  id: string;
  name: string;
  pokemon: string;
  description: string;
  status: "pending" | "generating" | "done" | "error";
  imageBase64?: string;
  mimeType?: string;
  error?: string;
}

// ── Utilities ──────────────────────────────────────────────────────────────

function parseCSV(text: string): { name: string; pokemon: string; description: string }[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return [];
  const firstLow = lines[0].toLowerCase();
  const hasHeader = firstLow.includes("name") || firstLow.includes("pokemon");
  return (hasHeader ? lines.slice(1) : lines)
    .filter((l) => l.trim())
    .map((line) => {
      const cols = line.split(",").map((c) => c.trim().replace(/^"(.*)"$/, "$1"));
      return { name: cols[0] ?? "", pokemon: cols[1] ?? "", description: cols[2] ?? "" };
    })
    .filter((item) => item.name);
}

function buildStatsAppendix(stats: CardStats): string {
  const parts: string[] = [];
  if (stats.type) parts.push(`Karten-Typ: ${stats.type}`);
  if (stats.hp) parts.push(`HP: exakt '${stats.hp} HP' oben rechts`);
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

// ── Component ──────────────────────────────────────────────────────────────

interface BatchPanelProps {
  selectedPrompt: PromptTemplate | null;
  stats: CardStats;
  onClose: () => void;
}

export default function BatchPanel({ selectedPrompt, stats, onClose }: BatchPanelProps) {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [running, setRunning] = useState(false);
  const [csvText, setCsvText] = useState("");
  const abortRef = useRef(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setCsvText((e.target?.result as string) ?? "");
    reader.readAsText(file, "utf-8");
  };

  const handleParse = () => {
    const parsed = parseCSV(csvText);
    setItems(
      parsed.map((p, i) => ({
        id: `${i}-${Math.random().toString(36).slice(2, 7)}`,
        ...p,
        status: "pending" as const,
      }))
    );
  };

  const handleStart = async () => {
    if (!selectedPrompt) {
      alert("Bitte zuerst ein Design in der Hauptansicht auswählen.");
      return;
    }
    setRunning(true);
    abortRef.current = false;
    const statsAppendix = buildStatsAppendix(stats);

    for (let i = 0; i < items.length; i++) {
      if (abortRef.current) break;
      if (items[i].status === "done") continue;

      setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, status: "generating" } : it)));

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            promptId: selectedPrompt.id,
            holderName: items[i].name,
            pokemonName: items[i].pokemon,
            personDescription: items[i].description,
            statsAppendix,
          }),
        });
        let data: any;
        try {
          data = await res.json();
        } catch {
          throw new Error(`Server-Fehler ${res.status}: ${res.statusText}`);
        }
        if (!res.ok) throw new Error(data.error || "Fehler");
        setItems((prev) =>
          prev.map((it, idx) =>
            idx === i ? { ...it, status: "done", imageBase64: data.imageBase64, mimeType: data.mimeType } : it
          )
        );
      } catch (err: any) {
        setItems((prev) =>
          prev.map((it, idx) => (idx === i ? { ...it, status: "error", error: err.message } : it))
        );
      }

      if (i < items.length - 1) await new Promise((r) => setTimeout(r, 1200));
    }
    setRunning(false);
  };

  const handleDownloadZip = () => {
    const done = items.filter((it) => it.status === "done" && it.imageBase64);
    if (done.length === 0) return;
    const files = done.map((it) => {
      const binary = atob(it.imageBase64!);
      const bytes = new Uint8Array(binary.length);
      for (let j = 0; j < binary.length; j++) bytes[j] = binary.charCodeAt(j);
      const ext = (it.mimeType ?? "image/png").includes("png") ? "png" : "jpg";
      return { name: `${it.name.replace(/[^a-zA-Z0-9_-]/g, "_")}_${it.id.slice(0, 5)}.${ext}`, data: bytes };
    });
    const zipBytes = buildZip(files);
    const blob = new Blob([zipBytes.buffer as ArrayBuffer], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-rookie-cards.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  const doneCount = items.filter((it) => it.status === "done").length;
  const errorCount = items.filter((it) => it.status === "error").length;
  const previewCount = csvText.trim() ? parseCSV(csvText).length : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] bg-[#0d0d1a] border border-slate-700 rounded-2xl flex flex-col overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0">
          <div>
            <h2 className="font-bold text-slate-100 text-lg">📋 Batch-Modus</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedPrompt
                ? `Design: ${selectedPrompt.icon} ${selectedPrompt.name}`
                : "⚠ Kein Design ausgewählt – bitte zuerst links ein Design wählen"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* CSV import (shown when no items yet) */}
          {items.length === 0 && (
            <div className="space-y-3">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files[0];
                  if (f) handleFile(f);
                }}
                onClick={() => document.getElementById("batch-csv-input")?.click()}
                className="border-2 border-dashed border-slate-600 rounded-xl p-5 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-950/10 transition-all"
              >
                <span className="text-3xl block mb-2">📄</span>
                <p className="text-sm text-slate-300 font-medium">CSV-Datei hochladen oder hier ablegen</p>
                <p className="text-xs text-slate-500 mt-1">Format: Name, Pokémon, Beschreibung (je eine Zeile)</p>
              </div>
              <input
                id="batch-csv-input"
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Oder direkt eingeben:
                </label>
                <textarea
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder={"Kevin,Glumanda,Junger Mann mit dunklen Haaren\nLisa,Bisasam,Junge Frau mit langen Haaren\nMax,,Älterer Mann mit Brille"}
                  rows={5}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 font-mono resize-none"
                />
                <p className="text-[10px] text-slate-600 mt-1">
                  Name (Pflicht), Pokémon (optional), Beschreibung (optional) — kommagetrennt
                </p>
              </div>

              <button
                onClick={handleParse}
                disabled={!csvText.trim() || previewCount === 0}
                className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-sm transition-colors"
              >
                {previewCount > 0 ? `${previewCount} Karten importieren` : "Importieren"}
              </button>
            </div>
          )}

          {/* Queue */}
          {items.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {items.length} Karten ·{" "}
                  <span className="text-green-400">{doneCount} fertig</span>
                  {errorCount > 0 && <span className="text-red-400"> · {errorCount} Fehler</span>}
                </span>
                {!running && (
                  <button
                    onClick={() => { setItems([]); setCsvText(""); }}
                    className="text-slate-600 hover:text-red-400 transition-colors"
                  >
                    Neue Liste
                  </button>
                )}
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-600 transition-all duration-500"
                  style={{ width: `${items.length > 0 ? (doneCount / items.length) * 100 : 0}%` }}
                />
              </div>

              {/* Item list */}
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800"
                  >
                    {item.status === "done" && item.imageBase64 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`data:${item.mimeType};base64,${item.imageBase64}`}
                        className="w-8 h-11 object-cover rounded border border-slate-700 shrink-0"
                        alt={item.name}
                      />
                    ) : (
                      <div
                        className={`w-8 h-11 rounded shrink-0 flex items-center justify-center text-base border ${
                          item.status === "generating"
                            ? "border-purple-500 bg-purple-950/40 animate-pulse"
                            : item.status === "error"
                            ? "border-red-700 bg-red-950/40"
                            : "border-slate-700 bg-slate-800"
                        }`}
                      >
                        {item.status === "generating" ? "⏳" : item.status === "error" ? "❌" : "🃏"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {idx + 1}. {item.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {item.pokemon && `${item.pokemon} · `}
                        {item.status === "done" ? (
                          <span className="text-green-400">Fertig ✓</span>
                        ) : item.status === "generating" ? (
                          <span className="text-purple-400">Generiert…</span>
                        ) : item.status === "error" ? (
                          <span className="text-red-400">{item.error}</span>
                        ) : (
                          <span>Ausstehend</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 shrink-0 flex gap-2">
          {items.length > 0 && !running && doneCount < items.length && (
            <button
              onClick={handleStart}
              disabled={!selectedPrompt}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white font-bold text-sm transition-all"
            >
              ✨ {doneCount > 0 ? `Weiter generieren (${items.length - doneCount} offen)` : "Batch starten"}
            </button>
          )}

          {running && (
            <button
              onClick={() => { abortRef.current = true; }}
              className="flex-1 py-3 rounded-xl bg-red-900 hover:bg-red-800 text-white font-bold text-sm transition-colors"
            >
              ⏹ Abbrechen
            </button>
          )}

          {doneCount > 0 && !running && (
            <button
              onClick={handleDownloadZip}
              className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm transition-colors"
            >
              ⬇ ZIP ({doneCount} Karten)
            </button>
          )}

          {items.length === 0 && (
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-sm transition-colors"
            >
              Schließen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
