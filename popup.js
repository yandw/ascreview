// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
  // 添加打开侧边栏按钮的点击事件
  document.getElementById('open-sidepanel').addEventListener('click', async () => {
    try {
      if (chrome.sidePanel) {
        await chrome.sidePanel.open();
      } else {
        console.error('Side panel API not available');
      }
    } catch (error) {
      console.error('Error opening side panel:', error);
    }
  });
});