# PRD Discrepancies - UAT Execution

**Purpose:** Track discrepancies between PRD specification and actual implementation discovered during UAT
**Created:** 2026-01-20
**Pattern:** DISC-### for discrepancy IDs

## Discrepancy Tracking Template

Each discrepancy entry follows this structure:

| Field | Description |
|-------|-------------|
| **ID** | DISC-### (sequential) |
| **Severity** | High / Medium / Low |
| **Component** | Feature/page where discrepancy found |
| **Discovered In** | UAT test case ID (e.g., UAT-SEEK-04) |
| **Type** | Missing Feature / Different Behavior / UI Difference / Spec Gap |
| **PRD Specification** | What the PRD says should happen |
| **Actual Implementation** | What actually exists |
| **Evidence** | Screenshot filenames, code references |
| **Impact** | User impact or business impact |
| **Recommendation** | Fix / Accept / Document / Defer |

---

## Discovered Discrepancies

### Discrepancies will be documented here as tests reveal spec gaps

Format:
```markdown
## DISC-001: [Short description of discrepancy]

**Severity:** [High/Medium/Low]
**Component:** [Component name]
**Discovered in:** [UAT test case ID]
**Type:** [Missing Feature / Different Behavior / UI Difference / Spec Gap]

**PRD Specification:**
[What the PRD says should happen]

**Actual Implementation:**
[What actually exists in the application]

**Evidence:**
- Screenshot: evidence/screenshots/DISC-001_*.png
- Code reference: [file:line or description]
- PRD reference: [REQUIREMENTS.md section]

**Impact:**
[Describe user or business impact]

**Recommendation:**
[Fix immediately / Accept as-is / Document for next version / Defer]

**Notes:**
[Any additional context]
```

---

**Summary:**
- Total discrepancies discovered: 0
- High: 0
- Medium: 0
- Low: 0
- To fix: 0
- Accepted: 0
- Deferred: 0
