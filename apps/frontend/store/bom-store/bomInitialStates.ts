import { FileObjectType } from '../../src/bom/bom-parts/type';

const initialFile: FileObjectType = {
  id: '',
  fileId: null,
  fileLoading: false,
  fileAdded: false,
  fileName: 'Drag and Drop',
  fullFileName: '',
  fileNameJson: '',
  fileExtension: '',
  loaderText: '',
  fileContent: '',
  bomRecordID: null,
  bomRecordStatus: 1,
  fileJSON: {},
  file: null,
  itemLines: [],
  initialPosition: 1,
  currentPosition: 1,
};

export { initialFile };
