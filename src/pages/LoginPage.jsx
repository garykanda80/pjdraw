import React from "react";
import Login from "../components/Login";
import "../App.css";

import { Container } from "@mui/material";
import { Navigate } from "react-router-dom";

import BgrImage from "../static/images/background.png";

import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { currentUser } = useAuth();

  return currentUser ? (
    <Navigate to="/" />
  ) : (
    <Container
      sx={{
        background:
          "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.418)),url(" +
          BgrImage +
          ")",
        backgroundSize: "cover",
        backgroundPosition: "center",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        margin: 0,
        width: "100vw",
        height: "100vh",
        spacing: 0,
        justify: "space-around",
      }}
    >
      <Login />
    </Container>
  );
}
