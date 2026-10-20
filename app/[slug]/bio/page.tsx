'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import {
  MessageCircle,
  MapPin,
  Star,
  Printer,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Lock,
} from 'lucide-react';
import ClickTracker from '../../../components/ClickTracker';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Mesma senha mestra do seu /painel
const ADMIN_MASTER_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'tracao2026';

const BIO_PALETTES: Record<string, string> = {
  'Crimson Industrial': '#E11D48',
  'Royal Sapphire': '#1D4ED8',
  'Emerald Prestige': '#059669',
  'Ruby Racing': '#DC2626',
  'Orange Performance': '#EA580C',
  'Ocean Cyan': '#0284C7',
  'Indigo Executive': '#4F46E5',
  'Amber Gold': '#D97706',
};

function BioAndQrContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const isPlacaMode = searchParams?.get('placa') === '1';

  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorizedForPlaca, setIsAuthorizedForPlaca] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    async function loadLead() {
      if (!slug) return;
      const { data } = await supabase
        .from('leads_pipeline')
        .select('*')
        .eq('slug', slug)
        .single();
      setLead(data);
      setLoading(false);

      if (typeof window !== 'undefined') {
        const savedAdmin = localStorage.getItem('agencia_admin_auth');
        if (savedAdmin === ADMIN_MASTER_PASS) {
          setIsAuthorizedForPlaca(true);
        }
      }
    }
    loadLead();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center text-sm">
        Carregando...
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center text-sm">
        Estabelecimento não encontrado.
      </div>
    );
  }

  const biz = lead.business_data || {};
  const config = lead.site_config || {};
  const answers = lead.briefing_data?.answers || {};
  const brand = config.brand || {};
  const theme = config.theme || {};

  const displayName = answers.q1_name || biz.short_name || biz.name;
  const displayAddress = answers.q1_address || config.location?.address || biz.address;

  // Lê a cor customizada da logo, a paleta escolhida no /painel ou a cor primária salva
  const paletteHex = theme.palette_name ? BIO_PALETTES[theme.palette_name] : null;
  const primaryColor =
    theme.custom_hex ||
    paletteHex ||
    theme.color_primary ||
    '#DC2626';

  const logoUrl = brand.logo_url || '';

  const cleanPhone = (answers.q2_phone || biz.phone || '').toString().replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

  const ownerPin = brand.client_pin || cleanPhone.slice(-4) || '1234';

  const mainWaUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
    `Olá! Vim pelo Link da Bio da ${displayName} e gostaria de atendimento.`
  )}`;

  const reviewUrl =
    brand.google_review_url ||
    config.location?.maps_url ||
    biz.maps_url ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      displayName + ' ' + displayAddress
    )}`;

  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data=${encodeURIComponent(
    reviewUrl
  )}`;

  const rawWebsite =
    lead.custom_domain ||
    brand.custom_domain ||
    biz.current_website ||
    (slug === 'fgmotors' ? 'https://fgmotorsoficina.com' : '');

  const officialSiteUrl = rawWebsite
    ? rawWebsite.startsWith('http')
      ? rawWebsite
      : `https://${rawWebsite}`
    : `/${slug}`;

  function handleVerifyPin(e: React.FormEvent) {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_MASTER_PASS || pinInput.trim() === ownerPin) {
      setIsAuthorizedForPlaca(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  }

  // =========================================================================
  // MODO PLACA QR CODE (PROTEGIDO CONTRA VISITANTES COMUNS)
  // =========================================================================
  if (isPlacaMode) {
    if (!isAuthorizedForPlaca) {
      return (
        <div
          style={{ '--color-primary': primaryColor } as React.CSSProperties}
          className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4 font-sans"
        >
          <form
            onSubmit={handleVerifyPin}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/15 text-[var(--color-primary)] flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-extrabold">Impressão de Placa QR Code</h1>
            <p className="text-xs text-zinc-400">
              Área exclusiva do proprietário de <strong>{displayName}</strong>. Digite seu código de 4 dígitos para abrir a placa de balcão:
            </p>
            <input
              type="password"
              placeholder="Código de acesso..."
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-4 py-3 text-center text-sm font-bold text-white"
            />
            {pinError && (
              <p className="text-xs text-rose-400 font-semibold">
                Código incorreto. Solicite o código ao suporte da agência.
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider cursor-pointer"
            >
              Liberar Placa para Impressão
            </button>
          </form>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-zinc-200 py-8 px-4 flex flex-col items-center justify-center print:bg-white print:p-0">
        <div className="max-w-md w-full mb-4 flex items-center justify-end print:hidden">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-extrabold shadow-md hover:bg-zinc-800 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>Imprimir Placa / Salvar PDF</span>
          </button>
        </div>

        <div
          style={{ '--color-primary': primaryColor } as React.CSSProperties}
          className="bg-white max-w-md w-full rounded-3xl border-4 border-[var(--color-primary)] p-8 text-center shadow-2xl print:shadow-none print:border-2"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={displayName}
              className="h-16 w-auto mx-auto object-contain mb-3"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)] text-white font-black text-3xl flex items-center justify-center mx-auto mb-3">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">
            {displayName}
          </h1>
          <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mt-0.5">
            {biz.category}
          </p>

          <div className="my-6 py-4 px-5 rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="flex justify-center gap-1.5 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-amber-400" />
              ))}
            </div>
            <h2 className="text-lg font-extrabold text-zinc-900">
              Gostou do nosso atendimento?
            </h2>
            <p className="text-xs text-zinc-600 mt-1">
              Aponte a câmera do seu celular para o código abaixo e deixe sua avaliação no Google em 10 segundos!
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-[var(--color-primary)] inline-block mx-auto">
            <img
              src={qrCodeImageUrl}
              alt="QR Code de Avaliação no Google"
              width={240}
              height={240}
              className="mx-auto"
            />
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-zinc-700">
            <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Sua opinião ajuda muito o nosso trabalho!</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MODO PÁGINA "LINK NA BIO" (COM AS CORES DA IDENTIDADE DA EMPRESA)
  // =========================================================================
  return (
    <div
      style={{ '--color-primary': primaryColor } as React.CSSProperties}
      className="min-h-screen bg-zinc-950 text-white py-10 px-4 flex flex-col items-center justify-between font-sans relative overflow-hidden"
    >
      {/* Faixa superior e brilho suave na cor exata da empresa */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-[var(--color-primary)]" />
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: primaryColor }}
      />

      <ClickTracker slug={slug} ga4Id={brand.ga4_id} />

      <div className="max-w-md w-full space-y-6 relative z-10">
        <div className="text-center space-y-3">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={displayName}
              className="w-24 h-24 rounded-2xl object-contain mx-auto border-2 border-[var(--color-primary)] bg-zinc-900 p-2 shadow-xl"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-[var(--color-primary)] text-white font-black text-3xl flex items-center justify-center mx-auto shadow-lg">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">{displayName}</h1>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)] mt-1">
              {biz.category}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Nota {biz.rating} no Google ({biz.reviews_count} avaliações)</span>
          </div>
        </div>

        {/* Botões Principais com a Cor da Empresa em Destaque */}
        <div className="space-y-3">
          <a
            href={mainWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-track="whatsapp-click"
            data-location="bio-main-cta"
            className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl font-extrabold text-base bg-[var(--color-primary)] hover:opacity-90 text-white shadow-lg transition"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chamar no WhatsApp Agora</span>
          </a>

          <a
            href={officialSiteUrl}
            target={rawWebsite ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-2xl font-bold text-sm bg-zinc-900 hover:bg-zinc-800 text-white border border-[var(--color-primary)]/40 transition"
          >
            <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Acessar Nosso Site Oficial</span>
          </a>

          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-track="review-click"
            data-location="bio-review-cta"
            className="flex items-center justify-center gap-2.5 w-full py-3.5 px-5 rounded-2xl font-bold text-sm bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-zinc-800 transition"
          >
            <Star className="w-4 h-4 fill-amber-400" />
            <span>Avaliar Nosso Atendimento no Google</span>
          </a>
        </div>

        {(config.services || []).length > 0 && (
          <div className="pt-2 space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 text-center">
              Atendimento Rápido por Especialidade
            </p>
            {(config.services || []).map((srv: any, idx: number) => {
              const srvWa = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
                srv.whatsapp_text || `Olá! Vim pelo Instagram e quero saber sobre ${srv.title}.`
              )}`;
              return (
                <a
                  key={idx}
                  href={srvWa}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="whatsapp-click"
                  data-location={`bio-service-${idx + 1}`}
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 hover:border-[var(--color-primary)]/60 text-left transition group"
                >
                  <div>
                    <span className="font-bold text-sm text-white block group-hover:text-[var(--color-primary)] transition">
                      {srv.title}
                    </span>
                    <span className="text-xs text-zinc-400 line-clamp-1">{srv.description}</span>
                  </div>
                  <MessageCircle className="w-4 h-4 text-[var(--color-primary)] shrink-0 ml-3" />
                </a>
              );
            })}
          </div>
        )}

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3 text-xs">
          <div className="flex items-start gap-2.5 text-zinc-300">
            <MapPin className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
            <span>{displayAddress}</span>
          </div>
          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-track="maps-click"
            data-location="bio-maps"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 transition"
          >
            <ExternalLink className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Traçar Rota no Google Maps</span>
          </a>
        </div>
      </div>

      <div className="mt-10 pt-4 text-center text-[11px] text-zinc-600 relative z-10">
        © {new Date().getFullYear()} {displayName}
      </div>
    </div>
  );
}

export default function BioAndQrPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-sm font-sans">
          Carregando página...
        </div>
      }
    >
      <BioAndQrContent />
    </Suspense>
  );
}