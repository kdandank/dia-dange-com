#!/usr/bin/env python3
"""
Content validation tests for diadange.com.

Checks that both pages contain the required party details and
structural elements. These tests FAIL on missing content.

Run:  python3 -m unittest tests.test_content -v
 or:  python3 -m unittest discover -s tests -v
"""

import os
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LANDING = os.path.join(ROOT, "index.html")
INVITE  = os.path.join(ROOT, "first-birthday", "index.html")


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


class TestLandingPage(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.html = read(LANDING)

    def test_file_exists(self):
        self.assertTrue(os.path.isfile(LANDING), "index.html is missing")

    def test_has_title(self):
        self.assertIn("<title>", self.html)

    def test_dia_name_present(self):
        self.assertIn("Dia", self.html)

    def test_link_to_invite(self):
        self.assertIn("/first-birthday", self.html,
                      "Landing page must link to /first-birthday")

    def test_cta_button_is_anchor(self):
        self.assertIn("href", self.html,
                      "CTA must be an <a> tag with href, not just a <button>")

    def test_viewport_meta(self):
        self.assertIn('name="viewport"', self.html)

    def test_no_placeholder_text(self):
        for placeholder in ["TODO", "FIXME", "Lorem ipsum", "placeholder"]:
            self.assertNotIn(placeholder, self.html,
                             f"Found placeholder text: {placeholder!r}")


class TestInvitePage(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.html = read(INVITE)

    def test_file_exists(self):
        self.assertTrue(os.path.isfile(INVITE), "first-birthday/index.html is missing")

    def test_has_title(self):
        self.assertIn("<title>", self.html)

    def test_party_theme(self):
        self.assertIn("One-der", self.html, "Party theme 'One-der the Sea' must appear")

    def test_dia_name_present(self):
        self.assertIn("Dia", self.html)

    def test_party_date(self):
        self.assertIn("June 20", self.html, "Party date (June 20) must be on the invite")

    def test_party_time(self):
        self.assertIn("1:00 PM", self.html, "Party time (1:00 PM) must be on the invite")

    def test_party_address(self):
        self.assertIn("327 E Foster St", self.html,
                      "Party address must be on the invite")
        self.assertIn("Melrose", self.html,
                      "City (Melrose) must be on the invite")

    def test_poem_present(self):
        self.assertIn("fishies", self.html, "Poem must appear on the invite page")

    def test_viewport_meta(self):
        self.assertIn('name="viewport"', self.html)

    def test_no_placeholder_text(self):
        for placeholder in ["TODO", "FIXME", "Lorem ipsum"]:
            self.assertNotIn(placeholder, self.html,
                             f"Found placeholder text: {placeholder!r}")


if __name__ == "__main__":
    unittest.main(verbosity=2)
