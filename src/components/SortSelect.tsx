"use client";

export default function SortSelect({
  defaultValue,
  options,
}: {
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      defaultValue={defaultValue}
      onChange={(e) => {
        const p = new URLSearchParams(window.location.search);
        p.set("sort", e.target.value);
        p.delete("page");
        window.location.href = `?${p.toString()}`;
      }}
      className="border border-[var(--line-2)] rounded-full px-4 py-2.5 text-[13px] font-[800] outline-none bg-[var(--surface)] text-[var(--text-3)] cursor-pointer"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
