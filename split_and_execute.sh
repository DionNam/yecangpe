#!/bin/bash
# Split job_postings.sql into batches of 25 inserts each

# Extract just the VALUES rows (skip BEGIN, INSERT statement header, and COMMIT)
sed -n '13,/^;$/p' job_postings.sql | sed '$ d' > values_only.txt

# Count total rows
total_lines=$(wc -l < values_only.txt)
echo "Total value lines: $total_lines"

# Split into batches of approximately 30 rows each (including multi-line values)
# Since each posting can be 10-30 lines, we'll split by actual posting count

# Create batch files
batch_size=25
batch_num=1

# Create header
header="INSERT INTO job_posts (
  author_id, title, content, company_name, target_nationality,
  review_status, hiring_status, published_at, created_at, updated_at,
  work_location_type, work_location_country
) VALUES"

# Extract individual postings (each starts with "  ('")
awk '
BEGIN {
    batch_size = 25
    batch_num = 1
    count = 0
    header = "INSERT INTO job_posts (\n  author_id, title, content, company_name, target_nationality,\n  review_status, hiring_status, published_at, created_at, updated_at,\n  work_location_type, work_location_country\n) VALUES"
    current_batch = ""
}

/^  \(/ {
    # Start of new posting
    if (count > 0 && count % batch_size == 0) {
        # Write current batch
        sub(/,$/, ";", current_batch)  # Replace last comma with semicolon
        print header > ("batch_" batch_num ".sql")
        print current_batch > ("batch_" batch_num ".sql")
        batch_num++
        current_batch = ""
        count = 0
    }

    # Add to current batch
    if (current_batch != "") current_batch = current_batch "\n"
    current_batch = current_batch $0
    count++
    next
}

{
    # Continuation of current posting
    current_batch = current_batch "\n" $0
}

END {
    # Write last batch
    if (current_batch != "") {
        sub(/,$/, ";", current_batch)
        print header > ("batch_" batch_num ".sql")
        print current_batch > ("batch_" batch_num ".sql")
    }
}
' values_only.txt

echo "Created $(ls batch_*.sql | wc -l) batch files"
