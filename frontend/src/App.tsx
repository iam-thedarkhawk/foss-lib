import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Catalogue from "./pages/Catalogue";
import Submit from "./pages/Submit";
import AlternativeDetail from "./pages/AlternativeDetail";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Catalogue />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/alternatives/:id" element={<AlternativeDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
