const dropdown = document.getElementById('pageSelectDropdown');
dropdown.addEventListener('change', () => {
  const page = dropdown.value;
  if (page) window.location.href = page;
});

document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_QUESTIONS_KEY = "rta_quiz_questions_v1";
  const STORAGE_ANSWERS_KEY = "rta_quiz_answers_v1";

  // ====== QUESTIONS: edit or extend this array ======
  const QUESTIONS = [
    { id: "q1", q: "What is the maximum speed limit on most Dubai highways (in km/h)?",
      options: ["80", "100", "120", "140"], correct: 2 },
    { id: "q2", q: "When approaching a zebra crossing with pedestrians waiting, you should:",
      options: ["Slow down and stop if necessary", "Speed up to pass quickly", "Honk to alert them to move", "Ignore and continue"], correct: 0 },
    { id: "q3", q: "Seatbelts are mandatory for:",
      options: ["Driver only", "Driver and front passenger only", "All occupants", "Children only"], correct: 2 },
    { id: "q4", q: "What does a 'Stop' sign mean?", 
      options: ["Slow down", "Proceed with caution", "You must come to a complete stop", "Give way only if necessary"], correct: 2 },
    { id: "q5", q: "What does a 'Give Way' sign instruct drivers to do?", 
      options: ["Stop completely", "Allow pedestrians to cross", "Yield to oncoming traffic", "Increase speed"], correct: 2 },
    { id: "q6", q: "What does a 'No Entry' sign indicate?", 
      options: ["One-way road", "Vehicles may enter with caution", "Road closed temporarily", "You must not enter this road"], correct: 3 },
    { id: "q7", q: "What does a blue circular sign with a white arrow pointing right mean?", 
      options: ["No right turn", "Turn right mandatory", "One way only", "Give way to the right"], correct: 1 },
    { id: "q8", q: "What does a red circular sign with a white horizontal line indicate?", 
      options: ["No entry", "No overtaking", "Road closed", "U-turn prohibited"], correct: 0 },
    { id: "q9", q: "A triangular sign with a red border warns drivers about:", 
      options: ["Prohibited actions", "Mandatory directions", "Hazards or warnings ahead", "Parking restrictions"], correct: 2 },
    { id: "q10", q: "What does a yellow box junction mean?", 
      options: ["Stop immediately", "Do not enter unless your exit is clear", "Bus lane ahead", "Pedestrian crossing zone"], correct: 1 },
    { id: "q11", q: "What should you do when you see a 'Pedestrian Crossing Ahead' sign?", 
      options: ["Ignore if no pedestrians", "Slow down and be ready to stop", "Increase speed to clear area", "Sound your horn"], correct: 1 },
    { id: "q12", q: "What is the meaning of 'No U-turn' sign?", 
      options: ["U-turns are allowed only at junctions", "U-turns prohibited at all times", "U-turns allowed for taxis only", "U-turns allowed if road is clear"], correct: 1 },
    { id: "q13", q: "What does a 'Slippery Road' warning sign mean?", 
      options: ["Reduce speed and avoid sudden turns", "Increase speed to avoid skidding", "Overtake carefully", "Stop immediately"], correct: 0 },
    { id: "q14", q: "A blue rectangular sign with a white ‘P’ indicates:", 
      options: ["Prohibited area", "Parking area", "Pedestrian area", "Priority road"], correct: 1 },
    { id: "q15", q: "What does the 'Speed Hump Ahead' sign warn drivers about?", 
      options: ["Uneven road surface", "Sharp curve ahead", "Steep hill ahead", "Loose gravel"], correct: 0 },
    { id: "q16", q: "What does a ‘Roundabout Ahead’ sign mean?", 
      options: ["Intersection ahead", "You must turn left", "Traffic circulates in one direction", "Stop immediately"], correct: 2 },
    { id: "q17", q: "When you see a 'No Overtaking' sign, you must:", 
      options: ["Overtake only motorcycles", "Avoid overtaking any vehicles", "Overtake slowly", "Use the left lane to overtake"], correct: 1 },
    { id: "q18", q: "What does a 'No Parking' sign mean?", 
      options: ["You may stop briefly", "You may park if you remain in vehicle", "You must not park your vehicle", "Parking is allowed at night only"], correct: 2 },
    { id: "q19", q: "What does a 'Children Crossing Ahead' sign warn about?", 
      options: ["Playground nearby", "School or crossing zone ahead", "Zoo ahead", "Park entrance"], correct: 1 },
    { id: "q20", q: "What does a ‘Bus Lane Begins’ sign indicate?", 
      options: ["All vehicles must use the lane", "Only buses and taxis are allowed", "Lane closed to all traffic", "Temporary lane diversion"], correct: 1 },
  ];
  // =================================================

  const quizArea = document.getElementById("quizArea");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");
  const progressText = document.getElementById("progressText");

  let current = 0;
  let userAnswers = {};

  function saveQuestionsToStorage(){
    localStorage.setItem(STORAGE_QUESTIONS_KEY, JSON.stringify(QUESTIONS));
  }
  function saveAnswersToStorage(){
    localStorage.setItem(STORAGE_ANSWERS_KEY, JSON.stringify(userAnswers));
  }

  function renderQuestion(index){
    const q = QUESTIONS[index];
    quizArea.innerHTML = "";
    const wrapper = document.createElement("section");
    wrapper.className = "question";

    const h = document.createElement("h2");
    h.textContent = `Q${index+1}. ${q.q}`;
    wrapper.appendChild(h);

    const opts = document.createElement("div");
    opts.className = "options";
    q.options.forEach((opt, i) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = q.id;
      input.value = i;
      input.checked = (userAnswers[q.id] === i);
      input.addEventListener("change", () => {
        userAnswers[q.id] = i;
        saveAnswersToStorage();
        updateControls();
      });
      const span = document.createElement("span");
      span.textContent = opt;
      label.appendChild(input);
      label.appendChild(span);
      opts.appendChild(label);
    });
    wrapper.appendChild(opts);

    quizArea.appendChild(wrapper);

    progressText.textContent = `${index+1} / ${QUESTIONS.length}`;

    prevBtn.classList.toggle("hidden", index === 0);
    nextBtn.classList.toggle("hidden", index === QUESTIONS.length - 1);
    submitBtn.classList.toggle("hidden", index !== QUESTIONS.length - 1);
  }

  prevBtn.addEventListener("click", () => {
    if (current > 0) { current--; renderQuestion(current); }
  });
  nextBtn.addEventListener("click", () => {
    if (current < QUESTIONS.length - 1) { current++; renderQuestion(current); }
  });

  submitBtn.addEventListener("click", () => {
    const unanswered = QUESTIONS.filter(q => !(q.id in userAnswers));
    if (unanswered.length && !confirm("You have unanswered questions. Submit anyway?")) return;

    saveQuestionsToStorage();
    saveAnswersToStorage();

    const score = QUESTIONS.reduce((acc,q) => {
      const ans = userAnswers[q.id];
      return acc + ((ans === q.correct) ? 1 : 0);
    }, 0);
    localStorage.setItem("rta_quiz_score_v1", String(score));
    localStorage.setItem("rta_quiz_total_v1", String(QUESTIONS.length));

    // go to results page (relative path)
    window.location.href = "results.html";
  });

  // init
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_ANSWERS_KEY) || "{}");
    if (saved && typeof saved === "object") userAnswers = saved;
  } catch(e){ userAnswers = {}; }
  saveQuestionsToStorage();
  renderQuestion(current);
});
