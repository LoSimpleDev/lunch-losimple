import { useState, useEffect } from "react";
import {
  FileText,
  ClipboardList,
  MessageSquare,
  FolderOpen,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EstadoActualBadge } from "./EstadoActualBadge";
import { InfoGeneralTab } from "./tabs/InfoGeneralTab";
import { BitacoraTab } from "./tabs/BitacoraTab";
import { ObservacionesTab } from "./tabs/ObservacionesTab";
import { DocumentosTab } from "./tabs/DocumentosTab";
import { updateBitacora } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import type { EmpresaFormulario, EmpresaBitacora } from "@/types";
import { InfoPagoTab } from "./tabs/InfoPagoTab";

interface ClientDetailPanelProps {
  empresa: EmpresaFormulario;
  onUpdate: () => void;
  onClose: () => void;
}

export function ClientDetailPanel({
  empresa,
  onUpdate,
  onClose,
}: ClientDetailPanelProps) {
  const bitacora = empresa.empresas_bitacora;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<EmpresaBitacora>>({});
  const [activeTab, setActiveTab] = useState("info");

  console.log("ClientDetailPanel rendering with bitacora:", bitacora);
  useEffect(() => {
    if (bitacora) {
      setFormData({
        estado_actual: bitacora.estado_actual,
        estado_tramite: bitacora.estado_tramite,
        especialista_asignado: bitacora.especialista_asignado || "",
        nombre_asignado: bitacora.nombre_asignado || "",
        nombre_grupo: bitacora.nombre_grupo || "",
        punto_contacto: bitacora.punto_contacto || "",
        tags: bitacora.tags || "",
        estado_contacto: bitacora.estado_contacto || "",
        motivo: bitacora.motivo || "",
        acciones_solucion: bitacora.acciones_solucion || "",
        clave_cias: bitacora.clave_cias || "",
        clave_sri: bitacora.clave_sri || "",
        num_tramite_sri: bitacora.num_tramite_sri || "",
        link: bitacora.link || "",
        fecha_sobre_entregado: bitacora.fecha_sobre_entregado || "",
        sobre_entregado: bitacora.sobre_entregado || "",
        dias_estado_actual: bitacora.dias_estado_actual || "",
        duracion: bitacora.duracion || "",
        valor_tramite: bitacora.valor_tramite || 0,
        saldo_pendiente: bitacora.saldo_pendiente || 0,
      });
    }
  }, [bitacora]);

  const handleSave = async () => {
    if (!bitacora?.bitacora_id) {
      toast({
        title: "Error",
        description: "No se encontró la bitácora",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const response = await updateBitacora(bitacora.bitacora_id, formData);

    if (response.success) {
      toast({
        title: "Éxito",
        description: "Bitácora actualizada correctamente",
      });
      onUpdate();
    } else {
      toast({
        title: "Error",
        description: response.error || "No se pudo actualizar",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleFormChange = (updates: Partial<EmpresaBitacora>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="pb-4 border-b border-border mb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-foreground truncate">
              {empresa.empresas_bitacora?.especialista_asignado ||
                "Sin asignar"}
            </h2>
            <p className="text-sm text-muted-foreground truncate">
              Grupo WhatsApp:{" "}
              {empresa.empresas_bitacora?.nombre_grupo || "Sin asignar"}
            </p>
          </div>
          <EstadoActualBadge estado={bitacora?.estado_actual} />
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col min-h-0"
      >
        <TabsList className="grid w-full grid-cols-5 mb-4">
          <TabsTrigger value="info" className="gap-1.5 text-xs">
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Info</span>
          </TabsTrigger>
          <TabsTrigger value="financiero" className="gap-1.5 text-xs">
            <CreditCard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pagos</span>
          </TabsTrigger>
          <TabsTrigger value="bitacora" className="gap-1.5 text-xs">
            <ClipboardList className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bitácora</span>
          </TabsTrigger>
          <TabsTrigger value="observaciones" className="gap-1.5 text-xs">
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Contacto</span>
          </TabsTrigger>
          <TabsTrigger value="documentos" className="gap-1.5 text-xs">
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Docs</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto min-h-0">
          <TabsContent value="info" className="mt-0 h-full">
            <InfoGeneralTab empresa={empresa} />
          </TabsContent>

          <TabsContent value="bitacora" className="mt-0 h-full">
            <BitacoraTab formData={formData} onChange={handleFormChange} />
          </TabsContent>

          <TabsContent value="financiero" className="mt-0 h-full">
            <InfoPagoTab empresa={empresa} onUpdate={onUpdate} />
          </TabsContent>
          <TabsContent value="observaciones" className="mt-0 h-full">
            <ObservacionesTab
              empresaId={empresa.empresa_id}
              especialistaActual={formData.especialista_asignado}
            />
          </TabsContent>

          <TabsContent value="documentos" className="mt-0 h-full">
            <DocumentosTab empresa={empresa} />
          </TabsContent>
        </div>
      </Tabs>

      {/* Actions - Only show on bitacora tab */}
      {activeTab === "bitacora" && (
        <div className="flex gap-3 pt-4 border-t border-border mt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button className="flex-1" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      )}
      <br />
    </div>
  );
}
