import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Alert,
  Button,
  Paper,
  MenuList,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import TourIcon from "@mui/icons-material/Tour";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

import { AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { headerTextState, userDetailsState } from "../store/atoms/appState";

export default function TopBar() {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const openMenu = Boolean(menuAnchorEl);
  const openAccount = Boolean(accountAnchorEl);

  const headerText = useRecoilValue(headerTextState);
  const userDetails = useRecoilValue(userDetailsState);

  const { logout } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogout() {
    setError("");
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      setError("Failed to logout: " + error.message);
    }
  }

  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleAccountClick = (event) => {
    setAccountAnchorEl(event.currentTarget);
  };
  const handleAccountClose = () => {
    setAccountAnchorEl(null);
  };

  return (
    <div>
      <AppBar>
        <Toolbar variant="dense" className="background">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            align="center"
            sx={{ flexGrow: 1 }}
          >
            {headerText}
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleAccountClick}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Paper sx={{ width: 320, maxWidth: "100%" }}>
        <Menu
          sx={{ width: 320, maxWidth: "100%" }}
          id="app-menu"
          anchorEl={menuAnchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuList>
            <MenuItem onClick={handleMenuClose} component={Link} to={"/"}>
              <ListItemIcon>
                <DashboardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Home</ListItemText>
            </MenuItem>
           
            <Divider />
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              to={"customers"}
            >
              <ListItemIcon>
                <PeopleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Customers</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              to={"products"}
            >
              <ListItemIcon>
                <CategoryIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Draws</ListItemText>
            </MenuItem>
           
          </MenuList>
        </Menu>
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}
      <Paper sx={{ width: 320, maxWidth: "100%" }}>
        <Menu
          sx={{ width: 320, maxWidth: "100%" }}
          id="act-menu"
          anchorEl={accountAnchorEl}
          open={openAccount}
          onClose={handleAccountClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuList>
            
            <MenuItem>
              <Button
                sx={{
                  background:
                    "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                  border: 0,
                  borderRadius: 3,
                  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
                  color: "white",
                  height: 30,
                  padding: "0 30px",
                }}
                variant="contained"
                fullWidth
                onClick={handleLogout}
              >
                Logout
              </Button>
            </MenuItem>
          </MenuList>
        </Menu>
      </Paper>
    </div>
  );
}
