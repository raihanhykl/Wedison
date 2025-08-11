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

    // buttons
    "btn.learn.more": "Learn More",
    "btn.book.test.ride": "Book Test Ride",
    "btn.see.brochure": "See Brochure",
    "btn.order.now": "Order Now",

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
    "footer.contact": "Contact Us",
    "footer.about": "About Us",
    "footer.meetus": "Meet Us",

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
      "Charging Time with Super Charge (10-80%)",
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

    // edpower
    "edpower.productPage.hero.imageAlt":
      " Full body of EDPower from a three-quarter front angle, showcasing its robust, maxi-scooter design and premium features.",
    "edpower.productPage.hero.title": "EDPOWER",
    "edpower.productPage.hero.description": "The Future of Electric Riding",
    "edpower.productPage.hero.ctaPrimary": "Pesan Sekarang",
    "edpower.productPage.hero.ctaSecondary": "Unduh Brosur",

    "edpower.productPage.techSpecs1.title": "135",
    "edpower.productPage.techSpecs1.unit": "km",
    "edpower.productPage.techSpecs1.desc": "Cruising Range",

    "edpower.productPage.techSpecs2.title": "15",
    "edpower.productPage.techSpecs2.unit": "minutes",
    "edpower.productPage.techSpecs2.desc":
      "Charge from 10% to 80% with SuperCharge",

    "edpower.productPage.techSpecs3.title": "80",
    "edpower.productPage.techSpecs3.unit": "km/hour",
    "edpower.productPage.techSpecs3.desc": "Top Speed",

    "edpower.productPage.productOverview.imageAlt":
      "EDPower from a dramatic side profile, emphasizing its wide seat, bold stance, and tech-forward look.",
    "edpower.productPage.productOverview.title":
      "Flagship Power, Unrivaled Comfort.",
    "edpower.productPage.productOverview.description":
      "Meet EDPower—the ultimate electric scooter from Wedison. With its spacious saddle, futuristic styling, and best-in-class range up to 135 km, EDPower sets a new standard for electric two-wheelers. Enjoy advanced comfort, cutting-edge connectivity, and unstoppable power for the longest journeys. Engineered for those who demand the best.",

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
    "edpower.productPage.productHighlight5.title": "Class-Leading 135 km Range",
    "edpower.productPage.productHighlight5.description":
      "Go farther than ever. With up to 135 km on a single charge, EDPower is ready for city exploring or out-of-town adventures—no limits, just freedom.",

    "edpower.productPage.chargingOverview.imageAlt":
      "EDPower parked at a Wedison showroom with Super Charge and home charger visible",
    "edpower.productPage.chargingOverview.title":
      "Fast, Flexible Charging for Every Lifestyle",
    "edpower.productPage.chargingOverview.description":
      "EDPower adapts to your schedule with two effortless charging options: ultra-fast Super Charge at Wedison showrooms, or convenient overnight home charging. Always powered, always ready.",

    "edpower.productPage.chargingHighlight1.imageAlt":
      "EDPower connected to a Wedison Super Charge station",
    "edpower.productPage.chargingHighlight1.title": "Wedison Super Charge",
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

    "edpower.specs.engine.motorType": "Brusless DC Motor",
    "edpower.specs.engine.motorPower": "3.000 Watt (3 kW)",
    "edpower.specs.engine.topSpeed": "80 km/hour",
    "edpower.specs.engine.acceleration": "7.9 seconds",
    "edpower.specs.battery.batteryType": "Lithium-ion (LFP)",
    "edpower.specs.battery.batteryCapacity": "5 kWh",
    "edpower.specs.battery.voltage": "76.8 Volt",
    "edpower.specs.battery.chargingTimeSuperCharge": "15 minutes",
    "edpower.specs.battery.chargingTimeHome": "4 hours",
    "edpower.specs.battery.range": "135 km",
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
    "edpower.specs.tire.rearTire": "1020/70-14",
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

    "victory.productPage.techSpecs1.title": "115",
    "victory.productPage.techSpecs1.unit": "km",
    "victory.productPage.techSpecs1.desc": (
      <>
        <p>Cruising Range</p>
        <p className="text-xs text-gray-500">*with Extended Battery</p>
      </>
    ),

    "victory.productPage.techSpecs2.title": "15",
    "victory.productPage.techSpecs2.unit": "minutes",
    "victory.productPage.techSpecs2.desc":
      "Charge from 10% to 80% with SuperCharge",

    "victory.productPage.techSpecs3.title": "80",
    "victory.productPage.techSpecs3.unit": "km/h",
    "victory.productPage.techSpecs3.desc": "Top Speed",

    "victory.productPage.productOverview.imageAlt": "Gray Victory",
    "victory.productPage.productOverview.title": "Sporty, Agile, Unstoppable.",
    "victory.productPage.productOverview.description":
      "Victory by Wedison brings a new level of sportiness and agility to electric mobility. Purpose-built for city riding, Victory combines aggressive styling, lightning-fast acceleration, and outstanding control. Its wide wheelbase and advanced CBS disc brakes give you confidence in every corner. Go further with up to 115 km range and charge up in minutes—Victory puts you ahead in every journey.",

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
      "Close-up of Super Charge port with Wedison branding",
    "victory.productPage.productHighlight3.title": "Super Charge Ready",
    "victory.productPage.productHighlight3.description":
      "Recharge from 10% to 80% in just 15 minutes with Wedison Super Charge, or top up at home for total flexibility.",

    "victory.productPage.chargingOverview.imageAlt":
      "Victory parked at a Wedison showroom, Super Charge station in view",
    "victory.productPage.chargingOverview.title": "Charge Your Way",
    "victory.productPage.chargingOverview.description":
      "Power up in minutes with Super Charge at any Wedison showroom, or recharge conveniently at home. Victory adapts to your lifestyle—always ready for your next move.",

    "victory.productPage.chargingHighlight1.imageAlt":
      "Victory at a Wedison Super Charge station, cable connected",
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

    "victory.specs.engine.motorType": "Brusless DC Motor",
    "victory.specs.engine.motorPower": "3.000 Watt (3 kW)",
    "victory.specs.engine.topSpeed": "80 km/hour",
    "victory.specs.engine.acceleration": "6.5 seconds",
    "victory.specs.battery.batteryType": "Lithium-ion (LFP)",
    "victory.specs.battery.batteryCapacity":
      "2.5 kWh (Regular Battery) / 3.4 kWh (Extended Battery)",
    "victory.specs.battery.voltage": "76.8 Volt",
    "victory.specs.battery.chargingTimeSuperCharge": "15 minutes",
    "victory.specs.battery.chargingTimeHome": "4 hours",
    "victory.specs.battery.range":
      "85 km (Regular Battery) / 115 km (Extended Battery)",
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

    "athena.productPage.techSpecs1.title": "115",
    "athena.productPage.techSpecs1.unit": "km",
    "athena.productPage.techSpecs1.desc": (
      <>
        <p>Cruising Range</p>
        <p className="text-xs text-gray-500">*with Extended Battery</p>
      </>
    ),

    "athena.productPage.techSpecs2.title": "15",
    "athena.productPage.techSpecs2.unit": "minutes",
    "athena.productPage.techSpecs2.desc":
      "Charge from 10% to 80% with SuperCharge",

    "athena.productPage.techSpecs3.title": "80",
    "athena.productPage.techSpecs3.unit": "km/h",
    "athena.productPage.techSpecs3.desc": "Top Speed",

    "athena.productPage.productOverview.imageAlt": "Green Athena",
    "athena.productPage.productOverview.title": "Timeless Elegance, Recharged",
    "athena.productPage.productOverview.description":
      "Athena by Wedison combines timeless European scooter elegance with cutting-edge electric technology. Designed to stand out while staying quiet, Athena brings a fresh sophistication to city streets—delivering smooth, silent rides with every journey. With up to 115 km range per charge, robust CBS disc brakes, and advanced hydraulic suspension, Athena isn’t just a ride. It’s an experience, crafted for those who crave effortless style and next-generation performance. Fast-charge at any Wedison showroom or enjoy convenient home charging—Athena adapts perfectly to your modern lifestyle.",

    "athena.productPage.productHighlight1.imageAlt": "Head unit Athena",
    "athena.productPage.productHighlight1.title": "Modern Digital Display",
    "athena.productPage.productHighlight1.description":
      "Athena’s clear and bright LCD instrument panel provides all essential ride information at a glance. Simple, digital, and reliable—so you can focus on the road ahead, free from distractions.",

    "athena.productPage.productHighlight2.imageAlt": "Athena SuperCharge",
    "athena.productPage.productHighlight2.title": "SuperCharge",
    "athena.productPage.productHighlight2.description":
      "Power up from 10% to 80% in just 15 minutes with Wedison Super Charge (available at all showrooms), or conveniently charge at home with a full charge in under 4 hours. Athena is engineered for the non-stop city pace.",

    "athena.productPage.productHighlight3.imageAlt":
      "CBS Breaking System Athena",
    "athena.productPage.productHighlight3.title": "Designed for the City",
    "athena.productPage.productHighlight3.description":
      "With CBS disc brakes front and rear, plus a stable wide-tire setup, Athena offers agile handling and confident braking—so you can move through city streets with poise, comfort, and unmistakable style.",

    "athena.productPage.chargingOverview.imageAlt":
      "Green Athena with SuperCharge and Home Charging",
    "athena.productPage.chargingOverview.title": "Charging Made Effortless",
    "athena.productPage.chargingOverview.description":
      "Stay in motion with Athena’s flexible charging solutions. Plug in at home for everyday convenience, or experience rapid Super Charge at any Wedison showroom. Athena gives you the freedom to choose—charge where you live, or power up fast when you're on the go.",

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

    "athena.specs.engine.motorType": "Brusless DC Motor",
    "athena.specs.engine.motorPower": "2.500 Watt (2.5 kW)",
    "athena.specs.engine.topSpeed": "80 km/hour",
    "athena.specs.engine.acceleration": "6.5 seconds",
    "athena.specs.battery.batteryType": "Lithium-ion (LFP)",
    "athena.specs.battery.batteryCapacity":
      "2.5 kWh (Regular Battery) / 3.4 kWh (Extended Battery)",
    "athena.specs.battery.voltage": "76.8 Volt",
    "athena.specs.battery.chargingTimeSuperCharge": "15 minutes",
    "athena.specs.battery.chargingTimeHome": "4 hour",
    "athena.specs.battery.range":
      "85 km (Regular Battery) / 115 km (Extended Battery)",
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

    // ===

    "mini.productPage.hero.imageAlt": "Red Mini and White Mini",
    "mini.productPage.hero.title": "MINI",
    "mini.productPage.hero.description": "Affordable Mobility for Every Ride",
    "mini.productPage.hero.ctaPrimary": "Order Now",
    "mini.productPage.hero.ctaSecondary": "Download Brochure",

    "mini.productPage.techSpecs1.title": "65",
    "mini.productPage.techSpecs1.unit": "km",
    "mini.productPage.techSpecs1.desc": "Cruising Range",

    "mini.productPage.techSpecs2.title": "LED",
    "mini.productPage.techSpecs2.desc": "Head unit Display",

    "mini.productPage.techSpecs3.title": "55",
    "mini.productPage.techSpecs3.unit": "km/h",
    "mini.productPage.techSpecs3.desc": "Top Speed",

    "mini.productPage.productOverview.imageAlt": "Red Mini",
    "mini.productPage.productOverview.title":
      "Small in Size. Big on Experience.",
    "mini.productPage.productOverview.description":
      "An updated wheel and tire package offers a smoother driving experience. Redesigned body castings reduce parts from 70 to 1 for fewer gaps. All to create a whisper-quiet ride.",

    "mini.productPage.productHighlight1.imageAlt": "Mini Underseat storage",
    "mini.productPage.productHighlight1.title": "XL Underseat Storage",
    "mini.productPage.productHighlight1.description":
      "Bring more along for every ride. Mini’s extra-large underseat compartment fits a backpack, groceries, or even a full-face helmet—more space, more possibilities.",

    "mini.productPage.productHighlight2.imageAlt": "Mini LED Display",
    "mini.productPage.productHighlight2.title": "Digital LED Display",
    "mini.productPage.productHighlight2.description":
      "Stay informed and in control with a crisp, modern digital LED display. Get real-time info on speed, battery, and more—all at a glance.",

    "mini.productPage.productHighlight3.imageAlt": "Mini Disc Brakes",
    "mini.productPage.productHighlight3.title": "Confident Dual Disc Brakes",
    "mini.productPage.productHighlight3.description":
      "Experience maximum stopping power and safety with disc brakes on both the front and rear wheels. Enjoy smooth, responsive braking in all riding conditions—so you can ride with complete peace of mind.",

    "mini.productPage.chargingOverview.imageAlt":
      "Red Mini charging at a home outlet",
    "mini.productPage.chargingOverview.title": "Simple Home Charging",
    "mini.productPage.chargingOverview.description":
      "Recharge easily from any standard outlet. With the included home charger, Mini is always ready for your next ride—no fast-charging needed, just plug and go.",

    // ===

    "mini.specs.engine.motorType": "Brusless DC Motor",
    "mini.specs.engine.motorPower": "1.200 Watt (1.2 kW)",
    "mini.specs.engine.topSpeed": "55 km/hour",
    "mini.specs.engine.acceleration": "9.3 seconds",
    "mini.specs.battery.batteryType": "Lithium-ion (LFP)",
    "mini.specs.battery.batteryCapacity": "1.6 kWh",
    "mini.specs.battery.voltage": "64 Volt",
    "mini.specs.battery.chargingTimeSuperCharge": "-",
    "mini.specs.battery.chargingTimeHome": "4 hours",
    "mini.specs.battery.range": "65 km",
    "mini.specs.brake.frontBrake": "Disc Brake",
    "mini.specs.brake.rearBrake": "Disc Brake",
    "mini.specs.brake.cbsSupport": "No",
    "mini.specs.dimension.length": "1.790 mm",
    "mini.specs.dimension.width": "670 mm",
    "mini.specs.dimension.height": "1.110 mm",
    "mini.specs.dimension.wheelbase": "1.370 mm",
    "mini.specs.dimension.groundClearance": "130 mm",
    "mini.specs.dimension.seatHeight": "760 mm",
    "mini.specs.dimension.weight": "78.5 kg",
    "mini.specs.tire.frontTire": "90/90-10",
    "mini.specs.tire.rearTire": "90/90-10",
    "mini.specs.suspension.frontSuspension": "Hydraulic Telescopic",
    "mini.specs.suspension.rearSuspension": "Hydraulic Telescopic",

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

    // buttons
    "btn.learn.more": "Pelajari Lebih Lanjut",
    "btn.book.test.ride": "Jadwalkan Test Ride",
    "btn.see.brochure": "Lihat Brosur",
    "btn.order.now": "Pesan Sekarang",

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
    "footer.contact": "Hubungi Kami",
    "footer.about": "Tentang Kami",
    "footer.copyright": "© 2025 Wedison Motors. Seluruh hak cipta dilindungi.",
    "footer.tagline":
      "Dirancang dengan mempertimbangkan keberlanjutan. Didukung oleh energi terbarukan.",
    "footer.privacy": "Privasi",
    "footer.terms": "Ketentuan",
    "footer.cookies": "Cookies",
    "footer.meetus": "Temukan Kami",

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
      "Waktu Pengisian dengan Super Charge (10-80%)",
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

    // edpower
    "edpower.productPage.hero.imageAlt":
      "Tampilan penuh EDPower dari sudut depan tiga perempat, menonjolkan desain maxi-scooter yang kokoh dan fitur premiumnya.",
    "edpower.productPage.hero.title": "EDPOWER",
    "edpower.productPage.hero.description": "Masa Depan Berkendara Listrik",
    "edpower.productPage.hero.ctaPrimary": "Pesan Sekarang",
    "edpower.productPage.hero.ctaSecondary": "Unduh Brosur",

    "edpower.productPage.techSpecs1.title": "135",
    "edpower.productPage.techSpecs1.unit": "km",
    "edpower.productPage.techSpecs1.desc": "Jarak Tempuh",

    "edpower.productPage.techSpecs2.title": "15",
    "edpower.productPage.techSpecs2.unit": "menit",
    "edpower.productPage.techSpecs2.desc":
      "Isi daya dari 10% ke 80% dengan SuperCharge",

    "edpower.productPage.techSpecs3.title": "80",
    "edpower.productPage.techSpecs3.unit": "km/jam",
    "edpower.productPage.techSpecs3.desc": "Kecepatan Maksimum",

    "edpower.productPage.productOverview.imageAlt":
      "Tampilan samping dramatis EDPower, menonjolkan jok lebar, posisi berkendara kokoh, dan tampilan futuristik.",
    "edpower.productPage.productOverview.title":
      "Kekuatan Utama, Kenyamanan Tak Tertandingi.",
    "edpower.productPage.productOverview.description":
      "Inilah EDPower—skuter listrik andalan dari Wedison. Dengan jok luas, desain futuristik, dan jarak tempuh terbaik hingga 135 km, EDPower menetapkan standar baru untuk kendaraan roda dua listrik. Nikmati kenyamanan tingkat lanjut, konektivitas canggih, dan tenaga yang siap menjelajah jauh. Dirancang bagi mereka yang menuntut yang terbaik.",

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
      "Jarak Tempuh Terbaik 135 km",
    "edpower.productPage.productHighlight5.description":
      "Jelajahi lebih jauh dari sebelumnya. Dengan jarak tempuh hingga 135 km dalam sekali pengisian, EDPower siap menjelajah kota maupun luar kota—tanpa batas, hanya kebebasan.",

    "edpower.productPage.chargingOverview.imageAlt":
      "EDPower terparkir di showroom Wedison dengan stasiun Super Charge dan charger rumah yang terlihat",
    "edpower.productPage.chargingOverview.title":
      "Pengisian Cepat & Fleksibel untuk Setiap Gaya Hidup",
    "edpower.productPage.chargingOverview.description":
      "EDPower menyesuaikan jadwal Anda dengan dua pilihan pengisian daya yang mudah: Super Charge ultra-cepat di showroom Wedison, atau pengisian semalam yang praktis di rumah. Selalu bertenaga, selalu siap berangkat.",

    "edpower.productPage.chargingHighlight1.imageAlt":
      "EDPower terhubung ke stasiun Super Charge Wedison",
    "edpower.productPage.chargingHighlight1.title": "Wedison Super Charge",
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

    "edpower.specs.engine.motorType": "Brusless DC Motor",
    "edpower.specs.engine.motorPower": "3.000 Watt (3 kW)",
    "edpower.specs.engine.topSpeed": "80 km/jam",
    "edpower.specs.engine.acceleration": "7.9 detik",
    "edpower.specs.battery.batteryType": "Lithium-ion (LFP)",
    "edpower.specs.battery.batteryCapacity": "5 kWh",
    "edpower.specs.battery.voltage": "76.8 Volt",
    "edpower.specs.battery.chargingTimeSuperCharge": "15 menit",
    "edpower.specs.battery.chargingTimeHome": "4 jam",
    "edpower.specs.battery.range": "135 km",
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
    "edpower.specs.tire.rearTire": "1020/70-14",
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

    "victory.productPage.techSpecs1.title": "115",
    "victory.productPage.techSpecs1.unit": "km",
    "victory.productPage.techSpecs1.desc": (
      <>
        <p>Jarak Tempuh</p>
        <p className="text-xs text-gray-500">*dengan Baterai Extended</p>
      </>
    ),

    "victory.productPage.techSpecs2.title": "15",
    "victory.productPage.techSpecs2.unit": "menit",
    "victory.productPage.techSpecs2.desc":
      "Isi daya dari 10% ke 80% dengan SuperCharge",

    "victory.productPage.techSpecs3.title": "80",
    "victory.productPage.techSpecs3.unit": "km/jam",
    "victory.productPage.techSpecs3.desc": "Kecepatan Maksimum",

    "victory.productPage.productOverview.imageAlt": "Victory Abu-Abu",
    "victory.productPage.productOverview.title":
      "Sporty, Lincah, Tak Terhentikan.",
    "victory.productPage.productOverview.description":
      "Victory dari Wedison menghadirkan tingkat sportiness dan kelincahan baru dalam mobilitas listrik. Dirancang khusus untuk berkendara di kota, Victory memadukan tampilan agresif, akselerasi super cepat, dan kendali yang luar biasa. Dengan wheelbase lebar dan rem cakram CBS canggih, Anda akan merasa percaya diri di setiap tikungan. Tempuh jarak hingga 115 km dan isi daya dalam hitungan menit—Victory selalu membawa Anda selangkah lebih maju di setiap perjalanan.",

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

    "victory.specs.engine.motorType": "Brusless DC Motor",
    "victory.specs.engine.motorPower": "3.000 Watt (3 kW)",
    "victory.specs.engine.topSpeed": "80 km/jam",
    "victory.specs.engine.acceleration": "6.5 detik",
    "victory.specs.battery.batteryType": "Lithium-ion (LFP)",
    "victory.specs.battery.batteryCapacity":
      "2.5 kWh (Baterai Regular) / 3.4 kWh (Baterai Extended)",
    "victory.specs.battery.voltage": "76.8 Volt",
    "victory.specs.battery.chargingTimeSuperCharge": "15 menit",
    "victory.specs.battery.chargingTimeHome": "4 jam",
    "victory.specs.battery.range":
      "85 km (Baterai Regular) / 115 km (Baterai Extended)",
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

    "athena.productPage.techSpecs1.title": "115",
    "athena.productPage.techSpecs1.unit": "km",
    "athena.productPage.techSpecs1.desc": (
      <>
        <p>Jarak Tempuh</p>
        <p className="text-xs text-gray-500">*dengan Baterai Extended</p>
      </>
    ),

    "athena.productPage.techSpecs2.title": "15",
    "athena.productPage.techSpecs2.unit": "menit",
    "athena.productPage.techSpecs2.desc":
      "Charge dari 10% ke 80% dengan SuperCharge",

    "athena.productPage.techSpecs3.title": "80",
    "athena.productPage.techSpecs3.unit": "km/jam",
    "athena.productPage.techSpecs3.desc": "Kecepatan Maksimum",

    "athena.productPage.productOverview.imageAlt": "Athena Hijau",
    "athena.productPage.productOverview.title":
      "Keanggunan Tak Lekang Waktu, Kini Teraliri Energi Baru",
    "athena.productPage.productOverview.description":
      "Athena dari Wedison memadukan keanggunan klasik skuter Eropa dengan teknologi listrik terkini. Dirancang untuk mencuri perhatian tanpa mengundang bising, Athena menghadirkan sentuhan baru penuh gaya di jalanan kota—mengantar Anda melaju mulus dan senyap di setiap perjalanan. Dengan jangkauan hingga 115 km dalam sekali pengisian, rem cakram CBS yang tangguh, serta suspensi hidrolik canggih, Athena bukan sekadar kendaraan. Ini adalah sebuah pengalaman, dirancang bagi mereka yang mendambakan gaya tanpa usaha dan performa generasi baru. Isi daya cepat di showroom Wedison atau nikmati kemudahan charging di rumah—Athena siap menyesuaikan diri dengan gaya hidup modern Anda.",

    "athena.productPage.productHighlight1.imageAlt": "Head unit Athena",
    "athena.productPage.productHighlight1.title": "Layar Digital Canggih",
    "athena.productPage.productHighlight1.description":
      "Athena dilengkapi head unit modern dengan layar sentuh intuitif, mendukung Apple CarPlay dan Android Auto. Nikmati navigasi, musik, dan notifikasi dengan mudah.",

    "athena.productPage.productHighlight2.imageAlt": "Athena SuperCharge",
    "athena.productPage.productHighlight2.title": "SuperCharge",
    "athena.productPage.productHighlight2.description":
      "Isi daya dari 10% hingga 80% hanya dalam 15 menit dengan Wedison Super Charge (tersedia di seluruh showroom), atau isi daya dengan mudah di rumah hingga penuh dalam kurang dari 4 jam. Athena dirancang untuk mengikuti ritme kota yang tak pernah berhenti.",

    "athena.productPage.productHighlight3.imageAlt":
      "Sistem Pengereman CBS Athena",
    "athena.productPage.productHighlight3.title": "Dirancang untuk Perkotaan",
    "athena.productPage.productHighlight3.description":
      "Dengan rem cakram CBS di depan dan belakang, serta ban lebar yang stabil, Athena menghadirkan kendali lincah dan pengereman yang meyakinkan—memungkinkan Anda melaju di jalanan kota dengan percaya diri, nyaman, dan penuh gaya.",

    "athena.productPage.chargingOverview.imageAlt":
      "Athena Hijau dengan SuperCharge dan Home Charging",
    "athena.productPage.chargingOverview.title": "Pengisian Daya Tanpa Ribet",
    "athena.productPage.chargingOverview.description":
      "Tetap bergerak dengan solusi pengisian daya fleksibel dari Athena. Cukup colokkan di rumah untuk kenyamanan sehari-hari, atau nikmati kecepatan Super Charge di seluruh showroom Wedison. Athena memberi Anda kebebasan untuk memilih—isi daya di tempat tinggal, atau isi cepat saat sedang bepergian.",

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

    "athena.specs.engine.motorType": "Brusless DC Motor",
    "athena.specs.engine.motorPower": "2.500 Watt (2.5 kW)",
    "athena.specs.engine.topSpeed": "80 km/jam",
    "athena.specs.engine.acceleration": "6.5 detik",
    "athena.specs.battery.batteryType": "Lithium-ion (LFP)",
    "athena.specs.battery.batteryCapacity":
      "2.5 kWh (Baterai Regular) / 3.4 kWh (Baterai Extended)",
    "athena.specs.battery.voltage": "76.8 Volt",
    "athena.specs.battery.chargingTimeSuperCharge": "15 menit",
    "athena.specs.battery.chargingTimeHome": "4 jam",
    "athena.specs.battery.range":
      "85 km (Baterai Regular) / 115 km (Baterai Extended)",
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

    // ===

    "mini.productPage.hero.imageAlt": "Mini Merah dan Mini Putih",
    "mini.productPage.hero.title": "MINI",
    "mini.productPage.hero.description":
      "Mobilitas Terjangkau untuk Setiap Perjalanan",
    "mini.productPage.hero.ctaPrimary": "Pesan Sekarang",
    "mini.productPage.hero.ctaSecondary": "Unduh Brosur",

    "mini.productPage.techSpecs1.title": "65",
    "mini.productPage.techSpecs1.unit": "km",
    "mini.productPage.techSpecs1.desc": "Jarak Tempuh",

    "mini.productPage.techSpecs2.title": "LED",
    "mini.productPage.techSpecs2.desc": "Tampilan Head Unit",

    "mini.productPage.techSpecs3.title": "55",
    "mini.productPage.techSpecs3.unit": "km/jam",
    "mini.productPage.techSpecs3.desc": "Kecepatan Maksimum",

    "mini.productPage.productOverview.imageAlt": "Mini Merah",
    "mini.productPage.productOverview.title":
      "Kecil Ukurannya, Besar Pengalamannya.",
    "mini.productPage.productOverview.description":
      "Paket roda dan ban terbaru menghadirkan pengalaman berkendara yang lebih halus. Rangka bodi yang didesain ulang mengurangi jumlah komponen dari 70 menjadi 1 untuk menghilangkan celah. Semua itu untuk menciptakan perjalanan yang senyap dan nyaman.",

    "mini.productPage.productHighlight1.imageAlt": "Bagasi Bawah Jok Mini",
    "mini.productPage.productHighlight1.title": "Bagasi XL di Bawah Jok",
    "mini.productPage.productHighlight1.description":
      "Bawa lebih banyak di setiap perjalanan. Kompartemen bawah jok Mini yang ekstra luas bisa memuat ransel, belanjaan, bahkan helm full-face—lebih banyak ruang, lebih banyak kemungkinan.",

    "mini.productPage.productHighlight2.imageAlt": "Tampilan LED Mini",
    "mini.productPage.productHighlight2.title": "Tampilan Digital LED",
    "mini.productPage.productHighlight2.description":
      "Tetap terinformasi dan terkendali dengan layar LED digital modern yang tajam. Lihat kecepatan, baterai, dan info lainnya secara real-time—cukup dengan sekali lirik.",

    "mini.productPage.productHighlight3.imageAlt": "Rem Cakram Mini",
    "mini.productPage.productHighlight3.title": "Rem Cakram Ganda yang Andal",
    "mini.productPage.productHighlight3.description":
      "Nikmati kekuatan pengereman maksimal dan rasa aman dengan rem cakram di roda depan dan belakang. Memberikan pengereman yang halus dan responsif dalam segala kondisi—untuk perjalanan yang tenang dan percaya diri.",

    "mini.productPage.chargingOverview.imageAlt":
      "Mini Merah sedang diisi daya di colokan rumah",
    "mini.productPage.chargingOverview.title":
      "Pengisian Daya di Rumah yang Simpel",
    "mini.productPage.chargingOverview.description":
      "Isi daya dengan mudah dari colokan listrik biasa. Dengan charger rumah bawaan, Mini selalu siap menemani perjalanan berikutnya—tanpa perlu fast-charging, cukup colokkan dan jalan.",

    // ===

    "mini.specs.engine.motorType": "Brusless DC Motor",
    "mini.specs.engine.motorPower": "1.200 Watt (1.2 kW)",
    "mini.specs.engine.topSpeed": "55 km/jam",
    "mini.specs.engine.acceleration": "9.3 detik",
    "mini.specs.battery.batteryType": "Lithium-ion (LFP)",
    "mini.specs.battery.batteryCapacity": "1.6 kWh",
    "mini.specs.battery.voltage": "64 Volt",
    "mini.specs.battery.chargingTimeSuperCharge": "-",
    "mini.specs.battery.chargingTimeHome": "4 jam",
    "mini.specs.battery.range": "65 km",
    "mini.specs.brake.frontBrake": "Rem Cakram",
    "mini.specs.brake.rearBrake": "Rem Cakram",
    "mini.specs.brake.cbsSupport": "Tidak",
    "mini.specs.dimension.length": "1.790 mm",
    "mini.specs.dimension.width": "670 mm",
    "mini.specs.dimension.height": "1.110 mm",
    "mini.specs.dimension.wheelbase": "1.370 mm",
    "mini.specs.dimension.groundClearance": "130 mm",
    "mini.specs.dimension.seatHeight": "760 mm",
    "mini.specs.dimension.weight": "78.5 kg",
    "mini.specs.tire.frontTire": "90/90-10",
    "mini.specs.tire.rearTire": "90/90-10",
    "mini.specs.suspension.frontSuspension": "Hidrolik Teleskopik",
    "mini.specs.suspension.rearSuspension": "Hidrolik Teleskopik",

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
