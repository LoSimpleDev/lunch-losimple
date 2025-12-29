import { useState, useEffect } from "react";
import { DollarSign, ExternalLink, Edit2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import type { EmpresaFormulario, EmpresaAnticipo } from "@/types";

interface FinancieroSectionProps {
  empresa: EmpresaFormulario;
  anticipos: EmpresaAnticipo[];
  valorTramite: number;
  onValorTramiteChange: (value: number) => void;
  onSave: (value: number) => Promise<void>;
  isSaving: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export function FinancieroSection({
  empresa,
  anticipos,
  valorTramite,
  onValorTramiteChange,
  onSave,
  isSaving,
  isOpen,
  onToggle,
}: FinancieroSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(valorTramite.toString());

  useEffect(() => {
    setEditValue(valorTramite.toString());
  }, [valorTramite]);

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "-";
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const totalAnticipos = anticipos.reduce((sum, a) => sum + a.monto, 0);
  const saldoPendiente = valorTramite - totalAnticipos;

  const handleSave = async () => {
    const newValue = parseFloat(editValue) || 0;
    await onSave(newValue);
    onValorTramiteChange(newValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(valorTramite.toString());
    setIsEditing(false);
  };

  const InfoRow = ({
    label,
    value,
    highlight,
    editable,
  }: {
    label: string;
    value: React.ReactNode;
    highlight?: "positive" | "negative" | "warning";
    editable?: boolean;
  }) => {
    const highlightClass =
      highlight === "positive"
        ? "text-green-600 dark:text-green-400"
        : highlight === "negative"
        ? "text-red-600 dark:text-red-400"
        : highlight === "warning"
        ? "text-yellow-600 dark:text-yellow-400"
        : "";

    return (
      <div className="py-2 border-b border-border/50 last:border-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className={`text-sm font-medium ${highlightClass}`}>
          {value || "-"}
        </p>
      </div>
    );
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Información Financiera</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 px-1">
        <div className="grid grid-cols-2 gap-x-4">
          {/* Valor del Trámite - Editable */}
          <div className="py-2 border-b border-border/50">
            <div className="flex items-center justify-between mb-0.5">
              <p className="text-xs text-muted-foreground">Valor del Trámite</p>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
              )}
            </div>
              {isEditing ? (
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  step="0.01"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="h-7 text-sm"
                  autoFocus
                  disabled={isSaving}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-green-600"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-600"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <p className="text-sm font-medium">
                {formatCurrency(valorTramite)}
              </p>
            )}
          </div>

          <InfoRow
            label="Total Anticipos"
            value={formatCurrency(totalAnticipos)}
            highlight="positive"
          />

          <InfoRow
            label="Saldo Pendiente"
            value={formatCurrency(saldoPendiente)}
            highlight={
              saldoPendiente > 0
                ? "warning"
                : saldoPendiente === 0
                ? "positive"
                : "negative"
            }
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
