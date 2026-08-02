import { useRef, useEffect } from "react";
import DataTable from "datatables.net-react";
import DT from "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.css";
export default function ReusableDataTable({
  columns,
  data,
  loading,
  error,
  options = {},
  className,
  onEdit,
  onDelete
}) {
  // Register the DataTables integration inside the component
  // to avoid React Hook linting issues when called at module scope.
  DataTable.use(DT);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e) => {
      const editBtn = e.target.closest(".btn-editar");
      const delBtn = e.target.closest(".btn-eliminar");
      if (editBtn && onEdit) onEdit(editBtn.dataset.id);
      if (delBtn && onDelete) onDelete(delBtn.dataset.id);
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [data, onEdit, onDelete]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-danger">Error al cargar datos.</p>;

  return (
    <div ref={containerRef}>
      <DataTable data={data} columns={columns} options={options} className={className} />
    </div>
  );
}
