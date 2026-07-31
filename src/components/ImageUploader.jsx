// src/components/admin/ImageUploader.jsx
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageUploader({ onImageSelected }) {
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    onImageSelected(file);
  }, [onImageSelected]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": []
    },
    maxSize: 5 * 1024 * 1024, // 5MB, igual que el límite del backend
    multiple: false
  });

  // Limpiar el object URL al desmontar para evitar memory leaks
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

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
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            style={{ maxHeight: 150, borderRadius: 6 }}
          />
        ) : (
          <p className="mb-0 text-muted">
            {isDragActive
              ? "Soltá la imagen acá..."
              : "Arrastrá una imagen o hacé clic para seleccionar"}
          </p>
        )}
      </div>

      {fileRejections.length > 0 && (
        <p className="text-danger small mt-2">
          Archivo inválido. Solo JPG, PNG o WEBP, máximo 5MB.
        </p>
      )}
    </div>
  );
}