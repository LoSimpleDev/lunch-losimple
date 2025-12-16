import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  CheckCircle, 
  XCircle,
  FileText, 
  Users,
  Scale,
  Clock,
  Building,
  AlertTriangle,
  ChevronRight,
  MessageCircle,
  X
} from "lucide-react";
import { Link } from "wouter";
import logoUrl from "@assets/aArtboard 1_1757538311500.png";

const popupChecklist = [
  "Tu empresa ya no está operando",
  "No tienes deudas pendientes con nadie",
  "Estás al día con el SRI",
  "No mantienes obligaciones con el IESS",
  "Puedes presentar un balance final en cero",
  "Los socios están de acuerdo en cerrar de forma voluntaria",
  "Quieres dejar todo bien hecho, sin multas ni problemas más adelante"
];

const requisitos = [
  "Empresa sin deudas con terceros",
  "Certificado de cumplimiento del SRI",
  "Certificado del IESS",
  "Acta de socios aprobando la disolución",
  "Balance final con pasivo en cero",
  "Nombramiento vigente del representante legal"
];

const pasos = [
  "Los socios aprueban el cierre voluntario",
  "Se prepara el balance final y documentos legales",
  "Se presenta la solicitud ante la Superintendencia",
  "Se publica el aviso legal",
  "Si no hay oposiciones, la empresa se cancela",
  "Se cierra el RUC en el SRI"
];

const ventajas = [
  "100% legal y reconocido por la Superintendencia",
  "Sin juicio ni liquidación prolongada",
  "Proceso principalmente digital",
  "Sin tasas ante la Superintendencia",
  "Evita multas futuras",
  "Permite cerrar el RUC definitivamente"
];

const faqs = [
  {
    question: "¿Puedo cerrar una SAS si nunca facturó?",
    answer: "Sí, siempre que no tenga deudas ni obligaciones pendientes."
  },
  {
    question: "¿Es obligatorio hacerlo con un abogado?",
    answer: "No es obligatorio, pero es recomendable para evitar errores que retrasen el trámite."
  },
  {
    question: "¿Qué pasa si no cierro mi empresa?",
    answer: "La empresa sigue existiendo y puede generar multas por incumplimientos formales."
  },
  {
    question: "¿Se puede cerrar una SAS con deudas?",
    answer: "No mediante trámite abreviado. En ese caso aplica un proceso ordinario."
  },
  {
    question: "¿El RUC se cierra automáticamente?",
    answer: "No. Luego de cancelar la empresa, debes cerrar el RUC en el SRI."
  }
];

const tablaResumen = [
  { aspecto: "Tipo de cierre", detalle: "Voluntario" },
  { aspecto: "Procedimiento", detalle: "Trámite abreviado" },
  { aspecto: "Requiere juicio", detalle: "No" },
  { aspecto: "Aplica si hay deudas", detalle: "No" },
  { aspecto: "Entidad", detalle: "Superintendencia de Compañías" },
  { aspecto: "Resultado", detalle: "Empresa y RUC cancelados" }
];

function CTAButton() {
  return (
    <div className="text-center py-8">
      <h3 className="text-2xl font-bold mb-4">¿Quieres empezar el cierre de tu SAS?</h3>
      <Button 
        size="lg" 
        className="text-lg px-10 py-6 font-semibold shadow-lg hover:shadow-xl transition-all bg-red-600 hover:bg-red-700 text-white"
        onClick={() => window.open('https://wa.me/593958613237?text=' + encodeURIComponent('Hola Dra Verónica, vengo de su página y me interesa cerrar mi SAS.'), '_blank')}
        data-testid="button-cta-cerrar-sas"
      >
        <MessageCircle className="mr-2 h-5 w-5" />
        Empezar
        <ChevronRight className="ml-2 h-5 w-5" />
      </Button>
      <p className="text-muted-foreground mt-4 text-sm">
        Te guiamos paso a paso y revisamos si el trámite abreviado aplica en tu caso.
      </p>
    </div>
  );
}

export default function CerrarSAS() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150 && !popupDismissed) {
        setShowPopup(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [popupDismissed]);

  const closePopup = () => {
    setShowPopup(false);
    setPopupDismissed(true);
  };

  return (
    <>
      <SEO 
        title="Cerrar Empresa SAS Ecuador | Liquidación voluntaria abreviada"
        description="Cierra tu empresa SAS en Ecuador de forma legal y rápida. Proceso de liquidación voluntaria abreviada en 4 días sin juicio. Asesoría profesional incluida."
        canonical="/cerrar-sas"
        keywords="cerrar empresa SAS Ecuador, liquidación SAS, disolver empresa Ecuador, cerrar compañía Ecuador"
      />
      <div className="min-h-screen bg-background">
      {/* Scroll Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <button 
              onClick={closePopup}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              data-testid="button-close-popup"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
            
            <div className="p-8">
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-4 text-red-600">
                Con nuestro proceso premium puedes "cerrar" tu empresa en 4 días
              </h3>
              
              <p className="text-center text-lg text-muted-foreground mb-6">
                Cerrar una empresa no es fracasar.
              </p>

              <p className="font-semibold mb-4">Este proceso es para ti si:</p>
              
              <ul className="space-y-3 mb-6">
                {popupChecklist.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <p className="text-sm text-muted-foreground mb-6">
                Si te reconoces en estos puntos, el proceso premium es el camino correcto. Dale clic, abre una cuenta en nuestra plataforma y libérate del problema.
              </p>

              <div className="space-y-3">
                <Button 
                  size="lg" 
                  className="w-full text-lg py-6 font-semibold bg-red-600 hover:bg-red-700 text-white"
                  data-testid="button-popup-cerrar-sas"
                  onClick={() => window.location.href = '/login'}
                >
                  Empezar Proceso Premium
                </Button>
                
                <Button 
                  variant="outline"
                  size="lg" 
                  className="w-full text-lg py-6 font-semibold border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  data-testid="button-popup-no-cumplo"
                  onClick={() => window.location.href = '/preparar-cierre-sas'}
                >
                  No cumplo requisitos
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-background to-red-100/30 dark:from-red-950/20 dark:to-red-900/10 py-20 px-4">
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <Link href="/">
              <div className="mb-8 flex justify-center cursor-pointer">
                <img 
                  src={logoUrl} 
                  alt="Lo Simple" 
                  className="h-12 md:h-16 w-auto"
                  data-testid="img-logo-cerrar-sas"
                />
              </div>
            </Link>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Cierre de empresas SAS en Ecuador
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Trámite abreviado, 100% legal y sin complicaciones
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Si tu empresa SAS ya no opera y no tiene deudas, puedes cerrarla formalmente mediante el trámite abreviado ante la Superintendencia de Compañías.
            </p>

            <Card className="max-w-2xl mx-auto bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-8 w-8 text-amber-600 flex-shrink-0 mt-1" />
                  <div className="text-left">
                    <p className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Cerrar una SAS no es "abandonarla".</p>
                    <p className="text-amber-700 dark:text-amber-300">
                      Es disolverla, liquidarla y cancelarla correctamente, evitando multas, obligaciones futuras y problemas tributarios.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA 1 */}
      <section className="py-8 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <CTAButton />
        </div>
      </section>

      {/* Sección 1 - ¿Cuándo necesitas cerrar? */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
            ¿Este proceso es para ti?
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            ¿Cuándo necesitas cerrar una SAS?
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              "Tu empresa ya no opera",
              "No tienes deudas con terceros, SRI o IESS",
              "Quieres cerrar todo en regla",
              "No quieres seguir presentando declaraciones en cero",
              "Buscas una solución clara, sin trámites innecesarios"
            ].map((item, index) => (
              <Card key={index} className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
                <CardContent className="pt-6 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>{item}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center mt-8 text-lg font-medium">
            Si respondiste "sí", el trámite abreviado es la vía correcta.
          </p>
        </div>
      </section>

      {/* Sección 2 - Qué es el trámite abreviado */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8">
            ¿Qué es el cierre abreviado de una SAS?
          </h2>
          
          <p className="text-lg text-center text-muted-foreground max-w-3xl mx-auto mb-12">
            Es un procedimiento legal que permite cerrar una empresa SAS en un solo proceso, siempre que no existan obligaciones pendientes.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-2">
                  <Scale className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle>Disolución</CardTitle>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-2">
                  <FileText className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle>Liquidación</CardTitle>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-2">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle>Cancelación</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <p className="text-center mt-8 text-muted-foreground">
            Todo ante la Superintendencia de Compañías, sin juicio ni procesos largos.
          </p>
        </div>
      </section>

      {/* Sección 3 - Ventajas */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
            Ventajas del trámite abreviado
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {ventajas.map((ventaja, index) => (
              <Card key={index} className="border-2 hover:border-red-300 transition-colors">
                <CardContent className="pt-6 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <span>{ventaja}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 2 */}
      <section className="py-8 px-4 bg-red-50 dark:bg-red-950/20">
        <div className="container mx-auto max-w-3xl">
          <CTAButton />
        </div>
      </section>

      {/* Sección 4 - Requisitos */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
            Requisitos para cerrar una SAS por trámite abreviado
          </h2>

          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {requisitos.map((requisito, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold">{index + 1}</span>
                  </div>
                  <span>{requisito}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center mt-8 text-muted-foreground">
            Si alguno de estos puntos no está claro, es mejor revisarlo antes de iniciar.
          </p>
        </div>
      </section>

      {/* Sección 5 - Pasos */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
            ¿Cómo se cierra una SAS paso a paso?
          </h2>

          <div className="max-w-2xl mx-auto space-y-4">
            {pasos.map((paso, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-background rounded-lg border-2">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
                  {index + 1}
                </div>
                <p className="text-lg pt-1">{paso}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 px-6 py-3 rounded-full">
              <Clock className="h-5 w-5 text-amber-600" />
              <span className="font-medium">Tiempo estimado: alrededor de 2 a 3 meses</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 6 - Tabla resumen */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
            Resumen rápido del cierre de una SAS
          </h2>

          <div className="max-w-2xl mx-auto overflow-hidden rounded-lg border-2">
            <table className="w-full">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Aspecto</th>
                  <th className="px-6 py-4 text-left font-semibold">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {tablaResumen.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-muted/30' : 'bg-background'}>
                    <td className="px-6 py-4 font-medium">{row.aspecto}</td>
                    <td className="px-6 py-4">{row.detalle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Sección 7 - Enfoque Lo Simple */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8">
            ¿Por qué acompañarte en este proceso?
          </h2>

          <p className="text-lg text-center text-muted-foreground max-w-3xl mx-auto mb-12">
            En Lo Simple creemos que cerrar una empresa también es parte del camino emprendedor.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="text-center border-2">
              <CardContent className="pt-6">
                <Users className="h-10 w-10 text-red-600 mx-auto mb-4" />
                <p>No cargues obligaciones innecesarias</p>
              </CardContent>
            </Card>
            <Card className="text-center border-2">
              <CardContent className="pt-6">
                <CheckCircle className="h-10 w-10 text-red-600 mx-auto mb-4" />
                <p>Evita errores formales</p>
              </CardContent>
            </Card>
            <Card className="text-center border-2">
              <CardContent className="pt-6">
                <Scale className="h-10 w-10 text-red-600 mx-auto mb-4" />
                <p>Ten claridad sobre cada paso</p>
              </CardContent>
            </Card>
          </div>

          <p className="text-center mt-8 text-muted-foreground font-medium">
            Sin letra pequeña. Sin trámites que no aplican.
          </p>
        </div>
      </section>

      {/* CTA 3 Final */}
      <section className="py-16 px-4 bg-red-600 text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h3 className="text-3xl font-bold mb-4">¿Quieres empezar el cierre de tu SAS?</h3>
          <Button 
            size="lg" 
            className="text-lg px-10 py-6 font-semibold shadow-lg hover:shadow-xl transition-all bg-white text-red-600 hover:bg-gray-100"
            onClick={() => window.open('https://wa.me/593958613237?text=' + encodeURIComponent('Hola Dra Verónica, vengo de su página y me interesa cerrar mi SAS.'), '_blank')}
            data-testid="button-cta-cerrar-sas-final"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Empezar
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="mt-4 text-red-100">
            Te guiamos paso a paso y revisamos si el trámite abreviado aplica en tu caso.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
            Preguntas frecuentes
          </h2>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer link back */}
      <section className="py-8 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl text-center">
          <Link href="/">
            <Button variant="outline" size="lg" data-testid="button-back-home">
              ← Volver al inicio
            </Button>
          </Link>
        </div>
      </section>
      </div>
    </>
  );
}
