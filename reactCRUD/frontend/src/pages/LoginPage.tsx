import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authApi";

interface LoginFormState {
  email: string;
  password: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof LoginFormState>(
    field: K,
    value: LoginFormState[K],
  ): void {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError("Completeaza emailul si parola.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await loginUser({
        email: form.email.trim(),
        password: form.password,
      });

      // console.log("Login response:", response.user);

      login(response.token, response.user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Date de login invalide.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="card shadow-sm   mx-auto mt-5" style={{ maxWidth: "800px" }}>
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="mb-0">Login</h2>
          <Link className="btn btn-outline-secondary" to="/register">
            Creeaza cont
          </Link>
        </div>

        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : null}

        <form className="row g-3" onSubmit={handleSubmit}>
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

          <div className="col-12 d-flex justify-content-end">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Se autentifica..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;
