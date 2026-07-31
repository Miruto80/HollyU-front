import { useState } from "react";
import { useGetFetch } from "../../hooks/useGetFetch";

import ProductGrid from "../../components/catalog/ProductGrid";
import ProductModal from "../../components/catalog/ProductModal";

export default function Catalog() {

    const { data: productos, loading } = useGetFetch("/productos");

    const [selectedProduct, setSelectedProduct] = useState(null);

    return (

        <section className="container py-5">

            <h2 className="fw-bold mb-4">

                Uniformes

            </h2>

            <ProductGrid
                products={productos}
                loading={loading}
                onSelect={setSelectedProduct}
            />

            <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />

        </section>

    );

}