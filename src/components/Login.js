import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import SignUp from './SignUp'; // SignUp 모달 컴포넌트 import
import ForgotPassword from './ForgotPassword';


import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

export const Login = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false); // 회원가입 모달 상태

  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [userData, setUserData] = useState({ id: '', password: '', name: '' });

  const handleLogin = async () => {
    try {
      // Firebase Auth에 (id, pw)를 보내 로그인 시도
      const userCredential = await signInWithEmailAndPassword(auth, id, pw);
      const user = userCredential.user;

      // 로그인 성공! (Mypage로 이동하며 '이름' 전달)
      // (이름은 Auth 객체에 저장된 displayName을 사용)
      navigate('/mypage', { state: { name: user.displayName } });

    } catch (error) {
      // 로그인 실패
      console.error("로그인 오류:", error.code);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        alert('아이디 또는 비밀번호가 틀렸습니다.');
      } else {
        alert('로그인 중 오류가 발생했습니다: ' + error.message);
      }
    }
  };

  const openSignUpModal = () => {
    setIsSignUpModalOpen(true); // 모달 열기
  };

  const closeSignUpModal = () => {
    setIsSignUpModalOpen(false); // 모달 닫기
  };

  const openForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(true);
  };
  const closeForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(false);
  };

  return (
    <div className="L-screen">
      <div className="L-div">
        <div className="text-wrapper">ZONER</div>

        <div className="text-wrapper-2">로그인</div>

        <input
          className="rectangle"
          type="email"
          placeholder="이메일"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <input
          className="rectangle-2"
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />

        <div className="frame" onClick={handleLogin}>
          <div className="text-wrapper-3">로그인하기</div>
        </div>

        <div className="ZONER-wrapper">
          <button className="ZONER" onClick={() => navigate('/')}>
            Zoner
          </button>
        </div>

        <div className="USER-GUIDE-wrapper">
          <button className="text-wrapper-U" onClick={() => navigate('/guide')}>
            User Guide
          </button>
        </div>

        <div className="PRICING-wrapper">
          <button className="text-wrapper-U">Pricing</button>
        </div>

        <div className="FAQ-wrapper">
          <button className="text-wrapper-U" onClick={() => navigate('/faq')}>
            Faq
          </button>
        </div>

        <p className="p">
          <span className="span">
            계정이 없으신가요?
            <br />
          </span>
          <button className="text-wrapper-5" onClick={openSignUpModal}>
            회원가입하기
          </button>
          <br></br>
          <span 
            className="password-reset-link" // (CSS에서 cursor: pointer 등을 적용해 링크처럼 보이게)
            onClick={openForgotPasswordModal}     // 3. 이 함수를 연결합니다.
          >
            비밀번호를 잊으셨나요?
          </span>
        </p>
      </div>

      {/* 회원가입 모달 */}
      {isSignUpModalOpen && (
        <SignUp closeSignUpModal={closeSignUpModal} setUserData={setUserData} />
      )}

      {isForgotPasswordModalOpen && (
        <ForgotPassword closeForgotPasswordModal={closeForgotPasswordModal} />
      )}
    </div>
  );
};

export default Login;
