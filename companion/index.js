import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { me } from "companion";

console.log("Companion starting! LaunchReasons: " + JSON.stringify(me.launchReasons));

settingsStorage.onchange = function(evt) {
  console.log("Settings have changed! " + JSON.stringify(evt));
  sendSettings();
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Ready to send or receive messages
  sendSettings();
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  console.log(JSON.stringify(evt.data));
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}

function sendSettings() {
  let targetCadence = settingsStorage.getItem("targetCadence");
  if (targetCadence) {
    try {
      targetCadence = JSON.parse(targetCadence);
    }
    catch (e) {
      console.log("error parsing setting value: " + e);
    }
  }
  console.log("Setting value: " + JSON.stringify(targetCadence));
  
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    try {
      // send target cadence
      console.log("Sending target cadence: " + JSON.stringify(targetCadence));
      messaging.peerSocket.send(targetCadence);
    }
    catch (e) {
      console.log("error");
      console.log(e);
    }
  }
}
