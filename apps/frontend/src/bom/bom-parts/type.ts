type FileObjectType = {
  id: any;
  fileLoading: boolean;
  fileAdded: boolean;
  fileName: string | null;
  fullFileName: string | null;
  fileExtension: string | null;
  fileContent: string | null | ArrayBuffer;
  loaderText: string;
  bomRecordID: number | null;
  bomRecordStatus: number | null;
  fileJSON: { [key: string]: any };
  file: any;
  itemLines: any[];
  fileURL?: string;
};

export { FileObjectType };
