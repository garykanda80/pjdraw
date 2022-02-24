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
  CardContent,
  Card,
  CardActionArea,
} from "@mui/material";

import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { appdb } from "../utils/firebase-config";

export default function CustomerContacts(props) {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [openEditContact, setOpenEditContact] = useState(false);
  const [editCustContact, setEditCustContact] = useState({
    custid: "",
    custcontid: "",
    custcontname: "",
    custcontemail: "",
    custcontphone1: "",
    custcontphone2: "",
  });

  const handleEditContact = (e) => {
    setEditCustContact({
      custid: props.customer,
      custcontid: props.contact.id,
      custcontname: props.contact.custcontname,
      custcontemail: props.contact.custcontemail,
      custcontphone1: props.contact.custcontphone1,
      custcontphone2: props.contact.custcontphone2,
    });
    setOpenEditContact(true);
  };

  const handleEditContInputChange = (e) => {
    const { name, value } = e.target;
    setEditCustContact({
      ...editCustContact,
      [name]: value,
    });
  };

  const handleCustomerContactUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateDoc(
        doc(
          appdb,
          "customer",
          editCustContact.custid,
          "custcont",
          editCustContact.custcontid
        ),
        {
          custcontname: editCustContact.custcontname,
          custcontemail: editCustContact.custcontemail,
          custcontphone1: editCustContact.custcontphone1,
          custcontphone2: editCustContact.custcontphone2,
        }
      );
      setOpenEditContact(false);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    setOpenEditContact(false);
    //setEditCustomer({});
  };

  const handleDeleteContact = async () => {
    setIsLoading(true);
    try {
      await deleteDoc(
        doc(appdb, "customer", props.customer, "custcont", props.contact.id)
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
        <CardActionArea onClick={handleEditContact}>
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
                  <Typography>Name: </Typography>
                </FormLabel>
              </Box>
              <Box>
                <Typography>{props.contact.custcontname}</Typography>
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
                <Typography>{props.contact.custcontemail}</Typography>
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
                <Typography>{props.contact.custcontphone1}</Typography>
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
                <Typography>{props.contact.custcontphone2}</Typography>
              </Box>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>

      <Dialog id="editcustomer" open={openEditContact} onClose={handleClose}>
        <DialogTitle className="background">Edit Contact</DialogTitle>
        {isLoading && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        )}
        <form onSubmit={handleCustomerContactUpdate}>
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
                  id="custcontname"
                  label="Name"
                  name="custcontname"
                  value={editCustContact.custcontname}
                  onChange={handleEditContInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  required
                  id="custcontemail"
                  label="Email"
                  name="custcontemail"
                  value={editCustContact.custcontemail}
                  onChange={handleEditContInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  required
                  id="custcontphone1"
                  label="Phone1"
                  name="custcontphone1"
                  value={editCustContact.custcontphone1}
                  onChange={handleEditContInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  id="custcontphone2"
                  label="Phone2"
                  name="custcontphone2"
                  value={editCustContact.custcontphone2}
                  onChange={handleEditContInputChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="info">
              Update
            </Button>
            <Button onClick={handleDeleteContact} color="error">
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
