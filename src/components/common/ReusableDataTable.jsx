import { useRef, useEffect } from "react";
import DataTable from "datatables.net-react";
import DT from "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.css";

function LoadingState() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-5 my-4">
      <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">Cargando...</span>
      </div>
      <p className="text-muted fw-medium">Cargando información, por favor espera...</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="alert alert-danger border-0 shadow-sm rounded-4 p-4 my-3 text-center" role="alert">
      <h5 className="alert-heading fw-bold mb-1">¡algo salió mal!</h5>
      <p className="mb-0 text-muted small">
        {message || "No se pudieron cargar los datos correctamente. Inténtalo de nuevo más tarde."}
      </p>
    </div>
  );
}

export default function ReusableDataTable({
  columns,
  data,
  loading,
  error,
  options = {},
  className,
  onEdit,
  onDelete,
  onView,
  onConfirm,
  onReject,
  onAvanzar,
  onQuote,
  onProduction,
  onImagePreview,
  onToggleEstatus
}) {
  DataTable.use(DT);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e) => {
      const editBtn = e.target.closest(".btn-editar");
      const delBtn = e.target.closest(".btn-eliminar");
      const viewBtn = e.target.closest(".btn-ver-pedidos, .btn-ver-producto");
      const confirmBtn = e.target.closest(".btn-confirmar");
      const rejectBtn = e.target.closest(".btn-rechazar");
      const avanzarBtn = e.target.closest(".btn-avanzar");
      const quoteBtn = e.target.closest(".btn-cotizar");
      const productionBtn = e.target.closest(".btn-produccion");
      const imagePreviewBtn = e.target.closest(".btn-image-preview");
      const toggleEstatusBtn = e.target.closest(".btn-toggle-estatus");

      if (editBtn && onEdit) onEdit(editBtn.dataset.id);
      if (delBtn && onDelete) onDelete(delBtn.dataset.id);
      if (viewBtn && onView) onView(viewBtn.dataset.id);
      if (confirmBtn && onConfirm) onConfirm(confirmBtn.dataset.id);
      if (rejectBtn && onReject) onReject(rejectBtn.dataset.id);
      if (avanzarBtn && onAvanzar) onAvanzar(avanzarBtn.dataset.id);
      if (quoteBtn && onQuote) onQuote(quoteBtn.dataset.id);
      if (productionBtn && onProduction) onProduction(productionBtn.dataset.id);
      if (imagePreviewBtn && onImagePreview) onImagePreview(imagePreviewBtn.dataset.image);
      if (toggleEstatusBtn && onToggleEstatus) {
        onToggleEstatus(toggleEstatusBtn.dataset.id, toggleEstatusBtn.dataset.estatus);
      }
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [data, onEdit, onDelete, onView, onConfirm, onReject, onAvanzar, onQuote, onProduction, onImagePreview, onToggleEstatus]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error?.message || error} />;

  return (
    <div ref={containerRef}>
      <DataTable data={data} columns={columns} options={options} className={className} />
    </div>
  );
}