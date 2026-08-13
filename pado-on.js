(function () {
  "use strict";

  var STORAGE_BOOKINGS = "oronaminSea.bookings.v2";
  var STORAGE_WALLET = "oronaminSea.wallet.v2";
  var STORAGE_STORIES = "oronaminSea.stories.v1";
  var BUSKING_REWARD_FIX = "oronaminSea.fix.springBuskingReward.v1";
  var POINT_USAGE_FIX = "oronaminSea.fix.examplePointUsage.v1";
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

  function createDailySchedules(startDate, endDate, time) {
    var schedules = [];
    var current = new Date(startDate + "T00:00:00+09:00");
    var last = new Date(endDate + "T00:00:00+09:00");
    var dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    while (current <= last) {
      var year = current.getFullYear();
      var month = String(current.getMonth() + 1).padStart(2, "0");
      var day = String(current.getDate()).padStart(2, "0");
      var dateValue = year + "-" + month + "-" + day;
      schedules.push({ value: dateValue + "T" + time, label: year + "년 " + Number(month) + "월 " + Number(day) + "일 (" + dayNames[current.getDay()] + ") " + time });
      current.setDate(current.getDate() + 1);
    }
    return schedules;
  }

  var events = [
    {
      id: "gwangalli-yoga", title: "광안리 선셋 비치요가", season: "summer", location: "광안리",
      venue: "광안리 해변 만남의 광장", category: "휴양", dateNumber: "08.15", dateDay: "SAT", time: "18:30", duration: "70분", seats: 8, reward: 500, price: 3500,
      image: "assets/gwangalli-sunset-yoga.webp", imageAlt: "광안대교와 노을을 바라보며 광안리 해변에서 요가하는 참가자들", themes: ["relax"],
      tags: ["초보자 환영", "매트 제공", "선셋"],
      schedules: [
        { value: "2026-08-15T18:30", label: "2026년 8월 15일 (토) 18:30" },
        { value: "2026-08-22T18:30", label: "2026년 8월 22일 (토) 18:30" }
      ],
      description: "광안대교 너머로 해가 내려앉는 시간, 잔잔한 파도 소리를 들으며 몸과 마음을 천천히 이완하는 초보자용 비치요가입니다.",
      includes: ["요가 매트 대여", "전문 강사 진행", "웰컴 티 1잔"]
    },
    {
      id: "dadaepo-clam-games", title: "다대포 바지락 캐기 & 갯벌 게임", season: "spring", location: "다대포",
      venue: "다대포해수욕장 갯벌 체험존", category: "바다생태", dateNumber: "04.24", dateDay: "SAT", time: "16:00", duration: "4시간", seats: 40, reward: 700, price: 35000,
      image: "assets/spring-clam-game.png", imageAlt: "다대포 갯벌에서 바지락을 캐고 게임을 즐기는 가족과 여행자", themes: ["ecology"],
      tags: ["바지락 캐기", "팀 갯벌 게임", "장화·도구 제공"],
      schedules: [
        { value: "2027-04-24T16:00", label: "2027년 4월 24일 (토) 16:00" },
        { value: "2027-05-01T16:00", label: "2027년 5월 1일 (토) 16:00" }
      ],
      description: "호미로 바지락을 찾아보고 조별 릴레이와 깃발 찾기 게임을 즐기는 가족형 갯벌 체험입니다. 물때와 현장 안전 기준에 따라 프로그램이 조정될 수 있어요.",
      includes: ["장화·호미 대여", "안전요원 동행", "팀 미션 도구"]
    },
    {
      id: "haeundae-parasol", title: "해운대 파라솔 자리 대여", season: "summer", location: "해운대",
      venue: "해운대해수욕장 이벤트존", category: "휴양", dateNumber: "07.01", dateDay: "THU", time: "15:00", duration: "5시간", durationLabel: "대여 시간", calendarBooking: true, seats: 24, reward: 300, price: 20000, capacityUnit: "개", quantityUnit: "개", quantityLabel: "파라솔 수", priceUnit: "파라솔", maxPerBooking: 1,
      image: "assets/summer-parasol.png", imageAlt: "해운대 바다의 지정 파라솔 아래에서 쉬는 여행자들", themes: ["relax"],
      tags: ["파라솔 수로 예약", "5시간 이용", "매일 운영"],
      schedules: createDailySchedules("2027-07-01", "2027-08-31", "15:00"),
      description: "7월 1일부터 8월 31일까지 매일 운영되는 해운대 파라솔 대여입니다. 인원이 아닌 필요한 파라솔 수를 선택해 예약하고 5시간 동안 이용할 수 있어요.",
      includes: ["파라솔 지정석", "비치 매트", "5시간 이용 안내"]
    },
    {
      id: "songjeong-autumn-surf", title: "송정 가을 파도 서핑 체험", season: "autumn", location: "송정",
      venue: "송정해수욕장 서핑존", category: "액티비티", dateNumber: "09.19", dateDay: "SAT", time: "14:00", duration: "120분", seats: 8, reward: 900, price: 55000,
      image: "assets/songjeong-surf.png", imageAlt: "선선한 가을의 송정 바다에서 서핑을 배우는 입문자들", themes: ["activity"],
      tags: ["입문자 가능", "보드·슈트 제공", "안전 교육"],
      schedules: [
        { value: "2026-09-19T14:00", label: "2026년 9월 19일 (토) 14:00" },
        { value: "2026-10-03T14:00", label: "2026년 10월 3일 (토) 14:00" }
      ],
      description: "선선한 바람과 잔잔한 파도를 만나는 가을 입문 서핑입니다. 안전 교육부터 패들링과 테이크오프까지 차근차근 배워요. 소요 시간에는 중간 휴식시간 10분이 포함되어 있습니다.",
      includes: ["서핑보드·슈트", "전문 강사", "안전 교육"]
    },
    {
      id: "cheongsapo-sunrise-contest", title: "청사포 이색 새해 일출사진 대회", season: "winter", location: "청사포",
      venue: "청사포 다릿돌전망대 앞", category: "사진·문화", dateNumber: "01.01", dateDay: "FRI", time: "07:32", duration: "150분", seats: 40, unlimited: true, reward: 1000,
      image: "assets/winter-sunrise-contest.png", imageAlt: "청사포의 새해 일출을 촬영하는 사진 대회 참가자들", themes: ["culture"],
      tags: ["누구나 참가", "휴대폰 참여 가능", "사진 1점 제출"],
      schedules: [{ value: "2027-01-01T07:32", label: "2027년 1월 1일 (금) 07:32" }],
      description: "나이와 촬영 경험에 관계없이 누구나 참가해 새해 첫 일출을 나만의 시선으로 담는 현장 대회입니다. 휴대폰과 카메라 모두 사용할 수 있으며 한 장의 사진을 제출하면 됩니다. 해당 시간은 일출 예정 시간이며, 사진은 당일 23:59까지 제출해 주세요.",
      includes: ["촬영 구역 안내", "작품 제출 가이드", "기념 포토 카드"]
    },
    {
      id: "gijang-crab-boat", title: "기장 꽃게잡이 & 선상 꽃게라면", season: "autumn", location: "기장",
      venue: "대변항 체험어선 승선장", category: "바다생태", dateNumber: "10.24", dateDay: "SAT", time: "02:30", duration: "4시간", seats: 4, reward: 800, price: 65000,
      image: "assets/gijang-crab-fishing.webp", imageAlt: "새벽 기장 앞바다의 조업 어선에서 안전 장비를 착용하고 꽃게 통발을 올리는 네 사람", themes: ["ecology"],
      tags: ["꽃게잡이", "선상 꽃게라면", "구명조끼 제공"],
      schedules: [
        { value: "2026-10-24T02:30", label: "2026년 10월 24일 (토) 02:30" },
        { value: "2026-10-31T02:30", label: "2026년 10월 31일 (토) 02:30" }
      ],
      description: "기장 앞바다로 나가 통발을 올리며 꽃게잡이를 체험하고, 직접 잡은 꽃게를 넣어 끓인 따뜻한 라면을 배 위에서 맛보는 가을 선상 프로그램입니다. 해당 체험은 실제 조업을 나가는 것이므로 새벽에 진행됩니다.",
      includes: ["체험어선 승선", "꽃게잡이 장비", "선상 꽃게라면 1인 1그릇", "구명조끼·안전요원"]
    },
    {
      id: "gwangalli-fireworks", title: "광안리 바다 불꽃축제", season: "autumn", location: "광안리",
      venue: "광안리해수욕장 관람 구역", category: "사진·문화", dateNumber: "11.07", dateDay: "SAT", time: "20:00", duration: "70분", seats: 200, unlimited: true, infoOnly: true, reward: 0,
      image: "assets/gwangalli-fireworks.webp", imageAlt: "광안대교 위 밤하늘을 화려하게 수놓은 광안리 불꽃축제", themes: ["culture"],
      tags: ["예약 없이 관람", "인원 제한 없음", "돗자리·음식 지참 가능"],
      schedules: [{ value: "2026-11-07T20:00", label: "2026년 11월 7일 (토) 20:00" }],
      description: "별도 예약이나 참가 신청 없이 광안리 바다 위를 수놓는 불꽃을 자유롭게 감상하는 무료 행사입니다. 개인 돗자리와 음식은 가져올 수 있으며, 현장에서 돗자리와 음식은 제공하지 않습니다.",
      includes: ["관람 구역 안내", "안전요원 배치", "돗자리·음식 제공 없음"]
    },
    {
      id: "gwangalli-winter-drone", title: "광안리 겨울 바다 드론쇼", season: "winter", location: "광안리",
      venue: "광안리해수욕장 관람 구역", category: "사진·문화", dateNumber: "12.26", dateDay: "SAT", time: "22:00", duration: "20분", seats: 200, unlimited: true, infoOnly: true, reward: 0,
      image: "assets/gwangalli-winter-drone.webp", imageAlt: "겨울 광안리 밤바다와 광안대교 위로 고래와 파도 모양이 펼쳐지는 드론쇼", themes: ["culture"],
      tags: ["예약 없이 관람", "인원 제한 없음", "돗자리·음식 지참 가능"],
      schedules: [{ value: "2026-12-26T22:00", label: "2026년 12월 26일 (토) 22:00" }],
      description: "별도 예약이나 참가 신청 없이 겨울 광안리 밤하늘에 펼쳐지는 드론 퍼포먼스를 자유롭게 관람하는 무료 행사입니다. 본 공연은 한 해를 마무리한다는 의미에서 매주 토요일에 선보이는 드론쇼와 달리 조금 더 길고 더 많은 볼거리를 제공할 예정입니다. 개인 돗자리와 음식은 가져올 수 있으며, 현장 제공 물품과 음식은 없습니다.",
      includes: ["관람 구역 안내", "안전요원 배치", "돗자리·음식 제공 없음"]
    },
    {
      id: "dadaepo-spring-busking", title: "다대포 봄맞이 바다 버스킹", season: "spring", location: "다대포",
      venue: "다대포해수욕장 해변공원", category: "사진·문화", dateNumber: "05.05", dateDay: "WED", time: "16:00", duration: "120분", seats: 20, reward: 200, registrationOnly: true, capacityUnit: "팀", quantityUnit: "팀", maxPerBooking: 1,
      image: "assets/spring-busking.webp", imageAlt: "봄날 다대포 바다 앞 무대에서 공연하는 버스킹 팀과 관객들", themes: ["culture"],
      tags: ["무료 참가", "자유 관람", "참가 신청"],
      schedules: [{ value: "2027-05-05T16:00", label: "2027년 5월 5일 (수) 16:00" }],
      description: "봄바다를 배경으로 지역 뮤지션의 공연을 자유롭게 즐기는 무료 버스킹입니다. 누구나 현장에서 관람할 수 있고, 예약은 좌석 지정이 아닌 참가 신청을 받기 위한 절차입니다.",
      includes: ["자유 관람", "공연 일정 안내", "예약은 참가 신청 용도"]
    },
    {
      id: "haeundae-autumn-busking", title: "해운대 가을맞이 바다 버스킹", season: "autumn", location: "해운대",
      venue: "해운대해수욕장 이벤트광장", category: "사진·문화", dateNumber: "09.26", dateDay: "SAT", time: "17:00", duration: "120분", seats: 20, reward: 200, registrationOnly: true, capacityUnit: "팀", quantityUnit: "팀", quantityLabel: "참가 팀", maxPerBooking: 1,
      image: "assets/autumn-busking.webp", imageAlt: "단풍과 억새로 꾸민 가을 해운대 바다 무대에서 공연하는 버스킹 팀", themes: ["culture"],
      tags: ["20팀 신청", "가을 버스킹", "참가 신청"],
      schedules: [{ value: "2026-09-26T17:00", label: "2026년 9월 26일 (토) 17:00" }],
      description: "선선한 가을 바다를 배경으로 공연할 버스킹 20팀을 모집합니다. 예약은 좌석 지정이 아닌 공연 참가 팀 신청을 받기 위한 절차이며, 관람객은 자유롭게 공연을 즐길 수 있습니다.",
      includes: ["자유 관람", "공연 일정 안내", "예약은 참가 신청 용도"]
    },
    {
      id: "oryukdo-coastal-plants", title: "오륙도 해안 식물 관찰 및 해설", season: "spring", location: "오륙도",
      venue: "오륙도 해맞이공원 안내소", category: "바다생태", dateNumber: "04.11", dateDay: "SUN", time: "10:00", duration: "100분", seats: 16, reward: 400,
      image: "assets/oryukdo-coastal-plants.webp", imageAlt: "오륙도 해안 절벽에 자라는 해국과 갯메꽃을 관찰하는 모습", themes: ["ecology"],
      tags: ["무료 참가", "해안 식물 관찰", "전문 해설"],
      schedules: [
        { value: "2027-04-11T10:00", label: "2027년 4월 11일 (일) 10:00" },
        { value: "2027-04-18T10:00", label: "2027년 4월 18일 (일) 10:00" }
      ],
      description: "오륙도 해안길을 천천히 걸으며 갯메꽃과 해국 등 바닷바람에 적응해 살아가는 해안 식물을 관찰하고 전문 해설을 듣는 봄 생태 프로그램입니다.",
      includes: ["전문 생태 해설", "해안 식물 관찰 노트", "휴대용 돋보기 대여"]
    },
    {
      id: "dadaepo-beach-sketch", title: "다대포 해변 풍경 스케치 대회", season: "summer", location: "다대포",
      venue: "다대포해수욕장 해변공원", category: "사진·문화", dateNumber: "07.17", dateDay: "SAT", time: "15:00", duration: "4시간", seats: 100, reward: 300, capacityUnit: "팀", quantityUnit: "팀", quantityLabel: "참가 팀", maxPerBooking: 1,
      image: "assets/dadaepo-sketch-contest.webp", imageAlt: "다대포 해변에서 바다 풍경을 스케치하는 대회 참가자들", themes: ["culture"],
      tags: ["무료 참가", "100팀 모집", "우승자 추가 포인트"],
      schedules: [{ value: "2027-07-17T15:00", label: "2027년 7월 17일 (토) 15:00" }],
      description: "여름 다대포의 바다와 노을을 4시간 동안 자유롭게 그려 현장에서 작품을 제출하는 무료 스케치 대회입니다. 우승자에게는 추가 SEA 포인트가 지급될 예정이며, 종이와 채색 도구 등 개인 화구를 준비해 주세요.",
      includes: ["참가 번호표", "우승자 추가 포인트 지급 예정", "작품 제출 안내", "개인 화구 제공 없음"]
    },
    {
      id: "cheongsapo-breakwater-fishing", title: "청사포 겨울 방파제 낚시", season: "winter", location: "청사포",
      venue: "청사포항 안전 낚시 구역", category: "바다생태", dateNumber: "12.18", dateDay: "FRI", time: "13:00", duration: "180분", seats: 30, reward: 300,
      image: "assets/cheongsapo-winter-fishing.webp", imageAlt: "겨울 아침 청사포 방파제의 안전 구역에서 낚시를 즐기는 참가자들", themes: ["ecology"],
      tags: ["무료 참가", "개인 장비 필수", "장비 제공 없음"],
      schedules: [{ value: "2026-12-18T13:00", label: "2026년 12월 18일 (금) 13:00" }],
      description: "겨울 청사포 방파제의 지정된 안전 구역에서 자유롭게 낚시를 즐기는 무료 행사입니다. 낚싯대, 미끼, 구명조끼 등 필요한 장비는 제공하지 않으므로 반드시 개인 장비를 준비해 주세요.",
      includes: ["안전 구역 안내", "현장 안전요원", "낚시 장비·미끼 제공 없음"]
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
      id: "story-igidae", author: "해나", title: "이기대에서 잠시 멈춘 아침", location: "이기대", date: "2026.08.09",
      image: "assets/story-igidae-walk.webp", userCreated: false,
      content: "바닷길을 걷다가 전망대에 잠시 멈췄어요. 파도와 멀리 보이는 도시를 한 장에 담으니 평범한 아침도 특별한 추억이 됐습니다."
    },
    {
      id: "story-huinnyeoul", author: "민준네", title: "흰여울 앞 작은 배들", location: "영도", date: "2026.07.26",
      image: "assets/story-huinnyeoul-boats.webp", userCreated: false,
      content: "동네 아래 작은 포구에 알록달록한 배들이 쉬고 있었어요. 갈매기와 잔잔한 물결까지 부산다운 오후 풍경으로 남겼습니다."
    },
    {
      id: "story-sea-glass", author: "지윤", title: "모래 위에서 찾은 작은 바다", location: "송도", date: "2026.08.07",
      image: "assets/story-sea-glass.webp", userCreated: false,
      content: "파도 가까이에서 조개와 바다유리를 하나씩 찾았어요. 작은 조각들을 펼쳐 놓으니 오늘 걸었던 바닷길이 그대로 떠올랐습니다."
    }
  ];

  var exampleMyPhoto = {
    id: "my-photo-example", author: "김바다", title: "바다가 보이는 영도 골목", location: "영도", date: "2026.08.03",
    image: "assets/story-yeongdo-cat.webp", userCreated: false, example: true,
    content: "파란 담벼락 옆 고양이와 골목 끝 반짝이는 바다를 함께 담았어요. 나만의 부산 바다 사진은 이렇게 한곳에서 모아볼 수 있어요."
  };

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
  function formatCapacity(event, count) { return count + (event.capacityUnit || "자리"); }
  function formatQuantity(event, count) { return count + (event.quantityUnit || "명"); }
  function getPriceUnit(event) { return event.priceUnit || "인"; }
  function formatReward(event) { return event.reward > 0 ? "+" + formatPoints(event.reward) + " SEA P" : "포인트 지급 없음"; }
  function formatAvailability(event, count) {
    if (event.unlimited) return "인원 제한 없음";
    return formatCapacity(event, count) + (event.registrationOnly ? " 신청 가능" : " 남음");
  }

  function getCalendarScheduleKey(event) {
    return event.schedules.reduce(function (earliest, schedule) {
      var monthDayAndTime = schedule.value.slice(5);
      return !earliest || monthDayAndTime < earliest ? monthDayAndTime : earliest;
    }, "");
  }

  function getReservedCount(eventId, schedule) {
    return bookings.filter(function (booking) {
      return booking.eventId === eventId && booking.status === "reserved" && (!schedule || booking.schedule === schedule);
    }).reduce(function (sum, booking) { return sum + Number(booking.quantity || 0); }, 0);
  }

  function getRemaining(event, scheduleValue) {
    if (event.unlimited) return Infinity;
    var selectedSchedule = scheduleValue || (event.schedules[0] && event.schedules[0].value);
    return Math.max(0, event.seats - getReservedCount(event.id, selectedSchedule));
  }

  function hasAvailableSchedule(event) {
    return event.schedules.some(function (schedule) { return getRemaining(event, schedule.value) > 0; });
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
    var available = hasAvailableSchedule(event);
    var price = Number(event.price || 0);
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
      '<div class="event-price"><strong>' + (price ? formatPoints(price) + "원" : "무료") + '</strong><small>' + (price ? "1" + getPriceUnit(event) + " 기준 · " : "") + formatReward(event) + '</small><span class="event-remaining">' + formatAvailability(event, remaining) + '</span></div>',
      '<button type="button" data-open-event="' + escapeHtml(event.id) + '"' + (!available ? ' class="sold-out"' : "") + ">" + (!available ? "마감" : "자세히 보기") + " " + icon("arrow") + "</button>",
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
    }).sort(function (firstEvent, secondEvent) {
      var dateDifference = getCalendarScheduleKey(firstEvent).localeCompare(getCalendarScheduleKey(secondEvent));
      return dateDifference || firstEvent.title.localeCompare(secondEvent.title, "ko");
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
    var available = hasAvailableSchedule(event);
    var price = Number(event.price || 0);
    var includes = event.includes.map(function (item) { return "<li>" + icon("check") + "<span>" + escapeHtml(item) + "</span></li>"; }).join("");
    byId("dialogBody").innerHTML = [
      '<section class="dialog-detail"><div class="dialog-hero">',
      '<img src="' + escapeHtml(event.image) + '" alt="' + escapeHtml(event.imageAlt) + '" decoding="async">',
      '<div class="dialog-hero-copy"><span>' + escapeHtml(event.category) + '</span><h2 id="dialogTitle">' + escapeHtml(event.title) + "</h2><p>" + icon("pin") + " " + escapeHtml(event.location + " · " + event.venue) + "</p></div></div>",
      '<div class="dialog-content"><div class="detail-layout"><div class="detail-copy">',
      "<h3>이번 바다는 이렇게 즐겨요</h3><p>" + escapeHtml(event.description) + '</p><ul class="include-list">' + includes + "</ul></div>",
      '<aside class="detail-summary">',
      '<div class="summary-row"><span>일정</span><strong>' + escapeHtml(event.schedules[0].label) + "</strong></div>",
      '<div class="summary-row"><span>' + escapeHtml(event.durationLabel || "소요 시간") + '</span><strong>' + escapeHtml(event.duration) + "</strong></div>",
      '<div class="summary-row"><span>' + (event.infoOnly ? "관람 안내" : "첫 일정 신청 가능") + '</span><strong>' + (event.infoOnly ? "예약 없이 자유 관람" : formatAvailability(event, remaining)) + "</strong></div>",
      '<div class="summary-row price-summary-row"><span>이용 요금</span><strong>' + (price ? "1" + getPriceUnit(event) + " " + formatPoints(price) + "원" : "무료") + "</strong></div>",
      '<div class="summary-row reward-row"><span>SEA 포인트</span><strong>' + formatReward(event) + "</strong></div>",
      event.infoOnly
        ? '<div class="prototype-note">안내 전용 이벤트입니다. 별도 예약 없이 행사 당일 자유롭게 관람해 주세요.</div>'
        : '<button class="button button-dark" id="reserveFromDetail" type="button"' + (!available ? " disabled" : "") + ">" + (!available ? (event.registrationOnly ? "신청 마감" : "예약 마감") : event.registrationOnly ? "참가 신청하기" : "날짜와 인원 선택") + " " + icon("arrow") + "</button>",
      "</aside></div></div></section>"
    ].join("");
    var reserveButton = byId("reserveFromDetail");
    if (reserveButton && available) reserveButton.addEventListener("click", function () { bookingQty = 1; renderBookingStep(event); });
  }

  function renderBookingStep(event) {
    var unitPrice = Number(event.price || 0);
    var firstAvailableSchedule = event.schedules.find(function (schedule) { return getRemaining(event, schedule.value) > 0; }) || event.schedules[0];
    var remaining = getRemaining(event, firstAvailableSchedule.value);
    var maxQuantity = 1;
    var options = event.schedules.map(function (schedule) {
      var scheduleRemaining = getRemaining(event, schedule.value);
      return '<option value="' + escapeHtml(schedule.value) + '"' + (schedule.value === firstAvailableSchedule.value ? " selected" : "") + (scheduleRemaining === 0 ? " disabled" : "") + '>' + escapeHtml(schedule.label) + " · " + formatAvailability(event, scheduleRemaining) + "</option>";
    }).join("");
    byId("dialogBody").innerHTML = [
      '<section class="booking-step"><header class="step-header"><span>RESERVATION · STEP 2 OF 2</span>',
      '<h2 id="dialogTitle">' + (event.registrationOnly ? "버스킹 참가를 신청해 주세요" : "방문할 날짜를 골라주세요") + '</h2><p>' + (event.registrationOnly ? "참석은 자유롭고, 신청 정보는 예상 참여 인원 확인에 사용됩니다." : "입력한 예약 정보는 이 브라우저에만 저장됩니다.") + "</p></header>",
      '<div class="booking-layout"><form class="booking-form" id="bookingForm">',
      event.calendarBooking
        ? '<label class="form-field"><span>방문 일정</span><input id="bookingDate" type="date" min="2027-07-01" max="2027-08-31" value="' + firstAvailableSchedule.value.slice(0, 10) + '" required><input id="bookingSchedule" name="schedule" type="hidden" value="' + escapeHtml(firstAvailableSchedule.value) + '"><small>달력에서 7월 1일~8월 31일 중 날짜를 선택해 주세요.</small></label>'
        : '<label class="form-field"><span>방문 일정</span><select id="bookingSchedule" name="schedule" required>' + options + "</select></label>",
      '<div class="schedule-remaining" aria-live="polite"><span>선택 일정 신청 가능</span><strong id="selectedScheduleRemaining">' + formatAvailability(event, remaining) + '</strong></div>',
      '<div class="guest-field"><span>' + (event.quantityLabel || (event.quantityUnit === "팀" ? "참가 팀" : "참여 인원")) + '<small id="bookingMaxGuide">한 번에 최대 ' + formatQuantity(event, maxQuantity) + '</small></span><div class="stepper">',
      '<button type="button" id="qtyMinus" aria-label="인원 줄이기">' + icon("minus") + '</button><output id="qtyOutput" aria-live="polite">1</output><button type="button" id="qtyPlus" aria-label="인원 늘리기">' + icon("plus") + "</button></div></div>",
      '<div class="form-grid"><label class="form-field"><span>예약자 이름</span><input name="name" autocomplete="name" maxlength="30" placeholder="이름을 입력해 주세요" required></label>',
      '<label class="form-field"><span>연락처 또는 이메일</span><input name="contact" autocomplete="email" maxlength="60" placeholder="example@email.com" required></label></div>',
      '<button class="back-link" id="backToDetail" type="button">← 행사 정보로 돌아가기</button></form>',
      '<aside class="booking-summary-card"><div class="summary-event"><img src="' + escapeHtml(event.image) + '" alt="' + escapeHtml(event.imageAlt) + '" decoding="async"><div><h3>' + escapeHtml(event.title) + "</h3><p>" + escapeHtml(event.location + " · " + event.time) + "</p></div></div>",
      '<div class="price-row"><span>1' + getPriceUnit(event) + ' 이용 요금</span><strong>' + (unitPrice ? formatPoints(unitPrice) + "원" : "무료") + "</strong></div>",
      '<div class="price-row total payment-total"><span>총 결제 금액</span><strong id="bookingTotal">' + formatPoints(unitPrice) + "원</strong></div>",
      '<div class="price-row total"><span>적립 예정</span><strong>+' + formatPoints(event.reward) + " SEA P</strong></div>",
      '<p class="prototype-note reward-note">예약 1건 기준 · 참여 완료 후 적립</p>',
      '<button class="button button-coral" type="submit" form="bookingForm" id="confirmBooking">' + (unitPrice ? "결제 및 예약 확정하기" : event.registrationOnly ? "무료 참가 신청하기" : "예약 확정하기") + "</button>",
      '<p class="prototype-note">' + (unitPrice ? "결제 기능 시연용이며 실제 카드 결제는 발생하지 않습니다." : "서비스 시연용 예약이며 실제 현장 예약으로 연결되지는 않습니다.") + "</p></aside></div></section>"
    ].join("");

    function updateQuantity(next) {
      bookingQty = Math.max(1, Math.min(maxQuantity, next));
      byId("qtyOutput").textContent = String(bookingQty);
      byId("bookingTotal").textContent = formatPoints(unitPrice * bookingQty) + "원";
      byId("qtyMinus").disabled = bookingQty <= 1;
      byId("qtyPlus").disabled = bookingQty >= maxQuantity;
    }
    function updateScheduleAvailability() {
      var scheduleRemaining = getRemaining(event, byId("bookingSchedule").value);
      maxQuantity = 1;
      byId("selectedScheduleRemaining").textContent = formatAvailability(event, scheduleRemaining);
      byId("bookingMaxGuide").textContent = "한 번에 최대 " + formatQuantity(event, maxQuantity);
      byId("confirmBooking").disabled = scheduleRemaining === 0;
      updateQuantity(Math.min(bookingQty, maxQuantity));
    }
    byId("qtyMinus").addEventListener("click", function () { updateQuantity(bookingQty - 1); });
    byId("qtyPlus").addEventListener("click", function () { updateQuantity(bookingQty + 1); });
    byId("bookingSchedule").addEventListener("change", updateScheduleAvailability);
    if (event.calendarBooking) byId("bookingDate").addEventListener("change", function () {
      byId("bookingSchedule").value = this.value + "T15:00";
      updateScheduleAvailability();
    });
    byId("backToDetail").addEventListener("click", function () { renderDialogDetail(event); });
    byId("bookingForm").addEventListener("submit", function (formEvent) {
      formEvent.preventDefault();
      var formData = new FormData(formEvent.currentTarget);
      var scheduleValue = String(formData.get("schedule"));
      var schedule = event.schedules.find(function (item) { return item.value === scheduleValue; }) || event.schedules[0];
      var contactValue = String(formData.get("contact")).trim().toLowerCase();
      var duplicateBooking = bookings.some(function (booking) {
        return booking.eventId === event.id && booking.status !== "cancelled" && String(booking.contact || "").trim().toLowerCase() === contactValue;
      });
      if (duplicateBooking) {
        showToast("같은 연락처로는 이 이벤트를 한 번만 예약할 수 있어요.");
        return;
      }
      if (!event.unlimited && event.seats - getReservedCount(event.id, schedule.value) < bookingQty) {
        showToast("남은 자리가 변경됐어요. 인원을 다시 확인해 주세요.");
        renderBookingStep(event);
        return;
      }
      var booking = {
        id: createBookingCode(), eventId: event.id, schedule: schedule.value, scheduleLabel: schedule.label,
        quantity: 1, name: String(formData.get("name")).trim(), contact: contactValue,
        unitPrice: unitPrice, totalPrice: unitPrice * bookingQty, paymentStatus: unitPrice ? "paid-demo" : "free", registrationOnly: Boolean(event.registrationOnly),
        status: "reserved", rewarded: false, createdAt: new Date().toISOString()
      };
      bookings.unshift(booking);
      if (!saveState()) {
        bookings.shift();
        return;
      }
      renderAllAccountData(); renderEvents(); renderBookingSuccess(event, booking);
    });
    updateScheduleAvailability();
  }

  function createBookingCode() {
    var stamp = new Date().toISOString().slice(5, 10).replace("-", "");
    return "OS-" + stamp + "-" + Math.floor(1000 + Math.random() * 9000);
  }

  function renderBookingSuccess(event, booking) {
    var remaining = getRemaining(event, booking.schedule);
    var paymentMessage = Number(booking.totalPrice || 0)
      ? '<p class="success-payment"><span>결제 금액</span><strong>' + formatPoints(booking.totalPrice) + '원</strong><small>시연 결제 완료</small></p>'
      : "";
    byId("dialogBody").innerHTML = [
      '<section class="success-step"><div class="success-inner"><span class="success-icon">' + icon("check") + "</span>",
      '<h2 id="dialogTitle">' + (event.registrationOnly ? "참가 신청 완료!" : "바다 갈 준비 완료!") + '</h2><p>' + (event.registrationOnly ? "자유롭게 방문해 공연을 즐겨주세요. 아래 신청 번호로 참여 인원을 확인할 수 있어요." : "예약이 확정됐어요. 행사 당일 아래 예약 번호를 보여주세요.") + '<br>참여 완료 후 ' + formatPoints(event.reward) + " SEA 포인트가 지급됩니다.</p>",
      '<div class="booking-code"><span>예약 번호</span><strong>' + escapeHtml(booking.id) + "</strong></div>",
      paymentMessage,
      '<p class="success-remaining">' + (event.unlimited ? '인원 제한 없이 참가 신청이 완료됐어요.' : '선택한 일정은 이제 <strong>' + formatCapacity(event, remaining) + '</strong> 남았어요.') + '</p>',
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

  function bookingStatus(booking, event) {
    if (booking.status === "completed") return '<span class="status-label completed">참여 완료</span>';
    if (booking.status === "cancelled") return '<span class="status-label cancelled">' + (event && event.registrationOnly ? "신청 취소" : "예약 취소") + "</span>";
    return '<span class="status-label">' + (event && event.registrationOnly ? "신청 완료" : "예약 확정") + "</span>";
  }

  function bookingActions(booking, event) {
    if (booking.status === "completed") return bookingStatus(booking, event) + '<span class="mini-action muted">+' + formatPoints(event.reward) + " SEA P 지급</span>";
    if (booking.status === "cancelled") return bookingStatus(booking, event);
    return bookingStatus(booking, event) + '<span class="mini-action attendance-pending">현장 확인 후 포인트 지급</span><button class="mini-action muted" type="button" data-cancel-booking="' + escapeHtml(booking.id) + '">' + (event.registrationOnly ? "신청 취소" : "예약 취소") + "</button>";
  }

  function renderBookings() {
    var upcomingBookings = bookings.filter(function (booking) { return booking.status === "reserved"; });
    var completedBookings = bookings.filter(function (booking) {
      return booking.status === "completed" && booking.eventId === "gwangalli-yoga";
    });
    var activeCount = upcomingBookings.length + completedBookings.length;
    byId("bookingCount").textContent = activeCount + "건";
    byId("upcomingBookingCount").textContent = upcomingBookings.length + "건";
    byId("completedBookingCount").textContent = completedBookings.length + "건";

    function bookingMarkup(booking) {
      var event = getEvent(booking.eventId);
      if (!event) return "";
      var paymentText = Number(booking.totalPrice || 0) ? " · 결제 " + formatPoints(booking.totalPrice) + "원" : "";
      return '<article class="booking-item"><img class="booking-thumb" src="' + escapeHtml(event.image) + '" alt="' + escapeHtml(event.title) + '" loading="lazy" decoding="async"><div class="booking-info"><span>' + escapeHtml(booking.id) + "</span><h4>" + escapeHtml(event.title) + "</h4><p>" + escapeHtml(booking.scheduleLabel) + " · " + formatQuantity(event, Number(booking.quantity || 1)) + paymentText + '</p></div><div class="booking-actions">' + bookingActions(booking, event) + "</div></article>";
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
    byId("barcodePoints").textContent = formatPoints(wallet.points);
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

  function cancelBooking(bookingId) {
    var booking = bookings.find(function (item) { return item.id === bookingId; });
    if (!booking || booking.status !== "reserved" || !window.confirm("이 예약을 취소할까요?")) return;
    booking.status = "cancelled"; booking.cancelledAt = new Date().toISOString();
    saveState(); renderAllAccountData(); renderEvents(); showToast("예약이 취소됐습니다.");
  }

  function storyCard(story) {
    var editButton = story.userCreated ? '<button class="story-edit" type="button" data-edit-story="' + escapeHtml(story.id) + '" aria-label="이야기 수정">수정</button>' : "";
    var deleteButton = story.userCreated ? '<button class="story-delete" type="button" data-delete-story="' + escapeHtml(story.id) + '" aria-label="이야기 삭제">' + icon("trash") + "</button>" : "";
    var exampleBadge = story.example ? '<span class="story-example-badge">예시 사진</span>' : "";
    return [
      '<article class="story-card" data-story-id="' + escapeHtml(story.id) + '">',
      '<div class="story-visual"><img src="' + escapeHtml(story.image) + '" alt="' + escapeHtml(story.title) + '" loading="lazy" decoding="async">' + exampleBadge + editButton + deleteButton + "</div>",
      '<div class="story-body"><p class="story-meta"><span>' + escapeHtml(story.location) + "</span> · " + escapeHtml(story.date) + "</p>",
      "<h3>" + escapeHtml(story.title) + "</h3><p>" + escapeHtml(story.content) + '</p><strong class="story-author">by. ' + escapeHtml(story.author) + "</strong></div></article>"
    ].join("");
  }

  function renderStories() {
    return;
  }

  function renderMyPhotos() {
    var grid = byId("myPhotoGrid");
    var empty = byId("myPhotosEmpty");
    var displayedPhotos = userStories.concat([exampleMyPhoto]);
    byId("myPhotoCount").textContent = String(displayedPhotos.length);
    grid.innerHTML = displayedPhotos.map(storyCard).join("");
    grid.classList.remove("hidden");
    empty.classList.add("hidden");
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
    byId("storyImageStatus").textContent = "사진은 저장 전에 브라우저에 맞게 압축됩니다.";
    byId("storySubmit").disabled = false;
    byId("storySubmit").textContent = "내 사진에 저장하기";
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
    byId("my-photos").scrollIntoView({ behavior: "smooth", block: "start" });
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
    if (!window.confirm("이 사진과 이야기를 삭제할까요?")) return;
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
    byId("openPointUse").addEventListener("click", function () {
      var guide = byId("pointUseGuide");
      var expanded = guide.classList.toggle("hidden") === false;
      this.setAttribute("aria-expanded", String(expanded));
      this.textContent = expanded ? "포인트 사용 안내 닫기" : "포인트 사용하기";
    });
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
        byId("my-photos").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    byId("cancelStoryForm").addEventListener("click", function () { toggleStoryForm(false); });
    byId("storyImage").addEventListener("change", function () { handleStoryImage(this.files && this.files[0]); });
    byId("storyForm").addEventListener("submit", submitStory);

    document.body.addEventListener("click", function (clickEvent) {
      var openButton = clickEvent.target.closest("[data-open-event]");
      var cancelButton = clickEvent.target.closest("[data-cancel-booking]");
      var deleteButton = clickEvent.target.closest("[data-delete-story]");
      var editButton = clickEvent.target.closest("[data-edit-story]");
      var scrollButton = clickEvent.target.closest("[data-scroll]");
      if (openButton) openEvent(openButton.getAttribute("data-open-event"));
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

  function initHeroSlider() {
    var slides = Array.from(document.querySelectorAll("[data-hero-background]"));
    var controls = Array.from(document.querySelectorAll("[data-hero-slide]"));
    if (slides.length < 2) return;
    var activeIndex = 0;
    var timer = null;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function showSlide(index) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) { slide.classList.toggle("active", slideIndex === activeIndex); });
      controls.forEach(function (control, controlIndex) {
        var active = controlIndex === activeIndex;
        control.classList.toggle("active", active);
        control.setAttribute("aria-pressed", String(active));
      });
    }

    function startAutoPlay() {
      if (reduceMotion || document.hidden) return;
      window.clearInterval(timer);
      timer = window.setInterval(function () { showSlide(activeIndex + 1); }, 6500);
    }

    controls.forEach(function (control) {
      control.addEventListener("click", function () {
        showSlide(Number(control.getAttribute("data-hero-slide")) || 0);
        startAutoPlay();
      });
    });
    document.addEventListener("visibilitychange", function () {
      window.clearInterval(timer);
      if (!document.hidden) startAutoPlay();
    });
    startAutoPlay();
  }

  function init() {
    if (!Array.isArray(bookings)) bookings = [copy(defaultBooking)];
    if (localStorage.getItem(POINT_USAGE_FIX) !== "done") {
      wallet.points = Math.max(0, Number(wallet.points || 0) - 200);
      localStorage.setItem(POINT_USAGE_FIX, "done");
    }
    if (localStorage.getItem(BUSKING_REWARD_FIX) !== "done") {
      var invalidBookingIds = bookings.filter(function (booking) {
        return booking.eventId === "dadaepo-spring-busking";
      }).map(function (booking) { return booking.id; });
      if (!Array.isArray(wallet.history)) wallet.history = [];
      var invalidRewards = wallet.history.filter(function (item) {
        return invalidBookingIds.indexOf(item.bookingId) !== -1 || String(item.title || "").indexOf("다대포 봄맞이 바다 버스킹") !== -1;
      });
      var invalidPoints = invalidRewards.reduce(function (sum, item) { return sum + Number(item.points || 0); }, 0);
      wallet.history = wallet.history.filter(function (item) { return invalidRewards.indexOf(item) === -1; });
      wallet.points = Math.max(0, wallet.points - invalidPoints);
      localStorage.setItem(BUSKING_REWARD_FIX, "done");
    }
    bookings = bookings.filter(function (booking) {
      return booking.eventId !== "dadaepo-spring-busking" || booking.status !== "completed";
    });
    if (!wallet || typeof wallet.points !== "number") wallet = copy(defaultWallet);
    if (!Array.isArray(userStories)) userStories = [];
    saveState(); renderSeason("summer"); renderEvents(); renderAllAccountData(); renderStories(); renderMyPhotos(); initInteractions(); initHeroSlider();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
