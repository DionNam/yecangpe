#!/usr/bin/env python3
"""
Generate 100+ diverse job postings for Hire Foreigner platform
V2 - More realistic company names (20% formal companies, 80% casual/personal)
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

# 회사 이름 - 80%는 개인/캐주얼, 20%만 정식 회사명
COMPANY_NAMES = {
    'ID': {
        'formal': [  # 20%
            'PT Indo Korea Trading',
            'PT Sejahtera Manufacturing',
            'PT Maju Bersama Indonesia',
            'PT Berkah Jaya',
        ],
        'casual': [  # 80%
            '김민수', '이정희', 'Park Sungmin', 'Budi', 'Siti', 'Agus',
            '투씬컴퍼니', '글로벌무역', '코리아샵', '한인마트',
            '스타트업', '신생기업', '우리회사', '저희회사',
            'Perusahaan Jaya', 'Toko Korea', 'Warung Makan',
            'Korea Shop Jakarta', 'My Company', 'Trading Company',
            '개인', '자카르타 한인', '현지 업체', 'Restaurant',
        ]
    },
    'VN': {
        'formal': [
            'Công ty TNHH Korea Vietnam',
            'Công ty Hợp Danh Việt Hàn',
            'Vietnam Trading JSC',
            'Hanoi Manufacturing Co.',
        ],
        'casual': [
            '김수현', '박지민', 'Nguyen Van Anh', 'Tran Thi Mai',
            '하노이무역', '베트남코리아', '한베트레이딩',
            '스타트업', '신규회사', '저희가게', '우리식당',
            'Nhà hàng Hàn Quốc', 'Cửa hàng', 'Công ty nhỏ',
            'Korea Restaurant', 'My Business', 'Startup VN',
            '개인사업', '호치민 한인회', '현지업체', '가게',
        ]
    },
    'TH': {
        'formal': [
            'Korea Thailand Co., Ltd.',
            'Bangkok Trading Ltd.',
            'Thai-Korea Partnership',
            'Siam Korea Company',
        ],
        'casual': [
            '이민호', '최서연', 'Somchai', 'Nittaya',
            '방콕무역', '태국코리아', '한타이컴퍼니',
            '스타트업', '작은회사', '우리식당', '저희업체',
            'ร้านอาหาร', 'บริษัทเล็ก', 'ธุรกิจส่วนตัว',
            'Korea Shop', 'My Restaurant', 'Small Business',
            '개인', '방콕 한인', '현지 가게', 'Thai Shop',
        ]
    },
    'MN': {
        'formal': [
            'Mongolia Korea LLC',
            'Ulaanbaatar Trading Co.',
            'Korea Mongolia Partnership',
            'Erdenet Korea Company',
        ],
        'casual': [
            '정우성', '김태희', 'Bataar', 'Oyunaa',
            '울란바토르무역', '몽골코리아', '한몽컴퍼니',
            '스타트업', '신생업체', '우리가게', '개인사업',
            'Mongolia Shop', 'Korean Restaurant UB', 'My Company',
            '개인', '울란바토르 한인', '현지업체', 'Small Business',
        ]
    },
    'PK': {
        'formal': [
            'Korea Pakistan Pvt. Ltd.',
            'Karachi Trading Company',
            'Pak-Korea Enterprise',
            'Lahore Manufacturing Ltd.',
        ],
        'casual': [
            '박서준', '한지민', 'Ahmed', 'Fatima',
            '카라치무역', '파키스탄코리아', '한파컴퍼니',
            '스타트업', '신규사업', '저희회사', '개인업체',
            'Pakistan Trading', 'Korea Shop Karachi', 'My Business',
            '개인', '카라치 한인', '현지업체', 'Small Company',
        ]
    }
}

# Job templates - 80% Korean
JOB_TEMPLATES = [
    # Korean templates
    {
        'lang': 'ko',
        'title': '한-인 통역사 구합니다',
        'content_template': '''한-인 통역사 구합니다

회사: {company}
위치: {location}
인원: {headcount}명

업무:
• 통역 업무
• 문서 번역
• 미팅 지원

자격: TOPIK {topik}급 이상, 경력 {exp}년
급여: {salary}

연락처:
{contact}''',
        'weight': 3
    },
    {
        'lang': 'ko',
        'title': '통역사 급구',
        'content_template': '''[급구] 통역사

{location}에서 통역 가능하신 분
급여: {salary}
TOPIK {topik}급

{contact}''',
        'weight': 2
    },
    {
        'lang': 'ko',
        'title': '한국어 선생님',
        'content_template': '''한국어 선생님 구해요

위치: {location}
시간: 협의 가능
급여: {salary}

관심 있으신 분 연락주세요
{contact}''',
        'weight': 2
    },
    {
        'lang': 'ko',
        'title': '직원 모집',
        'content_template': '''{company}에서 직원 구합니다

위치: {location}
모집: {headcount}명
급여: {salary}

한국어 가능하신 분
{contact}''',
        'weight': 2
    },
    {
        'lang': 'ko',
        'title': '레스토랑 직원',
        'content_template': '''레스토랑 직원 구합니다

{location}
주방/홀 직원 {headcount}명
급여: {salary}

한국어 기초 가능자
{contact}''',
        'weight': 2
    },
    {
        'lang': 'ko',
        'title': '가이드',
        'content_template': '''관광 가이드 구함

{location}
한국어 가능
급여: {salary}

{contact}''',
        'weight': 1
    },
    {
        'lang': 'ko',
        'title': 'HR 담당자',
        'content_template': '''HR 담당자 채용

회사: {company}
위치: {location}

• 채용 업무
• 직원 관리
• 통역 업무

TOPIK {topik}급, 경력 {exp}년
급여: {salary}

{contact}''',
        'weight': 1
    },
    {
        'lang': 'ko',
        'title': '영상 편집자',
        'content_template': '''영상 편집자 (프리랜서)

Premiere/Final Cut 가능하신 분
한국어 자막 작업

급여: {salary}
재택 가능

{contact}''',
        'weight': 1
    },
    {
        'lang': 'ko',
        'title': '엔지니어',
        'content_template': '''소프트웨어 엔지니어

회사: {company}
위치: {location}

{tech_stack} {exp}년 이상
한국어 가능 (TOPIK {topik}급)
급여: {salary}

{contact}''',
        'weight': 1
    },
    {
        'lang': 'ko',
        'title': '생산직',
        'content_template': '''생산직 근로자 모집

{company}
위치: {location}
인원: {headcount}명

• 생산 업무
• 품질 검사

급여: {salary}
숙소/식사 제공

{contact}''',
        'weight': 1
    },
    # Indonesian templates (5%)
    {
        'lang': 'id',
        'title': 'Dicari Penerjemah',
        'content_template': '''Dicari Penerjemah Korea-Indonesia

Perusahaan: {company}
Lokasi: {location}

TOPIK Level {topik}
Pengalaman {exp} tahun
Gaji: {salary}

{contact}''',
        'weight': 0.3
    },
    # Vietnamese templates (5%)
    {
        'lang': 'vn',
        'title': 'Tuyển Phiên Dịch',
        'content_template': '''Tuyển Phiên dịch Hàn-Việt

Công ty: {company}
Địa điểm: {location}

TOPIK {topik}
Kinh nghiệm {exp} năm
Lương: {salary}

{contact}''',
        'weight': 0.3
    },
    # Thai templates (5%)
    {
        'lang': 'th',
        'title': 'รับสมัครล่าม',
        'content_template': '''รับสมัครล่ามภาษาเกาหลี

บริษัท: {company}
สถานที่: {location}

TOPIK {topik}
ประสบการณ์ {exp} ปี
เงินเดือน: {salary}

{contact}''',
        'weight': 0.3
    },
    # English/Mixed templates (5%)
    {
        'lang': 'en',
        'title': 'Korean Translator Needed',
        'content_template': '''Korean Translator

Company: {company}
Location: {location}

TOPIK Level {topik}
Experience: {exp} years
Salary: {salary}

{contact}''',
        'weight': 0.3
    },
]

# Location data
LOCATIONS = {
    'ID': ['Jakarta', 'Surabaya', 'Bandung', 'Tangerang', 'Bekasi', 'Cikarang'],
    'VN': ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Biên Hòa', 'Cần Thơ'],
    'TH': ['Bangkok', 'Chiang Mai', 'Pattaya', 'Phuket', 'Rayong'],
    'MN': ['Ulaanbaatar', 'Erdenet', 'Darkhan'],
    'PK': ['Karachi', 'Lahore', 'Islamabad', 'Faisalabad']
}

def generate_company_name(nationality):
    """Generate company name - 20% formal, 80% casual"""
    companies = COMPANY_NAMES[nationality]
    if random.random() < 0.20:
        return random.choice(companies['formal'])
    else:
        return random.choice(companies['casual'])

def generate_kakaotalk():
    prefixes = ['hr', 'recruit', 'hiring', 'jobs', 'korea']
    suffixes = ['2025', '2026', 'id', 'vn', 'th']
    return f"{random.choice(prefixes)}_{random.choice(suffixes)}"

def generate_email(company_name):
    domains = ['gmail.com', 'naver.com', 'daum.net', 'yahoo.com', 'hotmail.com']
    prefixes = ['recruitment', 'hr', 'hiring', 'jobs', 'contact', 'info']
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
    else:
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
    else:
        return f"WhatsApp: {generate_whatsapp(country)}\n이메일: {generate_email(company_name)}"

def generate_salary(country):
    salaries = {
        'ID': [
            'IDR 8,000,000 - 12,000,000',
            'IDR 10,000,000 - 15,000,000',
            'IDR 5,000,000 - 8,000,000',
            '협의 가능',
            '면접 시 협의',
        ],
        'VN': [
            '15,000,000 - 20,000,000 VND',
            '20,000,000 - 30,000,000 VND',
            '10,000,000 - 15,000,000 VND',
            '협의 가능',
            '면접 시 협의',
        ],
        'TH': [
            '25,000 - 35,000 บาท',
            '30,000 - 45,000 บาท',
            '18,000 - 25,000 บาท',
            '협의 가능',
        ],
        'MN': [
            '2,000,000 - 3,000,000 MNT',
            '3,000,000 - 4,500,000 MNT',
            '협의 가능',
        ],
        'PK': [
            'PKR 80,000 - 120,000',
            'PKR 100,000 - 150,000',
            '협의 가능',
        ]
    }
    return random.choice(salaries.get(country, ['협의 가능']))

def weighted_choice(choices):
    items = list(WORK_LOCATION_TYPES.keys())
    weights = list(WORK_LOCATION_TYPES.values())
    return random.choices(items, weights=weights)[0]

def select_template():
    """Select template based on weights"""
    templates = []
    weights = []
    for template in JOB_TEMPLATES:
        templates.append(template)
        weights.append(template.get('weight', 1))
    return random.choices(templates, weights=weights)[0]

def escape_sql_string(s):
    return s.replace("'", "''")

def generate_job_post(nationality, date):
    template = select_template()
    company = generate_company_name(nationality)
    location = random.choice(LOCATIONS[nationality])
    topik = random.choice([3, 4, 5, 6])
    exp = random.choice([1, 2, 3, '1-2', '2-3'])
    headcount = random.choice([1, 2, 3, 5, 10])
    salary = generate_salary(nationality)
    contact = generate_contact(nationality, company)
    tech_stack = random.choice(['Java', 'Python', 'React', 'Node.js', 'PHP'])

    content = template['content_template'].format(
        company=company,
        location=location,
        topik=topik,
        exp=exp,
        headcount=headcount,
        salary=salary,
        contact=contact,
        tech_stack=tech_stack
    )

    work_location_type = weighted_choice(WORK_LOCATION_TYPES)
    work_location_country = nationality if work_location_type == 'on_site' else None
    author_id = random.choice(AUTHOR_IDS)

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
        f"'{date.isoformat()}'::timestamptz",
        f"'{work_location_type}'"
    ]

    if work_location_country:
        sql_parts.append(f"'{work_location_country}'")
    else:
        sql_parts.append("NULL")

    return f"  ({', '.join(sql_parts)})"

def generate_dates_for_month(year, month, count):
    if month == 12:
        next_month = datetime(year + 1, 1, 1)
    else:
        next_month = datetime(year, month + 1, 1)
    last_day = (next_month - timedelta(days=1)).day

    if year == 2026 and month == 1:
        last_day = 23

    days = random.sample(range(1, last_day + 1), min(count, last_day))
    dates = [datetime(year, month, day, random.randint(0, 23), random.randint(0, 59)) for day in days]
    dates.sort()
    return dates

def main():
    print("-- Generated Job Postings for Hire Foreigner Platform V2")
    print("-- Realistic company names: 20% formal, 80% casual/personal\n")

    print("BEGIN;")
    print()
    print("INSERT INTO job_posts (")
    print("  author_id, title, content, company_name, target_nationality,")
    print("  review_status, hiring_status, published_at, created_at, updated_at,")
    print("  work_location_type, work_location_country")
    print(") VALUES")

    all_values = []

    for (year, month), count in MONTHLY_DISTRIBUTION.items():
        dates = generate_dates_for_month(year, month, count)
        for date in dates:
            nationality = random.choice(NATIONALITIES)
            values = generate_job_post(nationality, date)
            all_values.append(values)

    print(',\n'.join(all_values))
    print(";")
    print()
    print("COMMIT;")

if __name__ == '__main__':
    main()
