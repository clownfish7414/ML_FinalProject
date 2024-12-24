import {
  getAuth,
  onAuthStateChanged
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import initFirebase from "./config";

const initApp = () => {
  initFirebase();

  const auth = getAuth();
  const storage = getStorage();
  const btnCapture = document.getElementById("btnCapture");
  const outputImage = document.getElementById("outputImage");
  const videoContainer = document.getElementById("video_container");

  let userId = null;
  let currentImageRef = null;
  let stream = null;
  let video = null;
  let canvas = null;

  // 監聽用戶的登錄狀態變化
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userId = user.uid;
      console.log('User ID:', userId);
    } else {
      console.log('No user is signed in.');
    }
  });

  const startCamera = () => {
    video = document.createElement("video");
    video.width = 360;
    video.height = 640;
    video.autoplay = true;
    videoContainer.appendChild(video);

    canvas = document.createElement("canvas");
    canvas.width = 360;
    canvas.height = 640;
    canvas.style.display = "none";
    videoContainer.appendChild(canvas);

    navigator.mediaDevices.getUserMedia({ video: { aspectRatio: 9 / 16 }  })
      .then((mediaStream) => {
        stream = mediaStream;
        video.srcObject = stream;
        video.play();
        btnCapture.textContent = "Take Photo";
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
      });
  };

  const takePhoto = () => {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');

    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
        if (file && userId) {
          if (currentImageRef) {
            deleteObject(currentImageRef).catch((error) => {
              console.error('Error deleting old image:', error);
            });
          }

          const storageRef = ref(storage, `images/${userId}/photo.jpg`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
            },
            (error) => {
              console.error('Upload failed:', error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                currentImageRef = storageRef;

                fetch(`https://ea77-36-227-136-57.ngrok-free.app/check-in?userId=${userId}&fileName=photo.jpg`)
                  .then(response => response.text())
                  .then(data => {
                    console.log('Check-in script output:', data);
                    outputImage.src = downloadURL;
                    outputImage.style.display = 'block';
                    outputImage.width = 360;
                    outputImage.height = 640;

                    btnCapture.textContent = "Check In";
                    btnCapture.removeEventListener("click", capturePhotoHandler);
                    btnCapture.addEventListener("click", () => {
                      window.location.href = `loading.html?userId=${userId}`;
                    });
                  })
                  .catch(error => {
                    console.error('Error running check-in script:', error);
                  });
              });
            }
          );
        }
      });

    stream.getTracks().forEach(track => track.stop());
    videoContainer.removeChild(video);
    videoContainer.removeChild(canvas);
  };

  const capturePhotoHandler = () => {
    if (btnCapture.textContent === "Capture Photo") {
      startCamera();
    } else if (btnCapture.textContent === "Take Photo") {
      takePhoto();
    }
  };

  btnCapture.addEventListener("click", capturePhotoHandler);
};

window.onload = () => {
  initApp();
};