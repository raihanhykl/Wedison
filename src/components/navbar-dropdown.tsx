import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { stripLocale } from "@/app/lib/locale";

export type NavbarDropdownLink = {
  href: string;
  title: string;
  description: string;
};

type Props = {
  open: boolean;
  /** kelas tinggi panel saat terbuka, mis. "max-h-80 h-80" */
  heightClass: string;
  leftCard: { title: string; description: string };
  links: NavbarDropdownLink[];
  /** React 19: ref diterima sebagai prop biasa */
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Panel megamenu generik untuk dropdown navbar (dipakai Corporate & Discover).
 * Layout sama persis: background logogram + kartu kiri + daftar link kanan.
 * Hanya tinggi panel, teks kartu kiri, dan daftar link yang berbeda (lewat props).
 */
export default function NavbarDropdown({
  open,
  heightClass,
  leftCard,
  links,
  ref,
}: Props) {
  const path = usePathname();
  return (
    <div
      ref={ref}
      className={cn(
        "sticky top-0 left-0 overflow-hidden bg-white md:transition-discrete duration-300 hidden md:flex justify-center items-center shadow-sm",
        open
          ? `${heightClass} opacity-100 pointer-events-auto`
          : "max-h-0 pointer-events-none"
      )}
    >
      <div className="w-full h-full relative">
        <div className="absolute inset-0 h-full w-full z-10">
          <Image
            width={500}
            height={500}
            src="/logo/wedison-logogram.svg"
            alt="Wedison Logo"
            className="h-full w-full object-contain opacity-10 scale-600 object-[55%_100%]"
          />
        </div>

        <div className="absolute inset-0 flex items-center bg-transparent justify-center z-20">
          <div className="w-[70%] h-full p-4 z-20 bg-transparent">
            <div className="w-full h-full gap-4 flex bg-white/0 rounded-lg justify-evenly items-center">
              {/* kartu kiri */}
              <div className="flex flex-1 h-full w-full select-none flex-col justify-center items-center text-center rounded-md bg-gray-100 p-6 no-underline outline-none focus:shadow-md">
                <div className="mb-3 text-2xl font-medium">{leftCard.title}</div>
                <p className="text-sm leading-tight text-gray-700">
                  {leftCard.description}
                </p>
              </div>

              {/* daftar link kanan */}
              <div className="flex flex-1 flex-col gap-4 items-center justify-start h-full">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "bg-white hover:bg-gray-100 px-4 rounded-lg py-2 flex-1 w-full",
                      stripLocale(path) === link.href &&
                        "cursor-not-allowed bg-gray-100"
                    )}
                  >
                    <div className="text-black font-medium text-xl">
                      {link.title}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {link.description}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
