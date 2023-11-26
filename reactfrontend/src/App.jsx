import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Kasir from "./pages/Kasir";
import Menu from "./pages/Menu";
import Pelanggan from "./pages/Pelanggan";
import Login from "./pages/auth/Login";
import Bayar from "./pages/Bayar";
import Struk from "./pages/Struk";
import StrukView from "./pages/StrukView";

function App() {
  const [count, setCount] = useState(0);
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("berhasil Logout");
    window.location.reload();
    navigate("/");
  };

  return (
    <>
      <Navbar>
        <NavbarBrand>
          <p className="font-bold text-inherit">ACME</p>
        </NavbarBrand>
        <NavbarContent className="sm:flex gap-4" justify="center">
          {isLoggedIn ? (
            <>
              <NavbarItem>
                <Link href="/pelanggan" aria-current="page">
                  Pelanggan
                </Link>
              </NavbarItem>

              <NavbarItem isActive>
                <Link href="/menu" aria-current="page">
                  Menu
                </Link>
              </NavbarItem>

              <NavbarItem>
                <Link href="/kasir" aria-current="page">
                  Kasir
                </Link>
              </NavbarItem>
            </>
          ) : (
            <NavbarItem isActive>
              <Link href="/menu" aria-current="page">
                Menu
              </Link>
            </NavbarItem>
          )}
        </NavbarContent>
        <NavbarContent justify="end">
          {isLoggedIn ? (
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                onClick={handleLogout}
                variant="flat"
              >
                Log Out
              </Button>
            </NavbarItem>
          ) : (
            <NavbarItem>
              <Button as={Link} color="primary" href="/login" variant="flat">
                Login
              </Button>
            </NavbarItem>
          )}
        </NavbarContent>
      </Navbar>

      <div className="w-full">
        <Routes>
          <Route path="/menu" element={<Menu />} />
          <Route path="/pelanggan" element={<Pelanggan />} />
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/kasir" element={<Kasir />} />
          <Route path="/bayar" element={<Bayar />} />
          <Route path="/struk" element={<Struk />} />
          <Route path="/strukview/:id" element={<StrukView />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
