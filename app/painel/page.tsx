'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  MessageCircle,
  ExternalLink,
  FileText,
  CheckCircle2,
  Sparkles,
  Star,
  Copy,
  Rocket,
  ClipboardCheck,
  RefreshCw,
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const STATUS_OPTIONS = [
  'Novo',
  'Abordado',
  'Demo Enviada',
  'Em Negociação',
  'Fechado',
  'Em Produção',
];

export default function AgencyDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [openBriefingSlug, setOpenBriefingSlug] = useState<string | null>(null);
  const [openProposalSlug, setOpenProposalSlug] = useState<string | null>(null);

  async function fetchLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads_pipeline')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLeads(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  async function updateLeadStatus(slug: string, newStatus: string) {
    setLeads((prev) =>
      prev.map((l) => (l.slug === slug ? { ...l, status: newStatus } : l))
    );
    await supabase
      .from('leads_pipeline')
      .update({ status: newStatus })
      .eq('slug', slug);
  }

  function handleOneClickClose(lead: any) {
    const biz = lead.business_data || {};
    const phone = (biz.phone || '').replace(/\D/g, '');
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://motor-preview-agencia.vercel.app';
    const onboardingLink = `${origin}/onboarding/${lead.slug}`;

    updateLeadStatus(lead.slug, 'Fechado');

    const closeMsg = `Perfeito, equipe da ${biz.short_name || biz.name}! Vamos iniciar a configuração oficial do site de vocês.\n\nPara agilizar o seu tempo, já deixei 80% do cadastro preenchido com os dados da empresa. Basta revisar e confirmar neste link:\n${onboardingLink}`;
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(closeMsg)}`,
      '_blank'
    );
  }

  function generateProposalText(lead: any) {
    const biz = lead.business_data || {};
    const bc = lead.ai_battlecard || {};
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://motor-preview-agencia.vercel.app';

    return `📋 *PROPOSTA DE PRESENÇA DIGITAL — ${(biz.name || '').toUpperCase()}*

🔍 *Diagnóstico Atual:* ${biz.diagnosis || 'Ausência de site oficial vinculado ao Google Maps'}
⭐ *Reputação Verificada:* Nota ${biz.rating} (${biz.reviews_count} avaliações no Google)
🔗 *Prévia Exclusiva:* ${origin}/${lead.slug}

---
📦 *OPÇÕES DE PACOTES:*

*1. Presença Local (Entrada)*
• Configuração e otimização completa do Perfil no Google Maps
• Padronização de horários, fotos e link de avaliações no balcão
• Página rápida de contato direto

*2. Estrutura Pro (Carro-Chefe Recomendado)*
• Tudo do pacote Presença Local
• Landing Page Profissional Mobile-First de Alta Conversão
• SEO Local geolocalizado + Rastreamento de cliques no WhatsApp

*3. Ecossistema & Automação (Premium)*
• Tudo do pacote Estrutura Pro
• Automação de triagem e pré-atendimento no WhatsApp
• Catálogo digital de serviços + Relatório mensal de cliques

💡 *Recomendação Estratégica:* ${bc.pacote_recomendado || '2. Estrutura Pro'}`;
  }

  const filteredLeads =
    filterStatus === 'Todos'
      ? leads
      : leads.filter((l) => l.status === filterStatus);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Topo do Painel */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fábrica Autônoma • Central de Operações e SDR</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Pipeline de Leads & Fechamento
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Gerencie abordagens, visualize Battlecards, envie propostas e acesse os Briefings preenchidos.
            </p>
          </div>

          <button
            onClick={fetchLeads}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Atualizar Lista</span>
          </button>
        </div>

        {/* Filtro de Status */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['Todos', ...STATUS_OPTIONS].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterStatus === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
            Carregando leads do Supabase...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
            Nenhum lead encontrado neste status.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredLeads.map((lead) => {
              const biz = lead.business_data || {};
              const bc = lead.ai_battlecard || {};
              const links = lead.outreach_messages?.whatsapp_links || {};
              const briefingMd = lead.briefing_data?.briefing_md;

              return (
                <div
                  key={lead.id || lead.slug}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-5"
                >
                  {/* Linha 1: Nome, Nota, Links Rápidos e Seletor de Status */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-xl font-extrabold text-slate-900">
                          {biz.name || lead.slug}
                        </h2>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {biz.rating} ({biz.reviews_count})
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                          {biz.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {biz.address} • Tel: <strong>{biz.phone}</strong>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <a
                        href={`/${lead.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Ver Site Demo</span>
                      </a>

                      <a
                        href={`/onboarding/${lead.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                      >
                        <ClipboardCheck className="w-3.5 h-3.5" />
                        <span>Form Onboarding</span>
                      </a>

                      <select
                        value={lead.status || 'Novo'}
                        onChange={(e) =>
                          updateLeadStatus(lead.slug, e.target.value)
                        }
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800"
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            Status: {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Linha 2: AI Battlecard de Vendas */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
                    <div>
                      <span className="font-bold text-emerald-700 uppercase block mb-1">
                        👏 Ponto Elogiado
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {bc.ponto_elogio || '—'}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-rose-700 uppercase block mb-1">
                        🎯 Ponto de Dor
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {bc.ponto_dor || biz.diagnosis || '—'}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-blue-700 uppercase block mb-1">
                        💰 Argumento de ROI
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {bc.argumento_roi || '—'}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-purple-700 uppercase block mb-1">
                        📦 Pacote Recomendado
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {bc.pacote_recomendado || '2. Estrutura Pro'}
                      </p>
                    </div>
                  </div>

                  {/* Linha 3: Botões de Cadência SDR + Fechamento de 1 Clique */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {links.link_1_icebreaker && (
                        <a
                          href={links.link_1_icebreaker}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => updateLeadStatus(lead.slug, 'Abordado')}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>1. Quebra-Gelo (Sem Link)</span>
                        </a>
                      )}

                      {links.link_2_demo && (
                        <a
                          href={links.link_2_demo.replace(
                            'https://preview.suaagencia.com.br',
                            typeof window !== 'undefined'
                              ? window.location.origin
                              : 'https://motor-preview-agencia.vercel.app'
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            updateLeadStatus(lead.slug, 'Demo Enviada')
                          }
                          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>2. Enviar Link da Demo</span>
                        </a>
                      )}

                      {links.link_followup_day_3 && (
                        <a
                          href={links.link_followup_day_3}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        >
                          <span>Follow-up Dia 3</span>
                        </a>
                      )}

                      {links.link_followup_day_7 && (
                        <a
                          href={links.link_followup_day_7}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        >
                          <span>Follow-up Dia 7</span>
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() =>
                          setOpenProposalSlug(
                            openProposalSlug === lead.slug ? null : lead.slug
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-50 text-slate-800 transition cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Rascunho de Proposta</span>
                      </button>

                      {briefingMd && (
                        <button
                          onClick={() =>
                            setOpenBriefingSlug(
                              openBriefingSlug === lead.slug ? null : lead.slug
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Ver briefing.md Preenchido</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOneClickClose(lead)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
                      >
                        <Rocket className="w-4 h-4 text-emerald-400" />
                        <span>Fechar Negócio (1 Clique)</span>
                      </button>
                    </div>
                  </div>

                  {/* Gaveta: Rascunho de Proposta Comercial (3 Pacotes) */}
                  {openProposalSlug === lead.slug && (
                    <div className="mt-4 bg-slate-900 text-slate-100 p-5 rounded-xl text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-400 uppercase">
                          Rascunho de Proposta Comercial (Pronto para WhatsApp)
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              generateProposalText(lead)
                            );
                            alert('Proposta copiada para a área de transferência!');
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Proposta</span>
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap font-sans leading-relaxed text-slate-200">
                        {generateProposalText(lead)}
                      </pre>
                    </div>
                  )}

                  {/* Gaveta: Documento briefing.md Preenchido pelo Cliente */}
                  {openBriefingSlug === lead.slug && briefingMd && (
                    <div className="mt-4 bg-emerald-950 text-emerald-50 p-5 rounded-xl text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-300 uppercase">
                          Briefing Oficial Recebido (briefing.md)
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(briefingMd);
                            alert('briefing.md copiado!');
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar briefing.md</span>
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap font-mono leading-relaxed text-emerald-100">
                        {briefingMd}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}