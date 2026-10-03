import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { aggregate, AGGREGATE_MODE, CASES, COMPANY_FILTERS, fmt, METRICS, type MetricKey } from "@/data/cases";
import { Brand, CaseDashboard, CaseMeta, DataSummary, BeforeAfter, FinalCta, Gallery, PrimaryCta, Transparency } from "@/components/cases/sections";

const TITLE = "Cases de Google Meu Negócio | Resultados Reais de Empresas";
const DESC = "Veja cases e métricas reais de empresas atendidas através de estratégias de otimização do Perfil da Empresa no Google. Visualizações, chamadas, rotas, chats e cliques.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CasesPage,
});

const KEYS: MetricKey[] = ["views", "routes", "chat", "website", "calls"];
const PERIODS = [
  { label: "Todos os períodos", months: 0 },
  { label: "Últimos 3 meses", months: 3 },
  { label: "Últimos 6 meses", months: 6 },
  { label: "Últimos 12 meses", months: 12 },
];
const MODE_LABEL = {
  individual: "Números de um case individual",
  periodo: "Números de um período específico",
  acumulado: "Total acumulado dos cases",
};

function CasesPage() {
  const [company, setCompany] = useState<(typeof COMPANY_FILTERS)[number]>("Todos");
  const [period, setPeriod] = useState(0);
  const totals = aggregate(CASES);
  const featured = CASES.find((c) => c.featured) ?? CASES[0];

  const filtered = useMemo(() => {
    const now = new Date();
    return CASES.filter((c) => {
      if (company !== "Todos" && c.company !== company) return false;
      if (period) {
        const [y = 0, m = 0] = c.periodEnd.split("-").map(Number);
        const diff = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
        if (diff > period) return false;
      }
      return true;
    });
  }, [company, period]);

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="grid-lines pointer-events-none absolute inset-0" />
        <div className="glow-bg pointer-events-none absolute inset-0" />
        <div className="relative">
          <Brand />
          <div className="mx-auto max-w-5xl px-5 pb-24 pt-16 text-center md:pt-24">
            <p className="animate-rise font-mono text-xs uppercase tracking-[0.3em] text-primary">Cases e Resultados</p>
            <h1 className="animate-rise mt-6 text-4xl font-medium leading-[1.05] tracking-tight [animation-delay:80ms] md:text-7xl">
              Empresas que passaram a ser mais encontradas no Google
            </h1>
            <p className="animate-rise mx-auto mt-6 max-w-2xl text-lg text-muted-foreground [animation-delay:160ms]">
              Veja métricas reais de Perfis de Empresa que foram analisados, estruturados e otimizados.
            </p>
            <p className="animate-rise mt-4 font-mono text-sm text-foreground [animation-delay:200ms]">Dados reais. Métricas reais. Empresas reais.</p>
            <div className="animate-rise mt-10 flex flex-col items-center justify-center gap-3 [animation-delay:260ms] sm:flex-row">
              <PrimaryCta>QUERO ANALISAR MINHA EMPRESA</PrimaryCta>
              <a href="#cases" className="rounded-full border border-border px-7 py-4 text-sm font-semibold tracking-wide transition-colors hover:bg-secondary">VER CASES</a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <h2 className="text-3xl font-medium tracking-tight md:text-4xl">Resultados reais no Google</h2>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{MODE_LABEL[AGGREGATE_MODE]}{featured ? ` · ${featured.periodLabel}` : ""}</span>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {KEYS.map((k, i) => (
            <div key={k} className={`panel p-6 ${i === 0 ? "col-span-2 lg:col-span-1" : ""}`}>
              <div className="num text-4xl font-medium md:text-5xl">+{fmt(totals[k])}</div>
              <div className="mt-2 text-sm text-muted-foreground">{METRICS[k].label}</div>
            </div>
          ))}
        </div>
      </section>

      {featured && (
        <section className="mx-auto max-w-6xl px-5 pb-20">
          <div className="panel relative overflow-hidden p-8 md:p-12">
            <div className="glow-bg pointer-events-none absolute inset-0 opacity-70" />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Case em destaque</span>
                <h3 className="mt-4 text-3xl font-medium md:text-4xl">{featured.company}</h3>
                <div className="mt-4"><CaseMeta c={featured} /></div>
                <Link to="/cases/$slug" params={{ slug: featured.slug }} className="mt-8 inline-flex rounded-full bg-foreground px-7 py-4 text-sm font-semibold tracking-wide text-background transition-transform hover:-translate-y-0.5">
                  VER CASE COMPLETO
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
                {(["views", "calls", "chat", "routes", "website"] as MetricKey[]).map((k, i) => (
                  <div key={k} className={`bg-card p-5 ${i === 0 ? "col-span-2" : ""}`}>
                    <div className={`num font-medium ${i === 0 ? "text-6xl text-primary" : "text-3xl"}`}>{i === 0 ? "+" : ""}{fmt(featured.totals[k] ?? 0)}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{METRICS[k].label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="cases" className="mx-auto max-w-6xl scroll-mt-8 px-5 pb-24">
        <h2 className="text-3xl font-medium tracking-tight md:text-4xl">Cases de empresas</h2>
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {COMPANY_FILTERS.map((name) => (
              <button key={name} onClick={() => setCompany(name)} className={`rounded-full border px-4 py-2 text-sm transition-colors ${company === name ? "border-primary bg-accent text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>{name}</button>
            ))}
          </div>
          <select value={period} onChange={(e) => setPeriod(Number(e.target.value))} className="rounded-full border border-border bg-card px-4 py-2 text-sm">
            {PERIODS.map((p) => <option key={p.months} value={p.months}>{p.label}</option>)}
          </select>
        </div>

        <div className="mt-12 space-y-24">
          {filtered.length === 0 && <p className="panel p-10 text-center text-muted-foreground">Nenhum case nesta categoria ainda.</p>}
          {filtered.map((c) => (
            <article key={c.slug} className="space-y-10">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <h3 className="text-2xl font-medium md:text-3xl">{c.company}</h3>
                  <div className="mt-3"><CaseMeta c={c} /></div>
                </div>
                <Link to="/cases/$slug" params={{ slug: c.slug }} className="text-sm text-primary hover:underline">Ver case completo →</Link>
              </div>
              <CaseDashboard c={c} />
              <DataSummary c={c} />
              <BeforeAfter c={c} />
              <Gallery c={c} />
            </article>
          ))}
          <Transparency />
        </div>
      </section>

      <FinalCta />
    </main>
  );
}
