import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Container, Snackbar } from "@mui/material";
import TopBar from "../components/TopBar";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  headerTextState,
  userDetailsState,
  userState,
} from "../store/atoms/appState";

export default function AppLayout() {
  const user = useRecoilValue(userState);
  const setHeaderText = useSetRecoilState(headerTextState);
  const [errorMsg, setErrorMsg] = useState("");
  const [error, setError] = useState(false);

  const handleClose = () => {
    setError(false);
  };

  useEffect(() => {
    setHeaderText("Punjab Jewellers");


    if (user) {
      <Navigate to="/login" />;
    } else {
      console.log("error in app layout.jsx")      
    }
  }, [
    user,
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
