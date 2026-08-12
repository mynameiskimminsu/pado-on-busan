(function () {
  "use strict";

  var STORAGE_BOOKINGS = "oronaminSea.bookings.v2";
  var STORAGE_WALLET = "oronaminSea.wallet.v2";
  var STORAGE_STORIES = "oronaminSea.stories.v1";
  var LEGACY_BOOKINGS = "padoOn.bookings.v1";
  var LEGACY_WALLET = "padoOn.wallet.v1";
  var selectedEventId = null;
  var bookingQty = 1;
  var activeSeasonFilter = "all";
  var storyImageData = "";
  var storyImageRequest = 0;
  var editingStoryId = null;
  var toastTimer = null;

  var seasons = {
    spring: {
      ko: "봄",
      en: "SPRING",
      kicker: "MUD & PLAY",
      title: "갯벌에서 시작하는<br><em>활기찬 봄</em>",
      description: "바지락을 캐고 갯벌 게임을 즐기며 부산의 생태를 가까이 만나보세요.",
      tags: ["바지락 캐기", "갯벌 게임", "바다생태"],
      image: "assets/spring-clam-game.png",
      alt: "다대포 갯벌에서 바지락을 캐고 게임을 즐기는 여행자들",
      caption: "DADAEPO · BUSAN"
    },
    summer: {
      ko: "여름",
      en: "SUMMER",
      kicker: "REST & BLUE",
      title: "그늘 아래 쉬어가는<br><em>한낮의 바다</em>",
      description: "파라솔 자리를 미리 예약하고 부산의 여름 바다를 여유롭게 즐겨보세요.",
      tags: ["파라솔 지정석", "선셋 요가", "비치 휴식"],
      image: "assets/summer-parasol.png",
      alt: "해운대 바다의 파라솔 지정석에서 여름을 즐기는 여행자",
      caption: "HAEUNDAE · BUSAN"
    },
    autumn: {
      ko: "가을",
      en: "AUTUMN",
      kicker: "RIDE & BREEZE",
      title: "선선한 바람을 타는<br><em>가을 파도</em>",
      description: "송정의 부드러운 가을 파도 위에서 첫 서핑에 도전해보세요.",
      tags: ["가을 서핑", "노을 생태 산책", "안전 교육"],
      image: "assets/songjeong-surf.png",
      alt: "송정 해변에서 가을 파도를 타는 입문 서퍼들",
      caption: "SONGJEONG · BUSAN"
    },
    winter: {
      ko: "겨울",
      en: "WINTER",
      kicker: "LIGHT & FRAME",
      title: "새해 첫 빛을 담는<br><em>나만의 일출</em>",
      description: "청사포의 첫 해를 독특한 시선으로 찍고 사진 대회에 참여해보세요.",
      tags: ["새해 일출", "사진 대회", "휴대폰 참여"],
      image: "assets/winter-sunrise-contest.png",
      alt: "청사포 새해 일출을 카메라에 담는 사진 대회 참가자들",
      caption: "CHEONGSAPO · BUSAN"
    }
  };

  var events = [
    {
      id: "gwangalli-yoga", title: "광안리 선셋 비치요가", season: "summer", location: "광안리",
      venue: "광안리 해변 만남의 광장", category: "휴양", dateNumber: "08.15", dateDay: "SAT", time: "18:30", duration: "70분", seats: 8, reward: 500,
      image: "assets/pado-on-hero.png", imageAlt: "광안대교가 빛나는 광안리 바다의 저녁 풍경", themes: ["relax"],
      tags: ["초보자 환영", "매트 제공", "선셋"],
      schedules: [
        { value: "2026-08-15T18:30", label: "2026년 8월 15일 (토) 18:30" },
        { value: "2026-08-22T18:30", label: "2026년 8월 22일 (토) 18:30" }
      ],
      description: "광안대교 너머로 해가 내려앉는 시간, 잔잔한 파도 소리를 들으며 몸과 마음을 천천히 이완하는 초보자용 비치요가입니다.",
      includes: ["요가 매트 대여", "전문 강사 진행", "웰컴 티 1잔"]
    },
    {
      id: "dadaepo-eco", title: "다대포 노을 생태 산책", season: "autumn", location: "다대포",
      venue: "다대포 꿈의 낙조분수 앞", category: "바다생태", dateNumber: "10.10", dateDay: "SAT", time: "17:30", duration: "90분", seats: 18, reward: 300,
      image: "assets/dadaepo-sunset.png", imageAlt: "다대포의 붉은 노을과 습지를 걷는 가족 여행자", themes: ["ecology"],
      tags: ["가족 추천", "해설 동행", "노을 관찰"],
      schedules: [
        { value: "2026-10-10T17:30", label: "2026년 10월 10일 (토) 17:30" },
        { value: "2026-10-17T17:20", label: "2026년 10월 17일 (토) 17:20" }
      ],
      description: "낙동강 하구와 바다가 만나는 다대포에서 해설사와 함께 갯벌 생태를 살피고, 부산의 가장 넓은 노을을 감상합니다.",
      includes: ["전문 생태 해설", "관찰 노트", "가족 미션 카드"]
    },
    {
      id: "yeongdo-seaglass", title: "영도 바다유리 업사이클링", season: "spring", location: "영도",
      venue: "영도 해양문화공간 파도실", category: "사진·문화", dateNumber: "04.10", dateDay: "SAT", time: "14:00", duration: "100분", seats: 12, reward: 500,
      image: "gwangalli-clean-sea.png", imageAlt: "깨끗한 부산 해변과 업사이클링 활동을 표현한 일러스트", themes: ["culture"],
      tags: ["실내 진행", "우천 가능", "결과물 제공"],
      schedules: [
        { value: "2027-04-10T14:00", label: "2027년 4월 10일 (토) 14:00" },
        { value: "2027-04-17T14:00", label: "2027년 4월 17일 (토) 14:00" }
      ],
      description: "파도에 닳아 둥글어진 바다유리의 이야기를 듣고, 나만의 부산 바다 모빌을 만드는 따뜻한 실내 체험입니다.",
      includes: ["모든 공예 재료", "전문 작가 지도", "완성품 포장"]
    },
    {
      id: "cheongsapo-tea", title: "청사포 일출 차담", season: "winter", location: "청사포",
      venue: "청사포 다릿돌전망대 입구", category: "휴양", dateNumber: "12.19", dateDay: "SAT", time: "07:00", duration: "80분", seats: 10, reward: 500,
      image: "assets/pado-on-hero.png", imageAlt: "푸른 시간대의 고요한 부산 바다와 빛나는 다리", themes: ["relax"],
      tags: ["따뜻한 차", "일출 감상", "소규모"],
      schedules: [
        { value: "2026-12-19T07:00", label: "2026년 12월 19일 (토) 07:00" },
        { value: "2026-12-26T07:00", label: "2026년 12월 26일 (토) 07:00" }
      ],
      description: "겨울 새벽의 청사포를 천천히 걸은 뒤, 수평선 위로 떠오르는 해를 바라보며 부산 로컬 티를 나눕니다.",
      includes: ["로컬 티 2종", "핫팩 제공", "일출 포토 가이드"]
    },
    {
      id: "oryukdo-photo", title: "오륙도 바다 사진 산책", season: "spring", location: "오륙도",
      venue: "오륙도 스카이워크 안내소", category: "사진·문화", dateNumber: "04.17", dateDay: "SAT", time: "10:30", duration: "110분", seats: 14, reward: 400,
      image: "gwangalli-clean-sea.png", imageAlt: "맑은 하늘과 부산 바다를 배경으로 한 광안대교 일러스트", themes: ["culture"],
      tags: ["휴대폰 가능", "초보자 추천", "봄 산책"],
      schedules: [
        { value: "2027-04-17T10:30", label: "2027년 4월 17일 (토) 10:30" },
        { value: "2027-04-24T10:30", label: "2027년 4월 24일 (토) 10:30" }
      ],
      description: "오륙도에서 이기대 해안길까지 봄빛을 따라 걸으며, 휴대폰만으로 바다의 색과 여행의 순간을 담는 법을 배웁니다.",
      includes: ["사진 미션 카드", "촬영 구도 코칭", "단체 기념 사진"]
    },
    {
      id: "dadaepo-clam-games", title: "다대포 바지락 캐기 & 갯벌 게임", season: "spring", location: "다대포",
      venue: "다대포해수욕장 갯벌 체험존", category: "바다생태", dateNumber: "04.24", dateDay: "SAT", time: "10:00", duration: "120분", seats: 20, reward: 700,
      image: "assets/spring-clam-game.png", imageAlt: "다대포 갯벌에서 바지락을 캐고 게임을 즐기는 가족과 여행자", themes: ["ecology"],
      tags: ["바지락 캐기", "팀 갯벌 게임", "장화·도구 제공"],
      schedules: [
        { value: "2027-04-24T10:00", label: "2027년 4월 24일 (토) 10:00" },
        { value: "2027-05-01T10:00", label: "2027년 5월 1일 (토) 10:00" }
      ],
      description: "호미로 바지락을 찾아보고 조별 릴레이와 깃발 찾기 게임을 즐기는 가족형 갯벌 체험입니다. 물때와 현장 안전 기준에 따라 프로그램이 조정될 수 있어요.",
      includes: ["장화·호미 대여", "안전요원 동행", "팀 미션 도구"]
    },
    {
      id: "haeundae-parasol", title: "해운대 파라솔 자리 대여", season: "summer", location: "해운대",
      venue: "해운대해수욕장 이벤트존", category: "휴양", dateNumber: "08.16", dateDay: "SUN", time: "10:00", duration: "120분", seats: 24, reward: 300,
      image: "assets/summer-parasol.png", imageAlt: "해운대 바다의 지정 파라솔 아래에서 쉬는 여행자들", themes: ["relax"],
      tags: ["파라솔 지정석", "2시간 이용", "사전 예약"],
      schedules: [
        { value: "2026-08-16T10:00", label: "2026년 8월 16일 (일) 10:00" },
        { value: "2026-08-23T10:00", label: "2026년 8월 23일 (일) 10:00" }
      ],
      description: "해운대 바다를 여유롭게 즐길 수 있도록 파라솔 지정석을 사전 예약하는 휴양 프로그램입니다. 예약한 시간 동안 파라솔과 비치 매트를 이용할 수 있어요.",
      includes: ["파라솔 지정석", "비치 매트", "2시간 이용 안내"]
    },
    {
      id: "songjeong-autumn-surf", title: "송정 가을 파도 서핑 체험", season: "autumn", location: "송정",
      venue: "송정해수욕장 서핑존", category: "액티비티", dateNumber: "09.19", dateDay: "SAT", time: "09:30", duration: "120분", seats: 8, reward: 900,
      image: "assets/songjeong-surf.png", imageAlt: "선선한 가을의 송정 바다에서 서핑을 배우는 입문자들", themes: ["activity"],
      tags: ["입문자 가능", "보드·슈트 제공", "안전 교육"],
      schedules: [
        { value: "2026-09-19T09:30", label: "2026년 9월 19일 (토) 09:30" },
        { value: "2026-10-03T09:30", label: "2026년 10월 3일 (토) 09:30" }
      ],
      description: "선선한 바람과 잔잔한 파도를 만나는 가을 입문 서핑입니다. 안전 교육부터 패들링과 테이크오프까지 차근차근 배워요.",
      includes: ["서핑보드·슈트", "전문 강사", "안전 교육"]
    },
    {
      id: "cheongsapo-sunrise-contest", title: "청사포 이색 새해 일출사진 대회", season: "winter", location: "청사포",
      venue: "청사포 다릿돌전망대 앞", category: "사진·문화", dateNumber: "01.01", dateDay: "FRI", time: "06:30", duration: "150분", seats: 40, reward: 1000,
      image: "assets/winter-sunrise-contest.png", imageAlt: "청사포의 새해 일출을 촬영하는 사진 대회 참가자들", themes: ["culture"],
      tags: ["휴대폰 참여 가능", "현장 촬영", "사진 1점 제출"],
      schedules: [{ value: "2027-01-01T06:30", label: "2027년 1월 1일 (금) 06:30" }],
      description: "새해 첫 일출을 나만의 시선으로 담아 한 장의 사진으로 제출하는 현장 대회입니다. 휴대폰과 카메라 모두 참여할 수 있어요.",
      includes: ["촬영 구역 안내", "작품 제출 가이드", "기념 포토 카드"]
    }
  ];

  var defaultBooking = {
    id: "OS-0808-0001", eventId: "gwangalli-yoga", schedule: "2026-08-08T18:30",
    scheduleLabel: "2026년 8월 8일 (토) 18:30", quantity: 1, name: "김바다", contact: "demo@sea.local",
    status: "completed", rewarded: true, createdAt: "2026-08-01T09:00:00+09:00", completedAt: "2026-08-08T20:00:00+09:00"
  };
  var defaultWallet = {
    points: 500,
    history: [{ bookingId: "OS-0808-0001", title: "광안리 선셋 비치요가 참여", points: 500, createdAt: "2026-08-08T20:00:00+09:00" }]
  };
  var defaultStories = [
    {
      id: "story-songjeong", author: "해나", title: "송정에서 처음 파도를 탄 날", location: "송정", date: "2026.08.09",
      image: "assets/songjeong-surf.png", userCreated: false,
      content: "세 번 넘어지고 네 번째에 보드 위에 섰어요. 초보자 수업이라 천천히 배울 수 있었고, 돌아오는 길까지 바다 냄새가 오래 남았습니다."
    },
    {
      id: "story-dadaepo", author: "민준네", title: "다대포 노을이 물든 가족 산책", location: "다대포", date: "2026.07.26",
      image: "assets/dadaepo-sunset.png", userCreated: false,
      content: "갯벌의 작은 게를 찾아보고 노을 앞에서 가족사진도 남겼어요. 아이가 부산에서 가장 기억에 남는 순간이라고 했습니다."
    },
    {
      id: "story-gwangalli", author: "지윤", title: "광안대교 아래, 여름밤 한 장", location: "광안리", date: "2026.08.07",
      image: "assets/pado-on-hero.png", userCreated: false,
      content: "해가 진 뒤 켜진 광안대교를 천천히 바라봤어요. 휴대폰으로 찍은 사진인데도 부산의 여름빛이 그대로 담겼습니다."
    }
  ];

  var bookings = loadJson(STORAGE_BOOKINGS, null);
  if (!Array.isArray(bookings)) {
    var legacyBookings = loadJson(LEGACY_BOOKINGS, []);
    bookings = Array.isArray(legacyBookings) ? legacyBookings : [];
    if (!bookings.some(function (booking) { return booking.id === defaultBooking.id; })) bookings.push(copy(defaultBooking));
  }
  var wallet = loadJson(STORAGE_WALLET, null);
  if (!wallet || typeof wallet.points !== "number") {
    var legacyWallet = loadJson(LEGACY_WALLET, null);
    wallet = legacyWallet && typeof legacyWallet.points === "number" ? legacyWallet : { points: 0, history: [] };
    if (!Array.isArray(wallet.history)) wallet.history = [];
    if (!wallet.history.some(function (item) { return item.bookingId === defaultBooking.id; })) {
      wallet.points += defaultWallet.points;
      wallet.history.push(copy(defaultWallet.history[0]));
    }
  }
  var userStories = loadJson(STORAGE_STORIES, []);

  function byId(id) { return document.getElementById(id); }
  function copy(value) { return JSON.parse(JSON.stringify(value)); }

  function loadJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_BOOKINGS, JSON.stringify(bookings));
      localStorage.setItem(STORAGE_WALLET, JSON.stringify(wallet));
      return true;
    } catch (error) {
      showToast("브라우저 저장 공간을 확인해 주세요.");
      return false;
    }
  }

  function saveStories(nextStories) {
    try {
      localStorage.setItem(STORAGE_STORIES, JSON.stringify(nextStories));
      userStories = nextStories;
      return true;
    } catch (error) {
      showToast("사진 저장 공간이 부족해요. 더 작은 사진을 선택해 주세요.");
      return false;
    }
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character];
    });
  }

  function icon(name) { return '<svg class="icon" aria-hidden="true"><use href="#icon-' + name + '"></use></svg>'; }
  function formatPoints(points) { return new Intl.NumberFormat("ko-KR").format(points); }
  function getEvent(id) { return events.find(function (event) { return event.id === id; }); }

  function getReservedCount(eventId, schedule) {
    return bookings.filter(function (booking) {
      return booking.eventId === eventId && booking.status === "reserved" && (!schedule || booking.schedule === schedule);
    }).reduce(function (sum, booking) { return sum + Number(booking.quantity || 0); }, 0);
  }

  function getRemaining(event) {
    var mostAvailable = event.schedules.reduce(function (maximum, schedule) {
      return Math.max(maximum, event.seats - getReservedCount(event.id, schedule.value));
    }, 0);
    return Math.max(0, mostAvailable);
  }

  function renderSeason(seasonKey) {
    var season = seasons[seasonKey];
    if (!season) return;
    byId("seasonShowcase").className = "season-showcase " + seasonKey;
    byId("seasonImage").src = season.image;
    byId("seasonImage").alt = season.alt;
    byId("seasonStampKr").textContent = season.ko;
    byId("seasonStampEn").textContent = season.en;
    byId("seasonCaption").textContent = season.caption;
    byId("seasonKicker").textContent = season.kicker;
    byId("seasonHeadline").innerHTML = season.title;
    byId("seasonDescription").textContent = season.description;
    byId("seasonTags").innerHTML = season.tags.map(function (tag) { return "<span>" + escapeHtml(tag) + "</span>"; }).join("");
    byId("seasonEventButton").setAttribute("data-target-season", seasonKey);
    byId("seasonEventButton").childNodes[0].nodeValue = season.ko + " 행사 모아보기 ";
    document.querySelectorAll(".season-tabs [data-season]").forEach(function (button) {
      button.setAttribute("aria-selected", String(button.getAttribute("data-season") === seasonKey));
    });
  }

  function eventCard(event) {
    var remaining = getRemaining(event);
    return [
      '<article class="event-card" data-event-id="' + escapeHtml(event.id) + '" data-season="' + escapeHtml(event.season) + '" data-themes="' + escapeHtml(event.themes.join(" ")) + '">',
      '<div class="event-visual">',
      '<img src="' + escapeHtml(event.image) + '" alt="' + escapeHtml(event.imageAlt) + '" loading="lazy" decoding="async">',
      '<span class="category-badge">' + escapeHtml(event.category) + "</span>",
      '<div class="date-badge"><strong>' + escapeHtml(event.dateNumber) + "</strong><span>" + escapeHtml(event.dateDay) + "</span></div>",
      "</div>",
      '<div class="event-card-body">',
      '<p class="event-location">' + icon("pin") + " " + escapeHtml(event.location + " · " + event.time) + "</p>",
      "<h3>" + escapeHtml(event.title) + "</h3>",
      '<div class="event-tags">' + event.tags.map(function (tag) { return "<span>" + escapeHtml(tag) + "</span>"; }).join("") + "</div>",
      '<div class="event-card-footer">',
      '<div class="event-reward"><strong>+' + formatPoints(event.reward) + ' SEA P</strong><small>참여 완료 후 적립</small></div>',
      '<button type="button" data-open-event="' + escapeHtml(event.id) + '"' + (remaining === 0 ? ' class="sold-out"' : "") + ">" + (remaining === 0 ? "마감" : "자세히 보기") + " " + icon("arrow") + "</button>",
      "</div></div></article>"
    ].join("");
  }

  function renderEvents() {
    var theme = byId("themeFilter").value;
    var location = byId("locationFilter").value;
    var filtered = events.filter(function (event) {
      return (activeSeasonFilter === "all" || event.season === activeSeasonFilter) &&
        (theme === "all" || event.themes.indexOf(theme) !== -1) &&
        (location === "all" || event.location === location);
    });
    byId("eventCount").textContent = String(filtered.length);
    byId("eventGrid").innerHTML = filtered.map(eventCard).join("");
    byId("eventGrid").classList.toggle("hidden", filtered.length === 0);
    byId("eventEmpty").classList.toggle("hidden", filtered.length !== 0);
    var parasol = getEvent("haeundae-parasol");
    var heroSeat = document.querySelector(".hero-pick-bottom > span");
    if (heroSeat) heroSeat.innerHTML = "<b>" + getRemaining(parasol) + "자리</b> 남음 · +" + formatPoints(parasol.reward) + " SEA P";
  }

  function setSeasonFilter(season) {
    activeSeasonFilter = season;
    document.querySelectorAll("[data-season-filter]").forEach(function (button) {
      var active = button.getAttribute("data-season-filter") === season;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    renderEvents();
  }

  function renderDialogDetail(event) {
    var remaining = getRemaining(event);
    var includes = event.includes.map(function (item) { return "<li>" + icon("check") + "<span>" + escapeHtml(item) + "</span></li>"; }).join("");
    byId("dialogBody").innerHTML = [
      '<section class="dialog-detail"><div class="dialog-hero">',
      '<img src="' + escapeHtml(event.image) + '" alt="' + escapeHtml(event.imageAlt) + '" decoding="async">',
      '<div class="dialog-hero-copy"><span>' + escapeHtml(event.category) + '</span><h2 id="dialogTitle">' + escapeHtml(event.title) + "</h2><p>" + icon("pin") + " " + escapeHtml(event.location + " · " + event.venue) + "</p></div></div>",
      '<div class="dialog-content"><div class="detail-layout"><div class="detail-copy">',
      "<h3>이번 바다는 이렇게 즐겨요</h3><p>" + escapeHtml(event.description) + '</p><ul class="include-list">' + includes + "</ul></div>",
      '<aside class="detail-summary">',
      '<div class="summary-row"><span>일정</span><strong>' + escapeHtml(event.schedules[0].label) + "</strong></div>",
      '<div class="summary-row"><span>소요 시간</span><strong>' + escapeHtml(event.duration) + "</strong></div>",
      '<div class="summary-row"><span>남은 자리</span><strong>' + remaining + "자리</strong></div>",
      '<div class="summary-row reward-row"><span>SEA 포인트</span><strong>+' + formatPoints(event.reward) + " SEA P</strong></div>",
      '<button class="button button-dark" id="reserveFromDetail" type="button"' + (remaining === 0 ? " disabled" : "") + ">" + (remaining === 0 ? "예약 마감" : "날짜와 인원 선택") + " " + icon("arrow") + "</button>",
      "</aside></div></div></section>"
    ].join("");
    var reserveButton = byId("reserveFromDetail");
    if (reserveButton && remaining > 0) reserveButton.addEventListener("click", function () { bookingQty = 1; renderBookingStep(event); });
  }

  function renderBookingStep(event) {
    var remaining = getRemaining(event);
    var maxQuantity = Math.max(1, Math.min(5, remaining));
    var options = event.schedules.map(function (schedule) { return '<option value="' + escapeHtml(schedule.value) + '">' + escapeHtml(schedule.label) + "</option>"; }).join("");
    byId("dialogBody").innerHTML = [
      '<section class="booking-step"><header class="step-header"><span>RESERVATION · STEP 2 OF 2</span>',
      '<h2 id="dialogTitle">방문할 날짜를 골라주세요</h2><p>입력한 예약 정보는 이 브라우저에만 저장됩니다.</p></header>',
      '<div class="booking-layout"><form class="booking-form" id="bookingForm">',
      '<label class="form-field"><span>방문 일정</span><select id="bookingSchedule" name="schedule" required>' + options + "</select></label>",
      '<div class="guest-field"><span>참여 인원<small>한 번에 최대 ' + maxQuantity + '명</small></span><div class="stepper">',
      '<button type="button" id="qtyMinus" aria-label="인원 줄이기">' + icon("minus") + '</button><output id="qtyOutput" aria-live="polite">1</output><button type="button" id="qtyPlus" aria-label="인원 늘리기">' + icon("plus") + "</button></div></div>",
      '<div class="form-grid"><label class="form-field"><span>예약자 이름</span><input name="name" autocomplete="name" maxlength="30" placeholder="이름을 입력해 주세요" required></label>',
      '<label class="form-field"><span>연락처 또는 이메일</span><input name="contact" autocomplete="email" maxlength="60" placeholder="example@email.com" required></label></div>',
      '<button class="back-link" id="backToDetail" type="button">← 행사 정보로 돌아가기</button></form>',
      '<aside class="booking-summary-card"><div class="summary-event"><img src="' + escapeHtml(event.image) + '" alt="' + escapeHtml(event.imageAlt) + '" decoding="async"><div><h3>' + escapeHtml(event.title) + "</h3><p>" + escapeHtml(event.location + " · " + event.time) + "</p></div></div>",
      '<div class="price-row total"><span>적립 예정</span><strong>+' + formatPoints(event.reward) + " SEA P</strong></div>",
      '<p class="prototype-note reward-note">예약 1건 기준 · 참여 완료 후 적립</p>',
      '<button class="button button-coral" type="submit" form="bookingForm" id="confirmBooking">예약 확정하기</button>',
      '<p class="prototype-note">서비스 시연용 예약이며 실제 현장 예약으로 연결되지는 않습니다.</p></aside></div></section>'
    ].join("");

    function updateQuantity(next) {
      bookingQty = Math.max(1, Math.min(maxQuantity, next));
      byId("qtyOutput").textContent = String(bookingQty);
      byId("qtyMinus").disabled = bookingQty <= 1;
      byId("qtyPlus").disabled = bookingQty >= maxQuantity;
    }
    byId("qtyMinus").addEventListener("click", function () { updateQuantity(bookingQty - 1); });
    byId("qtyPlus").addEventListener("click", function () { updateQuantity(bookingQty + 1); });
    byId("backToDetail").addEventListener("click", function () { renderDialogDetail(event); });
    byId("bookingForm").addEventListener("submit", function (formEvent) {
      formEvent.preventDefault();
      var formData = new FormData(formEvent.currentTarget);
      var scheduleValue = String(formData.get("schedule"));
      var schedule = event.schedules.find(function (item) { return item.value === scheduleValue; }) || event.schedules[0];
      if (event.seats - getReservedCount(event.id, schedule.value) < bookingQty) {
        showToast("남은 자리가 변경됐어요. 인원을 다시 확인해 주세요.");
        renderBookingStep(event);
        return;
      }
      var booking = {
        id: createBookingCode(), eventId: event.id, schedule: schedule.value, scheduleLabel: schedule.label,
        quantity: bookingQty, name: String(formData.get("name")).trim(), contact: String(formData.get("contact")).trim(),
        status: "reserved", rewarded: false, createdAt: new Date().toISOString()
      };
      bookings.unshift(booking);
      if (!saveState()) {
        bookings.shift();
        return;
      }
      renderAllAccountData(); renderEvents(); renderBookingSuccess(event, booking);
    });
    updateQuantity(1);
  }

  function createBookingCode() {
    var stamp = new Date().toISOString().slice(5, 10).replace("-", "");
    return "OS-" + stamp + "-" + Math.floor(1000 + Math.random() * 9000);
  }

  function renderBookingSuccess(event, booking) {
    byId("dialogBody").innerHTML = [
      '<section class="success-step"><div class="success-inner"><span class="success-icon">' + icon("check") + "</span>",
      '<h2 id="dialogTitle">바다 갈 준비 완료!</h2><p>예약이 확정됐어요. 행사 당일 아래 예약 번호를 보여주세요.<br>참여 완료 후 ' + formatPoints(event.reward) + " SEA 포인트가 지급됩니다.</p>",
      '<div class="booking-code"><span>예약 번호</span><strong>' + escapeHtml(booking.id) + "</strong></div>",
      '<div class="success-actions"><button class="button button-dark" type="button" id="goToBookings">내 예약 보기</button><button class="button button-outline" type="button" id="closeSuccess">계속 둘러보기</button></div>',
      "</div></section>"
    ].join("");
    byId("goToBookings").addEventListener("click", function () { closeDialog(); byId("bookings").scrollIntoView({ behavior: "smooth", block: "center" }); });
    byId("closeSuccess").addEventListener("click", closeDialog);
  }

  function openEvent(eventId) {
    var event = getEvent(eventId);
    if (!event) return;
    selectedEventId = eventId; bookingQty = 1; renderDialogDetail(event);
    var dialog = byId("experienceDialog");
    if (typeof dialog.showModal === "function") { dialog.showModal(); document.body.classList.add("dialog-open"); }
  }

  function closeDialog() {
    var dialog = byId("experienceDialog");
    if (dialog.open) dialog.close();
    document.body.classList.remove("dialog-open"); selectedEventId = null;
  }

  function bookingStatus(booking) {
    if (booking.status === "completed") return '<span class="status-label completed">참여 완료</span>';
    if (booking.status === "cancelled") return '<span class="status-label cancelled">예약 취소</span>';
    return '<span class="status-label">예약 확정</span>';
  }

  function bookingActions(booking, event) {
    if (booking.status === "completed") return bookingStatus(booking) + '<span class="mini-action muted">+' + formatPoints(event.reward) + " SEA P 지급</span>";
    if (booking.status === "cancelled") return bookingStatus(booking);
    return bookingStatus(booking) + '<button class="mini-action" type="button" data-complete-booking="' + escapeHtml(booking.id) + '">참여 완료 체험</button><button class="mini-action muted" type="button" data-cancel-booking="' + escapeHtml(booking.id) + '">예약 취소</button>';
  }

  function renderBookings() {
    var upcomingBookings = bookings.filter(function (booking) { return booking.status === "reserved"; });
    var completedBookings = bookings.filter(function (booking) { return booking.status === "completed"; });
    var activeCount = upcomingBookings.length + completedBookings.length;
    byId("bookingCount").textContent = activeCount + "건";
    byId("upcomingBookingCount").textContent = upcomingBookings.length + "건";
    byId("completedBookingCount").textContent = completedBookings.length + "건";

    function bookingMarkup(booking) {
      var event = getEvent(booking.eventId);
      if (!event) return "";
      return '<article class="booking-item"><img class="booking-thumb" src="' + escapeHtml(event.image) + '" alt="' + escapeHtml(event.title) + '" loading="lazy" decoding="async"><div class="booking-info"><span>' + escapeHtml(booking.id) + "</span><h4>" + escapeHtml(event.title) + "</h4><p>" + escapeHtml(booking.scheduleLabel) + " · " + Number(booking.quantity || 1) + '명</p></div><div class="booking-actions">' + bookingActions(booking, event) + "</div></article>";
    }

    byId("upcomingBookingList").innerHTML = upcomingBookings.length
      ? upcomingBookings.slice(0, 8).map(bookingMarkup).join("")
      : '<div class="booking-group-empty"><span>' + icon("calendar") + '</span><p>참여를 기다리는 예약이 없어요.</p><a href="#events">새 체험 둘러보기</a></div>';

    byId("completedBookingList").innerHTML = completedBookings.length
      ? completedBookings.slice(0, 8).map(bookingMarkup).join("")
      : '<div class="booking-group-empty"><span>' + icon("check") + '</span><p>아직 완료한 체험이 없어요.</p></div>';
  }

  function renderRewards() {
    byId("headerPoints").textContent = formatPoints(wallet.points);
    byId("rewardPoints").textContent = formatPoints(wallet.points);
    var pending = bookings.filter(function (booking) { return booking.status === "reserved"; }).reduce(function (sum, booking) {
      var event = getEvent(booking.eventId); return sum + (event ? event.reward : 0);
    }, 0);
    byId("pendingReward").textContent = "지급 예정 " + formatPoints(pending) + " SEA P";
    if (!Array.isArray(wallet.history) || wallet.history.length === 0) {
      byId("rewardHistory").innerHTML = '<p class="history-empty">행사 참여를 완료하면 적립 내역이 여기에 표시돼요.</p>';
      return;
    }
    byId("rewardHistory").innerHTML = wallet.history.slice(0, 4).map(function (item) {
      return '<div class="history-row"><span>' + escapeHtml(item.title) + "</span><strong>+" + formatPoints(item.points) + " SEA P</strong></div>";
    }).join("");
  }

  function renderAllAccountData() { renderBookings(); renderRewards(); }

  function completeBooking(bookingId) {
    var booking = bookings.find(function (item) { return item.id === bookingId; });
    if (!booking || booking.status !== "reserved" || booking.rewarded) return;
    var event = getEvent(booking.eventId);
    if (!event || !window.confirm("참여 완료 처리하고 " + formatPoints(event.reward) + " SEA 포인트를 받을까요?")) return;
    booking.status = "completed"; booking.rewarded = true; booking.completedAt = new Date().toISOString();
    wallet.points += event.reward;
    if (!Array.isArray(wallet.history)) wallet.history = [];
    wallet.history.unshift({ bookingId: booking.id, title: event.title + " 참여", points: event.reward, createdAt: booking.completedAt });
    saveState(); renderAllAccountData(); renderEvents(); showToast(formatPoints(event.reward) + " SEA 포인트가 적립됐습니다.");
  }

  function cancelBooking(bookingId) {
    var booking = bookings.find(function (item) { return item.id === bookingId; });
    if (!booking || booking.status !== "reserved" || !window.confirm("이 예약을 취소할까요?")) return;
    booking.status = "cancelled"; booking.cancelledAt = new Date().toISOString();
    saveState(); renderAllAccountData(); renderEvents(); showToast("예약이 취소됐습니다.");
  }

  function storyCard(story) {
    var editButton = story.userCreated ? '<button class="story-edit" type="button" data-edit-story="' + escapeHtml(story.id) + '" aria-label="이야기 수정">수정</button>' : "";
    var deleteButton = story.userCreated ? '<button class="story-delete" type="button" data-delete-story="' + escapeHtml(story.id) + '" aria-label="이야기 삭제">' + icon("trash") + "</button>" : "";
    return [
      '<article class="story-card" data-story-id="' + escapeHtml(story.id) + '">',
      '<div class="story-visual"><img src="' + escapeHtml(story.image) + '" alt="' + escapeHtml(story.title) + '" loading="lazy" decoding="async">' + editButton + deleteButton + "</div>",
      '<div class="story-body"><p class="story-meta"><span>' + escapeHtml(story.location) + "</span> · " + escapeHtml(story.date) + "</p>",
      "<h3>" + escapeHtml(story.title) + "</h3><p>" + escapeHtml(story.content) + '</p><strong class="story-author">by. ' + escapeHtml(story.author) + "</strong></div></article>"
    ].join("");
  }

  function renderStories() {
    byId("storyGrid").innerHTML = userStories.concat(defaultStories).map(storyCard).join("");
  }

  function renderMyPhotos() {
    var grid = byId("myPhotoGrid");
    var empty = byId("myPhotosEmpty");
    byId("myPhotoCount").textContent = String(userStories.length);
    grid.innerHTML = userStories.map(storyCard).join("");
    grid.classList.toggle("hidden", userStories.length === 0);
    empty.classList.toggle("hidden", userStories.length !== 0);
  }

  function toggleStoryForm(show) {
    var shell = byId("storyFormShell");
    shell.classList.toggle("hidden", !show);
    byId("openStoryForm").setAttribute("aria-expanded", String(show));
    if (show) {
      window.setTimeout(function () { byId("storyAuthor").focus(); }, 50);
      shell.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      resetStoryForm();
    }
  }

  function resetStoryForm() {
    storyImageRequest += 1;
    editingStoryId = null;
    byId("storyForm").reset(); storyImageData = "";
    byId("storyImage").required = true;
    byId("storyImagePreview").src = "";
    byId("storyImagePreview").classList.add("hidden");
    byId("storyUploadPlaceholder").classList.remove("hidden");
    byId("storyImageStatus").textContent = "사진은 게시 전에 브라우저에 맞게 압축됩니다.";
    byId("storySubmit").disabled = false;
    byId("storySubmit").textContent = "게시하기";
  }

  function editStory(storyId) {
    var story = userStories.find(function (item) { return item.id === storyId; });
    if (!story) return;
    editingStoryId = story.id;
    storyImageData = story.image;
    byId("storyAuthor").value = story.author;
    byId("storyLocation").value = story.location;
    byId("storyTitle").value = story.title;
    byId("storyContent").value = story.content;
    byId("storyImage").required = false;
    byId("storyImagePreview").src = story.image;
    byId("storyImagePreview").classList.remove("hidden");
    byId("storyUploadPlaceholder").classList.add("hidden");
    byId("storyImageStatus").textContent = "사진을 누르면 다른 사진으로 바꿀 수 있어요.";
    byId("storySubmit").textContent = "수정 저장하기";
    byId("storyFormShell").classList.remove("hidden");
    byId("openStoryForm").setAttribute("aria-expanded", "true");
    byId("stories").scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(function () { byId("storyTitle").focus(); }, 350);
  }

  function compressStoryImage(file) {
    return new Promise(function (resolve, reject) {
      if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { reject(new Error("지원하지 않는 사진 형식입니다.")); return; }
      if (file.size > 5 * 1024 * 1024) { reject(new Error("사진은 5MB 이하로 선택해 주세요.")); return; }
      var reader = new FileReader();
      reader.onerror = function () { reject(new Error("사진을 불러오지 못했습니다.")); };
      reader.onload = function () {
        var image = new Image();
        image.onerror = function () { reject(new Error("사진을 확인할 수 없습니다.")); };
        image.onload = function () {
          var maxEdge = 1280;
          var scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
          var canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
          var context = canvas.getContext("2d");
          if (!context) { reject(new Error("이 브라우저에서는 사진을 처리할 수 없습니다.")); return; }
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.76));
        };
        image.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }

  function handleStoryImage(file) {
    if (!file) return;
    var requestId = ++storyImageRequest;
    byId("storyImageStatus").textContent = "사진을 준비하는 중이에요…";
    byId("storySubmit").disabled = true;
    compressStoryImage(file).then(function (dataUrl) {
      if (requestId !== storyImageRequest) return;
      storyImageData = dataUrl;
      byId("storyImagePreview").src = dataUrl;
      byId("storyImagePreview").classList.remove("hidden");
      byId("storyUploadPlaceholder").classList.add("hidden");
      byId("storyImageStatus").textContent = "사진 준비 완료";
      byId("storySubmit").disabled = false;
    }).catch(function (error) {
      if (requestId !== storyImageRequest) return;
      storyImageData = ""; byId("storyImage").value = ""; byId("storySubmit").disabled = false;
      byId("storyImagePreview").src = "";
      byId("storyImagePreview").classList.add("hidden");
      byId("storyUploadPlaceholder").classList.remove("hidden");
      byId("storyImageStatus").textContent = error.message; showToast(error.message);
    });
  }

  function submitStory(formEvent) {
    formEvent.preventDefault();
    if (!storyImageData) { showToast("체험 사진을 먼저 선택해 주세요."); return; }
    var formData = new FormData(formEvent.currentTarget);
    var today = new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()).replace(/\. /g, ".").replace(".", ".").replace(/\.$/, "");
    var existingStory = editingStoryId ? userStories.find(function (item) { return item.id === editingStoryId; }) : null;
    var story = {
      id: existingStory ? existingStory.id : "story-" + Date.now(), author: String(formData.get("author")).trim(), title: String(formData.get("title")).trim(),
      location: String(formData.get("location")).trim(), content: String(formData.get("content")).trim(), date: today,
      image: storyImageData, userCreated: true
    };
    if (!story.author || !story.title || !story.location || !story.content) return;
    var nextStories = existingStory
      ? userStories.map(function (item) { return item.id === story.id ? story : item; })
      : [story].concat(userStories).slice(0, 6);
    if (!saveStories(nextStories)) return;
    renderStories(); renderMyPhotos(); toggleStoryForm(false);
    showToast(existingStory ? "사진 이야기가 수정됐어요." : "내 사진에 새로운 추억이 저장됐어요.");
  }

  function deleteStory(storyId) {
    if (!window.confirm("이 바다 이야기를 삭제할까요?")) return;
    var nextStories = userStories.filter(function (story) { return story.id !== storyId; });
    if (saveStories(nextStories)) { renderStories(); renderMyPhotos(); showToast("사진이 삭제됐어요."); }
  }

  function showToast(message) {
    var toast = byId("toast"); byId("toastMessage").textContent = message; toast.classList.add("show");
    window.clearTimeout(toastTimer); toastTimer = window.setTimeout(function () { toast.classList.remove("show"); }, 3200);
  }

  function resetFilters() { byId("themeFilter").value = "all"; byId("locationFilter").value = "all"; setSeasonFilter("all"); }

  function resetPrototypeData() {
    if (!window.confirm("새로 만든 예약과 바다 이야기를 지우고, 완료 체험과 500 SEA 포인트 예시를 다시 불러올까요?")) return;
    bookings = [copy(defaultBooking)]; wallet = copy(defaultWallet); userStories = [];
    saveState(); saveStories([]); resetFilters(); renderAllAccountData(); renderStories(); renderMyPhotos(); toggleStoryForm(false);
    showToast("데모 데이터가 다시 준비됐어요.");
  }

  function initInteractions() {
    document.querySelectorAll(".season-tabs [data-season]").forEach(function (button) { button.addEventListener("click", function () { renderSeason(button.getAttribute("data-season")); }); });
    document.querySelectorAll("[data-season-filter]").forEach(function (button) { button.addEventListener("click", function () { setSeasonFilter(button.getAttribute("data-season-filter")); }); });
    byId("seasonEventButton").addEventListener("click", function () { setSeasonFilter(this.getAttribute("data-target-season") || "summer"); byId("events").scrollIntoView({ behavior: "smooth" }); });
    byId("themeFilter").addEventListener("change", renderEvents);
    byId("locationFilter").addEventListener("change", renderEvents);
    byId("resetFilters").addEventListener("click", resetFilters);
    byId("resetPrototype").addEventListener("click", resetPrototypeData);
    byId("openStoryForm").addEventListener("click", function () { toggleStoryForm(byId("storyFormShell").classList.contains("hidden")); });
    document.querySelectorAll("[data-open-story-form]").forEach(function (button) {
      button.addEventListener("click", function () {
        toggleStoryForm(true);
        byId("stories").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    byId("cancelStoryForm").addEventListener("click", function () { toggleStoryForm(false); });
    byId("storyImage").addEventListener("change", function () { handleStoryImage(this.files && this.files[0]); });
    byId("storyForm").addEventListener("submit", submitStory);

    document.body.addEventListener("click", function (clickEvent) {
      var openButton = clickEvent.target.closest("[data-open-event]");
      var completeButton = clickEvent.target.closest("[data-complete-booking]");
      var cancelButton = clickEvent.target.closest("[data-cancel-booking]");
      var deleteButton = clickEvent.target.closest("[data-delete-story]");
      var editButton = clickEvent.target.closest("[data-edit-story]");
      var scrollButton = clickEvent.target.closest("[data-scroll]");
      if (openButton) openEvent(openButton.getAttribute("data-open-event"));
      if (completeButton) completeBooking(completeButton.getAttribute("data-complete-booking"));
      if (cancelButton) cancelBooking(cancelButton.getAttribute("data-cancel-booking"));
      if (deleteButton) deleteStory(deleteButton.getAttribute("data-delete-story"));
      if (editButton) editStory(editButton.getAttribute("data-edit-story"));
      if (scrollButton) { var target = document.querySelector(scrollButton.getAttribute("data-scroll")); if (target) target.scrollIntoView({ behavior: "smooth", block: "center" }); }
    });

    byId("dialogClose").addEventListener("click", closeDialog);
    byId("experienceDialog").addEventListener("click", function (clickEvent) { if (clickEvent.target === this) closeDialog(); });
    byId("experienceDialog").addEventListener("cancel", function () { document.body.classList.remove("dialog-open"); selectedEventId = null; });
    var menuToggle = byId("menuToggle"); var mainNav = byId("mainNav");
    menuToggle.addEventListener("click", function () { var open = mainNav.classList.toggle("open"); menuToggle.setAttribute("aria-expanded", String(open)); });
    mainNav.addEventListener("click", function (clickEvent) { if (clickEvent.target.closest("a")) { mainNav.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false"); } });
  }

  function init() {
    if (!Array.isArray(bookings)) bookings = [copy(defaultBooking)];
    if (!wallet || typeof wallet.points !== "number") wallet = copy(defaultWallet);
    if (!Array.isArray(userStories)) userStories = [];
    saveState(); renderSeason("summer"); renderEvents(); renderAllAccountData(); renderStories(); renderMyPhotos(); initInteractions();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
