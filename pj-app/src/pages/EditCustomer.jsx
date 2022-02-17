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
  customerState,
  draw_detail,
  selectedCustomerState
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
import PaymentMethod from "../components/PaymentType";
import PaymentDate from "../components/PaymentDate";

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
  const navigate = useNavigate();
  const user = useRecoilValue(userDetailsState);
  const months = useRecoilValue(monthState);
  const detail = useRecoilValue(draw_detail);
  const customer = useRecoilValue(selectedCustomerState);
  const setHeaderText = useSetRecoilState(headerTextState);
  const customerId = useRecoilValue(customerState);
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
const customerExists = Object.keys(customer).length === 0;


  const checkCustomer = () => {
    if (customerExists) {
      console.log('switching........');
      navigate("/customer");
    }else{
      console.log('not switching........'); 
    }
  };
  checkCustomer();
  
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
            }}
          >
            {/* <CardActionArea
            data-custid={customer.id}> */}
<CardContent>
  <Grid sx={{
    mt: 1.0,
    ml: 1.0,
    "&:before": {
      display: "none",
    },
  }
}>
    <Typography>Customer Phone: {customer.customerPhone}</Typography>
    <Typography>Customer Draw ID: {customer.customerId}</Typography>
    <Typography>Draw ID: {customer.id}</Typography>
</Grid>

<TableContainer component={Paper}
sx={{
    mt: 2.0,
    "&:before": {
      display: "none",
    },
  }
}
>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Draw Month</TableCell>
            <TableCell>Payment Type</TableCell>
            <TableCell>Payment Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {months.map((month, i) => (                     
            <TableRow key={month}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">{
              month              
              }
               
              </TableCell>
              {/* {console.log('++++++++++++' + payment[i])} */}
              <TableCell>
                <PaymentMethod method={!customerExists && customer.payment[i].paymentMethod}/>
              </TableCell>
              <TableCell>
                <PaymentDate date={!customerExists && customer.payment[i].paymentDate}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

</CardContent>
            {/* </CardActionArea> */}
          </Card>
      
    </>
  );
}
