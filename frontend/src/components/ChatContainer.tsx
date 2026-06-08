import assets from "@/assets/assets";
import { AuthContext } from "@/contexts/AuthContext";
import { ChatContext } from "@/contexts/ChatContext";
import { formatMessageTime } from "@/libs/utils";
import React, { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef(null);

  const [input, setInput] = useState<string>("");

  const handleSendMessage = async (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLImageElement, MouseEvent>,
  ) => {
    e.preventDefault();

    if (input.trim() === "") return null;

    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image");
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      sendMessage({ image: reader.result });
      e.target.value = "";
    };
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!selectedUser)
    return (
      <div className="flex flex-col justify-center items-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
        <img className="max-w-16" src={assets.logo_icon} alt="" />
        <p className="text-lg font-medium text-white">Chat anytime, anywhare</p>
      </div>
    );

  return (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          className="w-8 rounded-full"
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
        />

        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>

        <img
          className="md:hidden max-w-7"
          src={assets.arrow_icon}
          alt=""
          onClick={() => setSelectedUser(null)}
        />
        <img className="max-md:hidden max-w-5" src={assets.help_icon} alt="" />
      </div>

      {/* Chat area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => (
          <div
            className={`
              flex items-end gap-2 justify-end
              ${msg.senderId !== authUser._id && "flex-row-reverse"}
            `}
            key={index}
          >
            {msg.image ? (
              <img
                className="max-w-57 border border-gray-700 rounded-lg overflow-hidden mb-8"
                src={msg.image}
                alt=""
              />
            ) : (
              <p
                className={`
                p-2 max-w-50 md:text-sm font-light
                rounded-lg mb-8 break-all bg-violet-500/30 text-white
                ${msg.senderId === authUser._id ? "rounded-br-none" : "rounded-bl-none"}
                `}
              >
                {msg.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                className="w-7 rounded-full"
                src={
                  msg.senderId === authUser._id
                    ? authUser?.profilePic || assets.avatar_icon
                    : selectedUser?.profilePic || assets.avatar_icon
                }
                alt=""
              />
              <p className="text-gray-500">
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* bottom area */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
            type="text"
            placeholder="Send a message"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <img
              className="w-5 mr-2 cursor-pointer"
              src={assets.gallery_icon}
              alt=""
            />
          </label>
          <img
            className="w-7 cursor-pointer"
            src={assets.send_button}
            alt=""
            onClick={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
