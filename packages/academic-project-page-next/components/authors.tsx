"use client";

import type { Author } from "@/lib/types";

interface AuthorsProps {
  authors: Author[];
}

export function Authors({ authors }: AuthorsProps) {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-x-8 gap-y-4">
      {authors.map((author) => (
        <div
          key={author.name}
          className="flex flex-col items-center text-center"
        >
          <div className="flex flex-row text-xl">
            {author.url ? (
              <a href={author.url}>{author.name}</a>
            ) : (
              <span>{author.name}</span>
            )}
            {author.notes && (
              <sup className="text-xl">
                {author.notes.map(
                  (note, index, array) =>
                    note + (index < array.length - 1 ? "," : ""),
                )}
              </sup>
            )}
          </div>
          {author.institution && <div>{author.institution}</div>}
        </div>
      ))}
    </div>
  );
}
