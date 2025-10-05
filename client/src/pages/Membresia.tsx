import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, FileText, PenTool, MessageCircle, Building, Scale, Calculator, Shield, UserCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Membresia() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              La membresía que se paga sola
            </h1>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Scale className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold mb-2">Obtén hasta 50% de descuento en Servicios Pro</h3>
              <p className="text-sm text-muted-foreground">¡No dejes que el costo te detenga! Inicia una empresa, contrata un Asesor Legal, y más.</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold mb-2">Obtén respuestas a tus preguntas legales</h3>
              <p className="text-sm text-muted-foreground">Deja de perder el sueño. Ten un Asesor Legal a tu lado para responder cualquier pregunta.</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold mb-2">Crea todos los documentos que necesites</h3>
              <p className="text-sm text-muted-foreground">Deja atrás las plantillas genéricas. Trabaja con confianza con documentos legales personalizados.</p>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">La membresía de Lo Simple Legal+ para empresas SAS</h2>
            
            <div className="max-w-2xl mx-auto">
              <Card className="border-primary border-2">
                <CardHeader className="text-center">
                  <div className="text-muted-foreground mb-2">Precio Normal <span className="line-through">$500</span></div>
                  <div className="inline-block bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    50% DE DESCUENTO
                  </div>
                  <CardTitle className="text-4xl">
                    <span className="text-5xl font-bold">$249,99*</span>
                  </CardTitle>
                  <CardDescription className="text-lg">facturado anualmente</CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-col items-center pb-8 gap-4">
                  <Button size="lg" className="text-lg px-12" data-testid="button-start-membership">
                    Sí, iniciar mi membresía
                  </Button>
                  <p className="text-sm text-muted-foreground">*Precios no incluyen IVA</p>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6">Beneficios de la membresía</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-2">Beneficio</th>
                    <th className="text-center py-4 px-2">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold">Lo Simple Legal+</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-2">
                      <div className="flex items-start gap-3">
                        <Building className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-semibold">Registro de empresa</div>
                          <div className="text-sm text-muted-foreground">Inicia tu primera SAS. ¡La primera es gratis y el resto tiene 50% de descuento!</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-2">
                      <Check className="w-6 h-6 text-green-500 inline-block" />
                      <div className="text-xs text-muted-foreground line-through">($299)</div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-2">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-semibold">Documentos</div>
                          <div className="text-sm text-muted-foreground">Crea documentos ilimitados para uso personal y empresarial</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-2">
                      <Check className="w-6 h-6 text-green-500 inline-block" />
                      <div className="text-xs text-muted-foreground line-through">($39.99)</div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-2">
                      <div className="flex items-start gap-3">
                        <PenTool className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-semibold">Firma</div>
                          <div className="text-sm text-muted-foreground">Firma tus documentos de forma rápida y segura</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-2">
                      <Check className="w-6 h-6 text-green-500 inline-block" />
                      <div className="text-xs text-muted-foreground line-through">($1.99)</div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-2">
                      <div className="flex items-start gap-3">
                        <MessageCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-semibold">Consulta</div>
                          <div className="text-sm text-muted-foreground">Haz cualquier pregunta legal o tributaria y obtén una respuesta rápida en línea</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-2">
                      <Check className="w-6 h-6 text-green-500 inline-block" />
                      <div className="text-xs text-muted-foreground line-through">($39.99)</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6">Servicios Pro</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-2">Servicio</th>
                    <th className="text-center py-4 px-2">Precio completo</th>
                    <th className="text-center py-4 px-2">50% DE DESCUENTO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-2">
                      <div className="flex items-start gap-3">
                        <UserCheck className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-semibold">Consulta con un Asesor Legal</div>
                          <div className="text-sm text-muted-foreground">Ten un profesional que revise tus documentos y avanza con confianza</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-2">
                      <div className="font-semibold">$149.99</div>
                      <div className="text-xs text-muted-foreground">por consulta</div>
                    </td>
                    <td className="text-center py-4 px-2">
                      <div className="font-semibold text-green-600">$0.00</div>
                      <div className="text-xs text-muted-foreground">por consulta</div>
                      <div className="text-xs text-muted-foreground line-through">($149.99)</div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-2">
                      <div className="flex items-start gap-3">
                        <Scale className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-semibold">Contrata un Asesor Legal</div>
                          <div className="text-sm text-muted-foreground">Obtén ayuda personalizada con situaciones legales más complicadas</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-2">
                      <div className="font-semibold">$149.99*</div>
                      <div className="text-xs text-muted-foreground">/y más</div>
                    </td>
                    <td className="text-center py-4 px-2">
                      <div className="font-semibold text-green-600">$74.99*</div>
                      <div className="text-xs text-muted-foreground">/y más</div>
                      <div className="text-xs text-muted-foreground line-through">($149.99)</div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-2">
                      <div className="flex items-start gap-3">
                        <Calculator className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-semibold">Asesoría Tributaria</div>
                          <div className="text-sm text-muted-foreground">Reduce el riesgo de errores y auditorías con un profesional tributario</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-2">
                      <div className="font-semibold">$399.99</div>
                      <div className="text-xs text-muted-foreground">/y más</div>
                    </td>
                    <td className="text-center py-4 px-2">
                      <div className="font-semibold text-green-600">$199.99</div>
                      <div className="text-xs text-muted-foreground">/y más</div>
                      <div className="text-xs text-muted-foreground line-through">($399.99)</div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-2">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-semibold">Marcas registradas</div>
                          <div className="text-sm text-muted-foreground">Protege tu propiedad intelectual y construye tu marca con un Asesor Legal</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-2">
                      <div className="font-semibold">$699.99</div>
                      <div className="text-xs text-muted-foreground">Más tasas IEPI</div>
                    </td>
                    <td className="text-center py-4 px-2">
                      <div className="font-semibold text-green-600">$349.99</div>
                      <div className="text-xs text-muted-foreground">Más tasas IEPI</div>
                      <div className="text-xs text-muted-foreground line-through">($699.99)</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6 text-center">Preguntas frecuentes</h3>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              <AccordionItem value="item-1" data-testid="faq-item-1">
                <AccordionTrigger>¿Cuánto cuesta Lo Simple Legal+?</AccordionTrigger>
                <AccordionContent>
                  Una membresía de Lo Simple Legal+ puede ser comprada al precio anual completo de $239.88, o en convenientes pagos a plazos sin intereses.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" data-testid="faq-item-2">
                <AccordionTrigger>¿Qué es un Asesor Legal y qué obtengo en una consulta?</AccordionTrigger>
                <AccordionContent>
                  Obtén información rápida y experta de los asesores legales y abogados de Lo Simple. Las consultas con Asesores Legales proporcionan información legal, pero no asesoría legal profesional. Las conversaciones son privadas y seguras, pero no están cubiertas por el privilegio abogado-cliente. Las consultas están disponibles para un número limitado de documentos, con nuevos documentos que se planean agregar regularmente.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" data-testid="faq-item-3">
                <AccordionTrigger>¿Cuánto pueden ahorrar las empresas con Lo Simple Legal+?</AccordionTrigger>
                <AccordionContent>
                  Las empresas pueden ahorrar hasta $2,500 por año con una membresía de Lo Simple Legal+. Este cálculo se basa en el ahorro total en un registro empresarial inicial, marcas registradas y servicios de presentación de impuestos comerciales para miembros de Lo Simple Legal+ (un costo total de $924.97) en comparación con miembros sin membresía (un costo total de $1,949.96). Esto es adicional al ahorro en el costo promedio de 5 horas para la preparación de documentos por un abogado sin red de Lo Simple a la tarifa horaria promedio de abogado en Ecuador de $300 (un costo estimado de $1,500 cuando se compra sin ninguna forma de membresía de Lo Simple) en comparación con el uso ilimitado de documentos empresariales personalizables tanto para miembros de Lo Simple Legal+ como de Lo Simple sin costo adicional.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" data-testid="faq-item-4">
                <AccordionTrigger>¿Cuáles son los beneficios principales de Lo Simple Legal+?</AccordionTrigger>
                <AccordionContent>
                  Una membresía de Lo Simple Legal+ hace que Todo lo Legal para tu empresa sea asequible y simple con un año completo de protección por la mitad del precio de una membresía regular.
                  <br /><br />
                  Tu membresía de Lo Simple Legal+ incluye:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Documentos legales personalizados a tu situación única y leyes locales, garantizados ejecutables.</li>
                    <li>Firmas electrónicas ilimitadas para hacer cada documento legal.</li>
                    <li>Fácil acceso a Asesores Legales para que puedas hacer cualquier pregunta en línea u obtener una consulta en vivo gratuita.</li>
                    <li>Registro gratuito de SAS (excluyendo tasas estatales).</li>
                  </ul>
                  <br />
                  Más hasta 50% de descuento en:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Trámites empresariales, incluidos servicios de marcas registradas.</li>
                    <li>Preparación y presentación de impuestos.</li>
                    <li>Contratación de un Asesor Legal.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" data-testid="faq-item-5">
                <AccordionTrigger>¿Cuál es el descuento al contratar un Asesor Legal con una membresía de Lo Simple Legal+?</AccordionTrigger>
                <AccordionContent>
                  Ofrecemos grandes ahorros para los miembros de Lo Simple Legal+. El descuento para los miembros de Lo Simple Legal+ es de hasta 50% DE DESCUENTO en la tarifa horaria de nuestros Asesores Legales. El descuento del 50% se aplica a servicios de marcas registradas. Los descuentos para otros servicios pueden variar según el área de práctica legal específica.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" data-testid="faq-item-6">
                <AccordionTrigger>¿Cómo es diferente la Consulta con Asesor Tributario de mi paquete de impuestos?</AccordionTrigger>
                <AccordionContent>
                  Con nuestro servicio de impuestos, tu profesional dedicado está disponible por chat para responder cualquier pregunta y presentar tus impuestos. Una Consulta con Asesor Tributario es una llamada telefónica individual de 30 minutos que te da más tiempo para maximizar deducciones y planificar con anticipación para descubrir ahorros estratégicos para futuras declaraciones de impuestos.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" data-testid="faq-item-7">
                <AccordionTrigger>¿Cómo cancelo mi membresía de Lo Simple Legal+?</AccordionTrigger>
                <AccordionContent>
                  Puedes dar de baja tu membresía de Lo Simple Legal+ en cualquier momento a través de la configuración de tu cuenta en línea o llamando al 593-958-613-237. La baja será efectiva en tu próxima fecha de renovación programada, y serás libre de disfrutar los beneficios de la membresía hasta esa fecha.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" data-testid="faq-item-8">
                <AccordionTrigger>¿Qué es la garantía de Lo Simple?</AccordionTrigger>
                <AccordionContent>
                  *Garantizamos que los documentos legales de Lo Simple ejecutados correctamente son legalmente ejecutables bajo las leyes ecuatorianas aplicables.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="text-center py-12 bg-primary/5 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">¿Listo para comenzar?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Únete a Lo Simple Legal+ y obtén acceso a todos los beneficios por solo $239.88 al año
            </p>
            <Button size="lg" className="text-lg px-12" data-testid="button-start-membership-bottom">
              Iniciar mi membresía ahora
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
