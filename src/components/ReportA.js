import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ReportA.css';

export const ReportA = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { pdfUrl, reportTitle, createdAt } = location.state || {};

  const handleDownloadClick = () => {
    if (!pdfUrl) {
      alert("다운로드할 리포트 URL이 없습니다.");
      return;
    }
    window.open(pdfUrl, '_blank');
  };

const viewerUrl = `${pdfUrl}#toolbar=0&view=FitH`;

  return (
    <div className="R-screen">
      <div className="R-div">
        <div className="frame">
          <div className="user-name">USER NAME</div>
        </div>

        <div className="div-wrapper">
            <iframe 
            src={viewerUrl} 
            title={reportTitle}
            className="pdf-iframe"
            type="application/pdf"
          /></div>

        <div className="overlap">
          <div className="frame-2" />

          <div className="overlap-group-wrapper">
            <div className="overlap-group">
              <button
                className="text-wrapper-2"
                onClick={() => navigate('/save_report')}
              >
                목록으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="overlap-wrapper">
        <div className="overlap-group" onClick={handleDownloadClick}>
          <div className="text-wrapper-2">학습 리포트 다운받기</div>
        </div>
      </div>
    </div>
  );
};
export default ReportA;
