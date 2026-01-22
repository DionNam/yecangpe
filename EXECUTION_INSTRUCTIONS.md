# Job Postings Generation - Execution Instructions

## Summary

Successfully generated 126 job postings distributed from March 2025 to January 2026.

## Status

✅ **Batch 1 (30 postings)**: EXECUTED SUCCESSFULLY via Supabase MCP
⏳ **Remaining (96 postings)**: Ready to execute

## Files Generated

### Main SQL Files
- `job_postings.sql` - Complete SQL with all 126 postings
- `batch_1.sql` through `batch_5.sql` - Original batches (30+30+30+30+6 postings)

### Execution-Ready Group Files
The 96 remaining postings have been split into 4 manageable groups:
- `group_1.sql` - 30 postings (18KB) - June 2025 postings
- `group_2.sql` - 30 postings (20KB) - June-July 2025 postings
- `group_3.sql` - 30 postings (19KB) - July-August 2025 postings
- `group_4.sql` - 6 postings (4KB) - August 2025 onwards

## Execution Options

### Option 1: Via Supabase Dashboard (Recommended)
1. Open your Supabase project dashboard
2. Navigate to SQL Editor
3. Execute each group file in order:
   ```bash
   # Copy and paste content from each file into SQL Editor
   cat group_1.sql  # Execute this first
   cat group_2.sql  # Then this
   cat group_3.sql  # Then this
   cat group_4.sql  # Finally this
   ```

### Option 2: Via psql Command Line
If you have direct database access:
```bash
psql $DATABASE_URL -f group_1.sql
psql $DATABASE_URL -f group_2.sql
psql $DATABASE_URL -f group_3.sql
psql $DATABASE_URL -f group_4.sql
```

### Option 3: Via Supabase CLI
```bash
supabase db execute < group_1.sql
supabase db execute < group_2.sql
supabase db execute < group_3.sql
supabase db execute < group_4.sql
```

## Verification Queries

After execution, run these queries to verify:

### 1. Check Total Count
```sql
SELECT COUNT(*) as total_posts
FROM job_posts
WHERE published_at >= '2025-03-01';
-- Expected: 126
```

### 2. Check Monthly Distribution
```sql
SELECT
  DATE_TRUNC('month', published_at) as month,
  COUNT(*) as count
FROM job_posts
WHERE published_at >= '2025-03-01'
GROUP BY month
ORDER BY month;
```

Expected distribution:
- March 2025: 3
- April 2025: 8
- May 2025: 12
- June 2025: 16
- July 2025: 18
- August 2025: 20
- September 2025: 18
- October 2025: 15
- November 2025: 8
- December 2025: 5
- January 2026: 3

### 3. Check Nationality Distribution
```sql
SELECT
  target_nationality,
  COUNT(*) as count
FROM job_posts
WHERE published_at >= '2025-03-01'
GROUP BY target_nationality
ORDER BY count DESC;
```

### 4. Verify All Have Contact Information
```sql
SELECT COUNT(*) as posts_with_contact
FROM job_posts
WHERE published_at >= '2025-03-01'
AND (
  content LIKE '%WhatsApp%'
  OR content LIKE '%이메일:%'
  OR content LIKE '%카카오톡:%'
  OR content LIKE '%email:%'
  OR content LIKE '%Hubungi:%'
  OR content LIKE '%ติดต่อ:%'
  OR content LIKE '%Liên hệ:%'
);
-- Should equal total count (126)
```

### 5. Check Work Location Types
```sql
SELECT
  work_location_type,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) as percentage
FROM job_posts
WHERE published_at >= '2025-03-01'
GROUP BY work_location_type;
```

Expected distribution:
- on_site: ~70%
- remote: ~20%
- hybrid: ~10%

## Posting Details

- **Total Posts**: 126
- **Date Range**: March 2025 - January 2026
- **Target Countries**: Indonesia (ID), Vietnam (VN), Thailand (TH), Mongolia (MN), Pakistan (PK)
- **Languages**: 80% Korean, 20% mixed (Indonesian, Vietnamese, Thai)
- **All postings include**: Contact methods (email/WhatsApp/KakaoTalk)
- **Authors**: Distributed between 2 employer accounts

## Notes

- All postings have `review_status='published'` and `hiring_status='hiring'`
- Dates are realistically distributed throughout each month
- Job types include translators, engineers, teachers, HR staff, restaurant workers, tour guides, and more
- Salary ranges are realistic for each target country
- TOPIK levels range from 3-6 depending on position requirements

## Next Steps

1. Execute the 4 group files using your preferred method
2. Run the verification queries
3. Check that all requirements from the plan have been met
4. The platform should now have a realistic distribution of job postings for testing and demonstration

---
Generated: 2026-01-23
Total Files: 126 job postings across multiple SQL files
