import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate import 추가
import './Mypage.css';

import { auth } from '../firebase'; // <-- firebase 설정 가져오기
import { onAuthStateChanged, signOut } from 'firebase/auth'; // <-- 필요한 함수들 가져오기

import axios from 'axios';

const API_URL = 'https://my-video-api-167111056322.asia-northeast3.run.app';

export const Mypage = ({ user }) => { 
  const navigate = useNavigate(); // navigate 훅 사용
  const [userName, setUserName] = useState('Guest');

  //컴포넌트가 로드될 때 로그인 상태를 감지 -->
  useEffect(() => {
    if (user) {
      setUserName(user.displayName || user.email);
    } else {
      // user가 없으면(로그아웃되면) Mypage에 있을 이유가 없으므로 로그인 페이지로 보냅니다.
      setUserName('Guest');
      navigate('/login');
    }
  }, [user, navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/'); // 로그아웃하면 홈으로 보냅니다. (App.js가 상태 변경을 감지합니다)
    };

  const handleStartLearningOnDesktop = async () => {
    try {
      // 현재 로그인된 사용자가 있는지 다시 한번 확인합니다.
      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        navigate('/login');
        return;
      }
      const idToken = await currentUser.getIdToken();

      // 1. 보안실(백엔드)에 연락하여 일회용 암호(토큰)를 요청합니다.
      console.log("백엔드에 일회용 토큰을 요청합니다...");
      const response = await axios.post(
        `${API_URL}/api/generate-desktop-token`, 
        {}, // body는 비워둡니다.
        { headers: { 'Authorization': `Bearer ${idToken}` } }
      );
      const { token } = response.data;
      console.log("일회용 토큰을 성공적으로 받았습니다:", token);

      // 2. 받은 암호로 특별 초대장(커스텀 프로토콜 링크)을 만듭니다.
      const magicLink = `zoner-app://login?token=${token}`;
      
      // 3. 브라우저에게 이 초대장을 열라고 지시합니다. (OS가 Electron 앱을 실행시킬 겁니다)
      console.log("Electron 앱을 실행합니다:", magicLink);
      window.location.href = magicLink;

    } catch (error) {
      console.error("데스크톱 앱 실행 실패:", error);
      alert("앱을 실행하는 데 실패했습니다. PC에 Zoner 앱이 설치되어 있는지 확인해주세요.");
    }
  };

  return (
    <div className="M-screen">
      <div className="M-div">
        <div className="frame">
          <div className="user-name">{userName}</div> {/* 전달받은 이름 출력 */}
        </div>

        <div className="overlap">
          <div className="frame-2">
            <p className="element">
              <span className="text-wrapper">
                최근
                기록&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>

              <span className="span">최근 학습 녹화 기록 열람 가능(3개)</span>
            </p>

            <div className="rectangle" />

            <div className="rectangle-2" />

            <div className="rectangle-3" />
          </div>

          <div className="frame-3">
            <p className="p">
              <span className="text-wrapper">
                최근
                리포트&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>

              <span className="span">최근 학습 리포트 열람 가능(3개)</span>
            </p>

            <div className="rectangle-4" />

            <div className="rectangle-5" />

            <div className="rectangle-6" />
          </div>

          <div className="frame-4">
            <p className="zoner">
              <span className="text-wrapper">
                추천
                서비스&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>

              <span className="span">Zoner의 다른 서비스도 확인해보세요.</span>
            </p>

            <div className="overlap-group-wrapper">
              <div className="overlap-group">
                <div className="text-wrapper-2">요금제 업그레이드</div>
              </div>
            </div>

            <div className="overlap-wrapper">
              <div className="overlap-group">
                <div className="text-wrapper-2">개인 설정</div>
              </div>
            </div>

            <div className="div-wrapper">
              <div className="overlap-group">
                <div className="text-wrapper-2">프로모션</div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-ome-wrapper">
          <button className="text-wrapper-3" onClick={() => navigate('/')}>
            HOME
          </button>
        </div>

        <div className="frame-5">
          <button
            className="text-wrapper-3"
            onClick={() => navigate('/ai-chat')}
          >
            AI 채팅
          </button>
        </div>

        <div className="frame-6">
          <button
            className="text-wrapper-3"
            onClick={handleStartLearningOnDesktop}
          >
            학습 시작
          </button>
        </div>

        <div className="frame-7">
          <button className="text-wrapper-3" onClick={() => navigate('/save')}>
            학습 기록
          </button>
        </div>

        <div className="frame-8">
          <button
            className="text-wrapper-3"
            onClick={() => navigate('/save_report')}
          >
            학습 리포트
          </button>
        </div>

        <div className="frame-9">
          <button className="text-wrapper-3" onClick={() => navigate('/trash')}>
            휴지통
          </button>
        </div>

        <div className="logout-wrapper">
          <button className="logout"  onClick={handleLogout}>
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
};
export default Mypage;
