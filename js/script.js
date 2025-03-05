/**
 * 班级点名系统主脚本
 * @file 该脚本负责处理班级点名系统的核心逻辑，包括名单导入、随机点名、状态重置等功能
 * @author DouCY
 * @version 1.0.0
 * @license MIT
 */

// 获取 DOM 元素
const getElement = (id) => document.getElementById(id);
const fileInput = getElement('fileInput');
const importButton = getElement('importButton');
const startBtn = getElement('startBtn');
const resetBtn = getElement('resetBtn');
const display = getElement('display');
const list = getElement('studentList');

// 存储学生相关数据的变量
let students = [];
let isRolling = false;
let currentInterval;
let remainingStudents = [];
let pickedStudents = [];

// 初始化
// window.onload = initParticles;

// 爬虫防护相关变量
let requestCount = 0;
const MAX_REQUESTS = 500; // 最大请求次数
const REQUEST_INTERVAL = 60 * 1000; // 时间间隔（1 分钟）
let lastRequestTime = Date.now();

// 封装文件读取和解析逻辑
const readAndParseFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsedStudents = parseStudentNames(e.target.result);
                resolve(parsedStudents);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = () => {
            reject(new Error('文件读取失败'));
        };
        reader.readAsText(file);
    });
};

// 检查本地存储中是否有学生名单数据
const checkLocalStorage = () => {
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
};

// 检查是否为爬虫请求
const checkForSpam = () => {
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
};

// 文档加载完成后执行的操作
document.addEventListener('DOMContentLoaded', () => {
    const handleImportButtonClick = () => {
        if (checkForSpam()) return;
        fileInput.click();
    };

    const handleFileInputChange = async (e) => {
        if (checkForSpam()) return;
        const file = e.target.files[0];
        if (!file) return;

        // 检查文件类型是否为 txt
        if (file.type !== 'text/plain') {
            alert('请选择有效的 TXT 文件！');
            return;
        }

        try {
            const parsedStudents = await readAndParseFile(file);
            if (parsedStudents.length === 0) {
                alert('文件内容为空或格式不正确！');
                return;
            }
            students = parsedStudents;
            localStorage.setItem('students', JSON.stringify(students));
            remainingStudents = [...students];
            updateStudentList();
            display.textContent = '✅ 名单导入成功';
            // 重置开始按钮状态
            startBtn.disabled = false;
        } catch (error) {
            console.error('文件读取或解析失败:', error);
        }
    };

    const handleStartBtnClick = () => {
        if (checkForSpam()) return;
        startRolling();
    };

    const handleResetBtnClick = () => {
        if (checkForSpam()) return;
        resetList();
        // 重置开始按钮状态
        startBtn.disabled = false;
    };

    importButton.addEventListener('click', handleImportButtonClick);
    fileInput.addEventListener('change', handleFileInputChange);
    startBtn.addEventListener('click', handleStartBtnClick);
    resetBtn.addEventListener('click', handleResetBtnClick);

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
                const parsedStudents = parseStudentNames(text);
                if (parsedStudents.length === 0) {
                    alert('文件内容为空或格式不正确！');
                    return;
                }
                students = parsedStudents;
                localStorage.setItem('students', JSON.stringify(students));
                remainingStudents = [...students];
                updateStudentList();
                display.textContent = '✅ 名单自动加载成功';
                // 重置开始按钮状态
                startBtn.disabled = false;
            } catch (error) {
                console.error('自动加载名单失败:', error);
            }
        })
        .catch(error => {
            console.error('自动加载名单失败:', error);
        });
});

// 解析学生姓名
const parseStudentNames = (text) => {
    return text.split('\n')
        .map(name => name.trim())
        .filter(name => name.length > 0);
};

// 更新学生列表
const updateStudentList = () => {
    const studentItems = students.map(student => {
        const isPicked = pickedStudents.includes(student);
        return `<li class="student-item ${isPicked? 'picked' : ''}" id="student-${student}">${student}</li>`;
    }).join('');
    list.innerHTML = studentItems;
};

// 开始点名或停止点名
const startRolling = () => {
    if (students.length === 0) {
        alert('请先导入学生名单！');
        return;
    }

    if (remainingStudents.length === 0) {
        alert('所有学生都已点名完毕！');
        startBtn.disabled = true;
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
};

// 选择学生
const pickStudent = () => {
    const pickedStudent = display.textContent;
    if (pickedStudent && remainingStudents.includes(pickedStudent)) {
        pickedStudents.push(pickedStudent);
        remainingStudents = remainingStudents.filter(s => s !== pickedStudent);
        display.innerHTML = `
            <span style="animation: highlight 1s">${pickedStudent}</span>
            <div style="font-size: 1.5rem;">✅</div>
        `;
        updateStudentList();
        if (remainingStudents.length === 0) {
            alert('所有学生都已点名完毕！');
            startBtn.disabled = true;
        }
    }
};

// 重置名单
const resetList = () => {
    try {
        remainingStudents = [...students];
        pickedStudents = [];
        updateStudentList();
        display.textContent = '🔄 名单已重置';
        localStorage.removeItem('students');
    } catch (error) {
        console.error('重置名单失败:', error);
    }
};

// 手册控制逻辑
const toggleManual = () => {
    const modal = getElement('helpModal');
    modal.classList.toggle('visible');
    document.body.style.overflow = modal.classList.contains('visible') ? 'hidden' : 'auto';
};

// 点击外部关闭
window.onclick = (event) => {
    const modal = getElement('helpModal');
    if (event.target === modal) {
        toggleManual();
    }
};

// 确保 DOM 加载完成后再执行代码
document.addEventListener('DOMContentLoaded', function() {
    // 禁止查看源代码
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.key ===
                'U')) {
            e.preventDefault();
            // alert('禁止查看源代码！');
        }
    });

    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        // alert('禁止查看源代码！');
    });
});