document.getElementById('scrapeButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: scrapeComments 
    });
  });
});

function scrapeComments() {
  console.log("Scraping comments...");

  const comments = [];
  const commentElements = document.querySelectorAll('.we-customer-review');

  commentElements.forEach(commentElement => {
    const ratingElement = commentElement.querySelector('.we-customer-review__rating');
    const rating = ratingElement ? parseFloat(ratingElement.getAttribute('aria-label').trim()[0]) : 0; // 直接取去除首尾空格后的第一个字符值为rating值
    const nicknameElement = commentElement.querySelector('.we-customer-review__user');
    const nickname = nicknameElement ? nicknameElement.textContent.trim() : '';
    const titleElement = commentElement.querySelector('.we-customer-review__title');
    const title = titleElement ? titleElement.textContent.trim() : '';
    const bodyElement = commentElement.querySelector('.we-customer-review__body');
    const body = bodyElement ? bodyElement.textContent.trim() : '';

    const comment = { rating, nickname, title, body };
    comments.push(comment);
  });

  // 发送每条评论到本地的ollama接口
  // sendCommentToOllama(comment);

  console.log("Comments scraped:", comments);

  // 将 displayComments 的逻辑直接嵌入到 scrapeComments 中
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '10px';
  container.style.right = '10px';
  container.style.backgroundColor = 'white';
  container.style.border = '1px solid #ccc';
  container.style.padding = '10px';
  container.style.zIndex = '10000';

  // 添加关闭按钮
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '5px';
  closeButton.style.right = '5px';
  closeButton.style.cursor = 'pointer';
  closeButton.addEventListener('click', () => {
    document.body.removeChild(container);
  });
  container.appendChild(closeButton);

  comments.forEach(comment => {
    const commentDiv = document.createElement('div');
    commentDiv.innerHTML = `
      <strong>Rating:</strong> ${comment.rating}<br>
      <strong>Nickname:</strong> ${comment.nickname}<br>
      <strong>Title:</strong> ${comment.title}<br>
      <strong>Body:</strong> ${comment.body}<br><br>
    `;
    container.appendChild(commentDiv);
  });

  document.body.appendChild(container);
}
