#!/usr/bin/env python3
"""Fixtures for safe, non-additive police-operation statistics."""
import datetime as dt
import unittest
from sync_fines import exact_total, parse_posts, is_valid_report

UTC = dt.timezone.utc


def make_post(mid, text, published="2026-11-18T10:00:00+00:00"):
    return (f'<div class="tgme_widget_message_wrap">'
            f'<div class="tgme_widget_message" data-post="Atanpolice/{mid}">'
            f'<time datetime="{published}"></time>'
            f'<div class="tgme_widget_message_text">{text}</div></div></div>')


class FinesTests(unittest.TestCase):
    def test_exact_weekly_total_not_category(self):
        self.assertEqual(7804, exact_total(
            'שוטרי ומתנדבי אגף התנועה, רשמו במהלך השבוע החולף 7,804 דו"חות '
            'במסגרת פעילות אכיפה. 838 דו"חות נרשמו בגין נהיגה במהירות מופרזת.'))

    def test_skip_approximate_counts(self):
        self.assertIsNone(exact_total(
            'שוטרי אגף התנועה רשמו למעלה מ-4,000 דוחות במסגרת פעילות אכיפה'))
        self.assertIsNone(exact_total(
            'שוטרי אגף התנועה רשמו כ-3,000 דוחות במסגרת פעילות אכיפה'))

    def test_skip_offence_only_subcount(self):
        self.assertIsNone(exact_total(
            'בפעילות אכיפה נרשמו 838 דוחות בגין נהיגה במהירות מופרזת'))

    def test_valid_parsed_period_and_url(self):
        now = dt.datetime(2026, 11, 18, 12, tzinfo=UTC)
        html = make_post(777, 'שוטרי אגף התנועה רשמו במהלך השבוע החולף 7,804 דו"חות')
        reports = parse_posts(html, now)
        self.assertEqual(1, len(reports))
        self.assertEqual(7804, reports[0]["count"])
        self.assertEqual("week", reports[0]["period"])
        self.assertEqual("https://t.me/Atanpolice/777", reports[0]["sourceUrl"])
        self.assertTrue(is_valid_report(reports[0]))

    def test_reject_unverified_old_or_unknown_post(self):
        now = dt.datetime(2026, 11, 18, 12, tzinfo=UTC)
        html = make_post(777, "דיווח תנועה: כביש 6 נחסם") + \
            make_post(123, 'שוטרי אגף התנועה רשמו 200 דוחות', "2020-01-01T10:00:00+00:00")
        self.assertEqual([], parse_posts(html, now))


if __name__ == "__main__":
    unittest.main()
