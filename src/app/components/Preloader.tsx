import Image from "next/image";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoad, setIsLoad] = useState(false);

  useEffect(() => {
    setIsLoad(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setIsLoad(false);
    }, 2000); // 2 detik sebelum fade out

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 bg-white flex items-center justify-center z-50 transition-opacity duration-1000 pb-24 h-[100vh] ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <Image
        src="/wedison-sidebyside.png"
        alt="Logo"
        width={1000}
        height={1000}
        className={`w-[70%] h-auto opacity-0 transition-opacity duration-1000 ${
          isLoad ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
