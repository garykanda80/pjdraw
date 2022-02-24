import React from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { RecoilRoot } from "recoil";

import LoginPage from "./pages/LoginPage";
import ForgetPassword from "./pages/ForgetPassword";
import AppLayout from "./pages/AppLayout";
import Customer from "./pages/Customer";
// import CreateCustomer from "./pages/CreateCustomer";
// import Products from "./pages/Products";
// import Visits from "./pages/Visits";
// import CreateVisits from "./pages/CreateVisits";
// import DisplayExpenses from "./pages/DisplayExpenses";
import Home from "./pages/Home";
import Users from "./pages/Users";
import EditCustomer from "./pages/EditCustomer";
import Draw from "./pages/Draw";
import ManageDraw from "./pages/ManageDraw";
import ManageCustomer from "./pages/ManageCustomer";

function RequireAuth({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  return currentUser ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
}

function App() {
  return (
    <div className="root">
      <RecoilRoot>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgetPassword />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <AppLayout />
                </RequireAuth>
              }
            >
              <Route path="/" element={<Home />} />
              {/* <Route path="visits" element={<Visits />}>
                <Route path="editvisit" element={<EditVisit />} />
              </Route>
              <Route path="createvisits" element={<CreateVisits />} />              
              <Route path="expenses" element={<DisplayExpenses />} />
              <Route path="customers" element={<DisplayCustomers />} />
              <Route path="createcustomer" element={<CreateCustomer />} /> */}
              <Route path="customer" element={<Customer />} /> 
              <Route path="editcustomer" element={<EditCustomer />} />
              <Route path="users" element={<Users />} />
              <Route path="draw" element={<Draw />} />
              <Route path="managedraw" element={<ManageDraw />} />
              <Route path="managecustomer" element={<ManageCustomer />} />
            </Route>
          </Routes>
        </AuthProvider>
      </RecoilRoot>
    </div>
  );
}

export default App;
