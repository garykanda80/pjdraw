import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

import { Container, Snackbar } from "@mui/material";

import TopBar from "../components/TopBar";

import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  appointmentsState,
  customersState,
  headerTextState,
  productsState,
  userDetailsState,
  usersState,
} from "../store/atoms/appState";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { appdb } from "../utils/firebase-config";

export default function AppLayout() {
  const user = useRecoilValue(userDetailsState);
  const setHeaderText = useSetRecoilState(headerTextState);
  const setCustomers = useSetRecoilState(customersState);
  const setProducts = useSetRecoilState(productsState);
  const setUsers = useSetRecoilState(usersState);
  const setAppointments = useSetRecoilState(appointmentsState);
  const [errorMsg, setErrorMsg] = useState("");
  const [error, setError] = useState(false);

  const handleClose = () => {
    setError(false);
  };

  useEffect(() => {
    setHeaderText("Appointments");

    const fetchCustomers = async () => {
      const q = query(
        collection(appdb, "customer"),
        where("subsid", "==", user.subsid),
        orderBy("custname")
      );
      try {
        const unsubscribe = onSnapshot(q, (snapshot) => {
          setCustomers(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        });
        return unsubscribe;
      } catch (error) {
        setErrorMsg(error);
        setError(true);
      }
    };

    const fetchProducts = async () => {
      const q = query(
        collection(appdb, "product"),
        where("subsid", "==", user.subsid),
        orderBy("prodname")
      );
      try {
        const unsubscribe = onSnapshot(q, (snapshot) => {
          setProducts(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        });
        return unsubscribe;
      } catch (error) {
        setError(error);
      }
    };

    const fetchUsers = async () => {
      const q = query(
        collection(appdb, "userrole"),
        where("subsid", "==", user.subsid),
        orderBy("usrfname")
      );
      try {
        const unsubscribe = onSnapshot(q, (snapshot) => {
          setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });
        return unsubscribe;
      } catch (error) {
        setError(error);
      }
    };

    const fetchAppointments = async () => {
      const q = query(
        collection(appdb, "appointments"),
        where("subsid", "==", user.subsid),
        orderBy("aptdate")
      );
      try {
        const unsubscribe = onSnapshot(q, (snapshot) => {
          setAppointments(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        });
        return unsubscribe;
      } catch (error) {
        setError(error);
      }
    };

    if (Object.keys(user).length === 0) {
      <Navigate to="/login" />;
    } else {
      fetchCustomers();
      fetchProducts();
      fetchUsers();
      fetchAppointments();
    }
  }, [
    setCustomers,
    setProducts,
    setUsers,
    setHeaderText,
    user,
    setAppointments,
  ]);
  return (
    <>
      <Container>
        <TopBar></TopBar>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={error}
          onClose={handleClose}
          message={errorMsg}
        />

        <Outlet />
      </Container>
    </>
  );
}
