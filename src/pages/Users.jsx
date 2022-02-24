import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userDetailsState, headerTextState } from "../store/atoms/appState";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

//import { useAuth } from "../contexts/AuthContext";

import {
  Box,
  Card,
  CardContent,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  LinearProgress,
  Grid,
  TextField,
  Alert,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  CardActionArea,
} from "@mui/material";

import { appdb } from "../utils/firebase-config";
import {
  doc,
  getDoc,
  query,
  collection,
  where,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

export default function Users() {
  //Global Page Elements
  //const { signup, removeUser } = useAuth();
  const user = useRecoilValue(userDetailsState);
  const setHeaderText = useSetRecoilState(headerTextState);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [subscription, setSubscription] = useState({
    subsemail: "",
    subslicensecount: "",
    subsname: "",
  });
  const [licenseCount, setLicenseCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [remainingUserCount, setRemainingUserCount] = useState(0);
  const [usersAccounts, setUsersAccounts] = useState([]);

  const [rolesLov, setRolesLov] = useState({});
  const [openNewUser, setOpenNewUser] = useState(false);
  const [newUserError, setNewUserError] = useState();
  const [editUser, setEditUser] = useState({
    usrid: "",
    usrfname: "",
    usrlname: "",
    usrrole: "",
    usremail: "",
  });
  const [openEditUser, setOpenEditUser] = useState(false);

  //ADD USER ACCOUNTS////////////////////////////////////////////////
  const handleAddUser = () => {
    if (remainingUserCount > 0) {
      setOpenNewUser(true);
    } else {
      setError("You do not have enough license to create new user");
    }
  };

  //////////////////CREATE NEW USER/////////////////

  const userValidationSchema = Yup.object().shape({
    usremail: Yup.string()
      .required("Email is required")
      .email("Email is invalid"),
    usrfname: Yup.string().required("User First Name is required"),
    usrlname: Yup.string().required("User Last Name is required"),
    usrrole: Yup.string().required("User Role is required"),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(userValidationSchema) });

  const handleCreateUser = async (data) => {
    const new_user = {
      subsid: user.subsid,
      subsname: user.subsname,
      usremail: data.usremail,
      usrfname: data.usrfname,
      usrlname: data.usrlname,
      usrrole: data.usrrole,
      createdby: user.usremail,
      createdon: serverTimestamp(),
      modifiedby: "",
      modifiedon: "",
    };
    try {
      setIsLoading(true);

      //await signup(data.usremail, "abc123");

      const collectionRef = collection(appdb, "userrole");
      const q = query(collectionRef, where("usremail", "==", data.usremail));

      const docs = await getDocs(q);

      if (docs.empty) {
        try {
          await setDoc(doc(appdb, "userrole", data.usremail), new_user);
          setOpenNewUser(false);
          reset({
            usremail: "",
            usrfname: "",
            usrlname: "",
            usrrole: "",
          });
        } catch (error) {
          setNewUserError(error);
        }
      } else {
        setNewUserError("User with same email already exists");
      }
    } catch (error) {
      setNewUserError(error);
    }

    setIsLoading(false);
  };

  //////////////////EDIT USER/////////////////
  const handleEditUserInputChnage = (e) => {
    const { name, value } = e.target;
    setEditUser({
      ...editUser,
      [name]: value,
    });
  };

  const handleEditUser = (e) => {
    setEditUser({});
    const usr_edit = {
      usrid: e.currentTarget.dataset.usrid,
      usrfname: e.currentTarget.dataset.usrfname,
      usrlname: e.currentTarget.dataset.usrlname,
      usrrole: e.currentTarget.dataset.usrrole,
      usremail: e.currentTarget.dataset.usremail,
    };

    if (e.currentTarget.dataset.usrrole !== "SuperAdmin") {
      setEditUser(usr_edit);
      setOpenEditUser(true);
    } else {
      setError("Cannot Edit SuperAdmin");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateDoc(doc(appdb, "userrole", editUser.usrid), {
        usrfname: editUser.usrfname,
        usrlname: editUser.usrlname,
        usrrole: editUser.usrrole,
        modifiedby: user.usremail,
        modifiedon: serverTimestamp(),
      });
      setOpenEditUser(false);
    } catch (error) {
      setNewUserError(error);
    }
    setIsLoading(false);
  };

  ////////////DELETE USER ////////////////
  const handleDeleteUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await deleteDoc(doc(appdb, "userrole", editUser.usrid));
      setOpenEditUser(false);
      //await removeUser(e.currentTarget.dataset.usrid);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  ////////////////
  const handleClose = () => {
    setOpenNewUser(false);
    setNewUserError("");
    setOpenEditUser(false);
    reset({
      usremail: "",
      usrfname: "",
      usrlname: "",
      usrrole: "",
    });
  };

  /////////FETCH DATA on RENDER///////////////

  //load subscription details of logged in user
  useEffect(() => {
    setHeaderText(`${user.subsname} Users`);
    const fetchSubscription = async () => {
      if (Object.keys(user).length === 0) {
        <Navigate to="/login" />;
      } else {
        setIsLoading(true);
        setError("");
        try {
          const q = doc(appdb, "subscription", user.subsid);
          const subsRef = await getDoc(q);
          setSubscription(subsRef.data());
          setLicenseCount(subsRef.data().subslicensecount);
        } catch (error) {
          setError(error);
        }
        setIsLoading(false);
      }
    };
    fetchSubscription();
  }, [user.subsid, setHeaderText, user]);

  //load all users belonging to the subscription
  useEffect(() => {
    const fetchUsers = async () => {
      if (Object.keys(user).length === 0) {
        <Navigate to="/login" />;
      } else {
        setIsLoading(true);
        setError("");
        const q = query(
          collection(appdb, "userrole"),
          where("subsid", "==", user.subsid)
        );
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            setUsersAccounts(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
            );
            setUserCount(usersAccounts.length);
            setRemainingUserCount(licenseCount - userCount);
          },
          (error) => {
            setError(error);
          }
        );

        setIsLoading(false);
        return unsubscribe;
      }
    };
    fetchUsers();
  }, [user, licenseCount, userCount, usersAccounts.length]);

  //load list of values for available user roles
  useEffect(() => {
    const fetchUserLov = async () => {
      const docRef = doc(appdb, "listofvalues", "userrole");
      try {
        const response = await getDoc(docRef);
        setRolesLov(response.data());
      } catch (error) {
        setError(error);
      }
    };
    fetchUserLov();
  }, []);

  return (
    <>
      <Box
        sx={{
          mt: 1,
          mb: 2,
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: "space-between",
        }}
      >
        <Box>Subscription: {subscription.subsname}</Box>
        <Box>License: {licenseCount}</Box>
        <Box>User Count: {userCount}</Box>
        <Box>Remaining: {remainingUserCount}</Box>
      </Box>
      <Divider />
      {error && <Alert severity="error">{error}</Alert>}
      <Button onClick={handleAddUser}>Add User</Button>

      {usersAccounts &&
        usersAccounts.map((userAccount) => (
          <Card
            key={userAccount.id}
            sx={{
              mt: 0.5,
              "&:before": {
                display: "none",
              },
              borderBottom: "1px solid #dddddd",
              borderRadius: "20px",
              boxShadow: "none",
            }}
          >
            <CardActionArea
              data-usrid={userAccount.id}
              data-usrfname={userAccount.usrfname}
              data-usrlname={userAccount.usrlname}
              data-usrrole={userAccount.usrrole}
              data-usremail={userAccount.usremail}
              onClick={handleEditUser}
            >
              <CardContent>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  sx={{
                    direction: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={6}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    <Typography sx={{ fontWeight: "bold" }}>
                      {userAccount.usrfname} {userAccount.usrlname}
                    </Typography>
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
                    <Typography variant="subtitle2">
                      {userAccount.usrrole}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={6}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    <FormLabel>
                      <Typography>{userAccount.usremail}</Typography>
                    </FormLabel>
                  </Grid>
                </Grid>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}

      <Dialog id="newuser" open={openNewUser} onClose={handleClose}>
        <DialogTitle className="background">Add User</DialogTitle>
        {newUserError && <Alert severity="error">{newUserError}</Alert>}
        <form onSubmit={handleSubmit(handleCreateUser)}>
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
                  required
                  id="usremail"
                  name="usremail"
                  label="User Email"
                  fullWidth
                  margin="dense"
                  size="small"
                  {...register("usremail")}
                  error={errors.usremail ? true : false}
                />
                <Typography variant="inherit" color="textSecondary">
                  {errors.usremail?.message}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  required
                  id="usrfname"
                  name="usrfname"
                  label="First Name"
                  fullWidth
                  margin="dense"
                  size="small"
                  {...register("usrfname")}
                  error={errors.usrfname ? true : false}
                />
                <Typography variant="inherit" color="textSecondary">
                  {errors.usrfname?.message}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  required
                  id="usrlname"
                  name="usrlname"
                  label="Last Name"
                  fullWidth
                  margin="dense"
                  size="small"
                  {...register("usrlname")}
                  error={errors.usrlname ? true : false}
                />
                <Typography variant="inherit" color="textSecondary">
                  {errors.usrlname?.message}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>User Role</InputLabel>
                  <Controller
                    control={control}
                    name="usrrole"
                    defaultValue=""
                    inputRef={register("usrrole")}
                    error={errors.usrrole ? true : false}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        label="Customer Type"
                        required
                        value={value}
                        onChange={onChange}
                      >
                        {rolesLov.roles?.map((val) => (
                          <MenuItem key={val} value={val}>
                            {val}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button disabled={isLoading} type="submit" color="info">
              Add
            </Button>
            <Button
              disabled={isLoading}
              onClick={handleClose}
              color="secondary"
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog id="edituser" open={openEditUser} onClose={handleClose}>
        <DialogTitle className="background">Edit User</DialogTitle>
        {newUserError && <Alert severity="error">{newUserError}</Alert>}
        <form onSubmit={handleUpdateUser}>
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
                  disabled
                  id="usremail"
                  label="User Email"
                  name="usremail"
                  value={editUser.usremail}
                  onChange={handleEditUserInputChnage}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  required
                  id="usrfname"
                  name="usrfname"
                  label="First Name"
                  value={editUser.usrfname}
                  onChange={handleEditUserInputChnage}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  required
                  id="usrlname"
                  name="usrlname"
                  label="Last Name"
                  value={editUser.usrlname}
                  onChange={handleEditUserInputChnage}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>User Role</InputLabel>
                  <Select
                    margin="dense"
                    id="usrrole"
                    label="User Role"
                    name="usrrole"
                    value={editUser.usrrole}
                    onChange={handleEditUserInputChnage}
                  >
                    {rolesLov.roles?.map((val) => (
                      <MenuItem key={val} value={val}>
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button disabled={isLoading} type="submit" color="info">
              Update
            </Button>
            <Button
              disabled={isLoading}
              onClick={handleDeleteUser}
              color="error"
            >
              Delete
            </Button>
            <Button
              disabled={isLoading}
              onClick={handleClose}
              color="secondary"
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
