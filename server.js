const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 5000;

// 設置靜態文件夾
app.use(express.static(path.join(__dirname, 'public')));

// 定義一個路由來處理執行 Python 腳本的請求
app.get('/run-python', (req, res) => {
    const userId = req.query.userId;
    const fileName = req.query.fileName;
    const command = `python public/py/main.py ${userId} ${fileName}`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Execution error: ${error}`);
        return res.status(500).send(`Execution error: ${error}`);
      }
      console.log(`Script output: ${stdout}`);
      res.send(stdout);
    });
  });

// 定義一個路由來處理 Check In 按鈕的請求
app.get('/check-in', (req, res) => {
    const userId = req.query.userId;
    const fileName = req.query.fileName;
    const command = `python public/py/main1.py ${userId} ${fileName}`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Execution error: ${error}`);
        return res.status(500).send(`Execution error: ${error}`);
      }
      console.log(`Script output: ${stdout}`);
      res.send(stdout);
    });
});

// 定義一個路由來處理執行 facetelling.py 的請求
app.get('/facetelling', (req, res) => {
  const userId = req.query.userId;
  const command = `python public/py/facetelling.py ${userId}`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error}`);
      return res.status(500).json({ success: false, error: error.message });
    }
    console.log(`Script output: ${stdout}`);
    const success = stdout.trim().endsWith('True');;
    res.json({ success });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});