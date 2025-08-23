import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useNavigate import 추가
import './Mypage.css';

export const Mypage = () => {
  const navigate = useNavigate(); // navigate 훅 사용
  const location = useLocation(); // location 훅 사용
  const userName = location.state ? location.state.name : 'Guest'; // 로그인 시 전달된 이름

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
            onClick={() => navigate('/start-learning')}
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
          <button className="logout" onClick={() => navigate('/')}>
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
};
export default Mypage;
