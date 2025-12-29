import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, Filter, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/shared/DataTable";
import { SlidePanel } from "@/components/shared/SlidePanel";
import { SkeletonTable } from "@/components/shared/Skeleton";
import { EstadoActualBadge } from "@/components/clients/EstadoActualBadge";
import { ClientDetailPanel } from "@/components/clients/ClientDetailPanel";
import { fetchClientesTypeform, fetchEspecialistas } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { ESTADOS_ACTUALES, type EmpresaFormulario } from "@/types";

export default function ClientsPage() {
  const [clientes, setClientes] = useState<EmpresaFormulario[]>([]);
  const [especialistas, setEspecialistas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCliente, setSelectedCliente] =
    useState<EmpresaFormulario | null>(null);
  const [showPanel, setShowPanel] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("all");
  const [selectedEspecialista, setSelectedEspecialista] = useState("all");

  useEffect(() => {
    loadData();
  }, [selectedEstado, selectedEspecialista]);

  async function loadData() {
    setIsLoading(true);

    const [clientesRes, especialistasRes] = await Promise.all([
      fetchClientesTypeform({
        estado: selectedEstado === "all" ? undefined : selectedEstado,
        especialista:
          selectedEspecialista === "all" ? undefined : selectedEspecialista,
        search: searchQuery || undefined,
      }),
      fetchEspecialistas(),
    ]);

    if (clientesRes.success && clientesRes.data) {
      setClientes(clientesRes.data);
    } else {
      toast({
        title: "Error",
        description: clientesRes.error || "No se pudieron cargar los clientes",
        variant: "destructive",
      });
    }

    if (especialistasRes.success && especialistasRes.data) {
      setEspecialistas(especialistasRes.data);
    }

    setIsLoading(false);
  }

  const handleSearch = () => {
    loadData();
  };

  const handleClienteClick = (cliente: EmpresaFormulario) => {
    setSelectedCliente(cliente);
    setShowPanel(true);
  };

  const handleUpdate = () => {
    loadData();
    setShowPanel(false);
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("es-EC", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns = [
    {
      key: "row_number",
      header: "#",
      render: (item: EmpresaFormulario) => (
        <span className="text-muted-foreground">{item.row_number || "-"}</span>
      ),
    },
    {
      key: "razon_social",
      header: "Razón Social",
      render: (item: EmpresaFormulario) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {item.razon_social || "Sin nombre"}
            </p>
            <p className="text-sm text-muted-foreground">
              {item.nombre_comercial || "-"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "email_empresa",
      header: "Email",
      render: (item: EmpresaFormulario) => (
        <span className="text-sm">{item.email_empresa || "-"}</span>
      ),
    },
    {
      key: "estado_actual",
      header: "Estado",
      render: (item: EmpresaFormulario) => (
        <EstadoActualBadge
          estado={(item.empresas_bitacora?.estado_actual || "").toUpperCase()}
        />
      ),
    },
    {
      key: "estado_tramite",
      header: "Trámite",
      render: (item: EmpresaFormulario) => (
        <span className="text-sm text-muted-foreground">
          {(item.empresas_bitacora?.estado_tramite || "-").toUpperCase()}
        </span>
      ),
    },
    {
      key: "especialista",
      header: "Especialista",
      render: (item: EmpresaFormulario) => (
        <span className="text-sm">
          {item.empresas_bitacora?.especialista_asignado || "-"}
        </span>
      ),
    },
    {
      key: "submitted_at",
      header: "Recibido",
      render: (item: EmpresaFormulario) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(item.submitted_at)}
        </span>
      ),
    },
  ];

  console.log("clientes:", clientes);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-semibold text-foreground"
          >
            Gestión de Clientes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Clientes recibidos desde Typeform
          </motion.p>
        </div>
        <Button onClick={loadData} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </Button>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por razón social o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10 bg-card border-border"
          />
        </div>

        <Select value={selectedEstado} onValueChange={setSelectedEstado}>
          <SelectTrigger className="w-full sm:w-48 bg-card">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {ESTADOS_ACTUALES.map((estado) => (
              <SelectItem key={estado} value={estado}>
                {estado}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedEspecialista}
          onValueChange={setSelectedEspecialista}
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
      </motion.div>

      {/* Table */}
      {isLoading ? (
        <SkeletonTable rows={8} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DataTable
            data={clientes}
            columns={columns}
            onRowClick={handleClienteClick}
            pageSize={15}
            emptyMessage="No se encontraron clientes"
          />
        </motion.div>
      )}

      {/* Detail Panel */}
      <SlidePanel
        isOpen={showPanel}
        onClose={() => setShowPanel(false)}
        title={selectedCliente?.razon_social || "Detalle del Cliente"}
        description={selectedCliente?.email_empresa}
        width="xl"
      >
        {selectedCliente && (
          <ClientDetailPanel
            empresa={selectedCliente}
            onUpdate={handleUpdate}
            onClose={() => setShowPanel(false)}
          />
        )}
      </SlidePanel>
    </div>
  );
}
