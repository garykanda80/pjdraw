import React, { useEffect, useState } from "react";
import {
  Button,
  Alert,
  Card,
  Box,
  LinearProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  CardContent,
  CardActionArea,
  InputBase,
  IconButton,
} from "@mui/material";

import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import {
  userDetailsState,
  headerTextState,
  productsState,
} from "../store/atoms/appState";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  getDoc,
  serverTimestamp,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { appdb } from "../utils/firebase-config";
import { Navigate } from "react-router-dom";

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

export default function Products() {
  const user = useRecoilValue(userDetailsState);
  const setHeaderText = useSetRecoilState(headerTextState);
  const [products, setProducts] = useRecoilState(productsState);
  const [dispProduct, setDispProduct] = useState(products);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);
  const [prodError, setProdError] = useState("");
  const [prodMode, setProdMode] = useState("");

  const [selectedProduct, setSelectedProduct] = useState({
    prodid: "",
    prodtype: "Product",
    prodcategory: "",
    prodname: "",
    produnitprice: 0,
    prodtaxrate: 0,
    prodlistprice: 0,
    prodstatus: "Active",
  });

  const handleProductSearch = (e) => {
    let custFilter = products.filter((prod) =>
      prod.prodname.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setDispProduct(custFilter);
  };

  ////////////////ADD NEW PRODUCT///////////////
  const handleAddProduct = () => {
    setProdMode("ADD");
    setOpenProduct(true);
  };

  const handleAddProdInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct({
      ...selectedProduct,
      [name]: value,
    });
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const new_prod = {
      subsid: user.subsid,
      subsname: user.subsname,
      prodtype: selectedProduct.prodtype,
      prodcategory: selectedProduct.prodcategory,
      prodname: selectedProduct.prodname,
      produnitprice: Number(selectedProduct.produnitprice),
      prodtaxrate: Number(selectedProduct.prodtaxrate),
      prodlistprice: Number(selectedProduct.prodlistprice),
      prodstatus: selectedProduct.prodstatus,
      createdby: user.usremail,
      createdon: serverTimestamp(),
      modifiedby: "",
      modifiedon: "",
    };

    try {
      setIsLoading(true);

      const collectionRef = collection(appdb, "product");
      const q = query(
        collectionRef,
        where("subsid", "==", user.subsid),
        where("prodname", "==", selectedProduct.prodname)
      );

      const docs = await getDocs(q);

      if (docs.empty) {
        try {
          await addDoc(collection(appdb, "product"), new_prod);
          setProdMode("");
          setOpenProduct(false);
          setSelectedProduct({
            prodtype: "Product",
            prodcategory: "",
            prodname: "",
            produnitprice: 0,
            prodtaxrate: 0,
            prodlistprice: 0,
            prodstatus: "Active",
          });
        } catch (error) {
          setProdError(error);
        }
      } else {
        setProdError("Product with same name already exists");
      }
    } catch (error) {
      setProdError(error);
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    setProdMode("");
    setOpenProduct(false);
    setSelectedProduct({
      prodtype: "Product",
      prodcategory: "",
      prodname: "",
      produnitprice: 0,
      prodtaxrate: 0,
      prodlistprice: 0,
      prodstatus: "Active",
    });
  };

  //////////////EDIT/DELETE PRODUCT////////////////////////////

  const handleEditProduct = (e) => {
    setSelectedProduct({});

    setSelectedProduct({
      prodid: e.currentTarget.dataset.prodid,
      prodtype: e.currentTarget.dataset.prodtype,
      prodcategory: e.currentTarget.dataset.prodcategory,
      prodname: e.currentTarget.dataset.prodname,
      produnitprice: Number(e.currentTarget.dataset.produnitprice),
      prodtaxrate: Number(e.currentTarget.dataset.prodtaxrate),
      prodlistprice: Number(e.currentTarget.dataset.prodlistprice),
      prodstatus: e.currentTarget.dataset.prodstatus,
    });
    setProdMode("EDIT");
    setOpenProduct(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateDoc(doc(appdb, "product", selectedProduct.prodid), {
        prodtype: selectedProduct.prodtype,
        prodcategory: selectedProduct.prodcategory,
        prodname: selectedProduct.prodname,
        produnitprice: Number(selectedProduct.produnitprice),
        prodtaxrate: Number(selectedProduct.prodtaxrate),
        prodlistprice: Number(selectedProduct.prodlistprice),
        prodstatus: selectedProduct.prodstatus,
        modifiedby: user.usremail,
        modifiedon: serverTimestamp(),
      });
      setProdMode("");
      setOpenProduct(false);
    } catch (error) {
      setProdError(error);
    }
    setIsLoading(false);
  };

  const handleDeleteProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await deleteDoc(doc(appdb, "product", selectedProduct.prodid));
      setProdMode("");
      setOpenProduct(false);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  ////Load all products for user logged in subscripiton
  useEffect(() => {
    setHeaderText("Products");
    const fetchProducts = async () => {
      if (Object.keys(user).length === 0) {
        <Navigate to="/login" />;
      } else {
        setIsLoading(true);
        const q = query(
          collection(appdb, "product"),
          where("subsid", "==", user.subsid),
          orderBy("prodname")
        );
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            setProducts(
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
    fetchProducts();
  }, [setHeaderText, user, setProducts]);

  useEffect(() => {
    setDispProduct(products);
  }, [products]);

  //load list of values for available user roles
  const [prodLov, setProdLov] = useState([]);
  useEffect(() => {
    const fetchProdLov = async () => {
      const docRef = doc(appdb, "listofvalues", "product");
      try {
        const response = await getDoc(docRef);
        setProdLov(response.data());
      } catch (error) {
        console.log(error);
        setError(error);
      }
    };
    fetchProdLov();
  }, []);

  useEffect(() => {
    selectedProduct.prodlistprice = Number(
      Number(selectedProduct.produnitprice) +
        Number(selectedProduct.produnitprice) *
          (Number(selectedProduct.prodtaxrate) / 100)
    );
  }, [selectedProduct]);

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
              onChange={handleProductSearch}
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
          <IconButton disabled={isLoading} onClick={handleAddProduct}>
            <AddCircleOutlineIcon color="secondary" />
          </IconButton>
        </Grid>
      </Grid>

      {error && <Alert severity="error">{error}</Alert>}
      {isLoading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      {dispProduct &&
        dispProduct.map((product) => (
          <Card
            key={product.id}
            sx={{
              mt: 0.5,
              "&:before": {
                display: "none",
              },
              borderBottom: "1px solid #dddddd",
              borderRadius: "20px",
              boxShadow: "none",
              ...(product.prodstatus === "Dormant" && {
                background: "#eecaca",
              }),
            }}
          >
            <CardActionArea
              data-prodid={product.id}
              data-prodtype={product.prodtype}
              data-prodcategory={product.prodcategory}
              data-prodname={product.prodname}
              data-produnitprice={product.produnitprice}
              data-prodtaxrate={product.prodtaxrate}
              data-prodlistprice={product.prodlistprice}
              data-prodstatus={product.prodstatus}
              onClick={handleEditProduct}
            >
              <CardContent>
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
                    sx={{ justifyContent: "flex-start" }}
                  >
                    <Typography>{product.prodname}</Typography>
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
                    <Typography>Rs {product.prodlistprice}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}

      <Dialog id="newproduct" open={openProduct} onClose={handleClose}>
        <DialogTitle className="background">
          {prodMode === "ADD" && "Add Product"}
          {prodMode === "EDIT" && "Edit Product"}
        </DialogTitle>
        <form>
          {isLoading && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          )}
          {prodError && <Alert severity="error">{prodError}</Alert>}
          <DialogContent>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12} sm={12} md={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Type</FormLabel>
                  <RadioGroup
                    row
                    required
                    id="prodtype"
                    name="prodtype"
                    value={selectedProduct.prodtype}
                    onChange={handleAddProdInputChange}
                  >
                    {prodLov.prodtype?.map((val) => (
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
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  id="prodcategory"
                  label="Category"
                  name="prodcategory"
                  value={selectedProduct.prodcategory}
                  onChange={handleAddProdInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  required
                  type="text"
                  id="prodname"
                  label="Name"
                  name="prodname"
                  value={selectedProduct.prodname}
                  onChange={handleAddProdInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  required
                  type="number"
                  id="produnitprice"
                  label="Unit Price"
                  name="produnitprice"
                  value={selectedProduct.produnitprice}
                  onChange={handleAddProdInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  required
                  type="number"
                  id="prodtaxrate"
                  label="Tax Rate"
                  name="prodtaxrate"
                  value={selectedProduct.prodtaxrate}
                  onChange={handleAddProdInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  margin="dense"
                  fullWidth
                  size="small"
                  disabled
                  type="number"
                  id="prodlistprice"
                  label="List Price"
                  name="prodlistprice"
                  value={selectedProduct.prodlistprice}
                  onChange={handleAddProdInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Status</FormLabel>
                  <RadioGroup
                    row
                    required
                    id="prodstatus"
                    name="prodstatus"
                    value={selectedProduct.prodstatus}
                    onChange={handleAddProdInputChange}
                  >
                    {prodLov.prodstatus?.map((val) => (
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
            {prodMode === "ADD" && (
              <Button onClick={handleCreateProduct}>Add</Button>
            )}
            {prodMode === "EDIT" && (
              <>
                <Button color="info" onClick={handleUpdateProduct}>
                  Update
                </Button>
                <Button color="error" onClick={handleDeleteProduct}>
                  Delete
                </Button>
              </>
            )}
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
