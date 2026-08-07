"use client";
import { useEffect, useMemo, useRef, useState } from "react";

export type SearchOption = { value: string; label: string };

// A searchable dropdown (combobox) styled to match the form's native selects.
// Shows the selected label; opening reveals a filter box + scrollable list.
export default function SearchSelect({
  id,
  options,
  value,
  onChange,
  placeholder = "Select…",
  ariaLabel,
  wide = false,
}: {
  id?: string;
  options: SearchOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  // Widen the popover beyond the trigger — for narrow triggers like the phone
  // dial code, whose long option labels wouldn't fit the trigger's width.
  wide?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  function choose(v: string) {
    onChange(v);
    setOpen(false);
    setQuery("");
  }

  return (
    <div className={wide ? "ob-ss ob-ss--wide" : "ob-ss"} ref={wrapRef}>
      <button
        type="button"
        id={id}
        className="ob-input ob-select ob-ss-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={selected ? undefined : "ob-ss-ph"}>
          {selected ? selected.label : placeholder}
        </span>
      </button>
      {open && (
        <div className="ob-ss-pop">
          <input
            ref={searchRef}
            className="ob-input ob-ss-search"
            type="text"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setOpen(false);
                setQuery("");
              } else if (e.key === "Enter" && filtered.length > 0) {
                e.preventDefault();
                choose(filtered[0].value);
              }
            }}
          />
          <ul className="ob-ss-list" role="listbox">
            {filtered.length === 0 ? (
              <li className="ob-ss-empty">No matches</li>
            ) : (
              filtered.map((o, i) => (
                <li key={`${o.value}-${i}`}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={o.value === value}
                    className={"ob-ss-opt" + (o.value === value ? " is-sel" : "")}
                    onClick={() => choose(o.value)}
                  >
                    {o.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
