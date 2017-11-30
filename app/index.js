import document from "document";
import { vibration } from "haptics";
import { today } from "user-activity";
import { display } from "display";
import * as messaging from "messaging";


display.autoOff = false;
console.log("Cadence Coach App Started");


let targetCadenceData = document.getElementById("target-cadence-data");
let cadenceData = document.getElementById("cadence-data");
let newSteps = 0;
let prevSteps = parseInt(today.local.steps);
let prevCadence = 0;
let newCadence = 0;
let weightedCadence = 0;
let targetCadence = 180;

targetCadenceData.text = targetCadence;
cadenceData.text = "--";


function refreshCadence() {
  newSteps = parseInt(today.local.steps); // Get current step count
  newCadence = (newSteps - prevSteps) * 12; // Calculate current cadence
  console.log("Current cadence: " + newCadence);
  weightedCadence = parseInt((prevCadence * .002) + (newCadence * .998)); // Calculate weighted cadence
  console.log("Weighted cadence: " + weightedCadence);
  prevSteps = newSteps;
  prevCadence = weightedCadence;
  cadenceData.text = weightedCadence;
  analyzeCadence(weightedCadence);
}

function analyzeCadence(cadence) {
  if (cadence > 0 && cadence >= (targetCadence + 3)) {
    vibration.start("confirmation-max");
  }
  if (cadence > 0 && cadence <= (targetCadence - 3)) {
    vibration.start("nudge-max");
  }
}

// Listen for the onopen event
messaging.peerSocket.onopen = function(evt) {
  // Ready to send or receive messages
  console.log("Socket opened");
  messaging.peerSocket.send("Hi!");
  targetCadence = evt.data.name;
  console.log("Target cadence set to: " + evt.data.name);
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  targetCadence = evt.data.name;
  console.log("Received message!");
  console.log("Target cadence set to: " + evt.data.name);
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}

refreshCadence();
setInterval(refreshCadence, 5000);
