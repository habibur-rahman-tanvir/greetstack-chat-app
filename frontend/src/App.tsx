import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="bg-[url('./assets/bgImage.svg')] bg-center bg-cover">
      <Toaster position="top-center" />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
