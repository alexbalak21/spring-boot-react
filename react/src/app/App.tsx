import { AppRoutes } from "./routes";
import { Providers } from "./Providers";
import { Navbar } from "../features/layout";
import { ToastContainer } from "../shared/components";

export default function App() {
  return (
    <Providers>
      <div className="h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 w-full">
          <AppRoutes />
        </div>
        <ToastContainer position="top-right" />
      </div>
    </Providers>
  );
}
