// ================================
// BNCP Living Guide
// ================================

// 페이지가 열리면 실행
window.onload = function () {
    loadWeeklyMenu();
};

// -------------------------------
// 주간 식단 불러오기
// -------------------------------
async function loadWeeklyMenu() {

    try {

        const response = await fetch("weeklyMenu.json");
        const data = await response.json();

        document.getElementById("weekRange").innerText =
            data.weekRange;

        const menu = document.getElementById("weeklyMenu");

        menu.innerHTML = "";

        data.weeklyData.forEach(day => {

            let html = `
            <div class="menu-card">

                <h3>${day.date}</h3>
            `;

            for (const meal in day.meals) {

                html += `<h4>${meal}</h4><ul>`;

                day.meals[meal].forEach(food => {

                    html += `<li>${food}</li>`;

                });

                html += "</ul>";

            }

            html += "</div>";

            menu.innerHTML += html;

        });

    } catch (err) {

        console.log(err);

    }

}

// -------------------------------
// AI Assistant
// -------------------------------
async function askAI() {

    const question =
        document.getElementById("question").value;

    if (!question) {

        alert("질문을 입력하세요.");
        return;

    }

    const answer =
        document.getElementById("answer");

    answer.innerHTML = "🤖 답변 생성중...";

    try {

        const response = await fetch(
            "https://odd-butterfly-b936.chogak1449.workers.dev/?q=" +
            encodeURIComponent(question)
        );

        const text = await response.text();

        answer.innerHTML = text;

    } catch (e) {

        answer.innerHTML = "연결에 실패했습니다.";

    }

}
