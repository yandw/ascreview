import { createDesMode } from './shared/des-mode.js';

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
  // 定期检查页面内容
  setInterval(checkPageContent, 2000);
  // 创建并添加DES Mode浮窗
  createDesMode();
});

// 创建DES Mode浮窗
function createDesMode() {
  const desMode = document.createElement('div');
  desMode.id = 'des-mode';
  desMode.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 300px;
    background: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 10000;
    display: none;
  `;

  desMode.innerHTML = `
    <style>
      #des-mode h2 {
        margin: 0 0 16px;
        font-size: 18px;
        color: #333;
      }
      #des-mode .field-group {
        margin-bottom: 12px;
      }
      #des-mode .field-label {
        display: block;
        margin-bottom: 4px;
        font-size: 14px;
        color: #333;
      }
      #des-mode .field-input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }
      #des-mode .field-select {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        background-color: white;
      }
      #des-mode .tag-field {
        display: inline-block;
        padding: 4px 8px;
        margin: 4px;
        background-color: #f0f0f0;
        border-radius: 4px;
        font-size: 12px;
      }
      #des-mode .button-group {
        display: flex;
        gap: 8px;
        margin-top: 16px;
      }
      #des-mode .action-button {
        flex: 1;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        background-color: white;
      }
      #des-mode .action-button.primary {
        background-color: #0078d4;
        color: white;
        border: none;
      }
      #des-mode .action-button:hover {
        opacity: 0.9;
      }
    </style>
    <h2>DES Mode</h2>
    <div class="field-group">
      <label class="field-label">AI-Gen</label>
      <input type="text" class="field-input" id="ai-gen" value="" disabled>
    </div>
    <div class="field-group">
      <label class="field-label">Feature Crew</label>
      <select class="field-select" id="feature-crew">
        <option value="relevance_ranking">Relevance and Ranking</option>
      </select>
    </div>
    <div class="field-group">
      <label class="field-label">Issue</label>
      <select class="field-select" id="issue">
        <option value="freshness">Freshness</option>
      </select>
    </div>
    <div class="field-group">
      <label class="field-label">Owner</label>
      <input type="text" class="field-input" id="owner" value="Jing Jin">
    </div>
    <div class="field-group">
      <label class="field-label">Root Cause</label>
      <input type="text" class="field-input" id="root-cause" value="News - Category news">
    </div>
    <div class="field-group">
      <label class="field-label">Tag</label>
      <div>
        <span class="tag-field">News_Vertical</span>
      </div>
    </div>
    <div class="field-group">
      <label class="field-label">State</label>
      <select class="field-select" id="state">
        <option value="active">Active</option>
      </select>
    </div>
    <div class="field-group">
      <label class="field-label">Priority</label>
      <select class="field-select" id="priority">
        <option value="1">1</option>
      </select>
    </div>
    <div class="button-group">
      <button class="action-button" id="edit-button">Edit</button>
      <button class="action-button" id="generate-button">Generate</button>
      <button class="action-button primary" id="execute-button">Execute</button>
    </div>
  `;

  document.body.appendChild(desMode);
  initDesMode();
}

// 初始化DES Mode按钮事件
function initDesMode() {
  document.getElementById('edit-button').addEventListener('click', () => {
    const inputs = document.querySelectorAll('#des-mode .field-input:not(#ai-gen), #des-mode .field-select');
    inputs.forEach(input => input.disabled = false);
  });

  document.getElementById('generate-button').addEventListener('click', () => {
    const aiGen = document.getElementById('ai-gen');
    aiGen.value = '正在生成AI建议...';
  });

  document.getElementById('execute-button').addEventListener('click', () => {
    const config = {
      featureCrew: document.getElementById('feature-crew').value,
      issue: document.getElementById('issue').value,
      owner: document.getElementById('owner').value,
      rootCause: document.getElementById('root-cause').value,
      state: document.getElementById('state').value,
      priority: document.getElementById('priority').value
    };
    console.log('执行配置:', config);
  });

  // 初始禁用所有输入字段
  const inputs = document.querySelectorAll('#des-mode .field-input:not(#ai-gen), #des-mode .field-select');
  inputs.forEach(input => input.disabled = true);
}

// 检查页面内容并提取数据
function checkPageContent() {
  try {
    // 获取工作项查询结果
    const workItems = Array.from(document.querySelectorAll('.grid-row'));
    const workItemsData = workItems.map(row => {
      const cells = row.querySelectorAll('.grid-cell');
      return {
        id: cells[0]?.textContent?.trim() || '',
        title: cells[1]?.textContent?.trim() || '',
        state: cells[2]?.textContent?.trim() || '',
        assignedTo: cells[3]?.textContent?.trim() || ''
      };
    }).filter(item => item.id !== '');

    // 获取查询标题
    const queryTitle = document.querySelector('.hub-title')?.textContent?.trim() || '未命名查询';

    // 检查登录状态并更新浮窗显示
    chrome.storage.local.get(['token'], (result) => {
      const desMode = document.getElementById('des-mode');
      if (result.token && desMode) {
        desMode.style.display = 'block';
        // 发送数据到popup和sidepanel
        chrome.runtime.sendMessage({
          type: 'workItemsData',
          data: {
            title: queryTitle,
            items: workItemsData
          }
        }, (response) => {
          // 确保消息得到响应
          if (chrome.runtime.lastError) {
            console.error('消息发送错误:', chrome.runtime.lastError);
          }
          return true; // 显式返回以保持消息通道
        });
      } else if (desMode) {
        desMode.style.display = 'none';
      }
    });
  } catch (error) {
    console.error('解析页面数据时出错:', error);
    chrome.runtime.sendMessage({
      type: 'error',
      message: '解析页面数据时出错'
    });
  }
}

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getWorkItems') {
    checkPageContent();
  }
  return true;
});