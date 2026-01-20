# Functional Bugs - UAT Execution

**Purpose:** Track functional bugs discovered during UAT test execution (seeker, employer, admin journeys)
**Created:** 2026-01-20
**Pattern:** BUG-### for bug IDs

## Bug Tracking Template

Each bug entry follows this structure:

| Field | Description |
|-------|-------------|
| **ID** | BUG-### (sequential) |
| **Severity** | Critical / High / Medium / Low |
| **Component** | Authentication / Job List / Job Detail / Likes / Profile / etc. |
| **Discovered In** | UAT test case ID (e.g., UAT-SEEK-07) |
| **Status** | Open / Fixed / Deferred |
| **Reproduction Steps** | Derived from actual test execution |
| **Expected Behavior** | What should happen per PRD/spec |
| **Actual Behavior** | What actually happened during test |
| **Evidence** | Screenshot filenames, database query results |

---

## Known Tech Debt Items to Validate

### DEBT-01: KakaoTalk Link Placeholder
- **Component:** Landing Page
- **Issue:** KakaoTalk link is placeholder, not functional
- **Status:** Known tech debt from v1.0
- **To Validate:** Confirm link does not work during UAT-CROS tests

### DEBT-02: Employer Onboarding Redirect
- **Component:** Employer Onboarding
- **Issue:** Redirects to / instead of /employer/new-post after onboarding
- **Status:** Known tech debt from v1.0
- **To Validate:** Confirm redirect behavior in UAT-EMPL-02

### DEBT-03: Job List Like Counts (BUG-01)
- **Component:** Job List Display
- **Issue:** Job list missing real like counts (displays fake metrics only)
- **Status:** Known tech debt from v1.0
- **To Validate:** Confirm like count display in UAT-EMPL-12

---

## Discovered Bugs

### Bugs will be documented here as tests fail

Format:
```markdown
## BUG-001: [Short description]

**Severity:** [Critical/High/Medium/Low]
**Component:** [Component name]
**Discovered in:** [UAT test case ID]
**Status:** Open

**Reproduction Steps:**
1. [Step 1]
2. [Step 2]
3. [Actual result]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What happened]

**Evidence:**
- Screenshot: evidence/screenshots/BUG-001_*.png
- Database query result: [paste query result]

**Notes:**
[Any additional context]
```

---

**Summary:**
- Total bugs discovered: 0
- Critical: 0
- High: 0
- Medium: 0
- Low: 0
- Fixed: 0
- Open: 0
