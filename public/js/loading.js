import {
  getAuth,
  onAuthStateChanged
} from "firebase/auth";
import initFirebase from "./config";

window.onload = () => {
  initFirebase();

  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // 用戶已登錄，獲取用戶 ID
      const userId = user.uid;
      console.log('User ID:', userId);

      // 執行 facetelling.py 並根據返回值決定跳轉到 Success.html 還是 Failed.html
      fetch(`https://ea77-36-227-136-57.ngrok-free.app/facetelling?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
          console.log('Facetelling script output:', data.success);
          if (data.success) {
            window.location.href = "Success.html";
          } else {
            window.location.href = "Failed.html";
          }
        })
        .catch(error => {
          console.error('Error running facetelling script:', error);
          window.location.href = "Failed.html"; // 跳轉到 Failed.html
        });
    } else {
      // 用戶未登錄
      console.log('No user is signed in.');
      window.location.href = "Failed.html"; // 跳轉到 Failed.html
    }
  });
};