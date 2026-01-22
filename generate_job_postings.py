#!/usr/bin/env python3
"""
Generate 100+ diverse job postings for Hire Foreigner platform
Distributed from March 2025 to January 2026
"""

import random
from datetime import datetime, timedelta

# Configuration
AUTHOR_IDS = [
    'c6e31130-6523-4fa0-9ce2-1191cd5cfe71',  # treesoop.official@gmail.com
    '5a6a0f03-f0d0-4b07-9c14-86c5a8c1c644'   # official.koreander@gmail.com
]

NATIONALITIES = ['ID', 'VN', 'TH', 'MN', 'PK']

WORK_LOCATION_TYPES = {
    'on_site': 0.70,
    'remote': 0.20,
    'hybrid': 0.10
}

# Monthly distribution
MONTHLY_DISTRIBUTION = {
    (2025, 3): 3,
    (2025, 4): 8,
    (2025, 5): 12,
    (2025, 6): 16,
    (2025, 7): 18,
    (2025, 8): 20,
    (2025, 9): 18,
    (2025, 10): 15,
    (2025, 11): 8,
    (2025, 12): 5,
    (2026, 1): 3
}

# Job templates - 80% Korean, 20% mixed languages
JOB_TEMPLATES = [
    # Korean templates (Formal style)
    {
        'lang': 'ko',
        'style': 'formal',
        'title': '한-인 통역사 채용',
        'company': 'PT Global Manufacturing Indonesia',
        'location_country': 'ID',
        'nationality': 'ID',
        'content_template': '''한-인 통역사 채용 공고

회사명: {company}
위치: {location}
모집 인원: {headcount}명

업무 내용:
• 한국어 ↔ 인도네시아어 통역
• 비즈니스 미팅 및 회의 통역
• 문서 번역 업무

자격 요건:
• TOPIK {topik}급 이상
• 통역 경력 {exp}년 이상
• 제조업 경험자 우대

급여: {salary}

지원 방법:
{contact}'''
    },
    {
        'lang': 'ko',
        'style': 'formal',
        'title': '베트남어 통번역사 정규직',
        'company': 'Korea Vietnam Trading Co., Ltd.',
        'location_country': 'VN',
        'nationality': 'VN',
        'content_template': '''베트남어 통번역사 정규직 채용

[회사 소개]
{company}는 한-베 무역 전문 기업입니다.

[담당 업무]
- 한국어 ↔ 베트남어 통역
- 무역 문서 번역
- 출장자 수행 통역
- 회의 및 미팅 통역

[지원 자격]
- 베트남어 능통자 (TOPIK {topik}급 우대)
- 무역 경험자 우대
- 영어 가능자
- 대졸 이상

[근무 조건]
- 근무지: {location}
- 급여: {salary}
- 정규직, 4대보험 가입

[지원 방법]
{contact}

많은 관심과 지원 부탁드립니다.'''
    },
    {
        'lang': 'ko',
        'style': 'casual',
        'title': '한국어 선생님 구해요',
        'company': 'Language Center',
        'location_country': 'VN',
        'nationality': 'VN',
        'content_template': '''안녕하세요~
{location}에서 한국어 선생님 구합니다!

위치: {location}
급여: {salary}
시간: 주 3회, 오후 시간대

한국어 회화 위주로 가르쳐주실 분 찾아요.
TOPIK 자격증 있으면 좋지만 없어도 됩니다.

관심 있으신 분 연락주세요!
{contact}'''
    },
    {
        'lang': 'ko',
        'style': 'urgent',
        'title': '[급구] 통역사',
        'company': 'Business Meeting',
        'location_country': 'VN',
        'nationality': 'VN',
        'content_template': '''[급구] 베트남 통역사

날짜: 비즈니스 미팅
장소: {location}
급여: {salary}

가능하신 분 연락주세요
{contact}'''
    },
    {
        'lang': 'ko',
        'style': 'community',
        'title': '현대자동차 인도네시아 채용',
        'company': 'PT Hyundai Motor Manufacturing Indonesia',
        'location_country': 'ID',
        'nationality': 'ID',
        'content_template': '''Hanya bantu share 🙏

[채용 공고]
{company}에서 한국어 가능한 현지 직원을 모집합니다.

포지션: {position}
위치: {location}
급여: {salary}

자격요건:
- TOPIK {topik}급 이상
- {field} 경험 {exp}년 이상
- 영어 가능자 우대

{contact}

많은 지원 부탁드립니다!'''
    },
    {
        'lang': 'ko',
        'style': 'formal',
        'title': 'HR 코디네이터 채용',
        'company': 'PT Samsung Electronics Indonesia',
        'location_country': 'ID',
        'nationality': 'ID',
        'content_template': '''HR 코디네이터 정규직 채용

회사명: {company}
위치: {location}

[주요 업무]
- 채용 업무 지원
- 직원 관리 업무
- 한국 본사 커뮤니케이션
- 문서 작성 및 관리

[자격 요건]
- TOPIK {topik}급 이상
- HR 경험 {exp}년 이상
- MS Office 능숙
- 영어 가능자 우대

[근무 조건]
급여: {salary}
정규직, 복리후생 제공

[지원 방법]
{contact}'''
    },
    {
        'lang': 'ko',
        'style': 'casual',
        'title': '몽골 울란바토르 가이드',
        'company': 'Tour Guide Service',
        'location_country': 'MN',
        'nationality': 'MN',
        'content_template': '''몽골 울란바토르에서 가이드 구합니다

날짜: 유동적
시간: 협의 가능
인원: 한국인 관광객

한국어 가능하신 분
급여: {salary}

연락주세요
{contact}'''
    },
    {
        'lang': 'ko',
        'style': 'formal',
        'title': '소프트웨어 엔지니어 (한국어 가능)',
        'company': 'Tech Startup Vietnam',
        'location_country': 'VN',
        'nationality': 'VN',
        'content_template': '''소프트웨어 엔지니어 채용

회사명: {company}
위치: {location}
고용 형태: 정규직

[업무 내용]
- 웹 애플리케이션 개발
- API 설계 및 구현
- 한국 개발팀과 협업
- 코드 리뷰 및 기술 문서 작성

[자격 요건]
- {tech_stack} 경험 {exp}년 이상
- 한국어 커뮤니케이션 가능 (TOPIK {topik}급 이상)
- 영어 가능자
- 대졸 이상

[우대 사항]
- 한국 회사 근무 경험
- 오픈소스 기여 경험

급여: {salary}

지원:
{contact}'''
    },
    {
        'lang': 'ko',
        'style': 'formal',
        'title': '레스토랑 직원 모집',
        'company': 'Korean Restaurant',
        'location_country': 'TH',
        'nationality': 'TH',
        'content_template': '''레스토랑 직원 모집

회사명: {company}
위치: {location}
모집: {position} {headcount}명

[업무]
- 주문 접수
- 서빙
- 고객 응대

[자격]
- 한국어 기초 회화 가능
- 서비스업 경험자 우대
- 성실하고 책임감 있는 분

급여: {salary}
근무 시간: 협의

지원:
{contact}'''
    },
    {
        'lang': 'ko',
        'style': 'casual',
        'title': '영상 편집자 (프리랜서)',
        'company': 'Content Creator',
        'location_country': 'ID',
        'nationality': 'ID',
        'content_template': '''영상 편집자 구합니다 (프리랜서)

유튜브 콘텐츠 편집 가능하신 분
한국어 자막 작업 포함

요구사항:
- Premiere Pro 또는 Final Cut Pro
- 한국어 이해 가능
- 포트폴리오 제출

급여: {salary}

재택 근무 가능

연락:
{contact}'''
    },
    {
        'lang': 'ko',
        'style': 'formal',
        'title': '생산직 근로자 채용',
        'company': 'PT Korea Parts Manufacturing',
        'location_country': 'ID',
        'nationality': 'ID',
        'content_template': '''생산직 근로자 대량 채용

회사명: {company}
위치: {location}
모집 인원: {headcount}명

[업무 내용]
- 자동차 부품 생산
- 품질 검사
- 포장 및 출하 준비

[자격 요건]
- 학력 무관
- 성실하고 체력이 좋으신 분
- 한국어 기초 회화 가능자 우대

[근무 조건]
- 급여: {salary}
- 정규직 전환 가능
- 기숙사 제공
- 식사 제공

지원 방법:
{contact}'''
    },
    {
        'lang': 'ko',
        'style': 'formal',
        'title': 'QA 테스터 채용',
        'company': 'Software Company Vietnam',
        'location_country': 'VN',
        'nationality': 'VN',
        'content_template': '''QA 테스터 채용

회사명: {company}
위치: {location}

[담당 업무]
- 소프트웨어 테스트
- 버그 리포팅
- 테스트 케이스 작성
- 한국 개발팀과 커뮤니케이션

[지원 자격]
- QA 경험 {exp}년 이상
- 한국어 가능 (TOPIK {topik}급)
- IT 관련 지식
- 꼼꼼하고 책임감 있는 분

급여: {salary}

지원:
{contact}'''
    },
    # Indonesian templates
    {
        'lang': 'id',
        'style': 'formal',
        'title': 'Translator Korea-Indonesia',
        'company': 'PT Global Indonesia',
        'location_country': 'ID',
        'nationality': 'ID',
        'content_template': '''Translator Korea-Indonesia

Perusahaan: {company}
Lokasi: {location}

Tanggung Jawab:
- Menerjemahkan dokumen Korea-Indonesia
- Interpretasi dalam meeting
- Komunikasi dengan tim Korea

Kualifikasi:
- TOPIK Level {topik} atau lebih tinggi
- Pengalaman {exp} tahun
- Bahasa Inggris menjadi nilai plus

Gaji: {salary}

Hubungi:
{contact}'''
    },
    # Vietnamese templates
    {
        'lang': 'vn',
        'style': 'formal',
        'title': 'Phiên dịch Hàn-Việt',
        'company': 'Korea Company Vietnam',
        'location_country': 'VN',
        'nationality': 'VN',
        'content_template': '''Tuyển Phiên dịch Hàn-Việt

Công ty: {company}
Địa điểm: {location}

Công việc:
- Phiên dịch Hàn-Việt
- Dịch tài liệu
- Hỗ trợ giao tiếp công ty

Yêu cầu:
- TOPIK Level {topik}
- Kinh nghiệm {exp} năm
- Tiếng Anh là lợi thế

Lương: {salary}

Liên hệ:
{contact}'''
    },
    # Thai templates
    {
        'lang': 'th',
        'style': 'formal',
        'title': 'ล่ามภาษาเกาหลี',
        'company': 'Korea Company Thailand',
        'location_country': 'TH',
        'nationality': 'TH',
        'content_template': '''รับสมัครล่ามภาษาเกาหลี

บริษัท: {company}
สถานที่: {location}

หน้าที่:
- ล่ามภาษาเกาหลี-ไทย
- แปลเอกสาร
- ประสานงานกับทีมเกาหลี

คุณสมบัติ:
- TOPIK Level {topik}
- ประสบการณ์ {exp} ปี
- ภาษาอังกฤษเป็นข้อได้เปรียบ

เงินเดือน: {salary}

ติดต่อ:
{contact}'''
    },
]

# Location data
LOCATIONS = {
    'ID': ['Jakarta Selatan', 'Jakarta Pusat', 'Tangerang', 'Bekasi', 'Cikarang', 'Surabaya', 'Bandung'],
    'VN': ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Biên Hòa', 'Cần Thơ'],
    'TH': ['Bangkok', 'Chiang Mai', 'Pattaya', 'Phuket', 'Rayong'],
    'MN': ['Ulaanbaatar', 'Erdenet', 'Darkhan'],
    'PK': ['Karachi', 'Lahore', 'Islamabad', 'Faisalabad', 'Rawalpindi']
}

# Company names by country
COMPANIES = {
    'ID': [
        'PT Samsung Electronics Indonesia',
        'PT LG Electronics Indonesia',
        'PT Hyundai Motor Manufacturing Indonesia',
        'PT Korea Automotive Indonesia',
        'PT Global Manufacturing Indonesia',
        'PT Korea Parts Indonesia',
        'PT Korea Trading Indonesia',
        'PT Korean Food Indonesia',
        'PT Korea Tech Solutions',
        'PT Hanwha Indonesia'
    ],
    'VN': [
        'Samsung Vietnam Co., Ltd.',
        'LG Vietnam Co., Ltd.',
        'Korea Vietnam Trading Co., Ltd.',
        'Tech Startup Vietnam',
        'Korea Software Vietnam',
        'Korean Restaurant Vietnam',
        'Korea Education Center Vietnam',
        'Korea Manufacturing Vietnam',
        'Korea Logistics Vietnam',
        'Korea Fashion Vietnam'
    ],
    'TH': [
        'Samsung Electronics Thailand',
        'Korea Company (Thailand) Co., Ltd.',
        'Korea Parts Thailand',
        'Korean Restaurant Bangkok',
        'Korea Tech Thailand',
        'Korea Trading Thailand',
        'Korea Manufacturing (Thailand) Co., Ltd.',
        'Korea Automotive Thailand',
        'Korea Fashion Thailand',
        'Korea Food Thailand'
    ],
    'MN': [
        'Korea Mongolia Trading LLC',
        'Korea Mining Mongolia',
        'Korea Construction Mongolia',
        'Korean Restaurant Ulaanbaatar',
        'Korea Tech Mongolia',
        'Korea Education Mongolia',
        'Korea Tour Mongolia',
        'Korea Fashion Mongolia',
        'Korea Trading Mongolia LLC',
        'Korea Investment Mongolia'
    ],
    'PK': [
        'Korea Pakistan Trading Pvt. Ltd.',
        'Korea Textile Pakistan',
        'Korea Manufacturing Pakistan',
        'Korea Tech Solutions Pakistan',
        'Korea Trading Pakistan Pvt. Ltd.',
        'Korea Fashion Pakistan',
        'Korea Education Pakistan',
        'Korean Restaurant Karachi',
        'Korea Software Pakistan',
        'Korea Investment Pakistan'
    ]
}

# Contact generation functions
def generate_kakaotalk():
    prefixes = ['hr', 'recruit', 'hiring', 'jobs', 'korea', 'recruiter']
    suffixes = ['2025', '2026', 'team', 'id', 'vn', 'th', 'official']
    return f"{random.choice(prefixes)}_{random.choice(suffixes)}"

def generate_email(company_name):
    domains = ['gmail.com', 'company.com', 'co.id', 'com.vn', 'co.th']
    prefixes = ['recruitment', 'hr', 'hiring', 'jobs', 'career', 'recruit']

    # Clean company name for email
    company_clean = company_name.lower().replace('pt ', '').replace(' co., ltd.', '').replace(' indonesia', '').replace(' vietnam', '').replace(' thailand', '').replace(' pvt. ltd.', '').replace(' llc', '').replace(' ', '')[:15]

    if random.random() < 0.5:
        return f"{random.choice(prefixes)}@{company_clean}.{random.choice(domains)}"
    else:
        return f"{random.choice(prefixes)}@{random.choice(domains)}"

def generate_whatsapp(country):
    country_codes = {
        'ID': '+62',
        'VN': '+84',
        'TH': '+66',
        'MN': '+976',
        'PK': '+92'
    }
    code = country_codes.get(country, '+62')
    if country == 'ID':
        return f"{code} 8{random.randint(10, 99)}-{random.randint(1000, 9999)}-{random.randint(1000, 9999)}"
    elif country == 'VN':
        return f"{code} {random.randint(90, 99)}-{random.randint(100, 999)}-{random.randint(1000, 9999)}"
    elif country == 'TH':
        return f"{code} {random.randint(80, 99)}-{random.randint(100, 999)}-{random.randint(1000, 9999)}"
    elif country == 'MN':
        return f"{code} {random.randint(8000, 9999)}-{random.randint(1000, 9999)}"
    else:  # PK
        return f"{code} 3{random.randint(00, 99)}-{random.randint(100, 999)}-{random.randint(1000, 9999)}"

def generate_contact(country, company_name):
    contact_type = random.choices(
        ['email', 'whatsapp', 'kakao_email', 'whatsapp_email'],
        weights=[0.40, 0.30, 0.20, 0.10]
    )[0]

    if contact_type == 'email':
        return f"이메일: {generate_email(company_name)}"
    elif contact_type == 'whatsapp':
        return f"WhatsApp: {generate_whatsapp(country)}"
    elif contact_type == 'kakao_email':
        return f"카카오톡: {generate_kakaotalk()}\n이메일: {generate_email(company_name)}"
    else:  # whatsapp_email
        return f"WhatsApp: {generate_whatsapp(country)}\n이메일: {generate_email(company_name)}"

def generate_salary(country):
    salaries = {
        'ID': [
            'IDR 8,000,000 - 12,000,000',
            'IDR 10,000,000 - 15,000,000',
            'IDR 12,000,000 - 18,000,000',
            'IDR 15,000,000 - 20,000,000',
            '협의 가능',
            '면접 시 협의',
            'IDR 5,000,000 - 8,000,000'
        ],
        'VN': [
            '15,000,000 - 20,000,000 VND',
            '20,000,000 - 30,000,000 VND',
            '25,000,000 - 35,000,000 VND',
            '협의 가능',
            '면접 시 협의',
            '10,000,000 - 15,000,000 VND'
        ],
        'TH': [
            '25,000 - 35,000 บาท',
            '30,000 - 45,000 บาท',
            '40,000 - 60,000 บาท',
            '협의 가능',
            '18,000 - 25,000 บาท'
        ],
        'MN': [
            '2,000,000 - 3,000,000 MNT',
            '3,000,000 - 4,500,000 MNT',
            '협의 가능',
            '면접 시 협의'
        ],
        'PK': [
            'PKR 80,000 - 120,000',
            'PKR 100,000 - 150,000',
            'PKR 120,000 - 180,000',
            '협의 가능',
            '면접 시 협의'
        ]
    }
    return random.choice(salaries.get(country, ['협의 가능']))

def weighted_choice(choices):
    """Select item based on weights in WORK_LOCATION_TYPES"""
    items = list(WORK_LOCATION_TYPES.keys())
    weights = list(WORK_LOCATION_TYPES.values())
    return random.choices(items, weights=weights)[0]

def escape_sql_string(s):
    """Escape single quotes for SQL"""
    return s.replace("'", "''")

def generate_job_post(nationality, date):
    """Generate a single job posting"""
    # Select template - 80% Korean, 20% other
    if random.random() < 0.80:
        # Korean templates
        korean_templates = [t for t in JOB_TEMPLATES if t['lang'] == 'ko']
        template = random.choice(korean_templates)
    else:
        # Other language templates - match to nationality
        lang_map = {'ID': 'id', 'VN': 'vn', 'TH': 'th', 'MN': 'ko', 'PK': 'ko'}  # MN and PK default to Korean
        target_lang = lang_map[nationality]
        lang_templates = [t for t in JOB_TEMPLATES if t['lang'] == target_lang]
        if lang_templates:
            template = random.choice(lang_templates)
        else:
            korean_templates = [t for t in JOB_TEMPLATES if t['lang'] == 'ko']
            template = random.choice(korean_templates)

    # Override nationality if template has specific one
    if template.get('nationality'):
        nationality = template['nationality']

    # Select company
    company = template.get('company', random.choice(COMPANIES[nationality]))

    # Generate content variables
    location = random.choice(LOCATIONS[nationality])
    topik = random.choice([3, 4, 5, 6])
    exp = random.choice([1, 2, 3, '1-2', '2-3', '3-5'])
    headcount = random.choice([1, 2, 3, 5, 10])
    salary = generate_salary(nationality)
    contact = generate_contact(nationality, company)

    # Additional variables for specific templates
    position = random.choice(['HR Coordinator', 'Administrative Staff', 'Translator', 'Office Manager'])
    field = random.choice(['HR', '통역', '번역', '사무'])
    tech_stack = random.choice(['Java', 'Python', 'React', 'Node.js', 'Vue.js'])

    # Fill template
    content = template['content_template'].format(
        company=company,
        location=location,
        topik=topik,
        exp=exp,
        headcount=headcount,
        salary=salary,
        contact=contact,
        position=position,
        field=field,
        tech_stack=tech_stack
    )

    # Work location type
    work_location_type = weighted_choice(WORK_LOCATION_TYPES)

    # Work location country
    work_location_country = nationality if work_location_type == 'on_site' else None

    # Author ID
    author_id = random.choice(AUTHOR_IDS)

    # Generate SQL
    title = escape_sql_string(template['title'])
    content = escape_sql_string(content)
    company = escape_sql_string(company)

    sql_parts = [
        f"'{author_id}'",
        f"'{title}'",
        f"'{content}'",
        f"'{company}'",
        f"'{nationality}'",
        "'published'",
        "'hiring'",
        f"'{date.isoformat()}'::timestamptz",
        f"'{date.isoformat()}'::timestamptz",
        f"'{date.isoformat()}'::timestamptz",  # updated_at
        f"'{work_location_type}'"
    ]

    if work_location_country:
        sql_parts.append(f"'{work_location_country}'")
    else:
        sql_parts.append("NULL")

    return f"  ({', '.join(sql_parts)})"

def generate_dates_for_month(year, month, count):
    """Generate random dates within a month"""
    # Determine last day of month
    if month == 12:
        next_month = datetime(year + 1, 1, 1)
    else:
        next_month = datetime(year, month + 1, 1)
    last_day = (next_month - timedelta(days=1)).day

    # For January 2026, limit to day 23
    if year == 2026 and month == 1:
        last_day = 23

    # Generate random days
    days = random.sample(range(1, last_day + 1), min(count, last_day))

    # Convert to datetime objects
    dates = [datetime(year, month, day, random.randint(0, 23), random.randint(0, 59)) for day in days]
    dates.sort()

    return dates

def main():
    print("-- Generated Job Postings for Hire Foreigner Platform")
    print("-- Total: ~106 postings from March 2025 to January 2026\n")

    print("BEGIN;")
    print()
    print("INSERT INTO job_posts (")
    print("  author_id, title, content, company_name, target_nationality,")
    print("  review_status, hiring_status, published_at, created_at, updated_at,")
    print("  work_location_type, work_location_country")
    print(") VALUES")

    all_values = []

    # Generate postings for each month
    for (year, month), count in MONTHLY_DISTRIBUTION.items():
        dates = generate_dates_for_month(year, month, count)

        for date in dates:
            # Select random nationality
            nationality = random.choice(NATIONALITIES)

            # Generate posting
            values = generate_job_post(nationality, date)
            all_values.append(values)

    # Print all values
    print(',\n'.join(all_values))
    print(";")
    print()
    print("COMMIT;")

    print(f"\n-- Total postings generated: {len(all_values)}", file=open('/dev/stderr', 'w'))

if __name__ == '__main__':
    main()
