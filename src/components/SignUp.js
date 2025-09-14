import React, { useState } from 'react';
import icon from './icon.png'; // 아이콘 import
import './SignUp.css'; // 스타일 import

import { auth, db } from '../firebase'; // 이전에 만든 firebase.js 파일
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const SignUp = ({ closeSignUpModal, setUserData }) => {
  // 상태 변수 설정
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 폼 제출 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 동작(페이지 새로고침)을 막기

    // 모든 필드를 채웠는지 확인
    if (!name || !email || !password || !confirmPassword) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // 비밀번호와 비밀번호 확인이 일치하는지 확인
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 1. Firebase Authentication: 계정 생성 (이메일, 비밀번호)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Auth 프로필에 이름 업데이트
      await updateProfile(user, {
        displayName: name
      });

      // 3. Firestore 'users' 컬렉션에 프로필 정보 저장 (UID를 문서 ID로 사용)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: new Date()
      });

    // 회원가입 완료 후 알림 및 로그인 페이지로 이동
    alert('회원가입이 완료되었습니다. 다시 로그인해주세요.');

    // 로그인 페이지로 돌아가기 전에 setUserData로 아이디와 비밀번호 설정
    setUserData({
      id: email, // 아이디로 이메일 사용
      password: password, // 비밀번호 설정
      name: name, // 이름도 전달
    });

    closeSignUpModal(); // 모달 닫기
    
    } catch (error) {
      // 5. Firebase 오류 처리
      console.error("회원가입 오류:", error.code, error.message);
      if (error.code === 'auth/email-already-in-use') {
        alert('이미 사용 중인 이메일입니다.');
      } else if (error.code === 'auth/weak-password') {
        alert('비밀번호는 6자리 이상이어야 합니다.');
      } else {
        alert('회원가입 중 오류가 발생했습니다: ' + error.message);
      }
    }

  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="이름"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="이메일"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6} //firebase 최소 길이 조건
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            className="input-field"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={6}
          />
          <button type="submit" className="submit-button">
            회원가입
          </button>
        </form>
        <p>
          이미 계정이 있으신가요?{' '}
          <span className="text-wrapper-7" onClick={closeSignUpModal}>
            로그인
          </span>
        </p>
        <div className="x" onClick={closeSignUpModal}>
          <img className="icon" alt="Icon" src={icon} />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
