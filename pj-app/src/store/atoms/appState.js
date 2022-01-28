import { atom } from "recoil";

/////////Global States/////////////
export const headerTextState = atom({
  key: "headertext",
  default: "PunjabJewellers - Global",
});

export const userDetailsState = atom({
  key: "userdetail",
  default: {},
});

/////////Customer States//////////////////
export const customerCountState = atom({
  key: "customerCount",
  default: 0,
});

export const drawCountState = atom({
  key: "drawCount",
  default: 0,
});

export const customerSearchState = atom({
  key: "customers",
  default: [],
});


export const DispCustomerState = atom({
  key: "Customer",
  default: [],
});


export const productsState = atom({
  key: "products",
  default: [],
});

export const usersState = atom({
  key: "users",
  default: [],
});

export const appointmentsState = atom({
  key: "appointments",
  default: [],
});

export const editVisitState = atom({
  key: "editvisit",
  default: "",
});

export const phoneNoState = atom({
  key: "phoneNumbers",
  default: []
}) 

export const monthState = atom({
  key: "months",
  default: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
}) 

export const timeSelectValueState = atom({
  key: "selecttimevalue",
  default: [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
    "00:00",
    "00:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
  ],
});

const appState = {
  customerSearchState,
  customerCountState,
  headerTextState,
  userDetailsState,
  productsState,
  appointmentsState,
  timeSelectValueState,
  editVisitState,
  DispCustomerState,
  phoneNoState,
  monthState
};

export default appState;
