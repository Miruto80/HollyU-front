import ProductCard from "./ProductCard";

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

            {products.map(product => (

                <div
                    className="col-lg-3 col-md-4 col-sm-6"
                    key={product.id}
                >

                    <ProductCard
                        product={product}
                        onClick={() => onSelect(product)}
                    />

                </div>

            ))}

        </div>

    );

}