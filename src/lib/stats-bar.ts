// Paints a clean stats bar over the bottom ~11% of the card image.
// Returns a new base64 PNG with the bar composited in.

interface StatsBarInput {
  imageBase64: string;
  mimeType: string;
  weaknessLabel: string;   // e.g. "🔥 ×2"
  resistanceLabel: string; // e.g. "💧 -30"
  retreatStars: number;    // 0–4
  typeColor: string;       // css color for the bar accent
}

export function paintStatsBar({
  imageBase64,
  mimeType,
  weaknessLabel,
  resistanceLabel,
  retreatStars,
  typeColor,
}: StatsBarInput): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const W = img.naturalWidth;
      const H = img.naturalHeight;
      const barH = Math.round(H * 0.11);
      const y = H - barH;

      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      // Draw original image
      ctx.drawImage(img, 0, 0, W, H);

      // Dark gradient background over bottom bar area
      const grad = ctx.createLinearGradient(0, y, 0, H);
      grad.addColorStop(0, "rgba(0,0,0,0.82)");
      grad.addColorStop(1, "rgba(10,10,20,0.95)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, y, W, barH);

      // Thin accent line at top of bar
      ctx.fillStyle = typeColor;
      ctx.fillRect(0, y, W, Math.max(2, Math.round(H * 0.004)));

      // Dividers between cells
      const col1 = Math.round(W * 0.35);
      const col2 = Math.round(W * 0.70);
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fillRect(col1, y + barH * 0.15, 1, barH * 0.7);
      ctx.fillRect(col2, y + barH * 0.15, 1, barH * 0.7);

      const fs = Math.round(barH * 0.36);
      const labelFs = Math.round(barH * 0.22);
      const midY = y + barH * 0.5;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // ── Cell 1: Weakness ─────────────────────────────
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.font = `${labelFs}px sans-serif`;
      ctx.fillText("Weakness", col1 / 2, midY - fs * 0.55);
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${fs}px sans-serif`;
      ctx.fillText(weaknessLabel, col1 / 2, midY + labelFs * 0.5);

      // ── Cell 2: Resistance ───────────────────────────
      const cell2X = col1 + (col2 - col1) / 2;
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.font = `${labelFs}px sans-serif`;
      ctx.fillText("Resistance", cell2X, midY - fs * 0.55);
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${fs}px sans-serif`;
      ctx.fillText(resistanceLabel, cell2X, midY + labelFs * 0.5);

      // ── Cell 3: Retreat ──────────────────────────────
      const cell3X = col2 + (W - col2) / 2;
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.font = `${labelFs}px sans-serif`;
      ctx.fillText("Retreat", cell3X, midY - fs * 0.55);
      ctx.fillStyle = "#f9d71c";
      ctx.font = `${fs}px sans-serif`;
      const stars = retreatStars > 0 ? "★".repeat(retreatStars) : "—";
      ctx.fillText(stars, cell3X, midY + labelFs * 0.5);

      resolve(canvas.toDataURL("image/png").split(",")[1]);
    };
    img.src = `data:${mimeType};base64,${imageBase64}`;
  });
}
