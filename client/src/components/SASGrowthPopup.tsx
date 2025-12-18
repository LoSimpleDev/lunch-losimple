import { useState, useEffect } from "react";
import { X, Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function SASGrowthPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenClosed, setHasBeenClosed] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('sas-growth-popup-closed');
    if (hasSeenPopup) {
      setHasBeenClosed(true);
      return;
    }

    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercentage > 25 && !hasBeenClosed) {
        setIsVisible(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasBeenClosed]);

  const handleClose = () => {
    setIsVisible(false);
    setHasBeenClosed(true);
    sessionStorage.setItem('sas-growth-popup-closed', 'true');
  };

  if (!isVisible || hasBeenClosed) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
        data-testid="popup-overlay"
      >
        <div 
          className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300"
          onClick={(e) => e.stopPropagation()}
          data-testid="popup-sas-growth"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Cerrar"
            data-testid="button-close-popup"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 pr-8">
            ¿Sabías que en Ecuador ya van <span className="text-[#6C5CE7]">constituidas más de 75.576 SAS</span>?
          </h2>

          <div className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed space-y-4">
            <p>
              Hoy, crear una empresa en Ecuador es más accesible que nunca. Con una SAS puedes darle un nombre legal a tu negocio, separar tu patrimonio personal, llevar contabilidad profesional y abrir la puerta a mejores oportunidades de financiamiento o inversión.
            </p>
            <p>
              La constitución dejó de ser un trámite complejo y costoso. Hoy es posible formalizarse <strong className="text-[#6C5CE7]">desde $1, sin notarios</strong> y mediante un proceso digital. Por eso la SAS se ha convertido en la opción preferida para emprender en 2026, siempre que estés listo para asumir la formalidad que conlleva.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/cotizar-creacion-sas" className="flex-1">
              <Button 
                className="w-full bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white font-semibold h-12"
                onClick={handleClose}
                data-testid="button-popup-cotizar"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Solicitar cotización SAS
              </Button>
            </Link>
            <Link href="/blog/crecimiento-sas-ecuador-estadisticas-2026" className="flex-1">
              <Button 
                className="w-full bg-[#FFEAA7] hover:bg-[#f5dc8a] text-gray-900 font-semibold h-12 border-0"
                onClick={handleClose}
                data-testid="button-popup-leer-articulo"
              >
                <FileText className="w-5 h-5 mr-2" />
                Ver artículo completo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
