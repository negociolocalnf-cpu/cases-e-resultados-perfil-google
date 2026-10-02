import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
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
      <span className="num mt-3 text-5xl font-medium">{fmt(total)}</span>
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
                formatter={(v: number) => [`≈ ${fmt(v)}`, METRICS[k].label]}
              />
              <Area type="monotone" dataKey="v" stroke="var(--primary)" strokeWidth={2} fill={`url(#${id})`} animationDuration={1200} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export function SourceDonut({ c }: { c: Case }) {
  if (!c.sources) return null;
  const total = c.sources.reduce((s, x) => s + x.value, 0);
  return (
    <div className="panel p-6 md:p-8">
      <h3 className="text-lg font-medium">Como as pessoas descobriram a empresa</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        <span className="num text-foreground">{fmt(total)}</span> pessoas visualizaram o perfil
      </p>
      <div className="mt-6 grid items-center gap-8 sm:grid-cols-[180px_1fr]">
        <div className="relative mx-auto h-44 w-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={c.sources} dataKey="value" innerRadius={58} outerRadius={80} stroke="none" paddingAngle={2} startAngle={90} endAngle={-270}>
                {c.sources.map((_, i) => <Cell key={i} fill={SOURCE_COLORS[i % 4]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="num text-2xl">{fmt(total)}</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">views</span>
          </div>
        </div>
        <ul className="space-y-4">
          {c.sources.map((s, i) => (
            <li key={s.label} className="flex items-start gap-3">
              <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: SOURCE_COLORS[i % 4] }} />
              <div className="flex-1">
                <div className="num text-base">
                  {fmt(s.value)} <span className="text-muted-foreground">· {Math.round((s.value / total) * 100)}%</span>
                </div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
