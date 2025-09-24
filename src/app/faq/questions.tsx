import { useLanguage } from "../lib/language-context";

export default function GetQuestions() {
  const { t } = useLanguage();
  const questions = {
    Battery: {
      title: t("faq.category.Battery"),
      questions: [
        {
          question: t("faq.Battery.questions.0.question"),
          answer: t("faq.Battery.questions.0.answer"),
        },
        {
          question: t("faq.Battery.questions.1.question"),
          answer: t("faq.Battery.questions.1.answer"),
        },
        {
          question: t("faq.Battery.questions.2.question"),
          answer: t("faq.Battery.questions.2.answer"),
        },
        {
          question: t("faq.Battery.questions.3.question"),
          answer: t("faq.Battery.questions.3.answer"),
        },
        {
          question: t("faq.Battery.questions.4.question"),
          answer: t("faq.Battery.questions.4.answer"),
        },
        {
          question: t("faq.Battery.questions.5.question"),
          answer: t("faq.Battery.questions.5.answer"),
        },
        {
          question: t("faq.Battery.questions.6.question"),
          answer: t("faq.Battery.questions.6.answer"),
        },
        {
          question: t("faq.Battery.questions.7.question"),
          answer: t("faq.Battery.questions.7.answer"),
        },
        {
          question: t("faq.Battery.questions.8.question"),
          answer: t("faq.Battery.questions.8.answer"),
        },
        {
          question: t("faq.Battery.questions.9.question"),
          answer: t("faq.Battery.questions.9.answer"),
        },
        {
          question: t("faq.Battery.questions.10.question"),
          answer: t("faq.Battery.questions.10.answer"),
        },
        {
          question: t("faq.Battery.questions.11.question"),
          answer: t("faq.Battery.questions.11.answer"),
        },
        {
          question: t("faq.Battery.questions.12.question"),
          answer: t("faq.Battery.questions.12.answer"),
        },
      ],
    },
    Charging: {
      title: t("faq.category.Charging"),
      questions: [
        {
          question: t("faq.Charging.questions.0.question"),
          answer: t("faq.Charging.questions.0.answer"),
        },
        {
          question: t("faq.Charging.questions.1.question"),
          answer: t("faq.Charging.questions.1.answer"),
        },
        {
          question: t("faq.Charging.questions.2.question"),
          answer: t("faq.Charging.questions.2.answer"),
        },
        {
          question: t("faq.Charging.questions.3.question"),
          answer: t("faq.Charging.questions.3.answer"),
        },
        {
          question: t("faq.Charging.questions.4.question"),
          answer: t("faq.Charging.questions.4.answer"),
        },
        {
          question: t("faq.Charging.questions.5.question"),
          answer: t("faq.Charging.questions.5.answer"),
        },
        {
          question: t("faq.Charging.questions.6.question"),
          answer: t("faq.Charging.questions.6.answer"),
        },
        {
          question: t("faq.Charging.questions.7.question"),
          answer: t("faq.Charging.questions.7.answer"),
        },
        {
          question: t("faq.Charging.questions.8.question"),
          answer: t("faq.Charging.questions.8.answer"),
        },
        {
          question: t("faq.Charging.questions.9.question"),
          answer: t("faq.Charging.questions.9.answer"),
        },
        {
          question: t("faq.Charging.questions.10.question"),
          answer: t("faq.Charging.questions.10.answer"),
        },
        {
          question: t("faq.Charging.questions.11.question"),
          answer: t("faq.Charging.questions.11.answer"),
        },
      ],
    },
    Performance: {
      title: t("faq.category.Performance"),
      questions: [
        {
          question: t("faq.Performance.questions.0.question"),
          answer: t("faq.Performance.questions.0.answer"),
        },
        {
          question: t("faq.Performance.questions.1.question"),
          answer: t("faq.Performance.questions.1.answer"),
        },
        {
          question: t("faq.Performance.questions.2.question"),
          answer: t("faq.Performance.questions.2.answer"),
        },
        {
          question: t("faq.Performance.questions.3.question"),
          answer: t("faq.Performance.questions.3.answer"),
        },
        {
          question: t("faq.Performance.questions.4.question"),
          answer: t("faq.Performance.questions.4.answer"),
        },
        {
          question: t("faq.Performance.questions.5.question"),
          answer: t("faq.Performance.questions.5.answer"),
        },
      ],
    },
    Safety: {
      title: t("faq.category.Safety"),
      questions: [
        {
          question: t("faq.Safety.questions.0.question"),
          answer: t("faq.Safety.questions.0.answer"),
        },
        {
          question: t("faq.Safety.questions.1.question"),
          answer: t("faq.Safety.questions.1.answer"),
        },
        {
          question: t("faq.Safety.questions.2.question"),
          answer: t("faq.Safety.questions.2.answer"),
        },
      ],
    },
    Servicing: {
      title: t("faq.category.Servicing"),
      questions: [
        {
          question: t("faq.Servicing.questions.0.question"),
          answer: t("faq.Servicing.questions.0.answer"),
        },
        {
          question: t("faq.Servicing.questions.1.question"),
          answer: t("faq.Servicing.questions.1.answer"),
        },
        {
          question: t("faq.Servicing.questions.2.question"),
          answer: t("faq.Servicing.questions.2.answer"),
        },
        {
          question: t("faq.Servicing.questions.3.question"),
          answer: t("faq.Servicing.questions.3.answer"),
        },
        {
          question: t("faq.Servicing.questions.4.question"),
          answer: t("faq.Servicing.questions.4.answer"),
        },
        {
          question: t("faq.Servicing.questions.5.question"),
          answer: t("faq.Servicing.questions.5.answer"),
        },
        {
          question: t("faq.Servicing.questions.6.question"),
          answer: t("faq.Servicing.questions.6.answer"),
        },
        {
          question: t("faq.Servicing.questions.7.question"),
          answer: t("faq.Servicing.questions.7.answer"),
        },
        {
          question: t("faq.Servicing.questions.8.question"),
          answer: t("faq.Servicing.questions.8.answer"),
        },
        {
          question: t("faq.Servicing.questions.9.question"),
          answer: t("faq.Servicing.questions.9.answer"),
        },
        {
          question: t("faq.Servicing.questions.10.question"),
          answer: t("faq.Servicing.questions.10.answer"),
        },
      ],
    },
    SmartFeatures: {
      title: t("faq.category.SmartFeatures"),
      questions: [
        {
          question: t("faq.SmartFeatures.questions.0.question"),
          answer: t("faq.SmartFeatures.questions.0.answer"),
        },
      ],
    },
    Tires: {
      title: t("faq.category.Tires"),
      questions: [
        {
          question: t("faq.Tires.questions.0.question"),
          answer: t("faq.Tires.questions.0.answer"),
        },
      ],
    },
  };
  return questions;
}
// export const questions = {
//   Battery: {
//     title: "Battery",
//     questions: [
//       {
//         question: "What is the battery warranty?",
//         answer: "Wedison battery is covered by a 3 year warranty ",
//       },
//       {
//         question: "How long does it take to fully charge the battery?",
//         answer:
//           "Wedison Super Charge: 10% to 80% in 15 minutes/ 10% to 95% in 20 minutes\nWedison Regular Charge: Varies depending on the adapter and battery size, with a duration ranging from approximately 2 to 10 hours.",
//       },
//       {
//         question: "What type of battery do you use? ",
//         answer:
//           "Wedison EV uses Lithium-ion Battery (LFP), a type of rechargeable battery commonly used in devices like smartphones, laptops, and electric vehicles.\n\nThe characteristics of Lithium-ion Battery are as follow:\nA. High energy density: It can store a considerable amount of electrical energy in a smaller, lighter package.\nB. High temperature: It performs efficiently at high temperatures of up to 45 degrees celsius and can endure low temperatures without sustaining damage.\nC. Low self-discharge rate: The battery retains its energy effectively even when left unused for days or weeks.\nD. High no. of charge cycles: It enables numerous charge cycles of more than 5,000 while maintaining nearly all of their original capacity.\nE. Charges quickly: Wedison EV can be fully charged in 30 mins at one of the super fast charging stations.",
//       },
//       {
//         question: "How many type of battery do you sell? ",
//         answer:
//           "Wedison offers 2 battery variations for select models. \nTravelling at 50km/h, the basic and extended versions are capable of travelling up to 85 and 115 km respectively. ",
//       },
//       {
//         question: "Where is the battery from?",
//         answer: "Wedison's proprietary battery is developed internally.",
//       },
//       {
//         question: "How long can your battery last?",
//         answer:
//           "Under normal operating conditions, Wedison's proprietary battery is designed to last up to 12 years.",
//       },
//       {
//         question: "Can we use external/third party battery/charger?",
//         answer:
//           "No, electric motorcycles require a CAN (Controller Area Network) to communicate with other components of the EV for operation and charging. However, third-party batteries do not use the same CAN for communication.",
//       },
//       {
//         question: "Can the battery be replaced? ",
//         answer:
//           "Yes, Wedison supplies original spare parts and accessories like battery.",
//       },
//       {
//         question: "How can I keep the battery in good condition?",
//         answer:
//           "During daily use, please try to charge the battery in a timely manner before the level drops below 20% to help extend battery life.",
//       },
//       {
//         question: "How do I extend battery life?",
//         answer:
//           "Avoid fully discharging to 0% or charging to 100%. \nAim to keep the charge between 20% and 80% to reduce battery stress and maximize lifespan.",
//       },
//       {
//         question: "What is the battery Ingress protection (IP) rating?",
//         answer:
//           "Wedison batteries are IP67,\nThe battery is completely dustproof and can be immersed in water up to 1 meter deep for up to 30 minutes without damage.",
//       },
//       {
//         question: "How often should I charge the battery? Travelling?",
//         answer:
//           "If the vehicle is not used for an extended period (more than a week), please ensure it is charged at least once every month.",
//       },
//       {
//         question:
//           "What happens if I don\u2019t use the vehicle for an extended period?",
//         answer:
//           "Turn off the MCB (circuit breaker) and ensure the battery is charged at least once a month to maintain health.",
//       },
//     ],
//   },
//   Charging: {
//     title: "Charging",
//     questions: [
//       {
//         question: "Where can we charge our motorcycles?",
//         answer:
//           "Super Charge\nAt Wedison super charge stations, which will progressively be rolled out countrywide.\nRegular Charge \nAt home/places with standard wall socket ",
//       },
//       {
//         question: "How can we charge our motorcycles?",
//         answer:
//           "Wedison EV comes with regular and super charge ports which can be charged at home and designated charging stations.",
//       },
//       {
//         question: "Can I use third-party power adapter to charge the EV?",
//         answer:
//           "Use only Wedison issued parts and supplies for optimal battery health and performance.",
//       },
//       {
//         question: "Can we charge the motorcycles at home?",
//         answer: "Yes, Wedison EV has regular port for charging at home.",
//       },
//       {
//         question: "Does fast charging damange the battery? ",
//         answer:
//           "Wedison's batteries are engineered for fast charging and long cycle life without causing damage.",
//       },
//       {
//         question: "Is it fast charging dangerous?",
//         answer:
//           "Wedison's fast charging does not shorten battery life or pose any risk of explosion.",
//       },
//       {
//         question: "Is overcharging dangerous? ",
//         answer:
//           "Wedison battery is equipped with protection management system\nIf the battery becomes too hot due to overcharging, a built-in safety feature will automatically cut off the power to prevent damage or danger.",
//       },
//       {
//         question: "Why does charging slow down? ",
//         answer:
//           "Wedison\u2019s advanced lithium-ion battery technology features intelligent charging that balances speed and long-term performance. It charges rapidly up to 95% capacity, then shifts to a slower, controlled rate to protect and extend battery life.\n\nThis intelligent charging approach gets you back on the road faster while helping extend your battery\u2019s overall lifespan.",
//       },
//       {
//         question: "What is the duration for regular charging? (600W charger)",
//         answer:
//           "The charging time varies depending on model and battery capacity. \nCharging time with a 600w charging adapter from 0-100%:\nRefe to Regular Charge Data ",
//       },
//       {
//         question: "What is the duration for regular charging? (1260W charger)",
//         answer:
//           "The charging time varies depending on model and battery capacity. \nCharging time with a 1260w charging adapter from 0-100%:\nMini: 3.5 hr (No change, can only use a 600w charger)\nRefe to Regular Charge Data ",
//       },
//       {
//         question: "How do I perform regular charging?",
//         answer:
//           "First connect the charger to the vehicle\u2019s charging port, then plug it into the power source. \nAfter charging is complete, unplug the power source first, then disconnect the charger from the vehicle.",
//       },
//       {
//         question: "Is charging free?",
//         answer:
//           "No, electric charging is on a Pay as Per use basis, and charging price varies from location and charging station/operators.",
//       },
//     ],
//   },
//   Performance: {
//     title: "Performance",
//     questions: [
//       {
//         question: "What is the speed of the motorcycle?",
//         answer:
//           "Depending on the model, the top speed ranges from 60 km/hr to 95 km/hr",
//       },
//       {
//         question: "What is the motor power / BLDC of the motorcycle? ",
//         answer:
//           "The motor power varies between models, ranging from 1200KW to 5000KW",
//       },
//       {
//         question: "What is the range of the motorcycle?",
//         answer:
//           "The range varies between model and battery, ranging from 70 km to 140 km",
//       },
//       {
//         question: "Is Wedison EV safe to be used in rain and flood?",
//         answer:
//           "Wedison's motor, control unit, and battery are IP67, which have been tested to be waterproof.\nWhile they have undergone a water immersion test at 1 meter, extended immersion is not recommended.",
//       },
//       {
//         question: "Can the motorcycles travel uphill?",
//         answer:
//           "Yes, it can go uphill and the climbing ability depends on the model:\nMini, EdPower, & EdPro: 12%\nAthena and Victory: 15%",
//       },
//       {
//         question: "Does the battery degrade overtime?",
//         answer:
//           "Like any device powered by a lithium-ion battery, the battery's ability to hold a charge gradually decreases with each charge and discharge cycle. \nThe wear and tear of the battery is influenced by factors such as charge cycles, age of battery, and temperature. \n\nEvery Wedison EV is equipped with a proprietary Lithium Ion battery, which is backed by a 3 year warranty. ",
//       },
//     ],
//   },
//   Safety: {
//     title: "Safety",
//     questions: [
//       {
//         question: "Is your battery safe?",
//         answer:
//           "Wedison\u2019s proprietary batteries feature an advanced battery management system\nwith safety measures to prevent overheating, overcharging, and the risk of fire",
//       },
//       {
//         question: "What brakes do you use?",
//         answer:
//           "CBS (Combined Braking System), an efficient braking system that automatically distributes braking force between the front and rear brakes when the rider applies the brakes:\nAthena, Victory, & EdPower\n\nFront and rear disc brakes, providing enhanced control, safety, and braking performance:\nMini motorcycle",
//       },
//       {
//         question: "What motor do you use?",
//         answer:
//           "Wedison motorcycles are equipped with a brushless DC motor (BLDC), known for its performance, efficiency, torque, and long lifespan.\n\nThere are 1 version available: \n1. DC Brushless Rear Hub Motor: motor speed up to 85 km/hr. (Mini, Athena, Victory, EdPower)",
//       },
//     ],
//   },
//   "Servicing: Warranty, Repair, and Maintenance": {
//     title: "Servicing: \nWarranty, \nRepair,\nand Maintenance",
//     questions: [
//       {
//         question: "Does Wedison EV come with free servicing?",
//         answer:
//           "Yes, every Wedison motorcycle comes with 3 complimentary servicing sessions at Wedison or authorized service centers. \nMileage-based warranty inspections are scheduled at 1,000 km, 5,000 km, and 10,000 km intervals.",
//       },
//       {
//         question:
//           "What mileage is covered under the complimentary servicing schedule?",
//         answer:
//           "The mileage warranty includes checks at 1,000 km, 5,000 km, and 10,000 km.",
//       },
//       {
//         question: "Where can I service the EV motorcycles?",
//         answer:
//           "At Wedison and/or authorized service centers with the likes of Honda/Yamaha Service Center. ",
//       },
//       {
//         question: "Does Wedison provide spare parts for the motorcycle?",
//         answer: "Yes, Wedison provides ready parts for the motorcycle. ",
//       },
//       {
//         question: "Does the battery come with a warranty?",
//         answer: "Yes, the proprietary battery comes with a 3 year warranty. ",
//       },
//       {
//         question: "Does Wedison motorcycles come with a warranty? ",
//         answer: "Yes, the motorcycle comes with a 2 year warranty.",
//       },
//       {
//         question:
//           "How much does it cost to repair the motorcycle, dynamo, and etc? ",
//         answer:
//           "Electric motorcycle repair costs vary on the type and brand of parts, and extent of damage or repair required. \n\nUsers have to check with the respective workshop on pricing.",
//       },
//       {
//         question: "How does one maintain Wedison motorcycle?",
//         answer:
//           "Proper care and handling, in conjunction with proper and regular maintenance can extend the lifespan of the motorcycle. \nYou don't need to charge your EV every day:\n- Instead, charge it as needed, keeping the battery between 20% and 80% for optimal health and range.\n- Charge it at least once a month.\n- For optimal performance and battery quality, Wedison EVs should be charged and serviced at designated super fast charge stations and service centers respectively. ",
//       },
//       {
//         question: "\u00a0Is modification allowed to the EV?",
//         answer:
//           "The product covered under Wedison\u2019s warranty includes only its original configuration, design, or specifications. \nDamages, faults, failures, or imperfections caused by abuse, tampering, illegal use, negligence, or prolonged operation are not covered.",
//       },
//       {
//         question: "What conditions will void the warranty?",
//         answer:
//           "Damange resulting from use of non-origanl Wedison spar parts or unauthorized modifications. \n\nDamages resulting from unavoidable or unforeseen events\u2014such as smoke, substance exposure, earthquakes, typhoons, floods, chemical corrosion, promotional or advertising activities, complimentary items, noise-related issues, or contact with artificial soft or hard materials\u2014are not covered.",
//       },
//       {
//         question: "what are the limitations of the warranty",
//         answer:
//           "No components are covered under a lifetime warranty.\nReplacement parts provided under warranty are only covered for the remainder of the original warranty period.\nFor parts purchased or replaced outside of warranty service, the warranty period begins from the date of purchase or replacement.",
//       },
//     ],
//   },
//   "Smart Features/\n Bluetooth/\n App": {
//     title: "Smart Features/\n Bluetooth/\n App",
//     questions: [
//       {
//         question: "What are the smart features available?",
//         answer:
//           "Wedison Smart Phone App: for select models, it can be used to power the motorcycle on and off via an app using bluetooth connection.\nAdditionally, other features will be rolled out on the app to provide more data.",
//       },
//     ],
//   },
//   Tires: {
//     title: "Tires",
//     questions: [
//       {
//         question: "What is the tire dimension?",
//         answer:
//           "Mini: Front: 90/90-10; Rear 90/90-10\nAthena: Front: 100/80-12; Rear 100/80-12\nVictory: Front: 90/90-14; Rear: 100/80-14\nEdPower: Front: 100/90-14; Rear: 120/70-14",
//       },
//     ],
//   },
// };
