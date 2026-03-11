import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { STORES } from '@/lib/stores';

const storeCards = [
  {
    slug: 'uomo',
    icon: '👔',
    gradient: 'from-slate-900 to-zinc-800',
    tagline: 'Eleganza maschile contemporanea',
  },
  {
    slug: 'woman',
    icon: '👗',
    gradient: 'from-rose-800 to-pink-700',
    tagline: 'Femminilità e stile senza tempo',
  },
  {
    slug: 'intimissimi',
    icon: '✨',
    gradient: 'from-purple-800 to-violet-700',
    tagline: 'Comfort e sensualità premium',
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          {/* Ambient Glow */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[128px]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <div className="max-w-3xl">
              <div className="animate-fade-in-up">
                <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md text-white/80 text-xs font-medium rounded-full mb-6 tracking-wider uppercase">
                  Promozione Esclusiva
                </span>
              </div>

              <h1 className="animate-fade-in-up animation-delay-200 text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                Il tuo stile,{' '}
                <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                  il tuo voucher
                </span>
              </h1>

              <p className="animate-fade-in-up animation-delay-400 text-lg md:text-xl text-gray-400 leading-relaxed mb-10 max-w-xl">
                Scopri i nostri negozi e le promozioni attive. Vieni a trovarci
                in negozio per ricevere il tuo voucher promozionale esclusivo.
              </p>

              <div className="animate-fade-in-up animation-delay-600 flex flex-col sm:flex-row gap-4">
                <a
                  href="#negozi"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all btn-shimmer text-sm"
                >
                  Scopri i Negozi
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
                <a
                  href="#come-funziona"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-sm"
                >
                  Come Funziona
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Store Cards Section */}
        <section id="negozi" className="py-24 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-4 tracking-wider uppercase">
                I Nostri Negozi
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Scegli il tuo store
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Scopri le nostre collezioni e vieni in negozio per il tuo voucher
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {storeCards.map((card) => {
                const store = STORES.find((s) => s.slug === card.slug)!;
                return (
                  <Link key={card.slug} href={`/${card.slug}`}>
                    <div className="card-premium group relative rounded-2xl overflow-hidden cursor-pointer">
                      <div className={`bg-gradient-to-br ${card.gradient} p-8 md:p-10 min-h-[340px] flex flex-col justify-between`}>
                        <div>
                          <span className="text-5xl mb-6 block">{card.icon}</span>
                          <h3 className="text-2xl font-bold text-white mb-2">{store.name}</h3>
                          <p className="text-white/60 text-sm leading-relaxed">{card.tagline}</p>
                        </div>
                        <div className="flex items-end justify-between mt-8">
                          <div>
                            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Promozione</p>
                            <p className="text-xl font-bold text-white">Voucher disponibile</p>
                          </div>
                          <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="come-funziona" className="py-24 md:py-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full mb-4 tracking-wider uppercase">
                Semplicissimo
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Come funziona</h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Tre semplici passi per ricevere il tuo voucher promozionale
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  step: '01',
                  title: 'Vieni in Negozio',
                  desc: 'Visita uno dei punti vendita Shorty Shop e chiedi informazioni sulle promozioni attive.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  ),
                },
                {
                  step: '02',
                  title: 'Ricevi il Voucher',
                  desc: 'Il personale del negozio creerà il tuo voucher personalizzato con codice univoco e QR code.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ),
                },
                {
                  step: '03',
                  title: 'Usa il Voucher',
                  desc: 'Presenta il voucher alla cassa: mostra il QR code o il codice seriale e ottieni il tuo sconto.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div key={item.step} className="relative">
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white">
                        {item.icon}
                      </div>
                      <span className="text-4xl font-bold text-gray-100">{item.step}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full mb-4 tracking-wider uppercase">
                  Vantaggi
                </span>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                  Perché scegliere{' '}
                  <span className="text-gradient">Shorty Shop</span>
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed mb-8">
                  Non è solo uno sconto: è un&apos;esperienza esclusiva pensata
                  per valorizzare il tuo stile personale.
                </p>

                <div className="space-y-6">
                  {[
                    { title: 'Voucher Gratuito', desc: 'Il voucher è completamente gratuito e viene emesso dal personale in negozio.' },
                    { title: 'PDF con QR Code', desc: 'Ricevi il voucher stampato o digitale con QR code per una verifica rapida alla cassa.' },
                    { title: 'Validità 30 Giorni', desc: 'Hai tempo un mese intero per utilizzare il tuo voucher promozionale.' },
                    { title: 'Tre Negozi a Scelta', desc: 'Uomo, donna o intimo: scegli il reparto che fa per te.' },
                  ].map((benefit, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{benefit.title}</h4>
                        <p className="text-gray-500 text-sm">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Element */}
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-950 to-gray-800 rounded-3xl p-8 md:p-12">
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                        <span className="text-white text-lg">🎫</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">Voucher Shorty Shop</p>
                        <p className="text-gray-400 text-xs">Promozione attiva</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Codice</span>
                        <span className="text-white font-mono text-sm">SSU-8K4P2X</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Valore</span>
                        <span className="text-amber-400 font-bold">€ 20,00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Stato</span>
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">Attivo</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 flex items-center gap-3">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                      <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 3h7v7H3V3zm1 1v5h5V4H4zm7-1h7v7h-7V3zm1 1v5h5V4h-5zM3 11h7v7H3v-7zm1 1v5h5v-5H4zm8 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm2-4h2v2h-2v-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">QR Code incluso</p>
                      <p className="text-gray-400 text-xs">Scansiona per verificare</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-32 bg-gradient-to-br from-gray-950 via-gray-900 to-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Vieni a trovarci in negozio
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              Passa in uno dei nostri punti vendita per ricevere il tuo voucher promozionale esclusivo direttamente dal nostro personale.
            </p>
            <a
              href="#negozi"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all btn-shimmer text-sm"
            >
              Scopri i Negozi
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
