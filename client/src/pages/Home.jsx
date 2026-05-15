function Home() {
  return (
    <div className="min-h-screen flex">
      <div className="w-1/4 bg-panel p-4 border-r border-gray-800">
        <h2 className="text-2xl font-bold">Chats</h2>
      </div>

      <div className="flex-1 flex items-center justify-center bg-primary">
        <h1 className="text-3xl font-bold text-gray-400">
          Select a conversation
        </h1>
      </div>
    </div>
  );
}

export default Home;