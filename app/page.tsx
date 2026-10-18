import Link from 'next/link';
import {
  MessageCircle,
  MapPin,
  Zap,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Search,
  Smartphone,
  Bot,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Star,
} from 'lucide-react';

// Coloque aqui o seu número de WhatsApp comercial (55 + DDD + Número)
const AGENCY_WHATSAPP = '5551999712611';

function makeAgencyWaLink(text: string) {
  return `https://wa.me/${AGENCY_WHATSAPP}?text=${encodeURIComponent(text)}`;
}

export default function AgencyHomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. HEADER */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center shadow-sm">
              T
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                Tração<span className="text-emerald-400">Local</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] text-slate-400 border border-slate-800 rounded-full px-2.5 py-0.5">
                Presença Digital & Automação
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#diagnostico" className="hover:text-emerald-400 transition">
              Por que você perde vendas
            </a>
            <a href="#pilares" className="hover:text-emerald-400 transition">
              Como funciona
            </a>
            <a href="#portfolio" className="hover:text-emerald-400 transition">
              Portfólio & Caso Real
            </a>
            <a href="#pacotes" className="hover:text-emerald-400 transition">
              Pacotes
            </a>
          </nav>

          <a
            href={makeAgencyWaLink(
              'Olá! Vim pelo site da agência e quero solicitar um diagnóstico gratuito da minha empresa no Google.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Diagnóstico Gratuito</span>
          </a>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden py-16 md:py-28 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Estruturação de Presença Digital e Vendas Locais em Porto Alegre</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Transformamos buscas no Google em{' '}
            <span className="text-emerald-400">
              clientes no WhatsApp
            </span>{' '}
            do seu comércio.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Não fazemos apenas sites bonitos. Estruturamos o posicionamento completo do seu negócio no Google Maps, criamos Landing Pages ultrarrápidas de alta conversão e automatizamos a triagem do seu atendimento.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={makeAgencyWaLink(
                'Olá! Quero ver uma demonstração de como ficaria a estrutura digital da minha empresa.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-extrabold text-base bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg w-full sm:w-auto"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Solicitar Prévia Gratuita no WhatsApp</span>
            </a>

            <a
              href="#portfolio"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition w-full sm:w-auto"
            >
              <span>Ver Caso de Sucesso (FG Motors)</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 3. DIAGNÓSTICO VISUAL (A DOR DO COMÉRCIO LOCAL) */}
      <section id="diagnostico" className="py-16 md:py-24 bg-slate-900/60 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              O Vazamento Invisível de Clientes
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white">
              Por que excelentes empresas locais perdem vendas todos os dias?
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Você tem nota alta no Google e clientes fiéis, mas quem pesquisa pelo seu serviço hoje no bairro acaba clicando no concorrente por 3 falhas simples:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                1. Ficha do Google Maps sem Site Oficial
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Quando o botão "Website" da sua ficha está vazio ou quebrado, o algoritmo do Google reduz seu alcance local e o cliente fica inseguro antes de chamar.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                2. Depender Apenas de Instagram ou Linktree
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Quem busca uma oficina, clínica ou serviço no Google tem urgência de compra. Jogar esse cliente para um feed de Instagram exige login, distrai e derruba a conversão.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                3. Sites Antigos, Lentos e sem Rastreamento
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Mais de 80% das buscas locais acontecem no celular. Se a sua página demora mais de 3 segundos para abrir ou não tem botões diretos de orçamento por serviço, o cliente fecha a aba.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OS 3 PILARES DE ENTREGA */}
      <section id="pilares" className="py-16 md:py-24 max-w-6xl mx-auto px-4 border-b border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Nossa Metodologia
          </span>
          <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white">
            Os 3 Pilares de Tração para Negócios Locais
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-7 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-5">
                <Search className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-400 uppercase">Pilar 01</span>
              <h3 className="text-xl font-bold text-white mt-1">
                Posicionamento Local (Google Maps & SEO)
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Otimização completa do Perfil da Empresa no Google, dados estruturados (Schema.org LocalBusiness) e títulos geolocalizados no seu bairro para capturar quem já quer comprar.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 p-7 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-400 uppercase">Pilar 02</span>
              <h3 className="text-xl font-bold text-white mt-1">
                Presença Web Mobile-First (95+ PageSpeed)
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Landing Pages ultrarrápidas desenhadas para celular, destacando suas melhores avaliações reais do Google e seus serviços de maior margem com botões individuais de WhatsApp.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 p-7 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-5">
                <Bot className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-400 uppercase">Pilar 03</span>
              <h3 className="text-xl font-bold text-white mt-1">
                Atendimento Ágil & Automação no WhatsApp
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Mensagens pré-preenchidas por tipo de serviço, rastreamento de cliques (GA4/GTM) e opção de triagem automatizada para sua equipe não perder tempo no balcão.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PORTFÓLIO SELECIONADO ("1 REAL + 2 CONCEITUAIS") */}
      <section id="portfolio" className="py-16 md:py-24 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Resultados Comprovados
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white">
              Projetos em Produção & Demonstrações por Nicho
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Conheça o estudo de caso real em Porto Alegre que deu origem à nossa metodologia e navegue pelas estruturas de outros segmentos:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CASO REAL: FG MOTORS */}
            <div className="bg-slate-900 rounded-2xl border-2 border-emerald-500/60 p-6 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950">
                    ⭐ Caso de Estudo Real • Porto Alegre
                  </span>
                  <span className="text-xs text-slate-400">Setor Automotivo</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white">
                  FG Motors Oficina Mecânica
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  Profissionalização completa de oficina tradicional em Porto Alegre: recriação de identidade visual em alta definição, organização de tabelas de serviços, SEO Local no Google Maps e página rápida integrada ao WhatsApp.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Carregamento instantâneo Mobile-First</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Rastreamento de conversões e cliques de orçamento</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Integração direta com Perfil da Empresa no Google</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col gap-2.5">
                <a
                  href="https://fgmotorsoficina.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Visitar fgmotorsoficina.com</span>
                </a>
                <Link
                  href="/carecar-auto-center"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  <span>Ver Demo Dinâmica Automotiva (Carecar)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* DEMO CONCEITUAL 1: SAÚDE E BELEZA */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                    Modelo Saúde & Estética
                  </span>
                  <span className="text-xs text-slate-400">Clínicas / Consultórios</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Clínicas Odontológicas & Estética Avançada
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  Estrutura clean em tons claros projetada para transmitir autoridade médica, apresentar tratamentos de maior margem (implantes, lentes, harmonização) e converter pacientes em agendamentos de avaliação no WhatsApp.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Botões de agendamento separados por especialidade</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Destaque para avaliações 5 estrelas verificadas</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <a
                  href={makeAgencyWaLink(
                    'Olá! Tenho uma clínica/estética e gostaria de ver uma prévia personalizada para o meu espaço.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white transition"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Pedir Demo para Minha Clínica</span>
                </a>
              </div>
            </div>

            {/* DEMO CONCEITUAL 2: PET & GASTRONOMIA / SERVIÇOS */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Modelo Pet, Gastronomia & Serviços
                  </span>
                  <span className="text-xs text-slate-400">Comércio Local</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Clínicas Veterinárias, Pet Shops & Cafeterias
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  Layout vibrante focado em conveniência no bairro: catálogo visual de serviços/produtos, rota em 1 clique no Google Maps, horários de plantão e contato imediato pelo celular.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Catálogo ágil e botão "Como Chegar" em destaque</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>FAQ estratégico para reduzir dúvidas repetitivas</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <a
                  href={makeAgencyWaLink(
                    'Olá! Gostaria de receber uma demonstração gratuita do site para o meu comércio.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white transition"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Pedir Demo para Meu Comércio</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ESTRUTURA DE PACOTES (PRODUCTIZED SERVICES) */}
      <section id="pacotes" className="py-16 md:py-24 max-w-6xl mx-auto px-4 border-b border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Planos Transparentes
          </span>
          <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white">
            Escolha a Estrutura Ideal para o Momento da Sua Empresa
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* PACOTE 1 */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-7 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">
                1. Entrada
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                Presença Local
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Ideal para comércios pequenos que estão invisíveis no Google ou com informações desatualizadas.
              </p>
              <div className="my-5 pt-4 border-t border-slate-800">
                <span className="text-xs font-semibold text-emerald-400">
                  Taxa única de setup
                </span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Auditoria e configuração completa do Perfil no Google Maps</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Padronização profissional de fotos e horários</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Link e QR Code de balcão para coleta de novas avaliações</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Página rápida de "Link na Bio" otimizada</span>
                </li>
              </ul>
            </div>

            <a
              href={makeAgencyWaLink(
                'Olá! Tenho interesse no Pacote 1 (Presença Local). Podem me passar os valores?'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white transition"
            >
              <span>Consultar Pacote Presença Local</span>
            </a>
          </div>

          {/* PACOTE 2 (CARRO-CHEFE) */}
          <div className="bg-slate-900 rounded-2xl border-2 border-emerald-500 p-7 flex flex-col justify-between shadow-xl relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[11px] font-extrabold uppercase px-3.5 py-1 rounded-full">
              Mais Escolhido • Padrão FG Motors
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-emerald-400">
                2. Carro-Chefe
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                Estrutura Pro
              </h3>
              <p className="mt-2 text-xs text-slate-300">
                Para empresas que buscam credibilidade imediata e captação diária de orçamentos no bairro.
              </p>
              <div className="my-5 pt-4 border-t border-slate-800">
                <span className="text-xs font-semibold text-emerald-400">
                  Setup inicial + Mensalidade de hospedagem e suporte
                </span>
              </div>
              <ul className="space-y-3 text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Tudo do pacote Presença Local</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Refinamento de Identidade Visual (Logo e Paleta de Cores)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Landing Page profissional e ultrarrápida Mobile-First</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Domínio próprio (.com.br) + SEO Local geolocalizado</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Botões de WhatsApp com rastreamento de cliques (GA4/GTM)</span>
                </li>
              </ul>
            </div>

            <a
              href={makeAgencyWaLink(
                'Olá! Quero saber mais sobre o Pacote 2 (Estrutura Pro - Carro-Chefe) para a minha empresa.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Quero a Estrutura Pro</span>
            </a>
          </div>

          {/* PACOTE 3 */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-7 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-purple-400">
                3. Premium
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                Ecossistema & Automação
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Para clínicas, oficinas e serviços com alto volume diário de mensagens no WhatsApp.
              </p>
              <div className="my-5 pt-4 border-t border-slate-800">
                <span className="text-xs font-semibold text-purple-400">
                  Setup inicial + Mensalidade de gestão e automação
                </span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Tudo do pacote Estrutura Pro</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Automação de triagem no WhatsApp (pré-atendimento e agendamento)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Catálogo digital ou tabela de serviços gerenciável</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Relatório mensal de acessos e cliques de conversão</span>
                </li>
              </ul>
            </div>

            <a
              href={makeAgencyWaLink(
                'Olá! Tenho interesse no Pacote 3 (Ecossistema & Automação). Como funciona?'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white transition"
            >
              <span>Consultar Ecossistema Premium</span>
            </a>
          </div>
        </div>
      </section>

      {/* 7. FAQ DA AGÊNCIA */}
      <section className="py-16 md:py-24 max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-10">
          <HelpCircle className="w-6 h-6 text-emerald-400" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-base text-white">
              1. Quanto tempo demora para o site da minha empresa ficar pronto?
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Graças ao nosso motor de Onboarding Inteligente (que já importa 80% dos seus dados públicos do Google Maps), entregamos a sua estrutura oficial no ar em até 72 horas após a confirmação dos dados.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-base text-white">
              2. Eu preciso entender de tecnologia ou programação para manter o site?
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Zero. Nós cuidamos de toda a configuração de domínio, hospedagem de alta velocidade, certificados de segurança e atualizações. Sempre que precisar alterar um horário, foto ou serviço, basta nos mandar uma mensagem no WhatsApp.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-base text-white">
              3. Como eu sei se o site realmente está trazendo clientes?
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Todos os botões da sua página possuem rastreamento de conversão e mensagens personalizadas (ex: "Olá! Vi o site da empresa e quero orçamento para Revisão"). Você sabe imediatamente no seu WhatsApp que o cliente veio pela página.
            </p>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-10 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-bold text-slate-300">
            Tração Local • Agência de Presença Digital & Automação em Porto Alegre/RS
          </p>
          <div className="flex items-center gap-4">
            <Link href="/painel" className="text-slate-600 hover:text-slate-400 transition">
              Painel Operacional (SDR)
            </Link>
            <span><span>© 2026</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}