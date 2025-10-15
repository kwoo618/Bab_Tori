import React, { useEffect, useState } from 'react';
import axios from 'axios'; // 방금 설치한 axios를 불러옵니다.
import './App.css';

function App() {
  // 서버에서 받은 메시지를 저장할 state
  const [message, setMessage] = useState("서버에 연결 중입니다...");

  // 컴포넌트가 처음 렌더링될 때 한 번만 실행됩니다.
  useEffect(() => {
    // 백엔드 서버의 기본 주소로 GET 요청을 보냅니다.
    axios.get('http://127.0.0.1:8000/')
      .then(response => {
        // 성공하면 응답 데이터의 message를 상태에 저장합니다.
        setMessage(response.data.message);
      })
      .catch(error => {
        // 실패하면 에러 메시지를 콘솔에 출력하고 상태를 변경합니다.
        console.error("백엔드 연결 중 오류 발생:", error);
        setMessage("백엔드 서버 연결에 실패했습니다. 서버가 켜져 있는지 확인해주세요!");
      });
  }, []); // 빈 배열을 전달하여 최초 1회만 실행되도록 설정

  return (
    <div className="App">
      <header className="App-header">
        <h1>밥토리 프로젝트 🍚</h1>
        <p>
          {/* 서버로부터 받은 메시지가 여기에 표시됩니다. */}
          <b>서버 응답:</b> {message}
        </p>
      </header>
    </div>
  );
}

export default App;