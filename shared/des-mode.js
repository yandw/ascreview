// DES Mode共享功能模块

// 初始化DES Mode按钮事件
export function initDesMode() {
  const editButton = document.getElementById('edit-button');
  const generateButton = document.getElementById('generate-button');
  const executeButton = document.getElementById('execute-button');

  if (editButton) {
    editButton.addEventListener('click', () => {
      const inputs = document.querySelectorAll('.field-input:not(#ai-gen), .field-select');
      inputs.forEach(input => input.disabled = false);
    });
  }

  if (generateButton) {
    generateButton.addEventListener('click', () => {
      const aiGen = document.getElementById('ai-gen');
      if (aiGen) {
        aiGen.value = '正在生成AI建议...';
      }
    });
  }

  if (executeButton) {
    executeButton.addEventListener('click', () => {
      const config = {
        featureCrew: document.getElementById('feature-crew')?.value,
        issue: document.getElementById('issue')?.value,
        owner: document.getElementById('owner')?.value,
        rootCause: document.getElementById('root-cause')?.value,
        state: document.getElementById('state')?.value,
        priority: document.getElementById('priority')?.value
      };
      console.log('执行配置:', config);
    });
  }

  // 初始禁用所有输入字段
  const inputs = document.querySelectorAll('.field-input:not(#ai-gen), .field-select');
  inputs.forEach(input => input.disabled = true);
}

// 创建DES Mode浮窗
export function createDesMode() {
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