import { useState } from 'react'
import React from 'react'
import ImageCropper from '../Components/Image_cropper_Demo'
import step1 from '../assets/Step_1.png'
import step2 from '../assets/Step_2.png'
import step3 from '../assets/Step_3.png'
import step4 from '../assets/Step_4.png'
import step5 from '../assets/Step_5.png'
import step6 from '../assets/Step_6.png'

export default function Scan() {
    return(
        <div className="
            min-h-screen
            pt-5
            bg-gradient-to-br
            from-slate-950
            via-slate-900
            to-blue-950
            px-4
            sm:px-6
            scroll-smooth
        ">

            {/* Upload / Cropper */}
            <div className="
                bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)]
                gap-4
                p-4
                border-2
                border-cyan-400
                rounded-3xl
            ">
                <ImageCropper/>
            </div>


            {/* Instructions */}
            <div className="
                min-h-screen
                grid
                grid-cols-1
                lg:grid-cols-2
                p-2
                sm:p-6
                gap-4
            ">


                {/* STEP 1 */}
                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    items-center
                    justify-between
                    gap-4
                    bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)]
                    p-4
                    border-2
                    border-cyan-400
                    rounded-3xl
                ">

                    <img
                        src={step1}
                        alt="step 1"
                        className="
                            w-full
                            max-w-64
                            h-auto
                            object-contain
                        "
                    />

                    <p className="
                        text-white
                        text-2xl
                        sm:text-3xl
                        lg:text-4xl
                        xl:text-5xl
                        text-center
                        sm:text-left
                    ">
                        Press the button in the module 3 times
                    </p>

                </div>


                {/* STEP 2 */}
                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    items-center
                    justify-between
                    gap-4
                    bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)]
                    p-4
                    border-2
                    border-cyan-400
                    rounded-3xl
                ">

                    <img
                        src={step2}
                        alt="step 2"
                        className="
                            w-full
                            max-w-64
                            h-auto
                            object-contain
                        "
                    />

                    <p className="
                        text-white
                        text-2xl
                        sm:text-3xl
                        lg:text-4xl
                        xl:text-5xl
                        text-center
                        sm:text-left
                    ">
                        Wait for the QR code to generate
                    </p>

                </div>


                {/* STEP 3 */}
                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    items-center
                    justify-between
                    gap-4
                    bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)]
                    p-4
                    border-2
                    border-cyan-400
                    rounded-3xl
                ">

                    <img
                        src={step3}
                        alt="step 3"
                        className="
                            w-full
                            max-w-64
                            h-auto
                            object-contain
                        "
                    />

                    <p className="
                        text-white
                        text-2xl
                        sm:text-3xl
                        lg:text-4xl
                        xl:text-5xl
                        text-center
                        sm:text-left
                    ">
                        Take a picture of the QR
                    </p>

                </div>


                {/* STEP 4 */}
                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    items-center
                    justify-between
                    gap-4
                    bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)]
                    p-4
                    border-2
                    border-cyan-400
                    rounded-3xl
                ">

                    <img
                        src={step4}
                        alt="step 4"
                        className="
                            w-full
                            max-w-64
                            h-auto
                            object-contain
                        "
                    />

                    <p className="
                        text-white
                        text-2xl
                        sm:text-3xl
                        lg:text-4xl
                        xl:text-5xl
                        text-center
                        sm:text-left
                    ">
                        Upload the QR
                    </p>

                </div>


                {/* STEP 5 */}
                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    items-center
                    justify-between
                    gap-4
                    bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)]
                    p-4
                    border-2
                    border-cyan-400
                    rounded-3xl
                ">

                    <img
                        src={step5}
                        alt="step 5"
                        className="
                            w-full
                            max-w-64
                            h-auto
                            object-contain
                        "
                    />

                    <p className="
                        text-white
                        text-2xl
                        sm:text-3xl
                        lg:text-4xl
                        xl:text-5xl
                        text-center
                        sm:text-left
                    ">
                        Crop to the QR Area
                    </p>

                </div>


                {/* STEP 6 */}
                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    items-center
                    justify-between
                    gap-4
                    bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)]
                    p-4
                    border-2
                    border-cyan-400
                    rounded-3xl
                ">

                    <img
                        src={step6}
                        alt="step 6"
                        className="
                            w-full
                            max-w-64
                            h-auto
                            object-contain
                        "
                    />

                    <p className="
                        text-white
                        text-2xl
                        sm:text-3xl
                        lg:text-4xl
                        xl:text-5xl
                        text-center
                        sm:text-left
                    ">
                        Click on the Scan
                    </p>

                </div>

            </div>

        </div>
    );
}