import { useState, useEffect } from "react";
import { Receipt, Send, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { fetchAnticipos, createAnticipo, updateBitacora } from "@/services/api";
import type { EmpresaFormulario, EmpresaAnticipo } from "@/types";
import { FinancieroSection } from "./FinancieroSection";
import { AnticiposTimeline } from "./AnticiposTimeline";
import { NuevoAnticipoForm } from "./NuevoAnticipoForm";
import { CollapsibleSection } from "./CollapsibleSection";
import { Button } from "@/components/ui/button";

interface InfoPagoTabProps {
  empresa: EmpresaFormulario;
  onUpdate?: () => void;
}

export function InfoPagoTab({ empresa, onUpdate }: InfoPagoTabProps) {
  const [openSections, setOpenSections] = useState({
    financiero: true,
    anticipos: true,
  });

  const [anticipos, setAnticipos] = useState<EmpresaAnticipo[]>([]);
  const [isLoadingAnticipos, setIsLoadingAnticipos] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingToFacturacion, setIsSendingToFacturacion] = useState(false);
  const [isSavingValor, setIsSavingValor] = useState(false);
  const [valorTramite, setValorTramite] = useState(
    empresa.empresas_bitacora?.valor_tramite || empresa.valoracion_formulario || 0
  );

  useEffect(() => {
    loadAnticipos();
  }, [empresa.empresa_id]);

  const loadAnticipos = async () => {
    setIsLoadingAnticipos(true);
    const response = await fetchAnticipos(empresa.empresa_id);
    if (response.success && response.data) {
      setAnticipos(response.data);
    }
    setIsLoadingAnticipos(false);
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCreateAnticipo = async (data: {
    monto: number;
    fecha_pago: string;
    fecha_max_pago?: string;
    metodo_pago: string;
    orden_pago?: string;
    descripcion: string;
  }) => {
    setIsSubmitting(true);
    const response = await createAnticipo({
      empresas_formulario_id: empresa.empresa_id,
      monto: data.monto,
      fecha_pago: data.fecha_pago,
      fecha_max_pago: data.fecha_max_pago,
      metodo_pago: data.metodo_pago || undefined,
      orden_pago: data.orden_pago,
      descripcion: data.descripcion || undefined,
      creado_por: empresa.empresas_bitacora?.especialista_asignado || "Sistema",
    });

    if (response.success) {
      toast({
        title: "Anticipo registrado",
        description: "El anticipo se ha guardado correctamente",
      });
      loadAnticipos();
    } else {
      toast({
        title: "Error",
        description: response.error || "No se pudo registrar el anticipo",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  const handleEnviarFacturacion = async () => {
    if (!empresa.empresas_bitacora?.bitacora_id) {
      toast({
        title: "Error",
        description: "No se encontró la bitácora del cliente",
        variant: "destructive",
      });
      return;
    }

    setIsSendingToFacturacion(true);
    const response = await updateBitacora(empresa.empresas_bitacora.bitacora_id, {
      estado_actual: "ENVIAR_FACTURACION",
    });

    if (response.success) {
      toast({
        title: "Enviado a facturación",
        description: "El cliente ha sido enviado a la cola de facturación",
      });
      onUpdate?.();
    } else {
      toast({
        title: "Error",
        description: response.error || "No se pudo enviar a facturación",
        variant: "destructive",
      });
    }
    setIsSendingToFacturacion(false);
  };

  const canSendToFacturacion = 
    empresa.empresas_bitacora?.estado_actual && 
    !['ENVIAR_FACTURACION', 'FACTURADO'].includes(empresa.empresas_bitacora.estado_actual);

  const totalAnticipos = anticipos.reduce((sum, a) => sum + a.monto, 0);

  const handleSaveValorTramite = async (newValor: number) => {
    if (!empresa.empresas_bitacora?.bitacora_id) {
      toast({
        title: "Error",
        description: "No se encontró la bitácora del cliente",
        variant: "destructive",
      });
      return;
    }

    setIsSavingValor(true);
    const saldoPendiente = newValor - totalAnticipos;
    
    const response = await updateBitacora(empresa.empresas_bitacora.bitacora_id, {
      valor_tramite: newValor,
      saldo_pendiente: saldoPendiente,
    });

    if (response.success) {
      toast({
        title: "Valor actualizado",
        description: "El valor del trámite se ha guardado correctamente",
      });
      setValorTramite(newValor);
      onUpdate?.();
    } else {
      toast({
        title: "Error",
        description: response.error || "No se pudo actualizar el valor",
        variant: "destructive",
      });
    }
    setIsSavingValor(false);
  };

  return (
    <div className="space-y-3">

      {/* Estado actual de facturación */}
      {empresa.empresas_bitacora?.estado_actual === 'ENVIAR_FACTURACION' && (
        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-800">
          <p className="text-sm text-orange-700 dark:text-orange-400 font-medium">
            ⏳ Pendiente de facturación
          </p>
        </div>
      )}

      {empresa.empresas_bitacora?.estado_actual === 'FACTURADO' && (
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
            ✅ Cliente facturado
          </p>
        </div>
      )}

      {/* Financiero */}
      <FinancieroSection
        empresa={empresa}
        anticipos={anticipos}
        valorTramite={valorTramite}
        onValorTramiteChange={setValorTramite}
        onSave={handleSaveValorTramite}
        isSaving={isSavingValor}
        isOpen={openSections.financiero}
        onToggle={() => toggleSection("financiero")}
      />

      {/* Anticipos */}
      <CollapsibleSection
        title="Anticipos de Pago"
        icon={Receipt}
        isOpen={openSections.anticipos}
        onToggle={() => toggleSection("anticipos")}
      >
        <div className="space-y-3">
          <NuevoAnticipoForm 
            onSubmit={handleCreateAnticipo} 
            isSubmitting={isSubmitting}
            empresaNombre={empresa.razon_social || empresa.nombre_comercial}
          />
          <AnticiposTimeline anticipos={anticipos} isLoading={isLoadingAnticipos} />
        </div>
      </CollapsibleSection>


      {/* Botón Enviar a Facturación */}
      {canSendToFacturacion && (
        <Button
          onClick={handleEnviarFacturacion}
          disabled={isSendingToFacturacion}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isSendingToFacturacion ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Enviar a Facturación
            </>
          )}
        </Button>
      )}
    </div>
  );
}
