import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "¿Cuánto cuesta constituir una SAS en Ecuador?",
    answer: "El servicio Launch de Lo Simple cuesta $599 + IVA (15%), total $688.85. Este paquete todo incluido contiene logo profesional, página web, manejo de redes sociales, constitución de la SAS, facturación electrónica y firma electrónica por 1 año."
  },
  {
    question: "¿Qué documentos necesito para constituir una SAS en Ecuador?",
    answer: "Para constituir una SAS necesitas: cédula de identidad de los accionistas, información del objeto social de la empresa, definición del capital social, y datos de contacto. Lo Simple te guía en un formulario de 8 pasos para recopilar toda la información necesaria."
  },
  {
    question: "¿Cuánto tiempo toma constituir una SAS con Lo Simple?",
    answer: "El tiempo promedio de entrega es de 5 días hábiles. El proceso incluye diseño de logo, desarrollo web, trámites legales ante la Superintendencia de Compañías y activación de facturación electrónica."
  },
  {
    question: "¿Qué incluye el servicio Launch de Lo Simple?",
    answer: "El servicio Launch incluye: diseño de logo profesional, página web corporativa, manejo de redes sociales, constitución legal de la SAS, facturación electrónica SRI, firma electrónica válida por 1 año, y asesoría personalizada durante todo el proceso."
  },
  {
    question: "¿Cómo funciona el proceso de pago en Lo Simple?",
    answer: "El proceso es simple: escoges el servicio Launch, completas el formulario de 8 pasos con la información de tu empresa, realizas el pago de $688.85 mediante tarjeta de crédito o débito con Stripe, y nuestro equipo inicia inmediatamente el proceso de constitución."
  },
  {
    question: "¿Puedo hacer seguimiento del avance de mi constitución SAS?",
    answer: "Sí, Lo Simple ofrece un dashboard personalizado donde puedes ver en tiempo real el progreso de cada etapa: diseño de logo, desarrollo web, redes sociales, trámites legales, facturación electrónica y firma electrónica. Recibes actualizaciones constantes del equipo."
  },
  {
    question: "¿Qué es una SAS en Ecuador?",
    answer: "Una Sociedad por Acciones Simplificada (SAS) es un tipo de compañía en Ecuador que permite formalizar un negocio de manera simple y con menos requisitos que otras figuras legales. Es ideal para emprendedores y pequeñas empresas que buscan operar legalmente."
  },
  {
    question: "¿Qué beneficios obtengo al contratar el servicio Launch?",
    answer: "Al contratar Launch obtienes beneficios exclusivos con aliados de Lo Simple, incluyendo descuentos en servicios de ToSellMore, horas gratis de coworking en Impaqto, créditos para Sassi y descuentos en asesoría legal. Cada beneficio se canjea mediante códigos únicos."
  }
];

export function FAQSection() {
  return (
    <section className="py-20 px-4 bg-muted/30" itemScope itemType="https://schema.org/FAQPage">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Preguntas Frecuentes
            </h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Respuestas a las preguntas más comunes sobre constituir una SAS en Ecuador
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-background rounded-lg px-6 border"
              itemScope 
              itemProp="mainEntity" 
              itemType="https://schema.org/Question"
              data-testid={`faq-item-${index}`}
            >
              <AccordionTrigger 
                className="hover:no-underline py-4 text-left"
                data-testid={`faq-trigger-${index}`}
              >
                <span className="font-semibold" itemProp="name">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent 
                className="text-muted-foreground pb-4"
                itemScope 
                itemProp="acceptedAnswer" 
                itemType="https://schema.org/Answer"
                data-testid={`faq-content-${index}`}
              >
                <div itemProp="text">
                  {faq.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="font-semibold mb-2">¿Tienes más preguntas?</h3>
          <p className="text-muted-foreground mb-4">
            Nuestro equipo está listo para ayudarte
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="https://wa.me/593958613237" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              data-testid="button-faq-whatsapp"
            >
              WhatsApp
            </a>
            <a 
              href="mailto:contacto@losimple.co" 
              className="inline-flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              data-testid="button-faq-email"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
