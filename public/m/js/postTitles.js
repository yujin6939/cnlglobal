const postTitles = {
    "notice_202505": {
      ko: "[공지] 2025년 5월 휴무 안내",
      en: "[Notice] May 2025 Holiday Schedule",
      zh: "[通知] 2025年5月放假通知"
    },
    "notice_202506": {
      ko: "[공지] 6월 시스템 점검 안내",
      en: "[Notice] June System Maintenance",
      zh: "[通知] 六月系统维护公告"
    }
  };
  
  window.getPostTitle = function(id, lang = 'ko') {
    lang = lang.toLowerCase(); // ✅ 안정성 강화
    return postTitles[id]?.[lang] || postTitles[id]?.ko || "제목 없음";
  };
  