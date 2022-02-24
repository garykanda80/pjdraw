import React from "react";

import { Container } from "@mui/material";
import { Navigate } from "react-router-dom";

import BgrImage from "../static/images/background.png";

import { useAuth } from "../contexts/AuthContext";
import ResetPassword from "../components/ResetPassword";

export default function ForgetPassword() {
  const { currentUser } = useAuth();

  return currentUser ? (
    <Navigate to="/" />
  ) : (
    <Container
      maxWidth={false}
      sx={{
        background:
          "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.418)),url(" +
          BgrImage +
          ")",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        margin: 0,
      }}
    >
      <ResetPassword />
    </Container>
  );
}
