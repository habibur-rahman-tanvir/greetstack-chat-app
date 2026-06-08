/* eslint-disable @typescript-eslint/no-explicit-any */
import ChatContainer from "@/components/ChatContainer";
import RightSidebar from "@/components/RightSidebar";
import Sidebar from "@/components/Sidebar";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useState } from "react";
import { Navigate } from "react-router";

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { authUser } = useContext(AuthContext);
  if (!authUser) return <Navigate to={"/login"} />;

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
        <Sidebar />
        <ChatContainer />
        <RightSidebar selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default HomePage;
