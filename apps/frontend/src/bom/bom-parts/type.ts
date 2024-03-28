type FileObjectType = {
  id: number | null;
  fileLoading: boolean;
  fileAdded: boolean;
  fileName: string | null;
  fullFileName: string | null;
  buttonText: string | null;
  statusText: string | null;
  loaderText: string | null;
  fileContent: string | null;
  bomRecordID: number | null;
  bomRecordStatus: number | null;
  fileJSON: { [key: string]: any };
  file: string | null;
  itemLines: any[];
};

export { FileObjectType };
