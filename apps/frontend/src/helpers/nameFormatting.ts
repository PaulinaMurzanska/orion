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
  let fileNameShort = fullFileName;
  let extension = '';
  let fileNameJson = '';

  if (lastDotIndex > 0) {
    fileNameShort = fullFileName.substring(0, lastDotIndex);
    extension = fullFileName.substring(lastDotIndex);
    fileNameJson =
      lastDotIndex !== -1
        ? fullFileName.substring(0, lastDotIndex) + '.json'
        : fullFileName + '.json';
  }

  fileNameShort = formatFileName(fileNameShort);

  return { fileNameShort, fileNameJson, extension };
};
export { extractFileNameAndExtension, formatFileName };
