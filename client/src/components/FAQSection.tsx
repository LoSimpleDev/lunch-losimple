import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "¿Qué es una SAS en Ecuador?",
    answer: "Una Sociedad por Acciones Simplificada (SAS) es el tipo de empresa más flexible para emprendedores en Ecuador. Se constituye 100% en línea, puede tener un solo accionista, no requiere capital mínimo alto y limita tu responsabilidad al capital aportado. Es ideal para formalizar tu negocio de forma rápida y segura."
  },
  {
    question: "¿Cuáles son los requisitos para crear una SAS en Ecuador?",
    answer: "Para constituir una SAS necesitas: firma electrónica vigente de cada accionista (formato .p12), cédula de ciudadanía o pasaporte, reserva de nombre aprobada en la Superintendencia de Compañías, definir el objeto social y los estatutos de la empresa. Nosotros te guiamos en todo el proceso."
  },
  {
    question: "¿Cuánto tiempo toma constituir una SAS en Ecuador?",
    answer: "El proceso completo para crear tu SAS toma entre 2 y 5 días hábiles una vez que tengas todos los requisitos listos. Con Lo Simple, gestionamos todo para que tu empresa quede constituida lo más rápido posible."
  },
  {
    question: "¿Necesito abogado o notario para crear mi SAS?",
    answer: "No es obligatorio. La SAS en Ecuador se constituye con documentos privados firmados digitalmente, sin necesidad de escritura pública ante notario. Sin embargo, contar con asesoría profesional como la de Lo Simple evita errores y acelera significativamente el proceso."
  },
  {
    question: "¿Cuáles son las obligaciones de una SAS una vez constituida?",
    answer: "Tu SAS debe llevar contabilidad, presentar declaraciones de impuestos (IVA mensual o semestral, Impuesto a la Renta anual), emitir facturas electrónicas y reportar anualmente a la Superintendencia de Compañías. Te ayudamos a entender y cumplir con todas estas obligaciones."
  },
  {
    question: "¿Puedo constituir una SAS siendo el único socio?",
    answer: "Sí, la SAS en Ecuador permite tener desde 1 hasta múltiples accionistas. Es ideal tanto para emprendedores individuales como para proyectos en equipo. No necesitas socios para formalizar tu empresa."
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
