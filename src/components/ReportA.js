import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ReportA.css';

export const ReportA = () => {
  const navigate = useNavigate();

  return (
    <div className="R-screen">
      <div className="R-div">
        <div className="frame">
          <div className="user-name">USER NAME</div>
        </div>

        <div className="div-wrapper">
          <div className="text-wrapper">학습리포트</div>
        </div>

        <div className="overlap">
          <div className="frame-2" />

          <div className="overlap-group-wrapper">
            <div className="overlap-group">
              <button
                className="text-wrapper-2"
                onClick={() => navigate('/save_report')}
              >
                종료하기
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="overlap-wrapper">
        <div className="overlap-group">
          <div className="text-wrapper-2">학습 리포트 다운받기</div>
        </div>
      </div>
    </div>
  );
};
export default ReportA;
