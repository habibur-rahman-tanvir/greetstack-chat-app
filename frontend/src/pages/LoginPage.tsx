import assets from "@/assets/assets";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useState } from "react";
import { Navigate } from "react-router";

const LoginPage = () => {
  const [currState, setCurrState] = useState<"Sign up" | "Login">("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { authUser, login } = useContext(AuthContext);
  if (authUser) return <Navigate to={"/"} />;

  const onSubmitHandler = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    login(currState === "Sign up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* Left */}
      <img className="w-[min(30vw,250px)]" src={assets.logo_big} alt="" />

      {/* right */}
      <form
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
        onSubmit={onSubmitHandler}
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          {isDataSubmitted && (
            <img
              className="w-5 cursor-pointer"
              src={assets.arrow_icon}
              alt=""
              onClick={() => setIsDataSubmitted(false)}
            />
          )}
        </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
            type="text"
            placeholder="Full Name"
            required
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              className="p-2 border border-gray-500 rounded-md focus:outline-none"
              type="email"
              placeholder="Email Address"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              className="p-2 border border-gray-500 rounded-md focus:outline-none"
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={4}
            placeholder="Provide a short bio..."
            required
            onChange={(e) => setBio(e.target.value)}
            value={bio}
          ></textarea>
        )}

        <button
          className="py-3 bg-linear-to-r from-purple-400 to-violet-600 text-white rounded-xl cursor-pointer"
          type="submit"
        >
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" />
          <p>Agree to terms of use & privacy policy</p>
        </div>

        <div className="flex flex-col gap-2">
          {currState === "Sign up" ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <span
                className="font-medium text-violet-500 cursor-pointer"
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create an account{" "}
              <span
                className="font-medium text-violet-500 cursor-pointer"
                onClick={() => setCurrState("Sign up")}
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
