/*
  This code is developed under the MYOSA (LearnTheEasyWay) initiative of MakeSense EduTech and Pegasus Automation.
  Code has been derived from internet sources and component datasheets.
  Existing readily-available libraries would have been used "AS IS" and modified for ease of learning purpose.
  
  OLED Demo
  Connection: Connect the "OLED" board from the MYOSA kit with the "Controller" board and power them up.
  Working: OLED board will display welcome message and demonstrate its graphical capabilities by different symbols and animations.

  Synopsis of OLED
  MYOSA Platform consists of a beautiful OLED Display Board. It is equiped with SSD1306 IC.
  It is a very small display, about 1" in diagonal but still very readable due to high contrast. 
  This display is made of 128x64 individual white OLED pixels, each one is turned on or off by the controller chip.
  I2C Address of the board = 0x3C.
  Detailed Information about OLED board Library and usage is provided in the link below.
  Detailed Guide: https://drive.google.com/file/d/1On6kzIq3ejcu9aMGr2ZB690NnFrXG2yO/view

  NOTE
  All information, including URL references, is subject to change without prior notice.
  Please always use the latest versions of software-release for best performance.
  Unless required by applicable law or agreed to in writing, this software is distributed on an 
  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied

  Modifications
  1 December, 2021 by Pegasus Automation
  (as a part of MYOSA Initiative)
  
  Contact Team MakeSense EduTech for any kind of feedback/issues pertaining to performance or any update request.
  Email: dev.myosa@gmail.com
*/

/* Library Inclusion */
#include <ArduinoJson.h>
#include <Arduino.h>
#define OLEDDISPLAY
#include <qrcodeoled.h>
#include <SSD1306.h>
#include <LightProximityAndGesture.h>
#include <BarometricPressure.h>
#include <AccelAndGyro.h>



/* Creating Object of oLed Class. Screen Width = 128, Screen Height = 64 in pixels. Defined already in library. */
JsonDocument doc;
SSD1306 display(0x3c, 21, 22);  // Only change
QRcodeOled qrcode(&display);
LightProximityAndGesture Lpg;
BarometricPressure Pr(ULTRA_HIGH_RESOLUTION);
AccelAndGyro Ag;



/* Setup Function */
void setup(void)
{
  
  /* Setting up communication */
  Serial.begin(115200);
  Wire.begin();
  int p = Pr.getPressurePascal();
  int m = Ag.getAccelX() * Ag.getAccelY() * Ag.getAccelZ();
  int pro = Lpg.getProximity();
  String json = "[";

}



/* Loop Function */
void loop(){

  if(Pr.getPressurePascal() != p || Ag.getAccelX() * Ag.getAccelY() * Ag.getAccelZ() != m || Lpg.getProximity() != pro){
    doc["Pressure"] = Pr.getPressurePascal();
    doc["Movement"] = Ag.getAccelX() * Ag.getAccelY() * Ag.getAccelZ();
    doc["Proximity"] = Lpg.getProximity();
    doc["Timestamp"];

    String temp;
    serializeJson(doc, temp);
    json += temp;
    json += ","
  }
 
}



void setupDisplay() {
    display.init();
    display.clear();
    display.display();
    display.flipScreenVertically();
}



void displayQR(String text, int duration) {
  // Initialize QRcode display using library
    qrcode.init();
  // create qrcode
    qrcode.create(text);
    delay(duration);
  // Clear the screen after the delay
    display.clear();
    display.display();
}



void displayCenteredText(String text, int duration) {
  // Set the font size
  display.setFont(ArialMT_Plain_16);

  // Calculate the width and height of the text to center it
  int16_t textWidth = display.getStringWidth(text);  // Get text width
  int16_t textHeight = 16;                           // Font height for ArialMT_Plain_16 is 16 pixels

  // Set cursor position to center (horizontal and vertical centering)
  int16_t x = (display.getWidth() - textWidth) / 2;
  int16_t y = (display.getHeight() - textHeight) / 2;

  // Clear screen and draw the text at the calculated position
  display.clear();
  display.drawString(x, y, text);  // Use drawString to draw text at the calculated position
  display.display();

  // Keep the text on the screen for the specified duration (in milliseconds)
  delay(duration);

  // Clear the screen after the delay
  display.clear();
  display.display();
}



void qrcodeGeneration(String text_2){
  text_2.remove(text_2.length()-1);
  text_2 += "]"; 
  setupDisplay();
  displayCenteredText("Scan QR", 2000);
  displayQR(text_2, 100000);
}

  /* Loop function draws different graphical images and animations. */
  /*testdrawCube();      // Rotate Cube

  testdrawline();      // Draw many lines

  testdrawrect();      // Draw rectangles (outlines)

  testfillrect();      // Draw rectangles (filled)

  testdrawcircle();    // Draw circles (outlines)

  testfillcircle();    // Draw circles (filled)

  testdrawroundrect(); // Draw rounded rectangles (outlines)

  testfillroundrect(); // Draw rounded rectangles (filled)

  testdrawtriangle();  // Draw triangles (outlines)

  testfilltriangle();  // Draw triangles (filled)

  testdrawchar();      // Draw characters of the default font

  // Clear the buffer
  display.clearDisplay();

  delay(5000u);*/




/* Below are a few derived functions from the base functions implemented in library. */

/*void testdrawCube() {
  for(float angle=0; angle <= 360; angle++)
  {
    display.drawCube(angle,angle,angle);
  }
}

void testdrawline() {
  int16_t i;

  display.clearDisplay(); // Clear display buffer

  for(i=0; i<display.width(); i+=4) {
    display.drawLine(0, 0, i, display.height()-1, SSD1306_WHITE);
    display.display(); // Update screen with each newly-drawn line
    delay(1);
  }
  for(i=0; i<display.height(); i+=4) {
    display.drawLine(0, 0, display.width()-1, i, SSD1306_WHITE);
    display.display();
    delay(1);
  }
  delay(250);

  display.clearDisplay();

  for(i=0; i<display.width(); i+=4) {
    display.drawLine(0, display.height()-1, i, 0, SSD1306_WHITE);
    display.display();
    delay(1);
  }
  for(i=display.height()-1; i>=0; i-=4) {
    display.drawLine(0, display.height()-1, display.width()-1, i, SSD1306_WHITE);
    display.display();
    delay(1);
  }
  delay(250);

  display.clearDisplay();

  for(i=display.width()-1; i>=0; i-=4) {
    display.drawLine(display.width()-1, display.height()-1, i, 0, SSD1306_WHITE);
    display.display();
    delay(1);
  }
  for(i=display.height()-1; i>=0; i-=4) {
    display.drawLine(display.width()-1, display.height()-1, 0, i, SSD1306_WHITE);
    display.display();
    delay(1);
  }
  delay(250);

  display.clearDisplay();

  for(i=0; i<display.height(); i+=4) {
    display.drawLine(display.width()-1, 0, 0, i, SSD1306_WHITE);
    display.display();
    delay(1);
  }
  for(i=0; i<display.width(); i+=4) {
    display.drawLine(display.width()-1, 0, i, display.height()-1, SSD1306_WHITE);
    display.display();
    delay(1);
  }

  delay(2000); // Pause for 2 seconds
}

void testdrawrect(void) {
  display.clearDisplay();

  for(int16_t i=0; i<display.height()/2; i+=2) {
    display.drawRect(i, i, display.width()-2*i, display.height()-2*i, SSD1306_WHITE);
    display.display(); // Update screen with each newly-drawn rectangle
    delay(1);
  }

  delay(2000);
}

void testfillrect(void) {
  display.clearDisplay();

  for(int16_t i=0; i<display.height()/2; i+=3) {
    // The INVERSE color is used so rectangles alternate white/black
    display.fillRect(i, i, display.width()-i*2, display.height()-i*2, SSD1306_INVERSE);
    display.display(); // Update screen with each newly-drawn rectangle
    delay(1);
  }

  delay(2000);
}

void testdrawcircle(void) {
  display.clearDisplay();

  for(int16_t i=0; i<max(display.width(),display.height())/2; i+=2) {
    display.drawCircle(display.width()/2, display.height()/2, i, SSD1306_WHITE);
    display.display();
    delay(1);
  }

  delay(2000);
}

void testfillcircle(void) {
  display.clearDisplay();

  for(int16_t i=max(display.width(),display.height())/2; i>0; i-=3) {
    // The INVERSE color is used so circles alternate white/black
    display.fillCircle(display.width() / 2, display.height() / 2, i, SSD1306_INVERSE);
    display.display(); // Update screen with each newly-drawn circle
    delay(1);
  }

  delay(2000);
}

void testdrawroundrect(void) {
  display.clearDisplay();

  for(int16_t i=0; i<display.height()/2-2; i+=2) {
    display.drawRoundRect(i, i, display.width()-2*i, display.height()-2*i,
      display.height()/4, SSD1306_WHITE);
    display.display();
    delay(1);
  }

  delay(2000);
}

void testfillroundrect(void) {
  display.clearDisplay();

  for(int16_t i=0; i<display.height()/2-2; i+=2) {
    // The INVERSE color is used so round-rects alternate white/black
    display.fillRoundRect(i, i, display.width()-2*i, display.height()-2*i,
      display.height()/4, SSD1306_INVERSE);
    display.display();
    delay(1);
  }

  delay(2000);
}

void testdrawtriangle(void) {
  display.clearDisplay();

  for(int16_t i=0; i<max(display.width(),display.height())/2; i+=5) {
    display.drawTriangle(
      display.width()/2  , display.height()/2-i,
      display.width()/2-i, display.height()/2+i,
      display.width()/2+i, display.height()/2+i, SSD1306_WHITE);
    display.display();
    delay(1);
  }

  delay(2000);
}

void testfilltriangle(void) {
  display.clearDisplay();

  for(int16_t i=max(display.width(),display.height())/2; i>0; i-=5) {
    // The INVERSE color is used so triangles alternate white/black
    display.fillTriangle(
      display.width()/2  , display.height()/2-i,
      display.width()/2-i, display.height()/2+i,
      display.width()/2+i, display.height()/2+i, SSD1306_INVERSE);
    display.display();
    delay(1);
  }

  delay(2000);
}

void testdrawchar(void) {
  display.clearDisplay();

  display.setTextSize(1);      // Normal 1:1 pixel scale
  display.setTextColor(SSD1306_WHITE); // Draw white text
  display.setCursor(0, 0);     // Start at top-left corner
  display.cp437(true);         // Use full 256 char 'Code Page 437' font

  // Not all the characters will fit on the display. This is normal.
  // Library will draw what it can and the rest will be clipped.
  for(int16_t i=0; i<256; i++) {
    if(i == '\n') display.write(' ');
    else          display.write(i);
    delay(200);
    display.display();
  }
  delay(2000);
}*/