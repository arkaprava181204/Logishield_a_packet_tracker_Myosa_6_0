import React from 'react'
import Banner from  '../assets/Banner.png'

function Home() {
    return(
        <div  className="
            min-h-screen
            bg-gradient-to-br
             from-slate-950
             via-slate-900
             to-blue-950
             px-6
             scroll-smooth
        ">
            <h1 className = "flex flex-col items-center text-8xl py-6 text-white font-[Fredoka]">ABOUT US</h1>
            <p className="text-4xl text-center text-white">LogiShield is a smart security system that protects valuable packages from being secretly opened or tampered with during delivery. It uses sensors to detect unusual movement, pressure, or physical changes and records exactly when something happens—even when there is no internet or GPS signal. This gives you clear proof of when and where a package was tampered with, making logistics safer, smarter, and more trustworthy.</p>
            <img src = {Banner} alt= "Banner"/>
        </div>
        
    );
}
export default Home
