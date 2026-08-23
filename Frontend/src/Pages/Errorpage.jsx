import React from "react"

export default function Errorpage(){
    return(
        <div className="
            min-h-screen
            flex
            flex-col
            items-center
            justify-center
            bg-gradient-to-br
            from-slate-950
            via-slate-900
            to-blue-950
            px-4
            sm:px-6
            scroll-smooth
            text-center
        ">

            <h1 className="
                text-5xl
                sm:text-6xl
                text-white
            ">
                ERROR
            </h1>

            <p className="
                text-xl
                sm:text-2xl
                md:text-3xl
                text-red-600
                mt-2
            ">
                Couldn't able to scan QR
            </p>

        </div>
    );
}