(function () {
  "use strict";

  var STORAGE_BOOKINGS = "padoOn.bookings.v1";
  var STORAGE_WALLET = "padoOn.wallet.v1";
  var selectedEventId = null;
  var bookingQty = 1;
  var activeSeasonFilter = "all";
  var toastTimer = null;

  var seasons = {
    spring: {
      ko: "봄",
      en: "SPRING",
      kicker: "WALK & BLOOM",
      title: "걷기 좋은<br><em>포근한 파도</em>",
      description: "이기대 해안길의 봄꽃과 오륙도의 투명한 바다를 천천히 걸으며 부산의 새 계절을 기록해보세요.",
      tags: ["해안 산책", "사진 클래스", "바다유리 공방"],
      image: "gwangalli-clean-sea.png",
      alt: "맑은 부산 바다와 광안대교를 그린 봄 분위기의 일러스트",
      caption: "ORYUKDO · BUSAN"
    },
    summer: {
      ko: "여름",
      en: "SUMMER",
      kicker: "BODY & WAVE",
      title: "몸으로 만나는<br><em>푸른 파도</em>",
      description: "송정의 첫 파도부터 광안리의 선셋 패들보드까지, 가장 부산다운 여름을 온몸으로 즐겨보세요.",
      tags: ["입문 서핑", "선셋 요가", "패들보드"],
      image: "assets/songjeong-surf.png",
      alt: "송정 해변에서 즐기는 초보자 서핑",
      caption: "SONGJEONG · BUSAN"
    },
    autumn: {
      ko: "가을",
      en: "AUTUMN",
      kicker: "SUNSET & NATURE",
      title: "노을을 따라가는<br><em>느린 파도</em>",
      description: "다대포의 붉은 노을과 기장의 선선한 해안길을 따라, 여유롭고 깊어진 부산 바다를 만나보세요.",
      tags: ["노을 생태 산책", "해안 피크닉", "사진 산책"],
      image: "assets/dadaepo-sunset.png",
      alt: "다대포의 가을 노을을 따라 걷는 가족과 여행자",
      caption: "DADAEPO · BUSAN"
    },
    winter: {
      ko: "겨울",
      en: "WINTER",
      kicker: "LIGHT & CALM",
      title: "더 선명해지는<br><em>고요한 파도</em>",
      description: "청사포 일출 차담과 영도의 실내 드로잉으로, 차갑지만 가장 또렷한 겨울 바다를 오래 바라보세요.",
      tags: ["일출 차담", "겨울 바다 걷기", "실내 드로잉"],
      image: "assets/pado-on-hero.png",
      alt: "푸른 저녁빛 아래 빛나는 광안대교와 고요한 겨울 바다",
      caption: "GWANGALLI · BUSAN"
    }
  };

  var events = [
    {
      id: "gwangalli-yoga",
      title: "광안리 선셋 비치요가",
      season: "summer",
      location: "광안리",
      venue: "광안리 해변 만남의 광장",
      category: "웰니스",
      dateNumber: "08.15",
      dateDay: "SAT",
      time: "18:30",
      duration: "70분",
      price: 12000,
      seats: 8,
      reward: 500,
      image: "assets/pado-on-hero.png",
      imageAlt: "광안대교가 빛나는 광안리 바다의 저녁 풍경",
      themes: ["beginner"],
      tags: ["초보자 환영", "매트 제공", "선셋"],
      schedules: [
        { value: "2026-08-15T18:30", label: "2026년 8월 15일 (토) 18:30" },
        { value: "2026-08-22T18:30", label: "2026년 8월 22일 (토) 18:30" }
      ],
      description: "광안대교 너머로 해가 내려앉는 시간, 잔잔한 파도 소리를 들으며 몸과 마음을 천천히 이완하는 초보자용 비치요가입니다.",
      includes: ["요가 매트 대여", "전문 강사 진행", "웰컴 티 1잔", "참여 리워드 500P"]
    },
    {
      id: "songjeong-surf",
      title: "송정 첫 파도 서핑",
      season: "summer",
      location: "송정",
      venue: "송정해수욕장 서핑존",
      category: "액티비티",
      dateNumber: "08.16",
      dateDay: "SUN",
      time: "09:00",
      duration: "120분",
      price: 45000,
      seats: 6,
      reward: 800,
      image: "assets/songjeong-surf.png",
      imageAlt: "송정 해변에서 서핑보드를 들고 수업을 듣는 입문자들",
      themes: ["beginner"],
      tags: ["입문자 대상", "장비 포함", "소규모"],
      schedules: [
        { value: "2026-08-16T09:00", label: "2026년 8월 16일 (일) 09:00" },
        { value: "2026-08-23T09:00", label: "2026년 8월 23일 (일) 09:00" }
      ],
      description: "처음 파도를 만나는 사람을 위한 6인 이하 입문 클래스입니다. 안전 교육부터 패들링, 테이크오프까지 차근차근 배워요.",
      includes: ["서핑보드·슈트", "안전 교육", "샤워실 이용", "참여 리워드 800P"]
    },
    {
      id: "dadaepo-eco",
      title: "다대포 노을 생태 산책",
      season: "autumn",
      location: "다대포",
      venue: "다대포 꿈의 낙조분수 앞",
      category: "생태 여행",
      dateNumber: "10.10",
      dateDay: "SAT",
      time: "17:30",
      duration: "90분",
      price: 0,
      seats: 18,
      reward: 300,
      image: "assets/dadaepo-sunset.png",
      imageAlt: "다대포의 붉은 노을과 습지를 걷는 가족 여행자",
      themes: ["free", "family"],
      tags: ["무료", "가족 추천", "해설 동행"],
      schedules: [
        { value: "2026-10-10T17:30", label: "2026년 10월 10일 (토) 17:30" },
        { value: "2026-10-17T17:20", label: "2026년 10월 17일 (토) 17:20" }
      ],
      description: "낙동강 하구와 바다가 만나는 다대포에서 해설사와 함께 갯벌 생태를 살피고, 부산의 가장 넓은 노을을 감상합니다.",
      includes: ["전문 생태 해설", "관찰 노트", "가족 미션 카드", "참여 리워드 300P"]
    },
    {
      id: "yeongdo-seaglass",
      title: "영도 바다유리 업사이클링",
      season: "spring",
      location: "영도",
      venue: "영도 해양문화공간 파도실",
      category: "실내 공방",
      dateNumber: "04.10",
      dateDay: "SAT",
      time: "14:00",
      duration: "100분",
      price: 18000,
      seats: 12,
      reward: 500,
      image: "gwangalli-clean-sea.png",
      imageAlt: "깨끗한 부산 해변과 업사이클링 활동을 표현한 일러스트",
      themes: ["indoor", "family"],
      tags: ["실내 진행", "우천 가능", "결과물 제공"],
      schedules: [
        { value: "2027-04-10T14:00", label: "2027년 4월 10일 (토) 14:00" },
        { value: "2027-04-17T14:00", label: "2027년 4월 17일 (토) 14:00" }
      ],
      description: "파도에 닳아 둥글어진 바다유리의 이야기를 듣고, 나만의 부산 바다 모빌을 만드는 따뜻한 실내 체험입니다.",
      includes: ["모든 공예 재료", "전문 작가 지도", "완성품 포장", "참여 리워드 500P"]
    },
    {
      id: "cheongsapo-tea",
      title: "청사포 일출 차담",
      season: "winter",
      location: "청사포",
      venue: "청사포 다릿돌전망대 입구",
      category: "로컬 감성",
      dateNumber: "12.19",
      dateDay: "SAT",
      time: "07:00",
      duration: "80분",
      price: 15000,
      seats: 10,
      reward: 500,
      image: "assets/pado-on-hero.png",
      imageAlt: "푸른 시간대의 고요한 부산 바다와 빛나는 다리",
      themes: ["beginner"],
      tags: ["따뜻한 차", "일출 감상", "소규모"],
      schedules: [
        { value: "2026-12-19T07:00", label: "2026년 12월 19일 (토) 07:00" },
        { value: "2026-12-26T07:00", label: "2026년 12월 26일 (토) 07:00" }
      ],
      description: "겨울 새벽의 청사포를 천천히 걸은 뒤, 수평선 위로 떠오르는 해를 바라보며 부산 로컬 티를 나눕니다.",
      includes: ["로컬 티 2종", "핫팩 제공", "일출 포토 가이드", "참여 리워드 500P"]
    },
    {
      id: "oryukdo-photo",
      title: "오륙도 바다 사진 산책",
      season: "spring",
      location: "오륙도",
      venue: "오륙도 스카이워크 안내소",
      category: "사진 산책",
      dateNumber: "04.17",
      dateDay: "SAT",
      time: "10:30",
      duration: "110분",
      price: 9000,
      seats: 14,
      reward: 400,
      image: "gwangalli-clean-sea.png",
      imageAlt: "맑은 하늘과 부산 바다를 배경으로 한 광안대교 일러스트",
      themes: ["beginner", "family"],
      tags: ["휴대폰 가능", "초보자 추천", "봄 산책"],
      schedules: [
        { value: "2027-04-17T10:30", label: "2027년 4월 17일 (토) 10:30" },
        { value: "2027-04-24T10:30", label: "2027년 4월 24일 (토) 10:30" }
      ],
      description: "오륙도에서 이기대 해안길까지 봄빛을 따라 걸으며, 휴대폰만으로 바다의 색과 여행의 순간을 담는 법을 배웁니다.",
      includes: ["사진 미션 카드", "촬영 구도 코칭", "단체 기념 사진", "참여 리워드 400P"]
    }
  ];

  var bookings = loadJson(STORAGE_BOOKINGS, []);
  var wallet = loadJson(STORAGE_WALLET, { points: 0, history: [] });

  function byId(id) {
    return document.getElementById(id);
  }

  function loadJson(key, fallback) {
    try {
      var value = JSON.parse(localStorage.getItem(key));
      return value && typeof value === "object" ? value : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_BOOKINGS, JSON.stringify(bookings));
      localStorage.setItem(STORAGE_WALLET, JSON.stringify(wallet));
    } catch (error) {
      showToast("브라우저 저장 공간을 확인해 주세요.");
    }
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[character];
    });
  }

  function icon(name) {
    return '<svg class="icon" aria-hidden="true"><use href="#icon-' + name + '"></use></svg>';
  }

  function formatPrice(price) {
    return price === 0 ? "무료" : new Intl.NumberFormat("ko-KR").format(price) + "원";
  }

  function formatPoints(points) {
    return new Intl.NumberFormat("ko-KR").format(points);
  }

  function getEvent(id) {
    return events.find(function (event) {
      return event.id === id;
    });
  }

  function getReservedCount(eventId) {
    return bookings
      .filter(function (booking) {
        return booking.eventId === eventId && booking.status !== "cancelled";
      })
      .reduce(function (sum, booking) {
        return sum + Number(booking.quantity || 0);
      }, 0);
  }

  function getRemaining(event) {
    return Math.max(0, event.seats - getReservedCount(event.id));
  }

  function renderSeason(seasonKey) {
    var season = seasons[seasonKey];
    if (!season) return;

    document.querySelectorAll("[data-season]").forEach(function (button) {
      button.setAttribute("aria-selected", String(button.getAttribute("data-season") === seasonKey));
    });

    var showcase = byId("seasonShowcase");
    var imageWrap = showcase.querySelector(".season-image");
    imageWrap.classList.add("is-changing");

    window.setTimeout(function () {
      var image = byId("seasonImage");
      image.src = season.image;
      image.alt = season.alt;
      byId("seasonStampKr").textContent = season.ko;
      byId("seasonStampEn").textContent = season.en;
      byId("seasonCaption").textContent = season.caption;
      byId("seasonKicker").textContent = season.kicker;
      byId("seasonHeadline").innerHTML = season.title;
      byId("seasonDescription").textContent = season.description;
      byId("seasonTags").innerHTML = season.tags.map(function (tag) {
        return "<span>" + escapeHtml(tag) + "</span>";
      }).join("");
      byId("seasonEventButton").textContent = "";
      byId("seasonEventButton").append(document.createTextNode(season.ko + " 행사 모아보기 "));
      var arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      arrow.setAttribute("class", "icon");
      var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttribute("href", "#icon-arrow");
      arrow.appendChild(use);
      byId("seasonEventButton").appendChild(arrow);
      byId("seasonEventButton").setAttribute("data-target-season", seasonKey);
      showcase.className = "season-showcase " + seasonKey;
      imageWrap.classList.remove("is-changing");
    }, 100);
  }

  function eventCard(event) {
    var remaining = getRemaining(event);
    var statusText = remaining > 0 ? "예약 가능 · " + remaining + "자리 남음" : "대기 신청 가능";
    var tags = event.tags.map(function (tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("");

    return [
      '<article class="event-card">',
      '<div class="event-visual">',
      '<img src="' + escapeHtml(event.image) + '" alt="' + escapeHtml(event.imageAlt) + '" loading="lazy">',
      '<time class="event-date"><strong>' + escapeHtml(event.dateNumber) + '</strong><small>' + escapeHtml(event.dateDay) + "</small></time>",
      '<span class="event-category">' + escapeHtml(event.category) + "</span>",
      "</div>",
      '<div class="event-card-body">',
      '<p class="event-location">' + icon("pin") + escapeHtml(event.location + " · " + event.venue) + "</p>",
      "<h3>" + escapeHtml(event.title) + "</h3>",
      '<div class="event-facts">',
      "<span>" + icon("clock") + escapeHtml(event.time + " · " + event.duration) + "</span>",
      "<span>" + icon("users") + escapeHtml(statusText) + "</span>",
      "</div>",
      '<div class="event-tags">' + tags + "</div>",
      '<div class="event-card-footer">',
      '<div class="event-price"><strong>' + formatPrice(event.price) + "</strong><small>참여 리워드 +" + formatPoints(event.reward) + "P</small></div>",
      '<button type="button" data-open-event="' + escapeHtml(event.id) + '"' + (remaining === 0 ? ' class="sold-out"' : "") + ">자세히 보기 " + icon("arrow") + "</button>",
      "</div>",
      "</div>",
      "</article>"
    ].join("");
  }

  function renderEvents() {
    var theme = byId("themeFilter").value;
    var location = byId("locationFilter").value;
    var filtered = events.filter(function (event) {
      var seasonMatch = activeSeasonFilter === "all" || event.season === activeSeasonFilter;
      var themeMatch = theme === "all" || event.themes.indexOf(theme) !== -1;
      var locationMatch = location === "all" || event.location === location;
      return seasonMatch && themeMatch && locationMatch;
    });

    byId("eventCount").textContent = String(filtered.length);
    byId("eventGrid").innerHTML = filtered.map(eventCard).join("");
    byId("eventGrid").classList.toggle("hidden", filtered.length === 0);
    byId("eventEmpty").classList.toggle("hidden", filtered.length !== 0);

    var yoga = getEvent("gwangalli-yoga");
    var heroSeat = document.querySelector(".hero-pick-bottom > span");
    if (heroSeat) {
      heroSeat.innerHTML = "<b>" + getRemaining(yoga) + "자리</b> 남음 · " + yoga.reward + "P";
    }
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
    var includes = event.includes.map(function (item) {
      return "<li>" + icon("check") + "<span>" + escapeHtml(item) + "</span></li>";
    }).join("");

    byId("dialogBody").innerHTML = [
      '<section class="dialog-detail">',
      '<div class="dialog-hero">',
      '<img src="' + escapeHtml(event.image) + '" alt="">',
      '<div class="dialog-hero-copy">',
      "<span>" + escapeHtml(event.category) + "</span>",
      '<h2 id="dialogTitle">' + escapeHtml(event.title) + "</h2>",
      "<p>" + icon("pin") + " " + escapeHtml(event.location + " · " + event.venue) + "</p>",
      "</div>",
      "</div>",
      '<div class="dialog-content">',
      '<div class="detail-layout">',
      '<div class="detail-copy">',
      "<h3>이번 바다에 함께할까요?</h3>",
      "<p>" + escapeHtml(event.description) + "</p>",
      '<ul class="include-list">' + includes + "</ul>",
      "</div>",
      '<aside class="detail-summary">',
      '<div class="summary-row"><span>일정</span><strong>' + escapeHtml(event.schedules[0].label.replace("2026년 ", "").replace("2027년 ", "")) + "</strong></div>",
      '<div class="summary-row"><span>소요 시간</span><strong>' + escapeHtml(event.duration) + "</strong></div>",
      '<div class="summary-row"><span>참가비</span><strong>' + formatPrice(event.price) + "</strong></div>",
      '<div class="summary-row"><span>남은 자리</span><strong>' + remaining + "자리</strong></div>",
      '<div class="summary-row"><span>리워드</span><strong>+' + formatPoints(event.reward) + "P</strong></div>",
      '<button class="button button-dark" id="reserveFromDetail" type="button"' + (remaining === 0 ? " disabled" : "") + ">" + (remaining === 0 ? "대기 신청 준비 중" : "날짜와 인원 선택") + " " + icon("arrow") + "</button>",
      "</aside>",
      "</div>",
      "</div>",
      "</section>"
    ].join("");

    var reserveButton = byId("reserveFromDetail");
    if (reserveButton && remaining > 0) {
      reserveButton.addEventListener("click", function () {
        bookingQty = 1;
        renderBookingStep(event);
      });
    }
  }

  function renderBookingStep(event) {
    var remaining = getRemaining(event);
    var maxQuantity = Math.max(1, Math.min(5, remaining));
    var options = event.schedules.map(function (schedule) {
      return '<option value="' + escapeHtml(schedule.value) + '">' + escapeHtml(schedule.label) + "</option>";
    }).join("");

    byId("dialogBody").innerHTML = [
      '<section class="booking-step">',
      '<header class="step-header">',
      "<span>RESERVATION · STEP 2 OF 2</span>",
      '<h2 id="dialogTitle">방문할 날짜를 골라주세요</h2>',
      "<p>예약자 정보는 이 브라우저에만 저장되며 실제 결제는 발생하지 않습니다.</p>",
      "</header>",
      '<div class="booking-layout">',
      '<form class="booking-form" id="bookingForm">',
      '<label class="form-field"><span>방문 일정</span><select id="bookingSchedule" name="schedule" required>' + options + "</select></label>",
      '<div class="guest-field"><span>참여 인원<small>한 번에 최대 ' + maxQuantity + "명</small></span>",
      '<div class="stepper"><button type="button" id="qtyMinus" aria-label="인원 줄이기">' + icon("minus") + '</button><output id="qtyOutput" aria-live="polite">1</output><button type="button" id="qtyPlus" aria-label="인원 늘리기">' + icon("plus") + "</button></div></div>",
      '<div class="form-grid">',
      '<label class="form-field"><span>예약자 이름</span><input name="name" autocomplete="name" maxlength="30" placeholder="이름을 입력해 주세요" required></label>',
      '<label class="form-field"><span>연락처 또는 이메일</span><input name="contact" autocomplete="email" maxlength="60" placeholder="example@email.com" required></label>',
      "</div>",
      '<button class="back-link" id="backToDetail" type="button">← 행사 정보로 돌아가기</button>',
      "</form>",
      '<aside class="booking-summary-card">',
      '<div class="summary-event"><img src="' + escapeHtml(event.image) + '" alt=""><div><h3>' + escapeHtml(event.title) + "</h3><p>" + escapeHtml(event.location + " · " + event.time) + "</p></div></div>",
      '<div class="price-row"><span id="priceDescription">참가비 × 1명</span><strong id="subtotalPrice">' + formatPrice(event.price) + "</strong></div>",
      '<div class="price-row"><span>예정 리워드</span><strong>+' + formatPoints(event.reward) + "P</strong></div>",
      '<div class="price-row total"><span>총 예약 금액</span><strong id="totalPrice">' + formatPrice(event.price) + "</strong></div>",
      '<button class="button button-coral" type="submit" form="bookingForm" id="confirmBooking">' + (event.price === 0 ? "무료로 예약 확정하기" : formatPrice(event.price) + " 예약 확정하기") + "</button>",
      '<p class="prototype-note">프로토타입 예약입니다. 결제 정보는 수집하지 않아요.</p>',
      "</aside>",
      "</div>",
      "</section>"
    ].join("");

    function updateQuantity(next) {
      bookingQty = Math.max(1, Math.min(maxQuantity, next));
      byId("qtyOutput").textContent = String(bookingQty);
      byId("qtyMinus").disabled = bookingQty <= 1;
      byId("qtyPlus").disabled = bookingQty >= maxQuantity;
      byId("priceDescription").textContent = "참가비 × " + bookingQty + "명";
      byId("subtotalPrice").textContent = formatPrice(event.price * bookingQty);
      byId("totalPrice").textContent = formatPrice(event.price * bookingQty);
      byId("confirmBooking").textContent = event.price === 0 ? "무료로 예약 확정하기" : formatPrice(event.price * bookingQty) + " 예약 확정하기";
    }

    byId("qtyMinus").addEventListener("click", function () {
      updateQuantity(bookingQty - 1);
    });
    byId("qtyPlus").addEventListener("click", function () {
      updateQuantity(bookingQty + 1);
    });
    byId("backToDetail").addEventListener("click", function () {
      renderDialogDetail(event);
    });
    byId("bookingForm").addEventListener("submit", function (formEvent) {
      formEvent.preventDefault();
      if (getRemaining(event) < bookingQty) {
        showToast("남은 자리가 변경됐어요. 인원을 다시 확인해 주세요.");
        renderBookingStep(event);
        return;
      }

      var formData = new FormData(formEvent.currentTarget);
      var scheduleValue = String(formData.get("schedule"));
      var schedule = event.schedules.find(function (item) {
        return item.value === scheduleValue;
      }) || event.schedules[0];
      var booking = {
        id: createBookingCode(),
        eventId: event.id,
        schedule: schedule.value,
        scheduleLabel: schedule.label,
        quantity: bookingQty,
        name: String(formData.get("name")).trim(),
        contact: String(formData.get("contact")).trim(),
        total: event.price * bookingQty,
        status: "reserved",
        rewarded: false,
        createdAt: new Date().toISOString()
      };

      bookings.unshift(booking);
      saveState();
      renderAllAccountData();
      renderEvents();
      renderBookingSuccess(event, booking);
    });
    updateQuantity(1);
  }

  function createBookingCode() {
    var stamp = new Date().toISOString().slice(5, 10).replace("-", "");
    var random = Math.floor(1000 + Math.random() * 9000);
    return "PO-" + stamp + "-" + random;
  }

  function renderBookingSuccess(event, booking) {
    byId("dialogBody").innerHTML = [
      '<section class="success-step">',
      '<div class="success-inner">',
      '<span class="success-icon">' + icon("check") + "</span>",
      '<h2 id="dialogTitle">바다 갈 준비 끝!</h2>',
      "<p>예약이 확정됐어요. 행사 당일 아래 예약 번호를 보여주세요.<br>참여 완료 후 " + formatPoints(event.reward) + "P가 지급됩니다.</p>",
      '<div class="booking-code"><span>예약 번호</span><strong>' + escapeHtml(booking.id) + "</strong></div>",
      '<div class="success-actions">',
      '<button class="button button-dark" type="button" id="goToBookings">내 예약 보기</button>',
      '<button class="button button-outline" type="button" id="closeSuccess">계속 둘러보기</button>',
      "</div>",
      "</div>",
      "</section>"
    ].join("");

    byId("goToBookings").addEventListener("click", function () {
      closeDialog();
      byId("bookings").scrollIntoView({ behavior: "smooth", block: "center" });
    });
    byId("closeSuccess").addEventListener("click", closeDialog);
  }

  function openEvent(eventId) {
    var event = getEvent(eventId);
    if (!event) return;
    selectedEventId = eventId;
    bookingQty = 1;
    renderDialogDetail(event);
    var dialog = byId("experienceDialog");
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
      document.body.classList.add("dialog-open");
    }
  }

  function closeDialog() {
    var dialog = byId("experienceDialog");
    if (dialog.open) dialog.close();
    document.body.classList.remove("dialog-open");
    selectedEventId = null;
  }

  function bookingStatus(booking) {
    if (booking.status === "completed") return '<span class="status-label completed">참여 완료</span>';
    if (booking.status === "cancelled") return '<span class="status-label cancelled">예약 취소</span>';
    return '<span class="status-label">예약 확정</span>';
  }

  function bookingActions(booking, event) {
    if (booking.status === "completed") {
      return bookingStatus(booking) + '<span class="mini-action muted">+' + formatPoints(event.reward) + "P 지급</span>";
    }
    if (booking.status === "cancelled") {
      return bookingStatus(booking);
    }
    return [
      bookingStatus(booking),
      '<button class="mini-action" type="button" data-complete-booking="' + escapeHtml(booking.id) + '">참여 완료 체험</button>',
      '<button class="mini-action muted" type="button" data-cancel-booking="' + escapeHtml(booking.id) + '">예약 취소</button>'
    ].join("");
  }

  function renderBookings() {
    var activeCount = bookings.filter(function (booking) {
      return booking.status !== "cancelled";
    }).length;
    byId("bookingCount").textContent = activeCount + "건";

    if (bookings.length === 0) {
      byId("bookingList").innerHTML = [
        '<div class="booking-empty">',
        '<span class="empty-icon">' + icon("ticket") + "</span>",
        "<h4>아직 예약한 바다가 없어요</h4>",
        "<p>마음에 드는 행사를 예약하면<br>이곳에서 일정과 리워드를 확인할 수 있어요.</p>",
        '<a class="button button-dark button-small" href="#events">행사 둘러보기</a>',
        "</div>"
      ].join("");
      return;
    }

    byId("bookingList").innerHTML = bookings.slice(0, 6).map(function (booking) {
      var event = getEvent(booking.eventId);
      if (!event) return "";
      return [
        '<article class="booking-item">',
        '<img class="booking-thumb" src="' + escapeHtml(event.image) + '" alt="">',
        '<div class="booking-info">',
        "<span>" + escapeHtml(booking.id) + "</span>",
        "<h4>" + escapeHtml(event.title) + "</h4>",
        "<p>" + escapeHtml(booking.scheduleLabel) + " · " + booking.quantity + "명</p>",
        "</div>",
        '<div class="booking-actions">' + bookingActions(booking, event) + "</div>",
        "</article>"
      ].join("");
    }).join("");
  }

  function renderRewards() {
    byId("headerPoints").textContent = formatPoints(wallet.points);
    byId("rewardPoints").textContent = formatPoints(wallet.points);

    var pending = bookings
      .filter(function (booking) {
        return booking.status === "reserved";
      })
      .reduce(function (sum, booking) {
        var event = getEvent(booking.eventId);
        return sum + (event ? event.reward : 0);
      }, 0);
    byId("pendingReward").textContent = "지급 예정 " + formatPoints(pending) + "P";

    if (!wallet.history || wallet.history.length === 0) {
      byId("rewardHistory").innerHTML = '<p class="history-empty">행사 참여를 완료하면 적립 내역이 여기에 표시돼요.</p>';
      return;
    }

    byId("rewardHistory").innerHTML = wallet.history.slice(0, 4).map(function (item) {
      return '<div class="history-row"><span>' + escapeHtml(item.title) + "</span><strong>+" + formatPoints(item.points) + "P</strong></div>";
    }).join("");
  }

  function renderAllAccountData() {
    renderBookings();
    renderRewards();
  }

  function completeBooking(bookingId) {
    var booking = bookings.find(function (item) {
      return item.id === bookingId;
    });
    if (!booking || booking.status !== "reserved" || booking.rewarded) return;
    var event = getEvent(booking.eventId);
    if (!event) return;

    var confirmed = window.confirm("프로토타입에서 참여 완료와 " + formatPoints(event.reward) + "P 지급을 체험할까요?");
    if (!confirmed) return;

    booking.status = "completed";
    booking.rewarded = true;
    booking.completedAt = new Date().toISOString();
    wallet.points += event.reward;
    if (!Array.isArray(wallet.history)) wallet.history = [];
    wallet.history.unshift({
      bookingId: booking.id,
      title: event.title + " 참여",
      points: event.reward,
      createdAt: booking.completedAt
    });
    saveState();
    renderAllAccountData();
    showToast("오늘의 파도가 도착했어요! " + formatPoints(event.reward) + "P가 적립됐습니다.");
  }

  function cancelBooking(bookingId) {
    var booking = bookings.find(function (item) {
      return item.id === bookingId;
    });
    if (!booking || booking.status !== "reserved") return;
    if (!window.confirm("이 예약을 취소할까요? 프로토타입에서는 즉시 취소됩니다.")) return;
    booking.status = "cancelled";
    booking.cancelledAt = new Date().toISOString();
    saveState();
    renderAllAccountData();
    renderEvents();
    showToast("예약이 취소됐습니다.");
  }

  function showToast(message) {
    var toast = byId("toast");
    byId("toastMessage").textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 3200);
  }

  function resetFilters() {
    byId("themeFilter").value = "all";
    byId("locationFilter").value = "all";
    setSeasonFilter("all");
  }

  function resetPrototypeData() {
    if (!window.confirm("저장된 예약과 파도 포인트를 모두 초기화할까요?")) return;
    bookings = [];
    wallet = { points: 0, history: [] };
    saveState();
    renderAllAccountData();
    renderEvents();
    showToast("체험 데이터가 초기화됐습니다.");
  }

  function initInteractions() {
    document.querySelectorAll("[data-season]").forEach(function (button) {
      button.addEventListener("click", function () {
        renderSeason(button.getAttribute("data-season"));
      });
    });

    document.querySelectorAll("[data-season-filter]").forEach(function (button) {
      button.addEventListener("click", function () {
        setSeasonFilter(button.getAttribute("data-season-filter"));
      });
    });

    byId("seasonEventButton").addEventListener("click", function () {
      var season = this.getAttribute("data-target-season") || "summer";
      setSeasonFilter(season);
      byId("events").scrollIntoView({ behavior: "smooth" });
    });

    byId("themeFilter").addEventListener("change", renderEvents);
    byId("locationFilter").addEventListener("change", renderEvents);
    byId("resetFilters").addEventListener("click", resetFilters);
    byId("resetPrototype").addEventListener("click", resetPrototypeData);

    document.body.addEventListener("click", function (clickEvent) {
      var openButton = clickEvent.target.closest("[data-open-event]");
      var completeButton = clickEvent.target.closest("[data-complete-booking]");
      var cancelButton = clickEvent.target.closest("[data-cancel-booking]");
      var scrollButton = clickEvent.target.closest("[data-scroll]");

      if (openButton) openEvent(openButton.getAttribute("data-open-event"));
      if (completeButton) completeBooking(completeButton.getAttribute("data-complete-booking"));
      if (cancelButton) cancelBooking(cancelButton.getAttribute("data-cancel-booking"));
      if (scrollButton) {
        var target = document.querySelector(scrollButton.getAttribute("data-scroll"));
        if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });

    byId("dialogClose").addEventListener("click", closeDialog);
    byId("experienceDialog").addEventListener("click", function (clickEvent) {
      if (clickEvent.target === this) closeDialog();
    });
    byId("experienceDialog").addEventListener("cancel", function () {
      document.body.classList.remove("dialog-open");
      selectedEventId = null;
    });

    var menuToggle = byId("menuToggle");
    var mainNav = byId("mainNav");
    menuToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
    mainNav.addEventListener("click", function (clickEvent) {
      if (clickEvent.target.closest("a")) {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function init() {
    if (!Array.isArray(bookings)) bookings = [];
    if (!wallet || typeof wallet.points !== "number") wallet = { points: 0, history: [] };
    renderSeason("summer");
    renderEvents();
    renderAllAccountData();
    initInteractions();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
