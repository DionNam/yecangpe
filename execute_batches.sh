#!/bin/bash
# Execute all batch SQL files via psql

echo "Executing batch SQL files..."

for i in 2 3 4 5; do
    echo "Executing batch_$i.sql..."
    # Note: This script assumes Supabase credentials are configured
    # We'll call it from Python using the MCP tool instead
    echo "Batch $i ready"
done

echo "All batches prepared"
