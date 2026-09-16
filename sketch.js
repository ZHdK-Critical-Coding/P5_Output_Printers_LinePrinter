const printerConnection = 'ws://10.21.12.76:8090' // WebSocket-Adresse des Druckers

let socket;               // WebSocket-Objekt
let printerState = 'not ok' // Statusanzeige der Verbindung


function communicateWithPrinter(sendData) {
  if (!socket || !socket.readyState === WebSocket.OPEN) {
    return
  }

    // Promise, das auf die Antwort vom Server wartet
  return new Promise((resolve, reject) => {
    // Event-Listener für einmalige Antwort
    const handler = (event) => {
      socket.removeEventListener('message', handler) // Listener wieder entfernen
      console.log(event)
      if (event.data == 'ok' || event.data == 'printed_image') {
        resolve(event.data) // Server bestätigt erfolgreich
      }
      //else
      //  reject(event.data)  // Server meldet Fehler
    }
    socket.addEventListener('message', handler) // Listener registrieren

    try {
      socket.send(sendData)   // Daten an den Drucker senden
      console.log("Sent:", sendData)
    } catch (e) {
      reject('socket error')  // Fehler beim Senden
    }
  })
}


// Asynchrone Funktion zum Senden eines Frames an den Drucker
async function printBitmap() {
  const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
  const arrayBuffer = await blob.arrayBuffer();
  await communicateWithPrinter(arrayBuffer);
}

/* BIS HIER */


/* 
  Stiloptionen für den Text:
  'u'  : Unterstrichen
  'bu' : Fett + Unterstrichen
  'b'  : Fett

  W (Breite):
  0: normal
  1: breit

  H (Höhe):
  0: normal
  1: doppelt hoch

  Hinweis: Manche Kombinationen funktionieren möglicherweise nicht auf allen Druckern
*/

// Funktion zum Senden von Text an den Drucker
async function sendText (text, w, h, style) { 
  style = style || '' // Standardstil leer
  w = w || 0          // Standardbreite normal
  h = h || 0          // Standardhöhe normal


  // Prüfen, ob Text vorhanden und Socket offen ist
  if (!text || !socket || socket.readyState !== WebSocket.OPEN) {
    console.warn("Socket nicht bereit oder Text leer")
    return
  }

  const sendData = JSON.stringify({
    text: text, // zu sendender Text
    w: w,       // Breite
    h: h,       // Höhe
    style: style // Stil
  });
  return communicateWithPrinter(sendData)
}


/* 
  direction: 'up' oder 'down'
  steps: Zahl (default 1)

  Steps ist eine Micro-Feed Einheit, oft 1/203 inch, abhängig vom Drucker
*/

// Funktion zur Papiersteuerung
async function paperFeed(direction, steps) {
  // Prüfen, ob Text vorhanden und Socket offen ist
  if (direction != 'up' && direction != 'down') {
    console.warn("Direction muss 'up' oder 'down' sein", direction)
    return
  } 
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn("Socket nicht bereit oder Text leer")
    return
  }
  const sendData = JSON.stringify({
    direction: direction, // zu sendender Text
    steps: steps
  });
  return communicateWithPrinter(sendData)
}




// Setup-Funktion: wird einmalig beim Start ausgeführt
function setup() {
  createCanvas(390, 80); // Canvas zur Anzeige (nur Debug)
  

  // WebSocket-Verbindung zum Drucker erstellen
  socket = new WebSocket(printerConnection);

  // Event: Verbindung erfolgreich hergestellt
  socket.onopen = () => {
    printerState = 'Connected to printer'
  };

  // Event: Fehler in der Verbindung
  socket.onerror = () => {
    printerState = `WebSocket Error`
  };

  // Event: Verbindung geschlossen
  socket.onclose = () => {
    console.log("Connection closed");
  };

  // Benutzeroberfläche
  prompt = createElement('textarea', 'Write Something...') // Textarea für Eingabe

  let button = createButton('Print Text');                     // Druck-Button

  let buttonBitmap = createButton('Print Bitmap');                     // Druck-Button


  steps = createElement('input') // Textarea für Eingabe
  steps.attribute('value', 1);

  let upwards = createButton('&uarr;');                     // Druck-Button
  let downwards = createButton('&darr;');                     // Druck-Button
  button.mousePressed(async () => {
    await sendText(prompt.value(), 0, 0) // Text senden, fett + unterstrichen, doppelte Breite & Höhe
    //await sendText(prompt.value(), 1, 0, 'b') // Text senden, fett + unterstrichen, doppelte Breite & Höhe
    //await sendText(prompt.value(), 0, 1, 'u') // Text senden, fett + unterstrichen, doppelte Breite & Höhe
    //await sendText(prompt.value(), 1, 1, 'bu') // Text senden, fett + unterstrichen, doppelte Breite & Höhe
  });

  upwards.mousePressed(async () => {
    await paperFeed('up', (steps.value()  || 1) * 1)
  });
  downwards.mousePressed(async () => {
    await paperFeed('down', (steps.value() || 1) * 1)
  });

  buttonBitmap.mousePressed(async () => {
    await printBitmap();
    await sendText('after print', 0, 0) // Text senden, fett + unterstrichen, doppelte Breite & Höhe

  });
}

// Draw-Funktion: Anzeige der Druckerstatus
function draw() {
  background(255);           // Hintergrund hellgrau
  for (let x = 0; x < width; x += 10) {
    line(x,0, x, height)
  }
  for (let y = 0; y < height; y += 10) {
    line(0, y, width, y)
  }

  textSize(50)
  textFont('Comic Sans MS')
  text(printerState, 10, 60) // Druckerstatus anzeigen
}