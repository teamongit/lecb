import React, { useState } from 'react';
import { Navbar, Offcanvas, Nav, Container } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Power, List, CalendarWeek } from 'react-bootstrap-icons';
import { useAuth } from "../hooks/useAuth"; 
import { TeamOnLogo } from '../components/Logo';
import { ROUTES } from "../utils/constants";

const NavBarItem = ({ icon, label, to, onClose }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Nav.Link 
      as={Link} 
      to={to} 
      className={`d-flex align-items-center ${isActive ? "" : "text-dark"}`}
      onClick={onClose}
    >
      <span className={`fs-1 me-3 ${icon}`} /> {label}
    </Nav.Link>
  );
};

const NavBarSubMenu = ({ icon, label, items, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAnyChildActive = items.some(item => item.link === location.pathname);

  const toggleSubMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <Nav.Link
        as="span"
        className={`d-flex align-items-center ${isAnyChildActive ? "" : "text-dark"}`}
        onClick={toggleSubMenu}
        role="button"
      >
        <span className={`fs-1 me-3 ${icon}`} /> {label}
      </Nav.Link>
      {isOpen && (
        <div className="ms-3">
          {items.map((item, index) => (
            <NavBarItem
              key={index}
              icon={item.icon} 
              label={item.label}
              to={item.link}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </>
  );
};

const NavBar = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const { usuario, logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();  
    navigate("/login", { replace: true }); 
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Menus dinámicos
  const adminItems = [
    { label: "Usuarios", icon: "bi-1-circle", link: "/admin/usuarios" },
    { label: "HVoluntarias", icon: "bi-2-circle", link: "/admin/hvoluntarias" }
  ];

  const furriItems = [
    { label: "Nocturnos", icon: "bi-1-circle", link: "/furri/nocturnos" },
    { label: "Pidevacas", icon: "bi-2-circle", link: "/furri/pidevacas" }
  ];

  const superItems = [
    { label: "Escalonada", icon: "bi-1-circle", link: "/super/escalonada" },
    { label: "Sectores", icon: "bi-2-circle", link: "/super/sectores" }
  ];

  // const userLabel = `${usuario?.apodo || ''} ${usuario?.nucleo || ''} ${usuario?.equipo || ''}`.trim();
  const userLabel = usuario?.apodo;

  return (
    <>
      <Navbar className="text-dark p-2 mb-3 shadow px-3" bg="dark" data-bs-theme="dark">
        <Container fluid className="d-flex align-items-center">
          <Navbar.Brand onClick={handleShow} className="d-flex gap-3 align-items-center" role="button">
            {/* <List style={{fontSize:"2.8rem"}} /> */}
            <TeamOnLogo className="fs-3"/>
            <div className="d-flex flex-column">
              <span className="text-white">teamOn!</span>
              <span className="text-white-50 fs-07">{userLabel}</span>
            </div>
          </Navbar.Brand>
            <Power className="text-white fs-1" onClick={handleLogout} role="button"/>
        </Container>
      </Navbar>
      
      <Navbar.Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton className="bg-dark text-white"> 
          <Offcanvas.Title className="d-flex gap-3 align-items-center">
            <TeamOnLogo className="fs-3"/>
            <div className="d-flex flex-column">
              <span className="text-white">Menú</span>
              <span className="text-white-50 fs-07">teamOn!</span>
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
          
        <Offcanvas.Body>
          <Nav className="flex-column">
            <NavBarItem icon="bi-person-circle" label={usuario?.apodo || "Perfil"} to={ROUTES.USUARIO_PERFIL} onClose={handleClose} />
            <NavBarItem icon="bi-calendar-week" label="PubliCambios" to={ROUTES.USUARIO_PUBLICAMBIOS} onClose={handleClose} />
            {/* 
            <NavBarItem icon="bi-2-circle" label="Tuturnero" to="/user/tuturnero" onClose={handleClose} />
            <NavBarItem icon="bi-3-circle" label="Nocturnos" to="/user/nocturnos" onClose={handleClose} />
            <NavBarItem icon="bi-4-circle" label="Pidevacas" to="/user/pidevacas" onClose={handleClose} /> 

            {usuario?.rol?.includes("admin") && (
              <NavBarSubMenu icon="bi-mortarboard-fill" label="Admin" items={adminItems} onClose={handleClose} />
            )}

            {usuario?.rol?.includes("furri") && (
              <NavBarSubMenu icon="bi-android" label="Furri" items={furriItems} onClose={handleClose} />
            )}

            {usuario?.rol?.includes("super") && (
              <NavBarSubMenu icon="bi-cup-hot-fill" label="Super" items={superItems} onClose={handleClose} />
            )}
            */}
          </Nav>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
    </>
  );
};

export default React.memo(NavBar);