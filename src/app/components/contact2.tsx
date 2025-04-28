"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MapPin, Phone, Mail, Send, Facebook, Bell } from "lucide-react";

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Initialize react-hook-form with zod resolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted:", data);
      setSubmitSuccess(true);
      reset();

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact" className="w-full max-w-7xl mx-auto px-4 py-12 md:py-16">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-block mb-4">
          <button className="px-6 py-2 rounded-full border border-emerald-300 text-emerald-600 hover:bg-emerald-50 transition-colors">
            Contact Us
          </button>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Get in <span className="text-emerald-500">Touch</span>
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg">
          Have questions about our electric motorcycles? We`&apos;`re here to
          help you join the electric revolution.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-emerald-500 mb-6">
            Send Us a Message
          </h2>

          {submitSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-lg">
              Thank you for your message! We`&apos;`ll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                  placeholder="Name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                  placeholder="Email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="subject" className="block text-gray-700 mb-2">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.subject ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                placeholder="How can we help you?"
                {...register("subject")}
              />
              {errors.subject && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.message ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all min-h-[120px] resize-y`}
                placeholder="Your message"
                rows={5}
                {...register("message")}
              />
              {errors.message && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.message.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 transform hover:translate-y-[-2px] hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-emerald-500 mb-6">
            Contact Information
          </h2>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-50 p-3 rounded-full">
                <MapPin className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Headquarters</h3>
                <p className="text-gray-600">
                  123 Electric Avenue, Innovation District
                </p>
                <p className="text-gray-600">San Francisco, CA 94103</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-emerald-50 p-3 rounded-full">
                <Phone className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Phone</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
                <p className="text-gray-500 text-sm">Mon-Fri from 8am to 6pm</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-emerald-50 p-3 rounded-full">
                <Mail className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Email</h3>
                <p className="text-gray-600">info@wedisonmotors.com</p>
                <p className="text-gray-500 text-sm">
                  We`&apos;`ll respond as soon as possible
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Follow Us</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5 text-gray-600" />
                </a>
                <a
                  href="#"
                  className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
