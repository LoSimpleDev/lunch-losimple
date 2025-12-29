function FilePreview({ url }) {
  console.log("FilePreview URL:", url);
  if (!url) return <p>No file to preview</p>;

  // Detectar tipo por extensión presente en la URL
  const lowerUrl = url.toLowerCase();

  const isPdf = lowerUrl.includes(".pdf");
  const isImage = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"].some(
    (ext) => lowerUrl.includes(ext)
  );
  const isDoc = [".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"].some(
    (ext) => lowerUrl.includes(ext)
  );

  // Vista para PDF
  if (isPdf) {
    return (
      <iframe
        src={url}
        width="100%"
        height="600px"
        style={{ border: "none" }}
        title="PDF Preview"
      />
    );
  }

  // Vista para imágenes
  if (isImage) {
    return (
      <img
        src={url}
        alt="preview"
        style={{ maxWidth: "100%", maxHeight: "600px", objectFit: "contain" }}
      />
    );
  }

  // Vista para DOC, XLS, PPT usando Google Docs Viewer
  if (isDoc) {
    return (
      <iframe
        src={`https://docs.google.com/gview?url=${encodeURIComponent(
          url
        )}&embedded=true`}
        width="100%"
        height="600px"
        style={{ border: "none" }}
        title="Docs Preview"
      />
    );
  }

  // Si no se puede previsualizar
  return (
    <div>
      <p>No se puede previsualizar este archivo.</p>
      <a href={url} download>
        Descargar archivo
      </a>
    </div>
  );
}

export default FilePreview;
