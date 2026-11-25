
import { useThemeStore } from "@/store/themeStore";

function ThemeToggle() {
  const darkMode = useThemeStore((state) => state.darkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={darkMode}
      aria-label="Modo oscuro"
      className={`
        relative h-12 w-32 shrink-0 cursor-pointer
        rounded-full border-2 shadow-inner
        transition-colors duration-300
        ${
          darkMode
            ? "border-slate-600 bg-slate-800"
            : "border-gray-300 bg-gray-200"
        }
      `}
    >
      {/* Texto del modo activo */}
      <span
        className={`
          absolute top-1/2 -translate-y-1/2
          text-[11px] font-bold leading-tight
          transition-all duration-300
          ${
            darkMode
              ? "right-3 text-white"
              : "left-3 text-slate-600"
          }
        `}
      >
        {darkMode ? (
          <>
            DARK
            <br />
            MODE
          </>
        ) : (
          <>
            LIGHT
            <br />
            MODE
          </>
        )}
      </span>

      {/* Círculo deslizante */}
      <span
        className={`
          absolute top-1/2 flex h-10 w-10
          -translate-y-1/2 items-center justify-center
          rounded-full bg-white shadow-md
          transition-all duration-300 ease-in-out
          ${
            darkMode
              ? "left-1 text-slate-600"
              : "left-[calc(100%-2.75rem)] text-yellow-500"
          }
        `}
      >
        {darkMode ? (
          // Luna
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
          </svg>
        ) : (
          // Sol
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
          </svg>
        )}
      </span>
    </button>
  );
}

export default ThemeToggle;
