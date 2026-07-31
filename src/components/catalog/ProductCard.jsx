import "../../assets/css/Catalog.css";
import hero from "../../assets/img/hero.png";
export default function ProductCard({ product, onClick }) {

const image =
    product.Producto_imagenes?.[0]?.imagen ??
    hero;

    const precio =
        product.Modelos?.[0]?.Modelo_telas?.[0]?.precio;

        console.log("PRODUCTO:", product);
console.log("IMAGEN:", product.Producto_imagenes?.[0]?.imagen);

    return (

        <div
            className="product-card"
            onClick={onClick}
        >

            <img
                src={image}
                alt={product.nombre}
            />

            <div className="p-3">

                <small className="text-secondary">

                    {product.codigo}

                </small>

                <h6 className="fw-bold mt-2">

                    {product.nombre}

                </h6>

                <h5 className="mt-3">

                    ${Number(precio).toLocaleString()}

                </h5>

            </div>

        </div>

    );

}