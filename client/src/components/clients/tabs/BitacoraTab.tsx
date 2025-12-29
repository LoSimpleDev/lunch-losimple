import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EmpresaBitacora } from "@/types";
import {
  ChevronDown,
  ClipboardCheck,
  Key,
  LucideIcon,
  Package,
  Phone,
  Users,
} from "lucide-react";
import { EstadoActualSelect } from "../EstadoActualSelect";
import { EstadoTramiteSelect } from "../EstadoTramiteSelect";

import { fetchEspecialistas } from "@/services/api";

/*
pagina caida intendencia los ultimos 3 dias 
el especialista salio y esta siendo resmplazado
se acumularon los tramites por feriados 
por la epoca del ano hay muycho trabajo y los tramites demorados


controlar el tiempo de demora entre un estado y otro.  y cambiar a subestado atrasado.

atrasdo de acuerdo a lo establecido en la empresa o contra el promedio de la realiad.

tiempo promedio por cada estado. 


en lugar de entregas. mostrar las fechas de cambios de estado. bitacora de cambios de estado.


*/
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

interface BitacoraTabProps {
  formData: Partial<EmpresaBitacora>;
  onChange: (updates: Partial<EmpresaBitacora>) => void;
}

interface SectionProps {
  title: string;
  icon: LucideIcon;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const Section = ({
  title,
  icon: Icon,
  isOpen,
  onToggle,
  children,
}: SectionProps) => (
  <Collapsible open={isOpen} onOpenChange={onToggle}>
    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <ChevronDown
        className={`w-4 h-4 transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </CollapsibleTrigger>
    <CollapsibleContent className="pt-3 px-1">{children}</CollapsibleContent>
  </Collapsible>
);

export function BitacoraTab({ formData, onChange }: BitacoraTabProps) {
  const [openSections, setOpenSections] = useState({
    estado: true,
    asignacion: true,
    contacto: false,
    claves: false,
    entregas: false,
    notas: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const [especialistas, setEspecialistas] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [especialistasRes] = await Promise.all([fetchEspecialistas()]);

    if (especialistasRes.success && especialistasRes.data) {
      setEspecialistas(especialistasRes.data);
    }
  }

  const updateField = (
    field: keyof EmpresaBitacora,
    value: string | undefined
  ) => {
    onChange({ [field]: value });
  };

  console.log(
    "Rendering BitacoraTab with formData:",
    formData,
    formData.estado_tramite
  );
  return (
    <div className="space-y-4">
      {/* Estado del Trámite */}
      <Section
        title="Estado del Trámite"
        icon={ClipboardCheck}
        isOpen={openSections.estado}
        onToggle={() => toggleSection("estado")}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Estado Actual</Label>
            <EstadoActualSelect
              value={formData.estado_actual}
              onChange={(v) => updateField("estado_actual", v)}
            />
          </div>
          <div className="space-y-2">
            <Label>Estado del Trámite</Label>
            <EstadoTramiteSelect
              value={formData.estado_tramite}
              onChange={(v) => updateField("estado_tramite", v)}
              estadoActual={formData.estado_actual}
            />
            {formData.estado_actual &&
              !["EN PROCESO"].includes(formData.estado_actual) && (
                <p className="text-xs text-muted-foreground">
                  Solo disponible cuando el estado es EN PROCESO
                </p>
              )}
          </div>
        </div>
      </Section>

      {/* Asignación */}
      <Section
        title="Asignación"
        icon={Users}
        isOpen={openSections.asignacion}
        onToggle={() => toggleSection("asignacion")}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Especialista Asignado</Label>
            <Select
              value={formData.especialista_asignado}
              onValueChange={(value) =>
                updateField("especialista_asignado", value)
              }
            >
              <SelectTrigger className="w-full sm:w-48 bg-card">
                <SelectValue placeholder="Especialista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los especialistas</SelectItem>
                {especialistas.map((esp) => (
                  <SelectItem key={esp} value={esp}>
                    {esp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Nombre Grupo</Label>
            <Input
              value={formData.nombre_grupo || ""}
              onChange={(e) => updateField("nombre_grupo", e.target.value)}
              placeholder="Grupo asignado"
            />
          </div>
          <div className="space-y-2">
            <Label>Razon social final</Label>
            <Input
              value={formData.nombre_asignado || ""}
              onChange={(e) => updateField("nombre_asignado", e.target.value)}
              placeholder="Nombre asignado"
            />
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <Input
              value={formData.tags || ""}
              onChange={(e) => updateField("tags", e.target.value)}
              placeholder="Etiquetas separadas por coma"
            />
          </div>
        </div>
      </Section>

      {/* Contacto */}
      <Section
        title="Contacto"
        icon={Phone}
        isOpen={openSections.contacto}
        onToggle={() => toggleSection("contacto")}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Punto de Contacto</Label>
            <Input
              value={formData.punto_contacto || ""}
              onChange={(e) => updateField("punto_contacto", e.target.value)}
              placeholder="Punto de contacto"
            />
          </div>
        </div>
      </Section>

      {/* Claves y Trámites */}
      <Section
        title="Claves y Trámites"
        icon={Key}
        isOpen={openSections.claves}
        onToggle={() => toggleSection("claves")}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Clave CIAS</Label>
            <Input
              value={formData.clave_cias || ""}
              onChange={(e) => updateField("clave_cias", e.target.value)}
              placeholder="Clave CIAS"
            />
          </div>
          <div className="space-y-2">
            <Label>Clave SRI</Label>
            <Input
              value={formData.clave_sri || ""}
              onChange={(e) => updateField("clave_sri", e.target.value)}
              placeholder="Clave SRI"
            />
          </div>
          <div className="space-y-2">
            <Label>Num. Trámite SRI</Label>
            <Input
              disabled
              value={formData.num_tramite_sri || "NA"}
              onChange={(e) => updateField("num_tramite_sri", e.target.value)}
              placeholder="Número de trámite"
            />
          </div>
          <div className="space-y-2">
            <Label>Link</Label>
            <Input
              value={formData.link || ""}
              onChange={(e) => updateField("link", e.target.value)}
              placeholder="URL relacionada"
            />
          </div>
        </div>
      </Section>

      {/* Entregas */}
      <Section
        title="Entregas"
        icon={Package}
        isOpen={openSections.entregas}
        onToggle={() => toggleSection("entregas")}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Días en Estado Actual</Label>
            <Input
              value={formData.dias_estado_actual || ""}
              onChange={(e) =>
                updateField("dias_estado_actual", e.target.value)
              }
              placeholder="Días"
            />
          </div>
          <div className="space-y-2">
            <Label>Duración Total</Label>
            <Input
              value={formData.duracion || ""}
              onChange={(e) => updateField("duracion", e.target.value)}
              placeholder="Duración"
            />
          </div>
          <br />
        </div>
      </Section>
    </div>
  );
}
