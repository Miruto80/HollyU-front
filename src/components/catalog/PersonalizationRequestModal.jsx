export default function PersonalizationRequestModal({
    show,
    productName,
    image,
    description,
    onDescriptionChange,
    referenceFile,
    onReferenceFileChange,
    onClose,
    onContinue,
    loading
}) {
    if (!show) return null;

    return (
        <div className="personalization-modal" role="dialog" aria-modal="true" aria-labelledby="personalization-modal-title">
            <div className="personalization-modal-dialog">
                <div className="personalization-modal-content">
                    <div className="personalization-modal-header">
                        <div>
                            <p className="personalization-modal-eyebrow">Solicitud personalizada</p>
                            <h2 id="personalization-modal-title">
                                {image ? `Personaliza ${productName}` : "Crea tu producto desde cero"}
                            </h2>
                        </div>
                        <button
                            type="button"
                            className="product-modal-close"
                            onClick={onClose}
                            aria-label="Cerrar"
                        >
                            ×
                        </button>
                    </div>

                    <div className="personalization-modal-body">
                        {image ? (
                            <img
                                className="personalization-reference-image"
                                src={image}
                                alt={`Imagen de referencia de ${productName}`}
                            />
                        ) : (
                            <label className="personalization-upload-box" htmlFor="imagen-referencia-personalizacion">
                                <span className="personalization-upload-icon">+</span>
                                <strong>Sube una imagen de referencia</strong>
                                <small>Inspíranos con un diseño, boceto o ejemplo</small>
                                <input
                                    id="imagen-referencia-personalizacion"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => onReferenceFileChange(event.target.files?.[0] || null)}
                                    disabled={loading}
                                />
                                {referenceFile && <span className="personalization-file-name">{referenceFile.name}</span>}
                            </label>
                        )}

                        <div className="mt-4">
                            <label className="form-label" htmlFor="descripcion-personalizacion">
                                Describe lo que quieres
                            </label>
                            <textarea
                                id="descripcion-personalizacion"
                                className="form-control"
                                rows="5"
                                value={description}
                                onChange={(event) => onDescriptionChange(event.target.value)}
                                placeholder="Indica qué deseas cambiar del producto o qué quieres crear"
                                disabled={loading}
                                autoFocus
                            />
                        </div>

                        <button
                            type="button"
                            className="btn btn-dark w-100 mt-4"
                            onClick={onContinue}
                            disabled={loading}
                        >
                            Continuar con mis datos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
