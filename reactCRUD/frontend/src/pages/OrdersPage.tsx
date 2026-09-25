import { useCallback, useEffect, useState } from "react";
import { getOrders, OrderRecord } from "../services/ordersApi";
import { useAuth } from "../context/AuthContext";

function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setOrders(await getOrders());
    } catch {
      setError("Nu s-au putut incarca comenzile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadOrders(); }, [loadOrders]);

  return <section>
    <h2>{user?.role === "admin" ? "Comenzi" : "Comenzile mele"}</h2>
    {error ? <div className="alert alert-danger" role="alert">{error}</div> : null}
    {loading ? <div className="spinner-border text-primary" role="status" /> : null}
    {!loading && !orders.length ? <div className="alert alert-secondary">Nu exista comenzi.</div> : null}
    <div className="row g-3">
      {orders.map((order) => <div className="col-12" key={order.orderId}>
        <article className="card shadow-sm"><div className="card-body">
          <div className="d-flex justify-content-between flex-wrap gap-2">
            <strong>{order.orderId}</strong><span>{new Date(order.createdAt).toLocaleString("ro-RO")}</span>
          </div>
          {user?.role === "admin" ? <p className="mb-2">{order.user.name} {order.user.surname} — {order.user.email}</p> : null}
          <ul className="mb-2">{order.items.map((item) => <li key={item.id}>{item.name} × {item.quantity}</li>)}</ul>
          <strong>Total: {order.totalPrice.toFixed(2)}</strong>
        </div></article>
      </div>)}
    </div>
  </section>;
}

export default OrdersPage;
