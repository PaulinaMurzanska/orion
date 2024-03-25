type FileObjectType = {
  id: any;
  fileLoading: boolean;
  fileAdded: boolean;
  fileName: string | null;
  fullFileName: string | null;
  fileExtension: string | null;
  fileContent: string | null | ArrayBuffer;
  bomRecordID: number | null;
  bomRecordStatus: number | null;
  fileJSON: { [key: string]: any };
  file: any;
  itemLines: any[];
};

export { FileObjectType };
