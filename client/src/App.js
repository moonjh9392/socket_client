import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';
import { useRef, useState } from 'react';

const AppStyle = styled.div`
  padding: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ws = new WebSocket('ws://localhost:8001');
function App() {
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const divRef = useRef();
  // 메세지 전송
  function sendMessage() {
    const fullMessage = `${nickname}: ${message}`;

    ws.send(fullMessage);
  }

  // 메세지 수신
  function receiveMessage(event) {
    const chat = document.createElement('div');
    const message = document.createTextNode(event.data);
    chat.appendChild(message);
    divRef.current.appendChild(chat);
  }
  ws.onmessage = receiveMessage;

  return (
    <AppStyle>
      <h1>Hudi Chat</h1>
      <div>
        <input placeholder="닉네임" onChange={(e) => setNickname(e.target.value)} />
        <input placeholder="메세지" onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>전송</button>
      </div>

      <div ref={divRef}></div>
    </AppStyle>
  );
}

export default App;
