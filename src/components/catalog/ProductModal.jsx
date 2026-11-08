import { useEffect, useState } from "react";
import api, { SERVER_URL } from "../../services/api";
import { useCart } from "../../hooks/useCart";
import { useGetFetch } from "../../hooks/useGetFetch";
import { usePostFetch } from "../../hooks/usePostFetch";
import { notifySuccess, notifyError } from "../../utils/Tostify";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import GuestModal from "./GuestModal";
import PersonalizationRequestModal from "./PersonalizationRequestModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/ProductModal.css";
import hero from "../../assets/img/hero.png";

export default function ProductModal({ product, onClose }) {
    const [detalle, setDetalle] = useState(null);
    const [modeloSeleccionado, setModeloSeleccionado] = useState(null);
    const [colorSeleccionado, setColorSeleccionado] = useState(null);
    const [tallaSeleccionada, setTallaSeleccionada] = useState(null);
    const [tipoBotaSeleccionado, setTipoBotaSeleccionado] = useState(null);
    const [mostrarSolicitud, setMostrarSolicitud] = useState(false);
    const [mostrarDatosCliente, setMostrarDatosCliente] = useState(false);
    const [descripcionSolicitud, setDescripcionSolicitud] = useState("");
    
    const isLogged = Boolean(localStorage.getItem("accessToken"));
    const { data: clienteLogueado, loading: cargandoCliente } = useGetFetch(
        isLogged ? "/clientes/me" : null
    );
    const { post: postPersonalizacion, loading: enviandoSolicitud } = usePostFetch("/personalizaciones");
    const { addItem } = useCart();

    useEffect(() => {
        if (!product) return;

        api.get(`/productos/${product.id}`)
            .then((r) => {
                setDetalle(r.data);
                setModeloSeleccionado(null);
            })
            .catch((error) => {
                console.error("Error cargando producto:", error);
            });

        return () => {
            setDetalle(null);
            setModeloSeleccionado(null);
            setColorSeleccionado(null);
            setTallaSeleccionada(null);
            setTipoBotaSeleccionado(null);
            setMostrarSolicitud(false);
            setMostrarDatosCliente(false);
            setDescripcionSolicitud("");
        };
    }, [product]);

    if (!product || !detalle) return null;

    const modelosDisponibles = (detalle.Producto_modelos || []).map((pm) => ({
        ...pm.Modelo,
        Modelo_telas: pm.Modelo_telas,
        Modelo_tallas: pm.Modelo_tallas,
        producto_modelo_id: pm.id
    }));

    const modelo = modeloSeleccionado || modelosDisponibles[0];
    const tela = modeloSeleccionado ? modeloSeleccionado.Modelo_telas?.[0] : modelosDisponibles[0]?.Modelo_telas?.[0];
    const tieneStock = Number(detalle.stock) > 0;

    const imagenes = detalle.Producto_imagenes?.length > 0
        ? detalle.Producto_imagenes
        : [{ imagen: null }]; 

    const imagenRelativa = detalle.Producto_imagenes?.[0]?.imagen; 

    const handleCambioModelo = (mod) => {
        setModeloSeleccionado(mod);
        setColorSeleccionado(null);
        setTallaSeleccionada(null);
    };

    const handleAgregarCarrito = () => {
        if (modelosDisponibles.length > 0 && !modeloSeleccionado) {
            notifyError("Selecciona un modelo");
            return;
        }
        if (!colorSeleccionado) {
            notifyError("Selecciona un color");
            return;
        }
        if (!tallaSeleccionada) {
            notifyError("Selecciona una talla");
            return;
        }
        if (detalle.Tipos_bota?.length > 0 && !tipoBotaSeleccionado) {
            notifyError("Selecciona un tipo de bota");
            return;
        }

        addItem({
            id: `${detalle.id}-${modeloSeleccionado?.id ?? ""}-${colorSeleccionado.color.id}-${tallaSeleccionada.Talla.id}-${tipoBotaSeleccionado?.id ?? ""}`,
            producto_id: detalle.id,
            categoria_id: detalle.categoria_id,
            nombre: detalle.nombre,
            precio: detalle.precio,
            precio_mayor: detalle.precio_mayor, 
            imagen: imagenRelativa,
            modelo: modeloSeleccionado?.nombre ?? null,
            producto_modelo_id: modeloSeleccionado?.producto_modelo_id,
            modelo_tela_id: tela?.id,
            color_id: colorSeleccionado.color.id,
            color_nombre: colorSeleccionado.color.nombre,
            talla_id: tallaSeleccionada.Talla.id,
            talla_nombre: tallaSeleccionada.Talla.nombre,
            tipo_bota_id: tipoBotaSeleccionado?.id ?? null,
            tipo_bota_nombre: tipoBotaSeleccionado?.nombre ?? null
        });

        notifySuccess("Producto agregado al carrito");
        setColorSeleccionado(null);
        setTallaSeleccionada(null);
        setTipoBotaSeleccionado(null);
    };

    const handleSolicitarPersonalizado = () => {
        setMostrarSolicitud(true);
    };

    const continuarSolicitud = () => {
        if (!descripcionSolicitud.trim()) {
            notifyError("Describe lo que quieres personalizar");
            return;
        }

        setMostrarSolicitud(false);

        if (clienteLogueado?.id) {
            enviarSolicitud(clienteLogueado);
            return;
        }

        setMostrarDatosCliente(true);
    };

    const enviarSolicitud = async (cliente) => {
        const formData = new FormData();
        formData.append("cliente_id", cliente.id);
        formData.append("producto_id", detalle.id);
        formData.append("descripcion_solicitada", descripcionSolicitud.trim());
        if (imagenRelativa) {
            formData.append("imagen_referencia", imagenRelativa);
        }

        try {
            await postPersonalizacion(formData);
            notifySuccess("Solicitud recibida. Te contactaremos para aprobarla y cotizarla.");
            setMostrarDatosCliente(false);
            setMostrarSolicitud(false);
            setDescripcionSolicitud("");
        } catch (error) {
            notifyError(error.response?.data?.message || "No se pudo enviar la solicitud");
        }
    };

    return (
        <div className="product-modal">
            <GuestModal
                show={mostrarDatosCliente}
                onClose={() => setMostrarDatosCliente(false)}
                onConfirm={enviarSolicitud}
            />
            <PersonalizationRequestModal
                show={mostrarSolicitud}
                productName={detalle.nombre}
                image={imagenes[0]?.imagen ? `${SERVER_URL}${imagenes[0].imagen}` : hero}
                description={descripcionSolicitud}
                onDescriptionChange={setDescripcionSolicitud}
                onClose={() => setMostrarSolicitud(false)}
                onContinue={continuarSolicitud}
                loading={enviandoSolicitud || cargandoCliente}
            />
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
                                <Splide
                                    options={{
                                        type: imagenes.length > 1 ? 'loop' : 'slide',
                                        perPage: 1,
                                        arrows: imagenes.length > 1,
                                        pagination: imagenes.length > 1,
                                        drag: imagenes.length > 1
                                    }}
                                    aria-label="Imágenes del producto"
                                >
                                    {imagenes.map((img, index) => (
                                        <SplideSlide key={img.id ?? index}>
                                            <img
                                                src={img.imagen ? `${SERVER_URL}${img.imagen}` : hero}
                                                className="img-fluid product-main-image"
                                                alt={`${detalle.nombre} ${index + 1}`}
                                            />
                                        </SplideSlide>
                                    ))}
                                </Splide>
                            </div>

                            <div className="col-12 col-lg-6">

                                <h2 className="product-modal-name fs-3 fw-bold mb-1">
                                    {detalle.nombre}
                                </h2>

                                <h3 className="fs-2 fw-bold mb-2" style={{ color: "#000000" }}>
                                    ${Number(detalle.precio).toLocaleString()}
                                </h3>

                                <p className="text-muted small mb-3">
                                    {detalle.descripcion}
                                </p>

                                {/* Modelos */}
                                {modelosDisponibles.length > 0 && (
                                    <div className="mb-2">
                                        <span className="small fw-bold text-secondary d-block mb-1">Modelo</span>
                                        <div className="d-flex flex-wrap gap-1">
                                            {modelosDisponibles.map((m) => (
                                                <button
                                                    key={m.id}
                                                    type="button"
                                                    className={`btn btn-sm rounded-pill px-3 py-1 ${modeloSeleccionado?.id === m.id ? "fw-bold text-dark" : "btn-outline-secondary"}`}
                                                    style={modeloSeleccionado?.id === m.id ? { backgroundColor: "#e5b83f", borderColor: "#e5b83f" } : {}}
                                                    onClick={() => handleCambioModelo(m)}
                                                >
                                                    {m.nombre || `Modelo ${m.id}`}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Colores */}
                                <div className="mb-2">
                                    <span className="small fw-bold text-secondary d-block mb-1">
                                        Color {colorSeleccionado && <span className="text-dark fw-normal">— {colorSeleccionado.color.nombre}</span>}
                                    </span>
                                    <div className="d-flex flex-wrap gap-2">
                                        {tela?.Modelo_telas_colores?.map((c) => (
                                            <span
                                                key={c.id}
                                                className="color-circle rounded-circle shadow-sm"
                                                onClick={() => setColorSeleccionado(c)}
                                                style={{
                                                    backgroundColor: c.color.codigo,
                                                    width: "28px",
                                                    height: "28px",
                                                    display: "inline-block",
                                                    cursor: "pointer",
                                                    border: colorSeleccionado?.id === c.id
                                                        ? "3px solid #e5b83f"
                                                        : "1px solid #ddd"
                                                }}
                                                title={c.color.nombre}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Tallas */}
                                <div className="mb-2">
                                    <span className="small fw-bold text-secondary d-block mb-1">Talla</span>
                                    <div className="d-flex flex-wrap gap-1">
                                        {modelo?.Modelo_tallas?.map((t) => (
                                            <button
                                                key={t.id}
                                                type="button"
                                                className={`btn btn-sm rounded-pill px-3 py-1 ${tallaSeleccionada?.id === t.id ? "fw-bold text-dark" : "btn-outline-secondary"}`}
                                                style={tallaSeleccionada?.id === t.id ? { backgroundColor: "#e5b83f", borderColor: "#e5b83f" } : {}}
                                                onClick={() => setTallaSeleccionada(t)}
                                            >
                                                {t.Talla.nombre}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                
                                {detalle.Tipos_bota?.length > 0 && (
                                    <div className="mb-3">
                                        <span className="small fw-bold text-secondary d-block mb-1">Tipo de bota</span>
                                        <div className="d-flex flex-wrap gap-1">
                                            {detalle.Tipos_bota.map((tipo) => (
                                                <button
                                                    key={tipo.id}
                                                    type="button"
                                                    className={`btn btn-sm rounded-pill px-3 py-1 ${tipoBotaSeleccionado?.id === tipo.id ? "fw-bold text-dark" : "btn-outline-secondary"}`}
                                                    style={tipoBotaSeleccionado?.id === tipo.id ? { backgroundColor: "#e5b83f", borderColor: "#e5b83f" } : {}}
                                                    onClick={() => setTipoBotaSeleccionado(tipo)}
                                                >
                                                    {tipo.nombre}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Alerta de stock  */}
                                <div className={`alert ${tieneStock ? "alert-success" : "alert-warning"} py-2 px-3 small mt-4 mb-3 rounded-3`} role="alert">
                                    {tieneStock ? "Disponibilidad inmediata" : "Producto sin stock, pasará a producción"}
                                </div>

                                {/* Botones */}
                                <div className="d-flex flex-column gap-2">
                                    <button
                                        type="button"
                                        className="btn text-white fw-bold btn-sm py-3 rounded-3 shadow-sm custom-btn-hover"
                                        style={{ backgroundColor: "#10123d", border: "none", transition: "all 0.2s ease" }}
                                        onClick={handleAgregarCarrito}
                                    >
                                        <FontAwesomeIcon icon={faCartPlus} className="me-1" /> Añadir al carrito
                                    </button>

                                    
                                    <hr className="my-1 text-muted opacity-25" />

                                    {detalle.permite_personalizacion && (
                                        <button
                                            type="button"
                                            className="btn text-white fw-bold btn-sm py-3 rounded-3 shadow-sm custom-btn-hover"
                                            style={{ backgroundColor: "#393c72", border: "none", transition: "all 0.2s ease" }}
                                            onClick={handleSolicitarPersonalizado}
                                        >
                                            Solicitar personalizado
                                        </button>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}