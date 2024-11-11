// Get references to DOM elements
const joinBtn = document.getElementById('join-btn') as HTMLButtonElement;
const roomSelection = document.getElementById('room-selection') as HTMLDivElement;
const webcrumbsDiv = document.getElementById('webcrumbs') as HTMLDivElement;
const localVideo = document.getElementById('local-video') as HTMLVideoElement;
const remoteVideo = document.getElementById('remote-video') as HTMLVideoElement;
const messageInput = document.getElementById('message-input') as HTMLInputElement;
const sendBtn = document.getElementById('send-btn') as HTMLButtonElement;
const messagesDiv = document.getElementById('messages') as HTMLDivElement;
const endCallBtn = document.getElementById('end-call-btn') as HTMLButtonElement;
const muteBtn = document.getElementById('mute-btn') as HTMLButtonElement;
const videoToggleBtn = document.getElementById('video-toggle-btn') as HTMLButtonElement;

let localStream: MediaStream;
let remoteStream: MediaStream;
let peerConnection: RTCPeerConnection;
let ws: WebSocket;
let roomId: string;

const config = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' } // Public STUN server
    ]
};

// Event listener for the "Join" button
joinBtn.onclick = async () => {
    roomId = (document.getElementById('room-id') as HTMLInputElement).value;
    if (!roomId) {
        alert('Please enter a room ID.');
        return;
    }

    // Hide room selection and show main interface
    roomSelection.style.display = 'none';
    webcrumbsDiv.style.display = 'block';

    // Connect to the signaling server via WebSocket
    ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
        // Join the specified room
        ws.send(JSON.stringify({ type: 'join', roomId }));
    };

    ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'signal') {
            if (data.sdp) {
                // Set remote description
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
                if (peerConnection.remoteDescription?.type === 'offer') {
                    // Create and send answer
                    const answer = await peerConnection.createAnswer();
                    await peerConnection.setLocalDescription(answer);
                    ws.send(JSON.stringify({ type: 'signal', sdp: peerConnection.localDescription }));
                }
            } else if (data.candidate) {
                // Add ICE candidate
                await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
        } else if (data.type === 'chat') {
            // Display received chat message
            displayMessage(data.message);
        }
    };

    // Get local media stream and create peer connection
    await startLocalStream();
    createPeerConnection();
};

// Event listener for the "Send" button
sendBtn.onclick = () => {
    const message = messageInput.value;
    if (message) {
        displayOwnMessage(message);
        ws.send(JSON.stringify({ type: 'chat', message }));
        messageInput.value = '';
    }
};

// Event listener for the "End Call" button
endCallBtn.onclick = () => {
    peerConnection.close();
    ws.close();
    webcrumbsDiv.style.display = 'none';
    roomSelection.style.display = 'block';
};

// Event listener for the "Mute" button
muteBtn.onclick = () => {
    const audioTracks = localStream.getAudioTracks();
    if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        muteBtn.classList.toggle('bg-gray-700');
        muteBtn.classList.toggle('bg-red-600');
    }
};

// Event listener for the "Video Toggle" button
videoToggleBtn.onclick = () => {
    const videoTracks = localStream.getVideoTracks();
    if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
        videoToggleBtn.classList.toggle('bg-gray-700');
        videoToggleBtn.classList.toggle('bg-red-600');
    }
};

// Display received chat message
function displayMessage(message: string) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('flex', 'items-start', 'gap-2');
    messageElement.innerHTML = `
        <img
            src="https://tools-api.webcrumbs.org/image-placeholder/40/40/avatars/2"
            alt="User avatar"
            class="w-10 h-10 rounded-full object-contain"
        />
        <div class="bg-gray-200 p-2 rounded-md">
            <p class="text-sm font-medium">Partner</p>
            <p class="text-sm text-gray-600">${message}</p>
        </div>
    `;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Display own chat message
function displayOwnMessage(message: string) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('flex', 'items-start', 'gap-2', 'self-end');
    messageElement.innerHTML = `
        <div class="bg-blue-500 p-2 rounded-md text-white">
            <p class="text-sm">${message}</p>
        </div>
        <img
            src="https://tools-api.webcrumbs.org/image-placeholder/40/40/avatars/1"
            alt="User avatar"
            class="w-10 h-10 rounded-full object-contain"
        />
    `;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Get local media stream (video and audio)
async function startLocalStream() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
    } catch (error) {
        console.error('Error accessing media devices.', error);
    }
}

// Create RTCPeerConnection and set up event handlers
function createPeerConnection() {
    peerConnection = new RTCPeerConnection(config);

    // Send any ICE candidates to the other peer
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            ws.send(JSON.stringify({ type: 'signal', candidate: event.candidate }));
        }
    };

    // Add remote tracks to remoteStream
    peerConnection.ontrack = (event) => {
        if (!remoteStream) {
            remoteStream = new MediaStream();
            remoteVideo.srcObject = remoteStream;
        }
        remoteStream.addTrack(event.track);
    };

    // Add local tracks to the connection
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    // Create and send offer when negotiation is needed
    peerConnection.onnegotiationneeded = async () => {
        try {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            ws.send(JSON.stringify({ type: 'signal', sdp: peerConnection.localDescription }));
        } catch (error) {
            console.error('Error during negotiation.', error);
        }
    };
}
