import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, MapPin, X } from "lucide-react";
import { fmt, METRICS, pct, whatsappLink, type Case, type MetricKey } from "@/data/cases";
import { MetricCard, SourceDonut } from "./charts";

const KEYS: MetricKey[] = ["views", "calls", "chat", "routes", "website"];

export function Brand() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
      <Link to="/" className="font-mono text-sm tracking-tight">@consultorgoogle_</Link>
      <a href={whatsappLink()} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
        Analisar meu perfil →
      </a>
    </header>
  );
}

export function PrimaryCta({ children, big }: { children: React.ReactNode; big?: boolean }) {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-primary font-semibold tracking-wide text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 ${big ? "px-9 py-5 text-base" : "px-7 py-4 text-sm"}`}
    >
      {children} <ArrowUpRight className="h-4 w-4" />
    </a>
  );
}

export function CaseMeta({ c }: { c: Case }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
      <span className="rounded-full border border-border px-3 py-1 text-foreground">{c.segment}</span>
      <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{c.city} — {c.state}</span>
      <span className="num">{c.periodLabel}</span>
    </div>
  );
}

export function CaseDashboard({ c }: { c: Case }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {KEYS.map((k) => <MetricCard key={k} c={c} k={k} />)}
        <SourceDonutWrap c={c} />
      </div>
      {c.monthlyApprox && (
        <p className="text-xs text-muted-foreground">
          Totais conforme o painel do Google. Valores mensais dos gráficos são leituras aproximadas das curvas do painel.
        </p>
      )}
    </div>
  );
}
function SourceDonutWrap({ c }: { c: Case }) {
  if (!c.sources) return null;
  return <div className="md:col-span-2 lg:col-span-1 lg:row-span-1 [&>div]:h-full"><SourceDonut c={c} /></div>;
}

export function DataSummary({ c }: { c: Case }) {
  const t = c.totals;
  const parts = [
    t.views !== undefined && `${fmt(t.views)} visualizações`,
    t.calls !== undefined && `${fmt(t.calls)} chamadas`,
    t.chat !== undefined && `${fmt(t.chat)} interações via chat`,
    t.routes !== undefined && `${fmt(t.routes)} solicitações de rotas`,
    t.website !== undefined && `${fmt(t.website)} acessos ao website`,
  ].filter(Boolean) as string[];
  const text = parts.length > 1 ? parts.slice(0, -1).join(", ") + " e " + parts.at(-1) : parts[0];
  return (
    <div className="panel grid gap-8 p-6 md:grid-cols-[1.4fr_1fr] md:p-10">
      <div>
        <h2 className="text-2xl font-medium tracking-tight md:text-3xl">O que os dados mostram</h2>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Durante o período analisado ({c.periodLabel}), o Perfil da Empresa registrou {text}.
        </p>
      </div>
      <ul className="space-y-3">
        {["Visibilidade no Google", "Interações com potenciais clientes", "Solicitações de rotas", "Acessos ao website", "Chamadas realizadas pelo perfil"].map((x) => (
          <li key={x} className="flex items-center gap-3 text-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-primary"><Check className="h-3.5 w-3.5" /></span>
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BeforeAfter({ c }: { c: Case }) {
  if (!c.before) return null;
  const rows = KEYS.filter((k) => c.before?.[k] !== undefined && c.totals[k] !== undefined);
  if (!rows.length) return null;
  return (
    <div className="panel overflow-hidden">
      <div className="p-6 md:p-8"><h2 className="text-2xl font-medium">Antes x Depois</h2></div>
      <table className="w-full text-sm">
        <thead className="text-xs uppercase tracking-widest text-muted-foreground">
          <tr className="border-t border-border"><th className="p-4 text-left font-medium">Indicador</th><th className="p-4 text-right font-medium">Antes</th><th className="p-4 text-right font-medium">Depois</th><th className="p-4 text-right font-medium">Variação</th></tr>
        </thead>
        <tbody>
          {rows.map((k) => {
            const p = pct(c.before![k], c.totals[k]);
            return (
              <tr key={k} className="border-t border-border">
                <td className="p-4">{METRICS[k].label}</td>
                <td className="num p-4 text-right text-muted-foreground">{fmt(c.before![k]!)}</td>
                <td className="num p-4 text-right">{fmt(c.totals[k]!)}</td>
                <td className="num p-4 text-right text-success">{p !== null ? `${p > 0 ? "+" : ""}${p}%` : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function Gallery({ c }: { c: Case }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!c.screenshots?.length) return null;
  return (
    <div>
      <h2 className="text-2xl font-medium tracking-tight md:text-3xl">Confira os dados diretamente no painel</h2>
      <p className="mt-2 text-muted-foreground">Prints originais do Perfil da Empresa no Google. Clique para ampliar.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {c.screenshots.map((s, i) => (
          <button key={s.src} onClick={() => setOpen(i)} className="group panel overflow-hidden p-0 text-left">
            <img src={s.src} alt={s.caption} loading="lazy" className="aspect-[3/4] w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
            <span className="block p-3 text-xs text-muted-foreground">{s.caption}</span>
          </button>
        ))}
      </div>
      {open !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4 backdrop-blur" onClick={() => setOpen(null)}>
          <button className="absolute right-5 top-5 rounded-full border border-border p-2" aria-label="Fechar"><X className="h-5 w-5" /></button>
          <img src={c.screenshots[open].src} alt={c.screenshots[open].caption} className="max-h-[90vh] max-w-full rounded-xl" />
        </div>
      )}
    </div>
  );
}

export function Transparency() {
  return (
    <div className="space-y-3 border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground">
      <p><strong className="text-foreground">Sobre os dados:</strong> as métricas apresentadas nesta página são provenientes dos dados de desempenho disponibilizados pelo Perfil da Empresa no Google, referentes aos períodos indicados em cada case.</p>
      <p>Os resultados variam de acordo com segmento, localização, concorrência, histórico do perfil e comportamento dos consumidores. Os dados apresentados não representam garantia de resultados futuros.</p>
    </div>
  );
}

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <div className="glow-bg pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-3xl px-5 py-28 text-center">
        <h2 className="text-4xl font-medium tracking-tight md:text-6xl">E o seu Perfil da Empresa?</h2>
        <p className="mt-6 text-lg text-muted-foreground">Sua empresa pode estar sendo encontrada todos os dias no Google — mas você sabe quantas oportunidades está recebendo?</p>
        <p className="mt-3 text-muted-foreground">Descubra como está o desempenho atual do seu Perfil da Empresa e quais pontos podem ser melhorados.</p>
        <div className="mt-10"><PrimaryCta big>QUERO UMA ANÁLISE DO MEU PERFIL</PrimaryCta></div>
        <p className="mt-5 text-sm text-muted-foreground">Análise estratégica do seu Perfil da Empresa no Google.</p>
      </div>
      <footer className="relative border-t border-border py-8 text-center font-mono text-xs text-muted-foreground">
        @consultorgoogle_ · Especialista em Perfil da Empresa no Google
      </footer>
    </section>
  );
}
