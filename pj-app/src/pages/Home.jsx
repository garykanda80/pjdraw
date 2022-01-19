import React, { useEffect } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";

import { headerTextState, userDetailsState } from "../store/atoms/appState";

import { Card, Grid, CardHeader, CardContent } from "@mui/material";

export default function Home() {
  const setHeaderText = useSetRecoilState(headerTextState);
  const userDetails = useRecoilValue(userDetailsState);

  useEffect(() => {
    setHeaderText("Welcome " + userDetails.usrfname);
  });

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: "300px" }}>
            <CardHeader title="Appointments"></CardHeader>
            <CardContent>Appointments</CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: "300px" }}>
            <CardHeader title="Expenses"></CardHeader>
            <CardContent>Expense Status</CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: "300px" }}>
            <CardHeader title="Sales"></CardHeader>
            <CardContent>My Sales</CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: "300px" }}>
            <CardHeader title="Profile"></CardHeader>
            <CardContent>My PRofile</CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
