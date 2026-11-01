import ReusableDataTable from '../../components/common/ReusableDataTable';
import { useGetFetch } from '../../hooks/useGetFetch';
import api from '../../services/api';
import { notifySuccess, notifyError } from '../../utils/Tostify';
import { confirmarAccion } from '../../utils/Alert';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faReceipt,

} from "@fortawesome/free-solid-svg-icons";

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
    <div className="container-fluid px-2 px-md-4 px-lg-4 py-2">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-5">
              <h3 className="card-title m-0 fw-bold text-dark"> <FontAwesomeIcon icon={faReceipt} style={{ color: "#ffc107" }} /> Cotizaciones</h3>
            </div>

            <ReusableDataTable
              data={cotizaciones}
              columns={columns}
              loading={loading}
              error={error}
              onProduction={handleProduction}
              options={{
                columnDefs: [
                { targets: 0, className: "text-center" }, 
                { targets: 1, className: "text-start" },  
                { targets: 2, className: "text-start" },  
                { targets: 3, className: "text-start" },  
                { targets: 4, className: "text-start" },  
                { targets: 5, className: "text-start" },  
                { targets: 6, className: "text-start" },  
                { targets: 7, className: "text-start" },  
                { targets: 8, className: "text-start" }  
                
              ],                
                language: {
                  search: 'Buscar:',
                  lengthMenu: 'Mostrar _MENU_ registros',
                  info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
                  zeroRecords: 'No se encontraron cotizaciones',
                    paginate: {
                      previous: "Anterior",           
                      next: "Siguiente"               
                    }                  
                }
              }}
              className="table table-striped table-hover mb-0 custom-table"
            /> 

        </div>
      </div>
    </div>
  );
}
