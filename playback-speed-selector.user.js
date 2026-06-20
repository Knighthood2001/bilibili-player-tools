// ==UserScript==
// @name         B站播放工具(倍速+字幕)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  悬浮面板设置默认倍速和字幕,设置后所有视频自动按此执行
// @author       knighthood
// @match        *://www.bilibili.com/video/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 存储键
    const STORAGE_SPEED = 'bili_tool_speed';
    const STORAGE_SUBTITLE = 'bili_tool_subtitle';

    // 读写设置
    const getSpeed = () => localStorage.getItem(STORAGE_SPEED) || '1';
    const getSubtitle = () => localStorage.getItem(STORAGE_SUBTITLE) || 'off';
    const saveSpeed = v => localStorage.setItem(STORAGE_SPEED, v);
    const saveSubtitle = v => localStorage.setItem(STORAGE_SUBTITLE, v);

    // 样式
    const style = document.createElement('style');
    style.textContent = `
        #biliToolToggle {
            position: fixed;
            right: 20px;
            bottom: 60px;
            z-index: 9999;
            padding: 6px 12px;
            background: #fb7299;
            color: #fff;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-size: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        #biliToolPanel {
            position: fixed;
            right: 20px;
            bottom: 100px;
            z-index: 9999;
            background: #222;
            padding: 10px 12px;
            border-radius: 10px;
            color: #fff;
            font-size: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            min-width: 180px;
            display: none;
        }
        .bt-title {
            color: #aaa;
            font-size: 11px;
            margin: 6px 0 4px;
        }
        .bt-title:first-child { margin-top: 0; }
        .bt-row {
            display: flex;
            gap: 4px;
        }
        .bt-row button {
            flex: 1;
            padding: 5px 0;
            background: #444;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        .bt-row button:hover { background: #555; }
        .bt-row button.active { background: #fb7299; }
        .bt-foot {
            margin-top: 8px;
            padding-top: 6px;
            border-top: 1px solid #333;
            font-size: 10px;
            color: #777;
            display: flex;
            justify-content: space-between;
        }
        .bt-reset {
            color: #fb7299;
            cursor: pointer;
            text-decoration: underline;
        }
    `;
    document.head.appendChild(style);

    // 切换按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'biliToolToggle';
    toggleBtn.textContent = '⚙ 播放设置';
    document.body.appendChild(toggleBtn);

    // 面板
    const panel = document.createElement('div');
    panel.id = 'biliToolPanel';
    panel.innerHTML = `
        <div class="bt-title">默认倍速</div>
        <div class="bt-row" data-group="speed">
            <button data-val="1">1.0</button>
            <button data-val="1.25">1.25</button>
            <button data-val="1.5">1.5</button>
            <button data-val="2">2.0</button>
        </div>
        <div class="bt-title">字幕</div>
        <div class="bt-row" data-group="subtitle">
            <button data-val="on">开启</button>
            <button data-val="off">关闭</button>
        </div>
        <div class="bt-foot">
            <span>已自动保存</span>
            <span class="bt-reset" id="btReset">重置</span>
        </div>
    `;
    document.body.appendChild(panel);

    // 展开/收起
    toggleBtn.addEventListener('click', () => {
        panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        refreshActive();
    });

    // 刷新高亮
    function refreshActive() {
        const sp = getSpeed();
        const sub = getSubtitle();
        panel.querySelectorAll('[data-group="speed"] button').forEach(b => {
            b.classList.toggle('active', b.dataset.val === sp);
        });
        panel.querySelectorAll('[data-group="subtitle"] button').forEach(b => {
            b.classList.toggle('active', b.dataset.val === sub);
        });
    }

    // 倍速按钮
    panel.querySelectorAll('[data-group="speed"] button').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.dataset.val;
            saveSpeed(val);
            setPlaySpeed(val);
            refreshActive();
        });
    });

    // 字幕按钮
    panel.querySelectorAll('[data-group="subtitle"] button').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.dataset.val;
            saveSubtitle(val);
            setSubtitle(val);
            refreshActive();
        });
    });

    // 重置
    document.getElementById('btReset').addEventListener('click', () => {
        localStorage.removeItem(STORAGE_SPEED);
        localStorage.removeItem(STORAGE_SUBTITLE);
        refreshActive();
        // 重置后立即把当前视频恢复成 1.0 + 关闭字幕
        setPlaySpeed('1');
        setSubtitle('off');
    });

    // ===== 核心功能 =====

    // 应用倍速
    function setPlaySpeed(speedVal) {
        const speedBtn = document.querySelector('.bpx-player-ctrl-playbackrate');
        if (!speedBtn) return;
        speedBtn.click();
        setTimeout(() => {
            const item = document.querySelector(`.bpx-player-ctrl-playbackrate-menu-item[data-value="${speedVal}"]`);
            if (item) item.click();
        }, 400);
    }

    // 应用字幕(打开菜单 → 选中文 / 关闭字幕)
    // 关闭逻辑沿用 auto-chinese-subtitle.user.js 中实测通过的实现
    function setSubtitle(state) {
        const subBtn = document.querySelector('.bpx-player-ctrl-subtitle');
        if (!subBtn) {
            console.warn('[B站工具] 没找到字幕按钮 .bpx-player-ctrl-subtitle');
            return;
        }

        // 打开菜单(无论开启还是关闭,都要先把菜单叫出来)
        subBtn.click();

        // 用你测过的 600ms 等待菜单渲染
        setTimeout(() => {
            if (state === 'on') {
                // 开启:点 [data-lan="ai-zh"]
                const zhItem = document.querySelector('[data-lan="ai-zh"]');
                if (zhItem) {
                    const cls = zhItem.className || '';
                    if (!cls.includes('active')) {
                        zhItem.click();
                        console.log('[B站工具] ✅ 已开启中文字幕');
                    } else {
                        console.log('[B站工具] 中文字幕已开启,无需操作');
                    }
                } else {
                    console.warn('[B站工具] 此视频没有中文字幕选项(ai-zh)');
                }
            } else {
                // 关闭:沿用你测试过的逻辑,直接点 .bpx-player-ctrl-subtitle-close-switch
                // 同时也处理一下翻译字幕的关闭开关(以防翻译字幕也开着)
                const mainSwitch = document.querySelector('.bpx-player-ctrl-subtitle-close-switch');
                const transSwitch = document.querySelector('.bpx-player-ctrl-translation-close-switch');

                if (mainSwitch) {
                    mainSwitch.click();
                    console.log('[B站工具] ✅ 已点击 .bpx-player-ctrl-subtitle-close-switch 关闭原声字幕');
                } else {
                    console.warn('[B站工具] 没找到 .bpx-player-ctrl-subtitle-close-switch');
                }

                if (transSwitch) {
                    transSwitch.click();
                    console.log('[B站工具] ✅ 已点击 .bpx-player-ctrl-translation-close-switch 关闭翻译字幕');
                }
            }
        }, 600);
    }

    // 一次应用全部设置
    function autoApply() {
        setPlaySpeed(getSpeed());
        setSubtitle(getSubtitle());
    }

    // 首次进入页面,延迟应用
    setTimeout(autoApply, 2000);

    // 切换分P 时重新应用
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(autoApply, 2000);
        }
    }, 1000);
})();
