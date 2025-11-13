// Results page script
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_QUESTIONS_KEY = "rta_quiz_questions_v1";
  const STORAGE_ANSWERS_KEY = "rta_quiz_answers_v1";

  function loadJSON(key){ try { return JSON.parse(localStorage.getItem(key)); } catch(e){ return null; } }

  function gradeAndShow(){
    const questions = loadJSON(STORAGE_QUESTIONS_KEY) || [];
    const answers = loadJSON(STORAGE_ANSWERS_KEY) || {};
    const total = questions.length;
    let correctCount = 0;

    const breakdownEl = document.getElementById("breakdown");
    breakdownEl.innerHTML = "";

    questions.forEach((q, idx) => {
      const userAns = (q.id in answers) ? answers[q.id] : null;
      const isCorrect = (userAns === q.correct);
      if (isCorrect) correctCount++;

      const row = document.createElement("div");
      row.className = "question-row";

      const qh = document.createElement("div");
      qh.innerHTML = `<strong>Q${idx+1}.</strong> ${q.q}`;
      row.appendChild(qh);

      const your = document.createElement("div");
      your.style.marginTop = "8px";
      your.innerHTML = `<span style="font-weight:700">Your answer:</span> ${userAns===null ? '<em>Unanswered</em>' : q.options[userAns]}`;
      row.appendChild(your);

      const correct = document.createElement("div");
      correct.style.marginTop = "6px";
      correct.innerHTML = `<span style="font-weight:700">Correct:</span> ${q.options[q.correct]}`;
      row.appendChild(correct);

      const badge = document.createElement("div");
      badge.style.marginTop = "8px";
      badge.className = isCorrect ? "correct" : "wrong";
      badge.textContent = isCorrect ? "Correct" : "Wrong";
      row.appendChild(badge);

      breakdownEl.appendChild(row);
    });

    const summary = document.getElementById("summary");
    const percent = total ? Math.round((correctCount/total)*100) : 0;
    summary.innerHTML = `<div style="font-size:1.1rem;font-weight:700">${correctCount} / ${total} correct</div>
                         <div class="muted small">Score: ${percent}%</div>`;
  }

  gradeAndShow();

  document.getElementById("retakeBtn").addEventListener("click", () => {
    // remove answers but keep questions
    localStorage.removeItem(STORAGE_ANSWERS_KEY);
    window.location.href = "quiz.html";
  });
  document.getElementById("clearBtn").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_ANSWERS_KEY);
    localStorage.removeItem(STORAGE_QUESTIONS_KEY);
    localStorage.removeItem("rta_quiz_score_v1");
    localStorage.removeItem("rta_quiz_total_v1");
    alert("Stored quiz data cleared.");
    window.location.href = "quiz.html";
  });
});
