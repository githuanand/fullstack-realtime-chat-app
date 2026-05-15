import { create } from "zustand";
import API from "../utils/axios";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("token") || null,
  loading: false,

  register: async (formData, navigate) => {
    try {
      set({ loading: true });

      const { data } = await API.post(
        "/auth/register",
        formData
      );

      localStorage.setItem(
        "token",
        data.access_token
      );

      set({
        token: data.access_token
      });

      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },

  login: async (formData, navigate) => {
    try {
      set({ loading: true });

      const { data } = await API.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        data.access_token
      );

      set({
        token: data.access_token
      });

      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },

  logout: (navigate) => {
    localStorage.removeItem("token");

    set({
      token: null
    });

    navigate("/login");
  },
}));

export default useAuthStore;