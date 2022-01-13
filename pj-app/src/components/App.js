import React from "react"
import { Container } from "react-bootstrap"
import Login from "./Login"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Route } from "react-router-dom"
import PrivateRoute from "./PrivateRoute"
import Dashboard from "./Dashboard"

function App() {
  return (
    <Container
    className="d-flex align-items-center justify-content-center"
    style={{ minHeight: "100vh" }}
  >
    <div className="w-100" style={{ maxWidth: "400px" }}>
    <Router>
          <AuthProvider>
          <PrivateRoute exact path="/" component={Dashboard} />
              <Route path="/login" component={Login} />              
          </AuthProvider>
  </Router>
  </div>
    </Container>
  );
}

export default App;
