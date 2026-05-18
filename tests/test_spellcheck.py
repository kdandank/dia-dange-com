#!/usr/bin/env python3
"""
Spell-check test for all HTML files.

Always passes; findings are printed as warnings, never as failures.
Run:  python3 -m unittest tests.test_spellcheck -v
 or:  python3 -m unittest discover -s tests -v
"""

import os
import subprocess
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES = [
    os.path.join(ROOT, "index.html"),
    os.path.join(ROOT, "first-birthday", "index.html"),
]
IGNORE = os.path.join(ROOT, ".codespell-ignore")


class TestSpellCheck(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        try:
            result = subprocess.run(["codespell", "--version"], capture_output=True)
            if result.returncode != 0:
                raise unittest.SkipTest(
                    "codespell not installed; run: pip install -r requirements-dev.txt"
                )
        except FileNotFoundError:
            raise unittest.SkipTest(
                "codespell not found; run: pip install -r requirements-dev.txt"
            )

    def test_landing_page_spelling(self):
        """Spell-check index.html. Prints findings but never fails."""
        self._check(FILES[0])

    def test_invite_page_spelling(self):
        """Spell-check first-birthday/index.html. Prints findings but never fails."""
        self._check(FILES[1])

    def _check(self, path):
        result = subprocess.run(
            ["codespell", path, "--ignore-words", IGNORE],
            capture_output=True,
            text=True,
        )
        findings = (result.stdout + result.stderr).strip()
        if findings:
            rel = os.path.relpath(path, ROOT)
            print(f"\n\n  ⚠️  Spell check findings in {rel}:\n", file=sys.stderr)
            for line in findings.splitlines():
                print(f"      {line}", file=sys.stderr)
            print(
                f"\n      Fix:    codespell -w {rel} --ignore-words .codespell-ignore"
                f"\n      Ignore: add the word to .codespell-ignore\n",
                file=sys.stderr,
            )


if __name__ == "__main__":
    unittest.main(verbosity=2)
