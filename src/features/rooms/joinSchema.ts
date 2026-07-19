import { z } from "zod";

export const joinRoomSchema = z.object({
  roomId: z.string().min(6, "Invalid Room ID"),

  password: z.string().min(8, "Password must be at least 8 characters"),

  displayName: z
    .string()
    .min(2, "Display name is too short")
    .max(30, "Display name is too long"),
});

export type JoinRoomFormData = z.infer<typeof joinRoomSchema>;
