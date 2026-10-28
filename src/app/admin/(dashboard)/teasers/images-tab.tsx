"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { CheckCircle2, CircleAlert, ImagePlus, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MediaPickerDialog } from "@/components/admin/media-picker";
import { cn } from "@/lib/utils";
import { IMAGE_SLOTS, IMAGE_SLOT_SPEC, resolveImages, type ImageSlot, type TeaserContent, type TeaserLocale } from "@/lib/teasers/teaser";
import { TextField } from "./fields";
import type { EditorProps } from "./form-state";

/** Teks alt per slot (disimpan di konten per bahasa). Hero desktop & mobile berbagi satu alt. */
const ALT: Partial<Record<ImageSlot, { get: (c: TeaserContent) => string; set: (c: TeaserContent, v: string) => void }>> = {
  heroDesktop: { get: (c) => c.hero.imageAlt, set: (c, v) => { c.hero.imageAlt = v; } },
  event: { get: (c) => c.event.imageAlt, set: (c, v) => { c.event.imageAlt = v; } },
  experienceMain: { get: (c) => c.experience.imageMainAlt, set: (c, v) => { c.experience.imageMainAlt = v; } },
  experienceLounge: { get: (c) => c.experience.imageLoungeAlt, set: (c, v) => { c.experience.imageLoungeAlt = v; } },
  promo: { get: (c) => c.promo.imageAlt, set: (c, v) => { c.promo.imageAlt = v; } },
};

export function ImagesTab({ s, set, edit, readOnly, facts }: EditorProps) {
  const [picking, setPicking] = useState<ImageSlot | null>(null);
  const effective = resolveImages(s.images);

  return (
    <fieldset disabled={readOnly} className="min-w-0 space-y-4">
      <p className="text-sm text-muted-foreground">
        Upload or pick images from the Media Library. Empty slots use a default Wedison photo, so the page never shows a blank box.
        Uploads are converted to WebP automatically.
      </p>
      <div className="grid gap-4 xl:grid-cols-2">
        {IMAGE_SLOTS.map((slot) => {
          const spec = IMAGE_SLOT_SPEC[slot];
          const own = s.images[slot];
          const alt = ALT[slot];
          return (
            <Card key={slot} className="overflow-hidden">
              <CardContent className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{spec.label}</p>
                    <p className="text-xs text-muted-foreground">{spec.where}</p>
                  </div>
                  <Badge variant="outline" className="shrink-0 font-mono text-[11px]">{spec.ratioLabel} · {spec.size}</Badge>
                </div>
                <SlotPreview
                  key={effective[slot]}
                  src={slot === "heroMobile" && !own ? effective.heroMobile : effective[slot]}
                  ratio={spec.ratio}
                  isDefault={!own}
                  defaultLabel={slot === "heroMobile" ? "Uses the desktop hero" : "Default image"}
                />
                <p className="text-xs text-muted-foreground">{spec.hint}</p>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setPicking(slot)} disabled={readOnly}>
                    {own ? <RefreshCw /> : <ImagePlus />} {own ? "Replace" : "Choose image"}
                  </Button>
                  {own && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => set("images", { ...s.images, [slot]: null })} disabled={readOnly}>
                      <X /> Use default
                    </Button>
                  )}
                </div>
                {alt && (
                  <div className="grid gap-3 border-t border-border pt-3">
                    {(["id", "en"] as TeaserLocale[]).map((l) => (
                      <TextField
                        key={l}
                        label={`Description (${l.toUpperCase()})`}
                        value={alt.get(s.content[l])}
                        onChange={(v) => edit(l, (c) => alt.set(c, v))}
                        max={160}
                        facts={facts[l]}
                        hint="What the image shows, for screen readers and Google Images."
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <MediaPickerDialog
        open={!!picking}
        onOpenChange={(o) => !o && setPicking(null)}
        folder="teasers"
        onSelect={(m) => {
          if (!picking) return;
          const spec = IMAGE_SLOT_SPEC[picking];
          if (m.width && m.height) {
            const off = Math.abs(m.width / m.height - spec.ratio) / spec.ratio;
            if (off > 0.06) toast.warning(`This image is ${m.width}×${m.height}. ${spec.label} works best at ${spec.ratioLabel}; parts of it will be cropped.`);
            const [needW] = spec.size.split(" × ").map((x) => parseInt(x, 10));
            if (m.width < needW * 0.6) toast.warning(`This image is only ${m.width} px wide; ${spec.size} is recommended. It may look blurry.`);
          }
          set("images", { ...s.images, [picking]: m.url });
          setPicking(null);
        }}
      />
    </fieldset>
  );
}

/** Pratinjau dengan rasio slot (cara tampilnya di halaman: object-cover) + cek ukuran asli. */
function SlotPreview({ src, ratio, isDefault, defaultLabel }: { src: string; ratio: number; isDefault: boolean; defaultLabel: string }) {
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const off = natural ? Math.abs(natural.w / natural.h - ratio) / ratio : 0;
  return (
    <div>
      <div className="relative overflow-hidden rounded-lg bg-muted" style={{ aspectRatio: ratio }}>
        <Image src={src} alt="" fill sizes="(min-width: 1280px) 30vw, 90vw" className="object-cover" unoptimized onLoad={(e) => setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })} />
        {isDefault && <span className="absolute left-2 top-2 rounded-md bg-background/90 px-2 py-0.5 text-xs font-medium shadow-sm">{defaultLabel}</span>}
      </div>
      {natural && !isDefault && (
        <p className={cn("mt-1.5 inline-flex items-center gap-1 text-xs", off > 0.06 ? "text-chart-4" : "text-muted-foreground")}>
          {off > 0.06 ? <CircleAlert className="size-3.5" /> : <CheckCircle2 className="size-3.5 text-primary" />}
          {natural.w} × {natural.h} px{off > 0.06 ? " · different shape, will be cropped as shown" : " · good fit"}
        </p>
      )}
    </div>
  );
}
