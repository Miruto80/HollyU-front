import ReusableDataTable from '../../components/common/ReusableDataTable';
import { useGetFetch } from '../../hooks/useGetFetch';
import api, { SERVER_URL } from '../../services/api';
import { alertaError, alertaExito, confirmarAccion } from '../../utils/Alert';
import Swal from 'sweetalert2';

const statusClass = (status = '') => status === 'cotizada'
  ? 'bg-success'
  : status === 'rechazada'
    ? 'bg-danger'
    : 'bg-warning text-dark';

export default function Personalizations() {
  const { data, loading, error, refetch } = useGetFetch('/personalizaciones');
  const personalizaciones = Array.isArray(data) ? data : [];

  const handleQuote = async (id) => {
    const result = await Swal.fire({
      title: 'Cotizar personalización',
      input: 'number',
      inputLabel: 'Precio',
      inputPlaceholder: '0.00',
      inputAttributes: { min: '0.01', step: '0.01' },
      showCancelButton: true,
      confirmButtonText: 'Crear cotización',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#000',
      inputValidator: (value) => !value || Number(value) <= 0
        ? 'Indica un precio mayor que cero'
        : undefined
    });
    if (!result.isConfirmed) return;

    try {
      await api.post(`/personalizaciones/${id}/cotizar`, { precio: result.value });
      await alertaExito('Cotización creada', 'La personalización ya aparece en cotizaciones.');
      refetch();
    } catch (requestError) {
      alertaError('Error', requestError.response?.data?.message || 'No se pudo crear la cotización');
    }
  };

  const handleReject = async (id) => {
    const ok = await confirmarAccion({
      titulo: '¿Rechazar esta personalización?',
      texto: 'El cliente no podrá recibir una cotización para esta solicitud.',
      confirmText: 'Sí, rechazar'
    });
    if (!ok) return;

    try {
      await api.patch(`/personalizaciones/${id}/rechazar`);
      await alertaExito('Solicitud rechazada');
      refetch();
    } catch (requestError) {
      alertaError('Error', requestError.response?.data?.message || 'No se pudo rechazar la solicitud');
    }
  };

  const columns = [
    {
      title: 'Imagen',
      data: null,
      orderable: false,
      render: (request) => {
        const image = request.imagen_referencia || request.Productos?.Producto_imagenes?.[0]?.imagen;
        const imageUrl = image?.startsWith('http') ? image : `${SERVER_URL}${image}`;
        return image
          ? `<img src="${imageUrl}" alt="${request.Productos?.nombre || 'Producto'}" style="width: 56px; height: 56px; object-fit: cover;">`
          : '-';
      }
    },
    { title: 'ID', data: 'id' },
    {
      title: 'Cliente',
      data: null,
      render: (request) => request.Cliente
        ? `${request.Cliente.nombres || ''} ${request.Cliente.apellidos || ''}`.trim()
        : '-'
    },
    {
      title: 'Producto',
      data: null,
      render: (request) => request.Productos?.nombre || request.Producto?.nombre || '-'
    },
    { title: 'Descripción', data: 'descripcion_solicitada', defaultContent: '-' },
    {
      title: 'Estado',
      data: 'estado',
      render: (status) => `<span class="badge ${statusClass(status)}">${status || '-'}</span>`
    },
    {
      title: 'Acción',
      data: null,
      orderable: false,
      render: (request) => request.cotizacion_id
        ? '<span class="text-success">Cotizada</span>'
        : request.estado === 'rechazada'
          ? '<span class="text-danger">Rechazada</span>'
          : `<button class="btn btn-sm btn-dark btn-cotizar" data-id="${request.id}" title="Crear cotización">Cotizar</button>
             <button class="btn btn-sm btn-outline-danger btn-rechazar" data-id="${request.id}" title="Rechazar solicitud">Rechazar</button>`
    }
  ];

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Solicitudes personalizadas</h3>
      <ReusableDataTable
        data={personalizaciones}
        columns={columns}
        loading={loading}
        error={error}
        onQuote={handleQuote}
        onReject={handleReject}
        options={{
          language: {
            search: 'Buscar:',
            lengthMenu: 'Mostrar _MENU_ registros',
            info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
            zeroRecords: 'No se encontraron solicitudes personalizadas'
          }
        }}
        className="table table-striped table-hover"
      />
    </div>
  );
}
