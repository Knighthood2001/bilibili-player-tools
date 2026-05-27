// ==UserScript==
// @name         B站自动开启中文字幕
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动点击字幕按钮并选择中文
// @author       knighthood
// @match        *://www.bilibili.com/video/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    function autoOpenSubtitle() {
        console.log("尝试开启字幕...");

        // 1. 找到【字幕按钮】（用你给的class精准定位）
        let subtitleButton = document.querySelector('.bpx-player-ctrl-subtitle');
        if (subtitleButton) {
            subtitleButton.click();  // 点击打开字幕菜单
            console.log("✅ 已点击字幕按钮");
        } else {
            console.log("❌ 没找到字幕按钮");
            return;
        }

        // 等待菜单弹出，再选中文
        setTimeout(() => {
            // 2. 找到【中文】选项（精准匹配你给的HTML）
            let chineseOption = document.querySelector('[data-lan="ai-zh"]');
            if (chineseOption) {
                chineseOption.click();
                console.log("✅ 已选择中文字幕");
            } else {
                console.log("❌ 没找到中文选项");
            }
        }, 600);
    }

    // 页面加载完 2 秒后执行
    setTimeout(autoOpenSubtitle, 2000);

    // 切换视频分P时自动重新开启
    let currentUrl = window.location.href;
    setInterval(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            setTimeout(autoOpenSubtitle, 2000);
        }
    }, 1000);

})();