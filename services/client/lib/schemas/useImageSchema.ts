import { z } from "zod";

export const imageSchema = z.object({
  image: z
    .instanceof(File, { message: "Please upload a file." })
    .refine((files) => files.size > 0, "Please select an image"),
});

export type ImageSchema = z.infer<typeof imageSchema>;
