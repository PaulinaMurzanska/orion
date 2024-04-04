import { api } from './apiClient';
import { DataToJsonDto, LineJson } from '@orionsuite/dtos';

export const dataToJsonApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createFileCabinet: builder.query<LineJson, DataToJsonDto>({
      query: (dto) => {
        return {
          url: `app/site/hosting/restlet.nl?script=${dto.script}&deploy=${dto.deploy}`,
          method: 'POST',
          body: {
            fileContent: dto.fileContent,
            fileName: dto.fileName,
          },
        };
      },
      providesTags: [],
    }),
  }),
});
