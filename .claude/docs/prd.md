PRD (RD) — 한국어 가능한 외국인 대상 한국 구인/구직 잡포스팅 플랫폼
1) 목적 / 배경

한국어가 가능한 외국인(구직자)이 한국의 채용 공고에 더 쉽게 접근/지원하도록 돕는 구인·구직 플랫폼.

초기에는 “잡포스팅 게시판”에 집중하고, 접근 장벽을 낮추기 위해 로그인 전에는 리스트만 노출, 상세는 로그인 후 열람.

2) 핵심 가치 (Value Proposition)

구직자: 한국어 가능한 외국인에게 최적화된 국적 필터 + 간편 로그인 + 댓글 기반 Q&A

구인자: 외국인 타깃 공고를 간편하게 올리고(승인 프로세스 포함), 내 공고 관리 가능

관리자: 공고 승인/반려, 내용 수정, 조작 지표(조회수/관심수) 관리로 초기 그로스 연출

3) 사용자 유형 / 권한 (Roles & Permissions)
3.1 Roles

Guest(비로그인)

구직자(Job Seeker)

구인자(Employer)

관리자(Admin)

3.2 권한 매트릭스(요약)

Guest: 잡포스팅 리스트 열람(제한된 정보만), 필터 사용 가능

구직자: 공고 상세 열람, 댓글 작성, 하트(관심) 가능, 마이페이지에서 프로필 수정/관심글 목록 열람

구인자: 공고 상세 열람(하트 클릭 불가, 하트 수만 확인), 공고 작성/수정/상태 변경, 내 공고 관리

관리자: 전체 사용자/공고 관리, 공고 승인/반려, 공고 직접 작성(즉시 게시), 모든 공고 내용 수정, 조작 지표 설정

4) 국가(국적) 필터 옵션

리스트에서 “국적 1개”만 선택 가능 (단일 선택)

기본: 무관

추천 리스트(초기):
인도네시아, 베트남, 필리핀, 태국, 몽골, 우즈베키스탄, 카자흐스탄, 네팔, 미얀마, 인도, 스리랑카, 파키스탄, 방글라데시, 중국, 일본

운영: Admin에서 국가 목록을 추후 추가/비활성화 가능(확장 항목)

5) 기능 요구사항 (MVP)
5.1 공통 — 로그인

로그인 방식: Google OAuth

로그인 시 역할 선택:

“구직자로 시작”

“구인자로 시작”

역할은 계정 생성 이후 변경 정책:

MVP: 변경 불가(운영자 문의로 처리)

확장: 마이페이지에서 전환 기능 제공 가능

5.2 랜딩 페이지
목표

서비스 소개 + CTA(“공고 보러가기”, “구직자로 로그인”, “구인자로 로그인”)

구성(예시)

헤드라인/서브카피

주요 기능(국적 필터, 승인 공고, 댓글 Q&A)

푸터: 이용약관/개인정보처리방침/문의

5.3 잡포스팅 리스트 페이지 (메인 서비스)
리스트 표시 컬럼

상태(채용중 / 마감)

제목

날짜(게시일)

조회수(노출 값 = 실제 + 조작)

(선택) 관심수(노출 값 = 실제 + 조작) — 카드에 작게

기능

국적 단일 필터:

무관/인도네시아/… (단일 선택)

정렬(초기 MVP)

기본: 최신순

확장: 조회수순, 관심수순

접근 제한

비로그인: 리스트만 열람 가능

공고 클릭 시:

로그인 페이지/로그인 모달로 유도

5.4 공고 상세 페이지
공통 구성

제목

회사명(or 구인자명)

국적 태그

채용 상태(채용중/마감)

게시일

본문

조회수 / 관심수 (노출 값)

댓글 섹션

구직자 전용

하트(관심) 토글 가능

댓글 작성 가능(텍스트)

댓글 리스트 열람

구인자 전용

하트(관심) 토글 불가

“관심수(하트 수)”만 확인 가능

(내 공고인 경우) 편집/상태 변경 진입 가능

5.5 구직자 온보딩

구글 로그인 후 1회 수행(필수)

국적 (필수)

TOPIK 급수/한국어 레벨 (필수)

예: TOPIK 1~6 / 또는 “초급/중급/고급”

직업/희망 직무(필수)

유입 경로(필수)

예: 지인추천/커뮤니티/인스타/유튜브/검색/기타(직접입력)

완료 후:

공고 상세 접근 가능

댓글/하트 기능 활성화

5.6 구직자 마이페이지

프로필 수정:

국적, 한국어 레벨, 직업, 유입경로 수정

관심(하트)한 공고 리스트

상태, 제목, 날짜, 조회수(노출 값)

댓글 관리: MVP 제외

5.7 구인자 온보딩

구글 로그인 후 1회 수행(필수)

기업/개인 이름 (필수)

유입 경로 (필수)

5.8 구인자 마이페이지 (내 공고 관리)
내 공고 리스트

상태(심사중/게시됨/반려)

채용 상태(채용중/마감) — 게시된 공고에 한해 표시

제목

조회수(노출 값)

관심수(노출 값)

작성일/게시일

내 공고 상세(관리 화면)

본문/제목 수정 가능

채용중/마감 상태 변경 가능

반려 사유 표시(반려인 경우)

5.9 구인자 공고 작성

리스트 페이지에 “구인글 올리기” 버튼 노출(구인자 로그인 시)

입력 폼:

제목(필수)

내용(필수)

대상 국적(필수, 단일 선택)

회사명(구인자 온보딩 값 기본 세팅, 수정 가능 여부 정책)

제출 시:

다이얼로그: “1일 이내 관리자 승인 후 게시됩니다”

확인 누르면 작성 완료

생성되는 공고 상태:

기본: 심사중

이후 “마이페이지 > 내 공고”에서 확인

6) 관리자(Admin) 기능 요구사항
6.1 관리자 영역 공통

관리자 로그인(초기 MVP 권장)

옵션 A: 관리자 전용 계정(이메일 allowlist)

옵션 B: 구글 로그인 + 특정 도메인/이메일 allowlist

6.2 관리자 메뉴 구조(예시)

대시보드

구직자 관리

구인자 관리

공고 관리(승인/반려/수정/직접등록)

조작 지표 설정(조회수/관심수)

설정(국가 목록 등) — 확장

6.3 구직자 관리

목록: 이름/이메일/국적/레벨/직업/가입일/최근로그인

상세: 프로필 조회 및 수정(필요 시)

제재: 계정 비활성화(확장)

6.4 구인자 관리

목록: 이름/이메일/기업/가입일/공고 수/최근로그인

상세: 구인자 정보 수정, 해당 구인자가 쓴 공고 리스트 바로가기

6.5 공고 관리 (핵심)
탭 1) 심사 필요 공고

심사중 리스트

액션:

승인 → 상태 “게시됨” 전환 + 게시일 세팅

반려 → 상태 “반려” + 반려 사유 입력(구인자에게 노출)

수정 → 제목/내용/국적/회사명 수정 가능(관리자 권한)

탭 2) 전체 공고

상태(심사중/게시됨/반려), 채용 상태(채용중/마감) 필터

공고 내용/제목/국적/회사명 수정 가능(항상)

탭 3) 관리자 직접 공고 등록

입력: 제목/내용/국적/회사명

등록 시 즉시:

상태: 게시됨

게시일: now

작성자 타입: admin

7) 조작 지표(조회수/관심수) 요구사항
7.1 기본 개념

각 공고는 아래를 분리 관리:

실제 조회수(real_view_count)

조작 조회수(manipulated_view_count)

실제 관심수(real_like_count)

조작 관심수(manipulated_like_count)

API로 사용자에게 노출하는 값:

view_count_display = real_view_count + manipulated_view_count

like_count_display = real_like_count + manipulated_like_count

7.2 조작 조회수 전역 설정(Admin)

전역 설정값:

생성 목표 범위: view_target_min, view_target_max (예: 1000~2000)

도달 기간: view_ramp_days (고정 14일 = 2주)

증가 커브: log 형태(초반 급격히 상승)

공고가 “게시됨”으로 바뀌는 순간:

target_view를 [min,max]에서 랜덤 1개 뽑음 (예: 1500)

“게시됨 시점부터 2주” 동안 log 커브로 1500에 도달하도록 manipulated_view_count를 시간 기반으로 계산

구현 방식(권장)

DB에는 “target_view”와 “published_at”만 저장해도 됨

API 요청 시점에:

manipulated_view_count = f(now - published_at, target_view, ramp_days)

ramp_days 이후에는 target_view로 고정

예시 함수(설명용)

t = 경과일(0~ramp_days)

manipulated = round( target * log(1 + at) / log(1 + aramp_days) )

a는 곡선 강도(예: 3~10). 커질수록 초반 상승이 더 가팔라짐.

7.3 조작 관심수 전역 설정(Admin)

설정 방식 동일:

like_target_min, like_target_max

like_ramp_days (예: 14일)

log 커브로 증가

노출 값:

like_display = real_like + manipulated_like

7.4 실제 수치 증가 규칙

실제 조회수 증가:

공고 상세 페이지 접근 시 real_view_count +1

중복 방지(확장): 같은 유저/세션은 1시간 내 중복 카운트 제외

실제 관심수 증가:

구직자의 하트 토글로 real_like_count 증감

8) 데이터 모델(초안)

MVP 기준 핵심 테이블만 제안

users

id

role (job_seeker / employer / admin)

email

name

created_at, last_login_at

is_active

job_seeker_profile

user_id (FK)

nationality

korean_level (topik or enum)

job_category

referrer_source

employer_profile

user_id (FK)

display_name (기업/개인명)

referrer_source

job_posts

id

author_user_id (FK, nullable for admin? 또는 admin user)

author_type (employer/admin)

company_name

nationality_tag (단일)

title

content

review_status (심사중/게시됨/반려)

rejection_reason

hiring_status (채용중/마감) ※ 게시됨 이후만 의미

published_at

created_at, updated_at

job_post_metrics

post_id (FK)

real_view_count

real_like_count

view_target (조작 목표값)

like_target (조작 목표값)

job_post_likes

post_id (FK)

user_id (FK)

created_at

comments

id

post_id (FK)

user_id (FK)

content

created_at, updated_at

is_deleted (soft delete)

global_metrics_config (전역 1행)

view_target_min, view_target_max, view_ramp_days, view_curve_a

like_target_min, like_target_max, like_ramp_days, like_curve_a

updated_at

9) API 요구사항(요약)

GET /posts (필터: nationality, 정렬: 최신)

GET /posts/{id} (로그인 필요)

response에 view_count_display, like_count_display 포함

POST /posts (구인자/관리자)

PATCH /posts/{id} (작성자 또는 관리자)

POST /posts/{id}/approve (관리자)

POST /posts/{id}/reject (관리자)

POST /posts/{id}/like (구직자)

DELETE /posts/{id}/like (구직자)

GET /me (내 정보)

PATCH /me/profile (구직자/구인자)

POST /posts/{id}/comments (구직자)

GET /posts/{id}/comments

10) 화면/UX 체크리스트

리스트에서 공고 클릭 → 로그인 유도(비로그인)

구직자: 하트 버튼은 활성

구인자: 하트 버튼은 비활성 + 수치만 표시

구인글 제출 후: “1일 이내 승인” 다이얼로그

내 공고 관리에서 상태/채용상태가 한눈에 보여야 함

11) 비기능 요구사항(NFR)

보안: role 기반 접근제어(상세 API, 작성/수정 API)

성능: 리스트 페이지 pagination(필수)

로깅: 관리자 승인/반려/수정 히스토리(확장)

감사: 누가 공고 내용을 바꿨는지 추적(확장)

12) MVP 범위 vs 확장 범위
MVP 포함

랜딩

잡포스팅 리스트(국적 필터 1개)

로그인(구직자/구인자 분기)

온보딩(각 역할)

공고 상세(구직자 댓글/하트, 구인자 하트 불가)

구인자 공고 작성 + 심사(관리자 승인/반려)

관리자 공고 직접 등록(즉시 게시)

조작 조회수/관심수 전역 설정 + 노출값 합산

MVP 제외(추후)

댓글 관리(내 댓글 목록, 신고/블라인드)

지원 기능(이력서 제출/지원 버튼)

다국어 UI

고급 검색/태그 다중 선택

공고 수정 히스토리/감사 로그

유입 경로 분석 대시보드