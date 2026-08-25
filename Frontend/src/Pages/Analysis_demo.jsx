import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function Analysis() {

    const location = useLocation();
    const navigate = useNavigate();

    // ==================================================
    // QR DATA
    // ==================================================

    const qrText = location.state?.qrText;

    // ==================================================
    // PARSE QR DATA
    // ==================================================

    let data = [];

    if (qrText) {

        try {

            const parsed = JSON.parse(qrText);

            // QR can contain either:
            //
            // 1. Single object
            // 2. Array of objects

            if (Array.isArray(parsed)) {
                data = parsed;
            } else {
                data = [parsed];
            }

        } catch (error) {

            console.error(
                "QR JSON parsing failed:",
                error
            );

        }

    }

    // ==================================================
    // LATEST RECORD
    // ==================================================

    const record =
        data.length > 0
            ? data[data.length - 1]
            : null;

    // ==================================================
    // FORMAT NUMBER
    // ==================================================

    const formatNumber = (value) => {

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return "--";
        }

        if (
            typeof value === "number" &&
            !Number.isNaN(value)
        ) {
            return value.toFixed(2);
        }

        return value;
    };

    // ==================================================
    // PACKAGE LIFE CALCULATION
    // ==================================================
    //
    // Weighting:
    //
    // RGB       = BIGGEST IMPACT
    // Pressure  = BIG IMPACT
    // Gyroscope = SMALL IMPACT
    // Movement  = SMALLEST IMPACT
    //
    // Changes are compared with the PREVIOUS reading.
    // ==================================================

    const packageLifeData = data.map(
        (item, index) => {

            // First reading has no previous reading.
            // Therefore, no change penalty.
            if (index === 0) {

                return {
                    time:
                        item.TIME ||
                        `Reading ${index + 1}`,

                    packageLife: 100
                };
            }

            const previous = data[index - 1];

            // ==================================================
            // 1. MOVEMENT / ACCELERATION
            // SMALL PENALTY
            // ==================================================

            const acceleration = Math.sqrt(
                Math.pow(Number(item.AX) || 0, 2) +
                Math.pow(Number(item.AY) || 0, 2) +
                Math.pow(Number(item.AZ) || 0, 2)
            );

            const previousAcceleration = Math.sqrt(
                Math.pow(Number(previous.AX) || 0, 2) +
                Math.pow(Number(previous.AY) || 0, 2) +
                Math.pow(Number(previous.AZ) || 0, 2)
            );

            const accelerationChange =
                Math.abs(
                    acceleration -
                    previousAcceleration
                );

            const movementPenalty = Math.min(
                accelerationChange * 5,
                10
            );


            // ==================================================
            // 2. GYROSCOPE
            // SMALL / MODERATE PENALTY
            // ==================================================

            const gyro = Math.sqrt(
                Math.pow(Number(item.GX) || 0, 2) +
                Math.pow(Number(item.GY) || 0, 2) +
                Math.pow(Number(item.GZ) || 0, 2)
            );

            const previousGyro = Math.sqrt(
                Math.pow(Number(previous.GX) || 0, 2) +
                Math.pow(Number(previous.GY) || 0, 2) +
                Math.pow(Number(previous.GZ) || 0, 2)
            );

            const gyroChange =
                Math.abs(
                    gyro -
                    previousGyro
                );

            const gyroPenalty = Math.min(
                gyroChange * 0.08,
                15
            );


            // ==================================================
            // 3. PRESSURE CHANGE
            // BIG PENALTY
            // ==================================================

            const currentPressure =
                Number(item.P) || 0;

            const previousPressure =
                Number(previous.P) || 0;

            const pressureDifference =
                Math.abs(
                    currentPressure -
                    previousPressure
                );

            const pressurePenalty = Math.min(
                pressureDifference * 20,
                30
            );


            // ==================================================
            // 4. RGB CHANGE
            // BIGGEST PENALTY
            // ==================================================

            const currentR =
                Number(item.R) || 0;

            const currentG =
                Number(item.G) || 0;

            const currentB =
                Number(item.B) || 0;

            const previousR =
                Number(previous.R) || 0;

            const previousG =
                Number(previous.G) || 0;

            const previousB =
                Number(previous.B) || 0;


            // Calculate absolute RGB changes

            const redDifference =
                Math.abs(
                    currentR -
                    previousR
                );

            const greenDifference =
                Math.abs(
                    currentG -
                    previousG
                );

            const blueDifference =
                Math.abs(
                    currentB -
                    previousB
                );


            // Normalize RGB difference
            // against the larger of the two values.
            //
            // This prevents a change such as:
            // 8 → 4296
            //
            // from behaving strangely.

            const redChange =
                redDifference /
                Math.max(
                    currentR,
                    previousR,
                    1
                );

            const greenChange =
                greenDifference /
                Math.max(
                    currentG,
                    previousG,
                    1
                );

            const blueChange =
                blueDifference /
                Math.max(
                    currentB,
                    previousB,
                    1
                );


            // Average RGB change

            const rgbChange =
                (
                    redChange +
                    greenChange +
                    blueChange
                ) / 3;


            // RGB is the BIGGEST package-life factor.

            const rgbPenalty = Math.min(
                rgbChange * 60,
                60
            );


            // ==================================================
            // TOTAL PENALTY
            // ==================================================

            const totalPenalty =
                movementPenalty +
                gyroPenalty +
                pressurePenalty +
                rgbPenalty;


            // ==================================================
            // PACKAGE LIFE
            // ==================================================

            const packageLife =
                100 -
                totalPenalty;


            return {

                time:
                    item.TIME ||
                    `Reading ${index + 1}`,

                packageLife: Math.max(
                    0,
                    Math.min(
                        100,
                        packageLife
                    )
                )
            };
        }
    );


    // ==================================================
    // CURRENT PACKAGE LIFE
    // ==================================================

    const currentPackageLife =
        packageLifeData.length > 0
            ? packageLifeData[
                packageLifeData.length - 1
            ].packageLife
            : null;


    // ==================================================
    // SENSOR CARD
    // ==================================================

    const SensorCard = ({
        title,
        icon,
        children
    }) => {

        return (

            <div
                className="
                    bg-slate-900/70
                    border border-slate-700
                    rounded-2xl
                    p-5
                    shadow-lg
                    hover:border-cyan-400/60
                    transition
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                        mb-5
                    "
                >

                    <div
                        className="
                            h-10
                            w-10
                            rounded-xl
                            bg-cyan-400/10
                            flex
                            items-center
                            justify-center
                            text-xl
                        "
                    >
                        {icon}
                    </div>

                    <h2
                        className="
                            text-xl
                            font-semibold
                            text-white
                        "
                    >
                        {title}
                    </h2>

                </div>

                {children}

            </div>
        );
    };


    // ==================================================
    // VALUE BOX
    // ==================================================

    const ValueBox = ({
        label,
        value,
        unit = ""
    }) => {

        return (

            <div
                className="
                    bg-slate-800/80
                    rounded-xl
                    p-4
                    border
                    border-slate-700
                "
            >

                <p
                    className="
                        text-xs
                        text-slate-400
                        uppercase
                        tracking-wider
                    "
                >
                    {label}
                </p>

                <div
                    className="
                        mt-2
                        flex
                        items-baseline
                        gap-1
                    "
                >

                    <span
                        className="
                            text-2xl
                            font-bold
                            text-white
                        "
                    >
                        {formatNumber(value)}
                    </span>

                    {unit && (

                        <span
                            className="
                                text-sm
                                text-slate-400
                            "
                        >
                            {unit}
                        </span>

                    )}

                </div>

            </div>
        );
    };


    // ==================================================
    // MAIN DASHBOARD
    // ==================================================

    return (

        <div
            className="
                min-h-screen
                bg-slate-950
                text-white
                px-4
                sm:px-6
                lg:px-10
                py-6
            "
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <header
                className="
                    max-w-7xl
                    mx-auto
                    mb-8
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-4
                    "
                >

                    <div>

                        <p
                            className="
                                text-cyan-400
                                text-sm
                                font-medium
                                tracking-widest
                            "
                        >
                            SENSOR ANALYSIS
                        </p>

                        <h1
                            className="
                                text-3xl
                                sm:text-4xl
                                font-bold
                                mt-1
                            "
                        >
                            Analysis Dashboard
                        </h1>

                        <p
                            className="
                                text-slate-400
                                mt-2
                            "
                        >
                            Sensor readings and package
                            condition analysis
                        </p>

                    </div>


                    {/* SENSOR STATUS */}

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            bg-slate-900
                            border
                            border-slate-700
                            rounded-xl
                            px-4
                            py-3
                        "
                    >

                        <div
                            className="
                                h-3
                                w-3
                                rounded-full
                                bg-green-400
                                animate-pulse
                            "
                        />

                        <div>

                            <p
                                className="
                                    text-xs
                                    text-slate-400
                                "
                            >
                                SENSOR
                            </p>

                            <p className="font-semibold">
                                {record?.M || "Unknown"}
                            </p>

                        </div>

                    </div>

                </div>

            </header>


            <main
                className="
                    max-w-7xl
                    mx-auto
                "
            >

                {/* ==================================================
                    LATEST READING
                ================================================== */}

                <section className="mb-8">

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            mb-4
                        "
                    >

                        <div>

                            <h2
                                className="
                                    text-xl
                                    font-semibold
                                "
                            >
                                Latest Reading
                            </h2>

                            <p
                                className="
                                    text-sm
                                    text-slate-400
                                "
                            >
                                Most recent sensor measurement
                            </p>

                        </div>

                        <div className="text-right">

                            <p
                                className="
                                    text-sm
                                    text-slate-400
                                "
                            >
                                {record?.DATE || "--"}
                            </p>

                            <p
                                className="
                                    text-sm
                                    text-slate-500
                                "
                            >
                                {record?.TIME || "--"}
                            </p>

                        </div>

                    </div>


                    {/* TOP STAT CARDS */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            lg:grid-cols-4
                            gap-4
                        "
                    >

                        {/* PRESSURE */}

                        <div
                            className="
                                bg-gradient-to-br
                                from-cyan-500/20
                                to-slate-900
                                border
                                border-cyan-400/30
                                rounded-2xl
                                p-5
                            "
                        >

                            <p className="text-sm text-slate-400">
                                Pressure
                            </p>

                            <p
                                className="
                                    text-4xl
                                    font-bold
                                    mt-2
                                "
                            >
                                {formatNumber(record?.P)}
                            </p>

                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                    mt-2
                                "
                            >
                                Current pressure
                            </p>

                        </div>


                        {/* ACCELERATION */}

                        <div
                            className="
                                bg-slate-900
                                border
                                border-slate-700
                                rounded-2xl
                                p-5
                            "
                        >

                            <p className="text-sm text-slate-400">
                                Acceleration
                            </p>

                            <p
                                className="
                                    text-2xl
                                    font-bold
                                    mt-2
                                "
                            >
                                {formatNumber(record?.AX)}
                            </p>

                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                    mt-1
                                "
                            >
                                X axis
                            </p>

                        </div>


                        {/* GYROSCOPE */}

                        <div
                            className="
                                bg-slate-900
                                border
                                border-slate-700
                                rounded-2xl
                                p-5
                            "
                        >

                            <p className="text-sm text-slate-400">
                                Gyroscope
                            </p>

                            <p
                                className="
                                    text-2xl
                                    font-bold
                                    mt-2
                                "
                            >
                                {formatNumber(record?.GX)}
                            </p>

                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                    mt-1
                                "
                            >
                                X axis
                            </p>

                        </div>


                        {/* PACKAGE LIFE */}

                        <div
                            className="
                                bg-gradient-to-br
                                from-emerald-500/20
                                to-slate-900
                                border
                                border-emerald-400/30
                                rounded-2xl
                                p-5
                            "
                        >

                            <p className="text-sm text-slate-400">
                                Package Life
                            </p>

                            <p
                                className="
                                    text-4xl
                                    font-bold
                                    mt-2
                                    text-emerald-400
                                "
                            >
                                {currentPackageLife !== null
                                    ? `${currentPackageLife.toFixed(1)}%`
                                    : "--"}
                            </p>

                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                    mt-2
                                "
                            >
                                Current estimated condition
                            </p>

                        </div>

                    </div>

                </section>


                {/* ==================================================
                    PACKAGE LIFE GRAPH
                ================================================== */}

                <section
                    className="
                        bg-slate-900
                        border
                        border-slate-700
                        rounded-2xl
                        p-5
                        mb-8
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            mb-6
                        "
                    >

                        <div>

                            <h2
                                className="
                                    text-xl
                                    font-semibold
                                "
                            >
                                Package Life
                            </h2>

                            <p
                                className="
                                    text-sm
                                    text-slate-400
                                    mt-1
                                "
                            >
                                Package condition calculated
                                from sensor changes
                            </p>

                        </div>

                        <div
                            className="
                                mt-3
                                sm:mt-0
                                text-right
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                "
                            >
                                CURRENT LIFE
                            </p>

                            <p
                                className="
                                    text-2xl
                                    font-bold
                                    text-emerald-400
                                "
                            >
                                {currentPackageLife !== null
                                    ? `${currentPackageLife.toFixed(1)}%`
                                    : "--"}
                            </p>

                        </div>

                    </div>


                    <div
                        className="
                            w-full
                            h-[350px]
                        "
                    >

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
                                        r: 3
                                    }}
                                    activeDot={{
                                        r: 6
                                    }}
                                />

                            </AreaChart>

                        </ResponsiveContainer>

                    </div>

                </section>


                {/* ==================================================
                    SENSOR CARDS
                ================================================== */}

                <section
                    className="
                        grid
                        grid-cols-1
                        lg:grid-cols-2
                        gap-5
                        mb-8
                    "
                >

                    {/* ACCELERATION */}

                    <SensorCard
                        title="Acceleration"
                        icon="↗"
                    >

                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-3
                                gap-3
                            "
                        >

                            <ValueBox
                                label="AX"
                                value={record?.AX}
                                unit="m/s²"
                            />

                            <ValueBox
                                label="AY"
                                value={record?.AY}
                                unit="m/s²"
                            />

                            <ValueBox
                                label="AZ"
                                value={record?.AZ}
                                unit="m/s²"
                            />

                        </div>

                    </SensorCard>


                    {/* GYROSCOPE */}

                    <SensorCard
                        title="Gyroscope"
                        icon="◌"
                    >

                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-3
                                gap-3
                            "
                        >

                            <ValueBox
                                label="GX"
                                value={record?.GX}
                                unit="°/s"
                            />

                            <ValueBox
                                label="GY"
                                value={record?.GY}
                                unit="°/s"
                            />

                            <ValueBox
                                label="GZ"
                                value={record?.GZ}
                                unit="°/s"
                            />

                        </div>

                    </SensorCard>


                    {/* RGB */}

                    <SensorCard
                        title="Light / RGB"
                        icon="◈"
                    >

                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-3
                                gap-3
                            "
                        >

                            {/* RED */}

                            <div
                                className="
                                    bg-slate-800
                                    rounded-xl
                                    p-4
                                    border
                                    border-red-400/20
                                "
                            >

                                <p className="text-xs text-slate-400">
                                    RED
                                </p>

                                <p
                                    className="
                                        text-2xl
                                        font-bold
                                        text-red-400
                                        mt-2
                                    "
                                >
                                    {formatNumber(record?.R)}
                                </p>

                            </div>


                            {/* GREEN */}

                            <div
                                className="
                                    bg-slate-800
                                    rounded-xl
                                    p-4
                                    border
                                    border-green-400/20
                                "
                            >

                                <p className="text-xs text-slate-400">
                                    GREEN
                                </p>

                                <p
                                    className="
                                        text-2xl
                                        font-bold
                                        text-green-400
                                        mt-2
                                    "
                                >
                                    {formatNumber(record?.G)}
                                </p>

                            </div>


                            {/* BLUE */}

                            <div
                                className="
                                    bg-slate-800
                                    rounded-xl
                                    p-4
                                    border
                                    border-blue-400/20
                                "
                            >

                                <p className="text-xs text-slate-400">
                                    BLUE
                                </p>

                                <p
                                    className="
                                        text-2xl
                                        font-bold
                                        text-blue-400
                                        mt-2
                                    "
                                >
                                    {formatNumber(record?.B)}
                                </p>

                            </div>

                        </div>

                    </SensorCard>


                    {/* DEVICE INFORMATION */}

                    <SensorCard
                        title="Device Information"
                        icon="⚙"
                    >

                        <div
                            className="
                                grid
                                grid-cols-2
                                gap-3
                            "
                        >

                            <ValueBox
                                label="Module"
                                value={record?.M}
                            />

                            <ValueBox
                                label="Pressure"
                                value={record?.P}
                            />

                            <ValueBox
                                label="Date"
                                value={record?.DATE}
                            />

                            <ValueBox
                                label="Time"
                                value={record?.TIME}
                            />

                        </div>

                    </SensorCard>

                </section>


                {/* ==================================================
                    TAMPERING HISTORY
                ================================================== */}

                <section
                    className="
                        bg-slate-900
                        border
                        border-slate-700
                        rounded-2xl
                        overflow-hidden
                        mb-8
                    "
                >

                    {/* HEADER */}

                    <div
                        className="
                            p-5
                            border-b
                            border-slate-700
                        "
                    >

                        <h2
                            className="
                                text-xl
                                font-semibold
                            "
                        >
                            Tampering History
                        </h2>

                        <p
                            className="
                                text-sm
                                text-slate-400
                                mt-1
                            "
                        >
                            {data.length} recorded measurement
                            {data.length !== 1 ? "s" : ""}
                        </p>

                    </div>


                    {/* TABLE */}

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead
                                className="
                                    bg-slate-800/70
                                "
                            >

                                <tr
                                    className="
                                        text-left
                                        text-slate-400
                                    "
                                >

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


                            <tbody
                                className="
                                    divide-y
                                    divide-slate-800
                                "
                            >

                                {[...data]
                                    .reverse()
                                    .map(
                                        (item, index) => (

                                            <tr
                                                key={index}
                                                className="
                                                    hover:bg-slate-800/50
                                                    transition
                                                "
                                            >

                                                {/* DATE */}

                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                        whitespace-nowrap
                                                    "
                                                >
                                                    {item.DATE || "--"}
                                                </td>


                                                {/* TIME */}

                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                        whitespace-nowrap
                                                        text-slate-400
                                                    "
                                                >
                                                    {item.TIME || "--"}
                                                </td>


                                                {/* MODULE */}

                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                    "
                                                >

                                                    <span
                                                        className="
                                                            px-2
                                                            py-1
                                                            rounded-md
                                                            bg-cyan-400/10
                                                            text-cyan-400
                                                        "
                                                    >
                                                        {item.M || "--"}
                                                    </span>

                                                </td>


                                                {/* PRESSURE */}

                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                        font-semibold
                                                    "
                                                >
                                                    {formatNumber(item.P)}
                                                </td>


                                                {/* AX */}

                                                <td className="px-5 py-4">
                                                    {formatNumber(item.AX)}
                                                </td>


                                                {/* AY */}

                                                <td className="px-5 py-4">
                                                    {formatNumber(item.AY)}
                                                </td>


                                                {/* AZ */}

                                                <td className="px-5 py-4">
                                                    {formatNumber(item.AZ)}
                                                </td>


                                                {/* GX */}

                                                <td className="px-5 py-4">
                                                    {formatNumber(item.GX)}
                                                </td>


                                                {/* GY */}

                                                <td className="px-5 py-4">
                                                    {formatNumber(item.GY)}
                                                </td>


                                                {/* GZ */}

                                                <td className="px-5 py-4">
                                                    {formatNumber(item.GZ)}
                                                </td>


                                                {/* RGB */}

                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                        whitespace-nowrap
                                                    "
                                                >

                                                    <span className="text-red-400">
                                                        {formatNumber(item.R)}
                                                    </span>

                                                    <span className="text-slate-500">
                                                        {" / "}
                                                    </span>

                                                    <span className="text-green-400">
                                                        {formatNumber(item.G)}
                                                    </span>

                                                    <span className="text-slate-500">
                                                        {" / "}
                                                    </span>

                                                    <span className="text-blue-400">
                                                        {formatNumber(item.B)}
                                                    </span>

                                                </td>

                                            </tr>

                                        )
                                    )}

                            </tbody>

                        </table>

                    </div>

                </section>

            </main>

        </div>
    );
}