import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import {
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  FormLabel,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
  Alert,
  CardContent,
  CardActions,
  Card,
  LinearProgress,
  Box,
  CardHeader,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import * as dbService from "../utils/firestore";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  customerLOVState,
  headerTextState,
  userDetailsState,
} from "../store/atoms/appState";
import { appdb } from "../utils/firebase-config";
import { doc, getDoc } from "@firebase/firestore";

export default function CreateCustomer() {
  const navigate = useNavigate();
  const [headerText, setHeaderText] = useRecoilState(headerTextState);

  const [customerLov, setCustomerLov] = useRecoilState(customerLOVState);
  const userDetails = useRecoilValue(userDetailsState);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validationSchema = Yup.object().shape({
    custtitle: Yup.string().required("Title is required"),
    custname: Yup.string()
      .required("Customer Name is required")
      .min(4, "Customer name must be at least 4 characters"),
    custtype: Yup.string().required("Customer Type is required"),
    custemail: Yup.string()
      .required("Email is required")
      .email("Email is invalid"),
    custphone1: Yup.string()
      .required("Phone number is required")
      .matches(phoneRegExp, "Phone number is not valid"),
    custphone2: Yup.string().notRequired().matches(phoneRegExp, {
      message: "Phone number is not valid",
      excludeEmptyString: true,
    }),
    custaddr1: Yup.string().required("Address Line 1 is required"),
    custaddr2: Yup.string(),
    custcity: Yup.string().required("City is required"),
    custpostcode: Yup.string().required("Postcode is required"),
    custstate: Yup.string().required("State is required"),
    custcontname: Yup.string(),
    custcontemail: Yup.string().email("Email is invalid"),
    custcontphone1: Yup.string().notRequired().matches(phoneRegExp, {
      message: "Phone number is not valid",
      excludeEmptyString: true,
    }),
    custcontphone2: Yup.string().notRequired().matches(phoneRegExp, {
      message: "Phone number is not valid",
      excludeEmptyString: true,
    }),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = async (data) => {
    try {
      window.scrollTo(0, 0);
      setIsLoading(true);
      const x = await dbService.handleCreateCustomer(data, userDetails);
      if (x.status === "Success") {
        navigate(-1);
      } else {
        setError(x.msg);
      }
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setHeaderText("Add New Customer");

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
  }, [setHeaderText, setCustomerLov, customerLov.length]);

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
      <Card>
        {isLoading && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12} sm={12} md={6}>
                <Card>
                  <CardHeader
                    title="General"
                    disableTypography
                    sx={{
                      background: "#F1F2F5",
                      color: "#152b45",
                      fontWeight: "bold",
                      height: "26px !important",
                    }}
                    titleTypographyProps={{ variant: "subtitle1" }}
                  ></CardHeader>
                  <CardContent>
                    <FormControl fullWidth size="small">
                      <InputLabel>Title</InputLabel>
                      <Controller
                        control={control}
                        name="custtitle"
                        defaultValue=""
                        inputRef={register("custtitle")}
                        error={errors.custtitle ? true : false}
                        render={({ field: { onChange, value } }) => (
                          <Select
                            label="Title"
                            required
                            value={value}
                            onChange={onChange}
                          >
                            {customerLov.custtitle?.map((val) => (
                              <MenuItem key={val} value={val}>
                                {val}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                    <TextField
                      required
                      id="custname"
                      name="custname"
                      label="Customer Name"
                      fullWidth
                      margin="dense"
                      size="small"
                      {...register("custname")}
                      error={errors.custname ? true : false}
                    />
                    <Typography variant="inherit" color="textSecondary">
                      {errors.custname?.message}
                    </Typography>
                    <FormControl fullWidth size="small">
                      <InputLabel>Customer Type</InputLabel>
                      <Controller
                        control={control}
                        name="custtype"
                        defaultValue=""
                        inputRef={register("custtype")}
                        error={errors.custtype ? true : false}
                        render={({ field: { onChange, value } }) => (
                          <Select
                            label="Customer Type"
                            required
                            value={value}
                            onChange={onChange}
                          >
                            {customerLov.custtype?.map((val) => (
                              <MenuItem key={val} value={val}>
                                {val}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                    <TextField
                      required
                      id="custemail"
                      name="custemail"
                      label="Customer Email"
                      fullWidth
                      margin="dense"
                      size="small"
                      {...register("custemail")}
                      error={errors.custemail ? true : false}
                    />
                    <Typography variant="inherit" color="textSecondary">
                      {errors.custemail?.message}
                    </Typography>
                    <TextField
                      required
                      id="custphone1"
                      name="custphone1"
                      label="Primary Phone"
                      fullWidth
                      margin="dense"
                      size="small"
                      {...register("custphone1")}
                      error={errors.custphone1 ? true : false}
                    />
                    <Typography variant="inherit" color="textSecondary">
                      {errors.custphone1?.message}
                    </Typography>
                    <TextField
                      id="custphone2"
                      name="custphone2"
                      label="Secondary Phone"
                      fullWidth
                      margin="dense"
                      size="small"
                      {...register("custphone2")}
                      error={errors.custphone2 ? true : false}
                    />
                    <Typography variant="inherit" color="textSecondary">
                      {errors.custphone2?.message}
                    </Typography>
                    <FormControl>
                      <FormLabel>Customer Status</FormLabel>

                      <Controller
                        control={control}
                        name="custstatus"
                        defaultValue="Active"
                        inputRef={register("custstatus")}
                        error={errors.custstatus ? true : false}
                        render={({ field: { onChange, value } }) => (
                          <RadioGroup
                            row
                            required
                            value={value}
                            onChange={onChange}
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
                        )}
                      />
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={12} md={6}>
                <Card>
                  <CardHeader
                    title="Address"
                    disableTypography
                    sx={{
                      background: "#F1F2F5",
                      color: "#152b45",
                      fontWeight: "bold",
                      height: "26px !important",
                    }}
                    titleTypographyProps={{ variant: "subtitle1" }}
                  ></CardHeader>
                  <CardContent>
                    <TextField
                      required
                      id="custaddr1"
                      name="custaddr1"
                      label="Address Line 1"
                      fullWidth
                      margin="dense"
                      size="small"
                      {...register("custaddr1")}
                      error={errors.custaddr1 ? true : false}
                    />
                    <Typography variant="inherit" color="textSecondary">
                      {errors.custaddr1?.message}
                    </Typography>
                    <TextField
                      id="custaddr2"
                      name="custaddr2"
                      label="Address Line 2"
                      fullWidth
                      margin="dense"
                      size="small"
                      {...register("custaddr2")}
                      error={errors.custaddr2 ? true : false}
                    />
                    <Typography variant="inherit" color="textSecondary">
                      {errors.custaddr2?.message}
                    </Typography>
                    <TextField
                      required
                      id="custcity"
                      name="custcity"
                      label="City"
                      fullWidth
                      margin="dense"
                      size="small"
                      {...register("custcity")}
                      error={errors.custcity ? true : false}
                    />
                    <Typography variant="inherit" color="textSecondary">
                      {errors.custcity?.message}
                    </Typography>
                    <TextField
                      required
                      id="custpostcode"
                      name="custpostcode"
                      label="Postcode"
                      fullWidth
                      margin="dense"
                      size="small"
                      {...register("custpostcode")}
                      error={errors.custpostcode ? true : false}
                    />
                    <Typography variant="inherit" color="textSecondary">
                      {errors.custpostcode?.message}
                    </Typography>
                    <TextField
                      required
                      id="custstate"
                      name="custstate"
                      label="State"
                      fullWidth
                      margin="dense"
                      size="small"
                      {...register("custstate")}
                      error={errors.custstate ? true : false}
                    />
                    <Typography variant="inherit" color="textSecondary">
                      {errors.custstate?.message}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Card>
                  <CardHeader
                    title="Additional Contacts"
                    disableTypography
                    sx={{
                      background: "#F1F2F5",
                      color: "#152b45",
                      fontWeight: "bold",
                      height: "26px !important",
                    }}
                    titleTypographyProps={{ variant: "subtitle1" }}
                  ></CardHeader>
                  <CardContent>
                    <TextField
                      id="custcontname"
                      name="custcontname"
                      label="Contact Name"
                      fullWidth
                      margin="dense"
                      size="small"
                      {...register("custcontname")}
                      error={errors.custcontname ? true : false}
                    />
                    <Typography variant="inherit" color="textSecondary">
                      {errors.custcontname?.message}
                    </Typography>
                    <TextField
                      id="custcontemail"
                      name="custcontemail"
                      label="Contact Email"
                      fullWidth
                      margin="dense"
                      size="small"
                      {...register("custcontemail")}
                      error={errors.custcontemail ? true : false}
                    />
                    <Typography variant="inherit" color="textSecondary">
                      {errors.custcontemail?.message}
                    </Typography>
                    <TextField
                      id="custcontphone1"
                      name="custcontphone1"
                      label="Contact Phone1"
                      fullWidth
                      margin="dense"
                      size="small"
                      {...register("custcontphone1")}
                      error={errors.custcontphone1 ? true : false}
                    />
                    <Typography variant="inherit" color="textSecondary">
                      {errors.custcontphone1?.message}
                    </Typography>
                    <TextField
                      id="custcontphone2"
                      name="custcontphone2"
                      label="Contact Phone2"
                      fullWidth
                      margin="dense"
                      size="small"
                      {...register("custcontphone2")}
                      error={errors.custcontphone2 ? true : false}
                    />
                    <Typography variant="inherit" color="textSecondary">
                      {errors.custcontphone2?.message}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Typography
              variant="body2"
              color="#0288d1"
              sx={{ fontStyle: "italic", m: 1 }}
            >
              You can add additional address & contacts on the Customer Screen
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end", mb: 2 }}>
            <Button type="submit" color="info" disabled={isLoading}>
              Create
            </Button>
            <Button
              color="secondary"
              disabled={isLoading}
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </CardActions>
        </form>
      </Card>
    </>
  );
}
