// src/App.js

/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import UserGuide from './components/UserGuide';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Login from './components/Login';
import Mypage from './components/Mypage';
import Save from './components/Save';
import Read from './components/Read';
import Report_a from './components/ReportA';
import Save_report from './components/SaveReport';
import Trash from './components/Trash';
import Trashread from './components/Trashread';
import SignUp from './components/SignUp';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
/* eslint-enable react/jsx-pascal-case */

function App() {

  // <-- 1. 현재 로그인한 사용자 정보를 담을 state 생성 -->
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // <-- 2. 앱이 처음 실행될 때 딱 한 번, 로그인 상태를 감지하는 리스너 실행 -->
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // 사용자가 있으면 user 객체, 없으면 null이 저장됨
      setLoading(false); // 로딩 완료
    });

    // 클린업: 컴포넌트가 사라질 때 리스너 제거
    return () => unsubscribe();
  }, []); // 빈 배열: 마운트 시 딱 한 번만 실행

  // 로딩 중일 때는 아무것도 표시하지 않음 (깜빡임 방지)
  if (loading) {
    return <div>Loading...</div>; // (나중에 예쁜 로딩 스피너로 대체 가능)
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={currentUser} />} />
        <Route path="/guide" element={<UserGuide />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<Mypage user={currentUser} />} />
        <Route path="/save" element={<Save user={currentUser} />} />
        <Route path="/read" element={<Read user={currentUser}/>} />
        <Route path="/report_a" element={<Report_a user={currentUser} />} />
        <Route path="/save_report" element={<Save_report user={currentUser} />} />
        <Route path="/trash" element={<Trash user={currentUser} />} />
        <Route path="/trashread" element={<Trashread user={currentUser} />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
