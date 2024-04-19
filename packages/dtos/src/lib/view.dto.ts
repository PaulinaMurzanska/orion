import { z } from 'zod';

const ViewSchema = z.object({
  abbreviation: z.null(),
  created: z.string(),
  custrecord_orion_smarttable_current_user: z.number(),
  custrecord_orion_smarttable_icon_url: z.string(),
  custrecord_orion_smarttable_position: z.number(),
  custrecord_orion_smarttable_roles: z.string(),
  custrecord_orion_smarttable_view_title: z.string(),
  custrecord_orion_smarttable_view_type: z.number(),
  custrecord_orion_view_json: z.string(),
  externalid: z.null(),
  id: z.number(),
  isinactive: z.string(),
  lastmodified: z.string(),
  lastmodifiedby: z.number(),
  name: z.string(),
  owner: z.number(),
  recordid: z.number(),
  scriptid: z.string(),
});

const GetViewsResponse = z.object({
  message: z.string(),
  tableViews: z.array(ViewSchema),
});

export type View = z.infer<typeof ViewSchema>;
export type GetViewsResponse = z.infer<typeof GetViewsResponse>;
