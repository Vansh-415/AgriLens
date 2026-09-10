import requests
import uuid

BASE = 'http://localhost:8000/api/v1'

# 1. Login with user 1
r1 = requests.post(f'{BASE}/auth/login', json={'email': 'admin@agrilens.com', 'password': 'Admin@123'})
print('User 1 (Admin) Login:', r1.status_code)
if r1.status_code == 200:
    t1 = r1.json()['data']['tokens']['access_token']
    h1 = {'Authorization': f'Bearer {t1}'}
    cnt1 = requests.get(f'{BASE}/scans/count', headers=h1)
    print('User 1 Scan Counts (/scans/count):', cnt1.status_code, cnt1.json())
    list1 = requests.get(f'{BASE}/scans/?limit=5', headers=h1)
    print('User 1 Scans List (/scans/):', list1.status_code, f"Returned {len(list1.json().get('data', []))} items")

# 2. Register / Login with User 2 (Brand new user)
u2_email = f'farmer_{uuid.uuid4().hex[:6]}@agrilens.in'
r2 = requests.post(f'{BASE}/auth/register', json={'email': u2_email, 'full_name': 'New Farmer', 'password': 'FarmerPassword123'})
print('\nUser 2 Register:', r2.status_code)
if r2.status_code == 200:
    t2 = r2.json()['data']['tokens']['access_token']
    h2 = {'Authorization': f'Bearer {t2}'}
    cnt2 = requests.get(f'{BASE}/scans/count', headers=h2)
    print('User 2 Initial Scan Counts:', cnt2.status_code, cnt2.json())
    
    # Run a test scan as User 2
    with open('scratch/leaf_redding_clean_1.jpg', 'rb') as f:
        scan_res = requests.post(f'{BASE}/predict/?land_acres=1.0', headers=h2, files={'file': ('leaf.jpg', f, 'image/jpeg')})
    print('User 2 Scan Upload (Predict):', scan_res.status_code)
    
    # Check count again for User 2
    cnt2_after = requests.get(f'{BASE}/scans/count', headers=h2)
    print('User 2 Scan Counts After 1 Scan:', cnt2_after.json())
    
    # Check User 1 count again to ensure User 2 scan didn't affect User 1
    cnt1_check = requests.get(f'{BASE}/scans/count', headers=h1)
    print('User 1 Scan Counts (unaffected):', cnt1_check.json())
