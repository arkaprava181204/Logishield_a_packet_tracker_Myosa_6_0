import { useState } from 'react'
import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home"
import Scan from "./Pages/Scan"
import Header from './Components/Header'



function App() {
    return(
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path ="/" element = {<Home/>}/>
                <Route path ="/Scan" element = {<Scan/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App
