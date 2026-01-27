import { useLocation, useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import { useTelegram } from "@hooks/useTelegram";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useTelegram();

  const isHome = location.pathname === "/";
  const isLinks = location.pathname === "/links";

  return (
    <header className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur border-b border-gray-800">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <LinkIcon />
            Сокращатель ссылок
          </h1>
          {user && <span className="text-sm text-gray-400">Привет, {user.first_name}</span>}
        </div>

        <nav className="flex gap-1">
          <NavButton active={isHome} onClick={() => navigate("/")}>
            <HomeIcon />
            Главная
          </NavButton>
          <NavButton active={isLinks} onClick={() => navigate("/links")}>
            <ListIcon />
            Мои ссылки
          </NavButton>
        </nav>
      </div>
    </header>
  );
}

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function NavButton({ active, onClick, children }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
        active ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800",
      )}
    >
      {children}
    </button>
  );
}

function LinkIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 10h16M4 14h16M4 18h16"
      />
    </svg>
  );
}
