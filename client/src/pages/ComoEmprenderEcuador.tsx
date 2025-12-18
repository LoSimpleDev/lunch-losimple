import { useEffect, useId } from "react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  CheckCircle, 
  XCircle,
  FileText, 
  DollarSign,
  Shield,
  ClipboardCheck,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";
import logoUrl from "@assets/aArtboard 1_1757538311500.png";

const preguntasClave = [
  {
    icon: CheckCircle,
    title: "¿Tienes claro tu negocio y cómo generar ingresos?",
    content: [
      "Qué vendes",
      "A quién",
      "Cómo vas a cobrar",
      "Si existe demanda real"
    ],
    nota: "Si aún estás probando ideas sin ingresos claros, quizá todavía no necesitas una SAS."
  },
  {
    icon: DollarSign,
    title: "¿Entiendes los costos asociados?",
    content: [
      "Contabilidad",
      "Declaraciones tributarias",
      "Renovaciones y trámites",
      "Posible oficial de cumplimiento (según actividad)"
    ],
    nota: "Saber esto desde el inicio evita frustraciones después."
  },
  {
    icon: ClipboardCheck,
    title: "¿Estás listo para la formalidad?",
    content: [
      "Cumplir obligaciones fiscales",
      "Presentar balances",
      "Mantener documentación societaria",
      "Responder ante entidades de control"
    ],
    nota: "Si hoy la formalidad te genera resistencia o confusión, es mejor evaluarlo antes."
  },
  {
    icon: Shield,
    title: "¿Necesitas responsabilidad limitada?",
    content: [
      "Quieres separar tu patrimonio personal del negocio",
      "Asumes riesgos comerciales",
      "Trabajas con clientes, contratos o montos relevantes"
    ],
    nota: "Si operas solo y a muy baja escala, puede que aún no lo necesites."
  },
  {
    icon: FileText,
    title: "¿Tienes la documentación básica?",
    content: [
      "Cédula o pasaporte",
      "Información clara de socios (si aplica)",
      "Datos básicos del negocio"
    ],
    nota: "Parece obvio, pero muchos procesos se traban por no tener esto claro desde el inicio."
  }
];

const erroresComunes = [
  "Crear la empresa \"por si acaso\"",
  "Pensar que no habrá obligaciones después",
  "Copiar estatutos sin entenderlos",
  "No prever costos recurrentes",
  "Formalizar sin ingresos reales"
];

const faqs = [
  {
    question: "¿Todas las personas deberían crear una SAS?",
    answer: "No. La SAS es una herramienta, no un requisito. Depende del tipo de negocio y del momento."
  },
  {
    question: "¿Puedo empezar como persona natural y luego pasar a SAS?",
    answer: "Sí, es una ruta común y válida en Ecuador."
  },
  {
    question: "¿La SAS es solo para negocios grandes?",
    answer: "No. Se usa mucho en micro y pequeños negocios, pero requiere responsabilidad."
  },
  {
    question: "¿Qué pasa si creo una SAS y luego no la uso?",
    answer: "La empresa sigue existiendo y genera obligaciones, incluso sin facturar."
  }
];

function FAQSchema() {
  const schemaId = useId();
  
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema-id', `faq-schema-${schemaId}`);
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector(`script[data-schema-id="faq-schema-${schemaId}"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [schemaId]);

  return null;
}

function ArticleSchemaLocal() {
  const schemaId = useId();
  
  useEffect(() => {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Cómo saber si soy una SAS en Ecuador en 2026",
      "description": "Descubre si estás listo para crear una SAS en Ecuador. Evalúa tu situación, negocio y nivel de preparación con criterios claros y prácticos para 2026.",
      "author": {
        "@type": "Organization",
        "name": "Lo Simple",
        "url": "https://losimple.ai"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Lo Simple",
        "logo": {
          "@type": "ImageObject",
          "url": "https://losimple.ai/logo.png"
        }
      },
      "datePublished": "2025-01-01",
      "dateModified": new Date().toISOString().split('T')[0],
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://losimple.ai/como-emprender-en-ecuador-con-una-empresa-2026"
      },
      "image": "https://losimple.ai/og-image-losimple.png",
      "articleSection": "Emprendimiento",
      "inLanguage": "es-EC",
      "keywords": "SAS Ecuador, crear empresa Ecuador, emprender Ecuador 2026, requisitos SAS"
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema-id', `article-schema-${schemaId}`);
    script.textContent = JSON.stringify(articleSchema);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector(`script[data-schema-id="article-schema-${schemaId}"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [schemaId]);

  return null;
}

function CTATestButton() {
  return (
    <div className="my-10 text-center">
      <Button 
        size="lg" 
        className="text-lg px-10 py-6 font-semibold shadow-lg hover:shadow-xl transition-all"
        data-testid="button-test-sas-inline"
      >
        <Sparkles className="mr-2 h-5 w-5" />
        Haz el Test ahora
        <ChevronRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}

function CTATestFinal() {
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-primary/20 mt-12">
      <CardContent className="p-8 text-center">
        <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-4">Haz el Test SAS y descubre si estás listo</h3>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Creamos un Test SAS para ayudarte a evaluar, en pocos minutos:
        </p>
        <ul className="text-left max-w-md mx-auto mb-6 space-y-2">
          <li className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
            <span>Si una SAS es adecuada para ti</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
            <span>Qué nivel de preparación tienes</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
            <span>Qué deberías ordenar antes de constituir</span>
          </li>
        </ul>
        <Button 
          size="lg" 
          className="text-lg px-10 py-6 font-semibold shadow-lg hover:shadow-xl transition-all"
          data-testid="button-test-sas"
        >
          Hacer el Test SAS
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-muted-foreground mt-4 text-sm">
          Es informativo, no te compromete a nada.
        </p>
      </CardContent>
    </Card>
  );
}

export default function ComoEmprenderEcuador() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Cómo saber si soy una SAS en Ecuador en 2026 | Lo Simple"
        description="Descubre si estás listo para crear una SAS en Ecuador. Evalúa tu situación, negocio y nivel de preparación con criterios claros y prácticos para 2026."
        keywords="SAS Ecuador, crear empresa Ecuador, emprender Ecuador 2026, requisitos SAS, formalizar negocio Ecuador"
        canonical="/como-emprender-en-ecuador-con-una-empresa-2026"
        ogType="article"
      />
      
      <FAQSchema />
      <ArticleSchemaLocal />
      
      {/* Hero Section - Similar to Home2 */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-48 h-48 bg-accent opacity-20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <img 
                src={logoUrl} 
                alt="Lo Simple" 
                className="h-14 md:h-16 w-auto"
                data-testid="img-logo-hero"
              />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight">
              Cómo saber si soy una SAS en Ecuador en 2026
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              Crear una SAS en Ecuador es cada vez más común, pero no siempre es la mejor opción para todos los negocios.
              Antes de constituir una empresa, conviene detenerse un momento y evaluar si tu situación, tu negocio y tu nivel de preparación encajan realmente con este tipo societario.
            </p>

            <Button 
              size="lg" 
              className="text-lg px-10 py-6 font-semibold shadow-lg hover:shadow-xl transition-all"
              data-testid="button-test-sas-hero"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Haz el Test ahora
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <main className="container mx-auto px-4 pb-16 max-w-4xl">
        <article className="prose prose-lg max-w-none">
          <p className="text-lg text-muted-foreground mb-8">
            Este artículo te ayuda a responder esa pregunta con criterios claros, actuales y prácticos, pensados para el contexto Ecuador 2026.
          </p>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              ¿Qué significa "estar listo" para crear una SAS?
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              Estar listo para una SAS no es solo tener una idea o querer formalizarte.
              Implica entender qué exige la formalidad, qué responsabilidades asumes y si la estructura de la SAS realmente te conviene.
            </p>
            <p className="text-lg text-muted-foreground">
              Una SAS es flexible, sí. Pero sigue siendo una empresa, con obligaciones legales, tributarias y administrativas.
            </p>
          </section>

          <CTATestButton />

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-foreground">
              Preguntas clave para saber si una SAS es para ti
            </h2>
            
            <div className="space-y-6">
              {preguntasClave.map((pregunta, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <pregunta.icon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-foreground">
                          {pregunta.title}
                        </h3>
                        <ul className="space-y-2 mb-4">
                          {pregunta.content.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-muted-foreground">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <p className="text-sm text-primary/80 italic">
                          {pregunta.nota}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <CTATestButton />

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Errores comunes al crear una SAS sin estar preparado
            </h2>
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {erroresComunes.map((error, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                      <span className="text-foreground">{error}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-muted-foreground mt-6 text-sm">
                  Estos errores explican por qué muchas SAS quedan inactivas o se cierran al poco tiempo.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Entonces… ¿soy una SAS o no?
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              La respuesta no es igual para todos.
              Depende de tu momento, tu negocio y tu nivel de preparación.
            </p>
            <p className="text-lg text-muted-foreground">
              Por eso, más que darte una respuesta genérica, lo más útil es evaluar tu caso concreto con preguntas diseñadas para el contexto legal y emprendedor del Ecuador.
            </p>
          </section>

          <CTATestFinal />

          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-foreground">
              Preguntas frecuentes
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left text-lg font-medium" data-testid={`faq-trigger-${index}`}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section className="mt-16 text-center">
            <Link href="/launch">
              <Button variant="outline" size="lg" className="mr-4" data-testid="button-ver-launch">
                Conocer servicio Launch
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="ghost" size="lg" data-testid="button-ver-blog">
                Ver más artículos
              </Button>
            </Link>
          </section>
        </article>

        <footer className="mt-16 pt-8 border-t">
          <div className="flex items-center justify-center gap-4">
            <img src={logoUrl} alt="Lo Simple" className="h-8" />
            <span className="text-muted-foreground text-sm">
              © 2026 Lo Simple. Servicios legales para emprendedores.
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
