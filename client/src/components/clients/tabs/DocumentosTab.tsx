import { ExternalLink, FileText, Image, File } from 'lucide-react';
import type { EmpresaFormulario } from '@/types';

interface DocumentosTabProps {
  empresa: EmpresaFormulario;
}

export function DocumentosTab({ empresa }: DocumentosTabProps) {
  const documentos = [
    {
      label: 'Comprobante de Pago',
      url: empresa.url_comprobante,
      type: 'comprobante',
    },
    {
      label: 'Documento de Dirección',
      url: empresa.documento_direccion,
      type: 'documento',
    },
  ].filter((doc) => doc.url);

  if (documentos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No hay documentos adjuntos</p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'comprobante':
        return Image;
      default:
        return File;
    }
  };

  return (
    <div className="space-y-3">
      {documentos.map((doc, index) => {
        const Icon = getIcon(doc.type);
        return (
          <a
            key={index}
            href={doc.url!}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg border border-border hover:bg-secondary/50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{doc.label}</p>
              <p className="text-xs text-muted-foreground truncate">{doc.url}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
        );
      })}
    </div>
  );
}
