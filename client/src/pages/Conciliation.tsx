import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Image as ImageIcon,
  ArrowLeft,
} from 'lucide-react';
import { Link } from "wouter";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/shared/DataTable';
import { SlidePanel } from '@/components/shared/SlidePanel';
import { StatusBadge, Badge } from '@/components/shared/Badge';
import { SkeletonTable } from '@/components/shared/Skeleton';
import { fetchPayments, updatePaymentStatus } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import type { Payment } from '@/types';
import { cn } from '@/lib/utils';

const months = [
  { value: 'all', label: 'Todos los meses' },
  { value: '1', label: 'Enero' },
  { value: '2', label: 'Febrero' },
  { value: '3', label: 'Marzo' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Mayo' },
  { value: '6', label: 'Junio' },
  { value: '7', label: 'Julio' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
];

const years = [
  { value: 'all', label: 'Todos los años' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
];

const statusFilter = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'approved', label: 'Aprobado' },
  { value: 'rejected', label: 'Rechazado' },
];

export default function ConciliationPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Filters
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    loadPayments();
  }, [selectedMonth, selectedYear, selectedStatus]);

  async function loadPayments() {
    setIsLoading(true);
    const response = await fetchPayments({
      month: selectedMonth !== 'all' ? parseInt(selectedMonth) : undefined,
      year: selectedYear !== 'all' ? parseInt(selectedYear) : undefined,
    });
    if (response.success && response.data) {
      let filteredData = response.data;
      if (selectedStatus !== 'all') {
        filteredData = filteredData.filter((p) => p.status === selectedStatus);
      }
      setPayments(filteredData);
    }
    setIsLoading(false);
  }

  const handlePaymentClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentPanel(true);
  };

  const handleStatusChange = async (status: 'pending' | 'approved' | 'rejected') => {
    if (!selectedPayment) return;
    setIsActionLoading(true);

    const response = await updatePaymentStatus(selectedPayment.id, status);
    if (response.success) {
      toast({
        title: 'Éxito',
        description: `Pago marcado como ${status === 'approved' ? 'aprobado' : status === 'rejected' ? 'rechazado' : 'pendiente'}`,
      });
      loadPayments();
      setSelectedPayment({ ...selectedPayment, status });
    }
    setIsActionLoading(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(value);
  };

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (payment: Payment) => (
        <span className="font-mono text-sm">{payment.id}</span>
      ),
    },
    {
      key: 'date',
      header: 'Fecha',
      render: (payment: Payment) => (
        <span className="text-sm">{new Date(payment.date).toLocaleDateString('es-MX')}</span>
      ),
    },
    {
      key: 'amount',
      header: 'Monto',
      render: (payment: Payment) => (
        <span className="font-medium text-foreground">{formatCurrency(payment.amount)}</span>
      ),
    },
    {
      key: 'companyName',
      header: 'Empresa',
    },
    {
      key: 'paymentMethod',
      header: 'Método',
      render: (payment: Payment) => (
        <Badge variant="secondary">{payment.paymentMethod}</Badge>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (payment: Payment) => <StatusBadge status={payment.status} />,
    },
    {
      key: 'receipt',
      header: 'Comprobante',
      render: (payment: Payment) =>
        payment.receiptImage ? (
          <ImageIcon className="w-4 h-4 text-primary" />
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/adminlaunch">
                <Button variant="ghost" size="icon" data-testid="button-back">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold"
                >
                  Conciliación de Pagos
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground"
                >
                  Revisa y gestiona los comprobantes de pago
                </motion.p>
              </div>
            </div>
            <Button onClick={loadPayments} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </Button>
          </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-3"
      >
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-40 bg-card">
            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year.value} value={year.value}>
                {year.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-44 bg-card">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Mes" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-44 bg-card">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            {statusFilter.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Table */}
      {isLoading ? (
        <SkeletonTable rows={5} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DataTable
            data={payments}
            columns={columns}
            onRowClick={handlePaymentClick}
            pageSize={10}
            emptyMessage="No se encontraron pagos"
          />
        </motion.div>
      )}

      {/* Payment Detail Panel */}
      <SlidePanel
        isOpen={showPaymentPanel}
        onClose={() => setShowPaymentPanel(false)}
        title={`Pago ${selectedPayment?.id}`}
        description={selectedPayment?.companyName}
        width="lg"
      >
        {selectedPayment && (
          <div className="space-y-6">
            {/* Payment Info */}
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Monto</p>
                  <p className="text-2xl font-semibold text-foreground">
                    {formatCurrency(selectedPayment.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Estado</p>
                  <StatusBadge status={selectedPayment.status} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Fecha</p>
                  <p className="text-sm font-medium">
                    {new Date(selectedPayment.date).toLocaleDateString('es-MX', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Método de pago</p>
                  <Badge variant="secondary">{selectedPayment.paymentMethod}</Badge>
                </div>
              </div>
            </div>

            {/* Metadata */}
            {selectedPayment.metadata && (
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Datos del comprobante</h3>
                <div className="bg-secondary/30 rounded-xl p-4 space-y-2">
                  {selectedPayment.metadata.reference && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Referencia</span>
                      <span className="text-sm font-mono">{selectedPayment.metadata.reference}</span>
                    </div>
                  )}
                  {selectedPayment.metadata.bank && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Banco</span>
                      <span className="text-sm">{selectedPayment.metadata.bank}</span>
                    </div>
                  )}
                  {selectedPayment.metadata.accountNumber && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Cuenta</span>
                      <span className="text-sm font-mono">{selectedPayment.metadata.accountNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Receipt Image */}
            {selectedPayment.receiptImage && (
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Comprobante</h3>
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl overflow-hidden border border-border"
                >
                  <img
                    src={selectedPayment.receiptImage}
                    alt="Comprobante de pago"
                    className="w-full h-auto object-cover"
                  />
                </motion.div>
              </div>
            )}

            {/* Status Actions */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Cambiar estado</h3>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className={cn(
                    'flex-col h-auto py-4 gap-2',
                    selectedPayment.status === 'pending' && 'border-warning bg-warning/10'
                  )}
                  onClick={() => handleStatusChange('pending')}
                  disabled={isActionLoading || selectedPayment.status === 'pending'}
                >
                  <Clock className="w-5 h-5 text-warning" />
                  <span className="text-xs">Pendiente</span>
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    'flex-col h-auto py-4 gap-2',
                    selectedPayment.status === 'approved' && 'border-success bg-success/10'
                  )}
                  onClick={() => handleStatusChange('approved')}
                  disabled={isActionLoading || selectedPayment.status === 'approved'}
                >
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-xs">Aprobar</span>
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    'flex-col h-auto py-4 gap-2',
                    selectedPayment.status === 'rejected' && 'border-destructive bg-destructive/10'
                  )}
                  onClick={() => handleStatusChange('rejected')}
                  disabled={isActionLoading || selectedPayment.status === 'rejected'}
                >
                  <XCircle className="w-5 h-5 text-destructive" />
                  <span className="text-xs">Rechazar</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>
        </div>
      </div>
    </div>
  );
}
