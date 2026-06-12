interface SectionHeadingProps {
  index: string;
  label: string;
  title: string;
  className?: string;
}

export function SectionHeading({
  index,
  label,
  title,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <p className="label-mono">
        {"//"} {index} — {label}
      </p>
      <h2 className="text-display text-5xl sm:text-6xl lg:text-7xl">{title}</h2>
    </div>
  );
}
