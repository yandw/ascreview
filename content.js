document.addEventListener('DOMContentLoaded', function() {
  // 检查是否在工作项页面
  if (window.location.href.includes('msasg.visualstudio.com') && window.location.href.includes('_queries/edit')) {
    console.log('在工作项查询页面中');
    
    // 监听页面变化
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          processWorkItems();
        }
      });
    });

    // 配置观察选项
    const config = { childList: true, subtree: true };
    
    // 开始观察文档中的变化
    observer.observe(document.body, config);
    
    // 初始处理
    processWorkItems();
  }
});

function processWorkItems() {
  // 查找工作项列表
  const workItems = document.querySelectorAll('.grid-row');
  
  workItems.forEach(function(item) {
    // 获取工作项数据
    const workItemData = {
      id: item.querySelector('.id-field')?.textContent,
      title: item.querySelector('.title-field')?.textContent,
      state: item.querySelector('.state-field')?.textContent
    };
    
    // 发送数据到background script
    chrome.runtime.sendMessage({
      type: 'getWorkItemData',
      data: workItemData
    });
  });
}