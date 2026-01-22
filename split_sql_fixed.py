#!/usr/bin/env python3
"""
Split large SQL file into smaller batches - fixed version
"""

import re

# Read the SQL file
with open('job_postings.sql', 'r') as f:
    content = f.read()

# Extract the VALUES portion
# Find everything between "VALUES" and the final semicolon before COMMIT
values_match = re.search(r'VALUES\s+(.*?)\s*;\s*COMMIT', content, re.DOTALL)
if not values_match:
    print("Could not find VALUES section")
    exit(1)

values_text = values_match.group(1).strip()

# Split into individual postings
# Each posting starts with "  ('" and ends with either ")," or ");"
postings = []
current_posting_lines = []
in_posting = False

for line in values_text.split('\n'):
    if line.strip().startswith("('"):
        # Start of a new posting
        if current_posting_lines:
            # Save previous posting
            posting_text = '\n'.join(current_posting_lines)
            postings.append(posting_text)
            current_posting_lines = []
        current_posting_lines.append(line)
        in_posting = True
    elif in_posting:
        current_posting_lines.append(line)

# Don't forget the last posting
if current_posting_lines:
    posting_text = '\n'.join(current_posting_lines)
    postings.append(posting_text)

print(f"Found {len(postings)} postings")

# Clean up postings - remove trailing commas
cleaned_postings = []
for posting in postings:
    # Remove trailing comma if present
    posting = posting.rstrip().rstrip(',')
    cleaned_postings.append(posting)

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

    # Join postings with commas
    batch_text = ',\n'.join(batch)
    # End with semicolon
    batch_text = batch_text + ';'

    filename = f'batch_{batch_num}.sql'
    with open(filename, 'w') as f:
        f.write(header + '\n')
        f.write(batch_text)
        f.write('\n')

    print(f"Created {filename} with {len(batch)} postings")

print(f"\nTotal batches created: {(len(cleaned_postings) + batch_size - 1) // batch_size}")
