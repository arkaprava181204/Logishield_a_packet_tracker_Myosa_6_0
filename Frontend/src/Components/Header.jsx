import { Link } from "react-router-dom";
import { useState } from 'react'
import React from 'react';

export default function Header(){
    return(
    <header className=" scroll-smooth h-16 px-8 flex items-center justify-between bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)] text-white border-b border-white/10 rounded-lg">
        <div className="text-cyan-400 text-2xl font-black tracking-tight">
            <Link to = "/">LogiShield</Link>
        </div>
        <p className = "font-extrabold text-green-400">Track Your Package Life</p>
        <div className="flex gap-10">
            <Link to = "/">Home</Link>
            <Link to = "/Scan">Scan</Link>
            <a href="#contact">Contacts</a>
        </div>
    </header>
    );
}