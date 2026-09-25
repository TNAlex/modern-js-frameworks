import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="app-header shadow-sm">
      <nav className="navbar navbar-dark bg-primary py-3">
        <div className="container">
          <NavLink className="navbar-brand fw-bold" to="/">
            Fashion Catalog
          </NavLink>

          <ul className="navbar-nav flex-row gap-3 ms-auto">
            <li className="nav-item">
              <NavLink end className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/products">
                Produse
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;