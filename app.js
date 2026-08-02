// ================================================
// BNCP Smart Welfare & Assistant - app.js
// ================================================

// Cloudflare Worker API URL
const BACKEND_API_URL = "https://odd-butterfly-b936.chogak1449.workers.dev/";

// 백엔드 연동/JSON 로드 실패 시 사용할 대체 식단 데이터
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

let weeklyData = [];
let currentTabIndex = 0;

// ------------------------------------------------
// 1. 초기화 및 이벤드 리스너 등록
// ------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
    // ESC 키 입력 시 모든 모달 닫기
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal("menuModal");
            closeModal("guideModal");
            closeModal("welfareModal");
            closeModal("facilityModal");
        }
    });
});

// ------------------------------------------------
// 2. 주간 식단 로직 (weeklyMenu.json 연동)
// ------------------------------------------------
async function loadWeeklyMenu() {
    try {
        const response = await fetch("./weeklyMenu.json?v=" + Date.now(), { cache: "no-store" });
        if (!response.ok) throw new Error("weeklyMenu.json을 찾을 수 없습니다.");
        
        const data = await response.json();
        setupMenuData(data);
    } catch (err) {
        console.warn("식단 JSON 로드 실패, 대체 데이터를 사용합니다:", err);
        setupMenuData(fallbackMenuData);
    }
}

function setupMenuData(data) {
    weeklyData = data.weeklyData || [];
    const title = document.getElementById("menuModalTitle");
    
    if (title) {
        title.innerHTML = data.weekRange ? `주간 식단표 (${data.weekRange})` : "주간 식단표";
    }

    currentTabIndex = 0;
    renderMenuTabs();
    showMealDay(0);
}

function renderMenuTabs() {
    const tabBar = document.getElementById("menuTabBar");
    if (!tabBar) return;
    
    tabBar.innerHTML = "";
    if (!weeklyData || weeklyData.length === 0) return;

    weeklyData.forEach((day, index) => {
        const btn = document.createElement("button");
        btn.className = `tab-btn ${index === currentTabIndex ? "active" : ""}`;
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
    const mealGrid = document.getElementById("mealGrid");
    if (!mealGrid) return;
    
    mealGrid.innerHTML = "";
    if (!weeklyData || !weeklyData[index]) return;

    const meals = weeklyData[index].meals;

    for (const [time, items] of Object.entries(meals)) {
        const card = document.createElement("div");
        card.className = "meal-card";

        let listHTML = items.map(item => {
            const isHighlight = item.includes("특식") || 
                                item.includes("삼계탕") || 
                                item.includes("피자") || 
                                item.includes("돈가스") || 
                                item.includes("치킨") || 
                                item.includes("파스타");
            return `<li class="${isHighlight ? "highlight" : ""}">• ${escapeHTML(item)}</li>`;
        }).join("");

        card.innerHTML = `<h3>${escapeHTML(time)}</h3><ul>${listHTML}</ul>`;
        mealGrid.appendChild(card);
    }
}

// ------------------------------------------------
// 3. AI Assistant (검색 및 연동)
// ------------------------------------------------
async function handleSearch() {
    const inputInput = document.getElementById("userInput");
    const responseArea = document.getElementById("responseArea");
    
    if (!inputInput || !responseArea) return;
    
    const query = inputInput.value.trim();
    if (!query) return;

    inputInput.value = "";
    inputInput.disabled = true;
    responseArea.style.display = "block";
    responseArea.innerHTML = "🤖 AI가 답변을 작성 중입니다...";

    try {
        const response = await fetch(BACKEND_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: query }),
        });

        if (!response.ok) throw new Error("서버 응답 오류: " + response.status);

        const data = await response.json();
        const aiReply = data.reply || data.response || "답변을 수신했습니다.";

        responseArea.innerHTML = "<strong>🤖 AI 비서 답변:</strong><br><br>" + escapeHTML(aiReply);
    } catch (error) {
        console.error("통신 에러:", error);
        responseArea.innerHTML = "⚠️ 답변을 불러오는 중 오류가 발생했습니다.<br>네트워크 상태 또는 API 연동 설정을 확인해주세요.";
    } finally {
        inputInput.disabled = false;
        inputInput.focus();
    }
}

// ------------------------------------------------
// 4. 모달 제어 & 탭 / 예약 기능
// ------------------------------------------------
async function openMenuModal() {
    document.getElementById("menuModal").style.display = "flex";
    await loadWeeklyMenu();
}

function openGuideModal() {
    document.getElementById("guideModal").style.display = "flex";
}

function openWelfareModal() {
    document.getElementById("welfareModal").style.display = "flex";
}

function openFacilityModal() {
    document.getElementById("facilityModal").style.display = "flex";
}

function closeModal(modalId) {
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
        targetModal.style.display = "none";
    }
}

function showGuideTab(tabId, element) {
    const sections = document.querySelectorAll("#guideModal .info-section");
    sections.forEach(sec => sec.style.display = "none");

    const tabs = document.querySelectorAll("#guideModal .tab-btn");
    tabs.forEach(tab => tab.classList.remove("active"));

    const targetSection = document.getElementById(tabId);
    if (targetSection) {
        targetSection.style.display = "flex";
    }
    element.classList.add("active");
}

function handleFacilitySubmit(e) {
    e.preventDefault();
    const facility = document.getElementById("facilityType").value;
    const date = document.getElementById("resDate").value;
    
    alert(`[예약 완료]\n시설: ${facility}\n일시: ${date.replace("T", " ")}\n신청이 성공적으로 접수되었습니다.`);
    document.getElementById("facilityForm").reset();
    closeModal("facilityModal");
}

function handleModalOverlayClick(event, modalId) {
    if (event.target.id === modalId) {
        closeModal(modalId);
    }
}

// HTML 특수문자 이스케이프 함수
function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, 
        tag => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            '"': "&quot;"
        }[tag] || tag)
    );
}
index.html 적용 방법
index.html의 </body> 태그 바로 직전에 기존 <script>...</script> 영역을 지우고 아래 줄만 추가해주시면 깔끔하게 분리되어 동작합니다.

HTML
  <script src="app.js"></script>
</body>
</html>
