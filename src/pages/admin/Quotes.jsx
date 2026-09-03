import ReusableDataTable from '../../components/common/ReusableDataTable';
import { useGetFetch } from '../../hooks/useGetFetch';

const formatCurrency = (value) => `$${Number(value || 0).toLocaleString()}`;

const formatDate = (value) => value
  ? new Date(value).toLocaleDateString()
  : '-';

const statusClass = (status = '') => {
  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus.includes('aprob')) return 'bg-success';
  if (normalizedStatus.includes('rechaz') || normalizedStatus.includes('cancel')) return 'bg-danger';
  if (normalizedStatus.includes('pend')) return 'bg-warning text-dark';
  return 'bg-secondary';
};

export default function Quotes() {
  const { data, loading, error } = useGetFetch('/cotizaciones');
  const cotizaciones = Array.isArray(data) ? data : [];

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
