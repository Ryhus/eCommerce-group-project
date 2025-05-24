import "./NotFound.scss";

function NotFoundPage() {
  return (
    <div className="error-page">
      <div className="error-content">
        <h1 className="error-code">404</h1>
        <p className="error-message">Page not found</p>
        <p className="error-description">The page you are looking for does not exist.</p>
        <button className="home-button" onClick={() => (window.location.href = "/")}>
          Go to homepage
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;
