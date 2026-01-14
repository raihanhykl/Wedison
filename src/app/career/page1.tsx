/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { jobListings, JobData } from "./data-job";
import { EmailService, CareerApplicationData } from "@/service/email-service";

export default function CareerClient() {
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    coverLetter: "",
    resume: null as File | null,
  });

  const handleJobCardClick = (job: JobData) => {
    setSelectedJob(job);
    setShowJobDetail(true);
  };

  const handleApplyClick = () => {
    setShowJobDetail(false);
    setShowApplicationForm(true);
  };

  const handleCloseJobDetail = () => {
    setShowJobDetail(false);
    setSelectedJob(null);
  };

  const handleCloseApplicationForm = () => {
    setShowApplicationForm(false);
    setFormData({
      fullName: "",
      phone: "",
      address: "",
      coverLetter: "",
      resume: null,
    });
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    if (!selectedJob) return;

    const applicationData: CareerApplicationData = {
      fullName: formData.fullName,
      phone: formData.phone,
      address: formData.address,
      coverLetter: formData.coverLetter,
      jobTitle: selectedJob.jobTitle,
      department: selectedJob.department,
      resumeFileName: formData.resume?.name,
    };

    try {
      const result = await EmailService.sendCareerApplication(applicationData);

      if (result.success) {
        setSubmitSuccess(true);
        // Reset form after 3 seconds
        setTimeout(() => {
          handleCloseApplicationForm();
        }, 3000);
      } else {
        setSubmitError(result.message);
      }
    } catch {
      setSubmitError(
        "Terjadi kesalahan saat mengirim aplikasi. Silakan coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Banner Section */}
      <div className="relative w-full h-[550px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <Image
          src="/career/career-banner.webp"
          alt="Join Wedison Team"
          fill
          className="object-cover"
          priority
          onError={(e: any) => {
            // Fallback to gradient if image fails to load
            e.target.style.display = "none";
            e.target.parentElement.style.background =
              "linear-gradient(135deg, #2BB075 0%, #1a8a5a 100%)";
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

        {/* Banner Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[2480px] mx-auto px-8 md:px-16 w-full">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
                Bergabung Bersama
                <br />
                <span className="text-primary">Tim Wedison</span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 md:mb-8">
                Mari bersama membangun masa depan transportasi listrik yang
                berkelanjutan di Indonesia
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-white text-sm font-medium">
                    Work-Life Balance
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-white text-sm font-medium">
                    Competitive Salary
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-white text-sm font-medium">
                    Career Growth
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Listings Section */}
      <div className="main-container md:px-16 py-12 md:py-16 lg:py-20">
        {/* <div className="max-w-[2480px] mx-auto px-8 md:px-16 py-12 md:py-16 lg:py-20"> */}
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Posisi yang Tersedia
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Temukan peran yang sesuai dengan passion dan keahlian Anda
          </p>
        </div>

        {/* Job Cards Grid */}
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {jobListings.map((job) => (
            <div
              key={job.id}
              onClick={() => handleJobCardClick(job)}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2 border border-gray-100"
            >
              {/* Card Header with Department Badge */}
              <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 p-6 border-b border-gray-100">
                <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {job.department}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                  {job.jobTitle}
                </h3>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="flex items-start gap-3 text-gray-600 mb-4">
                  <svg
                    className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed line-clamp-3">
                      {typeof job.jobOverview === "string"
                        ? job.jobOverview
                        : "Klik untuk melihat detail posisi dan requirements"}
                    </p>
                  </div>
                </div>

                {/* View Details Button */}
                <Button
                  variant="outline"
                  className="w-full group/btn border-gray-300 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    Lihat Detail
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Job Detail Dialog */}
      {showJobDetail && selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleCloseJobDetail}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

          {/* Dialog Content */}
          <div
            className="relative bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-primary to-primary/80 text-white p-6 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                    {selectedJob.department}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold">
                    {selectedJob.jobTitle}
                  </h3>
                </div>
                <button
                  onClick={handleCloseJobDetail}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6">
              {/* Job Overview */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </span>
                  Job Overview
                </h4>
                <div className="text-gray-700 leading-relaxed">
                  {selectedJob.jobOverview}
                </div>
              </div>

              {/* Key Responsibilities */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </span>
                  Key Responsibilities
                </h4>
                <div className="text-gray-700">
                  {selectedJob.keyResponsibilities}
                </div>
              </div>

              {/* Qualifications & Requirements */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </span>
                  Qualifications & Requirements
                </h4>
                <div className="text-gray-700">
                  {selectedJob.qualificationsRequirement}
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
              <Button
                onClick={handleApplyClick}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Lamar Posisi Ini
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Application Form Dialog */}
      {showApplicationForm && selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleCloseApplicationForm}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

          {/* Dialog Content */}
          <div
            className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-primary to-primary/80 text-white p-6 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-1">
                    Lamar Posisi
                  </h3>
                  <p className="text-white/80">
                    {selectedJob.jobTitle} - {selectedJob.department}
                  </p>
                </div>
                <button
                  onClick={handleCloseApplicationForm}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
              {submitSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    Aplikasi Berhasil Dikirim!
                  </h4>
                  <p className="text-gray-600">
                    Terima kasih telah melamar. Tim kami akan menghubungi Anda
                    segera.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      placeholder="Masukkan nama lengkap Anda"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      placeholder="08123456789"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Alamat <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      placeholder="Masukkan alamat lengkap Anda"
                    />
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label
                      htmlFor="coverLetter"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Cover Letter <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="coverLetter"
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
                      placeholder="Ceritakan mengapa Anda tertarik dengan posisi ini dan bagaimana pengalaman Anda relevan..."
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label
                      htmlFor="resume"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Upload CV/Resume <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="resume"
                        name="resume"
                        onChange={handleFileChange}
                        required
                        accept=".pdf,.doc,.docx"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Format: PDF, DOC, DOCX (Max 5MB)
                    </p>
                    {formData.resume && (
                      <p className="text-sm text-primary mt-2 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        File terpilih: {formData.resume.name}
                      </p>
                    )}
                  </div>

                  {/* Error Message */}
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-red-600 text-sm">{submitError}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
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
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Mengirim...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                        Submit Aplikasi
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
