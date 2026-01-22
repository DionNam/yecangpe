#!/usr/bin/env python3
"""
Execute SQL batches via file read
This will print the commands for Claude to execute via MCP
"""

import os

# Read each batch file
for i in range(2, 6):
    batch_file = f'batch_{i}.sql'
    if os.path.exists(batch_file):
        with open(batch_file, 'r') as f:
            sql_content = f.read()

        print(f"--- BATCH {i} ({batch_file}) ---")
        print(f"Length: {len(sql_content)} characters")
        print(f"Lines: {sql_content.count(chr(10))}")
        print()

print("All batches ready to execute via Supabase MCP")
