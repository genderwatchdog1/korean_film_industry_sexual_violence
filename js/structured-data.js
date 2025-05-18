/**
 * structured-data.js
 * Contains JSON-LD structured data for SEO across all language versions
 */

// Create and inject the JSON-LD structured data into the page
function injectStructuredData() {
  // Determine if we're on a blog post page or a timeline page
  const isBlogPost = window.location.pathname.includes('/blog_posts/');
  
  // Get the language from the HTML lang attribute or from the URL path
  let language = document.documentElement.lang || 'en';
  
  if (isBlogPost) {
    // For blog posts, extract language from URL structure: /blog_posts/en/...
    const pathParts = window.location.pathname.split('/');
    const langIndex = pathParts.indexOf('blog_posts') + 1;
    if (langIndex < pathParts.length) {
      language = pathParts[langIndex];
    }
    
    // For zh_ch and zh_tw, convert to proper format
    if (language === 'zh_ch') language = 'zh-CN';
    if (language === 'zh_tw') language = 'zh-TW';
    
    // Inject blog post specific structured data
    injectBlogPostStructuredData(language);
  } else {
    // For timeline pages
    if (window.location.pathname.includes('_zh_cn')) language = 'zh-CN';
    if (window.location.pathname.includes('_zh_tw')) language = 'zh-TW';
    if (window.location.pathname.includes('_ko')) language = 'ko';
    if (window.location.pathname.includes('_ja')) language = 'ja';
    
    // Inject timeline structured data
    injectTimelineStructuredData(language);
    
    // Also inject blog posts collection structured data on timeline pages
    injectBlogPostsStructuredData(language);
  }
}

// Inject structured data for a single blog post
function injectBlogPostStructuredData(language) {
  // Extract blog post data from the page
  const title = document.title || '';
  const description = document.querySelector('meta[name="description"]')?.content || '';
  const datePublished = document.querySelector('time')?.getAttribute('datetime') || '2025-04-01';
  const url = window.location.href;
  
  const blogPostStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "inLanguage": getLanguageCode(language),
    "datePublished": datePublished,
    "url": url,
    "author": {
      "@type": "Organization",
      "name": "Gender Watchdog"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Gender Watchdog",
      "logo": {
        "@type": "ImageObject",
        "url": "https://genderwatchdog.org/imgs/gender-watchdog-icon-04142025.png"
      }
    }
  };
  
  injectJSONLD(blogPostStructuredData, 'blog-post-structured-data');
}

// Inject structured data for the timeline
function injectTimelineStructuredData(language) {
  const timelineEvents = getTimelineEvents(language);
  
  const timelineStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": getTimelineTitle(language),
    "description": getTimelineDescription(language),
    "itemListOrder": "https://schema.org/ItemListOrderDescending",
    "numberOfItems": timelineEvents.length,
    "itemListElement": timelineEvents.map((event, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Event",
        "name": event.name,
        "description": event.description,
        "startDate": event.date,
        "location": event.location || {
          "@type": "Place",
          "name": "South Korea"
        }
      }
    }))
  };
  
  injectJSONLD(timelineStructuredData, 'timeline-structured-data');
}

// Inject structured data for blog posts
function injectBlogPostsStructuredData(language) {
  const blogPosts = getBlogPosts(language);
  
  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "headline": getBlogCollectionTitle(language),
    "description": getBlogCollectionDescription(language),
    "inLanguage": getLanguageCode(language),
    "mainEntity": {
      "@type": "ItemList",
      "itemListOrder": "https://schema.org/ItemListOrderDescending",
      "numberOfItems": blogPosts.length,
      "itemListElement": blogPosts.map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Article",
          "headline": post.title,
          "description": post.description,
          "inLanguage": getLanguageCode(language),
          "datePublished": post.datePublished,
          "url": post.url,
          "author": {
            "@type": "Organization",
            "name": "Gender Watchdog"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Gender Watchdog",
            "logo": {
              "@type": "ImageObject",
              "url": "https://genderwatchdog.org/imgs/gender-watchdog-icon-04142025.png"
            }
          }
        }
      }))
    }
  };
  
  injectJSONLD(blogStructuredData, 'blog-structured-data');
}

// Helper function to insert JSON-LD into the page
function injectJSONLD(structuredData, id) {
  // Remove existing script if any
  const existingScript = document.getElementById(id);
  if (existingScript) {
    existingScript.remove();
  }
  
  // Create and append the new script element
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

// Helper function to get timeline title based on language
function getTimelineTitle(language) {
  const titles = {
    'en': "Timeline of Systemic Sexual Violence, Institutional Betrayal, and Industry Accountability in Korean Film Schools (2008-2025)",
    'ja': "韓国映画学校における組織的性暴力・制度的裏切り・業界責任の時系列（2008年～2025年）",
    'ko': "한국 영화학교의 조직적 성폭력, 제도적 배신, 산업 책임 타임라인 (2008-2025)",
    'zh-CN': "韩国电影学院系统性性暴力、制度性背叛与行业问责时间线（2008-2025）",
    'zh-TW': "韓國電影學校系統性性暴力、制度性背叛與產業問責時間線（2008-2025）"
  };
  return titles[language] || titles['en'];
}

// Helper function to get timeline description based on language
function getTimelineDescription(language) {
  const descriptions = {
    'en': "A decade of sexual violence, institutional betrayal, and public funds fraud across Korea's leading film schools and their industry partners. The timeline documents both horizontal escalation (across universities) and vertical escalation (to industry/Netflix accountability).",
    'ja': '韓国の主要映画学校および業界パートナーにおける10年以上の性暴力、制度的裏切り、公的資金詐欺の記録。大学間の水平的拡大と業界・Netflixへの垂直的拡大を両方記録。',
    'ko': '한국 주요 영화학교와 산업 파트너에서 10년 넘게 이어진 성폭력, 제도적 배신, 공적 자금 사기의 기록. 대학 간 수평적 확장과 산업/넷플릭스 책임으로의 수직적 확장을 모두 문서화.',
    'zh-CN': '韩国主要电影学院及其行业合作方十余年间的性暴力、制度性背叛与公款欺诈记录。涵盖大学间的横向扩展与行业/Netflix责任的纵向升级。',
    'zh-TW': '韓國主要電影學校及其產業合作夥伴十餘年間的性暴力、制度性背叛與公款詐欺記錄。涵蓋大學間的橫向擴展與產業/Netflix責任的縱向升級。'
  };
  return descriptions[language] || descriptions['en'];
}

// Helper function to get blog collection title based on language
function getBlogCollectionTitle(language) {
  const titles = {
    'en': 'Articles on Systemic Sexual Violence and Industry Accountability in Korean Film Schools',
    'ja': '韓国映画学校の組織的性暴力と業界責任に関する記事',
    'ko': '한국 영화학교의 조직적 성폭력 및 산업 책임 관련 기사',
    'zh-CN': '关于韩国电影学院系统性性暴力与行业问责的文章',
    'zh-TW': '關於韓國電影學校系統性性暴力與產業問責的文章'
  };
  return titles[language] || titles['en'];
}

// Helper function to get blog collection description based on language
function getBlogCollectionDescription(language) {
  const descriptions = {
    'en': 'Collection of articles documenting sexual violence, institutional betrayal, and the bridge to industry accountability (Netflix, content partners) in Korean film schools.',
    'ja': '韓国映画学校における性暴力、制度的裏切り、業界責任への橋渡しを記録した記事のコレクション。',
    'ko': '한국 영화학교의 성폭력, 제도적 배신, 산업 책임(넷플릭스, 콘텐츠 파트너)으로의 연결을 기록한 기사 모음.',
    'zh-CN': '记录韩国电影学院性暴力、制度性背叛及行业问责（Netflix、内容合作方）的文章集。',
    'zh-TW': '記錄韓國電影學校性暴力、制度性背叛及產業問責（Netflix、內容合作夥伴）的文章集。'
  };
  return descriptions[language] || descriptions['en'];
}

// Helper function to get appropriate language code
function getLanguageCode(language) {
  const languageCodes = {
    'en': 'en-US',
    'ja': 'ja-JP',
    'ko': 'ko-KR',
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-TW'
  };
  return languageCodes[language] || 'en-US';
}

// Define timeline events based on language
function getTimelineEvents(language) {
  // Only include the two most recent events in all languages
  const events = {
    'en': [
      {
        name: "First Outreach to Netflix & Netflix Korea (Vertical Escalation)",
        description: "Gender Watchdog formally notifies Netflix and Netflix Korea of systemic sexual violence risks in Korean film schools and the urgent need for robust sexual violence reporting and prevention mechanisms at all Korean content partners. This marks the vertical escalation from exposing university-level failures to demanding industry accountability—especially for global platforms like Netflix, which has invested $2.5 billion USD in Korean content. The outreach highlights Title IX, ESG, and reputational risks for Netflix and calls for comprehensive audits and enforceable partner standards.",
        date: "2025-05-07",
        location: { "@type": "Place", "name": "Seoul, South Korea" }
      },
      {
        name: "IEQAS Certification Crisis Exposé (Horizontal & Vertical Escalation)",
        description: "The investigation expands horizontally to multiple Korean universities, revealing that sexual violence is a systemic, cross-campus crisis enabled by institutional betrayal and government inaction. Vertically, the exposé connects these failures to industry and international partners, showing how the lack of robust sexual violence prevention/reporting in universities creates Title IX, ESG, and reputational risks for global content platforms like Netflix. The exposé calls for urgent reform in both academia and industry.",
        date: "2025-05-12",
        location: { "@type": "Place", "name": "South Korea" }
      }
    ],
    'ja': [
      {
        name: "Netflix・Netflix Koreaへの初回通報（垂直エスカレーション）",
        description: "Gender Watchdogは韓国映画学校における組織的な性暴力リスクと、すべての韓国コンテンツパートナーに対する強力な性暴力報告・防止体制の緊急必要性について、NetflixおよびNetflix Koreaに正式に通知。これは大学レベルの失敗を暴露する段階から、Netflixのようなグローバルプラットフォームに産業責任を求める垂直エスカレーションの始まり。Title IX、ESG、評判リスクを強調し、包括的な監査と強制力ある基準を要求。",
        date: "2025-05-07",
        location: { "@type": "Place", "name": "ソウル（韓国）" }
      },
      {
        name: "IEQAS認証危機の暴露（水平・垂直エスカレーション）",
        description: "調査は複数の韓国大学に水平展開し、性暴力が制度的裏切りと政府の無策によって助長されるシステミックな危機であることを明らかに。垂直的には、これらの失敗が産業界や国際パートナーに波及し、大学での性暴力防止・報告体制の欠如がNetflixのようなグローバルコンテンツプラットフォームにTitle IX、ESG、評判リスクをもたらすことを示す。学界と産業界の両方で緊急改革を要求。",
        date: "2025-05-12",
        location: { "@type": "Place", "name": "韓国" }
      }
    ],
    'ko': [
      {
        name: "넷플릭스 및 넷플릭스 코리아 최초 통보 (수직적 확장)",
        description: "Gender Watchdog는 한국 영화학교의 조직적 성폭력 위험과 모든 한국 콘텐츠 파트너에 대한 강력한 성폭력 보고 및 예방 체계의 시급한 필요성을 넷플릭스와 넷플릭스 코리아에 공식적으로 알림. 이는 대학 수준의 실패를 폭로하는 단계에서, 넷플릭스와 같은 글로벌 플랫폼에 산업 책임을 요구하는 수직적 확장의 시작. Title IX, ESG, 평판 리스크를 강조하며, 포괄적 감사와 강제력 있는 기준을 요구.",
        date: "2025-05-07",
        location: { "@type": "Place", "name": "서울, 대한민국" }
      },
      {
        name: "IEQAS 인증 위기 폭로 (수평 및 수직 확장)",
        description: "조사는 여러 한국 대학으로 수평적으로 확장되어, 성폭력이 제도적 배신과 정부의 무대응에 의해 조장되는 체계적 위기임을 밝힘. 수직적으로는 이러한 실패가 산업 및 국제 파트너로 연결되어, 대학의 성폭력 예방/보고 체계 부재가 넷플릭스와 같은 글로벌 콘텐츠 플랫폼에 Title IX, ESG, 평판 리스크를 초래함을 보여줌. 학계와 산업계 모두에 긴급 개혁을 촉구.",
        date: "2025-05-12",
        location: { "@type": "Place", "name": "대한민국" }
      }
    ],
    'zh-CN': [
      {
        name: "首次通报Netflix及Netflix Korea（纵向升级）",
        description: "Gender Watchdog正式通知Netflix及Netflix Korea，指出韩国电影学院系统性性暴力风险，以及所有韩国内容合作方急需建立强有力的性暴力报告和预防机制。这标志着从揭露大学层面失职到要求产业问责的纵向升级，尤其针对在韩投资25亿美元的Netflix。通报强调Title IX、ESG及声誉风险，并呼吁全面审计和可执行的合作标准。",
        date: "2025-05-07",
        location: { "@type": "Place", "name": "首尔，韩国" }
      },
      {
        name: "IEQAS认证危机揭露（横向与纵向升级）",
        description: "调查横向扩展至多所韩国大学，揭示性暴力是由制度性背叛和政府不作为助长的系统性危机。纵向上，揭露将这些失败与产业及国际合作方联系起来，说明大学缺乏强有力的性暴力预防/报告机制如何为Netflix等全球内容平台带来Title IX、ESG和声誉风险。呼吁学界与产业界紧急改革。",
        date: "2025-05-12",
        location: { "@type": "Place", "name": "韩国" }
      }
    ],
    'zh-TW': [
      {
        name: "首次通報Netflix及Netflix Korea（縱向升級）",
        description: "Gender Watchdog正式通知Netflix及Netflix Korea，指出韓國電影學校系統性性暴力風險，以及所有韓國內容合作夥伴急需建立強有力的性暴力通報與預防機制。這標誌著從揭露大學層級失職到要求產業問責的縱向升級，尤其針對在韓投資25億美元的Netflix。通報強調Title IX、ESG及聲譽風險，並呼籲全面審計與可執行的合作標準。",
        date: "2025-05-07",
        location: { "@type": "Place", "name": "首爾，韓國" }
      },
      {
        name: "IEQAS認證危機揭露（橫向與縱向升級）",
        description: "調查橫向擴展至多所韓國大學，揭示性暴力是由制度性背叛與政府不作為助長的系統性危機。縱向上，揭露將這些失敗與產業及國際合作夥伴聯繫起來，說明大學缺乏強有力的性暴力預防/通報機制如何為Netflix等全球內容平台帶來Title IX、ESG和聲譽風險。呼籲學界與產業界緊急改革。",
        date: "2025-05-12",
        location: { "@type": "Place", "name": "韓國" }
      }
    ]
  };
  return events[language] || events['en'];
}

// Define blog posts based on language
function getBlogPosts(language) {
  // Base URL for blog posts
  const baseUrl = 'https://genderwatchdog.org/blog_posts/';
  // Language path mapping
  const langPath = language === 'zh-CN' ? 'zh_ch' : 
                  language === 'zh-TW' ? 'zh_tw' : 
                  language === 'en' ? 'en' : 
                  language === 'ja' ? 'ja' : 
                  language === 'ko' ? 'ko' : 'en';
  // Blog post data for the two main posts
  const postData = [
    {
      id: '05072025_netflix_outreach',
      datePublished: "2025-05-07",
      titles: {
        'en': "First Outreach to Netflix & Netflix Korea: Demanding Industry Accountability for Sexual Violence in Korean Film Schools",
        'ja': "Netflix・Netflix Koreaへの初回通報：韓国映画学校の性暴力に対する業界責任を問う",
        'ko': "넷플릭스 및 넷플릭스 코리아 최초 통보: 한국 영화학교 성폭력에 대한 산업 책임 요구",
        'zh-CN': "首次通报Netflix及Netflix Korea：要求对韩国电影学院性暴力承担行业责任",
        'zh-TW': "首次通報Netflix及Netflix Korea：要求對韓國電影學校性暴力承擔產業責任"
      },
      descriptions: {
        'en': "Formal notification to Netflix and Netflix Korea about systemic sexual violence, institutional betrayal, and the urgent need for enforceable reporting and prevention standards across all Korean content partners.",
        'ja': "NetflixおよびNetflix Koreaに対し、組織的性暴力、制度的裏切り、すべての韓国コンテンツパートナーにおける強制力ある報告・防止基準の緊急必要性を正式に通知。",
        'ko': "넷플릭스 및 넷플릭스 코리아에 한국 영화학교의 조직적 성폭력, 제도적 배신, 모든 콘텐츠 파트너에 대한 강제력 있는 보고 및 예방 기준의 시급성을 공식 통보.",
        'zh-CN': "正式通知Netflix及Netflix Korea，关于韩国电影学院系统性性暴力、制度性背叛，以及所有内容合作方急需可执行的报告和预防标准。",
        'zh-TW': "正式通知Netflix及Netflix Korea，關於韓國電影學校系統性性暴力、制度性背叛，以及所有內容合作夥伴急需可執行的通報與預防標準。"
      }
    },
    {
      id: '05152025_horizontal_ieqas',
      datePublished: "2025-05-12",
      titles: {
        'en': "IEQAS Certification Crisis Exposé: Systemic Sexual Violence and Industry Risk in Korean Film Schools",
        'ja': "IEQAS認証危機の暴露：韓国映画学校の組織的性暴力と業界リスク",
        'ko': "IEQAS 인증 위기 폭로: 한국 영화학교의 조직적 성폭력 및 산업 리스크",
        'zh-CN': "IEQAS认证危机揭露：韩国电影学院系统性性暴力与行业风险",
        'zh-TW': "IEQAS認證危機揭露：韓國電影學校系統性性暴力與產業風險"
      },
      descriptions: {
        'en': "Exposé revealing the horizontal spread of sexual violence and institutional betrayal across major Korean film schools, and the vertical escalation to industry and global partners like Netflix.",
        'ja': "主要な韓国映画学校における性暴力と制度的裏切りの水平的拡大、およびNetflixなど産業・グローバルパートナーへの垂直的エスカレーションを明らかにする暴露記事。",
        'ko': "주요 한국 영화학교에서의 성폭력과 제도적 배신의 수평적 확산, 그리고 넷플릭스 등 산업 및 글로벌 파트너로의 수직적 확장을 밝히는 폭로 기사.",
        'zh-CN': "揭露韩国主要电影学院性暴力和制度性背叛的横向扩展，以及向Netflix等产业和全球合作方的纵向升级。",
        'zh-TW': "揭露韓國主要電影學校性暴力與制度性背叛的橫向擴展，以及向Netflix等產業與全球合作夥伴的縱向升級。"
      }
    }
  ];
  // Transform the data into the format needed for structured data
  return postData.map(post => ({
    title: post.titles[language] || post.titles['en'],
    description: post.descriptions[language] || post.descriptions['en'],
    datePublished: post.datePublished,
    url: `${baseUrl}${langPath}/${post.id}.html`
  }));
}

// Run the injection when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', injectStructuredData); 