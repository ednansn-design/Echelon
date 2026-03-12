#!/usr/bin/env python3
"""
Echelon Screenshot Exporter — Deep Mode

Takes 2x PNG screenshots of every section/state of the app.
Outputs to ./screenshots/ folder.

Usage:
    cd backend && source .venv/bin/activate
    python ../take_screenshots.py
"""

import os
import json
import time
import requests
from playwright.sync_api import sync_playwright, Page

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "screenshots")
BASE_URL = "http://localhost:3000"
API_URL = "http://localhost:8000/api"

WIDTH = 393
HEIGHT = 850
count = 0


def get_token():
    """Get JWT token from the API."""
    r = requests.post(
        f"{API_URL}/auth/login",
        data={"username": "demo@echelon.ai", "password": "demo123"}
    )
    r.raise_for_status()
    return r.json()["access_token"]


def shot(page: Page, name: str, full_page: bool = False):
    """Take a screenshot and print summary."""
    global count
    count += 1
    num = f"{count:02d}"
    filepath = os.path.join(OUTPUT_DIR, f"{num}_{name}.png")
    page.screenshot(path=filepath, full_page=full_page)
    size_kb = os.path.getsize(filepath) // 1024
    print(f"  [{num}] {name}  ({size_kb} KB)")
    return filepath


def main():
    global count
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Clear old screenshots
    for f in os.listdir(OUTPUT_DIR):
        if f.endswith(".png"):
            os.remove(os.path.join(OUTPUT_DIR, f))

    print(f"\nEchelon Deep Screenshot Exporter")
    print(f"Output: {OUTPUT_DIR}/")
    print(f"Size: {WIDTH}x{HEIGHT} @2x\n")

    # Get auth token
    print("Getting auth token...")
    token = get_token()
    print(f"Got token\n")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # ════════════════════════════════════════════
        # NON-AUTH SCREENS
        # ════════════════════════════════════════════
        print("━━━ Public Screens ━━━")
        ctx = browser.new_context(
            viewport={"width": WIDTH, "height": HEIGHT},
            device_scale_factor=2,
        )
        page = ctx.new_page()

        # 1. Splash
        page.goto(f"{BASE_URL}/", wait_until="networkidle")
        time.sleep(2)
        shot(page, "splash")

        # 2. Login — Sign Up mode
        page.goto(f"{BASE_URL}/login", wait_until="networkidle")
        time.sleep(1.5)
        shot(page, "login_signup")

        # 3. Login — Log In mode (click toggle)
        page.click("text=Log In")
        time.sleep(0.5)
        shot(page, "login_signin")

        ctx.close()

        # ════════════════════════════════════════════
        # AUTH SCREENS
        # ════════════════════════════════════════════
        print("\n━━━ Auth Screens ━━━")
        ctx2 = browser.new_context(
            viewport={"width": WIDTH, "height": HEIGHT},
            device_scale_factor=2,
        )
        page2 = ctx2.new_page()

        # Inject token
        page2.goto(BASE_URL, wait_until="networkidle")
        time.sleep(1)
        page2.evaluate(f"""() => {{ localStorage.setItem('token', '{token}'); }}""")
        print("  Token injected\n")

        # ── ONBOARDING (6 steps) ──
        print("  ── Onboarding ──")
        page2.goto(f"{BASE_URL}/onboarding", wait_until="networkidle")
        time.sleep(2)
        shot(page2, "onboarding_step1_personal")

        # Step 2 — click Next
        next_btn = page2.locator("text=Next")
        if next_btn.count() > 0:
            next_btn.first.click()
            time.sleep(1)
            shot(page2, "onboarding_step2_education")

        # Step 3
        if next_btn.count() > 0:
            next_btn.first.click()
            time.sleep(1)
            shot(page2, "onboarding_step3_activities")

        # Step 4
        if next_btn.count() > 0:
            next_btn.first.click()
            time.sleep(1)
            shot(page2, "onboarding_step4_documents")

        # Step 5
        if next_btn.count() > 0:
            next_btn.first.click()
            time.sleep(1)
            shot(page2, "onboarding_step5_review")

        # ── DISCOVER ──
        print("\n  ── Discover ──")
        page2.goto(f"{BASE_URL}/dashboard/discover", wait_until="networkidle")
        time.sleep(5)
        shot(page2, "discover_card")

        # Full-page to show closing-soon banner + card together
        shot(page2, "discover_fullpage", full_page=True)

        # Swipe right (save) the first card to show animation
        card = page2.locator("[data-testid='swipe-card']").first
        # Use the save button instead
        save_btn = page2.locator("button[aria-label='Save scholarship']").first
        if save_btn.count() > 0:
            save_btn.click()
            time.sleep(1.5)
            shot(page2, "discover_after_swipe")

        # Swipe a few more to get to empty state
        for i in range(20):
            btn = page2.locator("button[aria-label='Save scholarship']").first
            if btn.count() > 0:
                btn.click()
                time.sleep(0.3)
            else:
                break
        time.sleep(1)
        # Check for skip buttons too
        for i in range(20):
            btn = page2.locator("button[aria-label='Skip scholarship']").first
            if btn.count() > 0:
                btn.click()
                time.sleep(0.3)
            else:
                break
        time.sleep(1.5)
        shot(page2, "discover_empty_state")

        # ── TRACKER ──
        print("\n  ── Tracker ──")
        page2.goto(f"{BASE_URL}/dashboard/tracker", wait_until="networkidle")
        time.sleep(4)
        shot(page2, "tracker_saved_tab")

        # Full page to see stats + cards
        shot(page2, "tracker_fullpage", full_page=True)

        # Click Applied tab
        applied_tab = page2.locator("text=Applied").first
        if applied_tab.count() > 0:
            applied_tab.click()
            time.sleep(1)
            shot(page2, "tracker_applied_tab")

        # Click In Review tab
        review_tab = page2.locator("text=In Review").first
        if review_tab.count() > 0:
            review_tab.click()
            time.sleep(1)
            shot(page2, "tracker_inreview_tab")

        # ── ALERTS ──
        print("\n  ── Alerts ──")
        page2.goto(f"{BASE_URL}/dashboard/alerts", wait_until="networkidle")
        time.sleep(3)
        shot(page2, "alerts_top")

        # Full page to show all insight cards
        shot(page2, "alerts_fullpage", full_page=True)

        # Scroll down to show more alerts
        page2.evaluate("window.scrollTo(0, 300)")
        time.sleep(0.5)
        shot(page2, "alerts_scrolled")

        # ── PROFILE ──
        print("\n  ── Profile ──")
        page2.goto(f"{BASE_URL}/dashboard/profile", wait_until="networkidle")
        time.sleep(3)
        shot(page2, "profile_top")

        # Scroll to funding potential + missed opps
        page2.evaluate("window.scrollTo(0, 280)")
        time.sleep(0.5)
        shot(page2, "profile_funding_missed")

        # Scroll to completeness ring
        page2.evaluate("window.scrollTo(0, 550)")
        time.sleep(0.5)
        shot(page2, "profile_completeness")

        # Scroll to settings + logout
        page2.evaluate("window.scrollTo(0, 900)")
        time.sleep(0.5)
        shot(page2, "profile_settings")

        # Full page
        shot(page2, "profile_fullpage", full_page=True)

        # Profile edit mode
        edit_btn = page2.locator("text=Edit").first
        if edit_btn.count() > 0:
            page2.evaluate("window.scrollTo(0, 0)")
            time.sleep(0.3)
            edit_btn.click()
            time.sleep(1)
            shot(page2, "profile_edit_mode")

        ctx2.close()
        browser.close()

    # ── Summary ──
    print(f"\n{'━' * 55}")
    print(f"  Done! {count} screenshots saved to ./screenshots/")
    print(f"{'━' * 55}")
    total_size = 0
    for f in sorted(os.listdir(OUTPUT_DIR)):
        if f.endswith(".png"):
            sz = os.path.getsize(os.path.join(OUTPUT_DIR, f))
            total_size += sz
            print(f"  {f}  ({sz // 1024} KB)")
    print(f"\n  Total: {total_size // 1024} KB ({total_size // (1024*1024)} MB)")


if __name__ == "__main__":
    main()
