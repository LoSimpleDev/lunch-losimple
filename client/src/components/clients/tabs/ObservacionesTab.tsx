import { useState, useEffect } from 'react';
import { Plus, MessageSquare, AlertTriangle, CheckCircle, FileText, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchObservaciones, createObservacion } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { EmpresaObservacion, TipoObservacion } from '@/types';
import { TIPOS_OBSERVACION } from '@/types';

const MENSAJES_PREDEFINIDOS = [
  {
    id: 'pagina_caida',
    titulo: 'Página caída',
    emoji: '🌐',
    mensaje: 'Desde Lo Simple queremos informarte que hubo demoras porque la página de la Intendencia estuvo caída los últimos 3 días ⚠️. Ya está funcionando y seguimos avanzando con tu trámite. ¡Gracias por la paciencia! 🙌'
  },
  {
    id: 'especialista_reemplazo',
    titulo: 'Especialista reemplazado',
    emoji: '👤',
    mensaje: 'Te contamos desde Lo Simple que uno de nuestros especialistas tuvo que ausentarse de forma imprevista 👤➡️👤, lo que generó algunas demoras. Ya estamos realizando el reemplazo y retomando el trabajo. Agradecemos tu comprensión 😊.'
  },
  {
    id: 'acumulacion_feriados',
    titulo: 'Acumulación feriados',
    emoji: '📅',
    mensaje: 'En Lo Simple estamos experimentando demoras debido a la acumulación de trámites generada por los feriados recientes 📅✨. Ya estamos trabajando para ponernos al día y avanzar con el tuyo. ¡Gracias por tu paciencia! 🙏'
  },
  {
    id: 'mucho_trabajo',
    titulo: 'Mucho trabajo',
    emoji: '📂',
    mensaje: 'Queremos avisarte desde Lo Simple que, por la época del año, estamos recibiendo un gran volumen de trámites 📂💼. Esto puede generar demoras, pero seguimos trabajando para avanzar lo más rápido posible. ¡Gracias por comprender! 🤝'
  },
];

interface ObservacionesTabProps {
  empresaId: string;
  especialistaActual?: string;
}

export function ObservacionesTab({ empresaId, especialistaActual }: ObservacionesTabProps) {
  const [observaciones, setObservaciones] = useState<EmpresaObservacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newObservacion, setNewObservacion] = useState('');
  const [newTipo, setNewTipo] = useState<TipoObservacion>('nota');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedMensaje, setSelectedMensaje] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadObservaciones = async () => {
    setIsLoading(true);
    const response = await fetchObservaciones(empresaId);
    if (response.success && response.data) {
      setObservaciones(response.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadObservaciones();
  }, [empresaId]);

  const getMensajeSeleccionado = () => {
    return MENSAJES_PREDEFINIDOS.find(m => m.id === selectedMensaje);
  };

  const handleSelectMensaje = (id: string) => {
    if (selectedMensaje === id) {
      setSelectedMensaje(null);
    } else {
      setSelectedMensaje(id);
    }
  };

  const handleCopyMensaje = async () => {
    const mensaje = getMensajeSeleccionado();
    if (!mensaje) return;
    
    try {
      await navigator.clipboard.writeText(mensaje.mensaje);
      setCopied(true);
      toast({ title: 'Copiado', description: 'Mensaje copiado al portapapeles' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Error', description: 'No se pudo copiar', variant: 'destructive' });
    }
  };

  const handleAddObservacion = async () => {
    if (!newObservacion.trim()) {
      toast({ title: 'Error', description: 'La observación no puede estar vacía', variant: 'destructive' });
      return;
    }

    // Construir observación con mensaje adjunto si existe
    let observacionFinal = newObservacion.trim();
    const mensajeAdjunto = getMensajeSeleccionado();
    if (mensajeAdjunto) {
      observacionFinal += `\n\n📋 Mensaje enviado: ${mensajeAdjunto.titulo}`;
    }

    setIsSaving(true);
    const response = await createObservacion({
      empresas_formulario_id: empresaId,
      especialista: especialistaActual || 'Sistema',
      observacion: observacionFinal,
      tipo: newTipo,
    });

    if (response.success) {
      toast({ title: 'Éxito', description: 'Observación agregada' });
      setNewObservacion('');
      setNewTipo('nota');
      setSelectedMensaje(null);
      setIsAdding(false);
      loadObservaciones();
    } else {
      toast({ title: 'Error', description: response.error || 'No se pudo agregar', variant: 'destructive' });
    }
    setIsSaving(false);
  };

  const getIcon = (tipo: TipoObservacion) => {
    switch (tipo) {
      case 'seguimiento':
        return MessageSquare;
      case 'alerta':
        return AlertTriangle;
      case 'resolucion':
        return CheckCircle;
      default:
        return FileText;
    }
  };

  const getTipoStyle = (tipo: TipoObservacion) => {
    return TIPOS_OBSERVACION.find((t) => t.value === tipo)?.color || 'bg-muted text-muted-foreground';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Hoy a las ${date.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Ayer a las ${date.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Button */}
      {!isAdding && (
        <Button variant="outline" className="w-full" onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Observación
        </Button>
      )}

      {/* Add Form */}
      {isAdding && (
        <div className="p-4 border border-border rounded-lg bg-secondary/30 space-y-3">
          <div className="space-y-2">
            <Label>Tipo de Observación</Label>
            <Select value={newTipo} onValueChange={(v) => setNewTipo(v as TipoObservacion)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_OBSERVACION.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mensajes predefinidos */}
          <div className="space-y-2">
            <Label>Adjuntar mensaje predefinido (opcional)</Label>
            <div className="grid grid-cols-2 gap-2">
              {MENSAJES_PREDEFINIDOS.map((msg) => (
                <button
                  key={msg.id}
                  type="button"
                  onClick={() => handleSelectMensaje(msg.id)}
                  className={cn(
                    "p-2 text-left text-xs rounded-lg border transition-all",
                    selectedMensaje === msg.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background hover:bg-secondary/50"
                  )}
                >
                  <span className="mr-1">{msg.emoji}</span>
                  {msg.titulo}
                </button>
              ))}
            </div>
          </div>

          {/* Vista previa del mensaje seleccionado */}
          {selectedMensaje && (
            <div className="space-y-2">
              <Label>📤 Mensaje para enviar al cliente:</Label>
              <div className="p-3 bg-background border border-border rounded-lg">
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {getMensajeSeleccionado()?.mensaje}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyMensaje}
                className="w-full"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar mensaje
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label>Observación</Label>
            <Textarea
              value={newObservacion}
              onChange={(e) => setNewObservacion(e.target.value)}
              placeholder="Escribe tu observación aquí..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setIsAdding(false); setSelectedMensaje(null); }} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleAddObservacion} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      )}

      {/* Timeline */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-secondary/50 rounded-lg" />
            </div>
          ))}
        </div>
      ) : observaciones.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No hay observaciones registradas</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-4">
            {observaciones.map((obs) => {
              const Icon = getIcon(obs.tipo);
              return (
                <div key={obs.id} className="relative pl-10">
                  {/* Timeline dot */}
                  <div className="absolute left-2 top-3 w-5 h-5 rounded-full bg-background border-2 border-border flex items-center justify-center">
                    <Icon className="w-3 h-3 text-muted-foreground" />
                  </div>

                  <div className="p-3 bg-card border border-border rounded-lg">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', getTipoStyle(obs.tipo))}>
                          {TIPOS_OBSERVACION.find((t) => t.value === obs.tipo)?.label}
                        </span>
                        <span className="text-xs text-muted-foreground">por {obs.especialista}</span>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(obs.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{obs.observacion}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
