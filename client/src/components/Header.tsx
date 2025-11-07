import { Cart } from "@/components/Cart";
import logoUrl from "@assets/aArtboard 1_1757538311500.png";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4">
        <div className="mr-4 flex">
          <a 
            href="/" 
            className="mr-6 flex items-center space-x-2"
            data-testid="link-home"
          >
            <img 
              src={logoUrl} 
              alt="Lo Simple" 
              className="h-8 w-auto"
              data-testid="img-logo"
            />
          </a>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-4">
            <a 
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors"
              data-testid="link-inicio"
            >
              Inicio
            </a>
            <a 
              href="/launch"
              className="text-sm font-medium hover:text-primary transition-colors"
              data-testid="link-launch"
            >
              Launch
            </a>
            <a 
              href="/saslegal-plus"
              className="text-sm font-medium hover:text-primary transition-colors"
              data-testid="link-membership"
            >
              Membresía
            </a>
            <a 
              href="https://facturacion.losimple.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-primary transition-colors"
              data-testid="link-billing"
            >
              Facturación Electrónica
            </a>
            <Cart />
          </div>
        </div>
      </div>
    </header>
  );
}