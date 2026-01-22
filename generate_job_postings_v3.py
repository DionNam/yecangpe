#!/usr/bin/env python3
"""
Generate 100+ diverse job postings for Hire Foreigner platform
V3 - 2024년 6월 ~ 2026년 1월 19일, 현실적인 회사 이름
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

# Monthly distribution - 2024년 6월 ~ 2026년 1월 19일
# 플랫폼 성장 패턴: 초반 적음 → 중간 많음 → 최근 약간 감소
MONTHLY_DISTRIBUTION = {
    (2024, 6): 2,
    (2024, 7): 3,
    (2024, 8): 4,
    (2024, 9): 5,
    (2024, 10): 6,
    (2024, 11): 6,
    (2024, 12): 7,
    (2025, 1): 8,
    (2025, 2): 8,
    (2025, 3): 9,
    (2025, 4): 10,
    (2025, 5): 10,
    (2025, 6): 9,
    (2025, 7): 9,
    (2025, 8): 8,
    (2025, 9): 7,
    (2025, 10): 6,
    (2025, 11): 5,
    (2025, 12): 3,
    (2026, 1): 2   # 1-19일만
}

# 회사 이름 - 80%는 개인/캐주얼, 20%만 정식 회사명
COMPANY_NAMES = {
    'ID': {
        'formal': [  # 20%
            'PT Indo Korea Trading',
            'PT Sejahtera Manufacturing',
            'PT Maju Bersama Indonesia',
            'PT Berkah Jaya',
            'PT Global Indonesia',
        ],
        'casual': [  # 80%
            '김민수', '이정희', '박성민', 'Budi', 'Siti', 'Agus', 'Dewi',
            '투씬컴퍼니', '글로벌무역', '코리아샵', '한인마트', '우리회사',
            '스타트업', '신생기업', '저희회사', '작은회사',
            'Perusahaan Jaya', 'Toko Korea', 'Warung Makan', 'Restoran',
            'Korea Shop Jakarta', 'My Company', 'Trading Company',
            '개인', '자카르타 한인', '현지 업체', '한인 식당',
            '무역회사', '수출입', '제조업체', '가게',
        ]
    },
    'VN': {
        'formal': [
            'Công ty TNHH Korea Vietnam',
            'Công ty Hợp Danh Việt Hàn',
            'Vietnam Trading JSC',
            'Hanoi Korea Co., Ltd.',
        ],
        'casual': [
            '김수현', '박지민', '최민준', 'Nguyen Van Anh', 'Tran Thi Mai', 'Le Van Tuan',
            '하노이무역', '베트남코리아', '한베트레이딩', '호치민무역',
            '스타트업', '신규회사', '저희가게', '우리식당', '작은회사',
            'Nhà hàng Hàn Quốc', 'Cửa hàng', 'Công ty nhỏ', 'Quán ăn',
            'Korea Restaurant', 'My Business', 'Startup VN',
            '개인사업', '호치민 한인회', '현지업체', '가게', '식당',
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
            '이민호', '최서연', '정우성', 'Somchai', 'Nittaya', 'Apinya',
            '방콕무역', '태국코리아', '한타이컴퍼니', '방콕한인',
            '스타트업', '작은회사', '우리식당', '저희업체', '신규사업',
            'ร้านอาหาร', 'บริษัทเล็ก', 'ธุรกิจส่วนตัว', 'ร้านค้า',
            'Korea Shop', 'My Restaurant', 'Small Business',
            '개인', '방콕 한인', '현지 가게', 'Thai Shop', '식당',
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
            '정우성', '김태희', '이나영', 'Bataar', 'Oyunaa', 'Erdene',
            '울란바토르무역', '몽골코리아', '한몽컴퍼니', 'UB무역',
            '스타트업', '신생업체', '우리가게', '개인사업', '작은회사',
            'Mongolia Shop', 'Korean Restaurant UB', 'My Company',
            '개인', '울란바토르 한인', '현지업체', 'Small Business', '가게',
        ]
    },
    'PK': {
        'formal': [
            'Korea Pakistan Pvt. Ltd.',
            'Karachi Trading Company',
            'Pak-Korea Enterprise',
            'Lahore Korea Ltd.',
        ],
        'casual': [
            '박서준', '한지민', '송중기', 'Ahmed', 'Fatima', 'Ali',
            '카라치무역', '파키스탄코리아', '한파컴퍼니', '라호르무역',
            '스타트업', '신규사업', '저희회사', '개인업체', '작은회사',
            'Pakistan Trading', 'Korea Shop Karachi', 'My Business',
            '개인', '카라치 한인', '현지업체', 'Small Company', '가게',
        ]
    }
}

# Job templates - 80% Korean
JOB_TEMPLATES = [
    # Korean templates (높은 가중치)
    {
        'lang': 'ko',
        'title': '통역사 구함',
        'content_template': '''통역사 구합니다

{company}
{location}
인원: {headcount}명

통역 및 번역
TOPIK {topik}급 이상
급여: {salary}

{contact}''',
        'weight': 4
    },
    {
        'lang': 'ko',
        'title': '급구',
        'content_template': '''[급구] 통역

{location}
급여: {salary}
TOPIK {topik}급

{contact}''',
        'weight': 3
    },
    {
        'lang': 'ko',
        'title': '한국어 선생님',
        'content_template': '''한국어 선생님 구해요

{location}
시간 협의
급여: {salary}

{contact}''',
        'weight': 3
    },
    {
        'lang': 'ko',
        'title': '직원 모집',
        'content_template': '''{company}
직원 구합니다

{location}
{headcount}명
급여: {salary}

한국어 가능자
{contact}''',
        'weight': 3
    },
    {
        'lang': 'ko',
        'title': '식당 직원',
        'content_template': '''식당 직원 구함

{location}
{headcount}명
급여: {salary}

한국어 기초
{contact}''',
        'weight': 3
    },
    {
        'lang': 'ko',
        'title': '가이드',
        'content_template': '''가이드 구함

{location}
한국어 가능
{salary}

{contact}''',
        'weight': 2
    },
    {
        'lang': 'ko',
        'title': '사무직',
        'content_template': '''사무 직원 채용

{company}
{location}

사무 보조
TOPIK {topik}급
경력 {exp}년
급여: {salary}

{contact}''',
        'weight': 2
    },
    {
        'lang': 'ko',
        'title': '영상편집',
        'content_template': '''영상편집자 (프리랜서)

Premiere 가능
한국어 자막
급여: {salary}

{contact}''',
        'weight': 1
    },
    {
        'lang': 'ko',
        'title': '개발자',
        'content_template': '''개발자 구함

{company}
{location}

{tech_stack} {exp}년
한국어 TOPIK {topik}급
{salary}

{contact}''',
        'weight': 1
    },
    {
        'lang': 'ko',
        'title': '생산직',
        'content_template': '''생산직 모집

{company}
{location}
{headcount}명

생산/검사
급여: {salary}
숙식 제공

{contact}''',
        'weight': 2
    },
    {
        'lang': 'ko',
        'title': 'HR 담당',
        'content_template': '''HR 담당자

{company}
{location}

채용/관리 업무
TOPIK {topik}급
경력 {exp}년
{salary}

{contact}''',
        'weight': 1
    },
    {
        'lang': 'ko',
        'title': '매장 관리',
        'content_template': '''매장 관리자

{company}
{location}

매장 운영
한국어 가능
{salary}

{contact}''',
        'weight': 2
    },
    # Indonesian templates (5%)
    {
        'lang': 'id',
        'title': 'Dicari Penerjemah',
        'content_template': '''Penerjemah Korea-Indonesia

{company}
{location}

TOPIK {topik}
Pengalaman {exp} tahun
Gaji: {salary}

{contact}''',
        'weight': 0.5
    },
    # Vietnamese templates (5%)
    {
        'lang': 'vn',
        'title': 'Tuyển Phiên Dịch',
        'content_template': '''Phiên dịch Hàn-Việt

{company}
{location}

TOPIK {topik}
{exp} năm
Lương: {salary}

{contact}''',
        'weight': 0.5
    },
    # Thai templates (5%)
    {
        'lang': 'th',
        'title': 'รับล่าม',
        'content_template': '''รับล่ามภาษาเกาหลี

{company}
{location}

TOPIK {topik}
{exp} ปี
{salary}

{contact}''',
        'weight': 0.5
    },
    # English/Mixed templates (5%)
    {
        'lang': 'en',
        'title': 'Korean Translator',
        'content_template': '''Korean Translator

{company}
{location}

TOPIK {topik}
{exp} years experience
{salary}

{contact}''',
        'weight': 0.5
    },
]

# Location data
LOCATIONS = {
    'ID': ['Jakarta', 'Surabaya', 'Bandung', 'Tangerang', 'Bekasi', 'Cikarang', 'Bali'],
    'VN': ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Biên Hòa', 'Cần Thơ', 'Vũng Tàu'],
    'TH': ['Bangkok', 'Chiang Mai', 'Pattaya', 'Phuket', 'Rayong', 'Chonburi'],
    'MN': ['Ulaanbaatar', 'Erdenet', 'Darkhan'],
    'PK': ['Karachi', 'Lahore', 'Islamabad', 'Faisalabad', 'Rawalpindi']
}

def generate_company_name(nationality):
    """Generate company name - 20% formal, 80% casual"""
    companies = COMPANY_NAMES[nationality]
    if random.random() < 0.20:
        return random.choice(companies['formal'])
    else:
        return random.choice(companies['casual'])

def generate_kakaotalk():
    prefixes = ['hr', 'recruit', 'hiring', 'jobs', 'korea', 'work']
    suffixes = ['2024', '2025', '2026', 'id', 'vn', 'th', 'job']
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
        return f"카톡: {generate_kakaotalk()}\n이메일: {generate_email(company_name)}"
    else:
        return f"WhatsApp: {generate_whatsapp(country)}\n이메일: {generate_email(company_name)}"

def generate_salary(country):
    salaries = {
        'ID': [
            'IDR 8,000,000 - 12,000,000',
            'IDR 10,000,000 - 15,000,000',
            'IDR 5,000,000 - 8,000,000',
            '협의',
            '면접 후 협의',
        ],
        'VN': [
            '15,000,000 - 20,000,000 VND',
            '20,000,000 - 30,000,000 VND',
            '10,000,000 - 15,000,000 VND',
            '협의',
            '면접 후 협의',
        ],
        'TH': [
            '25,000 - 35,000 บาท',
            '30,000 - 45,000 บาท',
            '18,000 - 25,000 บาท',
            '협의',
        ],
        'MN': [
            '2,000,000 - 3,000,000 MNT',
            '3,000,000 - 4,500,000 MNT',
            '협의',
        ],
        'PK': [
            'PKR 80,000 - 120,000',
            'PKR 100,000 - 150,000',
            '협의',
        ]
    }
    return random.choice(salaries.get(country, ['협의']))

def weighted_choice(choices):
    items = list(WORK_LOCATION_TYPES.keys())
    weights = list(WORK_LOCATION_TYPES.values())
    return random.choices(items, weights=weights)[0]

def select_template():
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

    # 2026년 1월은 19일까지만
    if year == 2026 and month == 1:
        last_day = 19

    days = random.sample(range(1, last_day + 1), min(count, last_day))
    dates = [datetime(year, month, day, random.randint(0, 23), random.randint(0, 59)) for day in days]
    dates.sort()
    return dates

def main():
    print("-- Generated Job Postings for Hire Foreigner Platform V3")
    print("-- Date Range: 2024년 6월 ~ 2026년 1월 19일")
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

    print(f"\n-- Total postings generated: {len(all_values)}", file=open('/dev/stderr', 'w'))

if __name__ == '__main__':
    main()
