// =========================================================
// BNCP AI Assistant - app.js
// index.html에서 <script src="app.js"></script>로 로드됩니다.
// =========================================================

const BACKEND_API_URL = "https://odd-butterfly-b936.chogak1449.workers.dev/";

// 대체 기본 식단 데이터 (weeklyMenu.json 로드 실패 시에만 사용)
const fallbackMenuData = {
  weekRange: "안내 식단 예시",
  weeklyData: [
    {
      date: "월요일",
      meals: {
        "조식 (06:00~07:00)": ["쌀밥", "콩나물국", "제육볶음", "포기김치"],
        "중식 (11:30~12:30)": ["잡곡밥", "김치찌개", "돈까스&소스", "깍두기", "음료"],
        "석식 (17:30~18:30)": ["볶음밥", "계란파국", "닭강정 (특식)", "단무지"]
      }
    },
    {
      date: "화요일",
      meals: {
        "조식 (06:00~07:00)": ["쌀밥", "시래기국", "계란말이", "열무김치"],
        "중식 (11:30~12:30)": ["비빔밥", "콩나물냉국", "떡갈비구이", "포기김치"],
        "석식 (17:30~18:30)": ["쌀밥", "부대찌개", "생선구이", "총각김치"]
      }
    }
  ]
};

// welfare.json 로드 실패 시 사용할 최소 폴백 데이터
const fallbackWelfareData = {
  items: [
    { no: "01", title: "건강검진", target: "전 임직원 및 배우자", description: "임원(정밀검진), 직원(종합검진) 지원 / 순천향대 서울병원 등 지정병원 이용", contact: "김민석 사원 · 02-729-5757 · ms085@hanwha.com" },
    { no: "02", title: "경조휴가 및 경조금", target: "전 임직원", description: "본인/자녀 결혼, 출산, 본인/가족 사망 등 경조금, 경조휴가, 화환, 장례용품 지원", contact: "박성준 사원 · 010-7343-0634 · psj0523@hanwha.com" },
    { no: "-", title: "전체 항목 로드 실패", target: "-", description: "welfare.json을 불러오지 못했습니다. 네트워크 상태를 확인하거나 담당자에게 문의해주세요.", contact: "인사지원팀" }
  ]
};

let welfareData = [];
let weeklyData = [];
let weekRange = "";
let currentTabIndex = 0;

// 클럽하우스/라운지 예약 - 화면에 표시된 기존 예약 내역 (선택 사항, 있으면 화면 하단에 참고용으로 노출 가능)
let clubhouseReservations = [];

async function loadWelfareData() {
  try {
    const response = await fetch("./welfare.json?v=" + Date.now(), { cache: "no-store" });
    if (!response.ok) throw new Error("welfare.json을 찾을 수 없습니다.");
    const data = await response.json();
    welfareData = data.items || [];
  } catch (err) {
    console.error(err);
    welfareData = fallbackWelfareData.items;
  }
}

// 식단 데이터 수신 로직
async function loadMenuData() {
  try {
    const response = await fetch("./weeklyMenu.json?v=" + Date.now(), { cache: "no-store" });
    if (!response.ok) throw new Error("weeklyMenu.json을 찾을 수 없습니다.");
    const data = await response.json();
    setupMenuData(data);
  } catch (err) {
    console.error(err);
    setupMenuData(fallbackMenuData);
  }
}

function setupMenuData(data) {
  weeklyData = data.weeklyData || [];
  weekRange = data.weekRange || "";
  const title = document.getElementById("menuModalTitle");
  title.innerHTML = data.weekRange ? `주간 식단표 (${data.weekRange})` : "주간 식단표";

  currentTabIndex = 0;
  renderMenuTabs();
  showMealDay(0);
}

// 클럽하우스/라운지 예약 - 실제 저장된 신청 내역을 Worker(KV)에서 불러와 표시
async function refreshClubhouseList() {
  const listArea = document.getElementById('clubhouseListArea');
  if (!listArea) return;
  listArea.innerHTML = '<p style="color:#9aa0a6; font-size:13px;">신청 내역 불러오는 중...</p>';

  try {
    const response = await fetch(BACKEND_API_URL + "?type=clubhouse_list", { cache: "no-store" });
    if (!response.ok) throw new Error("서버 응답 오류: " + response.status);
    const data = await response.json();
    clubhouseReservations = data.reservations || [];
    renderClubhouseList(clubhouseReservations);
  } catch (err) {
    console.error("클럽하우스 예약 조회 에러:", err);
    listArea.innerHTML = '<p style="color:#9aa0a6; font-size:13px;">신청 내역을 불러오지 못했습니다.</p>';
  }
}

function renderClubhouseList(reservations) {
  const listArea = document.getElementById('clubhouseListArea');
  if (!listArea) return;

  if (!reservations || reservations.length === 0) {
    listArea.innerHTML = '<p style="color:#9aa0a6; font-size:13px;">등록된 예약 신청이 없습니다.</p>';
    return;
  }

  // 최근 20건만 표시
  const rows = reservations.slice(0, 20).map(r => {
    const items = (r.providedItems && r.providedItems.length) ? r.providedItems.join(', ') : '-';
    const extra = r.additionalRequest ? escapeHTML(r.additionalRequest) : '-';
    return `
      <div class="res-item" data-res-id="${escapeHTML(r.id)}">
        <div style="color:#8ab4f8; font-weight:600; margin-bottom:4px;">
          ${escapeHTML(r.usageDate)} · ${escapeHTML(r.location)} · ${escapeHTML(r.team)}
        </div>
        <div>신청자: ${escapeHTML(r.applicant)} / 인원: ${escapeHTML(String(r.headcount))}명</div>
        <div>기본 제공: ${escapeHTML(items)}</div>
        <div>추가 요청: ${extra}</div>
        <button class="res-cancel-btn" onclick="handleCancelReservation('${escapeHTML(r.id)}', this)">예약 취소</button>
      </div>
    `;
  }).join('');

  listArea.innerHTML = rows;
}

// 클럽하우스/라운지 예약 취소
// Worker(odd-butterfly-b936)의 취소 API(type: clubhouse_reservation_cancel)를 호출합니다.
async function handleCancelReservation(id, btn) {
  if (!confirm('이 예약을 취소하시겠습니까?')) return;

  if (btn) {
    btn.disabled = true;
    btn.textContent = '취소 처리 중...';
  }

  try {
    const response = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'clubhouse_reservation_cancel', id })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || '취소 처리에 실패했습니다.');
    }

    // 취소 성공 시 목록 다시 불러오기
    await refreshClubhouseList();
  } catch (err) {
    console.error('클럽하우스 예약 취소 에러:', err);
    alert('⚠️ 예약 취소 중 오류가 발생했습니다.\n' + err.message);
    if (btn) {
      btn.disabled = false;
      btn.textContent = '예약 취소';
    }
  }
}

// AI 검색: 화면에 표시되는 것과 동일한 실제 식단표/복리후생 데이터를
// 백엔드(Worker)로 함께 전송하여, AI가 그 데이터를 근거로만 답하도록 함.
// -> 이렇게 하면 "질문했을 때 답변"과 "화면 데이터"가 항상 일치한다.
async function handleSearch() {
  const inputInput = document.getElementById('userInput');
  const responseArea = document.getElementById('responseArea');
  const query = inputInput.value.trim();

  if (!query) return;

  inputInput.value = "";
  inputInput.disabled = true;
  responseArea.style.display = "block";
  responseArea.innerHTML = "🤖 AI가 답변을 작성 중입니다...";

  // 아직 식단/복리후생 데이터가 로드되지 않았다면 먼저 로드
  if (!weeklyData || weeklyData.length === 0) {
    await loadMenuData();
  }
  if (!welfareData || welfareData.length === 0) {
    await loadWelfareData();
  }

  try {
    const response = await fetch(BACKEND_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: query,
        // 화면에 실제로 표시 중인 데이터를 그대로 전달
        weeklyMenu: { weekRange: weekRange, weeklyData: weeklyData },
        welfare: { items: welfareData }
      }),
    });

    if (!response.ok) throw new Error("서버 응답 오류: " + response.status);

    const data = await response.json();
    const aiReply = data.reply || data.response || "답변을 수신했습니다.";

    responseArea.innerHTML = "<strong>🤖 AI 비서 답변:</strong><br><br>" + escapeHTML(aiReply);

  } catch (error) {
    console.error("통신 에러:", error);
    responseArea.innerHTML = "⚠️ 답변을 불러오는 중 오류가 발생했습니다.<br>네트워크 상태 또는 Cloudflare Worker 연동 설정을 확인해주세요.";
  } finally {
    inputInput.disabled = false;
    inputInput.focus();
  }
}

function escapeHTML(str) {
  return String(str).replace(/[&<>'"]/g,
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Modal Control Functions
async function openMenuModal() {
  document.getElementById("menuModal").style.display = "flex";
  await loadMenuData();
}

function openGuideModal() {
  document.getElementById('guideModal').style.display = 'flex';
}

function openHaircutModal() {
  document.getElementById('haircutModal').style.display = 'flex';
}

async function openClubhouseModal() {
  document.getElementById('clubhouseModal').style.display = 'flex';
  await refreshClubhouseList();
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function renderMenuTabs() {
  const tabBar = document.getElementById('menuTabBar');
  tabBar.innerHTML = '';

  if (!weeklyData || weeklyData.length === 0) return;

  weeklyData.forEach((day, index) => {
    const btn = document.createElement('button');
    btn.className = `tab-btn ${index === currentTabIndex ? 'active' : ''}`;
    btn.innerText = day.date;
    btn.onclick = () => {
      currentTabIndex = index;
      renderMenuTabs();
      showMealDay(index);
    };
    tabBar.appendChild(btn);
  });
}

function showMealDay(index) {
  const mealGrid = document.getElementById('mealGrid');
  mealGrid.innerHTML = '';

  if (!weeklyData || !weeklyData[index]) return;

  const meals = weeklyData[index].meals;

  for (const [time, items] of Object.entries(meals)) {
    const card = document.createElement('div');
    card.className = 'meal-card';

    let listHTML = items.map(item => {
      const isHighlight = item.includes("특식") || item.includes("삼계탕") || item.includes("피자") || item.includes("돈가스") || item.includes("치킨") || item.includes("파스타");
      return `<li class="${isHighlight ? 'highlight' : ''}">• ${escapeHTML(item)}</li>`;
    }).join('');

    card.innerHTML = `<h3>${escapeHTML(time)}</h3><ul>${listHTML}</ul>`;
    mealGrid.appendChild(card);
  }
}

function showGuideTab(tabId, element) {
  const sections = document.querySelectorAll('#guideModal .info-section');
  sections.forEach(sec => sec.style.display = 'none');

  const tabs = document.querySelectorAll('#guideModal .tab-btn');
  tabs.forEach(tab => tab.classList.remove('active'));

  document.getElementById(tabId).style.display = 'flex';
  element.classList.add('active');
}

// 복리후생 21개 항목 카드 렌더링
function renderWelfareCards(items) {
  const grid = document.getElementById('welfareGrid');
  grid.innerHTML = '';

  if (!items || items.length === 0) {
    grid.innerHTML = '<p style="color:#9aa0a6; grid-column: 1 / -1;">검색 결과가 없습니다.</p>';
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'welfare-card';
    const detailsList = (item.details && item.details.length)
      ? `<details class="welfare-details">
           <summary>상세 내용 보기 (${item.details.length}개 항목)</summary>
           <ul>${item.details.map(d => `<li>${escapeHTML(d)}</li>`).join('')}</ul>
         </details>`
      : '';
    card.innerHTML = `
      <span class="no">${escapeHTML(item.no)}</span>
      <h3>${escapeHTML(item.title)}</h3>
      <div class="target">👥 ${escapeHTML(item.target)}</div>
      <div class="desc">${escapeHTML(item.description)}</div>
      ${detailsList}
      <div class="contact">📞 ${escapeHTML(item.contact)}</div>
    `;
    grid.appendChild(card);
  });
}

// 복리후생 검색/필터링 (제목, 담당자, 설명 기준)
function filterWelfareCards() {
  const keyword = document.getElementById('welfareSearchInput').value.trim().toLowerCase();

  if (!keyword) {
    renderWelfareCards(welfareData);
    return;
  }

  const filtered = welfareData.filter(item =>
    item.title.toLowerCase().includes(keyword) ||
    item.contact.toLowerCase().includes(keyword) ||
    item.description.toLowerCase().includes(keyword) ||
    (item.details && item.details.some(d => d.toLowerCase().includes(keyword)))
  );

  renderWelfareCards(filtered);
}

// 이발서비스 예약 (간이 신청 - 선착순 안내용, 별도 저장 없이 접수 확인 알림만 표시)
function handleHaircutSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('hcName').value.trim();
  const date = document.getElementById('hcDate').value;
  const time = document.getElementById('hcTime').value;
  const memo = document.getElementById('hcMemo').value.trim();

  if (!name) { alert('이름을 입력해주세요.'); return; }
  if (!date) { alert('희망 날짜를 선택해주세요.'); return; }
  if (!time) { alert('희망 시간대를 선택해주세요.'); return; }

  alert(
    `[이발서비스 예약 접수]\n` +
    `이름: ${name}\n날짜: ${date}\n시간대: ${time}` +
    (memo ? `\n요청사항: ${memo}` : '') +
    `\n\n선착순 운영으로, 현장 상황에 따라 대기시간이 발생할 수 있습니다.`
  );

  document.getElementById('haircutForm').reset();
  closeModal('haircutModal');
}

// 클럽하우스/라운지 예약 - 체크박스 pill 스타일 토글
function toggleItemPill(checkbox) {
  const pill = checkbox.closest('.checkbox-pill');
  if (checkbox.checked) {
    pill.classList.add('checked');
  } else {
    pill.classList.remove('checked');
  }
}

// 클럽하우스/라운지 예약 제출
// Worker(odd-butterfly-b936)의 KV 저장 API로 실제 전송하여 영구 저장합니다.
async function handleClubhouseSubmit(e) {
  e.preventDefault();

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const team = document.getElementById('chTeam').value;
  const applicant = document.getElementById('chApplicant').value;
  const usageDate = document.getElementById('chDate').value;
  const headcount = document.getElementById('chHeadcount').value;
  const location = document.getElementById('chLocation').value;
  const additionalRequest = document.getElementById('chAdditional').value.trim();

  // ---- 필수 항목 개별 검증 ----
  if (!team) { alert('팀명을 선택해주세요.'); return; }
  if (!applicant) { alert('신청자를 입력해주세요.'); return; }
  if (!usageDate) { alert('이용일자를 선택해주세요.'); return; }
  if (!headcount || Number(headcount) < 1) { alert('사용 인원수를 1명 이상 입력해주세요.'); return; }
  if (!location) { alert('장소를 선택해주세요.'); return; }

  const checkedItems = Array.from(
    document.querySelectorAll('#chItemsGroup input[name="chItems"]:checked')
  ).map(cb => cb.value);

  const payload = {
    team,
    applicant,
    usageDate,
    headcount: Number(headcount),
    location,
    providedItems: checkedItems,
    additionalRequest
  };

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "예약 신청 처리 중...";
  }

  try {
    const response = await fetch(BACKEND_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "clubhouse_reservation",
        data: payload
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      // 중복 예약 등 서버에서 보낸 에러 메시지를 그대로 안내
      throw new Error(result.error || "예약 저장에 실패했습니다.");
    }

    const itemsText = checkedItems.length > 0 ? checkedItems.join(", ") : "없음";
    const extraText = additionalRequest ? `\n추가 요청: ${additionalRequest}` : "";

    alert(
      `[클럽하우스/라운지 예약 완료]\n` +
      `팀: ${team}\n신청자: ${applicant}\n일자: ${usageDate}\n` +
      `장소: ${location}\n인원: ${headcount}명\n` +
      `기본 제공: ${itemsText}${extraText}\n\n신청이 정상적으로 저장되었습니다.`
    );

    document.getElementById('clubhouseForm').reset();
    document.querySelectorAll('#chItemsGroup .checkbox-pill').forEach(pill => pill.classList.add('checked'));

    // 저장 직후 목록 갱신
    await refreshClubhouseList();

  } catch (err) {
    console.error("클럽하우스 예약 저장 에러:", err);
    alert("⚠️ " + err.message);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "예약 신청하기";
    }
  }
}

function handleModalOverlayClick(event, modalId) {
  if (event.target.id === modalId) {
    closeModal(modalId);
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal('menuModal');
    closeModal('guideModal');
    closeModal('haircutModal');
    closeModal('clubhouseModal');
  }
});
