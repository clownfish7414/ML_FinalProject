import firebase_admin
from firebase_admin import credentials, storage
import os
import sys
import argparse
import shutil
from vid2frames import V2F
from model_generator import get_face

# 初始化 Firebase Admin SDK
cred = credentials.Certificate("facetelling-c2271-firebase-adminsdk-i9hh6-8ac72972a2.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'facetelling-c2271.firebasestorage.app'
})

def download_file(user_id, file_name):
    bucket = storage.bucket()
    blob = bucket.blob(f'videos/{user_id}/{file_name}')
    local_dir = os.path.join('downloads', user_id)
    local_path = os.path.join(local_dir, file_name)
    
    # 確保目錄存在
    if not os.path.exists(local_dir):
        os.makedirs(local_dir)
    
    blob.download_to_filename(local_path)
    #print(f'File {file_name} downloaded to {local_path}.')

def upload_file(user_id, local_path, remote_path):
    bucket = storage.bucket()
    blob = bucket.blob(remote_path)
    blob.upload_from_filename(local_path)
    #print(f'File {local_path} uploaded to {remote_path}.')

def delete_local_file(file_path):
    if os.path.exists(file_path):
        os.remove(file_path)

def delete_all_files_in_folder(folder_path):
    if os.path.exists(folder_path):
        for filename in os.listdir(folder_path):
            file_path = os.path.join(folder_path, filename)
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python main.py <user_id> <file_name>")
        sys.exit(1)
    
    user_id = sys.argv[1]
    file_name = sys.argv[2]
    download_file(user_id, file_name)
    parser = argparse.ArgumentParser()

    parser.add_argument('--root', type=str, default='downloads')
    parser.add_argument('--save-path', type=str, default='frames')
    parser.add_argument('--label-name', type=str, default='QAQ.txt')
    parser.add_argument('--remove-frames', action='store_true', default=False,
                        help='Remove the frames if it exists')
    parser.add_argument('--remove-label', action='store_true', default=False,
                        help='Remove the label if it exists')
    args = parser.parse_args(sys.argv[3:])
    
    # 傳遞 user_id 給 V2F
    V2F(args, user_id)
    generate_dir = os.path.join('face_model', user_id)
    generate_path = os.path.join(generate_dir, 'face.yml')
    
    # 確保目錄存在
    if not os.path.exists(generate_dir):
        os.makedirs(generate_dir)
    result = get_face(generate_path,user_id)

    # 上傳 face.yml 文件到 Firebase Storage
    remote_face_model_path = f'model/{user_id}/face.yml'
    upload_file(user_id, generate_path, remote_face_model_path)