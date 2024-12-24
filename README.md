# Ckeck in System

## STEPS to run this program

1. install node.js
2. npm install
3. follow the website instruction to install ngrok
    (https://ithelp.ithome.com.tw/articles/10197345)
4. register on the ngrok website and find the token
5. ngrok authtoken <YOUR_AUTH_TOKEN>
6. ngrok http <your port>(default 5050)
7. if your port is occupied, change the port number in server.js
8. change the website url in the fetch function in signup.js、mainpage.js、loading.js into the url provided by ngrok
9. npm run build
10. npm start


Regenerating the website from the code presents several challenges:

1. Firebase Storage Access: We use Firebase Storage to host our photos, videos, and models. For Python code to access this data, it requires the private key of our Firebase project. However, uploading the key file to platforms like GitHub or other public repositories would result in Firebase identifying the key as compromised, rendering it invalid. This makes it impossible for the code to function properly on other computers without secure access to the key.

2. Environment Setup Complexity: Setting up the environment for the project can be time-consuming. Additionally, I cannot guarantee that the steps provided are sufficient to execute the code correctly across all systems. For instance, some computers might require additional Python modules or dependencies that are not explicitly mentioned. 


## Firebase Feature

- Storage
- Hosting
- Authentication

## Concepts

- We use the firebase authentication to support sign in / sign up 
- We use the firebase storage to store the videos, photos and models
- We use ngrok to set up a server for the website.

## Demo
Although it may not be possible to replicate the exact same website on another computer, we provide a link to the website so you can verify the code and the functionality we described.

our website : [https://713e-122-116-74-101.ngrok-free.app](https://713e-122-116-74-101.ngrok-free.app)

our demo video for how to use the website : https://drive.google.com/file/d/1MoassgAXdnyD1dHKdbeOLdojdlhPZtqt/view?usp=sharing
