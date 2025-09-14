// 1. 필요한 기능들을 Firebase SDK에서 가져오기
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 2. 내 Firebase 프로젝트의 설정 값 붙여넣기
// (Firebase 콘솔 > 프로젝트 설정 > 내 앱에서 복사)
const firebaseConfig = {
  apiKey: "AIzaSyA4D1Bm2WeAyQ9CY2g5c8xmHGdgtmK7BAU", // 본인 값으로 수정
  authDomain: "blink-count.firebaseapp.com", // 본인 값으로 수정
  projectId: "blink-count", // 본인 값으로 수정
  storageBucket: "blink-count.firebasestorage.app", // 본인 값으로 수정
  messagingSenderId: "167111056322", // 본인 값으로 수정
  appId: "1:167111056322:web:b19d351f32d8d086c8945b" // 본인 값으로 수정
};

// 3. Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// 4. 사용할 Firebase 서비스의 객체를 내보내기 (export)
export const db = getFirestore(app);
export const auth = getAuth(app);