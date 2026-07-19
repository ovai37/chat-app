import { useNavigate } from "react-router-dom";
import { type SubmitHandler, type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Card, Input } from "../../../components/ui";
import { createRoomSchema, CreateRoomFormData } from "../schema";
import { useRoomStore } from "../roomStore";

export default function CreateRoomForm() {
  const navigate = useNavigate();
  const createRoom = useRoomStore((state) => state.createRoom);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema) as Resolver<CreateRoomFormData>,
    defaultValues: {
      visibility: "private",
      maxParticipants: 10,
    },
  });

  const onSubmit: SubmitHandler<CreateRoomFormData> = async (data) => {
    const room = createRoom({
      name: data.roomName,
      visibility: data.visibility,
      maxParticipants: data.maxParticipants,
      password: data.password,
      owner: data.roomName,
    });

    navigate(`/room/${room.id}/chat`);
  };

  return (
    <Card className="mx-auto w-full max-w-md p-5 sm:p-6 lg:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Create Room</h2>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Create a secure room and invite others to collaborate.
          </p>
        </div>

        <div>
          <Input {...register("roomName")} placeholder="Room Name" />
          {errors.roomName && (
            <p className="mt-1 text-sm text-red-400">
              {errors.roomName.message}
            </p>
          )}
        </div>

        <div>
          <Input
            type="password"
            {...register("password")}
            placeholder="Password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <Input
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-400">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Room Visibility
          </label>

          <select
            {...register("visibility")}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Maximum Participants
          </label>

          <Input
            type="number"
            min={2}
            max={100}
            {...register("maxParticipants")}
          />

          {errors.maxParticipants && (
            <p className="mt-1 text-sm text-red-400">
              {errors.maxParticipants.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating room..." : "🚀 Create Secure Room"}
        </Button>
      </form>
    </Card>
  );
}
