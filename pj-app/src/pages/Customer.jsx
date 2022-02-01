import React, { useEffect, useState } from "react";
import {
  AccordionDetails,
  Link,
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
  customerState,
  monthState
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
import { useNavigate } from "react-router-dom";

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

export default function Customers() {
  const user = useRecoilValue(userDetailsState);
  const months = useRecoilValue(monthState);
  const setHeaderText = useSetRecoilState(headerTextState);
  const setCustomer = useSetRecoilState(customerState);
  const [customers, setDispCustomer ] = useRecoilState(customerSearchState);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  //const [setDispCustomer, customerSearchState] = useState();
  const navigate = useNavigate();

  // customerSearchState();
  // const handleChange = (panel) => (isExpanded) => {
  //   setExpanded(isExpanded ? panel : false);
  // };

// if (customers){
//   customerSearchState(customers)
// }

   //////////////////EDIT Customer/////////////

   const handleEditCustomer = (e) => {
      const customerId = e.currentTarget.dataset.custid
      console.log(customerId)
      setCustomer(customerId);
      navigate("/editcustomer");
  };

  const handleCustomerSearch = async (e) => {
    console.log("Hello2222-----")
    if ((e.target.value.toLowerCase()).length >= 10)
    {
      //console.log(e.target.value.toLowerCase())
    //   let custFilter = setPhoneNo.filter((prod) =>
    //   prod.id.toLowerCase().includes(e.target.value.toLowerCase())
    // );
    setIsLoading(true);
        const collectionRef = query(
          collection(appdb, "draw"),
          where("customerPhone", "==", e.target.value.toLowerCase())
        );
        await onSnapshot(collectionRef,(snapshot) => {
          setDispCustomer(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
            )        
        },
          (error) => {
            setError(error);
          }
        );
        setIsLoading(false);
    }
  };

   //load list of values for available user roles
   const [setPhoneNo, phoneNoState] = useState();
   useEffect(() => {

    const fetchPhone = async () => {
      setIsLoading(true);
        const collectionRef = collection(appdb, "phoneNumbers");
        const data = await onSnapshot(collectionRef,(snapshot) => {
          phoneNoState(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
        },
          (error) => {
            setError(error);
          }
        );
        setIsLoading(false);
        
        return data;        
    };
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
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Enter Phone No.."
              inputProps={{ "aria-label": "search" }}
              onChange={
               handleCustomerSearch
              }
            />
          </Search>
          
        </Grid>
        <Grid
          item
          xs={6}
          sm={6}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <IconButton disabled={isLoading} 
          //onClick={handleAddProduct}
          >
            <AddCircleOutlineIcon color="secondary" />
          </IconButton>
        </Grid>
      </Grid>
      {error && <Alert severity="error">{error}</Alert>}
      {isLoading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}

{customers &&
        customers.map((customer) => (
          <Card
            key={customer.id}
            sx={{
              mt: 0.5,
              "&:before": {
                display: "none",
              },
              borderBottom: "1px solid #dddddd",
              borderRadius: "20px",
              boxShadow: "none"
              //,...(product.prodstatus === "Dormant" && {background: "#eecaca",}
            }}
          >
            <CardActionArea
            data-custid={customer.id}
            onClick={handleEditCustomer}>
<CardContent>
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
                    sx={{ justifyContent: "flex-start" }}
                  >
<Typography>{customer.id}</Typography>
<Typography>{customer.customerId}</Typography>
                  </Grid>
                  </Grid>

                  </CardContent>
            </CardActionArea>
          </Card>
        )
        )}

             
    </>
  );
}