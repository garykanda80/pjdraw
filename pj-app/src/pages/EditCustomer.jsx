import React, { useEffect, useState } from "react";
import {
  AccordionDetails,
  AccordionSummary,
  Accordion,
  MenuItem,
  TableContainer,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Table,
  rows,
  Paper,
  Label,
  Button,
  Alert,
  Card,
  Box,
  LinearProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  CardContent,
  CardActionArea,
  InputBase,
  IconButton,
} from "@mui/material";

import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  userDetailsState,
  headerTextState,
  customerSearchState,
  phoneNoState,
  monthState,
  customerState
} from "../store/atoms/appState";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  getDoc,
  serverTimestamp,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { appdb } from "../utils/firebase-config";
//import { Navigate } from "react-router-dom";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  marginTop: 2,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "18ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function EditCustomers() {
  const user = useRecoilValue(userDetailsState);
  const months = useRecoilValue(monthState);
  const setHeaderText = useSetRecoilState(headerTextState);
  const customerId = useRecoilValue(customerState);
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [setDispCustomer, customerSearchState] = useState();
  const [expanded, setExpanded] = useState(false);
  

  useEffect(() => {
    setHeaderText("Customer");
  }, []);

  return (
    <>
      <Grid
        container
        sx={{
          display: "flex",
          direction: "row",
          alignItems: "center",
        }}
      >
        <Grid
          item
          xs={6}
          sm={6}
          md={6}
          sx={{ justifyContent: "flex-start", alignItems: "center" }}
        >
          
        </Grid>
        
      </Grid>
      {error && <Alert severity="error">{error}</Alert>}
      {isLoading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}

      {
        console.log("Customer Id..." + customerId)
      }
    </>
  );
}
