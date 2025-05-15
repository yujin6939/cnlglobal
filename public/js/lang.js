// 언어 변경 함수
function setLanguage(lang) {
  lang = lang.toLowerCase();
  localStorage.setItem('siteLanguage', lang);
  document.documentElement.setAttribute('lang', lang);

  const isNoticePage = location.pathname.includes('공지사항.html');

  if (isNoticePage && !localStorage.getItem('justReloaded')) {
    localStorage.setItem('justReloaded', 'true'); // 새로고침 플래그 설정
    location.reload(); // 새로고침 1번 실행
    return; // 이후 코드 실행 안 함
  }

  // 새로고침 이후에는 플래그 제거
  localStorage.removeItem('justReloaded');

  // 언어 텍스트 갱신
  updateLanguage();

  // 공지사항 페이지면 게시글 다시 렌더링
  if (isNoticePage && typeof renderPostsFromServer === 'function') {
    renderPostsFromServer(1);
  }

  // 다른 페이지 전용 게시글 렌더링 함수
  if (typeof renderPosts === 'function') {
    renderPosts(1);
  }

  // 현재 열려 있는 게시글 다시 그리기
  if (window.currentPostId && typeof renderPostDetail === 'function') {
    document.querySelector('.post-detail')?.remove();
    renderPostDetail(window.currentPostId);
  }

  // toTop 버튼 접근성 텍스트 갱신
  const toTopBtn = document.getElementById('toTopBtn');
  if (toTopBtn) {
    const title = toTopBtn.getAttribute(`data-${lang}-title`);
    const label = toTopBtn.getAttribute(`data-${lang}-label`);
    if (title) toTopBtn.setAttribute('title', title);
    if (label) toTopBtn.setAttribute('aria-label', label);
  }

  renderEdgeBoxes(lang);
}


// 언어 적용 함수
function updateLanguage() {
  const lang = (localStorage.getItem('siteLanguage') || 'ko').toLowerCase();
  document.documentElement.setAttribute('lang', lang);

  document.querySelectorAll('[data-ko]').forEach(el => {
    const value = el.getAttribute(`data-${lang}`);
    if (value !== null) {
      // ⭐ 아이콘 보존이 필요한 버튼 처리
      if (el.classList.contains('accordion-toggle')) {
        const icon = el.querySelector('i'); // 기존 아이콘 분리
        el.textContent = value;             // 텍스트만 변경
        if (icon) el.appendChild(icon);     // 아이콘 다시 삽입
      } else {
        el.innerHTML = value; // 일반 텍스트 요소는 그대로 innerHTML 사용
      }
    }
  });
}



// 초기 언어 적용
window.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('siteLanguage') || 'ko';

  // ✅ justReloaded 플래그는 새로고침 이후 제거
  localStorage.removeItem('justReloaded');

  setLanguage(savedLang);
  renderPagination?.();
});


// 언어 드롭다운 토글
document.addEventListener('DOMContentLoaded', () => {
  const langDropdown = document.querySelector('.lang-dropdown');
  const langBtn = document.querySelector('.lang-btn');

  if (langDropdown && langBtn) {
    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      langDropdown.classList.toggle('open');
    });

    window.addEventListener('click', function () {
      langDropdown.classList.remove('open');
    });
  }
});
