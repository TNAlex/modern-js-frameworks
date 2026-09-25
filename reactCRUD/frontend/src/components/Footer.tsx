function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer mt-auto py-3">
      <div className="container d-flex flex-column flex-md-row justify-content-between gap-2 small text-muted">
        <span>Autor: Adrian Diaconitei</span>
        <span>
          Copyright © 2025 - {currentYear} Fashion Catalog. Toate drepturile
          rezervate.
        </span>
      </div>
    </footer>

  );
}

export default Footer;