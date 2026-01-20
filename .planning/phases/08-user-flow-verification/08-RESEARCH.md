# Phase 8: User Flow Verification - Research

**Researched:** 2026-01-21
**Domain:** Browser automation testing with Chrome MCP
**Confidence:** MEDIUM

## Summary

Phase 8 focuses on verifying seeker user flow using Chrome MCP browser automation through Claude Code. Research reveals that Chrome MCP provides natural language browser control but with specific limitations around OAuth flows and modal dialogs that require manual intervention.

**Key Finding:** Chrome MCP (claude-in-chrome) is designed for interactive browser automation with human-in-the-loop, not fully autonomous headless testing. OAuth flows require manual authentication, followed by automated verification of post-login behavior.

**Critical Constraint:** JavaScript alerts/confirms/prompts block browser events and prevent Claude from receiving commands. These must be dismissed manually before automation can continue.

**Primary recommendation:** Use Claude in Chrome for semi-automated UAT execution. Manual OAuth authentication followed by automated verification of authenticated user flows. Document test results in markdown format for traceability.

## Standard Stack

The established libraries/tools for browser automation testing with Claude Code:

### Core (HIGH confidence)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| claude-in-chrome | v1.0.36+ | Browser extension for Claude Code integration | Official Anthropic extension for browser automation |
| Claude Code CLI | v2.0.73+ | Terminal interface with Chrome integration | Official CLI for running Claude with Chrome MCP |
| Google Chrome | Latest | Browser platform | Required for claude-in-chrome extension |

**Source:** [Claude Code Chrome Documentation](https://code.claude.com/docs/en/chrome)

### Supporting (MEDIUM confidence)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Playwright MCP | Latest | Cross-browser E2E testing | When fully automated headless testing is required |
| Chrome DevTools MCP | Latest | Deep debugging and network inspection | When performance analysis is needed |

**Source:** [Browser Automation Best Practices](https://claudefa.st/blog/tools/mcp-extensions/browser-automation)

### Alternatives Considered (LOW confidence - not pursued)
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| claude-in-chrome | Playwright MCP | Playwright is better for CI/CD but requires scripting, not natural language |
| Manual testing | Selenium WebDriver | More control but higher maintenance burden |
| Interactive UAT | Cypress | Better for regression but not designed for initial UAT discovery |

**Installation:**
```bash
# Update Claude Code
claude update

# Start with Chrome enabled
claude --chrome

# Check connection status
/chrome

# Enable by default (optional)
/chrome  # then select "Enabled by default"
```

**Prerequisites:**
- Paid Claude plan (Pro, Team, or Enterprise)
- Google Chrome browser installed
- Claude in Chrome extension (v1.0.36+) installed from Chrome Web Store

## Architecture Patterns

### Recommended Test Execution Structure

```
.planning/phases/08-user-flow-verification/
├── execution/                    # Test execution tracking
│   ├── seeker-journey-results.md # UAT-SEEK-01 through UAT-SEEK-10 results
│   ├── employer-journey-results.md
│   ├── admin-journey-results.md
│   └── cross-flow-results.md
├── issues/                       # Discovered issues
│   ├── bug-tracker.md           # Bugs found during UAT
│   └── prd-mismatches.md        # PRD vs implementation gaps
└── 08-RESEARCH.md               # This file
```

### Pattern 1: Semi-Automated UAT Execution
**What:** Human-in-the-loop browser automation where Claude navigates and verifies while human handles authentication
**When to use:** OAuth flows, CAPTCHA-protected flows, initial UAT discovery
**Example:**

```typescript
// Claude Code workflow (natural language):
// 1. Human: "Navigate to http://localhost:3000 and verify landing page loads"
// 2. Claude: Navigates, reads DOM, reports findings
// 3. Human: "Click login button and wait for Google OAuth"
// 4. Claude: Clicks, detects OAuth redirect
// 5. Human: [Manually complete Google OAuth]
// 6. Human: "Verify I'm redirected to role selection page"
// 7. Claude: Checks URL, reads page content, verifies elements present
```

**Source:** [Chrome MCP Documentation - Authentication](https://code.claude.com/docs/en/chrome)

### Pattern 2: Test Data Setup Before Automation
**What:** Run SQL seed script before UAT execution to ensure deterministic state
**When to use:** All automated test runs
**Example:**

```bash
# Before UAT execution
cd .planning/phases/07-uat-test-case-design/test-data
# Run seed-uat-data.sql via Supabase SQL Editor

# Then execute UAT with Claude
claude --chrome
# Natural language: "Navigate to localhost:3000 and execute seeker journey tests"
```

**Source:** Phase 7 test case design (seed-uat-data.sql created in 07-02)

### Pattern 3: Markdown-Based Result Tracking
**What:** Document test results in markdown files with checkboxes, timestamps, and screenshots
**When to use:** All UAT execution
**Example:**

```markdown
### UAT-SEEK-01: Google OAuth Login Flow

**Status:** ✅ Pass
**Executed By:** Claude Code + Human (OAuth step)
**Execution Date:** 2026-01-21 14:32 KST
**Actual Result:**
- Landing page loaded successfully
- Login button clicked, redirected to Google OAuth
- [Manual] Completed Google authentication
- Redirected to /onboarding/role-selection
- Selected "구직자" role
- Redirected to /onboarding/seeker
- No errors in console

**Screenshots:** [Attached via Claude GIF recording]
**Defects Found:** None
```

### Pattern 4: Element Verification Strategy
**What:** Use DOM inspection and console log reading for verification instead of pixel-perfect screenshots
**When to use:** Functional verification (not visual regression)
**Example:**

```typescript
// Claude natural language workflow:
// "Check if job list table displays job posts and verify columns"

// Claude reads DOM and finds:
// - table element present
// - columns: 제목, 회사명, 국적, 조회수, 관심수, 상태
// - at least 1 row of data present
// - no error messages in console
```

**Source:** [Chrome MCP Capabilities](https://code.claude.com/docs/en/chrome)

### Anti-Patterns to Avoid

- **Fully Autonomous OAuth:** Don't expect Claude to complete Google OAuth automatically - requires manual authentication
- **Modal Dialog Automation:** JavaScript alerts/confirms/prompts block events - must dismiss manually before continuing
- **Hard-Coded Waits:** Don't use "wait 5 seconds" - instead use "wait for element to be visible"
- **All Console Logs:** Don't ask for all console output - specify patterns to look for (errors, warnings)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Browser automation framework | Custom Puppeteer scripts | Claude in Chrome + natural language | Claude handles element finding, waiting, navigation automatically |
| OAuth token management | Manual token storage/refresh | Browser session state | Chrome extension shares logged-in session state with Claude |
| Test result documentation | Custom reporting system | Markdown files with checkboxes | Version controllable, AI-readable, simple |
| Element waiting logic | setTimeout/sleep loops | Claude's implicit waits | "wait for button to be visible" handles dynamic content |
| Screenshot comparison | Pixel-diff tools | DOM inspection + console logs | Functional verification more stable than visual |
| Test data management | Random data generation | SQL seed script with fixed UUIDs | Deterministic, repeatable, easy cleanup |

**Key insight:** Chrome MCP's natural language interface eliminates need for traditional test framework boilerplate (page objects, explicit waits, element locators). Focus on test logic, not automation infrastructure.

## Common Pitfalls

### Pitfall 1: Expecting Fully Autonomous OAuth
**What goes wrong:** OAuth flows redirect to external providers (Google) that require human authentication
**Why it happens:** Chrome MCP cannot bypass OAuth security flows (CAPTCHA, multi-factor auth)
**How to avoid:** Plan for human-in-the-loop OAuth completion, then automated post-auth verification
**Warning signs:** Claude reports "OAuth login page detected, waiting for manual authentication"

**Example workflow:**
```bash
# WRONG: "Automate complete OAuth login flow"
# RIGHT: "Navigate to login, click Google OAuth button, and wait for me to complete authentication"
# Then after manual auth: "Verify redirect to role selection page"
```

**Source:** [Chrome MCP Authentication Handling](https://code.claude.com/docs/en/chrome)

### Pitfall 2: Modal Dialogs Blocking Automation
**What goes wrong:** JavaScript alert/confirm/prompt blocks all browser events, preventing Claude from receiving commands
**Why it happens:** Browser security model freezes event loop during modal dialogs
**How to avoid:** Manually dismiss dialogs, then tell Claude to continue
**Warning signs:** Claude stops responding during automation, browser shows alert/confirm dialog

**Example:**
```javascript
// If app shows: alert("공고가 제출되었습니다")
// 1. Human dismisses alert manually
// 2. Tell Claude: "Alert dismissed, continue with next step"
```

**Source:** [Chrome MCP Limitations - Modal Dialogs](https://code.claude.com/docs/en/chrome)

### Pitfall 3: Over-Reliance on Screenshots for Verification
**What goes wrong:** Screenshot comparison is brittle (font rendering, timing, dynamic content)
**Why it happens:** Assumption that visual verification is more reliable than functional verification
**How to avoid:** Use DOM inspection and console logs for functional verification; screenshots for documentation only
**Warning signs:** Tests fail due to minor visual differences (font antialiasing, timestamp changes)

**Example:**
```bash
# WRONG: "Take screenshot and verify it matches expected image"
# RIGHT: "Verify job list table contains at least 1 row and displays columns: 제목, 회사명, 국적"
```

**Source:** [Browser Automation Best Practices 2026](https://claudefa.st/blog/tools/mcp-extensions/browser-automation)

### Pitfall 4: Not Seeding Test Data Before Execution
**What goes wrong:** Tests fail because database is in unknown state (no test users, no job posts)
**Why it happens:** Forgetting to run seed-uat-data.sql before UAT execution
**How to avoid:** Always run seed script before UAT, document as precondition in test execution
**Warning signs:** "No jobs found", "User not found", "Like relationship doesn't exist"

**Example workflow:**
```bash
# Before any UAT execution:
# 1. Open Supabase SQL Editor
# 2. Run .planning/phases/07-uat-test-case-design/test-data/seed-uat-data.sql
# 3. Verify: SELECT count(*) FROM users WHERE email LIKE '%+uat%'
# 4. Then start Claude: claude --chrome
```

### Pitfall 5: Verbose Console Log Requests
**What goes wrong:** Asking for "all console logs" produces overwhelming output that consumes tokens
**Why it happens:** Assumption that more data is better for debugging
**How to avoid:** Tell Claude what patterns to look for rather than requesting all output
**Warning signs:** Claude response is very long with repetitive console messages

**Example:**
```bash
# WRONG: "Show me all console logs"
# RIGHT: "Check console for errors or warnings related to authentication"
```

**Source:** [Chrome MCP Best Practices - Console Logs](https://code.claude.com/docs/en/chrome)

## Code Examples

Verified patterns from official sources:

### Example 1: Navigate and Verify Page Load
```bash
# Claude Code natural language workflow

# Step 1: Navigation
"Navigate to http://localhost:3000 and verify the landing page loads"

# Claude actions:
# - Opens URL in Chrome
# - Waits for page load
# - Reads DOM to verify content
# - Checks console for errors

# Expected Claude response:
# "Landing page loaded successfully. Found hero section with title
# '한국어 가능한 외국인을 위한 채용 플랫폼', CTA buttons present,
# no console errors."
```

**Source:** [Chrome MCP Navigation Pattern](https://code.claude.com/docs/en/chrome)

### Example 2: Form Filling and Submission
```bash
# Natural language workflow for onboarding form

"Fill out the seeker onboarding form with:
- Nationality: Vietnam
- TOPIK: 3급
- Occupation: Software Engineer
- Referral: Google Search
Then submit and verify redirect to job list page"

# Claude actions:
# - Locates form fields by labels
# - Selects dropdown values
# - Types text into inputs
# - Clicks submit button
# - Waits for navigation
# - Verifies new URL is "/"
```

**Source:** [Chrome MCP Form Automation](https://code.claude.com/docs/en/chrome)

### Example 3: OAuth Flow with Manual Intervention
```bash
# Step 1: Initiate OAuth (automated)
"Click the login button and identify the OAuth provider"

# Claude clicks, detects Google OAuth redirect

# Step 2: Human completes OAuth manually
# [User logs in via Google in browser]

# Step 3: Verify post-auth state (automated)
"Verify I'm now on the role selection page at /onboarding/role-selection
and that the page displays '역할 선택' heading"

# Claude checks URL, reads DOM, confirms expected state
```

**Source:** [Chrome MCP Authentication Pattern](https://code.claude.com/docs/en/chrome)

### Example 4: Dynamic Content Waiting
```bash
# Waiting for AJAX-loaded content

"Navigate to the job list page and wait for the job table to load.
Verify at least 1 job post is displayed."

# Claude actions:
# - Navigates to page
# - Waits for table element to appear in DOM
# - Waits for at least 1 table row
# - Reads content to verify data present
# - Reports findings
```

**Source:** [Browser Automation Waiting Strategies](https://www.selenium.dev/documentation/webdriver/waits/)

### Example 5: Multi-Step User Journey
```bash
# Complete seeker journey from login to job detail

"Execute the following seeker journey:
1. Navigate to localhost:3000
2. Click login button (I'll complete OAuth manually)
3. After OAuth, select 구직자 role
4. Fill onboarding form: Vietnam, 3급, Software Engineer, Google Search
5. Submit and verify redirect to job list
6. Click first job in the list
7. Verify job detail page displays and view count increases"

# Claude executes steps, pauses for manual OAuth,
# continues after human completes auth,
# reports results for each step
```

**Source:** Pattern synthesized from Chrome MCP capabilities and Phase 7 test cases

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Write Selenium scripts | Natural language with Claude in Chrome | 2025 Q4 | 40% faster debugging, no script maintenance |
| Hard-coded waits (sleep) | Implicit waits with natural language | 2025 | "wait for button to be visible" handles timing |
| Custom page object models | Direct DOM inspection via MCP | 2025 Q4 | No boilerplate, Claude finds elements automatically |
| Screenshot diff testing | DOM + console log verification | 2026 | More stable, less brittle to visual changes |
| CI/CD headless only | Human-in-the-loop for UAT discovery | 2026 | Better for initial verification, use Playwright for regression |

**Deprecated/outdated:**
- **Selenium IDE recordings:** Replaced by natural language instructions to Claude
- **Hard-coded element locators:** Claude finds elements by visible text, labels, and context
- **Explicit wait libraries:** Built into Claude's understanding of "wait for X to be visible"

**Current recommendation (2026):**
Use Claude in Chrome for initial UAT discovery and verification, then codify stable test flows into Playwright for CI/CD regression testing.

**Source:** [2026 Outlook: AI-Driven Browser Automation](https://www.browserless.io/blog/state-of-ai-browser-automation-2026)

## Open Questions

Things that couldn't be fully resolved:

1. **Chrome MCP Tool Names**
   - What we know: Tools follow pattern `mcp__claude-in-chrome__*`, access via `/mcp` command
   - What's unclear: Exact tool names and parameters for programmatic access
   - Recommendation: Use natural language interface, not direct tool calls. Check `/mcp` in Claude Code for tool list if needed

2. **OAuth State Persistence**
   - What we know: Chrome extension shares browser's logged-in session state
   - What's unclear: How long session persists, whether it survives browser restart
   - Recommendation: Plan to re-authenticate if session expires during testing. Document session start time in test results

3. **Handling RLS Policy Testing**
   - What we know: Need to verify RLS policies block unauthorized access (UAT-CROS-07)
   - What's unclear: Best way to test "should be blocked" scenarios with browser automation
   - Recommendation: Try to access restricted data via URL manipulation, verify error state in UI or console

4. **Multi-User Testing Strategy**
   - What we know: Seed script creates 4 test users (seeker, employer1, admin, employer2)
   - What's unclear: How to switch between users in same browser session
   - Recommendation: Test one user journey per browser session, or use "logout → login as different user" between journeys

5. **Metrics Calculation Verification**
   - What we know: Metrics calculated at runtime via getDisplayMetrics (UAT-CROS-01, 02, 03)
   - What's unclear: How to verify calculation correctness without inspecting server-side code
   - Recommendation: Document displayed values, verify they're in expected range (not exact values). Check that pending/rejected posts don't show manipulated metrics

## Integration with Phase 7 Artifacts

### Test Cases from Phase 7
**Location:** `.planning/phases/07-uat-test-case-design/test-cases/`
**Files:**
- `01-seeker-journey.md` - 17 test cases (UAT-SEEK-01 through UAT-SEEK-10 + errors)
- `02-employer-journey.md` - 13 test cases (UAT-EMPL-01 through UAT-EMPL-10 + errors)
- `03-admin-journey.md` - 17 test cases (UAT-ADMN-01 through UAT-ADMN-12 + errors)
- `04-cross-flow.md` - 12 test cases (UAT-CROS-01 through UAT-CROS-10 + errors)

**How to use:**
1. Read test case file for journey being tested
2. For each test case, use preconditions, test steps, and expected outcomes
3. Execute steps via Claude in Chrome with natural language
4. Document actual results in execution tracking file
5. Mark pass/fail status

### Test Data Seed Script
**Location:** `.planning/phases/07-uat-test-case-design/test-data/seed-uat-data.sql`
**Contents:**
- 4 test users with fixed UUIDs
- 5 job posts in various states (published, pending, rejected, closed)
- 1 like relationship (seeker liked first job)
- Global metrics config with known values

**How to use:**
1. Open Supabase SQL Editor: https://xztfqnznwcgjjbpyuchf.supabase.co
2. Paste seed-uat-data.sql contents
3. Execute SQL (script is idempotent - safe to run multiple times)
4. Verify success: Script includes VERIFICATION section with counts
5. Begin UAT execution with deterministic data

### Traceability Matrix
**Location:** `.planning/phases/07-uat-test-case-design/traceability-matrix.md`
**Purpose:** Maps all 46 v1.0 requirements to 58 test cases

**How to use:**
- Reference during test execution to understand requirement coverage
- When bug is found, trace back to original requirement
- Verify no requirements are missing test coverage

## Execution Workflow for Phase 8

**Recommended approach for Phase 8 planning:**

1. **Setup (08-01-PLAN.md Task 1):**
   - Create execution tracking directory structure
   - Run seed-uat-data.sql via Supabase SQL Editor
   - Start dev servers: `pnpm dev` (ports 3000 and 3001)
   - Start Claude with Chrome: `claude --chrome`

2. **Seeker Journey Execution (08-01-PLAN.md Task 2):**
   - Read `.planning/phases/07-uat-test-case-design/test-cases/01-seeker-journey.md`
   - Execute UAT-SEEK-01 through UAT-SEEK-10 via natural language
   - Document results in `execution/seeker-journey-results.md`
   - Log bugs/PRD mismatches in `issues/` directory

3. **Result Documentation (08-01-PLAN.md Task 3):**
   - Update each test case with actual results
   - Mark pass/fail status
   - Attach screenshots/GIFs where helpful
   - Create bug tracker entries for failures

4. **Employer Journey (Future - if Phase 8 continues):**
   - Repeat process for employer journey (UAT-EMPL tests)
   - May require multiple browser sessions for role switching

5. **Admin Journey (Future - if Phase 8 continues):**
   - Execute admin tests (UAT-ADMN tests)
   - Verify admin-only access restrictions

## Sources

### Primary (HIGH confidence)
- [Claude Code Chrome Documentation](https://code.claude.com/docs/en/chrome) - Official Anthropic documentation for Chrome MCP integration
- Phase 7 test case design artifacts - Project-specific test cases and seed data

### Secondary (MEDIUM confidence)
- [Browser Automation Best Practices](https://claudefa.st/blog/tools/mcp-extensions/browser-automation) - Community guide to MCP browser automation
- [Selenium Waiting Strategies](https://www.selenium.dev/documentation/webdriver/waits/) - Industry-standard wait patterns
- [Browser Automation Tools Comparison 2026](https://www.firecrawl.dev/blog/browser-automation-tools-comparison-2025) - Current state of browser automation
- [Chrome Flags for Test Automation 2026](https://bug0.com/blog/chrome-flags-2026) - Chrome-specific automation features

### Tertiary (LOW confidence - marked for validation)
- [AI-Driven Browser Automation 2026 Outlook](https://www.browserless.io/blog/state-of-ai-browser-automation-2026) - Trend analysis, some speculation
- [Claude Code Best Practices Repository](https://github.com/shanraisshan/claude-code-best-practice) - Community-maintained, not official

## Metadata

**Confidence breakdown:**
- Chrome MCP capabilities: HIGH - Verified with official documentation
- OAuth handling strategy: HIGH - Documented limitation in official docs
- Test execution approach: MEDIUM - Synthesized from docs + project context
- Integration with Phase 7: HIGH - Direct reading of project artifacts
- Waiting strategies: MEDIUM - Adapted from Selenium best practices, not MCP-specific

**Research date:** 2026-01-21
**Valid until:** 2026-02-21 (30 days - stable technology)

**Key constraints validated:**
- Chrome MCP requires human intervention for OAuth flows
- Modal dialogs block automation
- Requires paid Claude plan
- Chrome only (not Brave, Arc, other Chromium browsers)
- Not supported on WSL

**Ready for planning:** Yes - Sufficient information to create executable tasks for seeker journey UAT
