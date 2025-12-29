import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSystems } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import type { System } from "@/types";

interface SystemSelectProps {
  value: string;
  onChange: (value: string) => void;
  includeAll?: boolean;
  placeholder?: string;
  className?: string;
  filter?: boolean;
  disabled?: boolean;
}

export function SystemSelect({
  value,
  onChange,
  includeAll = true,
  placeholder = "Sistema",
  className,
  filter,
  disabled,
}: SystemSelectProps) {
  const [systems, setSystems] = useState<System[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log("Rendering SystemSelect with value:", value);
  console.log("Rendering systems:", systems);

  useEffect(() => {
    async function loadSystems() {
      setIsLoading(true);
      const response = await fetchSystems();

      if (response.success && response.data) {
        setSystems(response.data);
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar los sistemas",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }

    loadSystems();
  }, []);

  if (isLoading) {
    return <Skeleton className="h-10 w-full sm:w-48" />;
  }

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={`w-full sm:w-48 bg-card ${className || ""}`}>
        {filter && <Filter className="w-4 h-4 mr-2 text-muted-foreground" />}{" "}
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {includeAll && <SelectItem value="all">Todos los sistemas</SelectItem>}
        {systems.map((system) => (
          <SelectItem key={system.id} value={system.id}>
            {system.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
