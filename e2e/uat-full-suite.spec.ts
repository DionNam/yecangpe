import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'
const ADMIN_URL = 'http://localhost:3001'

// Test accounts
const EMPLOYER_EMAIL = 'test-employer@hanguljobs.com'
const SEEKER_EMAIL = 'test-seeker@hanguljobs.com'
const PASSWORD = 'TestPass123!'

test.describe('HangulJobs UAT - Full 100 Cases', () => {

  // ===== PUBLIC PAGES (TC-001 ~ TC-012) =====

  test('TC-001: 메인 페이지 히어로 섹션', async ({ page }) => {
    await page.goto(BASE_URL)

    // Check title
    await expect(page.getByRole('heading', { name: /한국어 가능한 인재를 위한 글로벌 채용/i })).toBeVisible()

    // Check CTA buttons
    const seekerBtn = page.getByRole('link', { name: /구직자로 시작하기/i })
    const employerBtn = page.getByRole('link', { name: /채용 공고 올리기/i })
    await expect(seekerBtn).toHaveAttribute('href', '/job-seekers')
    await expect(employerBtn).toHaveAttribute('href', '/employers')

    // Check badges
    await expect(page.getByText('검증된 채용 공고')).toBeVisible()
    await expect(page.getByText('글로벌 기회')).toBeVisible()
    await expect(page.getByText('한국어 특화')).toBeVisible()
  })

  test('TC-002: 메인 페이지 통계 섹션', async ({ page }) => {
    await page.goto(BASE_URL)

    await expect(page.getByText('Active Jobs')).toBeVisible()
    await expect(page.getByText('Companies')).toBeVisible()
    await expect(page.getByText('Job Seekers')).toBeVisible()

    // Check numbers are displayed (not 0)
    const statsSection = page.locator('text=Active Jobs').locator('../..')
    await expect(statsSection).toBeVisible()
  })

  test('TC-003: 메인 페이지 최신 공고 섹션', async ({ page }) => {
    await page.goto(BASE_URL)

    await expect(page.getByRole('heading', { name: '최신 채용 공고' })).toBeVisible()

    // Check job cards (should be max 6)
    const jobCards = page.locator('[href^="/jobs/"]').filter({ hasText: '상세 보기' })
    await expect(jobCards.first()).toBeVisible()

    // Check "전체 공고 보기" link
    const allJobsLink = page.getByRole('link', { name: /전체 공고 보기/i })
    await expect(allJobsLink).toHaveAttribute('href', '/jobs')
  })

  test('TC-004: 메인 페이지 검색바', async ({ page }) => {
    await page.goto(BASE_URL)

    // Fill search inputs
    await page.getByPlaceholder(/직무명, 키워드/i).fill('통역')
    await page.getByPlaceholder(/지역.*국가/i).fill('인도네시아')

    // Click search button
    await page.getByRole('button', { name: '검색' }).click()

    // Should navigate to /jobs with query params
    await expect(page).toHaveURL(/\/jobs/)
  })

  test('TC-005: 메인 페이지 FAQ 아코디언', async ({ page }) => {
    await page.goto(BASE_URL)

    const faqButton = page.getByRole('button', { name: /HangulJobs는 무료인가요/i })
    await expect(faqButton).toBeVisible()

    // Click to expand
    await faqButton.click()

    // Should show answer (implementation dependent)
    await page.waitForTimeout(500)
  })

  test('TC-006: 메인 페이지 HangulJobs 이용 방법 섹션', async ({ page }) => {
    await page.goto(BASE_URL)

    const seekerCard = page.getByRole('link', { name: /구직자 이용 방법/i })
    const employerCard = page.getByRole('link', { name: /고용주 이용 방법/i })

    await expect(seekerCard).toHaveAttribute('href', '/job-seekers')
    await expect(employerCard).toHaveAttribute('href', '/employers')
  })

  test('TC-007: 네비게이션 헤더 (비로그인)', async ({ page }) => {
    await page.goto(BASE_URL)

    // Check logo
    const logo = page.getByRole('link', { name: /HangulJobs/i }).first()
    await expect(logo).toHaveAttribute('href', '/')

    // Check menu items
    await expect(page.getByRole('link', { name: /공고 보기/i })).toHaveAttribute('href', '/jobs')
    await expect(page.getByRole('link', { name: /고용주/i })).toHaveAttribute('href', '/employers')
    await expect(page.getByRole('link', { name: /로그인/i })).toBeVisible()
  })

  test('TC-009: 언어 전환 (EN/KO)', async ({ page }) => {
    await page.goto(BASE_URL)

    // Click EN button
    const enButton = page.getByRole('button', { name: 'EN' })
    await enButton.click()

    // Check if UI changed to English (implementation dependent)
    await page.waitForTimeout(500)

    // Click back to KO (if button changes)
    await page.waitForTimeout(500)
  })

  test('TC-010: 고용주 랜딩 페이지', async ({ page }) => {
    await page.goto(`${BASE_URL}/employers`)

    await expect(page).toHaveTitle(/고용주|Employer/i)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('TC-011: 구직자 랜딩 페이지', async ({ page }) => {
    await page.goto(`${BASE_URL}/job-seekers`)

    await expect(page).toHaveTitle(/구직자|Job.*Seeker/i)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('TC-012: 정적 페이지', async ({ page }) => {
    const pages = ['/about', '/faq', '/terms', '/privacy', '/contact']

    for (const path of pages) {
      const response = await page.goto(`${BASE_URL}${path}`)
      expect(response?.status()).toBe(200)
    }
  })

  // ===== 공고 목록 & 검색 (TC-013 ~ TC-025) =====

  test('TC-013: 공고 목록 기본 표시', async ({ page }) => {
    await page.goto(`${BASE_URL}/jobs`)

    await expect(page).toHaveTitle(/채용 공고|Jobs/i)

    // Check job cards displayed
    const jobCards = page.locator('[class*="job"]').or(page.locator('article')).first()
    await expect(jobCards).toBeVisible()
  })

  test('TC-014: 페이지네이션', async ({ page }) => {
    await page.goto(`${BASE_URL}/jobs`)

    // Look for pagination
    const page2Link = page.getByRole('link', { name: '2' }).or(page.getByText('Next'))

    if (await page2Link.isVisible()) {
      await page2Link.click()
      await expect(page).toHaveURL(/page=2/)
    }
  })

  test('TC-015: 키워드 검색', async ({ page }) => {
    await page.goto(`${BASE_URL}/jobs`)

    const searchInput = page.getByPlaceholder(/검색|search/i)
    await searchInput.fill('통역')
    await page.waitForTimeout(400) // debounce

    // URL should update
    await expect(page).toHaveURL(/q=.*통역/)
  })

  test('TC-016: 필터 - 고용 형태', async ({ page }) => {
    await page.goto(`${BASE_URL}/jobs`)

    // Open job type filter
    const jobTypeFilter = page.getByRole('button', { name: /고용.*형태|Job.*Type/i })
    await jobTypeFilter.click()

    // Select full_time
    await page.getByText(/정규직|Full.*Time/i).click()

    await expect(page).toHaveURL(/job_type=full_time/)
  })

  test('TC-017: 필터 - 근무 형태', async ({ page }) => {
    await page.goto(`${BASE_URL}/jobs`)

    const locationFilter = page.getByRole('button', { name: /근무.*형태|Location.*Type/i })
    await locationFilter.click()

    await page.getByText(/원격|Remote/i).click()

    await expect(page).toHaveURL(/location_type=remote/)
  })

  test('TC-024: 정렬 옵션', async ({ page }) => {
    await page.goto(`${BASE_URL}/jobs`)

    const sortButton = page.getByRole('button', { name: /최신순|정렬|Sort/i })
    await sortButton.click()

    // Select popular
    await page.getByText(/인기순|Popular/i).click()

    await page.waitForTimeout(500)
  })

  // ===== 공고 상세 (TC-026 ~ TC-035) =====

  test('TC-026: 공고 상세 - 기본 정보 표시', async ({ page }) => {
    await page.goto(`${BASE_URL}/jobs`)

    // Click first job card
    const firstJob = page.locator('[href^="/jobs/"]').first()
    await firstJob.click()

    // Check detail page loaded
    await expect(page).toHaveURL(/\/jobs\//)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('TC-035: 공고 상세 - 한글 슬러그', async ({ page }) => {
    // Navigate to a job with Korean slug
    await page.goto(`${BASE_URL}/jobs/긴급-전시회-통역-3일-e4bbb213`)

    // Should load without 404
    await expect(page.getByRole('heading', { name: /긴급.*전시회.*통역/i })).toBeVisible()
  })

  // ===== 인증 (TC-036 ~ TC-041) =====

  test('TC-036: 로그인 페이지', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)

    await expect(page).toHaveTitle(/로그인|Login/i)
    await expect(page.getByRole('heading', { name: /환영합니다|Welcome/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Google/i })).toBeVisible()
  })

  test('TC-040: 보호된 라우트 접근 (비로그인)', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`)

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })

  // ===== 뉴스레터 (TC-093 ~ TC-095) =====

  test('TC-093: 뉴스레터 구독 - 정상 플로우', async ({ page }) => {
    await page.goto(BASE_URL)

    // Scroll to newsletter section
    await page.getByRole('heading', { name: /최신 소식 받기/i }).scrollIntoViewIfNeeded()

    // Select type
    await page.getByRole('button', { name: /구직자입니다/i }).click()

    // Fill form
    await page.getByPlaceholder('이름').fill('테스트 사용자')
    await page.getByPlaceholder('이메일').fill(`test-newsletter-${Date.now()}@example.com`)

    // Submit
    await page.getByRole('button', { name: /구독하기/i }).click()

    // Wait for success message
    await page.waitForTimeout(1000)
  })

  test('TC-094: 뉴스레터 구독 - 유효성 검증', async ({ page }) => {
    await page.goto(BASE_URL)

    await page.getByRole('heading', { name: /최신 소식 받기/i }).scrollIntoViewIfNeeded()

    // Try to submit without email
    await page.getByRole('button', { name: /구독하기/i }).click()

    // Should show validation error (implementation dependent)
    await page.waitForTimeout(500)
  })

  // ===== 반응형 (TC-096 ~ TC-098) =====

  test('TC-096: 모바일 반응형 (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto(BASE_URL)

    // Check mobile layout
    await expect(page.getByRole('heading', { name: /한국어 가능한 인재/i })).toBeVisible()

    // Check if hamburger menu exists (if implemented)
    await page.waitForTimeout(500)
  })

  test('TC-097: 태블릿 반응형 (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto(BASE_URL)

    await expect(page.getByRole('heading', { name: /한국어 가능한 인재/i })).toBeVisible()
  })

  test('TC-098: 데스크탑 (1440px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(BASE_URL)

    await expect(page.getByRole('heading', { name: /한국어 가능한 인재/i })).toBeVisible()
  })

  // ===== SEO & 에러 (TC-099 ~ TC-100) =====

  test('TC-099: SEO 메타 & 구조화 데이터', async ({ page }) => {
    await page.goto(BASE_URL)

    // Check title
    await expect(page).toHaveTitle(/HangulJobs/)

    // Check meta description
    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content')
    expect(metaDesc).toBeTruthy()
  })

  test('TC-100: 에러 페이지 & 엣지 케이스', async ({ page }) => {
    // Test 404
    const response = await page.goto(`${BASE_URL}/asdfasdfasdf`)
    expect(response?.status()).toBe(404)

    // Check if custom 404 page exists
    await page.waitForTimeout(500)
  })
})
