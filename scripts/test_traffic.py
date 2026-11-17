#!/usr/bin/env python3
"""Offline parser regression checks for cautious NEOLINE traffic alerts."""
import datetime as dt
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from sync_traffic import classify, parse_posts, MAX_AGE_MINUTES, UTC

NOW = dt.datetime(2026, 11, 17, 14, 0, tzinfo=UTC)

def post(number, when, message):
    return (
        f'<div class="tgme_widget_message_wrap"><div class="tgme_widget_message" '
        f'data-post="Atanpolice/{number}">'
        f'<div class="tgme_widget_message_text">{message}</div>'
        f'<time datetime="{when}"></time></div></div>'
    )

class TrafficTests(unittest.TestCase):
    def test_types(self):
        self.assertEqual(classify("כביש 6 נחסם לתנועה בעקבות תאונת דרכים"), "closure")
        self.assertEqual(classify("כביש 1 נפתח לתנועה"), "reopened")
        self.assertEqual(classify("עומסי תנועה בכביש 20"), "congestion")
        self.assertEqual(classify("כביש 1 נסגר מוקדם יותר ונפתח לתנועה"), "update")
        self.assertEqual(classify("כביש 4 צפוי להיחסם מחר"), "planned")
        self.assertIsNone(classify("אכיפה משטרתית בכביש 6"))
        self.assertIsNone(classify("היום מתפרסמות חדשות על רכב מסחרי"))

    def test_fresh_only_and_source(self):
        fresh = post(991, "2026-11-17T13:45:00+00:00", "כביש 6 נחסם לתנועה בעקבות תאונת דרכים")
        stale = post(992, "2026-11-17T07:00:00+00:00", "כביש 90 חסום לתנועה")
        irrelevant = post(993, "2026-11-17T13:55:00+00:00", "ברוכים הבאים לערוץ המשטרה")
        html = fresh + stale + irrelevant
        items = parse_posts(html, NOW)
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]["roads"], ["6"])
        self.assertEqual(items[0]["kind"], "closure")
        self.assertEqual(items[0]["url"], "https://t.me/Atanpolice/991")
        self.assertEqual(items[0]["publishedAt"], "2026-11-17T13:45:00Z")

    def test_missing_markup_fails_closed(self):
        with self.assertRaises(ValueError):
            parse_posts("<html><body>403</body></html>", NOW)

    def test_short_expiry(self):
        self.assertLessEqual(MAX_AGE_MINUTES, 240)

if __name__ == "__main__":
    unittest.main()
