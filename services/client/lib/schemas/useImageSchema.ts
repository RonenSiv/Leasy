import { z } from "zod";

export const imageSchema = z.object({
  image: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Please select an image"),
});

export type ImageSchema = z.infer<typeof imageSchema>;
