import React, { useEffect, useState } from "react";
import {
  TableContainer,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Table,
  Paper,
  Alert,
  Card,
  Box,
  LinearProgress,
  Grid,
  TextField,
  CardContent,
  InputBase,
} from "@mui/material";

import { styled, alpha } from "@mui/material/styles";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import {
  userDetailsState,
  headerTextState,
  monthState,
  selectedCustomerState,
  manageDrawState
} from "../store/atoms/appState";

import { useNavigate } from "react-router-dom";
import PaymentMethod from "../components/PaymentType";
import PaymentDate from "../components/PaymentDate";

// const Search = styled("div")(({ theme }) => ({
//   position: "relative",
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: alpha(theme.palette.common.white, 0.15),
//   "&:hover": {
//     backgroundColor: alpha(theme.palette.common.white, 0.25),
//   },
//   marginLeft: 0,
//   marginTop: 2,
//   width: "100%",
//   [theme.breakpoints.up("sm")]: {
//     marginLeft: theme.spacing(1),
//     width: "auto",
//   },
// }));

// const SearchIconWrapper = styled("div")(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: "100%",
//   position: "absolute",
//   pointerEvents: "none",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: "inherit",
//   "& .MuiInputBase-input": {
//     padding: theme.spacing(1, 1, 1, 0),
//     // vertical padding + font size from searchIcon
//     paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//     transition: theme.transitions.create("width"),
//     width: "100%",
//     [theme.breakpoints.up("sm")]: {
//       width: "18ch",
//       "&:focus": {
//         width: "20ch",
//       },
//     },
//   },
// }));

export default function ManageDraw() {
  const navigate = useNavigate();
  const setHeaderText = useSetRecoilState(headerTextState);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const manageDraw = useRecoilValue(manageDrawState);
  
  console.log(manageDraw);
    const drawExists = Object.keys(manageDraw).length === 0;
  console.log(drawExists)
  
  useEffect(() => {
    setHeaderText("Manage Draw"); 
  
    
  const checkDraw = () => {
    if (drawExists) {
      console.log('switching........');
      navigate("/draw");
    }else{
      console.log('not switching........'); 
    }
  };
  
  checkDraw();
  

  }, [drawExists]);

  return (
    <>
     
      
    </>
  );
}
