# NEOLINE Israel — Theory Game 2.0 (2026-11-18)

## Deployed design files in `main` (Cloudflare deployment unverified)
- `teoria.html`: approved scenic banner, 5 visual game modes, on-screen road-progress strip, a richer results screen, and a full-screen on-device progress dialog.
- `teoria-v2.css`: responsive white / sky-blue NEOLINE styling for the lobby, quiz, results, Game Over and progress screens; respects reduced motion and RTL.
- `teoria-v2.js`: presents **actual** user statistics, history (up to the 30 sessions available from the existing store), achievements, a seven-day chart with missing days left empty, a quiz-road progress animation, and earned-XP visual feedback.
- `teoria-reference-art.css`: now uses lightweight cropped artwork from the **user-approved** game mockup for the hero and five mode tiles, rather than unrelated stock photos; it is embedded in CSS for offline use. The original generated SVGs remain in the repository as unused fallbacks. Official question images are unchanged; we do not invent or replace missing official diagrams.
- `teoria.js`: publishes only presentation events; existing scoring and question handling are preserved.
- `teoria-gifts.js` / `teoria-gifts.css`: informational preview; not a promotion or fulfilled prize.

## Data and non-negotiable behavior
- Continue to pull real questions from the official Israeli government bank.
- The mock exam does not reveal right answers while it is running.
- The three-life rule and the original +15 XP per correct answer stay unchanged. **No negative XP has been implemented.**
- Five modes, live quiz and results persist. No synthetic accuracy, fake attempts, future level number, or fabricated progress are shown.
- Existing progress stays on the current device under keys `neoline-teoria:v1:<language>:<licence>`; preserve this format.
- Five real achievements are inferred from observed history and saved as local badges under `neoline-teoria-achievements:v1:<language>:<licence>`, so badges stay unlocked after the 30-entry history window rolls over. These **cannot** be redeemed for discounts or prizes.
- We have **not** created a real customer account, gift checkout, cart credit, price discount, any discount code, or an XP redemption threshold.
- Future verified customer accounts should include server-side score validation and an optional safe migration of local progress (never a blind trust of client-side XP).

## Quality checks made
- JavaScript source syntax checks on `teoria.js`, `teoria-v2.js`, `teoria-dashboard.js`, `teoria-gifts.js`.
- No duplicate IDs in `teoria.html`; main sections/dialogs balanced; all five game modes and bottom-nav links preserved.
- Stylesheet brace balance and required script / illustration links checked.
- No browser pixel render or Cloudflare deployment verification is available in this session; verify on an actual mobile device after publishing.

## Backup
`backup-before-approved-game-v2-20261118`

## 2026-11-18 design correction
The user specifically rejected the random stock images, particularly the unrelated blue Subaru and real-world STOP sign, as inconsistent with the approved concept. Those stock photo URLs have been removed from `teoria.html`. The hero and mode illustrations are now the actual decorative crops from the user's preferred 6-screen reference. These crops are a lower-resolution **visual approximation** to the chosen mockup, not original high-resolution generated assets. Main page mechanics and official government question images are not affected.
Backup: `backup-before-ref-image-match-20261118`.
