import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ProductFormPage from "./pages/ProductFormPage";
import ProductsListPage from "./pages/ProductsListPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />

        <main className="container py-4 app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsListPage />} />
            <Route
              path="/products/new"
              element={<ProductFormPage mode="create" />}
            />
            <Route
              path="/products/:id"
              element={<ProductFormPage mode="view" />}
            />
            <Route
              path="/products/:id/edit"
              element={<ProductFormPage mode="edit" />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;