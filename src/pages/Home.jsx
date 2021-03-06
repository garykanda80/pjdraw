import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import { headerTextState, userDetailsState, drawState } from "../store/atoms/appState";
import { Button, Card, Grid, CardHeader, CardContent, Box } from "@mui/material";
import { appdb } from "../utils/firebase-config";
import {
  collection,
  getDocs,
  onSnapshot
} from "firebase/firestore";

export default function Home() {
 
  const setHeaderText = useSetRecoilState(headerTextState);
  // const setCustomerCount = useRecoilValue(customerCountState);
  const [setCustomerCount, customerCountState] = useState();
  const [setDrawCount, drawCountState] = useState();
  const [draw, setDraw] = useRecoilState(drawState);
  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();


  //console.log("User State: "+ user);
  useEffect(() => {
    setHeaderText("Punjab Jewellers");


    const fetchCustomerCount = async () => {
      setIsLoading(true);
      const docRef = collection(appdb, "customer");
      try {
        const data = await getDocs(docRef);
        const count = data.docs.length
        customerCountState(count)
        setIsLoading(false);
        } catch (e) {     
        return 'error'
      }
    }
    const fetchDraw = async () => {
      setIsLoading(true);
        const collectionRef = collection(appdb, "draw");
        console.log("+++++++++++++");
        const data = await onSnapshot(collectionRef,(snapshot) => {
          setDraw(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
          drawCountState( snapshot.docs.length)
        },
          (error) => {
            console.log("+-+-+-+-+-+-+-++-+-+-+-+");
            console.log(error.message);
          }
        );
        setIsLoading(false);
        console.log(draw);
        return data;        
    };
    
    fetchCustomerCount();
    fetchDraw();

  },[
    
  ]);

  const customerRoute = () =>{ 
    let path = `/managecustomer`; 
    navigate(path);
  }

  const customerPaymentRoute = () =>{ 
    let path = `/customer`; 
    navigate(path);
  }

  const drawRoute = () =>{ 
    let path = `/draw`; 
    navigate(path);
  }
    
  return (
    <>
      <Grid container spacing={2}>
      <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: "300px" }}>
          <CardContent>
          <CardHeader title="Customer"></CardHeader>            
          <CardContent>
          <Box sx={{ width: "100%" }}>
                <Button onClick={customerPaymentRoute} variant = 'outlined'>Customer Payment</Button>
                </ Box>
                <Box sx={{ width: "100%", mt: "5%"}}>
                <Button onClick={customerRoute} variant = 'outlined'>Customer</Button>
                </ Box>
          </CardContent>
              <CardContent>Total Active Customers
                    <h1>
                      {setCustomerCount}  
                    </h1>
                </CardContent>
              </CardContent>
          </Card>
        </Grid> 
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: "300px" }}>
          <CardContent>
          <CardHeader title="Draws"></CardHeader>            
          <CardContent>
          <Button onClick={drawRoute} variant = 'outlined'>Manage Draw</Button>
          </CardContent>
              <CardContent>Total Active Draws: 
                  <h1>
                    {setDrawCount}  
                  </h1>
              </CardContent>
              </CardContent>
          </Card>
        </Grid> 
      </Grid>
    </>
  );
}
