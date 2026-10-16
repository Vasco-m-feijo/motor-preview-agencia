import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Phone, MapPin, Star, Clock, CheckCircle2, MessageCircle, HelpCircle, ExternalLink } from 'lucide-react';

// Inicializa o cliente Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const instant = false;

async function getLeadBySlug(slug: string) {
  const { data, error } = await supabase
    .from('leads_pipeline')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data;
}

// Gera dinamicamente o Title Tag e Meta Description para SEO Local e miniatura no WhatsApp (Open Graph)
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
  const theme = config.theme || {};
  const hero = config.hero || {};
  const services = config.services || [];
  const differentials = config.differentials || {};
  const testimonials = config.testimonials || [];
  const location = config.location || {};
  const faq = config.faq || [];
  const jsonLd = config.seo?.json_ld || {};

  // Design Tokens dinâmicos extraídos do site_config
  const customThemeStyles = {
    '--color-primary': theme.color_primary || '#1E3A8A',
    '--color-accent': theme.color_accent || '#25D366',
    '--color-surface': theme.color_surface || '#F8FAFC',
    '--color-background': theme.color_background || '#FFFFFF',
  } as React.CSSProperties;

  return (
    <div
      style={customThemeStyles}
      className="min-h-screen bg-[var(--color-background)] text-slate-900 font-sans pb-20 md:pb-0"
    >
      {/* Script Estruturado JSON-LD (Schema.org LocalBusiness) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-lg md:text-xl text-[var(--color-primary)] truncate max-w-[200px] sm:max-w-xs">
            {biz.short_name || biz.name}
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm text-white bg-[var(--color-accent)] hover:opacity-95 transition shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </header>

      {/* 2. HERO SECTION (Primeira Dobra) */}
      <section className="bg-[var(--color-surface)] border-b border-slate-200/80 py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-700 mb-6 shadow-2xs">
            <span>{hero.badge || `📍 ${biz.category}`}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight max-w-3xl mx-auto">
            {hero.h1}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            {hero.subheadline}
          </p>

          {/* Prova Social Rápida do Google */}
          <div className="mt-6 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-2xs">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-800">{biz.rating}</span>
            <span className="text-xs text-slate-500">({biz.reviews_count} avaliações no Google)</span>
          </div>

          <div className="mt-8">
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
      </section>

      {/* 3. SERVICES GRID (Serviços Principais com Link Individual) */}
      <section className="py-14 md:py-20 max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
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
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-[var(--color-primary)] transition"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-primary)] font-bold mb-4">
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
                className="mt-6 inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-[var(--color-primary)] hover:opacity-90 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{srv.cta_text || 'Consultar no WhatsApp'}</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TRUST SECTION (Diferenciais Competitivos) */}
      <section className="py-14 md:py-20 bg-[var(--color-surface)] border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 max-w-2xl mx-auto mb-12">
            {differentials.section_title || `Por que escolher a ${biz.short_name || biz.name}?`}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(differentials.items || []).map((item: any, idx: number) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200">
                <CheckCircle2 className="w-7 h-7 text-[var(--color-accent)] mb-3" />
                <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS (Avaliações Reais do Google Maps) */}
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
                  <span className="font-semibold text-slate-800">{rev.author}</span>
                  <span>{rev.relativeTime}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. FAQ ESTRATÉGICO */}
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
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-slate-900 text-white hover:bg-slate-800 transition"
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
      <footer className="bg-slate-900 text-slate-400 py-10 text-center text-xs">
        <div className="max-w-6xl mx-auto px-4">
          <p className="font-semibold text-white text-sm mb-1">{biz.name}</p>
          <p>{biz.address}</p>
          <p className="mt-4 text-slate-500">
            © {new Date().getFullYear()} • Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* BARRA INFERIOR FIXA MOBILE (Foco em Conversão Mobile-First) */}
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