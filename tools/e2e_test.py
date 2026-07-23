import requests
import sys
import time

BASE_URL = "http://localhost:8000/api/v1"

def print_step(msg):
    print(f"\n[+] {msg}")

def print_error(msg):
    print(f"[-] ERROR: {msg}")
    sys.exit(1)

def wait_for_server():
    print_step("Waiting for backend server to start...")
    for _ in range(15):
        try:
            r = requests.get("http://localhost:8000/docs")
            if r.status_code == 200:
                print("    Server is up!")
                return
        except Exception:
            pass
        time.sleep(2)
    print_error("Backend server did not start in time.")

def test_auth():
    print_step("Testing Authentication Flow")
    
    # Register
    print("    Registering user...")
    test_user = {
        "email": f"test{int(time.time())}@agrilens.com",
        "password": "Password123!",
        "full_name": "Test Farmer",
        "role": "farmer",
        "location": {"type": "Point", "coordinates": [0, 0]}
    }
    r = requests.post(f"{BASE_URL}/auth/register", json=test_user)
    if r.status_code != 201:
        print_error(f"Register failed: {r.text}")
    print("    Register successful.")

    # Login
    print("    Logging in...")
    login_data = {
        "username": test_user["email"],
        "password": test_user["password"]
    }
    r = requests.post(f"{BASE_URL}/auth/login", data=login_data)
    if r.status_code != 200:
        print_error(f"Login failed: {r.text}")
    
    auth_data = r.json()
    access_token = auth_data["access_token"]
    print("    Login successful. Token received.")

    # Get Current User
    print("    Fetching current user...")
    headers = {"Authorization": f"Bearer {access_token}"}
    r = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    if r.status_code != 200:
        print_error(f"Failed to fetch current user: {r.text}")
    print(f"    Current user fetched: {r.json()['email']}")

def main():
    wait_for_server()
    test_auth()
    print_step("All backend integration tests passed successfully!")

if __name__ == "__main__":
    main()
