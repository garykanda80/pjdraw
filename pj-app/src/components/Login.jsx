import React from "react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";

import { VisibilityOff, Visibility, Person } from "@mui/icons-material";

import Logo from "../static/images/logo_x.png";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { login } = useAuth();

  async function handleSubmit(e) {
    console.log(process.env.REACT_APP_FIREBASE_API_KEY)
    e?.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(loginEmail, loginPassword);
      navigate(state.path || "/");
    } catch (error) {
      setError("Failed to login: " + error.message);
    }
    setLoading(false);
  }

  return (
    <Grid>
      <Paper
        elevation={10}
        sx={{ padding: 2, mr: "10px", ml: "10px", maxWidth: 300 }}
      >
        <Grid align="center">
          <Box
            component="img"
            sx={{
              height: 64,
            }}
            alt="Punjab Jeweller"
            src={Logo}
          />

          <Typography variant="subtitle1" gutterBottom component="div">
            Log In
          </Typography>
        </Grid>

        {error && <Alert severity="error">{error}</Alert>}

        <FormControl
          variant="outlined"
          margin="normal"
          fullWidth
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 5,
            },
          }}
        >
          <InputLabel htmlFor="outlined-adornment-email">Username</InputLabel>
          <OutlinedInput
            id="outlined-adornment-email"
            type="text"
            value={loginEmail}
            onChange={(event) => {
              setLoginEmail(event.target.value);
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="person" edge="end">
                  <Person />
                </IconButton>
              </InputAdornment>
            }
            label="Username"
          />
        </FormControl>
        <FormControl
          variant="outlined"
          margin="normal"
          fullWidth
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 5,
            },
          }}
        >
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            value={loginPassword}
            onChange={(event) => {
              setLoginPassword(event.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>

        <Button
          sx={{
            background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
            border: 0,
            borderRadius: 3,
            boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
            color: "white",
            height: 48,
            padding: "0 30px",
            mt: "25px",
          }}
          type="submit"
          color="primary"
          variant="contained"
          fullWidth
          disabled={loading}
          onClick={handleSubmit}
        >
          Sign in
        </Button>

        <Divider sx={{ padding: "5px" }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Typography sx={{ mt: "15px" }}>
            <Link to="/forgot-password">Forgot password?</Link>
          </Typography>          
        </Box>
      </Paper>
    </Grid>
  );
}
