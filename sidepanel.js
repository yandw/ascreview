// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
  // 检查登录状态
  chrome.storage.local.get(['token'], (result) => {
    if (result.token) {
      showDataSection();
      // 请求content script获取数据
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {type: 'getWorkItems'});
        }
      });
    } else {
      showLoginSection();
    }
  });
});

// 显示登录界面
function showLoginSection() {
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('data-section').style.display = 'none';
}

// 显示数据界面
function showDataSection() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('data-section').style.display = 'block';
}

// 处理登录按钮点击事件
document.getElementById('login-button').addEventListener('click', () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!username || !password) {
    alert('请输入用户名和密码');
    return;
  }

  // 这里应该调用实际的登录API，目前使用模拟验证
  if (username === 'admin' && password === 'admin') {
    chrome.storage.local.set({token: 'dummy_token'}, () => {
      showDataSection();
      // 登录成功后请求数据
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {type: 'getWorkItems'});
        }
      });
    });
  } else {
    alert('用户名或密码错误');
  }
});

import { initDesMode } from './shared/des-mode.js';

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'error') {
    document.getElementById('data-section').innerHTML = `<div class="error">${message.message}</div>`;
  }
  // 确保消息得到响应
  sendResponse({ received: true });
  return true; // 保持消息通道开启
});

// 在登录成功后初始化DES Mode
document.addEventListener('DOMContentLoaded', () => {
  // 检查登录状态
  chrome.storage.local.get(['token'], (result) => {
    if (result.token) {
      showDataSection();
      initDesMode();
    } else {
      showLoginSection();
    }
  });
});