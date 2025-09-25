"use client";

import { useInView } from "react-intersection-observer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CheckCircle2, Send, AlertCircle } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  ContactFormData,
  contactFormSchema,
  FORM_TOPICS,
} from "@/lib/contact-schema";
import { EmailService } from "@/service/email-service";
import { Checkbox } from "@/components/ui/checkbox";
// Import our schema and service

export default function Contact() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Initialize react-hook-form with Zod validation
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      title: "",
      agreePrivacy: true,
      otherTitle: "",
      message: "",
    },
    mode: "onChange", // Validate on change for better UX
    shouldUnregister: false,
  });

  const selectedTitle = form.watch("title");
  const isOtherSelected = selectedTitle === t("form.title.other.value");

  useEffect(() => {
    if (!isOtherSelected) {
      form.setValue("otherTitle", "");
    }
  }, [isOtherSelected, form]);

  const handleFormSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const result = await EmailService.sendContactEmail(data);
      if (result.success) {
        form.reset();
        toast(t("form.sending.success.title"), {
          description: t("form.sending.success.description"),
          descriptionClassName: "text-black/90",
          icon: <CheckCircle2 className="text-primary mr-2" />,
          duration: 4000,
          position: "top-center",
          style: {
            backgroundColor: "white",
            color: "black",
            gap: "1rem",
          },
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Form submission error:", error);

      toast(t("form.sending.error.title"), {
        description: t("form.sending.error.description"),
        icon: <AlertCircle className="text-red-500 mr-2" />,
        duration: 4000,
        position: "top-center",
        style: {
          backgroundColor: "white",
          color: "black",
          gap: "1rem",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} className="bg-gray-50" id="contact">
      <div className="px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "bg-white rounded-xl shadow-soft p-5 md:p-8 transition-all duration-700 transform",
            inView ? "opacity-100 animate-slide-in-left" : "opacity-0"
          )}
          style={{ animationFillMode: "both" }}
        >
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent">
              {t("contact.sendMessage")}
            </span>
          </h3>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.name")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("contact.name")}
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.email")}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("contact.email")}
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("contact.phone")}</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="08xxxxxxxxxx"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subject/Topic Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("contact.subject")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t("form.title.placeholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FORM_TOPICS.map((topic) => (
                          <SelectItem
                            key={topic}
                            value={t(`form.title.${topic}.value`)}
                          >
                            {t(`form.title.${topic}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Other Title Field (Conditional) */}
              {isOtherSelected && (
                <FormField
                  control={form.control}
                  name="otherTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("contact.subjectPlaceholder")}
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Message Field */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("contact.message")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("contact.messagePlaceholder")}
                        className="min-h-[120px] resize-none"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* checkbox field */}
              <FormField
                control={form.control}
                name="agreePrivacy"
                render={({ field }) => (
                  <FormItem className="flex items-center space-3">
                    <FormControl>
                      <Checkbox
                        id="agreePrivacy"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <div>
                      <FormDescription>
                        {t("form.agreePrivacy.description")}
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
                className={cn(
                  "w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white group transition-all duration-300",
                  !isSubmitting && "hover:-translate-y-1"
                )}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t("form.sending.sending")}
                  </>
                ) : (
                  <>
                    {t("contact.send")}
                    <Send className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
