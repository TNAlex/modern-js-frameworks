import { FormEvent, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../services/usersApi";
import { useAuth } from "../context/AuthContext";

interface UserFormState {
  name: string;
  surname: string;
  email: string;
  address?: string;
}

function UserFormPage() {
  const navigate = useNavigate();
  const { user: currentUser, updateCurrentUser } = useAuth();
  const { id } = useParams();
  const userId = id ? Number(id) : currentUser?.id ?? null;
  const isOwnProfile = !id;

  const [form, setForm] = useState<UserFormState>({
    name: "",
    surname: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

async function loadUser(targetId: number): Promise<void> {
    setLoading(true);
    setError("");

    try {
      const user = await getUserById(targetId);
      setForm({
        name: user.name || "",
        surname: user.surname || "",
        email: user.email || "",
        address: user.address || "",
      });
    } catch (err) {
      const axiosError = err as AxiosError;
      const status = axiosError.response?.status
        ? ` (status ${axiosError.response.status})`
        : "";
      setError(`Utilizatorul nu a fost gasit${status}.`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!userId || Number.isNaN(userId)) {
      setError("Id utilizator invalid.");
      return;
    }

    void loadUser(userId);
  }, [userId, setError]);

  function updateField<K extends keyof UserFormState>(
    field: K,
    value: UserFormState[K],
  ): void {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function isFormInvalid(): boolean {
    return (
      form.name.trim().length < 2 ||
      form.surname.trim().length < 2 ||
      !form.email.trim() ||
      (form.address || "").trim().length < 5
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!userId) {
      setError("Id utilizator invalid.");
      return;
    }

    if (isFormInvalid()) {
      setError("Completeaza corect toate campurile.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const updatedUser = await updateUser(userId, {
        name: form.name.trim(),
        surname: form.surname.trim(),
        email: form.email.trim(),
        address: (form.address || "").trim(),
      });
      if (isOwnProfile) {
        updateCurrentUser(updatedUser);
        navigate("/profile", { replace: true });
      } else {
        navigate("/users", { replace: true });
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const apiMessage = axiosError.response?.data?.message;
      setError(apiMessage || "Nu s-a putut actualiza utilizatorul.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="card shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="mb-0">{isOwnProfile ? "Profilul meu" : "Editare utilizator"}</h2>
          <Link className="btn btn-outline-secondary" to={isOwnProfile ? "/" : "/users"}>
            {isOwnProfile ? "Inapoi acasa" : "Inapoi la utilizatori"}
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
            <div className="col-12 col-md-6">
              <label htmlFor="name" className="form-label">
                Nume
              </label>
              <input
                id="name"
                type="text"
                className="form-control"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="surname" className="form-label">
                Prenume
              </label>
              <input
                id="surname"
                type="text"
                className="form-control"
                value={form.surname}
                onChange={(event) => updateField("surname", event.target.value)}
              />
            </div>

            <div className="col-12">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
            </div>

            <div className="col-12">
              <label htmlFor="address" className="form-label">
                Adresa de livrare
              </label>
              <input
                id="address"
                type="text"
                className="form-control"
                value={form.address}
                onChange={(event) => updateField("address", event.target.value)}
              />
            </div>

            <div className="col-12 d-flex justify-content-end">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Se salveaza..." : "Salveaza"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export default UserFormPage;
