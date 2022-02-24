import React, { useState } from "react";
import {
  Typography,
  Box,
  FormLabel,
  LinearProgress,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Alert,
  CardActionArea,
  CardContent,
  Card,
} from "@mui/material";

import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { appdb } from "../utils/firebase-config";

export default function CustomerLocations(props) {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [openEditLocation, setOpenEditLocation] = useState(false);
  const [editCustLocation, setEditCustLocation] = useState({
    custid: "",
    custlocid: "",
    custaddr1: "",
    custaddr2: "",
    custcity: "",
    custpostcode: "",
    custstate: "",
  });

  const handleEditLocation = (e) => {
    setEditCustLocation({
      custid: props.customer,
      custlocid: props.location.id,
      custaddr1: props.location.custaddr1,
      custaddr2: props.location.custaddr2,
      custcity: props.location.custcity,
      custpostcode: props.location.custpostcode,
      custstate: props.location.custstate,
    });
    setOpenEditLocation(true);
  };

  const handleEditLocInputChange = (e) => {
    const { name, value } = e.target;
    setEditCustLocation({
      ...editCustLocation,
      [name]: value,
    });
  };

  const handleCustomerLocationUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateDoc(
        doc(
          appdb,
          "customer",
          editCustLocation.custid,
          "custloc",
          editCustLocation.custlocid
        ),
        {
          custaddr1: editCustLocation.custaddr1,
          custaddr2: editCustLocation.custaddr2,
          custcity: editCustLocation.custcity,
          custpostcode: editCustLocation.custpostcode,
          custstate: editCustLocation.custstate,
        }
      );
      setOpenEditLocation(false);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    setOpenEditLocation(false);
    //setEditCustomer({});
  };

  const handleDeleteLocation = async () => {
    setIsLoading(true);
    try {
      await deleteDoc(
        doc(appdb, "customer", props.customer, "custloc", props.location.id)
      );
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}

      <Card>
        <CardActionArea onClick={handleEditLocation}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Box sx={{ m: 0.5 }}>
                <FormLabel>
                  <Typography>Address 1: </Typography>
                </FormLabel>
              </Box>
              <Box>
                <Typography>{props.location.custaddr1}</Typography>
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
                  <Typography>Address 2: </Typography>
                </FormLabel>
              </Box>
              <Box>
                <Typography>{props.location.custaddr2}</Typography>
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
                  <Typography>City: </Typography>
                </FormLabel>
              </Box>
              <Box>
                <Typography>{props.location.custcity}</Typography>
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
                  <Typography>Postcode: </Typography>
                </FormLabel>
              </Box>
              <Box>
                <Typography>{props.location.custpostcode}</Typography>
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
                  <Typography>State: </Typography>
                </FormLabel>
              </Box>
              <Box>
                <Typography>{props.location.custstate}</Typography>
              </Box>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>

      <Dialog id="editcustomer" open={openEditLocation} onClose={handleClose}>
        <DialogTitle className="background">Edit Address</DialogTitle>
        {isLoading && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        )}
        <form onSubmit={handleCustomerLocationUpdate}>
          <DialogContent>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  required
                  id="custaddr1"
                  label="Address Line 1"
                  name="custaddr1"
                  value={editCustLocation.custaddr1}
                  onChange={handleEditLocInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  id="custaddr2"
                  label="Address Line 2"
                  name="custaddr2"
                  value={editCustLocation.custaddr2}
                  onChange={handleEditLocInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  required
                  id="custcity"
                  label="City"
                  name="custcity"
                  value={editCustLocation.custcity}
                  onChange={handleEditLocInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  id="custpostcode"
                  label="Postcode"
                  name="custpostcode"
                  value={editCustLocation.custpostcode}
                  onChange={handleEditLocInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  id="custstate"
                  label="State"
                  name="custstate"
                  value={editCustLocation.custstate}
                  onChange={handleEditLocInputChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="info">
              Update
            </Button>
            <Button onClick={handleDeleteLocation} color="error">
              Delete
            </Button>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
