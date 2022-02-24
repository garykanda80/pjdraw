import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useRecoilState, useRecoilValue } from "recoil";
import {
  customersState,
  headerTextState,
  productsState,
  userDetailsState,
  usersState,
  timeSelectValueState,
} from "../store/atoms/appState";

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Grid,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  OutlinedInput,
  Chip,
  CardActions,
  Alert,
  LinearProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import LocalizationProvider from "@mui/lab/LocalizationProvider";

import MobileDatePicker from "@mui/lab/MobileDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  serverTimestamp,
  addDoc,
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

export default function CreateVisits() {
  const [headerText, setHeaderText] = useRecoilState(headerTextState);
  const customers = useRecoilValue(customersState);
  const products = useRecoilValue(productsState);
  const users = useRecoilValue(usersState);
  const user = useRecoilValue(userDetailsState);

  const [error, setError] = useState("");
  const timeSelectValue = useRecoilValue(timeSelectValueState);

  const [custContacts, setCustContacts] = useState();
  const [custLocations, setCustLocations] = useState();

  const def_apt = {
    apttitle: "",
    apttype: "",
    aptdate: new Date(),
    aptfromtime: "",
    apttotime: "",
    aptcustname: "",
    aptcustemail: "",
    aptcustphone: "",
    aptcustcont: "",
    aptcustloc: "",
    aptsrep: "",
    aptprodlist: [],
    aptdesc: "",
    aptaddres: [],
    aptstatus: "",
    aptnotes: "",
    aptimg: [],
    aptgeotaglat: 0,
    aptgeotaglng: 0,
  };

  const [appointment, setAppointment] = useState(def_apt);

  const [visitLov, setVisitLov] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const currentDate = new Date();

  // capture the list of product added to the appointment
  const handleProdChange = (event) => {
    const {
      target: { value },
    } = event;

    setAppointment({
      ...appointment,
      aptprodlist: typeof value === "string" ? value.split(",") : value,
    });
  };

  // capture the list of users added to the appointment
  const handleAddResChange = (event) => {
    const {
      target: { value },
    } = event;

    setAppointment({
      ...appointment,
      aptaddres: typeof value === "string" ? value.split(",") : value,
    });
  };

  // Capture the date of the appointment
  const handleDateChange = (newvalue) => {
    setAppointment({
      ...appointment,
      aptdate: newvalue,
    });
  };

  // capture fields data for the appointment
  const handleAddAppointmentInputChange = (e) => {
    const { name, value } = e.target;
    setAppointment({
      ...appointment,
      [name]: value,
    });
  };

  //capture the customer contact, email and phone

  const handleCustContSelect = (e, id, val, email, phone) => {
    setAppointment({
      ...appointment,
      aptcustcont: val,
      aptcustemail: email,
      aptcustphone: phone,
    });
  };

  // cpatures the selected customer. Customer contacts and customer location are derived based
  // on selected customers
  const handleCustSelect = async (e, id, val, email, phone) => {
    //get the customer id
    // fetch all the customer contacts and location based on the customer id
    setAppointment({
      ...appointment,
      aptcustname: val,
      aptcustemail: email,
      aptcustphone: phone,
      aptcustcont: "",
      aptcustloc: "",
    });

    const docRefCont = collection(appdb, "customer", id, "custcont");
    const docRefLoc = collection(appdb, "customer", id, "custloc");

    try {
      const custconts = await getDocs(docRefCont);

      setCustContacts(
        custconts.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    } catch (error) {
      setError(error);
    }

    try {
      const custlocs = await getDocs(docRefLoc);
      setCustLocations(
        custlocs.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    } catch (error) {
      setError(error);
    }
  };

  // create an appointment
  const handleCreateAppointment = async (e) => {
    e.preventDefault();

    const new_apt = {
      subsid: user.subsid,
      subsname: user.subsname,
      apttitle: appointment.apttitle,
      apttype: appointment.apttype,
      aptdate: appointment.aptdate,
      aptfromtime: appointment.aptfromtime,
      apttotime: appointment.apttotime,
      aptcustname: appointment.aptcustname,
      aptcustemail: appointment.aptcustemail,
      aptcustphone: appointment.aptcustphone,
      aptcustcont: appointment.aptcustcont,
      aptcustloc: appointment.aptcustloc,
      aptsrep: appointment.aptsrep,
      aptprodlist: appointment.aptprodlist,
      aptdesc: appointment.aptdesc,
      aptaddres: appointment.aptaddres,
      aptstatus: "Scheduled",
      aptnotes: "",
      aptimg: [],
      aptgeotaglat: 0,
      aptgeotaglng: 0,
      createdby: user.usremail,
      createdon: serverTimestamp(),
      modifiedby: "",
      modifiedon: "",
    };
    setIsLoading(true);
    try {
      await addDoc(collection(appdb, "appointments"), new_apt);
      setAppointment(def_apt);
      navigate(-1);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  //load the list of values for appointment creation
  useEffect(() => {
    setHeaderText("Create New Appointment");

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
  }, [setHeaderText, setVisitLov, setError]);

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
      <form onSubmit={handleCreateAppointment}>
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
                  margin="dense"
                  size="small"
                  fullWidth
                  required
                  inputProps={{ maxLength: 50 }}
                  type="string"
                  id="apttitle"
                  name="apttitle"
                  label="Title"
                  value={appointment.apttitle}
                  onChange={handleAddAppointmentInputChange}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type</InputLabel>
                  <Select
                    margin="dense"
                    required
                    id="apttype"
                    label="Type"
                    name="apttype"
                    value={appointment.apttype}
                    onChange={handleAddAppointmentInputChange}
                  >
                    {visitLov.apttype?.map((val) => (
                      <MenuItem dense key={val} value={val}>
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sales Rep</InputLabel>
                  <Select
                    margin="dense"
                    id="aptsrep"
                    label="Sales Rep"
                    name="aptsrep"
                    value={appointment.aptsrep}
                    onChange={handleAddAppointmentInputChange}
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
                      label="Date"
                      inputFormat="dd/MM/yyyy"
                      minDate={currentDate}
                      value={appointment.aptdate}
                      onChange={handleDateChange}
                      renderInput={(params) => (
                        <TextField fullWidth size="small" {...params} />
                      )}
                    />
                    <FormControl fullWidth size="small">
                      <InputLabel>From</InputLabel>
                      <Select
                        required
                        id="aptfromtime"
                        label="From"
                        name="aptfromtime"
                        value={appointment.aptfromtime}
                        onChange={handleAddAppointmentInputChange}
                      >
                        {timeSelectValue.map((timeval) => (
                          <MenuItem dense key={timeval} value={timeval}>
                            {timeval}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth size="small">
                      <InputLabel>To</InputLabel>
                      <Select
                        required
                        id="apttotime"
                        label="To"
                        name="apttotime"
                        value={appointment.apttotime}
                        onChange={handleAddAppointmentInputChange}
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
                <FormControl fullWidth size="small">
                  <InputLabel>Products</InputLabel>
                  <Select
                    id="aptprodlist"
                    multiple
                    value={appointment.aptprodlist}
                    onChange={handleProdChange}
                    input={<OutlinedInput label="Products" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
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
              <Grid item xs={6} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Customer</InputLabel>
                  <Select
                    margin="dense"
                    required
                    id="aptcustname"
                    label="Customer"
                    name="aptcustname"
                    value={appointment.aptcustname}
                  >
                    {customers?.map((customer) => {
                      if (customer.custstatus !== "Dormant") {
                        return (
                          <MenuItem
                            dense
                            key={customer.id}
                            value={customer.custname}
                            onClick={(event) =>
                              handleCustSelect(
                                event,
                                customer.id,
                                customer.custname,
                                customer.custemail,
                                customer.custphone1
                              )
                            }
                          >
                            {customer.custname}
                          </MenuItem>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={6}>
                {custContacts?.length !== 0 && (
                  <FormControl fullWidth size="small">
                    <InputLabel>Contact</InputLabel>
                    <Select
                      margin="dense"
                      id="aptcustcont"
                      label="Contact"
                      name="aptcustcont"
                      value={appointment.aptcustcont}
                    >
                      {custContacts?.map((custcont) => (
                        <MenuItem
                          dense
                          key={custcont.id}
                          value={custcont.custcontname}
                          onClick={(event) =>
                            handleCustContSelect(
                              event,
                              custcont.id,
                              custcont.custcontname,
                              custcont.custcontemail,
                              custcont.custcontphone1
                            )
                          }
                        >
                          {custcont.custcontname}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Grid>
              <Grid item xs={6} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Location</InputLabel>
                  <Select
                    margin="dense"
                    required
                    id="aptcustloc"
                    label="Location"
                    name="aptcustloc"
                    value={appointment.aptcustloc}
                    onChange={handleAddAppointmentInputChange}
                  >
                    {custLocations?.map((custloc) => (
                      <MenuItem dense key={custloc.id} value={custloc.custcity}>
                        {custloc.custcity}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              margin="dense"
              size="small"
              fullWidth
              multiline
              rows={5}
              type="string"
              id="aptdesc"
              name="aptdesc"
              label="Description"
              value={appointment.aptdesc}
              onChange={handleAddAppointmentInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Resource</InputLabel>
              <Select
                id="aptaddres"
                multiple
                value={appointment.aptaddres}
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
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <CardActions>
              <Button disabled={isLoading} type="submit" color="info">
                Create
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
    </>
  );
}
