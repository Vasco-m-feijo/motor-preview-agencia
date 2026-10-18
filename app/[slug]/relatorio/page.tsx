'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import {
  BarChart3,
  MousePointerClick,
  MessageCircle,
  MapPin,
  Star,
  Calendar,
  Printer,
  Share2,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function MonthlyReportContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const [lead, setLead] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [daysFilter, setDaysFilter] = useState<number>(30);

  useEffect(() => {
    async function loadReport() {
      if (!slug) return;
      setLoading(true);

      const { data: leadData } = await supabase
        .from('leads_pipeline')
        .select('*')
        .eq('slug', slug)
        .single();

      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - daysFilter);

      const { data: clickData } = await supabase
        .from('click_events')
        .select('*')
        .eq('slug', slug)
        .gte('created_at', sinceDate.toISOString())
        .order('created_at', { ascending: false });

      setLead(leadData);
      setEvents(clickData || []);
      setLoading(false);
    }

    loadReport();
  }, [slug, daysFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-sm text-slate-600">
        Calculando métricas do relatório...
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-sm text-slate-600">
        Relatório não encontrado.
      </div>
    );
  }

  const biz = lead.business_data || {};
  const answers = lead.briefing_data?.answers || {};
  const displayName = answers.q1_name || biz.short_name || biz.name;
  const cleanPhone = (answers.q2_phone || biz.phone || '').toString().replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

  const totalClicks = events.length;
  const whatsappClicks = events.filter((e) => e.event_type === 'whatsapp-click').length;
  const mapsClicks = events.filter((e) => e.event_type === 'maps-click').length;
  const reviewClicks = events.filter((e) => e.event_type === 'review-click').length;

  // Agrupamento por origem do clique (location)
  const locationMap: Record<string, number> = {};
  events.forEach((ev) => {
    const loc = ev.location || 'outros';
    locationMap[loc] = (locationMap[loc] || 0) + 1;
  });

  const sortedLocations = Object.entries(locationMap).sort((a, b) => b[1] - a[1]);

  function translateLocation(loc: string) {
    const dictionary: Record<string, string> = {
      hero: 'Botão Principal do Topo (Hero)',
      header: 'Menu Superior (Header)',
      'mobile-sticky-bar': 'Barra Fixa Mobile (Celular)',
      'service-card-1': 'Card do 1º Serviço Principal',
      'service-card-2': 'Card do 2º Serviço Principal',
      'service-card-3': 'Card do 3º Serviço Principal',
      'triage-modal-submit': 'Ficha de Pré-Atendimento (Triagem)',
      'triage-banner-open': 'Abertura do Assistente de Triagem',
      'bio-main-cta': 'Link na Bio do Instagram (WhatsApp)',
      'bio-review-cta': 'Placa QR Code / Avaliação Google',
      'location-section': 'Botão Traçar Rota no Google Maps',
    };
    return dictionary[loc] || `Botão: ${loc}`;
  }

  function sendReportViaWhatsApp() {
    const topOrigin = sortedLocations[0]
      ? `${translateLocation(sortedLocations[0][0])} (${sortedLocations[0][1]} cliques)`
      : 'Botão Principal de Orçamento';

    const reportText = `📊 *RELATÓRIO DE PERFORMANCE DIGITAL — ${displayName.toUpperCase()}*
📅 *Período analisado:* Últimos ${daysFilter} dias

✅ *Total de Interações Rastreadas:* ${totalClicks} ações
💬 *Cliques diretos para o WhatsApp:* ${whatsappClicks} solicitações
📍 *Rotas traçadas para o endereço:* ${mapsClicks} clientes
⭐ *Acessos à Placa de Avaliação Google:* ${reviewClicks} acessos

🏆 *Canal Campeão de Conversão:*
${topOrigin}

🔗 *Painel em tempo real:*
${typeof window !== 'undefined' ? window.location.href : ''}`;

    window.open(
      `https://wa.me/${formattedPhone}?text=${encodeURIComponent(reportText)}`,
      '_blank'
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-10 px-4 font-sans print:bg-white print:p-0">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Barra de Topo */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Pacote Ecossistema & Automação • Relatório Oficial</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">{displayName}</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Monitoramento em tempo real de cliques no WhatsApp, pré-atendimentos e rotas no Google Maps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 print:hidden">
            <select
              value={daysFilter}
              onChange={(e) => setDaysFilter(Number(e.target.value))}
              className="rounded-xl bg-slate-800 border border-slate-700 text-white px-3.5 py-2.5 text-xs font-bold"
            >
              <option value={7}>Últimos 7 dias</option>
              <option value={30}>Últimos 30 dias</option>
              <option value={90}>Últimos 90 dias</option>
            </select>

            <button
              onClick={sendReportViaWhatsApp}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Enviar Resumo no WhatsApp do Cliente</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Salvar PDF</span>
            </button>
          </div>
        </div>

        {/* 4 Indicadores Principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">Total de Ações</span>
              <MousePointerClick className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{totalClicks}</div>
            <p className="text-xs text-slate-500 mt-1">Interações nos últimos {daysFilter} dias</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">Cliques WhatsApp</span>
              <MessageCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-600">{whatsappClicks}</div>
            <p className="text-xs text-slate-500 mt-1">Oportunidades reais de orçamento</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">Rotas Traçadas</span>
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-blue-600">{mapsClicks}</div>
            <p className="text-xs text-slate-500 mt-1">Visitas guiadas pelo Google Maps</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">Avaliações QR/Bio</span>
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-500">{reviewClicks}</div>
            <p className="text-xs text-slate-500 mt-1">Cliques para avaliar 5 estrelas</p>
          </div>
        </div>

        {/* Ranking de Origem dos Cliques */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <h2 className="text-base font-extrabold text-slate-900 mb-4">
              Quais botões e serviços mais geraram clientes?
            </h2>

            {sortedLocations.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">
                Nenhum clique registrado neste período ainda. Faça um clique de teste na página principal para ver o gráfico!
              </p>
            ) : (
              <div className="space-y-3.5">
                {sortedLocations.map(([loc, count]) => {
                  const pct = totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0;
                  return (
                    <div key={loc} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">{translateLocation(loc)}</span>
                        <span className="text-slate-600">
                          {count} cliques ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className="h-full bg-indigo-600 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Últimas Conversões em Tempo Real */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <h2 className="text-base font-extrabold text-slate-900 mb-4">
              Últimos Cliques Registrados
            </h2>

            {events.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">
                Aguardando primeiros cliques.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {events.slice(0, 12).map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold text-slate-800">
                        {translateLocation(ev.location)}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {new Date(ev.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MonthlyReportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 flex items-center justify-center text-sm">
          Carregando relatório...
        </div>
      }
    >
      <MonthlyReportContent />
    </Suspense>
  );
}