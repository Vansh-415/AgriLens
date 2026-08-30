import glob
import os
import requests

images = glob.glob('scratch/*.jpg') + glob.glob('frontend/public/images/*.jpg')
print(f'Testing {len(images)} images...')

results = []
for path in images[:10]:
    with open(path, 'rb') as f:
        r = requests.post('http://localhost:8000/api/v1/predict/?land_acres=1.0', files={'file': ('leaf.jpg', f, 'image/jpeg')})
    if r.status_code == 200:
        data = r.json().get('data', {})
        conf = data.get('confidence', 0.0)
        p_class = data.get('predicted_class')
        sev = data.get('severity')
        tier = 'High (>85%)' if conf >= 0.85 else ('Moderate (65-85%)' if conf >= 0.65 else 'Uncertain (<65%)')
        adv = data.get('treatment_advisory', {})
        results.append({
            'file': os.path.basename(path),
            'class': p_class,
            'confidence': f'{conf*100:.1f}%',
            'tier': tier,
            'severity': sev,
            'immediate_action': adv.get('immediate_action'),
            'chemicals': [c.get('name') for c in adv.get('chemical_options', [])]
        })
    else:
        print(f'{os.path.basename(path)} failed: {r.status_code}')

for res in results:
    print('-----------------------------------------')
    print(f"File: {res['file']} | Predicted: {res['class']} | Conf: {res['confidence']} ({res['tier']}) | Sev: {res['severity']}")
    print(f"Immediate Action: {res['immediate_action']}")
    print(f"Chemicals: {res['chemicals']}")
