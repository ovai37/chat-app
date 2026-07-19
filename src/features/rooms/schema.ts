import { z } from "zod";

export const createRoomSchema = z
  .object({
    roomName: z
      .string()
      .min(3, "Room name must be at least 3 characters")
      .max(50, "Room name must be less than 50 characters"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),

    visibility: z.enum(["private", "public"]),

    maxParticipants: z.coerce
      .number()
      .min(2, "Minimum 2 participants")
      .max(100, "Maximum 100 participants"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type CreateRoomFormData = z.infer<typeof createRoomSchema>;
