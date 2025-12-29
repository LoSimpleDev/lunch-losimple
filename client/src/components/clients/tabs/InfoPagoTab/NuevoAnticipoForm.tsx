import { useState } from "react";
import { Plus, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface NuevoAnticipoFormProps {
  onSubmit: (data: {
    monto: number;
    fecha_pago: string;
    fecha_max_pago?: string;
    metodo_pago: string;
    orden_pago?: string;
    descripcion: string;
  }) => Promise<void>;
  isSubmitting: boolean;
  empresaNombre?: string;
}

const METODOS_PAGO = [
  "Transferencia Bancaria",
  "Efectivo",
  "Tarjeta de Crédito",
  "Tarjeta de Débito",
  "PayPal",
  "Otro",
];

export function NuevoAnticipoForm({
  onSubmit,
  isSubmitting,
  empresaNombre,
}: NuevoAnticipoFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [monto, setMonto] = useState("");
  const [fechaPago, setFechaPago] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [fechaMaxPago, setFechaMaxPago] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [ordenPago, setOrdenPago] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!monto || parseFloat(monto) <= 0) return;

    await onSubmit({
      monto: parseFloat(monto),
      fecha_pago: fechaPago,
      fecha_max_pago: fechaMaxPago || undefined,
      metodo_pago: metodoPago,
      orden_pago: ordenPago || undefined,
      descripcion,
    });

    // Reset form
    setMonto("");
    setFechaPago(new Date().toISOString().split("T")[0]);
    setFechaMaxPago("");
    setMetodoPago("");
    setOrdenPago("");
    setDescripcion("");
    setIsOpen(false);
  };

  const generateMessage = () => {
    const formatDate = (date: string) => {
      if (!date) return "No especificada";
      return new Date(date).toLocaleDateString("es-EC", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const message = `📌 Solicitud de Anticipo

🏢 Empresa: ${empresaNombre || "No especificada"}
💰 Monto solicitado: $${monto || "0.00"}
📅 Fecha máxima de pago: ${formatDate(fechaMaxPago)}
🧾 Orden de pago: ${ordenPago || "No especificada"}
💳 Método: ${metodoPago || "No especificado"}

Datos para la transferencia – Cuenta Corriente (Banco Internacional):
• Beneficiario: LoSimple
• RUC: 1793143490001
• Cuenta: 0700632992

Por favor, realizar el pago antes de la fecha indicada.
👉 Una vez realizada la transferencia, agradeceremos que nos envíes una captura del comprobante para registrar el pago correctamente.

¡Gracias por tu colaboración! 😊`;

    navigator.clipboard.writeText(message);
    setCopied(true);
    toast({
      title: "Mensaje copiado",
      description: "El mensaje ha sido copiado al portapapeles",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="w-4 h-4 mr-1" />
        Registrar Anticipo
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 p-3 bg-secondary/30 rounded-lg"
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="monto" className="text-xs">
            Monto *
          </Label>
          <Input
            id="monto"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="h-8 text-sm"
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="fecha" className="text-xs">
            Fecha Pago *
          </Label>
          <Input
            id="fecha"
            type="date"
            value={fechaPago}
            onChange={(e) => setFechaPago(e.target.value)}
            className="h-8 text-sm"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="fechaMaxPago" className="text-xs">
            Fecha Máxima Pago
          </Label>
          <Input
            id="fechaMaxPago"
            type="date"
            value={fechaMaxPago}
            onChange={(e) => setFechaMaxPago(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="ordenPago" className="text-xs">
            Orden de Pago
          </Label>
          <Input
            id="ordenPago"
            type="text"
            placeholder="OP-001"
            value={ordenPago}
            onChange={(e) => setOrdenPago(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="metodo" className="text-xs">
          Método de Pago
        </Label>
        <Select value={metodoPago} onValueChange={setMetodoPago}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Seleccionar método" />
          </SelectTrigger>
          <SelectContent>
            {METODOS_PAGO.map((metodo) => (
              <SelectItem key={metodo} value={metodo}>
                {metodo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="descripcion" className="text-xs">
          Descripción
        </Label>
        <Textarea
          id="descripcion"
          placeholder="Notas adicionales..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="h-16 text-sm resize-none"
        />
      </div>

      {/* Generate Message Button */}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="w-full"
        onClick={generateMessage}
        disabled={!monto}
      >
        {copied ? (
          <>
            <Check className="w-3 h-3 mr-1" />
            Copiado
          </>
        ) : (
          <>
            <Copy className="w-3 h-3 mr-1" />
            Generar Mensaje para Cliente
          </>
        )}
      </Button>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="flex-1"
          onClick={() => setIsOpen(false)}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          size="sm"
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar"
          )}
        </Button>
      </div>
    </form>
  );
}
