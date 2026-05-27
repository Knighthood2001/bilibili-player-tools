// ==UserScript==
// @name         B站倍速选择器(可视化面板)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  悬浮面板一键切换倍速，支持1.0/1.25/1.5/2.0
// @author       knighthood
// @match        *://www.bilibili.com/video/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    let currentSpeed = 2; // 默认2倍速

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        #speedFloatBtn {
            position: fixed;
            right: 20px;
            bottom: 140px;
            z-index: 9999;
            padding: 6px 12px;
            background: #fb7299;
            color: #fff;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-size: 12px;
        }
        #speedMenu {
            position: fixed;
            right: 20px;
            bottom: 180px;
            z-index: 9999;
            background: #222;
            padding: 8px;
            border-radius: 8px;
            display: none;
        }
        #speedMenu button {
            display: block;
            width: 80px;
            margin: 4px 0;
            padding: 4px;
            background: #444;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        #speedMenu button:hover {
            background: #fb7299;
        }
    `;
    document.head.appendChild(style);

    // 创建悬浮按钮 & 菜单
    const floatBtn = document.createElement('button');
    floatBtn.id = 'speedFloatBtn';
    floatBtn.textContent = '设置倍速';
    document.body.appendChild(floatBtn);

    const menu = document.createElement('div');
    menu.id = 'speedMenu';
    // 👇 这里我加了 1.0 和 1.25
    menu.innerHTML = `
        <button data-sp="1">1.0 倍速</button>
        <button data-sp="1.25">1.25 倍速</button>
        <button data-sp="1.5">1.5 倍速</button>
        <button data-sp="2">2.0 倍速</button>
    `;
    document.body.appendChild(menu);

    // 展开/收起菜单
    floatBtn.addEventListener('click', () => {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });

    // 选中倍速并执行点击操作
    menu.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            currentSpeed = btn.dataset.sp;
            menu.style.display = 'none';
            setPlaySpeed(currentSpeed);
        });
    });

    // 核心：模拟点击倍速按钮+选项
    function setPlaySpeed(speedVal) {
        const speedBtn = document.querySelector('.bpx-player-ctrl-playbackrate');
        if (speedBtn) speedBtn.click();

        setTimeout(() => {
            const item = document.querySelector(`.bpx-player-ctrl-playbackrate-menu-item[data-value="${speedVal}"]`);
            if (item) item.click();
        }, 600);
    }

    // 自动应用倍速
    setTimeout(() => setPlaySpeed(currentSpeed), 2000);

    // 切换分P自动沿用上次选择的倍速
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(() => setPlaySpeed(currentSpeed), 2000);
        }
    }, 1000);
})();