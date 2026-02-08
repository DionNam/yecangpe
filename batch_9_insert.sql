INSERT INTO job_posts (
    id,
    author_id,
    title,
    content,
    company_name,
    target_nationality,
    review_status,
    hiring_status,
    work_location_country,
    work_location_type,
    published_at,
    created_at,
    updated_at
) VALUES (
        gen_random_uuid(),
        'c6e31130-6523-4fa0-9ce2-1191cd5cfe71',
        'Tuyển Nhân Viên Telesales (Korean)',
        'Tuyển Nhân Viên Telesales (Korean)

Công ty: KOREA LIFE INSURANCE VIETNAM
VP: Hà Nội, Ba Đình

Vị trí: Telesales Executive

Yêu cầu:
   •   Tiếng Hàn tốt (TOPIK 4+)
   •   Kinh nghiệm telesales/sales
   •   Giọng nói dễ nghe
   •   Kỹ năng thuyết phục

Công việc:
   •   Gọi điện tư vấn bảo hiểm cho khách Hàn
   •   Chăm sóc khách hàng cũ
   •   Đặt lịch hẹn cho agent
   •   Hỗ trợ giải đáp thắc mắc

Lương: 10-15 triệu VNĐ + hoa hồng
Hoa hồng: Theo hợp đồng thành công

Giờ: 9:00-18:00 (T2-T6)

Phúc lợi: BHXH, thưởng KPI, đào tạo

Ứng tuyển:
chị Yến: 024-3733-xxxx
Email: sales@korealifeVN.com',
        'Nguyễn Hải Yến',
        'all',
        'published',
        'hiring',
        '베트남',
        'on_site',
        '2025-08-22T09:00:00+00:00',
        now(),
        now()
    ),(
        gen_random_uuid(),
        'c6e31130-6523-4fa0-9ce2-1191cd5cfe71',
        'Supply Chain Analyst (Korean Language)',
        'Supply Chain Analyst (Korean Language)

PT Kolmar Korea Indonesia
Cikarang, Bekasi

Required:
   •   S1 Teknik Industri/Supply Chain
   •   Korean language (TOPIK 4+)
   •   Analytical skills
   •   Excel & ERP proficiency

Job Description:
   •   Demand forecasting
   •   Inventory optimization
   •   Supply planning
   •   Data analysis & reporting (Korean)
   •   Coordinate with Korea SCM team

Salary: Rp 11.000.000 - Rp 17.000.000
Benefit: Transport, meal, insurance, training

Apply:
scm.recruitment@kolmarkorea.co.id
021-8990-xxxx',
        'PT Kolmar Korea',
        'all',
        'published',
        'closed',
        '인도네시아',
        'on_site',
        '2025-09-11T09:00:00+00:00',
        now(),
        now()
    ),(
        gen_random_uuid(),
        'c6e31130-6523-4fa0-9ce2-1191cd5cfe71',
        '한국 여행사 마케팅 담당',
        '한국 여행사 마케팅 담당

Company: Dream Mongolia Travel
Location: Улаанбаатар

Position: Marketing & SNS Manager

Required:
• 한국어 능통 (TOPIK 5+)
• SNS 마케팅 경험
• 디자인 툴 사용 가능 (Canva, Photoshop)
• 크리에이티브
• 25-35세

Work:
→ 한국 타겟 SNS 운영 (Instagram, Facebook, 블로그)
→ 콘텐츠 제작
→ 온라인 광고 운영
→ 한국 여행사 제휴
→ 이벤트 기획

Salary: ₮3,500,000 - ₮5,500,000 + 성과급

Benefit: 무료 투어 참여, 보너스

Contact:
enkhbold@dreamMongolia.mn
+976 9900-7788',
        'Enkhbold',
        'all',
        'published',
        'hiring',
        '몽골',
        'on_site',
        '2025-09-28T09:00:00+00:00',
        now(),
        now()
    );