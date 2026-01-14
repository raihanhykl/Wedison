import { ContactFormData } from "@/lib/contact-schema";
import emailjs from "@emailjs/browser";

export interface EmailServiceResult {
  success: boolean;
  message: string;
}

export interface CareerApplicationData {
  fullName: string;
  phone: string;
  address: string;
  coverLetter: string;
  jobTitle: string;
  department: string;
  resumeFileName?: string;
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
      // address: formData.address,
      // province: formData.province,
      // city: formData.city,
      // hasMotor: String(formData.hasMotor),
      // vehicle: formData.vehicle || "",
    };

    // Handle title logic
    if (
      formData.title.includes("Judul Lainnya: ") &&
      formData.otherTitle !== ""
    ) {
      emailData.title = formData.title + formData.otherTitle;
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

      return {
        success: true,
        message: "Email sent successfully. Result: " + result,
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

  private static prepareCareerEmailData(
    applicationData: CareerApplicationData
  ): Record<string, string> {
    return {
      fullName: applicationData.fullName,
      phone: applicationData.phone,
      address: applicationData.address,
      coverLetter: applicationData.coverLetter,
      jobTitle: applicationData.jobTitle,
      department: applicationData.department,
      resumeFileName: applicationData.resumeFileName || "No file attached",
    };
  }

  static async sendCareerApplication(
    applicationData: CareerApplicationData
  ): Promise<EmailServiceResult> {
    try {
      const emailData = this.prepareCareerEmailData(applicationData);

      // Using dummy keys for now - user will replace with actual keys
      const serviceId = process.env.NEXT_PUBLIC_CAREER_EMAIL_serviceId || "service_dummy_career";
      const templateId = process.env.NEXT_PUBLIC_CAREER_EMAIL_templateId || "template_dummy_career";
      const publicKey = process.env.NEXT_PUBLIC_CAREER_EMAIL_publicKey || "dummy_public_key_career";

      const result = await emailjs.send(
        serviceId,
        templateId,
        emailData,
        publicKey
      );

      return {
        success: true,
        message: "Career application sent successfully. Result: " + result,
      };
    } catch (error) {
      console.error("Career email service error:", error);

      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to send career application",
      };
    }
  }
}
