#!/usr/bin/env python3
"""
Combine all V3 batches into one INSERT statement
"""

import re

header = """INSERT INTO job_posts (
  author_id, title, content, company_name, target_nationality,
  review_status, hiring_status, published_at, created_at, updated_at,
  work_location_type, work_location_country
) VALUES"""

all_postings = []

for i in range(1, 6):
    filename = f'batch_v3_{i}.sql'
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

        print(f"Processed {filename}: {len(postings)} postings")

print(f"\nTotal postings collected: {len(all_postings)}")

# Write combined file
with open('all_postings_v3_combined.sql', 'w') as f:
    f.write(header + '\n')
    f.write(',\n'.join(all_postings))
    f.write(';\n')

print(f"Created all_postings_v3_combined.sql with {len(all_postings)} postings")
print(f"File size: {len(open('all_postings_v3_combined.sql').read())} bytes")
