import { Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import Catalog from "./pages/Catalog";
import ItemDetail from "./pages/ItemDetail";
import FilteredList from "./pages/FilteredList";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div>
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
