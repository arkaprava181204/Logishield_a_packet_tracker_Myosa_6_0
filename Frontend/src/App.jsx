import { useState } from 'react'
import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home"
import Scan from "./Pages/Scan"
import Errorpage from './Pages/Errorpage'
import Analysis from "./Pages/Analysis_demo"
import Header from './Components/Header'
import Footer from './Components/Footer'


function App() {
    return(
        <React.Fragment>
            <BrowserRouter>
                <Header/>
                <Routes>
                    <Route path ="/" element = {<Home/>}/>
                    <Route path ="/Scan" element = {<Scan/>}/>
                    <Route path ="/Analysis" element = {<Analysis/>}/>
                    <Route path ="/Error" element = {<Errorpage/>}/>
                </Routes>
                <Footer/>
            </BrowserRouter>
        </React.Fragment>
    );
}

export default App
