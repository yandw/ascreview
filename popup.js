document.getElementById('openSidePanel').addEventListener('click', async () => {
  if (chrome.sidePanel) {
    try {
      await chrome.sidePanel.open();
    } catch (error) {
      console.error('打开侧边栏时出错:', error);
    }
  }
  window.close();
});