import { Link } from "wouter";
import { Building2, Mail, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna 1: Acerca de */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Lo Simple</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Servicios legales especializados para empresas SAS en Ecuador. Simplificamos la gestión legal de tu negocio.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <a href="mailto:hola@losimple.ai" className="hover:text-primary transition-colors">
                hola@losimple.ai
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces Legales */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/terminos-y-condiciones" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-footer-terms"
                >
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link 
                  href="/politica-privacidad-datos-lo-simple" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-footer-privacy"
                >
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Acceso Equipo */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Equipo Lo Simple</h3>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Acceso exclusivo para el equipo de administración
              </p>
              <Link href="/adminlaunch">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium" data-testid="link-admin-access">
                  <Shield className="w-4 h-4" />
                  Acceso Admin
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Lo Simple. Todos los derechos reservados.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/launch" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-footer-launch"
              >
                Servicio Launch
              </Link>
              <Link 
                href="/saslegal-plus" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-footer-membership"
              >
                SASLegal Plus
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
