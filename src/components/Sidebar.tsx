type Page = "dashboard" | "map" | "radio" | "information";

type SidebarProps = {
  activePage: Page;
  onNavigate: (page: Page) => void;
};

const navigationItems: {
  id: Page;
  label: string;
  icon: string;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: "⌂" },
  { id: "map", label: "Kaart", icon: "⌖" },
  { id: "radio", label: "Radiofrequenties", icon: "◉" },
  { id: "information", label: "Informatie", icon: "▤" },
];

function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <span>E</span>
        </div>

        <div className="brand-text">
          <strong>ENOLA</strong>
          <span>FIELD COMMAND</span>
        </div>
      </div>

      <div className="sidebar-section">
        <span className="sidebar-heading">HOOFDMENU</span>

        <nav className="navigation">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${
                activePage === item.id ? "active" : ""
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <span className="status-dot" />
        <div>
          <strong>SYSTEEM ACTIEF</strong>
          <span>ENOLA CORE</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
