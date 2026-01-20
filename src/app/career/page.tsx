/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { jobListings, JobData } from "./data-job";

export default function CareerClient() {
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [showJobPortals, setShowJobPortals] = useState(false);

  const handleJobCardClick = (job: JobData) => {
    setSelectedJob(job);
    setShowJobDetail(true);
  };

  const handleApplyClick = () => {
    setShowJobDetail(false);
    setShowJobPortals(true);
  };

  const handleCloseJobDetail = () => {
    setShowJobDetail(false);
    setSelectedJob(null);
  };

  const handleCloseJobPortals = () => {
    setShowJobPortals(false);
  };

  const handleJobPortalClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Job portal icons/logos mapping
  const getJobPortalIcon = (portalName: string) => {
    const icons: Record<string, string> = {
      LinkedIn: "/career/job-portals/linkedin.png",
      Indeed: "/career/job-portals/Indeed.png",
      Glints: "/career/job-portals/Glints.png",
      JobStreet: "/career/job-portals/JobStreet.png",
      Kalibrr: "/career/job-portals/Kalibrr.png",
      Dribbble: "/career/job-portals/Dribbble.png",
      Behance: "/career/job-portals/Behance.png",
    };
    return icons[portalName] || "";
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Banner Section */}
      <div className="relative w-full h-[550px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <Image
          src="/career/career-banner.webp"
          alt="Join Wedison Team"
          fill
          className="object-cover "
          priority
          onError={(e: any) => {
            // Fallback to gradient if image fails to load
            e.target.style.display = "none";
            e.target.parentElement.style.background =
              "linear-gradient(135deg, #2BB075 0%, #1a8a5a 100%)";
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 via-70% to-black/30" />

        {/* Banner Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[2480px] mx-auto px-8 md:px-16 w-full">
            <div className="max-w-3xl ">
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
      <div className="main-container py-12 md:py-16 lg:py-20">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Lamar Posisi Ini
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Job Portals Selection Dialog */}
      {showJobPortals && selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleCloseJobPortals}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

          {/* Dialog Content */}
          <div
            className="relative bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-1">
                    Pilih Platform Lamaran
                  </h3>
                  <p className="text-white/80 text-sm md:text-base">
                    {selectedJob.jobTitle} - {selectedJob.department}
                  </p>
                </div>
                <button
                  onClick={handleCloseJobPortals}
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

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <p className="text-gray-600 text-center mb-6">
                Pilih platform untuk melanjutkan lamaran Anda
              </p>

              {/* Email Apply Option - Featured */}
              <div className="mb-6">
                <a
                  href={`mailto:aditya@wedison.co?subject=Lamaran%20Pekerjaan%20-%20${encodeURIComponent(
                    selectedJob.jobTitle,
                  )}%20(${encodeURIComponent(
                    selectedJob.department,
                  )})&body=Yth.%20Tim%20HR%20Wedison%2C%0A%0ASaya%20tertarik%20untuk%20melamar%20posisi%20${encodeURIComponent(
                    selectedJob.jobTitle,
                  )}%20di%20departemen%20${encodeURIComponent(
                    selectedJob.department,
                  )}.%0A%0ABerikut%20saya%20lampirkan%20CV%20dan%20dokumen%20pendukung%20lainnya.%0A%0ANama%20Lengkap%3A%20%0ANomor%20Telepon%3A%20%0AAlamat%3A%20%0A%0ATerima%20kasih%20atas%20perhatiannya.%0A%0AHormat%20saya%2C`}
                  className="group w-full flex items-center gap-4 p-5 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border-2 border-primary rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  {/* Email Icon */}
                  <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <svg
                      className="w-7 h-7 text-white"
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
                  </div>

                  {/* Text */}
                  <div className="flex-1 text-left">
                    <span className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors block">
                      Lamar via Email
                    </span>
                    <span className="text-sm text-gray-500">
                      Kirim lamaran langsung ke hr@wedison.co
                    </span>
                  </div>

                  {/* Arrow */}
                  <svg
                    className="w-6 h-6 text-primary transition-all duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </a>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-sm text-gray-400 font-medium">
                  atau via Job Portal
                </span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Job Portals Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedJob.jobPortals.map((portal, index) => (
                  <button
                    key={index}
                    onClick={() => handleJobPortalClick(portal.url)}
                    className="group flex items-center gap-4 p-4 bg-gray-50 hover:bg-primary/5 border-2 border-gray-200 hover:border-primary rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    {/* Portal Icon */}
                    <div className="w-12 h-12 p-0 border-1 border-gray-300 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                      {getJobPortalIcon(portal.name) ? (
                        <Image
                          // src={getJobPortalIcon(portal.name)}
                          src={`/career/job-portals/${portal.name}.png`}
                          alt={portal.name}
                          width={43}
                          height={43}
                          className="object-contain rounded-lg"
                          onError={(e: any) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <svg
                          className="w-8 h-8 text-primary"
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
                      )}
                    </div>

                    {/* Portal Name and Arrow */}
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {portal.name}
                      </span>
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-primary transition-all duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>

              {/* Info Text */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-blue-900">
                    Anda akan diarahkan ke platform eksternal untuk melengkapi
                    proses lamaran. Pastikan CV dan dokumen pendukung Anda sudah
                    siap.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
