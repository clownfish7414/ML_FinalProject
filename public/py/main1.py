import firebase_admin
from firebase_admin import credentials, storage
import os
import sys
import argparse
import shutil


# 初始化 Firebase Admin SDK
cred = credentials.Certificate("facetelling-c2271-firebase-adminsdk-i9hh6-8ac72972a2.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'facetelling-c2271.firebasestorage.app'
})

def download_file(user_id, file_name):
    bucket = storage.bucket()
    blob = bucket.blob(f'images/{user_id}/{file_name}')
    local_dir = os.path.join('downloads_photo', user_id)
    local_path = os.path.join(local_dir, file_name)
    
    # 檢查檔案是否已經存在，如果存在則刪除它
    if os.path.exists(local_path):
        os.remove(local_path)
        print(f'File {local_path} already exists and has been removed.')
    
    # 確保目錄存在
    if not os.path.exists(local_dir):
        os.makedirs(local_dir)
    
    blob.download_to_filename(local_path)
    print(f'File {file_name} downloaded to {local_path}.')

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python main1.py <user_id> <file_name>")
        sys.exit(1)
    
    user_id = sys.argv[1]
    file_name = sys.argv[2]
    download_file(user_id, file_name)