import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import AdminHomePage from './Pages/AdminHomePage';
import SignUpLoginProtectRoutes from './Routes/protectedRoutes/SignUpLoginProtectRoutes'
import AuthProtectionRoutes from './Routes/protectedRoutes/AuthProtectionRoutes';
import AddNewProductPage from './Pages/AddNewProductPage';


function App() {

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Router>
        <Routes>
          <Route path="/"
            element={<SignUpLoginProtectRoutes element={LoginPage} />}
          />
          <Route path="/register"
            element={<SignUpLoginProtectRoutes element={SignUpPage} />}
          />
          <Route path="/adminHome"
            element={<AuthProtectionRoutes element={AdminHomePage} />}
          />
          <Route path="/addNewProduct"
            element={<AuthProtectionRoutes element={AddNewProductPage} />}
          />
        </Routes>
      </Router>
    </SnackbarProvider>

  )
}

export default App
