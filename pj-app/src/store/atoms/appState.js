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
export const customerState = atom({
  key: "customer",
  default: {},
});

export const selectedCustomerState = atom({
  key: "customer",
  default: {},
});

export const drawState = atom({
  key: "drawState",
  default: [],
});

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

export const allCustomerState = atom({
  key: "allcustomer",
  default: [],
});


export const manageDrawState = atom({
  key: "manageDraw",
  default: {},
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

export const draw_detail = atom({
  key: "draw",
  default: {
    customerId: "07846861338-c",
    customerPhone: "07846861338",
    payment: [
        {id:1,month: 'January',paymentDate: "2022-02-28",paymentMethod: "Cash"},
          {id:2,month: 'February',paymentDate: "2022-02-28",paymentMethod: "Card"},
          {id:3,month: 'March',paymentDate: "",paymentMethod: ""},
          {id:4,month: 'April',paymentDate: "",paymentMethod: ""},
          {id:5,month: 'May',paymentDate: "",paymentMethod: ""},
          {id:6,month: 'June',paymentDate: "",paymentMethod: ""},
          {id:7,month: 'July',paymentDate: "",paymentMethod: ""},
          {id:8,month: 'August',paymentDate: "",paymentMethod: ""},
          {id:9,month: 'September',paymentDate: "",paymentMethod: ""},
          {id:10,month: 'October',paymentDate: "",paymentMethod: ""},
          {id:11,month: 'November',paymentDate: "",paymentMethod: ""},
          {id:12,month: 'December',paymentDate: "",paymentMethod: ""}
    ]
  }
});
export const userState = atom({
  key: "email",
  default: {},
});


const appState = {
  customerSearchState,
  customerCountState,
  headerTextState,
  userDetailsState,
  productsState,
  appointmentsState,
  editVisitState,
  DispCustomerState,
  phoneNoState,
  monthState,
  draw_detail,
  customerState,
  selectedCustomerState,
  drawState,
  manageDrawState,
  userState
};

export default appState;
