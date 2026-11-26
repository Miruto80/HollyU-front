import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetFetch } from "../../hooks/useGetFetch";
import api from "../../services/api";

import ProductGrid from "../../components/catalog/ProductGrid";
import ProductModal from "../../components/catalog/ProductModal";

const slugify = (text = "") =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const PRODUCTS_PER_PAGE = 16;

export default function Catalog() {
    const { category } = useParams();
    const [searchParams] = useSearchParams();
    const categoriaIdFromUrl = searchParams.get("categoria_id");

    const { data: categorias = [], loading: loadingCategorias } = useGetFetch("/categorias");

    const categoriaSeleccionada = useMemo(() => {
        if (categoriaIdFromUrl) {
            return categorias.find((cat) => String(cat.id) === String(categoriaIdFromUrl));
        }

        if (!category) {
            return null;
        }

        const slugTarget = slugify(category);
        return categorias.find((cat) => slugify(cat.nombre) === slugTarget) || null;
    }, [categoriaIdFromUrl, category, categorias]);

    const esperandoCategoria = Boolean(category || categoriaIdFromUrl) && loadingCategorias;
    const [productos, setProductos] = useState([]);
    const [totalProductos, setTotalProductos] = useState(0);
    const [paginaState, setPaginaState] = useState({ categoriaId: null, pagina: 1 });
    const [loadingProductos, setLoadingProductos] = useState(true);
    const [errorProductos, setErrorProductos] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const categoriaId = categoriaSeleccionada?.id ?? null;
    const paginaActual = paginaState.categoriaId === categoriaId ? paginaState.pagina : 1;

    const cambiarPagina = (pagina) => {
        setPaginaState({ categoriaId, pagina });
    };

    useEffect(() => {
        if (esperandoCategoria) return undefined;

        const controller = new AbortController();
        const cargarProductos = async () => {
            setLoadingProductos(true);
            setErrorProductos(null);
            setProductos([]);
            setTotalProductos(0);

            const params = new URLSearchParams({
                page: String(paginaActual),
                limit: String(PRODUCTS_PER_PAGE),
                include_total: "true"
            });
            if (categoriaId !== null) {
                params.set("categoria_id", String(categoriaId));
            }

            try {
                const { data } = await api.get(`/productos?${params}`, {
                    signal: controller.signal
                });
                if (!Array.isArray(data.data) || !Number.isSafeInteger(data.total)) {
                    throw new TypeError("La respuesta de productos no tiene un formato válido");
                }
                setProductos(data.data);
                setTotalProductos(data.total);
            } catch (error) {
                if (!controller.signal.aborted) {
                    setErrorProductos(error);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoadingProductos(false);
                }
            }
        };

        cargarProductos();
        return () => controller.abort();
    }, [categoriaId, esperandoCategoria, paginaActual]);

    const totalPaginas = Math.ceil(totalProductos / PRODUCTS_PER_PAGE);
    const title = categoriaSeleccionada ? categoriaSeleccionada.nombre : "Uniformes";
    const cargandoProductos = loadingProductos || loadingCategorias;
    const sinProductosEnCategoria =
        !cargandoProductos && !errorProductos && categoriaSeleccionada && productos.length === 0;

    return (
        <section className="container py-5">
            <h2 className="fw-bold mb-4">
                {title}
            </h2>

            {sinProductosEnCategoria ? (
                <p className="text-center text-muted py-5">
                    No hay productos en la categoría {categoriaSeleccionada.nombre}.
                </p>
            ) : (
                <ProductGrid
                    products={productos}
                    loading={cargandoProductos}
                    onSelect={setSelectedProduct}
                />
            )}

            {errorProductos && (
                <div className="alert alert-danger mt-4" role="alert">
                    No se pudieron cargar los productos. Inténtalo de nuevo.
                </div>
            )}

            {!loadingProductos && totalPaginas > 1 && (
                <nav aria-label="Paginación del catálogo" className="mt-4">
                    <ul className="pagination justify-content-center mb-0">
                        <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
                            <button
                                type="button"
                                className="page-link"
                                onClick={() => cambiarPagina(Math.max(1, paginaActual - 1))}
                                disabled={paginaActual === 1}
                            >
                                Anterior
                            </button>
                        </li>
                        <li className="page-item disabled">
                            <span className="page-link">{paginaActual} / {totalPaginas}</span>
                        </li>
                        <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
                            <button
                                type="button"
                                className="page-link"
                                onClick={() => cambiarPagina(Math.min(totalPaginas, paginaActual + 1))}
                                disabled={paginaActual === totalPaginas}
                            >
                                Siguiente
                            </button>
                        </li>
                    </ul>
                </nav>
            )}

            <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </section>
    );
}