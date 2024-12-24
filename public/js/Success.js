
initApp = function() {
    // 等待 3 秒後跳轉到 index.html
    setTimeout(() => {
        window.location.href = "index.html";
    }, 5000);
}


window.onload = () => {
initApp();
};