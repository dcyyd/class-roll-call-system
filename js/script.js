// 获取 DOM 元素
const fileInput = document.getElementById('fileInput');
const importButton = document.getElementById('importButton');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const display = document.getElementById('display');
const list = document.getElementById('studentList');

// 存储学生相关数据的变量
let students = [];
let isRolling = false;
let currentInterval;
let remainingStudents = [];
let pickedStudents = [];

// 爬虫防护相关变量
let requestCount = 0;
const MAX_REQUESTS = 10; // 最大请求次数
const REQUEST_INTERVAL = 60 * 1000; // 时间间隔（1 分钟）
let lastRequestTime = Date.now();

// 检查本地存储中是否有学生名单数据
function checkLocalStorage() {
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
        try {
            students = JSON.parse(storedStudents);
            remainingStudents = [...students];
            updateStudentList();
            display.textContent = '✅ 名单已从本地存储加载';
        } catch (error) {
            console.error('本地存储数据解析失败:', error);
            localStorage.removeItem('students');
        }
    }
}

// 文档加载完成后执行的操作
document.addEventListener('DOMContentLoaded', () => {
    // 导入按钮点击事件
    importButton.addEventListener('click', () => {
        if (checkForSpam()) return;
        fileInput.click();
    });

    // 文件选择改变事件
    fileInput.addEventListener('change', (e) => {
        if (checkForSpam()) return;
        const file = e.target.files[0];
        if (!file) return;

        // 检查文件类型是否为 txt
        if (file.type !== 'text/plain') {
            alert('请选择有效的 TXT 文件！');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                students = parseStudentNames(e.target.result);
                if (students.length === 0) {
                    alert('文件内容为空或格式不正确！');
                    return;
                }
                localStorage.setItem('students', JSON.stringify(students));
                remainingStudents = [...students];
                updateStudentList();
                display.textContent = '✅ 名单导入成功';
            } catch (error) {
                console.error('文件读取或解析失败:', error);
            }
        };
        reader.readAsText(file);
    });

    // 开始点名按钮点击事件
    startBtn.addEventListener('click', () => {
        if (checkForSpam()) return;
        startRolling();
    });
    // 重置按钮点击事件
    resetBtn.addEventListener('click', () => {
        if (checkForSpam()) return;
        resetList();
    });

    // 页面加载时检查本地存储
    checkLocalStorage();

    // 自动加载 doc/name.txt 文件
    const nameFile = 'doc/name.txt';
    fetch(nameFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('文件加载失败');
            }
            return response.text();
        })
        .then(text => {
            try {
                students = parseStudentNames(text);
                if (students.length === 0) {
                    alert('文件内容为空或格式不正确！');
                    return;
                }
                localStorage.setItem('students', JSON.stringify(students));
                remainingStudents = [...students];
                updateStudentList();
                display.textContent = '✅ 名单自动加载成功';
            } catch (error) {
                console.error('自动加载名单失败:', error);
            }
        })
        .catch(error => {
            console.error('自动加载名单失败:', error);
        });
});

// 解析学生姓名
function parseStudentNames(text) {
    return text.split('\n')
        .map(name => name.trim())
        .filter(name => name.length > 0);
}

// 更新学生列表
function updateStudentList() {
    const studentItems = students.map(student => {
        const isPicked = pickedStudents.includes(student);
        return `<li class="student-item ${isPicked? 'picked' : ''}" id="student-${student}">${student}</li>`;
    }).join('');
    list.innerHTML = studentItems;
}

// 开始点名或停止点名
function startRolling() {
    if (students.length === 0) {
        alert('请先导入学生名单！');
        return;
    }

    if (remainingStudents.length === 0) {
        alert('所有学生都已点名完毕！');
        return;
    }

    if (!isRolling) {
        isRolling = true;
        startBtn.innerHTML = '⏹ 停止';
        currentInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * remainingStudents.length);
            display.textContent = remainingStudents[randomIndex];
            display.style.transform = `scale(${1 + Math.random() * 0.1})`;
        }, 50);
    } else {
        isRolling = false;
        startBtn.innerHTML = '🎲 开始';
        clearInterval(currentInterval);
        pickStudent();
    }
}

// 选择学生
function pickStudent() {
    const pickedStudent = display.textContent;
    if (pickedStudent && remainingStudents.includes(pickedStudent)) {
        pickedStudents.push(pickedStudent);
        remainingStudents = remainingStudents.filter(s => s !== pickedStudent);
        display.innerHTML = `
            <span style="animation: highlight 1s">${pickedStudent}</span>
            <div style="font-size: 1.5rem;">✅</div>
        `;
        updateStudentList();
    }
}

// 重置名单
function resetList() {
    try {
        remainingStudents = [...students];
        pickedStudents = [];
        updateStudentList();
        display.textContent = '🔄 名单已重置';
        localStorage.removeItem('students');
    } catch (error) {
        console.error('重置名单失败:', error);
    }
}

// 手册控制逻辑
function toggleManual() {
    const modal = document.getElementById('helpModal');
    modal.classList.toggle('visible');
    document.body.style.overflow = modal.classList.contains('visible') ? 'hidden' : 'auto';
}

// 点击外部关闭
window.onclick = (event) => {
    const modal = document.getElementById('helpModal');
    if (event.target === modal) {
        toggleManual();
    }
}

// 初始化
window.onload = initParticles;

// 检查是否为爬虫请求
function checkForSpam() {
    const now = Date.now();
    if (now - lastRequestTime > REQUEST_INTERVAL) {
        requestCount = 0;
        lastRequestTime = now;
    }
    requestCount++;
    if (requestCount > MAX_REQUESTS) {
        alert('请求过于频繁，请稍后再试！');
        return true;
    }
    return false;
}