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
            ¿Sabías que en Ecuador ya van <span className="text-green-600">constituidas más de 75.576 SAS</span>?
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            Hoy puedes tener un nombre legal para tu negocio, llevar contabilidad profesional, 
            acceder a mejores créditos y <strong>vender acciones</strong> a inversionistas. 
            Aprovecha esta oportunidad única: constituye tu empresa <strong className="text-green-600">desde $1, sin notarios</strong> ni trámites costosos. 
            Es fácil, rápido y ahora está al alcance de todos.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/cotizar-creacion-sas" className="flex-1">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold h-12"
                onClick={handleClose}
                data-testid="button-popup-cotizar"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Solicitar cotización SAS
              </Button>
            </Link>
            <Link href="/blog/crecimiento-sas-ecuador-estadisticas-2026" className="flex-1">
              <Button 
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 font-semibold h-12"
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
