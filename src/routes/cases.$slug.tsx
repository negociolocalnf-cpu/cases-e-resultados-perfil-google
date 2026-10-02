import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CASES, fmt } from "@/data/cases";
import { Brand, CaseDashboard, CaseMeta, DataSummary, BeforeAfter, FinalCta, Gallery, Transparency } from "@/components/cases/sections";

export const Route = createFileRoute("/cases/$slug")({
  loader: ({ params }) => {
    const c = CASES.find((x) => x.slug === params.slug);
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.company} — Case Google | @consultorgoogle_` : "Case";
    const d = loaderData
      ? `${loaderData.segment} em ${loaderData.city}: ${fmt(loaderData.totals.views ?? 0)} visualizações no Perfil da Empresa no Google (${loaderData.periodLabel}).`
      : "";
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p>Case não encontrado.</p>
      <Link to="/" className="text-primary">Ver todos os cases</Link>
    </div>
  ),
  component: CaseDetail,
});

function CaseDetail() {
  const c = Route.useLoaderData();
  return (
    <main>
      <div className="relative">
        <div className="glow-bg pointer-events-none absolute inset-0" />
        <div className="relative">
          <Brand />
          <div className="mx-auto max-w-6xl px-5 pb-12 pt-10">
            <Link to="/" hash="cases" className="text-sm text-muted-foreground hover:text-foreground">← Todos os cases</Link>
            <h1 className="mt-6 text-4xl font-medium tracking-tight md:text-6xl">{c.company}</h1>
            <div className="mt-5"><CaseMeta c={c} /></div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl space-y-16 px-5 pb-24">
        <CaseDashboard c={c} />
        <DataSummary c={c} />
        <BeforeAfter c={c} />
        <Gallery c={c} />
        <Transparency />
      </div>
      <FinalCta />
    </main>
  );
}
