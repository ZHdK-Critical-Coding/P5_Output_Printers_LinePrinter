# P5.js: Line Printer

[Deutsch](README_DE.md)

Sends text, paper-feed commands and the canvas as a bitmap to a printer
server over WebSocket. Text can be printed bold, underlined, wide or double
height. A starting point for printing from a sketch, line by line.

## Installation

Requirements: a printer server that accepts WebSocket connections and
answers with `ok` (or `printed_image`), reachable from your computer's
network.

1. Make sure the printer server is running.
2. Set `printerConnection` in `sketch.js` to the server address (default
   `ws://10.21.12.76:8090`).
3. Open the folder in Visual Studio Code and start Live Server (click
   **Go Live** in the status bar).
4. Type into the text field and click **Print Text**. **Print Bitmap**
   prints the canvas, the arrow buttons feed the paper by the number of
   steps in the input field.

The connection status is shown on the canvas.

Libraries (in `libraries/`): p5.js 1.10.0, p5.sound 1.0.1 (included, not used).

License: MIT

## Coding Help

- **`sketch.js` → `printerConnection`**: WebSocket address of the printer
  server.
- **`communicateWithPrinter()`**: sends data and returns a Promise that
  resolves when the server answers `ok` or `printed_image`. Other answers
  are ignored, so the Promise then never resolves.
- **`sendText(text, w, h, style)`**: sends
  `{ text, w, h, style }` as JSON. `w` 0/1 = normal/wide, `h` 0/1 =
  normal/double height, `style` `'b'` bold, `'u'` underlined, `'bu'` both.
  Not every combination works on every printer.
- **`paperFeed(direction, steps)`**: sends `{ direction, steps }` with
  `'up'` or `'down'`. One step is a micro-feed unit, often 1/203 inch.
- **`printBitmap()`**: converts the canvas to a PNG with `canvas.toBlob()`
  and sends it as binary data.
- **`setup()`**: opens the WebSocket and creates the text field and
  buttons. The commented-out `sendText()` calls in the **Print Text**
  handler show the other styles.
- **`draw()`**: draws a grid and the connection status – this is also what
  **Print Bitmap** prints.
