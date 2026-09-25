import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ReactNode } from "react";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ProductFormPage from "./pages/ProductFormPage";
import Products from "./pages/Products";
import Users from "./pages/Users";
import UserFormPage from "./pages/UserFormPage";
import VeziCos from "./pages/VeziCos";
import { useAuth } from "./context/AuthContext";
import "./App.css";
import ProductsListPage from "./pages/ProductsListPage";
import OrdersPage from "./pages/OrdersPage";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<"admin" | "client">;
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
<BrowserRouter basename={import.meta.env.BASE_URL}>     
 <div className="app-shell">
        <Header />

        <main className="container py-4 app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/veziCos"
              element={<VeziCos />}
            />
            <Route path="/products/:id" element={<ProductFormPage mode="view" />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/productsList" element={<ProductsListPage />} />
            <Route
              path="/adminProducts"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id/edit"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UserFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/new"
              element={<ProtectedRoute allowedRoles={["admin"]}><RegisterPage adminCreate /></ProtectedRoute>}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute><UserFormPage /></ProtectedRoute>}
            />
            <Route
              path="/orders"
              element={<ProtectedRoute><OrdersPage /></ProtectedRoute>}
            />
            <Route
              path="/products/new"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ProductFormPage mode="create" />
                </ProtectedRoute>
              }
            />
          
            <Route
              path="/products/:id/edit"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ProductFormPage mode="edit" />
                </ProtectedRoute>
              }
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
