import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";
import Navbar from "./components/Navbar";
import FavoritesPage from "./pages/FavouritesPage";

export default function AppRouter() {
  return (
    <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/favorites" element={<FavoritesPage/>} />
      
      </Routes>
    </Router>
  );
}
