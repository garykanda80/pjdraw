import React, { useEffect, useState } from "react";
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
  Button
} from "@mui/material";
import produce from 'immer';

import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useRecoilState,  useSetRecoilState } from "recoil";
import {
  headerTextState,
  customerSearchState,
  customerState,
  selectedCustomerState,
  drawState
} from "../store/atoms/appState";
import {
  collection,
  onSnapshot,
  setDoc,
  doc,
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
  const setHeaderText = useSetRecoilState(headerTextState);
  const setCustomer = useSetRecoilState(customerState);
  const setSelectedCustomer = useSetRecoilState(selectedCustomerState);
  const [drawData, setDraw] = useRecoilState(drawState);
  const [customers, setDispCustomer ] = useRecoilState(customerSearchState);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
 const navigate = useNavigate();


   //////////////////EDIT Customer/////////////

  //  const handleEditCustomer = (e) => {
  //     const customerId = e.currentTarget.dataset.custid
  //     console.log(customerId)
  //     setCustomer(customerId);
  //      const selectedCustomer = customers.filter(customer => customer.id === customerId)[0];
  //     setSelectedCustomer(selectedCustomer);
  //     console.log(selectedCustomer);
  //     navigate("/editcustomer");
  // };

  const formatDate = () => {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [month, day, year].join('-');
}

  const handleAddDraw = async () => {
    //setIsLoading(true);
    const collectionRef = collection(appdb, "draw");
    console.log("+++++++++++++");
    console.log(drawData);
    const date = formatDate();
    const maxId = Math.max.apply(Math, drawData.map(function(o) { return o.drawId; }))
    console.log(maxId);
    const id = `draw-${maxId+1}`;
    console.log(id);
    const data = {
      customerCount:0,
      startedOn: date,
      status: "Open",
      drawId: maxId+1
    }
    await setDoc(doc(collectionRef, id), data);
    const data1 = {
      id:id,
      customerCount:0,
      startedOn: date,
      status: "Open",
      drawId: maxId+1
    }
    setDraw(
          produce(drawData, draft => {
        draft.push(data1);
      })
    )
    
    console.log(drawData);
    //  setIsLoading(false);  
  };

  const checkdraw = async () => {
    console.log("78789789798798798");
    console.log(drawData);
    if (drawData.length === 0) {
      console.log("draw exists");
     // setIsLoading(true);
        const collectionRef = collection(appdb, "draw");
        console.log("+++++++++++++");
        const data = await onSnapshot(collectionRef,(snapshot) => {
          setDraw(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
        });
       // setIsLoading(false);
        //console.log(drawData);
        return data; 
      }
  };
  checkdraw();

   useEffect(() => {

    setHeaderText("Customer");
    console.log("**************");
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
           <Grid
          item
          xs={6}
          sm={6}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <IconButton disabled={isLoading} 
          onClick={handleAddDraw}
          >
            <AddCircleOutlineIcon color="secondary" />
          </IconButton>
        </Grid>
          
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
        </Grid>
      </Grid>
      {error && <Alert severity="error">{error}</Alert>}
      {isLoading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}



      
{drawData &&
        drawData.map((d) => (
          <Card
            key={d.id}
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
            data-custid={d.id}
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
<Typography>{d.id}</Typography>
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
