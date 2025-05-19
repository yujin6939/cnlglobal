 const postDetails = {
    "notice_202505": {
      ko: {
        date: "2025년 4월 29일",
        author: "C&L Global",
        content: `
          <p>안녕하세요, 고객 여러분.</p>
          <p>2025년 5월 가정의 달을 맞아 아래와 같이 휴무 일정을 안내드립니다.</p>
          <ul>
            <li><strong>5월 1일 (수)</strong> - 근로자의 날</li>
            <li><strong>5월 5일 (월)</strong> - 어린이날 대체휴무</li>
            <li><strong>5월 15일 (목)</strong> - 석가탄신일</li>
          </ul>
          <p>해당 기간 동안 고객센터 및 출고 업무가 중단되며, 물류 일정에 참고 부탁드립니다.</p>
          <p>휴무 기간 전후로는 물동량 증가로 인한 배송 지연이 예상되오니, 여유 있는 일정으로 사전 출고를 부탁드립니다.</p>
          <p>감사합니다.</p>
        `
      },
      en: {
        date: "April 29, 2025",
        author: "C&L Global",
        content: `
          <p>Dear Valued Customers,</p>
          <p>We would like to inform you of the holiday schedule for May 2025:</p>
          <ul>
            <li><strong>May 1 (Wed)</strong> – Labor Day</li>
            <li><strong>May 5 (Mon)</strong> – Substitute Holiday for Children's Day</li>
            <li><strong>May 15 (Thu)</strong> – Buddha’s Birthday</li>
          </ul>
          <p>Our customer service and warehouse operations will be closed during these dates.<br>Please take this into account when planning your logistics.</p>
          <p>Delays may occur before and after the holiday due to increased shipment volume.<br>We recommend arranging your shipments early.</p>
          <p>Thank you.</p>
        `
      },
      zh: {
        date: "2025年4月29日",
        author: "C&L Global",
        content: `
          <p>尊敬的客户，您好：</p>
          <p>我们将于2025年5月放假，具体安排如下：</p>
          <ul>
            <li><strong>5月1日（周三）</strong> - 劳动节</li>
            <li><strong>5月5日（周一）</strong> - 儿童节补假</li>
            <li><strong>5月15日（周四）</strong> - 佛诞日</li>
          </ul>
          <p>假期期间客服与出库业务将暂停，请您提前安排出货计划。</p>
          <p>由于节前节后货量增加，可能出现配送延迟，建议您预留时间并尽早安排出货。</p>
          <p>感谢您的理解与支持！</p>
        `
      }
    }
  };
  
  window.renderPostDetail = function(id) {
    const lang = (localStorage.getItem('siteLanguage') || 'ko').toLowerCase();
    const post = postDetails[id]?.[lang] || postDetails[id]?.ko;
    window.currentPostId = id;  // 전역으로 현재 글 ID 저장
    const title = getPostTitle(id, lang); // 🎯 별도 파일에서 lang별 제목 가져오기
  
    if (!post) return;
  
    document.getElementById("notice-list").style.display = "none";
    document.getElementById("pagination").style.display = "none";
  
    const detailContainer = document.createElement("div");
    detailContainer.className = "post-detail";
    detailContainer.innerHTML = `
      <div class="post-card">
        <h2 class="post-title"><i class="fas fa-bullhorn"></i> ${title}</h2>
        <div class="post-meta">
          <span><i class="far fa-calendar-alt"></i> ${post.date}</span>
          <span><i class="far fa-user"></i> ${post.author}</span>
        </div>
        <div class="post-content">
          ${post.content}
        </div>
        <a href="#" class="back-link">&larr; ${
          lang === 'ko' ? '목록으로 돌아가기' :
          lang === 'en' ? 'Back to list' :
          '返回列表'
        }</a>
      </div>
    `;
  
    const mainContainer = document.querySelector(".notice-list").parentElement;
    mainContainer.appendChild(detailContainer);
  
    detailContainer.querySelector(".back-link").addEventListener("click", (e) => {
      e.preventDefault();
      detailContainer.remove();
      document.getElementById("notice-list").style.display = "block";
      document.getElementById("pagination").style.display = "block";
    });
  };
  