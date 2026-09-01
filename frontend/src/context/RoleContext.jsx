import React, { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export const ROLES = [
  { id: 1, name: 'Beekeeper', icon: 'warehouse', color: 'honey-gold' },
  { id: 2, name: 'Quality Lab', icon: 'flask-conical', color: 'status-success' },
  { id: 3, name: 'Processing Unit', icon: 'settings', color: 'honey-amber' },
  { id: 4, name: 'Packaging Unit', icon: 'package', color: 'comb-light' },
  { id: 5, name: 'Distributor', icon: 'truck', color: 'status-pending' },
  { id: 0, name: 'Admin', icon: 'shield', color: 'comb-brown' }
];

export const RoleProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState(null); // null means not logged in

  const login = (roleId, pin) => {
    // Dummy PIN check (accepts any PIN for demo)
    if (!pin) return false;
    const role = ROLES.find(r => r.id === roleId);
    if (role) {
      setActiveRole(role);
      return true;
    }
    return false;
  };

  const logout = () => {
    setActiveRole(null);
  };

  return (
    <RoleContext.Provider value={{ activeRole, setActiveRole, login, logout }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
