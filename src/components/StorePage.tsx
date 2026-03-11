import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Store } from '@/lib/types';

interface StorePageProps {
  store: Store;
  theme: {
    gradient: string;
    accent: string;
    accentHover: string;
    bgLight: string;
    icon: string;
    description: string;
    heroTitle: string;
    heroSubtitle: string;
  };
}

export default function StorePage({ store, theme }: StorePageProps) {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className={`relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br ${theme.gradient}`}
        >
          {/* Pattern */}
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

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
            <div className="max-w-2xl animate-fade-in-up">
              <span className="text-6xl mb-6 block">{theme.icon}</span>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">
                {theme.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-white/60 leading-relaxed mb-4">
                {theme.heroSubtitle}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full">
                <span className="text-white/80 text-sm">Voucher promozionale disponibile in negozio</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Left: Info */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {store.name}
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed mb-8">
                  {theme.description}
                </p>

                {/* Promo Details */}
                <div className={`${theme.bgLight} rounded-2xl p-6 md:p-8 mb-8`}>
                  <h3 className="font-bold text-lg mb-4">Dettagli Promozione</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-sm">💰</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Valore Voucher</p>
                        <p className="text-gray-600 text-sm">
                          Importo comunicato dal personale in negozio
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-sm">📅</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Validità</p>
                        <p className="text-gray-600 text-sm">
                          30 giorni dalla data di emissione
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-sm">🏪</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Dove utilizzarlo</p>
                        <p className="text-gray-600 text-sm">
                          Presso il punto vendita {store.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-sm">📱</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Come presentarlo</p>
                        <p className="text-gray-600 text-sm">
                          Mostra il QR code o il codice seriale
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conditions */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    * Il voucher è valido per 30 giorni dalla data di emissione.
                    Utilizzabile una sola volta. Non cumulabile con altre promozioni.
                    Non convertibile in denaro. Valido solo presso il punto vendita
                    indicato.
                  </p>
                </div>
              </div>

              {/* Right: How to get a voucher */}
              <div>
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
                  <h3 className="text-xl font-bold mb-1">Come ottenere il Voucher</h3>
                  <p className="text-gray-500 text-sm mb-8">
                    Il voucher viene rilasciato direttamente in negozio dal nostro personale.
                  </p>

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <span className="text-lg">🏪</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Vieni in negozio</h4>
                        <p className="text-gray-500 text-sm">Visita il punto vendita {store.name} e chiedi al personale.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <span className="text-lg">📋</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Fornisci i tuoi dati</h4>
                        <p className="text-gray-500 text-sm">Il personale inserirà i tuoi dati per generare il voucher personalizzato.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <span className="text-lg">🎫</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Ricevi il voucher</h4>
                        <p className="text-gray-500 text-sm">Riceverai il tuo voucher con QR code, pronto da utilizzare.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-amber-800 text-sm font-medium">💡 Il voucher è gratuito e viene emesso dal personale del negozio.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
