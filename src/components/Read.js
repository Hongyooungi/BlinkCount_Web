import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Read.css';



export const Read = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const videoUrl = location.state?.videoUrl;
  const videoTitle = location.state?.videoTitle || '영상 재생';

  useEffect(() => {
    if (!videoUrl) {
      console.warn("비디오 정보 없이 접근했습니다. 학습 기록 페이지로 돌아갑니다.");
      // 비디오 URL이 없으면 '학습 기록' 페이지로 돌려보냅니다.
      navigate('/save'); 
    }
  }, [videoUrl, navigate]);

  // videoUrl이 없는 경우, 리디렉션이 실행될 때까지 아무것도 렌더링하지 않습니다.
  if (!videoUrl) {
    return null; 
  }

  return (
    <div className="R-screen">
      <div className="R-div">
        <div className="frame">
          <div className="user-name">USER NAME</div>
        </div>

        <div className="video-player-wrapper">
          <video
            controls
            autoPlay  // 페이지에 들어오면 자동 재생
            width="100%"
            src={videoUrl} // 받은 URL을 여기에 연결!
            type="video/webm"
          >
            브라우저가 video 태그를 지원하지 않습니다.
          </video>
        </div>

        <div className="overlap">
          <div className="frame-2" />

          <div className="overlap-group-wrapper">
            <div className="overlap-group">
              <button
                className="text-wrapper-2"
                onClick={() => navigate('/save')}
              >
                목록으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="overlap-wrapper">
        <div className="overlap-group">
          <div className="text-wrapper-2">학습 리포트 생성</div>
        </div>
      </div>
    </div>
  );
};
export default Read;
