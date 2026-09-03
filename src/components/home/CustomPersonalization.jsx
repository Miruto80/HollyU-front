import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { useGetFetch } from "../../hooks/useGetFetch";
import { usePostFetch } from "../../hooks/usePostFetch";
import { notifyError, notifySuccess } from "../../utils/Tostify";
import GuestModal from "../catalog/GuestModal";
import PersonalizationRequestModal from "../catalog/PersonalizationRequestModal";
import "../../assets/css/ProductModal.css";

export default function CustomPersonalization() {
  const [showRequest, setShowRequest] = useState(false);
  const [showGuest, setShowGuest] = useState(false);
  const [description, setDescription] = useState("");
  const [referenceFile, setReferenceFile] = useState(null);
  const isLogged = Boolean(localStorage.getItem("accessToken"));
  const { data: clienteLogueado, loading: loadingClient } = useGetFetch(isLogged ? "/clientes/me" : null);
  const { post, loading } = usePostFetch("/personalizaciones");

  const closeRequest = () => {
    setShowRequest(false);
    setDescription("");
    setReferenceFile(null);
  };

  const continueRequest = () => {
    if (!description.trim()) {
      notifyError("Describe el producto que quieres crear");
      return;
    }
    if (!referenceFile) {
      notifyError("Sube una imagen de referencia");
      return;
    }

    setShowRequest(false);
    if (clienteLogueado?.id) {
      submitRequest(clienteLogueado);
    } else {
      setShowGuest(true);
    }
  };

  const submitRequest = async (cliente) => {
    const formData = new FormData();
    formData.append("cliente_id", cliente.id);
    formData.append("descripcion_solicitada", description.trim());
    formData.append("imagen_referencia", referenceFile);

    try {
      await post(formData);
      notifySuccess("Solicitud recibida. Te contactaremos para cotizarla.");
      setShowGuest(false);
      closeRequest();
    } catch (error) {
      notifyError(error.response?.data?.message || "No se pudo enviar la solicitud");
    }
  };

  return (
    <>
      <section className="container my-5">
        <div className="custom-personalization-banner">
          <div>
            <span className="custom-personalization-eyebrow">Diseño a tu medida</span>
            <h2>¿Tienes una idea que todavía no existe?</h2>
            <p>Cuéntanos cómo imaginas tu uniforme y lo convertimos en una propuesta.</p>
          </div>
          <button type="button" className="btn btn-dark custom-personalization-button" onClick={() => setShowRequest(true)}>
            <FontAwesomeIcon icon={faWandMagicSparkles} />
            Solicitar desde cero
          </button>
        </div>
      </section>

      <GuestModal show={showGuest} onClose={() => setShowGuest(false)} onConfirm={submitRequest} />
      <PersonalizationRequestModal
        show={showRequest}
        productName=""
        image={null}
        description={description}
        onDescriptionChange={setDescription}
        referenceFile={referenceFile}
        onReferenceFileChange={setReferenceFile}
        onClose={closeRequest}
        onContinue={continueRequest}
        loading={loading || loadingClient}
      />
    </>
  );
}