"use client";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CheckCircle2, Send } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import emailjs from "@emailjs/browser";
import { FormEvent, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function Contact() {
  const { t } = useLanguage();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [sending, setSending] = useState(false);

  const form = useRef<HTMLFormElement | null>(null);

  const topics: string[] = [
    "productInfo",
    "serviceMaintenance",
    "testRide",
    "paymentOptions",
    "warrantyClaim",
    "feedback",
    "technicalIssue",
    "partnership",
    "other",
  ];

  const [selectedTopic, setSelectedTopic] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelect = (value: any) => {
    setSelectedTopic(value);
  };

  const sendEmail = (e: FormEvent) => {
    e.preventDefault();

    if (!form.current) return;
    setSending(true);
    const formData = new FormData(form.current);
    // formData.append("title", selectedTopic);
    const title = formData.get("title") as string;
    const otherTitle = formData.get("otherTitle") as string;
    if (title === t("form.title.other.value")) {
      formData.set("title", title + otherTitle);
    } else {
      formData.set("title", title);
    }

    emailjs
      .send(
        "service_35o1hsl", // Ganti dengan ID dari EmailJS
        "template_1hpwz9j", // Ganti dengan ID dari EmailJS
        Object.fromEntries(formData.entries()),
        "9jljMROO6YYwm1088" // Ganti dengan Public Key dari EmailJS
      )
      .then(
        (result) => {
          console.log("Email sent:", result.text);
          form.current?.reset();
          setSelectedTopic("");
          toast(t("form.sending.success.title"), {
            description: t("form.sending.success.description"),
            icon: <CheckCircle2 className=" text-primary mr-5" />,
            duration: 3000,
            position: "top-center",
            style: {
              backgroundColor: "white",
              color: "black",
              gap: "1rem",
            },
          });
        },
        (error) => {
          console.error("Email error:", error.text);
          toast(t("form.sending.error.title"), {
            description: t("form.sending.error.description"),
            icon: <CheckCircle2 className=" text-primary mr-5" />,
            duration: 3000,
            position: "top-center",
            style: {
              backgroundColor: "white",
              color: "black",
              gap: "1rem",
            },
          });
        }
      )
      .finally(() => {
        setSending(false);
      });
  };

  return (
    <section ref={ref} className=" bg-gray-50" id="contact">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="">
          {/* Form */}
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

            <form ref={form} onSubmit={sendEmail} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("contact.name")}
                  </label>
                  <Input
                    name="name"
                    id="name"
                    placeholder={t("contact.name")}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("contact.email")}
                  </label>
                  <Input
                    name="email"
                    id="email"
                    type="email"
                    placeholder={t("contact.email")}
                    className="w-full"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("contact.phone")}
                </label>
                <Input
                  name="phone"
                  id="phone"
                  type="tel"
                  placeholder={"08xxxxxxxxxx"}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("contact.subject")}
                </label>
                <Select name="title" onValueChange={handleSelect}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("form.title.placeholder")} />
                  </SelectTrigger>

                  <SelectContent>
                    {topics.map((topics, index) => (
                      <SelectItem
                        key={index}
                        value={t(`form.title.${topics}.value`)}
                      >
                        {t(`form.title.${topics}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedTopic === t("form.title.other.value") && (
                <div>
                  <label
                    htmlFor="otherTitle"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Other Title
                  </label>
                  <Input
                    name="otherTitle"
                    id="title"
                    placeholder={t("contact.subjectPlaceholder")}
                    className="w-full"
                    required
                  />
                </div>
              )}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("contact.message")}
                </label>
                <Textarea
                  name="message"
                  id="message"
                  placeholder={t("contact.messagePlaceholder")}
                  className="w-full min-h-[120px]"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white group transition-all duration-300 hover:-translate-y-1"
              >
                {sending ? t("form.sending.sending") : t("contact.send")}
                <Send className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
