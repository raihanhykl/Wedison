"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type Language = "en" | "id";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const translations = {
  en: {
    //SEO Landing
    "landing.title": "Wedison - The Future of Electric Mobility",
    "landing.description":
      "Wedison is an eco-friendly electric motorcycle brand with the latest SuperCharge technology.",

    // compare table
    "compare.model": "Compare Models",
    "compare.select.bike": "Select a bike to compare",
    "compare.title": "Compare Our Models",
    "compare.subtitle":
      "Find the perfect electric motorcycle that suits your lifestyle",
    "compare.expandAll": "Expand All",
    "compare.collapseAll": "Collapse All",
    "compare.swipeHint": "Swipe to see more",

    // buttons
    "btn.learn.more": "Learn More",
    "btn.buy.on.tokopedia": "Buy on Tokopedia",
    "btn.see.brochure": "See Brochure",
    "btn.order.now": "Order Now",

    // user manual
    "user.manual.tag": "Documentation",
    "user.manual.section.title": "User Manual &",
    "user.manual.section.titleHighlight": "Owner's Guide",
    "user.manual.section.description":
      "Everything you need to know about your Wedison — operation, charging, maintenance, and safety, all in one official document.",
    "user.manual.faq.section.title": "Manuals for",
    "user.manual.faq.section.titleHighlight": "Every Model",
    "user.manual.faq.section.description":
      "Pick your model below to view or download its official user manual.",
    "user.manual.btn.view": "View Manual",
    "user.manual.btn.download": "Download",
    "user.manual.card.bees.title": "Wedison Bees",
    "user.manual.card.bees.desc":
      "Compact urban commuter — full operating, charging, and care instructions.",
    "user.manual.card.athena.title": "Wedison Athena",
    "user.manual.card.athena.desc":
      "Retro-style scooter manual covering smart features and battery care.",
    "user.manual.card.victory.title": "Wedison Victory",
    "user.manual.card.victory.desc":
      "Sport-class guide — riding modes, SuperCharge, and servicing.",
    "user.manual.card.edpower.title": "Wedison EdPower",
    "user.manual.card.edpower.desc":
      "Long-range premium model — full documentation for daily and long trips.",

    // footer support
    "footer.support": "Support",
    "footer.userManual": "User Manuals",
    "footer.faq": "FAQ",

    // Navbar
    "nav.products": "Products",
    "nav.discover": "Discover",
    "nav.discover.leftCard.title": "Discover Wedison",
    "nav.discover.leftCard.description":
      "Explore the Experience Center, find answers in the FAQ, and stay updated through the Media Center. All information in one place.",
    "nav.experienceCenter.description":
      "Visit the Wedison showroom and experience the 15-minute supercharge firsthand.",
    "nav.faq.description":
      "Find answers to common questions about our products, services, and technology.",
    "nav.mediaCenter.description":
      "Get the latest news, official releases, and highlights about Wedison",
    "nav.ojol.description":
      "Exclusive electric motorbike rental programs for ride-hailing drivers. Start from 50K/day.",
    "nav.showroom": "Showroom",
    "nav.serviceLocation": "Service Location",
    "nav.superCharge": "SuperCharge",
    "nav.corporate": "Corporate",
    "nav.corporate.leftCard.title": "Powering the Future",
    "nav.corporate.leftCard.description":
      "With supercharge technology, Wedison delivers an electric riding experience that is fast, efficient, and environmentally friendly.",
    "nav.aboutUs": "About Us",
    "nav.aboutUs.description":
      "Discover Wedison’s vision, mission, and commitment to driving innovation in electric mobility for a sustainable future.",
    "nav.careers": "Careers",
    "nav.careers.description":
      "Join the Wedison team and build a career in the electric vehicle industry.",

    // Career Page
    "career.banner.title": "Join the",
    "career.banner.titleHighlight": "Wedison Team",
    "career.banner.description":
      "Together, let's build the future of sustainable electric transportation in Indonesia",
    "career.banner.badge1": "Work-Life Balance",
    "career.banner.badge2": "Competitive Salary",
    "career.banner.badge3": "Career Growth",
    "career.section.title": "Available Positions",
    "career.section.description":
      "Find a role that matches your passion and expertise",
    "career.card.viewDetails": "View Details",
    "career.card.previewText":
      "Click to view position details and requirements",
    "career.detail.jobOverview": "Job Overview",
    "career.detail.keyResponsibilities": "Key Responsibilities",
    "career.detail.qualifications": "Qualifications & Requirements",
    "career.detail.applyButton": "Apply for This Position",
    "career.portal.title": "Choose Application Platform",
    "career.portal.description":
      "Select a job portal platform to continue your application",
    "career.portal.infoText":
      "You will be redirected to an external platform to complete the application process. Make sure your CV and supporting documents are ready.",

    "nav.contactUs": "Contact Us",
    "nav.contactUs.description":
      "Need assistance or further information? The Wedison team is here to help you.",
    "nav.helpCenter": "Help Center",

    // Hero
    "hero.tag": "The Future is Electric",
    "hero.title": "The Future of",
    "hero.titleHighlight": "Electric Mobility",
    "hero.description":
      "Experience the perfect blend of power, sustainability, and cutting-edge technology with Wedison Motors electric motorcycles.",
    "hero.exploreModels": "Explore Models",
    "hero.bookTestRide": "Book Test Ride",

    // Features
    "features.tag": "Revolutionary Features",
    "features.title": "Why Choose",
    "features.titleHighlight": "Wedison Motors",
    "features.description":
      "Our electric motorcycles combine cutting-edge technology with sustainable design to deliver an unparalleled riding experience.",
    "features.longRangeBattery": "120km Long-Range Battery",
    "features.longRangeBatteryDesc":
      "Travel up to 100 km on a single charge with our advanced lithium-ion battery technology.",
    "features.rapidCharging": "SuperCharge in 15 Minutes",
    "features.rapidChargingDesc":
      "Charge from 10% to 80% in just 15 minutes with our SuperCharge network.",
    "features.impressivePerformance": "0-95km/h in 3 Seconds",
    "features.impressivePerformanceDesc":
      "Experience 0-95 km/h in under 3 seconds with instant torque delivery.",
    // "features.zeroEmissions": "Cut the Carbon, Ride Electric",
    // "features.zeroEmissions": "Ride Electric, Cut Emissions by 54%",
    // "features.zeroEmissionsDesc":
    //   "Electric motorcycles emit 53.8% less CO₂ and cut lifecycle emissions by up to 80%, resulting in 14% cleaner air.",
    // "features.zeroEmissionsLink":
    //   "https://www.sciencedirect.com/science/article/pii/S0967070X21003401",
    "features.zeroEmissions": "Zero Emission, Cleaner Air",
    "features.zeroEmissionsDesc":
      "Powered by pure electricity, Wedison helps reduce urban air pollution. Every ride means fresher air for all of us.",
    "features.zeroEmissionsLink":
      "https://www.sciencedirect.com/science/article/pii/S0967070X21003401",
    // "features.healthBenefits": "Cleaner Air, Healthier Life",
    // "features.healthBenefits":
    //   "11% Lower Lung Disease Risk, and 3.2% Fewer Asthma ER Visits.",
    // "features.healthBenefitsDesc":
    //   "Compared to gasoline motorcycles, electric motorcycles lower your risk of lung diseases and reduce asthma-related ER visits by 3.2%.",
    "features.healthBenefits": "Smarter Energy Efficiency",
    "features.healthBenefitsDesc":
      "Compared to conventional motorcycles, Wedison uses less energy to travel the same distance, saving both resources and costs.",
    // "Electric motorcycle cuts city fine particulate pollution by 14% on average, reduces asthma-related ER visits by 3.2%, helping you and your loved ones breathe easier every day.",
    "features.healthBenefitsLink":
      "https://www.sciencedirect.com/science/article/pii/S016041202031970X",
    // "features.noiseFree": "Say Goodbye to Noise & Air Pollution",
    // "features.noiseFree": "Enjoy 23% Quieter, Zero-Exhaust Rides",
    // "features.noiseFreeDesc":
    //   "Electric motorcycle rides are up to 23% quieter and emit no exhaust, saving about 46.5 g of CO₂ and 1.95 g of CO per kilometer.",
    "features.noiseFree": "Driving a Sustainable Future",
    "features.noiseFreeDesc":
      "Every time you choose Wedison, you contribute to the transition toward green, eco-friendly, and sustainable mobility.",
    "features.noiseFreeLink":
      "https://www.sciencedirect.com/science/article/pii/S0160412023003896",

    // Products
    "products.tag": "Our Fleet",
    "products.title": "Our",
    "products.titleHighlight": "Electric Motorcycles",
    "products.description":
      "Discover our range of high-performance electric motorcycles designed for every type of rider.",
    "products.learnMore": "Learn More",
    "products.orderNow": "Order Now",
    "products.range": "Range",
    "products.topSpeed": "Top Speed",
    "products.miles": "Kilometers",
    "products.mph": "km/h",

    // Testimonials
    "testimonials.tag": "Testimonials",
    "testimonials.title": "What Our",
    "testimonials.titleHighlight": "Riders Say",
    "testimonials.description":
      "Hear from riders who have made the switch to electric with Wedison Motors.",

    // Contact
    "contact.tag": "Contact Us",
    "contact.title": "Get in",
    "contact.titleHighlight": "Touch",
    "contact.description":
      "Have questions about our electric motorcycles? We're here to help you join the electric revolution.",
    "contact.sendMessage": "Send Us a Message",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.address": "Address",
    "contact.addressPlaceholder": "Your address",
    "contact.province": "Province",
    "contact.provincePlaceholder": "Select your province",
    "contact.city": "City",
    "contact.cityPlaceholder": "Select your city",
    "contact.provinceError": "Please select a province first.",
    "contact.subject": "Subject",
    "contact.subjectPlaceholder": "How can we help you?",
    "contact.message": "Message",
    "contact.messagePlaceholder": "Your message",
    "contact.send": "Send Message",
    "contact.contactInfo": "Contact Information",
    "contact.headquarters": "Headquarters",
    "contact.phone": "Phone",
    "contact.phoneHours": "Mon-Fri from 9am to 6pm",
    "contact.emailLabel": "Email",
    "contact.emailResponse": "We'll respond as soon as possible",
    "contact.followUs": "Follow Us",

    // Footer
    "footer.description":
      "Pioneering the future of electric mobility with cutting-edge technology and sustainable design.",
    "footer.products": "Products",
    "footer.experience": "Experience",
    "footer.corporate": "Corporate",
    "footer.copyright": "© 2025 Wedison Motors. All rights reserved.",
    "footer.tagline":
      "Designed with sustainability in mind. Powered by renewable energy.",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.cookies": "Cookies",
    "footer.contact": "Contact Us",
    "footer.about": "About Us",
    "footer.meetus": "Meet Us",
    "footer.career": "Career",

    // Showroom Page
    "showroom.title": "Visit Our",
    "showroom.titleHighlight": "Showroom",
    "showroom.description":
      "Experience our electric motorcycles in person and discover the future of mobility.",
    "showroom.tag": "Experience Center",
    "showroom.location": "Our Locations",
    "showroom.findUs": "Find Us",
    "showroom.address":
      "Arteri Pondok Indah Street No 30 A-C, South Kebayoran Lama, South Jakarta, DKI Jakarta. 12240",
    "showroom.jakarta.name": "Wedison Jakarta",
    "showroom.jakarta.address":
      "Arteri Pondok Indah Street No 30 A-C, South Kebayoran Lama, South Jakarta, DKI Jakarta. 12240",
    "showroom.bandung.name": "Wedison Bandung",
    "showroom.bandung.address":
      "Jl. Raya Gadobangkong No.154, Gadobangkong, Kec. Ngamprah, Kabupaten Bandung Barat, Jawa Barat 40552",
    "showroom.bali.name": "Wedison Bali",
    "showroom.bali.address":
      "Jl. Gatot Subroto Tengah No.93, Dangin Puri Kaja, North Denpasar, Denpasar City, Bali 80118",
    "showroom.facility.showroom": "Showroom",
    "showroom.facility.service": "Service Center",
    "showroom.viewOnMaps": "View on Maps",
    "showroom.hours": "Opening Hours",
    "showroom.weekdays": "Monday - Friday: 10:00 AM - 7:00 PM",
    "showroom.weekend": "Saturday - Sunday: 10:00 AM - 5:00 PM",
    "showroom.whatYouCanDo": "What You Can Do at the Showroom",
    "showroom.testRide.title": "Electric Motorcycle Test Ride",
    "showroom.testRide.description":
      "Try the performance of the Wedison electric motorbike directly in our test area. Experience driving comfort with the latest technology.",
    "showroom.consultation.title": "Product Consultation",
    "showroom.consultation.description":
      "Need advice? Our team is ready to help you find the electric motorbike that best suits your needs.",
    "showroom.financing.title": "Financing Simulation",
    "showroom.financing.description":
      "Get flexible purchasing options through installment programs and other attractive offers.",
    "showroom.service.title": "Service and After-Sales",
    "showroom.service.description":
      "We are committed to providing the best after-sales service, including official service and replacement of spare parts.",
    "showroom.bookVisit": "Book a Visit",
    "showroom.viewModels": "Go to Showroom",

    // About Us
    "about.tag": "Our Story",
    "about.title": "About",
    "about.titleHighlight": "Wedison Group",
    "about.overview.title": "WEDISON: Pioneering Green Energy in Mobility",
    "about.overview.p1":
      "Wedison is a leading Tech Company. We are Indonesia's first fast-charging electric motorcycle. For us, it's not just about selling electric motorcycles, it's about creating a green ecosystem that fosters sustainable mobility across the world.",
    "about.overview.p2":
      "Paired with our advanced electric charging system, our electric motorcycles will enrich the lifestyles of our consumers and better our environment.",
    "about.mission.title": "Our Mission",
    "about.mission.p1":
      "To create a world-class, intelligent, and environmentally friendly, green energy EV platform and ecosystem.",
    "about.mission.p2":
      "To provide economical transportation solutions and to put a Wedison EV Motorcycle in every household in Indonesia and Southeast Asian countries.",
    "about.values.title": "Our Core Values",
    "about.values.innovation.title": "Electric Vehicle Innovation",
    "about.values.innovation.description":
      "We are committed to developing energy-efficient electric vehicles that are accessible to the broader community, supporting the transition to environmentally friendly transportation.",
    "about.values.partnerships.title": "Partnerships and Collaborations",
    "about.values.partnerships.description":
      "We collaborate with various industries to accelerate the development of electric vehicle infrastructure, including charging stations and battery technology.",
    "about.values.experience.title": "Future-Focused User Experience",
    "about.values.experience.description":
      "Create a user-friendly driving experience for every consumer, and develop smart features that cater to the needs of modern society.",
    "about.projects.title": "Our Projects",
    "about.projects.future.title": "Create a Brighter Green Future",
    "about.projects.future.description":
      "Utilizing renewable energy to reduce carbon emissions and support a healthier environment. Expanding the electric vehicle (EV) market, making communities cleaner and transportation more affordable for everyone.",
    "about.projects.charging.title": "SuperCharge",
    "about.projects.charging.description":
      "We built a robust charging infrastructure to support the growing electric vehicle ecosystem while creating time-saving opportunities for businesses.",
    "about.offers.title": "What We Offer",
    "about.offers.motorcycles.title": "Electric Motorcycle Models",
    "about.offers.motorcycles.description":
      "We offer a range of electric motorcycle models, each designed to meet diverse customer needs and preferences.",
    "about.offers.charging.title": "SuperCharge Stations",
    "about.offers.charging.description":
      "We offer SuperCharge stations, providing quick and convenient charging solutions, ensuring that electric motorcycle users can easily power up their vehicles and stay on the road longer.",
    "about.joinUs": "Join Our Mission",
    "about.joinUsDescription":
      " Join us in our mission to create a sustainable future through  electric mobility. Together, we can make a difference.",
    "about.contactUs": "Contact Us",

    // Contact Page
    "contact.page.description":
      "Have questions or need assistance? We're here to help. Reach out to us using any of the methods below.",
    "contact.page.findUs": "Find Us",
    "contact.page.openInMaps": "Open in Google Maps",
    "contact.page.hours": "Business Hours",
    "contact.page.business.hours": "Monday - Friday: 09.00 AM - 06.00 PM",
    "contact.page.faqTitle": "Frequently Asked Questions",
    "contact.page.thankYou": "Thank You!",
    "contact.page.messageReceived":
      "We've received your message and will get back to you as soon as possible.",
    "contact.page.sendAnother": "Send Another Message",
    "contact.page.sending": "Sending...",
    "contact.page.faq.q1": "How can I test ride a Wedison motorcycle?",
    "contact.page.faq.a1":
      "You can schedule a test ride by visiting our showroom or booking an appointment through our website. Our team will guide you through the process and help you experience our electric motorcycles firsthand.",
    "contact.page.faq.q2": "What warranty do Wedison motorcycles come with?",
    "contact.page.faq.a2":
      "All Wedison motorcycles come with a comprehensive 3-year warranty on the motorcycle and a 5-year warranty on the battery. This covers manufacturing defects and ensures peace of mind for our customers.",
    "contact.page.faq.q3":
      "How long does it take to charge a Wedison motorcycle?",
    "contact.page.faq.a3":
      "Charging times vary by model, but with our SuperCharge network, most models can charge from 10% to 80% in just 15 minutes. A full charge using a standard home outlet typically takes 3-4 hours.",
    "contact.page.faq.q4": "Do you offer financing options?",
    "contact.page.faq.a4":
      "Yes, we offer flexible financing options to make owning a Wedison motorcycle more accessible. Our team can help you explore payment plans that fit your budget and needs.",

    // calculator
    "calculator.page.tag": "Saving Calculator",
    "calculator.page.title": "Calculate ",
    "calculator.page.titleHighlight": "Your Savings Now",
    "calculator.page.description":
      "Discover how much you can save by switching from a gas-powered motorcycle to a Wedison electric motorcycle. Move the slider, compare the costs, and see the difference yourself. It's time to ride smarter and greener.",
    "calculator.page.battery": "Battery",
    "calculator.page.monthlyTitle": "Monthly Expenses",
    "calculator.page.monthlyCostType": "Cost Type",
    "calculator.page.monthlyElectricityCost": "Electricity Cost",
    "calculator.page.monthlyMaintenanceCost": "Maintenance Cost",
    "calculator.page.monthlyFuelCost": "Fuel Cost",
    "calculator.page.monthlyTotalExpenses": "Total Expenses",
    "calculator.page.savingTitle": "Savings With Wedison",
    "calculator.page.savingMonthlySavings": "Monthly Savings",
    "calculator.page.savingAnnualSavings": "Annual Savings",
    "calculator.page.distance": "Your Daily Distances",
    "calculator.page.tnc1":
      "*Maintenance cost include routine service. excluding front and rear tire replacement",
    "calculator.page.tnc2":
      "**Pertalite fuel (BBM) costs are based on prices as of December 2024",
    "calculator.page.cta": "Prove Yourself",

    // specifications accordion
    "specs.category.engine": "Engine",
    "specs.category.engine.motorType": "Motor Type",
    "specs.category.engine.motorPower": "Motor Power",
    "specs.category.engine.topSpeed": "Top Speed",
    "specs.category.engine.acceleration": "Acceleration (0-60 km/h)",

    "specs.category.battery": "Battery",
    "specs.category.battery.batteryType": "Battery Type",
    "specs.category.battery.batteryCapacity": "Battery Capacity",
    "specs.category.battery.voltage": "Voltage",
    "specs.category.battery.chargingTimeSuperCharge":
      "Charging Time with SuperCharge (10-80%)",
    "specs.category.battery.chargingTimeHome":
      "Charging Time with Home Charging (0-100%)",
    "specs.category.battery.range": "Cruising Range",

    "specs.category.brake": "Brake",
    "specs.category.brake.frontBrake": "Front Brake",
    "specs.category.brake.rearBrake": "Rear Brake",
    "specs.category.brake.cbsSupport": "CBS",

    "specs.category.dimension": "Dimension",
    "specs.category.dimension.length": "Length",
    "specs.category.dimension.width": "Width",
    "specs.category.dimension.height": "Height",
    "specs.category.dimension.wheelbase": "Wheelbase",
    "specs.category.dimension.seatHeight": "Seat Height",
    "specs.category.dimension.weight": "Weight",
    "specs.category.dimension.groundClearance": "Ground Clearance",

    "specs.category.tire": "Tire",
    "specs.category.tire.frontTire": "Front Tire",
    "specs.category.tire.rearTire": "Rear Tire",

    "specs.category.suspension": "Suspension",
    "specs.category.suspension.frontSuspension": "Front Suspension",
    "specs.category.suspension.rearSuspension": "Rear Suspension",

    //edmax
    "edmax.title":
      "EdPower – Powerful & Smart Electric Motorcycle from Wedison",
    "edmax.description":
      "Edmax is Wedison's flagship electric motorcycle with 86km/h top speed, advanced headunit (CarPlay & Android Auto), and SuperCharge support.",

    "edmax.hero.tag": "Flagship Model",
    "edmax.hero.title": "Ride the Future with",
    "edmax.hero.titleHighlight": "EdPower",
    "edmax.hero.description":
      "Experience a bold new way to move – powerful, fast-charging, and 100% electric. Built for style, made for freedom.",
    "edmax.hero.orderNow": "Order Now",
    "edmax.hero.downloadBrochure": "Download Brochure",

    "edmax.feature1.tag": "Smart Display",
    "edmax.feature1.title": "Smart Connectivity at Your Fingertips",
    "edmax.feature1.subtitle":
      "Wireless Apple CarPlay & Android Auto, Full Touchscreen Display",
    "edmax.feature1.description":
      "Connect without the hassle. Access navigation, music and communications directly from the full-color touchscreen with wireless Apple CarPlay and Android Auto support.",
    "edmax.feature1.range": "Range",
    "edmax.feature1.efficient": "Efficient",
    "edmax.feature1.energyUse": "Energy Use",
    "edmax.feature1.realtime": "Real-time",
    "edmax.feature1.rangeIndicator": "Range Indicator",

    "edmax.feature2.tag": "SuperCharge",
    "edmax.feature2.title": "Power Up in Minutes",
    "edmax.feature2.subtitle": "SuperCharge Technology",
    "edmax.feature2.description":
      "From 10% to 80% in just 15 minutes. Because your time is too valuable to waste.",
    "edmax.feature2.charge": "10% to 80% Charge",
    "edmax.feature2.universal": "Universal",
    "edmax.feature2.chargingPort": "Charging Port",
    "edmax.feature2.smart": "Smart",
    "edmax.feature2.chargingApp": "Charging App",

    "edmax.feature3.title": "Designed to Turn Heads",
    "edmax.feature3.subtitle": "Edgy. Sporty. Iconic.",
    "edmax.feature3.description":
      "With bold curves and sharp edges, EdPower brings aggressive style with aerodynamic precision. Ride in style, always.",
    "edmax.feature3.aerodynamic": "Aerodynamic",
    "edmax.feature3.design": "Design",
    "edmax.feature3.led": "LED",
    "edmax.feature3.lighting": "Lighting",
    "edmax.feature3.premium": "Premium",
    "edmax.feature3.materials": "Materials",

    "edmax.color.title": "Choose Your",
    "edmax.color.titleHighlight": "Style",
    "edmax.color.description":
      "Pick your favorite EdPower color and see it in action.",

    "edmax.specs.title": "Specifications",
    "edmax.specs.description":
      "Explore the technical details of the EdPower electric motorcycle.",
    "edmax.specs.engine": "Engine",
    "edmax.specs.battery": "Battery",
    "edmax.specs.brake": "Brake",
    "edmax.specs.dimension": "Dimension",
    "edmax.specs.tire": "Tire",
    "edmax.specs.suspension": "Suspension",

    // edpower
    "edpower.productPage.hero.imageAlt":
      " Full body of EDPower from a three-quarter front angle, showcasing its robust, maxi-scooter design and premium features.",
    "edpower.productPage.hero.title": "EDPOWER",
    "edpower.productPage.hero.description": "The Future of Electric Riding",
    "edpower.productPage.hero.ctaPrimary": "Pesan Sekarang",
    "edpower.productPage.hero.ctaSecondary": "Unduh Brosur",

    "edpower.productPage.techSpecs1.title": 200,
    "edpower.productPage.techSpecs1.unit": "km",
    "edpower.productPage.techSpecs1.desc": "Cruising Range",

    "edpower.productPage.techSpecs2.title": 15,
    "edpower.productPage.techSpecs2.unit": "minutes",
    "edpower.productPage.techSpecs2.desc":
      "Charge from 10% to 80% with SuperCharge",

    "edpower.productPage.techSpecs3.title": 80,
    "edpower.productPage.techSpecs3.unit": "km/h",
    "edpower.productPage.techSpecs3.desc": "Top Speed",

    "edpower.productPage.productOverview.imageAlt":
      "EDPower from a dramatic side profile, emphasizing its wide seat, bold stance, and tech-forward look.",
    "edpower.productPage.productOverview.title":
      "Flagship Power, Unrivaled Comfort.",
    "edpower.productPage.productOverview.description":
      "Meet EDPower—the ultimate electric scooter from Wedison. With its spacious saddle, futuristic styling, and best-in-class range up to 200 km, EDPower sets a new standard for electric two-wheelers. Enjoy advanced comfort, cutting-edge connectivity, and unstoppable power for the longest journeys. Engineered for those who demand the best.",

    "edpower.productPage.productHighlight1.imageAlt":
      "Cockpit view showcasing the large TFT display with Apple CarPlay & Android Auto interface",
    "edpower.productPage.productHighlight1.title":
      "Wireless Apple CarPlay & Android Auto",
    "edpower.productPage.productHighlight1.description":
      "Seamlessly connect your smartphone via wireless Apple CarPlay or Android Auto—enabling navigation, calls, music, and more, right from your scooter’s vibrant display. Stay connected and in control, wherever the road takes you.",

    "edpower.productPage.productHighlight2.imageAlt":
      "Underseat storage, lid open, revealing extra-large compartment",
    "edpower.productPage.productHighlight2.title": "XXL Underseat Storage",
    "edpower.productPage.productHighlight2.description":
      "Pack everything you need for city or long-distance rides. EDPower’s enormous underseat storage easily fits two helmets, groceries, or all your essentials.",

    "edpower.productPage.productHighlight3.imageAlt":
      "Rear three-quarter angle highlighting EDPower’s broad stance and wide seat",
    "edpower.productPage.productHighlight3.title": "Unmatched Comfort & Space",
    "edpower.productPage.productHighlight3.description":
      "With a generously padded, extra-wide seat and ergonomic riding position, EDPower delivers all-day comfort—ideal for solo commutes or weekend escapes.",

    "edpower.productPage.productHighlight4.imageAlt":
      "Front shot showing advanced LED headlamps and modern bodywork",
    "edpower.productPage.productHighlight4.title": "Striking, Modern Design",
    "edpower.productPage.productHighlight4.description":
      "From its bold front end to its sculpted rear, EDPower commands attention with every detail. Ride the future with confidence and style.",

    "edpower.productPage.productHighlight5.imageAlt":
      " Battery/range indicator on the dashboard, close-up",
    "edpower.productPage.productHighlight5.title": "Class-Leading 200 km Range",
    "edpower.productPage.productHighlight5.description":
      "Go farther than ever. With up to 200 km on a single charge, EDPower is ready for city exploring or out-of-town adventures—no limits, just freedom.",

    "edpower.productPage.chargingOverview.imageAlt":
      "EDPower parked at a Wedison showroom with SuperCharge and home charger visible",
    "edpower.productPage.chargingOverview.title":
      "Fast, Flexible Charging for Every Lifestyle",
    "edpower.productPage.chargingOverview.description":
      "EDPower adapts to your schedule with two effortless charging options: ultra-fast SuperCharge at Wedison showrooms, or convenient overnight home charging. Always powered, always ready.",

    "edpower.productPage.chargingHighlight1.imageAlt":
      "EDPower connected to a Wedison SuperCharge station",
    "edpower.productPage.chargingHighlight1.title": "Wedison SuperCharge",
    "edpower.productPage.chargingHighlight1.description": (
      <>
        Charge from 10% to 80% in just 15 minutes. Perfect for quick top-ups on
        the go—available at all Wedison showrooms.{" "}
        <Link href="/super-charge" className="underline text-primary">
          Learn More
        </Link>
      </>
    ),

    "edpower.productPage.chargingHighlight2.imageAlt":
      "EDPower plugged into a home charger in a clean, modern garage",
    "edpower.productPage.chargingHighlight2.title": "Hassle-Free Home Charging",
    "edpower.productPage.chargingHighlight2.description":
      "Plug in at home and start each day with a full battery. EDPower makes overnight charging effortless and worry-free.",

    "edpower.specs.engine.motorType": "Brushless DC Motor",
    "edpower.specs.engine.motorPower": "3 kW",
    "edpower.specs.engine.topSpeed": "80 km/h",
    "edpower.specs.engine.acceleration": "7.9 seconds",
    "edpower.specs.battery.batteryType": "Lithium-ion (LFP)",
    "edpower.specs.battery.batteryCapacity": "5 kWh",
    "edpower.specs.battery.voltage": "76.8 Volt",
    "edpower.specs.battery.chargingTimeSuperCharge": "15 minutes",
    "edpower.specs.battery.chargingTimeHome": "10.2 hours",
    "edpower.specs.battery.range": "200 km",
    "edpower.specs.brake.frontBrake": "Disc Brake",
    "edpower.specs.brake.rearBrake": "Disc Brake",
    "edpower.specs.brake.cbsSupport": "Yes",
    "edpower.specs.dimension.length": "2.000 mm",
    "edpower.specs.dimension.width": "710 mm",
    "edpower.specs.dimension.height": "1.200 mm",
    "edpower.specs.dimension.wheelbase": "1.450 mm",
    "edpower.specs.dimension.groundClearance": "160 mm",
    "edpower.specs.dimension.seatHeight": "740 mm",
    "edpower.specs.dimension.weight": "140 kg",
    "edpower.specs.tire.frontTire": "100/80-14",
    "edpower.specs.tire.rearTire": "120/70-14",
    "edpower.specs.suspension.frontSuspension": "Hydraulic Telescopic",
    "edpower.specs.suspension.rearSuspension": "Hydraulic Telescopic",

    // Dash Page
    "dash.title": "Dash – Electric Delivery Bike with Flexible Cargo Mounting",
    "dash.description":
      "Dash is an electric motorcycle built for delivery. Equipped with rear cargo mount, front basket, and ideal for logistics, food delivery, and courier business.",

    "dash.hero.tag": "Delivery Bike",
    "dash.hero.title": "Maximum Efficiency for ",
    "dash.hero.titleHighlight": "Every Delivery",
    "dash.hero.description":
      "Dash is your ideal electric delivery ride — built to be tough, efficient, and ready for daily operations.",
    "dash.hero.orderNow": "Order Now",
    "dash.hero.downloadBrochure": "Download Brochure",

    "dash.feature1.tag": "Endless Delivery",
    "dash.feature1.title": "Designed for Limitless Delivery",
    "dash.feature1.subtitle": "Flexible rear slot for any box type",
    "dash.feature1.description":
      "The rear slot fits coolboxes, containers, or custom delivery boxes. Stable, compact, and ready to elevate your delivery routine.",

    "dash.feature2.tag": "Built for Delivery",
    "dash.feature2.title": "One Seat, Endless Destinations",
    "dash.feature2.subtitle": "Compact, efficient, and purpose-built",
    "dash.feature2.description":
      "With a single-seat setup, Dash becomes lighter and more efficient — perfect for daily deliveries, food services, or light logistic tasks.",

    "dash.color.title": "Express Your",
    "dash.color.titleHighlight": "Style",
    "dash.color.description":
      "Choose the color that matches your personality and stands out in the urban landscape.",

    "dash.specs.title": "Specifications",
    "dash.specs.description":
      "Discover the technical details that make the Dash perfect for urban adventures.",
    "dash.specs.engine": "Engine",
    "dash.specs.battery": "Battery",
    "dash.specs.brake": "Brake",
    "dash.specs.dimension": "Dimension",
    "dash.specs.tire": "Tire",
    "dash.specs.suspension": "Suspension",

    //victory

    "victory.hero.tag": "Sporty Scooter",
    "victory.hero.title": "Own the Streets with",
    "victory.hero.titleHighlight": "Style and Performance",
    "victory.hero.description":
      "Victory is a versatile electric scooter with a sleek design, built for city rides and modern urban style.",
    "victory.hero.orderNow": "Order Now",
    "victory.hero.downloadBrochure": "Download Brochure",

    "victory.feature1.tag": "City Ride Comfort",
    "victory.feature1.title": "Perfect Size for Urban Roads",
    "victory.feature1.subtitle": "Not too small, not too bulky",
    "victory.feature1.description":
      "Victory strikes the perfect balance—compact enough for tight streets, yet stable for daily commuting with confidence.",

    "victory.feature2.tag": "Sporty Design",
    "victory.feature2.title": "Bold Looks, Modern Feel",
    "victory.feature2.subtitle": "Inspired by performance scooters",
    "victory.feature2.description":
      "Victory's sporty silhouette is made to stand out, offering a stylish ride without sacrificing everyday practicality.",

    "victory.color.title": "Choose Your",
    "victory.color.titleHighlight": "Style",
    "victory.color.description":
      "Pick your favorite Victory color and see it in action.",

    // ====

    "victory.productPage.hero.imageAlt": "Gray Victory",
    "victory.productPage.hero.title": "VICTORY",
    "victory.productPage.hero.description":
      "Conquer the streets with style and performance.",
    "victory.productPage.hero.ctaPrimary": "Order Now",
    "victory.productPage.hero.ctaSecondary": "Download Brochure",

    "victory.productPage.techSpecs1.title": 120,
    "victory.productPage.techSpecs1.unit": "km",
    "victory.productPage.techSpecs1.desc": (
      <>
        <p>Cruising Range</p>
        <p className="text-xs text-gray-500">*with Extended Battery</p>
      </>
    ),

    "victory.productPage.techSpecs2.title": 15,
    "victory.productPage.techSpecs2.unit": "minutes",
    "victory.productPage.techSpecs2.desc":
      "Charge from 10% to 80% with SuperCharge",

    "victory.productPage.techSpecs3.title": 80,
    "victory.productPage.techSpecs3.unit": "km/h",
    "victory.productPage.techSpecs3.desc": "Top Speed",

    "victory.productPage.productOverview.imageAlt": "Gray Victory",
    "victory.productPage.productOverview.title": "Sporty, Agile, Unstoppable.",
    "victory.productPage.productOverview.description":
      "Victory by Wedison brings a new level of sportiness and agility to electric mobility. Purpose-built for city riding, Victory combines aggressive styling, lightning-fast acceleration, and outstanding control. Its wide wheelbase and advanced CBS disc brakes give you confidence in every corner. Go further with up to 120 km range and charge up in minutes—Victory puts you ahead in every journey.",

    "victory.productPage.productHighlight1.imageAlt": "Victory Front look",
    "victory.productPage.productHighlight1.title": "Signature Sporty Design",
    "victory.productPage.productHighlight1.description":
      "Victory stands out with a bold, aerodynamic shape and angular LED lighting—designed for riders who want to turn heads at every stoplight.",

    "victory.productPage.productHighlight2.imageAlt":
      "Front three-quarter view showing wide tire profile and suspension",
    "victory.productPage.productHighlight2.title": "Superior Urban Handling",
    "victory.productPage.productHighlight2.description":
      "Wide wheels, grippy tires, and hydraulic shock absorbers deliver natural, precise handling in every situation—perfect for fast-paced city life.",

    "victory.productPage.productHighlight3.imageAlt":
      "Close-up of SuperCharge port with Wedison branding",
    "victory.productPage.productHighlight3.title": "SuperCharge Ready",
    "victory.productPage.productHighlight3.description":
      "Recharge from 10% to 80% in just 15 minutes with Wedison SuperCharge, or top up at home for total flexibility.",

    "victory.productPage.chargingOverview.imageAlt":
      "Victory parked at a Wedison showroom, SuperCharge station in view",
    "victory.productPage.chargingOverview.title": "Charge Your Way",
    "victory.productPage.chargingOverview.description":
      "Power up in minutes with SuperCharge at any Wedison showroom, or recharge conveniently at home. Victory adapts to your lifestyle—always ready for your next move.",

    "victory.productPage.chargingHighlight1.imageAlt":
      "Victory at a Wedison SuperCharge station, cable connected",
    "victory.productPage.chargingHighlight1.title": "Ultra-Fast SuperCharge",
    "victory.productPage.chargingHighlight1.description": (
      <>
        Go from 10% to 80% charge in just 15 minutes—perfect for quick stops and
        busy days. Available at all Wedison showrooms.{" "}
        <Link href="/super-charge" className="underline text-primary">
          Learn More
        </Link>
      </>
    ),

    "victory.productPage.chargingHighlight2.imageAlt":
      "Victory plugged into a home charger in a modern garage setting",
    "victory.productPage.chargingHighlight2.title": "Everyday Home Charging",
    "victory.productPage.chargingHighlight2.description":
      "Plug in at home and wake up fully charged. With the included home charger, Victory is always ready to go—simple, convenient, and reliable.",

    "victory.specs.engine.motorType": "Brushless DC Motor",
    "victory.specs.engine.motorPower": "3 kW",
    "victory.specs.engine.topSpeed": "80 km/h",
    "victory.specs.engine.acceleration": "6.5 seconds",
    "victory.specs.battery.batteryType": "Lithium-ion (LFP)",
    "victory.specs.battery.batteryCapacity":
      "2.5 kWh (Regular Battery) / 3.4 kWh (Extended Battery)",
    "victory.specs.battery.voltage": "76.8 Volt",
    "victory.specs.battery.chargingTimeSuperCharge": "15 minutes",
    "victory.specs.battery.chargingTimeHome":
      "5 hours (Regular Battery) / 7 hours (Extended Battery)",
    "victory.specs.battery.range":
      "110 km (Regular Battery) / 120 km (Extended Battery)",
    "victory.specs.brake.frontBrake": "Disc Brake",
    "victory.specs.brake.rearBrake": "Disc Brake",
    "victory.specs.brake.cbsSupport": "Yes",
    "victory.specs.dimension.length": "1.950 mm",
    "victory.specs.dimension.width": "690 mm",
    "victory.specs.dimension.height": "1.130 mm",
    "victory.specs.dimension.wheelbase": "1.380 mm",
    "victory.specs.dimension.groundClearance": "140 mm",
    "victory.specs.dimension.seatHeight": "765 mm",
    "victory.specs.dimension.weight": "116.5 kg",
    "victory.specs.tire.frontTire": "90/90-14",
    "victory.specs.tire.rearTire": "100/80-14",
    "victory.specs.suspension.frontSuspension": "Hydraulic Telescopic",
    "victory.specs.suspension.rearSuspension": "Hydraulic Telescopic",

    //athena

    // "athena.hero.tag": "Retro Electric Scooter",
    // "athena.hero.title": "Iconic Design with",
    // "athena.hero.titleHighlight": "Classic & Modern Touch",
    // "athena.hero.description":
    //   "Athena blends retro-classic aesthetics with modern EV performance — timeless style meets cutting-edge electric mobility.",
    // "athena.hero.orderNow": "Order Now",
    // "athena.hero.downloadBrochure": "Download Brochure",

    // "athena.feature1.tag": "Comfortable Ride",
    // "athena.feature1.title": "Comfort on the Road, Beauty in Motion",
    // "athena.feature1.subtitle": "Ergonomic design, smooth ride quality",
    // "athena.feature1.description":
    //   "Athena's ergonomic riding posture and smooth suspension deliver a stylish yet relaxed experience — perfect for city cruising.",

    // "athena.feature2.tag": "Modern EV Tech",
    // "athena.feature2.title": "Retro Style, Modern Power",
    // "athena.feature2.subtitle": "Classic look, electric performance",
    // "athena.feature2.description":
    //   "Combining vintage appeal with powerful EV tech, Athena gives you a fun, efficient, and future-ready ride without sacrificing style.",
    // "athena.color.description":
    //   "Pick your favorite Athena color and see it in action.",

    "athena.productPage.hero.imageAlt": "Pink Athena and Yellow Athena",
    "athena.productPage.hero.title": "ATHENA",
    "athena.productPage.hero.description": "Retro Style, Modern Power",
    "athena.productPage.hero.ctaPrimary": "Order Now",
    "athena.productPage.hero.ctaSecondary": "Download Brochure",

    "athena.productPage.techSpecs1.title": 120,
    "athena.productPage.techSpecs1.unit": "km",
    "athena.productPage.techSpecs1.desc": (
      <>
        <p>Cruising Range</p>
        <p className="text-xs text-gray-500">*with Extended Battery</p>
      </>
    ),

    "athena.productPage.techSpecs2.title": 15,
    "athena.productPage.techSpecs2.unit": "minutes",
    "athena.productPage.techSpecs2.desc":
      "Charge from 10% to 80% with SuperCharge",

    "athena.productPage.techSpecs3.title": 80,
    "athena.productPage.techSpecs3.unit": "km/h",
    "athena.productPage.techSpecs3.desc": "Top Speed",

    "athena.productPage.productOverview.imageAlt": "Green Athena",
    "athena.productPage.productOverview.title": "Timeless Elegance, Recharged",
    "athena.productPage.productOverview.description":
      "Athena by Wedison combines timeless European scooter elegance with cutting-edge electric technology. Designed to stand out while staying quiet, Athena brings a fresh sophistication to city streets—delivering smooth, silent rides with every journey. With up to 120 km range per charge, robust CBS disc brakes, and advanced hydraulic suspension, Athena isn’t just a ride. It’s an experience, crafted for those who crave effortless style and next-generation performance. Fast-charge at any Wedison showroom or enjoy convenient home charging—Athena adapts perfectly to your modern lifestyle.",

    "athena.productPage.productHighlight1.imageAlt": "Head unit Athena",
    "athena.productPage.productHighlight1.title": "Modern Digital Display",
    "athena.productPage.productHighlight1.description":
      "Athena’s clear and bright LCD instrument panel provides all essential ride information at a glance. Simple, digital, and reliable—so you can focus on the road ahead, free from distractions.",

    "athena.productPage.productHighlight2.imageAlt": "Athena SuperCharge",
    "athena.productPage.productHighlight2.title": "SuperCharge",
    "athena.productPage.productHighlight2.description":
      "Power up from 10% to 80% in just 15 minutes with Wedison SuperCharge (available at all showrooms), or conveniently charge at home with a full charge in under 4 hours. Athena is engineered for the non-stop city pace.",

    "athena.productPage.productHighlight3.imageAlt":
      "CBS Breaking System Athena",
    "athena.productPage.productHighlight3.title": "Designed for the City",
    "athena.productPage.productHighlight3.description":
      "With CBS disc brakes front and rear, plus a stable wide-tire setup, Athena offers agile handling and confident braking—so you can move through city streets with poise, comfort, and unmistakable style.",

    "athena.productPage.chargingOverview.imageAlt":
      "Green Athena with SuperCharge and Home Charging",
    "athena.productPage.chargingOverview.title": "Charging Made Effortless",
    "athena.productPage.chargingOverview.description":
      "Stay in motion with Athena’s flexible charging solutions. Plug in at home for everyday convenience, or experience rapid SuperCharge at any Wedison showroom. Athena gives you the freedom to choose—charge where you live, or power up fast when you're on the go.",

    "athena.productPage.chargingHighlight1.imageAlt": "Athena with SuperCharge",
    "athena.productPage.chargingHighlight1.title": "15-Minute SuperCharge",
    "athena.productPage.chargingHighlight1.description": (
      <>
        Experience lightning-fast charging with our advanced SuperCharge
        technology, designed to keep you on the road with charge your battery
        from 10% to 80% in just 15 Minutes.{" "}
        <Link href="/super-charge" className="underline text-primary">
          Learn More
        </Link>
      </>
    ),

    "athena.productPage.chargingHighlight2.imageAlt":
      "Athena with Home Charger",
    "athena.productPage.chargingHighlight2.title": "Convenient Home Charging",
    "athena.productPage.chargingHighlight2.description":
      "Charge overnight, or anytime it suits you. Athena's included home charger delivers a full battery in under four hours—seamless, silent, and ready when you are.",

    "athena.specs.engine.motorType": "Brushless DC Motor",
    "athena.specs.engine.motorPower": "2.5 kW",
    "athena.specs.engine.topSpeed": "80 km/h",
    "athena.specs.engine.acceleration": "6.5 seconds",
    "athena.specs.battery.batteryType": "Lithium-ion (LFP)",
    "athena.specs.battery.batteryCapacity":
      "2.5 kWh (Regular Battery) / 3.4 kWh (Extended Battery)",
    "athena.specs.battery.voltage": "76.8 Volt",
    "athena.specs.battery.chargingTimeSuperCharge": "15 minutes",
    "athena.specs.battery.chargingTimeHome":
      "5 hours (Regular Battery) / 7 hours (Extended Battery)",
    "athena.specs.battery.range":
      "110 km (Regular Battery) / 120 km (Extended Battery)",
    "athena.specs.brake.frontBrake": "Disc Brake",
    "athena.specs.brake.rearBrake": "Disc Brake",
    "athena.specs.brake.cbsSupport": "Yes",
    "athena.specs.dimension.length": "1.850 mm",
    "athena.specs.dimension.width": "750 mm",
    "athena.specs.dimension.height": "1.155 mm",
    "athena.specs.dimension.wheelbase": "1.350 mm",
    "athena.specs.dimension.groundClearance": "160 mm",
    "athena.specs.dimension.seatHeight": "775 mm",
    "athena.specs.dimension.weight": "113.5 kg",
    "athena.specs.tire.frontTire": "100/80-12",
    "athena.specs.tire.rearTire": "100/80-12",
    "athena.specs.suspension.frontSuspension": "Hydraulic Telescopic",
    "athena.specs.suspension.rearSuspension": "Hydraulic Telescopic",

    //mini
    "bees.hero.tag": "Entry-Level EV",
    "bees.hero.title": "Affordable Mobility for",
    "bees.hero.titleHighlight": "Everyday Commuting",
    "bees.hero.description":
      "Bees is Wedison's lightest and most agile electric scooter — designed for students, workers, and anyone looking for a compact, budget-friendly ride.",
    "bees.hero.orderNow": "Order Now",
    "bees.hero.downloadBrochure": "Download Brochure",

    "bees.feature1.tag": "Compact and Nimble",
    "bees.feature1.title": "Small Frame, Big Agility",
    "bees.feature1.subtitle": "Lightweight design for crowded streets",
    "bees.feature1.description":
      "Its slim and light build makes Bees perfect for tight traffic and narrow lanes. Easy to ride, space-saving, and highly maneuverable.",

    "bees.feature2.tag": "Budget-Friendly Ride",
    "bees.feature2.title": "Super Affordable & Subsidy Eligible",
    "bees.feature2.subtitle": "Lower cost, easy access",
    "bees.feature2.description":
      "Bees qualifies for government EV subsidy. It's wallet-friendly, can be charged at home, and perfect for all kinds of daily users.",

    "bees.color.description":
      "Pick your favorite Bees color and see it in action.",

    // ===

    "bees.productPage.hero.imageAlt": "Red Bees and White Bees",
    "bees.productPage.hero.title": "BEES",
    "bees.productPage.hero.description": "Affordable Mobility for Every Ride",
    "bees.productPage.hero.ctaPrimary": "Order Now",
    "bees.productPage.hero.ctaSecondary": "Download Brochure",

    "bees.productPage.techSpecs1.title": 80,
    "bees.productPage.techSpecs1.unit": "km",
    "bees.productPage.techSpecs1.desc": "Cruising Range",

    "bees.productPage.techSpecs2.title": "LED",
    "bees.productPage.techSpecs2.desc": "Head unit Display",

    "bees.productPage.techSpecs3.title": 55,
    "bees.productPage.techSpecs3.unit": "km/h",
    "bees.productPage.techSpecs3.desc": "Top Speed",

    "bees.productPage.productOverview.imageAlt": "Red Bees",
    "bees.productPage.productOverview.title":
      "Small in Size. Big on Experience.",
    "bees.productPage.productOverview.description":
      "Compact yet packed with features—Bees delivers XL underseat storage, a sleek digital LED display, and confident dual disc brakes. Easy home charging makes every day effortless.",

    "bees.productPage.productHighlight1.imageAlt": "Bees Underseat storage",
    "bees.productPage.productHighlight1.title": "XL Underseat Storage",
    "bees.productPage.productHighlight1.description":
      "Bring more along for every ride. Bees' extra-large underseat compartment fits a backpack, groceries, or even a full-face helmet—more space, more possibilities.",

    "bees.productPage.productHighlight2.imageAlt": "Bees LED Display",
    "bees.productPage.productHighlight2.title": "Digital LED Display",
    "bees.productPage.productHighlight2.description":
      "Stay informed and in control with a crisp, modern digital LED display. Get real-time info on speed, battery, and more—all at a glance.",

    "bees.productPage.productHighlight3.imageAlt": "Bees Disc Brakes",
    "bees.productPage.productHighlight3.title": "Confident Dual Disc Brakes",
    "bees.productPage.productHighlight3.description":
      "Experience maximum stopping power and safety with disc brakes on both the front and rear wheels. Enjoy smooth, responsive braking in all riding conditions—so you can ride with complete peace of mind.",

    "bees.productPage.chargingOverview.imageAlt":
      "Red Bees charging at a home outlet",
    "bees.productPage.chargingOverview.title": "Simple Home Charging",
    "bees.productPage.chargingOverview.description":
      "Recharge easily from any standard outlet. With the included home charger, Bees is always ready for your next ride—no fast-charging needed, just plug and go.",

    // ===

    "bees.specs.engine.motorType": "Brushless DC Motor",
    "bees.specs.engine.motorPower": "1.2 kW",
    "bees.specs.engine.topSpeed": "55 km/h",
    "bees.specs.engine.acceleration": "9.3 seconds",
    "bees.specs.battery.batteryType": "Lithium-ion (LFP)",
    "bees.specs.battery.batteryCapacity": "1.6 kWh",
    "bees.specs.battery.voltage": "64 Volt",
    "bees.specs.battery.chargingTimeSuperCharge": "-",
    "bees.specs.battery.chargingTimeHome": "4.1 hours",
    "bees.specs.battery.range": "80 km",
    "bees.specs.brake.frontBrake": "Disc Brake",
    "bees.specs.brake.rearBrake": "Disc Brake",
    "bees.specs.brake.cbsSupport": "No",
    "bees.specs.dimension.length": "1.790 mm",
    "bees.specs.dimension.width": "670 mm",
    "bees.specs.dimension.height": "1.110 mm",
    "bees.specs.dimension.wheelbase": "1.370 mm",
    "bees.specs.dimension.groundClearance": "130 mm",
    "bees.specs.dimension.seatHeight": "760 mm",
    "bees.specs.dimension.weight": "78.5 kg",
    "bees.specs.tire.frontTire": "90/90-10",
    "bees.specs.tire.rearTire": "90/90-10",
    "bees.specs.suspension.frontSuspension": "Hydraulic Telescopic",
    "bees.specs.suspension.rearSuspension": "Hydraulic Telescopic",

    //SuperCharge
    "supercharge.landing.title": "Your Trip",
    "supercharge.landing.description":
      "SuperCharge your ride with fast, reliable charging. Charge from 10% to 80% in just 15 minutes.",

    "supercharge.hero.tag": "Fast Charging",
    "supercharge.hero.title": "Charge from 10% to 80% in",
    "supercharge.hero.titleHighlight": "Just 15 Minutes",
    "supercharge.hero.description":
      "SuperCharge is Wedison’s exclusive fast-charging solution. Designed specifically for EdPower, Athena, and Victory — experience efficiency with no compromise.",
    "supercharge.hero.ctaPrimary": "Find a Station",
    "supercharge.hero.ctaSecondary": "Learn the Tech",

    "supercharge.video.title": "SuperCharge: The Solution for Future Charging",
    "supercharge.video.description":
      "SuperCharge provide a faster, safer, and more convenient charging experience for your electric vehicle.",

    "supercharge.feature1.tag": "Fast & Reliable",
    "supercharge.feature1.title": "Next-Gen Charging Technology",
    "supercharge.feature1.subtitle": "Less time, maximum performance",
    "supercharge.feature1.description":
      "With cutting-edge fast charging, SuperCharge powers your battery from 10% to 80% in just 15 minutes. Save time without sacrificing quality.",

    "supercharge.feature2.tag": "Nationwide Coverage",
    "supercharge.feature2.title": "100+ SuperCharge Stations Across Indonesia",
    "supercharge.feature2.subtitle": "Wherever you ride, we’ve got your charge",
    "supercharge.feature2.description":
      "With over 100 SuperCharge stations across strategic locations in Indonesia, you’ll always stay powered — no matter where the road takes you.",

    "supercharge.feature3.tag": "Reliable. Safe. Compliant.",
    "supercharge.feature3.title": "Built to Last",
    "supercharge.feature3.subtitle": "Safety and reliability first",
    "supercharge.feature3.description":
      "Our DC charging station is designed to work in perfect harmony with your Wedison EV motorcycle, ensuring fast charging while enhancing battery longevity. Fully certified to IEC safety standards and compliant with EU Directives, it provides safe, efficient, and reliable power for your motorcycle—every time.",

    // SuperCharge App Section
    "supercharge.app.tag": "Mobile App",
    "supercharge.app.teaser.title": "Find. Charge.",
    "supercharge.app.teaser.titleHighlight": "Ride.",
    "supercharge.app.teaser.description":
      "Locate the nearest SuperCharge station, check real-time availability, and start charging — all from your phone.",
    "supercharge.app.teaser.feature.find": "Find Stations",
    "supercharge.app.teaser.feature.realtime": "Real-Time",
    "supercharge.app.teaser.feature.charge": "Quick Charge",

    "supercharge.app.hero.title": "Your Charging Companion,",
    "supercharge.app.hero.titleHighlight": "Always In Your Pocket",
    "supercharge.app.hero.description":
      "Monitor charging status, find the nearest station, and manage your SuperCharge sessions — everything you need in one app.",

    "supercharge.app.feature1.icon": "MapPin",
    "supercharge.app.feature1.title": "Find Nearby Stations",
    "supercharge.app.feature1.subtitle": "Locate charging points around you",
    "supercharge.app.feature1.description":
      "View all SuperCharge stations on an interactive map with real-time availability status.",
    "supercharge.app.feature1.bullet1": "Interactive map with GPS navigation",
    "supercharge.app.feature1.bullet2": "Filter by availability & distance",
    "supercharge.app.feature1.bullet3": "Save favorite stations",

    "supercharge.app.feature2.icon": "Activity",
    "supercharge.app.feature2.title": "Real-Time Charging Status",
    "supercharge.app.feature2.subtitle": "Know before you go",
    "supercharge.app.feature2.description":
      "Check station availability, queue status, and estimated wait times before heading out.",
    "supercharge.app.feature2.bullet1": "Live availability updates",
    "supercharge.app.feature2.bullet2": "Charging speed information",
    "supercharge.app.feature2.bullet3": "Queue status & wait times",

    "supercharge.app.feature3.icon": "Zap",
    "supercharge.app.feature3.title": "Seamless Charging Experience",
    "supercharge.app.feature3.subtitle": "Plug in, charge, and go",
    "supercharge.app.feature3.description":
      "Start and monitor your charging session right from the app with a single tap.",
    "supercharge.app.feature3.bullet1": "One-tap charging start",
    "supercharge.app.feature3.bullet2": "Real-time charge monitoring",
    "supercharge.app.feature3.bullet3": "Session history & analytics",

    "supercharge.app.stats.stations": "Stations",
    "supercharge.app.stats.downloads": "Downloads",
    "supercharge.app.stats.rating": "Rating",
    "supercharge.app.stats.chargeTime": "Min Charge",

    "supercharge.app.cta.title": "Ready to SuperCharge",
    "supercharge.app.cta.titleHighlight": "Your Ride?",
    "supercharge.app.cta.description":
      "Download now and never worry about finding a charger again.",

    //form title
    "form.title.placeholder": "Select a topic to discuss",
    "form.title.productInfo": "Electric Motorcycle Product Info",
    "form.title.productInfo.value": "Informasi Produk Motor Listrik",
    "form.title.serviceMaintenance": "Service & Maintenance",
    "form.title.serviceMaintenance.value": "Servis & Perawatan Motor",
    "form.title.testRide": "Book a Test Ride",
    "form.title.testRide.value": "Test Ride / Uji Coba Motor",
    "form.title.paymentOptions": "Payment & Financing Options",
    "form.title.paymentOptions.value": "Simulasi Kredit / Pembayaran",
    "form.title.warrantyClaim": "Warranty Claim",
    "form.title.warrantyClaim.value": "Klaim Garansi",
    "form.title.feedback": "Feedback & Suggestions",
    "form.title.feedback.value": "Saran & Masukan",
    "form.title.technicalIssue": "Technical Issue or Problem",
    "form.title.technicalIssue.value": "Masalah Teknis / Kendala Penggunaan",
    "form.title.partnership": "Business Partnership Inquiry",
    "form.title.partnership.value": "Kerja Sama atau Kemitraan",
    "form.title.other": "Other (please specify)",
    "form.title.other.value": "Judul lainnya: ",
    "form.hasMotor": "Do you own a motorcycle?",
    "form.vehicle": "Your Vehicle Type",
    "form.vehicle.placeholder": "Example: Wedison / EdPower / 2023",
    "form.vehicle.description": "Format: Brand / Model / Year",
    "form.sending.success.title": "Message Sent Successfully!",
    "form.sending.success.description":
      "Thank you for reaching out to us. We will get back to you as soon as possible.",
    "form.sending.error.title": "Error Sending Message",
    "form.sending.error.description":
      "There was an error sending your message. Please try again later or contact us through other channels.",
    "form.sending.sending": "Sending your message... Please wait.",
    "form.agreePrivacy.description": (
      <>
        Allow PT Wedison to use the above information and contact me via email
        and/or phone or other personal communication channels for customer
        service activities in accordance with the{" "}
        {/* <Link href="/" className="underline text-blue-400">
          privacy agreement.
        </Link> */}
        <AlertDialog>
          <AlertDialogTrigger className="underline text-blue-400 cursor-pointer font-semibold">
            Privacy Agreement
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Privacy Agreement</AlertDialogTitle>
              <AlertDialogDescription>
                By submitting this form, you agree that Wedison may collect and
                use your personal data solely to respond to your inquiry. Your
                information will not be shared with third parties without your
                consent.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>I Understand</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    ),
    "form.agreePrivacy.dialogTitle": "Privacy Agreement",
    "form.agreePrivacy.dialogDescription":
      "By submitting this form, you agree that Wedison may collect and use your personal data solely to respond to your inquiry. Your information will not be shared with third parties without your consent.",
    "form.agreePrivacy.dialogButton": "I Understand",

    "mediaCenter.landing.h1": "Media Center",
    "mediaCenter.landing.news.title": "News",
    "mediaCenter.landing.instagram.title": "Instagram",
    "mediaCenter.landing.instagram.follow": "Follow us on Instagram",

    // FAQ
    "faq.category.Battery": "Battery",
    "faq.category.Charging": "Charging",
    "faq.category.Performance": "Performance",
    "faq.category.Safety": "Safety",
    "faq.category.Servicing": "Servicing: Warranty, Repair, and Maintenance",
    "faq.category.SmartFeatures": "Smart Features, Bluetooth, App",
    "faq.category.Tires": "Tires",

    // Battery Questions
    "faq.Battery.questions.0.question": "What is the battery warranty?",
    "faq.Battery.questions.0.answer":
      "Wedison battery is covered by a 3 year warranty",
    "faq.Battery.questions.1.question":
      "How long does it take to fully charge the battery?",
    "faq.Battery.questions.1.answer":
      "Wedison SuperCharge: 10% to 80% in 15 minutes / 10% to 95% in 20 minutes. Wedison Regular Charge: Varies depending on the adapter and battery size, with a duration ranging from approximately 2 to 10 hours.",
    "faq.Battery.questions.2.question": "What type of battery do you use?",
    "faq.Battery.questions.2.answer":
      "Wedison EV uses Lithium-ion Battery (LFP), a type of rechargeable battery commonly used in devices like smartphones, laptops, and electric vehicles.\n\nThe characteristics of Lithium-ion Battery are as follow:\nA. High energy density: It can store a considerable amount of electrical energy in a smaller, lighter package.\nB. High temperature: It performs efficiently at high temperatures of up to 45 degrees celsius and can endure low temperatures without sustaining damage.\nC. Low self-discharge rate: The battery retains its energy effectively even when left unused for days or weeks.\nD. High number of charge cycles: It enables numerous charge cycles of more than 5,000 while maintaining nearly all of their original capacity.\nE. Charges quickly: Wedison EV can be fully charged in 30 mins at one of the super fast charging stations.",
    "faq.Battery.questions.3.question": "How many type of battery do you sell?",
    "faq.Battery.questions.3.answer":
      "Wedison offers 2 battery variations for select models. \nTravelling at 50km/h, the basic and extended versions are capable of travelling up to 110 and 120 km respectively.",
    "faq.Battery.questions.4.question": "Where is the battery from?",
    "faq.Battery.questions.4.answer":
      "Wedison's proprietary battery is developed internally.",
    "faq.Battery.questions.5.question": "How long can your battery last?",
    "faq.Battery.questions.5.answer":
      "Under normal operating conditions, Wedison's proprietary battery is designed to last up to 12 years.",
    "faq.Battery.questions.6.question":
      "Can we use external/third party battery/charger?",
    "faq.Battery.questions.6.answer":
      "No, electric motorcycles require a CAN (Controller Area Network) to communicate with other components of the EV for operation and charging. However, third-party batteries do not use the same CAN for communication.",
    "faq.Battery.questions.7.question": "Can the battery be replaced?",
    "faq.Battery.questions.7.answer":
      "Yes, Wedison supplies original spare parts and accessories like battery.",
    "faq.Battery.questions.8.question":
      "How can I keep the battery in good condition?",
    "faq.Battery.questions.8.answer":
      "During daily use, please try to charge the battery in a timely manner before the level drops below 20% to help extend battery life.",
    "faq.Battery.questions.9.question": "How do I extend battery life?",
    "faq.Battery.questions.9.answer":
      "Avoid fully discharging to 0% or charging to 100%. \nAim to keep the charge between 20% and 80% to reduce battery stress and maximize lifespan.",
    "faq.Battery.questions.10.question":
      "What is the battery Ingress protection (IP) rating?",
    "faq.Battery.questions.10.answer":
      "Wedison batteries are IP67,\nThe battery is completely dustproof and can be immersed in water up to 1 meter deep for up to 30 minutes without damage.",
    "faq.Battery.questions.11.question":
      "How often should I charge the battery? Travelling?",
    "faq.Battery.questions.11.answer":
      "If the vehicle is not used for an extended period (more than a week), please ensure it is charged at least once every month.",
    "faq.Battery.questions.12.question":
      "What happens if I don't use the vehicle for an extended period?",
    "faq.Battery.questions.12.answer":
      "Turn off the MCB (circuit breaker) and ensure the battery is charged at least once a month to maintain health.",

    // Charging Questions
    "faq.Charging.questions.0.question": "Where can we charge our motorcycles?",
    "faq.Charging.questions.0.answer":
      "SuperCharge\nAt Wedison SuperCharge stations, which will progressively be rolled out countrywide.\nRegular Charge \nAt home/places with standard wall socket",
    "faq.Charging.questions.1.question": "How can we charge our motorcycles?",
    "faq.Charging.questions.1.answer":
      "Wedison EV comes with regular and SuperCharge ports which can be charged at home and designated charging stations.",
    "faq.Charging.questions.2.question":
      "Can I use third-party power adapter to charge the EV?",
    "faq.Charging.questions.2.answer":
      "Use only Wedison issued parts and supplies for optimal battery health and performance.",
    "faq.Charging.questions.3.question":
      "Can we charge the motorcycles at home?",
    "faq.Charging.questions.3.answer":
      "Yes, Wedison EV has regular port for charging at home.",
    "faq.Charging.questions.4.question":
      "Does fast charging damage the battery?",
    "faq.Charging.questions.4.answer":
      "Wedison's batteries are engineered for fast charging and long cycle life without causing damage.",
    "faq.Charging.questions.5.question": "Is it fast charging dangerous?",
    "faq.Charging.questions.5.answer":
      "Wedison's fast charging does not shorten battery life or pose any risk of explosion.",
    "faq.Charging.questions.6.question": "Is overcharging dangerous?",
    "faq.Charging.questions.6.answer":
      "Wedison battery is equipped with protection management system\nIf the battery becomes too hot due to overcharging, a built-in safety feature will automatically cut off the power to prevent damage or danger.",
    "faq.Charging.questions.7.question": "Why does charging slow down?",
    "faq.Charging.questions.7.answer":
      "Wedison's advanced lithium-ion battery technology features intelligent charging that balances speed and long-term performance. It charges rapidly up to 95% capacity, then shifts to a slower, controlled rate to protect and extend battery life.\n\nThis intelligent charging approach gets you back on the road faster while helping extend your battery's overall lifespan.",
    "faq.Charging.questions.8.question":
      "What is the duration for regular charging? (600W charger)",
    "faq.Charging.questions.8.answer":
      "The charging time varies depending on model and battery capacity. \nCharging time with a 600w charging adapter from 0-100%:\nRefer to Regular Charge Data",
    "faq.Charging.questions.9.question":
      "What is the duration for regular charging? (1260W charger)",
    "faq.Charging.questions.9.answer":
      "The charging time varies depending on model and battery capacity. \nCharging time with a 1260w charging adapter from 0-100%:\nBees: 3.5 hr (No change, can only use a 600w charger)\nRefer to Regular Charge Data",
    "faq.Charging.questions.10.question": "How do I perform regular charging?",
    "faq.Charging.questions.10.answer":
      "First connect the charger to the vehicle's charging port, then plug it into the power source. \nAfter charging is complete, unplug the power source first, then disconnect the charger from the vehicle.",
    "faq.Charging.questions.11.question": "Is charging free?",
    "faq.Charging.questions.11.answer":
      "No, electric charging is on a Pay as Per use basis, and charging price varies from location and charging station/operators.",

    // Performance Questions
    "faq.Performance.questions.0.question":
      "What is the speed of the motorcycle?",
    "faq.Performance.questions.0.answer":
      "Depending on the model, the top speed ranges from 60 km/hr to 95 km/hr",
    "faq.Performance.questions.1.question":
      "What is the motor power / BLDC of the motorcycle?",
    "faq.Performance.questions.1.answer":
      "The motor power varies between models, ranging from 1,2KW to 5KW",
    "faq.Performance.questions.2.question":
      "What is the range of the motorcycle?",
    "faq.Performance.questions.2.answer":
      "The range varies between model and battery, ranging from 80 km to 200 km",
    "faq.Performance.questions.3.question":
      "Is Wedison EV safe to be used in rain and flood?",
    "faq.Performance.questions.3.answer":
      "Wedison's motor, control unit, and battery are IP67, which have been tested to be waterproof.\nWhile they have undergone a water immersion test at 1 meter, extended immersion is not recommended.",
    "faq.Performance.questions.4.question":
      "Can the motorcycles travel uphill?",
    "faq.Performance.questions.4.answer":
      "Yes, it can go uphill and the climbing ability depends on the model:\nBees, EdPower: 12%\nAthena and Victory: 15%",
    "faq.Performance.questions.5.question":
      "Does the battery degrade overtime?",
    "faq.Performance.questions.5.answer":
      "Like any device powered by a lithium-ion battery, the battery's ability to hold a charge gradually decreases with each charge and discharge cycle. \nThe wear and tear of the battery is influenced by factors such as charge cycles, age of battery, and temperature. \n\nEvery Wedison EV is equipped with a proprietary Lithium Ion battery, which is backed by a 3 year warranty.",

    // Safety Questions
    "faq.Safety.questions.0.question": "Is your battery safe?",
    "faq.Safety.questions.0.answer":
      "Wedison's proprietary batteries feature an advanced battery management system\nwith safety measures to prevent overheating, overcharging, and the risk of fire",
    "faq.Safety.questions.1.question": "What brakes do you use?",
    "faq.Safety.questions.1.answer":
      "CBS (Combined Braking System), an efficient braking system that automatically distributes braking force between the front and rear brakes when the rider applies the brakes:\nAthena, Victory, & EdPower\n\nFront and rear disc brakes, providing enhanced control, safety, and braking performance:\nBees motorcycle",
    "faq.Safety.questions.2.question": "What motor do you use?",
    "faq.Safety.questions.2.answer":
      "Wedison motorcycles are equipped with a brushless DC motor (BLDC), known for its performance, efficiency, torque, and long lifespan.\n\nThere are 1 version available: \n1. DC Brushless Rear Hub Motor: motor speed up to 95 km/hr. (Bees, Athena, Victory, EdPower)",

    // Servicing Questions
    "faq.Servicing.questions.0.question":
      "Does Wedison EV come with free servicing?",
    "faq.Servicing.questions.0.answer":
      "Yes, every Wedison motorcycle comes with 3 complimentary servicing sessions at Wedison or authorized service centers. \nMileage-based warranty inspections are scheduled at 1,000 km, 5,000 km, and 10,000 km intervals.",
    "faq.Servicing.questions.1.question":
      "What mileage is covered under the complimentary servicing schedule?",
    "faq.Servicing.questions.1.answer":
      "The mileage warranty includes checks at 1,000 km, 5,000 km, and 10,000 km.",
    "faq.Servicing.questions.2.question":
      "Where can I service the EV motorcycles?",
    "faq.Servicing.questions.2.answer": "At Wedison authorized service centers",
    "faq.Servicing.questions.3.question":
      "Does Wedison provide spare parts for the motorcycle?",
    "faq.Servicing.questions.3.answer":
      "Yes, Wedison provides ready parts for the motorcycle.",
    "faq.Servicing.questions.4.question":
      "Does the battery come with a warranty?",
    "faq.Servicing.questions.4.answer":
      "Yes, the proprietary battery comes with a 3 year warranty.",
    "faq.Servicing.questions.5.question":
      "Does Wedison motorcycles come with a warranty?",
    "faq.Servicing.questions.5.answer":
      "Yes, the motorcycle comes with a 2 year warranty.",
    "faq.Servicing.questions.6.question":
      "How much does it cost to repair the motorcycle, dynamo, and etc?",
    "faq.Servicing.questions.6.answer":
      "Electric motorcycle repair costs vary on the type and brand of parts, and extent of damage or repair required. \n\nUsers have to check with the respective workshop on pricing.",
    "faq.Servicing.questions.7.question":
      "How does one maintain Wedison motorcycle?",
    "faq.Servicing.questions.7.answer":
      "Proper care and handling, in conjunction with proper and regular maintenance can extend the lifespan of the motorcycle. \nYou don't need to charge your EV every day:\n- Instead, charge it as needed, keeping the battery between 20% and 80% for optimal health and range.\n- Charge it at least once a month.\n- For optimal performance and battery quality, Wedison EVs should be charged and serviced at designated super fast charge stations and service centers respectively.",
    "faq.Servicing.questions.8.question": "Is modification allowed to the EV?",
    "faq.Servicing.questions.8.answer":
      "The product covered under Wedison's warranty includes only its original configuration, design, or specifications. \nDamages, faults, failures, or imperfections caused by abuse, tampering, illegal use, negligence, or prolonged operation are not covered.",
    "faq.Servicing.questions.9.question":
      "What conditions will void the warranty?",
    "faq.Servicing.questions.9.answer":
      "Damage resulting from use of non-original Wedison spar parts or unauthorized modifications. \n\nDamages resulting from unavoidable or unforeseen events—such as smoke, substance exposure, earthquakes, typhoons, floods, chemical corrosion, promotional or advertising activities, complimentary items, noise-related issues, or contact with artificial soft or hard materials—are not covered.",
    "faq.Servicing.questions.10.question":
      "what are the limitations of the warranty",
    "faq.Servicing.questions.10.answer":
      "No components are covered under a lifetime warranty.\nReplacement parts provided under warranty are only covered for the remainder of the original warranty period.\nFor parts purchased or replaced outside of warranty service, the warranty period begins from the date of purchase or replacement.",

    // Smart Features Questions
    "faq.SmartFeatures.questions.0.question":
      "What are the smart features available?",
    "faq.SmartFeatures.questions.0.answer":
      "Wedison Smart Phone App: for select models, it can be used to power the motorcycle on and off via an app using bluetooth connection.\nAdditionally, other features will be rolled out on the app to provide more data.",

    // Tires Questions
    "faq.Tires.questions.0.question": "What is the tire dimension?",
    "faq.Tires.questions.0.answer":
      "Bees: Front: 90/90-10; Rear 90/90-10\nAthena: Front: 100/80-12; Rear 100/80-12\nVictory: Front: 90/90-14; Rear: 100/80-14\nEdPower: Front: 100/90-14; Rear: 120/70-14",

    // Ojol Page
    "ojol.hero.title": "Wedison With",
    "ojol.hero.titleHighlight": "Ride-Hailing",
    "ojol.hero.description":
      "Electric motorcycle solutions for ride-hailing drivers. Lower operating costs, no fuel queues!",
    "ojol.hero.startFrom": "Starting from",
    "ojol.hero.perDay": "/Day",
    "ojol.hero.dailyRental": "DAILY RENTAL",
    "ojol.hero.tagline": "#MadeEasier",
    "ojol.hero.tryFree": "Try It Free!",

    "ojol.benefits.title": "Earn More, Work Smarter",
    "ojol.benefits.description":
      "Tired of fuel queues? Sick of rising gas prices? Relax, Wedison is the answer! Save on operating costs, skip the queues, and enjoy lighter maintenance. Time to upgrade the way you ride!",

    "ojol.campaign.heading": "Hot Campaign",
    "ojol.btn.register": "Register Now",
    "ojol.btn.detail": "See Details",

    "ojol.campaign.milik.title": "Rent-to-Own",
    "ojol.campaign.milik.tagline": "Pay in Installments, Make It Yours!",
    "ojol.campaign.milik.description":
      "A rental program with an ownership option over 3.5 years (42 months). Once the contract ends, the motorcycle is yours!",
    "ojol.campaign.milik.benefit.0":
      "1x Free regular charging adapter (worth Rp 1,000,000)",
    "ojol.campaign.milik.benefit.1":
      "1x Free front and rear tire replacement (worth Rp 385,000)",
    "ojol.campaign.milik.benefit.2":
      "1x Free brake pad replacement (1 set front and rear)",
    "ojol.campaign.milik.benefit.3": "2x Mechanical lock",
    "ojol.campaign.milik.benefit.4": "3-year battery warranty",
    "ojol.campaign.milik.benefit.5": "2-year motorcycle warranty",
    "ojol.campaign.milik.term.0":
      "The rent-to-own scheme runs for 3 years 6 months (42 months)",
    "ojol.campaign.milik.term.1":
      "Riders are entitled to 1 day off per week (maximum 48 days per year)",
    "ojol.campaign.milik.term.2":
      "After the 42-month contract ends, ownership of the motorcycle is transferred to the rider",
    "ojol.campaign.milik.term.3":
      "Savings will be used for insurance, service, spare parts, and BPKB (vehicle ownership document) costs. Any remaining savings at the end of the contract will be transferred to the rider",
    "ojol.campaign.milik.term.4":
      "The down payment is non-refundable once the rider is declared eligible",
    "ojol.campaign.milik.term.5":
      "Traffic fines and violations are the rider's responsibility",
    "ojol.campaign.milik.term.6":
      "Riders must complete the screening process from Wedison",
    "ojol.campaign.milik.scheme.0.label": "Athena/Victory Regular",
    "ojol.campaign.milik.scheme.0.value": "Rp 55,000/day",
    "ojol.campaign.milik.scheme.1.label": "Athena/Victory Extended",
    "ojol.campaign.milik.scheme.1.value": "Rp 60,000/day",
    "ojol.campaign.milik.scheme.2.label": "EdPower Extended",
    "ojol.campaign.milik.scheme.2.value": "Rp 80,000/day",
    "ojol.campaign.milik.scheme.3.label": "Deposit",
    "ojol.campaign.milik.scheme.3.value": "Rp 600,000 - Rp 800,000",

    "ojol.campaign.harian.title": "Daily Rental",
    "ojol.campaign.harian.tagline": "Ride Now, Flexible and Hassle-Free!",
    "ojol.campaign.harian.description":
      "Daily electric motorcycle rental with a 3-year contract. Perfect if you want to ride without worrying about installments!",
    "ojol.campaign.harian.benefit.0": "1x Free regular charging adapter",
    "ojol.campaign.harian.benefit.1":
      "1x Free front and rear tire replacement (worth Rp 385,000)",
    "ojol.campaign.harian.benefit.2":
      "1x Free brake pad replacement (1 set front and rear)",
    "ojol.campaign.harian.benefit.3": "1x Free routine service",
    "ojol.campaign.harian.benefit.4": "2x Mechanical lock",
    "ojol.campaign.harian.benefit.5": "3-year battery warranty",
    "ojol.campaign.harian.benefit.6": "2-year motorcycle warranty",
    "ojol.campaign.harian.term.0":
      "The daily rental scheme runs for 3 years (36 months)",
    "ojol.campaign.harian.term.1":
      "Riders are entitled to 1 day off per week (maximum 48 days per year)",
    "ojol.campaign.harian.term.2":
      "The down payment is non-refundable once the rider is declared eligible",
    "ojol.campaign.harian.term.3":
      "The motorcycle remains fully owned by PT. Wedison Nusantara Energi",
    "ojol.campaign.harian.term.4":
      "Traffic fines and violations are the rider's responsibility",
    "ojol.campaign.harian.term.5":
      "Damage caused by negligence or accidents is the rider's responsibility",
    "ojol.campaign.harian.term.6":
      "Riders must complete the screening process from Wedison",
    "ojol.campaign.harian.term.7": "Motorcycle color is assigned at random",
    "ojol.campaign.harian.scheme.0.label": "Athena/Victory Regular",
    "ojol.campaign.harian.scheme.0.value": "Rp 50,000/day",
    "ojol.campaign.harian.scheme.1.label": "Athena/Victory Extended",
    "ojol.campaign.harian.scheme.1.value": "Rp 55,000/day",
    "ojol.campaign.harian.scheme.2.label": "EdPower Extended",
    "ojol.campaign.harian.scheme.2.value": "Rp 75,000/day",
    "ojol.campaign.harian.scheme.3.label": "Deposit",
    "ojol.campaign.harian.scheme.3.value": "Rp 500,000 - Rp 750,000",

    "ojol.dialog.programBadge": "PROGRAM",
    "ojol.dialog.scheme": "Payment Scheme",
    "ojol.dialog.benefits": "Benefits",
    "ojol.dialog.terms": "Terms & Conditions",
    "ojol.dialog.registerNow": "Register for This Program Now",

    "ojol.supercharge.badge": "10% to 80% in 15 Minutes",
    "ojol.supercharge.descriptionPart1":
      "Time is money, and Supercharge keeps you from wasting it! Just ",
    "ojol.supercharge.descriptionBold": "15 minutes",
    "ojol.supercharge.descriptionPart2":
      " and your battery is back from 10% to 80%. Hit the road again right away, no long waits! A single charge can cover up to 200 km*. More orders, more earnings!",
    "ojol.supercharge.disclaimer":
      "*Range of 200 km applies to the EdPower Extended Battery model",
    "ojol.supercharge.cta": "Learn More",

    "ojol.models.title": "Pick the Right Motorcycle for You",
    "ojol.models.subtitle":
      "Want something nimble for tight alleys or strong for long distances? Wedison has the full lineup to match your riding style!",
    "ojol.models.spec.range": "Range",
    "ojol.models.spec.maxSpeed": "Top Speed",
    "ojol.models.spec.battery": "Battery",
    "ojol.models.spec.supercharge": "SuperCharge",
    "ojol.models.spec.motor": "Motor",
    "ojol.models.value.minutes": "15 minutes",
    "ojol.models.bees.tagline": "Compact & Agile",
    "ojol.models.bees.highlight": "Perfect for tight alleys",
    "ojol.models.victory.tagline": "Stylish & Powerful",
    "ojol.models.victory.highlight": "A balance of style and performance",
    "ojol.models.athena.tagline": "Premium & Comfortable",
    "ojol.models.athena.highlight": "Comfortable for all-day riding",
    "ojol.models.edpower.tagline": "Tough & Long-Range",
    "ojol.models.edpower.highlight": "King of long distances",
    "ojol.models.cta": "See Details",
    "ojol.models.footnote": "*Range with Extended Battery",

    "ojol.cta.badge": "Special Driver Program",
    "ojol.cta.headline.1": "Ready to Earn More",
    "ojol.cta.headline.2": "with Wedison?",
    "ojol.cta.description":
      "Join now and enjoy a range of exclusive benefits: daily rental from 50K, free fast charging, and easy installment programs. Time to upgrade the way you ride!",
    "ojol.cta.benefit.1": "Daily Rental from 50K",
    "ojol.cta.benefit.2": "Free SuperCharge",
    "ojol.cta.benefit.3": "Easy Installments",
    "ojol.cta.benefit.4": "Priority Service",
    "ojol.cta.button": "Contact Wedison Sales",
    "ojol.cta.trust": "Fast response, free consultation!",

    // Language
    language: "English",
    switchLanguage: "Bahasa Indonesia",
  },
  id: {
    //SEO Landing
    "landing.title": "Wedison - Masa Depan Mobilitas Listrik",
    "landing.description":
      "Wedison adalah brand motor listrik yang ramah lingkungan dengan teknologi SuperCharge terkini.",

    // compare table
    "compare.model": "Bandingkan Model",
    "compare.select.bike": "Pilih motor untuk bandingkan",
    "compare.title": "Bandingkan Model Kami",
    "compare.subtitle":
      "Temukan motor listrik yang sempurna sesuai gaya hidupmu",
    "compare.expandAll": "Buka Semua",
    "compare.collapseAll": "Tutup Semua",
    "compare.swipeHint": "Geser untuk lihat lebih",

    // buttons
    "btn.learn.more": "Pelajari Lebih Lanjut",
    "btn.buy.on.tokopedia": "Beli di Tokopedia",
    "btn.see.brochure": "Lihat Brosur",
    "btn.order.now": "Pesan Sekarang",

    // user manual
    "user.manual.tag": "Dokumentasi",
    "user.manual.section.title": "Buku Panduan &",
    "user.manual.section.titleHighlight": "Petunjuk Pemilik",
    "user.manual.section.description":
      "Semua yang perlu kamu ketahui tentang Wedison — pengoperasian, pengisian daya, perawatan, dan keselamatan dalam satu dokumen resmi.",
    "user.manual.faq.section.title": "Buku Panduan untuk",
    "user.manual.faq.section.titleHighlight": "Setiap Model",
    "user.manual.faq.section.description":
      "Pilih model di bawah untuk melihat atau mengunduh buku panduan resminya.",
    "user.manual.btn.view": "Lihat Panduan",
    "user.manual.btn.download": "Unduh",
    "user.manual.card.bees.title": "Wedison Bees",
    "user.manual.card.bees.desc":
      "Komuter urban yang ringkas — petunjuk pengoperasian, pengisian daya, dan perawatan.",
    "user.manual.card.athena.title": "Wedison Athena",
    "user.manual.card.athena.desc":
      "Buku panduan skuter bergaya retro dengan fitur pintar dan perawatan baterai.",
    "user.manual.card.victory.title": "Wedison Victory",
    "user.manual.card.victory.desc":
      "Panduan kelas sport — mode berkendara, SuperCharge, dan servis.",
    "user.manual.card.edpower.title": "Wedison EdPower",
    "user.manual.card.edpower.desc":
      "Model premium jarak jauh — dokumentasi lengkap untuk perjalanan harian dan jauh.",

    // footer support
    "footer.support": "Bantuan",
    "footer.userManual": "Buku Panduan",
    "footer.faq": "FAQ",

    // Navbar
    "nav.products": "Produk",
    "nav.discover": "Jelajahi",
    "nav.discover.leftCard.title": "Jelajahi Wedison",
    "nav.discover.leftCard.description":
      "Jelajahi Experience Center, temukan jawaban di FAQ, dan ikuti kabar terbaru lewat Media Center. Semua informasi ada di satu tempat.",
    "nav.experienceCenter.description":
      "Kunjungi showroom Wedison dan rasakan langsung teknologi supercharge 15 menit.",
    "nav.faq.description":
      "Temukan jawaban atas pertanyaan seputar produk, layanan, dan teknologi kami.",
    "nav.mediaCenter.description":
      "Dapatkan berita, rilis resmi, dan highlight terbaru tentang Wedison.",
    "nav.ojol.description":
      "Program sewa motor listrik eksklusif untuk driver ojol. Mulai dari 50K/hari.",
    "nav.showroom": "Showroom",
    "nav.serviceLocation": "Lokasi Layanan",
    "nav.superCharge": "SuperCharge",
    "nav.corporate": "Perusahaan",
    "nav.corporate.leftCard.title": "Powering the Future",
    "nav.corporate.leftCard.description":
      "Dengan teknologi supercharge, Wedison menghadirkan pengalaman berkendara listrik yang cepat, efisien, dan ramah lingkungan.",
    "nav.aboutUs": "Tentang Kami",
    "nav.aboutUs.description":
      "Kenali visi, misi, dan komitmen Wedison dalam menghadirkan inovasi motor listrik untuk masa depan berkelanjutan.",
    "nav.careers": "Karir",
    "nav.careers.description":
      "Bergabung dengan tim Wedison dan bangun karier di industri kendaraan listrik.",

    // Career Page
    "career.banner.title": "Bergabung Bersama",
    "career.banner.titleHighlight": "Tim Wedison",
    "career.banner.description":
      "Mari bersama membangun masa depan transportasi listrik yang berkelanjutan di Indonesia",
    "career.banner.badge1": "Work-Life Balance",
    "career.banner.badge2": "Gaji Kompetitif",
    "career.banner.badge3": "Pertumbuhan Karir",
    "career.section.title": "Posisi yang Tersedia",
    "career.section.description":
      "Temukan peran yang sesuai dengan passion dan keahlian Anda",
    "career.card.viewDetails": "Lihat Detail",
    "career.card.previewText":
      "Klik untuk melihat detail posisi dan requirements",
    "career.detail.jobOverview": "Job Overview",
    "career.detail.keyResponsibilities": "Key Responsibilities",
    "career.detail.qualifications": "Qualifications & Requirements",
    "career.detail.applyButton": "Lamar Posisi Ini",
    "career.portal.title": "Pilih Platform Lamaran",
    "career.portal.description":
      "Pilih platform job portal untuk melanjutkan lamaran Anda",
    "career.portal.infoText":
      "Anda akan diarahkan ke platform eksternal untuk melengkapi proses lamaran. Pastikan CV dan dokumen pendukung Anda sudah siap.",

    "nav.contactUs": "Hubungi Kami",
    "nav.contactUs.description":
      "Butuh bantuan atau informasi lebih lanjut? Tim Wedison siap melayani Anda.",
    "nav.helpCenter": "Pusat Bantuan",

    // Hero
    "hero.tag": "Masa Depan adalah Listrik",
    "hero.title": "Masa Depan",
    "hero.titleHighlight": "Mobilitas Listrik",
    "hero.description":
      "Rasakan perpaduan sempurna antara tenaga, keberlanjutan, dan teknologi canggih dengan sepeda motor listrik Wedison Motors.",
    "hero.exploreModels": "Jelajahi Model",
    "hero.bookTestRide": "Pesan Test Ride",

    // Features
    "features.tag": "Fitur Revolusioner",
    "features.title": "Mengapa Memilih",
    "features.titleHighlight": "Wedison Motors",
    "features.description":
      "Sepeda motor listrik kami menggabungkan teknologi canggih dengan desain berkelanjutan untuk memberikan pengalaman berkendara yang tak tertandingi.",
    "features.longRangeBattery": "Baterai Jarak Jauh sampai 120km",
    "features.longRangeBatteryDesc":
      "Jelajahi hingga 100 kilometer dengan sekali pengisian menggunakan teknologi baterai lithium-ion canggih kami.",
    "features.rapidCharging": "SuperCharge dalam 15 Menit",
    "features.rapidChargingDesc":
      "Isi daya dari 10% hingga 80% hanya dalam 15 menit dengan jaringan SuperCharge kami.",
    "features.impressivePerformance": "0-95km/jam dalam 3 Detik",
    "features.impressivePerformanceDesc":
      "Rasakan akselerasi 0-100 km/jam dalam waktu kurang dari 3 detik dengan torsi instan.",
    "features.zeroEmissions": "Tanpa Emisi, Udara Lebih Bersih",
    "features.zeroEmissionsDesc":
      "Ditenagai listrik murni, Wedison membantu mengurangi polusi udara di perkotaan. Setiap perjalanan berarti udara yang lebih segar untuk kita semua.",
    "features.zeroEmissionsLink":
      "https://www.sciencedirect.com/science/article/pii/S0967070X21003401",
    "features.healthBenefits": "Solusi Energi yang Lebih Efisien dan Cerdas",
    "features.healthBenefitsDesc":
      "Untuk jarak yang sama, Wedison menggunakan energi lebih sedikit dibanding motor konvensional. Lebih hemat dan efisien.",
    "features.healthBenefitsLink":
      "https://www.sciencedirect.com/science/article/pii/S016041202031970X",
    "features.noiseFree": "Melaju Menuju Masa Depan Berkelanjutan",
    "features.noiseFreeDesc":
      "Setiap pilihan Anda pada Wedison adalah langkah nyata menuju mobilitas hijau yang ramah lingkungan dan berkelanjutan.",
    "features.noiseFreeLink":
      "https://www.sciencedirect.com/science/article/pii/S0160412023003896",

    // Products
    "products.tag": "Armada Kami",
    "products.title": "Sepeda Motor",
    "products.titleHighlight": "Listrik Kami",
    "products.description":
      "Temukan rangkaian sepeda motor listrik berperforma tinggi kami yang dirancang untuk setiap jenis pengendara.",
    "products.learnMore": "Pelajari Lebih Lanjut",
    "products.orderNow": "Pesan Sekarang",
    "products.range": "Jarak Tempuh",
    "products.topSpeed": "Kecepatan Maksimum",
    "products.miles": "km",
    "products.mph": "km/jam",

    // Testimonials
    "testimonials.tag": "Testimoni",
    "testimonials.title": "Apa Kata",
    "testimonials.titleHighlight": "Pengendara Kami",
    "testimonials.description":
      "Dengarkan dari pengendara yang telah beralih ke listrik dengan Wedison Motors.",

    // Contact
    "contact.tag": "Hubungi Kami",
    "contact.title": "Tetap",
    "contact.titleHighlight": "Terhubung",
    "contact.description":
      "Punya pertanyaan tentang sepeda motor listrik kami? Kami siap membantu Anda bergabung dengan revolusi listrik.",
    "contact.sendMessage": "Kirim Pesan Kepada Kami",
    "contact.name": "Nama",
    "contact.email": "Email",
    "contact.address": "Alamat",
    "contact.addressPlaceholder": "Alamat Anda",
    "contact.province": "Provinsi",
    "contact.provincePlaceholder": "Pilih provinsi Anda",
    "contact.city": "Kota",
    "contact.cityPlaceholder": "Pilih kota Anda",
    "contact.provinceError": "Silakan pilih provinsi terlebih dahulu.",
    "contact.subject": "Subjek",
    "contact.subjectPlaceholder": "Bagaimana kami dapat membantu Anda?",
    "contact.message": "Pesan",
    "contact.messagePlaceholder": "Pesan Anda",
    "contact.send": "Kirim Pesan",
    "contact.contactInfo": "Informasi Kontak",
    "contact.headquarters": "Kantor Pusat",
    "contact.phone": "Telepon",
    "contact.phoneHours": "Senin-Jumat dari 9 pagi hingga 6 sore",
    "contact.emailLabel": "Email",
    "contact.emailResponse": "Kami akan merespons secepat mungkin",
    "contact.followUs": "Ikuti Kami",

    // Footer
    "footer.description":
      "Mempelopori masa depan mobilitas listrik dengan teknologi canggih dan desain berkelanjutan.",
    "footer.products": "Produk",
    "footer.experience": "Pengalaman",
    "footer.corporate": "Perusahaan",
    "footer.contact": "Hubungi Kami",
    "footer.about": "Tentang Kami",
    "footer.copyright": "© 2025 Wedison Motors. Seluruh hak cipta dilindungi.",
    "footer.tagline":
      "Dirancang dengan mempertimbangkan keberlanjutan. Didukung oleh energi terbarukan.",
    "footer.privacy": "Privasi",
    "footer.terms": "Ketentuan",
    "footer.cookies": "Cookies",
    "footer.meetus": "Temukan Kami",
    "footer.career": "Karir",

    //showroom

    "showroom.title": "Kunjungi",
    "showroom.titleHighlight": "Showroom Kami",
    "showroom.description":
      "Rasakan sepeda motor listrik kami secara langsung dan temukan masa depan mobilitas.",
    "showroom.tag": "Pusat Pengalaman",
    "showroom.location": "Lokasi Kami",
    "showroom.findUs": "Temukan Kami",
    "showroom.address":
      "Jl. Arteri Pondok Indah No 30 A-C, Kelurahan Kebayoran Lama Selatan, Kecamatan Kebayoran Lama, Jakarta Selatan, DKI Jakarta. 12240",
    "showroom.jakarta.name": "Wedison Jakarta",
    "showroom.jakarta.address":
      "Jl. Arteri Pondok Indah No 30 A-C, Kelurahan Kebayoran Lama Selatan, Kecamatan Kebayoran Lama, Jakarta Selatan, DKI Jakarta. 12240",
    "showroom.bandung.name": "Wedison Bandung",
    "showroom.bandung.address":
      "Jl. Raya Gadobangkong No.154, Gadobangkong, Kec. Ngamprah, Kabupaten Bandung Barat, Jawa Barat 40552",
    "showroom.bali.name": "Wedison Bali",
    "showroom.bali.address":
      "Jl. Gatot Subroto Tengah No.93, Dangin Puri Kaja, Kec. Denpasar Utara, Kota Denpasar, Bali 80118",
    "showroom.facility.showroom": "Showroom",
    "showroom.facility.service": "Service Center",
    "showroom.viewOnMaps": "Lihat di Maps",
    "showroom.hours": "Jam Buka",
    "showroom.weekdays": "Senin - Jumat: 10:00 - 19:00",
    "showroom.weekend": "Sabtu - Minggu: 10:00 - 17:00",
    "showroom.whatYouCanDo": "Apa yang Dapat Anda Lakukan di Showroom",
    "showroom.testRide.title": "Test Ride Sepeda Motor Listrik",
    "showroom.testRide.description":
      "Coba performa sepeda motor listrik Wedison langsung di area uji kami. Rasakan kenyamanan berkendara dengan teknologi terbaru.",
    "showroom.consultation.title": "Konsultasi Produk",
    "showroom.consultation.description":
      "Butuh saran? Tim kami siap membantu Anda menemukan sepeda motor listrik yang paling sesuai dengan kebutuhan Anda.",
    "showroom.financing.title": "Simulasi Pembiayaan",
    "showroom.financing.description":
      "Dapatkan opsi pembelian yang fleksibel melalui program cicilan dan penawaran menarik lainnya.",
    "showroom.service.title": "Layanan dan Purna Jual",
    "showroom.service.description":
      "Kami berkomitmen untuk memberikan layanan purna jual terbaik, termasuk servis resmi dan penggantian suku cadang.",
    "showroom.bookVisit": "Booking Kunjungan",
    "showroom.viewModels": "Pergi ke Showroom",

    // About Us Page
    "about.tag": "Cerita Kami",
    "about.title": "Tentang",
    "about.titleHighlight": "Wedison Group",
    "about.overview.title": "WEDISON: Pelopor Energi Hijau dalam Mobilitas",
    "about.overview.p1":
      "Wedison adalah perusahaan teknologi terkemuka. Kami adalah perusahaan sepeda motor listrik pengisian cepat pertama di Indonesia. Bagi kami, ini bukan hanya tentang menjual sepeda motor listrik, ini tentang menciptakan ekosistem hijau yang mendorong mobilitas berkelanjutan di seluruh dunia.",
    "about.overview.p2":
      "Dipasangkan dengan sistem pengisian listrik canggih kami, sepeda motor listrik kami akan memperkaya gaya hidup konsumen kami dan memperbaiki lingkungan kita.",
    "about.mission.title": "Misi Kami",
    "about.mission.p1":
      "Menciptakan platform dan ekosistem EV energi hijau yang berkelas dunia, cerdas, dan ramah lingkungan.",
    "about.mission.p2":
      "Menyediakan solusi transportasi ekonomis dan menempatkan Sepeda Motor Listrik Wedison di setiap rumah tangga di Indonesia dan negara-negara Asia Tenggara.",
    "about.values.title": "Nilai-Nilai Inti Kami",
    "about.values.innovation.title": "Inovasi Kendaraan Listrik",
    "about.values.innovation.description":
      "Kami berkomitmen untuk mengembangkan kendaraan listrik hemat energi yang dapat diakses oleh masyarakat luas, mendukung transisi ke transportasi ramah lingkungan.",
    "about.values.partnerships.title": "Kemitraan dan Kolaborasi",
    "about.values.partnerships.description":
      "Kami berkolaborasi dengan berbagai industri untuk mempercepat pengembangan infrastruktur kendaraan listrik, termasuk stasiun pengisian dan teknologi baterai.",
    "about.values.experience.title":
      "Pengalaman Pengguna Berorientasi Masa Depan",
    "about.values.experience.description":
      "Menciptakan pengalaman berkendara yang ramah pengguna untuk setiap konsumen, dan mengembangkan fitur cerdas yang memenuhi kebutuhan masyarakat modern.",
    "about.projects.title": "Proyek Kami",
    "about.projects.future.title":
      "Menciptakan Masa Depan Hijau yang Lebih Cerah",
    "about.projects.future.description":
      "Memanfaatkan energi terbarukan untuk mengurangi emisi karbon dan mendukung lingkungan yang lebih sehat. Memperluas pasar kendaraan listrik (EV), menjadikan komunitas lebih bersih dan transportasi lebih terjangkau bagi semua orang.",
    "about.projects.charging.title": "Pengisian SuperCharge",
    "about.projects.charging.description":
      "Kami membangun infrastruktur pengisian yang kuat untuk mendukung ekosistem kendaraan listrik yang berkembang sambil menciptakan peluang penghematan waktu bagi bisnis.",
    "about.offers.title": "Apa yang Kami Tawarkan",
    "about.offers.motorcycles.title": "Model Sepeda Motor Listrik",
    "about.offers.motorcycles.description":
      "Kami menawarkan berbagai model sepeda motor listrik, masing-masing dirancang untuk memenuhi kebutuhan dan preferensi pelanggan yang beragam.",
    "about.offers.charging.title": "Stasiun Pengisian SuperCharge",
    "about.offers.charging.description":
      "Kami menawarkan stasiun pengisian SuperCharge, menyediakan solusi pengisian yang cepat dan nyaman, memastikan bahwa pengguna sepeda motor listrik dapat dengan mudah mengisi daya kendaraan mereka dan tetap di jalan lebih lama.",
    "about.joinUs": "Bergabunglah dengan Misi Kami",
    "about.joinUsDescription":
      "Bergabunglah dengan kami dalam misi kami untuk menciptakan masa depan yang berkelanjutan melalui mobilitas listrik. Bersama-sama, kita dapat membuat perbedaan.",
    "about.contactUs": "Hubungi Kami",

    // Contact Page
    "contact.page.description":
      "Punya pertanyaan atau butuh bantuan? Kami siap membantu. Hubungi kami menggunakan salah satu metode di bawah ini.",
    "contact.page.findUs": "Temukan Kami",
    "contact.page.openInMaps": "Buka di Google Maps",
    "contact.page.hours": "Jam Kerja",
    "contact.page.business.hours": "Senin - Jumat: 09.00 AM - 06.00 PM",
    "contact.page.faqTitle": "Pertanyaan yang Sering Diajukan",
    "contact.page.thankYou": "Terima Kasih!",
    "contact.page.messageReceived":
      "Kami telah menerima pesan Anda dan akan segera menghubungi Anda kembali.",
    "contact.page.sendAnother": "Kirim Pesan Lain",
    "contact.page.sending": "Mengirim...",
    "contact.page.faq.q1":
      "Bagaimana cara melakukan test ride sepeda motor Wedison?",
    "contact.page.faq.a1":
      "Anda dapat menjadwalkan test ride dengan mengunjungi showroom kami atau memesan janji melalui situs web kami. Tim kami akan memandu Anda melalui proses dan membantu Anda mengalami sepeda motor listrik kami secara langsung.",
    "contact.page.faq.q2":
      "Garansi apa yang disertakan dengan sepeda motor Wedison?",
    "contact.page.faq.a2":
      "Semua sepeda motor Wedison dilengkapi dengan garansi komprehensif 3 tahun untuk sepeda motor dan garansi 5 tahun untuk baterai. Ini mencakup cacat produksi dan memastikan ketenangan pikiran bagi pelanggan kami.",
    "contact.page.faq.q3":
      "Berapa lama waktu yang dibutuhkan untuk mengisi daya sepeda motor Wedison?",
    "contact.page.faq.a3":
      "Waktu pengisian bervariasi menurut model, tetapi dengan jaringan SuperCharge kami, sebagian besar model dapat mengisi daya dari 10% hingga 80% hanya dalam 15 menit. Pengisian penuh menggunakan stopkontak rumah standar biasanya membutuhkan waktu 3-4 jam.",
    "contact.page.faq.q4": "Apakah Anda menawarkan opsi pembiayaan?",
    "contact.page.faq.a4":
      "Ya, kami menawarkan opsi pembiayaan yang fleksibel untuk membuat kepemilikan sepeda motor Wedison lebih terjangkau. Tim kami dapat membantu Anda menjelajahi rencana pembayaran yang sesuai dengan anggaran dan kebutuhan Anda.",

    //calculator
    "calculator.page.tag": "Kalkulator Penghematan",
    "calculator.page.title": "Hitung ",
    "calculator.page.titleHighlight": "Penghematanmu Sekarang",
    "calculator.page.description":
      "Cari tahu berapa banyak biaya yang bisa kamu hemat dengan beralih dari motor bensin ke motor listrik Wedison. Geser slidernya, bandingkan biaya bulanan, dan lihat perbedaannya sendiri. Saatnya berkendara lebih hemat dan ramah lingkungan.",
    "calculator.page.battery": "Baterai",
    "calculator.page.monthlyTitle": "Pengeluaran Bulanan",
    "calculator.page.monthlyCostType": "Jenis Biaya",
    "calculator.page.monthlyElectricityCost": "Biaya Listrik",
    "calculator.page.monthlyMaintenanceCost": "Biaya Perawatan",
    "calculator.page.monthlyFuelCost": "Biaya Bahan Bakar",
    "calculator.page.monthlyTotalExpenses": "Total Pengeluaran",
    "calculator.page.savingTitle": "Penghematan dengan Wedison",
    "calculator.page.savingMonthlySavings": "Penghematan Bulanan",
    "calculator.page.savingAnnualSavings": "Penghematan Tahunan",
    "calculator.page.distance": "Jarak Tempuh Harianmu",
    "calculator.page.tnc1":
      "*Biaya perawatan mencakup servis rutin, tidak termasuk penggantian ban depan dan belakang",
    "calculator.page.tnc2":
      "**Harga bahan bakar Pertalite mengacu pada harga per Desember 2024",
    "calculator.page.cta": "Buktikan Sendiri",

    // specifications accordion
    "specs.category.engine": "Mesin",
    "specs.category.engine.motorType": "Tipe Motor",
    "specs.category.engine.motorPower": "Daya Motor (rata-rata)",
    "specs.category.engine.topSpeed": "Kecepatan Maksimum",
    "specs.category.engine.acceleration": "Akselerasi (0-50 km/j)",

    "specs.category.battery": "Baterai",
    "specs.category.battery.batteryType": "Tipe Baterai",
    "specs.category.battery.batteryCapacity": "Kapasitas Baterai",
    "specs.category.battery.voltage": "Tegangan Baterai (Volt)",
    "specs.category.battery.chargingTimeSuperCharge":
      "Waktu Pengisian dengan SuperCharge (10-80%)",
    "specs.category.battery.chargingTimeHome":
      "Waktu Pengisian dengan Home Charging (0-100%)",
    "specs.category.battery.range": "Jarak Tempuh",

    "specs.category.brake": "Rem",
    "specs.category.brake.frontBrake": "Rem Depan",
    "specs.category.brake.rearBrake": "Rem Belakang",
    "specs.category.brake.cbsSupport": "CBS",

    "specs.category.dimension": "Dimensi",
    "specs.category.dimension.length": "Panjang",
    "specs.category.dimension.width": "Lebar",
    "specs.category.dimension.height": "Tinggi",
    "specs.category.dimension.wheelbase": "Jarak Sumbu Roda (Wheelbase)",
    "specs.category.dimension.groundClearance":
      "Jarak Terendah ke Tanah (Ground Clearance)",
    "specs.category.dimension.seatHeight": "Tinggi Jok",
    "specs.category.dimension.weight": "Berat",

    "specs.category.tire": "Ban",
    "specs.category.tire.frontTire": "Ban Depan",
    "specs.category.tire.rearTire": "Ban Belakang",

    "specs.category.suspension": "Suspensi",
    "specs.category.suspension.frontSuspension": "Suspensi Depan",
    "specs.category.suspension.rearSuspension": "Suspensi Belakang",

    //edmax
    "edmax.title": "Edmax – Motor Listrik Canggih dan Bertenaga dari Wedison",
    "edmax.description":
      "Edmax adalah motor listrik flagship dari Wedison dengan top speed 86km/jam, headunit canggih (CarPlay & Android Auto), dan mendukung SuperCharge.",

    "edmax.hero.tag": "Model Unggulan",
    "edmax.hero.title": "Melaju ke Masa Depan dengan",
    "edmax.hero.titleHighlight": "EdPower",
    "edmax.hero.description":
      "Rasakan cara baru yang berani untuk bergerak – bertenaga, pengisian cepat, dan 100% listrik. Dibuat untuk gaya, diciptakan untuk kebebasan.",
    "edmax.hero.orderNow": "Pesan Sekarang",
    "edmax.hero.downloadBrochure": "Unduh Brosur",

    "edmax.feature1.tag": "Smart Display",
    "edmax.feature1.title": "Konektivitas Cerdas di Ujung Jari Anda",
    "edmax.feature1.subtitle":
      "Wireless Apple CarPlay & Android Auto, Full Layar Touch Screen",
    "edmax.feature1.description":
      "Terhubung tanpa repot. Akses navigasi, musik, dan komunikasi langsung dari layar sentuh penuh warna dengan dukungan Apple CarPlay dan Android Auto nirkabel.",
    "edmax.feature1.range": "Jarak Tempuh",
    "edmax.feature1.efficient": "Efisien",
    "edmax.feature1.energyUse": "Penggunaan Energi",
    "edmax.feature1.realtime": "Waktu Nyata",
    "edmax.feature1.rangeIndicator": "Indikator Jarak",

    "edmax.feature2.tag": "Pengisian Super Cepat",
    "edmax.feature2.title": "Isi Daya dalam Hitungan Menit",
    "edmax.feature2.subtitle": "Teknologi Pengisian Super Cepat",
    "edmax.feature2.description":
      "Dari 10 hingga 80% hanya dalam 15 menit. Karena waktu Anda terlalu berharga untuk disia-siakan.",
    "edmax.feature2.charge": "Pengisian 10-80%",
    "edmax.feature2.universal": "Universal",
    "edmax.feature2.chargingPort": "Port Pengisian",
    "edmax.feature2.smart": "Pintar",
    "edmax.feature2.chargingApp": "Aplikasi Pengisian",

    "edmax.feature3.title": "Dirancang untuk Menarik Perhatian",
    "edmax.feature3.subtitle": "Tajam. Sporty. Ikonik.",
    "edmax.feature3.description":
      "Dengan lekukan yang berani dan tepi yang tajam, EdPower menghadirkan gaya agresif dengan presisi aerodinamis. Berkendara dengan gaya, selalu.",
    "edmax.feature3.aerodynamic": "Aerodinamis",
    "edmax.feature3.design": "Desain",
    "edmax.feature3.led": "LED",
    "edmax.feature3.lighting": "Pencahayaan",
    "edmax.feature3.premium": "Premium",
    "edmax.feature3.materials": "Material",

    "edmax.color.title": "Tentukan",
    "edmax.color.titleHighlight": "Gayamu",
    "edmax.color.description":
      "Pilih warna EdPower favorit Anda dan lihat tampilannya.",

    "edmax.specs.title": "Spesifikasi",
    "edmax.specs.description":
      "Jelajahi detail teknis sepeda motor listrik EdPower.",
    "edmax.specs.engine": "Mesin",
    "edmax.specs.battery": "Baterai",
    "edmax.specs.brake": "Rem",
    "edmax.specs.dimension": "Dimensi",
    "edmax.specs.tire": "Ban",
    "edmax.specs.suspension": "Suspensi",

    // edpower
    "edpower.productPage.hero.imageAlt":
      "Tampilan penuh EDPower dari sudut depan tiga perempat, menonjolkan desain maxi-scooter yang kokoh dan fitur premiumnya.",
    "edpower.productPage.hero.title": "EDPOWER",
    "edpower.productPage.hero.description": "Masa Depan Berkendara Listrik",
    "edpower.productPage.hero.ctaPrimary": "Pesan Sekarang",
    "edpower.productPage.hero.ctaSecondary": "Unduh Brosur",

    "edpower.productPage.techSpecs1.title": 200,
    "edpower.productPage.techSpecs1.unit": "km",
    "edpower.productPage.techSpecs1.desc": "Jarak Tempuh",

    "edpower.productPage.techSpecs2.title": 15,
    "edpower.productPage.techSpecs2.unit": "menit",
    "edpower.productPage.techSpecs2.desc":
      "Isi daya dari 10% ke 80% dengan SuperCharge",

    "edpower.productPage.techSpecs3.title": 80,
    "edpower.productPage.techSpecs3.unit": "km/jam",
    "edpower.productPage.techSpecs3.desc": "Kecepatan Maksimum",

    "edpower.productPage.productOverview.imageAlt":
      "Tampilan samping dramatis EDPower, menonjolkan jok lebar, posisi berkendara kokoh, dan tampilan futuristik.",
    "edpower.productPage.productOverview.title":
      "Kekuatan Utama, Kenyamanan Tak Tertandingi.",
    "edpower.productPage.productOverview.description":
      "Inilah EDPower—skuter listrik andalan dari Wedison. Dengan jok luas, desain futuristik, dan jarak tempuh terbaik hingga 200 km, EDPower menetapkan standar baru untuk kendaraan roda dua listrik. Nikmati kenyamanan tingkat lanjut, konektivitas canggih, dan tenaga yang siap menjelajah jauh. Dirancang bagi mereka yang menuntut yang terbaik.",

    "edpower.productPage.productHighlight1.imageAlt":
      "Tampilan kokpit menampilkan layar TFT besar dengan antarmuka Apple CarPlay & Android Auto",
    "edpower.productPage.productHighlight1.title":
      "Wireless Apple CarPlay & Android Auto",
    "edpower.productPage.productHighlight1.description":
      "Hubungkan smartphone Anda dengan mudah melalui Apple CarPlay atau Android Auto tanpa kabel—untuk navigasi, panggilan, musik, dan lainnya langsung dari layar berwarna skuter Anda. Tetap terhubung dan terkendali, ke mana pun Anda melaju.",

    "edpower.productPage.productHighlight2.imageAlt":
      "Bagasi bawah jok terbuka menampilkan ruang ekstra besar",
    "edpower.productPage.productHighlight2.title": "Bagasi XXL di Bawah Jok",
    "edpower.productPage.productHighlight2.description":
      "Bawa semua yang Anda butuhkan untuk perjalanan kota maupun jarak jauh. Bagasi bawah jok EDPower yang sangat besar dengan mudah memuat dua helm, belanjaan, atau seluruh perlengkapan penting Anda.",

    "edpower.productPage.productHighlight3.imageAlt":
      "Tampilan belakang tiga perempat menonjolkan postur EDPower yang lebar dan jok ekstra luas",
    "edpower.productPage.productHighlight3.title":
      "Kenyamanan & Ruang Tanpa Tanding",
    "edpower.productPage.productHighlight3.description":
      "Dengan jok ekstra lebar dan empuk serta posisi berkendara ergonomis, EDPower menghadirkan kenyamanan sepanjang hari—ideal untuk perjalanan harian atau liburan akhir pekan.",

    "edpower.productPage.productHighlight4.imageAlt":
      "Tampilan depan menampilkan lampu LED canggih dan bodi modern",
    "edpower.productPage.productHighlight4.title":
      "Desain Modern yang Mencuri Perhatian",
    "edpower.productPage.productHighlight4.description":
      "Dari bagian depan yang tegas hingga bodi belakang yang sculpted, setiap detail EDPower dirancang untuk menarik perhatian. Rasakan masa depan dengan penuh percaya diri dan gaya.",

    "edpower.productPage.productHighlight5.imageAlt":
      "Indikator baterai/jarak tempuh pada dashboard, tampilan close-up",
    "edpower.productPage.productHighlight5.title":
      "Jarak Tempuh Terbaik 200 km",
    "edpower.productPage.productHighlight5.description":
      "Jelajahi lebih jauh dari sebelumnya. Dengan jarak tempuh hingga 200 km dalam sekali pengisian, EDPower siap menjelajah kota maupun luar kota—tanpa batas, hanya kebebasan.",

    "edpower.productPage.chargingOverview.imageAlt":
      "EDPower terparkir di showroom Wedison dengan stasiun SuperCharge dan charger rumah yang terlihat",
    "edpower.productPage.chargingOverview.title":
      "Pengisian Cepat & Fleksibel untuk Setiap Gaya Hidup",
    "edpower.productPage.chargingOverview.description":
      "EDPower menyesuaikan jadwal Anda dengan dua pilihan pengisian daya yang mudah: SuperCharge ultra-cepat di showroom Wedison, atau pengisian semalam yang praktis di rumah. Selalu bertenaga, selalu siap berangkat.",

    "edpower.productPage.chargingHighlight1.imageAlt":
      "EDPower terhubung ke stasiun SuperCharge Wedison",
    "edpower.productPage.chargingHighlight1.title": "Wedison SuperCharge",
    "edpower.productPage.chargingHighlight1.description": (
      <>
        Isi daya dari 10% ke 80% hanya dalam 15 menit. Sempurna untuk isi cepat
        di sela aktivitas—tersedia di seluruh showroom Wedison.{" "}
        <Link href="/super-charge" className="underline text-primary">
          Pelajari Lebih Lanjut
        </Link>
      </>
    ),

    "edpower.productPage.chargingHighlight2.imageAlt":
      "EDPower terhubung ke charger rumah di garasi modern yang bersih",
    "edpower.productPage.chargingHighlight2.title":
      "Pengisian Daya di Rumah Tanpa Repot",
    "edpower.productPage.chargingHighlight2.description":
      "Colokkan di rumah dan mulai hari Anda dengan baterai penuh. EDPower membuat pengisian semalam menjadi mudah dan tanpa khawatir.",

    "edpower.specs.engine.motorType": "Brushless DC Motor",
    "edpower.specs.engine.motorPower": "3 kW",
    "edpower.specs.engine.topSpeed": "80 km/jam",
    "edpower.specs.engine.acceleration": "7.9 detik",
    "edpower.specs.battery.batteryType": "Lithium-ion (LFP)",
    "edpower.specs.battery.batteryCapacity": "5 kWh",
    "edpower.specs.battery.voltage": "76.8 Volt",
    "edpower.specs.battery.chargingTimeSuperCharge": "15 menit",
    "edpower.specs.battery.chargingTimeHome": "10.2 jam",
    "edpower.specs.battery.range": "200 km",
    "edpower.specs.brake.frontBrake": "Rem Cakram",
    "edpower.specs.brake.rearBrake": "Rem Cakram",
    "edpower.specs.brake.cbsSupport": "Ya",
    "edpower.specs.dimension.length": "2.000 mm",
    "edpower.specs.dimension.width": "710 mm",
    "edpower.specs.dimension.height": "1.200 mm",
    "edpower.specs.dimension.wheelbase": "1.450 mm",
    "edpower.specs.dimension.groundClearance": "160 mm",
    "edpower.specs.dimension.seatHeight": "740 mm",
    "edpower.specs.dimension.weight": "140 kg",
    "edpower.specs.tire.frontTire": "100/80-14",
    "edpower.specs.tire.rearTire": "120/70-14",
    "edpower.specs.suspension.frontSuspension": "Hidrolik Teleskopik",
    "edpower.specs.suspension.rearSuspension": "Hidrolik Teleskopik",

    //dash
    "dash.title":
      "Dash – Motor Listrik Pengiriman dengan Rak & Ruang Kargo Fleksibel",
    "dash.description":
      "Dash adalah motor listrik yang dirancang untuk pengiriman. Dilengkapi dudukan box belakang, keranjang depan, dan cocok untuk usaha logistik, makanan, hingga kurir",

    "dash.hero.tag": "Motor Delivery",
    "dash.hero.title": "Efisiensi Maksimal untuk",
    "dash.hero.titleHighlight": "Setiap Pengantaran",
    "dash.hero.description":
      "Dash hadir sebagai solusi motor listrik ideal untuk kebutuhan pengiriman harian yang tangguh dan hemat energi.",
    "dash.hero.orderNow": "Pesan Sekarang",
    "dash.hero.downloadBrochure": "Unduh Brosur",

    "dash.feature1.tag": "Pengiriman Tanpa Batas",
    "dash.feature1.title": "Dirancang untuk Pengiriman Tanpa Batas",
    "dash.feature1.subtitle": "Slot fleksibel untuk berbagai jenis box",
    "dash.feature1.description":
      "Slot belakang siap digunakan dengan coolbox, container, atau box lain sesuai kebutuhan pengirimanmu. Ringkas, stabil, dan bikin pengantaran makin praktis.",

    "dash.feature2.tag": "Dirancang Untuk Pengiriman",
    "dash.feature2.title": "Satu Jok, Seribu Tujuan",
    "dash.feature2.subtitle": "Praktis, ringan, dan efisien",
    "dash.feature2.description":
      "Tanpa kursi penumpang, Dash lebih ringan dan efisien. Ideal untuk operasional harian seperti pengiriman makanan, barang, atau kebutuhan logistik ringan.",

    "dash.color.title": "Ekspresikan",
    "dash.color.titleHighlight": "Gaya Anda",
    "dash.color.description":
      "Pilih warna yang sesuai dengan kepribadian Anda dan menonjol di lanskap perkotaan.",

    "dash.specs.title": "Spesifikasi",
    "dash.specs.description":
      "Temukan detail teknis yang membuat Dash sempurna untuk petualangan perkotaan.",
    "dash.specs.engine": "Mesin",
    "dash.specs.battery": "Baterai",
    "dash.specs.brake": "Rem",
    "dash.specs.dimension": "Dimensi",
    "dash.specs.tire": "Ban",
    "dash.specs.suspension": "Suspensi",

    //victory
    "victory.hero.tag": "Skuter Sporty",
    "victory.hero.title": "Kendalikan Jalanan dengan",
    "victory.hero.titleHighlight": "Gaya dan Performa",
    "victory.hero.description":
      "Victory hadir sebagai skuter listrik serbaguna dengan desain ramping, cocok untuk city ride dengan gaya sporty yang modern.",
    "victory.hero.orderNow": "Pesan Sekarang",
    "victory.hero.downloadBrochure": "Unduh Brosur",

    "victory.feature1.tag": "City Riding Nyaman",
    "victory.feature1.title": "Ukuran Ideal untuk Perkotaan",
    "victory.feature1.subtitle": "Tidak terlalu kecil, tidak terlalu besar",
    "victory.feature1.description":
      "Victory dirancang dengan dimensi pas untuk manuver perkotaan—mudah dikendalikan di jalan sempit, tapi tetap terasa kokoh dan stabil.",

    "victory.feature2.tag": "Desain Sporty",
    "victory.feature2.title": "Tampil Gahar & Modern",
    "victory.feature2.subtitle": "Mirip skutik performa tinggi",
    "victory.feature2.description":
      "Tampilan Victory terinspirasi dari desain skuter sporty, menjadikannya pilihan ideal untuk kamu yang ingin tampil beda dan tetap efisien.",

    "victory.color.description":
      "Pilih warna Victory favoritmu dan lihat tampilannya.",

    // ===

    "victory.productPage.hero.imageAlt": "Victory Abu-Abu",
    "victory.productPage.hero.title": "VICTORY",
    "victory.productPage.hero.description":
      "Taklukkan jalanan dengan gaya dan performa.",
    "victory.productPage.hero.ctaPrimary": "Pesan Sekarang",
    "victory.productPage.hero.ctaSecondary": "Unduh Brosur",

    "victory.productPage.techSpecs1.title": 120,
    "victory.productPage.techSpecs1.unit": "km",
    "victory.productPage.techSpecs1.desc": (
      <>
        <p>Jarak Tempuh</p>
        <p className="text-xs text-gray-500">*dengan Baterai Extended</p>
      </>
    ),

    "victory.productPage.techSpecs2.title": 15,
    "victory.productPage.techSpecs2.unit": "menit",
    "victory.productPage.techSpecs2.desc":
      "Isi daya dari 10% ke 80% dengan SuperCharge",

    "victory.productPage.techSpecs3.title": 80,
    "victory.productPage.techSpecs3.unit": "km/jam",
    "victory.productPage.techSpecs3.desc": "Kecepatan Maksimum",

    "victory.productPage.productOverview.imageAlt": "Victory Abu-Abu",
    "victory.productPage.productOverview.title":
      "Sporty, Lincah, Tak Terhentikan.",
    "victory.productPage.productOverview.description":
      "Victory dari Wedison menghadirkan tingkat sportiness dan kelincahan baru dalam mobilitas listrik. Dirancang khusus untuk berkendara di kota, Victory memadukan tampilan agresif, akselerasi super cepat, dan kendali yang luar biasa. Dengan wheelbase lebar dan rem cakram CBS canggih, Anda akan merasa percaya diri di setiap tikungan. Tempuh jarak hingga 120 km dan isi daya dalam hitungan menit—Victory selalu membawa Anda selangkah lebih maju di setiap perjalanan.",

    "victory.productPage.productHighlight1.imageAlt": "Tampilan Depan Victory",
    "victory.productPage.productHighlight1.title": "Desain Sporty yang Ikonik",
    "victory.productPage.productHighlight1.description":
      "Victory tampil mencolok dengan bentuk aerodinamis yang tegas dan pencahayaan LED bergaya tajam—dirancang untuk pengendara yang ingin tampil beda di setiap lampu merah.",

    "victory.productPage.productHighlight2.imageAlt":
      "Tampilan tiga perempat depan menunjukkan ban lebar dan suspensi",
    "victory.productPage.productHighlight2.title":
      "Kendali Urban yang Superior",
    "victory.productPage.productHighlight2.description":
      "Ban lebar, daya cengkeram tinggi, dan suspensi hidrolik memberikan pengendalian yang presisi dan alami di berbagai kondisi—sempurna untuk gaya hidup kota yang dinamis.",

    "victory.productPage.productHighlight3.imageAlt":
      "Tampilan dekat port SuperCharge dengan branding Wedison",
    "victory.productPage.productHighlight3.title": "Siap SuperCharge",
    "victory.productPage.productHighlight3.description":
      "Isi daya dari 10% ke 80% hanya dalam 15 menit dengan Wedison SuperCharge, atau isi daya di rumah untuk fleksibilitas penuh.",

    "victory.productPage.chargingOverview.imageAlt":
      "Victory terparkir di showroom Wedison, dengan stasiun SuperCharge di latar",
    "victory.productPage.chargingOverview.title": "Isi Daya Sesuai Gaya Anda",
    "victory.productPage.chargingOverview.description":
      "Isi daya dalam hitungan menit dengan SuperCharge di seluruh showroom Wedison, atau isi ulang dengan mudah di rumah. Victory menyesuaikan gaya hidup Anda—selalu siap untuk langkah berikutnya.",

    "victory.productPage.chargingHighlight1.imageAlt":
      "Victory di stasiun SuperCharge Wedison, kabel terhubung",
    "victory.productPage.chargingHighlight1.title": "SuperCharge Super Cepat",
    "victory.productPage.chargingHighlight1.description": (
      <>
        Isi daya dari 10% ke 80% hanya dalam 15 menit—sempurna untuk berhenti
        sejenak di hari yang sibuk. Tersedia di semua showroom Wedison.{" "}
        <Link href="/super-charge" className="underline text-primary">
          Pelajari Lebih Lanjut
        </Link>
      </>
    ),

    "victory.productPage.chargingHighlight2.imageAlt":
      "Victory terhubung ke charger rumah di garasi modern",
    "victory.productPage.chargingHighlight2.title":
      "Pengisian Daya Harian di Rumah",
    "victory.productPage.chargingHighlight2.description":
      "Colokkan di rumah dan bangun dengan baterai penuh. Dengan charger rumahan bawaan, Victory selalu siap diajak berangkat—praktis, mudah, dan bisa diandalkan.",

    "victory.specs.engine.motorType": "Brushless DC Motor",
    "victory.specs.engine.motorPower": "3 kW",
    "victory.specs.engine.topSpeed": "80 km/jam",
    "victory.specs.engine.acceleration": "6.5 detik",
    "victory.specs.battery.batteryType": "Lithium-ion (LFP)",
    "victory.specs.battery.batteryCapacity":
      "2.5 kWh (Baterai Regular) / 3.4 kWh (Baterai Extended)",
    "victory.specs.battery.voltage": "76.8 Volt",
    "victory.specs.battery.chargingTimeSuperCharge": "15 menit",
    "victory.specs.battery.chargingTimeHome":
      "5 jam (Baterai Regular) / 7 jam (Baterai Extended)",
    "victory.specs.battery.range":
      "110 km (Baterai Regular) / 120 km (Baterai Extended)",
    "victory.specs.brake.frontBrake": "Rem Cakram",
    "victory.specs.brake.rearBrake": "Rem Cakram",
    "victory.specs.brake.cbsSupport": "Ya",
    "victory.specs.dimension.length": "1.950 mm",
    "victory.specs.dimension.width": "690 mm",
    "victory.specs.dimension.height": "1.130 mm",
    "victory.specs.dimension.wheelbase": "1.380 mm",
    "victory.specs.dimension.groundClearance": "140 mm",
    "victory.specs.dimension.seatHeight": "765 mm",
    "victory.specs.dimension.weight": "116.5 kg",
    "victory.specs.tire.frontTire": "90/90-14",
    "victory.specs.tire.rearTire": "100/80-14",
    "victory.specs.suspension.frontSuspension": "Hidrolik Teleskopik",
    "victory.specs.suspension.rearSuspension": "Hidrolik Teleskopik",

    //athena

    // "athena.hero.tag": "Motor Listrik Retro",
    // "athena.hero.title": "Desain Ikonik yang",
    // "athena.hero.titleHighlight": "Klasik & Modern",
    // "athena.hero.description":
    //   "Athena menghadirkan estetika retro klasik dengan performa modern. Perpaduan gaya abadi dan teknologi masa kini dalam satu kendaraan elektrik.",
    // "athena.hero.orderNow": "Pesan Sekarang",
    // "athena.hero.downloadBrochure": "Unduh Brosur",

    // "athena.feature1.tag": "Kenyamanan Berkendara",
    // "athena.feature1.title": "Nyaman Dikendarai, Elegan Dipandang",
    // "athena.feature1.subtitle": "Desain ergonomis, sensasi berkendara halus",
    // "athena.feature1.description":
    //   "Dengan posisi duduk ergonomis dan suspensi yang mendukung kenyamanan, Athena siap menemani perjalananmu dengan penuh gaya dan rasa rileks.",

    // "athena.feature2.tag": "Teknologi EV Modern",
    // "athena.feature2.title": "Gaya Retro, Tenaga Masa Kini",
    // "athena.feature2.subtitle": "Tampilan klasik, performa elektrik modern",
    // "athena.feature2.description":
    //   "Athena memadukan tampilan klasik dengan kekuatan motor listrik terkini. Pengalaman berkendara yang menyenangkan, efisien, dan ramah lingkungan.",

    // "athena.color.description":
    //   "Pilih warna Athena favoritmu dan lihat tampilannya.",

    "athena.productPage.hero.imageAlt": "Athena Pink dan Athena Kuning",
    "athena.productPage.hero.title": "ATHENA",
    "athena.productPage.hero.description": "Gaya Retro, Tenaga Masa Kini",
    "athena.productPage.hero.ctaPrimary": "Pesan Sekarang",
    "athena.productPage.hero.ctaSecondary": "Download Brosur",

    "athena.productPage.techSpecs1.title": 120,
    "athena.productPage.techSpecs1.unit": "km",
    "athena.productPage.techSpecs1.desc": (
      <>
        <p>Jarak Tempuh</p>
        <p className="text-xs text-gray-500">*dengan Baterai Extended</p>
      </>
    ),

    "athena.productPage.techSpecs2.title": 15,
    "athena.productPage.techSpecs2.unit": "menit",
    "athena.productPage.techSpecs2.desc":
      "Charge dari 10% ke 80% dengan SuperCharge",

    "athena.productPage.techSpecs3.title": 80,
    "athena.productPage.techSpecs3.unit": "km/jam",
    "athena.productPage.techSpecs3.desc": "Kecepatan Maksimum",

    "athena.productPage.productOverview.imageAlt": "Athena Hijau",
    "athena.productPage.productOverview.title":
      "Keanggunan Tak Lekang Waktu, Kini Teraliri Energi Baru",
    "athena.productPage.productOverview.description":
      "Athena dari Wedison memadukan keanggunan klasik skuter Eropa dengan teknologi listrik terkini. Dirancang untuk mencuri perhatian tanpa mengundang bising, Athena menghadirkan sentuhan baru penuh gaya di jalanan kota—mengantar Anda melaju mulus dan senyap di setiap perjalanan. Dengan jangkauan hingga 120 km dalam sekali pengisian, rem cakram CBS yang tangguh, serta suspensi hidrolik canggih, Athena bukan sekadar kendaraan. Ini adalah sebuah pengalaman, dirancang bagi mereka yang mendambakan gaya tanpa usaha dan performa generasi baru. Isi daya cepat di showroom Wedison atau nikmati kemudahan charging di rumah—Athena siap menyesuaikan diri dengan gaya hidup modern Anda.",

    "athena.productPage.productHighlight1.imageAlt": "Head unit Athena",
    "athena.productPage.productHighlight1.title": "Layar Digital Canggih",
    "athena.productPage.productHighlight1.description":
      "Panel instrumen LCD Athena yang jernih dan terang memberikan semua informasi penting tentang perjalanan secara sekilas. Sederhana, digital, dan andal, sehingga Anda dapat fokus pada jalan di depan, bebas dari gangguan.",

    "athena.productPage.productHighlight2.imageAlt": "Athena SuperCharge",
    "athena.productPage.productHighlight2.title": "SuperCharge",
    "athena.productPage.productHighlight2.description":
      "Isi daya dari 10% hingga 80% hanya dalam 15 menit dengan Wedison SuperCharge (tersedia di seluruh showroom), atau isi daya dengan mudah di rumah hingga penuh dalam kurang dari 4 jam. Athena dirancang untuk mengikuti ritme kota yang tak pernah berhenti.",

    "athena.productPage.productHighlight3.imageAlt":
      "Sistem Pengereman CBS Athena",
    "athena.productPage.productHighlight3.title": "Dirancang untuk Perkotaan",
    "athena.productPage.productHighlight3.description":
      "Dengan rem cakram CBS di depan dan belakang, serta ban lebar yang stabil, Athena menghadirkan kendali lincah dan pengereman yang meyakinkan—memungkinkan Anda melaju di jalanan kota dengan percaya diri, nyaman, dan penuh gaya.",

    "athena.productPage.chargingOverview.imageAlt":
      "Athena Hijau dengan SuperCharge dan Home Charging",
    "athena.productPage.chargingOverview.title": "Pengisian Daya Tanpa Ribet",
    "athena.productPage.chargingOverview.description":
      "Tetap bergerak dengan solusi pengisian daya fleksibel dari Athena. Cukup colokkan di rumah untuk kenyamanan sehari-hari, atau nikmati kecepatan SuperCharge di seluruh showroom Wedison. Athena memberi Anda kebebasan untuk memilih—isi daya di tempat tinggal, atau isi cepat saat sedang bepergian.",

    "athena.productPage.chargingHighlight1.imageAlt":
      "Athena dengan SuperCharge",
    "athena.productPage.chargingHighlight1.title":
      "15-Menit dengan SuperCharge",
    "athena.productPage.chargingHighlight1.description": (
      <>
        Rasakan pengisian daya super cepat dengan teknologi SuperCharge canggih
        kami—dirancang agar Anda tetap bisa melaju, mengisi daya baterai dari
        10% hingga 80% hanya dalam 15 menit.{" "}
        <Link href="/super-charge" className="underline text-primary">
          Pelajari Lebih Lanjut
        </Link>
      </>
    ),

    "athena.productPage.chargingHighlight2.imageAlt":
      "Athena dengan Home Charger",
    "athena.productPage.chargingHighlight2.title":
      "Pengisian Daya di Rumah yang Praktis",
    "athena.productPage.chargingHighlight2.description":
      "Isi daya semalaman, atau kapan pun sesuai jadwal Anda. Charger rumahan bawaan Athena mampu mengisi penuh baterai dalam waktu kurang dari empat jam—tanpa suara, tanpa repot, dan selalu siap saat Anda butuh.",

    "athena.specs.engine.motorType": "Brushless DC Motor",
    "athena.specs.engine.motorPower": "2.5 kW",
    "athena.specs.engine.topSpeed": "80 km/jam",
    "athena.specs.engine.acceleration": "6.5 detik",
    "athena.specs.battery.batteryType": "Lithium-ion (LFP)",
    "athena.specs.battery.batteryCapacity":
      "2.5 kWh (Baterai Regular) / 3.4 kWh (Baterai Extended)",
    "athena.specs.battery.voltage": "76.8 Volt",
    "athena.specs.battery.chargingTimeSuperCharge": "15 menit",
    "athena.specs.battery.chargingTimeHome":
      "5 jam (Baterai Regular) / 7 jam (Baterai Extended)",
    "athena.specs.battery.range":
      "110 km (Baterai Regular) / 120 km (Baterai Extended)",
    "athena.specs.brake.frontBrake": "Rem Cakram",
    "athena.specs.brake.rearBrake": "Rem Cakram",
    "athena.specs.brake.cbsSupport": "Ya",
    "athena.specs.dimension.length": "1.850 mm",
    "athena.specs.dimension.width": "750 mm",
    "athena.specs.dimension.height": "1.155 mm",
    "athena.specs.dimension.wheelbase": "1.350 mm",
    "athena.specs.dimension.groundClearance": "160 mm",
    "athena.specs.dimension.seatHeight": "775 mm",
    "athena.specs.dimension.weight": "113.5 kg",
    "athena.specs.tire.frontTire": "100/80-12",
    "athena.specs.tire.rearTire": "100/80-12",
    "athena.specs.suspension.frontSuspension": "Hidrolik Teleskopik",
    "athena.specs.suspension.rearSuspension": "Hidrolik Teleskopik",

    //mini

    "bees.hero.tag": "Motor Entry-Level",
    "bees.hero.title": "Solusi Terjangkau untuk",
    "bees.hero.titleHighlight": "Mobilitas Harian",
    "bees.hero.description":
      "Bees hadir sebagai motor listrik paling ringan dan gesit dari Wedison. Cocok untuk pelajar, pekerja, atau siapa pun yang butuh kendaraan efisien dengan harga terjangkau.",
    "bees.hero.orderNow": "Pesan Sekarang",
    "bees.hero.downloadBrochure": "Unduh Brosur",

    "bees.feature1.tag": "Ukuran Ringkas, Lincah",
    "bees.feature1.title": "Desain Kompak, Manuver Maksimal",
    "bees.feature1.subtitle": "Ringan dan gesit untuk kota padat",
    "bees.feature1.description":
      "Dengan bodi mungil dan bobot ringan, Bees ideal untuk selap-selip di jalanan sempit dan padat. Gerak cepat, hemat ruang, dan nyaman dikendarai.",

    "bees.feature2.tag": "Terjangkau dan Praktis",
    "bees.feature2.title": "Harga Ekonomis, Bisa Disubsidi",
    "bees.feature2.subtitle": "Hemat biaya dan mudah diakses",
    "bees.feature2.description":
      "Bees termasuk kendaraan yang memenuhi syarat subsidi pemerintah. Biaya hemat, bisa charge di rumah, dan cocok untuk semua kalangan.",

    "bees.color.description":
      "Pilih warna Bees favoritmu dan lihat tampilannya.",

    // ===

    "bees.productPage.hero.imageAlt": "Bees Merah dan Bees Putih",
    "bees.productPage.hero.title": "BEES",
    "bees.productPage.hero.description":
      "Mobilitas Terjangkau untuk Setiap Perjalanan",
    "bees.productPage.hero.ctaPrimary": "Pesan Sekarang",
    "bees.productPage.hero.ctaSecondary": "Unduh Brosur",

    "bees.productPage.techSpecs1.title": 80,
    "bees.productPage.techSpecs1.unit": "km",
    "bees.productPage.techSpecs1.desc": "Jarak Tempuh",

    "bees.productPage.techSpecs2.title": "LED",
    "bees.productPage.techSpecs2.desc": "Tampilan Head Unit",

    "bees.productPage.techSpecs3.title": 55,
    "bees.productPage.techSpecs3.unit": "km/jam",
    "bees.productPage.techSpecs3.desc": "Kecepatan Maksimum",

    "bees.productPage.productOverview.imageAlt": "Bees Merah",
    "bees.productPage.productOverview.title":
      "Kecil Ukurannya, Besar Pengalamannya.",
    "bees.productPage.productOverview.description":
      "Kompak namun kaya fitur—Bees hadir dengan bagasi bawah jok XL, layar LED digital yang modern, dan rem cakram ganda yang andal. Pengisian daya di rumah yang praktis membuat setiap hari lebih mudah.",

    "bees.productPage.productHighlight1.imageAlt": "Bagasi Bawah Jok Bees",
    "bees.productPage.productHighlight1.title": "Bagasi XL di Bawah Jok",
    "bees.productPage.productHighlight1.description":
      "Bawa lebih banyak di setiap perjalanan. Kompartemen bawah jok Bees yang ekstra luas bisa memuat ransel, belanjaan, bahkan helm full-face—lebih banyak ruang, lebih banyak kemungkinan.",

    "bees.productPage.productHighlight2.imageAlt": "Tampilan LED Bees",
    "bees.productPage.productHighlight2.title": "Tampilan Digital LED",
    "bees.productPage.productHighlight2.description":
      "Tetap terinformasi dan terkendali dengan layar LED digital modern yang tajam. Lihat kecepatan, baterai, dan info lainnya secara real-time—cukup dengan sekali lirik.",

    "bees.productPage.productHighlight3.imageAlt": "Rem Cakram Bees",
    "bees.productPage.productHighlight3.title": "Rem Cakram Ganda yang Andal",
    "bees.productPage.productHighlight3.description":
      "Nikmati kekuatan pengereman maksimal dan rasa aman dengan rem cakram di roda depan dan belakang. Memberikan pengereman yang halus dan responsif dalam segala kondisi—untuk perjalanan yang tenang dan percaya diri.",

    "bees.productPage.chargingOverview.imageAlt":
      "Bees Merah sedang diisi daya di colokan rumah",
    "bees.productPage.chargingOverview.title":
      "Pengisian Daya di Rumah yang Simpel",
    "bees.productPage.chargingOverview.description":
      "Isi daya dengan mudah dari colokan listrik biasa. Dengan charger rumah bawaan, Bees selalu siap menemani perjalanan berikutnya—tanpa perlu fast-charging, cukup colokkan dan jalan.",

    // ===

    "bees.specs.engine.motorType": "Brushless DC Motor",
    "bees.specs.engine.motorPower": "1.2 kW",
    "bees.specs.engine.topSpeed": "55 km/jam",
    "bees.specs.engine.acceleration": "9.3 detik",
    "bees.specs.battery.batteryType": "Lithium-ion (LFP)",
    "bees.specs.battery.batteryCapacity": "1.6 kWh",
    "bees.specs.battery.voltage": "64 Volt",
    "bees.specs.battery.chargingTimeSuperCharge": "-",
    "bees.specs.battery.chargingTimeHome": "4.1 jam",
    "bees.specs.battery.range": "80 km",
    "bees.specs.brake.frontBrake": "Rem Cakram",
    "bees.specs.brake.rearBrake": "Rem Cakram",
    "bees.specs.brake.cbsSupport": "Tidak",
    "bees.specs.dimension.length": "1.790 mm",
    "bees.specs.dimension.width": "670 mm",
    "bees.specs.dimension.height": "1.110 mm",
    "bees.specs.dimension.wheelbase": "1.370 mm",
    "bees.specs.dimension.groundClearance": "130 mm",
    "bees.specs.dimension.seatHeight": "760 mm",
    "bees.specs.dimension.weight": "78.5 kg",
    "bees.specs.tire.frontTire": "90/90-10",
    "bees.specs.tire.rearTire": "90/90-10",
    "bees.specs.suspension.frontSuspension": "Hidrolik Teleskopik",
    "bees.specs.suspension.rearSuspension": "Hidrolik Teleskopik",

    //SuperCharge

    "supercharge.landing.title": "Perjalananmu",
    "supercharge.landing.description":
      "SuperCharge perjalananmu dengan pengisian cepat dan andal. Isi daya dari 10% ke 80% hanya dalam 15 menit.",
    "supercharge.hero.tag": "Fast Charging",
    "supercharge.hero.title": "Isi Daya dari 10% ke 80%",
    "supercharge.hero.titleHighlight": "Hanya 15 Menit",
    "supercharge.hero.description":
      "SuperCharge adalah solusi pengisian cepat eksklusif dari Wedison. Didesain khusus untuk Edmax, Athena, dan Victory — rasakan efisiensi tanpa kompromi.",
    "supercharge.hero.ctaPrimary": "Temukan Lokasi",
    "supercharge.hero.ctaSecondary": "Pelajari Teknologi",

    "supercharge.video.title": "SuperCharge: Solusi Charging Masa Depan",
    "supercharge.video.description":
      "SuperCharge hadir untuk memberikan pengalaman isi daya yang lebih cepat, aman, dan praktis bagi kendaraan listrik Anda.",

    "supercharge.feature1.tag": "Cepat dan Andal",
    "supercharge.feature1.title": "Teknologi Pengisian Generasi Baru",
    "supercharge.feature1.subtitle": "Waktu lebih singkat, performa maksimal",
    "supercharge.feature1.description":
      "Dengan teknologi fast charge terbaru, SuperCharge mampu mengisi baterai dari 10% ke 80% hanya dalam 15 menit. Hemat waktu, tanpa mengorbankan kualitas.",

    "supercharge.feature2.tag": "Tersebar Nasional",
    "supercharge.feature2.title": "Lebih dari 100 Titik SuperCharge",
    "supercharge.feature2.subtitle":
      "Dimanapun kamu berkendara, kami siap isi daya",
    "supercharge.feature2.description":
      "SuperCharge tersedia di lebih dari 100 titik strategis di Indonesia, memudahkan kamu untuk tetap bergerak tanpa harus khawatir kehabisan daya.",

    "supercharge.feature3.tag": "Andal. Aman. Patuh Regulasi.",
    "supercharge.feature3.title": "Dirancang untuk Tahan Lama",
    "supercharge.feature3.subtitle":
      "Keselamatan dan keandalan adalah prioritas",
    "supercharge.feature3.description":
      "Stasiun pengisian daya DC kami dirancang untuk bekerja secara sempurna dengan motor listrik Wedison Anda, memastikan pengisian daya cepat sekaligus menjaga umur baterai. Telah tersertifikasi penuh sesuai standar keselamatan IEC dan mematuhi Direktif Uni Eropa, memberikan daya yang aman, efisien, dan andal untuk motor Anda—setiap saat.",

    // SuperCharge App Section
    "supercharge.app.tag": "Aplikasi Mobile",
    "supercharge.app.teaser.title": "Cari. Isi Daya.",
    "supercharge.app.teaser.titleHighlight": "Jalan.",
    "supercharge.app.teaser.description":
      "Temukan stasiun SuperCharge terdekat, cek ketersediaan secara real-time, dan mulai pengisian daya — langsung dari ponselmu.",
    "supercharge.app.teaser.feature.find": "Cari Stasiun",
    "supercharge.app.teaser.feature.realtime": "Real-Time",
    "supercharge.app.teaser.feature.charge": "Isi Cepat",

    "supercharge.app.hero.title": "Teman Pengisian Dayamu,",
    "supercharge.app.hero.titleHighlight": "Selalu di Genggaman",
    "supercharge.app.hero.description":
      "Pantau status pengisian daya, temukan stasiun terdekat, dan kelola sesi SuperCharge-mu — semua yang kamu butuhkan dalam satu aplikasi.",

    "supercharge.app.feature1.icon": "MapPin",
    "supercharge.app.feature1.title": "Temukan Stasiun Terdekat",
    "supercharge.app.feature1.subtitle": "Cari titik pengisian di sekitarmu",
    "supercharge.app.feature1.description":
      "Lihat semua stasiun SuperCharge di peta interaktif dengan status ketersediaan real-time.",
    "supercharge.app.feature1.bullet1": "Peta interaktif dengan navigasi GPS",
    "supercharge.app.feature1.bullet2":
      "Filter berdasarkan ketersediaan & jarak",
    "supercharge.app.feature1.bullet3": "Simpan stasiun favorit",

    "supercharge.app.feature2.icon": "Activity",
    "supercharge.app.feature2.title": "Status Pengisian Real-Time",
    "supercharge.app.feature2.subtitle": "Ketahui sebelum berangkat",
    "supercharge.app.feature2.description":
      "Cek ketersediaan stasiun, status antrian, dan estimasi waktu tunggu sebelum kamu pergi.",
    "supercharge.app.feature2.bullet1": "Update ketersediaan langsung",
    "supercharge.app.feature2.bullet2": "Informasi kecepatan pengisian",
    "supercharge.app.feature2.bullet3": "Status antrian & waktu tunggu",

    "supercharge.app.feature3.icon": "Zap",
    "supercharge.app.feature3.title": "Pengalaman Pengisian Mudah",
    "supercharge.app.feature3.subtitle": "Colok, isi daya, dan jalan",
    "supercharge.app.feature3.description":
      "Mulai dan pantau sesi pengisian dayamu langsung dari aplikasi dengan satu ketukan.",
    "supercharge.app.feature3.bullet1": "Mulai pengisian dengan satu ketukan",
    "supercharge.app.feature3.bullet2": "Pemantauan pengisian real-time",
    "supercharge.app.feature3.bullet3": "Riwayat sesi & analitik",

    "supercharge.app.stats.stations": "Stasiun",
    "supercharge.app.stats.downloads": "Unduhan",
    "supercharge.app.stats.rating": "Rating",
    "supercharge.app.stats.chargeTime": "Menit Isi Daya",

    "supercharge.app.cta.title": "Siap SuperCharge",
    "supercharge.app.cta.titleHighlight": "Perjalananmu?",
    "supercharge.app.cta.description":
      "Unduh sekarang dan tak perlu khawatir mencari charger lagi.",

    // form title
    "form.title.placeholder": "Pilih topik yang ingin dibahas",

    "form.title.productInfo": "Informasi Produk Motor Listrik",
    "form.title.productInfo.value": "Informasi Produk Motor Listrik",

    "form.title.serviceMaintenance": "Servis & Perawatan Motor",
    "form.title.serviceMaintenance.value": "Servis & Perawatan Motor",

    "form.title.testRide": "Booking Uji Coba Motor",
    "form.title.testRide.value": "Test Ride / Uji Coba Motor",

    "form.title.paymentOptions": "Simulasi Kredit / Pembayaran",
    "form.title.paymentOptions.value": "Simulasi Kredit / Pembayaran",

    "form.title.warrantyClaim": "Klaim Garansi",
    "form.title.warrantyClaim.value": "Klaim Garansi",

    "form.title.feedback": "Saran & Masukan",
    "form.title.feedback.value": "Saran & Masukan",

    "form.title.technicalIssue": "Masalah Teknis / Kendala Penggunaan",
    "form.title.technicalIssue.value": "Masalah Teknis / Kendala Penggunaan",

    "form.title.partnership": "Kerja Sama atau Kemitraan",
    "form.title.partnership.value": "Kerja Sama atau Kemitraan",

    "form.title.other": "Lainnya (tuliskan di bawah)",
    "form.title.other.value": "Judul Lainnya: ",
    "form.hasMotor": "Apakah Anda memiliki motor saat ini?",
    "form.vehicle": "Jenis Kendaraan anda",
    "form.vehicle.placeholder": "Contoh: Wedison / Edmax / 2023",
    "form.vehicle.description": "Format: Merek / Model / Tahun",
    "form.sending.success.title": "Pesan Berhasil Dikirim!",
    "form.sending.success.description":
      "Terima kasih telah menghubungi kami. Kami akan segera menghubungi Anda.",
    "form.sending.error.title": "Terjadi Kesalahan Saat Mengirim Pesan",
    "form.sending.error.description":
      "Terjadi kesalahan saat mengirim pesan Anda. Silakan coba lagi nanti atau hubungi kami melalui saluran lain.",
    "form.sending.sending": "Mengirim pesan Anda... Silahkan tunggu.",
    "form.agreePrivacy.description": (
      <>
        Mengizinkan PT Wedison untuk menggunakan informasi di atas dan
        menghubungi Saya melalui email dan/atau telepon atau sarana komunikasi
        pribadi lainnya untuk kegiatan pelayanan kepada customer sesuai dengan{" "}
        {/* <Link href="/" className="underline text-blue-400">
          persetujuan privasi.
        </Link> */}
        <AlertDialog>
          <AlertDialogTrigger className="underline text-blue-400 cursor-pointer font-semibold">
            Persetujuan Privasi
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Persetujuan Privasi</AlertDialogTitle>
              <AlertDialogDescription>
                Dengan mengirimkan formulir ini, Anda menyetujui bahwa Wedison
                dapat mengumpulkan dan menggunakan data pribadi Anda hanya untuk
                menanggapi pertanyaan Anda. Informasi Anda tidak akan dibagikan
                kepada pihak ketiga tanpa persetujuan Anda.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Saya Mengerti</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    ),

    // Media Center
    "mediaCenter.landing.h1": "Media Center",
    "mediaCenter.landing.news.title": "Berita",
    "mediaCenter.landing.instagram.title": "Instagram",
    "mediaCenter.landing.instagram.follow": "Ikuti kami di Instagram",

    // FAQ
    "faq.category.Battery": "Baterai",
    "faq.category.Charging": "Pengisian Daya",
    "faq.category.Performance": "Performa",
    "faq.category.Safety": "Keamanan",
    "faq.category.Servicing": "Layanan: Garansi, Perbaikan, dan Perawatan",
    "faq.category.SmartFeatures": "Fitur Pintar, Bluetooth, Aplikasi",
    "faq.category.Tires": "Ban",

    // Battery Questions
    "faq.Battery.questions.0.question": "Apa jaminan untuk baterai?",
    "faq.Battery.questions.0.answer":
      "Baterai Wedison dilindungi garansi 3 tahun",
    "faq.Battery.questions.1.question":
      "Berapa lama waktu yang dibutuhkan untuk mengisi baterai hingga penuh?",
    "faq.Battery.questions.1.answer":
      "Wedison SuperCharge: 10% hingga 80% dalam 15 menit/ 10% hingga 95% dalam 20 menit\nWedison Regular Charge: Bervariasi tergantung adaptor dan ukuran baterai, dengan durasi antara 2 hingga 10 jam.",
    "faq.Battery.questions.2.question": "Jenis baterai apa yang Anda gunakan?",
    "faq.Battery.questions.2.answer":
      "Wedison EV menggunakan Baterai Lithium-ion (LFP), jenis baterai isi ulang yang umum digunakan pada perangkat seperti smartphone, laptop, dan kendaraan listrik.\n\nKarakteristik Baterai Lithium-ion adalah sebagai berikut:\nA. Kepadatan energi tinggi: Dapat menyimpan energi listrik yang cukup besar dalam paket yang lebih kecil dan ringan.\nB. Tahan suhu tinggi: Berkinerja efisien pada suhu tinggi hingga 45 derajat celsius dan tahan terhadap suhu rendah tanpa mengalami kerusakan.\nC. Tingkat self-discharge rendah: Baterai mempertahankan energinya dengan efektif bahkan ketika tidak digunakan selama berhari-hari atau berminggu-minggu.\nD. Jumlah siklus pengisian tinggi: Memungkinkan lebih dari 5.000 siklus pengisian sambil mempertahankan hampir seluruh kapasitas aslinya.\nE. Pengisian cepat: Wedison EV dapat diisi penuh dalam 30 menit di salah satu stasiun pengisian super cepat.",
    "faq.Battery.questions.3.question":
      "Berapa banyak jenis baterai yang Anda jual?",
    "faq.Battery.questions.3.answer":
      "Wedison menawarkan 2 variasi baterai untuk model tertentu. \nBerkendara dengan kecepatan 50km/jam, versi dasar dan extended mampu menempuh jarak masing-masing hingga 80 dan 200 km.",
    "faq.Battery.questions.4.question": "Baterai berasal dari mana?",
    "faq.Battery.questions.4.answer":
      "Baterai proprietary Wedison dikembangkan secara internal.",
    "faq.Battery.questions.5.question":
      "Berapa lama baterai Anda dapat bertahan?",
    "faq.Battery.questions.5.answer":
      "Dalam kondisi operasional normal, baterai proprietary Wedison dirancang untuk bertahan hingga 12 tahun.",
    "faq.Battery.questions.6.question":
      "Bisakah kami menggunakan baterai/pengisi daya pihak ketiga?",
    "faq.Battery.questions.6.answer":
      "Tidak, sepeda motor listrik memerlukan CAN (Controller Area Network) untuk berkomunikasi dengan komponen EV lainnya untuk operasi dan pengisian daya. Namun, baterai pihak ketiga tidak menggunakan CAN yang sama untuk komunikasi.",
    "faq.Battery.questions.7.question": "Bisakah baterai diganti?",
    "faq.Battery.questions.7.answer":
      "Ya, Wedison menyediakan suku cadang dan aksesori asli seperti baterai.",
    "faq.Battery.questions.8.question":
      "Bagaimana saya bisa menjaga baterai dalam kondisi baik?",
    "faq.Battery.questions.8.answer":
      "Selama penggunaan sehari-hari, harap coba isi daya baterai tepat waktu sebelum level turun di bawah 20% untuk membantu memperpanjang masa pakai baterai.",
    "faq.Battery.questions.9.question":
      "Bagaimana cara memperpanjang masa pakai baterai?",
    "faq.Battery.questions.9.answer":
      "Hindari mengosongkan hingga 0% atau mengisi hingga 100%. \nUsahakan untuk menjaga daya antara 20% dan 80% untuk mengurangi stres baterai dan memaksimalkan masa pakai.",
    "faq.Battery.questions.10.question":
      "Apa peringkat perlindungan masuk (IP) baterai?",
    "faq.Battery.questions.10.answer":
      "Baterai Wedison memiliki rating IP67,\nBaterai benar-benar kedap debu dan dapat direndam dalam air hingga kedalaman 1 meter selama 30 menit tanpa kerusakan.",
    "faq.Battery.questions.11.question":
      "Seberapa sering saya harus mengisi daya baterai? Saat bepergian?",
    "faq.Battery.questions.11.answer":
      "Jika kendaraan tidak digunakan untuk waktu yang lama (lebih dari seminggu), pastikan untuk mengisi dayanya setidaknya sekali setiap bulan.",
    "faq.Battery.questions.12.question":
      "Apa yang terjadi jika saya tidak menggunakan kendaraan untuk waktu yang lama?",
    "faq.Battery.questions.12.answer":
      "Matikan MCB (pemutus sirkuit) dan pastikan baterai diisi setidaknya sekali sebulan untuk menjaga kesehatannya.",

    // Charging Questions
    "faq.Charging.questions.0.question":
      "Di mana kami dapat mengisi daya motor kami?",
    "faq.Charging.questions.0.answer":
      "SuperCharge\nDi stasiun SuperCharge Wedison, yang akan secara bertahap diluncurkan di seluruh negeri.\nRegular Charge \nDi rumah/tempat dengan stopkontak dinding standar",
    "faq.Charging.questions.1.question":
      "Bagaimana kami dapat mengisi daya motor kami?",
    "faq.Charging.questions.1.answer":
      "Wedison EV dilengkapi dengan port pengisian reguler dan super yang dapat diisi di rumah dan stasiun pengisian daya yang ditentukan.",
    "faq.Charging.questions.2.question":
      "Bisakah saya menggunakan adaptor daya pihak ketiga untuk mengisi EV?",
    "faq.Charging.questions.2.answer":
      "Gunakan hanya suku cadang dan perlengkapan yang dikeluarkan Wedison untuk kesehatan dan kinerja baterai yang optimal.",
    "faq.Charging.questions.3.question":
      "Bisakah kami mengisi daya motor di rumah?",
    "faq.Charging.questions.3.answer":
      "Ya, Wedison EV memiliki port reguler untuk pengisian daya di rumah.",
    "faq.Charging.questions.4.question":
      "Apakah pengisian cepat merusak baterai?",
    "faq.Charging.questions.4.answer":
      "Baterai Wedison dirancang untuk pengisian cepat dan siklus hidup panjang tanpa menyebabkan kerusakan.",
    "faq.Charging.questions.5.question": "Apakah pengisian cepat berbahaya?",
    "faq.Charging.questions.5.answer":
      "Pengisian cepat Wedison tidak memperpendek masa pakai baterai atau menimbulkan risiko ledakan.",
    "faq.Charging.questions.6.question": "Apakah overcharging berbahaya?",
    "faq.Charging.questions.6.answer":
      "Baterai Wedison dilengkapi dengan sistem manajemen perlindungan\nJika baterai menjadi terlalu panas karena overcharging, fitur keamanan bawaan akan secara otomatis memutus daya untuk mencegah kerusakan atau bahaya.",
    "faq.Charging.questions.7.question": "Mengapa pengisian daya melambat?",
    "faq.Charging.questions.7.answer":
      "Teknologi baterai lithium-ion canggih Wedison menampilkan pengisian pintar yang menyeimbangkan kecepatan dan kinerja jangka panjang. Ini mengisi daya dengan cepat hingga kapasitas 95%, kemudian beralih ke kecepatan yang lebih lambat dan terkontrol untuk melindungi dan memperpanjang masa pakai baterai.\n\nPendekatan pengisian pintar ini membuat Anda kembali berkendara lebih cepat sambil membantu memperpanjang masa pakai baterai secara keseluruhan.",
    "faq.Charging.questions.8.question":
      "Berapa durasi pengisian reguler? (charger 600W)",
    "faq.Charging.questions.8.answer":
      "Waktu pengisian bervariasi tergantung model dan kapasitas baterai. \nWaktu pengisian dengan adaptor pengisian 600w dari 0-100%:\nLihat Data Pengisian Reguler",
    "faq.Charging.questions.9.question":
      "Berapa durasi pengisian reguler? (charger 1260W)",
    "faq.Charging.questions.9.answer":
      "Waktu pengisian bervariasi tergantung model dan kapasitas baterai. \nWaktu pengisian dengan adaptor pengisian 1260w dari 0-100%:\nBees: 3,5 jam (Tidak berubah, hanya dapat menggunakan charger 600w)\nLihat Data Pengisian Reguler",
    "faq.Charging.questions.10.question":
      "Bagaimana cara melakukan pengisian reguler?",
    "faq.Charging.questions.10.answer":
      "Pertama sambungkan pengisi daya ke port pengisian kendaraan, lalu colokkan ke sumber daya. \nSetelah pengisian selesai, cabut sumber daya terlebih dahulu, lalu lepaskan pengisi daya dari kendaraan.",
    "faq.Charging.questions.11.question": "Apakah pengisian daya gratis?",
    "faq.Charging.questions.11.answer":
      "Tidak, pengisian daya listrik berdasarkan Pay as Per use, dan harga pengisian daya bervariasi tergantung lokasi dan stasiun pengisian daya/operator.",

    // Performance Questions
    "faq.Performance.questions.0.question": "Berapa kecepatan motor?",
    "faq.Performance.questions.0.answer":
      "Tergantung model, kecepatan tertinggi berkisar dari 55 km/jam hingga 95 km/jam",
    "faq.Performance.questions.1.question": "Berapa daya motor / BLDC motor?",
    "faq.Performance.questions.1.answer":
      "Daya motor bervariasi antar model, berkisar dari 1,2KW hingga 5KW",
    "faq.Performance.questions.2.question": "Berapa jarak tempuh motor?",
    "faq.Performance.questions.2.answer":
      "Jarak tempuh bervariasi antara model dan baterai, berkisar dari 80 km hingga 200 km",
    "faq.Performance.questions.3.question":
      "Apakah Wedison EV aman digunakan dalam hujan dan banjir?",
    "faq.Performance.questions.3.answer":
      "Motor, unit kontrol, dan baterai Wedison adalah IP67, yang telah diuji kedap air.\nMeskipun telah menjalani tes perendaman air pada 1 meter, perendaman yang diperpanjang tidak disarankan.",
    "faq.Performance.questions.4.question": "Bisakah motor menanjak?",
    "faq.Performance.questions.4.answer":
      "Ya, bisa menanjak dan kemampuan mendaki tergantung pada model:\nBees, EdPower: 12%\nAthena dan Victory: 15%",
    "faq.Performance.questions.5.question":
      "Apakah baterai menurun seiring waktu?",
    "faq.Performance.questions.5.answer":
      "Seperti perangkat apa pun yang ditenagai oleh baterai lithium-ion, kemampuan baterai untuk menahan daya secara bertahap menurun dengan setiap siklus pengisian dan pengosongan. \nKeausan baterai dipengaruhi oleh faktor-faktor seperti siklus pengisian, usia baterai, dan suhu. \n\nSetiap Wedison EV dilengkapi dengan baterai Lithium Ion proprietary, yang didukung dengan garansi 3 tahun.",

    // Safety Questions
    "faq.Safety.questions.0.question": "Apakah baterai Anda aman?",
    "faq.Safety.questions.0.answer":
      "Baterai proprietary Wedison menampilkan sistem manajemen baterai canggih\ndengan langkah-langkah keamanan untuk mencegah overheating, overcharging, dan risiko kebakaran",
    "faq.Safety.questions.1.question": "Rem apa yang Anda gunakan?",
    "faq.Safety.questions.1.answer":
      "CBS (Combined Braking System), sistem pengereman efisien yang secara otomatis mendistribusikan gaya pengereman antara rem depan dan belakang ketika pengendara mengerem:\nAthena, Victory, & EdPower\n\nRem cakram depan dan belakang, memberikan kontrol, keamanan, dan kinerja pengereman yang ditingkatkan:\nMotor Bees",
    "faq.Safety.questions.2.question": "Motor apa yang Anda gunakan?",
    "faq.Safety.questions.2.answer":
      "Motor Wedison dilengkapi dengan motor DC brushless (BLDC), dikenal karena kinerja, efisiensi, torsi, dan masa pakai yang panjang.\n\nTersedia 1 versi: \n1. DC Brushless Rear Hub Motor: kecepatan motor hingga 95 km/jam. (Bees, Athena, Victory, EdPower)",

    // Servicing Questions
    "faq.Servicing.questions.0.question":
      "Apakah Wedison EV dilengkapi dengan layanan gratis?",
    "faq.Servicing.questions.0.answer":
      "Ya, setiap motor Wedison dilengkapi dengan 3 sesi layanan gratis di Wedison atau pusat layanan terauthorisasi. \nPemeriksaan garansi berbasis jarak tempuh dijadwalkan pada interval 1.000 km, 5.000 km, dan 10.000 km.",
    "faq.Servicing.questions.1.question":
      "Jarak tempuh apa yang dicakup dalam jadwal layanan gratis?",
    "faq.Servicing.questions.1.answer":
      "Garansi jarak tempuh termasuk pemeriksaan pada 1.000 km, 5.000 km, dan 10.000 km.",
    "faq.Servicing.questions.2.question":
      "Di mana saya dapat melayani EV motor?",
    "faq.Servicing.questions.2.answer":
      "Di bengkel resmi Wedison atau pusat layanan terauthorisasi Wedison terdekat.",
    "faq.Servicing.questions.3.question":
      "Apakah Wedison menyediakan suku cadang untuk motor?",
    "faq.Servicing.questions.3.answer":
      "Ya, Wedison menyediakan suku cadang siap pakai untuk motor.",
    "faq.Servicing.questions.4.question": "Apakah baterai dilengkapi garansi?",
    "faq.Servicing.questions.4.answer":
      "Ya, baterai proprietary dilengkapi dengan garansi 3 tahun.",
    "faq.Servicing.questions.5.question":
      "Apakah motor Wedison dilengkapi garansi?",
    "faq.Servicing.questions.5.answer":
      "Ya, motor dilengkapi dengan garansi 2 tahun.",
    "faq.Servicing.questions.6.question":
      "Berapa biaya untuk memperbaiki motor, dinamo, dan lainnya?",
    "faq.Servicing.questions.6.answer":
      "Biaya perbaikan motor listrik bervariasi berdasarkan jenis dan merek suku cadang, dan tingkat kerusakan atau perbaikan yang diperlukan. \n\nPengguna harus memeriksa harga dengan bengkel masing-masing.",
    "faq.Servicing.questions.7.question":
      "Bagaimana cara merawat motor Wedison?",
    "faq.Servicing.questions.7.answer":
      "Perawatan dan penanganan yang tepat, bersama dengan perawatan yang tepat dan teratur dapat memperpanjang masa pakai motor. \nAnda tidak perlu mengisi daya EV setiap hari:\n- Sebaliknya, isi daya sesuai kebutuhan, jaga baterai antara 20% dan 80% untuk kesehatan dan jangkauan optimal.\n- Isi daya setidaknya sekali sebulan.\n- Untuk kinerja dan kualitas baterai optimal, Wedison EV harus diisi daya dan diservis di stasiun pengisian super cepat dan pusat layanan yang ditentukan masing-masing.",
    "faq.Servicing.questions.8.question":
      "Apakah modifikasi diizinkan untuk EV?",
    "faq.Servicing.questions.8.answer":
      "Produk yang dicakup dalam garansi Wedison hanya mencakup konfigurasi, desain, atau spesifikasi aslinya. \nKerusakan, kesalahan, kegagalan, atau ketidaksempurnaan yang disebabkan oleh penyalahgunaan, gangguan, penggunaan ilegal, kelalaian, atau operasi yang berkepanjangan tidak dicakup.",
    "faq.Servicing.questions.9.question":
      "Kondisi apa yang akan membatalkan garansi?",
    "faq.Servicing.questions.9.answer":
      "Kerusakan yang diakibatkan oleh penggunaan suku cadang Wedison non-original atau modifikasi yang tidak diauthorisasi. \n\nKerusakan yang diakibatkan oleh peristiwa yang tidak dapat dihindari atau tidak terduga—seperti asap, paparan zat, gempa bumi, topan, banjir, korosi kimia, aktivitas promosi atau periklanan, item gratis, masalah terkait kebisingan, atau kontak dengan bahan lunak atau keras buatan—tidak dicakup.",
    "faq.Servicing.questions.10.question": "Apa batasan garansi?",
    "faq.Servicing.questions.10.answer":
      "Tidak ada komponen yang dicakup under garansi seumur hidup.\nSuku cadang pengganti yang disediakan under garansi hanya dicakup untuk sisa periode garansi asli.\nUntuk suku cadang yang dibeli atau diganti di luar layanan garansi, periode garansi dimulai dari tanggal pembelian atau penggantian.",

    // Smart Features Questions
    "faq.SmartFeatures.questions.0.question": "Apa fitur pintar yang tersedia?",
    "faq.SmartFeatures.questions.0.answer":
      "Aplikasi Wedison Smart Phone: untuk model tertentu, dapat digunakan untuk menyalakan dan mematikan motor melalui aplikasi menggunakan koneksi bluetooth.\nSelain itu, fitur lain akan diluncurkan di aplikasi untuk memberikan lebih banyak data.",

    // Tires Questions
    "faq.Tires.questions.0.question": "Apa dimensi ban?",
    "faq.Tires.questions.0.answer":
      "Bees: Depan: 90/90-10; Belakang 90/90-10\nAthena: Depan: 100/80-12; Belakang 100/80-12\nVictory: Depan: 90/90-14; Belakang: 100/80-14\nEdPower: Depan: 100/90-14; Belakang: 120/70-14",

    // Ojol Page
    "ojol.hero.title": "Wedison Bersama",
    "ojol.hero.titleHighlight": "Ojol",
    "ojol.hero.description":
      "Solusi motor listrik untuk driver ojol. Hemat biaya operasional, tanpa antre BBM!",
    "ojol.hero.startFrom": "Mulai dari",
    "ojol.hero.perDay": "/Hari",
    "ojol.hero.dailyRental": "SEWA HARIAN",
    "ojol.hero.tagline": "#JadiLebihMudah",
    "ojol.hero.tryFree": "Coba Gratis!",

    "ojol.benefits.title": "Narik Lebih Banyak, Kerja Lebih Efisien",
    "ojol.benefits.description":
      "Bosen antre BBM? Capek mikirin biaya bensin yang makin mahal? Tenang, Wedison solusinya! Irit biaya operasional, gak perlu antre, dan perawatan lebih ringan. Waktunya upgrade cara narik kamu!",

    "ojol.campaign.heading": "Hot Campaign",
    "ojol.btn.register": "Daftar Sekarang",
    "ojol.btn.detail": "Lihat Detail",

    "ojol.campaign.milik.title": "Sewa Milik",
    "ojol.campaign.milik.tagline": "Cicil Motor, Jadi Milik Sendiri!",
    "ojol.campaign.milik.description":
      "Program sewa dengan opsi kepemilikan selama 3,5 tahun (42 bulan). Setelah kontrak selesai, motor jadi milik kamu!",
    "ojol.campaign.milik.benefit.0":
      "1x Gratis charging adapter regular (senilai Rp 1.000.000)",
    "ojol.campaign.milik.benefit.1":
      "1x Gratis ganti ban depan & belakang (senilai Rp 385.000)",
    "ojol.campaign.milik.benefit.2":
      "1x Gratis ganti kampas rem (1 set depan & belakang)",
    "ojol.campaign.milik.benefit.3": "2x Kunci mekanik",
    "ojol.campaign.milik.benefit.4": "Garansi baterai 3 tahun",
    "ojol.campaign.milik.benefit.5": "Garansi motor 2 tahun",
    "ojol.campaign.milik.term.0":
      "Skema sewa milik berlaku selama 3 tahun 6 bulan (42 bulan)",
    "ojol.campaign.milik.term.1":
      "Rider berhak libur 1 hari per minggu (maksimal 48 hari per tahun)",
    "ojol.campaign.milik.term.2":
      "Setelah kontrak 42 bulan selesai, kepemilikan motor akan dialihkan ke rider",
    "ojol.campaign.milik.term.3":
      "Tabungan akan digunakan untuk biaya asuransi, servis, sparepart, dan BPKB. Sisa tabungan di akhir kontrak akan ditransfer ke rider",
    "ojol.campaign.milik.term.4":
      "DP tidak dapat dikembalikan setelah dinyatakan eligible",
    "ojol.campaign.milik.term.5":
      "Denda tilang/pelanggaran lalu lintas ditanggung rider",
    "ojol.campaign.milik.term.6":
      "Rider wajib mengikuti proses screening dari Wedison",
    "ojol.campaign.milik.scheme.0.label": "Athena/Victory Regular",
    "ojol.campaign.milik.scheme.0.value": "Rp 55.000/hari",
    "ojol.campaign.milik.scheme.1.label": "Athena/Victory Extended",
    "ojol.campaign.milik.scheme.1.value": "Rp 60.000/hari",
    "ojol.campaign.milik.scheme.2.label": "EdPower Extended",
    "ojol.campaign.milik.scheme.2.value": "Rp 80.000/hari",
    "ojol.campaign.milik.scheme.3.label": "Deposit",
    "ojol.campaign.milik.scheme.3.value": "Rp 600.000 - Rp 800.000",

    "ojol.campaign.harian.title": "Sewa Harian",
    "ojol.campaign.harian.tagline": "Narik Dulu, Fleksibel Tanpa Beban!",
    "ojol.campaign.harian.description":
      "Sewa motor listrik harian dengan kontrak 3 tahun. Cocok buat kamu yang mau narik tanpa mikir cicilan!",
    "ojol.campaign.harian.benefit.0": "1x Gratis charging adapter regular",
    "ojol.campaign.harian.benefit.1":
      "1x Gratis ganti ban depan & belakang (senilai Rp 385.000)",
    "ojol.campaign.harian.benefit.2":
      "1x Gratis ganti kampas rem (1 set depan & belakang)",
    "ojol.campaign.harian.benefit.3": "1x Gratis servis berkala",
    "ojol.campaign.harian.benefit.4": "2x Kunci mekanik",
    "ojol.campaign.harian.benefit.5": "Garansi baterai 3 tahun",
    "ojol.campaign.harian.benefit.6": "Garansi motor 2 tahun",
    "ojol.campaign.harian.term.0":
      "Skema sewa harian berlaku selama 3 tahun (36 bulan)",
    "ojol.campaign.harian.term.1":
      "Rider berhak libur 1 hari per minggu (maksimal 48 hari per tahun)",
    "ojol.campaign.harian.term.2":
      "DP tidak dapat dikembalikan setelah dinyatakan eligible",
    "ojol.campaign.harian.term.3":
      "Motor sepenuhnya milik PT. Wedison Nusantara Energi",
    "ojol.campaign.harian.term.4":
      "Denda tilang/pelanggaran lalu lintas ditanggung rider",
    "ojol.campaign.harian.term.5":
      "Kerusakan akibat kelalaian atau kecelakaan ditanggung rider",
    "ojol.campaign.harian.term.6":
      "Rider wajib mengikuti proses screening dari Wedison",
    "ojol.campaign.harian.term.7": "Warna motor ditentukan secara acak",
    "ojol.campaign.harian.scheme.0.label": "Athena/Victory Regular",
    "ojol.campaign.harian.scheme.0.value": "Rp 50.000/hari",
    "ojol.campaign.harian.scheme.1.label": "Athena/Victory Extended",
    "ojol.campaign.harian.scheme.1.value": "Rp 55.000/hari",
    "ojol.campaign.harian.scheme.2.label": "EdPower Extended",
    "ojol.campaign.harian.scheme.2.value": "Rp 75.000/hari",
    "ojol.campaign.harian.scheme.3.label": "Deposit",
    "ojol.campaign.harian.scheme.3.value": "Rp 500.000 - Rp 750.000",

    "ojol.dialog.programBadge": "PROGRAM",
    "ojol.dialog.scheme": "Skema Pembayaran",
    "ojol.dialog.benefits": "Keuntungan",
    "ojol.dialog.terms": "Syarat & Ketentuan",
    "ojol.dialog.registerNow": "Daftar Program Ini Sekarang",

    "ojol.supercharge.badge": "10% - 80% dalam 15 menit",
    "ojol.supercharge.descriptionPart1":
      "Waktu adalah uang, dan Supercharge bikin kamu gak buang-buang waktu! Cukup ",
    "ojol.supercharge.descriptionBold": "15 menit",
    "ojol.supercharge.descriptionPart2":
      " aja, baterai langsung terisi dari 10% ke 80%. Langsung gas narik lagi, gak perlu nunggu lama! Sekali charge bisa tempuh hingga 200 km*. Lebih banyak orderan, cuan lebih banyak!",
    "ojol.supercharge.disclaimer":
      "*Jarak tempuh 200 km berlaku untuk model EdPower Extended Battery",
    "ojol.supercharge.cta": "Pelajari Lebih Lanjut",

    "ojol.models.title": "Pilih Motor yang Cocok Buat Kamu",
    "ojol.models.subtitle":
      "Mau yang gesit buat gang sempit atau yang kuat buat jarak jauh? Wedison punya pilihan lengkap yang pas buat gaya narik kamu!",
    "ojol.models.spec.range": "Jarak Tempuh",
    "ojol.models.spec.maxSpeed": "Kecepatan Max",
    "ojol.models.spec.battery": "Baterai",
    "ojol.models.spec.supercharge": "SuperCharge",
    "ojol.models.spec.motor": "Motor",
    "ojol.models.value.minutes": "15 menit",
    "ojol.models.bees.tagline": "Compact & Lincah",
    "ojol.models.bees.highlight": "Cocok buat gang sempit",
    "ojol.models.victory.tagline": "Stylish & Bertenaga",
    "ojol.models.victory.highlight": "Balance antara gaya & performa",
    "ojol.models.athena.tagline": "Premium & Nyaman",
    "ojol.models.athena.highlight": "Narik seharian tetap nyaman",
    "ojol.models.edpower.tagline": "Tangguh & Jarak Jauh",
    "ojol.models.edpower.highlight": "Raja jarak jauh",
    "ojol.models.cta": "Lihat Detail",
    "ojol.models.footnote": "*Jarak tempuh dengan Extended Battery",

    "ojol.cta.badge": "Program Khusus Driver",
    "ojol.cta.headline.1": "Siap Narik Lebih Cuan",
    "ojol.cta.headline.2": "Bareng Wedison?",
    "ojol.cta.description":
      "Gabung sekarang dan nikmati berbagai keuntungan eksklusif: sewa harian mulai 50K, charging cepat gratis, hingga program cicilan ringan. Yuk, upgrade cara narik kamu!",
    "ojol.cta.benefit.1": "Sewa Harian Mulai 50K",
    "ojol.cta.benefit.2": "SuperCharge Gratis",
    "ojol.cta.benefit.3": "Cicilan Ringan",
    "ojol.cta.benefit.4": "Servis Prioritas",
    "ojol.cta.button": "Hubungi Sales Wedison",
    "ojol.cta.trust": "Respon cepat, konsultasi gratis!",

    // Language
    language: "Bahasa Indonesia",
    switchLanguage: "English",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id");

  // Load language preference from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "id")) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when it changes
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  // Translation function
  const t = (key: string): string => {
    return (
      (translations[language] as unknown as Record<string, string>)[key] || key
    );
    // return (translations[language] as Record<string, string>)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
