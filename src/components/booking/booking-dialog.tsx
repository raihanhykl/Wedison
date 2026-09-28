"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/app/lib/language-context";
import type { BookingPrefill } from "./booking-context";
import { BookingForm, type BookingResult } from "./booking-form";
import { BookingSuccess } from "./booking-success";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefill: BookingPrefill;
};

export default function BookingDialog({ open, onOpenChange, prefill }: Props) {
  const { t } = useLanguage();
  const [result, setResult] = useState<BookingResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const title = result
    ? t("booking.success.title").replace("{name}", result.name.split(" ")[0])
    : prefill.purpose === "testRide"
      ? t("booking.title.testRide")
      : t("booking.title");

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && submitting) return; // jangan tutup saat request masih berjalan
        onOpenChange(next);
      }}
    >
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-xl"
        onOpenAutoFocus={(e) => {
          // Fokus ke field pertama yang masih kosong terasa lebih natural daripada tombol close.
          if (result) return;
          const el = (e.currentTarget as HTMLElement).querySelector<HTMLElement>(
            "[data-autofocus]",
          );
          if (el) {
            e.preventDefault();
            el.focus();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-bold tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription>
            {result ? t("booking.success.desc") : t("booking.subtitle")}
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <BookingSuccess result={result} onClose={() => onOpenChange(false)} />
        ) : (
          <BookingForm
            prefill={prefill}
            onSubmittingChange={setSubmitting}
            onSuccess={setResult}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
