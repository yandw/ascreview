// 监听页面加载完成事件
document.addEventListener('DOMContentLoaded', () => {
  // 定期检查页面内容
  setInterval(checkPageContent, 2000);
});

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

    // 发送数据到popup
    chrome.runtime.sendMessage({
      type: 'workItemsData',
      data: {
        title: queryTitle,
        items: workItemsData
      }
    });
  } catch (error) {
    console.error('Error extracting work items data:', error);
    chrome.runtime.sendMessage({
      type: 'error',
      message: '数据提取失败：' + error.message
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