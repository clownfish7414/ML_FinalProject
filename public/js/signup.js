import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import initFirebase from "./config";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

// Custom alert
function create_alert(type, message) {
  const alertarea = document.getElementById("custom-alert");
  if (type == "success") {
    const str_html = `<div class='alert alert-success alert-dismissible fade show' role='alert'><strong>Success! </strong>${message}<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>`;
    alertarea.innerHTML = str_html;
  } else if (type == "error") {
    const str_html = `<div class='alert alert-danger alert-dismissible fade show' role='alert'><strong>Error! </strong>${message}<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>`;
    alertarea.innerHTML = str_html;
  }
}

const initApp = () => {
  initFirebase();

  const auth = getAuth();
  const btnSignUp = document.getElementById("btnSignUp");
  const btnVideo = document.getElementById("btnVideo");
  const fileInput = document.getElementById("fileInput");
  const runpy = document.getElementById("runpy");
  var txtEmail = document.getElementById("inputEmail");
  var txtPassword = document.getElementById("inputPassword");

  btnSignUp.addEventListener("click", () => {
    console.log("Sign Up");
    createUserWithEmailAndPassword(auth, txtEmail.value, txtPassword.value)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('User ID:', user.uid);
        btnSignUp.style.display = "none";
        btnVideo.style.display = "block";
      })
      .catch((error) => {
        console.error('Sign Up failed:', error);
      });
  });

  btnVideo.addEventListener("click", () => {
    console.log('fileInput click event');
    fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
    console.log('fileInput change event');
    const file = event.target.files[0];
    if (file) {
      document.getElementById('output').innerText = 'Uploading...';
      console.log('uploadFile 0');
      uploadFile(file);
    }
  });

  function uploadFile(file) {
    console.log('uploadFile 1');
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      console.log('User ID:', userId);
      const storage = getStorage();
      const storageRef = ref(storage, 'videos/' + userId + '/' + file.name);

      uploadBytes(storageRef, file).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        generatePY(userId, file.name);
      }).catch((error) => {
        console.error('File upload failed:', error);
      });
    } else {
      console.error('No user is signed in.');
    }
  }

  runpy.addEventListener("click", () => {
    console.log('Runpy click event');
    generatePY();
  });

  function generatePY(userId, fileName) {
    document.getElementById('output').innerText = 'Start training...';
    fetch(` https://b17f-122-116-74-101.ngrok-free.app/run-python?userId=${userId}&fileName=${fileName}`)
      .then(response => response.text())
      .then(data => {
        document.getElementById('output').innerText = data;
        setTimeout(() => {
            window.location.href = 'mainpage.html';
          }, 4000);
        
      })
      .catch(error => {
        console.error('Error running Python script:', error);
      });
  }
};

window.onload = () => {
  initApp();
};