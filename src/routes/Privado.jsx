// PrivateLayout.jsx
import NavBar from "../pages/NavBar";
import { Outlet } from "react-router-dom";

export default function Privado() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
