import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Container, Snackbar } from "@mui/material";
import TopBar from "../components/TopBar";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  headerTextState,
  userDetailsState,
  usersState,
} from "../store/atoms/appState";

export default function AppLayout() {
  const user = useRecoilValue(userDetailsState);
  const setHeaderText = useSetRecoilState(headerTextState);
  const setUsers = useSetRecoilState(usersState);
  const [errorMsg, setErrorMsg] = useState("");
  const [error, setError] = useState(false);

  const handleClose = () => {
    setError(false);
  };

  useEffect(() => {
    setHeaderText("Punjab Jewellers");

    // const fetchCustomers = async () => {
    //   // const q = query(
    //   //   collection(appdb, "customer"),
    //   //   where("subsid", "==", user.subsid),
    //   //   orderBy("custname")
    //   // );
    //   const q = query(
    //       collection(appdb, "customer")
    //     );
    //     console.log(q);
    //   try {
    //     const unsubscribe = onSnapshot(q, (snapshot) => {
         
    //       setCustomers(
    //         snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    //       );
    //     });
    //     console.log(unsubscribe);
    //     return unsubscribe;
    //   } catch (error) {
    //     setErrorMsg(error);
    //     setError(true);
    //   }
    // };

    // const fetchProducts = async () => {
    //   const q = query(
    //     collection(appdb, "product"),
    //     where("subsid", "==", user.subsid),
    //     orderBy("prodname")
    //   );
    //   try {
    //     const unsubscribe = onSnapshot(q, (snapshot) => {
    //       setProducts(
    //         snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    //       );
    //     });
    //     return unsubscribe;
    //   } catch (error) {
    //     setError(error);
    //   }
    // };

    // const fetchUsers = async () => {
    //   const q = query(
    //     collection(appdb, "userrole"),
    //     where("subsid", "==", user.subsid),
    //     orderBy("usrfname")
    //   );
    //   try {
    //     const unsubscribe = onSnapshot(q, (snapshot) => {
    //       setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    //     });
    //     return unsubscribe;
    //   } catch (error) {
    //     setError(error);
    //   }
    // };

    // const fetchAppointments = async () => {
    //   const q = query(
    //     collection(appdb, "appointments"),
    //     where("subsid", "==", user.subsid),
    //     orderBy("aptdate")
    //   );
    //   try {
    //     const unsubscribe = onSnapshot(q, (snapshot) => {
    //       setAppointments(
    //         snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    //       );
    //     });
    //     return unsubscribe;
    //   } catch (error) {
    //     setError(error);
    //   }
    // };

    if (Object.keys(user).length === 0) {
      <Navigate to="/login" />;
    } else {
      console.log("error in app layout.jsx")
      // fetchCustomers();
      // fetchProducts();
      // fetchUsers();
      // fetchAppointments();
    }
  }, [
    // setCustomers,
    // setProducts,
    setUsers,
    // setHeaderText,
    // user,
    // setAppointments,
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
