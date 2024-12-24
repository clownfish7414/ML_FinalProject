import cv2
import firebase_admin
from firebase_admin import credentials, storage
import sys
import os

def download_photo(bucket, source_blob_name, destination_file_name):
    # 刪除已存在的文件
    if os.path.exists(destination_file_name):
        os.remove(destination_file_name)
        print(f'{destination_file_name} removed.')

    blob = bucket.blob(source_blob_name)
    blob.download_to_filename(destination_file_name)
    print(f'Blob {source_blob_name} downloaded to {destination_file_name}.')

def download_model(bucket, source_blob_name, destination_file_name):
    # 刪除已存在的文件
    if os.path.exists(destination_file_name):
        return

    blob = bucket.blob(source_blob_name)
    blob.download_to_filename(destination_file_name)
    print(f'Blob {source_blob_name} downloaded to {destination_file_name}.')

def facetelling(user_id):
    # 初始化 Firebase Admin SDK
    cred = credentials.Certificate("facetelling-c2271-firebase-adminsdk-i9hh6-1c401148e1.json")
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'facetelling-c2271.firebasestorage.app'
    })
    bucket = storage.bucket()


    photo_number = 1
    predict_name = ""
    photo_tracing = [[] for i in range(photo_number)]
    photo_success = ["0" for i in range(photo_number)]
    for ID in range(photo_number):
        # 讀取圖片
        img = cv2.imread(f'downloads_photo/{user_id}/photo.jpg')
        img = cv2.resize(img, (1080, 1920))
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # 將圖片轉成灰階

        # 載入人臉追蹤模型
        face_cascade = cv2.CascadeClassifier('xml/haarcascade_frontalface_default.xml')

        # 建立人臉辨識器
        recognizer = cv2.face.LBPHFaceRecognizer_create(radius=2, neighbors=10, grid_x=10, grid_y=10)
        recognizer.read(f'face_model/{user_id}/face.yml')  # 讀取已訓練的模型

        # 偵測人臉
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=8, minSize=(40, 40))

        # 迴圈處理偵測到的每張臉
        for (x, y, w, h) in faces:
            cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)  # 標記人臉外框
            idnum, confidence = recognizer.predict(gray[y:y + h, x:x + w])  # 預測ID及信心指數
            if confidence < 120:  
                photo_tracing[ID].append(1)
            else:  # 否則顯示未知
                photo_tracing[ID].append(0)

        for item in photo_tracing[ID]:
            if item==0:
                photo_success[ID]="Fail"+" score= "+str(confidence)
                break
            else:
                photo_success[ID]="Success "+" score= "+str(confidence)
        print(photo_success[ID])

        scale_factor = 0.25  # Adjust the scale factor as needed
        if img.shape[1]<600 or img.shape[0]<600:
            scale_factor = 2
        new_width = int(img.shape[1] * scale_factor)
        new_height = int(img.shape[0] * scale_factor)
        img = cv2.resize(img, (new_width, new_height))


        # 顯示結果
        #cv2.imshow(f'Face Recognition_No.{ID}', img)
        #cv2.waitKey(0)
        cv2.destroyAllWindows()

    # 返回結果
    return any(item == 1 for item in photo_tracing[0])
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python facetelling.py <user_id>")
        sys.exit(1)
    
    user_id = sys.argv[1]
    success = facetelling(user_id)
    print(success)