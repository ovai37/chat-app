import { create } from "zustand";

export type RoomVisibility = "private" | "public";

export type RoomData = {
  id: string;
  name: string;
  visibility: RoomVisibility;
  maxParticipants: number;
  password: string;
  createdAt: string;
  owner: string;
};

type RoomStore = {
  rooms: RoomData[];
  createRoom: (room: Omit<RoomData, "id" | "createdAt">) => RoomData;
  findRoom: (roomId: string) => RoomData | undefined;
  verifyRoom: (roomId: string, password: string) => RoomData | undefined;
};

const STORAGE_KEY = "shareRoom.rooms";

const loadRooms = (): RoomData[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    return JSON.parse(raw) as RoomData[];
  } catch {
    return [];
  }
};

const saveRooms = (rooms: RoomData[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
};

const buildRoomId = (name: string) => {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 20);

  const suffix = crypto.randomUUID().slice(0, 6).toLowerCase();
  return `${slug || "room"}-${suffix}`;
};

export const useRoomStore = create<RoomStore>((set, get) => ({
  rooms: loadRooms(),

  createRoom: (room) => {
    const nextRoom = {
      ...room,
      id: buildRoomId(room.name),
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const nextRooms = [...state.rooms, nextRoom];
      saveRooms(nextRooms);
      return {
        rooms: nextRooms,
      };
    });

    return nextRoom;
  },

  findRoom: (roomId) => {
    const normalized = roomId.trim().toLowerCase();
    const room = get().rooms.find((item) => item.id === normalized);
    if (room) {
      return room;
    }

    const stored = loadRooms();
    return stored.find((item) => item.id === normalized);
  },

  verifyRoom: (roomId, password) => {
    const room = get().findRoom(roomId);
    if (!room || room.password !== password) {
      return undefined;
    }

    return room;
  },
}));
