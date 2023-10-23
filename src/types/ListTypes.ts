import { z } from "zod";

export const AllListsObjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string(),
  plexToken: z.string().optional(),
  _count: z.object({
    movies: z.number(),
  }),
  isPlex: z.boolean(),
});

export const AllListsObjectUnionSchema = z.union([
  AllListsObjectSchema.extend({
    isPlex: z.literal(true),
    plexToken: z.string().min(1),
    connected: z.boolean().default(false),
  }),
  AllListsObjectSchema.extend({
    isPlex: z.literal(false),
  }),
]);

export type ListObjectReturnType = z.infer<typeof AllListsObjectUnionSchema>;

export const AllListsReturnTypeSchema = z.array(AllListsObjectUnionSchema);
export type AllListsReturnType = z.infer<typeof AllListsReturnTypeSchema>;
