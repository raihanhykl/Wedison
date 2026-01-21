"use client";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../lib/language-context";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="text-white bg-gray-900">
      <div className="container px-4 py-8 mx-auto sm:px-6 lg:px-8 md:py-12">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-6">
          <div className="col-span-2 mr-6 ">
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-[var(--primary-light)] to-teal-300 bg-clip-text text-transparent">
              Wedison Motors
            </h3>
            <p className="mb-3 text-sm text-gray-400 md:text-base md:mb-4">
              {/* Pioneering the future of electric mobility with cutting-edge
              technology and sustainable design. */}
              {t("footer.description")}
            </p>
            <p className="text-sm text-gray-400 md:text-base">
              {/* © {new Date().getFullYear()} Wedison Motors. All rights reserved. */}
              {t("footer.copyright")}
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="relative inline-block mb-3 text-base font-semibold text-white md:text-lg md:mb-4">
              {/* Products */}
              {t("footer.products")}
              <span className="absolute -bottom-1 left-0 w-10 h-0.5 bg-[var(--primary-light)]"></span>
            </h4>
            <ul className="space-y-1.5 md:space-y-2">
              <li>
                <a
                  href="/bees/"
                  className="text-sm md:text-base text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                >
                  Bees
                </a>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="text-sm md:text-base text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                >
                  Mini-Pro
                </a>
              </li> */}
              <li>
                <a
                  href="/athena/"
                  className="text-sm md:text-base text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                >
                  Athena
                </a>
              </li>
              <li>
                <a
                  href="/victory/"
                  className="text-sm md:text-base text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                >
                  Victory
                </a>
              </li>
              <li>
                <a
                  href="/edpower/"
                  className="text-sm md:text-base text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                >
                  EdPower
                </a>
              </li>
            </ul>
          </div>

          {/* experience */}
          <div>
            <h4 className="relative inline-block mb-3 text-base font-semibold text-white md:text-lg md:mb-4">
              {/* Experience */}
              {t("footer.experience")}
              <span className="absolute -bottom-1 left-0 w-10 h-0.5 bg-[var(--primary-light)]"></span>
            </h4>
            <ul className="space-y-1.5 md:space-y-2">
              <li>
                <a
                  href="/showroom"
                  className="text-sm md:text-base text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                >
                  Showroom
                </a>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="text-sm md:text-base text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                >
                  Service Locations
                </a>
              </li> */}
              <li>
                <a
                  href="/super-charge"
                  className="text-sm md:text-base text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                >
                  SuperCharge
                </a>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="text-sm md:text-base text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                >
                  Test Ride
                </a>
              </li> */}
            </ul>
          </div>

          {/* corporate */}
          <div>
            <h4 className="relative inline-block mb-3 text-base font-semibold text-white md:text-lg md:mb-4">
              {/* Corporate */}
              {t("footer.corporate")}
              <span className="absolute -bottom-1 left-0 w-10 h-0.5 bg-[var(--primary-light)]"></span>
            </h4>
            <ul className="space-y-1.5 md:space-y-2">
              <li>
                <a
                  href="/corporate/about"
                  className="text-sm md:text-base text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                >
                  {/* About Us */}
                  {t("footer.about")}
                </a>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="text-sm md:text-base text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                >
                  Careers
                </a>
              </li> */}
              <li>
                <a
                  href="/corporate/contact"
                  className="text-sm md:text-base text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                >
                  {/* Contact Us */}
                  {t("footer.contact")}
                </a>
              </li>
              <li>
                <a
                  href="/career"
                  className="text-sm md:text-base text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                >
                  {/* Contact Us */}
                  {t("footer.career")}
                </a>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="text-sm md:text-base text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                >
                  Help Center
                </a>
              </li> */}
            </ul>
          </div>

          {/* meet us */}
          <div>
            <h4 className="relative inline-block mb-3 text-base font-semibold text-white md:text-lg md:mb-4">
              {/* Meet Us */}
              {t("footer.meetus")}
              <span className="absolute -bottom-1 left-0 w-10 h-0.5 bg-[var(--primary-light)]"></span>
            </h4>
            <div className="flex w-full gap-3 mt-2 max-md:justify-between b md:gap-4">
              {/* <div className="flex items-center justify-between w-full space-x-4"> */}
              <div className="">
                <ul className="flex gap-3 space-y-3 md:space-y-4">
                  <li>
                    <Link
                      href="https://www.instagram.com/wedison.id/"
                      target="_blank"
                      className="text-sm md:text-base flex gap-2 items-center text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                    >
                      <Image
                        src="/icons/instagram.svg"
                        alt="Instagram"
                        width={35}
                        height={35}
                      />
                      {/* wedison.id */}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://www.tiktok.com/@wedison.id"
                      target="_blank"
                      className="text-sm md:text-base flex gap-2 items-center text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                    >
                      <Image
                        src="/icons/tiktok.svg"
                        alt="Tiktok"
                        width={35}
                        height={35}
                      />
                      {/* wedison.id */}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://www.youtube.com/channel/UCePP1fIil61GyQF4XFWGB2g"
                      target="_blank"
                      className="text-sm md:text-base flex gap-2 items-center text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                    >
                      <Image
                        src="/icons/youtube.svg"
                        alt="Instagram"
                        width={35}
                        height={35}
                      />
                      {/* Motor Listrik Wedison */}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="flex gap-3 space-y-3 md:space-y-4">
                  <li>
                    <Link
                      href="https://www.facebook.com/people/wedisonid/61562726390879/"
                      target="_blank"
                      className="text-sm md:text-base flex gap-2 items-center text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                    >
                      <Image
                        src="/icons/facebook.svg"
                        alt="Facebook"
                        width={35}
                        height={35}
                      />
                      {/* wedisonid */}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://wa.me/6282124657804"
                      target="_blank"
                      className="text-sm md:text-base flex gap-2 items-center text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                    >
                      <Image
                        src="/icons/whatsapp.svg"
                        alt="Instagram"
                        width={35}
                        height={35}
                      />
                      {/* +62 821-2465-7804 */}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="mailto: support@wedison.co"
                      className="text-sm md:text-base flex gap-2 items-center text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                    >
                      <Image
                        src="/icons/mail.svg"
                        alt="Instagram"
                        width={35}
                        height={35}
                      />
                      {/* support@wedison.co */}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between pt-6 mt-8 border-t border-gray-800 md:mt-12 md:pt-8 md:flex-row">
          <p className="mb-4 text-xs text-gray-400 md:text-sm md:mb-0">
            {/* Designed with sustainability in mind. Powered by renewable energy. */}
            {t("footer.tagline")}
          </p>
          {/* <div className="flex space-x-6">
            <a
              href="#"
              className="text-xs md:text-sm text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-xs md:text-sm text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-xs md:text-sm text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
            >
              Cookies
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
