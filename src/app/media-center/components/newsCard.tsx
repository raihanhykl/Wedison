// "use client";
// import { LinkPreview } from "@/app/lib/fetchPreview";
// import { Card } from "@/components/ui/card";
// import Image from "next/image";
// import * as React from "react";
// export function NewsCard({ data }: { data: LinkPreview }) {
//   return (
//     <Card className=" border-none outline-none mx-auto pt-0">
//       <a href={data.url} target="_blank" rel="noreferrer" className=" h-full">
//         <Image
//           src={data.image!}
//           alt={data.title}
//           width={1000}
//           height={1000}
//           className="w-full min-h-[50%] max-h-[50%] object-cover rounded-xl"
//           loading="lazy"
//         />

//         <div className="space-y-1 p-3 overflow-hidden">
//           <div className="text-sm text-gray-500 overflow-hidden">
//             {data.site}

//             {data.published
//               ? " • " +
//                 new Date(data.published).toLocaleDateString(undefined, {
//                   year: "numeric",
//                   month: "short",
//                   day: "2-digit",
//                 })
//               : ""}
//           </div>
//           <h3 className="text-base font-semibold leading-snug group-hover:underline">
//             {data.title}
//           </h3>
//           {data.description && (
//             <p className="text-sm text-gray-600 line-clamp-4">
//               {data.description}
//             </p>
//           )}
//         </div>
//       </a>
//     </Card>
//   );
// }

"use client";
import { LinkPreview } from "@/app/lib/fetchPreview";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

export function NewsCard({ data }: { data: LinkPreview }) {
  return (
    <Card className="mx-auto h-full flex flex-col overflow-hidden border-none outline-none p-0">
      <Link
        // href={data.url}
        href={"/media-center/" + data.slug}
        rel="noreferrer"
        className="h-full flex flex-col"
      >
        {/* Bungkus gambar dgn aspect ratio tetap */}
        <div
          className="relative w-full overflow-hidden rounded-[4px_4px_0_0]
                        aspect-[16/9] sm:aspect-[4/3] md:aspect-[16/9]"
        >
          <Image
            src={data.image ?? "/placeholder.jpg"}
            alt={data.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-cover"
            loading="lazy"
            // optional: priority untuk item pertama
          />
        </div>

        {/* Konten teks: pakai flex-1 agar mengisi sisa tinggi card */}
        <div className="flex flex-col flex-1 p-3 gap-1 min-h-0">
          <div className="text-sm text-gray-500">
            {data.site}
            {data.published
              ? " • " +
                new Date(data.published).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })
              : ""}
          </div>

          <h3 className="text-base font-semibold leading-snug line-clamp-2 group-hover:underline">
            {data.title}
          </h3>

          {/* Spacer + deskripsi dibatasi agar tidak “mendorong” tinggi card */}
          {data.description && (
            <p className="text-sm text-gray-600 line-clamp-4">
              {data.description}
            </p>
          )}

          {/* Dorong elemen terakhir ke bawah jika butuh footer/button nanti */}
          <div className="mt-auto" />
        </div>
      </Link>
    </Card>
  );
}
