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
  Printer,
  Share2,
  CheckCircle2,
  Lock,
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ADMIN_MASTER_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'tracao2026';

function MonthlyReportContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const [lead, setLead] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [daysFilter, setDaysFilter] = useState<number>(30);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isAdminSession, setIsAdminSession] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAdmin = localStorage.getItem('agencia_admin_auth');
      const savedClient = sessionStorage.getItem(`report_auth_${slug}`);
      if (savedAdmin === ADMIN_MASTER_PASS) {
        setIsUnlocked(true);
        setIsAdminSession(true);
      } else if (savedClient === 'ok') {
        setIsUnlocked(true);
      }
    }
  }, [slug]);

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
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-sm">
        Carregando relatório...
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-sm">
        Relatório não encontrado.
      </div>
    );
  }

  const biz = lead.business_data || {};
  const answers = lead.briefing_data?.answers || {};
  const brand = lead.site_config?.brand || {};
  const displayName = answers.q1_name || biz.short_name || biz.name;
  const cleanPhone = (answers.q2_phone || biz.phone || '').toString().replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

  // PIN do proprietário: PIN definido no painel ou 4 últimos números do telefone da empresa
  const ownerPin = brand.client_pin || cleanPhone.slice(-4) || '1234';

  function handleUnlockReport(e: React.FormEvent) {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_MASTER_PASS) {
      setIsUnlocked(true);
      setIsAdminSession(true);
      setPinError(false);
    } else if (pinInput.trim() === ownerPin) {
      setIsUnlocked(true);
      sessionStorage.setItem(`report_auth_${slug}`, 'ok');
      setPinError(false);
    } else {
      setPinError(true);
    }
  }

  // TELA DE BLOQUEIO POR SENHA / PIN DO PROPRIETÁRIO
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 font-sans">
        <form
          onSubmit={handleUnlockReport}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 block">
            Acesso Restrito ao Proprietário
          </span>
          <h1 className="text-xl font-extrabold">{displayName}</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Digite o seu Código de Acesso de 4 dígitos para visualizar o relatório de resultados da sua página:
          </p>
          <input
            type="password"
            placeholder="Digite seu código..."
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-center text-sm font-bold text-white"
          />
          {pinError && (
            <p className="text-xs text-rose-400 font-semibold">
              Código inválido. Verifique o código enviado no seu WhatsApp.
            </p>
          )}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider cursor-pointer"
          >
            Acessar Relatório
          </button>
        </form>
      </div>
    );
  }

  const totalClicks = events.length;
  const whatsappClicks = events.filter((e) => e.event_type === 'whatsapp-click').length;
  const mapsClicks = events.filter((e) => e.event_type === 'maps-click').length;
  const reviewClicks = events.filter((e) => e.event_type === 'review-click').length;

  const locationMap: Record<string, number> = {};
  events.forEach((ev) => {
    const loc = ev.location || 'outros';
    locationMap[loc] = (locationMap[loc] || 0) + 1;
  });

  const sortedLocations = Object.entries(locationMap).sort((a, b) => b[1] - a[1]);

  function translateLocation(loc: string) {
    const dictionary: Record<string, string> = {
      hero: 'Botão Principal do Topo',
      header: 'Botão do Menu Superior',
      'mobile-sticky-bar': 'Barra Fixa no Celular',
      'service-card-1': '1º Serviço Principal',
      'service-card-2': '2º Serviço Principal',
      'service-card-3': '3º Serviço Principal',
      'triage-modal-submit': 'Ficha de Pré-Atendimento (Triagem)',
      'triage-banner-open': 'Abertura do Pré-Atendimento',
      'bio-main-cta': 'Link do Perfil do Instagram (WhatsApp)',
      'bio-review-cta': 'Placa QR Code / Avaliação Google',
      'location-section': 'Botão Como Chegar (Google Maps)',
    };
    return dictionary[loc] || `Atalho: ${loc}`;
  }

  function sendReportViaWhatsApp() {
    const topOrigin = sortedLocations[0]
      ? `${translateLocation(sortedLocations[0][0])} (${sortedLocations[0][1]} cliques)`
      : 'Botão Principal de Orçamento';

    const reportText = `📊 *RESUMO MENSAL DE RESULTADOS — ${displayName.toUpperCase()}*
📅 *Período:* Últimos ${daysFilter} dias

✅ *Total de Procura na Página:* ${totalClicks} ações
💬 *Cliques para chamar no WhatsApp:* ${whatsappClicks} pedidos
📍 *Clientes que traçaram rota no Mapa:* ${mapsClicks} visitas
⭐ *Acessos para avaliar no Google:* ${reviewClicks} acessos

🏆 * Botão Mais Clicado pelos Clientes:*
${topOrigin}

🔒 *Link do seu Relatório Completo:*
${typeof window !== 'undefined' ? window.location.href : ''}
🔑 *Seu Código de Acesso:* ${ownerPin}`;

    window.open(
      `https://wa.me/${formattedPhone}?text=${encodeURIComponent(reportText)}`,
      '_blank'
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-10 px-4 font-sans print:bg-white print:p-0">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Relatório de Resultados • Código do Cliente: {ownerPin}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">{displayName}</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Acompanhamento de pedidos de orçamento no WhatsApp e rotas traçadas no Google Maps.
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

            {isAdminSession && (
              <button
                onClick={sendReportViaWhatsApp}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Enviar p/ WhatsApp do Cliente (com PIN)</span>
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Salvar PDF</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">Total de Cliques</span>
              <MousePointerClick className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{totalClicks}</div>
            <p className="text-xs text-slate-500 mt-1">Ações nos últimos {daysFilter} dias</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">Chamadas WhatsApp</span>
              <MessageCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-600">{whatsappClicks}</div>
            <p className="text-xs text-slate-500 mt-1">Cliques para pedir orçamento</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">Rotas no Mapa</span>
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-blue-600">{mapsClicks}</div>
            <p className="text-xs text-slate-500 mt-1">Clientes que abriram o endereço</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">Avaliações Google</span>
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-500">{reviewClicks}</div>
            <p className="text-xs text-slate-500 mt-1">Cliques para avaliar a empresa</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <h2 className="text-base font-extrabold text-slate-900 mb-4">
              O que os clientes mais procuraram na sua página:
            </h2>

            {sortedLocations.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">
                Nenhum clique registrado neste período ainda.
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

          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <h2 className="text-base font-extrabold text-slate-900 mb-4">
              Últimos Acessos Registrados
            </h2>

            {events.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">
                Aguardando novos cliques.
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
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-sm">
          Carregando relatório...
        </div>
      }
    >
      <MonthlyReportContent />
    </Suspense>
  );
}