"use client";

import type React from "react";

export function Links({
  links,
}: {
  links: {
    icon?: React.ReactNode;
    label: string;
    url: string;
  }[];
}) {
  return (
    <div className="not-prose flex flex-row flex-wrap justify-center gap-2">
      {links.map((link) => {
        return (
          <a
            key={link.label}
            href={link.url}
            className="flex flex-row items-center gap-2 rounded-full bg-zinc-800 px-5 py-2 text-lg text-white hover:bg-black hover:no-underline dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-50"
          >
            {link.icon}
            <span>{link.label}</span>
          </a>
        );
      })}
    </div>
  );
}
