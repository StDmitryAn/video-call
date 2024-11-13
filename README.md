# Simple 1-on-1 Video Chat Application

This is a simple web application that allows two users to have a video chat and text messaging session. It utilizes WebRTC for peer-to-peer video communication and WebSockets for signaling and chat messages.

## Features

- **1-on-1 Video Chat**: Real-time video communication between two users.
- **Text Chat**: Send and receive text messages during the video call.
- **Mute/Unmute Audio**: Toggle your microphone during the call.
- **Enable/Disable Video**: Turn your camera on or off during the call.
- **End Call**: Disconnect from the call gracefully.

## Technologies Used

- **TypeScript**
- **HTML/CSS**
- **WebRTC**
- **WebSockets**
- **Node.js** (for the signaling server)
- **Tailwind CSS** (via CDN for styling)

## Prerequisites

- **Node.js** (version 14 or higher recommended)
- **npm** (Node Package Manager)

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/StDmitryAn/video-call.git
cd video-call
```

### 2. Install Dependencies

Navigate to the project directory and install the necessary Node.js packages.

```bash
npm install
```

### 3. Run the Signaling Server

The signaling server facilitates the exchange of WebRTC signaling data between peers.

```bash
node server.js
```

You should see the following output:

```
WebSocket server is running on port 8080
```

### 4. Serve the Client Files

You need to serve the `index.html` file and associated assets over HTTP. You can use a simple HTTP server like `http-server` or `live-server`.

#### Option A: Using `http-server`

Install `http-server` globally if you haven't already:

```bash
npm install -g http-server
```

Serve the files:

```bash
http-server .
```

#### Option B: Using `live-server`

Install `live-server` globally if you haven't already:

```bash
npm install -g live-server
```

Serve the files:

```bash
live-server
```

### 5. Open the Application in Your Browser

Open your web browser and navigate to the address provided by the HTTP server, typically:

```
http://127.0.0.1:8080
```

or

```
http://localhost:8080
```

### 6. Testing the Application

To test the video chat functionality:

1. **Open Two Browser Windows**: Open the application in two separate browser windows or tabs. You can also use different browsers (e.g., Chrome and Firefox) to simulate two different users.

2. **Enter the Same Room ID**: In both windows, enter the same room ID (any string) and click the "Join" button.

3. **Grant Permissions**: Allow the browser to access your camera and microphone when prompted.

4. **Start Chatting**: You should now see each other's video feeds and can send text messages.

### 7. Stopping the Application

- **Stop the Signaling Server**: Press `Ctrl+C` in the terminal where the server is running.

- **Stop the HTTP Server**: Press `Ctrl+C` in the terminal where the HTTP server is running.

## Project Structure

```
video-call/
├── index.html          // Main HTML file
├── styles.css          // Custom CSS styles
├── main.ts             // TypeScript client-side script
├── main.js             // Compiled JavaScript from TypeScript
├── server.js           // Node.js WebSocket signaling server
├── package.json        // NPM package file
└── README.md           // Project documentation
```

## Configuration

### TypeScript Compilation

If you make changes to the `main.ts` file, you need to compile it to JavaScript:

```bash
tsc main.ts --target ES6 --module ES6 --outDir . --strict
```

Alternatively, you can set up a `tsconfig.json` file and run `tsc` to watch for changes:

1. Create a `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "ES6",
    "outDir": "./",
    "strict": true,
    "watch": true
  },
  "include": ["main.ts"]
}
```

2. Run the TypeScript compiler in watch mode:

```bash
tsc
```

### Dependencies

Ensure you have the following dependencies installed:

- **WebSocket (ws)**: For the signaling server.

```bash
npm install ws
```

## Notes

- **Security**: For local development, serving over HTTP is acceptable. However, WebRTC requires HTTPS in production environments.

- **STUN/TURN Servers**: This application uses Google's public STUN server. For production use, consider setting up your own STUN/TURN servers.

- **Browser Compatibility**: The application should work on modern browsers that support WebRTC. Cross-browser compatibility has been tested with Chrome and Firefox.

## Troubleshooting

- **No Video or Audio**: Ensure that you have allowed the browser to access your camera and microphone.

- **Cannot Connect Peers**: Check that both peers are connected to the signaling server and are using the same room ID.

- **Errors in Console**: Open the browser's developer console to check for errors and debug accordingly.

## License

This project is licensed under the MIT License.

## Acknowledgments

- **WebRTC**: Real-Time Communication with WebRTC.
- **MDN Web Docs**: For extensive documentation on WebRTC and WebSockets.
- **Tailwind CSS**: For rapid styling using utility-first CSS.

---

**Disclaimer**: This project is for educational purposes and is a simple implementation of WebRTC for peer-to-peer communication. It may not include all the best practices for production-ready applications.
