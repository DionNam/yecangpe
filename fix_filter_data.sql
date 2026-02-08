-- Fix target_nationality: 'all' → 'ANY'
UPDATE job_posts
SET target_nationality = 'ANY'
WHERE target_nationality = 'all';

-- Fix work_location_country: 한글 → ISO 코드
UPDATE job_posts SET work_location_country = 'VN' WHERE work_location_country = '베트남';
UPDATE job_posts SET work_location_country = 'MN' WHERE work_location_country = '몽골';
UPDATE job_posts SET work_location_country = 'CN' WHERE work_location_country = '중국';
UPDATE job_posts SET work_location_country = 'TH' WHERE work_location_country = '태국';
UPDATE job_posts SET work_location_country = 'NP' WHERE work_location_country = '네팔';
UPDATE job_posts SET work_location_country = 'ID' WHERE work_location_country = '인도네시아';
UPDATE job_posts SET work_location_country = 'PH' WHERE work_location_country = '필리핀';
UPDATE job_posts SET work_location_country = 'IN' WHERE work_location_country = '인도';
UPDATE job_posts SET work_location_country = 'JP' WHERE work_location_country = '일본';
UPDATE job_posts SET work_location_country = 'KR' WHERE work_location_country = '대한민국';
UPDATE job_posts SET work_location_country = 'KR' WHERE work_location_country = '한국';
UPDATE job_posts SET work_location_country = 'MM' WHERE work_location_country = '미얀마';
UPDATE job_posts SET work_location_country = 'UZ' WHERE work_location_country = '우즈베키스탄';
UPDATE job_posts SET work_location_country = 'KZ' WHERE work_location_country = '카자흐스탄';
UPDATE job_posts SET work_location_country = 'LK' WHERE work_location_country = '스리랑카';
UPDATE job_posts SET work_location_country = 'PK' WHERE work_location_country = '파키스탄';
UPDATE job_posts SET work_location_country = 'BD' WHERE work_location_country = '방글라데시';
UPDATE job_posts SET work_location_country = 'TW' WHERE work_location_country = '대만';
UPDATE job_posts SET work_location_country = 'SG' WHERE work_location_country = '싱가포르';
UPDATE job_posts SET work_location_country = 'MY' WHERE work_location_country = '말레이시아';
UPDATE job_posts SET work_location_country = 'US' WHERE work_location_country = '미국';
UPDATE job_posts SET work_location_country = 'CA' WHERE work_location_country = '캐나다';
UPDATE job_posts SET work_location_country = 'GB' WHERE work_location_country = '영국';
UPDATE job_posts SET work_location_country = 'DE' WHERE work_location_country = '독일';
UPDATE job_posts SET work_location_country = 'FR' WHERE work_location_country = '프랑스';
UPDATE job_posts SET work_location_country = 'AU' WHERE work_location_country = '호주';
UPDATE job_posts SET work_location_country = 'NZ' WHERE work_location_country = '뉴질랜드';
