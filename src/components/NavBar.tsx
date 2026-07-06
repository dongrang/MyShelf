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
    const active = "bg-blue-500 text-white border-blue-600 shadow-md scale-105";
    const inactive =
      "bg-white text-gray-700 border-transparent hover:bg-gray-100 hover:border-gray-200";
    return `${base} ${isActive ? active : inactive}`;
  };

  return (
    <div className="flex gap-2 p-3 bg-gray-50 rounded-xl shadow-sm">
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

      <button className="px-3 py-2 rounded border" onClick={toggleTheme}>
        {theme}
      </button>
      <button
        className={
          density === "compact"
            ? "px-3 py-2 rounded border font-bold underline"
            : "px-3 py-2 rounded border"
        }
        onClick={() => setDensity("compact")}
      >
        compact
      </button>
      <button
        className={
          density === "comfortable"
            ? "px-3 py-2 rounded border font-bold underline"
            : "px-3 py-2 rounded border"
        }
        onClick={() => setDensity("comfortable")}
      >
        comfortable
      </button>
    </div>
  );
}
