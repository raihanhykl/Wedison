import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className=" mr-6">
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-[var(--primary-light)] to-teal-300 bg-clip-text text-transparent">
              Wedison Motors
            </h3>
            <p className="text-sm md:text-base text-gray-400 mb-3 md:mb-4">
              Pioneering the future of electric mobility with cutting-edge
              technology and sustainable design.
            </p>
            <p className="text-gray-400 text-sm md:text-base">
              © {new Date().getFullYear()} Wedison Motors. All rights reserved.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white relative inline-block">
              Products
              <span className="absolute -bottom-1 left-0 w-10 h-0.5 bg-[var(--primary-light)]"></span>
            </h4>
            <ul className="space-y-1.5 md:space-y-2">
              <li>
                <a
                  href="/mini"
                  className="text-sm md:text-base text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                >
                  Mini
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
                  href="/athena"
                  className="text-sm md:text-base text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                >
                  Athena
                </a>
              </li>
              <li>
                <a
                  href="/victory"
                  className="text-sm md:text-base text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                >
                  Victory
                </a>
              </li>
              <li>
                <a
                  href="/dash"
                  className="text-sm md:text-base text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                >
                  Dash
                </a>
              </li>
              <li>
                <a
                  href="/edpower"
                  className="text-sm md:text-base text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                >
                  EdPower
                </a>
              </li>
            </ul>
          </div>

          {/* experience */}
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white relative inline-block">
              Experience
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
                  Super Charge
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
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white relative inline-block">
              Corporate
              <span className="absolute -bottom-1 left-0 w-10 h-0.5 bg-[var(--primary-light)]"></span>
            </h4>
            <ul className="space-y-1.5 md:space-y-2">
              <li>
                <a
                  href="/corporate/about"
                  className="text-sm md:text-base text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                >
                  About Us
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
                  Contact Us
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
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white relative inline-block">
              Meet Us
              <span className="absolute -bottom-1 left-0 w-10 h-0.5 bg-[var(--primary-light)]"></span>
            </h4>
            <div className="flex md:flex-col max-md:justify-between w-full gap-4">
              {/* <div className="flex justify-between items-center space-x-4  w-full"> */}
              <div>
                <ul className="space-y-3 md:space-y-4">
                  <li>
                    <Link
                      href="https://www.instagram.com/wedison.id/"
                      target="_blank"
                      className="text-sm md:text-base flex gap-2 items-center text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                    >
                      <Image
                        src="/icons/instagram.svg"
                        alt="Instagram"
                        width={25}
                        height={25}
                      />
                      Instagram: wedison.id
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
                        width={25}
                        height={25}
                      />
                      Tiktok: wedison.id
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
                        width={25}
                        height={25}
                      />
                      Youtube: Motor Listrik Wedison
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-3 md:space-y-4">
                  <li>
                    <Link
                      href="https://www.facebook.com/people/wedisonid/61562726390879/"
                      target="_blank"
                      className="text-sm md:text-base flex gap-2 items-center text-gray-400 hover:text-[var(--primary-light)] transition-colors duration-300"
                    >
                      <Image
                        src="/icons/facebook.svg"
                        alt="Facebook"
                        width={25}
                        height={25}
                      />
                      Facebook: wedisonid
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
                        width={25}
                        height={25}
                      />
                      Whatsapp: +62 821-2465-7804
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
                        width={25}
                        height={25}
                      />
                      Email: support@wedison.co
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs md:text-sm mb-4 md:mb-0">
            Designed with sustainability in mind. Powered by renewable energy.
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
