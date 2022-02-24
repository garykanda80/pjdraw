import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  editVisitState,
  headerTextState,
  productsState,
  timeSelectValueState,
  userDetailsState,
  usersState,
} from "../store/atoms/appState";

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Alert,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  OutlinedInput,
  Chip,
  Box,
  CardActions,
  Button,
  LinearProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import MobileDatePicker from "@mui/lab/MobileDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { format } from "date-fns";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { appdb } from "../utils/firebase-config";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function EditVisit() {
  const navigate = useNavigate();
  const [headerText, setHeaderText] = useRecoilState(headerTextState);
  const [editVisit, setEditVisit] = useRecoilState(editVisitState);
  const users = useRecoilValue(usersState);
  const user = useRecoilValue(userDetailsState);
  const timeSelectValue = useRecoilValue(timeSelectValueState);
  const products = useRecoilValue(productsState);

  const [visitLov, setVisitLov] = useState();

  const [canEditRec, setCanEditRec] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const handleAptChange = (e) => {
    const { name, value } = e.target;
    setEditVisit({
      ...editVisit,
      [name]: value,
    });
  };

  // capture the list of users added to the appointment
  const handleAddResChange = (event) => {
    const {
      target: { value },
    } = event;

    setEditVisit({
      ...editVisit,
      aptaddres: typeof value === "string" ? value.split(",") : value,
    });
  };

  // Capture the date of the appointment
  const handleDateChange = (newvalue) => {
    setEditVisit({
      ...editVisit,
      aptdate: newvalue,
    });
  };

  // capture the list of product added to the appointment
  const handleProdChange = (event) => {
    const {
      target: { value },
    } = event;

    setEditVisit({
      ...editVisit,
      aptprodlist: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleUpdateAppointment = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const appointmentRef = doc(appdb, "appointments", editVisit.id);

    try {
      await updateDoc(appointmentRef, {
        apttitle: editVisit.apttitle,
        apttype: editVisit.apttype,
        aptsrep: editVisit.aptsrep,
        aptdate: editVisit.aptdate,
        aptfromtime: editVisit.aptfromtime,
        apttotime: editVisit.apttotime,
        aptprodlist: editVisit.aptprodlist,
        aptdesc: editVisit.aptdesc,
        aptaddres: editVisit.aptaddres,
        aptstatus: editVisit.aptstatus,
        modifiedby: user.usremail,
        modifiedon: serverTimestamp(),
      });
      navigate(-1);
    } catch (error) {
      setError(error);
    }

    setIsLoading(false);
  };

  const handleDeleteAppointment = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const appointmentRef = doc(appdb, "appointments", editVisit.id);
    try {
      await deleteDoc(appointmentRef);
      navigate(-1);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setHeaderText("Edit Appointment");

    if (
      editVisit.aptstatus === "Completed" ||
      editVisit.aptstatus === "Cancelled" ||
      editVisit.aptstatus === "NoShow"
    ) {
      setCanEditRec(false);
    }

    const fetchVisitLov = async () => {
      const docRef = doc(appdb, "listofvalues", "visit");
      try {
        const response = await getDoc(docRef);
        setVisitLov(response.data());
      } catch (error) {
        setError(error);
      }
    };

    fetchVisitLov();

    return () => {
      //setEditVisit({});
    };
  }, [setHeaderText, editVisit.aptstatus]);

  return (
    <>
      <AppBar>
        <Toolbar variant="dense" className="background">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            align="center"
            sx={{ flexGrow: 1 }}
          >
            {headerText}
          </Typography>
        </Toolbar>
      </AppBar>

      {error && <Alert severity="error">{error}</Alert>}
      {isLoading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      {editVisit && (
        <form onSubmit={handleUpdateAppointment}>
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{ mt: 2 }}
          >
            <Grid item xs={12} sm={12} md={6}>
              <Grid container rowSpacing={1.5} columnSpacing={1}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    disabled={!canEditRec}
                    margin="dense"
                    size="small"
                    fullWidth
                    required
                    inputProps={{ maxLength: 50 }}
                    type="string"
                    id="apttitle"
                    name="apttitle"
                    label="Title"
                    value={editVisit.apttitle}
                    onChange={handleAptChange}
                  />
                </Grid>

                <Grid item xs={6} sm={6}>
                  {visitLov && (
                    <FormControl disabled={!canEditRec} fullWidth size="small">
                      <InputLabel>Type</InputLabel>
                      <Select
                        margin="dense"
                        required
                        id="apttype"
                        label="Type"
                        name="apttype"
                        value={editVisit.apttype}
                        onChange={handleAptChange}
                      >
                        {visitLov?.apttype?.map((val) => (
                          <MenuItem dense key={val} value={val}>
                            {val}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Grid>

                <Grid item xs={6} sm={6}>
                  <FormControl disabled={!canEditRec} fullWidth size="small">
                    <InputLabel>Sales Rep</InputLabel>
                    <Select
                      margin="dense"
                      id="aptsrep"
                      label="Sales Rep"
                      name="aptsrep"
                      value={editVisit.aptsrep}
                      onChange={handleAptChange}
                    >
                      {users.map((auser) => (
                        <MenuItem
                          dense
                          key={auser.usremail}
                          value={auser.usremail}
                        >
                          {auser.usrfname} {auser.usrlname}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Stack direction="row" spacing={1}>
                      <MobileDatePicker
                        disabled={!canEditRec}
                        label="Date"
                        inputFormat="dd/MM/yyyy"
                        value={format(
                          new Date(editVisit.aptdate.toDate()),
                          "MM/dd/yyyy"
                        )}
                        onChange={handleDateChange}
                        renderInput={(params) => (
                          <TextField fullWidth size="small" {...params} />
                        )}
                      />
                      <FormControl
                        disabled={!canEditRec}
                        fullWidth
                        size="small"
                      >
                        <InputLabel>From</InputLabel>
                        <Select
                          required
                          id="aptfromtime"
                          label="From"
                          name="aptfromtime"
                          value={editVisit.aptfromtime}
                          onChange={handleAptChange}
                        >
                          {timeSelectValue.map((timeval) => (
                            <MenuItem dense key={timeval} value={timeval}>
                              {timeval}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl
                        disabled={!canEditRec}
                        fullWidth
                        size="small"
                      >
                        <InputLabel>To</InputLabel>
                        <Select
                          required
                          id="apttotime"
                          label="To"
                          name="apttotime"
                          value={editVisit.apttotime}
                          onChange={handleAptChange}
                        >
                          {timeSelectValue.map((timeval) => (
                            <MenuItem dense key={timeval} value={timeval}>
                              {timeval}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <FormControl disabled={!canEditRec} fullWidth size="small">
                    <InputLabel>Products</InputLabel>
                    <Select
                      id="aptprodlist"
                      multiple
                      value={editVisit.aptprodlist}
                      onChange={handleProdChange}
                      input={<OutlinedInput label="Products" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {products.map((product) => {
                        if (product.prodstatus !== "Dormant") {
                          return (
                            <MenuItem
                              dense
                              key={product.prodname}
                              value={product.prodname}
                            >
                              {product.prodname}
                            </MenuItem>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={12} md={6}>
              <Grid container rowSpacing={1.5} columnSpacing={1}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    margin="dense"
                    size="small"
                    fullWidth
                    disabled
                    type="string"
                    id="aptcustname"
                    name="aptcustname"
                    label="Customer"
                    value={editVisit.aptcustname}
                  />
                </Grid>

                <Grid item xs={6} sm={6}>
                  <TextField
                    margin="dense"
                    size="small"
                    fullWidth
                    disabled
                    type="string"
                    id="aptcustcont"
                    name="aptcustcont"
                    label="Contact"
                    value={editVisit.aptcustcont}
                  />
                </Grid>

                <Grid item xs={6} sm={6}>
                  <TextField
                    margin="dense"
                    size="small"
                    fullWidth
                    disabled
                    type="string"
                    id="aptcustloc"
                    name="aptcustloc"
                    label="Location"
                    value={editVisit.aptcustloc}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                disabled={!canEditRec}
                margin="dense"
                size="small"
                fullWidth
                multiline
                rows={5}
                type="string"
                id="aptdesc"
                name="aptdesc"
                label="Description"
                value={editVisit.aptdesc}
                onChange={handleAptChange}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6}>
              <FormControl disabled={!canEditRec} fullWidth size="small">
                <InputLabel>Resource</InputLabel>
                <Select
                  id="aptaddres"
                  multiple
                  value={editVisit.aptaddres}
                  onChange={handleAddResChange}
                  input={<OutlinedInput label="Resources" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {users.map((adduser) => (
                    <MenuItem
                      dense
                      key={adduser.usremail}
                      value={adduser.usremail}
                    >
                      {adduser.usrfname} {adduser.usrlname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              {visitLov && (
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    margin="dense"
                    required
                    id="aptstatus"
                    label="Status"
                    name="aptstatus"
                    value={editVisit.aptstatus}
                    onChange={handleAptChange}
                  >
                    {visitLov?.aptstatus?.map((val) => (
                      <MenuItem dense key={val} value={val}>
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <CardActions>
                <Button
                  disabled={isLoading || editVisit.aptstatus === "Completed"}
                  type="submit"
                  color="info"
                >
                  Update
                </Button>
                <Button
                  disabled={isLoading}
                  color="error"
                  onClick={handleDeleteAppointment}
                >
                  Delete
                </Button>
                <Button
                  disabled={isLoading}
                  color="secondary"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
              </CardActions>
            </Grid>
          </Grid>
        </form>
      )}
    </>
  );
}
