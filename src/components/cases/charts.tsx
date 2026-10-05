import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { CountUp, useInView } from "@/hooks/use-count-up";
import { fmt, METRICS, type Case, type MetricKey } from "@/data/cases";

const SOURCE_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

export function MetricCard({ c, k }: { c: Case; k: MetricKey }) {
  const total = c.totals[k];
  if (total === undefined) return null;
  const series = c.monthly?.[k];
  const data = series && c.months ? c.months.map((m, i) => ({ m, v: series[i] })) : null;
  const id = `g-${c.slug}-${k}`;
  return (
    <div className="panel flex flex-col p-6">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{METRICS[k].label}</span>
      <CountUp value={total} className="num mt-3 block text-5xl font-medium" />
      <span className="mt-2 text-sm text-muted-foreground">{METRICS[k].desc}</span>
      {data && (
        <div className="mt-6 h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
              <Tooltip
                cursor={{ stroke: "var(--border)" }}
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }}
                labelStyle={{ color: "var(--muted-foreground)" }}
                itemStyle={{ color: "var(--foreground)" }}
                formatter={(v) => [`≈ ${fmt(Number(v))}`, METRICS[k].label]}
              />
              <Area type="monotone" dataKey="v" stroke="var(--primary)" strokeWidth={2} fill={`url(#${id})`} animationDuration={1200} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export function SourceBars({ c }: { c: Case }) {
  if (!c.sources) return null;
  const total = c.sources.reduce((s, x) => s + x.value, 0);
  const max = Math.max(...c.sources.map((s) => s.value));
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div className="panel p-6 md:p-8">
      <h3 className="text-lg font-medium">Como as pessoas descobriram a empresa</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        <CountUp value={total} className="num text-foreground" /> pessoas visualizaram o perfil
      </p>
      <div ref={ref} className="mt-7 space-y-5">
        {c.sources.map((s, i) => {
          const share = Math.round((s.value / total) * 100);
          const width = (s.value / max) * 100;
          return (
            <div key={s.label}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <span className="num shrink-0 text-base">
                  <CountUp value={s.value} /> <span className="text-muted-foreground">· {share}%</span>
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full transition-[width] duration-1000 ease-out"
                  style={{ width: inView ? `${width}%` : "0%", background: SOURCE_COLORS[i % 4], transitionDelay: `${i * 120}ms` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
