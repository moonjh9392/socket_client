import styled from 'styled-components';
import { useRef, useState } from 'react';
import axios from 'axios';

const AppStyle = styled.div`
	padding: 100px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

//real
// const ws = new WebSocket(
// 	'ws://ec2-3-34-49-72.ap-northeast-2.compute.amazonaws.com:8080/ws/chat',
// );

//test-local
const ws = new WebSocket('ws://localhost:8001');

function App() {
	const [nickname, setNickname] = useState('');
	const [message, setMessage] = useState('');
	const [roomId, setRoomId] = useState('');

	const divRef = useRef();

	const createdRoom = async () => {
		console.log('방 생성');

		//real
		// const res = await axios.post('/chat?name=yujinroom');

		//test-local : json server
		// cd data
		// json-server --watch data.json --port 3001
		const res = await axios.get('http://localhost:3001/data');

		console.log('방 아이디', res.data.roomId);
		// {
		//   roomId: '',
		//   name: 'yujinroom',
		//   sessions: []
		// }

		setRoomId(res.data.roomId);
	};

	const enteredRoom = () => {
		console.log('방 접속');

		const data = {
			type: 'ENTER',
			roomId: roomId,
			sender: nickname,
			message: '',
		};

		console.log('접속 데이터', data);

		ws.send(JSON.stringify(data));
	};

	// 메세지 전송
	function sendMessage() {
		console.log('메세지 전송');

		const data = {
			type: 'TALK',
			roomId: 1,
			sender: nickname,
			message: message,
		};

		console.log('전송 데이터', data);

		ws.send(JSON.stringify(data));
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
			<button onClick={createdRoom}>방 생성</button>
			<button onClick={enteredRoom}>방 접속</button>
			<div>
				<input
					placeholder="닉네임"
					onChange={(e) => setNickname(e.target.value)}
				/>
				<input
					placeholder="메세지"
					onChange={(e) => setMessage(e.target.value)}
				/>
				<button onClick={sendMessage}>전송</button>
			</div>

			<div ref={divRef}></div>
		</AppStyle>
	);
}

export default App;
