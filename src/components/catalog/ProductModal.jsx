import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ProductModal({ product, onClose }) {

    const [detalle, setDetalle] = useState(null);

    useEffect(() => {

        if (!product) return;

        api.get(`/productos/${product.id}`)
            .then(r => setDetalle(r.data));

    }, [product]);

    if (!product) return null;

    if (!detalle) return null;

    const modelo = detalle.Modelos[0];

    const tela = modelo.Modelo_telas[0];

    return (

        <div className="modal fade show d-block">

            <div className="modal-dialog modal-xl">

                <div className="modal-content">

                    <div className="modal-header">

                        <h5 className="modal-title">
                            Detalle del producto
                        </h5>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>

                    </div>


                    <div className="modal-body">

                        <div className="row">

                            <div className="col-lg-6">

                                <img
                                    className="img-fluid"
                                    src="/images/no-image.jpg"
                                    alt={detalle.nombre}
                                />

                            </div>


                            <div className="col-lg-6">

                                <h2>
                                    {detalle.nombre}
                                </h2>

                                <p>
                                    {detalle.descripcion}
                                </p>

                                <h3 className="my-4">
                                    ${Number(tela.precio).toLocaleString()}
                                </h3>


                                <h6>
                                    Colores
                                </h6>

                                <div className="d-flex gap-2 mb-4">

                                    {tela.Modelo_telas_colores.map(c => (

                                        <span
                                            key={c.id}
                                            className="color-circle"
                                            style={{
                                                background: c.color.codigo_hex
                                            }}
                                        />

                                    ))}

                                </div>


                                <h6>
                                    Tallas
                                </h6>

                                <div className="d-flex gap-2">

                                    {modelo.Modelo_tallas.map(t => (

                                        <button
                                            key={t.id}
                                            className="btn btn-outline-dark"
                                        >
                                            {t.Talla.nombre}
                                        </button>

                                    ))}

                                </div>


                                <button className="btn btn-dark mt-4 w-100">
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