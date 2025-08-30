import { useState } from 'react';
import { Navbar, Offcanvas, Nav, Container } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Power } from 'react-bootstrap-icons';
import { useAuth } from "@/hooks/useAuth"; 
import { TeamOnLogo } from '@/components/Logo';
import { ROUTES } from "@/utils/constants";

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
  const { usuario, logout } = useAuth();
  

  const handleLogout = async () => {
    await logout();  
    navigate("/login", { replace: true }); 
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Menus dinámicos
  // const adminItems = [
  //   { label: "Usuarios", icon: "bi-1-circle", link: "/admin/usuarios" },
  //   { label: "HVoluntarias", icon: "bi-2-circle", link: "/admin/hvoluntarias" }
  // ];

  // const furriItems = [
  //   { label: "Nocturnos", icon: "bi-1-circle", link: "/furri/nocturnos" },
  //   { label: "Pidevacas", icon: "bi-2-circle", link: "/furri/pidevacas" }
  // ];

  // const superItems = [
  //   { label: "Escalonada", icon: "bi-1-circle", link: "/super/escalonada" },
  //   { label: "Sectores", icon: "bi-2-circle", link: "/super/sectores" }
  // ];
  
  return (
    <>
      <Navbar className="text-dark p-2 mb-3 shadow px-3" bg="dark" data-bs-theme="dark">
        <Container fluid className="d-flex align-items-center">
          <Navbar.Brand onClick={handleShow} className="d-flex gap-3 align-items-center" role="button">
            <div className="d-flex flex-column">
              <TeamOnLogo className="fs-3"/>
              <div className="fs-05 text-center text-muted">abrir menu</div>
            </div>
            <div className="d-flex flex-column">
              <span className="text-white">teamOn!</span>
              <span className="text-white-50 fs-07">{usuario?.apodo}</span>
            </div>
          </Navbar.Brand>
            <Power className="text-white fs-1" onClick={handleLogout} role="button"/>
        </Container>
      </Navbar>
      
      <Navbar.Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton className="mi-navbar text-white"> 
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
            <NavBarItem icon="bi-card-list" label="PubliCambios/P6" to={ROUTES.USUARIO_PUBLICAMBIOS} onClose={handleClose} />
            <NavBarItem icon="bi-calendar3" label="TuTurnero" to={ROUTES.USUARIO_TUTURNERO} onClose={handleClose} />
            {/* <NavBarItem icon="bi-4-circle" label="Pidevacas" to={ROUTES.USUARIO_PIDEVACAS} onClose={handleClose} />  */}
            {/* 
            <NavBarItem icon="bi-3-circle" label="Nocturnos" to="/user/nocturnos" onClose={handleClose} />

            {usuario?.rol?.includes("admin") && (
              <NavBarSubMenu icon="bi-mortarboard-fill" label="Admin" items={adminItems} onClose={handleClose} />
            )}

            
            {usuario?.rol?.includes("super") && (
              <NavBarSubMenu icon="bi-cup-hot-fill" label="Super" items={superItems} onClose={handleClose} />
              )}
              */}
            {/* {usuario?.rol?.includes("furri") && (
              <NavBarSubMenu icon="bi-android" label="Furri" items={furriItems} onClose={handleClose} />
            )} */}
          </Nav>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
    </>
  );
};

export default NavBar;