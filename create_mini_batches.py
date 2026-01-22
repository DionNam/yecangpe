#!/usr/bin/env python3
"""
Split batches 2-5 into mini-batches of 10 postings each for easier execution
"""

import re

header = """INSERT INTO job_posts (
  author_id, title, content, company_name, target_nationality,
  review_status, hiring_status, published_at, created_at, updated_at,
  work_location_type, work_location_country
) VALUES"""

mini_batch_size = 10
mini_batch_num = 1

def process_batch_file(batch_num):
    global mini_batch_num

    with open(f'batch_{batch_num}.sql', 'r') as f:
        content = f.read()

    # Extract VALUES section
    values_match = re.search(r'VALUES\s+(.*);', content, re.DOTALL)
    if not values_match:
        print(f"Could not parse batch_{batch_num}.sql")
        return

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

    # Clean postings - remove trailing commas
    cleaned_postings = [p.rstrip().rstrip(',') for p in postings]

    print(f"Batch {batch_num}: Found {len(cleaned_postings)} postings")

    # Create mini-batches
    for i in range(0, len(cleaned_postings), mini_batch_size):
        mini_batch = cleaned_postings[i:i+mini_batch_size]
        batch_text = ',\n'.join(mini_batch) + ';'

        filename = f'mini_batch_{mini_batch_num:02d}.sql'
        with open(filename, 'w') as f:
            f.write(header + '\n')
            f.write(batch_text)
            f.write('\n')

        print(f"  Created {filename} with {len(mini_batch)} postings")
        mini_batch_num += 1

# Process batches 2-5
for batch_num in range(2, 6):
    process_batch_file(batch_num)

print(f"\nTotal mini-batches created: {mini_batch_num - 1}")
