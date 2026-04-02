"use client";

import type { Note } from "@/lib/types";

interface NotesProps {
  notes: Note[];
}

export function Notes({ notes }: NotesProps) {
  return (
    <div className="text-center text-sm">
      {notes.map((note, index, array) => (
        <span key={index}>
          <sup>{note.symbol}</sup>
          {note.text}
          {index < array.length - 1 ? ", " : ""}
        </span>
      ))}
    </div>
  );
}
