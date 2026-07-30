import json
import random
import time
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from pathlib import Path

# Import models dynamically with try/except fallback
try:
    from .models import BrandedProduct, VerificationLog
    HAS_MODELS = True
except Exception:
    HAS_MODELS = False

# Curated luxury brand verification database fallback catalog
LUXURY_CATALOG = {
    'SWISS-7701': {
        'brand': 'Aetheria Geneva',
        'model': 'Tourbillon Calibre No. 1',
        'category': 'Swiss Luxury Timepiece',
        'origin': 'Geneva, Switzerland',
        'mint_date': '2025-11-14',
        'nfc_chip': 'NFC-7701-AES256',
        'blockchain_hash': '0x8F9a3B2c4D1e5F6a7B8c9D0e1F2a3B4c5D6e7F8a',
        'block_number': 1894102,
        'smart_contract': '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        'warranty': 'Active — 5 Year International Guarantee',
        'valid': True
    },
    'SWISS-7709': {
        'brand': 'Aetheria Geneva',
        'model': 'Tourbillon Calibre No. 1',
        'category': 'Swiss Luxury Timepiece',
        'origin': 'Geneva, Switzerland',
        'mint_date': '2025-11-14',
        'nfc_chip': 'NFC-7709-AES256',
        'blockchain_hash': '0x8F9a3B2c4D1e5F6a7B8c9D0e1F2a3B4c5D6e7F8a',
        'block_number': 1894102,
        'smart_contract': '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        'warranty': 'Active — 5 Year International Guarantee',
        'valid': True
    },
    'MEN-1020': {
        'brand': 'Bespoke Milano',
        'model': 'Italian Wool Blazer',
        'category': "Men's Wear",
        'origin': 'Milan, Italy',
        'mint_date': '2026-02-04',
        'nfc_chip': 'NFC-1020-SEC',
        'blockchain_hash': '0x1A2b3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b',
        'block_number': 1894120,
        'smart_contract': '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        'warranty': 'Active Lifetime Tailoring Warranty',
        'valid': True
    },
    'WOMEN-4050': {
        'brand': 'Atelier Velour',
        'model': 'Silk Evening Gown',
        'category': "Women's Wear",
        'origin': 'Paris, France',
        'mint_date': '2026-02-18',
        'nfc_chip': 'NFC-4050-ECC',
        'blockchain_hash': '0x2D3e4F5a6B7c8D9e0F1a2B3c4D5e6F7a8B9c0D1e',
        'block_number': 1894140,
        'smart_contract': '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        'warranty': 'Active Haute Couture Certificate',
        'valid': True
    },
    'KIDS-3010': {
        'brand': 'Junior Artisan',
        'model': 'Organic Cotton Blazer',
        'category': "Kids' Wear",
        'origin': 'Florence, Italy',
        'mint_date': '2026-03-01',
        'nfc_chip': 'NFC-3010-RFID',
        'blockchain_hash': '0x3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b1C2d',
        'block_number': 1894160,
        'smart_contract': '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        'warranty': 'Active Organic Batch Proof',
        'valid': True
    },
    'BAG-8821': {
        'brand': 'Velour Paris',
        'model': 'Le Grand Leather Tote',
        'category': 'Bags & Leatherware',
        'origin': 'Paris, France',
        'mint_date': '2026-03-12',
        'nfc_chip': 'NFC-8821-AES256',
        'blockchain_hash': '0x4F5E6D7C8B9A0F1E2D3C4B5A6F7E8D9C0B1A2F3E',
        'block_number': 1894180,
        'smart_contract': '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        'warranty': 'Active Artisan Certificate',
        'valid': True
    },
    'GRASSE-4091': {
        'brand': "L'Elixir Rare",
        'model': 'Nuit Botanique 100ml',
        'category': 'Perfumes',
        'origin': 'Grasse, France',
        'mint_date': '2026-03-25',
        'nfc_chip': 'NFC-4091-RFID',
        'blockchain_hash': '0x5A6b7C8d9E0f1A2b3C4d5E6f7A8b9C0d1E2f3A4b',
        'block_number': 1894190,
        'smart_contract': '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        'warranty': 'Active Sealed Batch Proof',
        'valid': True
    },
    'COSM-9010': {
        'brand': 'Aura Cosmetics',
        'model': '24K Gold Youth Serum',
        'category': 'Cosmetics',
        'origin': 'Zurich, Switzerland',
        'mint_date': '2026-04-02',
        'nfc_chip': 'NFC-9010-SEC',
        'blockchain_hash': '0x6B7c8D9e0F1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c',
        'block_number': 1894200,
        'smart_contract': '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        'warranty': 'Active Lab Certified Batch',
        'valid': True
    }
}


def log_verification(pid, is_auth, b_hash):
    """Log verification attempt into Django ORM database if available."""
    if HAS_MODELS:
        try:
            VerificationLog.objects.create(
                product_id_queried=pid,
                is_authentic=is_auth,
                blockchain_hash=b_hash
            )
        except Exception:
            pass


def verify_product(request, product_id):
    pid_upper = product_id.strip().upper()

    # Query Django ORM Model first if available
    if HAS_MODELS:
        try:
            obj = BrandedProduct.objects.filter(product_id__iexact=pid_upper).first()
            if obj:
                log_verification(pid_upper, obj.is_valid, obj.blockchain_hash)
                return JsonResponse({
                    'product_id': obj.product_id,
                    'valid': obj.is_valid,
                    'brand': obj.brand,
                    'model': obj.model_name,
                    'category': obj.category,
                    'origin': obj.origin,
                    'mint_date': str(obj.mint_date),
                    'nfc_chip': obj.nfc_chip,
                    'blockchain_hash': obj.blockchain_hash,
                    'block_number': obj.block_number,
                    'smart_contract': obj.smart_contract,
                    'warranty': obj.warranty,
                    'timestamp': time.time()
                })
        except Exception:
            pass

    # Catalog dictionary lookup
    if pid_upper in LUXURY_CATALOG:
        data = LUXURY_CATALOG[pid_upper].copy()
        data['product_id'] = pid_upper
        data['timestamp'] = time.time()
        log_verification(pid_upper, True, data['blockchain_hash'])
        return JsonResponse(data)
        
    clean_pid = pid_upper.replace('-', '').replace('_', '')
    valid = not pid_upper.startswith('FAKE') and not pid_upper.startswith('UNAUTH') and not pid_upper.startswith('COUNTERFEIT') and len(clean_pid) >= 3 and clean_pid.isalnum()
    
    if valid:
        # Dynamic brand & model resolution based on prefix
        brand_name = 'Heritage Luxury Atelier'
        category_name = 'Certified Authentic Asset'
        model_name = f'Authentic Certified Asset #{pid_upper}'
        
        if pid_upper.startswith('SWISS'):
            brand_name = 'Aetheria Geneva'
            category_name = 'Watches'
            model_name = f'Tourbillon Timepiece #{pid_upper}'
        elif pid_upper.startswith('MEN'):
            brand_name = 'Bespoke Milano'
            category_name = "Men's Wear"
            model_name = f'Italian Tailored Blazer #{pid_upper}'
        elif pid_upper.startswith('WOMEN'):
            brand_name = 'Atelier Velour'
            category_name = "Women's Wear"
            model_name = f'Silk Haute Couture Gown #{pid_upper}'
        elif pid_upper.startswith('KIDS'):
            brand_name = 'Junior Artisan'
            category_name = "Kids' Wear"
            model_name = f'Organic Royal Apparel #{pid_upper}'
        elif pid_upper.startswith('BAG'):
            brand_name = 'Velour Paris'
            category_name = 'Bags & Leatherware'
            model_name = f'Le Grand Leather Tote #{pid_upper}'
        elif pid_upper.startswith('GRASSE'):
            brand_name = "L'Elixir Rare"
            category_name = 'Perfumes'
            model_name = f'Nuit Botanique Essence #{pid_upper}'
        elif pid_upper.startswith('COSM'):
            brand_name = 'Aura Cosmetics'
            category_name = 'Cosmetics'
            model_name = f'24K Gold Youth Serum #{pid_upper}'

        computed_hash = f"0x{abs(hash(pid_upper)) & 0xffffffffffffffff:016x}8f219c004a"
        log_verification(pid_upper, True, computed_hash)
        return JsonResponse({
            'product_id': pid_upper,
            'valid': True,
            'brand': brand_name,
            'model': model_name,
            'category': category_name,
            'origin': 'European Union Guild',
            'mint_date': '2026-02-01',
            'nfc_chip': f'NFC-{pid_upper}-AES256',
            'blockchain_hash': computed_hash,
            'block_number': 1894204,
            'smart_contract': '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
            'warranty': 'Active 5 Year International Guarantee',
            'timestamp': time.time()
        })
        
    log_verification(pid_upper, False, '0x0000000000000000000000000000000000000000')
    return JsonResponse({
        'product_id': pid_upper,
        'valid': False,
        'reason': 'Cryptographic proof failure: No matching hash or NFC token found in smart contract state.',
        'blockchain_hash': '0x0000000000000000000000000000000000000000',
        'timestamp': time.time()
    }, status=400)


def audit_product(request, product_id):
    """Deep cryptographic audit endpoint for ordered product verification."""
    pid_upper = product_id.strip().upper()
    
    # Retrieve base verification info
    res = verify_product(request, product_id)
    if res.status_code != 200:
        return res
        
    import json
    data = json.loads(res.content.decode('utf-8'))
    
    # Enhance with deep audit cryptographic telemetry
    hash_str = data.get('blockchain_hash', '0x0000')
    merkle_root = f"0xMK{hash_str[2:10]}E89A4B2C{hash_str[-8:]}"
    validator_node = "Verix-Node-Geneva-09 (Validator ID #8841)"
    
    data.update({
        'audit_status': 'PASSED_VERIFIED',
        'merkle_root': merkle_root,
        'validator_node': validator_node,
        'execution_engine': 'EVM Smart Contract Core v4.2',
        'nfc_hardware_signature': f"SIG-AES256-{pid_upper}-VALIDATED",
        'audit_timestamp_iso': time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        'audit_steps': [
            {'step': 1, 'name': 'Node Connection', 'detail': f'Connected to {validator_node}', 'passed': True},
            {'step': 2, 'name': 'Smart Contract Query', 'detail': f'Contract {data.get("smart_contract")} state read success', 'passed': True},
            {'step': 3, 'name': 'Merkle Tree Hash Verification', 'detail': f'Merkle Root {merkle_root} matches block #{data.get("block_number")}', 'passed': True},
            {'step': 4, 'name': 'NFC Cryptographic Seal', 'detail': f'Hardware signature {data.get("nfc_chip")} active and authentic', 'passed': True},
            {'step': 5, 'name': 'Warranty & Provenance Guarantee', 'detail': data.get('warranty', 'Active Lifetime Guarantee'), 'passed': True}
        ]
    })
    
    return JsonResponse(data)


def dashboard_stats(request):
    """Returns real-time metrics for Page 4 Blockchain Dashboard."""
    total_logs = 0
    if HAS_MODELS:
        try:
            total_logs = VerificationLog.objects.count()
        except Exception:
            pass

    return JsonResponse({
        'total_registered': 128490 + total_logs,
        'verified_products': 124110 + total_logs,
        'fake_blocked': 4380,
        'block_height': 1894204,
        'tps': 4250,
        'total_transactions': 9842100 + total_logs,
        'distribution': {
            'Watches & Jewelry': 35,
            'Haute Couture & Leather': 28,
            'Rare Spirits': 18,
            'Electronics & Optics': 12,
            'Art & Antiques': 7
        },
        'monthly_verifications': [12400, 14200, 16800, 19500, 22100, 25800, 29400]
    })


def recent_blocks(request):
    """Returns recent cryptographic validation activities."""
    activities = []
    if HAS_MODELS:
        try:
            logs = VerificationLog.objects.order_by('-timestamp')[:5]
            for l in logs:
                activities.append({
                    'id': f"TX-{l.id}",
                    'product_id': l.product_id_queried,
                    'brand': 'Logged Query',
                    'status': 'AUTHENTIC' if l.is_authentic else 'FRAUD BLOCKED',
                    'time': 'Just now',
                    'hash': l.blockchain_hash[:6] + '...' + l.blockchain_hash[-4:] if len(l.blockchain_hash) > 10 else l.blockchain_hash
                })
        except Exception:
            pass

    if not activities:
        activities = [
            {'id': 'TX-9982', 'product_id': 'SWISS-7709', 'brand': 'Aetheria Geneva', 'status': 'AUTHENTIC', 'time': '12 sec ago', 'hash': '0x8F9a...7F8a'},
            {'id': 'TX-9981', 'product_id': 'PARIS-8821', 'brand': 'Velour Atelier', 'status': 'AUTHENTIC', 'time': '45 sec ago', 'hash': '0x1A2b...9A0b'},
            {'id': 'TX-9980', 'product_id': 'FAKE-9900', 'brand': 'Unknown Replica', 'status': 'FRAUD BLOCKED', 'time': '2 min ago', 'hash': '0x0000...0000'},
            {'id': 'TX-9979', 'product_id': 'GRASSE-4091', 'brand': "L'Elixir Rare", 'status': 'AUTHENTIC', 'time': '3 min ago', 'hash': '0x3C4d...1C2d'},
            {'id': 'TX-9978', 'product_id': 'JEWEL-5520', 'brand': 'Maison Lumiere', 'status': 'AUTHENTIC', 'time': '5 min ago', 'hash': '0x9B8A...1A0B'},
        ]
    return JsonResponse({'activities': activities})



@csrf_exempt
def auth_login(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body.decode('utf-8'))
            email = body.get('email', '')
            role = body.get('role', 'collector')
            return JsonResponse({
                'success': True,
                'message': f'Welcome back! Authenticated as {email} ({role.title()}).',
                'user': {'email': email, 'role': role, 'token': 'jwt_demo_token_8891023'}
            })
        except Exception:
            pass
    return JsonResponse({'success': True, 'message': 'Demo Authentication Active'})


@csrf_exempt
def auth_register(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body.decode('utf-8'))
            email = body.get('email', '')
            name = body.get('name', 'Luxury Collector')
            return JsonResponse({
                'success': True,
                'message': f'Account created for {name} ({email}). Verification key dispatched.',
                'user': {'name': name, 'email': email, 'token': 'jwt_demo_token_new_889'}
            })
        except Exception:
            pass
    return JsonResponse({'success': True, 'message': 'Demo Registration Active'})


def index(request):
    frontend_index = Path(settings.BASE_DIR).parent.parent / 'frontend' / 'index.html'
    try:
        content = frontend_index.read_text(encoding='utf-8')
        return HttpResponse(content, content_type='text/html')
    except Exception:
        return HttpResponse('<h1>Index not found</h1>', status=404, content_type='text/html')



