import { useEffect } from 'react';

export function SchemaMarkup() {
  useEffect(() => {
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Lo Simple",
      "alternateName": "documentos-sas",
      "url": "https://losimple.ai",
      "logo": "https://losimple.ai/logo.png",
      "description": "Servicios empresariales y legales para SAS en Ecuador. Constituye tu empresa SAS de forma simple y rápida.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "EC",
        "addressLocality": "Ecuador"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "-0.1807",
        "longitude": "-78.4678"
      },
      "telephone": "+593958613237",
      "priceRange": "$$",
      "areaServed": {
        "@type": "Country",
        "name": "Ecuador"
      },
      "sameAs": [
        "https://www.linkedin.com/company/losimple"
      ]
    };

    const launchServiceSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Launch - Paquete Todo Incluido para SAS",
      "description": "Servicio completo para constituir tu empresa SAS en Ecuador. Incluye logo, página web, redes sociales, constitución legal, facturación electrónica y firma electrónica.",
      "brand": {
        "@type": "Brand",
        "name": "Lo Simple"
      },
      "offers": {
        "@type": "Offer",
        "price": "688.85",
        "priceCurrency": "USD",
        "priceValidUntil": "2025-12-31",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Lo Simple"
        },
        "description": "$599 + IVA (15%)"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "reviewCount": "150"
      }
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Cuánto cuesta constituir una SAS en Ecuador?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "El servicio Launch de Lo Simple cuesta $599 + IVA (15%), total $688.85. Este paquete todo incluido contiene logo profesional, página web, manejo de redes sociales, constitución de la SAS, facturación electrónica y firma electrónica por 1 año."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué documentos necesito para constituir una SAS en Ecuador?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Para constituir una SAS necesitas: cédula de identidad de los accionistas, información del objeto social de la empresa, definición del capital social, y datos de contacto. Lo Simple te guía en un formulario de 8 pasos para recopilar toda la información necesaria."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cuánto tiempo toma constituir una SAS con Lo Simple?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "El tiempo promedio de entrega es de 5 días hábiles. El proceso incluye diseño de logo, desarrollo web, trámites legales ante la Superintendencia de Compañías y activación de facturación electrónica."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué incluye el servicio Launch de Lo Simple?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "El servicio Launch incluye: diseño de logo profesional, página web corporativa, manejo de redes sociales, constitución legal de la SAS, facturación electrónica SRI, firma electrónica válida por 1 año, y asesoría personalizada durante todo el proceso."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cómo funciona el proceso de pago en Lo Simple?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "El proceso es simple: escoges el servicio Launch, completas el formulario de 8 pasos con la información de tu empresa, realizas el pago de $688.85 mediante tarjeta de crédito o débito con Stripe, y nuestro equipo inicia inmediatamente el proceso de constitución."
          }
        },
        {
          "@type": "Question",
          "name": "¿Puedo hacer seguimiento del avance de mi constitución SAS?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sí, Lo Simple ofrece un dashboard personalizado donde puedes ver en tiempo real el progreso de cada etapa: diseño de logo, desarrollo web, redes sociales, trámites legales, facturación electrónica y firma electrónica. Recibes actualizaciones constantes del equipo."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué es una SAS en Ecuador?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Una Sociedad por Acciones Simplificada (SAS) es un tipo de compañía en Ecuador que permite formalizar un negocio de manera simple y con menos requisitos que otras figuras legales. Es ideal para emprendedores y pequeñas empresas que buscan operar legalmente."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué beneficios obtengo al contratar el servicio Launch?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Al contratar Launch obtienes beneficios exclusivos con aliados de Lo Simple, incluyendo descuentos en servicios de ToSellMore, horas gratis de coworking en Impaqto, créditos para Sassi y descuentos en asesoría legal. Cada beneficio se canjea mediante códigos únicos."
          }
        }
      ]
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Inicio",
          "item": "https://losimple.ai"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Servicios",
          "item": "https://losimple.ai#services"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Launch",
          "item": "https://losimple.ai/launch"
        }
      ]
    };

    const schemas = [
      organizationSchema,
      launchServiceSchema,
      faqSchema,
      breadcrumbSchema
    ];

    schemas.forEach((schema, index) => {
      const existingScript = document.querySelector(`script[data-schema-id="schema-${index}"]`);
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema-id', `schema-${index}`);
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      schemas.forEach((_, index) => {
        const script = document.querySelector(`script[data-schema-id="schema-${index}"]`);
        if (script) {
          script.remove();
        }
      });
    };
  }, []);

  return null;
}
