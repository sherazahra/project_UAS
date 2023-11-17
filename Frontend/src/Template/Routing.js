import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Menu from "../pages/Menu";
import Pelanggan from "../pages/Pelanggan";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

function Routing() {
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("berhasil Logout");
    window.location.reload();
  };
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-success">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              PENS PSDKU SM
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link active" to="/menu">
                    Menu
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/pelanggan">
                    Pelanggan
                  </Link>
                </li>
                {isLoggedIn ? (
                  <li className="nav-item">
                    <Link className="nav-link" onClick={handleLogout}>
                      Logout
                    </Link>
                  </li>
                ) : (
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/menu" element={<Menu />} />
          <Route path="/pelanggan" element={<Pelanggan />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Routing;
