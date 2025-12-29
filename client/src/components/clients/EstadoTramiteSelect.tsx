import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  ESTADOS_TRAMITE,
  type EstadoActual,
  type EstadoTramite,
} from "@/types";

interface EstadoTramiteSelectProps {
  value?: EstadoTramite | string;
  onChange: (value: EstadoTramite) => void;
  estadoActual?: EstadoActual | string;
  className?: string;
}

export function EstadoTramiteSelect({
  value,
  onChange,
  estadoActual,
  className,
}: EstadoTramiteSelectProps) {
  // Solo habilitado cuando estado_actual es INICIADO o EN PROCESO
  const isEnabled = estadoActual === "EN PROCESO";

  return (
    <Select
      value={(value || "").toUpperCase() as EstadoTramite}
      onValueChange={(v) => onChange(v as EstadoTramite)}
      disabled={!isEnabled}
    >
      <SelectTrigger
        className={cn(
          "bg-card",
          className,
          !isEnabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <SelectValue
          placeholder={isEnabled ? "Seleccionar estado" : "No disponible"}
        />
      </SelectTrigger>
      <SelectContent>
        {ESTADOS_TRAMITE.map((estado) => (
          <SelectItem key={estado.toUpperCase()} value={estado.toUpperCase()}>
            {estado}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
