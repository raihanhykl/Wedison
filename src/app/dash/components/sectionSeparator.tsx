import { cn } from "@/lib/utils";

type Props = {
  bgColor?: string;
  lineColor?: string;
};
const SectionSeparator = ({ bgColor, lineColor }: Props) => {
  const lineCount = 60; // jumlah total garis
  const maxWidth = 1440;
  const maxHeight = 250;

  const lines = Array.from({ length: lineCount }, () => {
    const baseX = Math.random() * maxWidth;
    const baseY = Math.random() * maxHeight;
    const length = 100 + Math.random() * 150; // panjang antara 100 - 250px
    const angle = 45; // diagonal kanan bawah
    const rad = (angle * Math.PI) / 180;

    return {
      x1: baseX,
      y1: baseY,
      x2: baseX + Math.cos(rad) * length,
      y2: baseY + Math.sin(rad) * length,
    };
  });

  return (
    <div className={cn("w-full bg-black overflow-hidden", bgColor)}>
      <svg
        viewBox={`0 0 ${maxWidth} ${maxHeight}`}
        preserveAspectRatio="none"
        className="w-full h-[50px] md:h-[100px]"
      >
        <defs>
          <linearGradient id="greenLine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={lineColor || "#22c55e"} />
            <stop offset="100%" stopColor={lineColor || "#22c55e"} />
          </linearGradient>
        </defs>

        {lines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="url(#greenLine)"
            strokeWidth={3}
            strokeLinecap="round"
            opacity="0.7"
          />
        ))}
      </svg>
    </div>
  );
};

export default SectionSeparator;
