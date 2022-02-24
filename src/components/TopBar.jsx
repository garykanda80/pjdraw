import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
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
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import HomeIcon from '@mui/icons-material/Home';
import { AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { headerTextState, userState } from "../store/atoms/appState";
import { auth } from "../utils/firebase-config";

import * as dbService from "../utils/firestore";

export default function TopBar() {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const openMenu = Boolean(menuAnchorEl);
  const openAccount = Boolean(accountAnchorEl);
  const setUser = useSetRecoilState(userState);

  const headerText = useRecoilValue(headerTextState);

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

  
  async function handleHomePage() {
      navigate("/");
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
  async function handleCustomer(){ 
    try {
      await dbService.handleCreateCustomer()
    } catch (error) {
      console.log("error adding customer" + error)
    }
  };

  
  useEffect(() => {
   
  }, []);


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
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="home"
            sx={{ mr: 2 }}
            onClick={handleCustomer}
          >
            <EmailIcon />
          </IconButton> */}
          
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="home"
            sx={{ mr: 2 }}
            onClick={handleHomePage}
          >
            <HomeIcon />
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
              to={"managecustomer"}
            >
              <ListItemIcon>
                <PeopleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Customers</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              to={"draw"}
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
