import React, { useState } from "react";
import { Button, Icon } from "@stellar/design-system";
import { NavLink } from "react-router-dom";
import ConnectAccount from "./ConnectAccount";
import { stellarNetwork } from "../contracts/util";
import FundAccountButton from "./FundAccountButton";
import UserInfo from "./UserInfo";

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button - visible only on mobile/tablet */}
      <Button
        variant="tertiary"
        size="md"
        onClick={toggleMenu}
        className="lg:hidden p-2"
        title="Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-md shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Menu</h2>
              <Button
                variant="tertiary"
                size="sm"
                onClick={closeMenu}
                className="p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>
            
            {/* User Info - Always visible */}
            <div className="p-4">
              <UserInfo />
            </div>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Debugger Link */}
            <NavLink
              to="/debug"
              className="no-underline"
              onClick={closeMenu}
            >
              {({ isActive }) => (
                <div
                  className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-50 hover:bg-purple-50 text-gray-700"
                  }`}
                >
                  <Icon.Code02 size="md" />
                  <span className="font-medium">Debugger</span>
                </div>
              )}
            </NavLink>

            {/* Wallet Section */}
            <div className="space-y-4 pt-4 border-t border-purple-100">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Wallet
              </h3>
              <div className="space-y-4">
                <ConnectAccount />
                {/* Fund Account Button - always visible in mobile menu */}
                {stellarNetwork !== "PUBLIC" && (
                  <div className="w-full">
                    <FundAccountButton />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;

