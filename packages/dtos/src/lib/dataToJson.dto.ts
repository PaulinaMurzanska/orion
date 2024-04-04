import { z } from 'zod';

const DataToJsonDtoSchema = z.object({
  script: z.number(),
  deploy: z.number(),
  fileContent: z.string(),
  fileName: z.string(),
});


const LineJsonSchema = z.object({
  message: z.string(),
  lineJson: z.object({}),
});

export type DataToJsonDto = z.infer<typeof DataToJsonDtoSchema>;
export type LineJson = z.infer<typeof LineJsonSchema>;
