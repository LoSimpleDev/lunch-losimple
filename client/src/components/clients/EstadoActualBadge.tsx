import { cn } from '@/lib/utils';
import type { EstadoActual } from '@/types';

interface EstadoActualBadgeProps {
  estado?: EstadoActual | string;
  className?: string;
}

const estadoConfig: Record<string, { bg: string; text: string; label: string }> = {
  PENDIENTE: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    label: 'Pendiente',
  },
  ASIGNADO: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    label: 'Asignado',
  }, 
  'EN PROCESO': {
    bg: 'bg-secondary',
    text: 'text-secondary-foreground',
    label: 'En Proceso',
  },
  FINALIZADO: {
    bg: 'bg-success/10',
    text: 'text-success',
    label: 'Finalizado',
  },
  ENVIAR_FACTURACION: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-400',
    label: 'Enviar Facturación',
  },
  FACTURADO: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    label: 'Facturado',
  },
};

export function EstadoActualBadge({ estado, className }: EstadoActualBadgeProps) {
  const config = estado ? estadoConfig[estado] : null;

  if (!config) {
    return (
      <span className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        'bg-muted text-muted-foreground',
        className
      )}>
        Sin estado
      </span>
    );
  }

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      config.bg,
      config.text,
      className
    )}>
      {config.label}
    </span>
  );
}
