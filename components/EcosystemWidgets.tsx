'use client';

import { useState } from 'react';
import {
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Clock,
  Tag,
  Search,
  X,
  Send,
  ClipboardList,
  ChevronRight,
} from 'lucide-react';

interface CatalogItem {
  title: string;
  price: string;
  category?: string;
  description?: string;
}

interface EcosystemWidgetsProps {
  slug: string;
  displayName: string;
  phone: string;
  isDark?: boolean;
  isIndustrial?: boolean;
  services: any[];
  catalog?: CatalogItem[];
  triageConfig?: {
    enabled?: boolean;
    custom_question?: string;
    button_label?: string;
  };
}

export default function EcosystemWidgets({
  displayName,
  phone,
  isDark = false,
  isIndustrial = false,
  services = [],
  catalog = [],
  triageConfig,
}: EcosystemWidgetsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isTriageOpen, setIsTriageOpen] = useState(false);

  // Estados do Assistente de Triagem
  const [selectedService, setSelectedService] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('Esta semana');
  const [clientName, setClientName] = useState('');
  const [customAnswer, setCustomAnswer] = useState('');

  const cleanPhone = (phone || '').toString().replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

  const triageEnabled = triageConfig?.enabled !== false;
  const customQuestion =
    triageConfig?.custom_question ||
    'Algum detalhe adicional? (Ex: modelo/ano do veículo ou dúvida específica)';

  // Opções combinadas para o seletor da triagem (Serviços principais + itens do Catálogo)
  const allServiceOptions = [
    ...services.map((s: any) => s.title),
    ...catalog.map((c: CatalogItem) => `${c.title} (${c.price})`),
    'Outro serviço / Dúvida geral',
  ].filter(Boolean);

  function openTriageWithItem(itemTitle: string) {
    setSelectedService(itemTitle);
    setIsTriageOpen(true);
  }

  function handleSendTriage(e: React.FormEvent) {
    e.preventDefault();
    const serviceChoice = selectedService || allServiceOptions[0] || 'Atendimento Geral';

    const messageLines = [
      `📋 *PRÉ-ATENDIMENTO DIGITAL — ${displayName.toUpperCase()}*`,
      ``,
      `👤 *Cliente:* ${clientName || 'Não informado'}`,
      `🛠️ *Serviço/Item:* ${serviceChoice}`,
      `⏰ *Previsão/Urgência:* ${selectedUrgency}`,
      customAnswer ? `📝 *Detalhes:* ${customAnswer}` : '',
      ``,
      `Podem me informar a disponibilidade?`,
    ].filter(Boolean);

    const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
      messageLines.join('\n')
    )}`;

    window.open(waUrl, '_blank');
    setIsTriageOpen(false);
  }

  const filteredCatalog = catalog.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* =====================================================================
          1. CATÁLOGO DIGITAL / TABELA DE PREÇOS GERENCIÁVEL
      ===================================================================== */}
      {catalog.length > 0 && (
        <section id="catalogo" className="py-14 md:py-20 max-w-6xl mx-auto px-4 border-t border-slate-500/15">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary)] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>Destaques, Cardápio & Atendimento</span>
              </span>
              <h2 className={`mt-1 text-2xl sm:text-3xl font-black ${isIndustrial ? 'uppercase' : ''}`}>
                Destaques & Valores — {displayName}
              </h2>
              <p className={`mt-1 text-sm ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                Consulte valores de referência e inicie seu pré-atendimento com 1 clique:
              </p>
            </div>

            {catalog.length > 3 && (
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar serviço ou item..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium border ${
                    isDark
                      ? 'bg-zinc-900 border-zinc-800 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCatalog.map((item, idx) => (
              <div
                key={idx}
                className={
                  isDark
                    ? 'bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-between gap-4'
                    : isIndustrial
                    ? 'bg-white border-2 border-slate-950 p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center justify-between gap-4'
                    : 'bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between gap-4'
                }
              >
                <div className="space-y-1">
                  {item.category && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--color-primary)]/15 text-[var(--color-primary)]">
                      {item.category}
                    </span>
                  )}
                  <h3 className="font-extrabold text-base">{item.title}</h3>
                  {item.description && (
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                      {item.description}
                    </p>
                  )}
                  <div className="pt-1 font-black text-sm text-[var(--color-primary)]">
                    {item.price}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openTriageWithItem(`${item.title} (${item.price})`)}
                  data-track="whatsapp-click"
                  data-location={`catalog-item-${idx + 1}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-[var(--color-primary)] hover:opacity-90 transition shrink-0 cursor-pointer"
                >
                  <span>Agendar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          2. BANNER + MODAL DE TRIAGEM AUTOMÁTICA NO WHATSAPP
      ===================================================================== */}
      {triageEnabled && (
        <>
          <section className="max-w-6xl mx-auto px-4 my-8">
            <div
              className={
                isDark
                  ? 'bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6'
                  : isIndustrial
                  ? 'bg-slate-950 text-white border-4 border-slate-950 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6'
                  : 'bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl'
              }
            >
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pré-Atendimento Rápido em 30 Segundos</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Quer adiantar seu orçamento ou agendamento sem fila?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  Responda 3 perguntas rápidas para enviarmos sua solicitação direto para o especialista responsável no WhatsApp.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsTriageOpen(true)}
                data-track="whatsapp-click"
                data-location="triage-banner-open"
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl font-extrabold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg transition shrink-0 cursor-pointer"
              >
                <ClipboardList className="w-5 h-5" />
                <span>{triageConfig?.button_label || 'Iniciar Triagem Rápida'}</span>
              </button>
            </div>
          </section>

          {/* Botão Flutuante Desktop no Canto Inferior Direito */}
          <button
            type="button"
            onClick={() => setIsTriageOpen(true)}
            data-track="whatsapp-click"
            data-location="floating-triage-widget"
            className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2.5 px-5 py-3.5 rounded-full font-extrabold text-xs text-white bg-[var(--color-primary)] shadow-2xl hover:scale-105 transition cursor-pointer border-2 border-white/20"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Pré-Atendimento Rápido</span>
          </button>

          {/* Modal do Assistente de Triagem */}
          {isTriageOpen && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
                {/* Cabeçalho do Modal */}
                <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                        Triagem Inteligente WhatsApp
                      </span>
                      <h4 className="font-extrabold text-base">{displayName}</h4>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTriageOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Formulário de Triagem */}
                <form onSubmit={handleSendTriage} className="p-6 space-y-4 text-xs sm:text-sm">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1.5">
                      1. Qual serviço ou atendimento você procura?
                    </label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 font-semibold text-slate-900"
                    >
                      {allServiceOptions.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1.5">
                      2. Qual a sua preferência de prazo/horário?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Hoje / Urgente',
                        'Amanhã',
                        'Esta semana',
                        'Só cotar valor',
                      ].map((urg) => (
                        <button
                          key={urg}
                          type="button"
                          onClick={() => setSelectedUrgency(urg)}
                          className={`py-2 px-3 rounded-xl font-bold text-xs border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                            selectedUrgency === urg
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{urg}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      3. Seu nome:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Digite seu nome..."
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      4. {customQuestion}
                    </label>
                    <input
                      type="text"
                      placeholder="Opcional..."
                      value={customAnswer}
                      onChange={(e) => setCustomAnswer(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    data-track="whatsapp-click"
                    data-location="triage-modal-submit"
                    className="w-full py-4 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Ficha no WhatsApp Agora</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}