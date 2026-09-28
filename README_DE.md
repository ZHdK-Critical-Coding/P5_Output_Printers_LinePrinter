# P5.js: Line Printer

[English](readme.md)

Schickt Text, Papiervorschub-Befehle und die Zeichenfläche als Bitmap per
WebSocket an einen Drucker-Server. Text kann fett, unterstrichen, breit
oder doppelt hoch gedruckt werden. Ein Ausgangspunkt, um aus einem Sketch
Zeile für Zeile zu drucken.

## Installation

Bibliotheken (in `libraries/`): p5.js 1.10.0, p5.sound 1.0.1 (eingebunden,
nicht verwendet).

Lizenz: MIT

## Server

Braucht `lp-websockets` aus
[Servers_RaspberriPi](https://github.com/ZHdK-Critical-Coding/Servers_RaspberriPi)
(WebSocket, Port 8090), auf einem Raspberry Pi mit einem
ESC/P-Zeilendrucker an USB, im selben Netzwerk wie dein Computer. Zuerst im
Ordner mit `bash run.sh` (oder `node printer.js`) starten. Er druckt Text,
bewegt das Papier und druckt Bilder und antwortet mit `ok` (oder
`printed_image`). In `sketch.js` `printerConnection` auf seine Adresse
setzen (Standard `ws://10.21.12.76:8090`).

## Ausführen

1. Sicherstellen, dass der Drucker-Server läuft (siehe Server).
2. Den Ordner in Visual Studio Code öffnen und Live Server starten (in der
   Statusleiste auf **Go Live** klicken).
3. Text ins Textfeld schreiben und auf **Print Text** klicken. **Print
   Bitmap** druckt die Zeichenfläche, die Pfeil-Knöpfe schieben das Papier
   um die Anzahl Schritte im Eingabefeld vor oder zurück.

Der Verbindungsstatus wird auf der Zeichenfläche angezeigt.

## Coding-Hilfe

- **`sketch.js` → `printerConnection`**: WebSocket-Adresse des
  Drucker-Servers.
- **`communicateWithPrinter()`**: sendet Daten und gibt ein Promise zurück,
  das erfüllt wird, wenn der Server `ok` oder `printed_image` antwortet.
  Jede andere Antwort (z.B. `busy`), eine geschlossene oder fehlende
  Verbindung lehnt es ab; die Knopf-Handler melden solche Fehler mit
  `printError()` in der Konsole.
- **`sendText(text, w, h, style)`**: sendet `{ text, w, h, style }` als
  JSON. `w` 0/1 = normal/breit, `h` 0/1 = normal/doppelt hoch, `style`
  `'b'` fett, `'u'` unterstrichen, `'bu'` beides. Nicht jede Kombination
  funktioniert auf jedem Drucker.
- **`paperFeed(direction, steps)`**: sendet `{ direction, steps }` mit
  `'up'` oder `'down'`. Ein Schritt ist eine Mikro-Vorschub-Einheit, oft
  1/203 Zoll.
- **`printBitmap()`**: wandelt die Zeichenfläche mit `canvas.toBlob()` in
  ein PNG um und sendet es als Binärdaten.
- **`setup()`**: öffnet den WebSocket und erstellt Textfeld (`textInput`)
  und Knöpfe. Die auskommentierten `sendText()`-Aufrufe im Handler von
  **Print Text** zeigen die anderen Stile.
- **`draw()`**: zeichnet ein Raster und den Verbindungsstatus – genau das
  druckt auch **Print Bitmap**.
