import { Calendar, DollarSign, ExternalLink, User } from "lucide-react";
import type { EmpresaAnticipo } from "@/types";

interface AnticiposTimelineProps {
  anticipos: EmpresaAnticipo[];
  isLoading: boolean;
}

export function AnticiposTimeline({
  anticipos,
  isLoading,
}: AnticiposTimelineProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-EC", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse flex gap-3">
            <div className="w-2 h-2 bg-muted rounded-full mt-2" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (anticipos.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No hay anticipos registrados
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {anticipos.map((anticipo, index) => (
        <div key={anticipo.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
            {index < anticipos.length - 1 && (
              <div className="w-0.5 flex-1 bg-border mt-1" />
            )}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-foreground">
                {formatCurrency(anticipo.monto)}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {anticipo.fecha_pago}
                <br />
                {anticipo.estado && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {anticipo.estado}
                  </p>
                )}
              </span>
            </div>
            {anticipo.metodo_pago && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {anticipo.metodo_pago}
              </p>
            )}
            {anticipo.descripcion && (
              <p className="text-xs text-muted-foreground mt-1 italic">
                {anticipo.descripcion}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <User className="w-3 h-3" />
              {anticipo.creado_por}
            </p>

            {anticipo.comprobante_url && (
              <div className="mt-3">
                <a
                  href={anticipo.comprobante_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver comprobante
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
