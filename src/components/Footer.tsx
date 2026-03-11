import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-semibold tracking-tight">
                Shorty Shop
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Il tuo brand di riferimento per moda, stile e tendenze
              contemporanee.
            </p>
          </div>

          {/* Negozi */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">
              Negozi
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/uomo"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Shorty Uomo
                </Link>
              </li>
              <li>
                <Link
                  href="/woman"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Shorty Woman
                </Link>
              </li>
              <li>
                <Link
                  href="/intimissimi"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Shorty Intimissimi
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">
              Promozione
            </h4>
            <ul className="space-y-3">
              <li className="text-gray-400 text-sm">Voucher gratuiti</li>
              <li className="text-gray-400 text-sm">Validità 30 giorni</li>
              <li className="text-gray-400 text-sm">Utilizzabili in negozio</li>
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">
              Contatti
            </h4>
            <ul className="space-y-3">
              <li className="text-gray-400 text-sm">info@shortyshop.it</li>
              <li className="text-gray-400 text-sm">+39 02 1234567</li>
              <li className="text-gray-400 text-sm">Milano, Italia</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Shorty Shop. Tutti i diritti riservati.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-gray-500 text-sm hover:text-gray-300 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="text-gray-500 text-sm hover:text-gray-300 transition-colors cursor-pointer">
              Termini e Condizioni
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
