type FileObjectType = {
  id: any;
  fileId?: any | null;
  fileLoading?: boolean;
  fileAdded?: boolean;
  fileName?: string | null;
  fileNameJson?: string | null;
  fullFileName?: string | null;
  fileExtension?: string | null;
  fileContent?: string | null | ArrayBuffer;
  loaderText?: string;
  bomRecordID?: number | null;
  bomRecordStatus?: number | null;
  fileJSON?: { [key: string]: any };
  file?: any;
  itemLines?: any[];
  fileURL?: string;
  initialPosition?: number;
  currentPosition?: number;
  transactionId?: any;
  transactionExist?: boolean;
  addedToArray?: boolean;
};

export { FileObjectType };
