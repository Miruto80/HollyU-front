import ProductCard from "./ProductCard";
import RevealUp from "../animations/RevealUp";

export default function ProductGrid({ products = [], loading, onSelect }) {
    if (loading) {
        return (
            <div className="row g-4" aria-busy="true" aria-label="Cargando productos">
                {Array.from({ length: 8 }, (_, index) => (
                    <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
                        <div className="product-card product-card-skeleton" />
                    </div>
                ))}
            </div>
        );
    }

    return (

        <div className="row g-4">

            {products.map((product, index) => (

                <div
                    className="col-lg-3 col-md-4 col-sm-6"
                    key={product.id}
                >
                    <RevealUp className="h-100" delay={index * 0.04}>
                        <ProductCard
                            product={product}
                            onClick={() => onSelect(product)}
                        />
                    </RevealUp>
                </div>

            ))}

        </div>

    );

}