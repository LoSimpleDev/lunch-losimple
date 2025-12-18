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
      "name": "Launch - Servicio Integral para SAS en Ecuador",
      "description": "Servicio integral para crear tu SAS en Ecuador con estructura legal completa, registro de marca, página web profesional con blog y chatbot, optimización SEO, AEO y AIO.",
      "brand": {
        "@type": "Brand",
        "name": "Lo Simple"
      },
      "offers": {
        "@type": "Offer",
        "price": "1723.85",
        "priceCurrency": "USD",
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Lo Simple"
        },
        "description": "$1,499 + IVA (15%)"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "reviewCount": "150"
      }
    };

    const constitucionSASSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Constitución de SAS",
      "name": "Constitución de Empresa SAS en Ecuador",
      "description": "Servicio de constitución de Sociedades por Acciones Simplificadas (SAS) en Ecuador. Trámite 100% digital ante la Superintendencia de Compañías.",
      "provider": {
        "@type": "Organization",
        "name": "Lo Simple",
        "url": "https://losimple.ai"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Ecuador"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Servicios de Constitución SAS",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Constitución SAS Básica",
              "description": "Constitución de empresa SAS con contrato, títulos de acciones, nombramientos y RUC"
            }
          }
        ]
      }
    };

    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "Cómo constituir una SAS en Ecuador",
      "description": "Guía paso a paso para crear tu Sociedad por Acciones Simplificada (SAS) en Ecuador de forma 100% digital.",
      "totalTime": "P5D",
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": "1"
      },
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Obtener firma electrónica",
          "text": "Cada accionista debe contar con una firma electrónica vigente emitida por el Registro Civil o Security Data."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Reservar nombre de la empresa",
          "text": "Solicitar la reserva de denominación en la Superintendencia de Compañías, Valores y Seguros."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Preparar documentos constitutivos",
          "text": "Elaborar el contrato constitutivo con objeto social, capital, distribución de acciones y administración."
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Firmar digitalmente",
          "text": "Todos los accionistas firman electrónicamente los documentos constitutivos."
        },
        {
          "@type": "HowToStep",
          "position": 5,
          "name": "Obtener RUC",
          "text": "Una vez aprobada la constitución, obtener el Registro Único de Contribuyentes (RUC) ante el SRI."
        }
      ]
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Qué es una SAS en Ecuador?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Una Sociedad por Acciones Simplificada (SAS) es el tipo de empresa más flexible para emprendedores en Ecuador. Se constituye 100% en línea, puede tener un solo accionista, no requiere capital mínimo alto y limita tu responsabilidad al capital aportado. Es ideal para formalizar tu negocio de forma rápida y segura."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cuáles son los requisitos para crear una SAS en Ecuador?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Para constituir una SAS necesitas: firma electrónica vigente de cada accionista (formato .p12), cédula de ciudadanía o pasaporte, reserva de nombre aprobada en la Superintendencia de Compañías, definir el objeto social y los estatutos de la empresa. Nosotros te guiamos en todo el proceso."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cuánto tiempo toma constituir una SAS en Ecuador?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "El proceso completo para crear tu SAS toma entre 2 y 5 días hábiles una vez que tengas todos los requisitos listos. Con Lo Simple, gestionamos todo para que tu empresa quede constituida lo más rápido posible."
          }
        },
        {
          "@type": "Question",
          "name": "¿Necesito abogado o notario para crear mi SAS?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No es obligatorio. La SAS en Ecuador se constituye con documentos privados firmados digitalmente, sin necesidad de escritura pública ante notario. Sin embargo, contar con asesoría profesional como la de Lo Simple evita errores y acelera significativamente el proceso."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cuáles son las obligaciones de una SAS una vez constituida?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Tu SAS debe llevar contabilidad, presentar declaraciones de impuestos (IVA mensual o semestral, Impuesto a la Renta anual), emitir facturas electrónicas y reportar anualmente a la Superintendencia de Compañías. Te ayudamos a entender y cumplir con todas estas obligaciones."
          }
        },
        {
          "@type": "Question",
          "name": "¿Puedo constituir una SAS siendo el único socio?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sí, la SAS en Ecuador permite tener desde 1 hasta múltiples accionistas. Es ideal tanto para emprendedores individuales como para proyectos en equipo. No necesitas socios para formalizar tu empresa."
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
      constitucionSASSchema,
      howToSchema,
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
