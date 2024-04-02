function validateFileType(file: Blob): boolean {
  // 1. Check for File object and use its name property (if available)
  if (file instanceof File) {
    const fileExtension = file.name?.split(".").pop()?.toLowerCase();
    if (fileExtension) {
      return ["pdf", "jpg", "jpeg", "png"].includes(fileExtension);
    }
  }

  // 2. Fallback for Blob or missing file name: Use MIME type (less reliable)
  const mimeType = file.type?.toLowerCase();
  if (mimeType) {
    return ["application/pdf", "image/jpeg", "image/png"].includes(mimeType); // Adjust mime types based on allowed formats
  }

  // 3. If no name or type available, consider it invalid (more secure)
  return false;
}

export default validateFileType;
