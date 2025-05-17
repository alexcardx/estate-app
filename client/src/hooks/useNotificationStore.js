import { create } from "zustand";
import apiRequest from "../api/axios";

export const useNotificationStore = create((set, get) => ({
  number: 0,
  fetch: async () => {
    const res = await apiRequest("/user/notification");
    set({ number: res.data });
  },
  decrease: () => {
    const current = get().number;
    if (current > 0) {
      set({ number: current - 1 });
    }
  },
  reset: () => {
    set({ number: 0 });
  },
}));
