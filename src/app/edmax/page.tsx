import ProductPicker, { ProductColor } from "./components/product-pick";
import HeroSection from "../components/hero-section";
import FeatureSection2 from "../components/feature-section";
import SpecificationsSection from "../components/specifications-section";
import { generateSeoMetadata } from "../lib/seo";
// import Seo from "../lib/seo";

const { metadata, jsonLd } = generateSeoMetadata({
  title: "EdPower - Ride The Future With EdPower",
  description:
    "Edmax is the Flagship Electric Bike from Wedison. Edmax offers Ultimate Driving Experience with its cutting-edge Super Charge Technology, Smart Display, and Advanced Safety Features. Experience the future of transportation with Edmax.",
  path: "/edmax",
  image: "/edmax-charging.webp",
  type: "website",
  jsonLdType: "product",
});

export { metadata };

export default function EdmaxPage() {
  const product: ProductColor[] = [
    {
      name: "Black",
      hex: "#000000",
      alt: "Black",
    },
    {
      name: "white",
      hex: "#FFFFFF",
      alt: "White",
    },
    {
      name: "Red",
      hex: "#FF0000",
      alt: "Red",
    },
    {
      name: "Slate",
      hex: "#6c788f",
      alt: "Blue",
    },
  ];
  // Scroll to top on page load
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  //   setIsVisible(true);
  // }, []);

  // const { ref: colorRef, inView: colorInView } = useInView({
  //   threshold: 0.2,
  //   triggerOnce: true,
  // });

  // const { ref: specsRef, inView: specsInView } = useInView({
  //   threshold: 0.2,
  //   triggerOnce: true,
  // });

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        {/* <section className="relative min-h-[90vh] h-full md:min-h-screen flex items-center overflow-hidden"> */}
        {/* <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden">
 
          <Image
            alt="edmax front look"
            src={"/edmax-edit.webp"}
            width={9000}
            height={1000}
            className="object-cover inset-0 h-[100vh] lg:object-[0%_0%] object-[75%_100%]"
          />

          <div className="md:hidden absolute inset-0 bg-black/60 z-10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 absolute z-20 left-0 md:left-15">
            <div className=" grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center pb-20">
              <div
                className={cn(
                  "transition-all duration-1000 transform order-1 lg:order-0",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-16"
                )}
              >
                <div className="hidden lg:inline-block px-4 py-1 mb-6 border border-teal-700 rounded-full bg-teal-900/50 text-teal-400">
                  <span className="text-sm font-medium">
                    {t("edmax.hero.tag")}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-4 md:mb-6">
                  {t("edmax.hero.title")}{" "}
                  <span className="bg-gradient-to-r from-teal-500 to-teal-400 bg-clip-text text-transparent relative">
                    {t("edmax.hero.titleHighlight")}
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400"></span>
                  </span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-lg">
                  {t("edmax.hero.description")}
                </p>

                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <Button className="bg-teal-500 hover:bg-teal-600 text-white px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-md text-base sm:text-lg shadow-teal transition-all duration-300 hover:-translate-y-1">
                    {t("edmax.hero.orderNow")}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>

                  <Button
                    variant="outline"
                    className="border-teal-500 text-teal-400 hover:bg-teal-900/50 px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-md text-base sm:text-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    {t("edmax.hero.downloadBrochure")}
                  </Button>
                </div>
              </div>

              <div
                className={cn(
                  "relative transition-all duration-1000 delay-300 transform",
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-16"
                )}
              >

                <div className="relative h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] w-full mt-8 lg:mt-0">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
      
                  </div>

                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-500/20 rounded-full opacity-50 blur-2xl"></div>
                  <div className="absolute -top-10 -right-10 w-60 h-60 bg-teal-400/20 rounded-full opacity-40 blur-3xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section> */}
        <HeroSection name="edmax" imageAlt="Edmax Front Look" theme="dark" />
        {/* <section
          ref={feature3Ref}
          className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-black from-50% to-green-950 overflow-hidden relative"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div
                className={cn(
                  "order-2 lg:order-1 relative transition-all duration-1000 transform",
                  feature3InView
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-16"
                )}
              >
                <div className="relative h-[300px] sm:h-[400px] md:h-[450px] w-full rounded-xl overflow-hidden shadow-soft-lg bg-black">
                  <HeadunitCarousel />
                </div>
              </div>

              <div
                className={cn(
                  "order-1 lg:order-2 transition-all duration-1000 transform",
                  feature3InView
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-16"
                )}
              >
                <div className="hidden lg:inline-block px-4 py-1 mb-6 border border-teal-700 rounded-full bg-teal-900/50 text-teal-400">
                  <span className="text-sm font-medium">
                    {t("edmax.feature1.tag")}
                  </span>

                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">

                  {t("edmax.feature1.title")}

                </h2>
                <h3 className="text-xl sm:text-2xl font-semibold text-teal-600 mb-4">

                  {t("edmax.feature1.subtitle")}

                </h3>
                <p
                  className="text-base sm:text-lg text-gray-300
               mb-6 max-w-lg"
                >

                  {t("edmax.feature1.description")}

                </p>
              </div>
            </div>
          </div>
        </section> */}
        <FeatureSection2
          page="edmax"
          alt="Edmax Smart Displays"
          edmaxCarousel={true}
          feature={1}
          image="/em"
        />

        {/* Feature 2 - Super Fast Charging */}
        {/* <section
          ref={feature2Ref}
          className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-black from-80% to-gray-900 overflow-hidden relative"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div
                className={cn(
                  "transition-all duration-1000 transform",
                  feature2InView
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-16"
                )}
              >
                <div className="hidden lg:inline-block px-4 py-1 mb-6 border border-teal-700 rounded-full bg-teal-900/50 text-teal-400">
                  <span className="text-sm font-medium">Super Charge</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">

                  {t("edmax.feature2.title")}
                </h2>
                <h3 className="text-xl sm:text-2xl font-semibold text-teal-600 mb-4">

                  {t("edmax.feature2.subtitle")}
                </h3>
                <p className="text-base sm:text-lg text-gray-300 mb-6 max-w-lg">

                  {t("edmax.feature2.description")}
                </p>
              </div>

              <div
                className={cn(
                  "relative transition-all duration-1000 transform",
                  feature2InView
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-16"
                )}
              >
                <div className="relative h-[300px] sm:h-[400px] md:h-[450px] w-full rounded-xl overflow-hidden shadow-soft-lg">
        
                  <Image
                    src={"/edmax-charging.webp"}
                    alt="Edmax Super Fast Charging"
                    className="w-full h-full object-cover"
                    width={800}
                    height={450}
                  />
                </div>
              </div>
            </div>
          </div>
        </section> */}
        <FeatureSection2
          page="edmax"
          alt="Edmax Super Fast Charging"
          feature={2}
          image="/edmax-charging.webp"
        />

        {/* Color Pick Section */}
        {/* <section ref={colorRef} className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={cn(
                "text-center mb-10 md:mb-16 transition-all duration-1000 transform",
                colorInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              )}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                {t("edmax.color.title")}{" "}
                <span className="bg-gradient-to-r from-teal-500 to-teal-400 bg-clip-text text-transparent relative">
                  {t("edmax.color.titleHighlight")}
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400"></span>
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                {t("edmax.color.description")}
              </p>
            </div>

            <div
              className={cn(
                "transition-all duration-1000 transform",
                colorInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: "200ms" }}
            >
              <ColorPicker name="edmax" product={product} />
            </div>

            <div
              className={cn(
                "flex flex-wrap justify-center gap-4 mt-10 transition-all duration-1000 transform",
                colorInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: "400ms" }}
            >
              <Button className="bg-teal-500 hover:bg-teal-600 text-white px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-md text-base sm:text-lg shadow-teal transition-all duration-300 hover:-translate-y-1">
                {t("edmax.hero.orderNow")}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>

              <Button
                variant="outline"
                className="border-teal-500 text-teal-500 hover:bg-teal-50 px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-md text-base sm:text-lg transition-all duration-300 hover:-translate-y-1"
              >
                <Download className="mr-2 h-5 w-5" />
                {t("edmax.hero.downloadBrochure")}
              </Button>
            </div>
          </div>
        </section> */}

        <ProductPicker
          productName="edpower"
          productColor={product}
          titleColor="text-black"
          descColor="text-gray-800"
        />

        {/* Specifications Section */}
        {/* <section ref={specsRef} className="py-16 md:py-20 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={cn(
                "text-center mb-10 md:mb-16 transition-all duration-1000 transform",
                specsInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              )}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                <span className="bg-gradient-to-r from-teal-500 to-teal-400 bg-clip-text text-transparent relative">
                  {t("edmax.specs.title")}
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400"></span>
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                {t("edmax.specs.description")}
              </p>
            </div>

            <div
              className={cn(
                "max-w-3xl mx-auto transition-all duration-1000 transform",
                specsInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: "200ms" }}
            >
              <SpecificationsAccordion />
            </div>
          </div>
        </section> */}
        <SpecificationsSection name="edmax" />
      </main>
    </>
  );
}
