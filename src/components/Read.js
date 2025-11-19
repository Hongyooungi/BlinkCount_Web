import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// './Read.css' 파일이 동일한 폴더에 있다고 가정합니다.
import './Read.css'; 

// 1. '카운터' 서비스 주소
const API_SERVICE_URL = "https://drowsiness-api-service-167111056322.asia-northeast3.run.app";
// 2. GCS 버킷 이름
const BUCKET_NAME = "blinkcount_video";
// 3. 상태 확인 주기 (5초)
const POLL_INTERVAL_MS = 5000;

export const Read = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const videoUrl = location.state?.videoUrl;
  const gcsFileName = location.state?.gcsFileName;
  // GCS 파일 이름으로 사용될 videoTitle을 location state에서 가져옵니다.
  const videoTitle = location.state?.videoTitle || '영상 재생'; 

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // videoTitle (파일 이름)도 필수 값으로 확인합니다.
    if (!videoUrl || !videoTitle || videoTitle === '영상 재생') {
      console.warn("비디오 URL 또는 비디오 제목(파일 이름) 정보 없이 접근했습니다. 학습 기록 페이지로 돌아갑니다.");
      navigate('/save'); 
    }
  }, [videoUrl, videoTitle, gcsFileName ,navigate]);

  /**
   * 서버에 리포트 생성이 완료되었는지 5초마다 확인(폴링)합니다.
   * 성공, 실패, 보류 상태를 모두 처리합니다.
   */
  const pollForReport = async (reportFileToCheck) => {
    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        try {
          // /check-status API 호출 (GET 요청)
          const response = await fetch(
            `${API_SERVICE_URL}/check-status?bucket=${BUCKET_NAME}&report_file=${reportFileToCheck}`
          );
          
          if (!response.ok) {
            console.warn("폴링 중 서버 응답 오류, 5초 후 재시도...");
            return; // 5초 후 다시 시도
          }

          const data = await response.json();

          if (data.status === 'complete') {
            // --- 1. 분석 완료! ---
            clearInterval(intervalId); // 반복 종료
            resolve(data); // data 객체 전체 (pdf_download_url 포함)를 반환

          } else if (data.status === 'failed') {
            // --- 2. 분석 실패! ---
            clearInterval(intervalId); // 반복 종료
            reject(new Error(data.message || '서버에서 분석 작업이 실패했습니다.')); 
          
          } else if (data.status === 'pending') {
            // --- 3. 분석 중 ---
            console.log("분석 중... 5초 후 다시 확인합니다.");
            // (아무것도 하지 않고 5초 후 다시 시도)

          } else {
            // --- 4. 알 수 없는 상태 ---
            clearInterval(intervalId);
            reject(new Error(data.message || '알 수 없는 분석 상태'));
          }
        } catch (err) {
          // 네트워크 오류 (예: 인터넷 끊김)
          console.warn("폴링 중 네트워크 오류:", err);
          // (5초 후 다시 시도)
        }
      }, POLL_INTERVAL_MS);
    });
  };

  /**
   * '학습 리포트 생성' 버튼 클릭 시 실행되는 메인 함수
   */
  const handleAnalysisClick = async () => {
    // videoTitle이 GCS 파일 이름(예: '12345.webm')이어야 함
    if (!videoTitle || videoTitle === '영상 재생') {
      console.error("분석할 파일 이름(videoTitle)이 없습니다.");
      alert("오류: 분석할 영상 파일 정보가 없습니다.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. '카운터'의 /start-analysis API 호출 (POST 요청)
      const startResponse = await fetch(`${API_SERVICE_URL}/start-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bucket: BUCKET_NAME,
          file: gcsFileName, // videoTitle을 파일 이름으로 사용
        }),
      });

      // 202 (Accepted)가 아니면 시작 실패
      if (startResponse.status !== 202) {
        const errData = await startResponse.json();
        throw new Error(errData.error || '분석 시작에 실패했습니다.');
      }

      const startData = await startResponse.json();
      
      // 2. 폴링(Polling) 시작
      console.log(`분석 시작됨. 리포트 파일 확인 중: ${startData.report_file_to_check}`);
      
      // data 객체 전체(report 및 pdf_download_url 포함)를 받음
      const responseData = await pollForReport(startData.report_file_to_check);

      // 3. 최종 결과 (콘솔에만 기록)
      console.log("최종 리포트 (JSON):", responseData.report);
      console.log("PDF 다운로드 링크:", responseData.pdf_download_url);

      // 4. 성공 알림 표시
      alert('리포트 생성이 완료되었습니다!');

      // 5. PDF 다운로드 링크가 있다면 새 탭에서 열기
      if (responseData.pdf_download_url) {
        window.open(responseData.pdf_download_url, '_blank');
      }

    } catch (err) {
      // 실패 시 콘솔 에러 및 알림 표시
      console.error("리포트 생성 실패:", err.message);
      alert('리포트 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // videoUrl이 없는 경우 (상단 useEffect에서 처리하지만 방어 코드)
  if (!videoUrl) {
    return null; 
  }

  // --- JSX 렌더링 ---
  return (
    <div className="R-screen">
      <div className="R-div">
        <div className="frame">
          <div className="user-name">USER NAME</div>
        </div>

        <div className="video-player-wrapper">
          <video
            controls
            autoPlay 
            width="100%"
            src={videoUrl}
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
        <button
          className="overlap-group"
          onClick={handleAnalysisClick}
          disabled={isLoading}
        >
          <div className="text-wrapper-2">{isLoading ? '리포트 생성 중...' : '학습 리포트 생성'}</div>
        </button>
      </div>
      
    </div>
  );
};

export default Read;