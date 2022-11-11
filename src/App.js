import styled from 'styled-components';
import { useRef, useState } from 'react';
import YouTube from 'react-youtube';

const AppStyle = styled.div`
	padding: 100px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

//test-local
const ws = new WebSocket('ws://localhost:8001');

function App() {
	const [player, setPlayer] = useState();
	const [loop, setLoop] = useState(true);
	// 메세지 수신
	function receiveMessage(event) {
		if (!event.data.includes('새')) {
			const data = JSON.parse(event.data);
			setLoop(data.loop);
			player.seekTo(data.time, true);
			player.playVideo();
		}
	}

	ws.onmessage = receiveMessage;

	const opts = {
		height: '390',
		width: '640',
		playerVars: {
			// https://developers.google.com/youtube/player_parameters
			autoplay: 1,
		},
	};

	const onReady = (event) => {
		// access to player in all event handlers via event.target
		setPlayer(event.target);
		event.target.playVideo();
	};

	const onPlayerStateChange = (e) => {
		const data = { type: 'time', time: e.target.getCurrentTime(), loop: true };
		console.log(loop);
		if (loop) ws.send(JSON.stringify(data));
		console.log(loop);
		setLoop(true);
	};
	return (
		<AppStyle>
			<YouTube
				videoId="qEVUtrk8_B4"
				opts={opts}
				onReady={onReady}
				onStateChange={onPlayerStateChange}
			/>
		</AppStyle>
	);
}

export default App;
