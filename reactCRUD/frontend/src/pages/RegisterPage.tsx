import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authApi";
import { useAuth } from "../context/AuthContext";

interface RegisterFormState {
  name: string;
  surname: string;
  email: string;
  password: string;
  repeatPassword: string;
  photo: File | null;
}

interface RegisterPageProps {
  adminCreate?: boolean;
}

function RegisterPage({ adminCreate = false }: RegisterPageProps) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState<RegisterFormState>({
    name: "",
    surname: "",
    email: "",
    password: "",
    repeatPassword: "",
    photo: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");

  function updateField<K extends keyof RegisterFormState>(
    field: K,
    value: RegisterFormState[K],
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
      form.password.length < 6 ||
      !form.repeatPassword.trim() ||
      !form.photo
    );
  }

  useEffect(() => {
    if (!form.photo) {
      setPhotoPreview("");
      return;
    }

    const localPreviewUrl = URL.createObjectURL(form.photo);
    setPhotoPreview(localPreviewUrl);

    return () => {
      URL.revokeObjectURL(localPreviewUrl);
    };
  }, [form.photo]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (isFormInvalid()) {
      setError("Completeaza toate campurile corect.");
      return;
    }

    if (form.password !== form.repeatPassword) {
      setError("Parolele nu coincid.");
      return;
    }

    if (!form.photo) {
      setError("Poza este obligatorie.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await registerUser({
        name: form.name.trim(),
        surname: form.surname.trim(),
        email: form.email.trim(),
        password: form.password,
        repeatPassword: form.repeatPassword,
        photo: form.photo,
      });

      if (adminCreate) {
        navigate("/users", { replace: true });
      } else {
        login(response.token, response.user);
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu s-a putut crea contul.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="card shadow-sm  mx-auto mt-5" style={{ maxWidth: "800px" }}>
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="mb-0">{adminCreate ? "Adauga utilizator" : "Register"}</h2>
          <Link className="btn btn-outline-secondary" to={adminCreate ? "/users" : "/login"}>
            {adminCreate ? "Inapoi la utilizatori" : "Ai deja cont?"}
          </Link>
        </div>

        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : null}

        <form className="row g-3" onSubmit={handleSubmit} noValidate>
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

          

          <div className="col-12 col-md-6">
            <label htmlFor="password" className="form-label">
              Parola
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
            />
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="repeatPassword" className="form-label">
              Repeta parola
            </label>
            <input
              id="repeatPassword"
              type="password"
              className="form-control"
              value={form.repeatPassword}
              onChange={(event) => updateField("repeatPassword", event.target.value)}
            />
          </div>
          <div className="col-12 col-md-6">
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
          <div className="col-12 col-md-6">
            <label htmlFor="photo" className="form-label">
              Poza
            </label>
            <input
              id="photo"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="form-control"
              onChange={(event) =>
                updateField("photo", event.target.files?.[0] ?? null)
              }
            />
            <small className="text-muted d-block mt-1">Maxim 2MB.</small>
          </div>

          {photoPreview ? (
            <div className="col-12 col-md-6">
              <div className="preview border rounded p-2 bg-light">
                <img
                  src={photoPreview}
                  alt="Preview utilizator"
                  className="img-fluid rounded"
                />
              </div>
            </div>
          ) : null}

          <div className="col-12 d-flex justify-content-end gap-2">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Se creeaza contul..." : "Creeaza cont"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default RegisterPage;
