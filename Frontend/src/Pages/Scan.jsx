import { useState } from 'react'
import React from 'react'
import ImageCropper from '../Components/ImageCropper'
import step1 from '../assets/Step_1.png'
import step2 from '../assets/Step_2.png'
import step3 from '../assets/Step_3.png'
import step4 from '../assets/Step_4.png'
import step5 from '../assets/Step_5.png'
import step6 from '../assets/Step_6.png'

export default function Scan() {
    return(
        <div className="min-h-screen  pt-5 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 scroll-smooth">
            <div className="bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)] gap-4 p-4 border-2 border-cyan-400 rounded-3xl">
                <ImageCropper/>
            </div>
            <div className= "min-h-screen grid grid-cols-2 p-6 gap-4 ">
                <div className="flex flex-row justify-between gap-4 bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)] p-4 border-2 border-cyan-400 rounded-3xl">
                    <img src = {step1} alt = "step 1" className= "w-64 h-auto"/>
                    <p className="text-white text-5xl">Press the button in the module 3 times</p>
                </div>

                <div className="flex flex-row justify-between gap-4 bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)] p-4 border-2 border-cyan-400 rounded-3xl">
                    <img src = {step2} alt = "step 2" className= "w-64 h-auto"/>
                    <p className="text-white text-5xl">Wait for the QR code to generate</p>
                </div>

                <div className="flex flex-row justify-between gap-4 bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)] p-4 border-2 border-cyan-400 rounded-3xl">
                    <img src = {step3} alt = "step 3" className= "w-64 h-auto"/>
                    <p className="text-white text-5xl">Take a picture of the QR</p>
                </div>

                <div className="flex flex-row gap-4 bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)] p-4 border-2 border-cyan-400 rounded-3xl">
                    <img src = {step4} alt = "step 4" className= "w-64 h-auto"/>
                    <p className="text-white text-5xl">Upload the QR</p>
                </div>

                <div className="flex flex-row justify-between gap-4 bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)] p-4 border-2 border-cyan-400 rounded-3xl">
                    <img src = {step5} alt = "step 5" className= "w-64 h-auto"/>
                    <p className="text-white text-5xl">Crop to the QR Area</p>
                </div>

                <div className="flex flex-row bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)] p-4 border-2 border-cyan-400 rounded-3xl">
                    <img src = {step6} alt = "step 6" className= "w-64 h-auto"/>
                    <p className="text-white text-5xl">Click on the Scan</p>
                </div>
            </div>
        </div>
    );
}

