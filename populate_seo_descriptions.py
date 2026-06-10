#!/usr/bin/env python3
"""Populate seo_description columns via Supabase REST API.
Run AFTER the ALTER TABLE migration has been applied."""

import os, json, requests, time
from dotenv import load_dotenv

load_dotenv('/a0/usr/projects/myhustle/website/.env.local')
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
}

def update_city_descriptions():
    with open('/a0/usr/projects/myhustle/website/city_seo_descriptions.json') as f:
        city_descs = json.load(f)

    print(f"Updating {len(city_descs)} city descriptions...")
    success = 0
    for city_id, data in city_descs.items():
        resp = requests.patch(
            f"{SUPABASE_URL}/rest/v1/cities?id=eq.{city_id}",
            headers=HEADERS,
            json={"seo_description": data["description"]}
        )
        if resp.status_code in (200, 204):
            success += 1
        else:
            print(f"  FAILED {data['name']}: {resp.status_code} {resp.text[:100]}")
    print(f"Cities: {success}/{len(city_descs)} updated")

def update_area_descriptions():
    with open('/a0/usr/projects/myhustle/website/area_seo_descriptions.json') as f:
        area_descs = json.load(f)

    print(f"Updating {len(area_descs)} area descriptions...")
    success = 0
    failed = 0
    batch_size = 50
    items = list(area_descs.items())

    for i in range(0, len(items), batch_size):
        batch = items[i:i+batch_size]
        for area_id, data in batch:
            resp = requests.patch(
                f"{SUPABASE_URL}/rest/v1/areas?id=eq.{area_id}",
                headers=HEADERS,
                json={"seo_description": data["description"]}
            )
            if resp.status_code in (200, 204):
                success += 1
            else:
                failed += 1
                if failed <= 5:
                    print(f"  FAILED {data['name']}: {resp.status_code} {resp.text[:100]}")

        done = min(i + batch_size, len(items))
        print(f"  Progress: {done}/{len(items)} ({success} ok, {failed} failed)")
        time.sleep(0.1)  # Small delay to avoid rate limiting

    print(f"Areas: {success}/{len(area_descs)} updated, {failed} failed")

if __name__ == "__main__":
    update_city_descriptions()
    print()
    update_area_descriptions()
    print("
Done!")
