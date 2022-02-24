import React, { useEffect, useState } from "react";
import CustomerDialog from "../components/CustomerDialog";
import {
  Alert,
  Card,
  Box,
  LinearProgress,
  Grid,
  Typography,
  CardContent,
  CardActionArea,
  InputBase,
  IconButton,
  TextField
} from "@mui/material";

import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useRecoilState,  useSetRecoilState } from "recoil";
import {
  headerTextState,
  customerSearchState,
  customerState,
  selectedCustomerState,
  allCustomerState
} from "../store/atoms/appState";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { appdb, auth } from "../utils/firebase-config";
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

export default function ManageCustomer() {
  // const user = useRecoilValue(userDetailsState);
  // const months = useRecoilValue(monthState);
  const setHeaderText = useSetRecoilState(headerTextState);
  const [allCustomers, setAllCustomer ] = useRecoilState(allCustomerState);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
 const navigate = useNavigate();

   //////////////////EDIT Customer/////////////

  
   const checkCustomer = async () => {
    if (allCustomers.length === 0) {     // setIsLoading(true);
      //setIsLoading(true);
      const collectionRef = query(
        collection(appdb, "customer")
      );
      await onSnapshot(collectionRef,(snapshot) => {
        setAllCustomer(
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
      //setIsLoading(false);
      }
  };
  checkCustomer();

  // const handleCustomerSearch = async (e) => {
  //   if ((e.target.value.toLowerCase()).length >= 10)
  //   {
  //   setIsLoading(true);
  //       const collectionRef = query(
  //         collection(appdb, "customerDraw"),
  //         where("customerPhone", "==", e.target.value.toLowerCase())
  //       );
  //       await onSnapshot(collectionRef,(snapshot) => {
  //         setDispCustomer(
  //             snapshot.docs.map((doc) => ({
  //               id: doc.id,
  //               ...doc.data(),
  //             }))
  //           )        
  //       },
  //         (error) => {
  //           setError(error);
  //         }
  //       );
  //       setIsLoading(false);
  //   }
  // };

   useEffect(() => {
    setHeaderText("Customers");
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
              placeholder="Search Customer.."
              inputProps={{ "aria-label": "search" }}
              // onChange={
              //  handleCustomerSearch
              // }
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
          {/* <IconButton disabled={isLoading} 
          //onClick={handleAddProduct}
          >
            <AddCircleOutlineIcon color="secondary" />
          </IconButton> */}

          <CustomerDialog></CustomerDialog>
        </Grid>
      </Grid>
      {error && <Alert severity="error">{error}</Alert>}
      {isLoading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}

{allCustomers &&
        allCustomers.map((customer) => (
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
            // onClick={handleEditCustomer}
            >
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
<Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '20ch' },
      }}
      noValidate
      autoComplete="off"
    >   
    <>
<TextField
          id="standard-read-only-input"
          label="Customer Name"
          defaultValue={customer.name}
          InputProps={{
            readOnly: true,
          }}
          variant="standard"
        />

<TextField
          id="standard-read-only-input"
          label="Phone"
          defaultValue={customer.id}
          InputProps={{
            readOnly: true,
          }}
          variant="standard"
        />
<TextField
          id="standard-read-only-input"
          label="Customer Address"
          defaultValue={customer.address}
          InputProps={{
            readOnly: true,
          }}
          variant="standard"
        />

        </>
    </ Box>

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
