import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { getProducts, Product, ProductsResponse } from "../services/productsApi";
import { resolveImageUrl } from "../utils/images";
import Rating from "../components/Rating";
import { addToCart, getCartItems } from "../services/cartStorage";
import { useAuth } from "../context/AuthContext";


function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [perPage] = useState(4);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cartCount, setCartCount] = useState(() =>
    getCartItems().reduce((sum, item) => sum + item.quantity, 0),
  );
  const { user } = useAuth();


  const loadProducts = useCallback(async (targetPage: number): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const response: ProductsResponse = await getProducts(targetPage, perPage);
      setProducts(response.items);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (err) {
      const axiosError = err as AxiosError;
      const status = axiosError.response?.status
        ? ` (status ${axiosError.response.status})`
        : "";
      setError(`Nu s-au putut incarca produsele${status}. Verifica backendul.`);
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadProducts(page);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [page, loadProducts]);

  useEffect(() => {
    const handler = () => {
      setCartCount(getCartItems().reduce((sum, item) => sum + item.quantity, 0));
    };

    window.addEventListener("cart:updated", handler);
    return () => window.removeEventListener("cart:updated", handler);
  }, []);

  function previousPage() {
    if (page <= 0) {
      return;
    }

    setPage((prev) => prev - 1);
  }

  function nextPage() {
    if (page >= totalPages - 1) {
      return;
    }

    setPage((prev) => prev + 1);
  }

  function handleAddToCart(product: Product): void {
    addToCart(product);
    setCartCount((prev) => prev + 1);
  }

  return (
    <>
      <section className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="mb-0">Produse</h2>
          <small className="text-muted">Total: {total}</small>
        </div>
         {user?.role === "admin" ? (
        <Link className="btn btn-success" to="/products/new">
          Adauga produs!!
        </Link>
         ) : null}
      </section>

      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <>
          <div className="row g-3">
            {products.map((product) => (
              <div key={product.id} className="col-12 col-md-6 col-lg-3">
                <div className="card h-100 shadow-sm">
                  <img
                    src={resolveImageUrl(product.image)}
                    alt={product.name}
                    className="card-img-top product-image"
                  />

                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text mb-1">
                      <strong>Pret:</strong> {product.price}
                    </p>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <strong>Rating:</strong>
                      <Rating value={product.rating} readOnly />
                      <span className="small text-muted">
                        ({product.rating}/5)
                      </span>
                    </div>

                    <div className="mt-auto d-grid gap-2">
                      <Link className="btn btn-info" to={`/products/${product.id}`}>
                        Vezi produs
                      </Link>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAddToCart(product)}
                      >
                        Adauga in cos
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <small className="text-muted">Produse in cos: {cartCount}</small>
            <Link className="btn btn-outline-dark btn-sm" to="/veziCos">
              Vezi cosul
            </Link>
          </div>

          <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={page === 0}
              onClick={previousPage}
            >
              Anterior
            </button>
            <span>
              Pagina {page + 1} din {totalPages || 1}
            </span>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={page >= totalPages - 1}
              onClick={nextPage}
            >
              Urmator
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default ProductsListPage;
