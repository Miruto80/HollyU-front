import "../../assets/css/Catalog.css";
import hero from "../../assets/img/hero.png"; 
import { SERVER_URL } from "../../services/api";
export default function ProductCard({ product, onClick }) {

const imagenRelativa = product.Producto_imagenes?.[0]?.imagen;

  const image = imagenRelativa
    ? `${SERVER_URL}${imagenRelativa}`
    : hero;

    const precio =
        product.Modelos?.[0]?.Modelo_telas?.[0]?.precio;

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