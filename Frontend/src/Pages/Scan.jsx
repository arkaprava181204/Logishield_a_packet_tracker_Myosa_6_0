import { useState } from 'react'
import React from 'react'
import ImageCropper from '../Components/ImageCropper'

export default function Scan() {
    return(
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 scroll-smooth">
            <div className="bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)] p-4 border-2 border-cyan-400 rounded-3xl">
                <ImageCropper/>
            </div>
            <div className= "grid grid-cols-2 text-white p-6 gap-4 ">
                <div className="bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)] p-4 border-2 border-cyan-400 rounded-3xl">
                    <h3 font-bold text-white>Step 1</h3>
                    <p className="text-white">Press the button in the module 3 times</p>
                </div>

                <div className="bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)] p-4 border-2 border-cyan-400 rounded-3xl">
                    <h3 font-bold text-white>Step 2</h3>
                    <p className="text-white">Press the button in the module 3 times</p>
                </div>

                <div className="bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)] p-4 border-2 border-cyan-400 rounded-3xl">
                    <h3 font-bold text-white>Step 1</h3>
                    <p className="text-white">Press the button in the module 3 times</p>
                </div>

                <div className="bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)] p-4 border-2 border-cyan-400 rounded-3xl">
                    <h3 font-bold text-white>Step 1</h3>
                    <p className="text-white">Press the button in the module 3 times</p>
                </div>

                <div className="bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)] p-4 border-2 border-cyan-400 rounded-3xl">
                    <h3 font-bold text-white>Step 1</h3>
                    <p className="text-white">Press the button in the module 3 times</p>
                </div>

                <div className="bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)] p-4 border-2 border-cyan-400 rounded-3xl">
                    <h3 font-bold text-white>Step 1</h3>
                    <p className="text-white">Press the button in the module 3 times</p>
                </div>
            </div>
        </div>
    );
}

