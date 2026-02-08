# HangulJobs.com - Product Requirements Document (MVP)

## 1. 제품 개요

### 1.1 제품명
**HangulJobs** (한글잡스) - hanguljobs.com

### 1.2 비전
전 세계 Korean Speaker들과 한국어 능력을 필요로 하는 고용주를 연결하는 글로벌 잡보드 플랫폼. 정규직뿐 아니라 파트타임, 프리랜서, 계약직 등 다양한 고용 형태를 아우르며, 누구나 쉽고 가볍게 사용할 수 있는 서비스.

### 1.3 타겟 유저

**Job Seeker (구직자)**
- 해외 거주 한국인 (교포, 유학생, 워홀러 등)
- 한국어를 구사하는 외국인
- 한국 문화/비즈니스 경험이 있는 전문가
- 파트타임, 프리랜서 일을 찾는 사람들
- 국가 제한 없음 (미국, 일본, 동남아, 유럽 등 전 세계)

**Employer (고용주)**
- 한국 기업 (해외 지사, 해외 사업 확장 중인 기업)
- 한국어 가능 인력을 필요로 하는 해외 기업
- 개인 고용주 (가정교사, 베이비시터, 통번역 등)
- 프리랜서/파트타임 인력이 필요한 소규모 사업자

### 1.4 핵심 차별점
| 항목 | NihongoJobs (참고) | HangulJobs (우리) |
|------|-------------------|-------------------|
| 대상 언어 | 일본어-영어 | 한국어 + 영어 |
| 지역 범위 | 미국 한정 | 글로벌 (국가 제한 없음) |
| 고용 형태 | 주로 풀타임 | 파트타임, 프리랜서, 계약직 중심 + 풀타임 |
| 사용 난이도 | 보통 | 가볍고 쉬운 UX |
| 가격 | 유료 ($129~$249) | 완전 무료 |
| 가입 | 이메일+소셜 | Google 로그인만 |
| 앱 전환 | 없음 | 향후 모바일 앱 전환 고려 |
| 언어 레벨 | 일본어 레벨만 | 한국어 + 영어 레벨 |

---

## 2. 유저 플로우

### 2.1 Job Seeker 플로우
```
랜딩 페이지 방문 (최신 잡 리스트 미리보기)
  → "구직자" CTA 클릭
  → Job Seeker 안내 페이지 (서비스 소개, 사용법, 최신 잡 리스트)
  → 잡보드 검색 페이지
    → 키워드/위치/필터로 검색
    → 잡 리스트 탐색 (카드에서 하트/공유 가능)
    → 잡 상세 페이지 클릭 → Google 로그인 필요
      → 로그인 후 잡 상세 확인
      → 하트(♥) / 공유 / "지원하기" 클릭
  → 대시보드에서 하트 누른 잡 목록 확인
```

### 2.2 Employer 플로우
```
랜딩 페이지 방문
  → "고용주" CTA 클릭
  → Employer 안내 페이지 (장점, 사용법)
  → Google 로그인
  → 잡 공고 작성 폼
    → 제목, 설명, 위치, 고용형태, 언어 레벨, 급여 등 입력
  → 공고 게시 (즉시 잡보드에 노출, 무료)
  → 대시보드에서 지원 현황 / 조회수 확인
```

---

## 3. 페이지별 상세 요구사항

### 3.1 랜딩 페이지 (Home)

**Hero 섹션**
- 메인 헤드라인: "Find Korean-Speaking Jobs Worldwide" (또는 한/영 병행)
- 서브 카피: 서비스 핵심 가치 1-2문장
- 듀얼 CTA 버튼:
  - "I'm a Job Seeker" (구직자) → /job-seekers
  - "I'm an Employer" (고용주) → /employers
- 배경: 깔끔한 일러스트 또는 그라디언트

**Social Proof 섹션**
- 등록된 잡 수 (애니메이션 카운터)
- 등록 기업 수
- 가입 유저 수

**잡보드 검색 섹션**
- 키워드 입력 필드
- 위치 입력 필드 (Google Places Autocomplete)
- "검색" 버튼
- 하단에 인기 검색어/카테고리 태그

**Trusted By 섹션**
- 파트너/고객 기업 로고 나열 (초기에는 더미 또는 제거 가능)

**서비스 소개 카드 섹션**
- For Job Seekers: 간단 소개 + CTA
- For Employers: 간단 소개 + CTA

**최신 잡 리스트 섹션**
- "Latest Jobs" 헤딩
- 최근 등록된 잡 6~8개 카드 형태로 노출
- 각 카드: 잡 타이틀, 회사명, 위치, 고용형태 뱃지, 게시일
- 카드 클릭 시 → 로그인 안 된 상태면 로그인 유도 → 잡 상세 페이지
- "전체 잡 보기" 버튼 → /jobs

**필터 카테고리 카드 섹션** (5개)
- 고용형태별 (풀타임, 파트타임, 프리랜서, 계약직, 인턴)
- 근무형태별 (현장, 재택, 하이브리드)
- 지역별 (국가/도시)
- 카테고리별 (업종)
- 언어 레벨별

**뉴스레터 구독 섹션**
- 구직자용 / 고용주용 분리
- 이름 + 이메일 + 구독 버튼

**FAQ 섹션**
- 아코디언 형태, 3-5개 핵심 질문

**Footer**
- 서비스 소개 텍스트
- 소셜 미디어 링크
- 잡 탐색 링크 (필터별)
- 사이트맵 링크
- 뉴스레터 폼
- Copyright + 이용약관 + 개인정보처리방침

---

### 3.2 Job Seeker 페이지 (/job-seekers)

**목적**: 구직자에게 서비스 가치를 전달하고 잡보드로 유도

**섹션 구성**:

1. **Hero**: "전 세계에서 한국어 스킬을 활용한 기회를 찾으세요"
   - CTA: "잡 검색하기" + "잡 알림 설정"
   - 통계 카운터 (등록 잡 수, 국가 수, 가입자 수)

2. **Pain Point**: "해외에서 한국어 관련 일자리 찾기 힘드셨나요?"
   - 공감형 카피

3. **Value Proposition**: "HangulJobs는 이렇게 도움을 드립니다"
   - 타겟 인력풀
   - 다양한 고용 형태
   - 글로벌 커버리지

4. **사용 가이드 (3 Steps)**:
   - Step 1: 잡 검색 (필터 활용)
   - Step 2: 잡 알림 설정
   - Step 3: 직접 지원

5. **최신 잡 리스트**:
   - 최근 등록된 잡 6~8개 카드 노출
   - 각 카드: 잡 타이틀, 회사명, 위치, 고용형태, 게시일
   - 카드 클릭 → 로그인 필요 → 잡 상세 페이지
   - "전체 잡 보기" CTA → /jobs

6. **필터 카테고리 카드** (5개, 랜딩과 동일)

7. **FAQ** (3-5개, 구직자 관점)
   - "한국어 능력이 어느 정도여야 하나요?"
   - "해외 거주자도 지원 가능한가요?"
   - "지원은 어떻게 하나요?"

8. **Final CTA**: "지금 시작하세요" + 잡 검색/알림 버튼

---

### 3.3 Employer 페이지 (/employers)

**목적**: 고용주에게 서비스 가치 전달 및 무료 공고 게시 유도

**섹션 구성**:

1. **Hero**: "한국어 가능 인재를 빠르게 찾으세요"
   - 핵심 메시지: "완전 무료. 가입하고 바로 공고를 올리세요."
   - CTA: "무료로 공고 올리기"
   - 한국어 페이지 토글 링크

2. **통계 카운터**: 가입자 수, 등록 잡 수, 서비스 기간

3. **Problem → Solution**:
   - 문제: 한국어 인재 찾기 어려움
   - 해결: HangulJobs 타겟 인력풀

4. **장점 카드** (4개):
   - 타겟 인력풀 (Korean Speaker 전문)
   - 완전 무료 (공고 게시 비용 없음)
   - 간편한 프로세스 (Google 로그인 → 바로 공고 작성)
   - 기본 통계 (조회수, 지원 클릭수)

5. **사용 가이드 (3 Steps)**:
   - Step 1: Google 로그인
   - Step 2: 공고 작성 (5분이면 완료)
   - Step 3: 지원자 직접 수신

6. **Testimonials**: 초기에는 없거나 베타 테스터 리뷰

7. **FAQ 아코디언** (5-10개):
   - 정말 무료인가요?
   - 공고 게시 기간은?
   - 여러 잡을 올릴 수 있나요?
   - 해외 잡 게시 가능?
   - 통계 제공 범위
   - 등

8. **Final CTA**: "지금 무료로 공고를 올리세요"

---

### 3.4 잡보드 검색 페이지 (/jobs)

**목적**: 구직자가 조건에 맞는 잡을 검색/탐색

**검색 필터 패널**:
- **키워드**: 텍스트 입력
- **위치**: Google Places Autocomplete (국가/도시 레벨)
- **반경**: 위치 선택 시 나타나는 km/miles 옵션
- **고용형태** (체크박스, 복수선택):
  - Full-time (정규직)
  - Part-time (파트타임)
  - Contract (계약직)
  - Freelance (프리랜서)
  - Internship (인턴)
  - Temporary (임시직)
- **근무형태** (체크박스, 복수선택):
  - On-site (현장근무)
  - Remote (재택근무)
  - Hybrid (하이브리드)
- **한국어 레벨** (드롭다운, 복수선택):
  - Native / Advanced (원어민 / 상급)
  - Intermediate (중급)
  - Basic (초급)
  - Not Required but Appreciated (불필요하나 우대)
  - Not Specified (미지정)
- **영어 레벨** (드롭다운, 복수선택):
  - Native / Advanced
  - Intermediate
  - Basic
  - Not Required
  - Not Specified
- **카테고리/업종** (드롭다운): 전체 카테고리 목록

**잡 리스트**:
- 카드/리스트 형태
- 각 카드에 표시할 정보:
  - 회사 로고 (없으면 기본 아이콘)
  - 잡 타이틀 (링크)
  - 회사명
  - 위치 (국가, 도시)
  - 급여 범위 (있는 경우)
  - 고용형태 뱃지 (Part-time, Full-time 등)
  - 근무형태 뱃지 (Remote, On-site 등)
  - "New" 뱃지 (7일 이내)
  - 게시일
  - 하트(♥) 버튼 (로그인 시 토글, 비로그인 시 로그인 유도)
  - 공유 버튼
- 카드 클릭 → 로그인 안 된 상태면 Google 로그인 유도 → 잡 상세 페이지
- **정렬**: 최신순, 관련성순
- **페이지네이션**: 페이지 번호 기반 (SEO 유리)

---

### 3.5 잡 상세 페이지 (/jobs/{slug})

> **로그인 필수**: 잡 상세 페이지는 로그인한 구직자만 접근 가능. 비로그인 상태에서 클릭 시 Google 로그인 모달/페이지로 리다이렉트 후 원래 잡 상세로 돌아옴.

**2컬럼 레이아웃**:

**왼쪽 (메인 콘텐츠)**:
1. 잡 타이틀 + 뱃지 (고용형태, New)
2. 회사 정보 카드 (로고, 회사명, 웹사이트, 이메일)
3. 잡 설명 (HTML 리치텍스트)
   - 직무 설명
   - 주요 업무
   - 자격 요건
   - 우대 사항
   - 급여/복리후생
4. **액션 버튼 바**:
   - 하트(♥) 버튼: 토글 형태, 누르면 빨간 하트로 변경, 다시 누르면 해제
   - 공유 버튼: 클릭 시 공유 옵션 (링크 복사, 카카오톡, X/Twitter, Facebook, 이메일)
   - 인쇄 버튼

**오른쪽 (사이드바)**:
1. **"지원하기" 버튼** (눈에 띄게, 외부 URL 또는 이메일로 연결)
2. 잡 요약 패널:
   - 게시일
   - 마감일
   - 위치 (지도 링크)
   - 근무형태
   - 고용형태
   - 경력 수준
   - 급여 범위
   - 한국어 레벨 요구
   - 영어 레벨 요구
3. 하트(♥) 버튼 (사이드바에도 중복 배치)

**하단**:
- 관련 잡 추천 캐러셀 (같은 카테고리/위치)

---

### 3.6 필터별 전용 페이지 (SEO)

SEO를 위해 각 필터 조합별 정적 페이지 생성:

1. **/jobs/by-type/** - 고용형태별
   - /jobs/by-type/full-time
   - /jobs/by-type/part-time
   - /jobs/by-type/freelance
   - /jobs/by-type/contract
   - /jobs/by-type/internship
   - /jobs/by-type/temporary

2. **/jobs/by-location-type/** - 근무형태별
   - /jobs/by-location-type/remote
   - /jobs/by-location-type/on-site
   - /jobs/by-location-type/hybrid

3. **/jobs/by-country/** - 국가별
   - /jobs/by-country/united-states
   - /jobs/by-country/japan
   - /jobs/by-country/south-korea
   - /jobs/by-country/... (동적 생성)

4. **/jobs/by-category/** - 카테고리별
   - /jobs/by-category/translation
   - /jobs/by-category/teaching
   - /jobs/by-category/marketing
   - /jobs/by-category/engineering
   - /jobs/by-category/... (전체 목록 아래)

5. **/jobs/by-language-level/** - 언어 레벨별
   - /jobs/by-language-level/native
   - /jobs/by-language-level/advanced
   - /jobs/by-language-level/intermediate
   - /jobs/by-language-level/basic

**각 필터 페이지 구성**:
- Hero + 통계
- 필터 옵션 카드 목록
- 해당 필터 잡 리스트
- FAQ 아코디언
- 다른 필터 페이지 크로스 링크
- 뉴스레터 구독 폼

---

### 3.7 회원가입/로그인 (/auth)

**인증 방식**: Google 로그인만 지원 (MVP)

**가입 플로우**:
1. "Google로 시작하기" 클릭
2. Google OAuth 인증
3. 역할 선택: "구직자" / "고용주"
4. 역할별 최소 정보 입력 후 완료

**구직자 추가 필드** (선택, 나중에 프로필에서):
- 현재 거주 국가/도시
- 한국어 레벨
- 영어 레벨
- 관심 카테고리

**고용주 추가 필드**:
- 회사명 (또는 개인)
- 회사 웹사이트 (선택)
- 회사 로고 (선택)

> 중요: 가입 절차를 최대한 가볍게. Google 로그인 한 번이면 끝. 프로필은 나중에 채우도록.

---

### 3.8 고용주 대시보드 (/dashboard)

**내 공고 관리**:
- 활성 공고 목록
- 만료된 공고 목록
- 각 공고별: 조회수, 지원 클릭수
- 공고 수정/삭제

**새 공고 작성** (/dashboard/post-job):
- 잡 타이틀 (필수)
- 회사명 (자동 입력, 수정 가능)
- 회사 로고 (자동 입력, 수정 가능)
- 잡 설명 (리치텍스트 에디터) (필수)
- 위치 - 국가 (필수)
- 위치 - 도시 (선택)
- 고용형태 (필수, 셀렉트)
- 근무형태 (필수, 셀렉트)
- 카테고리/업종 (필수, 셀렉트)
- 한국어 레벨 요구 (필수, 셀렉트)
- 영어 레벨 요구 (선택, 셀렉트)
- 급여 범위 (선택)
  - 최소/최대
  - 통화 단위 (USD, KRW, JPY, EUR 등)
  - 시급/월급/연봉
- 경력 수준 (선택): Entry / Mid / Senior / 무관
- 지원 방법 (필수):
  - 외부 URL
  - 이메일
- 공고 기간: 30일 (무료, 만료 후 연장 가능)

**계정 설정**:
- 회사 정보 수정
- 뉴스레터 수신 설정

---

### 3.9 구직자 대시보드 (/dashboard) - (간소화)

**하트(♥) 누른 잡 목록**:
- 하트 누른 잡들을 최신순으로 표시
- 각 카드: 잡 타이틀, 회사명, 위치, 고용형태, 하트 날짜
- 카드 클릭 → 잡 상세 페이지
- 하트 해제 가능

**잡 알림 설정**:
- 키워드
- 위치
- 고용형태
- 알림 빈도 (즉시 / 매일 / 주간)

**프로필 관리**:
- 기본 정보
- 언어 레벨
- 거주 국가

---

### 3.10 About 페이지 (/about)

- 서비스 소개 (한국어 + 영어 병행)
- 미션/비전
- 운영 주체 소개
- Job Seekers / Employers 페이지 크로스 링크

---

### 3.11 FAQ 페이지 (/faq)

**구직자 FAQ**:
- 서비스 이용 방법
- 한국어 레벨 기준
- 해외 거주자 지원 가능 여부
- 지원 프로세스
- 잡 알림 설정 방법

**고용주 FAQ**:
- 공고 게시 방법
- 리크루터와의 차이
- 정말 무료인가요?
- 공고 수정/연장
- 통계 제공 범위
- 여러 잡 게시

---

## 4. 카테고리 목록 (MVP)

| # | 카테고리 (EN) | 카테고리 (KR) |
|---|---|---|
| 1 | Translation / Interpretation | 통번역 |
| 2 | Teaching / Tutoring | 교육 / 과외 |
| 3 | Marketing / Social Media | 마케팅 / 소셜미디어 |
| 4 | Customer Service | 고객 서비스 |
| 5 | Administrative / Office | 사무 / 행정 |
| 6 | Engineering / IT | 엔지니어링 / IT |
| 7 | Design / Creative | 디자인 / 크리에이티브 |
| 8 | Sales / Business Development | 영업 / 비즈니스 개발 |
| 9 | Accounting / Finance | 회계 / 금융 |
| 10 | Hospitality / Food Service | 호스피탈리티 / 요식업 |
| 11 | Childcare / Nanny | 육아 / 베이비시터 |
| 12 | Healthcare | 의료 / 헬스케어 |
| 13 | Legal | 법률 |
| 14 | Manufacturing / Logistics | 제조 / 물류 |
| 15 | Retail / E-commerce | 리테일 / 이커머스 |
| 16 | Content Creation / Media | 콘텐츠 제작 / 미디어 |
| 17 | Real Estate | 부동산 |
| 18 | Consulting | 컨설팅 |
| 19 | Beauty / Fashion | 뷰티 / 패션 |
| 20 | Other | 기타 |

---

## 5. 언어 레벨 체계

### 한국어 (Korean)
| 레벨 | 설명 | TOPIK 대응 |
|---|---|---|
| Native | 원어민 | - |
| Advanced | 고급 (비즈니스 수준) | TOPIK 5-6 |
| Intermediate | 중급 (일상 대화 가능) | TOPIK 3-4 |
| Basic | 초급 (기본 의사소통) | TOPIK 1-2 |
| Not Required | 불필요하나 우대 | - |

### 영어 (English)
| 레벨 | 설명 |
|---|---|
| Native / Advanced | 원어민 / 비즈니스 수준 |
| Intermediate | 중급 (일상 대화 가능) |
| Basic | 초급 |
| Not Required | 불필요 |

---

## 6. 기술 스택 (권장)

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (가볍고 커스텀 용이)
- **상태관리**: Zustand (간단) 또는 React Query (서버 상태)
- **Forms**: React Hook Form + Zod (validation)

### Backend
- **API**: Next.js API Routes (또는 별도 서버)
- **Database**: Supabase (PostgreSQL + Auth + Storage)
  - 빠른 개발, Row Level Security
  - 소셜 로그인 내장
  - 실시간 기능 내장 (향후 활용)
- **이메일**: Resend (뉴스레터 + 트랜잭션 이메일)
- **검색**: PostgreSQL Full-text Search (MVP)
  - 향후: Algolia 또는 Meilisearch

### Infrastructure
- **호스팅**: Vercel (Next.js 최적화)
- **도메인**: hanguljobs.com
- **CDN/이미지**: Vercel Image Optimization + Supabase Storage
- **Analytics**: Vercel Analytics + Google Analytics
- **모니터링**: Sentry (에러 트래킹)

### 향후 모바일 앱 전환 고려
- Next.js + React Native (Expo) 조합
- 또는 Capacitor/PWA 활용
- API 레이어를 깔끔하게 분리하여 앱 전환 시 백엔드 재사용
- **DB 설계 시 employer/employee 역할 전환을 고려한 user_roles 테이블 설계**

---

## 7. 데이터 모델 (MVP)

### users
```
id: uuid (PK)
email: string (unique)
name: string
google_id: string (unique)
avatar_url: string (nullable, Google 프로필 이미지)
role: enum('job_seeker', 'employer') -- 향후 역할 전환 가능하도록
created_at: timestamp
updated_at: timestamp
```

### employer_profiles
```
id: uuid (PK)
user_id: uuid (FK → users)
company_name: string
company_website: string (nullable)
company_logo_url: string (nullable)
company_description: text (nullable)
created_at: timestamp
updated_at: timestamp
```

### job_seeker_profiles
```
id: uuid (PK)
user_id: uuid (FK → users)
country: string (nullable)
city: string (nullable)
korean_level: enum('native', 'advanced', 'intermediate', 'basic', 'not_specified')
english_level: enum('native_advanced', 'intermediate', 'basic', 'not_required', 'not_specified')
created_at: timestamp
updated_at: timestamp
```

### jobs
```
id: uuid (PK)
employer_id: uuid (FK → employer_profiles)
title: string
slug: string (unique, URL-friendly)
description: text (HTML)
company_name: string
company_logo_url: string (nullable)

-- 위치
country: string
city: string (nullable)
location_detail: string (nullable)

-- 분류
job_type: enum('full_time', 'part_time', 'contract', 'freelance', 'internship', 'temporary')
location_type: enum('on_site', 'remote', 'hybrid')
category: string (카테고리 slug)

-- 언어 요구
korean_level: enum('native', 'advanced', 'intermediate', 'basic', 'not_required', 'not_specified')
english_level: enum('native_advanced', 'intermediate', 'basic', 'not_required', 'not_specified')

-- 급여
salary_min: integer (nullable)
salary_max: integer (nullable)
salary_currency: string (default 'USD')
salary_period: enum('hourly', 'monthly', 'yearly') (nullable)

-- 경력
career_level: enum('entry', 'mid', 'senior', 'any') (nullable)

-- 지원 방법
apply_url: string (nullable)
apply_email: string (nullable)

-- 상태
status: enum('draft', 'active', 'expired', 'closed')
is_featured: boolean (default false) -- 향후 프로모션용
published_at: timestamp (nullable)
expires_at: timestamp

-- 통계
view_count: integer (default 0)
apply_click_count: integer (default 0)

created_at: timestamp
updated_at: timestamp
```

### job_likes (하트)
```
id: uuid (PK)
user_id: uuid (FK → users)
job_id: uuid (FK → jobs)
created_at: timestamp
```

### job_alerts
```
id: uuid (PK)
user_id: uuid (FK → users)
keywords: string (nullable)
country: string (nullable)
job_type: string (nullable)
frequency: enum('instant', 'daily', 'weekly')
is_active: boolean (default true)
created_at: timestamp
updated_at: timestamp
```

### newsletter_subscribers
```
id: uuid (PK)
email: string (unique)
name: string (nullable)
type: enum('job_seeker', 'employer')
is_active: boolean (default true)
created_at: timestamp
```

---

## 8. MVP 스코프 정의

### Phase 1 - Core (반드시 포함)
- [x] 랜딩 페이지 (Job Seeker / Employer 듀얼 CTA)
- [x] Job Seeker 안내 페이지
- [x] Employer 안내 페이지
- [x] 회원가입 / 로그인 (Google 로그인)
- [x] 잡보드 검색 페이지 (모든 필터)
- [x] 잡 상세 페이지 (로그인 필수)
- [x] 하트(♥) + 공유 기능
- [x] 고용주: 잡 공고 작성/관리 (대시보드, 무료)
- [x] 구직자: 하트 누른 잡 목록 (대시보드)
- [x] 기본 통계 (조회수, 지원 클릭수)
- [x] About 페이지
- [x] FAQ 페이지
- [x] Footer + Navigation
- [x] 반응형 디자인 (모바일 최적화)

### Phase 2 - Growth (빠른 후속)
- [ ] 뉴스레터 구독 + 발송 시스템
- [ ] 잡 알림 (이메일)
- [ ] SEO 필터 전용 페이지들 (국가별, 카테고리별 등)
- [ ] 공고 인쇄 기능

### Phase 3 - Enhancement (향후)
- [ ] 추가 소셜 로그인 (카카오, 네이버)
- [ ] employer ↔ job_seeker 역할 전환
- [ ] 이력서 업로드/프로필 공개
- [ ] 앱 내 메시징
- [ ] 고급 검색 (Algolia)
- [ ] 다국어 지원 (한국어 UI)
- [ ] PWA / 모바일 앱
- [ ] 파트너 잡보드 연동
- [ ] 블로그/리소스 섹션
- [ ] 고급 통계 대시보드

---

## 9. 디자인 가이드라인

### 톤 & 무드
- **가볍고 친근한**: 딱딱한 기업용 느낌 X, 누구나 쉽게 쓸 수 있는 느낌
- **깔끔하고 모던한**: 불필요한 복잡함 배제
- **신뢰감**: 통계, 파트너 로고 등으로 신뢰 구축

### 컬러 팔레트 (제안)
- **Primary**: #2563EB (Blue 600) - 신뢰감, 전문성
- **Secondary**: #F59E0B (Amber 500) - 에너지, 한국적 따뜻함
- **Accent**: #10B981 (Emerald 500) - 성공, 성장
- **Background**: #F8FAFC (Slate 50) - 깨끗한 배경
- **Text**: #1E293B (Slate 800) - 가독성 높은 텍스트

### 타이포그래피
- 영문: Inter 또는 Pretendard
- 한글: Pretendard (영문/한글 통합)
- Heading: Bold/Semibold
- Body: Regular, 16px 기본

### 브랜딩
- 로고에 한글 모티프 활용 (ㅎ 또는 한글 자음 활용)
- 아이콘: Lucide Icons (shadcn/ui 기본)

---

## 10. 성공 지표 (KPI)

### Launch (1개월)
- 등록 잡 공고 수: 50+
- 가입 사용자 수: 200+
- 월간 방문자: 1,000+

### Growth (3개월)
- 등록 잡 공고 수: 200+
- 가입 사용자 수: 1,000+
- 월간 방문자: 5,000+
- 뉴스레터 구독자: 500+
- 잡 지원 클릭률: 10%+

### Scale (6개월)
- 월간 방문자: 20,000+
- 월간 신규 공고: 100+
- 재게시율: 30%+ (고용주가 다시 공고를 올리는 비율)

---

## 11. 리스크 및 고려사항

### 기술적 리스크
- Google Places API 비용 (무료 할당량 확인 후 대안 고려)
- Supabase 무료 플랜 한계 (트래픽 증가 시 유료 전환)
- 이메일 deliverability (뉴스레터 스팸 분류 방지)

### 비즈니스 리스크
- 초기 공고 부족 → "빈 플랫폼" 문제
  - 대응: 직접 잡 크롤링/큐레이션, 초기 시드 데이터 확보
- 무료 모델의 지속 가능성 → 트래픽 증가 시 서버 비용 증가
  - 대응: 향후 프리미엄 기능 또는 광고 모델 검토
- 사용자 확보 → 한인 커뮤니티 (Reddit, Facebook, 카카오톡 그룹) 타겟 마케팅

### 법적 고려
- 개인정보처리방침 (GDPR, 한국 개인정보보호법 고려)
- 이용약관

---

## 12. 향후 앱 전환 전략

현재 웹 MVP에서 향후 모바일 앱 전환을 위한 설계 원칙:

1. **API-First 설계**: 모든 비즈니스 로직을 API로 분리하여 앱에서 재사용
2. **역할 전환 지원**: user_roles 설계 시 한 사용자가 employer ↔ job_seeker 역할을 쉽게 전환할 수 있도록 (마치 당근마켓처럼)
3. **PWA 고려**: 초기 모바일 대응은 PWA로, 이후 React Native 앱으로 전환
4. **Push 알림 인프라**: 잡 알림을 이메일 → 푸시 알림으로 확장 가능하도록
5. **Component 재사용**: shadcn/ui 컴포넌트 구조를 React Native Paper/Tamagui로 매핑 가능하도록 설계
