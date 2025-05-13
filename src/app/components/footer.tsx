export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-teal-400 to-teal-300 bg-clip-text text-transparent">
              Wedison Motors
            </h3>
            <p className="text-sm md:text-base text-gray-400 mb-3 md:mb-4">
              Pioneering the future of electric mobility with cutting-edge
              technology and sustainable design.
            </p>
            <p className="text-gray-400">
              © {new Date().getFullYear()} Wedison Motors. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white relative inline-block">
              Products
              <span className="absolute -bottom-1 left-0 w-10 h-0.5 bg-teal-400"></span>
            </h4>
            <ul className="space-y-1.5 md:space-y-2">
              <li>
                <a
                  href="/mini"
                  className="text-sm md:text-base text-gray-400 hover:text-teal-400 transition-colors duration-300"
                >
                  Mini
                </a>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="text-sm md:text-base text-gray-400 hover:text-teal-400 transition-colors duration-300"
                >
                  Mini-Pro
                </a>
              </li> */}
              <li>
                <a
                  href="/athena"
                  className="text-sm md:text-base text-gray-400 hover:text-teal-400 transition-colors duration-300"
                >
                  Athena
                </a>
              </li>
              <li>
                <a
                  href="/victory"
                  className="text-sm md:text-base text-gray-400 hover:text-teal-400 transition-colors duration-300"
                >
                  Victory
                </a>
              </li>
              <li>
                <a
                  href="/dash"
                  className="text-sm md:text-base text-gray-400 hover:text-teal-400 transition-colors duration-300"
                >
                  Dash
                </a>
              </li>
              <li>
                <a
                  href="/edmax"
                  className="text-sm md:text-base text-gray-400 hover:text-teal-400 transition-colors duration-300"
                >
                  EdPower
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white relative inline-block">
              Experience
              <span className="absolute -bottom-1 left-0 w-10 h-0.5 bg-teal-400"></span>
            </h4>
            <ul className="space-y-1.5 md:space-y-2">
              <li>
                <a
                  href="/showroom"
                  className="text-sm md:text-base text-gray-400 hover:text-teal-400 transition-colors duration-300"
                >
                  Showroom
                </a>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="text-sm md:text-base text-gray-400 hover:text-teal-400 transition-colors duration-300"
                >
                  Service Locations
                </a>
              </li> */}
              <li>
                <a
                  href="/super-charge"
                  className="text-sm md:text-base text-gray-400 hover:text-teal-400 transition-colors duration-300"
                >
                  Super Charge
                </a>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="text-sm md:text-base text-gray-400 hover:text-teal-400 transition-colors duration-300"
                >
                  Test Ride
                </a>
              </li> */}
            </ul>
          </div>

          <div>
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white relative inline-block">
              Corporate
              <span className="absolute -bottom-1 left-0 w-10 h-0.5 bg-teal-400"></span>
            </h4>
            <ul className="space-y-1.5 md:space-y-2">
              <li>
                <a
                  href="/corporate/about"
                  className="text-sm md:text-base text-gray-400 hover:text-teal-400 transition-colors duration-300"
                >
                  About Us
                </a>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="text-sm md:text-base text-gray-400 hover:text-teal-400 transition-colors duration-300"
                >
                  Careers
                </a>
              </li> */}
              <li>
                <a
                  href="/corporate/contact"
                  className="text-sm md:text-base text-gray-400 hover:text-teal-400 transition-colors duration-300"
                >
                  Contact Us
                </a>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="text-sm md:text-base text-gray-400 hover:text-teal-400 transition-colors duration-300"
                >
                  Help Center
                </a>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs md:text-sm mb-4 md:mb-0">
            Designed with sustainability in mind. Powered by renewable energy.
          </p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-xs md:text-sm text-gray-400 hover:text-teal-400 transition-colors duration-300"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-xs md:text-sm text-gray-400 hover:text-teal-400 transition-colors duration-300"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-xs md:text-sm text-gray-400 hover:text-teal-400 transition-colors duration-300"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
