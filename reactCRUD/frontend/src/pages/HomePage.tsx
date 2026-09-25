import { Link } from "react-router-dom";

function HomePage() {
  return (
    <>
      <section className="p-4 p-md-5 mb-4 text-white text-center bg-dark">
        <img
          src="/assets/images/reactjs.jpg?id=1122"
          alt="Fashion"
          className="img-fluid rounded mb-4"
        />
      </section>

      <section className="p-4 p-md-5 mb-4 bg-white border rounded-3 shadow-sm">
        <h1 className="display-6 fw-bold mb-3">Aplicatie Produse Fashion</h1>
        <p className="lead text-secondary mb-4">
          Frontend cu: React + Vite conectat la backendul Node.js. Poti vedea,
          crea, edita si sterge produse din catalog.
        </p>
        <Link className="btn btn-primary btn-lg" to="/productsList">
          Mergi la produse
        </Link>
      </section>
    </>
  );
}

export default HomePage;