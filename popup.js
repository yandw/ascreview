// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
  // 请求content script获取数据
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {type: 'getWorkItems'});
    }
  });
});

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const contentDiv = document.getElementById('content');

  if (message.type === 'workItemsData') {
    const {title, items} = message.data;
    
    // 清空加载提示
    contentDiv.innerHTML = '';
    
    // 添加查询标题
    const titleDiv = document.createElement('div');
    titleDiv.className = 'item';
    titleDiv.innerHTML = `
      <div class="item-title">查询名称</div>
      <div class="item-content">${title}</div>
    `;
    contentDiv.appendChild(titleDiv);

    // 添加工作项列表
    items.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'item';
      itemDiv.innerHTML = `
        <div class="item-title">${item.id} - ${item.title}</div>
        <div class="item-content">
          状态: ${item.state}<br>
          负责人: ${item.assignedTo}
        </div>
      `;
      contentDiv.appendChild(itemDiv);
    });

    if (items.length === 0) {
      contentDiv.innerHTML = '<div class="error">未找到工作项数据</div>';
    }
  } else if (message.type === 'error') {
    contentDiv.innerHTML = `<div class="error">${message.message}</div>`;
  }
});