import { z } from "zod";

export const contactFormSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .trim(),
    email: z
      .string()
      .email("Please enter a valid email address")
      .min(1, "Email is required"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be less than 15 digits")
      .regex(/^08\d+$/, "Please enter a valid phone number (starts with '08')"),
    // address: z
    //   .string()
    //   .min(15, "Address is required")
    //   .max(100, "Address must be less than 100 characters"),
    // province: z.string().min(1, "Please select a province"),
    // city: z.string().min(1, "Please select a city"),

    title: z.string().min(1, "Please select a topic"),

    otherTitle: z.string().optional(),
    message: z
      .string()
      .min(10, "Message must be at least 10 characters")
      .max(1000, "Message must be less than 1000 characters")
      .trim(),
    // boolean (bukan literal true) agar default bisa false -> user wajib
    // mencentang sendiri; refine tetap memaksa nilainya true saat submit.
    agreePrivacy: z.boolean().refine((val) => val === true, {
      message: "Please confirm that you agree to our privacy policy.",
    }),
    // hasMotor: z.boolean(),
    // vehicle: z.string().optional(),
  })
  .refine(
    (data) => {
      // If "Other" is selected, otherTitle should be provided
      // if (data.title.includes("Judul lainnya: ") && !data.otherTitle?.trim()) {
      if (data.title.includes("Judul Lainnya: ") && data.otherTitle === "") {
        return false;
      }
      return true;
    },
    {
      message: "Please specify the other topic",
      path: ["otherTitle"],
    }
  );
// .refine(
//   (data) => {
//     if (!data.hasMotor) return true; // Jika tidak punya motor, tidak wajib isi
//     if (!data.vehicle?.trim()) return false; // Wajib isi
//     const pattern = /^[^/]+ ?\/ ?[^/]+ ?\/ ?\d{4}$/;
//     return pattern.test(data.vehicle.trim());
//   },
//   {
//     message:
//       "Please enter your vehicle as: brand / type / year (e.g. Honda / Vario / 2020)",
//     path: ["vehicle"],
//   }
// );

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const FORM_TOPICS = [
  "productInfo",
  "serviceMaintenance",
  "testRide",
  "paymentOptions",
  "warrantyClaim",
  "feedback",
  "technicalIssue",
  "partnership",
  "other",
] as const;

export type FormTopic = (typeof FORM_TOPICS)[number];
