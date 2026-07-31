import ProductCard from "./ProductCard";

export default function ProductGrid({ products, onSelect }) {

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