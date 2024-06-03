/**
 * Generates a name for the downloaded canvas image file
 * 
 * @param {string} text - Text to add to image name
 * @returns {string} Filename
 */
const getImageName = (text) => {
  const sanitizedText = text
    .trim()
    .toLowerCase()
    .replace(/[\W_]+/g, "");
  return `orthomoji_${sanitizedText}.png`;
}

export { getImageName };
