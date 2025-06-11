import React, { useState } from 'react';
import { Navbar, Offcanvas, Nav, Container } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Power, CalendarWeek } from 'react-bootstrap-icons';
import { useAuth } from "../hooks/useAuth"; 
import TeamOnLogo from '../components/TeamOnLogo';

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
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  
  const [show, setShow] = useState(false);

  const handleLogout = async () => {
    await logout();  
    navigate("/login", { replace: true }); 
  };

  const handleDashboard = () => {
    navigate("/dashboard", { replace: true }); 
  }

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

  return (
    <>
      <Navbar 
        className="text-dark p-3 mb-3 shadow"
        bg="light" 
        style={{
          backgroundImage: "linear-gradient(135deg, #3a67b1 50%, white 50%)",
        }}        
        role="button">
        <Container fluid>
          <Navbar.Brand className="d-flex align-items-center" onClick={handleShow}>
            <TeamOnLogo color="white" className="me-3"/>
            <div className="d-flex flex-column">
              <span className="text-white fs-3">teamOn!</span>
              <span className="text-center" style={{ fontSize: "9px", color: "white" }}>Menú</span>
            </div>
          </Navbar.Brand>
          <div className="d-flex align-items-center flex-grow-1 position-relative">
            {/* Centrado del nombre */}
            <div className="d-flex flex-column text-center mx-auto">
              <span className="ms-auto fs-5" onClick={handleDashboard}>{userData?.apodo || "Cargando..."}</span>              
              <span style={{ fontSize: "9px" }}>Dashboard</span>
            </div>

            {/* Botón de salir al final con mínimo ancho */}
            <div className="position-absolute end-0 top-50 translate-middle-y d-flex flex-column align-items-center" style={{ minWidth: "auto" }}>
              <Power className="fs-1" onClick={handleLogout} />
              <span style={{ fontSize: "9px" }}>Salir</span>
            </div>
          </div>
        </Container>
      </Navbar>
      
      <Navbar.Offcanvas
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
        show={show}
        onHide={handleClose}
        placement="start"
      >
        <Offcanvas.Header 
          className="bg-light" 
          closeButton 
          style={{
            backgroundImage: "linear-gradient(135deg, #3a67b1 50%, white 50%)",
          }}>
          <Offcanvas.Title id="offcanvasNavbarLabel" className="text-white">
            Menú
          </Offcanvas.Title>
        </Offcanvas.Header>
          
        <Offcanvas.Body>
          <Nav className="flex-column">
            <NavBarItem icon="bi-person-circle" label={userData?.apodo || "Perfil"} to="/dashboard" onClose={handleClose} />
            <NavBarItem icon="bi-calendar-week" label="Publicambios" to="/user/publicambios" onClose={handleClose} />
            {/* 
            <NavBarItem icon="bi-2-circle" label="Tuturnero" to="/user/tuturnero" onClose={handleClose} />
            <NavBarItem icon="bi-3-circle" label="Nocturnos" to="/user/nocturnos" onClose={handleClose} />
            <NavBarItem icon="bi-4-circle" label="Pidevacas" to="/user/pidevacas" onClose={handleClose} /> 

            {userData?.rol?.includes("admin") && (
              <NavBarSubMenu icon="bi-mortarboard-fill" label="Admin" items={adminItems} onClose={handleClose} />
            )}

            {userData?.rol?.includes("furri") && (
              <NavBarSubMenu icon="bi-android" label="Furri" items={furriItems} onClose={handleClose} />
            )}

            {userData?.rol?.includes("super") && (
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