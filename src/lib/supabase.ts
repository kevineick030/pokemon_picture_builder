import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!_client) _client = createClient(url, key);
  return _client;
}

export interface SavedCard {
  id: string;
  storage_url: string;
  holder_name: string | null;
  pokemon_name: string | null;
  prompt_id: number | null;
  prompt_name: string | null;
  created_at: string;
}

// Convert base64 PNG → JPEG Blob at given quality (0–1)
function base64ToJpegBlob(base64: string, mimeType: string, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
        "image/jpeg",
        quality
      );
    };
    img.onerror = reject;
    img.src = `data:${mimeType};base64,${base64}`;
  });
}

export async function uploadCardToSupabase(params: {
  imageBase64: string;
  mimeType: string;
  holderName: string;
  pokemonName: string;
  promptId: number;
  promptName: string;
}): Promise<string | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const { imageBase64, mimeType, holderName, pokemonName, promptId, promptName } = params;

    const blob = await base64ToJpegBlob(imageBase64, mimeType, 0.85);
    const filename = `${Date.now()}_${holderName.replace(/\s+/g, "-")}.jpg`;

    const { error: uploadError } = await client.storage
      .from("mrc-cards")
      .upload(filename, blob, { contentType: "image/jpeg", upsert: false });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError.message);
      return null;
    }

    const { data: urlData } = client.storage.from("mrc-cards").getPublicUrl(filename);
    const publicUrl = urlData.publicUrl;

    const { error: dbError } = await client.from("mrc_generated_cards").insert({
      storage_url: publicUrl,
      holder_name: holderName || null,
      pokemon_name: pokemonName || null,
      prompt_id: promptId,
      prompt_name: promptName,
    });

    if (dbError) console.error("Supabase DB insert error:", dbError.message);

    return publicUrl;
  } catch (err) {
    console.error("Supabase save failed:", err);
    return null;
  }
}

export async function loadCardsFromSupabase(): Promise<SavedCard[]> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client
    .from("mrc_generated_cards")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Supabase load error:", error.message);
    return [];
  }
  return data ?? [];
}
