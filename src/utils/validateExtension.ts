function validateFileType(file) {
  const allowedTypes = ["pdf", "jpg", "jpeg", "png"];
  const fileExtension = file.name.split(".").pop().toLowerCase();

  return allowedTypes.includes(fileExtension);
}

export default validateFileType;
