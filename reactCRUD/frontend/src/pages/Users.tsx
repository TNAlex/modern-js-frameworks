import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { resolveServerUrl } from "../config";
import { deleteUser, getUsers, UserItem } from "../services/usersApi";

function resolveUserPhoto(photo: string): string {
  if (!photo) {
    return "";
  }

  if (photo.startsWith("http://") || photo.startsWith("https://")) {
    return photo;
  }

  return resolveServerUrl(photo);
}

function formatDate(dateValue: string): string {
  if (!dateValue) {
    return "-";
  }

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return dateValue;
  }

  return parsed.toLocaleDateString("ro-RO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function Users() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  const loadUsers = useCallback(async (): Promise<void> => {
    setUsersLoading(true);
    setUsersError("");

    try {
      const items = await getUsers();
      setUsers(items);
    } catch (err) {
      const axiosError = err as AxiosError;
      const status = axiosError.response?.status
        ? ` (status ${axiosError.response.status})`
        : "";
      setUsersError(`Nu s-au putut incarca utilizatorii${status}.`);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadUsers]);

  async function handleDeleteUser(user: UserItem): Promise<void> {
    const shouldDelete = window.confirm(
      `Sigur doresti sa stergi utilizatorul "${user.name} ${user.surname}"?`,
    );
    if (!shouldDelete) {
      return;
    }

    setDeletingUserId(user.id);

    try {
      await deleteUser(user.id);
      await loadUsers();
    } catch {
      setUsersError("Nu s-a putut sterge utilizatorul.");
    } finally {
      setDeletingUserId(null);
    }
  }

  return (
    <>
      <section className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="mb-0">Utilizatori</h2>
          <small className="text-muted">Total: {users.length}</small>
        </div>
        <Link className="btn btn-success" to="/users/new">Adauga utilizator</Link>
      </section>

      {usersError ? (
        <div className="alert alert-danger" role="alert">
          {usersError}
        </div>
      ) : null}

      {usersLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="row g-3">
          {users.map((user) => (
            <div key={user.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                {user.photo ? (
                  <img
                    src={resolveUserPhoto(user.photo)}
                    alt={`${user.name} ${user.surname}`}
                    className="card-img-top product-image"
                    style={{ objectFit: "cover" }}
                  />
                ) : null}

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-1">
                    {user.name} {user.surname}
                  </h5>
                  <p className="mb-2 text-muted">{user.email}</p>
                  <p className="small mb-0">
                    <strong>Creat la:</strong> {formatDate(user.createdAt)}
                  </p>

                  <div className="mt-auto d-grid gap-2 pt-3">
                    <Link
                      className="btn btn-outline-warning btn-sm"
                      to={`/users/${user.id}/edit`}
                    >
                      Editare
                    </Link>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      disabled={deletingUserId === user.id}
                      onClick={() => handleDeleteUser(user)}
                    >
                      {deletingUserId === user.id ? "Se sterge..." : "Stergere"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {!users.length ? (
            <div className="col-12">
              <div className="alert alert-secondary mb-0" role="alert">
                Nu exista utilizatori inregistrati.
              </div>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}

export default Users;
