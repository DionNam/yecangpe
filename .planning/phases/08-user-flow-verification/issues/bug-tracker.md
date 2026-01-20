# Bug Tracker - Phase 8 UAT

**Created:** 2026-01-21
**Purpose:** Track bugs discovered during seeker journey UAT execution

## Bug Summary

**Total Bugs:** _____
**Critical:** _____ (blocks core functionality)
**High:** _____ (significant UX impact)
**Medium:** _____ (minor UX issues or edge cases)
**Low:** _____ (cosmetic or documentation)

---

## Bug List

| Bug ID | Test Case | Severity | Description | Reproduction Steps | Status |
|--------|-----------|----------|-------------|-------------------|--------|
| _Example: BUG-SEEK-001_ | _UAT-SEEK-XX_ | _Critical/High/Medium/Low_ | _Brief description_ | _1. Step 1<br>2. Step 2<br>3. Observe issue_ | _Open/Fixed/Wont Fix_ |

---

## Bug Details

<!-- Add detailed bug reports below as needed -->

### Example Bug Format (delete this when adding real bugs)

**Bug ID:** BUG-SEEK-001
**Test Case:** UAT-SEEK-07
**Severity:** High
**Status:** Open

**Description:**
Heart button does not toggle when clicked - remains unfilled even after clicking.

**Reproduction Steps:**
1. Log in as seeker user
2. Navigate to job detail page
3. Click heart button
4. Observe heart button does not fill
5. Refresh page - like is not persisted

**Expected Behavior:**
- Heart button fills immediately (optimistic UI)
- Like is saved to database
- State persists after refresh

**Actual Behavior:**
- Heart button remains unfilled
- Console shows error: "Failed to create like record"
- No database entry created

**Environment:**
- Browser: Chrome 131
- URL: http://localhost:3000/jobs/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
- User: seeker+uat@hire-foreigner.test

**Related:**
- Test Case: UAT-SEEK-07
- Requirement: LIKE-01, LIKE-03

---

<!-- Add actual bugs discovered during UAT below -->
