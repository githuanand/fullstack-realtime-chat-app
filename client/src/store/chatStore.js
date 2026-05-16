import { create } from "zustand";
import axios from "../utils/axios";


const useChatStore = create((set, get) => ({
  users: [],
  conversations: [],
  messages: [],
  selectedConversation: null,
  socket: null,


  // GET ALL USERS
  fetchUsers: async () => {
    try {
      const res = await axios.get("/users/all");

      set({
        users: res.data,
      });
    } catch (error) {
      console.error("Fetch users error:", error);
    }
  },


  // GET CONVERSATIONS
  fetchConversations: async () => {
    try {
      const res = await axios.get("/chat/conversations");

      set({
        conversations: res.data,
      });
    } catch (error) {
      console.error("Fetch conversations error:", error);
    }
  },


  // CREATE OR OPEN CONVERSATION
  createConversation: async (userId) => {
    try {
      const res = await axios.post("/chat/conversation", {
        user_id: userId,
      });

      set({
        selectedConversation: res.data,
      });

      await get().fetchMessages(res.data.id);

      return res.data;
    } catch (error) {
      console.error("Create conversation error:", error);
    }
  },


  // GET MESSAGES
  fetchMessages: async (conversationId) => {
    try {
      const res = await axios.get(
        `/chat/messages/${conversationId}`
      );

      set({
        messages: res.data,
      });
    } catch (error) {
      console.error("Fetch messages error:", error);
    }
  },


  // SEND MESSAGE
  sendMessage: async (content) => {
    const conversation = get().selectedConversation;

    if (!conversation) return;

    try {
      const res = await axios.post("/chat/message", {
        conversation_id: conversation.id,
        content,
        image: null,
      });

      set({
        messages: [...get().messages, res.data],
      });

      const socket = get().socket;

      if (socket) {
        const currentUser = JSON.parse(
          localStorage.getItem("user")
        );

        const receiverId =
          conversation.user1_id === currentUser.id
            ? conversation.user2_id
            : conversation.user1_id;

        socket.send(
          JSON.stringify({
            sender_id: currentUser.id,
            receiver_id: receiverId,
            conversation_id: conversation.id,
            content,
          })
        );
      }
    } catch (error) {
      console.error("Send message error:", error);
    }
  },


  // CONNECT SOCKET
  connectSocket: (userId) => {
    const socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/${userId}`
    );

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);

      const currentConversation =
        get().selectedConversation;

      if (!currentConversation) return;

      // Only show messages for currently selected chat
      if (
        newMessage.conversation_id ===
        currentConversation.id
      ) {
        set({
          messages: [
            ...get().messages,
            newMessage,
          ],
        });
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    set({
      socket,
    });
  },


  // DISCONNECT SOCKET
  disconnectSocket: () => {
    const socket = get().socket;

    if (socket) {
      socket.close();
    }

    set({
      socket: null,
    });
  },
}));


export default useChatStore;