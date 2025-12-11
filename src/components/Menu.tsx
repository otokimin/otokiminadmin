import React, { type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  House, BarChart, Megaphone, Gear,
  BoxArrowRight, People, List,
  ChatSquareText,
} from "react-bootstrap-icons";

interface MenuItem {
  name: string;
  path: string;
  icon: ReactNode;
}

interface SidebarProps {
  pathname: string;
  menuItems: MenuItem[];
  mobile?: boolean;
}

const Menu: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    window.location.href = "/admin";
  };

  const menuItems: MenuItem[] = [
    { name: "Dashboard", path: "/", icon: <House size={20} /> },
    { name: "Reklam Yönetimi", path: "/ads", icon: <Megaphone size={20} /> },
    { name: "Premium Yönetimi", path: "/premium", icon: <BarChart size={20} /> },
    { name: "Kullanıcı Yönetimi", path: "/user", icon: <People size={20} /> },
    { name: "Destek Talepleri", path: "/support", icon: <Gear size={20} /> },
        { name: "Avukata Sor", path: "/lawyerAsk", icon: <ChatSquareText size={20} /> },

  ];

  return (
    <>
      {/* === Mobile Hamburger === */}
      <div
        className="d-lg-none d-flex align-items-center px-3 py-2"
        style={{ position: "fixed", top: 10, left: 5, zIndex: 1050 }}
      >
        <button
          className="btn text-white"
          style={{ background: "#212529" }}
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileSidebar"
        >
          <List size={26} />
        </button>
      </div>

      {/* === Desktop Sidebar === */}
      <div
        className="d-none d-lg-flex flex-column p-3 text-white"
        style={{
          width: "260px",
          minWidth: "260px",
          flexShrink: 0,
          minHeight: "100vh",
          background: "#212529",
        }}
      >
        <SidebarLinks
          pathname={pathname}
          menuItems={menuItems}
          onLogout={handleLogout}
          navigate={navigate}
        />
      </div>

      {/* === Mobile Sidebar === */}
      <div
        className="offcanvas offcanvas-start text-white"
        id="mobileSidebar"
        tabIndex={-1}
        style={{ background: "#212529", width: "260px" }}
      >
        <SidebarLinks
          pathname={pathname}
          menuItems={menuItems}
          mobile
          onLogout={handleLogout}
          navigate={navigate}
        />
      </div>
    </>
  );
};

export default Menu;

// ============================= SIDEBAR =============================
const SidebarLinks: React.FC<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SidebarProps & { onLogout: () => void; navigate: any }
> = ({ pathname, menuItems, mobile, onLogout, navigate }) => {
  const dismissType = mobile ? ("offcanvas" as const) : undefined;

  const handleClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="text-center">
        <img src="/logo.png" width={160} />
      </div>

      <ul className="nav flex-column gap-2 px-2 mb-auto">
        {menuItems.map((item) => (
          <li key={item.path}>
            <div
              onClick={() => handleClick(item.path)}
              className="nav-link d-flex align-items-center gap-2"
              data-bs-dismiss={dismissType}
              style={{
                cursor: "pointer",
                background: pathname === item.path ? "#f7db23" : "transparent",
                color: pathname === item.path ? "#000" : "#fff",
                borderRadius: "8px",
                fontWeight: pathname === item.path ? "600" : "400",
              }}
            >
              {item.icon}
              {item.name}
            </div>
          </li>
        ))}
      </ul>
      <div className="text-center text-white-50 pb-3">
        <div className="d-flex align-items-center justify-content-center gap-2">
          <small>© 2026 Happencode<br/>Tüm hakları saklıdır.</small>
        </div>
      </div>


      <button
        type="button"
        className="btn btn-outline-light mx-2 mb-3 d-flex align-items-center gap-2 justify-content-center"
        data-bs-dismiss={dismissType}
        onClick={onLogout}
      >
        <BoxArrowRight size={18} />
        <span>Çıkış Yap</span>
      </button>
    </div>
  );
};
