// import './App.css';
import {
  BrowserRouter as Router, Routes, Route
} from "react-router-dom";
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import React from 'react';
import Obat from "./pages/Obat";
import Stok from "./pages/StokIn";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Dashboard/>}></Route>
          <Route path='/login' element={<LoginPage/>}></Route>
          <Route path='/register' element={<RegisterPage/>}></Route>
          <Route path='/obat' element={<Obat/>}></Route>
          <Route path='/obat-masuk' element={<Stok/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
