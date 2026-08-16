import React from 'react'
import { useLocation } from "react-router-dom"

export default function Analysis(){
    const location = useLocation();
    const result = location.state?.result;
    const data = result?.data;
    const record = data?.[0];
    return(
        <div className= "pt-6 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 scroll-smooth">
            <header className= "bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)] flex items-center justify-center h-16 p-4 border-2 border-cyan-400 rounded-3xl">
                <h1 className= "text-3xl text-white font-bold">ANALYSIS</h1>
            </header>
            <div>
                <h2 className="text-5xl text-white font-bold pt-4">STATUS:</h2>
                <div className="min-h-screen grid grid-cols-2 p-6 gap-4">
                    <div className=" flex flex-row justify-center flex items-center gap-6 bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)] p-4 border-2 border-cyan-400 rounded-3xl">
                        <h2 className= "text-4xl text-yellow-400">Pressure:</h2>
                        <div className= "h-40 w-40 bg-blue-300 rounded-3xl flex items-center justify-center">
                            <p className= "text-5xl text-black">{record?.Pressure}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 justify-center flex items-center bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)] border-2 border-cyan-400 rounded-3xl">
                        <h2 className= "text-4xl text-yellow-400">Acceleration:</h2>
                        <div className="grid grid-cols-3 gap-10 flex justify-center">
                            <div className= "h-40 w-40 bg-blue-300 rounded-3xl flex items-center justify-center">
                                <h4 className= "text-2xl text-black font-bold p-4">AX:</h4>
                                <p className= "text-3xl text-black">{record?.AX}</p>
                            </div>
                            <div className= "h-40 w-40 bg-blue-300 rounded-3xl flex items-center justify-center">
                                <h4 className= "text-2xl text-black font-bold p-4">AY:</h4>
                                <p className= "text-3xl text-black">{record?.AY}</p>
                            </div>
                            <div className= "h-40 w-40 bg-blue-300 rounded-3xl flex items-center justify-center">
                                <h4 className= "text-2xl text-black font-bold p-4">AZ:</h4>
                                <p className= "text-3xl text-black">{record?.AZ}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center flex items-center gap-6 bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)] p-4 border-2 border-cyan-400 rounded-3xl">
                        <h2 className= "text-4xl text-yellow-400">Gyro:</h2>
                        <div className="grid grid-cols-3 gap-10 flex justify-center">
                            <div className= "h-40 w-40 bg-blue-300 rounded-3xl flex items-center justify-center">
                                <h4 className= "text-2xl text-black font-bold p-4">GX:</h4>
                                <p className= "text-3xl text-black">{record?.GX}</p>
                            </div>  
                            <div className= "h-40 w-40 bg-blue-300 rounded-3xl flex items-center justify-center">
                                <h4 className= "text-2xl text-black font-bold p-4">GY:</h4>
                                <p className= "text-3xl text-black">{record?.GY}</p>
                            </div>
                            <div className= "h-40 w-40 bg-blue-300 rounded-3xl flex items-center justify-center">
                                <h4 className= "text-2xl text-black font-bold p-4">GZ:</h4>
                                <p className= "text-3xl text-black">{record?.GZ}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center flex items-center gap-6 bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)] p-4 border-2 border-cyan-400 rounded-3xl">
                        <h2 className= "text-4xl text-yellow-400">Light:</h2>
                        <div className="grid grid-cols-3 gap-10 flex justify-center">
                            <div className= "h-40 w-40 bg-blue-300 rounded-3xl flex items-center justify-center">
                                <h4 className= "text-2xl text-black font-bold p-4">R:</h4>
                                <p className= "text-3xl text-black">{record?.RED}</p>
                            </div>
                            <div className= "h-40 w-40 bg-blue-300 rounded-3xl flex items-center justify-center">
                                <h4 className= "text-2xl text-black font-bold p-4">G:</h4>
                                <p className= "text-3xl text-black">{record?.GREEN}</p>
                            </div>
                            <div className= "h-40 w-40 bg-blue-300 rounded-3xl flex items-center justify-center">
                                <h4 className= "text-2xl text-black font-bold p-4">B:</h4>
                                <p className= "text-3xl text-black">{record?.BLUE}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>   
    );
}