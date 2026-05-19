# diadange.com

Birthday invitation website for **Dia Dange's first birthday** — *One-der the Sea* 🌊.

Live at [diadange.com](https://diadange.com).

---

## Site structure

```
index.html                      ← diadange.com                      (landing page)
first-birthday/
  index.html                    ← diadange.com/first-birthday       (invite + RSVP form)
  dia-birthday.ics              ← calendar event download
  google-apps-script.js         ← Apps Script source for RSVP backend (reference only)
  rsvp/
    index.html                  ← diadange.com/first-birthday/rsvp  (RSVP guest list)
CNAME                           ← custom domain for GitHub Pages
LICENSE                         ← MIT
.gitignore
.github/
  workflows/
    pr-checks.yml               ← CI: content + ICS + spell-check tests on every PR
tests/
  test_content.py               ← validates party details, links, buttons, ICS, map URLs
  test_spellcheck.py            ← spell-check (advisory, never fails CI)
.githooks/
  post-commit                   ← local spell-check after every commit
.codespell-ignore               ← words excluded from spell check
requirements-dev.txt            ← codespell
environment.yml                 ← conda environment (dia-birthday)
setup.sh                        ← one-time local setup
setup-github.sh                 ← one-time GitHub repo configuration
designs/                        ← design mockups (not part of the live site)
```

---

## First-time setup

Run once after cloning:

```bash
./setup.sh
```

This configures git hooks and installs dev dependencies. Activate the environment before running tests:

```bash
# conda
conda activate dia-birthday

# or venv
source .venv/bin/activate
```

---

## Running tests

```bash
# All tests
python3 -m unittest discover -s tests -v

# Content validation only
python3 -m unittest tests.test_content -v

# Spell check only
python3 -m unittest tests.test_spellcheck -v
```

**Content tests** fail if any of the following is missing or broken:
- Party details: date, time, address, theme
- Landing page link to `/first-birthday`
- Add to Calendar button linking to `dia-birthday.ics`
- Navigate modal with Google Maps, Apple Maps, and Waze links
- ICS file: valid VCALENDAR structure, correct date/time/location

**Spell-check tests** always pass but print warnings for any findings.

---

## Editing content

| File | What it controls |
|---|---|
| `index.html` | Landing page (`diadange.com`) |
| `first-birthday/index.html` | Invite page (`diadange.com/first-birthday`) |
| `first-birthday/dia-birthday.ics` | Calendar event (date, time, location, title) |

After editing, run the tests to make sure all details are still consistent:

```bash
python3 -m unittest discover -s tests -v
```

To add a word to the spell-check ignore list:

```bash
echo "YourWord" >> .codespell-ignore
```

---

## RSVP setup (Google Sheets + Apps Script)

The RSVP form POSTs to a Google Apps Script web app, which writes rows to a Google Sheet. The RSVP display page (`/rsvp`) GETs from the same endpoint.

### 1. Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) → create a new sheet
2. Rename the first tab to **RSVPs**
3. In row 1, add these headers exactly:

   | A | B | C | D | E | F |
   |---|---|---|---|---|---|
   | Timestamp | Attending | Name | Plus Ones | Phone | Message |

### 2. Create the Apps Script

1. In the Sheet: **Extensions → Apps Script**
2. Delete the default code and paste the contents of [`first-birthday/google-apps-script.js`](first-birthday/google-apps-script.js)
3. Save the project (name it anything)

### 3. Deploy as a Web App

1. **Deploy → New deployment**
2. Type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Click **Deploy** → copy the URL

### 4. Wire up the URL

Paste the URL into both files, replacing `PASTE_YOUR_APPS_SCRIPT_URL_HERE`:

- [`first-birthday/index.html`](first-birthday/index.html) — `SCRIPT_URL` in the `<script>` block
- [`first-birthday/rsvp/index.html`](first-birthday/rsvp/index.html) — `SCRIPT_URL` in the `<script>` block

---

## Hosting: GitHub Pages + custom domain

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin git@github.com:<your-username>/dia-dange-com.git
git push -u origin main
```

### 2. Configure the repo (one-time)

```bash
./setup-github.sh <owner/repo>
# e.g. ./setup-github.sh kdandank/dia-dange-com
```

This sets squash-merge-only, branch protection on `main`, and enables GitHub Pages.

### 3. Point diadange.com to GitHub Pages

In **WordPress.com → Domains → DNS Records** for `diadange.com`, add:

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | diadange.com |

Then in GitHub: **Settings → Pages → Custom domain → `diadange.com`** and enable **Enforce HTTPS** once the domain is verified.

DNS propagation typically takes a few minutes to a few hours.
