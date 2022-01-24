import React, { useEffect } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { headerTextState, userDetailsState } from "../store/atoms/appState";
import { Button, Card, Grid, CardHeader, CardContent } from "@mui/material";
import * as dbService from "../utils/firestore";

export default function Home() {
  const setHeaderText = useSetRecoilState(headerTextState);
  const userDetails = useRecoilValue(userDetailsState);

  useEffect(() => {
    setHeaderText("Punjab Jewellers");
  });

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: "300px" }}>
            <CardHeader title="Customer"></CardHeader>
            <CardContent>Total Active Customers: {
              async () => {
                  await dbService.handleCustomerCount();
                }
              }
            </CardContent>
            
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: "300px" }}>
            <CardHeader title="Draws"></CardHeader>
            <CardContent>Total Active Draws:</CardContent>
          </Card>
        </Grid>        
      </Grid>
    </>
  );
}
