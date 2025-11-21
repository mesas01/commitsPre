import { Button, Layout } from "@stellar/design-system";
import "./App.module.css";
import ConnectAccount from "./components/ConnectAccount.tsx";
import MobileMenu from "./components/MobileMenu.tsx";
import { Routes, Route, Outlet, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Mint from "./pages/Mint";
import CreateEvent from "./pages/CreateEvent";
import Profile from "./pages/Profile";

const AppLayout: React.FC = () => (
  <main className="min-h-screen flex flex-col bg-stellar-white">
    <div className="bg-stellar-white/95 backdrop-blur-sm shadow-md border-b-2 border-stellar-lilac/20">
      <Layout.Header
        projectId="SPOT"
        projectTitle="SPOT"
        contentRight={
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-nowrap justify-end w-full lg:w-auto">
          {/* Mint Button - Always visible */}
          <div className="flex-shrink-0">
            <NavLink to="/mint" className="no-underline">
              {({ isActive }) => (
                <Button
                  variant="primary"
                  size="sm"
                  className={`bg-stellar-gold text-stellar-black hover:bg-yellow-400 font-semibold ${isActive ? "opacity-75" : ""}`}
                >
                  ⚡
                  <span className="ml-1 hidden sm:inline">Mint</span>
                </Button>
              )}
            </NavLink>
          </div>
          {/* Profile Link - Always visible */}
          <div className="flex-shrink-0">
            <NavLink to="/profile" className="no-underline">
              {({ isActive }) => (
                <Button
                  variant="tertiary"
                  size="sm"
                  className={isActive ? "opacity-75" : ""}
                >
                  👤
                  <span className="ml-1 hidden sm:inline">Perfil</span>
                </Button>
              )}
            </NavLink>
          </div>
          {/* Desktop Navigation - Show from lg breakpoint (1024px) */}
          <nav className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <NavLink to="/" className="no-underline">
              {({ isActive }) => (
                <Button
                  variant="tertiary"
                  size="md"
                  className={isActive ? "opacity-50" : ""}
                >
                  Mis SPOTs
                </Button>
              )}
            </NavLink>
            <NavLink to="/create-event" className="no-underline">
              {({ isActive }) => (
                <Button
                  variant="tertiary"
                  size="md"
                  className={isActive ? "opacity-50" : ""}
                >
                  Crear Evento
                </Button>
              )}
            </NavLink>
          </nav>
          {/* Desktop Wallet - Show from lg breakpoint (1024px) */}
          <div className="hidden lg:block flex-shrink-0">
            <ConnectAccount />
          </div>
          {/* Mobile Menu - Hide from lg breakpoint */}
          <div className="lg:hidden flex-shrink-0">
            <MobileMenu />
          </div>
        </div>
      }
      />
    </div>
    <div className="flex-1">
      <Outlet />
    </div>
    <div className="bg-stellar-white/95 backdrop-blur-sm border-t-2 border-stellar-lilac/20 mt-auto py-4">
      <Layout.Footer>
        <span className="text-gray-600">
          © {new Date().getFullYear()} SPOT. Stellar Proof of Togetherness.
        </span>
      </Layout.Footer>
    </div>
  </main>
);

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/mint" element={<Mint />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
