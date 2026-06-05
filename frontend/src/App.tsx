import { RouterProvider } from "react-router";
import { router } from "./routes";

const App = () => {
  return (
    <div className="bg-[url('./assets/bgImage.svg')] bg-center bg-cover">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
