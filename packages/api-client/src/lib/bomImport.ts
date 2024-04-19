import { api } from './apiClient';
import {
  GetRecordsDto,
  GetRecordsResponse,
  ProcessFileDto,
  ProcessFileResponse,
  UpdateRecordDto,
  UpdateRecordResponse,
} from '@orionsuite/dtos';
import { z } from 'zod';

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

    updateRecord: builder.query<UpdateRecordResponse, UpdateRecordDto>({
      query: (dto) => {
        return {
          // url: `?script=${dto.script}&deploy=${dto.deploy}`,
          url: `?scriptID=307&deploymentID=${dto.deploy}&script=${dto.script}&deploy=${dto.deploy}&compid=TD2893635&h=2666e10fd32e93612036&fileId=1304`,
          method: 'POST',
          body: {
            action: dto.action,
            editID: dto.editID,
            custrecord_bom_import_importd_file_url:
              dto.custrecord_bom_import_importd_file_url,
            custrecord_bom_import_json_importd_file:
              dto.custrecord_bom_import_json_importd_file,
            custrecord_bom_import_file_import_order:
              dto.custrecord_bom_import_file_import_order,
            custrecord_bom_import_transaction:
              dto.custrecord_bom_import_transaction,
            custrecord_orion_bom_intialization_ident:
              dto.custrecord_orion_bom_intialization_ident,
          },
        };
      },
      providesTags: [],
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
      providesTags: [],
    }),
  }),
});
