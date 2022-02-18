import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { headerTextState, userDetailsState } from "../store/atoms/appState";
import { Button, Card, Grid, CardHeader, CardContent } from "@mui/material";
import { appdb } from "../utils/firebase-config";
import {
  collection,
  getDocs,
} from "firebase/firestore";

export default function Home() {
  const user = useRecoilValue(userDetailsState);
  const setHeaderText = useSetRecoilState(headerTextState);
  // const setCustomerCount = useRecoilValue(customerCountState);
  const [setCustomerCount, customerCountState] = useState();
  const [setDrawCount, drawCountState] = useState();
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
        // data.forEach((doc) => {
        //   // doc.data() is never undefined for query doc snapshots
        //   //console.log(doc.id, " => ", doc.data());
        // });
        const count = data.docs.length
        //console.log(`Customer Record Count => ${count}`)
        customerCountState(count)
        setIsLoading(false);
        } catch (e) {     
        return 'error'
      }
    }

    const fetchDrawCount = async () => {
      const docRef = collection(appdb, "draw");
      try {
        const data = await getDocs(docRef);
        data.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
        });
        const count = data.docs.length
        console.log(`Customer Record Count => ${count}`)
        drawCountState(count)
        } catch (e) {     
        return 'error'
      }
    }

    fetchCustomerCount();
    fetchDrawCount();

  },[
    
  ]);

  const customerRoute = () =>{ 
    let path = `/customer`; 
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
          <Button onClick={customerRoute} variant = 'outlined'>Manage Customer</Button>
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
          <Button onClick={customerRoute} variant = 'outlined'>Manage Draw</Button>
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
