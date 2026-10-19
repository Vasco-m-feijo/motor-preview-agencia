import Link from 'next/link';
import {
  MessageCircle,
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
} from 'lucide-react';

// Coloque aqui o seu número de WhatsApp comercial (55 + DDD + Número)
const AGENCY_WHATSAPP = '5551999999999';

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
                Posicionamento & Vendas no WhatsApp
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
              Exemplos Reais
            </a>
            <a href="#pacotes" className="hover:text-emerald-400 transition">
              Planos
            </a>
          </nav>

          <a
            href={makeAgencyWaLink(
              'Olá! Vim pelo site da agência e quero solicitar uma avaliação gratuita da minha empresa no Google.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Avaliação Gratuita</span>
          </a>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden py-16 md:py-28 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Especialistas em Comércio e Serviços Locais em Porto Alegre</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Transformamos buscas no Google em{' '}
            <span className="text-emerald-400">
              clientes no WhatsApp
            </span>{' '}
            da sua empresa.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Fazemos o seu negócio ser encontrado por quem está procurando pelo seu serviço no bairro, apresentamos o seu trabalho com credibilidade no celular e organizamos os pedidos de orçamento direto no seu WhatsApp.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={makeAgencyWaLink(
                'Olá! Quero ver uma demonstração de como ficaria a página profissional da minha empresa.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-extrabold text-base bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg w-full sm:w-auto"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Pedir Demonstração no WhatsApp</span>
            </a>

            <a
              href="#portfolio"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition w-full sm:w-auto"
            >
              <span>Ver Exemplos Prontos</span>
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
              Onde Você Está Perdendo Clientes
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white">
              Por que ótimas empresas locais perdem vendas todos os dias?
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Mesmo tendo um excelente atendimento e clientes fiéis, quem pesquisa pelo seu serviço hoje no Google acaba indo para o concorrente por 3 motivos simples:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                1. Ficha do Google sem Página Oficial
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Quando a sua empresa aparece no Google Maps sem um site próprio cadastrado, o Google mostra menos o seu negócio e o cliente fica inseguro de entrar em contato.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                2. Depender Só do Instagram
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Quem procura uma oficina, clínica ou serviço no Google tem pressa. Mandar esse cliente para o Instagram obriga a pessoa a fazer login e procurar informações soltas nos destaques.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                3. Falta de Clareza nos Serviços
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Quase todo mundo pesquisa pelo celular. Se o cliente não encontrar em segundos o que você faz, onde você fica e um botão fácil para pedir orçamento, ele volta e clica no próximo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OS 3 PILARES DE ENTREGA (LINGUAGEM SIMPLES E COMERCIAL) */}
      <section id="pilares" className="py-16 md:py-24 max-w-6xl mx-auto px-4 border-b border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Como Fazemos Seu Negócio Crescer
          </span>
          <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white">
            Nossa Solução em 3 Passos Simples
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-7 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-5">
                <Search className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-400 uppercase">Passo 01</span>
              <h3 className="text-xl font-bold text-white mt-1">
                Destaque nas Buscas do Seu Bairro
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Arrumamos toda a sua ficha no Google Maps e preparamos sua página para que moradores da sua região encontrem a sua empresa primeiro quando pesquisarem pelo seu serviço.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 p-7 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-400 uppercase">Passo 02</span>
              <h3 className="text-xl font-bold text-white mt-1">
                Página Profissional que Abre na Hora no Celular
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Criamos uma página exclusiva com as cores da sua marca, mostrando seus principais serviços, os elogios reais dos seus clientes no Google e o mapa fácil para chegar até você.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 p-7 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-5">
                <Bot className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-400 uppercase">Passo 03</span>
              <h3 className="text-xl font-bold text-white mt-1">
                Pedidos Já Triados no Seu WhatsApp
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Em vez de receber apenas um &ldquo;Oi, tudo bem?&rdquo;, o cliente escolhe na página o serviço que deseja e a mensagem já chega pronta no seu WhatsApp, poupando o tempo do seu balcão.
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
              Exemplos na Prática
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white">
              Veja Como Fica a Estrutura de Cada Tipo de Negócio
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Conheça um projeto real em funcionamento em Porto Alegre e clique nos modelos demonstrativos para testar no seu celular:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CARD 1: CASO REAL FG MOTORS (SEM LINK DE PROSPECT REAL) */}
            <div className="bg-slate-900 rounded-2xl border-2 border-emerald-500/60 p-6 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950">
                    ⭐ Cliente Real • Porto Alegre
                  </span>
                  <span className="text-xs text-slate-400">Oficina Mecânica</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white">
                  FG Motors Oficina Mecânica
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  Modernização completa da presença digital da oficina: visual profissional, organização clara das especialidades, ligação direta com o Google Maps e botões rápidos de orçamento por serviço.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Abertura imediata em qualquer celular</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Botões de orçamento separados por serviço</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <a
                  href="https://fgmotorsoficina.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl font-extrabold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-md"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Visitar fgmotorsoficina.com</span>
                </a>
              </div>
            </div>

            {/* CARD 2: DEMO CONCEITUAL 1 — SAÚDE E BELEZA */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between hover:border-sky-500/50 transition">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                    Modelo 1 • Saúde & Estética
                  </span>
                  <span className="text-xs text-slate-400">Clínicas / Consultórios</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Lumina Odontologia & Harmonização
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  Modelo desenhado para clínicas médicas, dentistas e estética: visual leve e elegante, apresentação dos procedimentos mais procurados e pré-agendamento sem fila no WhatsApp.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Catálogo de tratamentos com agendamento em 1 toque</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Destaque para depoimentos reais de pacientes</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
                <Link
                  href="/lumina-odontologia-estetica"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl font-extrabold text-xs bg-sky-500 hover:bg-sky-400 text-slate-950 transition shadow-md"
                >
                  <span>Ver Exemplo: Clínica Odontológica</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/lumina-odontologia-estetica/bio"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl font-semibold text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
                >
                  <span>Ver Página de Atalhos para Instagram</span>
                </Link>
              </div>
            </div>

            {/* CARD 3: DEMO CONCEITUAL 2 — PET & SERVIÇOS */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between hover:border-amber-500/50 transition">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Modelo 2 • Pet & Comércio Local
                  </span>
                  <span className="text-xs text-slate-400">Pet Shop / Serviços</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Vila Pet Veterinária & Estética
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  Modelo ideal para clínicas veterinárias, pet shops, salões e comércios de bairro: tabela de serviços e preços fácil de consultar, horários de atendimento e mapa para traçar rota.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Tabela de serviços e pacotes com busca rápida</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Ficha rápida de agendamento direto para o WhatsApp</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
                <Link
                  href="/vila-pet-veterinaria"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl font-extrabold text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 transition shadow-md"
                >
                  <span>Ver Exemplo: Clínica Veterinária & Pet</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/vila-pet-veterinaria/bio"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl font-semibold text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
                >
                  <span>Ver Página de Atalhos para Instagram</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ESTRUTURA DE PACOTES (LINGUAGEM CLARA PARA O DONO DE NEGÓCIO) */}
      <section id="pacotes" className="py-16 md:py-24 max-w-6xl mx-auto px-4 border-b border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Planos Sem Complicação
          </span>
          <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white">
            Escolha o Plano Ideal para o Momento da Sua Empresa
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* PACOTE 1 */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-7 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">
                1. Plano de Entrada
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                Presença Local
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Para negócios que querem arrumar a casa no Google Maps e facilitar o contato vindo do Instagram.
              </p>
              <div className="my-5 pt-4 border-t border-slate-800">
                <span className="text-xs font-semibold text-emerald-400">
                  Pagamento único de implantação
                </span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Revisão e atualização completa da sua ficha no Google Maps</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Organização profissional das suas fotos, telefone e horários</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Placa com QR Code para o balcão (para seus clientes avaliarem você no Google em 10 segundos)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Página rápida de atalhos de contato para colocar no perfil do Instagram</span>
                </li>
              </ul>
            </div>

            <a
              href={makeAgencyWaLink(
                'Olá! Tenho interesse no Plano 1 (Presença Local). Podem me passar os valores?'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white transition"
            >
              <span>Consultar Plano Presença Local</span>
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
                Para empresas que querem ter um site oficial de respeito e receber pedidos de orçamento todos os dias.
              </p>
              <div className="my-5 pt-4 border-t border-slate-800">
                <span className="text-xs font-semibold text-emerald-400">
                  Implantação + Mensalidade acessível de manutenção
                </span>
              </div>
              <ul className="space-y-3 text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Tudo do plano Presença Local incluso</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Site profissional completo personalizado com seu logotipo e as cores da sua empresa</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Endereço próprio na internet (ex: suaempresa.com.br) preparado para buscas no seu bairro</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Apresentação dos seus principais serviços com botões diretos para o seu WhatsApp</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Medidor automático que conta quantas pessoas clicaram no seu WhatsApp ou pediram rota no mapa</span>
                </li>
              </ul>
            </div>

            <a
              href={makeAgencyWaLink(
                'Olá! Quero saber mais sobre o Plano 2 (Estrutura Pro) para a minha empresa.'
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
                3. Completo
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                Ecossistema & Automação
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Para clínicas, oficinas e negócios que recebem muitas mensagens e querem agilizar o atendimento.
              </p>
              <div className="my-5 pt-4 border-t border-slate-800">
                <span className="text-xs font-semibold text-purple-400">
                  Implantação + Mensalidade com atualizações e relatórios
                </span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Tudo do plano Estrutura Pro incluso</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Pré-atendimento inteligente: o cliente responde 3 perguntas rápidas e já chega no seu WhatsApp com o pedido pronto</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Catálogo digital com tabela de serviços, pacotes ou preços sempre atualizada para seus clientes</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Resumo mensal enviado no seu WhatsApp mostrando quantos clientes vieram pelo site e quais serviços mais procuraram</span>
                </li>
              </ul>
            </div>

            <a
              href={makeAgencyWaLink(
                'Olá! Tenho interesse no Plano 3 (Ecossistema & Automação). Como funciona?'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white transition"
            >
              <span>Consultar Plano Ecossistema</span>
            </a>
          </div>
        </div>
      </section>

      {/* 7. FAQ DA AGÊNCIA */}
      <section className="py-16 md:py-24 max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-10">
          <HelpCircle className="w-6 h-6 text-emerald-400" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center">
            Dúvidas Comuns
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-base text-white">
              1. Quanto tempo demora para a página da minha empresa ficar pronta?
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Nós mesmos buscamos as informações públicas da sua empresa no Google e montamos toda a estrutura. Após você confirmar os dados pelo WhatsApp, entregamos tudo no ar em até 72 horas.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-base text-white">
              2. Eu preciso mexer em computador ou entender de internet para manter o site?
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              De jeito nenhum. Nossa equipe cuida de tudo. Sempre que você quiser mudar um horário, trocar uma foto ou atualizar um serviço, basta nos mandar uma mensagem no WhatsApp que nós atualizamos para você.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-base text-white">
              3. Como eu sei se a página realmente está trazendo clientes?
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Quando o cliente clica na sua página, a mensagem já chega identificada no seu WhatsApp (ex: &ldquo;Olá! Vi o site da empresa e quero orçamento para...&rdquo;) e você ainda conta com o acompanhamento de quantos cliques cada botão recebeu.
            </p>
          </div>
        </div>
      </section>

      {/* 8. FOOTER (SEM LINK PÚBLICO PARA O PAINEL) */}
      <footer className="bg-slate-950 border-t border-slate-900 py-10 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-bold text-slate-300">
            Tração Local • Posicionamento Digital & Vendas Locais em Porto Alegre/RS
          </p>
          <span>© 2026 • Todos os direitos reservados</span>
        </div>
      </footer>
    </div>
  );
}