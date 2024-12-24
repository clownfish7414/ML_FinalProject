import cv2
import numpy as np

detector = cv2.CascadeClassifier('xml/haarcascade_frontalface_default.xml')  # 載入人臉追蹤模型
recog = cv2.face.LBPHFaceRecognizer_create(radius=2, neighbors=10, grid_x=10, grid_y=10)  # 啟用訓練人臉模型方法
faces = []  # 儲存人臉位置大小的串列
ids = []  # 記錄該人臉 id 的串列

video_number = 1
augmentation_count = 3  # 每張影像的增強數量


def get_face(path,userid):
    for i in range(0,video_number):
        for j in range(1, 100):
            img = cv2.imread(f'frames/{userid}/vid_{i}/{j}.jpg')
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            img_np = np.array(gray, 'uint8')
            face = detector.detectMultiScale(gray)

            for (x, y, w, h) in face:
                original_face = img_np[y:y + h, x:x + w]
                faces.append(original_face)
                ids.append(i + 1)

                # 資料增強
                for _ in range(augmentation_count):
                    augmented_face = original_face.copy()

                    # 隨機擷取特定區域
                    crop_x = int(w * 0.2 * np.random.rand())
                    crop_y = int(h * 0.2 * np.random.rand())
                    cropped_face = augmented_face[crop_y:h - crop_y, crop_x:w - crop_x]
                    cropped_face = cv2.resize(cropped_face, (w, h))

                    # 隨機放大或縮小
                    scale_factor = np.random.uniform(0.2, 1)
                    resized_face = cv2.resize(cropped_face, None, fx=scale_factor, fy=scale_factor)
                    resized_face = cv2.resize(resized_face, (w, h))

                    # 隨機旋轉
                    angle = np.random.uniform(-15, 15)
                    w = int(w)  # Ensure w is an integer
                    h = int(h)  # Ensure h is an integer
                    matrix = cv2.getRotationMatrix2D((w // 2, h // 2), angle, 1)
                    rotated_face = cv2.warpAffine(resized_face, matrix, (w, h))

                    # 隨機水平翻轉
                    if np.random.rand() > 0.5:
                        rotated_face = cv2.flip(rotated_face, 1)

                    # 亮度和對比度調整
                    alpha = np.random.uniform(0.7, 1.3)  # 對比度
                    beta = np.random.uniform(-20, 20)   # 亮度
                    adjusted_face = cv2.convertScaleAbs(resized_face, alpha=alpha, beta=beta)

                    # 增強後的臉加入數據集
                    faces.append(adjusted_face)
                    ids.append(i + 1)
                    #cv2.imshow('Augmented Face', adjusted_face)
                    #cv2.waitKey(0)

    #print('training...')
    recog.train(faces, np.array(ids))
    recog.save(path)
    print('Training Finish!')
    return True

if __name__ == '__main__':
    result=get_face()
    cv2.destroyAllWindows()
