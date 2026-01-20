# PRD Mismatches - Phase 8 UAT

**Created:** 2026-01-21
**Purpose:** Track gaps between PROJECT.md PRD specifications and actual implementation

## Summary

**Total Mismatches:** _____
**Requires Code Changes:** _____ (implementation missing or incorrect)
**Requires PRD Clarification:** _____ (ambiguous or incomplete spec)
**Acceptable Deviations:** _____ (intentional design decisions)

---

## Mismatch List

| Gap ID | Test Case | PRD Feature (from PROJECT.md) | Actual Behavior | Impact | Remediation |
|--------|-----------|-------------------------------|-----------------|--------|-------------|
| _Example: GAP-SEEK-001_ | _UAT-SEEK-XX_ | _PRD feature description_ | _What actually happens_ | _High/Medium/Low_ | _Fix implementation / Update PRD / Accept deviation_ |

---

## Gap Details

<!-- Add detailed mismatch reports below as needed -->

### Example Gap Format (delete this when adding real gaps)

**Gap ID:** GAP-SEEK-001
**Test Case:** UAT-SEEK-03
**Impact:** Medium

**PRD Feature (from PROJECT.md):**
> 공고 리스트 조회 (비로그인 가능) — v1.0

PRD specifies that non-logged-in users can view job list but must login to see details.

**Actual Behavior:**
Job list is accessible without login as expected. However, clicking job title directly navigates to detail page and shows full content without login prompt.

**Impact:**
Medium - Violates access control design. Users can view full job details without creating account, reducing signup conversion.

**Remediation:**
**Option 1 (Recommended):** Fix implementation
- Add middleware to block /jobs/[id] route for non-logged-in users
- Show login modal when unauthenticated user clicks job title
- Preserve intended URL for redirect after login

**Option 2:** Update PRD
- If business decision changed, update PRD to reflect open access to job details
- Update RLS policies to allow public reads

**Related:**
- Test Cases: UAT-SEEK-03, UAT-SEEK-10, UAT-SEEK-ERR-01
- Requirements: DETL-01, DETL-02
- PRD Section: "잡포스팅 (구직자 플로우)"

---

<!-- Add actual PRD mismatches discovered during UAT below -->
