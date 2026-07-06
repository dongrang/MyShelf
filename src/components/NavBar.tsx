import { NavLink } from "react-router-dom";
import { useUiStore } from "../store/useUiStore";

export default function NavBar() {
  const theme = useUiStore((s) => s.theme);
  const density = useUiStore((s) => s.density);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const setDensity = useUiStore((s) => s.setDensity);

  const LinkClass = ({ isActive }: { isActive: boolean }) => {
    const base =
      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out border";
    const active = "bg-blue-500 text-white border-blue-600 shadow-md";
    const inactive =
      "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700";
    return `${base} ${isActive ? active : inactive}`;
  };

  const ctrlClass = (selected: boolean) =>
    `px-3 py-2 rounded border text-sm transition ${
      selected
        ? "bg-blue-500 text-white border-blue-600"
        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <NavLink to="/" end className={LinkClass}>
        Catalog
      </NavLink>
      <NavLink to="/list/want" className={LinkClass}>
        Want
      </NavLink>
      <NavLink to="/list/active" className={LinkClass}>
        Active
      </NavLink>
      <NavLink to="/list/done" className={LinkClass}>
        Done
      </NavLink>
      <NavLink to="/list/dropped" className={LinkClass}>
        Dropped
      </NavLink>
      <NavLink to="/about" className={LinkClass}>
        About
      </NavLink>

      {/* controls pushed to the right on wider screens */}
      <div className="flex flex-wrap gap-2 sm:ml-auto">
        <button className={ctrlClass(false)} onClick={toggleTheme}>
          {theme === "dark" ? "☀ light" : "🌙 dark"}
        </button>
        <button
          className={ctrlClass(density === "compact")}
          onClick={() => setDensity("compact")}
        >
          compact
        </button>
        <button
          className={ctrlClass(density === "comfortable")}
          onClick={() => setDensity("comfortable")}
        >
          comfortable
        </button>
      </div>
    </div>
  );
}
