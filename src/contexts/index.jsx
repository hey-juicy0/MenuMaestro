import React, { useReducer } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  // The value of `databaseURL` depends on the location of the database
  // databaseURL: "https://menu-selector-7d306-default-rtdb.firebaseio.com/",
  databaseURL: "https://fooddata-27337-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Define the initial state for the database
const initialState = database;

// Define the reducer function
function databaseReducer(state, action) {
  switch (action.type) {
    case 'REGISTER_DATABASE':
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case 'WRITE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item !== action.payload),
      };
    default:
      return state;
  }
}

// Create a context to provide the database and dispatch functions
const DatabaseContext = React.createContext(initialState);

// Custom hook to use the database and dispatch functions
function useDatabase() {
  return React.useContext(DatabaseContext);
}

// Database provider component
function DatabaseProvider({ children }) {
  const [database, dispatch] = useReducer(databaseReducer, initialState);

  return (
    <DatabaseContext.Provider value={{ database, dispatch }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export { useDatabase, DatabaseProvider };