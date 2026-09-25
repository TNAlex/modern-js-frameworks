import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../services/ordersApi";
import {
  CartItem,
  clearCart,
  getCartItems,
  removeFromCart,
  updateCartItemQuantity,
} from "../services/cartStorage";
import { resolveImageUrl } from "../utils/images";

function VeziCos() {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => getCartItems());
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  function syncCart(): void {
    setItems(getCartItems());
  }

  useEffect(() => {
    const handler = () => syncCart();
    window.addEventListener("cart:updated", handler);

    return () => window.removeEventListener("cart:updated", handler);
  }, []);

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => {
      const priceValue = Number.parseFloat(item.price) || 0;
      return sum + priceValue * item.quantity;
    }, 0);
  }, [items]);

  function increaseQuantity(item: CartItem): void {
    updateCartItemQuantity(item.id, item.quantity + 1);
  }

  function decreaseQuantity(item: CartItem): void {
    updateCartItemQuantity(item.id, item.quantity - 1);
  }

  function handleRemove(item: CartItem): void {
    removeFromCart(item.id);
  }

  function handleClearCart(): void {
    clearCart();
  }

  async function handleFinalizeOrder(): Promise<void> {
    if (!isAuthenticated) {
      return;
    }

    if (!items.length) {
      setErrorMessage("Cosul este gol.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await createOrder(items);
      clearCart();
      setItems([]);
      setSuccessMessage(
        `Comanda a fost finalizata cu succes. ID comanda: ${response.order.orderId}`,
      );
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setErrorMessage(
        axiosError.response?.data?.message ||
          (err instanceof Error ? err.message : "Nu s-a putut finaliza comanda."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="mb-0">Cos de cumparaturi</h2>
          <small className="text-muted">Total produse: {totalCount}</small>
        </div>
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-secondary" to="/productsList">
            Inapoi la produse
          </Link>
          <button type="button" className="btn btn-danger" onClick={handleClearCart} disabled={!items.length}>
            Goleste cosul
          </button>
        </div>
      </div>

      {successMessage ? (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      ) : null}

      {!items.length ? (
        <div className="alert alert-secondary" role="alert">
          Cosul este gol.
        </div>
      ) : (
        <div className="row g-3">
          {items.map((item) => (
            <div key={item.id} className="col-12 col-lg-6">
              <div className="card h-100 shadow-sm">
                <div className="row g-0 h-100">
                  <div className="col-md-4">
                    <img
                      src={resolveImageUrl(item.image)}
                      alt={item.name}
                      className="img-fluid rounded-start h-100 w-100"
                      style={{ objectFit: "cover", minHeight: 180 }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body d-flex flex-column h-100">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text mb-1">
                        <strong>Pret:</strong> {item.price}
                      </p>
                      <p className="card-text mb-3">
                        <strong>Cantitate:</strong> {item.quantity}
                      </p>

                      <div className="mt-auto d-flex flex-wrap gap-2">
                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => decreaseQuantity(item)}>
                          -
                        </button>
                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => increaseQuantity(item)}>
                          +
                        </button>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleRemove(item)}>
                          Sterge
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-4 p-3 border rounded bg-light">
        <strong>Total de plata:</strong>
        <span>{totalPrice.toFixed(2)}</span>
      </div>

      <div className="mt-4 p-3 border rounded bg-white shadow-sm">
        {isAuthenticated ? (
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <strong>Utilizator:</strong> {user?.name} {user?.surname}
            </div>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleFinalizeOrder}
              disabled={!items.length || submitting}
            >
              {submitting ? "Se finalizeaza..." : "Finalizeaza comanda"}
            </button>
          </div>
        ) : (
          <div className="alert alert-warning mb-0" role="alert">
            Doar utilizatorii logati pot finaliza comanda.{' '}
            <Link to="/login" className="alert-link">
              Click aici pentru login
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default VeziCos;