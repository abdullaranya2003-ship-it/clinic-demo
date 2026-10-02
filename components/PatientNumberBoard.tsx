import { Radio } from "lucide-react";

export default function PatientNumberBoard({
  number,
  patientName,
  label = "ژمارەی ئێستا",
}: {
  number: number | string | null;
  patientName?: string;
  label?: string;
}) {
  return (
    <div className="number-board flex flex-col items-center justify-center gap-2 px-8 py-10 text-center">
      <div className="relative z-10 flex items-center gap-2 text-xs font-medium tracking-wide text-primary-bright/90">
        <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-primary-bright" />
        <Radio size={13} />
        <span>{label}</span>
      </div>

      <div className="digits relative z-10 text-7xl font-bold leading-none sm:text-8xl">
        {number === null ? "--" : String(number).padStart(2, "0")}
      </div>

      <div className="relative z-10 mt-1 font-kufi text-lg font-medium text-white/90">
        {patientName || "چاوەڕوانی نەخۆش"}
      </div>
    </div>
  );
}
