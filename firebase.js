
// Firebase SDK 불러오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-storage.js";

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyAyP5QTMzBtz8lMEzkE4C66CjFbZ3a17QM",
    authDomain: "bodystar-1b77d.firebaseapp.com",
    projectId: "bodystar-1b77d",
    storageBucket: "bodystar-1b77d.firebasestorage.app",
    messagingSenderId: "1011822927832",
    appId: "1:1011822927832:web:87f0d859b3baf1d8e21cad"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const storage = getStorage(app);

// 가입 완료 버튼 클릭 시 실행될 함수
async function submitForm() {
    return new Promise(async (resolve, reject) => {
        try {
            const formData = new FormData();
            const name = document.getElementById('name').value.trim();
            const contact = document.getElementById('contact').value.trim();
            const birthdate = document.getElementById('birthdate').value.trim();
            const address = document.getElementById('main_address').value.trim();
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

            // Get today's documents only
            const startOfDay = new Date(now.setHours(0,0,0,0));
            const endOfDay = new Date(now.setHours(23,59,59,999));
            
            const querySnapshot = await getDocs(collection(db, "회원가입계약서"));
            let todayDocs = 0;
            querySnapshot.forEach(doc => {
                const docDate = new Date(doc.data().timestamp);
                if (docDate >= startOfDay && docDate <= endOfDay) {
                    todayDocs++;
                }
            });
            
            const dailyNumber = (todayDocs + 1).toString().padStart(3, '0'); // 3자리 번호

            // Store the document number for image upload
            localStorage.setItem('current_doc_number', dailyNumber);

            // 문서 ID 생성 (YYMMDD_001_이름 형식)
            const docId = `${dateStr}_${dailyNumber}_${name}`;

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
// Image upload function
async function uploadImage(fileName, blob) {
    try {
        const { ref, uploadBytes, getDownloadURL } = await import("https://www.gstatic.com/firebasejs/11.3.0/firebase-storage.js");
        const storageRef = ref(storage, `회원가입계약서/${fileName}`);
        await uploadBytes(storageRef, blob);
        console.log("Firebase Storage 업로드 완료!");
        
        const downloadURL = await getDownloadURL(storageRef);
        console.log("Firebase URL:", downloadURL);
        return downloadURL;
    } catch (error) {
        console.error("Firebase Storage 업로드 실패:", error);
        throw error;
    }
}

window.submitForm = submitForm;
window.uploadImage = uploadImage;
