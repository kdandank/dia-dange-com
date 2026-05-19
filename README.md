# diadange.com

Birthday invitation website for **Dia Dange's first birthday** — *One-der the Sea* 🌊.

Live at [diadange.com](https://diadange.com).

---

## Site structure

```
index.html                      ← diadange.com           (landing page)
first-birthday/
  index.html                    ← diadange.com/first-birthday  (invite)
  dia-birthday.ics              ← calendar event download
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
