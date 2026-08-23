import React from "react";
import { useLocation } from "react-router-dom";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import { dummyData } from "../Components/Dummy";


export default function Analysis() {

    const location = useLocation();

    // --------------------------------------------------
    // DATA
    // --------------------------------------------------

    const result = location.state?.result;

    // Use real API data if available.
    // Otherwise use dummy data.
    const data = result?.data || [];



    // Latest record
    const record = data.length > 0
        ? data[data.length - 1]
        : null;


    // --------------------------------------------------
    // FORMAT NUMBER
    // --------------------------------------------------

    const formatNumber = (value) => {

        if (value === undefined || value === null) {
            return "--";
        }

        return typeof value === "number"
            ? value.toFixed(2)
            : value;
    };


    // --------------------------------------------------
    // PACKAGE LIFE CALCULATION
    // --------------------------------------------------

    const packageLifeData = data.map((item) => {

        // Acceleration magnitude
        const acceleration = Math.sqrt(
            Math.pow(item.AX || 0, 2) +
            Math.pow(item.AY || 0, 2) +
            Math.pow(item.AZ || 0, 2)
        );


        // Gyroscope magnitude
        const gyro = Math.sqrt(
            Math.pow(item.GX || 0, 2) +
            Math.pow(item.GY || 0, 2) +
            Math.pow(item.GZ || 0, 2)
        );


        /*
            Demo Package Life calculation.

            Higher:
            - acceleration
            - gyro movement
            - pressure

            = lower package life
        */

        const movementPenalty =
            Math.min(acceleration * 5, 25);

        const gyroPenalty =
            Math.min(gyro * 0.15, 25);

        const pressurePenalty =
            Math.min((item.P || 0) * 3, 15);


        const packageLife =
            100 -
            movementPenalty -
            gyroPenalty -
            pressurePenalty;


        return {
            time: item.TIME,

            packageLife: Math.max(
                0,
                Math.min(100, packageLife)
            )
        };
    });


    // Latest package life
    const currentPackageLife =
        packageLifeData.length > 0
            ? packageLifeData[packageLifeData.length - 1].packageLife
            : null;


    // --------------------------------------------------
    // SENSOR CARD
    // --------------------------------------------------

    const SensorCard = ({
        title,
        icon,
        children
    }) => {

        return (
            <div className="
                bg-slate-900/70
                border border-slate-700
                rounded-2xl
                p-5
                shadow-lg
                hover:border-cyan-400/60
                transition
            ">

                <div className="flex items-center gap-3 mb-5">

                    <div className="
                        h-10
                        w-10
                        rounded-xl
                        bg-cyan-400/10
                        flex
                        items-center
                        justify-center
                        text-xl
                    ">
                        {icon}
                    </div>


                    <h2 className="
                        text-xl
                        font-semibold
                        text-white
                    ">
                        {title}
                    </h2>

                </div>


                {children}

            </div>
        );
    };


    // --------------------------------------------------
    // VALUE BOX
    // --------------------------------------------------

    const ValueBox = ({
        label,
        value,
        unit = ""
    }) => {

        return (
            <div className="
                bg-slate-800/80
                rounded-xl
                p-4
                border
                border-slate-700
            ">

                <p className="
                    text-xs
                    text-slate-400
                    uppercase
                    tracking-wider
                ">
                    {label}
                </p>


                <div className="
                    mt-2
                    flex
                    items-baseline
                    gap-1
                ">

                    <span className="
                        text-2xl
                        font-bold
                        text-white
                    ">
                        {formatNumber(value)}
                    </span>


                    {unit && (
                        <span className="
                            text-sm
                            text-slate-400
                        ">
                            {unit}
                        </span>
                    )}

                </div>

            </div>
        );
    };


    // --------------------------------------------------
    // NO DATA
    // --------------------------------------------------

    if (!record) {

        return (
            <div className="
                min-h-screen
                bg-slate-950
                text-white
                px-4
                sm:px-6
                lg:px-10
                py-6
            ">

                <div className="
                    max-w-7xl
                    mx-auto
                    bg-slate-900
                    border
                    border-slate-700
                    rounded-2xl
                    p-10
                    text-center
                ">

                    <p className="
                        text-slate-400
                        text-lg
                    ">
                        No sensor data available.
                    </p>

                </div>

            </div>
        );
    }


    // --------------------------------------------------
    // MAIN UI
    // --------------------------------------------------

    return (

        <div className="
            min-h-screen
            bg-slate-950
            text-white
            px-4
            sm:px-6
            lg:px-10
            py-6
        ">


            {/* =====================================================
                HEADER
            ====================================================== */}

            <header className="
                max-w-7xl
                mx-auto
                mb-8
            ">

                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-4
                ">

                    <div>

                        <p className="
                            text-cyan-400
                            text-sm
                            font-medium
                            tracking-widest
                        ">
                            SENSOR MONITORING
                        </p>


                        <h1 className="
                            text-3xl
                            sm:text-4xl
                            font-bold
                            mt-1
                        ">
                            Analysis Dashboard
                        </h1>


                        <p className="
                            text-slate-400
                            mt-2
                        ">
                            Real-time sensor readings and package analysis
                        </p>

                    </div>


                    {/* SENSOR STATUS */}

                    <div className="
                        flex
                        items-center
                        gap-3
                        bg-slate-900
                        border
                        border-slate-700
                        rounded-xl
                        px-4
                        py-3
                    ">

                        <div className="
                            h-3
                            w-3
                            rounded-full
                            bg-green-400
                            animate-pulse
                        " />


                        <div>

                            <p className="
                                text-xs
                                text-slate-400
                            ">
                                SENSOR
                            </p>


                            <p className="
                                font-semibold
                            ">
                                {record.M || "Unknown"}
                            </p>

                        </div>

                    </div>

                </div>

            </header>


            <main className="
                max-w-7xl
                mx-auto
            ">


                {/* =================================================
                    LATEST READING
                ================================================== */}

                <section className="mb-8">

                    <div className="
                        flex
                        items-center
                        justify-between
                        mb-4
                    ">

                        <div>

                            <h2 className="
                                text-xl
                                font-semibold
                            ">
                                Latest Reading
                            </h2>


                            <p className="
                                text-sm
                                text-slate-400
                            ">
                                Most recent sensor measurement
                            </p>

                        </div>


                        <div className="text-right">

                            <p className="
                                text-sm
                                text-slate-400
                            ">
                                {record.DATE}
                            </p>


                            <p className="
                                text-sm
                                text-slate-500
                            ">
                                {record.TIME}
                            </p>

                        </div>

                    </div>


                    {/* TOP STAT CARDS */}

                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-4
                        gap-4
                    ">


                        {/* PRESSURE */}

                        <div className="
                            bg-gradient-to-br
                            from-cyan-500/20
                            to-slate-900
                            border
                            border-cyan-400/30
                            rounded-2xl
                            p-5
                        ">

                            <p className="
                                text-sm
                                text-slate-400
                            ">
                                Pressure
                            </p>


                            <p className="
                                text-4xl
                                font-bold
                                mt-2
                            ">
                                {formatNumber(record.P)}
                            </p>


                            <p className="
                                text-xs
                                text-slate-500
                                mt-2
                            ">
                                Current pressure
                            </p>

                        </div>


                        {/* ACCELERATION */}

                        <div className="
                            bg-slate-900
                            border
                            border-slate-700
                            rounded-2xl
                            p-5
                        ">

                            <p className="
                                text-sm
                                text-slate-400
                            ">
                                Acceleration
                            </p>


                            <p className="
                                text-2xl
                                font-bold
                                mt-2
                            ">
                                {formatNumber(record.AX)}
                            </p>


                            <p className="
                                text-xs
                                text-slate-500
                                mt-1
                            ">
                                X axis
                            </p>

                        </div>


                        {/* GYROSCOPE */}

                        <div className="
                            bg-slate-900
                            border
                            border-slate-700
                            rounded-2xl
                            p-5
                        ">

                            <p className="
                                text-sm
                                text-slate-400
                            ">
                                Gyroscope
                            </p>


                            <p className="
                                text-2xl
                                font-bold
                                mt-2
                            ">
                                {formatNumber(record.GX)}
                            </p>


                            <p className="
                                text-xs
                                text-slate-500
                                mt-1
                            ">
                                X axis
                            </p>

                        </div>


                        {/* PACKAGE LIFE */}

                        <div className="
                            bg-gradient-to-br
                            from-emerald-500/20
                            to-slate-900
                            border
                            border-emerald-400/30
                            rounded-2xl
                            p-5
                        ">

                            <p className="
                                text-sm
                                text-slate-400
                            ">
                                Package Life
                            </p>


                            <p className="
                                text-4xl
                                font-bold
                                mt-2
                                text-emerald-400
                            ">
                                {currentPackageLife !== null
                                    ? `${currentPackageLife.toFixed(1)}%`
                                    : "--"}
                            </p>


                            <p className="
                                text-xs
                                text-slate-500
                                mt-2
                            ">
                                Current estimated condition
                            </p>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    PACKAGE LIFE GRAPH
                ================================================== */}

                <section className="
                    bg-slate-900
                    border
                    border-slate-700
                    rounded-2xl
                    p-5
                    mb-8
                ">


                    {/* GRAPH HEADER */}

                    <div className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        mb-6
                    ">

                        <div>

                            <h2 className="
                                text-xl
                                font-semibold
                            ">
                                Package Life
                            </h2>


                            <p className="
                                text-sm
                                text-slate-400
                                mt-1
                            ">
                                Package condition calculated from sensor readings
                            </p>

                        </div>


                        <div className="
                            mt-3
                            sm:mt-0
                            text-right
                        ">

                            <p className="
                                text-xs
                                text-slate-500
                            ">
                                CURRENT LIFE
                            </p>


                            <p className="
                                text-2xl
                                font-bold
                                text-emerald-400
                            ">
                                {currentPackageLife !== null
                                    ? `${currentPackageLife.toFixed(1)}%`
                                    : "--"}
                            </p>

                        </div>

                    </div>


                    {/* GRAPH */}

                    <div className="
                        w-full
                        h-[350px]
                    ">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <AreaChart
                                data={packageLifeData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 0,
                                    bottom: 10
                                }}
                            >

                                <defs>

                                    <linearGradient
                                        id="packageLifeGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >

                                        <stop
                                            offset="5%"
                                            stopColor="#34d399"
                                            stopOpacity={0.35}
                                        />

                                        <stop
                                            offset="95%"
                                            stopColor="#34d399"
                                            stopOpacity={0}
                                        />

                                    </linearGradient>

                                </defs>


                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#334155"
                                />


                                <XAxis
                                    dataKey="time"
                                    stroke="#94a3b8"
                                    tick={{
                                        fill: "#94a3b8",
                                        fontSize: 12
                                    }}
                                    tickLine={false}
                                />


                                <YAxis
                                    domain={[0, 100]}
                                    stroke="#94a3b8"
                                    tick={{
                                        fill: "#94a3b8",
                                        fontSize: 12
                                    }}
                                    tickLine={false}
                                    tickFormatter={(value) =>
                                        `${value}%`
                                    }
                                />


                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#0f172a",
                                        border: "1px solid #334155",
                                        borderRadius: "10px",
                                        color: "#fff"
                                    }}
                                    labelStyle={{
                                        color: "#94a3b8"
                                    }}
                                    formatter={(value) => [
                                        `${Number(value).toFixed(1)}%`,
                                        "Package Life"
                                    ]}
                                />


                                <Area
                                    type="monotone"
                                    dataKey="packageLife"
                                    stroke="#34d399"
                                    strokeWidth={3}
                                    fill="url(#packageLifeGradient)"
                                    dot={{
                                        r: 3,
                                        fill: "#34d399"
                                    }}
                                    activeDot={{
                                        r: 6
                                    }}
                                />

                            </AreaChart>

                        </ResponsiveContainer>

                    </div>

                </section>


                {/* =================================================
                    SENSOR CARDS
                ================================================== */}

                <section className="
                    grid
                    grid-cols-1
                    lg:grid-cols-2
                    gap-5
                    mb-8
                ">


                    {/* ACCELERATION */}

                    <SensorCard
                        title="Acceleration"
                        icon="↗"
                    >

                        <div className="
                            grid
                            grid-cols-1
                            sm:grid-cols-3
                            gap-3
                        ">

                            <ValueBox
                                label="AX"
                                value={record.AX}
                                unit="m/s²"
                            />


                            <ValueBox
                                label="AY"
                                value={record.AY}
                                unit="m/s²"
                            />


                            <ValueBox
                                label="AZ"
                                value={record.AZ}
                                unit="m/s²"
                            />

                        </div>

                    </SensorCard>


                    {/* GYROSCOPE */}

                    <SensorCard
                        title="Gyroscope"
                        icon="◌"
                    >

                        <div className="
                            grid
                            grid-cols-1
                            sm:grid-cols-3
                            gap-3
                        ">

                            <ValueBox
                                label="GX"
                                value={record.GX}
                                unit="°/s"
                            />


                            <ValueBox
                                label="GY"
                                value={record.GY}
                                unit="°/s"
                            />


                            <ValueBox
                                label="GZ"
                                value={record.GZ}
                                unit="°/s"
                            />

                        </div>

                    </SensorCard>


                    {/* RGB */}

                    <SensorCard
                        title="Light / RGB"
                        icon="◈"
                    >

                        <div className="
                            grid
                            grid-cols-1
                            sm:grid-cols-3
                            gap-3
                        ">


                            <div className="
                                bg-slate-800
                                rounded-xl
                                p-4
                                border
                                border-red-400/20
                            ">

                                <p className="
                                    text-xs
                                    text-slate-400
                                ">
                                    RED
                                </p>


                                <p className="
                                    text-2xl
                                    font-bold
                                    text-red-400
                                    mt-2
                                ">
                                    {record.R}
                                </p>

                            </div>


                            <div className="
                                bg-slate-800
                                rounded-xl
                                p-4
                                border
                                border-green-400/20
                            ">

                                <p className="
                                    text-xs
                                    text-slate-400
                                ">
                                    GREEN
                                </p>


                                <p className="
                                    text-2xl
                                    font-bold
                                    text-green-400
                                    mt-2
                                ">
                                    {record.G}
                                </p>

                            </div>


                            <div className="
                                bg-slate-800
                                rounded-xl
                                p-4
                                border
                                border-blue-400/20
                            ">

                                <p className="
                                    text-xs
                                    text-slate-400
                                ">
                                    BLUE
                                </p>


                                <p className="
                                    text-2xl
                                    font-bold
                                    text-blue-400
                                    mt-2
                                ">
                                    {record.B}
                                </p>

                            </div>

                        </div>

                    </SensorCard>


                    {/* DEVICE INFO */}

                    <SensorCard
                        title="Device Information"
                        icon="⚙"
                    >

                        <div className="
                            grid
                            grid-cols-2
                            gap-3
                        ">

                            <ValueBox
                                label="Module"
                                value={record.M}
                            />


                            <ValueBox
                                label="Pressure"
                                value={record.P}
                            />


                            <ValueBox
                                label="Date"
                                value={record.DATE}
                            />


                            <ValueBox
                                label="Time"
                                value={record.TIME}
                            />

                        </div>

                    </SensorCard>

                </section>


                {/* =================================================
                    TAMPERING HISTORY
                ================================================== */}

                <section className="
                    bg-slate-900
                    border
                    border-slate-700
                    rounded-2xl
                    overflow-hidden
                ">


                    <div className="
                        p-5
                        border-b
                        border-slate-700
                    ">

                        <h2 className="
                            text-xl
                            font-semibold
                        ">
                            Tampering History
                        </h2>


                        <p className="
                            text-sm
                            text-slate-400
                            mt-1
                        ">
                            {data.length} recorded measurement
                            {data.length !== 1 ? "s" : ""}
                        </p>

                    </div>


                    {/* TABLE */}

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead className="
                                bg-slate-800/70
                            ">

                                <tr className="
                                    text-left
                                    text-slate-400
                                ">

                                    <th className="px-5 py-4 font-medium">
                                        Date
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        Time
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        Module
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        Pressure
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        AX
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        AY
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        AZ
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        GX
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        GY
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        GZ
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        RGB
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="
                                divide-y
                                divide-slate-800
                            ">

                                {[...data]
                                    .reverse()
                                    .map((item, index) => (

                                        <tr
                                            key={index}
                                            className="
                                                hover:bg-slate-800/50
                                                transition
                                            "
                                        >

                                            <td className="
                                                px-5
                                                py-4
                                                whitespace-nowrap
                                            ">
                                                {item.DATE}
                                            </td>


                                            <td className="
                                                px-5
                                                py-4
                                                whitespace-nowrap
                                                text-slate-400
                                            ">
                                                {item.TIME}
                                            </td>


                                            <td className="px-5 py-4">

                                                <span className="
                                                    px-2
                                                    py-1
                                                    rounded-md
                                                    bg-cyan-400/10
                                                    text-cyan-400
                                                ">
                                                    {item.M}
                                                </span>

                                            </td>


                                            <td className="
                                                px-5
                                                py-4
                                                font-semibold
                                            ">
                                                {formatNumber(item.P)}
                                            </td>


                                            <td className="px-5 py-4">
                                                {formatNumber(item.AX)}
                                            </td>


                                            <td className="px-5 py-4">
                                                {formatNumber(item.AY)}
                                            </td>


                                            <td className="px-5 py-4">
                                                {formatNumber(item.AZ)}
                                            </td>


                                            <td className="px-5 py-4">
                                                {formatNumber(item.GX)}
                                            </td>


                                            <td className="px-5 py-4">
                                                {formatNumber(item.GY)}
                                            </td>


                                            <td className="px-5 py-4">
                                                {formatNumber(item.GZ)}
                                            </td>


                                            <td className="
                                                px-5
                                                py-4
                                                whitespace-nowrap
                                            ">

                                                <span className="text-red-400">
                                                    {item.R}
                                                </span>

                                                <span className="text-slate-500">
                                                    {" / "}
                                                </span>

                                                <span className="text-green-400">
                                                    {item.G}
                                                </span>

                                                <span className="text-slate-500">
                                                    {" / "}
                                                </span>

                                                <span className="text-blue-400">
                                                    {item.B}
                                                </span>

                                            </td>

                                        </tr>

                                    ))}

                            </tbody>

                        </table>

                    </div>

                </section>

            </main>

        </div>
    );
}

