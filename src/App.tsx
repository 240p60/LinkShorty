import {
  initData,
  miniApp,
  themeParams,
  useSignal,
  viewport,
} from "@tma.js/sdk-react";
import { useEffect } from "react";

function App() {
  const isDark = useSignal(miniApp.isDark);
  const user = useSignal(initData.user);

  useEffect(() => {
    try {
      initData.restore();
      miniApp.mount();
      themeParams.mount();
      viewport.mount().then(() => {
        viewport.expand();
      });
      miniApp.ready();
    } catch {
      // Not running in Telegram environment
    }
  }, []);

  return (
    <div
      className={`min-h-screen p-4 ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
    >
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">
          Telegram Mini App
        </h1>

        {user ? (
          <div
            className={`rounded-lg p-4 mb-4 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
          >
            <p className="text-lg">
              Welcome, <span className="font-semibold">{user.first_name}</span>
              {user.last_name && ` ${user.last_name}`}!
            </p>
            {user.username && (
              <p
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                @{user.username}
              </p>
            )}
          </div>
        ) : (
          <div
            className={`rounded-lg p-4 mb-4 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
          >
            <p
              className={`text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Open this app in Telegram to see your info
            </p>
          </div>
        )}

        <div
          className={`text-center text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          <p>Built with React + TypeScript + Vite</p>
        </div>
      </div>
    </div>
  );
}

export default App;
