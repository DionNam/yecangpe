#!/usr/bin/env python3
"""
Split job_postings_v3.sql into batches
"""

import re

# Read the SQL file
with open('job_postings_v3.sql', 'r') as f:
    content = f.read()

# Extract the VALUES portion
values_match = re.search(r'VALUES\s+(.*?)\s*;\s*COMMIT', content, re.DOTALL)
if not values_match:
    print("Could not find VALUES section")
    exit(1)

values_text = values_match.group(1).strip()

# Split into individual postings
postings = []
current_posting_lines = []
in_posting = False

for line in values_text.split('\n'):
    if line.strip().startswith("('"):
        # Start of new posting
        if current_posting_lines:
            postings.append('\n'.join(current_posting_lines))
            current_posting_lines = []
        current_posting_lines.append(line)
        in_posting = True
    elif in_posting:
        current_posting_lines.append(line)

if current_posting_lines:
    postings.append('\n'.join(current_posting_lines))

print(f"Found {len(postings)} postings")

# Clean postings - remove trailing commas
cleaned_postings = [p.rstrip().rstrip(',') for p in postings]

# Split into batches of 30
batch_size = 30
header = """INSERT INTO job_posts (
  author_id, title, content, company_name, target_nationality,
  review_status, hiring_status, published_at, created_at, updated_at,
  work_location_type, work_location_country
) VALUES"""

for i in range(0, len(cleaned_postings), batch_size):
    batch = cleaned_postings[i:i+batch_size]
    batch_num = i // batch_size + 1

    batch_text = ',\n'.join(batch) + ';'

    filename = f'batch_v3_{batch_num}.sql'
    with open(filename, 'w') as f:
        f.write(header + '\n')
        f.write(batch_text)
        f.write('\n')

    print(f"Created {filename} with {len(batch)} postings")

print(f"\nTotal batches created: {(len(cleaned_postings) + batch_size - 1) // batch_size}")
