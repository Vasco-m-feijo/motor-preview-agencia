import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  Phone,
  MapPin,
  Star,
  Clock,
  CheckCircle2,
  MessageCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Wrench,
  Award,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const instant = false;

// 8 Paletas Profissionais de Alto Contraste (independentes do padrão repetitivo da IA)
const BRAND_PALETTES = [
  { name: 'Crimson Industrial', primary: '#E11D48', primaryDark: '#9F1239', accent: '#E11D48', surface: '#FFF1F2' },
  { name: 'Royal Sapphire',     primary: '#1D4ED8', primaryDark: '#1E3A8A', accent: '#1D4ED8', surface: '#EFF6FF' },
  { name: 'Emerald Prestige',   primary: '#059669', primaryDark: '#065F46', accent: '#059669', surface: '#ECFDF5' },
  { name: 'Ruby Racing',        primary: '#DC2626', primaryDark: '#7F1D1D', accent: '#DC2626', surface: '#FEF2F2' },
  { name: 'Orange Performance', primary: '#EA580C', primaryDark: '#9A3412', accent: '#F97316', surface: '#FFF7ED' },
  { name: 'Ocean Cyan',         primary: '#0284C7', primaryDark: '#0C4A6E', accent: '#0284C7', surface: '#F0F9FF' },
  { name: 'Indigo Executive',   primary: '#4F46E5', primaryDark: '#312E81', accent: '#4F46E5', surface: '#EEF2FF' },
  { name: 'Amber Gold',         primary: '#D97706', primaryDark: '#78350F', accent: '#D97706', surface: '#FFFBEB' },
];

// 4 Arquétipos Estruturais Completamente Diferentes
type LayoutArchetype = 'dark-carbon' | 'editorial-pill' | 'bento-modern' | 'industrial-bold';
const ARCHETYPES: LayoutArchetype[] = [
  'dark-carbon',     // 0: mello-mechanic-service
  'editorial-pill',  // 1: carecar-auto-center
  'bento-modern',    // 2: Mosaico Bento Assimétrico
  'industrial-bold', // 3: betos-car-tristeza
];

function getDesignSystemForSlug(slug: string) {
  let sum = 0;
  for (let i = 0; i < slug.length; i++) {
    sum += slug.charCodeAt(i);
  }
  const archetype = ARCHETYPES[sum % ARCHETYPES.length];
  const palette = BRAND_PALETTES[sum % BRAND_PALETTES.length];

  return {
    archetype,
    ...palette,
  };
}

async function getLeadBySlug(slug: string) {
  const { data, error } = await supabase
    .from('leads_pipeline')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lead = await getLeadBySlug(slug);
  if (!lead) return { title: 'Página não encontrada' };

  const seo = lead.site_config?.seo || {};
  const answers = lead.briefing_data?.answers || {};
  const name = answers.q1_name || lead.business_data?.name || 'Empresa Local';

  return {
    title: seo.title || name,
    description: seo.meta_description || `Conheça ${name}. Solicite orçamento rápido pelo WhatsApp.`,
    openGraph: {
      title: seo.title || name,
      description: seo.meta_description || `Atendimento direto pelo WhatsApp.`,
      type: 'website',
    },
  };
}

export default async function DynamicLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lead = await getLeadBySlug(slug);

  if (!lead || !lead.site_config) {
    notFound();
  }

  const { business_data: biz, site_config: config, briefing_data: briefing } = lead;
  const answers = briefing?.answers || {};

  // Prioriza os dados revisados pelo cliente no Onboarding (Sprint 3)
  const displayName = answers.q1_name || biz.short_name || biz.name;
  const legalName = answers.q1_name || biz.name;
  const displayAddress = answers.q1_address || config.location?.address || biz.address;
  const displayCnpj = answers.q1_cnpj || '';

  const design = getDesignSystemForSlug(slug);
  const hero = config.hero || {};
  const services = config.services || [];
  const differentials = config.differentials || {};
  const testimonials = config.testimonials || [];
  const location = config.location || {};
  const faq = config.faq || [];
  const jsonLd = config.seo?.json_ld || {};

  const openingHours: string[] = answers.q2_hours
    ? answers.q2_hours.split('\n').filter(Boolean)
    : location.opening_hours || [];

  const customThemeStyles = {
    '--color-primary': design.primary,
    '--color-primary-dark': design.primaryDark,
    '--color-accent': design.accent,
    '--color-surface': design.surface,
  } as React.CSSProperties;

  const isDark = design.archetype === 'dark-carbon';
  const isEditorial = design.archetype === 'editorial-pill';
  const isBento = design.archetype === 'bento-modern';
  const isIndustrial = design.archetype === 'industrial-bold';

  return (
    <div
      style={customThemeStyles}
      className={`min-h-screen font-sans pb-24 md:pb-0 ${
        isDark
          ? 'bg-zinc-950 text-zinc-100'
          : isBento
          ? 'bg-[#FAF8F5] text-stone-900'
          : isIndustrial
          ? 'bg-zinc-100 text-slate-950'
          : 'bg-slate-50 text-slate-900'
      }`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* =====================================================================
          1. HEADER PERSONALIZADO POR ARQUÉTIPO
      ===================================================================== */}
      {isEditorial ? (
        /* HEADER ARQUÉTIPO EDITORIAL: Menu Flutuante em Pílula */
        <div className="sticky top-4 z-40 px-4">
          <header className="max-w-5xl mx-auto bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-full px-6 h-16 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3 truncate">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-black flex items-center justify-center shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="font-extrabold text-base sm:text-lg text-slate-900 truncate">
                {displayName}
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500 max-w-xs truncate">
              <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
              <span className="truncate">{displayAddress}</span>
            </div>
            <a
              href={hero.cta_whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              data-track="whatsapp-click"
              data-location="header"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm text-white bg-[var(--color-primary)] hover:opacity-90 transition shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Atendimento Online</span>
            </a>
          </header>
        </div>
      ) : isIndustrial ? (
        /* HEADER ARQUÉTIPO INDUSTRIAL: Barra Dupla de Alto Contraste e Bordas Fortes */
        <header className="sticky top-0 z-40 bg-white border-b-4 border-slate-950">
          <div className="bg-slate-950 text-white text-[11px] font-bold uppercase tracking-widest py-1.5 px-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <span>★ NOTA {biz.rating}/5 NO GOOGLE ({biz.reviews_count} AVALIAÇÕES)</span>
              <span className="hidden sm:inline">{biz.category}</span>
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[var(--color-primary)] border-2 border-slate-950 text-white font-black text-xl flex items-center justify-center">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="font-black text-lg sm:text-xl uppercase tracking-tight text-slate-950 block leading-none">
                  {displayName}
                </span>
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  Estrutura Especializada
                </span>
              </div>
            </div>
            <a
              href={hero.cta_whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              data-track="whatsapp-click"
              data-location="header"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--color-primary)] text-white font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-0.5 transition"
            >
              <Phone className="w-4 h-4" />
              <span>Orçamento Rápido</span>
            </a>
          </div>
        </header>
      ) : (
        /* HEADER DARK CARBONO OU BENTO */
        <header
          className={`sticky top-0 z-40 backdrop-blur border-b ${
            isDark
              ? 'bg-zinc-950/90 border-zinc-800 text-white'
              : 'bg-[#FAF8F5]/90 border-stone-200 text-stone-900'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 h-18 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)] text-white font-black flex items-center justify-center">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight truncate max-w-[200px] sm:max-w-xs">
                {displayName}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-xs font-semibold opacity-75">
              <a href="#servicos" className="hover:opacity-100">Serviços</a>
              <a href="#diferenciais" className="hover:opacity-100">Diferenciais</a>
              <a href="#avaliacoes" className="hover:opacity-100">Avaliações ({biz.reviews_count})</a>
              <a href="#localizacao" className="hover:opacity-100">Localização</a>
            </div>
            <a
              href={hero.cta_whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              data-track="whatsapp-click"
              data-location="header"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-xs sm:text-sm text-white bg-[var(--color-primary)] hover:opacity-90 transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chamar no WhatsApp</span>
            </a>
          </div>
        </header>
      )}

      {/* =====================================================================
          2. HERO SECTION (4 COMPOSIÇÕES ESTRUTURAIS DISTINTAS)
      ===================================================================== */}
      {isDark && (
        /* HERO 0: DARK CARBONO PERFORMANCE (mello-mechanic-service) */
        <section className="relative py-16 md:py-24 border-b border-zinc-800 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-700 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{hero.badge || biz.category}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.15]">
                {hero.h1}
              </h1>
              <p className="mt-5 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
                {hero.subheadline}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href={hero.cta_whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="whatsapp-click"
                  data-location="hero"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-black text-base text-white bg-[var(--color-primary)] hover:opacity-90 transition shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{hero.cta_text || 'Agendar Atendimento via WhatsApp'}</span>
                </a>
                {location.maps_url && (
                  <a
                    href={location.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-bold text-sm bg-zinc-900 text-zinc-200 border border-zinc-800 hover:bg-zinc-800 transition"
                  >
                    <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                    <span>Traçar Rota no Mapa</span>
                  </a>
                )}
              </div>
            </div>

            {/* Painel Técnico de Reputação */}
            <div className="lg:col-span-5">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 relative">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-5 mb-5">
                  <div>
                    <span className="text-xs font-bold uppercase text-zinc-400">Reputação Verificada</span>
                    <h3 className="text-xl font-extrabold text-white mt-0.5">Google Maps Oficial</h3>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 text-[var(--color-primary)] font-black text-2xl">
                    {biz.rating} ★
                  </div>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                  Mais de <strong>{biz.reviews_count} clientes reais</strong> avaliaram o atendimento de{' '}
                  <strong>{displayName}</strong> na região.
                </p>
                <div className="space-y-2.5 text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <span>Orçamento prévio transparente sem surpresas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <span>Atendimento direto com a equipe técnica</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <span className="truncate">{displayAddress}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {isEditorial && (
        /* HERO 1: EDITORIAL CLEAN & CARD CURVO (carecar-auto-center) */
        <section className="pt-8 pb-16 px-4">
          <div className="max-w-6xl mx-auto bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-3xl p-8 sm:p-14 md:p-20 shadow-xl relative overflow-hidden">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-xs text-white text-xs font-bold mb-6 border border-white/20">
                <Award className="w-4 h-4" />
                <span>{hero.badge || `Referência em ${biz.category}`}</span>
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                {hero.h1}
              </h1>
              <p className="mt-5 text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
                {hero.subheadline}
              </p>
              <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={hero.cta_whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="whatsapp-click"
                  data-location="hero"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-extrabold text-base bg-white text-slate-950 hover:bg-slate-100 transition shadow-lg w-full sm:w-auto"
                >
                  <MessageCircle className="w-5 h-5 text-[var(--color-primary)]" />
                  <span>{hero.cta_text || 'Solicitar Orçamento no WhatsApp'}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Barra Flutuante de Métricas Abaixo do Card Curvo */}
          <div className="max-w-4xl mx-auto -mt-8 relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 px-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md text-center">
              <div className="text-2xl font-black text-[var(--color-primary)]">{biz.rating} / 5.0</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Nota Média no Google</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md text-center">
              <div className="text-2xl font-black text-slate-900">+{biz.reviews_count}</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Avaliações Verificadas</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md text-center">
              <div className="text-2xl font-black text-[var(--color-primary)]">Rápido</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Orçamento via WhatsApp</div>
            </div>
          </div>
        </section>
      )}

      {isBento && (
        /* HERO 2: BENTO GRID ASSIMÉTRICO */
        <section className="py-12 md:py-20 max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8 bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 flex flex-col justify-between shadow-2xs">
              <div>
                <span className="inline-block px-3.5 py-1.5 rounded-full bg-[var(--color-surface)] text-[var(--color-primary)] font-bold text-xs mb-6">
                  {hero.badge || biz.category}
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight">
                  {hero.h1}
                </h1>
                <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
                  {hero.subheadline}
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-4">
                <a
                  href={hero.cta_whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="whatsapp-click"
                  data-location="hero"
                  className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl font-bold text-base text-white bg-[var(--color-primary)] hover:opacity-90 transition w-full sm:w-auto"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{hero.cta_text || 'Falar com Especialista'}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-[var(--color-primary)] text-white rounded-3xl p-7 flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-1 text-amber-300">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-300" />
                  ))}
                </div>
                <div>
                  <div className="text-4xl font-black mt-4">{biz.rating}/5</div>
                  <p className="text-sm text-white/85 mt-1">
                    Aprovado por {biz.reviews_count} clientes no Google Maps.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-7 border border-stone-200">
                <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Localização Fácil</span>
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">{displayAddress}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {isIndustrial && (
        /* HERO 3: INDUSTRIAL FORTE / ALTO CONTRASTE (betos-car-tristeza) */
        <section className="py-14 md:py-20 bg-white border-b-4 border-slate-950">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-block px-3 py-1 bg-slate-950 text-white text-xs font-black uppercase tracking-widest mb-5">
                {hero.badge || biz.category}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-950 leading-none">
                {hero.h1}
              </h1>
              <p className="mt-5 text-base sm:text-lg font-medium text-slate-700 max-w-2xl leading-relaxed">
                {hero.subheadline}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href={hero.cta_whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="whatsapp-click"
                  data-location="hero"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[var(--color-primary)] text-white font-black uppercase tracking-wider text-base border-2 border-slate-950 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:translate-y-0.5 transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{hero.cta_text || 'Solicitar Orçamento Agora'}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-[var(--color-surface)] border-4 border-slate-950 p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                <div className="text-xs font-black uppercase tracking-widest text-slate-600">
                  Avaliação Oficial Google
                </div>
                <div className="text-5xl font-black text-slate-950 my-2">{biz.rating} ★</div>
                <p className="text-xs font-bold text-slate-700 uppercase">
                  Baseado em {biz.reviews_count} opiniões reais de clientes atendidos.
                </p>
                <div className="mt-4 pt-4 border-t-2 border-slate-950 text-xs font-bold text-slate-800 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                  <span>{displayAddress}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          3. SEÇÃO DE SERVIÇOS (ESTRUTURAS DISTINTAS POR ARQUÉTIPO)
      ===================================================================== */}
      <section id="servicos" className="py-16 md:py-24 max-w-6xl mx-auto px-4">
        <div className={`mb-12 ${isIndustrial ? 'border-l-8 border-[var(--color-primary)] pl-5' : 'text-center max-w-2xl mx-auto'}`}>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
            Especialidades & Orçamento Direto
          </span>
          <h2 className={`mt-1 text-2xl sm:text-4xl font-black ${isIndustrial ? 'uppercase' : ''}`}>
            Principais Serviços de {displayName}
          </h2>
          <p className={`mt-2 text-sm sm:text-base ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
            Clique no serviço desejado para receber atendimento imediato pelo WhatsApp:
          </p>
        </div>

        {isDark ? (
          /* SERVIÇOS EM LISTA HORIZONTAL EXECUTIVA (mello-mechanic-service) */
          <div className="space-y-4">
            {services.map((srv: any, idx: number) => (
              <div
                key={idx}
                className="bg-zinc-900 border border-zinc-800 hover:border-[var(--color-primary)] rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-lg bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 text-[var(--color-primary)] font-black text-lg flex items-center justify-center shrink-0">
                    0{idx + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-white">{srv.title}</h3>
                    <p className="mt-1.5 text-sm text-zinc-400 max-w-2xl leading-relaxed">
                      {srv.description}
                    </p>
                  </div>
                </div>
                <a
                  href={srv.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="whatsapp-click"
                  data-location={`service-card-${idx + 1}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-bold text-sm text-white bg-[var(--color-primary)] hover:opacity-90 transition shrink-0 w-full md:w-auto"
                >
                  <span>{srv.cta_text || 'Consultar Valor'}</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        ) : isIndustrial ? (
          /* SERVIÇOS ESTILO INDUSTRIAL COM CABEÇALHO PRETO (betos-car-tristeza) */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((srv: any, idx: number) => (
              <div
                key={idx}
                className="bg-white border-2 border-slate-950 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between"
              >
                <div>
                  <div className="bg-slate-950 text-white px-5 py-3 flex items-center justify-between">
                    <span className="font-black text-xs uppercase tracking-widest text-[var(--color-primary)]">
                      SERVIÇO #{idx + 1}
                    </span>
                    <Wrench className="w-4 h-4 text-white/70" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-black uppercase text-slate-950">{srv.title}</h3>
                    <p className="mt-3 text-sm font-medium text-slate-600 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <a
                    href={srv.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="whatsapp-click"
                    data-location={`service-card-${idx + 1}`}
                    className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-[var(--color-primary)] text-white font-black text-xs uppercase tracking-wider border-2 border-slate-950 hover:opacity-95 transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{srv.cta_text || 'Pedir Orçamento'}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* SERVIÇOS EDITORIAL / BENTO (carecar-auto-center) */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((srv: any, idx: number) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface)] text-[var(--color-primary)] flex items-center justify-center font-black text-base mb-5">
                    0{idx + 1}
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">{srv.title}</h3>
                  <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{srv.description}</p>
                </div>
                <a
                  href={srv.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="whatsapp-click"
                  data-location={`service-card-${idx + 1}`}
                  className="mt-7 inline-flex items-center justify-between w-full py-3.5 px-5 rounded-2xl font-bold text-sm text-white bg-[var(--color-primary)] hover:opacity-90 transition"
                >
                  <span>{srv.cta_text || 'Consultar no WhatsApp'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =====================================================================
          4. DIFERENCIAIS COMPETITIVOS
      ===================================================================== */}
      <section
        id="diferenciais"
        className={`py-16 md:py-24 border-y ${
          isDark
            ? 'bg-zinc-900/70 border-zinc-800'
            : isIndustrial
            ? 'bg-[var(--color-primary)] text-white border-y-4 border-slate-950'
            : 'bg-[var(--color-surface)] border-slate-200'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className={`text-2xl sm:text-3xl font-black text-center max-w-2xl mx-auto mb-12 ${isIndustrial ? 'uppercase text-white' : ''}`}>
            {differentials.section_title || `Por que escolher ${displayName}?`}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(differentials.items || []).map((item: any, idx: number) => (
              <div
                key={idx}
                className={
                  isDark
                    ? 'bg-zinc-950 p-7 rounded-xl border border-zinc-800'
                    : isIndustrial
                    ? 'bg-white text-slate-950 p-7 border-2 border-slate-950 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]'
                    : 'bg-white p-7 rounded-3xl border border-slate-200/80 shadow-2xs'
                }
              >
                <ShieldCheck className="w-8 h-8 text-[var(--color-primary)] mb-4" />
                <h3 className="font-extrabold text-lg">{item.title}</h3>
                <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. DEPOIMENTOS REAIS DO GOOGLE MAPS
      ===================================================================== */}
      {testimonials.length > 0 && (
        <section id="avaliacoes" className="py-16 md:py-24 max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
              Prova Social Verificada
            </span>
            <h2 className={`mt-1 text-2xl sm:text-3xl font-black ${isIndustrial ? 'uppercase' : ''}`}>
              O que dizem os clientes de {displayName}
            </h2>
            <p className={`mt-2 text-sm ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              Nota {biz.rating} de 5 baseada em {biz.reviews_count} avaliações públicas no Google.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((rev: any, idx: number) => (
              <div
                key={idx}
                className={
                  isDark
                    ? 'bg-zinc-900 p-7 rounded-xl border border-zinc-800 flex flex-col justify-between'
                    : isIndustrial
                    ? 'bg-white p-7 border-2 border-slate-950 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between'
                    : 'bg-white p-7 rounded-3xl border border-slate-200 shadow-2xs flex flex-col justify-between'
                }
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className={`text-sm italic leading-relaxed line-clamp-5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                    &ldquo;{rev.text}&rdquo;
                  </p>
                </div>
                <div className={`mt-5 pt-4 border-t flex items-center justify-between text-xs ${isDark ? 'border-zinc-800 text-zinc-400' : 'border-slate-100 text-slate-500'}`}>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{rev.author}</span>
                  <span>{rev.relativeTime}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          6. FAQ ESTRATÉGICO
      ===================================================================== */}
      {faq.length > 0 && (
        <section
          className={`py-16 md:py-24 border-t ${
            isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-[var(--color-surface)] border-slate-200'
          }`}
        >
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center gap-2 mb-10">
              <HelpCircle className="w-6 h-6 text-[var(--color-primary)]" />
              <h2 className={`text-2xl sm:text-3xl font-black text-center ${isIndustrial ? 'uppercase' : ''}`}>
                Dúvidas Frequentes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faq.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className={
                    isDark
                      ? 'bg-zinc-900 p-6 rounded-xl border border-zinc-800'
                      : isIndustrial
                      ? 'bg-white p-6 border-2 border-slate-950'
                      : 'bg-white p-6 rounded-2xl border border-slate-200'
                  }
                >
                  <h3 className="font-extrabold text-base">{item.question}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          7. LOCALIZAÇÃO E HORÁRIOS
      ===================================================================== */}
      <section id="localizacao" className="py-16 md:py-24 max-w-6xl mx-auto px-4 border-t border-slate-200/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className={
              isDark
                ? 'bg-zinc-900 p-8 rounded-2xl border border-zinc-800'
                : isIndustrial
                ? 'bg-white p-8 border-2 border-slate-950 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]'
                : 'bg-white p-8 rounded-3xl border border-slate-200'
            }
          >
            <h2 className="text-xl font-black flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
              <span>Endereço e Como Chegar</span>
            </h2>
            <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
              {displayAddress}
            </p>
            {location.maps_url && (
              <a
                href={location.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                data-track="maps-click"
                data-location="location-section"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-[var(--color-primary)] text-white hover:opacity-90 transition"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir Rota no Google Maps</span>
              </a>
            )}
          </div>

          <div
            className={
              isDark
                ? 'bg-zinc-900 p-8 rounded-2xl border border-zinc-800'
                : isIndustrial
                ? 'bg-white p-8 border-2 border-slate-950 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]'
                : 'bg-white p-8 rounded-3xl border border-slate-200'
            }
          >
            <h2 className="text-xl font-black flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[var(--color-primary)]" />
              <span>Horário de Atendimento</span>
            </h2>
            {openingHours.length > 0 ? (
              <ul className={`space-y-2 text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                {openingHours.map((line: string, idx: number) => (
                  <li key={idx} className="border-b border-slate-500/15 pb-1.5 last:border-0">
                    {line}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                Consulte disponibilidade imediata pelo nosso WhatsApp.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
          8. FOOTER
      ===================================================================== */}
      <footer className="bg-slate-950 text-slate-400 py-12 text-center text-xs border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <p className="font-extrabold text-white text-base mb-1">{legalName}</p>
          <p>{displayAddress}</p>
          {displayCnpj && <p className="mt-1 text-slate-500">CNPJ: {displayCnpj}</p>}
          <p className="mt-5 text-slate-600">
            © {new Date().getFullYear()} {displayName} • Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* BARRA INFERIOR FIXA MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-slate-950/95 backdrop-blur border-t border-slate-800 md:hidden z-50">
        <a
          href={hero.cta_whatsapp_url}
          target="_blank"
          rel="noopener noreferrer"
          data-track="whatsapp-click"
          data-location="mobile-sticky-bar"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-extrabold text-white bg-[var(--color-primary)] shadow-lg"
        >
          <Phone className="w-4 h-4" />
          <span>Falar com {displayName} no WhatsApp</span>
        </a>
      </div>
    </div>
  );
}