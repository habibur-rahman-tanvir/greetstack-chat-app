import assets, { userDummyData } from "@/assets/assets";
import { useNavigate } from "react-router";

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`
      bg-[#8195B2]/10 h-full p-5 rounded-r-xl
      overflow-y-scroll text-white
      ${selectedUser ? "max-md:hidden" : ""}
    `}
    >
      <div className="pb-5">
        <div className="flex items-center justify-between">
          <img className="max-w-40" src={assets.logo} alt="Logo" />
          <div className="relative py-2 group">
            <img
              className="cursor-pointer max-h-5"
              src={assets.menu_icon}
              alt="Menu icon"
            />
            <div className="hidden group-hover:block absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100">
              <p
                className="text-sm cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p className="text-sm cursor-pointer">Logout</p>
            </div>
          </div>
        </div>

        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img className="w-3" src={assets.search_icon} alt="Search" />
          <input
            className="bg-transparent border-none outline-none text-white text-sm placeholder-[#c8c8c8] flex-1"
            type="text"
            placeholder="Search user..."
          />
        </div>
      </div>

      <div className="flex flex-col">
        {userDummyData.map((user, index) => (
          <div
            className={`
              relative flex items-center gap-2 p-2 pl-4
              rounded cursor-pointer max-sm:text-sm
              ${selectedUser._id === user._id && "bg-[#282142]/50"}
            `}
            onClick={() => setSelectedUser(user)}
            key={index}
          >
            <img
              className="w-8 rounded-full aspect-square"
              src={user?.profilePic || assets.avatar_icon}
              alt={user.fullName}
            />

            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {index < 3 ? (
                <span className="text-xs text-green-400">Online</span>
              ) : (
                <span className="text-xs text-neutral-400">Offline</span>
              )}
            </div>

            {index > 2 && (
              <p className="absolute flex items-center justify-center w-5 h-5 text-xs rounded-full top-4 right-4 bg-violet-500/50">
                {index}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
