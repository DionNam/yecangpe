#!/usr/bin/env python3
"""
Split large SQL file into smaller batches
"""

import re

# Read the SQL file
with open('job_postings.sql', 'r') as f:
    content = f.read()

# Extract the VALUES portion
# Find everything between "VALUES" and the final semicolon
values_match = re.search(r'VALUES\s+(.*?)\s*;\s*COMMIT', content, re.DOTALL)
if not values_match:
    print("Could not find VALUES section")
    exit(1)

values_text = values_match.group(1)

# Split by individual value tuples (each starts with "  ('")
# Each posting is one tuple that may span multiple lines
postings = []
current_posting = []
paren_depth = 0

for line in values_text.split('\n'):
    stripped = line.strip()

    # Count parentheses to track tuple boundaries
    paren_depth += line.count('(') - line.count(')')

    current_posting.append(line)

    # When we hit a comma at depth 0, we've completed a posting
    if paren_depth == 0 and stripped.endswith(','):
        postings.append('\n'.join(current_posting))
        current_posting = []
    elif paren_depth == 0 and stripped.endswith(')') and not stripped.endswith(','):
        # Last posting (no comma)
        postings.append('\n'.join(current_posting))
        current_posting = []

print(f"Found {len(postings)} postings")

# Split into batches of 30
batch_size = 30
header = """INSERT INTO job_posts (
  author_id, title, content, company_name, target_nationality,
  review_status, hiring_status, published_at, created_at, updated_at,
  work_location_type, work_location_country
) VALUES"""

for i in range(0, len(postings), batch_size):
    batch = postings[i:i+batch_size]
    batch_num = i // batch_size + 1

    # Join postings with commas, remove trailing comma from last one
    batch_text = ',\n'.join(batch)
    batch_text = batch_text.rstrip(',')
    batch_text = batch_text + ';'

    filename = f'batch_{batch_num}.sql'
    with open(filename, 'w') as f:
        f.write(header + '\n')
        f.write(batch_text)
        f.write('\n')

    print(f"Created {filename} with {len(batch)} postings")

print(f"\nTotal batches created: {(len(postings) + batch_size - 1) // batch_size}")
