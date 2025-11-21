import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Save.css';
import axios from 'axios';

import { auth } from '../firebase'; // <-- firebase 설정 가져오기
import { onAuthStateChanged, signOut } from 'firebase/auth'; // <-- 필요한 함수들 가져오기

const API_URL = 'https://my-video-api-167111056322.asia-northeast3.run.app';


export const Save_report = ({user}) => {

  const navigate = useNavigate(); // navigate 훅 사용
  const [userName, setUserName] = useState('Guest');

  const [reports, setReports] = useState([]);
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

  const fetchReports = async () => {

      if (!user) {
        setLoading(false);
        return; // 사용자가 없으면 요청하지 않음
      }
      try {
        setLoading(true);
        const idToken = await user.getIdToken(); // 현재 사용자의 신분증(ID 토큰)
        
        // axios를 사용하여 백엔드에 GET 요청을 보냅니다. (신분증 첨부)
        const response = await axios.get(`${API_URL}/api/reports`, {
          headers: { 'Authorization': `Bearer ${idToken}` }
        });

        setReports(response.data); 
        setError(null);
      } catch (err) {
        console.error("리포트 목록 로딩 실패:", err);
        setError("리포트를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();

  }, [user, navigate]); // user가 바뀔 때마다 이 useEffect가 다시 실행됩니다


    const handleLogout = async () => {
        await signOut(auth);
        navigate('/'); // 로그아웃하면 홈으로 보냅니다. (App.js가 상태 변경을 감지합니다)
    };

     const handleThumbnailClick = (report) => {
    if (!report) return; // 데이터 없으면 무시

    if (!report.url) {
        alert("리포트 파일을 찾을 수 없습니다 (URL 없음).");
        return;
    }
    
    navigate('/Report_a', { 
      state: { 
        pdfUrl: report.url,                 
        reportTitle: report.videoFileName || "분석 리포트", 
        gcsFileName: report.reportFileName, 
        createdAt: report.createdAt ? new Date(report.createdAt._seconds * 1000).toLocaleString() : null 
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

  const PdfIcon = () => (
    <div style={{
        width: '100%', 
        height: '70%', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px 10px 0 0',
        paddingTop: '10px'
    }}>
        {/* PDF 모양 아이콘 SVG */}
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#ff4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <span style={{marginTop: '8px', fontSize: '12px', color: '#ff4444', fontWeight: 'bold'}}>PDF REPORT</span>
    </div>
  );

  const formatDate = (timestamp) => {
      if (!timestamp) return '';
      return new Date(timestamp._seconds * 1000).toLocaleDateString();
  };

  return (
    <div className="S-screen">
      <div className="S-div">
        <div className="frame">
          <div className="text-wrapper">학습 리포트</div>

          {/* 로딩/에러 메시지 */}
          {loading && <div className="status-message" style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)'}}>로딩 중...</div>}
          {error && <div className="status-message error" style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', color:'red'}}>{error}</div>}
          {!loading && !error && reports.length === 0 && <div className="status-message" style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)'}}>저장된 리포트가 없습니다.</div>}

          {/* 1번 버튼 */}
          <button className="rectangle" onClick={() => handleThumbnailClick(reports[0])}>
            {reports[0] ? (
              <>
                <PdfIcon />
                <div className="video-thumbnail-title">
                    <div style={{fontWeight:'bold'}}>{reports[0].videoFileName || "Report"}</div>
                    <span style={{fontSize:'11px', color:'#888'}}>{formatDate(reports[0].createdAt)}</span>
                </div>
              </>
            ) : <div style={{width:'100%', height:'100%', backgroundColor:'#eee', borderRadius:'15px', opacity: 0.3}}></div>}
          </button>

          {/* 2번 버튼 */}
          <button className="rectangle-2" onClick={() => handleThumbnailClick(reports[1])}>
            {reports[1] ? (
              <>
                <PdfIcon />
                <div className="video-thumbnail-title">
                    <div style={{fontWeight:'bold'}}>{reports[1].videoFileName || "Report"}</div>
                    <span style={{fontSize:'11px', color:'#888'}}>{formatDate(reports[1].createdAt)}</span>
                </div>
              </>
            ) : <div style={{width:'100%', height:'100%', backgroundColor:'#eee', borderRadius:'15px', opacity: 0.3}}></div>}
          </button>

          {/* 3번 버튼 */}
          <button className="rectangle-3" onClick={() => handleThumbnailClick(reports[2])}>
            {reports[2] ? (
              <>
                <PdfIcon />
                <div className="video-thumbnail-title">
                    <div style={{fontWeight:'bold'}}>{reports[2].videoFileName || "Report"}</div>
                    <span style={{fontSize:'11px', color:'#888'}}>{formatDate(reports[2].createdAt)}</span>
                </div>
              </>
            ) : <div style={{width:'100%', height:'100%', backgroundColor:'#eee', borderRadius:'15px', opacity: 0.3}}></div>}
          </button>

          {/* 4번 버튼 */}
          <button className="rectangle-4" onClick={() => handleThumbnailClick(reports[3])}>
            {reports[3] ? (
              <>
                <PdfIcon />
                <div className="video-thumbnail-title">
                    <div style={{fontWeight:'bold'}}>{reports[3].videoFileName || "Report"}</div>
                    <span style={{fontSize:'11px', color:'#888'}}>{formatDate(reports[3].createdAt)}</span>
                </div>
              </>
            ) : <div style={{width:'100%', height:'100%', backgroundColor:'#eee', borderRadius:'15px', opacity: 0.3}}></div>}
          </button>

          {/* 5번 버튼 */}
          <button className="rectangle-5" onClick={() => handleThumbnailClick(reports[4])}>
            {reports[4] ? (
              <>
                <PdfIcon />
                <div className="video-thumbnail-title">
                    <div style={{fontWeight:'bold'}}>{reports[4].videoFileName || "Report"}</div>
                    <span style={{fontSize:'11px', color:'#888'}}>{formatDate(reports[4].createdAt)}</span>
                </div>
              </>
            ) : <div style={{width:'100%', height:'100%', backgroundColor:'#eee', borderRadius:'15px', opacity: 0.3}}></div>}
          </button>

          {/* 6번 버튼 */}
          <button className="rectangle-6" onClick={() => handleThumbnailClick(reports[5])}>
            {reports[5] ? (
              <>
                <PdfIcon />
                <div className="video-thumbnail-title">
                    <div style={{fontWeight:'bold'}}>{reports[5].videoFileName || "Report"}</div>
                    <span style={{fontSize:'11px', color:'#888'}}>{formatDate(reports[5].createdAt)}</span>
                </div>
              </>
            ) : <div style={{width:'100%', height:'100%', backgroundColor:'#eee', borderRadius:'15px', opacity: 0.3}}></div>}
          </button>

          {/* 7번 버튼 */}
          <button className="rectangle-7" onClick={() => handleThumbnailClick(reports[6])}>
            {reports[6] ? (
              <>
                <PdfIcon />
                <div className="video-thumbnail-title">
                    <div style={{fontWeight:'bold'}}>{reports[6].videoFileName || "Report"}</div>
                    <span style={{fontSize:'11px', color:'#888'}}>{formatDate(reports[6].createdAt)}</span>
                </div>
              </>
            ) : <div style={{width:'100%', height:'100%', backgroundColor:'#eee', borderRadius:'15px', opacity: 0.3}}></div>}
          </button>

          {/* 8번 버튼 */}
          <button className="rectangle-8" onClick={() => handleThumbnailClick(reports[7])}>
            {reports[7] ? (
              <>
                <PdfIcon />
                <div className="video-thumbnail-title">
                    <div style={{fontWeight:'bold'}}>{reports[7].videoFileName || "Report"}</div>
                    <span style={{fontSize:'11px', color:'#888'}}>{formatDate(reports[7].createdAt)}</span>
                </div>
              </>
            ) : <div style={{width:'100%', height:'100%', backgroundColor:'#eee', borderRadius:'15px', opacity: 0.3}}></div>}
          </button>

          {/* 9번 버튼 */}
          <button className="rectangle-9" onClick={() => handleThumbnailClick(reports[8])}>
            {reports[8] ? (
              <>
                <PdfIcon />
                <div className="video-thumbnail-title">
                    <div style={{fontWeight:'bold'}}>{reports[8].videoFileName || "Report"}</div>
                    <span style={{fontSize:'11px', color:'#888'}}>{formatDate(reports[8].createdAt)}</span>
                </div>
              </>
            ) : <div style={{width:'100%', height:'100%', backgroundColor:'#eee', borderRadius:'15px', opacity: 0.3}}></div>}
          </button>

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
          <button className="text-wrapper-3" onClick={() => navigate('/save')}>
            학습 기록
          </button>
        </div>

        <div className="frame-8">
          <button className="text-wrapper-3" onClick={() => navigate('/save_report')}>학습 리포트</button>
        </div>

        <div className="frame-9">
          <button className="text-wrapper-3" onClick={() => navigate('/trash')}>
            휴지통
          </button>
        </div>

        <div className="user-name-wrapper">
          <div className="user-name">{userName}</div>
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
export default Save_report;
