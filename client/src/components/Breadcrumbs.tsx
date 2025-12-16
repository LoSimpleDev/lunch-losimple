import { Link, useLocation } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import { useEffect, useId } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const [location] = useLocation();
  const uniqueId = useId();
  const schemaId = `breadcrumb-schema-${uniqueId.replace(/:/g, '')}`;

  useEffect(() => {
    const itemListElement = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://losimple.ai"
      },
      ...items.map((item, index) => {
        const listItem: Record<string, any> = {
          "@type": "ListItem",
          "position": index + 2,
          "name": item.label
        };
        if (item.href) {
          listItem.item = `https://losimple.ai${item.href}`;
        } else {
          listItem.item = `https://losimple.ai${location}`;
        }
        return listItem;
      })
    ];

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": itemListElement
    };

    const existingScript = document.querySelector(`script[data-schema-id="${schemaId}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema-id', schemaId);
    script.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector(`script[data-schema-id="${schemaId}"]`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [items, location, schemaId]);

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}
      data-testid="breadcrumb-nav"
    >
      <Link href="/">
        <span className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors">
          <Home className="w-4 h-4" />
          <span className="sr-only md:not-sr-only">Inicio</span>
        </span>
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          {item.href ? (
            <Link href={item.href}>
              <span 
                className="hover:text-primary cursor-pointer transition-colors"
                data-testid={`breadcrumb-link-${index}`}
              >
                {item.label}
              </span>
            </Link>
          ) : (
            <span 
              className="text-foreground font-medium"
              data-testid={`breadcrumb-current-${index}`}
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
