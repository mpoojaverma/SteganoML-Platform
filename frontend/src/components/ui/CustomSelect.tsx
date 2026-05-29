"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CustomSelectProps {
  value: string;
  options: string[];
}

export default function CustomSelect({
  value,
  options,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          w-full
          rounded-xl
          border
          border-white/10
          bg-[#182238]
          px-4
          py-3
          text-left
          text-white
          transition
          hover:border-cyan-500/50
        "
      >
        {selected}

        <ChevronDown
          size={18}
          className={`
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-slate-400
            transition-transform
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {open && (
        <div
          className="
            absolute
            left-0
            right-0
            top-full
            z-50
            mt-2
            overflow-hidden
            rounded-xl
            border
            border-white/10
            bg-[#182238]
            shadow-2xl
          "
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setSelected(option);
                setOpen(false);
              }}
              className="
                block
                w-full
                px-4
                py-3
                text-left
                text-white
                transition
                hover:bg-cyan-500/10
              "
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}