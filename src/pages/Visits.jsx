import React, { useEffect, useState } from "react";
import MapSection from "../components/Map";
import { Link, useNavigate } from "react-router-dom";

import {
  CardContent,
  Card,
  Grid,
  IconButton,
  Typography,
  CardActions,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
  Button,
  Alert,
  Box,
  LinearProgress,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  AppBar,
  Toolbar,
  Paper,
  CardMedia,
  ImageList,
  ImageListItem,
} from "@mui/material";

import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { format } from "date-fns";

import TodayIcon from "@mui/icons-material/Today";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ScheduleIcon from "@mui/icons-material/Schedule";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
//import AutorenewIcon from "@mui/icons-material/Autorenew";
import CancelIcon from "@mui/icons-material/Cancel";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  headerTextState,
  appointmentsState,
  timeSelectValueState,
  editVisitState,
  userDetailsState,
} from "../store/atoms/appState";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { appdb, appstorage } from "../utils/firebase-config";

export default function Visits() {
  const navigate = useNavigate();
  const user = useRecoilValue(userDetailsState);
  const appointments = useRecoilValue(appointmentsState);
  const setHeaderText = useSetRecoilState(headerTextState);
  const timeSelectValue = useRecoilValue(timeSelectValueState);
  const setEditVisit = useSetRecoilState(editVisitState);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  ////////////////////Reschedule a Visit//////////////////////////////

  const [openSchedule, setOpenSchedule] = useState(false);
  const [aptSchedule, setAptSchedule] = useState({
    aptid: "",
    aptschdate: "",
    aptschfrom: "",
    aptschto: "",
  });
  //open schedule change dialog
  const handleChangeSchedule = (e) => {
    setAptSchedule({
      aptid: e.currentTarget.dataset.aptid,
      aptschdate: new Date(e.currentTarget.dataset.aptdate),
      aptschfrom: e.currentTarget.dataset.aptfromtime,
      aptschto: e.currentTarget.dataset.apttotime,
    });

    setOpenSchedule(true);
  };

  // Capture the date of the appointment
  const handleDateChange = (newvalue) => {
    setAptSchedule({
      ...aptSchedule,
      aptschdate: newvalue,
    });
  };
  const handleAptSchedule = (e) => {
    const { name, value } = e.target;
    setAptSchedule({
      ...aptSchedule,
      [name]: value,
    });
  };

  const handleUpdateSchedle = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const aptSchRef = doc(appdb, "appointments", aptSchedule.aptid);

    try {
      await updateDoc(aptSchRef, {
        aptdate: aptSchedule.aptschdate,
        aptfromtime: aptSchedule.aptschfrom,
        apttotime: aptSchedule.aptschto,
        aptstatus: "Rescheduled",
      });
      setOpenSchedule(false);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  ///////////////////Add Notes to a Visit ///////////////////////////
  const [openNotes, setOpenNotes] = useState(false);
  const [aptNotes, setAptNotes] = useState({
    aptid: "",
    aptnotes: "",
  });

  //open add notes dialog
  const handleChangeNotes = (e) => {
    setAptNotes({
      aptid: e.currentTarget.dataset.aptid,
      aptnotes: e.currentTarget.dataset.aptnotes,
    });
    setOpenNotes(true);
  };

  const handleAptNotes = (e) => {
    const { name, value } = e.target;
    setAptNotes({
      ...aptNotes,
      [name]: value,
    });
  };

  const handleUpdateNotes = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const aptNotesRef = doc(appdb, "appointments", aptNotes.aptid);

    try {
      await updateDoc(aptNotesRef, {
        aptnotes: aptNotes.aptnotes,
      });
      setOpenNotes(false);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  ///////////////////Add Geo Tagging to a Visit ///////////////////
  const [openGeotag, setOpenGeotag] = useState(false);
  const [aptGeoLoc, setAptGeoLoc] = useState({
    aptid: "",
    aptstatus: "",
    aptgeotaglat: 0,
    aptgeotaglng: 0,
  });
  const [geolocation, setGeolocation] = useState({
    lat: 0,
    lng: 0,
  });

  const handleGeoTag = (e) => {
    setAptGeoLoc({
      aptid: e.currentTarget.dataset.aptid,
      aptstatus: e.currentTarget.dataset.aptstatus,
      aptgeotaglat: Number(e.currentTarget.dataset.aptgeotaglat),
      aptgeotaglng: Number(e.currentTarget.dataset.aptgeotaglng),
    });
    setGeolocation({
      lat: Number(e.currentTarget.dataset.aptgeotaglat),
      lng: Number(e.currentTarget.dataset.aptgeotaglng),
    });
    setError("");
    setOpenGeotag(true);
  };

  const handleStatusChange = (e) => {
    setAptGeoLoc({
      ...aptGeoLoc,
      aptstatus: e.target.value,
    });
  };

  const handleGetGeoLocation = (e) => {
    if (!navigator.geolocation) {
      console.log("GeoLocation is not supported by your device browser");
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLoading(true);
          setAptGeoLoc({
            ...aptGeoLoc,
            aptgeotaglat: position.coords.latitude,
            aptgeotaglng: position.coords.longitude,
          });
          setGeolocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false);
        },
        () => {
          console.log("Unable to retrieve your location");
          setIsLoading(false);
        }
      );
    }
  };

  const handleUpdateGeoTag = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (aptGeoLoc.aptgeotaglat === 0) {
      setError("No Location Found...");
    } else if (
      aptGeoLoc.aptstatus !== "Completed" &&
      aptGeoLoc.aptstatus !== "NoShow"
    ) {
      setError("No Status Selected");
    } else {
      const aptGeoRef = doc(appdb, "appointments", aptGeoLoc.aptid);

      try {
        await updateDoc(aptGeoRef, {
          aptstatus: aptGeoLoc.aptstatus,
          aptgeotaglat: aptGeoLoc.aptgeotaglat,
          aptgeotaglng: aptGeoLoc.aptgeotaglng,
        });
        setOpenGeotag(false);
      } catch (error) {
        setError(error);
      }
    }

    setIsLoading(false);
  };

  ///////////////////Add Image to a Visit ///////////////////////////

  const [openImage, setOpenImage] = useState(false);
  const [aptImage, setAptImage] = useState({
    aptid: "",
    aptimg: [],
  });
  const [imgFile, setImgFile] = useState({
    aptimgfilename: "",
    aptimgfile: "",
  });

  const [source, setSource] = useState("");

  const handleImage = (e) => {
    const value = e.currentTarget.dataset.aptimg;

    setAptImage({
      aptid: e.currentTarget.dataset.aptid,
      aptimg:
        value === ""
          ? []
          : typeof value === "string"
          ? value.split(",")
          : value,
    });
    setImgFile({
      aptimgfilename: "",
      aptimgfile: "",
    });
    setSource("");
    setOpenImage(true);
  };

  const handleCapture = (target) => {
    if (target.files) {
      if (target.files.length !== 0) {
        const file = target.files[0];
        const newUrl = URL.createObjectURL(file);
        setImgFile({
          aptimgfilename: file.name,
          aptimgfile: file,
        });
        setSource(newUrl);
      }
    }
  };

  const handleImageUpload = (e) => {
    e.preventDefault();
    console.log("Start of Upload");
    console.log(imgFile.aptimgfile);
    setIsLoading(true);
    if (imgFile) {
      const fname =
        imgFile.aptimgfilename.split(".")[0] +
        "_" +
        new Date().getTime() +
        "." +
        imgFile.aptimgfilename.split(".")[1];

      const storageRef = ref(
        appstorage,
        `${user.subsid}/apointments/images/${aptImage.aptid}/${fname}`
      );
      const uploadTask = uploadBytesResumable(storageRef, imgFile.aptimgfile);
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((URL) => {
            aptImage.aptimg.push(URL);

            const aptImgRef = doc(appdb, "appointments", aptImage.aptid);

            updateDoc(aptImgRef, {
              aptimg: aptImage.aptimg,
            })
              .then((res) => {
                console.log("All Done");
                setSource("");
                setIsLoading(false);
              })
              .catch((error) => {
                console.log(error);
                setError(error);
                setIsLoading(false);
              });

            console.log(URL);
          });
        }
      );
    } else {
      console.log(`Not an image, the image file is a ${typeof imgAsFile}`);
      setIsLoading(false);
    }
  };

  //const currentDate = new Date();

  //Handle dialog close
  const handleClose = () => {
    setOpenSchedule(false);
    setOpenNotes(false);
    setOpenGeotag(false);
    setOpenImage(false);
    setError("");
  };

  //////////////////EDIT/DELETE Visit/////////////

  const handleEditVisit = (e, visit) => {
    setEditVisit(visit);
    navigate("/editvisit");
  };

  /////////////CANCEL Visit /////////////

  const handleCancelApt = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const aptRef = doc(appdb, "appointments", e.currentTarget.dataset.aptid);

    try {
      await updateDoc(aptRef, {
        aptstatus: "Cancelled",
      });
      setOpenNotes(false);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setHeaderText("Appointments");
  }, [setHeaderText]);

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
          <IconButton>
            <TodayIcon color="info" />
          </IconButton>
          <IconButton>
            <PersonSearchIcon color="info" />
          </IconButton>
          <IconButton>
            <DateRangeIcon color="info" />
          </IconButton>
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
          <IconButton component={Link} to={"/createvisits"}>
            <AddCircleOutlineIcon color="secondary" />
          </IconButton>
        </Grid>
      </Grid>

      {error && <Alert severity="error">error</Alert>}
      {appointments.map((apt) => (
        <Card
          key={apt.id}
          sx={{
            mt: 0.5,
            "&:before": {
              display: "none",
            },
            borderBottom: "1px solid #dddddd",
            borderRadius: "20px",
            boxShadow: "none",
            ...(apt.aptstatus === "Scheduled" && {
              borderLeft: 10,
              borderLeftColor: "#c0c0c0",
            }),
            ...(apt.aptstatus === "Rescheduled" && {
              borderLeft: 10,
              borderLeftColor: "#e9dd37",
            }),
            ...(apt.aptstatus === "NoShow" && {
              borderLeft: 10,
              borderLeftColor: "#e44326",
            }),
            ...(apt.aptstatus === "Completed" && {
              borderLeft: 10,
              borderLeftColor: "#1ddd67",
            }),
            ...(apt.aptstatus === "Cancelled" && {
              borderLeft: 10,
              borderLeftColor: "#a71ddd",
            }),
          }}
        >
          <CardContent>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={11}>
                <Stack>
                  <Typography variant="subtitle2">{apt.aptcustname}</Typography>
                  <Typography variant="caption">{apt.aptsrep}</Typography>
                  <Typography variant="body2">
                    {format(new Date(apt.aptdate.toDate()), "dd/MM/yyyy")} (
                    {apt.aptfromtime} - {apt.apttotime}){"  "}
                    {apt.aptcustloc}
                  </Typography>

                  <Typography variant="caption">{apt.apttitle}</Typography>
                </Stack>
              </Grid>

              <Grid item xs={1}>
                <Stack alignItems="center" justifyContent="center">
                  <IconButton
                    size="small"
                    onClick={(event) => handleEditVisit(event, apt)}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Grid container>
              <Grid container item xs={6} justifyContent="flex-start">
                <a href={"tel:" + apt.aptcustphone}>
                  <IconButton edge="start" size="small">
                    <PhoneIcon fontSize="small" color="info" />
                  </IconButton>
                </a>
                <a href={"mailto:" + apt.aptcustemail}>
                  <IconButton edge="start" size="small">
                    <EmailIcon fontSize="small" color="info" />
                  </IconButton>
                </a>

                {apt.aptstatus === "Scheduled" ||
                apt.aptstatus === "Rescheduled" ? (
                  <>
                    <IconButton
                      size="small"
                      data-aptid={apt.id}
                      data-aptdate={format(
                        new Date(apt.aptdate.toDate()),
                        "MM/dd/yyyy"
                      )}
                      data-aptfromtime={apt.aptfromtime}
                      data-apttotime={apt.apttotime}
                      onClick={handleChangeSchedule}
                    >
                      <ScheduleIcon fontSize="small" color="info" />
                    </IconButton>
                    <IconButton
                      size="small"
                      data-aptid={apt.id}
                      onClick={handleCancelApt}
                    >
                      <CancelIcon fontSize="small" color="error" />
                    </IconButton>
                  </>
                ) : null}
              </Grid>
              <Grid container item xs={6} justifyContent="flex-end">
                <IconButton
                  size="small"
                  data-aptid={apt.id}
                  data-aptnotes={apt.aptnotes}
                  onClick={handleChangeNotes}
                >
                  <SpeakerNotesIcon
                    fontSize="small"
                    sx={{
                      color: "#068822",
                      ...(apt.aptnotes === "" && {
                        color: "#FE6B8B",
                      }),
                    }}
                  />
                </IconButton>

                <IconButton
                  size="small"
                  data-aptid={apt.id}
                  data-aptgeotaglat={apt.aptgeotaglat}
                  data-aptgeotaglng={apt.aptgeotaglng}
                  data-aptstatus={apt.aptstatus}
                  disabled={apt.aptstatus === "Cancelled"}
                  onClick={handleGeoTag}
                >
                  <AddLocationIcon
                    fontSize="small"
                    sx={{
                      color: "#068822",
                      ...(apt.aptgeotaglat === 0 && {
                        color: "#FE6B8B",
                      }),
                      ...(apt.aptstatus === "Cancelled" && {
                        color: "#8b8788",
                      }),
                    }}
                  />
                </IconButton>

                <IconButton
                  data-aptid={apt.id}
                  data-aptimg={apt.aptimg}
                  size="small"
                  onClick={handleImage}
                >
                  <PhotoCameraIcon fontSize="small" sx={{ color: "#FE6B8B" }} />
                </IconButton>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      ))}

      <Dialog fullWidth open={openSchedule} onClose={handleClose}>
        <DialogTitle className="background" variant="h6">
          Change Meeting Schedule
        </DialogTitle>
        {isLoading && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        )}
        <DialogContent sx={{ mt: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack direction="row" spacing={1}>
              <MobileDatePicker
                label="Date"
                inputFormat="dd/MM/yyyy"
                value={aptSchedule.aptschdate}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField fullWidth size="small" {...params} />
                )}
              />
              <FormControl fullWidth size="small">
                <InputLabel>From</InputLabel>
                <Select
                  required
                  id="aptschfrom"
                  label="From"
                  name="aptschfrom"
                  value={aptSchedule.aptschfrom}
                  onChange={handleAptSchedule}
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
                  id="aptschto"
                  label="To"
                  name="aptschto"
                  value={aptSchedule.aptschto}
                  onChange={handleAptSchedule}
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
        </DialogContent>
        <DialogActions disableSpacing>
          <Button
            disabled={isLoading}
            onClick={handleUpdateSchedle}
            color="info"
          >
            Update
          </Button>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog fullWidth open={openNotes} onClose={handleClose}>
        <DialogTitle className="background">Appointment Notes</DialogTitle>
        {isLoading && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        )}
        <DialogContent>
          <TextField
            margin="dense"
            size="small"
            fullWidth
            autoFocus
            multiline
            rows={8}
            type="string"
            id="aptnotes"
            name="aptnotes"
            label="Notes"
            value={aptNotes.aptnotes}
            onChange={handleAptNotes}
          />
        </DialogContent>
        <DialogActions disableSpacing>
          <Button disabled={isLoading} onClick={handleUpdateNotes} color="info">
            Update
          </Button>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog fullWidth open={openGeotag} onClose={handleClose}>
        <DialogTitle className="background">Add Geo Tag</DialogTitle>
        {error && <Alert severity="error">{error}</Alert>}
        {isLoading && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        )}
        <DialogContent sx={{ mt: 2 }}>
          <FormControl compponent="fieldset">
            <FormLabel component="legend">Status</FormLabel>
            <RadioGroup
              row
              aria-label="status"
              name="row-radio-group"
              value={aptGeoLoc.aptstatus}
              onChange={handleStatusChange}
            >
              <FormControlLabel
                value="Completed"
                control={<Radio />}
                label="Completed"
              />
              <FormControlLabel
                value="NoShow"
                control={<Radio />}
                label="No Show"
              />
            </RadioGroup>
          </FormControl>
          <Stack>
            {aptGeoLoc.aptgeotaglat !== 0 && (
              <MapSection location={geolocation} zoomLevel={17} />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={isLoading}
            onClick={handleGetGeoLocation}
            color="info"
          >
            Get Location
          </Button>
          <Button
            disabled={isLoading}
            onClick={handleUpdateGeoTag}
            color="info"
          >
            Save
          </Button>
          <Button disabled={isLoading} onClick={handleClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog fullScreen open={openImage} onClose={handleClose}>
        <AppBar>
          <Toolbar variant="dense" className="background">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleClose}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              align="center"
              sx={{ flexGrow: 1 }}
            >
              Appointment Images
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ mt: 6 }}></Box>
        {error && <Alert severity="error">{error}</Alert>}
        {isLoading && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        )}
        <Card>
          <CardContent>
            {source && (
              <>
                <img
                  src={source}
                  alt={"snap"}
                  style={{ height: 390, maxWidth: "100%" }}
                ></img>
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  disabled={isLoading}
                  onClick={handleImageUpload}
                >
                  <SaveIcon fontSize="small" color="info" />
                </IconButton>
              </>
            )}
            <input
              hidden
              accept="image/*"
              id="icon-button-file"
              type="file"
              capture="environment"
              onChange={(e) => handleCapture(e.target)}
            />
            <label htmlFor="icon-button-file">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
                disabled={isLoading}
              >
                <PhotoCameraIcon
                  fontSize={source ? "small" : "large"}
                  color="secondary"
                />
              </IconButton>
            </label>
          </CardContent>
        </Card>

        <Box justifyContent="center">
          <Typography>Images</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            overflow: "hidden",
          }}
        >
          <ImageList
            sx={{ width: "100%", margin: 2, flexWrap: "nowrap" }}
            cols={2}
            rowHeight={200}
          >
            {aptImage &&
              aptImage.aptimg?.map((val) => (
                <ImageListItem key={val}>
                  <img src={val} alt={val} loading="lazy" />
                </ImageListItem>
              ))}
          </ImageList>
        </Box>
      </Dialog>
    </>
  );
}
