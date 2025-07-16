"use client";

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
      "Wedison is an eco-friendly electric motorcycle brand with the latest Super Charge technology.",
    // Navbar
    "nav.products": "Products",
    "nav.experienceCenter": "Experience Center",
    "nav.showroom": "Showroom",
    "nav.serviceLocation": "Service Location",
    "nav.superCharge": "Super Charge",
    "nav.corporate": "Corporate",
    "nav.aboutUs": "About Us",
    "nav.careers": "Careers",
    "nav.contactUs": "Contact Us",
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
    "features.rapidCharging": "Super Charge in 15 Minutes",
    "features.rapidChargingDesc":
      "Charge from 10% to 80% in just 15 minutes with our SuperCharge network.",
    "features.impressivePerformance": "0-95km/h in 3 Seconds",
    "features.impressivePerformanceDesc":
      "Experience 0-95 km/h in under 3 seconds with instant torque delivery.",
    // "features.zeroEmissions": "Cut the Carbon, Ride Electric",
    "features.zeroEmissions": "Ride Electric, Cut Emissions by 54%",
    "features.zeroEmissionsDesc":
      "Electric motorcycles emit 53.8% less CO₂ and cut lifecycle emissions by up to 80%, resulting in 14% cleaner air.",
    "features.zeroEmissionsLink":
      "https://www.sciencedirect.com/science/article/pii/S0967070X21003401",
    // "features.healthBenefits": "Cleaner Air, Healthier Life",
    "features.healthBenefits":
      // "11% Lower Lung Disease Risk, 3.2% Fewer Asthma ER Visits",
      "11% Lower Lung Disease Risk, and 3.2% Fewer Asthma ER Visits.",
    "features.healthBenefitsDesc":
      "Compared to gasoline motorcycles, electric motorcycles lower your risk of lung diseases and reduce asthma-related ER visits by 3.2%.",
    // "Electric motorcycle cuts city fine particulate pollution by 14% on average, reduces asthma-related ER visits by 3.2%, helping you and your loved ones breathe easier every day.",
    "features.healthBenefitsLink":
      "https://www.sciencedirect.com/science/article/pii/S016041202031970X",
    // "features.noiseFree": "Say Goodbye to Noise & Air Pollution",
    "features.noiseFree": "Enjoy 23% Quieter, Zero-Exhaust Rides",
    "features.noiseFreeDesc":
      "Electric motorcycle rides are up to 23% quieter and emit no exhaust, saving about 46.5 g of CO₂ and 1.95 g of CO per kilometer.",
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

    // Showroom Page
    "showroom.title": "Visit Our",
    "showroom.titleHighlight": "Showroom",
    "showroom.description":
      "Experience our electric motorcycles in person and discover the future of mobility.",
    "showroom.tag": "Experience Center",
    "showroom.location": "Showroom Location",
    "showroom.findUs": "Find Us",
    "showroom.address":
      "Arteri Pondok Indah Street No 30 A-C, South Kebayoran Lama, South Jakarta, DKI Jakarta. 12240",
    "showroom.hours": "Opening Hours",
    "showroom.weekdays": "Monday - Friday: 9:00 AM - 6:00 PM",
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
      "Wedison is a leading player in the EV industry. We are Indonesia's first fast-charging electric motorcycle. For us, it's not just about selling electric motorcycles — it's about creating a green ecosystem that fosters sustainable mobility across the world.",
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
    "about.projects.charging.title": "Super Charge",
    "about.projects.charging.description":
      "We built a robust charging infrastructure to support the growing electric vehicle ecosystem while creating time-saving opportunities for businesses.",
    "about.offers.title": "What We Offer",
    "about.offers.motorcycles.title": "Electric Motorcycle Models",
    "about.offers.motorcycles.description":
      "We offer a range of electric motorcycle models, each designed to meet diverse customer needs and preferences.",
    "about.offers.charging.title": "Super Charge Stations",
    "about.offers.charging.description":
      "We offer Super Charge stations, providing quick and convenient charging solutions, ensuring that electric motorcycle users can easily power up their vehicles and stay on the road longer.",
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

    //edmax
    "edmax.title":
      "EdPower – Powerful & Smart Electric Motorcycle from Wedison",
    "edmax.description":
      "Edmax is Wedison's flagship electric motorcycle with 86km/h top speed, advanced headunit (CarPlay & Android Auto), and Super Charge support.",

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

    "edmax.feature2.tag": "Super Charge",
    "edmax.feature2.title": "Power Up in Minutes",
    "edmax.feature2.subtitle": "Super Charge Technology",
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

    //athena

    "athena.hero.tag": "Retro Electric Scooter",
    "athena.hero.title": "Iconic Design with",
    "athena.hero.titleHighlight": "Classic & Modern Touch",
    "athena.hero.description":
      "Athena blends retro-classic aesthetics with modern EV performance — timeless style meets cutting-edge electric mobility.",
    "athena.hero.orderNow": "Order Now",
    "athena.hero.downloadBrochure": "Download Brochure",

    "athena.feature1.tag": "Comfortable Ride",
    "athena.feature1.title": "Comfort on the Road, Beauty in Motion",
    "athena.feature1.subtitle": "Ergonomic design, smooth ride quality",
    "athena.feature1.description":
      "Athena's ergonomic riding posture and smooth suspension deliver a stylish yet relaxed experience — perfect for city cruising.",

    "athena.feature2.tag": "Modern EV Tech",
    "athena.feature2.title": "Retro Style, Modern Power",
    "athena.feature2.subtitle": "Classic look, electric performance",
    "athena.feature2.description":
      "Combining vintage appeal with powerful EV tech, Athena gives you a fun, efficient, and future-ready ride without sacrificing style.",
    "athena.color.description":
      "Pick your favorite Athena color and see it in action.",

    //mini
    "mini.hero.tag": "Entry-Level EV",
    "mini.hero.title": "Affordable Mobility for",
    "mini.hero.titleHighlight": "Everyday Commuting",
    "mini.hero.description":
      "Mini is Wedison’s lightest and most agile electric scooter — designed for students, workers, and anyone looking for a compact, budget-friendly ride.",
    "mini.hero.orderNow": "Order Now",
    "mini.hero.downloadBrochure": "Download Brochure",

    "mini.feature1.tag": "Compact and Nimble",
    "mini.feature1.title": "Small Frame, Big Agility",
    "mini.feature1.subtitle": "Lightweight design for crowded streets",
    "mini.feature1.description":
      "Its slim and light build makes Mini perfect for tight traffic and narrow lanes. Easy to ride, space-saving, and highly maneuverable.",

    "mini.feature2.tag": "Budget-Friendly Ride",
    "mini.feature2.title": "Super Affordable & Subsidy Eligible",
    "mini.feature2.subtitle": "Lower cost, easy access",
    "mini.feature2.description":
      "Mini qualifies for government EV subsidy. It’s wallet-friendly, can be charged at home, and perfect for all kinds of daily users.",

    "mini.color.description":
      "Pick your favorite Mini color and see it in action.",

    //super charge
    "supercharge.landing.title": "Your Trip",
    "supercharge.landing.description":
      "Super Charge your ride with fast, reliable charging. Charge from 10% to 80% in just 15 minutes.",

    "supercharge.hero.tag": "Fast Charging",
    "supercharge.hero.title": "Charge from 10% to 80% in",
    "supercharge.hero.titleHighlight": "Just 15 Minutes",
    "supercharge.hero.description":
      "Super Charge is Wedison’s exclusive fast-charging solution. Designed specifically for EdPower, Athena, and Victory — experience efficiency with no compromise.",
    "supercharge.hero.ctaPrimary": "Find a Station",
    "supercharge.hero.ctaSecondary": "Learn the Tech",

    "supercharge.feature1.tag": "Fast & Reliable",
    "supercharge.feature1.title": "Next-Gen Charging Technology",
    "supercharge.feature1.subtitle": "Less time, maximum performance",
    "supercharge.feature1.description":
      "With cutting-edge fast charging, Super Charge powers your battery from 10% to 80% in just 15 minutes. Save time without sacrificing quality.",

    "supercharge.feature2.tag": "Nationwide Coverage",
    "supercharge.feature2.title": "100+ Super Charge Stations Across Indonesia",
    "supercharge.feature2.subtitle": "Wherever you ride, we’ve got your charge",
    "supercharge.feature2.description":
      "With over 100 Super Charge stations across strategic locations in Indonesia, you’ll always stay powered — no matter where the road takes you.",

    "supercharge.feature3.tag": "Reliable. Safe. Compliant.",
    "supercharge.feature3.title": "Built to Last",
    "supercharge.feature3.subtitle": "Safety and reliability first",
    "supercharge.feature3.description":
      "Our DC charging station is designed to work in perfect harmony with your Wedison EV motorcycle, ensuring fast charging while enhancing battery longevity. Fully certified to IEC safety standards and compliant with EU Directives, it provides safe, efficient, and reliable power for your motorcycle—every time.",

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
        <Link href="/" className="underline text-blue-400">
          privacy agreement.
        </Link>
      </>
    ),

    // Language
    language: "English",
    switchLanguage: "Bahasa Indonesia",
  },
  id: {
    //SEO Landing
    "landing.title": "Wedison - Masa Depan Mobilitas Listrik",
    "landing.description":
      "Wedison adalah brand motor listrik yang ramah lingkungan dengan teknologi Super Charge terkini.",

    // Navbar
    "nav.products": "Produk",
    "nav.experienceCenter": "Pusat Pengalaman",
    "nav.showroom": "Ruang Pamer",
    "nav.serviceLocation": "Lokasi Layanan",
    "nav.superCharge": "Super Charge",
    "nav.corporate": "Perusahaan",
    "nav.aboutUs": "Tentang Kami",
    "nav.careers": "Karir",
    "nav.contactUs": "Hubungi Kami",
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
    "features.rapidCharging": "Super Charge dalam 15 Menit",
    "features.rapidChargingDesc":
      "Isi daya dari 10% hingga 80% hanya dalam 15 menit dengan jaringan SuperCharge kami.",
    "features.impressivePerformance": "0-95km/jam dalam 3 Detik",
    "features.impressivePerformanceDesc":
      "Rasakan akselerasi 0-100 km/jam dalam waktu kurang dari 3 detik dengan torsi instan.",
    "features.zeroEmissions": "Berkendara Listrik, Kurangi Emisi hingga 54%",
    "features.zeroEmissionsDesc":
      "Motor listrik bertenaga baterai menghasilkan emisi CO₂ 53,8% lebih sedikit dan dapat mengurangi emisi sepanjang siklus hidupnya hingga 80%, menghasilkan 14% udara lebih bersih.",
    "features.zeroEmissionsLink":
      "https://www.sciencedirect.com/science/article/pii/S0967070X21003401",
    "features.healthBenefits":
      "Mengurangi 11% Risiko penyakit Paru-paru, dan 3,2% kunjungan IGD terkait asma.",
    "features.healthBenefitsDesc":
      "Dibanding sepeda motor bensin, motor listrik menurunkan risiko penyakit paru-paru dan kunjungan IGD terkait asma sebesar 3,2%.",
    "features.healthBenefitsLink":
      "https://www.sciencedirect.com/science/article/pii/S016041202031970X",
    "features.noiseFree":
      "Nikmati Perjalanan 23% Lebih Senyap, Tanpa Emisi Knalpot",
    "features.noiseFreeDesc":
      "Perjalanan dengan motor listrik hingga 23% lebih senyap dan tidak menghasilkan emisi knalpot, menghemat sekitar 46,5 gram CO₂ dan 1,95 gram CO per kilometer.",
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
    "footer.copyright": "© 2025 Wedison Motors. Seluruh hak cipta dilindungi.",
    "footer.tagline":
      "Dirancang dengan mempertimbangkan keberlanjutan. Didukung oleh energi terbarukan.",
    "footer.privacy": "Privasi",
    "footer.terms": "Ketentuan",
    "footer.cookies": "Cookies",

    //showroom

    "showroom.title": "Kunjungi",
    "showroom.titleHighlight": "Show Room Kami",
    "showroom.description":
      "Rasakan sepeda motor listrik kami secara langsung dan temukan masa depan mobilitas.",
    "showroom.tag": "Pusat Pengalaman",
    "showroom.location": "Lokasi Ruang Pamer",
    "showroom.findUs": "Temukan Kami",
    "showroom.address":
      "Jl. Arteri Pondok Indah No 30 A-C, Kelurahan Kebayoran Lama Selatan, Kecamatan Kebayoran Lama, Jakarta Selatan, DKI Jakarta. 12240",
    "showroom.hours": "Jam Buka",
    "showroom.weekdays": "Senin - Jumat: 9:00 - 18:00",
    "showroom.weekend": "Sabtu - Minggu: 10:00 - 17:00",
    "showroom.whatYouCanDo": "Apa yang Dapat Anda Lakukan di Ruang Pamer",
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
      "Wedison adalah pemain utama dalam industri kendaraan listrik. Kami adalah sepeda motor listrik pengisian cepat pertama di Indonesia. Bagi kami, ini bukan hanya tentang menjual sepeda motor listrik — ini tentang menciptakan ekosistem hijau yang mendorong mobilitas berkelanjutan di seluruh dunia.",
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
    "about.projects.charging.title": "Pengisian Super Charge",
    "about.projects.charging.description":
      "Kami membangun infrastruktur pengisian yang kuat untuk mendukung ekosistem kendaraan listrik yang berkembang sambil menciptakan peluang penghematan waktu bagi bisnis.",
    "about.offers.title": "Apa yang Kami Tawarkan",
    "about.offers.motorcycles.title": "Model Sepeda Motor Listrik",
    "about.offers.motorcycles.description":
      "Kami menawarkan berbagai model sepeda motor listrik, masing-masing dirancang untuk memenuhi kebutuhan dan preferensi pelanggan yang beragam.",
    "about.offers.charging.title": "Stasiun Pengisian Super Charge",
    "about.offers.charging.description":
      "Kami menawarkan stasiun pengisian Super Charge, menyediakan solusi pengisian yang cepat dan nyaman, memastikan bahwa pengguna sepeda motor listrik dapat dengan mudah mengisi daya kendaraan mereka dan tetap di jalan lebih lama.",
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

    //edmax
    "edmax.title": "Edmax – Motor Listrik Canggih dan Bertenaga dari Wedison",
    "edmax.description":
      "Edmax adalah motor listrik flagship dari Wedison dengan top speed 86km/jam, headunit canggih (CarPlay & Android Auto), dan mendukung Super Charge.",

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

    //athena

    "athena.hero.tag": "Motor Listrik Retro",
    "athena.hero.title": "Desain Ikonik yang",
    "athena.hero.titleHighlight": "Klasik & Modern",
    "athena.hero.description":
      "Athena menghadirkan estetika retro klasik dengan performa modern. Perpaduan gaya abadi dan teknologi masa kini dalam satu kendaraan elektrik.",
    "athena.hero.orderNow": "Pesan Sekarang",
    "athena.hero.downloadBrochure": "Unduh Brosur",

    "athena.feature1.tag": "Kenyamanan Berkendara",
    "athena.feature1.title": "Nyaman Dikendarai, Elegan Dipandang",
    "athena.feature1.subtitle": "Desain ergonomis, sensasi berkendara halus",
    "athena.feature1.description":
      "Dengan posisi duduk ergonomis dan suspensi yang mendukung kenyamanan, Athena siap menemani perjalananmu dengan penuh gaya dan rasa rileks.",

    "athena.feature2.tag": "Teknologi EV Modern",
    "athena.feature2.title": "Gaya Retro, Tenaga Masa Kini",
    "athena.feature2.subtitle": "Tampilan klasik, performa elektrik modern",
    "athena.feature2.description":
      "Athena memadukan tampilan klasik dengan kekuatan motor listrik terkini. Pengalaman berkendara yang menyenangkan, efisien, dan ramah lingkungan.",

    "athena.color.description":
      "Pilih warna Athena favoritmu dan lihat tampilannya.",

    //mini

    "mini.hero.tag": "Motor Entry-Level",
    "mini.hero.title": "Solusi Terjangkau untuk",
    "mini.hero.titleHighlight": "Mobilitas Harian",
    "mini.hero.description":
      "Mini hadir sebagai motor listrik paling ringan dan gesit dari Wedison. Cocok untuk pelajar, pekerja, atau siapa pun yang butuh kendaraan efisien dengan harga terjangkau.",
    "mini.hero.orderNow": "Pesan Sekarang",
    "mini.hero.downloadBrochure": "Unduh Brosur",

    "mini.feature1.tag": "Ukuran Ringkas, Lincah",
    "mini.feature1.title": "Desain Kompak, Manuver Maksimal",
    "mini.feature1.subtitle": "Ringan dan gesit untuk kota padat",
    "mini.feature1.description":
      "Dengan bodi mungil dan bobot ringan, Mini ideal untuk selap-selip di jalanan sempit dan padat. Gerak cepat, hemat ruang, dan nyaman dikendarai.",

    "mini.feature2.tag": "Terjangkau dan Praktis",
    "mini.feature2.title": "Harga Ekonomis, Bisa Disubsidi",
    "mini.feature2.subtitle": "Hemat biaya dan mudah diakses",
    "mini.feature2.description":
      "Mini termasuk kendaraan yang memenuhi syarat subsidi pemerintah. Biaya hemat, bisa charge di rumah, dan cocok untuk semua kalangan.",

    "mini.color.description":
      "Pilih warna Mini favoritmu dan lihat tampilannya.",

    //super charge

    "supercharge.landing.title": "Perjalananmu",
    "supercharge.landing.description":
      "Super Charge perjalananmu dengan pengisian cepat dan andal. Isi daya dari 10% ke 80% hanya dalam 15 menit.",
    "supercharge.hero.tag": "Fast Charging",
    "supercharge.hero.title": "Isi Daya dari 10% ke 80% dalam",
    "supercharge.hero.titleHighlight": "Hanya 15 Menit",
    "supercharge.hero.description":
      "Super Charge adalah solusi pengisian cepat eksklusif dari Wedison. Didesain khusus untuk Edmax, Athena, dan Victory — rasakan efisiensi tanpa kompromi.",
    "supercharge.hero.ctaPrimary": "Temukan Lokasi",
    "supercharge.hero.ctaSecondary": "Pelajari Teknologi",

    "supercharge.feature1.tag": "Cepat dan Andal",
    "supercharge.feature1.title": "Teknologi Pengisian Generasi Baru",
    "supercharge.feature1.subtitle": "Waktu lebih singkat, performa maksimal",
    "supercharge.feature1.description":
      "Dengan teknologi fast charge terbaru, Super Charge mampu mengisi baterai dari 10% ke 80% hanya dalam 15 menit. Hemat waktu, tanpa mengorbankan kualitas.",

    "supercharge.feature2.tag": "Tersebar Nasional",
    "supercharge.feature2.title": "Lebih dari 100 Titik Super Charge",
    "supercharge.feature2.subtitle":
      "Dimanapun kamu berkendara, kami siap isi daya",
    "supercharge.feature2.description":
      "Super Charge tersedia di lebih dari 100 titik strategis di Indonesia, memudahkan kamu untuk tetap bergerak tanpa harus khawatir kehabisan daya.",

    "supercharge.feature3.tag": "Andal. Aman. Patuh Regulasi.",
    "supercharge.feature3.title": "Dirancang untuk Tahan Lama",
    "supercharge.feature3.subtitle":
      "Keselamatan dan keandalan adalah prioritas",
    "supercharge.feature3.description":
      "Stasiun pengisian daya DC kami dirancang untuk bekerja secara sempurna dengan motor listrik Wedison Anda, memastikan pengisian daya cepat sekaligus menjaga umur baterai. Telah tersertifikasi penuh sesuai standar keselamatan IEC dan mematuhi Direktif Uni Eropa, memberikan daya yang aman, efisien, dan andal untuk motor Anda—setiap saat.",

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
        <Link href="/" className="underline text-blue-400">
          persetujuan privasi.
        </Link>
      </>
    ),
    // Language
    language: "Bahasa Indonesia",
    switchLanguage: "English",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
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
