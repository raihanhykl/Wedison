import { ContactFormData } from "@/lib/contact-schema";
import emailjs from "@emailjs/browser";

// Email service configuration
// const EMAIL_CONFIG = {
//   serviceId: "service_35o1hsl",
//   templateId: "template_1hpwz9j",
//   publicKey: "9jljMROO6YYwm1088",
// } as const;

export interface EmailServiceResult {
  success: boolean;
  message: string;
}

export class EmailService {
  private static prepareEmailData(
    formData: ContactFormData
  ): Record<string, string> {
    const emailData: Record<string, string> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      address: formData.address,
      province: formData.province,
      city: formData.city,
      hasMotor: String(formData.hasMotor),
      vehicle: formData.vehicle || "",
    };

    // Handle title logic
    if (formData.title.includes("Judul lainnya: ") && formData.otherTitle) {
      emailData.title = `${formData.title}: ${formData.otherTitle}`;
    } else {
      emailData.title = formData.title;
    }

    return emailData;
  }

  static async sendContactEmail(
    formData: ContactFormData
  ): Promise<EmailServiceResult> {
    try {
      const emailData = this.prepareEmailData(formData);
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAIL_CONFIG_serviceId || "",
        process.env.NEXT_PUBLIC_EMAIL_CONFIG_templateId || "",
        emailData,
        process.env.NEXT_PUBLIC_EMAIL_CONFIG_publicKey || ""
      );

      console.log("Email sent successfully:", result.text);

      return {
        success: true,
        message: "Email sent successfully",
      };
    } catch (error) {
      console.error("Email service error:", error);

      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to send email",
      };
    }
  }
}
