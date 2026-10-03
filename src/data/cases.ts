import p0 from "@/assets/painel-0.jpeg.asset.json";
import p1 from "@/assets/painel-1.jpeg.asset.json";
import p2 from "@/assets/painel-2.jpeg.asset.json";
import p3 from "@/assets/painel-3.jpeg.asset.json";
import p4 from "@/assets/painel-4.jpeg.asset.json";
import p5 from "@/assets/painel-5.jpeg.asset.json";
import b0 from "@/assets/beauty-0.jpeg.asset.json";
import b1 from "@/assets/beauty-1.jpeg.asset.json";
import b2 from "@/assets/beauty-2.jpeg.asset.json";
import b3 from "@/assets/beauty-3.jpeg.asset.json";
import b4 from "@/assets/beauty-4.jpeg.asset.json";
import b5 from "@/assets/beauty-5.jpeg.asset.json";

// Número do WhatsApp (só dígitos, com DDI).
export const WHATSAPP_NUMBER = "5522981605225";
export const whatsappLink = (msg = "Olá! Quero uma análise do Perfil da minha empresa no Google.") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

export type MetricKey = "views" | "calls" | "chat" | "routes" | "website";
export type Segment = "Odontologia" | "Beleza" | "Saúde" | "Pet" | "Serviços" | "Comércio" | "Outros";

export const METRICS: Record<MetricKey, { label: string; desc: string }> = {
  views: { label: "Visualizações", desc: "Pessoas que visualizaram o Perfil da Empresa" },
  calls: { label: "Chamadas", desc: "Chamadas feitas a partir do Perfil da Empresa" },
  chat: { label: "Cliques no chat", desc: "Cliques para iniciar uma conversa" },
  routes: { label: "Solicitações de rotas", desc: "Pedidos de rota para chegar à empresa" },
  website: { label: "Cliques no website", desc: "Acessos ao site pelo Perfil da Empresa" },
};

export type Case = {
  slug: string;
  company: string;
  segment: Segment;
  city: string;
  state: string;
  periodLabel: string;
  periodEnd: string; // YYYY-MM, usado no filtro por período
  featured: boolean;
  description?: string;
  totals: Partial<Record<MetricKey, number>>;
  months?: string[];
  monthly?: Partial<Record<MetricKey, number[]>>;
  monthlyApprox?: boolean;
  sources?: { label: string; value: number }[];
  before?: Partial<Record<MetricKey, number>>;
  screenshots?: { src: string; caption: string }[];
};

// Como os números do bloco geral devem ser lidos.
export const AGGREGATE_MODE: "individual" | "periodo" | "acumulado" = "acumulado";

export const CASES: Case[] = [
  {
    slug: "case-nova-friburgo",
    company: "Sorriso White",
    segment: "Odontologia",
    city: "Nova Friburgo",
    state: "RJ",
    periodLabel: "Abr/2026 → Set/2026",
    periodEnd: "2026-09",
    featured: true,
    totals: { views: 7774, calls: 199, chat: 337, routes: 773, website: 229 },
    months: ["Abr", "Mai", "Jun", "Jul", "Ago", "Set"],
    monthlyApprox: true,
    monthly: {
      calls: [46, 23, 30, 36, 31, 33],
      chat: [63, 48, 56, 65, 57, 48],
      routes: [143, 150, 136, 113, 127, 104],
      website: [32, 41, 35, 50, 36, 35],
    },
    sources: [
      { label: "Pesquisa Google — dispositivos móveis", value: 4484 },
      { label: "Google Maps — dispositivos móveis", value: 1826 },
      { label: "Pesquisa Google — computadores", value: 1173 },
      { label: "Google Maps — computadores", value: 291 },
    ],
    screenshots: [
      { src: p5.url, caption: "Como as pessoas descobriram a empresa" },
      { src: p0.url, caption: "Interações no Perfil da Empresa" },
      { src: p1.url, caption: "Chamadas" },
      { src: p2.url, caption: "Cliques no chat" },
      { src: p3.url, caption: "Solicitações de rotas" },
      { src: p4.url, caption: "Cliques no website" },
    ],
  },
  {
    slug: "case-clinica-beauty",
    company: "Clínica Beauty",
    segment: "Beleza",
    city: "Nova Friburgo",
    state: "RJ",
    periodLabel: "Abr/2026 → Set/2026",
    periodEnd: "2026-09",
    featured: false,
    totals: { views: 2089, calls: 22, chat: 78, routes: 271, website: 38 },
    months: ["Abr", "Mai", "Jun", "Jul", "Ago", "Set"],
    monthlyApprox: true,
    monthly: {
      calls: [4, 2, 3, 4, 4, 5],
      chat: [10, 12, 12, 13, 22, 9],
      routes: [50, 34, 46, 52, 32, 57],
      website: [6, 8, 4, 9, 4, 7],
    },
    sources: [
      { label: "Pesquisa Google — dispositivos móveis", value: 1177 },
      { label: "Google Maps — dispositivos móveis", value: 470 },
      { label: "Pesquisa Google — computadores", value: 277 },
      { label: "Google Maps — computadores", value: 165 },
    ],
    screenshots: [
      { src: b5.url, caption: "Como as pessoas descobriram a empresa" },
      { src: b0.url, caption: "Interações no Perfil da Empresa" },
      { src: b1.url, caption: "Chamadas" },
      { src: b2.url, caption: "Cliques no chat" },
      { src: b3.url, caption: "Solicitações de rotas" },
      { src: b4.url, caption: "Cliques no website" },
    ],
  },
];

export const SEGMENTS: ("Todos" | Segment)[] = ["Todos", "Odontologia", "Beleza", "Saúde", "Pet", "Serviços", "Comércio", "Outros"];

export const fmt = (n: number) => n.toLocaleString("pt-BR");
export const pct = (before?: number, after?: number) =>
  before && before > 0 && after !== undefined ? Math.round(((after - before) / before) * 100) : null;

export function aggregate(cases: Case[]) {
  const out: Record<MetricKey, number> = { views: 0, calls: 0, chat: 0, routes: 0, website: 0 };
  for (const c of cases) for (const k of Object.keys(out) as MetricKey[]) out[k] += c.totals[k] ?? 0;
  return out;
}
