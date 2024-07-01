// context/UsersContext.js

import { createContext, useState, useContext } from 'react';

const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <UsersContext.Provider value={{ users, setUsers, currentUser, setCurrentUser }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => useContext(UsersContext);