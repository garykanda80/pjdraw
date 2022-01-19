import React, { useContext, useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  deleteUser,
} from "firebase/auth";
import { auth, appdb } from "../utils/firebase-config";
import { getDoc, doc } from "@firebase/firestore";

import { userDetailsState } from "../store/atoms/appState";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const setUserDetails = useSetRecoilState(userDetailsState);
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function removeUser(email) {
    return deleteUser(auth, email);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        getDoc(doc(appdb, "userrole", user.email)).then((response) => {
          setUserDetails(response.data());
        });
      }

      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, [setUserDetails]);

  const value = {
    currentUser,
    login,
    logout,
    signup,
    resetPassword,

    removeUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
