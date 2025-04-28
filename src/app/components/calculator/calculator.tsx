"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Slider } from "@/app/components/ui/slider";
import { Card } from "@/app/components/ui/card";
import { Switch } from "@/app/components/ui/switch";
import { Label } from "@/app/components/ui/label";
import {
  Battery,
  BatteryCharging,
  Bike,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import Image from "next/image";
// import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/lib/language-context";

export default function KalkulatorPenghematan() {
  const { t } = useLanguage();
  const [jarak, setJarak] = useState(10);
  const [duaBaterai, setDuaBaterai] = useState(false);
  const dataBaterai = {
    1: {
      10: {
        Wedison: {
          listrik: 14357,
          perawatan: 15000,
          bahan_bakar: 0,
          total: 29357,
        },
        matic110: {
          listrik: 0,
          perawatan: 76000,
          bahan_bakar: 70669,
          total: 146669,
        },
        matic125: {
          listrik: 0,
          perawatan: 79000,
          bahan_bakar: 74034,
          total: 153034,
        },
        matic150: {
          listrik: 0,
          perawatan: 115000,
          bahan_bakar: 81395,
          total: 196395,
        },
        penghematan: {
          bulanan: {
            matic110: 117311,
            matic125: 123677,
            matic150: 167038,
          },
          tahunan: {
            matic110: 1383743,
            matic125: 1424125,
            matic150: 1512457,
          },
        },
      },
      20: {
        Wedison: {
          listrik: 28715,
          perawatan: 15000,
          bahan_bakar: 0,
          total: 43715,
        },
        matic110: {
          listrik: 0,
          perawatan: 76000,
          bahan_bakar: 141339,
          total: 217339,
        },
        matic125: {
          listrik: 0,
          perawatan: 79000,
          bahan_bakar: 148069,
          total: 227069,
        },
        matic150: {
          listrik: 0,
          perawatan: 115000,
          bahan_bakar: 162791,
          total: 277791,
        },
        penghematan: {
          bulanan: {
            matic110: 173623,
            matic125: 183354,
            matic150: 234076,
          },
          tahunan: {
            matic110: 2059486,
            matic125: 2140251,
            matic150: 2316915,
          },
        },
      },
      30: {
        Wedison: {
          listrik: 43072,
          perawatan: 15000,
          bahan_bakar: 0,
          total: 58072,
        },
        matic110: {
          listrik: 0,
          perawatan: 76000,
          bahan_bakar: 212008,
          total: 288008,
        },
        matic125: {
          listrik: 0,
          perawatan: 79000,
          bahan_bakar: 222104,
          total: 301104,
        },
        matic150: {
          listrik: 0,
          perawatan: 115000,
          bahan_bakar: 244187,
          total: 359187,
        },
        penghematan: {
          bulanan: {
            matic110: 229935,
            matic125: 243031,
            matic150: 301114,
          },
          tahunan: {
            matic110: 2735229,
            matic125: 2858377,
            matic150: 3121373,
          },
        },
      },
      40: {
        Wedison: {
          listrik: 57430,
          perawatan: 15000,
          bahan_bakar: 0,
          total: 72430,
        },
        matic110: {
          listrik: 0,
          perawatan: 76000,
          bahan_bakar: 282678,
          total: 358678,
        },
        matic125: {
          listrik: 0,
          perawatan: 79000,
          bahan_bakar: 296139,
          total: 375139,
        },
        matic150: {
          listrik: 0,
          perawatan: 115000,
          bahan_bakar: 325583,
          total: 440583,
        },
        penghematan: {
          bulanan: {
            matic110: 286247,
            matic125: 302708,
            matic150: 368152,
          },
          tahunan: {
            matic110: 3410972,
            matic125: 3572503,
            matic150: 3925831,
          },
        },
      },
      50: {
        Wedison: {
          listrik: 71788,
          perawatan: 15000,
          bahan_bakar: 0,
          total: 86788,
        },
        matic110: {
          listrik: 0,
          perawatan: 76000,
          bahan_bakar: 353347,
          total: 429347,
        },
        matic125: {
          listrik: 0,
          perawatan: 79000,
          bahan_bakar: 370173,
          total: 449173,
        },
        matic150: {
          listrik: 0,
          perawatan: 115000,
          bahan_bakar: 406978,
          total: 521978,
        },
        penghematan: {
          bulanan: {
            matic110: 342559,
            matic125: 362385,
            matic150: 435190,
          },
          tahunan: {
            matic110: 4086716,
            matic125: 4288629,
            matic150: 4730289,
          },
        },
      },
      60: {
        Wedison: {
          listrik: 86145,
          perawatan: 15000,
          bahan_bakar: 0,
          total: 101145,
        },
        matic110: {
          listrik: 0,
          perawatan: 76000,
          bahan_bakar: 424017,
          total: 500017,
        },
        matic125: {
          listrik: 0,
          perawatan: 79000,
          bahan_bakar: 444208,
          total: 523208,
        },
        matic150: {
          listrik: 0,
          perawatan: 115000,
          bahan_bakar: 488374,
          total: 603374,
        },
        penghematan: {
          bulanan: {
            matic110: 398871,
            matic125: 422062,
            matic150: 502228,
          },
          tahunan: {
            matic110: 4762459,
            matic125: 5004755,
            matic150: 5534747,
          },
        },
      },
      70: {
        Wedison: {
          listrik: 100503,
          perawatan: 15000,
          bahan_bakar: 0,
          total: 115503,
        },
        matic110: {
          listrik: 0,
          perawatan: 76000,
          bahan_bakar: 494686,
          total: 570686,
        },
        matic125: {
          listrik: 0,
          perawatan: 79000,
          bahan_bakar: 518243,
          total: 597243,
        },
        matic150: {
          listrik: 0,
          perawatan: 115000,
          bahan_bakar: 569770,
          total: 684770,
        },
        penghematan: {
          bulanan: {
            matic110: 455183,
            matic125: 481740,
            matic150: 569267,
          },
          tahunan: {
            matic110: 5438202,
            matic125: 5720880,
            matic150: 6339205,
          },
        },
      },
      80: {
        Wedison: {
          listrik: 114861,
          perawatan: 15000,
          bahan_bakar: 0,
          total: 129861,
        },
        matic110: {
          listrik: 0,
          perawatan: 76000,
          bahan_bakar: 565356,
          total: 641356,
        },
        matic125: {
          listrik: 0,
          perawatan: 79000,
          bahan_bakar: 592278,
          total: 671278,
        },
        matic150: {
          listrik: 0,
          perawatan: 115000,
          bahan_bakar: 651166,
          total: 766166,
        },
        penghematan: {
          bulanan: {
            matic110: 511495,
            matic125: 541417,
            matic150: 636305,
          },
          tahunan: {
            matic110: 6113945,
            matic125: 6437006,
            matic150: 7143663,
          },
        },
      },
      90: {
        Wedison: {
          listrik: 129218,
          perawatan: 15000,
          bahan_bakar: 0,
          total: 144218,
        },
        matic110: {
          listrik: 0,
          perawatan: 76000,
          bahan_bakar: 636026,
          total: 712026,
        },
        matic125: {
          listrik: 0,
          perawatan: 79000,
          bahan_bakar: 666313,
          total: 745313,
        },
        matic150: {
          listrik: 0,
          perawatan: 115000,
          bahan_bakar: 732562,
          total: 847562,
        },
        penghematan: {
          bulanan: {
            matic110: 567807,
            matic125: 601094,
            matic150: 703343,
          },
          tahunan: {
            matic110: 6789689,
            matic125: 7153132,
            matic150: 7948121,
          },
        },
      },
      100: {
        Wedison: {
          listrik: 143576,
          perawatan: 15000,
          bahan_bakar: 0,
          total: 158576,
        },
        matic110: {
          listrik: 0,
          perawatan: 76000,
          bahan_bakar: 706695,
          total: 782695,
        },
        matic125: {
          listrik: 0,
          perawatan: 79000,
          bahan_bakar: 740347,
          total: 819347,
        },
        matic150: {
          listrik: 0,
          perawatan: 115000,
          bahan_bakar: 813957,
          total: 928957,
        },
        penghematan: {
          bulanan: {
            matic110: 624119,
            matic125: 660771,
            matic150: 770381,
          },
          tahunan: {
            matic110: 7489432,
            matic125: 7929258,
            matic150: 8244579,
          },
        },
      },
    },
    2: {
      10: {
        Wedison: {
          listrik: 13705,
          perawatan: 15000,
          bahan_bakar: 0,
          total: 28705,
        },
        matic110: {
          listrik: 0,
          perawatan: 76000,
          bahan_bakar: 70669,
          total: 146669,
        },
        matic125: {
          listrik: 0,
          perawatan: 79000,
          bahan_bakar: 74034,
          total: 153034,
        },
        matic150: {
          listrik: 0,
          perawatan: 115000,
          bahan_bakar: 81395,
          total: 196395,
        },
        penghematan: {
          bulanan: {
            matic110: 117964,
            matic125: 124329,
            matic150: 167690,
          },
          tahunan: {
            matic110: 1391574,
            matic125: 1431957,
            matic150: 1520289,
          },
        },
      },
      20: {
        Wedison: {
          listrik: 27410,
          perawatan: 15000,
          bahan_bakar: 0,
          total: 42410,
        },
        matic110: {
          listrik: 0,
          perawatan: 76000,
          bahan_bakar: 141339,
          total: 217339,
        },
        matic125: {
          listrik: 0,
          perawatan: 79000,
          bahan_bakar: 148069,
          total: 227069,
        },
        matic150: {
          listrik: 0,
          perawatan: 115000,
          bahan_bakar: 162791,
          total: 277791,
        },
        penghematan: {
          bulanan: {
            matic110: 174929,
            matic125: 184659,
            matic150: 235381,
          },
          tahunan: {
            matic110: 2075149,
            matic125: 2155914,
            matic150: 2332579,
          },
        },
      },
      30: {
        Wedison: {
          listrik: 41115,
          perawatan: 15000,
          bahan_bakar: 0,
          total: 56115,
        },
        matic110: {
          listrik: 0,
          perawatan: 76000,
          bahan_bakar: 212008,
          total: 288008,
        },
        matic125: {
          listrik: 0,
          perawatan: 79000,
          bahan_bakar: 222104,
          total: 301104,
        },
        matic150: {
          listrik: 0,
          perawatan: 115000,
          bahan_bakar: 244187,
          total: 359187,
        },
        penghematan: {
          bulanan: {
            matic110: 231893,
            matic125: 244989,
            matic150: 303072,
          },
          tahunan: {
            matic110: 2758723,
            matic125: 2879871,
            matic150: 3144868,
          },
        },
      },
      40: {
        Wedison: {
          listrik: 54820,
          perawatan: 15000,
          bahan_bakar: 0,
          total: 69820,
        },
        matic110: {
          listrik: 0,
          perawatan: 76000,
          bahan_bakar: 282678,
          total: 358678,
        },
        matic125: {
          listrik: 0,
          perawatan: 79000,
          bahan_bakar: 296139,
          total: 375139,
        },
        matic150: {
          listrik: 0,
          perawatan: 115000,
          bahan_bakar: 325583,
          total: 440583,
        },
        penghematan: {
          bulanan: {
            matic110: 288858,
            matic125: 305319,
            matic150: 370763,
          },
          tahunan: {
            matic110: 3442298,
            matic125: 3603829,
            matic150: 3957158,
          },
        },
      },
      50: {
        Wedison: {
          listrik: 68525,
          perawatan: 15000,
          bahan_bakar: 0,
          total: 83525,
        },
        matic110: {
          listrik: 0,
          perawatan: 76000,
          bahan_bakar: 353347,
          total: 429347,
        },
        matic125: {
          listrik: 0,
          perawatan: 79000,
          bahan_bakar: 370173,
          total: 449173,
        },
        matic150: {
          listrik: 0,
          perawatan: 115000,
          bahan_bakar: 406978,
          total: 521978,
        },
        penghematan: {
          bulanan: {
            matic110: 345822,
            matic125: 365648,
            matic150: 438453,
          },
          tahunan: {
            matic110: 4125873,
            matic125: 4327786,
            matic150: 4769447,
          },
        },
      },
      60: {
        Wedison: {
          listrik: 82230,
          perawatan: 15000,
          bahan_bakar: 0,
          total: 97230,
        },
        matic110: {
          listrik: 0,
          perawatan: 76000,
          bahan_bakar: 424017,
          total: 500017,
        },
        matic125: {
          listrik: 0,
          perawatan: 79000,
          bahan_bakar: 444208,
          total: 523208,
        },
        matic150: {
          listrik: 0,
          perawatan: 115000,
          bahan_bakar: 488374,
          total: 603374,
        },
        penghematan: {
          bulanan: {
            matic110: 402787,
            matic125: 425978,
            matic150: 506144,
          },
          tahunan: {
            matic110: 4809447,
            matic125: 5051743,
            matic150: 5581736,
          },
        },
      },
      70: {
        Wedison: {
          listrik: 95935,
          perawatan: 15000,
          bahan_bakar: 0,
          total: 110935,
        },
        matic110: {
          listrik: 0,
          perawatan: 76000,
          bahan_bakar: 494686,
          total: 570686,
        },
        matic125: {
          listrik: 0,
          perawatan: 79000,
          bahan_bakar: 518243,
          total: 597243,
        },
        matic150: {
          listrik: 0,
          perawatan: 115000,
          bahan_bakar: 569770,
          total: 684770,
        },
        penghematan: {
          bulanan: {
            matic110: 459751,
            matic125: 486308,
            matic150: 573835,
          },
          tahunan: {
            matic110: 5493022,
            matic125: 5775700,
            matic150: 6394026,
          },
        },
      },
      80: {
        Wedison: {
          listrik: 109640,
          perawatan: 15000,
          bahan_bakar: 0,
          total: 124640,
        },
        matic110: {
          listrik: 0,
          perawatan: 76000,
          bahan_bakar: 565356,
          total: 641356,
        },
        matic125: {
          listrik: 0,
          perawatan: 79000,
          bahan_bakar: 592278,
          total: 671278,
        },
        matic150: {
          listrik: 0,
          perawatan: 115000,
          bahan_bakar: 651166,
          total: 766166,
        },
        penghematan: {
          bulanan: {
            matic110: 516716,
            matic125: 546638,
            matic150: 641526,
          },
          tahunan: {
            matic110: 6176597,
            matic125: 6499658,
            matic150: 7206315,
          },
        },
      },
      90: {
        Wedison: {
          listrik: 123345,
          perawatan: 15000,
          bahan_bakar: 0,
          total: 138345,
        },
        matic110: {
          listrik: 0,
          perawatan: 76000,
          bahan_bakar: 636026,
          total: 712026,
        },
        matic125: {
          listrik: 0,
          perawatan: 79000,
          bahan_bakar: 666313,
          total: 745313,
        },
        matic150: {
          listrik: 0,
          perawatan: 115000,
          bahan_bakar: 732562,
          total: 847562,
        },
        penghematan: {
          bulanan: {
            matic110: 573681,
            matic125: 606967,
            matic150: 709217,
          },
          tahunan: {
            matic110: 6860171,
            matic125: 7223615,
            matic150: 8018605,
          },
        },
      },
      100: {
        Wedison: {
          listrik: 137050,
          perawatan: 15000,
          bahan_bakar: 0,
          total: 152050,
        },
        matic110: {
          listrik: 0,
          perawatan: 76000,
          bahan_bakar: 706695,
          total: 782695,
        },
        matic125: {
          listrik: 0,
          perawatan: 79000,
          bahan_bakar: 740347,
          total: 819347,
        },
        matic150: {
          listrik: 0,
          perawatan: 115000,
          bahan_bakar: 813957,
          total: 928957,
        },
        penghematan: {
          bulanan: {
            matic110: 630645,
            matic125: 667297,
            matic150: 776907,
          },
          tahunan: {
            matic110: 7543746,
            matic125: 7947572,
            matic150: 8830894,
          },
        },
      },
      110: {
        Wedison: {
          listrik: 150755,
          perawatan: 15000,
          bahan_bakar: 0,
          total: 165755,
        },
        matic110: {
          listrik: 0,
          perawatan: 76000,
          bahan_bakar: 777365,
          total: 853365,
        },
        matic125: {
          listrik: 0,
          perawatan: 79000,
          bahan_bakar: 814382,
          total: 893382,
        },
        matic150: {
          listrik: 0,
          perawatan: 115000,
          bahan_bakar: 895353,
          total: 1010353,
        },
        penghematan: {
          bulanan: {
            matic110: 687610,
            matic125: 727627,
            matic150: 844598,
          },
          tahunan: {
            matic110: 8227321,
            matic125: 8671529,
            matic150: 9643183,
          },
        },
      },
      120: {
        Wedison: {
          listrik: 164460,
          perawatan: 15000,
          bahan_bakar: 0,
          total: 179460,
        },
        matic110: {
          listrik: 0,
          perawatan: 76000,
          bahan_bakar: 848034,
          total: 924034,
        },
        matic125: {
          listrik: 0,
          perawatan: 79000,
          bahan_bakar: 888417,
          total: 967417,
        },
        matic150: {
          listrik: 0,
          perawatan: 115000,
          bahan_bakar: 976749,
          total: 1091749,
        },
        penghematan: {
          bulanan: {
            matic110: 744574,
            matic125: 787957,
            matic150: 912289,
          },
          tahunan: {
            matic110: 8910895,
            matic125: 9395487,
            matic150: 10455473,
          },
        },
      },
    },
  };

  // Mendapatkan jarak terdekat dari data kita
  const getJarakTerdekat = useCallback((value: number) => {
    const jarak = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];
    return jarak.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  }, []);

  const [jarakTerdekat, setJarakTerdekat] = useState(10);
  const [dataSaatIni, setDataSaatIni] = useState(dataBaterai?.[1]?.[20]);

  useEffect(() => {
    const newJarakTerdekat = getJarakTerdekat(jarak);
    setJarakTerdekat(newJarakTerdekat);
    const tipeBaterai = duaBaterai ? 2 : 1;

    if (tipeBaterai === 1 && getJarakTerdekat(jarak) > 100) {
      setJarak(100);
    } else {
      setDataSaatIni(
        dataBaterai[tipeBaterai][
          newJarakTerdekat as keyof (typeof dataBaterai)[typeof tipeBaterai]
        ]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jarak, duaBaterai, getJarakTerdekat]);

  // Format angka dengan titik sebagai pemisah ribuan
  const formatAngka = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handlePerubahanSlider = (value: number[]) => {
    setJarak(value[0]);
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const totalCards = 4; // Jumlah total card yang bisa di-scroll

  const scrollToCard = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollTo({
        left: cardWidth * index,
        behavior: "smooth",
      });
      setActiveCard(index);
    }
  };

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const scrollPosition = scrollContainerRef.current.scrollLeft;
      const cardWidth = scrollContainerRef.current.offsetWidth;
      const newActiveCard = Math.round(scrollPosition / cardWidth);
      setActiveCard(newActiveCard);
    }
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return (
    <div className=" bg-gray-50 w-full">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8"> */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 lg:mb-10">
          {/* <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 lg:mb-0">
            Kalkulator Penghematan
          </h1> */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-16">
              <div className="inline-block px-4 py-1 mb-4 border border-teal-200 rounded-full bg-teal-50 text-teal-600">
                <span className="text-sm font-medium">
                  {t("calculator.page.tag")}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                {t("calculator.page.title")}
                <span className="bg-gradient-to-r from-teal-500 to-teal-400 bg-clip-text text-transparent relative">
                  {t("calculator.page.titleHighlight")}
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400"></span>
                </span>
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                {t("calculator.page.description")}
              </p>
            </div>
          </div>

          {/* batas */}
        </div>
        <div className=" flex items-center justify-end pb-8 space-x-2">
          <Label
            htmlFor="mode-baterai"
            className={duaBaterai ? "text-gray-500" : "font-medium"}
          >
            1 {t("calculator.page.battery")}
          </Label>
          <Switch
            id="mode-baterai"
            checked={duaBaterai}
            onCheckedChange={setDuaBaterai}
            className="data-[state=checked]:bg-[var(--primary)]"
          />
          <Label
            htmlFor="mode-baterai"
            className={duaBaterai ? "font-medium" : "text-gray-500"}
          >
            2 {t("calculator.page.battery")}
          </Label>
        </div>

        {/* Container untuk card yang bisa di-scroll pada mobile dan tablet */}
        <div className="lg:hidden">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {t("calculator.page.monthlyTitle")}{" "}
          </h2>

          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {(["Wedison", "matic110", "matic125", "matic150"] as const).map(
                (vehicle) => (
                  <div
                    key={vehicle}
                    className="flex-none w-[calc(100%-2rem)] snap-center mx-4 first:ml-0 last:mr-0"
                  >
                    <Card
                      className={cn(
                        "p-6",
                        // vehicle === "Wedison" ? "bg-[#05AB6D]/10" : "bg-white"
                        vehicle === "Wedison" ? "bg-teal-200" : "bg-white"
                      )}
                    >
                      <h3
                        className={cn(
                          "font-bold text-xl",
                          vehicle === "Wedison"
                            ? // ? "text-[#05AB6D]"
                              "text-teal-600"
                            : "text-gray-800 mb-7"
                        )}
                      >
                        {vehicle === "Wedison" ? (
                          <Image
                            src="/wedison-logo-typo.png"
                            alt="Wedison"
                            width={100}
                            height={100}
                          />
                        ) : (
                          `Matic ${vehicle.slice(-3)}cc`
                        )}
                      </h3>
                      <div className="space-y-6">
                        <div>
                          <p className="text-gray-600 mb-1">
                            {t("calculator.page.monthlyElectricityCost")}
                          </p>
                          <p className="text-2xl font-semibold">
                            {formatAngka(dataSaatIni[vehicle].listrik)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">
                            {t("calculator.page.monthlyMaintenanceCost")}*{" "}
                          </p>
                          <p className="text-2xl font-semibold">
                            {formatAngka(dataSaatIni[vehicle].perawatan)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">
                            {t("calculator.page.monthlyFuelCost")}**
                          </p>
                          <p className="text-2xl font-semibold">
                            {formatAngka(dataSaatIni[vehicle].bahan_bakar)}
                          </p>
                        </div>
                        <div className="pt-4 border-t">
                          <p className="text-gray-600 mb-1">
                            {t("calculator.page.monthlyTotalExpenses")}
                          </p>
                          <p className="text-2xl font-bold">
                            Rp {formatAngka(dataSaatIni[vehicle].total)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                )
              )}
            </div>

            {/* Tombol navigasi */}
            <button
              onClick={() => scrollToCard(activeCard - 1)}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg",
                activeCard === 0 ? "hidden" : "block"
              )}
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button
              onClick={() => scrollToCard(activeCard + 1)}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg",
                activeCard === totalCards - 1 ? "hidden" : "block"
              )}
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>

            {/* Indikator scroll */}
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalCards }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToCard(index)}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all",
                    activeCard === index ? "bg-teal-500 w-4" : "bg-gray-300"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Bagian penghematan untuk mobile */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {t("calculator.page.savingTitle")}{" "}
            </h2>
            <div className="space-y-4">
              {(["matic110", "matic125", "matic150"] as const).map(
                (matic, index) => (
                  <div key={matic}>
                    <p className="text-gray-600 mb-2">
                      {index === 0
                        ? "vs Matic 110cc"
                        : index === 1
                        ? "vs Matic 125cc"
                        : "vs Matic 150cc"}
                    </p>
                    <div className="space-y-2">
                      <div className="bg-teal-500 text-white rounded-lg py-3 px-4 md:py-4 md:px-6 text-center">
                        <p className="text-sm md:text-lg font-semibold">
                          {t("calculator.page.savingMonthlySavings")}: Rp{" "}
                          {formatAngka(dataSaatIni.penghematan.bulanan[matic])}
                        </p>
                      </div>
                      <div className="bg-teal-500 text-white rounded-lg py-3 px-4 md:py-4 md:px-6 text-center">
                        <p className="text-sm md:text-lg font-semibold">
                          {t("calculator.page.savingAnnualSavings")}: Rp{" "}
                          {formatAngka(dataSaatIni.penghematan.tahunan[matic])}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Tampilan desktop */}
        <div className="hidden lg:block">
          {/* Bagian pengeluaran bulanan */}
          <Card className="mb-6 sm:mb-10 p-4 sm:p-6 bg-white shadow-lg rounded-xl overflow-x-auto">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">
              {t("calculator.page.monthlyTitle")}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 min-w-[600px]">
              {/* Label kolom */}
              <div className="col-span-1">
                <div className="h-14 flex items-center">
                  <h3 className="font-semibold text-gray-800">
                    {t("calculator.page.monthlyCostType")}
                  </h3>
                </div>
                <div className="h-12 flex items-center">
                  <p className="text-gray-600 flex items-center text-sm sm:text-base">
                    <BatteryCharging className="mr-2" size={16} />
                    {t("calculator.page.monthlyElectricityCost")}
                  </p>
                </div>
                <div className="h-12 flex items-center">
                  <p className="text-gray-600 flex items-center text-sm sm:text-base">
                    <Bike className="mr-2 " size={16} />
                    {t("calculator.page.monthlyMaintenanceCost")}
                  </p>
                </div>
                <div className="h-12 flex items-center">
                  <p className="text-gray-600 flex items-center text-sm sm:text-base">
                    <DollarSign className="mr-2 " size={16} />
                    {t("calculator.page.monthlyFuelCost")}
                  </p>
                </div>
                <div className="h-12 flex items-center border-t border-gray-200 mt-2 pt-2">
                  <p className="font-medium text-gray-800 flex items-center text-sm sm:text-base">
                    <Battery className="mr-2 " size={16} />
                    {t("calculator.page.monthlyTotalExpenses")}
                  </p>
                </div>
              </div>

              {/* Wedison */}
              {/* <div className="col-span-1 bg-[#05AB6D]/10 rounded-lg px-2 sm:px-4"> */}
              <div className="col-span-1 bg-[var(--primary-light)]/20 rounded-lg px-2 sm:px-4">
                <div className="h-14 flex items-center">
                  {/* <h3 className="font-bold text-[#05AB6D] text-sm sm:text-base">
                    Wedison
                  </h3> */}
                  <Image
                    src="/wedison-logo-typo.png"
                    alt="Wedison"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="h-12 flex items-center border-b border-gray-200">
                  <p className="text-sm sm:text-base">
                    Rp {formatAngka(dataSaatIni.Wedison.listrik)}
                  </p>
                </div>
                <div className="h-12 flex items-center border-b border-gray-200">
                  <p className="text-sm sm:text-base">
                    Rp {formatAngka(dataSaatIni.Wedison.perawatan)}
                  </p>
                </div>
                <div className="h-12 flex items-center border-b border-gray-200">
                  <p className="text-sm sm:text-base">
                    Rp {formatAngka(dataSaatIni.Wedison.bahan_bakar)}
                  </p>
                </div>
                <div className="h-12 flex items-center border-t border-gray-200 mt-2 pt-2">
                  <p className="font-bold text-sm sm:text-base">
                    Rp {formatAngka(dataSaatIni.Wedison.total)}
                  </p>
                </div>
              </div>

              {/* Matic 110cc, 125cc, 150cc */}
              {(["matic110", "matic125", "matic150"] as const).map((matic) => (
                <div
                  key={matic}
                  className="col-span-1 bg-gray-50 rounded-lg px-2 sm:px-4"
                >
                  <div className="h-14 flex items-center">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                      Matic {matic.slice(-3)}cc
                    </h3>
                  </div>
                  <div className="h-12 flex items-center border-b border-gray-200">
                    <p className="text-gray-600 text-sm sm:text-base">
                      Rp {formatAngka(dataSaatIni[matic].listrik)}
                    </p>
                  </div>
                  <div className="h-12 flex items-center border-b border-gray-200">
                    <p className="text-gray-600 text-sm sm:text-base">
                      Rp {formatAngka(dataSaatIni[matic].perawatan)}
                    </p>
                  </div>
                  <div className="h-12 flex items-center border-b border-gray-200">
                    <p className="text-gray-600 text-sm sm:text-base">
                      Rp {formatAngka(dataSaatIni[matic].bahan_bakar)}
                    </p>
                  </div>
                  <div className="h-12 flex items-center border-t border-gray-200 mt-2 pt-2">
                    <p className="font-bold text-gray-800 text-sm sm:text-base">
                      Rp {formatAngka(dataSaatIni[matic].total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Bagian penghematan */}
          <Card className="mb-6 sm:mb-10 p-4 sm:p-6 bg-white shadow-lg border-teal-500 rounded-xl overflow-x-auto">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">
              {t("calculator.page.savingTitle")}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 min-w-[600px]">
              {/* Label penghematan */}
              <div className="space-y-4 sm:space-y-12">
                <p className="text-gray-600 text-sm sm:text-base">
                  {t("calculator.page.savingMonthlySavings")}
                </p>
                <p className="text-gray-600 text-sm sm:text-base">
                  {t("calculator.page.savingAnnualSavings")}
                </p>
              </div>

              {/* Kolom Wedison (kosong) */}
              <div className="space-y-4">
                <div className="bg-gray-100 text-gray-400 rounded-lg py-3 px-2 sm:px-4 text-center">
                  <p className="font-medium text-sm sm:text-base">-</p>
                </div>
                <div className="bg-gray-100 text-gray-400 rounded-lg py-3 px-2 sm:px-4 text-center">
                  <p className="font-medium text-sm sm:text-base">-</p>
                </div>
              </div>

              {/* Penghematan untuk matic 110cc, 125cc, 150cc */}
              {["matic110", "matic125", "matic150"].map((matic) => (
                <div key={matic} className="space-y-4">
                  <div className="bg-teal-500 text-white rounded-lg py-3 px-2 sm:px-4 text-center">
                    {/* <div className="bg-[#05AB6D] text-white rounded-lg py-3 px-2 sm:px-4 text-center"> */}

                    <p className="font-medium text-sm sm:text-base">
                      Rp{" "}
                      {formatAngka(
                        dataSaatIni.penghematan.bulanan[
                          matic as keyof typeof dataSaatIni.penghematan.bulanan
                        ]
                      )}
                    </p>
                  </div>
                  <div className="bg-teal-500 text-white rounded-lg py-3 px-2 sm:px-4 text-center">
                    {/* <div className="bg-[#05AB6D] text-white rounded-lg py-3 px-2 sm:px-4 text-center"> */}
                    <p className="font-medium text-sm sm:text-base">
                      Rp{" "}
                      {formatAngka(
                        dataSaatIni.penghematan.tahunan[
                          matic as keyof typeof dataSaatIni.penghematan.tahunan
                        ]
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bagian slider */}
        <Card className="mt-8 p-6 bg-white shadow-lg rounded-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            {t("calculator.page.distance")}
            <p className="text-gray-600 mb-2 sm:mb-0"></p>
            <p className="font-medium text-gray-800">{jarakTerdekat} km</p>
          </div>
          <div className="px-2 sm:px-4">
            <Slider
              defaultValue={[10]}
              max={duaBaterai ? 120 : 100}
              step={10}
              value={[jarakTerdekat]}
              onValueChange={handlePerubahanSlider}
              className="w-full"
            />
          </div>
          <div className="flex justify-between mt-2 text-gray-600">
            <span>0 km</span>
            <span>{duaBaterai ? "120" : "100"} km</span>
          </div>
        </Card>

        {/* Catatan kaki */}
        <div className="text-xs text-gray-500 mt-6">
          <p>{t("calculator.page.tnc1")}</p>
          <p>{t("calculator.page.tnc2")}</p>
        </div>

        {/* Tombol CTA */}
        {/* <div className="flex justify-center mt-8">
          <Button className=" text-white font-medium py-6 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
            {t("calculator.page.cta")}
          </Button>
        </div> */}
      </div>
    </div>
  );
}
