import { useRef, useEffect } from "react";
import DataTable from "datatables.net-react";
import DT from "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.css";
import { useGetFetch } from "../../hooks/useGetFetch";
import { SERVER_URL } from "../../services/api";

DataTable.use(DT);

export default function ProductosTable() {
  const tableRef = useRef(null);
  const { data: productos, loading, error } = useGetFetch("/productos");

  // Delegación de eventos para botones dentro de la tabla
  useEffect(() => {
    const container = tableRef.current;
    if (!container) return;

    const handleClick = (e) => {
      const editBtn = e.target.closest(".btn-editar");
      const delBtn = e.target.closest(".btn-eliminar");

      if (editBtn) {
        console.log("Editar producto", editBtn.dataset.id);
        // abrir modal de edición acá
      }

      if (delBtn) {
        console.log("Eliminar producto", delBtn.dataset.id);
        // confirmar + llamar al endpoint DELETE acá
      }
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [productos]);

  const columns = [
    {
      title: "Imagen",
      data: null,
      orderable: false,
      render: (data) => {
        const img = data.Producto_imagenes?.[0]?.imagen;
        const src = img ? `${SERVER_URL}${img}` : "/images/no-image.jpg";
        return `<img src="${src}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;" />`;
      }
    },
    { title: "Código", data: "codigo" },
    { title: "Nombre", data: "nombre" },
    {
      title: "Categoría",
      data: null,
      render: (data) => data.Categoria?.nombre ?? "-"
    },
    {
      title: "Género",
      data: null,
      render: (data) => data.Genero?.nombre ?? "-"
    },
    {
      title: "Precio desde",
      data: null,
      render: (data) => {
        const precios = data.Modelos?.flatMap(m =>
          m.Modelo_telas.map(t => Number(t.precio))
        ) ?? [];
        return precios.length ? `$${Math.min(...precios).toLocaleString()}` : "-";
      }
    },
    {
      title: "Estado",
      data: "activo",
      render: (val) =>
        val
          ? '<span class="badge bg-success">Activo</span>'
          : '<span class="badge bg-secondary">Inactivo</span>'
    },
    {
      title: "Acciones",
      data: "id",
      orderable: false,
      render: (id) => `
        <button class="btn btn-sm btn-outline-primary btn-editar" data-id="${id}">Editar</button>
        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${id}">Eliminar</button>
      `
    }
  ];

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p className="text-danger">Error al cargar productos.</p>;

  return (
    <div className="container mt-4" ref={tableRef}>
      <h3>Productos</h3>
      <DataTable
        data={productos}
        columns={columns}
        options={{
          language: {
            search: "Buscar:",
            lengthMenu: "Mostrar _MENU_ registros",
            info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
            zeroRecords: "No se encontraron resultados"
          }
        }}
        className="table table-striped table-hover"
      />
    </div>
  );
}