import { FormEvent, useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Rating from "../components/Rating";
import {
  createProduct,
  getProductById,
  ProductPayload,
  updateProduct,
} from "../services/productsApi";
import { resolveImageUrl } from "../utils/images";

type FormMode = "create" | "view" | "edit";

interface ProductFormPageProps {
  mode: FormMode;
}

interface ProductFormState {
  image: string;
  name: string;
  price: string;
  rating: number;
}

function ProductFormPage({ mode }: ProductFormPageProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const productId = id ? Number(id) : null;

  const [form, setForm] = useState<ProductFormState>({
    image: "",
    name: "",
    price: "",
    rating: 0,
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const readOnly = mode === "view";

  const title = useMemo(() => {
    if (mode === "create") {
      return "Adauga produs";
    }

    if (mode === "edit") {
      return "Editare produs";
    }

    return "Vizualizare produs";
  }, [mode]);

  useEffect(() => {
    if (mode === "create") {
      setForm({ image: "", name: "", price: "", rating: 0 });
      setError("");
      setLoading(false);
      return;
    }

    if (!productId || Number.isNaN(productId)) {
      setError("Id produs invalid.");
      return;
    }

    loadProduct(productId);
  }, [mode, productId]);

  async function loadProduct(targetId: number): Promise<void> {
    setLoading(true);
    setError("");

    try {
      const product = await getProductById(targetId);
      setForm({
        image: product.image || "",
        name: product.name || "",
        price: product.price || "",
        rating: Number(product.rating) || 0,
      });
    } catch (err) {
      const axiosError = err as AxiosError;
      const status = axiosError.response?.status
        ? ` (status ${axiosError.response.status})`
        : "";
      setError(`Produsul nu a fost gasit${status}.`);
    } finally {
      setLoading(false);
    }
  }

  function updateField<K extends keyof ProductFormState>(
    field: K,
    value: ProductFormState[K],
  ): void {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function areAllFieldsEmpty(): boolean {
    return (
      !form.image && !form.name && !form.price && Number(form.rating) === 0
    );
  }

  function isFormInvalid(): boolean {
    return (
      form.name.trim().length < 2 ||
      !form.image.trim() ||
      !form.price.trim() ||
      form.rating < 0 ||
      form.rating > 5
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (readOnly) {
      return;
    }

    if (areAllFieldsEmpty()) {
      setError("Completeaza cel putin un camp inainte de trimitere.");
      return;
    }

    if (isFormInvalid()) {
      setError("Completeaza corect toate campurile obligatorii.");
      return;
    }

    setSubmitting(true);
    setError("");

    const payload: ProductPayload = {
      image: form.image.trim(),
      name: form.name.trim(),
      price: form.price.trim(),
      rating: Number(form.rating),
    };

    try {
      if (mode === "create") {
        const result = await createProduct(payload);
        navigate(`/products/${result.id}`);
        return;
      }

      if (!productId) {
        setError("Id produs invalid.");
        return;
      }

      await updateProduct(productId, payload);
      navigate(`/products/${productId}`);
    } catch {
      setError(
        mode === "create"
          ? "Nu s-a putut crea produsul."
          : "Nu s-a putut actualiza produsul.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleEnableEditMode(): void {
    if (!productId) {
      return;
    }

    navigate(`/products/${productId}/edit`);
  }

  return (
    <section className="card shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="mb-0">{title}</h2>
          <Link className="btn btn-outline-secondary" to="/products">
            Inapoi la produse
          </Link>
        </div>

        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-12">
              <label htmlFor="name" className="form-label">
                Nume produs
              </label>
              <input
                id="name"
                type="text"
                className="form-control"
                value={form.name}
                disabled={readOnly}
                onChange={(event) => updateField("name", event.target.value)}
              />
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="price" className="form-label">
                Pret
              </label>
              <input
                id="price"
                type="text"
                className="form-control"
                value={form.price}
                disabled={readOnly}
                onChange={(event) => updateField("price", event.target.value)}
              />
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="rating" className="form-label">
                Rating (0-5)
              </label>
              <div id="rating" className="pt-2">
                <Rating
                  value={form.rating}
                  readOnly={readOnly}
                  onChange={(star) => {
                    updateField("rating", star);
                  }}
                />
              </div>
              <small className="text-muted d-block mt-1">
                Valoare selectata: {form.rating || 0}/5
              </small>
            </div>

            <div className="col-12">
              <label htmlFor="image" className="form-label">
                URL imagine
              </label>
              <input
                id="image"
                type="text"
                className="form-control"
                value={form.image}
                disabled={readOnly}
                onChange={(event) => updateField("image", event.target.value)}
              />
            </div>

            {form.image ? (
              <div className="col-12">
                <div className="preview border rounded p-2 bg-light">
                  <img
                    src={resolveImageUrl(form.image)}
                    alt="Preview"
                    className="img-fluid rounded"
                  />
                </div>
              </div>
            ) : null}

            {mode === "view" ? (
              <div className="col-12 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleEnableEditMode}
                >
                  Editare
                </button>
              </div>
            ) : (
              <div className="col-12 d-flex justify-content-end gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting
                    ? "Se salveaza..."
                    : mode === "create"
                      ? "Creeaza produs"
                      : "Salveaza modificarile"}
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </section>
  );
}

export default ProductFormPage;