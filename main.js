// 1. 초기 설정 및 요소 선택
const canvas = document.getElementById('live2d-canvas');
const statusIndicator = document.getElementById('status-indicator');
const errorLog = document.getElementById('error-log');
const canvasContainer = document.getElementById('canvas-container');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

// 배경 이미지 설정
const defaultBg = './bg/ceiling-window-room-night.jpeg';
canvasContainer.style.backgroundImage = `url(${defaultBg})`;

// 2. 로컬 서버 연결 (WebSocket)
const WS_URL = 'ws://127.0.0.1:58293/client-ws';
let socket;

function connectWS() {
    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
        statusIndicator.innerText = '서버 연결 상태: O';
        statusIndicator.style.color = '#00ff00';
        console.log('Connected to server:', WS_URL);
        
        // 초기화 메시지 (선택 사항)
        // socket.send(JSON.stringify({ type: "fetch-configs" }));
    };

    socket.onclose = () => {
        statusIndicator.innerText = '서버 연결 상태: X';
        statusIndicator.style.color = '#ff4d4d';
        console.log('Disconnected from server. Retrying in 3s...');
        setTimeout(connectWS, 3000);
    };

    socket.onerror = (err) => {
        console.error('WebSocket Error:', err);
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received message:', data);

        // AI 응답 텍스트 처리 (서버에서 'text' 필드로 온다고 가정)
        if (data.text) {
            appendMessage('ai', data.text);
        }
    };
}

connectWS();

// 메시지 추가 함수
function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    msgDiv.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
    msgDiv.innerText = text;
    chatMessages.appendChild(msgDiv);
    
    // 자동 스크롤
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 메시지 전송 함수
function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    if (socket && socket.readyState === WebSocket.OPEN) {
        // 서버가 기대하는 형식에 맞춰 메시지 전송
        socket.send(JSON.stringify({
            type: "text-input",
            text: text
        }));
        
        appendMessage('user', text);
        chatInput.value = '';
    } else {
        alert('서버와 연결되어 있지 않습니다.');
    }
}

// 이벤트 리스너
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// 3. PixiJS 애플리케이션 생성
const app = new PIXI.Application({
    view: canvas,
    autoStart: true,
    backgroundAlpha: 0,
    resizeTo: window,
});

// 4. Live2D 모델 로드 및 렌더링
async function initLive2D() {
    const modelUrl = './live2d-models/shizuku/runtime/shizuku.model3.json';
    
    try {
        console.log('Loading Live2D model from:', modelUrl);
        const model = await PIXI.live2d.Live2DModel.from(modelUrl);
        
        app.stage.addChild(model);

        function resizeModel() {
            model.anchor.set(0.5, 0.5);
            model.x = window.innerWidth / 2;
            model.y = window.innerHeight / 2;

            const scale = (window.innerHeight / model.height) * 0.8;
            model.scale.set(scale);
        }

        resizeModel();
        window.addEventListener('resize', resizeModel);

        console.log('Model loaded successfully!');

    } catch (error) {
        const errorMsg = `모델 로드 실패! 
파일 경로: ${modelUrl}
에러 내용: ${error.message}`;
        console.error(errorMsg);
        errorLog.innerText = errorMsg;
    }
}

window.onload = () => {
    if (typeof PIXI === 'undefined') {
        errorLog.innerText = 'PixiJS 라이브러리를 불러오지 못했습니다.';
        return;
    }
    initLive2D();
};
