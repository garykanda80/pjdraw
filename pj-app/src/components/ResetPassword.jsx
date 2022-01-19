import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Grid,
  Paper,
  Box,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import { Person } from "@mui/icons-material";

import Logo from "../static/images/logo_x.png";
import { useAuth } from "../contexts/AuthContext";

export default function ResetPassword() {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e?.preventDefault();
    try {
      setError("");
      setLoading(true);
      await resetPassword(email);
      navigate("/login");
    } catch (error) {
      setError("Failed to rest password: " + error.message);
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
            alt="uKarya"
            src={Logo}
          />

          <Typography variant="subtitle1" gutterBottom component="div">
            Password Reset
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
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
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
          Reset Password
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
            <Link to="/login">Login</Link>
          </Typography>
          <Typography sx={{ mt: "15px" }}>
            <Link to="https://uxli.com">www.uxli.com</Link>
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
}
