import ReusableDataTable from '../../components/common/ReusableDataTable';
import { useGetFetch } from '../../hooks/useGetFetch';
import api from '../../services/api';
import { notifySuccess, notifyError } from '../../utils/Tostify';
import { confirmarAccion } from '../../utils/Alert';

const formatCurrency = (value) => `$${Number(value || 0).toLocaleString()}`;

const formatDate = (value) => value
  ? new Date(value).toLocaleDateString()
  : '-';

const statusClass = (status = '') => {
  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus.includes('aprob')) return 'bg-success';
  if (normalizedStatus.includes('producc')) return 'bg-primary';
  if (normalizedStatus.includes('rechaz') || normalizedStatus.includes('cancel')) return 'bg-danger';
  if (normalizedStatus.includes('pend')) return 'bg-warning text-dark';
  return 'bg-secondary';
};

export default function Quotes() {
  const { data, loading, error, refetch } = useGetFetch('/cotizaciones');
  const cotizaciones = Array.isArray(data) ? data : [];

  const handleProduction = async (id) => {
    const ok = await confirmarAccion({
      titulo: '¿Pasar cotización a producción?',
      texto: 'La cotización cambiará a estado En producción',
      confirmText: 'Sí, pasar a producción',
      icon: 'question'
    });
    if (!ok) return;

    try {
      await api.patch(`/cotizaciones/${id}/produccion`);
      notifySuccess('Cotización pasada a producción');
      refetch();
    } catch (err) {
      notifyError(err.response?.data?.message || 'No se pudo pasar la cotización a producción');
    }
  };

  const columns = [
    { title: 'ID', data: 'id' },
    {
      title: 'Fecha',
      data: 'fecha',
      render: formatDate
    },
    {
      title: 'Cliente',
      data: null,
      render: (quote) => quote.Cliente
        ? `${quote.Cliente.nombres || ''} ${quote.Cliente.apellidos || ''}`.trim()
        : '-'
    },
    {
      title: 'Productos',
      data: null,
      render: (quote) => quote.Detalle_cotizacions?.map((detail) =>
        `${detail.Producto?.nombre || 'Producto'} x${detail.cantidad}`
      ).join(', ') || '-'
    },
    {
      title: 'Subtotal',
      data: 'subtotal',
      render: formatCurrency
    },
    {
      title: 'Descuento',
      data: 'descuento',
      render: formatCurrency
    },
    {
      title: 'Total',
      data: 'total',
      render: formatCurrency
    },
    {
      title: 'Estado',
      data: null,
      render: (quote) => {
        const status = quote.Estados_cotizacion?.nombre || 'Sin estado';
        return `<span class="badge ${statusClass(status)}">${status}</span>`;
      }
    },
    {
      title: 'Observaciones',
      data: 'observaciones',
      defaultContent: '-'
    },
    {
      title: 'Acción',
      data: null,
      orderable: false,
      render: (quote) => {
        const status = quote.Estados_cotizacion?.nombre?.toLowerCase() || '';
        if (status.includes('producc')) return '';

        return `<button class="btn btn-sm btn-primary btn-produccion" data-id="${quote.id}">
          Pasar a producción
        </button>`;
      }
    }
  ];

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Cotizaciones</h3>

      <ReusableDataTable
        data={cotizaciones}
        columns={columns}
        loading={loading}
        error={error}
        onProduction={handleProduction}
        options={{
          language: {
            search: 'Buscar:',
            lengthMenu: 'Mostrar _MENU_ registros',
            info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
            zeroRecords: 'No se encontraron cotizaciones'
          }
        }}
        className="table table-striped table-hover"
      />

    </div>
  );
}
