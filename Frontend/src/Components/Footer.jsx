import React from 'react'

export default function Footer(){
    return(
        <footer
            id="contact"
            className="
                min-h-50
                px-4 sm:px-8
                py-8
                flex
                flex-col
                md:flex-row
                items-center
                justify-between
                gap-10 md:gap-6
                bg-[radial-gradient(circle_at_top_right,_#1e3a8a,_#020617_45%)]
                text-white
                border-b
                border-white/10
                rounded-lg
            "
        >

            <div className="
                flex
                flex-col
                gap-2
                items-center
                text-center
            ">
                <h2 className="font-bold text-white text-2xl sm:text-3xl">
                    CREATORS
                </h2>

                <span className="text-white">
                    Suprio Dutta
                </span>

                <span className="text-white">
                    Subhadeep Sardar
                </span>

                <span className="text-white">
                    Arkaprava Bhattacharya
                </span>
            </div>


            <div className="
                flex
                flex-col
                gap-2
                items-center
                text-center
            ">
                <h2 className="font-bold text-white text-2xl sm:text-3xl">
                    Email
                </h2>

                <span className="text-white break-all">
                    inform.suprio@gmail.com
                </span>

                <span className="text-white break-all">
                    ssubhadeep500@gmail.com
                </span>

                <span className="text-white break-all">
                    arkaprava181204@gmail.com
                </span>
            </div>


            <div className="
                flex
                flex-col
                gap-2
                items-center
                text-center
            ">
                <h2 className="font-bold text-white text-2xl sm:text-3xl">
                    Linked In
                </h2>

                <a
                    href="https://www.linkedin.com/in/suprio-dutta-522470288/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white"
                >
                    Suprio Dutta
                </a>

                <a
                    href="https://www.linkedin.com/in/subhadeep-sardar-67903030a/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white"
                >
                    Subhadeep Sardar
                </a>

                <a
                    href="https://www.linkedin.com/in/arkaprava-bhattacharya-976926308/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white"
                >
                    Arkaprava Bhattacharya
                </a>
            </div>

        </footer>
    );
}

