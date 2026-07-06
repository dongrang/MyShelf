import { Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import Catalog from "./pages/Catalog";
import ItemDetail from "./pages/ItemDetail";
import FilteredList from "./pages/FilteredList";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { useUiStore } from "./store/useUiStore";

function App() {
  const theme = useUiStore((s) => s.theme);
  return (
    <div className={`${theme === "dark" ? "dark" : ""} min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white`}>
      <NavBar />
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/list/:status" element={<FilteredList />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
