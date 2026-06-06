/* eslint-disable @typescript-eslint/no-explicit-any */
import ChatContainer from "@/components/ChatContainer";
import RightSidebar from "@/components/RightSidebar";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);

  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={`
        relative grid h-full grid-cols-1 overflow-hidden
        border-2 border-gray-600 backdrop-blur-xl
        rounded-2xl
        ${selectedUser ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]" : "md:grid-cols-2"}
      `}
      >
        <Sidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <ChatContainer
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <RightSidebar selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default HomePage;
