import { useState } from "react";
import Sidebar from "./components/Sidebar";

type Page = "dashboard" | "map" | "radio" | "information";

const pageDetails: Record<
  Exclude<Page, "dashboard">,
  { title: string; description: string }
> = {
  map: {
    title: "Kaart & Navigatie",
    description: "Kaartmateriaal en geografische informatie.",
  },
  radio: {
    title: "Radiofrequenties",
    description: "Overzicht van radio-informatie en frequenties.",
  },
  information: {
    title: "Informatie",
    description: "Belangrijke informatie en praktische voorbereiding.",
  },
};

function App() {
  const [activePage, setActivePage] = useState<Page>("dashboard");

  const currentDate = new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="topbar-label">ENOLA / COMMAND</span>
            <span className="topbar-date">{currentDate}</span>
          </div>

          <div className="topbar-status">
            <span className="status-dot" />
            SYSTEEM ONLINE
          </div>
        </header>

        {activePage === "dashboard" ? (
          <Dashboard onNavigate={setActivePage} />
        ) : (
          <section className="page-content">
            <span className="section-label">ENOLA / MODULE</span>
            <h1>{pageDetails[activePage].title}</h1>
            <p>{pageDetails[activePage].description}</p>

            <div className="placeholder-panel">
              <span className="placeholder-icon">◈</span>
              <h2>MODULE IN ONTWIKKELING</h2>
              <p>
                Deze module wordt in een volgende fase verder opgebouwd.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

type DashboardProps = {
  onNavigate: (page: Page) => void;
};

function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <section className="dashboard">
      <div className="welcome-section">
        <div>
          <span className="section-label">ENOLA / OVERZICHT</span>
          <h1>Commandocentrum</h1>
          <p>
            Centraal overzicht van jouw informatie, navigatie en
            communicatiemiddelen.
          </p>
        </div>

        <div className="welcome-mark">E</div>
      </div>

      <div className="dashboard-heading">
        <h2>OPERATIONELE MODULES</h2>
        <span>03 MODULES</span>
      </div>

      <div className="module-grid">
        <ModuleCard
          number="01"
          icon="⌖"
          title="Kaart & Navigatie"
          description="Geografisch overzicht en kaartmateriaal van Nederland."
          status="IN OPBOUW"
          onClick={() => onNavigate("map")}
        />

        <ModuleCard
          number="02"
          icon="◉"
          title="Radiofrequenties"
          description="Radio-informatie en belangrijke communicatiekanalen."
          status="IN OPBOUW"
          onClick={() => onNavigate("radio")}
        />

        <ModuleCard
          number="03"
          icon="▤"
          title="Informatie"
          description="Belangrijke gegevens, voorbereiding en checklists."
          status="IN OPBOUW"
          onClick={() => onNavigate("information")}
        />
      </div>

      <div className="dashboard-bottom">
        <div className="info-panel">
          <span className="section-label">SYSTEEMINFORMATIE</span>
          <h2>ENOLA CORE</h2>
          <p>
            De basis van jouw persoonlijke informatie- en
            voorbereidingsplatform.
          </p>
          <div className="system-indicator">
            <span className="status-dot" />
            INTERFACE ACTIEF
          </div>
        </div>

        <div className="info-panel accent-panel">
          <span className="section-label">WERKGEBIED</span>
          <h2>NEDERLAND</h2>
          <p>
            ENOLA wordt ingericht voor gebruik in Nederland.
          </p>
          <span className="country-code">NL / 001</span>
        </div>
      </div>
    </section>
  );
}

type ModuleCardProps = {
  number: string;
  icon: string;
  title: string;
  description: string;
  status: string;
  onClick: () => void;
};

function ModuleCard({
  number,
  icon,
  title,
  description,
  status,
  onClick,
}: ModuleCardProps) {
  return (
    <button className="module-card" onClick={onClick}>
      <div className="module-card-top">
        <span className="module-number">{number} / MODULE</span>
        <span className="module-icon">{icon}</span>
      </div>

      <div className="module-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <div className="module-card-footer">
        <span>{status}</span>
        <span className="module-arrow">→</span>
      </div>
    </button>
  );
}

export default App;
