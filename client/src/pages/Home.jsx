import { useEffect, useRef, useState } from "react";
import useChatStore from "../store/chatStore";
import useAuthStore from "../store/authStore";


const Home = () => {
  const {
    users,
    messages,
    selectedConversation,
    fetchUsers,
    createConversation,
    sendMessage,
    connectSocket,
  } = useChatStore();

  const { user, logout } = useAuthStore();

  const [message, setMessage] = useState("");

  const messagesEndRef = useRef(null);


  useEffect(() => {
    fetchUsers();

    if (user?.id) {
      connectSocket(user.id);
    }
  }, [user]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);


  const handleSelectUser = async (userId) => {
    await createConversation(userId);
  };


  const handleSend = async () => {
    if (!message.trim()) return;

    await sendMessage(message);

    setMessage("");
  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };


  const getSelectedUserName = () => {
    if (!selectedConversation) {
      return "Select a user to start chatting";
    }

    const otherUserId =
      selectedConversation.user1_id === user.id
        ? selectedConversation.user2_id
        : selectedConversation.user1_id;

    const selectedUser = users.find(
      (u) => u.id === otherUserId
    );

    return selectedUser?.full_name || "Conversation";
  };


  return (
    <div className="flex h-screen bg-gray-200">
      
      {/* SIDEBAR */}
      <div className="w-1/4 min-w-[250px] bg-gray-900 text-white p-4 flex flex-col">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Chats
          </h1>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {users.map((u) => (
            <div
              key={u.id}
              onClick={() => handleSelectUser(u.id)}
              className={`p-4 rounded mb-2 cursor-pointer transition ${
                selectedConversation &&
                (
                  selectedConversation.user1_id === u.id ||
                  selectedConversation.user2_id === u.id
                )
                  ? "bg-blue-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <p className="font-medium">
                {u.full_name}
              </p>
            </div>
          ))}
        </div>
      </div>


      {/* CHAT WINDOW */}
      <div className="flex-1 flex flex-col">
        
        {/* HEADER */}
        <div className="p-4 bg-white shadow border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {getSelectedUserName()}
          </h2>
        </div>


        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              No messages yet
            </p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  msg.sender_id === user.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow ${
                    msg.sender_id === user.id
                      ? "bg-blue-500 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}

          <div ref={messagesEndRef} />
        </div>


        {/* INPUT */}
        {selectedConversation && (
          <div className="p-4 bg-white border-t flex items-center gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 text-black bg-white outline-none focus:border-blue-500"
            />

            <button
              onClick={handleSend}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


export default Home;