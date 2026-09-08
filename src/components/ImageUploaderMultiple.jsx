import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageUploaderMultiple({ onImagesSelected, maxFiles = 8 }) {
  const [items, setItems] = useState([]); // [{ file, preview }]

  const onDrop = useCallback((acceptedFiles) => {
    const nuevos = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setItems(prev => {
      const combinados = [...prev, ...nuevos].slice(0, maxFiles);
      onImagesSelected(combinados.map(i => i.file));
      return combinados;
    });
  }, [onImagesSelected, maxFiles]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": []
    },
    maxSize: 5 * 1024 * 1024,
    multiple: true
  });

  const removeItem = (index) => {
    setItems(prev => {
      const nuevos = prev.filter((_, i) => i !== index);
      onImagesSelected(nuevos.map(i => i.file));
      return nuevos;
    });
  };

  useEffect(() => {
    return () => {
      items.forEach(i => URL.revokeObjectURL(i.preview));
    };
  }, []);

  return (
    <div>
      <div
        {...getRootProps()}
        className="border rounded p-4 text-center"
        style={{
          cursor: "pointer",
          background: isDragActive ? "#f0f0f0" : "#fafafa",
          borderStyle: "dashed"
        }}
      >
        <input {...getInputProps()} />
        <p className="mb-0 text-muted">
          {isDragActive
            ? "Soltá las imágenes acá..."
            : `Arrastrá imágenes o hacé clic (máx. ${maxFiles})`}
        </p>
      </div>

      {items.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mt-3">
          {items.map((item, index) => (
            <div key={index} style={{ position: "relative" }}>
              <img
                src={item.preview}
                alt={`preview-${index}`}
                style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6 }}
              />
              {index === 0 && (
                <span
                  className="badge bg-dark"
                  style={{ position: "absolute", top: 2, left: 2, fontSize: 10 }}
                >
                  Principal
                </span>
              )}
              <button
                type="button"
                className="btn btn-sm btn-danger"
                style={{ position: "absolute", top: -6, right: -6, borderRadius: "50%", padding: "0 6px" }}
                onClick={() => removeItem(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {fileRejections.length > 0 && (
        <p className="text-danger small mt-2">
          Algún archivo es inválido. Solo JPG, PNG o WEBP, máximo 5MB cada uno.
        </p>
      )}
    </div>
  );
}