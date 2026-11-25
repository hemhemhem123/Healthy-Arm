/* ============================================================
   Healthy Arms – app logic
   Everything runs in the coach's browser. Nothing is saved,
   and no player info is ever sent anywhere.
   ============================================================ */


/* ------------------------------------------------------------
   1) SETTINGS YOU CAN CHANGE
   ------------------------------------------------------------ */

// Anonymous plan counter (optional). Sign up free at goatcounter.com,
// then put your site code here, e.g. "healthyarms".
// Leave it as "" and the counter is completely turned off.
const GOATCOUNTER_CODE = "";

// When you last checked these numbers against the official Pitch Smart site.
const PITCH_SMART_CHECKED = "November 2026";


/* ------------------------------------------------------------
   2) PITCH SMART DATA
   Source: https://www.mlb.com/pitch-smart/pitching-guidelines
   Each "rest" row is [lowest pitches, highest pitches, rest days].
   ------------------------------------------------------------ */
const PITCH_SMART_BASE = "https://www.mlb.com/pitch-smart/pitching-guidelines";

const PITCH_SMART = {
  "7-8": {
    max: 50, innings: 60, page: "/ages-8-and-under",
    rest: [[1, 20, 0], [21, 35, 1], [36, 50, 2]],
  },
  "9-10": {
    max: 75, innings: 80, page: "/ages-9-12",
    rest: [[1, 20, 0], [21, 35, 1], [36, 50, 2], [51, 65, 3], [66, 75, 4]],
  },
  "11-12": {
    max: 85, innings: 80, page: "/ages-9-12",
    rest: [[1, 20, 0], [21, 35, 1], [36, 50, 2], [51, 65, 3], [66, 85, 4]],
  },
  "13-14": {
    max: 95, innings: 100, page: "/ages-13-14",
    rest: [[1, 20, 0], [21, 35, 1], [36, 50, 2], [51, 65, 3], [66, 95, 4]],
  },
};

function ageGroup(age) {
  if (age <= 8) return "7-8";
  if (age <= 10) return "9-10";
  if (age <= 12) return "11-12";
  return "13-14";
}


/* ------------------------------------------------------------
   3) THE EXERCISES
   "dose" can be one value for everyone, or different values
   by track: young = Younger players (8–11), advanced = Advanced (12–14).
   "cue" is the plain-language coaching line kids hear.
   ------------------------------------------------------------ */

// The two tracks. Change ADVANCED_AGE to move the line between them.
const ADVANCED_AGE = 12;
const TRACKS = {
  young: { name: "Younger players", ages: "ages 8–11" },
  advanced: { name: "Advanced", ages: "ages 12–14" },
};

function ageBand(age) {
  return age >= ADVANCED_AGE ? "advanced" : "young";
}

const WARMUP = [
  { name: "Easy jog or skips", dose: "1 lap of the infield",
    cue: "Easy speed — you should be able to talk while you do it." },
  { name: "Arm circles", dose: "10 small → 10 big, forward then backward",
    cue: "Start small like stirring a pot, then grow into big windmills. Smooth, not fast." },
  { name: "High knees", dose: "2 × 15 yards",
    cue: "Stand tall, knees up to your belt, quick feet." },
  { name: "Walking lunge + twist", dose: { young: "5 each leg", advanced: "8 each leg" },
    cue: "Take a big step. Front knee stays over your shoelaces. Turn your chest toward your front leg." },
  { name: "Frankenstein walks", dose: { young: "6 each leg", advanced: "8 each leg" },
    cue: "Walk tall. Kick a straight leg up softly and reach the other hand toward it. No bouncing." },
  { name: "Side shuffle", dose: "2 × 15 yards each way",
    cue: "Stay low like a shortstop. Don't click your heels together." },
];

// These two are used for every age (videos by the app's creator).
const BACK_TO_WALL = {
  name: "Back-to-wall arm raises", dose: { young: "6 times", advanced: "8 times" },
  video: "videos/back-to-wall-raises.mp4",
  cue: "Back flat on the wall — no daylight between your back and the wall. Raise straight arms up and try to touch the wall behind you. Only go as high as your back stays flat.",
};
const WALL_SLIDES = {
  name: "Wall slides + lift-off", dose: { young: "6 times", advanced: "8 times" },
  video: "videos/wall-slides-liftoff.mp4",
  cue: "Face the wall, forearms on it, thumbs turned out. Slide up into a Y, then lift your hands just off the wall. Thumbs stay turned out the whole time. Feel it under your shoulder blades.",
};

// Younger players (8–11): no bands, body weight only.
const ARM_NO_BAND = [
  BACK_TO_WALL,
  WALL_SLIDES,
  { name: "Y-T-W raises (no weight)", dose: "5 of each letter",
    cue: "Thumbs up to the sky. Make the letter with your arms and squeeze your shoulder blades like you're pinching a pencil between them." },
  { name: "Wall push-up squeeze", dose: "8 times",
    cue: "Hands on a wall or fence, arms straight. Let your chest sink a little, then push the wall away." },
];

// Advanced (12–14): lightest resistance band.
const ARM_BAND = [
  BACK_TO_WALL,
  { name: "Band pull-aparts", dose: "10 times",
    cue: "Arms straight out in front. Pull the band apart until it touches your chest. Shoulders down, away from your ears." },
  { name: "Band rotation out", dose: "10 each arm",
    cue: "Elbow glued to your side, bent like an L. Swing your hand out like opening a door. Come back slowly." },
  { name: "Band rotation in", dose: "10 each arm",
    cue: "Same L-shaped arm, elbow glued to your side. Pull your hand in across your belly. Come back slowly." },
  WALL_SLIDES,
];

const MOBILITY = [
  { name: "Open books", dose: { young: "5 each side", advanced: "6 each side" },
    video: "videos/open-books.mp4",
    cue: "Lie on your side, knees bent and glued to the ground. Open your top arm like a book. Turn your head and stare at your hand the whole way." },
  { name: "Cat-cow", dose: "6 slow ones",
    cue: "On hands and knees. Round your back like a scared cat, then let your belly drop and look up." },
  { name: "Hip 90/90 switches", dose: "6 each side",
    cue: "Sit with both knees bent like two L's. Keep feet on the ground and swing both knees to the other side." },
];

// One extra item per position (keeps the total around 10 minutes).
const POSITION_EXTRA = {
  pitcher: { block: "arm",
    item: { name: "Fence push-up plus", dose: "8 times",
      cue: "Hands on the fence, arms straight. Let your shoulder blades pinch together, then push them apart. Arms never bend." } },
  catcher: { block: "mobility",
    item: { name: "Deep squat hold", dose: "3 × 10 seconds",
      cue: "Feet a bit wider than your shoulders. Sit low, chest up, use your elbows to gently push your knees out." } },
  position: { block: "mobility",
    item: { name: "Side lunges", dose: "5 each side",
      cue: "Step wide to one side and sit back into that hip. The other leg stays straight." } },
};

const POSITION_NAMES = { pitcher: "Pitcher", catcher: "Catcher", position: "Position player" };

// AFTER THROWING: stretches for tight shoulders and neck.
// "minAge" hides a stretch from younger players.
const AFTER_THROWING = [
  { name: "Half-kneeling rotations", dose: "6 each side",
    video: "videos/half-kneeling-rotations.mp4",
    cue: "Kneel on one knee with your side next to a wall and a foam roller (or rolled-up jacket) between your hip and the wall. Keep your hips still and arms relaxed, and turn your chest away from the wall. Feel it along your side." },
  { name: "Doorway chest stretch", dose: "Hold 20 sec, each side",
    video: "videos/doorway-chest-stretch.mp4",
    cue: "Put your arm on a door frame or wall like you're about to throw. Keep your chest tall and stacked, then slowly turn your hips away. Feel it across the front of your chest." },
  { name: "Overhead lat stretch", dose: "Hold 20 sec, each side",
    video: "videos/overhead-lat-stretch.mp4",
    cue: "Hold a pole or door frame up high with one hand. Lean away and reach your other hand down toward the inside of your foot. Feel it down your side, under your armpit." },
  { name: "Pole reach-back", dose: "Hold 20 sec, each side",
    video: "videos/post-reach-back.mp4",
    cue: "Grab a pole at chest height with your thumb pointing down. Lean your body weight away, sit your hips back, and reach your free hand toward the ground. Feel it in the back of your shoulder." },
  { name: "Doorway lay-back", dose: "Hold 15 sec, each side", minAge: ADVANCED_AGE,
    video: "videos/doorway-lay-back.mp4",
    cue: "Forearm on a door frame with your elbow a little above your shoulder. Gently lean through so the arm lays back. Your elbow stays in the same spot — don't let it slide down. Easy: this one should never hurt." },
  { name: "Neck stretch", dose: "Hold 15 sec, each side", minAge: ADVANCED_AGE,
    video: "videos/neck-stretch.mp4",
    cue: "Sit tall. Keep one shoulder down by holding the edge of your seat (or a band hooked over that shoulder). Slowly look up and away to the other side. Feel it along the side of your neck. Slow and gentle." },
];


/* ------------------------------------------------------------
   4) BUILDING THE ROUTINE
   ------------------------------------------------------------ */

function doseFor(exercise, band) {
  if (typeof exercise.dose === "string") return exercise.dose;
  return exercise.dose[band];
}

function buildRoutine(age, pos) {
  const band = ageBand(age);
  const armList = band === "young" ? ARM_NO_BAND : ARM_BAND;

  const blocks = [
    { id: "warmup", title: "1. Dynamic warm-up", time: "about 4 min", items: [...WARMUP],
      tip: "Get the whole body warm before the arm works." },
    { id: "arm", title: band === "young" ? "2. Arm wake-up (no band)" : "2. Band work", time: "about 3 min",
      items: [...armList],
      tip: band === "young"
        ? "No bands needed at this age. Slow and controlled."
        : "Use the lightest band. If every rep isn't slow and smooth, the band is too hard." },
    { id: "mobility", title: "3. Mobility", time: "about 3 min", items: [...MOBILITY],
      tip: "Move slowly. Stretch feeling is OK — pain is not." },
  ];

  // Add the one position-specific exercise.
  // (Young pitchers already do the wall push-up, so skip the duplicate.)
  const extra = POSITION_EXTRA[pos];
  if (!(pos === "pitcher" && band === "young")) {
    blocks.find(b => b.id === extra.block).items.push(extra.item);
  }

  return blocks.map(block => ({
    ...block,
    items: block.items.map(ex => ({ name: ex.name, dose: doseFor(ex, band), cue: ex.cue, video: ex.video })),
  }));
}

function buildAfterThrowing(age) {
  return AFTER_THROWING.filter(ex => !ex.minAge || age >= ex.minAge);
}

function positionNotes(age, pos) {
  const notes = {
    pitcher: [
      "After this routine, start catch play short and easy, then move back little by little.",
      age <= 12
        ? "Fastballs and changeups only at this age (Pitch Smart)."
        : "Breaking pitches only after a consistent fastball and changeup (Pitch Smart).",
      "Count every pitch in games and check the rest table below before the next outing.",
      "Avoid playing catcher on days the player isn't pitching (Pitch Smart).",
    ],
    catcher: [
      "Catchers make a lot of throws. Rotate catchers when you can.",
      "If this player also pitches: Pitch Smart says to avoid catching on days they aren't pitching.",
      "After this routine, start catch play short and easy, then move back little by little.",
    ],
    position: [
      "After this routine, start catch play short and easy, then move back little by little.",
      "If this player pitches too, follow the pitch count and rest rules below.",
    ],
  };
  return notes[pos];
}


/* ------------------------------------------------------------
   5) BUILDING THE WEEK
   Practice days are spread out so there's rest in between.
   Sunday is always a full day off.
   ------------------------------------------------------------ */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PRACTICE_PATTERNS = {
  1: ["Sat"],
  2: ["Tue", "Sat"],
  3: ["Mon", "Wed", "Sat"],
  4: ["Mon", "Tue", "Thu", "Sat"],
  5: ["Mon", "Tue", "Wed", "Fri", "Sat"],
  6: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

function buildWeek(days, pos) {
  const practiceDays = PRACTICE_PATTERNS[days];
  return DAYS.map(day => {
    if (practiceDays.includes(day)) {
      let plan = "10-minute routine → throwing → after-throwing stretches.";
      if (pos === "pitcher") plan += " If pitching in a game: count pitches.";
      return { day, type: "practice", label: "Practice / game", plan };
    }
    return { day, type: "rest", label: "Rest",
      plan: "No throwing. Play, bike, or another sport. Optional: the stretches only (5 min)." };
  });
}


/* ------------------------------------------------------------
   6) PUTTING THINGS ON THE SCREEN
   ------------------------------------------------------------ */

const $ = (id) => document.getElementById(id);

function show(screenId) {
  ["setup", "stop", "plan"].forEach(id => { $(id).hidden = (id !== screenId); });
  window.scrollTo(0, 0);
}

// One exercise card. If it has a video, add a "Watch" button.
function exerciseHTML(ex) {
  const watch = ex.video
    ? `<button type="button" class="watch no-print" data-video="${ex.video}">▶ Watch</button><div class="video-slot"></div>`
    : "";
  return `
    <div class="ex">
      <span class="ex-name">${ex.name}</span><span class="ex-dose">${ex.dose}</span>
      <p class="ex-cue">${ex.cue}</p>
      ${watch}
    </div>`;
}

function renderAfterThrowing(age) {
  const list = buildAfterThrowing(age);
  let html = list.map(exerciseHTML).join("");
  if (age < ADVANCED_AGE) {
    html += `<p class="block-tip">Two more stretches (doorway lay-back and neck stretch) are added in the Advanced plan (ages 12–14).</p>`;
  }
  $("after").innerHTML = html;
}

function renderRoutine(age, pos) {
  const blocks = buildRoutine(age, pos);
  $("routine").innerHTML = blocks.map(block => `
    <div class="block">
      <div class="block-head"><h3>${block.title}</h3><span class="block-time">${block.time}</span></div>
      <p class="block-tip">${block.tip}</p>
      ${block.items.map(exerciseHTML).join("")}
    </div>`).join("");

  $("position-notes").innerHTML = `
    <div class="note">
      <strong>${POSITION_NAMES[pos]} notes</strong>
      <ul>${positionNotes(age, pos).map(n => `<li>${n}</li>`).join("")}</ul>
    </div>`;
}

function renderWeek(days, pos) {
  const week = buildWeek(days, pos);
  let html = `<div class="table-wrap"><table>
    <tr><th>Day</th><th>Type</th><th>What to do</th></tr>
    ${week.map(d => `<tr class="${d.type}"><td>${d.day}</td><td>${d.label}</td><td>${d.plan}</td></tr>`).join("")}
  </table></div>`;

  if (days >= 5) {
    html += `<p class="note">That's a lot of baseball for a young player. Pitch Smart recommends
      playing other sports and taking at least 4 months off from throwing each year.
      Make sure there are real days off with no throwing.</p>`;
  }
  $("week").innerHTML = html;
}

function renderPitchSmart(age) {
  const group = ageGroup(age);
  const g = PITCH_SMART[group];
  const restCols = [0, 1, 2, 3, 4];

  // Full table for all youth ages, with this player's row highlighted.
  const rows = Object.entries(PITCH_SMART).map(([name, data]) => {
    const cells = restCols.map(n => {
      const r = data.rest.find(row => row[2] === n);
      return `<td>${r ? `${r[0]}–${r[1]}` : "—"}</td>`;
    }).join("");
    return `<tr class="${name === group ? "highlight" : ""}"><td>${name}</td><td>${data.max}</td>${cells}</tr>`;
  }).join("");

  const reentry = age <= 12
    ? "Once a pitcher leaves the mound, they can't pitch again in that game."
    : "A pitcher who moves to another position may return to pitch once in that game.";
  const pitches = age <= 12
    ? "Throw fastballs and changeups only."
    : "Start breaking pitches only after a consistent fastball and changeup.";

  $("pitch-smart").innerHTML = `
    <p>For age <strong>${age}</strong> (group ${group}): max <strong>${g.max} pitches</strong> in a game.
      Find the pitches thrown below to see how many days of rest are needed before pitching again.</p>
    <div class="table-wrap"><table class="compact">
      <tr><th rowspan="2">Age</th><th rowspan="2">Max</th><th colspan="5">Days of rest needed</th></tr>
      <tr><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
      ${rows}
    </table></div>
    <h3>Other Pitch Smart rules for this age</h3>
    <ul class="rules">
      <li>No more than <strong>${g.innings} innings</strong> pitched in any 12 months.</li>
      <li>At least <strong>4 months off</strong> from throwing each year (2–3 of them in a row).</li>
      <li>Never pitch in a game <strong>3 days in a row</strong>, no matter the pitch count.</li>
      <li>Don't pitch in more than one game on the same day.</li>
      <li>Don't play on more than one team at the same time.</li>
      <li>${pitches}</li>
      <li>${reentry}</li>
      <li>Warm up properly, play other sports, and watch for signs of fatigue.</li>
    </ul>
    <p class="muted">Your league (like Little League) may have its own required rules — follow those too.
      Numbers last checked: ${PITCH_SMART_CHECKED}.</p>
    <p><a href="${PITCH_SMART_BASE}${g.page}" target="_blank" rel="noopener">See the official Pitch Smart rules for this age →</a></p>`;
}

function restDaysFor(age, pitches) {
  const g = PITCH_SMART[ageGroup(age)];
  if (pitches > g.max) return `That's over the ${g.max}-pitch daily max for this age.`;
  if (pitches <= 0) return "";
  const row = g.rest.find(r => pitches >= r[0] && pitches <= r[1]);
  const n = row[2];
  if (n === 0) return "0 days of rest required (still no 3 days in a row).";
  return `${n} day${n > 1 ? "s" : ""} of rest required before pitching again.`;
}


/* ------------------------------------------------------------
   7) READING THE FORM + THE SAFETY GATE
   ------------------------------------------------------------ */

let current = null;   // the plan currently on screen: { age, pos, days }

// Only accept values we expect. Anything else is ignored.
function cleanInputs(ageRaw, posRaw, daysRaw) {
  const age = parseInt(ageRaw, 10);
  const days = parseInt(daysRaw, 10);
  const pos = ["pitcher", "catcher", "position"].includes(posRaw) ? posRaw : null;
  if (!(age >= 8 && age <= 14) || !(days >= 1 && days <= 6) || !pos) return null;
  return { age, pos, days };
}

$("plan-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const posInput = document.querySelector('input[name="pos"]:checked');
  const hurtInput = document.querySelector('input[name="hurt"]:checked');
  const err = $("form-error");

  const inputs = cleanInputs($("age").value, posInput && posInput.value, $("days").value);
  if (!inputs || !hurtInput) {
    err.textContent = "Please fill in every box, including the arm check.";
    err.hidden = false;
    return;
  }
  err.hidden = true;

  // SAFETY GATE: arm pain / tingling / injury → stop screen, no exercises at all.
  if (hurtInput.value === "arm") {
    clearPlan();
    show("stop");
    return;
  }

  // Tired or sore legs/body (not the arm) → plan is OK, but a light day.
  $("today-banner").hidden = (hurtInput.value !== "body");

  current = inputs;
  renderRoutine(inputs.age, inputs.pos);
  renderAfterThrowing(inputs.age);
  renderWeek(inputs.days, inputs.pos);
  renderPitchSmart(inputs.age);
  const track = ageBand(inputs.age);
  $("track-badge").textContent = `${TRACKS[track].name} plan · ${TRACKS[track].ages}`;
  $("track-badge").className = `track-badge track-${track}`;
  $("plan-title").textContent = `Plan: age ${inputs.age}, ${POSITION_NAMES[inputs.pos].toLowerCase()}`;
  $("plan-summary").textContent = `${inputs.days} practice/game day${inputs.days > 1 ? "s" : ""} per week.`;
  $("pitches").value = "";
  $("calc-result").textContent = "";
  $("share-status").textContent = "";
  show("plan");
  countPlan();
});

// Remove exercises from the page so they can't be printed or seen.
function clearPlan() {
  ["routine", "position-notes", "after", "week", "pitch-smart"].forEach(id => { $(id).innerHTML = ""; });
  $("today-banner").hidden = true;
}

// "Watch" buttons: show the video right under the exercise, tap again to hide.
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".watch");
  if (!btn) return;
  const slot = btn.nextElementSibling;
  if (slot.firstChild) {
    slot.innerHTML = "";
    btn.textContent = "▶ Watch";
    return;
  }
  const video = document.createElement("video");
  video.src = btn.dataset.video;
  video.controls = true;
  video.muted = true;        // the clips have no sound
  video.loop = true;
  video.playsInline = true;  // play inside the page on iPhones, not full screen
  video.autoplay = true;
  slot.appendChild(video);
  btn.textContent = "✕ Hide video";
});

function startOver() {
  $("plan-form").reset();
  clearPlan();
  current = null;
  history.replaceState(null, "", location.pathname);
  show("setup");
}

$("hurt-btn").addEventListener("click", () => { clearPlan(); show("stop"); });
$("stop-back").addEventListener("click", startOver);
$("restart-btn").addEventListener("click", startOver);
$("print-btn").addEventListener("click", () => window.print());

$("pitches").addEventListener("input", (e) => {
  const n = parseInt(e.target.value, 10);
  $("calc-result").textContent = current && n > 0 ? restDaysFor(current.age, n) : "";
});


/* ------------------------------------------------------------
   8) SHARING
   The link only holds age, position and days — no names.
   Whoever opens it still has to answer the arm check.
   ------------------------------------------------------------ */

$("share-btn").addEventListener("click", async () => {
  if (!current) return;
  const url = `${location.origin}${location.pathname}?age=${current.age}&pos=${current.pos}&days=${current.days}`;
  const status = $("share-status");
  try {
    if (navigator.share) {
      await navigator.share({ title: "Healthy Arms plan", text: "Our team's 10-minute arm care routine:", url });
      status.textContent = "";
    } else {
      await navigator.clipboard.writeText(url);
      status.textContent = "Link copied! Paste it in a text or email.";
    }
  } catch (err) {
    // If sharing was cancelled or blocked, just show the link to copy by hand.
    if (err && err.name === "AbortError") return;
    status.textContent = "Copy this link: " + url;
  }
});

// If someone opened a shared link, fill in the form for them.
function loadFromLink() {
  const p = new URLSearchParams(location.search);
  const inputs = cleanInputs(p.get("age"), p.get("pos"), p.get("days"));
  if (!inputs) return;
  $("age").value = String(inputs.age);
  $("days").value = String(inputs.days);
  document.querySelector(`input[name="pos"][value="${inputs.pos}"]`).checked = true;
  // The arm check is left blank on purpose — it must be answered each time.
}
loadFromLink();


/* ------------------------------------------------------------
   9) ANONYMOUS COUNTER (only if GOATCOUNTER_CODE is set)
   Sends one thing: the event name "plan-generated".
   No cookies, no ages, no positions, no names.
   ------------------------------------------------------------ */

if (GOATCOUNTER_CODE) {
  window.goatcounter = { no_onload: true };   // don't count page views, only plans
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  s.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
  document.head.appendChild(s);
}

function countPlan() {
  if (GOATCOUNTER_CODE && window.goatcounter && window.goatcounter.count) {
    window.goatcounter.count({ path: "plan-generated", title: "Plan generated", event: true });
  }
}
