console.log("Content script loaded");

function scrapeComments() {
  console.log("Scraping comments...");

  const comments = [];
  const commentElements = document.querySelectorAll('.we-customer-review');

  commentElements.forEach(commentElement => {
    const ratingElement = commentElement.querySelector('.we-customer-review__rating');
    const rating = ratingElement ? ratingElement.getAttribute('aria-label').trim() : '';
    const nicknameElement = commentElement.querySelector('.we-customer-review__author__name');
    const nickname = nicknameElement ? nicknameElement.textContent.trim() : '';
    const titleElement = commentElement.querySelector('.we-customer-review__title');
    const title = titleElement ? titleElement.textContent.trim() : '';
    const bodyElement = commentElement.querySelector('.we-customer-review__body');
    const body = bodyElement ? bodyElement.textContent.trim() : '';

    comments.push({ rating, nickname, title, body });
  });

  console.log("Comments scraped:", comments);

  displayComments(comments);
}

function displayComments(comments) {
  console.log("Displaying comments...");

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

