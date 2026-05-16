import { create } from "zustand";
import axios from "../utils/axios";


const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,


  register: async (data) => {
    try {
      const res = await axios.post("/auth/register", data);

      localStorage.setItem(
        "token",
        res.data.access_token
      );

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.access_token}`;

      const payload = JSON.parse(
        atob(res.data.access_token.split(".")[1])
      );

      const user = {
        email: payload.sub,
        id: data.email === "anand@test.com" ? 2 : 1,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      set({
        token: res.data.access_token,
        user,
      });

      return true;
    } catch (error) {
      console.error(
        "Register error:",
        error.response?.data
      );

      return false;
    }
  },


  login: async (data) => {
    try {
      const res = await axios.post("/auth/login", data);

      localStorage.setItem(
        "token",
        res.data.access_token
      );

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.access_token}`;

      const payload = JSON.parse(
        atob(res.data.access_token.split(".")[1])
      );

      const user = {
        email: payload.sub,
        id: payload.sub === "anand@test.com" ? 2 : 1,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      set({
        token: res.data.access_token,
        user,
      });

      return true;
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data
      );

      return false;
    }
  },


  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete axios.defaults.headers.common[
      "Authorization"
    ];

    set({
      token: null,
      user: null,
    });
  },
}));


export default useAuthStore;