import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Card, Input } from "../../../components/ui";
import { joinRoomSchema, JoinRoomFormData } from "../joinSchema";
import { useRoomStore } from "../roomStore";

export default function JoinRoomForm() {
  const navigate = useNavigate();
  const verifyRoom = useRoomStore((state) => state.verifyRoom);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JoinRoomFormData>({
    resolver: zodResolver(joinRoomSchema),
  });

  const onSubmit: SubmitHandler<JoinRoomFormData> = (data) => {
    const matched = verifyRoom(data.roomId, data.password);

    if (!matched) {
      setSubmitError("Room not found or password is incorrect.");
      return;
    }

    navigate(`/room/${matched.id}/chat`);
  };

  return (
    <Card className="mx-auto w-full max-w-md p-5 sm:p-6 lg:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Join Room</h2>

          <p className="mt-2 text-sm text-slate-400">
            Join an existing secure collaboration room.
          </p>
        </div>

        <div>
          <Input placeholder="Room ID" {...register("roomId")} />
          <p className="mt-1 text-sm text-red-400">{errors.roomId?.message}</p>
        </div>

        <div>
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          <p className="mt-1 text-sm text-red-400">
            {errors.password?.message}
          </p>
        </div>

        <div>
          <Input placeholder="Display Name" {...register("displayName")} />
          <p className="mt-1 text-sm text-red-400">
            {errors.displayName?.message}
          </p>
        </div>

        {submitError && (
          <p className="text-sm text-red-400">{submitError}</p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          Join Room
        </Button>
      </form>
    </Card>
  );
}
