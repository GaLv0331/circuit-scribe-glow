import { BlogPost } from "@/types/blog";

export const samplePosts: BlogPost[] = [
  {
    id: "1",
    title: "Building an LED Blinker Circuit with Arduino",
    author: "Circuit Scribe",
    date: "2024-01-15",
    tags: ["Arduino", "LED", "Beginner", "PWM"],
    theory: {
      title: "Understanding LED Control",
      content: `Light Emitting Diodes (LEDs) are semiconductor devices that emit light when current flows through them. To control an LED with a microcontroller like Arduino, we need to understand a few key concepts:

1. **Forward Voltage**: LEDs have a forward voltage drop (typically 1.8-3.3V depending on color)
2. **Current Limiting**: LEDs require current limiting resistors to prevent damage
3. **Digital I/O**: Arduino pins can source/sink current to drive LEDs
4. **PWM (Pulse Width Modulation)**: Technique to control LED brightness by rapidly switching the pin on/off

For a basic LED circuit, we calculate the resistor value using Ohm's law:
R = (Vsupply - Vled) / Iled

Where:
- Vsupply = 5V (Arduino supply)
- Vled = 2.0V (typical red LED)
- Iled = 20mA (desired current)

Therefore: R = (5-2)/0.02 = 150Ω (use 220Ω for safety margin)`
    },
    code: {
      title: "Arduino LED Blinker Code",
      language: "arduino",
      content: `// LED Blinker Circuit
// Blinks an LED connected to pin 13

const int ledPin = 13;    // LED connected to digital pin 13
int delayTime = 1000;     // Delay time in milliseconds

void setup() {
  // Initialize the digital pin as an output
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("LED Blinker Started!");
}

void loop() {
  // Turn the LED on
  digitalWrite(ledPin, HIGH);
  Serial.println("LED ON");
  delay(delayTime);
  
  // Turn the LED off
  digitalWrite(ledPin, LOW);
  Serial.println("LED OFF");
  delay(delayTime);
}`,
      tabs: [
        {
          name: "Basic Blink",
          language: "arduino",
          content: `void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}`
        },
        {
          name: "PWM Fade",
          language: "arduino",
          content: `int brightness = 0;
int fadeAmount = 5;

void setup() {
  pinMode(9, OUTPUT);
}

void loop() {
  analogWrite(9, brightness);
  brightness += fadeAmount;
  
  if (brightness <= 0 || brightness >= 255) {
    fadeAmount = -fadeAmount;
  }
  delay(30);
}`
        }
      ]
    },
    simulation: {
      title: "Circuit Simulation",
      description: "This circuit shows a simple LED connected to Arduino pin 13 through a 220Ω current-limiting resistor. The LED will blink on and off every second.",
      circuitData: {
        components: [
          {
            id: "arduino",
            type: "voltage_source",
            position: { x: 100, y: 200 },
            value: "5V"
          },
          {
            id: "resistor1",
            type: "resistor",
            position: { x: 250, y: 200 },
            value: "220Ω"
          },
          {
            id: "led1",
            type: "capacitor", // Using capacitor symbol to represent LED
            position: { x: 400, y: 200 },
            value: "LED"
          },
          {
            id: "ground1",
            type: "ground",
            position: { x: 100, y: 300 }
          }
        ],
        connections: [
          { from: "arduino", to: "resistor1" },
          { from: "resistor1", to: "led1" },
          { from: "arduino", to: "ground1" }
        ]
      }
    }
  },
  {
    id: "2",
    title: "Op-Amp Based Temperature Sensor",
    author: "Circuit Scribe",
    date: "2024-01-10",
    tags: ["Op-Amp", "Temperature", "Analog", "Sensors"],
    theory: {
      title: "Operational Amplifier Fundamentals",
      content: `Operational amplifiers (op-amps) are high-gain differential amplifiers that form the building blocks of many analog circuits. For temperature sensing applications, we commonly use them in:

1. **Non-inverting Amplifier Configuration**: Provides signal amplification without phase inversion
2. **Voltage Follower**: Provides high input impedance and low output impedance
3. **Comparator**: Compares input voltage against a reference

Key op-amp characteristics:
- Very high input impedance (>1MΩ)
- Very low output impedance (<100Ω)
- High open-loop gain (>100,000)
- Virtual short principle: V+ ≈ V- when negative feedback is applied

For temperature sensing, we use thermistors or temperature-dependent voltage sources. The op-amp amplifies the small voltage changes to readable levels.

Gain calculation for non-inverting amplifier:
Gain = 1 + (Rf/Rin)

Where Rf is feedback resistor and Rin is input resistor.`
    },
    code: {
      title: "Temperature Reading Code",
      language: "arduino",
      content: `// Temperature Sensor with Op-Amp
#include <math.h>

const int tempPin = A0;        // Analog pin for temperature
const int ledPin = 13;         // LED for temperature indication
const float referenceVoltage = 5.0;
const float tempThreshold = 25.0;  // Temperature threshold in Celsius

// Thermistor constants
const float R1 = 10000;        // Resistor value in voltage divider
const float thermistorNominal = 10000;
const float temperatureNominal = 25;
const float bCoefficient = 3950;

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  Serial.println("Temperature Monitor Started");
}

void loop() {
  // Read analog value
  int rawValue = analogRead(tempPin);
  float voltage = rawValue * (referenceVoltage / 1023.0);
  
  // Convert to resistance
  float resistance = R1 * (referenceVoltage / voltage - 1);
  
  // Calculate temperature using Steinhart-Hart equation
  float steinhart = resistance / thermistorNominal;
  steinhart = log(steinhart);
  steinhart /= bCoefficient;
  steinhart += 1.0 / (temperatureNominal + 273.15);
  steinhart = 1.0 / steinhart;
  float temperature = steinhart - 273.15;
  
  // Display results
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println("°C");
  
  // Control LED based on temperature
  if (temperature > tempThreshold) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }
  
  delay(1000);
}`
    },
    simulation: {
      title: "Op-Amp Temperature Sensor Circuit",
      description: "This circuit uses an op-amp in non-inverting configuration to amplify the signal from a temperature sensor (thermistor). The output is fed to an Arduino for digital processing.",
      circuitData: {
        components: [
          {
            id: "thermistor",
            type: "resistor",
            position: { x: 150, y: 150 },
            value: "10kΩ NTC"
          },
          {
            id: "r1",
            type: "resistor",
            position: { x: 150, y: 250 },
            value: "10kΩ"
          },
          {
            id: "opamp",
            type: "voltage_source", // Representing op-amp with voltage source
            position: { x: 350, y: 200 },
            value: "LM358"
          },
          {
            id: "rfeedback",
            type: "resistor",
            position: { x: 450, y: 150 },
            value: "10kΩ"
          },
          {
            id: "vcc",
            type: "voltage_source",
            position: { x: 100, y: 100 },
            value: "5V"
          },
          {
            id: "gnd",
            type: "ground",
            position: { x: 150, y: 350 }
          }
        ],
        connections: [
          { from: "vcc", to: "thermistor" },
          { from: "thermistor", to: "r1" },
          { from: "r1", to: "gnd" },
          { from: "thermistor", to: "opamp" },
          { from: "opamp", to: "rfeedback" }
        ]
      }
    }
  }
];