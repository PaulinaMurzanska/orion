const formatFileName = (fileName: string) => {
  if (fileName.length > 8) {
    return `${fileName.substring(0, 5)}...${fileName.substring(
      fileName.length - 3
    )}`;
  }
  return fileName;
};

const extractFileNameAndExtension = (fullFileName: string) => {
  const lastDotIndex = fullFileName.lastIndexOf('.');
  let fileName = fullFileName;
  let extension = '';

  if (lastDotIndex > 0) {
    fileName = fullFileName.substring(0, lastDotIndex);
    extension = fullFileName.substring(lastDotIndex);
  }

  fileName = formatFileName(fileName);

  return { fileName, extension };
};
export { extractFileNameAndExtension, formatFileName };
