/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
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

interface Province {
  province_id: string;
  province: string;
}
interface City {
  city_id: string;
  city_name: string;
  province_id: string;
  postal_code: string;
  province: string;
  type: string;
}
// Import our schema and service

export default function Contact() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [hasMotor, setHasMotor] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    try {
      // const fetchProvinces = async () => {
      //   try {
      //     const response = await axios.get("/api/provinces");
      //     console.log("Provinces data:", response.data);
      //     setProvinces(response.data.map((province: Province) => province));
      //   } catch (error) {
      //     console.error("Error fetching provinces:", error);
      //   }
      // };
      // fetchProvinces();
      const fetchProvinces = async () => {
        try {
          console.log("start");
          fetch("/data/provinces.json")
            .then((res) => res.json())
            .then(setProvinces);
          // .then((data) => console.log("data baru:", data));
        } catch (error) {
          console.error("Error fetching provinces:", error);
        }
      };
      fetchProvinces();
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, []);

  // Initialize react-hook-form with Zod validation
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      title: "",
      address: "",
      province: "",
      city: "",
      agreePrivacy: true,
      otherTitle: "",
      message: "",
      hasMotor: false,
      vehicle: "",
    },
    mode: "onChange", // Validate on change for better UX
    shouldUnregister: false,
  });
  const selectedProvince = form.watch("province");

  const provinceId = provinces.find(
    (province) => province.province === selectedProvince
  )?.province_id;

  useEffect(() => {
    const fetchCities = async () => {
      if (!provinceId) return;

      try {
        // const response = await axios.post(`/api/cities`, {
        //   province_id: provinceId,
        // });
        // setCities(response.data.map((city: City) => city));
        // form.setValue("city", ``);
        fetch("/data/cities.json")
          .then((res) => res.json())
          .then((data) => {
            const filteredCities = data.filter(
              (city: any) => city.province_id === provinceId
            );
            setCities(filteredCities);
            form.setValue("city", ``);
          });
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, [provinceId]);
  // const checkProvince = async () => {
  //   try {
  //     const response = await axios.get("/api/provinces");
  //     console.log("Provinces data:", response.data);
  //   } catch (error) {
  //     console.error("Error fetching provinces:", error);
  //   }
  // };
  const selectedTitle = form.watch("title");
  const isOtherSelected = selectedTitle === t("form.title.other.value");
  const handleHasMotorChange = (value: boolean) => {
    setHasMotor(value);
    form.setValue("hasMotor", value);
    if (!value) {
      form.setValue("vehicle", "");
    }
  };

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
              {/* Address Field */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("contact.address")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("contact.addressPlaceholder")}
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Province and City Row */}
              <div className=" sm:flex sm:gap-6">
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"> */}
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{t("contact.province")}</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger className="">
                              <SelectValue
                                placeholder={t("contact.provincePlaceholder")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {provinces.map((province) => (
                              <SelectItem
                                key={province.province_id}
                                value={province.province}
                              >
                                {province.province}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-[300px] max-sm:pt-3">
                      <FormLabel className="">{t("contact.city")}</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isSubmitting || !selectedProvince}
                        >
                          <FormControl className="w-full max-w-full">
                            <SelectTrigger className="lg:w-[48%] xl:w-[93%] 2xl:w-full  max-w-full">
                              <SelectValue
                                className="truncate"
                                placeholder={
                                  selectedProvince
                                    ? t("contact.cityPlaceholder")
                                    : t("contact.provinceError")
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem
                                key={city.city_id}
                                value={`${city.city_name} (${city.postal_code})`}
                              >
                                {city.city_name} ({city.province})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-start gap-4">
                {/* hasMotor Field */}
                <FormField
                  control={form.control}
                  name="hasMotor"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start gap-2 pt-0 min-w-[150px] max-w-[25%] ">
                      <FormLabel htmlFor="hasMotor" className="cursor-pointer">
                        {t("form.hasMotor")}
                      </FormLabel>
                      <FormControl>
                        <Checkbox
                          id="hasMotor"
                          checked={field.value}
                          onCheckedChange={handleHasMotorChange}
                          className="h-5 w-5"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Vehicle Field */}
                <FormField
                  control={form.control}
                  name="vehicle"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{t("form.vehicle")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("form.vehicle.placeholder")}
                          {...field}
                          disabled={isSubmitting || !hasMotor}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("form.vehicle.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                      {/* <FormLabel htmlFor="agreePrivacy" className="text-sm">
                        Mengizinkan PT Astra Honda Motor untuk menggunakan
                        informasi di atas dan menghubungi Saya melalui email dan
                        /atau telepon atau sarana komunikasi pribadi lainnya
                        untuk kegiatan pelayanan kepada customer sesuai dengan
                        persetujuan privasi{" "}
                      </FormLabel> */}
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
