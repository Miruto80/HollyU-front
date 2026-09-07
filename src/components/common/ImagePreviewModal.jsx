export default function ImagePreviewModal({ imageUrl, onClose }) {
  if (!imageUrl) return null;

  return (
    <div
      className="modal fade show d-block"
      role="dialog"
      aria-modal="true"
      aria-label="Imagen de referencia ampliada"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
      onClick={onClose}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content bg-transparent border-0" onClick={(event) => event.stopPropagation()}>
          <div className="modal-header border-0 justify-content-end p-0">
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Cerrar imagen"
              onClick={onClose}
            />
          </div>
          <div className="modal-body text-center p-0">
            <img
              src={imageUrl}
              alt="Imagen de referencia ampliada"
              className="img-fluid rounded"
              style={{ maxHeight: '85vh' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
