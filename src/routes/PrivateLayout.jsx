// PrivateLayout.jsx
import NavBar from "../pages/NavBar";
import { Outlet } from "react-router-dom";

function PrivateLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default PrivateLayout;