import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetFetch } from "../../hooks/useGetFetch";

import ProductGrid from "../../components/catalog/ProductGrid";
import ProductModal from "../../components/catalog/ProductModal";

const slugify = (text = "") =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

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

    const endpoint = categoriaSeleccionada
        ? `/productos?categoria_id=${categoriaSeleccionada.id}`
        : "/productos";

    const { data: productos, loading } = useGetFetch(endpoint, [categoriaSeleccionada?.id]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const title = categoriaSeleccionada ? categoriaSeleccionada.nombre : "Uniformes";

    return (
        <section className="container py-5">
            <h2 className="fw-bold mb-4">
                {title}
            </h2>

            <ProductGrid
                products={productos}
                loading={loading || loadingCategorias}
                onSelect={setSelectedProduct}
            />

            <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </section>
    );
}