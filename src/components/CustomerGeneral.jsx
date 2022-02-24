import React from "react";
import { Typography, FormLabel, Box } from "@mui/material";

export default function CustomerGeneral(props) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Box sx={{ m: 0.5 }}>
          <FormLabel>
            <Typography>Type: </Typography>
          </FormLabel>
        </Box>
        <Box>
          <Typography>{props.customer.custtype}</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Box sx={{ m: 0.5 }}>
          <FormLabel>
            <Typography>Email: </Typography>
          </FormLabel>
        </Box>
        <Box>
          <Typography>{props.customer.custemail}</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Box sx={{ m: 0.5 }}>
          <FormLabel>
            <Typography>Phone 1: </Typography>
          </FormLabel>
        </Box>
        <Box>
          <Typography>{props.customer.custphone1}</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Box sx={{ m: 0.5 }}>
          <FormLabel>
            <Typography>Phone 2: </Typography>
          </FormLabel>
        </Box>
        <Box>
          <Typography>{props.customer.custphone2}</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Box sx={{ m: 0.5 }}>
          <FormLabel>
            <Typography>Status: </Typography>
          </FormLabel>
        </Box>
        <Box>
          <Typography>{props.customer.custstatus}</Typography>
        </Box>
      </Box>
    </>
  );
}
