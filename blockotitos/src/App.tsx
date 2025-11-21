import { Button, Icon, Layout } from "@stellar/design-system";
import "./App.module.css";
import ConnectAccount from "./components/ConnectAccount.tsx";
import MobileMenu from "./components/MobileMenu.tsx";
import UserInfo from "./components/UserInfo.tsx";
import { Routes, Route, Outlet, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Debugger from "./pages/Debugger.tsx";

const AppLayout: React.FC = () => (
  <main className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
    <Layout.Header
      projectId="POAP"
      projectTitle="POAP"
      className="bg-white/80 backdrop-blur-sm shadow-md border-b border-purple-100"
      contentRight={
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-nowrap justify-end w-full lg:w-auto">
          {/* User Info - Always visible, responsive sizing */}
          <div className="flex-1 lg:flex-none min-w-0 max-w-[200px] lg:max-w-none">
            <UserInfo />
          </div>
          {/* Desktop Navigation - Show from lg breakpoint (1024px) */}
          <nav className="hidden lg:block flex-shrink-0">
            <NavLink
              to="/debug"
              className="no-underline"
            >
              {({ isActive }) => (
                <Button
                  variant="tertiary"
                  size="md"
                  onClick={() => (window.location.href = "/debug")}
                  disabled={isActive}
                  className={isActive ? "opacity-50" : ""}
                >
                  <Icon.Code02 size="md" />
                  <span className="ml-2">Debugger</span>
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
    <div className="flex-1">
      <Outlet />
    </div>
    <Layout.Footer className="bg-white/80 backdrop-blur-sm border-t border-purple-100 mt-auto">
      <span className="text-gray-600">
        © {new Date().getFullYear()} POAP. Proof of Attendance Protocol on Stellar.
      </span>
    </Layout.Footer>
  </main>
);

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/debug" element={<Debugger />} />
        <Route path="/debug/:contractName" element={<Debugger />} />
      </Route>
    </Routes>
  );
}

export default App;
