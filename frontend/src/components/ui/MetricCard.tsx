type Props = {
  title: string;
  value: string;
  subtitle: string;
};

export default function MetricCard({
  title,
  value,
  subtitle,
}: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0b1327] p-6">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <h2 className="mt-4 text-5xl font-bold">
        {value}
      </h2>

      <p className="mt-3 text-sm text-emerald-400">
        {subtitle}
      </p>
    </div>
  );
}