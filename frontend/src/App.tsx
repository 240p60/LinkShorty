import { Header } from "@components/Layout/Header";
import { AppRoutes } from "@routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <main className="px-4 py-4 pb-8">
          <AppRoutes />
        </main>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#1F2937",
              color: "#F3F4F6",
              border: "1px solid #374151",
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
