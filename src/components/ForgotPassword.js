import React, { useState } from 'react';
import icon from './icon.png'; // 아이콘 import
import './ForgotPassword.css'; // 스타일 import

import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = ({ closeForgotPasswordModal}) => {
  // 상태 변수 설정
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); 
  const [error, setError] = useState('');

  // 폼 제출 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // 모든 필드를 채웠는지 확인
    if (!email) {
      alert('이메일 주소를 입력해주세요.');
      return;
    }

try {
      // 4. '비밀번호 재설정 이메일 보내기' 함수를 호출합니다.
      await sendPasswordResetEmail(auth, email);
      setMessage('비밀번호 재설정 이메일을 발송했습니다. 이메일함을 확인해주세요.');
    } catch (err) {
      console.error("비밀번호 재설정 오류:", err.code, err.message);
      if (err.code === 'auth/user-not-found') {
        setError('해당 이메일로 가입된 계정을 찾을 수 없습니다.');
      } else {
        setError('오류가 발생했습니다: ' + err.message);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>비밀번호 찾기</h2>
         <form onSubmit={handleSubmit}>
          <p>가입했던 이메일 주소를 입력하시면<br />비밀번호 재설정 링크를 보내드립니다.</p>
          {/* 5. 입력창도 '이메일' 하나만 필요합니다. */}
          <input
            type="email"
            placeholder="이메일"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="submit-button">
            재설정 이메일 받기
          </button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        
        <div className="x" onClick={closeForgotPasswordModal}>
          <img className="icon" alt="Icon" src={icon} />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
