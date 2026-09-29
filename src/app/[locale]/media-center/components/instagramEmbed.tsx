"use client";

import React from "react";
import Image from "next/image";
import type { InstagramPostData } from "./fetchInstagram";

function InstagramCard({ post }: { post: InstagramPostData }) {
  const isReel = post.url.includes("/reel/");

  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-[3/4] w-[60vw] sm:w-auto flex-shrink-0 sm:flex-shrink rounded-xl overflow-hidden bg-muted"
    >
      <Image
        src={post.thumbnail}
        alt={post.caption.slice(0, 100) || "Instagram post"}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 640px) 60vw, (max-width: 1024px) 33vw, 17vw"
        unoptimized
      />

      {/* Reel icon */}
      {isReel && (
        <div className="absolute top-3 right-3 z-10">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="white"
            className="drop-shadow-lg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
          </svg>
        </div>
      )}

      {/* Hover overlay with caption */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <p className="text-white text-sm line-clamp-4 leading-relaxed">
          {post.caption}
        </p>
        <span className="text-white/70 text-xs mt-2">View on Instagram →</span>
      </div>
    </a>
  );
}

export default function InstagramEmbed({
  posts,
}: {
  posts: InstagramPostData[];
}) {
  return (
    <div
      className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0"
      style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
    >
      {posts.map((post) => (
        <div key={post.url} className="snap-start">
          <InstagramCard post={post} />
        </div>
      ))}
    </div>
  );
}
