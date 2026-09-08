import { createServerFn } from "@tanstack/react-start";

/** Zdjęcia QC z FinderQC po wklejonym linku. */
export const finderQcByLink = createServerFn({ method: "POST" })
  .inputValidator((data: { url: string; page?: number; pageSize?: number }) => {
    const url = String(data?.url ?? "").trim().slice(0, 2000);
    if (!/^https?:\/\//i.test(url)) throw new Error("Nieprawidłowy link.");
    return {
      url,
      page: Math.min(50, Math.max(1, Number(data?.page) || 1)),
      pageSize: Math.min(12, Math.max(1, Number(data?.pageSize) || 4)),
    };
  })
  .handler(async ({ data }) => {
    const { fetchFinderQcByUrl } = await import("@/lib/finderqc.server");
    return fetchFinderQcByUrl(data.url, data.page, data.pageSize);
  });

/** Zdjęcia QC z FinderQC dla produktu z katalogu. */
export const finderQcByProduct = createServerFn({ method: "POST" })
  .inputValidator((data: { productId: string; page?: number; pageSize?: number }) => {
    const productId = String(data?.productId ?? "").trim();
    if (!/^[0-9a-f-]{10,64}$/i.test(productId)) throw new Error("Nieprawidłowy produkt.");
    return {
      productId,
      page: Math.min(50, Math.max(1, Number(data?.page) || 1)),
      pageSize: Math.min(12, Math.max(1, Number(data?.pageSize) || 4)),
    };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { productSourceUrl } = await import("@/lib/agentApi");
    const { fetchFinderQcByUrl } = await import("@/lib/finderqc.server");

    const { data: row } = await supabaseAdmin
      .from("products")
      .select("id, title, qc_images, store_url, qc_url, agent_links")
      .eq("id", data.productId)
      .maybeSingle();

    const empty = {
      ok: false as const,
      title: "",
      images: [] as string[],
      totalPhotos: 0,
      hasMore: false,
      source: "",
    };
    if (!row) return empty;

    const src = productSourceUrl(row as any);
    if (src) {
      const res = await fetchFinderQcByUrl(src, data.page, data.pageSize);
      if (res.ok && res.images.length) {
        return { ...res, title: (row as any).title || res.title };
      }
    }

    // Fallback: zdjęcia QC zapisane wcześniej w bazie.
    if (data.page > 1) return { ...empty, title: (row as any).title ?? "" };
    const stored = (((row as any).qc_images ?? []) as string[]).filter((u) =>
      /^https?:\/\//i.test(u),
    );
    return {
      ok: stored.length > 0,
      title: ((row as any).title as string) ?? "",
      images: stored,
      totalPhotos: stored.length,
      hasMore: false,
      source: "",
    };
  });
