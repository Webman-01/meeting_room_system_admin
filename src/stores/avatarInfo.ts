import { defineStore } from "pinia";

export const useAvatarInfoStore = defineStore("avatarInfo", {
  state: () => {
    return {
      avatarUrl: "",
    };
  },
});
