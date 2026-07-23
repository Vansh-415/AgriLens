"""
Module 2 — End-to-End API Tests
================================
Tests all authentication endpoints against a real MongoDB database.

Prerequisites:
  1. Configure backend/.env with a valid MONGODB_URL
  2. Run: python -m scripts.seed   (seeds admin user)
  3. Run: python test_auth.py

Tests:
  1.  Health check
  2.  Register new user
  3.  Duplicate email rejection
  4.  Invalid email rejection
  5.  Short password rejection
  6.  Login with valid credentials
  7.  Login with wrong password
  8.  Login with unknown email
  9.  Get current user (/me)
  10. /me with invalid token
  11. /me with no token
  12. /me with refresh token (should fail)
  13. Refresh access token
  14. Refresh with invalid token
  15. Logout
  16. Refresh after logout (should fail)
  17. Admin login & admin-check
  18. Farmer cannot access admin-check
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

import asyncio
from httpx import ASGITransport, AsyncClient
from app.main import app
from app.database import connect_db, disconnect_db, get_database
from app.models.user import create_user_document, COLLECTION_NAME as USERS_COL
from app.utils.security import hash_password

BASE = "http://test"
TEST_EMAIL = "testfarmer_module2@agrilens.com"
TEST_PASSWORD = "TestPass123"
TEST_NAME = "Test Farmer"
ADMIN_EMAIL = "admin@agrilens.com"
ADMIN_PASSWORD = "Admin@123"


async def run_tests():
    # Connect to database
    await connect_db()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url=BASE) as client:
        passed = 0
        failed = 0

        def check(name, condition, detail=""):
            nonlocal passed, failed
            if condition:
                passed += 1
                print(f"  [PASS] {name}")
            else:
                failed += 1
                print(f"  [FAIL] {name} {detail}")

        try:
            # --- Pre-cleanup ---
            db = get_database()
            await db["users"].delete_one({"email": TEST_EMAIL.lower()})

            # --- Ensure admin exists ---
            admin = await db[USERS_COL].find_one({"email": ADMIN_EMAIL})
            if not admin:
                admin_doc = create_user_document(
                    ADMIN_EMAIL, "AgriLens Admin",
                    hash_password(ADMIN_PASSWORD), "admin"
                )
                await db[USERS_COL].insert_one(admin_doc)
                print("  (seeded admin user)")

            # ==== Test 1: Health ====
            print("\n--- Test 1: Health Check ---")
            r = await client.get("/api/v1/health")
            check("GET /health returns 200", r.status_code == 200)

            # ==== Test 2: Register ====
            print("\n--- Test 2: Register New User ---")
            r = await client.post("/api/v1/auth/register", json={
                "email": TEST_EMAIL, "full_name": TEST_NAME, "password": TEST_PASSWORD
            })
            check("POST /register returns 200", r.status_code == 200, f"got {r.status_code}")
            data = r.json()
            check("success=True", data.get("success") is True)
            check("data.user exists", "user" in data.get("data", {}))
            check("data.tokens exists", "tokens" in data.get("data", {}))
            check("role is farmer", data["data"]["user"]["role"] == "farmer")
            check("account_status is active", data["data"]["user"]["account_status"] == "active")
            check("login_count is 0", data["data"]["user"]["login_count"] == 0)
            access_token = data["data"]["tokens"]["access_token"]
            refresh_token = data["data"]["tokens"]["refresh_token"]
            check("access_token present", bool(access_token))
            check("refresh_token present", bool(refresh_token))

            # ==== Test 3: Duplicate email ====
            print("\n--- Test 3: Duplicate Email ---")
            r = await client.post("/api/v1/auth/register", json={
                "email": TEST_EMAIL, "full_name": "Dup", "password": TEST_PASSWORD
            })
            check("Duplicate email returns 400", r.status_code == 400, f"got {r.status_code}")
            check("Error says 'already exists'", "already exists" in r.json().get("message", ""))

            # ==== Test 4: Invalid email ====
            print("\n--- Test 4: Invalid Email ---")
            r = await client.post("/api/v1/auth/register", json={
                "email": "not-an-email", "full_name": "Test", "password": TEST_PASSWORD
            })
            check("Invalid email returns 422", r.status_code == 422, f"got {r.status_code}")

            # ==== Test 5: Short password ====
            print("\n--- Test 5: Short Password ---")
            r = await client.post("/api/v1/auth/register", json={
                "email": "new@test.com", "full_name": "Test", "password": "short"
            })
            check("Short password returns 422", r.status_code == 422, f"got {r.status_code}")

            # ==== Test 6: Login ====
            print("\n--- Test 6: Login ---")
            r = await client.post("/api/v1/auth/login", json={
                "email": TEST_EMAIL, "password": TEST_PASSWORD
            })
            check("POST /login returns 200", r.status_code == 200, f"got {r.status_code}")
            data = r.json()
            check("Login has tokens", "tokens" in data.get("data", {}))
            check("login_count >= 1", data["data"]["user"]["login_count"] >= 1)
            check("last_login set", data["data"]["user"]["last_login"] is not None)
            login_access = data["data"]["tokens"]["access_token"]
            login_refresh = data["data"]["tokens"]["refresh_token"]

            # ==== Test 7: Wrong password ====
            print("\n--- Test 7: Wrong Password ---")
            r = await client.post("/api/v1/auth/login", json={
                "email": TEST_EMAIL, "password": "WrongPassword123"
            })
            check("Wrong password returns 401", r.status_code == 401, f"got {r.status_code}")

            # ==== Test 8: Unknown email ====
            print("\n--- Test 8: Unknown Email ---")
            r = await client.post("/api/v1/auth/login", json={
                "email": "nobody@test.com", "password": TEST_PASSWORD
            })
            check("Unknown email returns 401", r.status_code == 401, f"got {r.status_code}")

            # ==== Test 9: /me with valid token ====
            print("\n--- Test 9: GET /me ---")
            r = await client.get("/api/v1/auth/me", headers={
                "Authorization": f"Bearer {login_access}"
            })
            check("GET /me returns 200", r.status_code == 200, f"got {r.status_code}")
            check("Email matches", r.json()["data"]["email"] == TEST_EMAIL.lower())
            check("Consistent format", r.json().get("success") is True)

            # ==== Test 10: /me with invalid token ====
            print("\n--- Test 10: /me with Invalid Token ---")
            r = await client.get("/api/v1/auth/me", headers={
                "Authorization": "Bearer invalid-token-xyz"
            })
            check("Invalid token returns 401", r.status_code == 401, f"got {r.status_code}")

            # ==== Test 11: /me with no token ====
            print("\n--- Test 11: /me with No Token ---")
            # Clear cookies to simulate unauthenticated request, then restore for later tests
            saved_cookies = dict(client.cookies)
            client.cookies.clear()
            r = await client.get("/api/v1/auth/me")
            client.cookies.update(saved_cookies)
            check("No token returns 401", r.status_code == 401, f"got {r.status_code}")

            # ==== Test 12: /me with refresh token ====
            print("\n--- Test 12: /me with Refresh Token ---")
            r = await client.get("/api/v1/auth/me", headers={
                "Authorization": f"Bearer {login_refresh}"
            })
            check("Refresh as access returns 401", r.status_code == 401, f"got {r.status_code}")

            # ==== Test 13: Refresh ====
            print("\n--- Test 13: Refresh Token ---")
            r = await client.post("/api/v1/auth/refresh", json={
                "refresh_token": login_refresh
            })
            check("POST /refresh returns 200", r.status_code == 200, f"got {r.status_code}")
            new_access = r.json()["data"]["access_token"]
            check("New access token returned", bool(new_access))

            r = await client.get("/api/v1/auth/me", headers={
                "Authorization": f"Bearer {new_access}"
            })
            check("New access token works", r.status_code == 200, f"got {r.status_code}")

            # ==== Test 14: Refresh with invalid token ====
            print("\n--- Test 14: Invalid Refresh Token ---")
            r = await client.post("/api/v1/auth/refresh", json={
                "refresh_token": "invalid-refresh"
            })
            check("Invalid refresh returns 401", r.status_code == 401, f"got {r.status_code}")

            # ==== Test 15: Logout ====
            print("\n--- Test 15: Logout ---")
            r = await client.post("/api/v1/auth/logout",
                json={"refresh_token": login_refresh},
                headers={"Authorization": f"Bearer {new_access}"},
            )
            check("POST /logout returns 200", r.status_code == 200, f"got {r.status_code}")
            check("Message: Logout successful", r.json().get("message") == "Logout successful")

            # ==== Test 16: Refresh after logout ====
            print("\n--- Test 16: Refresh After Logout ---")
            r = await client.post("/api/v1/auth/refresh", json={
                "refresh_token": login_refresh
            })
            check("Revoked refresh returns 401", r.status_code == 401, f"got {r.status_code}")

            # ==== Test 17: Admin login ====
            print("\n--- Test 17: Admin Login & Admin-Check ---")
            r = await client.post("/api/v1/auth/login", json={
                "email": ADMIN_EMAIL, "password": ADMIN_PASSWORD
            })
            check("Admin login returns 200", r.status_code == 200, f"got {r.status_code}")
            admin_access = r.json()["data"]["tokens"]["access_token"]
            check("Admin role is admin", r.json()["data"]["user"]["role"] == "admin")

            r = await client.get("/api/v1/auth/admin-check", headers={
                "Authorization": f"Bearer {admin_access}"
            })
            check("Admin-check passes for admin", r.status_code == 200, f"got {r.status_code}")

            # ==== Test 18: Farmer cannot access admin-check ====
            print("\n--- Test 18: Farmer Blocked from Admin-Check ---")
            farmer_r = await client.post("/api/v1/auth/login", json={
                "email": TEST_EMAIL, "password": TEST_PASSWORD
            })
            farmer_access = farmer_r.json()["data"]["tokens"]["access_token"]
            r = await client.get("/api/v1/auth/admin-check", headers={
                "Authorization": f"Bearer {farmer_access}"
            })
            check("Farmer gets 403 on admin-check", r.status_code == 403, f"got {r.status_code}")

        finally:
            # Cleanup test data
            db = get_database()
            test_user = await db["users"].find_one({"email": TEST_EMAIL.lower()})
            if test_user:
                await db["refresh_tokens"].delete_many({"user_id": test_user["_id"]})
                await db["users"].delete_one({"_id": test_user["_id"]})
            # Clean up admin refresh tokens from tests
            admin_user = await db["users"].find_one({"email": ADMIN_EMAIL})
            if admin_user:
                await db["refresh_tokens"].delete_many({"user_id": admin_user["_id"]})
            await disconnect_db()

        print(f"\n{'='*50}")
        print(f"RESULTS: {passed} passed, {failed} failed, {passed+failed} total")
        print(f"{'='*50}")
        if failed > 0:
            sys.exit(1)
        else:
            print("ALL TESTS PASSED!")


if __name__ == "__main__":
    asyncio.run(run_tests())
