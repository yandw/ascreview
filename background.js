chrome.runtime.onInstalled.addListener(function() {
  console.log('Azure DevOps Work Item Helper 已安装');
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === 'getWorkItemData') {
      // 处理工作项数据请求
      sendResponse({status: 'success'});
    }
    return true;
  }
);