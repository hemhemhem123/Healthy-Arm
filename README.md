# Healthy Arms – Launch Guide

A free, no-login web app that gives youth coaches (players 8–14) a 10-minute arm care routine, a weekly plan, and Pitch Smart pitch-count rules.

**Total cost: $0.** You need a GitHub account (free), and if you want the counter, a GoatCounter account (also free).

---

## Part 1 – What's in the folder

There are 4 files. Together they're the whole app. There's no server and no database.

| File | What it does | Think of it as… |
|---|---|---|
| `index.html` | The page itself: header, form, stop screen, plan sections, footer | The skeleton |
| `style.css` | Colors, sizes, phone layout, and what prints | The uniform |
| `app.js` | The logic: builds the routine, the week, the rules table, the safety stop, sharing, and the counter | The brain |
| `README.md` | This guide | The playbook |
| `videos/` | 9 short demo clips (no sound, ~1–2 MB each) | The highlight reel |

**How it works, start to finish:**
1. The coach fills in the form (age, position, days per week, and the **arm check**).
2. `app.js` checks the answers. If the arm check says **Yes**, it clears the page and shows only the stop screen. No exercises.
3. If the answer is **No**, it builds the routine from lists of exercises, picks reps by age, adds one exercise for the player's position, and builds the week and the Pitch Smart table.
4. All of this happens on the coach's phone. Nothing gets saved or sent anywhere except the optional anonymous "plan-generated" count.

---

## Part 2 – Try it on your computer first (2 minutes)

1. Put all 4 files in one folder.
2. Double-click `index.html`. It opens in your browser.
3. Click through it: try "Yes, something hurts," try each position, try the print button.

Note: the Share button and the counter only fully work once the app is online (Part 3).

---

## Part 3 – Put it online with GitHub Pages (15 minutes)

GitHub Pages hosts simple websites for free, with no ads and no expiration. You own everything.

1. **Make an account** at <https://github.com>. Pick your username carefully because it becomes part of your link.
2. **Create a repository** (a project folder online):
   - Click the **+** in the top right → **New repository**
   - Name: `healthy-arms`
   - Set to **Public** (free Pages hosting requires public)
   - Leave everything else alone → **Create repository**
3. **Upload the files:**
   - On the new empty repo page, click the link **"uploading an existing file"**
   - Drag in `index.html`, `style.css`, `app.js`, `README.md`
   - Scroll down → **Commit changes**
4. **Turn on Pages:**
   - Click **Settings** (top of the repo) → **Pages** (left menu)
   - Under "Build and deployment" → Source: **Deploy from a branch**
   - Branch: **main**, folder: **/ (root)** → **Save**
5. **Wait 1–2 minutes**, then refresh that Settings → Pages screen. It will show your link:
   `https://YOUR-USERNAME.github.io/healthy-arms/`
6. **Open the link on your phone** and test everything again, including **Share with parents**.

That link is what you text to coaches. 🎉

### Uploading an update (like the videos)
1. On your repo page: **Add file → Upload files**.
2. Drag in `index.html`, `style.css`, `app.js`, `README.md` **and the whole `videos` folder** (drag the folder itself, and GitHub keeps it as a folder).
3. **Commit changes.** Files with the same name get replaced. The site updates in about a minute.

### Making changes later
- In your repo, click a file (say `app.js`) → the **pencil icon** → edit → **Commit changes**.
- The live site updates in about a minute. If your phone still shows the old version, refresh or close and reopen the tab.

---

## Part 4 – Turn on the anonymous counter (optional, 10 minutes)

GoatCounter is a free, privacy-friendly counter. It doesn't use cookies, and the app only sends one thing: the event name `plan-generated`. No ages, positions, or names are sent.

1. Sign up at <https://www.goatcounter.com>. Pick a code, like `healthyarms`. Your dashboard will be at `https://healthyarms.goatcounter.com`.
2. In GitHub, open `app.js` → pencil icon. Near the top, change:
   ```js
   const GOATCOUNTER_CODE = "";
   ```
   to
   ```js
   const GOATCOUNTER_CODE = "healthyarms";
   ```
3. Commit. Make a plan on the live site, then check your GoatCounter dashboard. You'll see **plan-generated** in the list, with a count.

If you leave the code as `""`, the counter is completely off and no outside script loads.

---

## Part 5 – How to change things yourself

Everything you'd want to tweak is near the top of `app.js`, written as plain lists:

- **Change an exercise or a cue:** edit the `WARMUP`, `ARM_NO_BAND`, `ARM_BAND`, `MOBILITY`, or `AFTER_THROWING` lists. To add a video, put the clip in `videos/` and add `video: "videos/your-clip.mp4",` to that exercise. To show a stretch only in the Advanced plan, add `minAge: ADVANCED_AGE,`. Each exercise looks like this:
  ```js
  { name: "Cat-cow", dose: "6 slow ones", cue: "On hands and knees..." },
  ```
  `dose` can be one value for everyone, or `{ young: ..., advanced: ... }` (Younger players 8–11, Advanced 12–14).
- **Move the line between the two plans:** change `ADVANCED_AGE = 12` near the top of `app.js`.
- **Change the position extra:** edit `POSITION_EXTRA`.
- **Change which days are practice days:** edit `PRACTICE_PATTERNS`.
- **Update Pitch Smart numbers:** edit `PITCH_SMART`, then update `PITCH_SMART_CHECKED`. Recheck the official site before each season: <https://www.mlb.com/pitch-smart/pitching-guidelines>
- **Change colors:** edit the `:root` section at the top of `style.css`.

---

## Part 6 – Design choices (and why)

- **The arm check is required every time.** The app has no free-text box at all, so nobody can type a kid's name or describe an injury. Instead it asks how the player feels, with three choices:
  - **Feeling good** → full plan.
  - **Tired or sore legs/body (not the throwing arm)** → plan, plus a "light day, no pitching today" banner.
  - **Pain, soreness, or tingling in the arm, shoulder, elbow, or neck, or an injury** → the stop message only.
  An "Arm hurts at any point? Tap here" link on the plan screen also goes to the stop message.
- **Videos load only when tapped.** Each clip downloads only when someone taps ▶ Watch, so the page stays fast on a phone. Videos don't print.
- **Two plans by age.** Ages 8–11 get the **Younger players** plan, and ages 12–14 get the **Advanced** plan. A colored label at the top shows which one. Advanced adds band work, more reps, and two extra stretches (doorway lay-back and neck stretch).
- **Shared links don't skip the arm check.** A shared link fills in age, position, and days, but the person opening it still has to answer the arm check.
- **No weight field.** For a light warm-up like this, weight doesn't safely change anything. Age and position do. A weight box would collect info about a kid without changing the plan, so I left it out. You can add it back if you find a real use.
- **No bands for ages 8–11.** Body weight is plenty at that age. Ages 12–14 use only the lightest band.
- **No static "sleeper"-style stretches.** Before throwing, moving stretches are the safer, more common choice.
- **Sunday is always a full day off,** and coaches who pick 5–6 days get a reminder about rest and other sports.

---

## Part 7 – Before you text the link (checklist)

- [ ] **Have an athletic trainer, PT, or team doctor look over the routine.** This is the most important item. It takes them 5 minutes, makes the app safer, and coaches will trust it more. (Your school's athletic trainer is a great person to ask.)
- [ ] Show it to a parent or your coach, since this is a health-related app with your name on it.
- [ ] Test on both an iPhone and an Android if you can.
- [ ] Try printing the plan once.
- [ ] Check Pitch Smart against the official site, and remind coaches that their league (like Little League) has its own required pitch rules.
