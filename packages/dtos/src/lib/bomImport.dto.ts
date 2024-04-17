import { z } from 'zod';

const RecordSchema = z.object({
  id: z.number(),
  line: z.number(),
  owner: z.number(),
  isinactive: z.string(),
  created: z.string(),
  externalid: z.string(),
  lastmodifiedby: z.number(),
  abbreviation: z.string(),
  scriptid: z.string(),
  recordid: z.number(),
  lastmodified: z.string(),
  name: z.string(),
  custrecord_bom_import_file_import_order: z.number(),
  custrecord_bom_import_json_importd_file: z.string(),
  custrecord_bom_import_importd_file_url: z.string(),
  custrecord_orion_bom_intialization_ident: z.string(),
  custrecord_orion_bom_intializaiton_ident: z.string(),
  custrecord_bom_import_transaction: z.number(),
});

const GetRecordsResponseSchema = z.object({
  message: z.string(),
  content: z.string(),
});

const GetRecordsDtoSchema = z.object({
  script: z.number(),
  deploy: z.number(),
  custrecord_bom_import_transaction: z.string().optional(),
  custrecord_orion_bom_intialization_ident: z.string().optional(),
});

const ProcessFileDtoSchema = z.object({
  script: z.number(),
  deploy: z.number(),
  fileContent: z.string(),
  fileName: z.string(),
});

const ProcessFileResponseSchema = z.object({
  fileURL: z.string(),
  fileID: z.string(),
});

const UpdateRecordDtoSchema = z.object({
  script: z.number(),
  deploy: z.number(),
  fileContent: z.string(),
  fileName: z.string(),

  action: z.string(),
  editID: z.string(),
  custrecord_bom_import_importd_file_url: z.string(),
  custrecord_bom_import_json_importd_file: z.string(),
  custrecord_bom_import_file_import_order: z.number(),
  custrecord_bom_import_transaction: z.string(),
  custrecord_orion_bom_intialization_ident: z.string(),
});

const UpdateRecordResponse = z.object({
  bomRecordID: z.string(),
});

export type Record = z.infer<typeof RecordSchema>;
export type GetRecordsResponse = z.infer<typeof GetRecordsResponseSchema>;
export type GetRecordsDto = z.infer<typeof GetRecordsDtoSchema>;

export type ProcessFileDto = z.infer<typeof ProcessFileDtoSchema>;
export type ProcessFileResponse = z.infer<typeof ProcessFileResponseSchema>;

export type UpdateRecordDto = z.infer<typeof UpdateRecordDtoSchema>;
export type UpdateRecordResponse = z.infer<typeof UpdateRecordResponse>;
