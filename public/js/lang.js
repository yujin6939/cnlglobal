// 언어 변경 함수
function setLanguage(lang) {
  lang = lang.toLowerCase();
  localStorage.setItem('siteLanguage', lang);
  document.documentElement.setAttribute('lang', lang);

  const isNoticePage = location.pathname.includes('공지사항.html');
  const isNewsletterPage = location.pathname.includes('뉴스레터.html');
  const isInfoPage = location.pathname.includes('information.html');

  if (isNoticePage && !localStorage.getItem('justReloaded')) {
    localStorage.setItem('justReloaded', 'true'); // 새로고침 플래그
    location.reload();
    return;
  }

  localStorage.removeItem('justReloaded');

  // 텍스트 적용
  updateLanguage();

  // 게시글 영역 렌더링
  if (isNoticePage && typeof renderPostsFromServer === 'function') {
    renderPostsFromServer(1);
  }
  if (isNewsletterPage && typeof loadNewsletters === 'function') {
    loadNewsletters();
  }
  if (isInfoPage && typeof renderResourcesFromServer === 'function') {
    renderResourcesFromServer(1);
  }

  // 단일 게시글 열려있는 경우 다시 표시
  if (window.currentPostId && typeof renderPostDetail === 'function') {
    document.querySelector('.post-detail')?.remove();
    renderPostDetail(window.currentPostId);
  }

  // toTop 버튼 다국어
  const toTopBtn = document.getElementById('toTopBtn');
  if (toTopBtn) {
    const title = toTopBtn.getAttribute(`data-${lang}-title`);
    const label = toTopBtn.getAttribute(`data-${lang}-label`);
    if (title) toTopBtn.setAttribute('title', title);
    if (label) toTopBtn.setAttribute('aria-label', label);
  }

  // 추가 UI 요소 업데이트
  renderEdgeBoxes?.(lang);
  updateUILanguage?.();
}

// 텍스트 다국어 적용
function updateLanguage() {
  const lang = (localStorage.getItem('siteLanguage') || 'ko').toLowerCase();
  document.documentElement.setAttribute('lang', lang);

  document.querySelectorAll('[data-ko]').forEach(el => {
    const value = el.getAttribute(`data-${lang}`);
    if (value !== null) {
      if (el.classList.contains('accordion-toggle')) {
        const icon = el.querySelector('i');
        el.textContent = value;
        if (icon) el.appendChild(icon);
      } else {
        el.innerHTML = value;
      }
    }
  });
}

// 초기 적용
window.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('siteLanguage') || 'ko';
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
