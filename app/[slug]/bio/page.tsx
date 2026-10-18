'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import {
  MessageCircle,
  MapPin,
  Star,
  QrCode,
  Printer,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import ClickTracker from '../../../components/ClickTracker';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function BioAndQrContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;

  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQrStand, setShowQrStand] = useState(false);

  useEffect(() => {
    if (searchParams?.get('placa') === '1') {
      setShowQrStand(true);
    }
  }, [searchParams]);

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
    }
    loadLead();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-sm">
        Carregando...
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-sm">
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
  const primaryColor = theme.custom_hex || theme.color_primary || '#0284C7';
  const logoUrl = brand.logo_url || '';

  const cleanPhone = (answers.q2_phone || biz.phone || '').toString().replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

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

  // MODO 2: PLACA QR CODE DE BALCÃO PARA IMPRESSÃO
  if (showQrStand) {
    return (
      <div className="min-h-screen bg-slate-200 py-8 px-4 flex flex-col items-center justify-center print:bg-white print:p-0">
        <div className="max-w-md w-full mb-4 flex items-center justify-between print:hidden">
          <button
            onClick={() => setShowQrStand(false)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-800 text-xs font-bold shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Link na Bio</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-extrabold shadow-md hover:bg-slate-800 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Imprimir Placa / Salvar PDF</span>
          </button>
        </div>

        <div
          style={{ '--color-primary': primaryColor } as React.CSSProperties}
          className="bg-white max-w-md w-full rounded-3xl border-4 border-slate-900 p-8 text-center shadow-2xl print:shadow-none print:border-2"
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

          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            {displayName}
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">
            {biz.category}
          </p>

          <div className="my-6 py-4 px-5 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="flex justify-center gap-1.5 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-amber-400" />
              ))}
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Gostou do nosso atendimento?
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Aponte a câmera do seu celular para o QR Code abaixo e deixe sua avaliação no Google em 10 segundos!
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-slate-300 inline-block mx-auto">
            <img
              src={qrCodeImageUrl}
              alt="QR Code de Avaliação no Google"
              width={240}
              height={240}
              className="mx-auto"
            />
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Sua opinião ajuda muito o nosso trabalho!</span>
          </div>
        </div>
      </div>
    );
  }

  // MODO 1: PÁGINA "LINK NA BIO" OTIMIZADA PARA INSTAGRAM
  return (
    <div
      style={{ '--color-primary': primaryColor } as React.CSSProperties}
      className="min-h-screen bg-slate-950 text-white py-10 px-4 flex flex-col items-center justify-between font-sans"
    >
      <ClickTracker slug={slug} ga4Id={brand.ga4_id} />

      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-3">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={displayName}
              className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-[var(--color-primary)] bg-white p-1"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[var(--color-primary)] text-white font-black text-3xl flex items-center justify-center mx-auto shadow-lg">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">{displayName}</h1>
            <p className="text-xs text-slate-400 mt-1">{biz.category}</p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Nota {biz.rating} no Google ({biz.reviews_count} avaliações)</span>
          </div>
        </div>

        <div className="space-y-3">
          <a
            href={mainWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-track="whatsapp-click"
            data-location="bio-main-cta"
            className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl font-extrabold text-base bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg transition"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chamar no WhatsApp Agora</span>
          </a>

          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-track="review-click"
            data-location="bio-review-cta"
            className="flex items-center justify-center gap-2.5 w-full py-3.5 px-5 rounded-2xl font-bold text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 transition"
          >
            <Star className="w-4 h-4 fill-slate-950" />
            <span>Avaliar Nosso Atendimento no Google</span>
          </a>

          <a
            href={`/${slug}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-2xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 transition"
          >
            <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Acessar Nosso Site Completo</span>
          </a>
        </div>

        {(config.services || []).length > 0 && (
          <div className="pt-2 space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
              Orçamento Rápido por Serviço
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
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left transition"
                >
                  <div>
                    <span className="font-bold text-sm text-white block">{srv.title}</span>
                    <span className="text-xs text-slate-400 line-clamp-1">{srv.description}</span>
                  </div>
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-3" />
                </a>
              );
            })}
          </div>
        )}

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
          <div className="flex items-start gap-2.5 text-slate-300">
            <MapPin className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
            <span>{displayAddress}</span>
          </div>
          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-track="maps-click"
            data-location="bio-maps"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold bg-[var(--color-primary)] text-white hover:opacity-90 transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Traçar Rota no Google Maps</span>
          </a>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-slate-900 w-full max-w-md flex flex-col items-center gap-3 text-xs text-slate-500">
        <button
          onClick={() => setShowQrStand(true)}
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white font-semibold cursor-pointer"
        >
          <QrCode className="w-4 h-4 text-[var(--color-primary)]" />
          <span>Gerar Placa QR Code de Balcão (Para Impressão)</span>
        </button>
      </div>
    </div>
  );
}

// Envelopa o componente em <Suspense> para compatibilidade total com o build da Vercel (Next.js cacheComponents)
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