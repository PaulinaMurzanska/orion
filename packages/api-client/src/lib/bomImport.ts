import { api } from './apiClient';
import {
  GetRecordsDto,
  GetRecordsResponse,
  ProcessFileDto,
  ProcessFileResponse,
  UpdateRecordResponse,
} from '@orionsuite/dtos';

export const bomImportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    processFile: builder.query<ProcessFileResponse, ProcessFileDto>({
      query: (dto) => {
        return {
          url: `?script=${dto.script}&deploy=${dto.deploy}`,
          method: 'POST',
          body: {
            fileContent: dto.fileContent,
            fileName: dto.fileName,
          },
        };
      },
      providesTags: [],
    }),

    updateRecord: builder.mutation<UpdateRecordResponse, any>({
      query: (dto: any) => {
        console.log(
          `?scriptID=307&deploymentID=${dto.deploy}&script=${dto.script}&deploy=${dto.deploy}&compid=TD2893635&h=2666e10fd32e93612036&fileId=1304`
        );
        return {
          // url: `?script=${dto.script}&deploy=${dto.deploy}`,
          url: `?scriptID=307&deploymentID=${dto.deploy}&script=${dto.script}&deploy=${dto.deploy}&compid=TD2893635&h=2666e10fd32e93612036&fileId=1304`,
          method: 'POST',
          body: {
            scriptID: 307,
            deploymentID: dto.deploy,
            fileContent: dto.fileContent,
            fileID: dto.fileID,
          },
        };
      },
      invalidatesTags: ['Record'],
    }),

    getRecords: builder.query<GetRecordsResponse, GetRecordsDto>({
      query: (dto) => {
        const transaction = dto.custrecord_bom_import_transaction
          ? `&custrecord_bom_import_transaction${dto.custrecord_bom_import_transaction}`
          : '';

        const indent = dto.custrecord_orion_bom_intialization_ident
          ? `&custrecord_orion_bom_intialization_ident=${dto.custrecord_orion_bom_intialization_ident}`
          : '';

        return {
          url: `?scriptID=295&deploymentID=${dto.deploy}${transaction}${indent}&script=${dto.script}&deploy=${dto.deploy}${transaction}${indent}&compid=TD2893635&h=2666e10fd32e93612036&fileId=1304`,
          method: 'GET',
        };
      },
      providesTags: ['Record'],
    }),
  }),
});
