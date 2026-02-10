const timetable = {
    "Monday": [{time:"09:10", label:"Discrete Maths"}, {time:"10:00", label:"DAA"}, {time:"10:50", label:"Lab: OS/CSA"}, {time:"13:30", label:"🍽️ LUNCH"}, {time:"14:20", label:"Data Science"}, {time:"15:10", label:"OS"}, {time:"16:00", label:"CSA"}],
    "Tuesday": [{time:"09:10", label:"DAA"}, {time:"10:00", label:"CSA"}, {time:"10:50", label:"Lab: MP/DAA"}, {time:"13:30", label:"🍽️ LUNCH"}, {time:"14:20", label:"OS"}, {time:"15:10", label:"Discrete"}, {time:"16:00", label:"MP & MC"}],
    "Wednesday": [{time:"09:10", label:"Data Science"}, {time:"10:00", label:"OS"}, {time:"10:50", label:"MP/MC"}, {time:"11:40", label:"🔔 BREAK"}, {time:"11:50", label:"Discrete"}, {time:"12:40", label:"Sanskrit"}, {time:"13:30", label:"🍽️ LUNCH"}, {time:"14:20", label:"MP/MC"}, {time:"15:10", label:"CSA"}, {time:"16:00", label:"DAA"}],
    "Thursday": [{time:"09:10", label:"Lab: CSA/OS"}, {time:"11:40", label:"🔔 BREAK"}, {time:"11:50", label:"Discrete"}, {time:"12:40", label:"OS"}, {time:"13:30", label:"🍽️ LUNCH"}, {time:"14:20", label:"Lab: MP/DAA"}],
    "Friday": [{time:"09:10", label:"MP/MC"}, {time:"10:00", label:"DAA"}, {time:"10:50", label:"Lab: R-Prog"}, {time:"13:30", label:"🍽️ LUNCH"}, {time:"14:20", label:"CSA"}, {time:"15:10", label:"Discrete"}, {time:"16:00", label:"Data Science"}]
};

const fullSchedule = {
    "Monday": { diet: "Soya/Dal", workout: ["Floor Press", "DB Row", "Shoulder Press", "Curls", "Plank 45 sec"] },
    "Tuesday": { diet: "Curd/PB", workout: ["2.5km Jog", "Calf Stretch 30 sec"] },
    "Wednesday": { diet: "Protein+", workout: ["Goblet Squats", "Reverse Lunges", "RDLs", "Calf Raises"] },
    "Thursday": { diet: "Rest Day", workout: ["Ankle Rehab 5 min", "Walk 15 min"] },
    "Friday": { diet: "Lab Power", workout: ["2.5km Jog", "Ankle Stretch 30 sec"] },
    "Saturday": { diet: "Full Body", workout: ["Push-ups", "Mountain Climbers 40 sec", "Hollow Hold 30 sec"] },
    "Sunday": { diet: "Prep Day", workout: ["30m Walk", "Full Stretch"] }
};

const fixedRules = ["110g Protein", "Sleep 11:30PM"];
let myChart, countdown, timeLeft;
const beep = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');

window.onload = () => {
    updateClock(); setInterval(updateClock, 1000);
    const now = new Date();
    document.getElementById('date-selector').value = now.toLocaleDateString('en-CA');
    initChart(); renderDay();
};

document.getElementById('date-selector').onchange = renderDay;

function updateClock() {
    const now = new Date();
    document.getElementById('live-clock').innerText = now.toLocaleTimeString();
    highlightCurrentClass();
}

function toggleCollegeMode() {
    const body = document.getElementById('body-tag');
    const btn = document.getElementById('mode-btn');
    const cView = document.getElementById('college-view');
    const fView = document.getElementById('fitness-view');
    
    body.classList.toggle('college-mode');
    const isOn = body.classList.contains('college-mode');
    
    btn.innerText = isOn ? "COLLEGE: ON" : "COLLEGE: OFF";
    cView.classList.toggle('hidden', !isOn);
    fView.classList.toggle('hidden', isOn);
}

function renderDay() {
    const dateVal = document.getElementById('date-selector').value;
    const dayName = new Date(dateVal).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
    document.getElementById('day-title').innerText = dayName.toUpperCase();
    
    const tt = document.getElementById('timetable-display');
    tt.innerHTML = "";
    if (timetable[dayName]) {
        timetable[dayName].forEach(p => {
            tt.innerHTML += `<div class="period-item" data-time="${p.time}"><b>${p.time}</b> <span>${p.label}</span></div>`;
        });
    } else { tt.innerHTML = "<p style='color:gray'>No classes scheduled.</p>"; }

    const checklist = document.getElementById('checklist');
    checklist.innerHTML = "";
    const saved = JSON.parse(localStorage.getItem(`fit_${dateVal}`)) || {};
    const plan = fullSchedule[dayName] || { workout: [] };
    
    [...plan.workout, ...fixedRules].forEach(task => {
        checklist.innerHTML += `
            <div class="checklist-item">
                <input type="checkbox" id="${task}" onchange="toggleTask('${task}')" ${saved[task] ? 'checked' : ''}>
                <label for="${task}">${task} ${task.includes('sec') ? '<span class="timer-icon" onclick="openTimer(\''+task+'\')">⏱️</span>' : ''}</label>
            </div>`;
    });

    updateWaterUI(parseFloat(localStorage.getItem(`water_${dateVal}`)) || 0);
    loadPBs(); calculateStreak(); updateChart();
}

function addWater() {
    const date = document.getElementById('date-selector').value;
    let val = (parseFloat(localStorage.getItem(`water_${date}`)) || 0) + 0.5;
    if (val <= 4.0) localStorage.setItem(`water_${date}`, val);
    renderDay();
}

function updateWaterUI(val) {
    document.getElementById('water-fill').style.height = `${Math.min((val/3.5)*100, 100)}%`;
    document.getElementById('water-count').innerText = `${val} / 3.5L`;
}

function toggleTask(name) {
    const date = document.getElementById('date-selector').value;
    let saved = JSON.parse(localStorage.getItem(`fit_${date}`)) || {};
    saved[name] = !saved[name];
    localStorage.setItem(`fit_${date}`, JSON.stringify(saved));
    if (saved[name] && name.includes('Floor')) triggerRestTimer();
    updateChart();
}

function savePB() {
    const pbs = { squat: document.getElementById('pb-squat').value, press: document.getElementById('pb-press').value };
    localStorage.setItem('sandy_pbs', JSON.stringify(pbs));
}

function loadPBs() {
    const saved = JSON.parse(localStorage.getItem('sandy_pbs')) || { squat: '', press: '' };
    document.getElementById('pb-squat').value = saved.squat;
    document.getElementById('pb-press').value = saved.press;
}

function highlightCurrentClass() {
    const now = new Date();
    const cur = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    const items = document.querySelectorAll('.period-item');
    items.forEach(item => {
        item.classList.remove('active');
        if (cur >= item.dataset.time) { 
            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active'); 
        }
    });
}

function initChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: { labels: ['S','M','T','W','T','F','S'], datasets: [{ label: '%', data: [0,0,0,0,0,0,0], borderColor: '#38bdf8', tension: 0.4, fill: true, backgroundColor: 'rgba(56, 189, 248, 0.05)' }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false } }, y: { display: false, max: 100 } } }
    });
}

function updateChart() {
    const labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const scores = labels.map(dayName => {
        const d = new Date(); d.setDate(d.getDate() - d.getDay() + labels.indexOf(dayName));
        const dateStr = d.toLocaleDateString('en-CA');
        const data = JSON.parse(localStorage.getItem(`fit_${dateStr}`)) || {};
        const water = parseFloat(localStorage.getItem(`water_${dateStr}`)) || 0;
        const total = (fullSchedule[dayName]?.workout.length || 0) + fixedRules.length + 1;
        let done = Object.values(data).filter(v => v).length + (water >= 3.0 ? 1 : 0);
        return Math.round((done / total) * 100) || 0;
    });
    myChart.data.datasets[0].data = scores; myChart.update();
}

function exportHistory() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    a.download = `Sandeep_Tracker_Backup.json`;
    a.click();
}

function calculateStreak() {
    let s = 0;
    for(let i=0; i<30; i++) {
        const d = new Date(); d.setDate(d.getDate()-i);
        const data = JSON.parse(localStorage.getItem(`fit_${d.toLocaleDateString('en-CA')}`)) || {};
        if (Object.values(data).filter(v=>v).length >= 2) s++; else if(i>0) break;
    }
    document.getElementById('streak-count').innerText = s;
}

// Timer functions
function triggerRestTimer() {
    clearInterval(countdown); let t = 60;
    const toast = document.getElementById('rest-timer-toast');
    toast.classList.remove('hidden');
    countdown = setInterval(() => {
        t--; document.getElementById('rest-countdown').innerText = t;
        if (t <= 0) { clearInterval(countdown); toast.classList.add('hidden'); beep.play(); }
    }, 1000);
}
function openTimer(task) {
    const time = parseInt(task.match(/\d+/)[0]);
    timeLeft = task.includes('min') ? time * 60 : time;
    document.getElementById('timer-label').innerText = task;
    document.getElementById('timer-overlay').classList.remove('hidden');
}
function startTimer() {
    clearInterval(countdown);
    countdown = setInterval(() => {
        timeLeft--;
        const m = Math.floor(timeLeft/60), s = timeLeft%60;
        document.getElementById('timer-display').innerText = `${m}:${s.toString().padStart(2,'0')}`;
        if (timeLeft <= 0) { clearInterval(countdown); beep.play(); document.getElementById('timer-display').innerText = "DONE!"; }
    }, 1000);
}
function closeTimer() { document.getElementById('timer-overlay').classList.add('hidden'); clearInterval(countdown); }
function showWeeklySummary() {
    const modal = document.getElementById('summary-modal');
    const pbs = JSON.parse(localStorage.getItem('sandy_pbs')) || { squat: '0', press: '0' };
    document.getElementById('summary-stats').innerHTML = `<p>Squat: ${pbs.squat}</p><p>Press: ${pbs.press}</p><p>Streak: ${document.getElementById('streak-count').innerText} days</p>`;
    modal.classList.remove('hidden');
}
function closeSummary() { document.getElementById('summary-modal').classList.add('hidden'); }