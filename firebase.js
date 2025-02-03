// Firebase SDK 불러오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyB5eg_cGwUxD_h_RCXQ3SMtiPiJcJqEc6Q",
    authDomain: "test-cebcd.firebaseapp.com",
    projectId: "test-cebcd",
    storageBucket: "test-cebcd.appspot.com",
    messagingSenderId: "358391531726",
    appId: "1:358391531726:web:eb6c5a39c199d654c2e89f"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 가입 완료 버튼 클릭 시 실행될 함수
async function submitForm() {
    return new Promise(async (resolve, reject) => {
        try {
            const formData = new FormData();
            const name = document.getElementById('userid').value.trim();
            const contact = document.getElementById('contact').value.trim();
            const birthdate = document.getElementById('userpw_re').value.trim();
            const address = document.getElementById('sample6_address').value.trim();
            const membership = document.getElementById('membership').value.trim();

            if (!name || !contact) {
                reject(new Error("이름과 연락처를 입력하세요."));
                return;
            }
            const rentalMonths = document.getElementById('rental_months').value.trim();
            const lockerMonths = document.getElementById('locker_months').value.trim();
            const membershipMonths = document.getElementById('membership_months').value.trim();
            const discount = document.getElementById('discount').value.trim();
            const totalAmount = document.getElementById('total_amount').value.trim();

            // 현재 날짜 (YYMMDD 포맷)
            const now = new Date();
            const dateStr = now.getFullYear().toString().slice(2) + 
                            (now.getMonth() + 1).toString().padStart(2, '0') + 
                            now.getDate().toString().padStart(2, '0');

            // Firestore에서 오늘 저장된 문서 개수 조회하여 번호 생성
            const querySnapshot = await getDocs(collection(db, "회원가입계약서"));
            const dailyNumber = (querySnapshot.size + 1).toString().padStart(2, '0'); // 2자리 번호

            // 문서 ID 생성 (YYMMDD + 2자리 순번 + 이름)
            const docId = `${dateStr}${dailyNumber}_${name}`;

            // 저장할 데이터
            const userData = {
                docId: docId,
                name: name,
                contact: contact,
                birthdate: birthdate,
                address: address,
                membership: membership,
                rentalMonths: rentalMonths,
                lockerMonths: lockerMonths,
                membershipMonths: membershipMonths,
                discount: discount,
                totalAmount: totalAmount,
                timestamp: new Date().toISOString()
            };

            // Firestore에 저장
            await setDoc(doc(db, "회원가입계약서", docId), userData);
            alert("회원 정보가 성공적으로 저장되었습니다!");
            resolve();
        } catch (error) {
            console.error("회원 정보 저장 중 오류 발생:", error);
            alert("회원 정보 저장에 실패했습니다.");
            reject(error);
        } finally {
            // 클린업 작업이 필요한 경우 여기에 추가
        }
    });
}

// HTML에서 호출할 수 있도록 전역 함수로 설정
window.submitForm = submitForm;