import {
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  User,
  DollarSign,
  Calendar,
  Building2,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { EmpresaFormulario } from "@/types";
import FilePreview from "@/components/shared/FilePreview";

interface InfoGeneralTabProps {
  empresa: EmpresaFormulario;
}

export function InfoGeneralTab({ empresa }: InfoGeneralTabProps) {
  const [openSections, setOpenSections] = useState({
    empresa: true,
    contacto: true,
    ubicacion: false,
    representantes: false,
    financiero: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("es-EC", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const Section = ({
    title,
    icon: Icon,
    isOpen,
    onToggle,
    children,
  }: {
    title: string;
    icon: React.ElementType;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) => (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 px-1">{children}</CollapsibleContent>
    </Collapsible>
  );

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="py-2 border-b border-border/50 last:border-0">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm">{value || "-"}</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Empresa */}
      <Section
        title="Datos de la Empresa"
        icon={Building2}
        isOpen={openSections.empresa}
        onToggle={() => toggleSection("empresa")}
      >
        <div className="grid grid-cols-2 gap-x-4">
          <InfoRow label="Razón Social" value={empresa.razon_social} />
          <InfoRow label="Nombre Comercial" value={empresa.nombre_comercial} />
          <InfoRow
            label="Actividad Económica"
            value={empresa.actividad_economica}
          />
          <InfoRow
            label="Fecha Fundación"
            value={formatDate(empresa.fecha_fundacion)}
          />
          <InfoRow label="Origen Contacto" value={empresa.origen_contacto} />
          <InfoRow
            label="Firma Electrónica"
            value={empresa.firma_electronica}
          />
        </div>
      </Section>

      {/* Contacto */}
      <Section
        title="Información de Contacto"
        icon={Phone}
        isOpen={openSections.contacto}
        onToggle={() => toggleSection("contacto")}
      >
        <div className="grid grid-cols-2 gap-x-4">
          <InfoRow
            label="Email Empresa"
            value={
              empresa.email_empresa ? (
                <a
                  href={`mailto:${empresa.email_empresa}`}
                  className="text-primary hover:underline"
                >
                  {empresa.email_empresa}
                </a>
              ) : null
            }
          />
          <InfoRow label="Teléfono Celular" value={empresa.telefono_celular} />
          <InfoRow label="Teléfono Fijo" value={empresa.telefono_fijo} />
          <InfoRow
            label="Fecha Recibido"
            value={formatDate(empresa.submitted_at)}
          />
        </div>
      </Section>

      {/* Ubicación */}
      <Section
        title="Ubicación"
        icon={MapPin}
        isOpen={openSections.ubicacion}
        onToggle={() => toggleSection("ubicacion")}
      >
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-x-4">
            <InfoRow
              label="Provincia / Cantón"
              value={empresa.provincia_canton}
            />
            <InfoRow
              label="Ciudad / Parroquia"
              value={empresa.ciudad_parroquia}
            />
          </div>
          <InfoRow label="Dirección Exacta" value={empresa.direccion_exacta} />
          <InfoRow label="Referencia" value={empresa.referencia_direccion} />
        </div>
      </Section>

      {/* Representantes */}
      <Section
        title="Representantes"
        icon={User}
        isOpen={openSections.representantes}
        onToggle={() => toggleSection("representantes")}
      >
        <div className="grid grid-cols-2 gap-x-4">
          <InfoRow label="Gerente General" value={empresa.gerente_general} />
          <InfoRow
            label="Duración Cargo"
            value={
              empresa.duracion_cargo_gerente
                ? `${empresa.duracion_cargo_gerente} años`
                : null
            }
          />
          <InfoRow
            label="Gerente es Accionista"
            value={empresa.gerente_es_accionista}
          />
          <InfoRow
            label="Nombre Accionista"
            value={empresa.nombre_accionista}
          />
          <InfoRow
            label="Email Accionista"
            value={
              empresa.email_accionista ? (
                <a
                  href={`mailto:${empresa.email_accionista}`}
                  className="text-primary hover:underline"
                >
                  {empresa.email_accionista}
                </a>
              ) : null
            }
          />
          {empresa.cedulas && (
            <div className="mt-3">
              <a
                href={empresa.cedulas}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Ver documentos cargados
              </a>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
