// Kamus terjemahan (EN). Dipisah per-locale supaya HANYA locale aktif
// yang dibundel ke client (bukan kedua bahasa sekaligus). Dikonsumsi lewat provider per-locale.
import Link from "next/link";
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

export const en = {
  //SEO Landing
  "landing.title": "Wedison - Electric Motorcycles and SuperCharge",
  "landing.description":
    "Wedison electric motorcycles, backed by the SuperCharge network. Charge from 10% to 80% in 15 minutes.",

  // compare table
  "compare.model": "Compare Models",
  "compare.select.bike": "Select a motorcycle to compare",
  "compare.title": "Compare Wedison Models",
  "compare.subtitle":
    "Compare the specifications side by side and identify the model that suits your riding.",
  "compare.expandAll": "Expand All",
  "compare.collapseAll": "Collapse All",
  "compare.swipeHint": "Swipe to see more",
  "compare.page.kicker": "Compare Electric Bikes",
  "compare.page.addBike": "Add motorcycle",
  "compare.page.remove": "Remove",
  "compare.viewDetails": "View Details",
  "compare.help.title": "Still deciding?",
  "compare.help.subtitle":
    "Tell us how you ride and our team will recommend the right model.",
  "compare.help.whatsapp": "Chat on WhatsApp",
  "compare.help.showroom": "Visit a Showroom",

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
    "Operation, charging, maintenance, and safety, documented in a single official manual.",
  "user.manual.faq.section.title": "Manuals for",
  "user.manual.faq.section.titleHighlight": "Every Model",
  "user.manual.faq.section.description":
    "Pick your model below to read or download its official manual.",
  "user.manual.btn.view": "View Manual",
  "user.manual.btn.download": "Download",
  "user.manual.card.bees.title": "Wedison Bees",
  "user.manual.card.bees.desc":
    "Compact commuter guide: operation, charging, and routine care.",
  "user.manual.card.athena.title": "Wedison Athena",
  "user.manual.card.athena.desc":
    "Retro scooter guide: smart features and battery care.",
  "user.manual.card.victory.title": "Wedison Victory",
  "user.manual.card.victory.desc":
    "Sport-class guide: riding modes, SuperCharge, and service schedule.",
  "user.manual.card.edpower.title": "Wedison EdPower",
  "user.manual.card.edpower.desc":
    "Full guide for the long-range model, for daily rides and longer trips.",

  // footer support
  "footer.support": "Support",
  "footer.userManual": "User Manuals",
  "footer.faq": "FAQ",

  // Navbar
  "nav.primary": "Primary navigation",
  "nav.openMenu": "Open menu",
  "nav.closeMenu": "Close menu",
  "nav.skipToContent": "Skip to content",
  "nav.cta.testRide": "Test Ride",
  "nav.menu.models": "Motorcycles",
  "nav.menu.services": "Services",
  "nav.menu.company": "Company",
  "nav.models.hint": "Four models, one shared charging network.",
  "nav.models.compare": "Compare all models",
  "nav.model.bees.tagline": "Compact and agile",
  "nav.model.athena.tagline": "Premium and comfortable",
  "nav.model.victory.tagline": "Style and power",
  "nav.model.edpower.tagline": "Tough, long range",
  "nav.superCharge.network": "SuperCharge Network",
  "nav.superCharge.network.description":
    "A 15-minute charge on a network Wedison builds and runs itself.",
  "nav.superCharge.map": "Location Map",
  "nav.superCharge.map.description":
    "Find the nearest point, with opening hours and amenities.",
  "nav.feature.superCharge.alt":
    "A Wedison motorcycle charging at a SuperCharge station at night",
  "nav.feature.superCharge.caption":
    "SuperCharge points across Greater Jakarta, Bandung, and Bali.",
  "nav.feature.services.alt":
    "The reception desk at a Wedison Experience Center",
  "nav.feature.services.caption":
    "Everything you need before and after you take one home.",
  "nav.feature.company.alt": "The Wedison facility seen from above",
  "nav.feature.company.caption":
    "The company, the people, and the latest news.",
  "nav.products": "Products",
  "nav.discover": "Discover",
  "nav.discover.leftCard.title": "Discover Wedison",
  "nav.discover.leftCard.description":
    "Visit the Experience Center, find answers in the FAQ, or follow the latest in the Media Center.",
  "nav.experienceCenter.description":
    "Visit a Wedison showroom and experience the 15-minute charge for yourself.",
  "nav.faq.description":
    "Answers to the most common questions about our products and services.",
  "nav.mediaCenter.description":
    "News, official releases, and the latest updates from Wedison.",
  "nav.ojol.description":
    "Electric motorcycle rental for ride-hailing drivers, from 50K per day.",
  "nav.showroom": "Showroom",
  "nav.serviceLocation": "Service Location",
  "nav.superCharge": "SuperCharge",
  "nav.corporate": "Corporate",
  "nav.corporate.leftCard.title": "Powering the Future",
  "nav.corporate.leftCard.description":
    "Electric motorcycles that charge in 15 minutes, supported by a network Wedison builds and operates itself.",
  "nav.aboutUs": "About Us",
  "nav.aboutUs.description":
    "Who Wedison is, what we build, and the direction we are taking.",
  "nav.careers": "Careers",
  "nav.careers.description":
    "Open positions at Wedison and across Indonesia's electric vehicle industry.",

  // Career Page
  "career.banner.title": "Join the",
  "career.banner.titleHighlight": "Wedison Team",
  "career.banner.description": "Help us build electric transport in Indonesia",
  "career.banner.badge1": "Work-Life Balance",
  "career.banner.badge2": "Competitive Salary",
  "career.banner.badge3": "Career Growth",
  "career.section.title": "Available Positions",
  "career.section.description": "Find the role that matches your expertise",
  "career.card.viewDetails": "View Details",
  "career.card.previewText":
    "Click to view the full role description and requirements",
  "career.detail.jobOverview": "Job Overview",
  "career.detail.keyResponsibilities": "Key Responsibilities",
  "career.detail.qualifications": "Qualifications & Requirements",
  "career.detail.applyButton": "Apply for This Position",
  "career.portal.title": "Choose Application Platform",
  "career.portal.description":
    "Choose a job portal to continue your application",
  "career.portal.infoText":
    "You will be directed to a third-party site to complete your application. Please have your CV and supporting documents prepared beforehand.",
  "career.apply.emailTitle": "Apply via Email",
  "career.apply.emailSubtitle":
    "Send your application directly to hr@wedison.co",
  "career.apply.orViaPortal": "or via Job Portal",

  "nav.contactUs": "Contact Us",
  "nav.contactUs.description":
    "Have a question or need assistance? The Wedison team is here to help.",
  "nav.helpCenter": "Help Center",

  // Hero
  "hero.tag": "The Future is Electric",
  "hero.title": "The Future of",
  "hero.titleHighlight": "Electric Mobility",
  "hero.description":
    "Wedison electric motorcycles deliver the power daily riding demands, charge quickly, and produce no exhaust.",
  "hero.exploreModels": "Explore Models",
  "hero.bookTestRide": "Book Test Ride",

  // Features
  "features.tag": "Why Wedison",
  "features.title": "Why Choose",
  "features.titleHighlight": "Wedison",
  "features.description":
    "Four models, one charging network, and running costs substantially lower than petrol.",
  "features.longRangeBattery": "Up to 160 km of Range",
  "features.longRangeBatteryDesc":
    "A single charge covers several days of city riding, depending on the model and battery selected.",
  "features.rapidCharging": "SuperCharge in 15 Minutes",
  "features.rapidChargingDesc":
    "Charge from 10% to 80% in 15 minutes at any Wedison SuperCharge station.",
  "features.impressivePerformance": "Full Torque From a Standstill",
  "features.impressivePerformanceDesc":
    "An electric motor delivers full torque from the first turn of the throttle, making initial acceleration immediate.",
  // "features.zeroEmissions": "Cut the Carbon, Ride Electric",
  // "features.zeroEmissions": "Ride Electric, Cut Emissions by 54%",
  // "features.zeroEmissionsDesc":
  //   "Electric motorcycles emit 53.8% less CO₂ and cut lifecycle emissions by up to 80%, resulting in 14% cleaner air.",
  // "features.zeroEmissionsLink":
  //   "https://www.sciencedirect.com/science/article/pii/S0967070X21003401",
  "features.zeroEmissions": "Zero Emission, Cleaner Air",
  "features.zeroEmissionsDesc":
    "No exhaust, no fumes. Every rider who switches contributes to cleaner air in the city.",
  "features.zeroEmissionsLink":
    "https://www.sciencedirect.com/science/article/pii/S0967070X21003401",
  // "features.healthBenefits": "Cleaner Air, Healthier Life",
  // "features.healthBenefits":
  //   "11% Lower Lung Disease Risk, and 3.2% Fewer Asthma ER Visits.",
  // "features.healthBenefitsDesc":
  //   "Compared to gasoline motorcycles, electric motorcycles lower your risk of lung diseases and reduce asthma-related ER visits by 3.2%.",
  "features.healthBenefits": "Less Energy Per Kilometer",
  "features.healthBenefitsDesc":
    "Wedison covers the same distance on considerably less energy than a petrol motorcycle, and running costs fall accordingly.",
  // "Electric motorcycle cuts city fine particulate pollution by 14% on average, reduces asthma-related ER visits by 3.2%, helping you and your loved ones breathe easier every day.",
  "features.healthBenefitsLink":
    "https://www.sciencedirect.com/science/article/pii/S016041202031970X",
  // "features.noiseFree": "Say Goodbye to Noise & Air Pollution",
  // "features.noiseFree": "Enjoy 23% Quieter, Zero-Exhaust Rides",
  // "features.noiseFreeDesc":
  //   "Electric motorcycle rides are up to 23% quieter and emit no exhaust, saving about 46.5 g of CO₂ and 1.95 g of CO per kilometer.",
  "features.noiseFree": "Quiet on the Road",
  "features.noiseFreeDesc":
    "An electric motor runs almost silently, leaving both the street and the ride noticeably calmer.",
  "features.noiseFreeLink":
    "https://www.sciencedirect.com/science/article/pii/S0160412023003896",

  // Products
  "products.tag": "The Lineup",
  "products.title": "Wedison",
  "products.titleHighlight": "Electric Motorcycles",
  "products.description":
    "Four models for four kinds of riding, from narrow city lanes to longer journeys out of town.",
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
    "Stories from riders who have already switched to Wedison.",

  // Contact
  "contact.tag": "Contact Us",
  "contact.title": "Get in",
  "contact.titleHighlight": "Touch",
  "contact.description":
    "Questions about Wedison electric motorcycles? Our team is here to help.",
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
  "contact.phoneHours": "Monday to Friday, 9am to 6pm",
  "contact.emailLabel": "Email",
  "contact.emailResponse": "We respond as soon as possible",
  "contact.followUs": "Follow Us",

  // Footer
  "footer.description":
    "Electric motorcycles and a fast-charging network, built for Indonesian roads.",
  "footer.products": "Products",
  "footer.experience": "Experience",
  "footer.corporate": "Corporate",
  "footer.copyright": "© 2025 Wedison. All rights reserved.",
  "footer.tagline": "Built to last, and built to run on electricity.",
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
    "See the range in person and ride one yourself before making a decision.",
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
  "showroom.testRide.title": "Test Ride",
  "showroom.testRide.description":
    "Ride in our test area and assess the acceleration and comfort for yourself before buying.",
  "showroom.consultation.title": "Product Consultation",
  "showroom.consultation.description":
    "Unsure which model suits you? Describe how you ride and our team will narrow down the options.",
  "showroom.financing.title": "Financing Simulation",
  "showroom.financing.description":
    "Calculate the monthly payment and review the plan that best fits your budget.",
  "showroom.service.title": "Service and After-Sales",
  "showroom.service.description":
    "Official servicing and genuine parts, carried out by technicians trained on Wedison motorcycles.",
  "showroom.bookVisit": "Book a Visit",
  "showroom.viewModels": "Go to Showroom",

  // About Us
  "about.tag": "Our Story",
  "about.title": "About",
  "about.titleHighlight": "Wedison Group",
  "about.overview.title":
    "Wedison: The Motorcycles and the Network Behind Them",
  "about.overview.p1":
    "Wedison is Indonesia's first fast-charging electric motorcycle company. Our work does not end at selling motorcycles. We also build the charging network that makes owning one practical day to day.",
  "about.overview.p2":
    "The motorcycles and the charging stations are designed as a single system, so ownership is coherent from the first day.",
  "about.mission.title": "Our Mission",
  "about.mission.p1":
    "To build an electric vehicle ecosystem that is complete, affordable, and genuinely dependable.",
  "about.mission.p2":
    "To make an electric motorcycle a sensible choice for households across Indonesia and Southeast Asia.",
  "about.values.title": "Our Core Values",
  "about.values.innovation.title": "Electric Vehicle Innovation",
  "about.values.innovation.description":
    "Developing energy-efficient electric vehicles at a price the wider market can reach, rather than a select few.",
  "about.values.partnerships.title": "Partnerships and Collaborations",
  "about.values.partnerships.description":
    "Working across industries to accelerate charging infrastructure and battery development.",
  "about.values.experience.title": "Ownership That Holds Together",
  "about.values.experience.description":
    "Motorcycles that are straightforward to ride, equipped with features owners use every day.",
  "about.projects.title": "Our Projects",
  "about.projects.future.title": "Reducing Emissions From Urban Transport",
  "about.projects.future.description":
    "Drawing on renewable energy to lower carbon emissions, and broadening the electric vehicle market so clean transport becomes more affordable.",
  "about.projects.charging.title": "SuperCharge",
  "about.projects.charging.description":
    "Building a charging network dependable enough that owners no longer need to monitor their remaining range daily.",
  "about.offers.title": "What We Offer",
  "about.offers.motorcycles.title": "Electric Motorcycle Models",
  "about.offers.motorcycles.description":
    "Several models with distinct characters, from a compact commuter to a long-range maxi-scooter.",
  "about.offers.charging.title": "SuperCharge Stations",
  "about.offers.charging.description":
    "Fast-charging stations that bring a battery from 10% to 80% in 15 minutes, keeping stops brief.",
  "about.joinUs": "Join Our Mission",
  "about.joinUsDescription":
    "We are building electric transport in Indonesia designed for the long term. We would welcome your part in it.",
  "about.contactUs": "Contact Us",

  // Contact Page
  "contact.page.description":
    "Have a question or need assistance? Reach us through any of the channels below.",
  "contact.page.findUs": "Find Us",
  "contact.page.openInMaps": "Open in Google Maps",
  "contact.page.hours": "Business Hours",
  "contact.page.business.hours": "Monday - Friday: 09.00 AM - 06.00 PM",
  "contact.page.faqTitle": "Frequently Asked Questions",
  "contact.page.thankYou": "Thank You!",
  "contact.page.messageReceived":
    "We have received your message. Our team will contact you shortly.",
  "contact.page.sendAnother": "Send Another Message",
  "contact.page.sending": "Sending...",
  "contact.page.faq.q1": "How do I book a test ride?",
  "contact.page.faq.a1":
    "Visit any of our showrooms directly, or reserve a slot in advance through this site. Our team will accompany you throughout the ride.",
  "contact.page.faq.q2": "What warranty comes with a Wedison motorcycle?",
  "contact.page.faq.a2":
    "Every Wedison motorcycle carries a 2-year warranty, and the battery carries a 3-year warranty. Both cover manufacturing defects.",
  "contact.page.faq.q3": "How long does charging take?",
  "contact.page.faq.a3":
    "At a SuperCharge station, most models charge from 10% to 80% in 15 minutes. On a household outlet, a full charge takes approximately 4 to 10 hours, depending on the model and battery capacity.",
  "contact.page.faq.q4": "Are financing options available?",
  "contact.page.faq.a4":
    "Yes. We offer several installment plans, and our team can help you select the one best suited to your budget.",

  // calculator
  "calculator.page.tag": "Saving Calculator",
  "calculator.page.title": "Calculate ",
  "calculator.page.titleHighlight": "Your Savings Now",
  "calculator.page.description":
    "Adjust the slider to compare your current monthly petrol costs against a Wedison, and see the difference for yourself.",
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
  "edmax.title": "EdPower – Powerful & Smart Electric Motorcycle from Wedison",
  "edmax.description":
    "Edmax is Wedison's flagship electric motorcycle with 86km/h top speed, advanced headunit (CarPlay & Android Auto), and SuperCharge support.",

  "edmax.hero.tag": "Flagship Model",
  "edmax.hero.title": "Ride the Future with",
  "edmax.hero.titleHighlight": "EdPower",
  "edmax.hero.description":
    "Powerful, quick to charge, and fully electric. Built for riders who cover longer distances.",
  "edmax.hero.orderNow": "Order Now",
  "edmax.hero.downloadBrochure": "Download Brochure",

  "edmax.feature1.tag": "Smart Display",
  "edmax.feature1.title": "A Touchscreen Paired to Your Phone",
  "edmax.feature1.subtitle":
    "Wireless Apple CarPlay & Android Auto, Full Touchscreen Display",
  "edmax.feature1.description":
    "Navigation, music, and calls are displayed on the color touchscreen. Apple CarPlay and Android Auto connect without a cable.",
  "edmax.feature1.range": "Range",
  "edmax.feature1.efficient": "Efficient",
  "edmax.feature1.energyUse": "Energy Use",
  "edmax.feature1.realtime": "Real-time",
  "edmax.feature1.rangeIndicator": "Range Indicator",

  "edmax.feature2.tag": "SuperCharge",
  "edmax.feature2.title": "Power Up in Minutes",
  "edmax.feature2.subtitle": "SuperCharge Technology",
  "edmax.feature2.description":
    "From 10% to 80% in 15 minutes, roughly the length of a coffee break before you are on the road again.",
  "edmax.feature2.charge": "10% to 80% Charge",
  "edmax.feature2.universal": "Universal",
  "edmax.feature2.chargingPort": "Charging Port",
  "edmax.feature2.smart": "Smart",
  "edmax.feature2.chargingApp": "Charging App",

  "edmax.feature3.title": "Designed to Turn Heads",
  "edmax.feature3.subtitle": "Edgy. Sporty. Iconic.",
  "edmax.feature3.description":
    "Defined body lines and sharp angles make EdPower recognizable from a distance.",
  "edmax.feature3.aerodynamic": "Aerodynamic",
  "edmax.feature3.design": "Design",
  "edmax.feature3.led": "LED",
  "edmax.feature3.lighting": "Lighting",
  "edmax.feature3.premium": "Premium",
  "edmax.feature3.materials": "Materials",

  "edmax.color.title": "Choose Your",
  "edmax.color.titleHighlight": "Style",
  "edmax.color.description":
    "Select your preferred EdPower color and view it here.",

  "edmax.specs.title": "Specifications",
  "edmax.specs.description":
    "Full technical details for the EdPower electric motorcycle.",
  "edmax.specs.engine": "Engine",
  "edmax.specs.battery": "Battery",
  "edmax.specs.brake": "Brake",
  "edmax.specs.dimension": "Dimension",
  "edmax.specs.tire": "Tire",
  "edmax.specs.suspension": "Suspension",

  // edpower
  "edpower.productPage.hero.imageAlt":
    " Full body of EdPower from a three-quarter front angle, showcasing its robust, maxi-scooter design and premium features.",
  "edpower.productPage.hero.title": "EDPOWER",
  "edpower.productPage.hero.description": "The Future of Electric Riding",
  "edpower.productPage.hero.ctaPrimary": "Pesan Sekarang",
  "edpower.productPage.hero.ctaSecondary": "Unduh Brosur",

  "edpower.productPage.techSpecs1.title": 160,
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
    "EdPower from a dramatic side profile, emphasizing its wide seat, bold stance, and tech-forward look.",
  "edpower.productPage.productOverview.title":
    "Flagship Power, Unrivaled Comfort.",
  "edpower.productPage.productOverview.description":
    "EdPower is the largest motorcycle in the Wedison range. The saddle is wide, the riding position is relaxed, and range reaches 160 km on a single charge. The display pairs with your phone, the underseat compartment holds two helmets, and there is power in reserve for trips beyond the city.",

  "edpower.productPage.productHighlight1.imageAlt":
    "Cockpit view showcasing the large TFT display with Apple CarPlay & Android Auto interface",
  "edpower.productPage.productHighlight1.title":
    "Wireless Apple CarPlay & Android Auto",
  "edpower.productPage.productHighlight1.description":
    "Pair your phone via wireless Apple CarPlay or Android Auto. Navigation, calls, and music are all presented on the EdPower display.",

  "edpower.productPage.productHighlight2.imageAlt":
    "Underseat storage, lid open, revealing extra-large compartment",
  "edpower.productPage.productHighlight2.title": "XXL Underseat Storage",
  "edpower.productPage.productHighlight2.description":
    "The underseat compartment accommodates two helmets at once, or a full bag of groceries, with no additional luggage required.",

  "edpower.productPage.productHighlight3.imageAlt":
    "Rear three-quarter angle highlighting EdPower’s broad stance and wide seat",
  "edpower.productPage.productHighlight3.title": "Wide Seat, Relaxed Position",
  "edpower.productPage.productHighlight3.description":
    "A wide, well-padded seat and an upright riding position make long rides far less tiring, for the pillion as much as the rider.",

  "edpower.productPage.productHighlight4.imageAlt":
    "Front shot showing advanced LED headlamps and modern bodywork",
  "edpower.productPage.productHighlight4.title":
    "A Design That Draws Attention",
  "edpower.productPage.productHighlight4.description":
    "An assertive front end, full LED lighting, and a cleanly sculpted tail. EdPower stands out even at a standstill.",

  "edpower.productPage.productHighlight5.imageAlt":
    " Battery/range indicator on the dashboard, close-up",
  "edpower.productPage.productHighlight5.title": "Class-Leading 160 km Range",
  "edpower.productPage.productHighlight5.description":
    "A single charge takes EdPower up to 160 km, enough for a week of city riding or one journey out of town.",

  "edpower.productPage.chargingOverview.imageAlt":
    "EdPower parked at a Wedison showroom with SuperCharge and home charger visible",
  "edpower.productPage.chargingOverview.title": "Two Ways to Charge",
  "edpower.productPage.chargingOverview.description":
    "When time is short, a SuperCharge station at any Wedison showroom completes the job in 15 minutes. When it is not, an overnight charge at home leaves the battery full by morning.",

  "edpower.productPage.chargingHighlight1.imageAlt":
    "EdPower connected to a Wedison SuperCharge station",
  "edpower.productPage.chargingHighlight1.title": "Wedison SuperCharge",
  "edpower.productPage.chargingHighlight1.description": (
    <>
      Charge from 10% to 80% in 15 minutes, suited to a brief stop between
      errands. Available at every Wedison showroom.{" "}
      <Link href="/super-charge" className="underline text-primary">
        Learn More
      </Link>
    </>
  ),

  "edpower.productPage.chargingHighlight2.imageAlt":
    "EdPower plugged into a home charger in a clean, modern garage",
  "edpower.productPage.chargingHighlight2.title": "Charging at Home",
  "edpower.productPage.chargingHighlight2.description":
    "Connect the charger overnight and the battery is full by morning. A standard household socket is all that is required.",

  "edpower.specs.engine.motorType": "Brushless DC Motor",
  "edpower.specs.engine.motorPower": "3 kW",
  "edpower.specs.engine.topSpeed": "80 km/h",
  "edpower.specs.engine.acceleration": "7.9 seconds",
  "edpower.specs.battery.batteryType": "Lithium-ion (LFP)",
  "edpower.specs.battery.batteryCapacity": "5 kWh",
  "edpower.specs.battery.voltage": "76.8 Volt",
  "edpower.specs.battery.chargingTimeSuperCharge": "15 minutes",
  "edpower.specs.battery.chargingTimeHome": "10.2 hours",
  "edpower.specs.battery.range": "160 km",
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
    "An electric motorcycle built for work: durable enough for all-day use, and inexpensive to run.",
  "dash.hero.orderNow": "Order Now",
  "dash.hero.downloadBrochure": "Download Brochure",

  "dash.feature1.tag": "Endless Delivery",
  "dash.feature1.title": "Designed for Limitless Delivery",
  "dash.feature1.subtitle": "Flexible rear slot for any box type",
  "dash.feature1.description":
    "The rear mount accepts a coolbox, a container, or whichever case your deliveries require. It fastens securely and stays stable on the road.",

  "dash.feature2.tag": "Built for Delivery",
  "dash.feature2.title": "One Seat, Endless Destinations",
  "dash.feature2.subtitle": "Compact, efficient, and purpose-built",
  "dash.feature2.description":
    "Omitting the passenger seat makes Dash lighter and gentler on the battery. Well suited to food delivery, parcels, and light logistics.",

  "dash.color.title": "Choose Your",
  "dash.color.titleHighlight": "Color",
  "dash.color.description":
    "Select your preferred Dash color and view it here.",

  "dash.specs.title": "Specifications",
  "dash.specs.description":
    "Full technical details for the Dash electric motorcycle.",
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
    "A sporty electric scooter with a slim body. Straightforward to live with day to day, and distinctive to look at.",
  "victory.hero.orderNow": "Order Now",
  "victory.hero.downloadBrochure": "Download Brochure",

  "victory.feature1.tag": "City Ride Comfort",
  "victory.feature1.title": "Perfect Size for Urban Roads",
  "victory.feature1.subtitle": "Not too small, not too bulky",
  "victory.feature1.description":
    "The proportions suit city use: narrow enough for tight streets, yet stable at higher speeds.",

  "victory.feature2.tag": "Sporty Design",
  "victory.feature2.title": "Bold Looks, Modern Feel",
  "victory.feature2.subtitle": "Inspired by performance scooters",
  "victory.feature2.description":
    "The bodywork draws its lines from sport scooters, for riders who want a distinctive presence without sacrificing efficiency.",

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
  "victory.productPage.productOverview.title": "Sporty and Agile in the City.",
  "victory.productPage.productOverview.description":
    "Victory is built for city streets. The long wheelbase keeps it composed, CBS disc brakes at both ends make stopping more predictable, and range reaches 120 km on a charge. When the battery runs low, SuperCharge restores it in 15 minutes.",

  "victory.productPage.productHighlight1.imageAlt": "Victory Front look",
  "victory.productPage.productHighlight1.title": "Signature Sporty Design",
  "victory.productPage.productHighlight1.description":
    "An aerodynamic body with defined lines and angular LED lighting makes Victory easy to identify, even among traffic at the lights.",

  "victory.productPage.productHighlight2.imageAlt":
    "Front three-quarter view showing wide tire profile and suspension",
  "victory.productPage.productHighlight2.title": "Steady on Rough Roads",
  "victory.productPage.productHighlight2.description":
    "Wide, high-grip tires and hydraulic suspension keep Victory settled, whether the surface is smooth or heavily potholed.",

  "victory.productPage.productHighlight3.imageAlt":
    "Close-up of SuperCharge port with Wedison branding",
  "victory.productPage.productHighlight3.title": "SuperCharge Ready",
  "victory.productPage.productHighlight3.description":
    "Charge from 10% to 80% in 15 minutes at a SuperCharge station, or charge at home when time allows.",

  "victory.productPage.chargingOverview.imageAlt":
    "Victory parked at a Wedison showroom, SuperCharge station in view",
  "victory.productPage.chargingOverview.title": "Charge However Suits You",
  "victory.productPage.chargingOverview.description":
    "Use a SuperCharge station at a Wedison showroom when time is short, or charge gradually at home overnight. Either approach is straightforward.",

  "victory.productPage.chargingHighlight1.imageAlt":
    "Victory at a Wedison SuperCharge station, cable connected",
  "victory.productPage.chargingHighlight1.title": "Ultra-Fast SuperCharge",
  "victory.productPage.chargingHighlight1.description": (
    <>
      Go from 10% to 80% in 15 minutes, enough time for a short break on a busy
      day. Available at every Wedison showroom.{" "}
      <Link href="/super-charge" className="underline text-primary">
        Learn More
      </Link>
    </>
  ),

  "victory.productPage.chargingHighlight2.imageAlt":
    "Victory plugged into a home charger in a modern garage setting",
  "victory.productPage.chargingHighlight2.title": "Everyday Home Charging",
  "victory.productPage.chargingHighlight2.description":
    "Charge overnight and the battery is full by morning. The home charger is supplied with the motorcycle.",

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
    "Athena adopts the form of a classic European scooter and replaces the engine with an electric drivetrain. The result draws attention without generating noise. Range reaches 120 km on a charge, CBS disc brakes are fitted at both ends, and the suspension is hydraulic. Charge rapidly at a Wedison showroom, or gradually at home.",

  "athena.productPage.productHighlight1.imageAlt": "Head unit Athena",
  "athena.productPage.productHighlight1.title": "Modern Digital Display",
  "athena.productPage.productHighlight1.description":
    "The Athena LCD panel is bright and legible at a glance, even in daylight. It presents only the essentials, keeping your attention on the road.",

  "athena.productPage.productHighlight2.imageAlt": "Athena SuperCharge",
  "athena.productPage.productHighlight2.title": "SuperCharge",
  "athena.productPage.productHighlight2.description":
    "At a SuperCharge station, Athena charges from 10% to 80% in 15 minutes. At home, a full charge takes approximately 5 hours with the Regular battery and 7 hours with the Extended.",

  "athena.productPage.productHighlight3.imageAlt": "CBS Breaking System Athena",
  "athena.productPage.productHighlight3.title": "Designed for the City",
  "athena.productPage.productHighlight3.description":
    "CBS disc brakes at both wheels distribute braking force automatically, while wide tires keep the motorcycle stable under sudden braking.",

  "athena.productPage.chargingOverview.imageAlt":
    "Green Athena with SuperCharge and Home Charging",
  "athena.productPage.chargingOverview.title": "Charging Made Effortless",
  "athena.productPage.chargingOverview.description":
    "For everyday use, charge Athena at home. When you are out and time is limited, stop at a SuperCharge station in any Wedison showroom.",

  "athena.productPage.chargingHighlight1.imageAlt": "Athena with SuperCharge",
  "athena.productPage.chargingHighlight1.title": "15-Minute SuperCharge",
  "athena.productPage.chargingHighlight1.description": (
    <>
      SuperCharge takes the battery from 10% to 80% in 15 minutes, so you are
      not standing around waiting to move again.{" "}
      <Link href="/super-charge" className="underline text-primary">
        Learn More
      </Link>
    </>
  ),

  "athena.productPage.chargingHighlight2.imageAlt": "Athena with Home Charger",
  "athena.productPage.chargingHighlight2.title": "Charging at Home",
  "athena.productPage.chargingHighlight2.description":
    "Charge overnight, or at whatever hour suits you. The home charger is included and operates silently.",

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
    "The lightest and most affordable model in the Wedison range. Well suited to students, commuters, and anyone prioritizing low running costs.",
  "bees.hero.orderNow": "Order Now",
  "bees.hero.downloadBrochure": "Download Brochure",

  "bees.feature1.tag": "Compact and Nimble",
  "bees.feature1.title": "Small Frame, Big Agility",
  "bees.feature1.subtitle": "Lightweight design for crowded streets",
  "bees.feature1.description":
    "At 78.5 kg with a compact body, Bees moves through heavy traffic with ease and requires minimal space when parked.",

  "bees.feature2.tag": "Budget-Friendly Ride",
  "bees.feature2.title": "Super Affordable & Subsidy Eligible",
  "bees.feature2.subtitle": "Lower cost, easy access",
  "bees.feature2.description":
    "Bees qualifies for the government EV subsidy. Running costs are low, and a household socket is sufficient to charge it.",

  "bees.color.description":
    "Select your preferred Bees color and view it here.",

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
  "bees.productPage.productOverview.title": "Small on the Road, Big Underseat.",
  "bees.productPage.productOverview.description":
    "The body is compact, yet the specification is not reduced. Underseat storage is generous, the display is digital LED, and disc brakes are fitted at both wheels. A household socket is all it needs.",

  "bees.productPage.productHighlight1.imageAlt": "Bees Underseat storage",
  "bees.productPage.productHighlight1.title": "XL Underseat Storage",
  "bees.productPage.productHighlight1.description":
    "The underseat compartment accommodates a backpack, a load of groceries, or a single full-face helmet. Generous for a motorcycle of this size.",

  "bees.productPage.productHighlight2.imageAlt": "Bees LED Display",
  "bees.productPage.productHighlight2.title": "Digital LED Display",
  "bees.productPage.productHighlight2.description":
    "Speed, battery level, and distance are presented on a crisp LED display, readable at a single glance.",

  "bees.productPage.productHighlight3.imageAlt": "Bees Disc Brakes",
  "bees.productPage.productHighlight3.title": "Confident Dual Disc Brakes",
  "bees.productPage.productHighlight3.description":
    "Disc brakes front and rear deliver smooth, predictable stopping power, including on wet surfaces.",

  "bees.productPage.chargingOverview.imageAlt":
    "Red Bees charging at a home outlet",
  "bees.productPage.chargingOverview.title": "A Household Socket Is Enough",
  "bees.productPage.chargingOverview.description":
    "Bees charges from a standard outlet and reaches full capacity in approximately 4 hours. The charger is included, with nothing further to purchase.",

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
    "The Wedison fast-charging network. Charge from 10% to 80% in 15 minutes.",

  "supercharge.hero.tag": "Fast Charging",
  "supercharge.hero.title": "Charge from 10% to 80% in",
  "supercharge.hero.titleHighlight": "Just 15 Minutes",
  "supercharge.hero.description":
    "SuperCharge is the fast-charging network Wedison builds and operates itself, compatible with Athena, Victory, and EdPower.",
  "supercharge.hero.ctaPrimary": "Find a Station",
  "supercharge.hero.ctaSecondary": "Learn the Tech",

  "supercharge.speed.kicker": "Speed",
  "supercharge.speed.lead": "Charging from 10% to 80% takes just",
  "supercharge.speed.unit": "minutes",
  "supercharge.speed.caption":
    "Approximately the length of a coffee break, after which you are back on the road.",

  "supercharge.network.kicker": "SuperCharge Network",
  "supercharge.network.title": "Growing across your cities",
  "supercharge.network.description":
    "SuperCharge points continue to expand, from Jakarta to cities across Indonesia.",
  "supercharge.network.stationsLabel": "Charging points",
  "supercharge.network.citiesLabel": "Cities & counting",

  "supercharge.finalCta.title": "Ready to feel SuperCharge?",
  "supercharge.finalCta.description":
    "Find the nearest station, book a test ride, or submit a question to our team.",
  "supercharge.finalCta.ctaPrimary": "Find Locations",
  "supercharge.finalCta.ctaSecondary": "Explore the Bikes",

  "supercharge.locator.kicker": "SuperCharge Network",
  "supercharge.locator.title": "Find a SuperCharge Station",
  "supercharge.locator.subtitle":
    "Locate the nearest SuperCharge point, review its chargers, opening hours, and amenities, then navigate directly there.",
  "supercharge.locator.searchPlaceholder": "Search city or location name…",
  "supercharge.locator.nearMe": "Near me",
  "supercharge.locator.results": "locations",
  "supercharge.locator.listHeading": "SuperCharge locations list",
  "supercharge.locator.geoError":
    "Your location could not be determined. Please try again, or enter your city in the search field.",
  "supercharge.locator.geoDenied":
    "Location access is blocked. Enable it in your browser, or enter your city in the search field.",
  "supercharge.locator.charger": "Nozzle(s)",
  "supercharge.locator.piles": "SuperCharge(s)",
  "supercharge.locator.amenities": "Amenities",
  "supercharge.locator.close": "Close",
  "supercharge.locator.viewAll": "See All Locations",
  "supercharge.locator.status.operational": "Operational",
  "supercharge.locator.status.coming_soon": "Coming soon",
  "supercharge.locator.status.maintenance": "Maintenance",
  "supercharge.locator.status.closed": "Closed",
  "supercharge.locator.tier.hub": "Hub",
  "supercharge.locator.tier.showroom": "Showroom",
  "supercharge.locator.tier.mitra": "Partner",
  "supercharge.locator.filter.allTiers": "All types",
  "supercharge.locator.filter.allStatus": "All status",
  "supercharge.locator.filter.tierLabel": "Location type",
  "supercharge.locator.filter.statusLabel": "Status",
  "supercharge.locator.amenity.toilet": "Toilet",
  "supercharge.locator.amenity.kafe": "Café",
  "supercharge.locator.amenity.musala": "Prayer room",
  "supercharge.locator.amenity.parkir": "Parking",
  "supercharge.locator.amenity.wifi": "Wi-Fi",
  "supercharge.locator.amenity.minimarket": "Minimarket",
  "supercharge.locator.empty.title": "No matching locations",
  "supercharge.locator.empty.desc":
    "Try different keywords, or broaden the filters.",

  "supercharge.video.title": "How SuperCharge Works",
  "supercharge.video.description":
    "From connecting the charger to riding away, this is what charging at a SuperCharge station involves.",

  "supercharge.feature1.tag": "Fast & Reliable",
  "supercharge.feature1.title": "Fifteen Minutes, Not Five Hours",
  "supercharge.feature1.subtitle":
    "Less waiting, without compromising battery health",
  "supercharge.feature1.description":
    "SuperCharge brings a battery from 10% to 80% in 15 minutes. The current is regulated automatically, so the speed comes at no cost to battery life.",

  "supercharge.feature2.tag": "In More Cities Every Month",
  "supercharge.feature2.title": "A Network That Keeps Growing",
  "supercharge.feature2.subtitle": "Check the nearest point before setting off",
  "supercharge.feature2.description":
    "SuperCharge points are located in Wedison showrooms and partner sites, with new locations opening regularly. All of them are listed on the map.",

  "supercharge.feature3.tag": "Safe and Certified",
  "supercharge.feature3.title": "Built to Last for Years",
  "supercharge.feature3.subtitle": "Safety first, speed second",
  "supercharge.feature3.description":
    "Our DC stations are designed specifically for Wedison motorcycles, certified to IEC safety standards, and compliant with EU Directives.",

  // SuperCharge App Section
  "supercharge.app.tag": "Mobile App",
  "supercharge.app.teaser.title": "Find. Charge.",
  "supercharge.app.teaser.titleHighlight": "Ride.",
  "supercharge.app.teaser.description":
    "Locate the nearest SuperCharge station, begin the session, and follow its progress from your phone.",
  "supercharge.app.teaser.feature.find": "Find Stations",
  "supercharge.app.teaser.feature.realtime": "Track Session",
  "supercharge.app.teaser.feature.charge": "Quick Charge",

  "supercharge.app.hero.title": "Everything About Charging,",
  "supercharge.app.hero.titleHighlight": "In One App",
  "supercharge.app.hero.description":
    "Locate a station, begin charging, follow the progress, and manage your charging package, all in one place.",

  "supercharge.app.feature1.icon": "MapPin",
  "supercharge.app.feature1.title": "Find Nearby Stations",
  "supercharge.app.feature1.subtitle": "Locate charging points around you",
  "supercharge.app.feature1.description":
    "Every SuperCharge station appears on the map, with its address, opening hours, and number of chargers.",
  "supercharge.app.feature1.bullet1": "Interactive map with GPS navigation",
  "supercharge.app.feature1.bullet2": "Sorted by proximity",
  "supercharge.app.feature1.bullet3": "Save favorite stations",

  "supercharge.app.feature2.icon": "Activity",
  "supercharge.app.feature2.title": "Monitor Charging From Your Phone",
  "supercharge.app.feature2.subtitle": "No need to wait beside the motorcycle",
  "supercharge.app.feature2.description":
    "Follow the charge level and remaining time while you attend to other things.",
  "supercharge.app.feature2.bullet1": "Battery percentage while charging",
  "supercharge.app.feature2.bullet2": "Estimated time remaining",
  "supercharge.app.feature2.bullet3": "Notification when charging is complete",

  "supercharge.app.feature3.icon": "Zap",
  "supercharge.app.feature3.title": "Start With a Single Tap",
  "supercharge.app.feature3.subtitle": "Connect, confirm, and carry on",
  "supercharge.app.feature3.description":
    "Connect the cable, start the session in the app, and charging begins immediately.",
  "supercharge.app.feature3.bullet1": "One-tap charging start",
  "supercharge.app.feature3.bullet2": "Payment via your charging package",
  "supercharge.app.feature3.bullet3": "Charging session history",

  "supercharge.app.stats.stations": "Stations",
  "supercharge.app.stats.downloads": "Downloads",
  "supercharge.app.stats.rating": "Rating",
  "supercharge.app.stats.chargeTime": "Min Charge",

  "supercharge.app.cta.title": "Ready to SuperCharge",
  "supercharge.app.cta.titleHighlight": "Your Ride?",
  "supercharge.app.cta.description":
    "Download the app and check the nearest station before setting off.",

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
  "form.sending.error.title": "Message Not Sent",
  "form.sending.error.description":
    "Your message could not be sent. Please try again later, or contact us through another channel.",
  "form.sending.sending": "Sending your message, please wait.",
  "form.agreePrivacy.description": (
    <>
      Allow PT Wedison to use the above information and contact me via email
      and/or phone or other personal communication channels for customer service
      activities in accordance with the{" "}
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
  "faq.Battery.questions.0.question": "How long is the battery warranty?",
  "faq.Battery.questions.0.answer":
    "Wedison batteries carry a 3-year warranty.",
  "faq.Battery.questions.1.question": "How long does a full charge take?",
  "faq.Battery.questions.1.answer":
    "SuperCharge: 10% to 80% in 15 minutes, or 10% to 95% in 20 minutes.\nHome charging: roughly 2 to 10 hours, depending on the adapter and battery size.",
  "faq.Battery.questions.2.question": "What type of battery does Wedison use?",
  "faq.Battery.questions.2.answer":
    "Wedison uses a Lithium-ion (LFP) battery, the same chemistry family found in smartphones, laptops, and electric cars.\n\nThe resulting benefits:\nA. High energy density: substantial stored energy in a small, light pack.\nB. Heat tolerance: it operates efficiently at temperatures up to 45 degrees Celsius.\nC. Low self-discharge: it retains its charge even when the motorcycle is left unused for days.\nD. Long life: more than 5,000 charge cycles while keeping nearly all of its original capacity.\nE. Quick charging: 10% to 80% in 15 minutes at a SuperCharge station.",
  "faq.Battery.questions.3.question":
    "How many battery options does Wedison sell?",
  "faq.Battery.questions.3.answer":
    "Selected models come with 2 battery options, Regular and Extended.\nRange differs by model, from 80 km up to 160 km on a single charge.",
  "faq.Battery.questions.4.question": "Who makes the battery?",
  "faq.Battery.questions.4.answer": "Wedison develops its batteries in-house.",
  "faq.Battery.questions.5.question": "How long will the battery last?",
  "faq.Battery.questions.5.answer":
    "Under normal use, Wedison batteries are designed to last up to 12 years.",
  "faq.Battery.questions.6.question":
    "Can I use a third-party battery or charger?",
  "faq.Battery.questions.6.answer":
    "No. Wedison motorcycles use a CAN (Controller Area Network) link to manage charging and coordinate components, and third-party batteries do not speak the same protocol.",
  "faq.Battery.questions.7.question": "Can the battery be replaced?",
  "faq.Battery.questions.7.answer":
    "Yes. Wedison supplies genuine batteries and spare parts.",
  "faq.Battery.questions.8.question": "How do I keep the battery healthy?",
  "faq.Battery.questions.8.answer":
    "Try to charge before the level drops below 20%. That habit alone helps extend battery life.",
  "faq.Battery.questions.9.question": "How do I extend battery life?",
  "faq.Battery.questions.9.answer":
    "Avoid running the battery down to 0% or leaving it charging to 100%.\nKeeping it between 20% and 80% puts less strain on the cells.",
  "faq.Battery.questions.10.question": "What is the battery IP rating?",
  "faq.Battery.questions.10.answer":
    "Wedison batteries are rated IP67.\nThat means fully dustproof, and able to sit in 1 meter of water for 30 minutes without damage.",
  "faq.Battery.questions.11.question":
    "How often should I charge if I rarely ride?",
  "faq.Battery.questions.11.answer":
    "If the motorcycle is left unused for more than a week, charge it at least once a month.",
  "faq.Battery.questions.12.question":
    "What should be done if the motorcycle is left unused for an extended period?",
  "faq.Battery.questions.12.answer":
    "Switch off the MCB (circuit breaker), and keep charging the battery at least once a month to preserve its condition.",

  // Charging Questions
  "faq.Charging.questions.0.question": "Where can I charge my motorcycle?",
  "faq.Charging.questions.0.answer":
    "SuperCharge\nAt Wedison SuperCharge stations, which keep opening in more cities.\nRegular Charge\nAt home, using an ordinary wall socket.",
  "faq.Charging.questions.1.question": "How do I charge it?",
  "faq.Charging.questions.1.answer":
    "Every Wedison motorcycle has two charging ports, one for the home charger and one for SuperCharge.",
  "faq.Charging.questions.2.question":
    "Can I use a third-party charging adapter?",
  "faq.Charging.questions.2.answer":
    "We advise against it. Use genuine Wedison chargers and parts to keep the battery in good condition.",
  "faq.Charging.questions.3.question": "Can I charge at home?",
  "faq.Charging.questions.3.answer":
    "Yes. Every Wedison model has a port for the home charger.",
  "faq.Charging.questions.4.question": "Does fast charging damage the battery?",
  "faq.Charging.questions.4.answer":
    "No. Wedison batteries are designed for fast charging, and the current is regulated automatically to preserve cycle life.",
  "faq.Charging.questions.5.question": "Is fast charging dangerous?",
  "faq.Charging.questions.5.answer":
    "No. Wedison fast charging does not shorten battery life, and it carries no risk of explosion.",
  "faq.Charging.questions.6.question": "Is overcharging dangerous?",
  "faq.Charging.questions.6.answer":
    "Wedison batteries include a built-in management system.\nIf the battery temperature rises too high during charging, the system cuts the power automatically.",
  "faq.Charging.questions.7.question":
    "Why does charging slow down as the battery nears full?",
  "faq.Charging.questions.7.answer":
    "This is intentional. Charging proceeds rapidly to approximately 95%, then moves to a slower, controlled rate to protect the cells.\n\nYou return to the road quickly, and battery life is extended as a result.",
  "faq.Charging.questions.8.question":
    "How long does home charging take with a 600W charger?",
  "faq.Charging.questions.8.answer":
    "This depends on the model and battery capacity.\nCharging time from 0 to 100% with a 600W adapter:\nRefer to Regular Charge Data",
  "faq.Charging.questions.9.question":
    "How long does home charging take with a 1260W charger?",
  "faq.Charging.questions.9.answer":
    "This depends on the model and battery capacity.\nCharging time from 0 to 100% with a 1260W adapter:\nBees: 3.5 hours (unchanged, as Bees accepts only a 600W charger)\nRefer to Regular Charge Data",
  "faq.Charging.questions.10.question":
    "What is the correct sequence for charging at home?",
  "faq.Charging.questions.10.answer":
    "Connect the charger to the motorcycle first, then plug it into the socket.\nOnce charging is complete, disconnect from the socket first, then from the motorcycle.",
  "faq.Charging.questions.11.question": "Is charging at SuperCharge free?",
  "faq.Charging.questions.11.answer":
    "No. Charging at SuperCharge operates on a package system, purchased through the Wedison app.",

  // Performance Questions
  "faq.Performance.questions.0.question":
    "What is the speed of the motorcycle?",
  "faq.Performance.questions.0.answer":
    "Depending on the model, top speed ranges from 55 km/h to 95 km/h.",
  "faq.Performance.questions.1.question": "What is the motor power?",
  "faq.Performance.questions.1.answer":
    "Motor power varies by model, from 1.2 kW up to 5 kW.",
  "faq.Performance.questions.2.question": "What is the range?",
  "faq.Performance.questions.2.answer":
    "Depending on the model and battery selected, range extends from 80 km to 160 km.",
  "faq.Performance.questions.3.question":
    "Is it safe to ride in rain or through standing water?",
  "faq.Performance.questions.3.answer":
    "The motor, control unit, and battery are all rated IP67 and have passed water immersion testing.\nEven so, avoid deep floodwater and do not leave the motorcycle submerged.",
  "faq.Performance.questions.4.question": "What gradient can it climb?",
  "faq.Performance.questions.4.answer":
    "Climbing ability varies by model:\nBees and EdPower: up to 12%\nAthena and Victory: up to 15%",
  "faq.Performance.questions.5.question": "Does the battery degrade over time?",
  "faq.Performance.questions.5.answer":
    "Yes, as with any lithium-ion device. Capacity declines slightly with each charge and discharge cycle.\nThe rate depends on cycle count, battery age, and operating temperature.\n\nFor that reason, every Wedison battery carries a 3-year warranty.",

  // Safety Questions
  "faq.Safety.questions.0.question": "Is the battery safe?",
  "faq.Safety.questions.0.answer":
    "Wedison batteries include a management system that monitors temperature and charging current,\nguarding against overheating, overcharging, and fire risk.",
  "faq.Safety.questions.1.question": "What braking system is fitted?",
  "faq.Safety.questions.1.answer":
    "CBS (Combined Braking System), which distributes braking force between the front and rear wheels automatically when the brake lever is applied:\nAthena, Victory, and EdPower\n\nFront and rear disc brakes:\nBees",
  "faq.Safety.questions.2.question": "What type of motor is used?",
  "faq.Safety.questions.2.answer":
    "Every Wedison model uses a brushless DC motor (BLDC), recognized for its efficiency, torque, and long service life.\n\nOne type is fitted:\nDC Brushless Rear Hub Motor, with speeds up to 95 km/h (Bees, Athena, Victory, EdPower).",

  // Servicing Questions
  "faq.Servicing.questions.0.question": "Is complimentary servicing included?",
  "faq.Servicing.questions.0.answer":
    "Yes. Every Wedison motorcycle includes 3 complimentary service visits at a Wedison workshop or an authorized partner workshop.\nThese are scheduled by distance: 1,000 km, 5,000 km, and 10,000 km.",
  "faq.Servicing.questions.1.question":
    "At what mileage are the complimentary services scheduled?",
  "faq.Servicing.questions.1.answer": "At 1,000 km, 5,000 km, and 10,000 km.",
  "faq.Servicing.questions.2.question": "Where can the motorcycle be serviced?",
  "faq.Servicing.questions.2.answer":
    "At a Wedison workshop or the nearest authorized Wedison partner workshop.",
  "faq.Servicing.questions.3.question": "Are spare parts available?",
  "faq.Servicing.questions.3.answer":
    "Yes. Wedison stocks genuine parts for all of its models.",
  "faq.Servicing.questions.4.question": "Is the battery under warranty?",
  "faq.Servicing.questions.4.answer":
    "Yes, the battery carries a 3-year warranty.",
  "faq.Servicing.questions.5.question": "Is the motorcycle under warranty?",
  "faq.Servicing.questions.5.answer":
    "Yes, the motorcycle carries a 2-year warranty.",
  "faq.Servicing.questions.6.question":
    "What does it cost to repair the motor, dynamo, or other components?",
  "faq.Servicing.questions.6.answer":
    "Costs vary according to the component being replaced and the extent of the damage.\n\nContact your nearest authorized workshop for an estimate.",
  "faq.Servicing.questions.7.question":
    "How should a Wedison motorcycle be maintained?",
  "faq.Servicing.questions.7.answer":
    "Regular servicing and considered riding will extend the life of the motorcycle. Daily charging is not necessary:\n- Charge as required, and keep the battery between 20% and 80% where possible.\n- If the motorcycle is left unused, charge it at least once a month.\n- Charge at SuperCharge stations and service at authorized workshops to maintain battery condition.",
  "faq.Servicing.questions.8.question": "Can the motorcycle be modified?",
  "faq.Servicing.questions.8.answer":
    "The Wedison warranty covers the motorcycle only in its original configuration, design, and specification.\nDamage caused by misuse, tampering, negligence, or modification is not covered.",
  "faq.Servicing.questions.9.question": "What voids the warranty?",
  "faq.Servicing.questions.9.answer":
    "Damage caused by non-genuine spare parts, or by modifications made without Wedison approval.\n\nDamage arising from events beyond reasonable control is also excluded, for example earthquakes, typhoons, floods, chemical exposure, or corrosion.",
  "faq.Servicing.questions.10.question": "What are the limits of the warranty?",
  "faq.Servicing.questions.10.answer":
    "No component carries a lifetime warranty.\nParts replaced under warranty are covered only for the remainder of the original warranty period.\nFor parts purchased or replaced outside warranty service, the warranty begins from the date of purchase or replacement.",

  // Smart Features Questions
  "faq.SmartFeatures.questions.0.question":
    "Which smart features are available?",
  "faq.SmartFeatures.questions.0.answer":
    "Through the Wedison app, selected models can be switched on and off from your phone over Bluetooth.\nFurther features will follow in subsequent app updates.",

  // Tires Questions
  "faq.Tires.questions.0.question": "What size are the tires?",
  "faq.Tires.questions.0.answer":
    "Bees: Front: 90/90-10; Rear 90/90-10\nAthena: Front: 100/80-12; Rear 100/80-12\nVictory: Front: 90/90-14; Rear: 100/80-14\nEdPower: Front: 100/90-14; Rear: 120/70-14",

  // Ojol Page
  "ojol.hero.title": "Wedison With",
  "ojol.hero.titleHighlight": "Ride-Hailing",
  "ojol.hero.description":
    "Electric motorcycles for ride-hailing drivers. Running costs fall, and fuel queues are no longer part of the day.",
  "ojol.hero.startFrom": "Starting from",
  "ojol.hero.perDay": "/Day",
  "ojol.hero.dailyRental": "DAILY RENTAL",
  "ojol.hero.tagline": "#MadeEasier",
  "ojol.hero.tryFree": "Try It Free!",

  "ojol.benefits.title": "More Trips, Lower Costs",
  "ojol.benefits.description":
    "Fuel queues and rising petrol prices take a real toll on daily earnings. An electric motorcycle costs considerably less to run, requires less maintenance, and returns the time otherwise spent at the pump.",

  "ojol.campaign.heading": "Hot Campaign",
  "ojol.btn.register": "Register Now",
  "ojol.btn.detail": "See Details",

  "ojol.campaign.milik.title": "Rent-to-Own",
  "ojol.campaign.milik.tagline": "Ride While You Pay, Then Own It",
  "ojol.campaign.milik.description":
    "A 3.5-year (42-month) rental with an ownership option. Once the contract concludes, the motorcycle becomes yours.",
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
    "Savings are applied to insurance, servicing, spare parts, and BPKB (vehicle ownership document) costs. Any remaining balance is transferred to the rider at the end of the contract",
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
  "ojol.campaign.harian.tagline": "Pay Daily, Without Installments",
  "ojol.campaign.harian.description":
    "Daily rental on a 3-year contract. Suited to riders who want to begin earning without committing to installments.",
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
    "For a driver, downtime is costly. At SuperCharge it takes ",
  "ojol.supercharge.descriptionBold": "15 minutes",
  "ojol.supercharge.descriptionPart2":
    " to bring the battery from 10% to 80% before you return to the road. A single charge covers up to 160 km*, which means more hours available and more orders completed.",
  "ojol.supercharge.disclaimer":
    "*Range of 160 km applies to EdPower with the Extended battery",
  "ojol.supercharge.cta": "Learn More",

  "ojol.models.title": "Pick the Right Motorcycle for You",
  "ojol.models.subtitle":
    "Nimble for narrow alleys, or capable over long distances. Choose according to your area and how you ride.",
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
    "Daily rental from 50K, complimentary SuperCharge, and manageable installment options. Register now and our team will guide you through the process.",
  "ojol.cta.benefit.1": "Daily Rental from 50K",
  "ojol.cta.benefit.2": "Free SuperCharge",
  "ojol.cta.benefit.3": "Easy Installments",
  "ojol.cta.benefit.4": "Priority Service",
  "ojol.cta.button": "Contact Wedison Sales",
  "ojol.cta.trust": "Prompt response, no consultation fee",

  // Language
  language: "English",
  switchLanguage: "Bahasa Indonesia",
};
