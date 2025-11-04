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
    answer: "El servicio Launch cuesta $688.85 (incluye IVA). Obtienes logo, página web, redes sociales, constitución legal, facturación electrónica y firma digital."
  },
  {
    question: "¿Qué documentos necesito para crear mi SAS?",
    answer: "Solo necesitas tu cédula de identidad y completar nuestro formulario en línea. Te guiamos paso a paso para recopilar toda la información."
  },
  {
    question: "¿Cuánto tiempo demora el proceso?",
    answer: "En promedio 5 días hábiles. Recibes tu empresa completamente lista para operar con todos los trámites legales completos."
  },
  {
    question: "¿Necesito capital mínimo para crear una SAS?",
    answer: "No, una SAS en Ecuador no requiere capital mínimo. Puedes empezar con el monto que tengas disponible."
  },
  {
    question: "¿Cómo hago seguimiento de mi solicitud?",
    answer: "Tienes acceso a un dashboard donde ves el progreso en tiempo real de cada etapa. También recibes notificaciones por WhatsApp."
  },
  {
    question: "¿Qué es una SAS?",
    answer: "Es una Sociedad por Acciones Simplificada. Te permite formalizar tu negocio de manera rápida y protege tu patrimonio personal."
  },
  {
    question: "¿Puedo crear una SAS yo solo?",
    answer: "Sí, puedes constituir una SAS con un solo accionista. No necesitas socios para empezar tu empresa."
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
