// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { useReducer } from "react";
import React from 'react';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAO4pFIqrG_xwJ2_XPjut1IPwjil1LAkck",
  authDomain: "fooddata-27337.firebaseapp.com",
  databaseURL: "https://fooddata-27337-default-rtdb.firebaseio.com",
  projectId: "fooddata-27337",
  storageBucket: "fooddata-27337.appspot.com",
  messagingSenderId: "109487157195",
  appId: "1:109487157195:web:83e75e39ee51debb7b904e"
};

// Check if Firebase app is already initialized
let app;
try {
  app = getApp();
} catch (e) {
  app = initializeApp(firebaseConfig);
}

// // Initialize Firebase database
// const database = getDatabase(app);

// const initialState = database;

// // Define the reducer function
// function databaseReducer(state, action) {
//   switch (action.type) {
//     case 'REGISTER_DATABASE':
//       return {
//         ...state,
//         items: [...state.items, action.payload],
//       };
//     case 'WRITE_ITEM':
//       return {
//         ...state,
//         items: state.items.filter((item) => item !== action.payload),
//       };
//     default:
//       return state;
//   }
// }

// // Create a context to provide the database and dispatch functions
// const DatabaseContext = React.createContext(initialState);

// // Custom hook to use the database and dispatch functions
// function useDatabase() {
//   return React.useContext(DatabaseContext);
// }

// // Database provider component
// function DatabaseProvider({ children }) {
//   const [database, dispatch] = useReducer(databaseReducer, initialState);

//   return (
//     <DatabaseContext.Provider value={{ database, dispatch }}>
//       {children}
//     </DatabaseContext.Provider>
//   );
// }

export { app };
