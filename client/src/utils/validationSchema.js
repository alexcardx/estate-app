import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().int().positive("Price is required"),
  bedroom: z.coerce.number().int().min(1, "At least 1 bedroom is required"),
  bathroom: z.coerce.number().int().min(1, "At least 1 bathroom is required"),
  size: z.coerce.number().min(10, "Size must be at least 10 m²"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  fee: z.string().min(1, "Fee policy is require"),
  utility: z.string().min(1, "Utility selection is required"),
  pet_policy: z.string().min(1, "Pet policy is required"),
  type: z.string().min(1, "Type is required"),
  property: z.string().min(1, "Property is required"),
});
