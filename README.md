# diadange.com

Birthday invitation website for **Dia Dange's first birthday** — *One-der the Sea* 🌊.

Live at [diadange.com](https://diadange.com).

---

## Site structure

```
index.html                  ← diadange.com      (landing page)
first-birthday/
  index.html                ← diadange.com/first-birthday  (invite)
CNAME                       ← custom domain for GitHub Pages
.github/
  workflows/
    pr-checks.yml           ← CI: content + spell-check tests on every PR
tests/
  test_content.py           ← validates party details, links, structure
  test_spellcheck.py        ← spell-check (advisory, never fails CI)
.githooks/
  post-commit               ← local spell-check after every commit
.codespell-ignore           ← words excluded from spell check
requirements-dev.txt        ← codespell
environment.yml             ← conda environment (dia-birthday)
setup.sh                    ← one-time local setup
setup-github.sh             ← one-time GitHub repo configuration
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

Content tests **fail** if any party detail (date, time, address, theme, link) is missing.  
Spell-check tests always **pass** but print warnings for any findings.

---

## Editing content

| Page | File |
|---|---|
| Landing (`diadange.com`) | `index.html` |
| Invite (`diadange.com/first-birthday`) | `first-birthday/index.html` |

After editing, run the tests to make sure all details are still present:

```bash
python3 -m unittest discover -s tests -v
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

### 3. Enable GitHub Pages

In the GitHub repo: **Settings → Pages → Source → Deploy from branch → main / root**.

### 4. Point diadange.com to GitHub Pages

In **WordPress.com → Domains → DNS Records** for `diadange.com`, add:

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | diadange.com |

Then in GitHub: **Settings → Pages → Custom domain → `diadange.com`** and check **Enforce HTTPS** once verified.

DNS propagation typically takes a few minutes to a few hours.

---

## Adding a word to the spell-check ignore list

```bash
echo "YourWord" >> .codespell-ignore
```
