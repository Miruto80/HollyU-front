import ReusableDataTable from '../../components/common/ReusableDataTable';
import DataCardList from '../../components/common/DataCardList';
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

            <div className="d-none d-lg-block">
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
            <div className="d-block d-lg-none">
              <DataCardList
                data={cotizaciones}
                loading={loading}
                error={error}
                emptyMessage="No se encontraron cotizaciones"
                renderCard={(item) => {
                  const status = item.Estados_cotizacion?.nombre || "Sin estado";
                  const cliente = item.Cliente
                    ? `${item.Cliente.nombres || ""} ${item.Cliente.apellidos || ""}`.trim()
                    : "-";
                  const productos = item.Detalle_cotizacions?.map((detail) =>
                    `${detail.Producto?.nombre || "Producto"} x${detail.cantidad}`
                  ).join(", ") || "-";

                  return (
                    <>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <span className="badge bg-light text-dark border me-2">ID: {item.id}</span>
                          <h5 className="mb-1 fw-bold text-dark d-inline-block">{cliente}</h5>
                        </div>
                        <span className={`badge ${statusClass(status)}`}>{status}</span>
                      </div>
                      <div className="row small text-muted g-2">
                        <div className="col-12"><strong>Fecha:</strong> {formatDate(item.fecha)}</div>
                        <div className="col-12"><strong>Productos:</strong> {productos}</div>
                        <div className="col-6"><strong>Subtotal:</strong> {formatCurrency(item.subtotal)}</div>
                        <div className="col-6"><strong>Total:</strong> {formatCurrency(item.total)}</div>
                        <div className="col-12"><strong>Observaciones:</strong> {item.observaciones || "-"}</div>
                      </div>
                      {!status.toLowerCase().includes("producc") && (
                        <div className="d-flex justify-content-end border-top pt-2 mt-3">
                          <button className="btn btn-sm btn-primary" onClick={() => handleProduction(item.id)}>
                            Pasar a producción
                          </button>
                        </div>
                      )}
                    </>
                  );
                }}
              />
            </div>

        </div>
      </div>
    </div>
  );
}
