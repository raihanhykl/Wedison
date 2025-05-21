"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(3, {
    message: "Subject must be at least 3 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    // This is a placeholder for the actual submission logic
    console.log("Form data:", data);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);

    // You will add your actual form submission logic here later
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="h-10 w-10 text-teal-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t("contact.page.thankYou")}
        </h3>
        <p className="text-gray-700 text-center mb-4">
          {t("contact.page.messageReceived")}
        </p>
        <Button
          variant="outline"
          className="border-teal-500 text-teal-500 hover:bg-teal-50"
          onClick={() => setIsSubmitted(false)}
        >
          {t("contact.page.sendAnother")}
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  {t("contact.name")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("contact.name")}
                    className="w-full"
                    {...field}
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
                <FormLabel className="text-gray-700">
                  {t("contact.email")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("contact.email")}
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">
                {t("contact.subject")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("contact.subjectPlaceholder")}
                  className="w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">
                {t("contact.message")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("contact.messagePlaceholder")}
                  className="w-full min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg- hover:bg-teal-600 text-white group transition-all duration-300 hover:-translate-y-1"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t("contact.page.sending")}
            </span>
          ) : (
            <span className="flex items-center">
              {t("contact.send")}
              <Send className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
