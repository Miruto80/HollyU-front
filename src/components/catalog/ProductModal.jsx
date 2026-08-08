import { useEffect, useState } from "react";
import api, { SERVER_URL } from "../../services/api";
import "../../assets/css/ProductModal.css";
import hero from "../../assets/img/hero.png";

export default function ProductModal({ product, onClose }) {
    const [detalle, setDetalle] = useState(null);

    useEffect(() => {
        if (!product) return;

        setDetalle(null);

        api.get(`/productos/${product.id}`)
            .then((r) => setDetalle(r.data))
            .catch((error) => {
                console.error("Error cargando producto:", error);
            });
    }, [product]);

    if (!product || !detalle) return null;

    const modelo = detalle.Modelos?.[0];
    const tela = modelo?.Modelo_telas?.[0];

    const imagenRelativa = detalle.Producto_imagenes?.[0]?.imagen;

    const image = imagenRelativa
        ? `${SERVER_URL}${imagenRelativa}`
        : hero;

    return (
        <div className="product-modal">
            <div className="product-modal-dialog">
                <div className="product-modal-content">

                    <div className="product-modal-header">
                        <h5 className="product-modal-title">
                            Detalle del producto
                        </h5>

                        <button
                            type="button"
                            className="product-modal-close"
                            onClick={onClose}
                            aria-label="Cerrar"
                        >
                            ×
                        </button>
                    </div>

                    <div className="product-modal-body">
                        <div className="row g-4 align-items-center">

                            <div className="col-12 col-lg-6">
                                <img
                                    className="img-fluid product-main-image"
                                    src={image}
                                    alt={detalle.nombre}
                                />
                            </div>

                            <div className="col-12 col-lg-6">

                                <h2 className="product-modal-name">
                                    {detalle.nombre}
                                </h2>

                                <p className="mb-4">
                                    {detalle.descripcion}
                                </p>

                                {tela && (
                                    <h3 className="my-4 text-primary">
                                        ${Number(tela.precio).toLocaleString()}
                                    </h3>
                                )}

                                <div className="mb-3">
                                    <h6 className="mb-2">
                                        Colores
                                    </h6>

                                    <div className="d-flex flex-wrap gap-2 mb-4">
                                        {tela?.Modelo_telas_colores?.map((c) => (
                                            <span
                                                key={c.id}
                                                className="color-circle"
                                                style={{
                                                    backgroundColor:
                                                        c.color.codigo_hex,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h6 className="mb-2">
                                        Tallas
                                    </h6>

                                    <div className="d-flex flex-wrap gap-2">
                                        {modelo?.Modelo_tallas?.map((t) => (
                                            <button
                                                key={t.id}
                                                type="button"
                                                className="btn btn-outline-dark"
                                            >
                                                {t.Talla.nombre}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-dark mt-4 w-100 py-3"
                                >
                                    Solicitar
                                </button>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}