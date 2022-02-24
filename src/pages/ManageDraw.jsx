import React, { useEffect, useState } from "react";
import CustomerDialog from "../components/CustomerDialog";
import SearchIcon from "@mui/icons-material/Search";
//import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { styled, alpha } from "@mui/material/styles";
import {
  TableContainer,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Table,
  Paper,
  Card,
  Box,
  Grid,
  TextField,
  CardContent,
  InputBase,
  Button
} from "@mui/material";
import {
  collection,
  //onSnapshot,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { appdb } from "../utils/firebase-config";
import produce from 'immer';
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  headerTextState,
  manageDrawState,
  newCustomerDraw
} from "../store/atoms/appState";
//import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
//import PaymentMethod from "../components/PaymentType";
//import PaymentDate from "../components/PaymentDate";
//import { FormControlUnstyledContext } from "@mui/material/node_modules/@mui/base";

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
  padding: theme.spacing(0, 0),
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
    paddingLeft: `calc(1em + ${theme.spacing(2)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "35ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));


export default function ManageDraw() {
  const navigate = useNavigate();
  const setHeaderText = useSetRecoilState(headerTextState);
  //const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addcustomer, setAddcustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState("");
  const [localCustomer, setLocalCustomer] = useState();
  const setManageDraw = useSetRecoilState(manageDrawState);
  const manageDraw = useRecoilValue(manageDrawState);
  const newCustDraw = useRecoilValue(newCustomerDraw);
  
  const drawExists = Object.keys(manageDraw).length === 0;
  
const handleAddCustomer = async (e) =>{
  // let maxId = 1;
  // const test = manageDraw.customer.length > 0
  // console.log(test);
  // if(test != undefined){
  //   maxId = Math.max.apply(Math, manageDraw.customer.map(function(o) { return o.id; })) + 1 
  // }


  let maxId = 0;
  const test = manageDraw.customer.length > 0
  console.log(test);
  if(test === undefined || !test){
    maxId = 1
  }else{
    maxId = Math.max.apply(Math, manageDraw.customer.map(function(o) { return o.id; })) + 1 
  }


  
          const id = `${maxId}`;
          console.log("next available id.....")
          console.log(id)
          const data = {
            customerId: `${newCustomer}-${id}`,
            customerDrawId: `${manageDraw.id}-${id}`,
            phone: newCustomer,
            id: id,
          }
          console.log(data);

          try {
            const collectionRef = collection(appdb, "draw");
            //await setDoc(doc(collectionRef, manageDraw.id), manageDraw);
            await updateDoc(doc(collectionRef, manageDraw.id), 
                produce(manageDraw, draft => {
                  draft.customerCount = id;
                  draft.customer.push(data);
                }
              )
            );
            const collectionRef1 = collection(appdb, "customerDraw");
            await setDoc(doc(collectionRef1, data.customerDrawId), 
            produce(
              newCustDraw, draft => {
                draft.customerId = data.customerId;
                draft.customerPhone = data.phone;
                draft.customerName = localCustomer.name
              }
            ));
            
          return setManageDraw(
            produce(manageDraw, draft => {
              draft.customerCount = id;
              draft.customer.push(data);
            }
          )
        );

          }
          catch (e) {
                console.error("Error updating document: ", e.message);
                return 0
          }

}  

const handleCustomerSearch = async (e) => {
  if ((e.target.value.toLowerCase()).length >= 10){
    console.log("finding customer")
    const customerId = e.target.value;
    try {
      const collectionRef = collection(appdb, "customer");
      const q = query(collectionRef, where("phone", "==", customerId));
      const docs = await getDocs(q);
      let allCities = docs;
      for(const doc of allCities.docs){
        setLocalCustomer(doc.data());
      }
      if (!docs.empty) {
        setAddcustomer(true)
        setNewCustomer(customerId)
         
      }
    }
    catch{
    }  
  }else{
    setAddcustomer(false) 
  }
}

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
  

  }, []);

  return (
    <>
     
      
{!drawExists && 
          <Card
            key={manageDraw.id}
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
                    lg={12}
                    sx={{ justifyContent: "flex-start" }}
                  >
         <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 2, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >        
      <>
<TextField
          id="standard-read-only-input"
          label="Draw ID"
          defaultValue={manageDraw.id}
          InputProps={{
            readOnly: true,
          }}
          variant="standard"
        />

<TextField
          id="standard-read-only-input"
          label="Draw Status"
          defaultValue={manageDraw.status}
          InputProps={{
            readOnly: true,
          }}
          variant="standard"
        />
        
<TextField
          id="standard-read-only-input"
          label="Created On"
          defaultValue={manageDraw.startedOn}
          InputProps={{
            readOnly: true,
          }}
          variant="standard"
        />
<TextField
  id="standard-read-only-input"
  label="Total Customer"
  value={manageDraw.customerCount}
  //value={manageDraw.customer.map((c) => ( c.customerCount))}
  InputProps={{
    readOnly: true,
  }}
  variant="standard"
/>
</>
    </Box>
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
            justifyContent: "flex-start",
          }}
        >
          {/* <IconButton disabled={isLoading} 
          //onClick={handleAddProduct}
          >
            <AddCircleOutlineIcon color="secondary" />
          </IconButton> */}

          <CustomerDialog></CustomerDialog>
        </Grid>

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
              placeholder="Enter customer phone..."
              inputProps={{ "aria-label": "search" }}
              onChange={
               handleCustomerSearch
              }
            />
          </Search>
         
        </Grid>
        { addcustomer &&
             <Button disabled={isLoading} 
             onClick={handleAddCustomer}
             >
               Add Customer
             </Button>
          }
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >


<TableContainer component={Paper}
sx={{
    mt: 2.0,
    "&:before": {
      display: "none",
    },
  }
}
>
      <Table sx={{ minWidth: 700 }} aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
          <TableCell>ID</TableCell>
            <TableCell>Customer Phone</TableCell>
            <TableCell>Customer Draw ID</TableCell>
            <TableCell>Customer ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {manageDraw.customer && manageDraw.customer.map((c) => (                     
            <TableRow key={c.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">{
              c.id              
              }
               
              </TableCell> 
              <TableCell component="th" scope="row">{
              c.phone              
              }
               
              </TableCell>              
              <TableCell>
              {c.customerDrawId}
              </TableCell>
              <TableCell>
              {c.customerId}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

          </Grid>
                  </CardContent>
        
          </Card>
  
      
        }
      
    </>
  );
}
