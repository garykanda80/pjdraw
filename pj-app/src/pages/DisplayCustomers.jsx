//import react and libraries
import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";

//import firebase
import {
  onSnapshot,
  collection,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  addDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

//import material ui
import {
  InputBase,
  Box,
  Button,
  LinearProgress,
  Alert,
  Card,
  CardHeader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  //AccordionActions,
  IconButton,
  Divider,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

//import customer app objects

import { appdb } from "../utils/firebase-config";
import {
  customersState,
  headerTextState,
  customerLOVState,
  userDetailsState,
} from "../store/atoms/appState";
import CustomerGeneral from "../components/CustomerGeneral";
import CustomerContacts from "../components/CustomerContacts";
import CustomerLocations from "../components/CustomerLocations";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  marginTop: 2,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function DisplayCustomers() {
  const setHeaderText = useSetRecoilState(headerTextState);
  const [customers, setCustomers] = useRecoilState(customersState);
  const [customerLov, setCustomerLov] = useRecoilState(customerLOVState);
  const userDetails = useRecoilValue(userDetailsState);
  const [customerContact, setCustomerContact] = useState([]);
  const [customerLocation, setCustomerLocation] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("default");
  const [dispCustomer, setDispCustomer] = useState(customers);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleCustomerSearch = (e) => {
    let custFilter = customers.filter((cust) =>
      cust.custname.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setDispCustomer(custFilter);
  };

  //Handle the accordian expand and collapse event
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    setSelectedCustomer(panel);
  };

  //EDIT CUSTOMER GENERAL ATTRIBUTES

  const [openEditCust, setOpenEditCust] = useState(false);
  const [editCustomer, setEditCustomer] = useState({
    custid: "",
    custtitle: "",
    custname: "",
    custtype: "",
    custemail: "",
    custphone1: "",
    custphone2: "",
    custstatus: "",
  });

  const handleEditCustomer = (e) => {
    setEditCustomer({});
    const cust_edit = {
      custid: e.currentTarget.dataset.custid,
      custtitle: e.currentTarget.dataset.custtitle,
      custname: e.currentTarget.dataset.custname,
      custtype: e.currentTarget.dataset.custtype,
      custemail: e.currentTarget.dataset.custemail,
      custphone1: e.currentTarget.dataset.custphone1,
      custphone2: e.currentTarget.dataset.custphone2,
      custstatus: e.currentTarget.dataset.custstatus,
    };

    setEditCustomer(cust_edit);
    setOpenEditCust(true);
  };

  const handleEditCustInputChange = (e) => {
    const { name, value } = e.target;
    setEditCustomer({
      ...editCustomer,
      [name]: value,
    });
  };

  const handleCustomerUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateDoc(doc(appdb, "customer", editCustomer.custid), {
        custtitle: editCustomer.custtitle,
        custname: editCustomer.custname,
        custtype: editCustomer.custtype,
        custemail: editCustomer.custemail,
        custphone1: editCustomer.custphone1,
        custphone2: editCustomer.custphone2,
        custstatus: editCustomer.custstatus,
        modifiedby: userDetails.usremail,
        modifiedon: serverTimestamp(),
      });
      setOpenEditCust(false);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  //ADD NEW CONTACT to EXISTING CUSTOMER
  const [addContact, setAddContact] = useState({
    custid: "",
    custcontname: "",
    custcontemail: "",
    custcontphone1: "",
    custcontphone2: "",
  });
  const [openAddContact, setOpenAddContact] = useState(false);

  const handleAddContact = (e) => {
    setAddContact({
      custid: e.currentTarget.dataset.custid,
      custcontname: "",
      custcontemail: "",
      custcontphone1: "",
      custcontphone2: "",
    });

    setOpenAddContact(true);
  };

  const handleAddContInputChange = (e) => {
    const { name, value } = e.target;
    setAddContact({
      ...addContact,
      [name]: value,
    });
  };

  const handleCreateCustomerContact = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addDoc(
        collection(appdb, "customer", addContact.custid, "custcont"),
        {
          custcontname: addContact.custcontname,
          custcontemail: addContact.custcontemail,
          custcontphone1: addContact.custcontphone1,
          custcontphone2: addContact.custcontphone2,
        }
      );
      setOpenAddContact(false);
    } catch (error) {
      setError(error);
    }

    setIsLoading(false);
  };

  //ADD NEW ADDRESS TO EXISTING CUSTOMER
  const [addLocation, setAddLocation] = useState({
    custid: "",
    custaddr1: "",
    custaddr2: "",
    custcity: "",
    custpostcode: "",
    custstate: "",
  });
  const [openAddLocation, setOpenAddLocation] = useState(false);

  const handleAddLocation = (e) => {
    setAddLocation({
      custid: e.currentTarget.dataset.custid,
      custaddr1: "",
      custaddr2: "",
      custcity: "",
      custpostcode: "",
      custstate: "",
    });

    setOpenAddLocation(true);
  };

  const handleAddLocInputChange = (e) => {
    const { name, value } = e.target;
    setAddLocation({
      ...addLocation,
      [name]: value,
    });
  };

  const handleCreateCustomerLocation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addDoc(
        collection(appdb, "customer", addLocation.custid, "custloc"),
        {
          custaddr1: addLocation.custaddr1,
          custaddr2: addLocation.custaddr2,
          custcity: addLocation.custcity,
          custpostcode: addLocation.custpostcode,
          custstate: addLocation.custstate,
        }
      );
      setOpenAddLocation(false);
    } catch (error) {
      setError(error);
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    //setEditCustomer({});
    setOpenEditCust(false);
    setOpenAddContact(false);
    setOpenAddLocation(false);
    //setEditCustomer({});
  };

  //Load customers for the user subscription
  useEffect(() => {
    setHeaderText("Customers");

    const fetchCustomers = async () => {
      if (Object.keys(userDetails).length === 0) {
        <Navigate to="/login" />;
      } else {
        setIsLoading(true);
        setError("");
        const q = query(
          collection(appdb, "customer"),
          where("subsid", "==", userDetails.subsid),
          orderBy("custname")
        );
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            setCustomers(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
            );
          },
          (error) => {
            setError(error);
          }
        );

        setIsLoading(false);
        return unsubscribe;
      }
    };
    fetchCustomers();
  }, [setCustomers, setHeaderText, userDetails, userDetails.subsid]);

  useEffect(() => {
    setDispCustomer(customers);
  }, [customers]);

  //Load customer LOVs
  useEffect(() => {
    const fetchCustomerLov = async () => {
      if (customerLov.length === 0) {
        const docRef = doc(appdb, "listofvalues", "customer");

        try {
          const response = await getDoc(docRef);
          setCustomerLov(response.data());
        } catch (error) {
          setError(error);
        }
      }
    };
    fetchCustomerLov();
  }, [setCustomerLov, customerLov.length]);

  //Load Selected Customer Contacts
  useEffect(() => {
    setError("");

    // Get the Contact details of the selected customer
    const fetchContacts = async () => {
      setCustomerContact([]);
      const collRef = collection(
        appdb,
        "customer",
        selectedCustomer,
        "custcont"
      );
      const unsbscribeContacts = onSnapshot(
        collRef,
        (snapshot) => {
          setCustomerContact(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        },
        (error) => {
          setError(error);
        }
      );
      return unsbscribeContacts;
    };

    fetchContacts();
  }, [selectedCustomer]);

  //Load Selected Customer Locations
  useEffect(() => {
    setError("");

    //Get the Location details of the selected customer
    const fetchLocations = async () => {
      setCustomerLocation([]);
      const collRef = collection(
        appdb,
        "customer",
        selectedCustomer,
        "custloc"
      );
      const unsbscribeLocations = onSnapshot(
        collRef,
        (snapshot) => {
          setCustomerLocation(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        },
        (error) => {
          setError(error);
        }
      );
      return unsbscribeLocations;
    };

    fetchLocations();
  }, [selectedCustomer]);

  return (
    <>
      <Grid
        container
        sx={{
          display: "flex",
          direction: "row",
          alignItems: "center",
        }}
      >
        <Grid
          item
          xs={6}
          sm={6}
          md={6}
          sx={{ justifyContent: "flex-start", alignItems: "center" }}
        >
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              onChange={handleCustomerSearch}
            />
          </Search>
        </Grid>
        <Grid
          item
          xs={6}
          sm={6}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <IconButton
            disabled={isLoading}
            component={Link}
            to={"/createcustomer"}
          >
            <AddCircleOutlineIcon color="secondary" />
          </IconButton>
        </Grid>
      </Grid>

      {isLoading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}

      {dispCustomer.map((customer) => (
        <Accordion
          key={customer.id}
          disableGutters
          sx={{
            mt: 0.25,
            "&:before": {
              display: "none",
            },
            borderBottom: "1px solid #dddddd",
            borderRadius: "20px",
            boxShadow: "none",
            ...(customer.custstatus === "Dormant" && {
              background: "#eecaca",
            }),
          }}
          expanded={expanded === `${customer.id}`}
          onChange={handleChange(`${customer.id}`)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id={customer.id}>
            <Box
              sx={{
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              <IconButton size="small">
                <a href={"tel:" + customer.custphone1}>
                  <svg width={0} height={0}>
                    <linearGradient
                      id="linearColors"
                      x1={1}
                      y1={0}
                      x2={1}
                      y2={1}
                    >
                      <stop offset={0} stopColor="#22c1c3" />
                      <stop offset={1} stopColor="#38ef7d" />
                    </linearGradient>
                  </svg>
                  <PhoneIcon sx={{ fill: "url(#linearColors)" }} />
                </a>
              </IconButton>

              <IconButton size="small">
                <a href={"mailto:" + customer.custemail}>
                  <EmailIcon sx={{ fill: "url(#linearColors)" }} />
                </a>
              </IconButton>
              <Box component="span" sx={{ ml: 1 }}>
                {customer.custtitle} {customer.custname}
              </Box>
            </Box>
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12} sm={12} md={4}>
                <Card>
                  <CardHeader
                    action={
                      <IconButton
                        data-custid={customer.id}
                        data-custtitle={customer.custtitle}
                        data-custname={customer.custname}
                        data-custtype={customer.custtype}
                        data-custemail={customer.custemail}
                        data-custphone1={customer.custphone1}
                        data-custphone2={customer.custphone2}
                        data-custstatus={customer.custstatus}
                        size="small"
                        aria-label="Edit Customer"
                        onClick={handleEditCustomer}
                      >
                        <EditIcon fontSize="small" color="info" />
                      </IconButton>
                    }
                    title="General"
                    disableTypography
                    sx={{
                      background: "#F1F2F5",
                      color: "#152b45",
                      fontWeight: "bold",
                      height: "45px !important",
                    }}
                  />
                  <CardContent>
                    <CustomerGeneral customer={customer} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <Card>
                  <CardHeader
                    action={
                      <IconButton
                        data-custid={customer.id}
                        size="small"
                        aria-label="Add Contacts"
                        onClick={handleAddContact}
                      >
                        <AddIcon
                          fontSize="small"
                          color={
                            customerContact.length === 0 ? "warning" : "info"
                          }
                        />
                      </IconButton>
                    }
                    title="Contacts"
                    disableTypography
                    sx={{
                      background: "#F1F2F5",
                      color: "#152b45",
                      fontWeight: "bold",
                      height: "45px !important",
                    }}
                  />

                  {customerContact.map((contact) => (
                    <CardContent key={contact.id}>
                      <CustomerContacts
                        contact={contact}
                        customer={customer.id}
                      />
                    </CardContent>
                  ))}
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <Card>
                  <CardHeader
                    action={
                      <IconButton
                        data-custid={customer.id}
                        size="small"
                        aria-label="Add Address"
                        onClick={handleAddLocation}
                      >
                        <AddIcon
                          fontSize="small"
                          color={
                            customerLocation.length === 0 ? "warning" : "info"
                          }
                        />
                      </IconButton>
                    }
                    title="Address"
                    disableTypography
                    sx={{
                      background: "#F1F2F5",
                      color: "#152b45",
                      fontWeight: "bold",
                      height: "45px !important",
                    }}
                  />
                  {customerLocation.map((loc) => (
                    <CardContent key={loc.id}>
                      <CustomerLocations
                        location={loc}
                        customer={customer.id}
                      />
                      <Divider />
                    </CardContent>
                  ))}
                </Card>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}

      <Dialog id="editcustomer" open={openEditCust} onClose={handleClose}>
        <DialogTitle className="background">Edit Customer</DialogTitle>
        {isLoading && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        )}
        <form onSubmit={handleCustomerUpdate}>
          <DialogContent>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12} sm={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Title</InputLabel>
                  <Select
                    margin="dense"
                    id="custtitle"
                    label="Title"
                    name="custtitle"
                    value={editCustomer.custtitle}
                    onChange={handleEditCustInputChange}
                  >
                    {customerLov.custtitle?.map((val) => (
                      <MenuItem key={val} value={val}>
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  required
                  id="custname"
                  label="Name"
                  name="custname"
                  value={editCustomer.custname}
                  onChange={handleEditCustInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Customer Type</InputLabel>
                  <Select
                    margin="dense"
                    id="custtype"
                    label="Type"
                    name="custtype"
                    value={editCustomer.custtype}
                    onChange={handleEditCustInputChange}
                  >
                    {customerLov.custtype?.map((val) => (
                      <MenuItem key={val} value={val}>
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  required
                  id="custemail"
                  label="Email"
                  name="custemail"
                  value={editCustomer.custemail}
                  onChange={handleEditCustInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  required
                  id="custphone1"
                  label="Phone1"
                  name="custphone1"
                  value={editCustomer.custphone1}
                  onChange={handleEditCustInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  id="custphone2"
                  label="Phone2"
                  name="custphone2"
                  value={editCustomer.custphone2}
                  onChange={handleEditCustInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6}>
                <FormControl fullWidth size="small">
                  <FormLabel>Customer Status</FormLabel>
                  <RadioGroup
                    row
                    required
                    name="custstatus"
                    value={editCustomer.custstatus}
                    onChange={handleEditCustInputChange}
                  >
                    {customerLov.custstatus?.map((val) => (
                      <FormControlLabel
                        key={val}
                        value={val}
                        control={<Radio />}
                        label={val}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="info">
              Update
            </Button>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog id="addcontact" open={openAddContact} onClose={handleClose}>
        <DialogTitle className="background">Add Contact</DialogTitle>
        <form onSubmit={handleCreateCustomerContact}>
          {isLoading && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          )}

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
                  label="Contact Name"
                  name="custcontname"
                  value={addContact.custcontname}
                  onChange={handleAddContInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  id="custcontemail"
                  fullWidth
                  size="small"
                  required
                  label="Contact Email"
                  name="custcontemail"
                  value={addContact.custcontemail}
                  onChange={handleAddContInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  required
                  id="custcontphone1"
                  label="Contact Phone1"
                  name="custcontphone1"
                  value={addContact.custcontphone1}
                  onChange={handleAddContInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  id="custcontphone2"
                  label="Contact Phone2"
                  name="custcontphone2"
                  value={addContact.custcontphone2}
                  onChange={handleAddContInputChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="info">
              Add
            </Button>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog id="addlocation" open={openAddLocation} onClose={handleClose}>
        <DialogTitle className="background">Add additional Address</DialogTitle>
        <form onSubmit={handleCreateCustomerLocation}>
          {isLoading && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          )}

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
                  value={addLocation.custaaddr1}
                  onChange={handleAddLocInputChange}
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
                  value={addLocation.custaaddr2}
                  onChange={handleAddLocInputChange}
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
                  value={addLocation.custcity}
                  onChange={handleAddLocInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  required
                  id="custpostcode"
                  label="PostCode / ZipCode"
                  name="custpostcode"
                  value={addLocation.custpostcode}
                  onChange={handleAddLocInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  required
                  id="custstate"
                  label="State"
                  name="custstate"
                  value={addLocation.custstate}
                  onChange={handleAddLocInputChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="info">
              Add
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
