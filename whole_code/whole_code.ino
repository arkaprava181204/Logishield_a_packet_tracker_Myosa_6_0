#define OLEDDISPLAY

#include <Wire.h>
#include <SSD1306.h>
#include <qrcodeoled.h>

#include "LightProximityAndGesture.h"
#include "BarometricPressure.h"

// =====================================================
// I2C ADDRESSES
// =====================================================

#define MPU_ADDR   0x68
#define OLED_ADDR  0x3C

// =====================================================
// ESP32 I2C PINS
// =====================================================
//
// Change these if your hardware uses different pins.
//

#define SDA_PIN 21
#define SCL_PIN 22

// =====================================================
// BUTTON
// =====================================================

#define SWITCH_PIN 4

// =====================================================
// OLED
// =====================================================

SSD1306 display(
  OLED_ADDR,
  SDA_PIN,
  SCL_PIN
);

// QR code object
QRcodeOled qrcode(&display);

// =====================================================
// SENSORS
// =====================================================

LightProximityAndGesture apds;

BarometricPressure bmp180(HIGH_RESOLUTION);

// =====================================================
// TIMING
// =====================================================

const unsigned long DOUBLE_PRESS_WINDOW =
  5000;

const unsigned long COUNTDOWN_TIME =
  40000;

const unsigned long TRIPLE_PRESS_WINDOW =
  5000;

// =====================================================
// BUTTON VARIABLES
// =====================================================

unsigned long firstPressTime = 0;

unsigned long countdownStart = 0;

unsigned long lastTriplePress = 0;

bool firstPress = false;

int triplePressCount = 0;

// =====================================================
// SYSTEM STATES
// =====================================================

bool countdownRunning = false;

bool monitoring = false;

bool referenceCaptured = false;

bool tampered = false;

// =====================================================
// MPU6050 RAW VALUES
// =====================================================

int16_t rawAx;
int16_t rawAy;
int16_t rawAz;

int16_t rawGx;
int16_t rawGy;
int16_t rawGz;

// =====================================================
// MPU6050 FILTERED VALUES
// =====================================================

// Acceleration in g

float ax_g;
float ay_g;
float az_g;

// Gyroscope in deg/s

float gx_dps;
float gy_dps;
float gz_dps;

// =====================================================
// MPU6050 REFERENCE
// =====================================================

float ref_ax_g;
float ref_ay_g;
float ref_az_g;

float ref_gx_dps;
float ref_gy_dps;
float ref_gz_dps;

// =====================================================
// RGB VALUES
// =====================================================

uint16_t redValue;
uint16_t greenValue;
uint16_t blueValue;

// =====================================================
// RGB REFERENCE
// =====================================================

uint16_t ref_redValue;
uint16_t ref_greenValue;
uint16_t ref_blueValue;

// =====================================================
// BMP180 PRESSURE
// =====================================================

float bmpPressure;

// =====================================================
// BMP180 PRESSURE REFERENCE
// =====================================================

float ref_bmpPressure;

// =====================================================
// TAMPER DIFFERENCES
// =====================================================

float tamper_d_ax;
float tamper_d_ay;
float tamper_d_az;

float tamper_d_gx;
float tamper_d_gy;
float tamper_d_gz;

float tamper_d_red;
float tamper_d_green;
float tamper_d_blue;

float tamper_d_pressure;

// =====================================================
// MOVEMENT ID
// =====================================================
//
// Change this whenever you want a different movement ID.
//

String movementID = "S001";

// =====================================================
// TOLERANCE
// =====================================================

const float TOLERANCE_PERCENT = 10.0;

// For acceleration values close to zero

const float ACCEL_ZERO_LIMIT = 0.05;

// For gyro values close to zero

const float GYRO_ZERO_LIMIT = 1.0;

// =====================================================
// MPU6050 SCALE
// =====================================================

// Default +/-2g

const float ACCEL_SCALE = 16384.0;

// Default +/-250 deg/s

const float GYRO_SCALE = 131.0;

// =====================================================
// KALMAN FILTER
// =====================================================

class KalmanFilter
{
public:

  float Q;
  float R;

  float X;
  float P;
  float K;

  KalmanFilter(
    float processNoise,
    float measurementNoise
  )
  {
    Q = processNoise;

    R = measurementNoise;

    X = 0.0;

    P = 1.0;

    K = 0.0;
  }

  float update(
    float measurement
  )
  {
    // Prediction

    P =
      P +
      Q;

    // Kalman gain

    K =
      P /
      (P + R);

    // Correction

    X =
      X +
      K *
      (
        measurement -
        X
      );

    // Update covariance

    P =
      (
        1.0 -
        K
      ) *
      P;

    return X;
  }
};

// =====================================================
// KALMAN OBJECTS
// =====================================================

KalmanFilter kalmanAx(
  0.005,
  0.05
);

KalmanFilter kalmanAy(
  0.005,
  0.05
);

KalmanFilter kalmanAz(
  0.005,
  0.05
);

KalmanFilter kalmanGx(
  0.01,
  0.1
);

KalmanFilter kalmanGy(
  0.01,
  0.1
);

KalmanFilter kalmanGz(
  0.01,
  0.1
);

// =====================================================
// SETUP DISPLAY
// =====================================================

void setupDisplay()
{
  display.init();

  display.clear();

  display.display();

  display.flipScreenVertically();
}

// =====================================================
// DISPLAY CENTERED TEXT
// =====================================================

void displayCenteredText(
  String text,
  int duration
)
{
  display.setFont(
    ArialMT_Plain_16
  );

  int16_t textWidth =
    display.getStringWidth(
      text
    );

  int16_t textHeight =
    16;

  int16_t x =
    (
      display.getWidth() -
      textWidth
    ) /
    2;

  int16_t y =
    (
      display.getHeight() -
      textHeight
    ) /
    2;

  display.clear();

  display.drawString(
    x,
    y,
    text
  );

  display.display();

  delay(duration);

  display.clear();

  display.display();
}

// =====================================================
// DISPLAY QR
// =====================================================

void displayQR(
  String text,
  int duration
)
{
  // Clear OLED

  display.clear();

  display.display();

  // Initialize QR library

  qrcode.init();

  // Create QR code

  qrcode.create(
    text
  );

  // Keep QR on screen

  delay(duration);

  // Clear after duration

  display.clear();

  display.display();
}

// =====================================================
// QR GENERATION
// =====================================================

void qrcodeGeneration(
  String text
)
{
  /*
     Your original code removed the last
     character and added "]".

     We don't need to do that here because
     the JSON is generated correctly below.
  */

  setupDisplay();

  displayCenteredText(
    "Scan QR",
    2000
  );

  displayQR(
    text,
    100000
  );
}

// =====================================================
// SETUP
// =====================================================

void setup()
{
  Serial.begin(
    115200
  );

  delay(500);

  // ===================================================
  // I2C
  // ===================================================

  Wire.begin(
    SDA_PIN,
    SCL_PIN
  );

  // ===================================================
  // BUTTON
  // ===================================================

  pinMode(
    SWITCH_PIN,
    INPUT_PULLUP
  );

  // ===================================================
  // OLED
  // ===================================================

  setupDisplay();

  display.setFont(
    ArialMT_Plain_10
  );

  display.drawString(
    0,
    0,
    "MYOSA SENSOR SYSTEM"
  );

  display.drawString(
    0,
    15,
    "MPU6050 : 0x68"
  );

  display.drawString(
    0,
    27,
    "APDS9960: 0x39"
  );

  display.drawString(
    0,
    39,
    "BMP180  : 0x77"
  );

  display.drawString(
    0,
    51,
    "Initializing..."
  );

  display.display();

  delay(500);

  // ===================================================
  // MPU6050 INITIALIZATION
  // ===================================================

  Wire.beginTransmission(
    MPU_ADDR
  );

  Wire.write(0x6B);

  Wire.write(0x00);

  byte mpuError =
    Wire.endTransmission();

  if (
    mpuError == 0
  )
  {
    Serial.println(
      "MPU6050 FOUND at 0x68"
    );
  }
  else
  {
    Serial.print(
      "MPU6050 ERROR = "
    );

    Serial.println(
      mpuError
    );
  }

  delay(100);

  // ===================================================
  // APDS9960
  // ===================================================

  if (
    !apds.begin()
  )
  {
    Serial.println(
      "APDS9960 ERROR!"
    );

    display.clear();

    display.drawString(
      0,
      20,
      "APDS9960 ERROR!"
    );

    display.drawString(
      0,
      35,
      "Check sensor"
    );

    display.display();
  }
  else
  {
    Serial.println(
      "APDS9960 FOUND at 0x39"
    );

    // Ambient light

    if (
      !apds.enableAmbientLightSensor(
        DISABLE
      )
    )
    {
      Serial.println(
        "APDS LIGHT ERROR"
      );
    }
    else
    {
      Serial.println(
        "APDS LIGHT ENABLED"
      );
    }

    // Proximity

    if (
      !apds.enableProximitySensor(
        DISABLE
      )
    )
    {
      Serial.println(
        "APDS PROXIMITY ERROR"
      );
    }
    else
    {
      Serial.println(
        "APDS PROXIMITY ENABLED"
      );
    }
  }

  // ===================================================
  // BMP180
  // ===================================================

  if (
    !bmp180.begin()
  )
  {
    Serial.println(
      "BMP180 ERROR!"
    );

    display.clear();

    display.drawString(
      0,
      20,
      "BMP180 ERROR!"
    );

    display.drawString(
      0,
      35,
      "Check sensor"
    );

    display.display();
  }
  else
  {
    Serial.println(
      "BMP180 FOUND at 0x77"
    );
  }

  // ===================================================
  // QR LIBRARY
  // ===================================================

  qrcode.init();

  // ===================================================
  // READY SCREEN
  // ===================================================

  display.clear();

  display.setFont(
    ArialMT_Plain_10
  );

  display.drawString(
    0,
    0,
    "SYSTEM READY"
  );

  display.drawString(
    0,
    17,
    "Press button twice"
  );

  display.drawString(
    0,
    30,
    "within 5 seconds"
  );

  display.drawString(
    0,
    44,
    "Timer: 40 seconds"
  );

  display.display();

  Serial.println();

  Serial.println(
    "============================"
  );

  Serial.println(
    "SYSTEM READY"
  );

  Serial.println(
    "Press button twice"
  );

  Serial.println(
    "============================"
  );
}

// =====================================================
// READ MPU6050
// =====================================================

void readMPU()
{
  Wire.beginTransmission(
    MPU_ADDR
  );

  // ACCEL_XOUT_H

  Wire.write(
    0x3B
  );

  Wire.endTransmission(
    false
  );

  uint8_t bytes =
    Wire.requestFrom(
      MPU_ADDR,
      14
    );

  if (
    bytes < 14
  )
  {
    Serial.println(
      "MPU READ ERROR"
    );

    return;
  }

  // ===================================================
  // ACCELERATION
  // ===================================================

  rawAx =
    (
      Wire.read()
      << 8
    ) |
    Wire.read();

  rawAy =
    (
      Wire.read()
      << 8
    ) |
    Wire.read();

  rawAz =
    (
      Wire.read()
      << 8
    ) |
    Wire.read();

  // ===================================================
  // SKIP TEMPERATURE
  // ===================================================

  Wire.read();

  Wire.read();

  // ===================================================
  // GYROSCOPE
  // ===================================================

  rawGx =
    (
      Wire.read()
      << 8
    ) |
    Wire.read();

  rawGy =
    (
      Wire.read()
      << 8
    ) |
    Wire.read();

  rawGz =
    (
      Wire.read()
      << 8
    ) |
    Wire.read();

  // ===================================================
  // CONVERT ACCELERATION
  // ===================================================

  float axMeasurement =
    rawAx /
    ACCEL_SCALE;

  float ayMeasurement =
    rawAy /
    ACCEL_SCALE;

  float azMeasurement =
    rawAz /
    ACCEL_SCALE;

  // ===================================================
  // CONVERT GYRO
  // ===================================================

  float gxMeasurement =
    rawGx /
    GYRO_SCALE;

  float gyMeasurement =
    rawGy /
    GYRO_SCALE;

  float gzMeasurement =
    rawGz /
    GYRO_SCALE;

  // ===================================================
  // KALMAN FILTER
  // ===================================================

  ax_g =
    kalmanAx.update(
      axMeasurement
    );

  ay_g =
    kalmanAy.update(
      ayMeasurement
    );

  az_g =
    kalmanAz.update(
      azMeasurement
    );

  gx_dps =
    kalmanGx.update(
      gxMeasurement
    );

  gy_dps =
    kalmanGy.update(
      gyMeasurement
    );

  gz_dps =
    kalmanGz.update(
      gzMeasurement
    );
}

// =====================================================
// READ RGB
// =====================================================

void readRGB()
{
  redValue =
    apds.getRedProportion();

  greenValue =
    apds.getGreenProportion();

  blueValue =
    apds.getBlueProportion();
}

// =====================================================
// READ PRESSURE ONLY
// =====================================================

void readBMP180()
{
  bmpPressure =
    bmp180.getPressureBar(
      false
    );
}

// =====================================================
// READ ALL SENSORS
// =====================================================

void readAllSensors()
{
  readMPU();

  readRGB();

  readBMP180();
}

// =====================================================
// CAPTURE REFERENCE
// =====================================================

void captureReference()
{
  Serial.println();

  Serial.println(
    "Stabilizing sensors..."
  );

  // Allow Kalman filters to settle

  for (
    int i = 0;
    i < 30;
    i++
  )
  {
    readAllSensors();

    delay(20);
  }

  // ===================================================
  // ACCELERATION REFERENCE
  // ===================================================

  ref_ax_g =
    ax_g;

  ref_ay_g =
    ay_g;

  ref_az_g =
    az_g;

  // ===================================================
  // GYRO REFERENCE
  // ===================================================

  ref_gx_dps =
    gx_dps;

  ref_gy_dps =
    gy_dps;

  ref_gz_dps =
    gz_dps;

  // ===================================================
  // RGB REFERENCE
  // ===================================================

  ref_redValue =
    redValue;

  ref_greenValue =
    greenValue;

  ref_blueValue =
    blueValue;

  // ===================================================
  // PRESSURE REFERENCE
  // ===================================================

  ref_bmpPressure =
    bmpPressure;

  referenceCaptured =
    true;

  Serial.println();

  Serial.println(
    "=============================="
  );

  Serial.println(
    "REFERENCE CAPTURED"
  );

  Serial.println(
    "=============================="
  );

  Serial.print(
    "ACC: "
  );

  Serial.print(
    ref_ax_g,
    3
  );

  Serial.print(
    " , "
  );

  Serial.print(
    ref_ay_g,
    3
  );

  Serial.print(
    " , "
  );

  Serial.println(
    ref_az_g,
    3
  );

  Serial.print(
    "GYRO: "
  );

  Serial.print(
    ref_gx_dps,
    2
  );

  Serial.print(
    " , "
  );

  Serial.print(
    ref_gy_dps,
    2
  );

  Serial.print(
    " , "
  );

  Serial.println(
    ref_gz_dps,
    2
  );

  Serial.print(
    "RGB: "
  );

  Serial.print(
    ref_redValue
  );

  Serial.print(
    " "
  );

  Serial.print(
    ref_greenValue
  );

  Serial.print(
    " "
  );

  Serial.println(
    ref_blueValue
  );

  Serial.print(
    "PRESSURE: "
  );

  Serial.println(
    ref_bmpPressure,
    4
  );
}

// =====================================================
// ACCELERATION DIFFERENCE
// =====================================================

float accelDifference(
  float observation,
  float reference
)
{
  float difference =
    fabs(
      observation -
      reference
    );

  if (
    fabs(reference) <
    0.10
  )
  {
    if (
      difference >
      ACCEL_ZERO_LIMIT
    )
    {
      return 100.0;
    }

    return 0.0;
  }

  return
    (
      difference /
      fabs(reference)
    ) *
    100.0;
}

// =====================================================
// GYRO DIFFERENCE
// =====================================================

float gyroDifference(
  float observation,
  float reference
)
{
  float difference =
    fabs(
      observation -
      reference
    );

  if (
    fabs(reference) <
    2.0
  )
  {
    if (
      difference >
      GYRO_ZERO_LIMIT
    )
    {
      return 100.0;
    }

    return 0.0;
  }

  return
    (
      difference /
      fabs(reference)
    ) *
    100.0;
}

// =====================================================
// GENERAL DIFFERENCE
// =====================================================

float percentageDifference(
  float observation,
  float reference
)
{
  if (
    fabs(reference) <
    0.001
  )
  {
    if (
      fabs(observation) <
      0.001
    )
    {
      return 0.0;
    }

    return 100.0;
  }

  return
    (
      fabs(
        observation -
        reference
      ) /
      fabs(reference)
    ) *
    100.0;
}

// =====================================================
// CHECK TAMPER
// =====================================================

bool checkTamper()
{
  // ===================================================
  // ACCELERATION
  // ===================================================

  float d_ax =
    accelDifference(
      ax_g,
      ref_ax_g
    );

  float d_ay =
    accelDifference(
      ay_g,
      ref_ay_g
    );

  float d_az =
    accelDifference(
      az_g,
      ref_az_g
    );

  // ===================================================
  // GYROSCOPE
  // ===================================================

  float d_gx =
    gyroDifference(
      gx_dps,
      ref_gx_dps
    );

  float d_gy =
    gyroDifference(
      gy_dps,
      ref_gy_dps
    );

  float d_gz =
    gyroDifference(
      gz_dps,
      ref_gz_dps
    );

  // ===================================================
  // RGB
  // ===================================================

  float d_red =
    percentageDifference(
      redValue,
      ref_redValue
    );

  float d_green =
    percentageDifference(
      greenValue,
      ref_greenValue
    );

  float d_blue =
    percentageDifference(
      blueValue,
      ref_blueValue
    );

  // ===================================================
  // PRESSURE
  // ===================================================

  float d_pressure =
    percentageDifference(
      bmpPressure,
      ref_bmpPressure
    );

  // ===================================================
  // SERIAL OUTPUT
  // ===================================================

  Serial.println();

  Serial.println(
    "-------- DIFFERENCE --------"
  );

  Serial.print(
    "AX: "
  );

  Serial.print(
    d_ax,
    2
  );

  Serial.println(
    "%"
  );

  Serial.print(
    "AY: "
  );

  Serial.print(
    d_ay,
    2
  );

  Serial.println(
    "%"
  );

  Serial.print(
    "AZ: "
  );

  Serial.print(
    d_az,
    2
  );

  Serial.println(
    "%"
  );

  Serial.print(
    "GX: "
  );

  Serial.print(
    d_gx,
    2
  );

  Serial.println(
    "%"
  );

  Serial.print(
    "GY: "
  );

  Serial.print(
    d_gy,
    2
  );

  Serial.println(
    "%"
  );

  Serial.print(
    "GZ: "
  );

  Serial.print(
    d_gz,
    2
  );

  Serial.println(
    "%"
  );

  Serial.print(
    "RED: "
  );

  Serial.print(
    d_red,
    2
  );

  Serial.println(
    "%"
  );

  Serial.print(
    "GREEN: "
  );

  Serial.print(
    d_green,
    2
  );

  Serial.println(
    "%"
  );

  Serial.print(
    "BLUE: "
  );

  Serial.print(
    d_blue,
    2
  );

  Serial.println(
    "%"
  );

  Serial.print(
    "PRESSURE: "
  );

  Serial.print(
    d_pressure,
    2
  );

  Serial.println(
    "%"
  );

  // ===================================================
  // CHECK LIMIT
  // ===================================================

  bool detected =
    (
      d_ax >
      TOLERANCE_PERCENT ||

      d_ay >
      TOLERANCE_PERCENT ||

      d_az >
      TOLERANCE_PERCENT ||

      d_gx >
      TOLERANCE_PERCENT ||

      d_gy >
      TOLERANCE_PERCENT ||

      d_gz >
      TOLERANCE_PERCENT ||

      d_red >
      TOLERANCE_PERCENT ||

      d_green >
      TOLERANCE_PERCENT ||

      d_blue >
      TOLERANCE_PERCENT ||

      d_pressure >
      TOLERANCE_PERCENT
    );

  // ===================================================
  // SAVE DIFFERENCES ONLY WHEN TAMPERED
  // ===================================================

  if (
    detected
  )
  {
    tamper_d_ax =
      d_ax;

    tamper_d_ay =
      d_ay;

    tamper_d_az =
      d_az;

    tamper_d_gx =
      d_gx;

    tamper_d_gy =
      d_gy;

    tamper_d_gz =
      d_gz;

    tamper_d_red =
      d_red;

    tamper_d_green =
      d_green;

    tamper_d_blue =
      d_blue;

    tamper_d_pressure =
      d_pressure;

    return true;
  }

  return false;
}

// =====================================================
// NORMAL DISPLAY
// =====================================================

void displayNormal()
{
  display.clear();

  display.setFont(
    ArialMT_Plain_10
  );

  // ===================================================
  // ACCELERATION
  // ===================================================

  display.drawString(
    0,
    0,
    "A:"
  );

  display.drawString(
    15,
    0,
    String(ax_g, 2) +
    "," +
    String(ay_g, 2) +
    "," +
    String(az_g, 2)
  );

  // ===================================================
  // GYRO
  // ===================================================

  display.drawString(
    0,
    12,
    "G:"
  );

  display.drawString(
    15,
    12,
    String(gx_dps, 1) +
    "," +
    String(gy_dps, 1) +
    "," +
    String(gz_dps, 1)
  );

  // ===================================================
  // RGB
  // ===================================================

  display.drawString(
    0,
    24,
    "R:" +
    String(redValue) +
    " G:" +
    String(greenValue) +
    " B:" +
    String(blueValue)
  );

  // ===================================================
  // PRESSURE
  // ===================================================

  display.drawString(
    0,
    36,
    "P:" +
    String(bmpPressure, 3) +
    " bar"
  );

  // ===================================================
  // STATUS
  // ===================================================

  display.drawString(
    0,
    52,
    "STATUS: NORMAL"
  );

  display.display();
}

// =====================================================
// TAMPER DISPLAY
// =====================================================

void displayTampered()
{
  display.clear();

  display.setFont(
    ArialMT_Plain_16
  );

  display.drawString(
    15,
    5,
    "TAMPERED"
  );

  display.setFont(
    ArialMT_Plain_10
  );

  display.drawString(
    10,
    32,
    "Monitoring STOPPED"
  );

  display.drawString(
    12,
    47,
    "Press 3 times"
  );

  display.display();
}

// =====================================================
// CREATE JSON
// =====================================================
//
// Example:
//
// [{"Pressure":12.45,
//   "Movement":"S001",
//   "AX":25.30,
//   "AY":14.20,
//   "AZ":8.70,
//   "GX":12.40,
//   "GY":5.20,
//   "GZ":18.60,
//   "RED":22.10,
//   "GREEN":8.40,
//   "BLUE":31.70}]
//
// =====================================================

String createDifferenceJSON()
{
  String json;

  json.reserve(300);

  json = "[";

  json += "{";

  // ===================================================
  // PRESSURE
  // ===================================================

  json +=
    "\"Pressure\":";

  json +=
    String(
      tamper_d_pressure,
      2
    );

  // ===================================================
  // MOVEMENT
  // ===================================================

  json +=
    ",\"Movement\":\"";

  json +=
    movementID;

  json +=
    "\"";

  // ===================================================
  // ACCELERATION
  // ===================================================

  json +=
    ",\"AX\":";

  json +=
    String(
      tamper_d_ax,
      2
    );

  json +=
    ",\"AY\":";

  json +=
    String(
      tamper_d_ay,
      2
    );

  json +=
    ",\"AZ\":";

  json +=
    String(
      tamper_d_az,
      2
    );

  // ===================================================
  // GYROSCOPE
  // ===================================================

  json +=
    ",\"GX\":";

  json +=
    String(
      tamper_d_gx,
      2
    );

  json +=
    ",\"GY\":";

  json +=
    String(
      tamper_d_gy,
      2
    );

  json +=
    ",\"GZ\":";

  json +=
    String(
      tamper_d_gz,
      2
    );

  // ===================================================
  // RGB
  // ===================================================

  json +=
    ",\"RED\":";

  json +=
    String(
      tamper_d_red,
      2
    );

  json +=
    ",\"GREEN\":";

  json +=
    String(
      tamper_d_green,
      2
    );

  json +=
    ",\"BLUE\":";

  json +=
    String(
      tamper_d_blue,
      2
    );

  // ===================================================
  // END JSON
  // ===================================================

  json +=
    "}";

  json +=
    "]";

  return json;
}

// =====================================================
// COUNTDOWN DISPLAY
// =====================================================

void countdownDisplay()
{
  unsigned long elapsed =
    millis() -
    countdownStart;

  // ===================================================
  // COUNTDOWN COMPLETE
  // ===================================================

  if (
    elapsed >=
    COUNTDOWN_TIME
  )
  {
    countdownRunning =
      false;

    display.clear();

    display.setFont(
      ArialMT_Plain_10
    );

    display.drawString(
      0,
      20,
      "Stabilizing..."
    );

    display.drawString(
      0,
      35,
      "Capturing reference"
    );

    display.display();

    delay(500);

    // =================================================
    // CAPTURE REFERENCE
    // =================================================

    captureReference();

    display.clear();

    display.drawString(
      0,
      10,
      "REFERENCE CAPTURED"
    );

    display.drawString(
      0,
      27,
      "Monitoring started"
    );

    display.drawString(
      0,
      44,
      "Tolerance: 10%"
    );

    display.display();

    delay(1500);

    monitoring =
      true;

    return;
  }

  // ===================================================
  // REMAINING TIME
  // ===================================================

  unsigned long remaining =
    (
      COUNTDOWN_TIME -
      elapsed +
      999
    ) /
    1000;

  display.clear();

  display.setFont(
    ArialMT_Plain_10
  );

  display.drawString(
    0,
    0,
    "40 SECOND COUNTDOWN"
  );

  display.setFont(
    ArialMT_Plain_24
  );

  display.drawString(
    45,
    20,
    String(remaining) +
    "s"
  );

  display.display();
}

// =====================================================
// INITIAL DOUBLE PRESS
// =====================================================

void checkInitialButton()
{
  static bool previousState =
    HIGH;

  bool currentState =
    digitalRead(
      SWITCH_PIN
    );

  // ===================================================
  // BUTTON PRESSED
  // ===================================================

  if (
    previousState == HIGH &&
    currentState == LOW
  )
  {
    unsigned long now =
      millis();

    // =================================================
    // FIRST PRESS
    // =================================================

    if (
      !firstPress
    )
    {
      firstPress =
        true;

      firstPressTime =
        now;

      Serial.println(
        "FIRST PRESS"
      );

      display.clear();

      display.setFont(
        ArialMT_Plain_10
      );

      display.drawString(
        0,
        15,
        "FIRST PRESS"
      );

      display.drawString(
        0,
        30,
        "Press again within"
      );

      display.drawString(
        0,
        45,
        "5 seconds"
      );

      display.display();
    }

    // =================================================
    // SECOND PRESS
    // =================================================

    else
    {
      if (
        now -
        firstPressTime
        <=
        DOUBLE_PRESS_WINDOW
      )
      {
        Serial.println(
          "DOUBLE PRESS DETECTED"
        );

        Serial.println(
          "Starting 40 second countdown"
        );

        countdownRunning =
          true;

        monitoring =
          false;

        referenceCaptured =
          false;

        tampered =
          false;

        countdownStart =
          now;

        firstPress =
          false;
      }
      else
      {
        firstPressTime =
          now;
      }
    }

    delay(60);
  }

  previousState =
    currentState;

  // ===================================================
  // FIRST PRESS TIMEOUT
  // ===================================================

  if (
    firstPress &&
    millis() -
    firstPressTime >
    DOUBLE_PRESS_WINDOW
  )
  {
    firstPress =
      false;
  }
}

// =====================================================
// TRIPLE PRESS AFTER TAMPER
// =====================================================

void checkTripleButton()
{
  static bool previousState =
    HIGH;

  bool currentState =
    digitalRead(
      SWITCH_PIN
    );

  // ===================================================
  // BUTTON PRESSED
  // ===================================================

  if (
    previousState == HIGH &&
    currentState == LOW
  )
  {
    unsigned long now =
      millis();

    // =================================================
    // PRESS SEQUENCE
    // =================================================

    if (
      triplePressCount == 0 ||
      now -
      lastTriplePress >
      TRIPLE_PRESS_WINDOW
    )
    {
      triplePressCount =
        1;
    }
    else
    {
      triplePressCount++;
    }

    lastTriplePress =
      now;

    Serial.print(
      "Post-tamper press: "
    );

    Serial.println(
      triplePressCount
    );

    // =================================================
    // THREE PRESSES
    // =================================================

    if (
      triplePressCount >= 3
    )
    {
      triplePressCount =
        0;

      Serial.println();

      Serial.println(
        "=============================="
      );

      Serial.println(
        "THREE PRESSES DETECTED"
      );

      Serial.println(
        "Generating QR..."
      );

      Serial.println(
        "=============================="
      );

      // =================================================
      // CREATE JSON
      // =================================================

      String json =
        createDifferenceJSON();

      Serial.println(
        "QR DATA:"
      );

      Serial.println(
        json
      );

      // =================================================
      // DISPLAY QR
      // =================================================

      qrcodeGeneration(
        json
      );
    }

    delay(60);
  }

  previousState =
    currentState;

  // ===================================================
  // TRIPLE PRESS TIMEOUT
  // ===================================================

  if (
    triplePressCount > 0 &&
    millis() -
    lastTriplePress >
    TRIPLE_PRESS_WINDOW
  )
  {
    triplePressCount =
      0;
  }
}

// =====================================================
// SENSOR MONITORING
// =====================================================

void monitorSensors()
{
  // ===================================================
  // IMPORTANT:
  // DO NOT READ SENSORS AFTER TAMPER
  // ===================================================

  if (
    tampered
  )
  {
    return;
  }

  // ===================================================
  // READ CURRENT VALUES
  // ===================================================

  readAllSensors();

  // ===================================================
  // CHECK TAMPER
  // ===================================================

  if (
    checkTamper()
  )
  {
    // ===============================================
    // LOCK SYSTEM
    // ===============================================

    tampered =
      true;

    monitoring =
      false;

    // ===============================================
    // DISPLAY TAMPER
    // ===============================================

    displayTampered();

    // ===============================================
    // SERIAL
    // ===============================================

    Serial.println();

    Serial.println(
      "****************************"
    );

    Serial.println(
      "          TAMPERED"
    );

    Serial.println(
      " SENSOR ACQUISITION STOPPED"
    );

    Serial.println(
      " Press button 3 times"
    );

    Serial.println(
      "****************************"
    );

    Serial.println();

    // ===============================================
    // SHOW SAVED JSON
    // ===============================================

    Serial.println(
      "Saved JSON:"
    );

    Serial.println(
      createDifferenceJSON()
    );

    return;
  }

  // ===================================================
  // NORMAL DISPLAY
  // ===================================================

  displayNormal();

  delay(300);
}

// =====================================================
// MAIN LOOP
// =====================================================

void loop()
{
  // ===================================================
  // TAMPER MODE
  // ===================================================

  if (
    tampered
  )
  {
    /*
       IMPORTANT:

       No sensor functions are called here.

       Only the button is checked.
    */

    checkTripleButton();

    return;
  }

  // ===================================================
  // INITIAL DOUBLE PRESS
  // ===================================================

  checkInitialButton();

  // ===================================================
  // COUNTDOWN
  // ===================================================

  if (
    countdownRunning
  )
  {
    countdownDisplay();

    return;
  }

  // ===================================================
  // MONITORING
  // ===================================================

  if (
    monitoring &&
    referenceCaptured
  )
  {
    monitorSensors();

    return;
  }
}