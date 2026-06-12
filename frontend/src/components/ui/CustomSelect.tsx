"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CustomSelectProps {
  value: string;
  options: string[];
  onChange?: (val: string) => void;
}

export default function CustomSelect({
  value,
  options,
  onChange,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(value);
  }, [value]);

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
      className="relative w-full"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full rounded-xl border border-white/10 bg-[#071122] px-4 py-3 text-left text-white transition hover:border-cyan-500/50 cursor-pointer relative pr-10 text-xs"
        style={{ backgroundColor: "#071122" }}
      >
        {selected}

        <ChevronDown
          size={16}
          className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-[#071122] shadow-2xl"
          style={{ backgroundColor: "#071122" }}
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setSelected(option);
                setOpen(false);
                if (onChange) {
                  onChange(option);
                }
              }}
              className="block w-full px-4 py-2.5 text-left text-white transition hover:bg-[#18d5d0]/10 hover:text-[#18d5d0] text-xs cursor-pointer"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}