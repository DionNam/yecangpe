#!/usr/bin/env python3
"""
Group mini-batches into 4 execution groups
"""

import re

header = """INSERT INTO job_posts (
  author_id, title, content, company_name, target_nationality,
  review_status, hiring_status, published_at, created_at, updated_at,
  work_location_type, work_location_country
) VALUES"""

groups = [
    (1, 3),   # mini_batch_01 to 03
    (4, 6),   # mini_batch_04 to 06
    (7, 9),   # mini_batch_07 to 09
    (10, 10)  # mini_batch_10
]

for group_num, (start, end) in enumerate(groups, 1):
    all_postings = []

    for i in range(start, end + 1):
        filename = f'mini_batch_{i:02d}.sql'
        with open(filename, 'r') as f:
            content = f.read()

        # Extract VALUES section
        values_match = re.search(r'VALUES\s+(.*);', content, re.DOTALL)
        if values_match:
            values_text = values_match.group(1).strip()

            # Split into individual postings
            postings = []
            current_posting_lines = []

            for line in values_text.split('\n'):
                if line.strip().startswith("('"):
                    if current_posting_lines:
                        postings.append('\n'.join(current_posting_lines))
                        current_posting_lines = []
                    current_posting_lines.append(line)
                elif current_posting_lines:
                    current_posting_lines.append(line)

            if current_posting_lines:
                postings.append('\n'.join(current_posting_lines))

            # Clean and add
            for p in postings:
                cleaned = p.rstrip().rstrip(',')
                all_postings.append(cleaned)

    # Write group file
    filename = f'group_{group_num}.sql'
    with open(filename, 'w') as f:
        f.write(header + '\n')
        f.write(',\n'.join(all_postings))
        f.write(';\n')

    print(f"Created {filename} with {len(all_postings)} postings (mini-batches {start:02d}-{end:02d})")
