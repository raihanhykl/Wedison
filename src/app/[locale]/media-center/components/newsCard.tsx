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
    <Card className="group mx-auto h-full flex flex-col overflow-hidden rounded-xl border border-border bg-card p-0 shadow-sm transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-lg">
      <Link
        // href={data.url}
        href={"/media-center/news/" + data.slug}
        rel="noreferrer"
        className="h-full flex flex-col"
      >
        {/* Bungkus gambar dgn aspect ratio tetap */}
        <div
          className="relative w-full overflow-hidden
                        aspect-[16/9] sm:aspect-[4/3] md:aspect-[16/9]"
        >
          {data.image ? (
            <Image
              src={data.image}
              alt={data.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width:1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
              loading="lazy"
              // optional: priority untuk item pertama
            />
          ) : (
            <div className="absolute inset-0 bg-muted" aria-hidden="true" />
          )}
        </div>

        {/* Konten teks: pakai flex-1 agar mengisi sisa tinggi card */}
        <div className="flex flex-col flex-1 p-4 gap-1 min-h-0">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
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

          <h3 className="font-display text-base font-bold leading-snug tracking-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {data.title}
          </h3>

          {/* Spacer + deskripsi dibatasi agar tidak “mendorong” tinggi card */}
          {data.description && (
            <p className="text-sm text-muted-foreground line-clamp-4">
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
