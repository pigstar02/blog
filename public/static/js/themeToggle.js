var currentTheme = localStorage.getItem("theme") || "light"; // 从本地存储获取主题，默认为"light"
function toggleTheme() {
    if (currentTheme === "light") {
        currentTheme = "dark";
    } else {
        currentTheme = "light";
    }
    localStorage.setItem("theme", currentTheme); // 将当前主题存储到本地存储
    // 调用函数，从body元素开始递归遍历
    const body = document.querySelector("body");
    setBodyClass(body); // 更新<body>元素的类名
    updateThemeIcon(); // 更新按钮图标
    syntaxHighlight(); // 更新代码高亮
}


function setBodyClass(node) {
    // 对当前节点进行处理，这里可以根据需要进行相应的操作
    if (currentTheme === "dark") {
        if (node.className) {
            node.className += " theme-dark";
        } else {
            node.className = "theme-dark";
        }
    } else {
        if (node.className) {
            node.className = node.className.replace("theme-dark", "").trim();
        }
    }
}



function updateThemeIcon() {
    const button = document.getElementById("themeButton");
    if (currentTheme === "light") {
        button.innerHTML = "🌞"; // 太阳图标
    } else {
        button.innerHTML = "🌜"; // 月亮图标
    }
}

const button = document.getElementById("themeButton");
button.addEventListener("click", toggleTheme);


// 在页面加载时初始化主题
function initTheme() {
    const body = document.querySelector("body");
    setBodyClass(body); // 更新<body>元素的类名
    updateThemeIcon(); // 更新按钮图标
    syntaxHighlight(); // 更新代码高亮
    
}
initTheme(); // 调用初始化函数