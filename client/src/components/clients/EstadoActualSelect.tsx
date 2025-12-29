import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ESTADOS_ACTUALES, type EstadoActual } from "@/types";

interface EstadoActualSelectProps {
  value?: EstadoActual | string;
  onChange: (value: EstadoActual) => void;
  className?: string;
  disabled?: boolean;
}

export function EstadoActualSelect({
  value,
  onChange,
  className,
  disabled,
}: EstadoActualSelectProps) {
  return (
    <Select
      value={(value || "").toUpperCase() as EstadoActual}
      onValueChange={(v) => onChange(v as EstadoActual)}
      disabled={disabled}
    >
      <SelectTrigger className={cn("bg-card", className)}>
        <SelectValue placeholder="Seleccionar estado" />
      </SelectTrigger>
      <SelectContent>
        {ESTADOS_ACTUALES.map((estado) => (
          <SelectItem key={estado} value={estado}>
            {estado}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
