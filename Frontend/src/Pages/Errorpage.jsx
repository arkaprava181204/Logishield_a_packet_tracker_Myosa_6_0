import React from "react"

export default function Errorpage(){
    return(
        <div className = "min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 scroll-smooth">
            <h1 className="text-6xl text-white">ERROR</h1>
            <p className = "text-3xl text-red-600">Couldn't able to scan QR</p>
        </div>
    );
}