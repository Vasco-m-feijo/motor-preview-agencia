import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Phone, MapPin, Star, Clock, CheckCircle2, MessageCircle, HelpCircle, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const instant = false;

// Paletas automáticas de fallback para garantir que nenhum lead fique com a mesma cara
const AUTO_THEMES = [
  { primary: '#DC2626', accent: '#16A34A', surface: '#FEF2F2', style: 'dark-premium' },     // Vermelho + Dark
  { primary: '#1D4ED8', accent: '#25D366', surface: '#EFF6FF', style: 'immersive-brand' },  // Azul Royal Imersivo
  { primary: '#D97706', accent: '#15803D', surface: '#FFFBEB', style: 'split-modern' },     // Âmbar / Ouro
  { primary: '#047857', accent: '#2563EB', surface: '#ECFDF5', style: 'immersive-brand' },  // Verde Esmeralda
  { primary: '#4338CA', accent: '#16A34A', surface: '#EEF2FF', style: 'split-modern' },     // Índigo Moderno
  { primary: '#BE123C', accent: '#15803D', surface: '#FFF1F2', style: 'dark-premium' },     // Carmim Premium
];

function getDynamicTheme(slug: string, savedTheme: any) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  const fallback = AUTO_THEMES[Math.abs(hash) % AUTO_THEMES.length];

  // Se o tema salvo no banco ainda for o #1E3A8A padrão, usa a paleta exclusiva gerada pelo slug
  const isDefaultBlue = !savedTheme?.color_primary || savedTheme.color_primary.toUpperCase() === '#1E3A8A';

  return {
    primary: isDefaultBlue ? fallback.primary : savedTheme.color_primary,
    accent: isDefaultBlue ? fallback.accent : (savedTheme.color_accent || '#25D366'),
    surface: isDefaultBlue ? fallback.surface : (savedTheme.color_surface || '#F8FAFC'),
    background: savedTheme?.color_background || '#FFFFFF',
    heroStyle: savedTheme?.hero_style || fallback.style,
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
  const name = lead.business_data?.name || 'Empresa Local';

  return {
    title: seo.title || name,
    description: seo.meta_description || `Conheça ${name}. Solicite atendimento rápido pelo WhatsApp.`,
    openGraph: {
      title: seo.title || name,
      description: seo.meta_description || `Atendimento rápido pelo WhatsApp.`,
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

  const { business_data: biz, site_config: config } = lead;
  const activeTheme = getDynamicTheme(slug, config.theme);
  const hero = config.hero || {};
  const services = config.services || [];
  const differentials = config.differentials || {};
  const testimonials = config.testimonials || [];
  const location = config.location || {};
  const faq = config.faq || [];
  const jsonLd = config.seo?.json_ld || {};

  const customThemeStyles = {
    '--color-primary': activeTheme.primary,
    '--color-accent': activeTheme.accent,
    '--color-surface': activeTheme.surface,
    '--color-background': activeTheme.background,
  } as React.CSSProperties;

  const isDarkHero = activeTheme.heroStyle === 'dark-premium';
  const isBrandHero = activeTheme.heroStyle === 'immersive-brand';
  const isSplitHero = activeTheme.heroStyle === 'split-modern';

  return (
    <div
      style={customThemeStyles}
      className="min-h-screen bg-[var(--color-background)] text-slate-900 font-sans pb-20 md:pb-0"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* TOP BAR DE DESTAQUE NA COR DA MARCA */}
      <div className="bg-[var(--color-primary)] text-white text-xs py-2 px-4 text-center font-medium">
        <span>⭐ Avaliado com nota {biz.rating} ({biz.reviews_count} avaliações no Google) • Atendimento rápido via WhatsApp</span>
      </div>

      {/* 1. HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 truncate max-w-[230px] sm:max-w-xs">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white font-extrabold flex items-center justify-center shrink-0 shadow-xs">
              {(biz.short_name || biz.name || 'E').charAt(0).toUpperCase()}
            </div>
            <span className="font-extrabold text-lg md:text-xl text-slate-900 truncate">
              {biz.short_name || biz.name}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-600 max-w-md truncate">
            <MapPin className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
            <span className="truncate">{biz.address}</span>
          </div>
          <a
            href={hero.cta_whatsapp_url}
            target="_blank"
            rel="noopener noreferrer"
            data-track="whatsapp-click"
            data-location="header"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-[var(--color-accent)] hover:opacity-95 transition shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </header>

      {/* 2. HERO SECTION COM 3 VARIAÇÕES DE LAYOUT E COR */}
      <section
        className={`relative overflow-hidden border-b border-slate-200/80 py-14 md:py-24 ${
          isDarkHero
            ? 'bg-slate-950 text-white'
            : isBrandHero
            ? 'bg-[var(--color-primary)] text-white'
            : 'bg-[var(--color-surface)] text-slate-900'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className={isSplitHero ? 'grid grid-cols-1 lg:grid-cols-12 gap-10 items-center text-left' : 'max-w-4xl mx-auto text-center'}>
            <div className={isSplitHero ? 'lg:col-span-7' : ''}>
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 ${
                  isDarkHero || isBrandHero
                    ? 'bg-white/15 text-white border border-white/20'
                    : 'bg-white text-[var(--color-primary)] border border-slate-200 shadow-2xs'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{hero.badge || `📍 ${biz.category}`}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                {hero.h1}
              </h1>

              <p
                className={`mt-4 text-base sm:text-lg max-w-2xl ${
                  isSplitHero ? '' : 'mx-auto'
                } ${isDarkHero || isBrandHero ? 'text-white/85' : 'text-slate-600'}`}
              >
                {hero.subheadline}
              </p>

              <div className={`mt-8 flex flex-col sm:flex-row items-center gap-4 ${isSplitHero ? '' : 'justify-center'}`}>
                <a
                  href={hero.cta_whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="whatsapp-click"
                  data-location="hero"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-base sm:text-lg text-white bg-[var(--color-accent)] hover:opacity-95 transition shadow-lg w-full sm:w-auto"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{hero.cta_text || 'Solicitar Orçamento no WhatsApp'}</span>
                </a>
              </div>
            </div>

            {/* Card de Prova Social Lateral (Modo Split) ou Centralizado */}
            <div className={isSplitHero ? 'lg:col-span-5' : 'mt-8 flex justify-center'}>
              <div
                className={`rounded-2xl p-6 border ${
                  isDarkHero || isBrandHero
                    ? 'bg-white/10 backdrop-blur border-white/15 text-white'
                    : 'bg-white border-slate-200 shadow-md text-slate-900'
                } ${isSplitHero ? 'w-full' : 'inline-flex flex-col sm:flex-row items-center gap-4 py-3 px-6'}`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-lg font-extrabold">{biz.rating}/5</span>
                </div>
                <div className={isSplitHero ? 'mt-3 pt-3 border-t border-slate-200/30 text-sm' : 'text-xs opacity-85'}>
                  <p className="font-semibold">Destaque em {biz.category}</p>
                  <p className="opacity-80">Baseado em {biz.reviews_count} avaliações reais verificadas no Google Maps.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES GRID */}
      <section className="py-14 md:py-20 max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
            Especialidades
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
            Principais Serviços e Atendimento
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Escolha o serviço desejado abaixo para falar diretamente com nossa equipe no WhatsApp:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((srv: any, idx: number) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 border-t-4 border-t-[var(--color-primary)] shadow-xs flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-primary)] font-extrabold mb-4">
                  0{idx + 1}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{srv.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{srv.description}</p>
              </div>

              <a
                href={srv.whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                data-track="whatsapp-click"
                data-location={`service-card-${idx + 1}`}
                className="mt-6 inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-[var(--color-primary)] hover:opacity-90 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{srv.cta_text || 'Consultar no WhatsApp'}</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TRUST SECTION (Diferenciais) */}
      <section className="py-14 md:py-20 bg-[var(--color-surface)] border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 max-w-2xl mx-auto mb-12">
            {differentials.section_title || `Por que escolher a ${biz.short_name || biz.name}?`}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(differentials.items || []).map((item: any, idx: number) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-14 md:py-20 max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              O que nossos clientes dizem no Google
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Nota {biz.rating} de 5 com base em {biz.reviews_count} avaliações reais verificadas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((rev: any, idx: number) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 italic leading-relaxed line-clamp-5">
                    "{rev.text}"
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-slate-800">{rev.author}</span>
                  <span>{rev.relativeTime}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. FAQ */}
      {faq.length > 0 && (
        <section className="py-14 md:py-20 bg-[var(--color-surface)] border-t border-slate-200">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex items-center justify-center gap-2 mb-8">
              <HelpCircle className="w-6 h-6 text-[var(--color-primary)]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center">
                Perguntas Frequentes
              </h2>
            </div>

            <div className="space-y-4">
              {faq.map((item: any, idx: number) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-base text-slate-900">{item.question}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. LOCATION & OPENING HOURS */}
      <section className="py-14 md:py-20 max-w-6xl mx-auto px-4 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
              <span>Endereço e Localização</span>
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed mb-6">{location.address}</p>

            {location.maps_url && (
              <a
                href={location.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                data-track="maps-click"
                data-location="location-section"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-[var(--color-primary)] text-white hover:opacity-90 transition"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Como Chegar (Abrir no Google Maps)</span>
              </a>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[var(--color-primary)]" />
              <span>Horário de Funcionamento</span>
            </h2>
            {(location.opening_hours || []).length > 0 ? (
              <ul className="space-y-2 text-sm text-slate-600">
                {location.opening_hours.map((line: string, idx: number) => (
                  <li key={idx} className="border-b border-slate-100 pb-1.5 last:border-0">
                    {line}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-600">Consulte nosso atendimento via WhatsApp.</p>
            )}
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-10 text-center text-xs">
        <div className="max-w-6xl mx-auto px-4">
          <p className="font-bold text-white text-sm mb-1">{biz.name}</p>
          <p>{biz.address}</p>
          <p className="mt-4 text-slate-500">
            © {new Date().getFullYear()} • Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* BARRA INFERIOR FIXA MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur border-t border-slate-200 md:hidden z-50">
        <a
          href={hero.cta_whatsapp_url}
          target="_blank"
          rel="noopener noreferrer"
          data-track="whatsapp-click"
          data-location="mobile-sticky-bar"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-white bg-[var(--color-accent)] shadow-md"
        >
          <Phone className="w-4 h-4" />
          <span>Chamar no WhatsApp Agora</span>
        </a>
      </div>
    </div>
  );
}