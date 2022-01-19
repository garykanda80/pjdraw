import React, { useEffect } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";

import { headerTextState, userDetailsState } from "../store/atoms/appState";

import { Card, Grid, CardHeader, CardContent } from "@mui/material";

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
            <CardContent>Customer Details</CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: "300px" }}>
            <CardHeader title="Draws"></CardHeader>
            <CardContent>Draws Details</CardContent>
          </Card>
        </Grid>        
      </Grid>
    </>
  );
}
