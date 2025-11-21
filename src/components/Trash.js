import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Trash.css';
import axios from 'axios';

import { auth } from '../firebase'; // <-- firebase 설정 가져오기
import { onAuthStateChanged, signOut } from 'firebase/auth'; // <-- 필요한 함수들 가져오기

const API_URL = 'https://my-video-api-167111056322.asia-northeast3.run.app';

export const Trash = ({user}) => {

  const navigate = useNavigate(); // navigate 훅 사용
  const [userName, setUserName] = useState('Guest');

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 동영상 목록, 로딩, 에러 상태를 관리합니다

  useEffect(() => {
    if (user) {
      setUserName(user.displayName || user.email);
    } else {
      // user가 없으면(로그아웃되면) Mypage에 있을 이유가 없으므로 로그인 페이지로 보냅니다.
      setUserName('Guest');
      navigate('/login');
    }

  const fetchVideos = async () => {
      if (!user) {
        setLoading(false);
        return; // 사용자가 없으면 요청하지 않음
      }
      try {
        setLoading(true);
        const idToken = await user.getIdToken(); // 현재 사용자의 신분증(ID 토큰)
        
        // axios를 사용하여 백엔드에 GET 요청을 보냅니다. (신분증 첨부)
        const response = await axios.get(`${API_URL}/api/trash`, {
          headers: { 'Authorization': `Bearer ${idToken}` }
        });

        setVideos(response.data); // 서버로부터 받은 동영상 목록을 state에 저장
        setError(null);
      } catch (err) {
        console.error("동영상 목록 로딩 실패:", err);
        setError("학습 기록을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos(); // 함수 실행

  }, [user, navigate]); // user가 바뀔 때마다 이 useEffect가 다시 실행됩니다

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/'); // 로그아웃하면 홈으로 보냅니다. (App.js가 상태 변경을 감지합니다)
    };

    const handleThumbnailClick = (video) => {
    if (!video) return; // 비디오 데이터가 없으면 아무것도 안 함
    navigate('/read', { 
      state: { 
        videoUrl: video.url,
        videoTitle: video.title,
        gcsFileName: video.filename
      } 
    });
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
    <div className="S-screen">
      <div className="S-div">
        <div className="frame">
          <div className="text-wrapper">학습 기록</div>

          <button className="rectangle" onClick={() => handleThumbnailClick(videos[0])}>
            {videos[0] && ( // videos 배열의 첫 번째 데이터가 존재하면 썸네일을 보여줍니다.
              <>
                <video preload="metadata" muted>
                  <source src={videos[0].url + '#t=0.5'} type="video/webm" />
                </video>
                <div className="video-thumbnail-title">{videos[0].title}</div>
              </>
            )}
          </button>

          <button className="rectangle-2" onClick={() => handleThumbnailClick(videos[1])}>
            {videos[1] && (
              <>
                <video preload="metadata" muted>
                  <source src={videos[1].url + '#t=0.5'} type="video/webm" />
                </video>
                <div className="video-thumbnail-title">{videos[1].title}</div>
              </>
            )}
          </button>

          <button className="rectangle-3" onClick={() => handleThumbnailClick(videos[2])}>
            {videos[2] && (
              <>
                <video preload="metadata" muted>
                  <source src={videos[2].url + '#t=0.5'} type="video/webm" />
                </video>
                <div className="video-thumbnail-title">{videos[2].title}</div>
              </>
            )}
          </button>

          <button className="rectangle-4" onClick={() => handleThumbnailClick(videos[3])}>
            {videos[3] && (
              <>
                <video preload="metadata" muted>
                  <source src={videos[3].url + '#t=0.5'} type="video/webm" />
                </video>
                <div className="video-thumbnail-title">{videos[3].title}</div>
              </>
            )}
          </button>

          <button className="rectangle-5" onClick={() => handleThumbnailClick(videos[4])}>
            {videos[4] && (
              <>
                <video preload="metadata" muted>
                  <source src={videos[4].url + '#t=0.5'} type="video/webm" />
                </video>
                <div className="video-thumbnail-title">{videos[4].title}</div>
              </>
            )}
          </button>

          <button className="rectangle-6" onClick={() => handleThumbnailClick(videos[5])}>
            {videos[5] && (
              <>
                <video preload="metadata" muted>
                  <source src={videos[5].url + '#t=0.5'} type="video/webm" />
                </video>
                <div className="video-thumbnail-title">{videos[5].title}</div>
              </>
            )}
          </button>

          <button className="rectangle-7" onClick={() => handleThumbnailClick(videos[6])}>
            {videos[6] && (
              <>
                <video preload="metadata" muted>
                  <source src={videos[6].url + '#t=0.5'} type="video/webm" />
                </video>
                <div className="video-thumbnail-title">{videos[6].title}</div>
              </>
            )}
          </button>

          <button className="rectangle-8" onClick={() => handleThumbnailClick(videos[7])}>
            {videos[7] && (
              <>
                <video preload="metadata" muted>
                  <source src={videos[7].url + '#t=0.5'} type="video/webm" />
                </video>
                <div className="video-thumbnail-title">{videos[7].title}</div>
              </>
            )}
          </button>

          <button className="rectangle-9" onClick={() => handleThumbnailClick(videos[8])}>
            {videos[8] && (
              <>
                <video preload="metadata" muted>
                  <source src={videos[8].url + '#t=0.5'} type="video/webm" />
                </video>
                <div className="video-thumbnail-title">{videos[8].title}</div>
              </>
            )}
          </button>

          {loading && <div className="status-message">로딩 중...</div>}
          {error && <div className="status-message error">{error}</div>}

        </div>


        <div className="h-ome-wrapper">
          <button
            className="text-wrapper-3"
            onClick={() => navigate('/mypage')}
          >
            HOME
          </button>
        </div>

        <div className="frame-5">
          <button className="text-wrapper-3">AI 채팅</button>
        </div>

        <div className="frame-6">
          <button className="text-wrapper-3" onClick={handleStartLearningOnDesktop}>학습 시작</button>
        </div>

        <div className="frame-7">
          <button className="text-wrapper-3" onClick={() => navigate('/save')}>학습 기록</button>
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

        <div className="user-name-wrapper">
          <div className="user-name">{userName}</div> {/* 전달받은 이름 출력 */}
        </div>

        <div className="logout-wrapper">
          <div className="logout" onClick={handleLogout}>
            LOGOUT
          </div>
        </div>
      </div>
    </div>
  );
};
export default Trash;
