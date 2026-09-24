"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PageHeader } from "@/components/admin/page-header";
import { useAdminUser } from "@/components/admin/providers";
import { api, errorMessage } from "@/lib/admin/api";
import { ROLE_LABEL } from "@/lib/admin/types";

const profileSchema = z.object({ name: z.string().trim().min(2, "Minimal 2 karakter").max(80) });
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Wajib diisi"),
    newPassword: z.string().min(8, "Minimal 8 karakter"),
    confirm: z.string(),
  })
  .refine((v) => v.newPassword === v.confirm, { message: "Konfirmasi tidak sama", path: ["confirm"] });

export function SettingsView() {
  const user = useAdminUser();
  const router = useRouter();
  const profile = useForm<z.infer<typeof profileSchema>>({ resolver: zodResolver(profileSchema), defaultValues: { name: user.name } });
  const pwd = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirm: "" },
  });

  return (
    <>
      <PageHeader title="Akun Saya" description={`${user.email} · ${ROLE_LABEL[user.role]}`} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>Nama yang tampil sebagai penulis artikel.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profile}>
              <form
                className="space-y-4"
                onSubmit={profile.handleSubmit(async (v) => {
                  try {
                    await api("/auth/profile", { method: "PATCH", body: v });
                    toast.success("Profil disimpan");
                    router.refresh();
                  } catch (e) {
                    toast.error(errorMessage(e));
                  }
                })}
              >
                <FormField control={profile.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" disabled={profile.formState.isSubmitting}>
                  {profile.formState.isSubmitting && <Loader2 className="animate-spin" />} Simpan
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ganti kata sandi</CardTitle>
            <CardDescription>Minimal 8 karakter. Sesi lain tidak otomatis keluar.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...pwd}>
              <form
                className="space-y-4"
                onSubmit={pwd.handleSubmit(async (v) => {
                  try {
                    await api("/auth/change-password", { method: "POST", body: { currentPassword: v.currentPassword, newPassword: v.newPassword } });
                    toast.success("Kata sandi diperbarui");
                    pwd.reset();
                  } catch (e) {
                    toast.error(errorMessage(e));
                  }
                })}
              >
                {(["currentPassword", "newPassword", "confirm"] as const).map((name) => (
                  <FormField key={name} control={pwd.control} name={name} render={({ field }) => (
                    <FormItem>
                      <FormLabel>{name === "currentPassword" ? "Kata sandi saat ini" : name === "newPassword" ? "Kata sandi baru" : "Ulangi kata sandi baru"}</FormLabel>
                      <FormControl><Input type="password" autoComplete={name === "currentPassword" ? "current-password" : "new-password"} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                ))}
                <Button type="submit" variant="outline" disabled={pwd.formState.isSubmitting}>
                  {pwd.formState.isSubmitting && <Loader2 className="animate-spin" />} Perbarui kata sandi
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
