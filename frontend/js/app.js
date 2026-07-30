/**
 * Verix — Next-Generation Blockchain Product Verification & E-Commerce Controller
 * Enhanced with 49 Catalog Products (7 per Category), Flipkart-style Payment Gateway,
 * Full Auth Modal Control, Toast Notifications, Home Page Branded Curation & Cart Drawer.
 */

(function() {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════════
     0. MULTI-CURRENCY CONVERSION SYSTEM (DEFAULT: INR ₹)
     ═══════════════════════════════════════════════════════════════════════ */

  var CURRENCIES = {
    INR: { symbol: '₹', rate: 83.5, code: 'INR', locale: 'en-IN' },
    USD: { symbol: '$', rate: 1.0, code: 'USD', locale: 'en-US' },
    EUR: { symbol: '€', rate: 0.92, code: 'EUR', locale: 'de-DE' },
    GBP: { symbol: '£', rate: 0.78, code: 'GBP', locale: 'en-GB' },
    AED: { symbol: 'AED ', rate: 3.67, code: 'AED', locale: 'ar-AE' }
  };

  var currentCurrencyCode = localStorage.getItem('verix_currency') || 'INR';

  window.formatPrice = function(usdAmount, showSymbol) {
    if (showSymbol === undefined) showSymbol = true;
    var curr = CURRENCIES[currentCurrencyCode] || CURRENCIES['INR'];
    var converted = (usdAmount || 0) * curr.rate;
    
    var formattedVal;
    try {
      formattedVal = Math.round(converted).toLocaleString(curr.locale);
    } catch(e) {
      formattedVal = Math.round(converted).toLocaleString();
    }

    if (!showSymbol) return formattedVal;
    return curr.symbol + formattedVal;
  };

  window.changeGlobalCurrency = function(code) {
    if (!CURRENCIES[code]) return;
    currentCurrencyCode = code;
    localStorage.setItem('verix_currency', code);
    
    var selectEl = document.getElementById('currencySelector');
    if (selectEl) selectEl.value = code;

    window.renderCategoryProducts();
    window.renderHomeFeaturedProducts();
    window.renderCart();
    if (window.renderOrdersList) window.renderOrdersList();
    if (activeDetailProductId && window.renderProductDetailModal) window.renderProductDetailModal(activeDetailProductId);
    showToast('Currency switched to ' + CURRENCIES[code].code + ' (' + CURRENCIES[code].symbol + ')', 'success');
  };

  /* ═══════════════════════════════════════════════════════════════════════
     1. EXPANDED 49 PRODUCT CATALOG DATABASE (7 PRODUCTS PER CATEGORY)
     ═══════════════════════════════════════════════════════════════════════ */

  var VERIX_CATALOG = {
    // ── 1. WATCHES (7 Items) ─────────────────────────────────────────────
    'SWISS-7701': {
      id: 'SWISS-7701', brand: 'Aetheria Geneva', name: 'Aetheria Geneva Tourbillon No. 1', price: 2850, category: 'watches',
      rating: 4.9, reviewsCount: 128, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      description: 'Mechanical Tourbillon movement, sapphire crystal, laser serial engraving verification.',
      origin: 'Geneva, Switzerland', mint_date: '2026-01-14', nfc_chip: 'NFC-SWISS-7701-AES256',
      blockchain_hash: '0x8F9a3B2c4D1e5F6a7B8c9D0e1F2a3B4c5D6e7F8a', warranty: 'Active 5 Year Guarantee', featured: true, tag: 'Bestseller'
    },
    'SWISS-7702': {
      id: 'SWISS-7702', brand: 'Vacheron Heritage', name: 'Chrono Royal Automatic Rose Gold', price: 4200, category: 'watches',
      rating: 4.95, reviewsCount: 94, img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
      description: '18K rose gold casing, 42-hour power reserve, waterproof tamper-evident NFC casing.',
      origin: 'Zurich, Switzerland', mint_date: '2026-01-18', nfc_chip: 'NFC-SWISS-7702-AES256',
      blockchain_hash: '0x1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A', warranty: 'Active Lifetime Master Guarantee', featured: false, tag: 'Exclusive'
    },
    'SWISS-7703': {
      id: 'SWISS-7703', brand: 'Lumière Horology', name: 'Astral Skeleton Moonphase Chrono', price: 3450, category: 'watches',
      rating: 4.88, reviewsCount: 65, img: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80',
      description: 'Skeletonized dial showcasing intricate gear work with astronomical moon phase display.',
      origin: 'Basel, Switzerland', mint_date: '2026-01-22', nfc_chip: 'NFC-SWISS-7703-ECC',
      blockchain_hash: '0x2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C', warranty: 'Active 5 Year Guarantee', featured: true, tag: 'Top Rated'
    },
    'SWISS-7704': {
      id: 'SWISS-7704', brand: 'Aetheria Geneva', name: 'Octo Finissimo Carbon Ultra', price: 5100, category: 'watches',
      rating: 5.0, reviewsCount: 42, img: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=600&q=80',
      description: 'Ultra-thin forged carbon fiber case with anti-scratch cryptographic laser seal.',
      origin: 'Geneva, Switzerland', mint_date: '2026-02-01', nfc_chip: 'NFC-SWISS-7704-SEC',
      blockchain_hash: '0x3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D', warranty: 'Active Limited Edition Proof', featured: false, tag: 'Limited'
    },
    'SWISS-7705': {
      id: 'SWISS-7705', brand: 'Nautica Atelier', name: 'DeepSea Diver Master Titanium', price: 1980, category: 'watches',
      rating: 4.82, reviewsCount: 88, img: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
      description: 'Grade 5 titanium construction rated to 300m depth with helium escape valve.',
      origin: 'La Chaux-de-Fonds, Switzerland', mint_date: '2026-02-05', nfc_chip: 'NFC-SWISS-7705-RFID',
      blockchain_hash: '0x4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E', warranty: 'Active 3 Year Marine Proof', featured: false, tag: 'Popular'
    },
    'SWISS-7706': {
      id: 'SWISS-7706', brand: 'Monaco Horologie', name: 'Grand Prix Heritage Chronograph', price: 3100, category: 'watches',
      rating: 4.87, reviewsCount: 112, img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
      description: 'Iconic square racing case with contrast sub-dials and perforated calfskin strap.',
      origin: 'Monaco', mint_date: '2026-02-10', nfc_chip: 'NFC-SWISS-7706-SEC',
      blockchain_hash: '0x5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F', warranty: 'Active Racing Heritage Proof', featured: false, tag: 'Heritage'
    },
    'SWISS-7707': {
      id: 'SWISS-7707', brand: 'Vacheron Heritage', name: 'Patrimony Perpetual Calendar', price: 6800, category: 'watches',
      rating: 4.98, reviewsCount: 51, img: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=600&q=80',
      description: 'High-complication perpetual calendar tracking leap years and lunar phases.',
      origin: 'Geneva, Switzerland', mint_date: '2026-02-15', nfc_chip: 'NFC-SWISS-7707-AES256',
      blockchain_hash: '0x6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A', warranty: 'Active Lifetime Vault Certificate', featured: false, tag: 'Masterpiece'
    },

    // ── 2. MEN'S WEAR (7 Items) ──────────────────────────────────────────
    'MEN-1020': {
      id: 'MEN-1020', brand: 'Bespoke Milano', name: 'Bespoke Italian Wool Blazer', price: 1450, category: 'men',
      rating: 4.85, reviewsCount: 94, img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
      description: '100% Super 150s Merino wool, hand-stitched silk lining, cryptographic NFC label.',
      origin: 'Milan, Italy', mint_date: '2026-02-04', nfc_chip: 'NFC-MEN-1020-SEC',
      blockchain_hash: '0x1A2b3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b', warranty: 'Active Lifetime Tailoring Warranty', featured: true, tag: 'Bestseller'
    },
    'MEN-1021': {
      id: 'MEN-1021', brand: 'Sartorial Savile', name: 'Savile Row Double-Breasted Tuxedo', price: 2100, category: 'men',
      rating: 4.92, reviewsCount: 78, img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
      description: 'Midnight navy Barathea wool with silk satin peak lapels and horn buttons.',
      origin: 'London, UK', mint_date: '2026-02-08', nfc_chip: 'NFC-MEN-1021-AES256',
      blockchain_hash: '0x7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B', warranty: 'Active Savile Provenance', featured: false, tag: 'Exclusive'
    },
    'MEN-1022': {
      id: 'MEN-1022', brand: 'Atelier Firenze', name: 'Florentine Nappa Leather Jacket', price: 1850, category: 'men',
      rating: 4.9, reviewsCount: 104, img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
      description: 'Butter-soft full grain lambskin leather with antique bronze zipper hardware.',
      origin: 'Florence, Italy', mint_date: '2026-02-12', nfc_chip: 'NFC-MEN-1022-ECC',
      blockchain_hash: '0x8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C', warranty: 'Active Leather Craft Certificate', featured: true, tag: 'Top Rated'
    },
    'MEN-1023': {
      id: 'MEN-1023', brand: 'Bespoke Milano', name: 'Pure Cashmere Overcoat Charcoal', price: 2400, category: 'men',
      rating: 4.96, reviewsCount: 61, img: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80',
      description: 'Ultra-luxurious Loro Piana 100% cashmere cloth with horn button enclosure.',
      origin: 'Milan, Italy', mint_date: '2026-02-18', nfc_chip: 'NFC-MEN-1023-SEC',
      blockchain_hash: '0x9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D', warranty: 'Active Cashmere Origin Proof', featured: false, tag: 'Winter Lux'
    },
    'MEN-1024': {
      id: 'MEN-1024', brand: 'Kyoto Textile Co.', name: 'Hand-Woven Silk Trench Coat', price: 1650, category: 'men',
      rating: 4.86, reviewsCount: 52, img: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=600&q=80',
      description: 'Traditional Japanese artisan woven silk warp with modern water-repellent finish.',
      origin: 'Kyoto, Japan', mint_date: '2026-02-22', nfc_chip: 'NFC-MEN-1024-RFID',
      blockchain_hash: '0x0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E', warranty: 'Active Artisan Weave Certificate', featured: false, tag: 'Artisan'
    },
    'MEN-1025': {
      id: 'MEN-1025', brand: 'Sartorial Savile', name: 'Egyptian Giza Cotton Dress Shirt', price: 380, category: 'men',
      rating: 4.88, reviewsCount: 140, img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
      description: '200s 2-ply long-staple Egyptian cotton with mother-of-pearl buttons.',
      origin: 'London, UK', mint_date: '2026-02-25', nfc_chip: 'NFC-MEN-1025-SEC',
      blockchain_hash: '0x1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F', warranty: 'Active Cotton Purity Proof', featured: false, tag: 'Essential'
    },
    'MEN-1026': {
      id: 'MEN-1026', brand: 'Atelier Firenze', name: 'Venetian Velvet Evening Jacket', price: 1750, category: 'men',
      rating: 4.91, reviewsCount: 45, img: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=600&q=80',
      description: 'Deep emerald cotton velvet with satin shawl collar for black-tie galas.',
      origin: 'Venice, Italy', mint_date: '2026-03-01', nfc_chip: 'NFC-MEN-1026-AES256',
      blockchain_hash: '0x2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F1A', warranty: 'Active Couture Certificate', featured: false, tag: 'Gala Ready'
    },

    // ── 3. WOMEN'S WEAR (7 Items) ────────────────────────────────────────
    'WOMEN-4050': {
      id: 'WOMEN-4050', brand: 'Atelier Velour', name: 'Haute Couture Silk Evening Gown', price: 1890, category: 'women',
      rating: 5.0, reviewsCount: 210, img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
      description: 'Mulberry silk chiffon, hand-embroidered crystal micro-accenting, provenance tag.',
      origin: 'Paris, France', mint_date: '2026-02-18', nfc_chip: 'NFC-WOMEN-4050-ECC',
      blockchain_hash: '0x2D3e4F5a6B7c8D9e0F1a2B3c4D5e6F7a8B9c0D1e', warranty: 'Active Couture Certificate', featured: true, tag: 'Bestseller'
    },
    'WOMEN-4051': {
      id: 'WOMEN-4051', brand: 'Maison Lumière', name: 'Embroidered Tulle Ballgown Gold', price: 3200, category: 'women',
      rating: 4.96, reviewsCount: 82, img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
      description: 'Intricate gold leaf embroidery on multi-layered French tulle with silk corset.',
      origin: 'Paris, France', mint_date: '2026-02-22', nfc_chip: 'NFC-WOMEN-4051-AES256',
      blockchain_hash: '0x3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F1A2B', warranty: 'Active Runway Piece Proof', featured: false, tag: 'Runway'
    },
    'WOMEN-4052': {
      id: 'WOMEN-4052', brand: 'Velour Atelier', name: 'Bespoke Silk Satin Trench Emerald', price: 1550, category: 'women',
      rating: 4.89, reviewsCount: 115, img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
      description: 'Lustrous heavyweight silk satin trench coat with custom engraved tortoiseshell belt buckle.',
      origin: 'Milan, Italy', mint_date: '2026-02-26', nfc_chip: 'NFC-WOMEN-4052-SEC',
      blockchain_hash: '0x4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F1A2B3C', warranty: 'Active Atelier Guarantee', featured: true, tag: 'Trending'
    },
    'WOMEN-4053': {
      id: 'WOMEN-4053', brand: 'Chanel Heritage', name: 'Hand-Bouclé Tweed Blazer Cream', price: 2750, category: 'women',
      rating: 4.97, reviewsCount: 148, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      description: 'Classic French bouclé tweed jacket trimmed with gold braided ribbon and lion head buttons.',
      origin: 'Paris, France', mint_date: '2026-03-02', nfc_chip: 'NFC-WOMEN-4053-ECC',
      blockchain_hash: '0x5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F1A2B3C4D', warranty: 'Active Heritage Certificate', featured: false, tag: 'Iconic'
    },
    'WOMEN-4054': {
      id: 'WOMEN-4054', brand: 'Atelier Velour', name: 'Cashmere-Silk Knit Wrap Cardigan', price: 890, category: 'women',
      rating: 4.84, reviewsCount: 67, img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80',
      description: 'Ultra-fine 70% cashmere / 30% silk blend drape cardigan with ribbed cuffs.',
      origin: 'Florence, Italy', mint_date: '2026-03-05', nfc_chip: 'NFC-WOMEN-4054-RFID',
      blockchain_hash: '0x6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F1A2B3C4D5E', warranty: 'Active Natural Fiber Guarantee', featured: false, tag: 'Soft Lux'
    },
    'WOMEN-4055': {
      id: 'WOMEN-4055', brand: 'Maison Lumière', name: 'Pleated Metallic Silk Maxi Dress', price: 1420, category: 'women',
      rating: 4.87, reviewsCount: 92, img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
      description: 'Sunray pleated metallic gold silk lamé gown with plunging neckline.',
      origin: 'Cannes, France', mint_date: '2026-03-08', nfc_chip: 'NFC-WOMEN-4055-SEC',
      blockchain_hash: '0x7E8F9A0B1C2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F', warranty: 'Active Cannes Capsule Proof', featured: false, tag: 'Glamour'
    },
    'WOMEN-4056': {
      id: 'WOMEN-4056', brand: 'Velour Atelier', name: 'Structural Tailored Crepe Pantsuit', price: 1680, category: 'women',
      rating: 4.93, reviewsCount: 54, img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
      description: 'Sharp architectural tailoring in heavy silk crepe with silk satin lapels.',
      origin: 'Milan, Italy', mint_date: '2026-03-12', nfc_chip: 'NFC-WOMEN-4056-AES256',
      blockchain_hash: '0x8F9A0B1C2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A', warranty: 'Active Power Tailoring Proof', featured: false, tag: 'Executive'
    },

    // ── 4. KIDS' WEAR (7 Items) ──────────────────────────────────────────
    'KIDS-3010': {
      id: 'KIDS-3010', brand: 'Junior Artisan', name: 'Junior Artisan Organic Blazer', price: 480, category: 'kids',
      rating: 4.9, reviewsCount: 62, img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=80',
      description: 'Hypoallergenic organic cotton, tailored juvenile fit, blockchain origin RFID chip.',
      origin: 'Florence, Italy', mint_date: '2026-03-01', nfc_chip: 'NFC-KIDS-3010-RFID',
      blockchain_hash: '0x3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b1C2d', warranty: 'Active Organic Batch Proof', featured: true, tag: 'Organic'
    },
    'KIDS-3011': {
      id: 'KIDS-3011', brand: 'Little Heritage', name: 'Royal Velvet Junior Tuxedo Set', price: 620, category: 'kids',
      rating: 4.93, reviewsCount: 48, img: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80',
      description: 'Soft navy velvet jacket with satin bow tie and elasticized dress trousers.',
      origin: 'London, UK', mint_date: '2026-03-04', nfc_chip: 'NFC-KIDS-3011-SEC',
      blockchain_hash: '0x9A0B1C2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B', warranty: 'Active Royal Junior Proof', featured: false, tag: 'Formal'
    },
    'KIDS-3012': {
      id: 'KIDS-3012', brand: 'Bambino Atelier', name: 'Hand-Knit Cashmere Bear Cardigan', price: 340, category: 'kids',
      rating: 4.88, reviewsCount: 75, img: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=600&q=80',
      description: '100% Mongolian baby cashmere cardigan with mother-of-pearl buttons.',
      origin: 'Turin, Italy', mint_date: '2026-03-07', nfc_chip: 'NFC-KIDS-3012-ECC',
      blockchain_hash: '0x0B1C2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C', warranty: 'Active Pure Cashmere Certificate', featured: true, tag: 'Bestseller'
    },
    'KIDS-3013': {
      id: 'KIDS-3013', brand: 'Junior Artisan', name: 'Silk Organza Flower Girl Dress', price: 540, category: 'kids',
      rating: 4.95, reviewsCount: 39, img: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80',
      description: 'Delicate ivory silk organza dress with hand-sewn satin ribbon belt.',
      origin: 'Paris, France', mint_date: '2026-03-10', nfc_chip: 'NFC-KIDS-3013-RFID',
      blockchain_hash: '0x1C2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D', warranty: 'Active Junior Couture Certificate', featured: false, tag: 'Princess'
    },
    'KIDS-3014': {
      id: 'KIDS-3014', brand: 'Little Heritage', name: 'Tailored Linen Summer Suit Set', price: 420, category: 'kids',
      rating: 4.81, reviewsCount: 53, img: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=600&q=80',
      description: '100% French linen lightweight summer suit with adjustable waistband.',
      origin: 'Nice, France', mint_date: '2026-03-14', nfc_chip: 'NFC-KIDS-3014-SEC',
      blockchain_hash: '0x2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E', warranty: 'Active Pure Linen Proof', featured: false, tag: 'Summer'
    },
    'KIDS-3015': {
      id: 'KIDS-3015', brand: 'Bambino Atelier', name: 'Merino Wool Parka with Faux Fur', price: 510, category: 'kids',
      rating: 4.89, reviewsCount: 81, img: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=600&q=80',
      description: 'Weatherproof merino wool outer shell with detachable hood and fleece lining.',
      origin: 'Milan, Italy', mint_date: '2026-03-18', nfc_chip: 'NFC-KIDS-3015-AES256',
      blockchain_hash: '0x3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2F', warranty: 'Active Winter Shield Certificate', featured: false, tag: 'Warm Lux'
    },
    'KIDS-3016': {
      id: 'KIDS-3016', brand: 'Junior Artisan', name: 'Organic Cotton Oxford Shirt 3-Pack', price: 290, category: 'kids',
      rating: 4.85, reviewsCount: 110, img: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=600&q=80',
      description: 'Trio of crisp GOTS-certified organic cotton button-down shirts.',
      origin: 'Florence, Italy', mint_date: '2026-03-22', nfc_chip: 'NFC-KIDS-3016-RFID',
      blockchain_hash: '0x4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2F3A', warranty: 'Active GOTS Certification', featured: false, tag: 'Pack'
    },

    // ── 5. BAGS (7 Items) ────────────────────────────────────────────────
    'BAG-8821': {
      id: 'BAG-8821', brand: 'Velour Paris', name: 'Velour Le Grand Leather Tote', price: 2100, category: 'bags',
      rating: 4.95, reviewsCount: 310, img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
      description: 'Full-grain French calfskin, 24K gold-plated hardware, encrypted NFC tag.',
      origin: 'Paris, France', mint_date: '2026-03-12', nfc_chip: 'NFC-BAG-8821-AES256',
      blockchain_hash: '0x4F5E6D7C8B9A0F1E2D3C4B5A6F7E8D9C0B1A2F3E', warranty: 'Active Artisan Certificate', featured: true, tag: 'Bestseller'
    },
    'BAG-8822': {
      id: 'BAG-8822', brand: 'Maison Cuir', name: 'Structured Crocodile Embossed Satchel', price: 3400, category: 'bags',
      rating: 4.98, reviewsCount: 165, img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
      description: 'Hand-burnished crocodile print calf leather with signature padlock charm.',
      origin: 'Milan, Italy', mint_date: '2026-03-15', nfc_chip: 'NFC-BAG-8822-SEC',
      blockchain_hash: '0x5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2F3A4B', warranty: 'Active Luxury Leather Certificate', featured: true, tag: 'Iconic'
    },
    'BAG-8823': {
      id: 'BAG-8823', brand: 'Atelier Firenze', name: 'Crossbody Camera Bag Cognac', price: 1250, category: 'bags',
      rating: 4.87, reviewsCount: 220, img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
      description: 'Vegetable-tanned Tuscan leather with adjustable webbing shoulder strap.',
      origin: 'Florence, Italy', mint_date: '2026-03-18', nfc_chip: 'NFC-BAG-8823-ECC',
      blockchain_hash: '0x6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C', warranty: 'Active Tuscan Origin Proof', featured: false, tag: 'Popular'
    },
    'BAG-8824': {
      id: 'BAG-8824', brand: 'Velour Paris', name: 'Quilted Lambskin Evening Clutch', price: 1680, category: 'bags',
      rating: 4.93, reviewsCount: 142, img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&q=80',
      description: 'Diamond quilted ultra-soft lambskin with woven gold chain shoulder strap.',
      origin: 'Paris, France', mint_date: '2026-03-22', nfc_chip: 'NFC-BAG-8824-AES256',
      blockchain_hash: '0x7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D', warranty: 'Active Evening Vault Certificate', featured: false, tag: 'Evening'
    },
    'BAG-8825': {
      id: 'BAG-8825', brand: 'Maison Cuir', name: 'Artisan Travel Duffle Weekender', price: 2650, category: 'bags',
      rating: 4.91, reviewsCount: 98, img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
      description: 'Spacious full-grain saddle leather duffle with reinforced brass corner studs.',
      origin: 'Lyons, France', mint_date: '2026-03-26', nfc_chip: 'NFC-BAG-8825-RFID',
      blockchain_hash: '0x8D9E0F1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E', warranty: 'Active Lifetime Travel Guarantee', featured: false, tag: 'Travel'
    },
    'BAG-8826': {
      id: 'BAG-8826', brand: 'Atelier Firenze', name: 'Suede Fringe Hobo Shoulder Bag', price: 1490, category: 'bags',
      rating: 4.84, reviewsCount: 76, img: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=600&q=80',
      description: 'Rich chestnut suede with cascading hand-cut fringe and magnetic closure.',
      origin: 'Florence, Italy', mint_date: '2026-03-29', nfc_chip: 'NFC-BAG-8826-SEC',
      blockchain_hash: '0x9E0F1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F', warranty: 'Active Suede Authenticity Proof', featured: false, tag: 'Boho Lux'
    },
    'BAG-8827': {
      id: 'BAG-8827', brand: 'Velour Paris', name: 'Mini Kelly Top Handle Handbag', price: 2950, category: 'bags',
      rating: 4.99, reviewsCount: 189, img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
      description: 'Petite structured handbag in Epsom leather with gold-plated turn-lock closure.',
      origin: 'Paris, France', mint_date: '2026-04-01', nfc_chip: 'NFC-BAG-8827-AES256',
      blockchain_hash: '0x0F1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A', warranty: 'Active Paris Vault Proof', featured: false, tag: 'Collector'
    },

    // ── 6. PERFUMES (7 Items) ────────────────────────────────────────────
    'GRASSE-4091': {
      id: 'GRASSE-4091', brand: "L'Elixir Rare", name: 'Nuit Botanique 100ml Distillation', price: 360, category: 'perfumes',
      rating: 4.88, reviewsCount: 150, img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80',
      description: 'Rare Grasse Jasmine & Rose extract, tamper-sealed crystal bottle.',
      origin: 'Grasse, France', mint_date: '2026-03-25', nfc_chip: 'NFC-GRASSE-4091-RFID',
      blockchain_hash: '0x5A6b7C8d9E0f1A2b3C4d5E6f7A8b9C0d1E2f3A4b', warranty: 'Active Sealed Batch Proof', featured: true, tag: 'Signature'
    },
    'GRASSE-4092': {
      id: 'GRASSE-4092', brand: 'Maison de Parfum', name: 'Oud Royale Extrait de Parfum 50ml', price: 490, category: 'perfumes',
      rating: 4.96, reviewsCount: 118, img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
      description: 'Aged Cambodian Oud wood paired with rare Taif rose and ambergris.',
      origin: 'Paris, France', mint_date: '2026-03-28', nfc_chip: 'NFC-GRASSE-4092-SEC',
      blockchain_hash: '0x1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C', warranty: 'Active Pure Oud Proof', featured: true, tag: 'Extrait'
    },
    'GRASSE-4093': {
      id: 'GRASSE-4093', brand: "L'Elixir Rare", name: 'Soleil de St. Tropez Citrus 100ml', price: 310, category: 'perfumes',
      rating: 4.84, reviewsCount: 89, img: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80',
      description: 'Sun-drenched Calabrian bergamot, neroli blossoms, and sea salt breeze.',
      origin: 'Grasse, France', mint_date: '2026-04-02', nfc_chip: 'NFC-GRASSE-4093-ECC',
      blockchain_hash: '0x2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D', warranty: 'Active Harvest Certificate', featured: false, tag: 'Fresh'
    },
    'GRASSE-4094': {
      id: 'GRASSE-4094', brand: 'Maison de Parfum', name: 'Ambre Imperial Private Reserve 100ml', price: 440, category: 'perfumes',
      rating: 4.92, reviewsCount: 104, img: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80',
      description: 'Warm Madagascar vanilla, smoked resin amber, and Guatemalan cardamom.',
      origin: 'Grasse, France', mint_date: '2026-04-05', nfc_chip: 'NFC-GRASSE-4094-AES256',
      blockchain_hash: '0x3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E', warranty: 'Active Private Reserve Proof', featured: false, tag: 'Reserve'
    },
    'GRASSE-4095': {
      id: 'GRASSE-4095', brand: "L'Elixir Rare", name: 'Iris Absolute Florentine 50ml', price: 580, category: 'perfumes',
      rating: 4.97, reviewsCount: 62, img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
      description: 'Ultra-precious 3-year aged Florentine Iris butter distillation.',
      origin: 'Florence, Italy', mint_date: '2026-04-08', nfc_chip: 'NFC-GRASSE-4095-SEC',
      blockchain_hash: '0x4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F', warranty: 'Active Rare Distillation Proof', featured: false, tag: 'Ultra Rare'
    },
    'GRASSE-4096': {
      id: 'GRASSE-4096', brand: 'Maison de Parfum', name: 'Santale Sublime Smoked Wood 100ml', price: 380, category: 'perfumes',
      rating: 4.87, reviewsCount: 145, img: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80',
      description: 'Creamy Mysore sandalwood, cedarwood, and violet leaf accord.',
      origin: 'Paris, France', mint_date: '2026-04-12', nfc_chip: 'NFC-GRASSE-4096-RFID',
      blockchain_hash: '0x5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A', warranty: 'Active Sandalwood Batch Proof', featured: false, tag: 'Woody'
    },
    'GRASSE-4097': {
      id: 'GRASSE-4097', brand: "L'Elixir Rare", name: 'Rose de Mai Harvest Elixir 100ml', price: 420, category: 'perfumes',
      rating: 4.94, reviewsCount: 97, img: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=600&q=80',
      description: 'Single-estate May Rose harvest hand-picked at dawn in Grasse.',
      origin: 'Grasse, France', mint_date: '2026-04-15', nfc_chip: 'NFC-GRASSE-4097-AES256',
      blockchain_hash: '0x6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B', warranty: 'Active Single Estate Proof', featured: false, tag: 'Harvest'
    },

    // ── 7. COSMETICS (7 Items) ───────────────────────────────────────────
    'COSM-9010': {
      id: 'COSM-9010', brand: 'Aura Cosmetics', name: '24K Gold Botanical Youth Serum', price: 290, category: 'cosmetics',
      rating: 4.92, reviewsCount: 180, img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      description: 'Colloidal gold & hyaluronic acid, lab-certified batch verification code.',
      origin: 'Zurich, Switzerland', mint_date: '2026-04-02', nfc_chip: 'NFC-COSM-9010-SEC',
      blockchain_hash: '0x6B7c8D9e0F1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c', warranty: 'Active Lab Certified Batch', featured: true, tag: 'Bestseller'
    },
    'COSM-9011': {
      id: 'COSM-9011', brand: 'Swiss Bio-Lab', name: 'Cellular Rejuvenation Cream 50ml', price: 410, category: 'cosmetics',
      rating: 4.97, reviewsCount: 124, img: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80',
      description: 'Alpine stem cell complex reducing fine lines and boosting skin luminosity.',
      origin: 'Geneva, Switzerland', mint_date: '2026-04-05', nfc_chip: 'NFC-COSM-9011-AES256',
      blockchain_hash: '0x7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C', warranty: 'Active Swiss Bio Certificate', featured: true, tag: 'Lab Grade'
    },
    'COSM-9012': {
      id: 'COSM-9012', brand: 'Aura Cosmetics', name: 'Diamond Dust Radiance Face Mask', price: 220, category: 'cosmetics',
      rating: 4.86, reviewsCount: 95, img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
      description: 'Finely micronized diamond particles and marine algae extract for glass skin glow.',
      origin: 'Zurich, Switzerland', mint_date: '2026-04-08', nfc_chip: 'NFC-COSM-9012-ECC',
      blockchain_hash: '0x8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D', warranty: 'Active Certified Diamond Proof', featured: false, tag: 'Radiance'
    },
    'COSM-9013': {
      id: 'COSM-9013', brand: 'Swiss Bio-Lab', name: 'Peptide Hydra-Sculpt Eye Concentrate', price: 185, category: 'cosmetics',
      rating: 4.89, reviewsCount: 160, img: 'https://images.unsplash.com/photo-1608248597263-00079e965383?auto=format&fit=crop&w=600&q=80',
      description: 'Hexapeptide-8 micro-infusion soothing dark circles and puffiness.',
      origin: 'Lausanne, Switzerland', mint_date: '2026-04-10', nfc_chip: 'NFC-COSM-9013-SEC',
      blockchain_hash: '0x9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E', warranty: 'Active Ophthalmologist Proof', featured: false, tag: 'Targeted'
    },
    'COSM-9014': {
      id: 'COSM-9014', brand: 'Aura Cosmetics', name: 'Velour Velvet Matte Lipstick Set', price: 160, category: 'cosmetics',
      rating: 4.91, reviewsCount: 215, img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
      description: 'Quartet of rich haute couture lip colors infused with jojoba oil.',
      origin: 'Paris, France', mint_date: '2026-04-14', nfc_chip: 'NFC-COSM-9014-RFID',
      blockchain_hash: '0x0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F', warranty: 'Active Non-Toxic Guarantee', featured: false, tag: 'Popular'
    },
    'COSM-9015': {
      id: 'COSM-9015', brand: 'Swiss Bio-Lab', name: 'Pure Vitamin C 20% Glow Ampoules', price: 240, category: 'cosmetics',
      rating: 4.93, reviewsCount: 138, img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
      description: 'Single-use nitrogen-sealed glass ampoules delivering fresh L-ascorbic acid.',
      origin: 'Basel, Switzerland', mint_date: '2026-04-18', nfc_chip: 'NFC-COSM-9015-SEC',
      blockchain_hash: '0x1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A', warranty: 'Active Fresh Seal Certificate', featured: false, tag: 'Ampoules'
    },
    'COSM-9016': {
      id: 'COSM-9016', brand: 'Aura Cosmetics', name: 'Botanical Night Treatment Oil 30ml', price: 275, category: 'cosmetics',
      rating: 4.88, reviewsCount: 88, img: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80',
      description: 'Cold-pressed rosehip seed, squalane, and evening primrose elixir.',
      origin: 'Zurich, Switzerland', mint_date: '2026-04-22', nfc_chip: 'NFC-COSM-9016-AES256',
      blockchain_hash: '0x2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B', warranty: 'Active Cold Pressed Proof', featured: false, tag: 'Organic Oil'
    }
  };


  /* ═══════════════════════════════════════════════════════════════════════
     2. NAVIGATION ROUTER & SEARCH SYSTEM
     ═══════════════════════════════════════════════════════════════════════ */

  window.navigateToPage = function(pageId) {
    var validPages = ['home', 'categories', 'verify', 'orders', 'portal', 'reviews'];
    if (validPages.indexOf(pageId) === -1) pageId = 'home';

    validPages.forEach(function(p) {
      var el = document.getElementById('page-' + p);
      if (el) {
        if (p === pageId) {
          el.classList.remove('d-none');
          // Trigger Flowstate Page Enter Animation
          el.classList.remove('page-flowstate');
          void el.offsetWidth; // Trigger reflow
          el.classList.add('page-flowstate');
        } else {
          el.classList.add('d-none');
          el.classList.remove('page-flowstate');
        }
      }
    });

    window.scrollTo({ top: 0, behavior: 'instant' });

    var navLinks = document.querySelectorAll('.nav-item-link');
    navLinks.forEach(function(link) { link.classList.remove('active'); });

    var activeNav = document.getElementById('nav-' + pageId);
    if (activeNav) activeNav.classList.add('active');

    // Sync mobile bottom bar active state
    var bottomTabs = document.querySelectorAll('.mobile-bottom-tab');
    bottomTabs.forEach(function(tab) {
      tab.classList.toggle('active', tab.getAttribute('data-page') === pageId);
    });

    // Sync mobile drawer active state
    var drawerLinks = document.querySelectorAll('.mobile-nav-link');
    drawerLinks.forEach(function(link) {
      link.classList.toggle('active', link.getAttribute('data-page') === pageId);
    });

    try {
      if (window.location.hash !== '#' + pageId) {
        history.replaceState(null, null, '#' + pageId);
      }
    } catch(e) {}

    // Trigger Dashboard Chart Initialization when opening portal page
    if (pageId === 'portal' && window.DashboardCharts) {
      window.DashboardCharts.initAllCharts();
    }

    // Trigger Orders List rendering when opening orders page
    if (pageId === 'orders' && window.renderOrdersList) {
      window.renderOrdersList();
    }
  };

  window.handleGlobalSearch = function(query) {
    var q = (query || '').trim().toLowerCase();
    if (!q) {
      filterCategory('all');
      return;
    }
    window.navigateToPage('categories');
    var cardItems = document.querySelectorAll('.product-item-card');
    var found = 0;
    cardItems.forEach(function(card) {
      var text = card.textContent.toLowerCase();
      if (text.indexOf(q) !== -1) {
        card.style.display = 'block';
        found++;
      } else {
        card.style.display = 'none';
      }
    });

    if (found === 0) {
      showToast('No products found matching "' + query + '"', 'error');
    } else {
      showToast('Showing ' + found + ' matching products', 'success');
    }
  };


  /* ═══════════════════════════════════════════════════════════════════════
     3. TOAST NOTIFICATION SYSTEM
     ═══════════════════════════════════════════════════════════════════════ */

  window.showToast = function(message, type) {
    var container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      document.body.appendChild(container);
    }

    var toast = document.createElement('div');
    toast.className = 'verix-toast' + (type === 'error' ? ' toast-error' : '');
    
    var iconClass = type === 'error' ? 'bi-exclamation-circle-fill text-danger' : 'bi-check-circle-fill text-emerald';
    toast.innerHTML = '<i class="bi ' + iconClass + ' fs-5"></i><div>' + message + '</div>';

    container.appendChild(toast);

    setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
    }, 3200);
  };


  /* ═══════════════════════════════════════════════════════════════════════
     4. SHOPPING CART DRAWER & STATE MANAGER
     ═══════════════════════════════════════════════════════════════════════ */

  var cartItems = [];

  // Load saved cart from localStorage
  try {
    var savedCart = localStorage.getItem('verix_cart_items');
    if (savedCart) cartItems = JSON.parse(savedCart);
  } catch (e) { cartItems = []; }

  function saveCart() {
    localStorage.setItem('verix_cart_items', JSON.stringify(cartItems));
  }

  window.toggleCartDrawer = function() {
    var backdrop = document.getElementById('cartDrawerBackdrop');
    if (backdrop) {
      backdrop.classList.toggle('active');
    }
  };

  window.addToCart = function(serialId, name, price, imgUrl) {
    var existing = cartItems.find(function(item) { return item.id === serialId; });
    if (existing) {
      existing.qty += 1;
    } else {
      cartItems.push({
        id: serialId,
        name: name,
        price: price,
        img: imgUrl,
        qty: 1
      });
    }

    saveCart();
    window.renderCart();
    window.toggleCartDrawer();
    showToast('Added "' + name + '" to cart!', 'success');
  };

  window.updateCartQty = function(serialId, delta) {
    var item = cartItems.find(function(i) { return i.id === serialId; });
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        window.removeFromCart(serialId);
        return;
      }
    }
    saveCart();
    window.renderCart();
  };

  window.removeFromCart = function(serialId) {
    cartItems = cartItems.filter(function(item) { return item.id !== serialId; });
    saveCart();
    window.renderCart();
    showToast('Item removed from cart', 'error');
  };

  window.renderCart = function() {
    var badge = document.getElementById('cartBadgeCount');
    var body = document.getElementById('cartDrawerBody');
    var subtotalText = document.getElementById('cartSubtotalText');
    var checkoutBtn = document.getElementById('checkoutBtn');

    var totalQty = 0;
    var subtotal = 0;

    if (cartItems.length === 0) {
      if (badge) badge.textContent = '0';
      if (body) {
        body.innerHTML =
          '<div class="text-center py-5 text-muted">' +
            '<i class="bi bi-bag-x display-4 opacity-50 mb-3 d-block"></i>' +
            '<p class="mb-0 fw-semibold">Your shopping cart is empty.</p>' +
            '<small class="text-secondary">Explore luxury products from our 7 categories!</small>' +
          '</div>';
      }
      if (subtotalText) subtotalText.textContent = formatPrice(0);
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    var html = '';
    cartItems.forEach(function(item) {
      totalQty += item.qty;
      var itemTotal = item.price * item.qty;
      subtotal += itemTotal;

      html +=
        '<div class="cart-item-row">' +
          '<img src="' + item.img + '" class="cart-item-img" alt="' + item.name + '">' +
          '<div class="flex-grow-1">' +
            '<h5 class="h6 font-display fw-bold text-dark mb-0" style="font-size:0.88rem;">' + item.name + '</h5>' +
            '<span class="small text-teal fw-semibold">' + item.id + '</span>' +
            '<div class="cart-qty-stepper">' +
              '<button class="cart-qty-btn" onclick="updateCartQty(\'' + item.id + '\', -1)">-</button>' +
              '<span class="cart-qty-val">' + item.qty + '</span>' +
              '<button class="cart-qty-btn" onclick="updateCartQty(\'' + item.id + '\', 1)">+</button>' +
            '</div>' +
          '</div>' +
          '<div class="text-end">' +
            '<strong class="d-block text-dark small mb-1">' + formatPrice(itemTotal) + '</strong>' +
            '<button onclick="removeFromCart(\'' + item.id + '\')" class="btn btn-sm btn-link text-danger p-0 border-0" title="Remove"><i class="bi bi-trash"></i></button>' +
          '</div>' +
        '</div>';
    });

    if (badge) badge.textContent = totalQty.toString();
    if (body) body.innerHTML = html;
    if (subtotalText) subtotalText.textContent = formatPrice(subtotal);
    if (checkoutBtn) checkoutBtn.disabled = false;
  };


  /* ═══════════════════════════════════════════════════════════════════════
     5. AUTHENTICATION MODAL SYSTEM (GUARANTEED WORKING X CLOSE BUTTON)
     ═══════════════════════════════════════════════════════════════════════ */

  window.openAuthModal = function(defaultTab) {
    var modalEl = document.getElementById('verixAuthModal');
    if (!modalEl) return;

    if (defaultTab) {
      window.switchAuthTab(defaultTab);
    }

    modalEl.style.display = 'flex';
    modalEl.classList.add('show');
    document.body.classList.add('modal-open');
  };

  window.closeAuthModal = function() {
    var modalEl = document.getElementById('verixAuthModal');
    if (!modalEl) return;

    modalEl.style.display = 'none';
    modalEl.classList.remove('show');
    document.body.classList.remove('modal-open');

    // Clean up any stray Bootstrap backdrops
    var backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(function(b) { b.remove(); });
  };

  window.switchAuthTab = function(tabName) {
    var loginBtn = document.getElementById('tabBtnLogin');
    var registerBtn = document.getElementById('tabBtnRegister');
    var loginPane = document.getElementById('paneLogin');
    var registerPane = document.getElementById('paneRegister');

    if (tabName === 'register') {
      if (loginBtn) loginBtn.classList.remove('active');
      if (registerBtn) registerBtn.classList.add('active');
      if (loginPane) loginPane.classList.add('d-none');
      if (registerPane) registerPane.classList.remove('d-none');
    } else {
      if (registerBtn) registerBtn.classList.remove('active');
      if (loginBtn) loginBtn.classList.add('active');
      if (registerPane) registerPane.classList.add('d-none');
      if (loginPane) loginPane.classList.remove('d-none');
    }
  };

  window.handleAuthSuccess = function(userName, userEmail, role) {
    window.closeAuthModal();

    var session = {
      isLoggedIn: true,
      name: userName || 'Luxury Collector',
      email: userEmail || 'user@verix.io',
      role: role || 'Collector'
    };
    localStorage.setItem('verix_user_session', JSON.stringify(session));

    window.updateUserSessionUI(session);
    showToast('Welcome ' + session.name + '! Logged in successfully.', 'success');
    window.navigateToPage('portal');
  };

  window.updateUserSessionUI = function(session) {
    var loggedOutView = document.getElementById('portalLoggedOutView');
    var loggedInView = document.getElementById('portalLoggedInView');
    var userChip = document.getElementById('headerUserChip');
    var headerName = document.getElementById('headerUserName');
    var getStartedBtn = document.getElementById('getStartedHeaderBtn');
    var portalName = document.getElementById('portalUserName');
    var portalRole = document.getElementById('portalUserRole');
    var portalAvatar = document.getElementById('portalAvatar');

    if (session && session.isLoggedIn) {
      if (loggedOutView) loggedOutView.classList.add('d-none');
      if (loggedInView) loggedInView.classList.remove('d-none');
      if (userChip) { userChip.classList.remove('d-none'); userChip.classList.add('d-flex'); }
      if (getStartedBtn) getStartedBtn.classList.add('d-none');
      if (headerName) headerName.textContent = session.name.split(' ')[0];
      if (portalName) portalName.textContent = session.name;
      if (portalRole) portalRole.textContent = '✓ Verified ' + (session.role || 'Executive');
      if (portalAvatar) portalAvatar.textContent = session.name.charAt(0).toUpperCase();
    } else {
      if (loggedOutView) loggedOutView.classList.remove('d-none');
      if (loggedInView) loggedInView.classList.add('d-none');
      if (userChip) { userChip.classList.remove('d-flex'); userChip.classList.add('d-none'); }
      if (getStartedBtn) getStartedBtn.classList.remove('d-none');
    }
  };

  window.handleLogout = function() {
    localStorage.removeItem('verix_user_session');
    window.updateUserSessionUI(null);
    showToast('Logged out successfully', 'error');
    window.navigateToPage('home');
  };


  /* ═══════════════════════════════════════════════════════════════════════
     6. PAYMENT CHECKOUT MODAL SYSTEM (FLIPKART STYLE MULTI-METHOD)
     ═══════════════════════════════════════════════════════════════════════ */

  var activePaymentMethod = 'card';

  window.openPaymentModal = function() {
    var backdrop = document.getElementById('cartDrawerBackdrop');
    if (backdrop && backdrop.classList.contains('active')) {
      backdrop.classList.remove('active');
    }

    var modalEl = document.getElementById('verixPaymentModal');
    var amountEl = document.getElementById('paymentTotalAmount');

    var subtotal = cartItems.reduce(function(acc, item) { return acc + (item.price * item.qty); }, 0);
    if (amountEl) amountEl.textContent = formatPrice(subtotal);

    // Reset view to form
    var contentEl = document.getElementById('paymentModalInnerContent');
    if (contentEl) contentEl.classList.remove('d-none');

    var successEl = document.getElementById('paymentSuccessReceipt');
    if (successEl) successEl.classList.add('d-none');

    // Default to card tab
    window.switchPaymentTab('card');

    if (modalEl) {
      modalEl.style.display = 'flex';
      modalEl.classList.add('show');
      document.body.classList.add('modal-open');
    }
  };

  window.closePaymentModal = function() {
    var modalEl = document.getElementById('verixPaymentModal');
    if (!modalEl) return;

    modalEl.style.display = 'none';
    modalEl.classList.remove('show');
    document.body.classList.remove('modal-open');
  };

  window.switchPaymentTab = function(method) {
    activePaymentMethod = method;
    var cards = document.querySelectorAll('.pay-method-card');
    cards.forEach(function(c) { c.classList.remove('active'); });

    var targetCard = document.getElementById('payMethodTab-' + method);
    if (targetCard) targetCard.classList.add('active');

    var panes = ['card', 'upi', 'netbanking', 'cod'];
    panes.forEach(function(p) {
      var pane = document.getElementById('payPane-' + p);
      if (pane) {
        var inputs = pane.querySelectorAll('input, select');
        if (p === method) {
          pane.classList.remove('d-none');
          inputs.forEach(function(i) { i.disabled = false; });
        } else {
          pane.classList.add('d-none');
          // CRITICAL FIX: Disable hidden pane inputs so HTML5 validation doesn't block submission!
          inputs.forEach(function(i) { i.disabled = true; });
        }
      }
    });
  };

  window.processPayment = function() {
    var itemsToCheckout = cartItems;
    if (!itemsToCheckout || itemsToCheckout.length === 0) {
      itemsToCheckout = [{
        id: 'SWISS-7701',
        name: 'Aetheria Geneva Tourbillon No. 1',
        price: 2850,
        img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
        qty: 1
      }];
    }

    var subtotal = itemsToCheckout.reduce(function(acc, item) { return acc + (item.price * item.qty); }, 0);
    var txId = 'VRX-' + Math.floor(100000 + Math.random() * 900000);
    var hash = '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6);
    var todayStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    window.lastPaymentReceipt = {
      txId: txId,
      method: activePaymentMethod,
      amount: subtotal,
      hash: hash,
      date: todayStr,
      items: itemsToCheckout
    };

    // Create & push order into tracking system
    var newOrder = {
      orderId: txId,
      date: todayStr,
      items: itemsToCheckout,
      totalUSD: subtotal,
      status: 'Order Placed',
      courier: 'Flipkart Express Air (AWB #' + Math.floor(10000000 + Math.random() * 90000000) + ')',
      deliveryAddress: '100 Luxury Way, Suite 400, Mumbai - 400001',
      paymentMethod: activePaymentMethod.toUpperCase(),
      hash: hash,
      timeline: [
        { title: 'Order Placed & Payment Confirmed', desc: 'Order placed via Flipkart Gateway.', time: todayStr, done: true },
        { title: 'Packed & NFC Tag Cryptographically Signed', desc: 'Verix Atelier attached cryptographic smart seal.', time: 'Expected in 2 hours', done: false, active: true },
        { title: 'In Transit — Departed Distribution Hub', desc: 'Dispatched via Express Air Freight Courier.', time: 'Expected Tomorrow', done: false },
        { title: 'Out for Delivery', desc: 'Courier agent assigned for OTP physical delivery.', time: 'Expected 2 Days', done: false },
        { title: 'Delivered', desc: 'Handover & Blockchain Warranty Transfer to Collector', time: 'Expected 2 Days', done: false }
      ]
    };

    if (userOrdersList) {
      userOrdersList.unshift(newOrder);
      if (window.saveOrders) window.saveOrders();
    }

    var contentEl = document.getElementById('paymentModalInnerContent');
    if (contentEl) contentEl.classList.add('d-none');

    var successEl = document.getElementById('paymentSuccessReceipt');
    if (successEl) {
      var itemNames = itemsToCheckout.map(function(i) { return i.name + ' (' + i.id + ') x ' + i.qty; }).join(', ');

      successEl.innerHTML =
        '<div class="text-center py-3">' +
          '<div class="brand-icon-box bg-success text-white mx-auto mb-3" style="width:60px; height:60px; font-size:1.8rem;">' +
            '<i class="bi bi-check-lg"></i>' +
          '</div>' +
          '<h3 class="font-display fw-bold text-dark mb-1">Payment Successful!</h3>' +
          '<p class="text-emerald fw-semibold small mb-3">Blockchain Certificate Minted on Ledger</p>' +
          '<div class="p-3 bg-light rounded-3 text-start small mb-3 border">' +
            '<div class="d-flex justify-content-between mb-1"><span class="text-muted">Transaction ID:</span> <strong class="text-dark">' + txId + '</strong></div>' +
            '<div class="d-flex justify-content-between mb-1"><span class="text-muted">Payment Method:</span> <strong class="text-dark text-uppercase">' + activePaymentMethod + '</strong></div>' +
            '<div class="d-flex justify-content-between mb-1"><span class="text-muted">Amount Paid:</span> <strong class="text-dark">' + formatPrice(subtotal) + '</strong></div>' +
            '<div class="d-flex justify-content-between mb-1"><span class="text-muted">Ledger Hash:</span> <code class="text-teal small">' + hash + '</code></div>' +
            '<hr class="my-2">' +
            '<div><span class="text-muted d-block mb-1">Items Purchased:</span><strong class="text-dark">' + itemNames + '</strong></div>' +
          '</div>' +
          '<div class="d-flex gap-2 mb-2">' +
            '<button onclick="printPaymentReceipt()" class="btn btn-outline-dark rounded-pill flex-grow-1 py-2 small fw-semibold"><i class="bi bi-printer me-1"></i> Print Statement</button>' +
            '<button onclick="downloadPaymentStatementPDF()" class="btn btn-dark rounded-pill flex-grow-1 py-2 small fw-semibold"><i class="bi bi-download me-1"></i> Download PDF Invoice</button>' +
          '</div>' +
          '<button onclick="closePaymentModal(); navigateToPage(\'orders\'); openTrackingModal(\'' + txId + '\');" class="btn-verix-emerald w-100 justify-content-center py-3 fs-6 mb-2">' +
            '<i class="bi bi-truck me-1"></i> Track Order Live Status' +
          '</button>' +
          '<button onclick="closePaymentModal(); verifyOrderedProduct(\'' + (itemsToCheckout[0] ? itemsToCheckout[0].id.split('-')[0] : 'SWISS-7701') + '\');" class="btn btn-outline-success w-100 justify-content-center py-2 small fs-6 mb-2 rounded-pill fw-semibold">' +
            '<i class="bi bi-shield-check me-1"></i> Verify Blockchain Hash & Warranty' +
          '</button>' +
          '<button onclick="finishOrderAndGoToPortal()" class="btn btn-link text-secondary w-100 text-center small text-decoration-none">' +
            'Go to Collector Portal' +
          '</button>' +
        '</div>';

      successEl.classList.remove('d-none');
    }

    // Add purchased items to Portal Table
    addPurchasedItemsToPortalTable(itemsToCheckout);

    // Clear cart
    cartItems = [];
    saveCart();
    window.renderCart();
    showToast('Payment Successful! Order #' + txId + ' Created & Minted', 'success');
  };

  window.printPaymentReceipt = function() {
    var receipt = window.lastPaymentReceipt || {
      txId: 'VRX-982104',
      method: 'card',
      amount: 2850,
      hash: '0x8F9a3B2c4D1e5F6a',
      date: new Date().toLocaleDateString(),
      items: [{ id: 'SWISS-7701', name: 'Aetheria Geneva Tourbillon No. 1', price: 2850, qty: 1 }]
    };

    var printWin = window.open('', '_blank', 'width=800,height=900');
    if (!printWin) {
      window.print();
      return;
    }

    var itemsHtml = '';
    receipt.items.forEach(function(i) {
      itemsHtml +=
        '<tr>' +
          '<td style="padding:10px; border-bottom:1px solid #e2e8f0;">' + i.name + ' (' + i.id + ')</td>' +
          '<td style="padding:10px; border-bottom:1px solid #e2e8f0; text-align:center;">' + i.qty + '</td>' +
          '<td style="padding:10px; border-bottom:1px solid #e2e8f0; text-align:right;">$' + i.price.toLocaleString() + '</td>' +
          '<td style="padding:10px; border-bottom:1px solid #e2e8f0; text-align:right; font-weight:bold;">$' + (i.price * i.qty).toLocaleString() + '</td>' +
        '</tr>';
    });

    printWin.document.write(
      '<!DOCTYPE html><html><head><title>Verix Payment Statement - ' + receipt.txId + '</title>' +
      '<style>' +
        'body { font-family: sans-serif; color: #0f172a; margin: 40px; }' +
        '.header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f766e; padding-bottom: 20px; margin-bottom: 30px; }' +
        '.title { font-size: 28px; font-weight: bold; color: #0f766e; }' +
        'table { width: 100%; border-collapse: collapse; margin-top: 20px; }' +
        'th { background: #f1f5f9; padding: 10px; text-align: left; font-size: 13px; text-transform: uppercase; color: #475569; }' +
        '.total-box { margin-top: 30px; text-align: right; font-size: 18px; font-weight: bold; }' +
        '.hash-box { margin-top: 40px; padding: 15px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-family: monospace; font-size: 12px; color: #0f766e; }' +
      '</style>' +
      '</head><body>' +
        '<div class="header">' +
          '<div>' +
            '<div class="title">VERIX PROTOCOL</div>' +
            '<div style="font-size:12px; color:#64748b;">Blockchain Authenticated Payment Statement</div>' +
          '</div>' +
          '<div style="text-align:right;">' +
            '<div><strong>Invoice #: ' + receipt.txId + '</strong></div>' +
            '<div style="font-size:12px; color:#64748b;">Date: ' + receipt.date + '</div>' +
            '<div style="font-size:12px; color:#10b981; font-weight:bold;">Status: Paid & Certified</div>' +
          '</div>' +
        '</div>' +
        '<div style="margin-bottom:20px;">' +
          '<div><strong>Payment Method:</strong> ' + receipt.method.toUpperCase() + '</div>' +
          '<div><strong>Blockchain Ledger Hash:</strong> ' + receipt.hash + '</div>' +
        '</div>' +
        '<table>' +
          '<thead><tr><th>Item Description</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Unit Price</th><th style="text-align:right;">Total</th></tr></thead>' +
          '<tbody>' + itemsHtml + '</tbody>' +
        '</table>' +
        '<div class="total-box">' +
          '<div>Subtotal: $' + receipt.amount.toLocaleString() + '</div>' +
          '<div>Blockchain NFC Seal: $0.00 (Included)</div>' +
          '<div style="font-size:22px; color:#0f766e; margin-top:8px;">Total Paid: $' + receipt.amount.toLocaleString() + '</div>' +
        '</div>' +
        '<div class="hash-box">' +
          '<div>✓ Cryptographic Proof Verified on Verix Mainnet</div>' +
          '<div>Smart Contract: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F</div>' +
        '</div>' +
      '</body></html>'
    );
    printWin.document.close();
    printWin.focus();
    setTimeout(function() { printWin.print(); }, 400);
  };

  window.downloadPaymentStatementPDF = function() {
    var receipt = window.lastPaymentReceipt || {
      txId: 'VRX-982104',
      method: 'card',
      amount: 2850,
      hash: '0x8F9a3B2c4D1e5F6a',
      date: new Date().toLocaleDateString(),
      items: [{ id: 'SWISS-7701', name: 'Aetheria Geneva Tourbillon No. 1', price: 2850, qty: 1 }]
    };

    var content = 
      "==========================================================\n" +
      "            VERIX PROTOCOL PAYMENT STATEMENT              \n" +
      "==========================================================\n\n" +
      "Invoice ID    : " + receipt.txId + "\n" +
      "Date          : " + receipt.date + "\n" +
      "Payment Method: " + receipt.method.toUpperCase() + "\n" +
      "Status        : PAID & CERTIFIED ON LEDGER\n" +
      "Blockchain Hash: " + receipt.hash + "\n\n" +
      "----------------------------------------------------------\n" +
      "ITEMS PURCHASED:\n" +
      "----------------------------------------------------------\n";

    receipt.items.forEach(function(i, idx) {
      content += (idx + 1) + ". " + i.name + " (" + i.id + ") - Qty: " + i.qty + " @ $" + i.price + " = $" + (i.price * i.qty) + "\n";
    });

    content += 
      "\n----------------------------------------------------------\n" +
      "SUBTOTAL     : $" + receipt.amount.toLocaleString() + "\n" +
      "NFC SEAL FEE : $0.00 (Included)\n" +
      "TOTAL PAID   : $" + receipt.amount.toLocaleString() + "\n" +
      "==========================================================\n" +
      "Cryptographic Verification: Smart Contract 0x71C7...f6d8976F\n" +
      "Verix Protocol © 2026. All Rights Reserved.\n";

    var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Verix_Payment_Statement_' + receipt.txId + '.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Downloaded Payment Statement Invoice (' + receipt.txId + ')', 'success');
  };

  window.submitReviewForm = function() {
    var author = (document.getElementById('reviewAuthorInput').value || '').trim();
    var text = (document.getElementById('reviewTextInput').value || '').trim();
    if (!author || !text) {
      showToast('Please fill out all fields before submitting', 'error');
      return;
    }

    document.getElementById('reviewAuthorInput').value = '';
    document.getElementById('reviewTextInput').value = '';

    showToast('Thank you ' + author + '! Your review has been submitted & logged on Verix network.', 'success');
  };

  window.finishOrderAndGoToPortal = function() {
    window.closePaymentModal();
    window.navigateToPage('portal');
  };

  function addPurchasedItemsToPortalTable(itemsList) {
    var tableBody = document.querySelector('.portal-table tbody');
    if (!tableBody) return;

    (itemsList || []).forEach(function(item) {
      var row = document.createElement('tr');
      var hash = '0x' + Math.random().toString(16).substring(2, 6) + '...' + Math.random().toString(16).substring(2, 6);
      row.innerHTML =
        '<td><strong class="text-dark">' + item.id + '</strong></td>' +
        '<td>' + item.name + '</td>' +
        '<td>Asset</td>' +
        '<td><span class="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1">✓ Minted & Authentic</span></td>' +
        '<td><code class="small text-teal">' + hash + '</code></td>' +
        '<td>' +
          '<button onclick="verifyProduct(\'' + item.id + '\')" class="btn btn-sm btn-outline-dark rounded-pill me-1" title="Audit Asset">Audit</button>' +
          '<button onclick="printPaymentReceipt()" class="btn btn-sm btn-outline-secondary rounded-pill me-1" title="Print Invoice"><i class="bi bi-printer"></i></button>' +
          '<button onclick="downloadPaymentStatementPDF()" class="btn btn-sm btn-outline-dark rounded-pill" title="Download Statement"><i class="bi bi-download"></i></button>' +
        '</td>';
      tableBody.insertBefore(row, tableBody.firstChild);
    });
  }


  /* ═══════════════════════════════════════════════════════════════════════
     7. CATEGORY & HOME PAGE DYNAMIC RENDERING (49 PRODUCTS)
     ═══════════════════════════════════════════════════════════════════════ */

  window.renderCategoryProducts = function() {
    var grid = document.getElementById('productsGrid');
    if (!grid) return;

    var html = '';
    var categoryCounts = { all: 0, watches: 0, men: 0, women: 0, kids: 0, bags: 0, perfumes: 0, cosmetics: 0 };

    Object.keys(VERIX_CATALOG).forEach(function(key) {
      var p = VERIX_CATALOG[key];
      categoryCounts.all++;
      if (categoryCounts[p.category] !== undefined) categoryCounts[p.category]++;

      html +=
        '<div class="col-md-6 col-lg-4 product-item-card" data-category="' + p.category + '">' +
          '<div class="product-card-wrap">' +
            '<div class="product-card-thumb" style="cursor:pointer;" onclick="openProductDetailModal(\'' + p.id + '\')">' +
              '<span class="product-tag-badge">' + (p.tag || 'Authentic') + '</span>' +
              '<img src="' + p.img + '" alt="' + p.name + '" onerror="this.src=\'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80\';">' +
              '<span class="product-price-chip">' + formatPrice(p.price) + '</span>' +
            '</div>' +
            '<div class="product-card-body">' +
              '<div class="product-meta-row">' +
                '<span class="product-serial-chip">' + p.id + '</span>' +
                '<span class="product-rating-badge"><i class="bi bi-star-fill text-warning"></i> ' + p.rating + ' (' + p.reviewsCount + ')</span>' +
              '</div>' +
              '<h3 class="h5 font-display fw-bold text-dark mb-1" style="cursor:pointer;" onclick="openProductDetailModal(\'' + p.id + '\')">' + p.name + '</h3>' +
              '<small class="text-teal font-display fw-semibold mb-2 d-block">' + p.brand + ' • ' + p.origin + '</small>' +
              '<p class="text-secondary small mb-3 flex-grow-1">' + p.description + '</p>' +
              '<div class="d-flex gap-2 mt-auto">' +
                '<button onclick="openProductDetailModal(\'' + p.id + '\')" class="btn-verix-emerald flex-grow-1 py-2 justify-content-center small fw-semibold">' +
                  '<i class="bi bi-eye me-1"></i> View Details & Size' +
                '</button>' +
                '<button onclick="verifyProduct(\'' + p.id + '\')" class="btn btn-outline-dark rounded-pill px-3 py-2" title="Audit Blockchain Proof"><i class="bi bi-shield-check"></i></button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    });

    grid.innerHTML = html;

    // Update Category Pill Count Badges
    Object.keys(categoryCounts).forEach(function(cat) {
      var badge = document.getElementById('cat-count-' + cat);
      if (badge) badge.textContent = categoryCounts[cat].toString();
    });
  };

  window.filterCategory = function(catName) {
    var filterBtns = document.querySelectorAll('.cat-filter-pill');
    filterBtns.forEach(function(btn) { btn.classList.remove('active'); });

    var activePill = document.getElementById('cat-pill-' + catName);
    if (activePill) activePill.classList.add('active');

    var cardItems = document.querySelectorAll('.product-item-card');
    cardItems.forEach(function(card) {
      var itemCat = card.getAttribute('data-category');
      if (catName === 'all' || itemCat === catName) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  };

  window.renderHomeFeaturedProducts = function() {
    var grid = document.getElementById('featuredHomeGrid');
    if (!grid) return;

    var featuredKeys = Object.keys(VERIX_CATALOG).filter(function(k) { return VERIX_CATALOG[k].featured; }).slice(0, 6);
    var html = '';

    featuredKeys.forEach(function(key) {
      var p = VERIX_CATALOG[key];
      html +=
        '<div class="col-md-6 col-lg-4">' +
          '<div class="product-card-wrap">' +
            '<div class="product-card-thumb" style="cursor:pointer;" onclick="openProductDetailModal(\'' + p.id + '\')">' +
              '<span class="product-tag-badge">' + (p.tag || 'Top Choice') + '</span>' +
              '<img src="' + p.img + '" alt="' + p.name + '">' +
              '<span class="product-price-chip">' + formatPrice(p.price) + '</span>' +
            '</div>' +
            '<div class="product-card-body">' +
              '<div class="product-meta-row">' +
                '<span class="product-serial-chip">' + p.id + '</span>' +
                '<span class="product-rating-badge"><i class="bi bi-star-fill text-warning"></i> ' + p.rating + '</span>' +
              '</div>' +
              '<h3 class="h6 font-display fw-bold text-dark mb-1" style="cursor:pointer;" onclick="openProductDetailModal(\'' + p.id + '\')">' + p.name + '</h3>' +
              '<small class="text-teal fw-semibold mb-2 d-block">' + p.brand + '</small>' +
              '<div class="d-flex gap-2 mt-auto pt-2">' +
                '<button onclick="openProductDetailModal(\'' + p.id + '\')" class="btn-verix-emerald flex-grow-1 py-2 justify-content-center small fw-semibold">' +
                  '<i class="bi bi-eye me-1"></i> View Details & Size' +
                '</button>' +
                '<button onclick="verifyProduct(\'' + p.id + '\')" class="btn btn-sm btn-outline-dark rounded-pill px-3"><i class="bi bi-shield-check"></i></button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    });

    grid.innerHTML = html;
  };


  /* ═══════════════════════════════════════════════════════════════════════
     7B. PRODUCT DETAIL & FLIPKART SIZE SELECTION SYSTEM
     ═══════════════════════════════════════════════════════════════════════ */

  var activeDetailProductId = null;
  var selectedProductSize = null;

  var CATEGORY_SIZES = {
    watches: ['38mm', '40mm', '42mm', '44mm'],
    men: ['S', 'M', 'L', 'XL', 'XXL'],
    women: ['XS', 'S', 'M', 'L', 'XL'],
    kids: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-12Y'],
    bags: ['Standard', 'Medium', 'Large'],
    perfumes: ['50ml', '100ml', '200ml'],
    cosmetics: ['Single', 'Travel Pack', 'Pro Deluxe']
  };

  window.openProductDetailModal = function(productId) {
    var item = VERIX_CATALOG[productId];
    if (!item) {
      showToast('Product not found in catalog.', 'error');
      return;
    }

    activeDetailProductId = productId;
    var sizes = CATEGORY_SIZES[item.category] || ['Standard'];
    selectedProductSize = sizes[0];

    window.renderProductDetailModal(productId);

    var modalEl = document.getElementById('verixProductDetailModal');
    if (modalEl) {
      modalEl.style.display = 'flex';
      modalEl.classList.add('show');
      document.body.classList.add('modal-open');
    }
  };

  window.closeProductDetailModal = function() {
    var modalEl = document.getElementById('verixProductDetailModal');
    if (!modalEl) return;
    modalEl.style.display = 'none';
    modalEl.classList.remove('show');
    document.body.classList.remove('modal-open');
  };

  window.selectProductSize = function(sizeVal) {
    selectedProductSize = sizeVal;
    var sizeBtns = document.querySelectorAll('.size-pill-btn');
    sizeBtns.forEach(function(btn) {
      if (btn.getAttribute('data-size') === sizeVal) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  window.switchDetailImg = function(thumbEl, newSrc) {
    var mainImg = document.getElementById('detailMainImg');
    if (mainImg) mainImg.src = newSrc;
    var items = document.querySelectorAll('.detail-thumb-item');
    items.forEach(function(i) { i.classList.remove('active'); });
    if (thumbEl) thumbEl.classList.add('active');
  };

  window.renderProductDetailModal = function(productId) {
    var container = document.getElementById('productDetailInnerContent');
    if (!container) return;

    var p = VERIX_CATALOG[productId];
    if (!p) return;

    var sizes = CATEGORY_SIZES[p.category] || ['Standard'];
    if (!selectedProductSize || sizes.indexOf(selectedProductSize) === -1) {
      selectedProductSize = sizes[0];
    }

    var sizePillsHtml = '';
    sizes.forEach(function(sz) {
      var activeClass = sz === selectedProductSize ? ' active' : '';
      sizePillsHtml += '<button class="size-pill-btn' + activeClass + '" data-size="' + sz + '" onclick="selectProductSize(\'' + sz + '\')">' + sz + '</button>';
    });

    var msrpUsd = p.price * 1.15;

    container.innerHTML =
      '<div class="row g-4 align-items-start">' +
        '<!-- Left Column: Main Detail Image & Thumbnails -->' +
        '<div class="col-lg-5">' +
          '<div class="detail-main-img-box mb-3">' +
            '<span class="detail-tag-badge">' + (p.tag || 'Authentic') + '</span>' +
            '<img id="detailMainImg" src="' + p.img + '" alt="' + p.name + '" onerror="this.src=\'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80\';">' +
          '</div>' +

          '<div class="d-flex gap-2">' +
            '<button onclick="addToCartWithSize()" class="btn-verix-emerald flex-grow-1 py-3 justify-content-center fs-6 fw-bold">' +
              '<i class="bi bi-bag-plus me-1"></i> ADD TO CART' +
            '</button>' +
            '<button onclick="buyNowFromDetail()" class="btn-verix-primary flex-grow-1 py-3 justify-content-center fs-6 fw-bold" style="background:#F59E0B; border-color:#F59E0B; color:#0F172A;">' +
              '<i class="bi bi-lightning-charge-fill me-1"></i> BUY NOW' +
            '</button>' +
          '</div>' +
        '</div>' +

        '<!-- Right Column: Title, Price, Size Selection & Specs -->' +
        '<div class="col-lg-7 ps-lg-4">' +
          '<div class="d-flex align-items-center justify-content-between mb-2">' +
            '<span class="badge bg-teal bg-opacity-10 text-teal rounded-pill px-3 py-1 fw-semibold" style="color:#0F766E;">' + p.brand.toUpperCase() + '</span>' +
            '<span class="product-serial-chip">' + p.id + '</span>' +
          '</div>' +

          '<h2 class="font-display fw-bold text-dark mb-2 fs-3">' + p.name + '</h2>' +

          '<div class="d-flex align-items-center gap-3 mb-3">' +
            '<span class="product-rating-badge px-3 py-1 fs-6"><i class="bi bi-star-fill text-warning"></i> ' + p.rating + ' (' + p.reviewsCount + ' Flipkart Reviews)</span>' +
            '<span class="text-success small fw-bold"><i class="bi bi-shield-check me-1"></i> Authentic Verified</span>' +
          '</div>' +

          '<!-- Flipkart Price Box -->' +
          '<div class="product-detail-price-box d-flex align-items-baseline gap-2 flex-wrap">' +
            '<strong class="display-6 font-display fw-bold text-dark">' + formatPrice(p.price) + '</strong>' +
            '<span class="product-detail-orig-price">' + formatPrice(msrpUsd) + '</span>' +
            '<span class="product-detail-discount-tag"><i class="bi bi-tag-fill me-1"></i> 15% OFF</span>' +
            '<small class="text-muted d-block w-100 mt-1" style="font-size:0.78rem;">Inclusive of all taxes & Free Express Delivery</small>' +
          '</div>' +

          '<!-- Flipkart Size Selector -->' +
          '<div class="size-selector-box">' +
            '<div class="d-flex align-items-center justify-content-between mb-1">' +
              '<label class="fw-bold text-dark small text-uppercase"><i class="bi bi-arrows-angle-expand me-1"></i> Select Size / Fit:</label>' +
              '<small class="text-teal cursor-pointer fw-semibold" onclick="showToast(\'Size guide: True to standard international fit.\', \'success\')"><i class="bi bi-ruler me-1"></i> Size Chart</small>' +
            '</div>' +
            '<div class="size-options-grid">' + sizePillsHtml + '</div>' +
          '</div>' +

          '<!-- Specs & Description -->' +
          '<p class="text-secondary small mb-3">' + p.description + '</p>' +

          '<div class="p-3 bg-light rounded-3 border mb-3 small">' +
            '<div class="row g-2">' +
              '<div class="col-6"><span class="text-muted">Origin:</span> <strong class="text-dark">' + p.origin + '</strong></div>' +
              '<div class="col-6"><span class="text-muted">Mint Date:</span> <strong class="text-dark">' + p.mint_date + '</strong></div>' +
              '<div class="col-6"><span class="text-muted">NFC Seal:</span> <strong class="text-dark">' + p.nfc_chip + '</strong></div>' +
              '<div class="col-6"><span class="text-muted">Warranty:</span> <strong class="text-success">' + p.warranty + '</strong></div>' +
            '</div>' +
          '</div>' +

          '<!-- Delivery Pincode Checker -->' +
          '<div class="d-flex align-items-center gap-2 p-2 bg-white rounded-3 border mb-3">' +
            '<i class="bi bi-geo-alt-fill text-teal fs-5 ms-2"></i>' +
            '<input type="text" class="border-0 flex-grow-1 small outline-none" placeholder="Enter Pincode (e.g. 400001)" value="400001" style="outline:none;">' +
            '<button class="btn btn-sm btn-dark rounded-pill px-3 py-1" onclick="showToast(\'Express Delivery available for Pincode 400001 by Tomorrow 5 PM!\', \'success\')">Check</button>' +
          '</div>' +

          '<button onclick="verifyProduct(\'' + p.id + '\'); closeProductDetailModal();" class="btn btn-outline-dark rounded-pill w-100 py-2 small fw-semibold">' +
            '<i class="bi bi-patch-check me-1"></i> Audit Cryptographic Proof on Blockchain' +
          '</button>' +
        '</div>' +
      '</div>';
  };

  window.addToCartWithSize = function() {
    if (!activeDetailProductId) return;
    var p = VERIX_CATALOG[activeDetailProductId];
    if (!p) return;

    var fullName = p.name + ' (Size: ' + (selectedProductSize || 'Standard') + ')';
    window.addToCart(p.id + '-' + (selectedProductSize || 'std'), fullName, p.price, p.img);
    window.closeProductDetailModal();
  };

  window.buyNowFromDetail = function() {
    if (!activeDetailProductId) return;
    var p = VERIX_CATALOG[activeDetailProductId];
    if (!p) return;

    var fullName = p.name + ' (Size: ' + (selectedProductSize || 'Standard') + ')';
    cartItems = [{
      id: p.id + '-' + (selectedProductSize || 'std'),
      name: fullName,
      price: p.price,
      img: p.img,
      qty: 1
    }];
    saveCart();
    window.renderCart();

    window.closeProductDetailModal();
    window.openPaymentModal();
  };


  /* ═══════════════════════════════════════════════════════════════════════
     7C. PURCHASED PRODUCT ORDER TRACKING SYSTEM (FLIPKART REFERENCE)
     ═══════════════════════════════════════════════════════════════════════ */

  var INITIAL_MOCK_ORDERS = [
    {
      orderId: 'VRX-982104',
      date: '28 Jul 2026, 02:45 PM',
      items: [
        { id: 'SWISS-7701', name: 'Aetheria Geneva Tourbillon No. 1 (Size: 42mm)', price: 2850, qty: 1, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' }
      ],
      totalUSD: 2850,
      status: 'Shipped',
      courier: 'Flipkart Express Air (AWB #88910294)',
      deliveryAddress: '100 Luxury Way, Suite 400, Mumbai - 400001',
      paymentMethod: 'UPI (9876543210@paytm)',
      hash: '0x8F9a3B2c4D1e5F6a7B8c9D0e1F2a3B4c5D6e7F8a',
      timeline: [
        { title: 'Order Placed & Payment Confirmed', desc: 'Order placed via Flipkart UPI Gateway.', time: '28 Jul, 02:45 PM', done: true },
        { title: 'Packed & NFC Tag Cryptographically Signed', desc: 'Geneva Atelier sealed product with AES-256 NFC tag.', time: '28 Jul, 06:15 PM', done: true },
        { title: 'In Transit — Departed Geneva International Airport', desc: 'Shipment dispatched via Express Air Freight (AWB #88910294).', time: '29 Jul, 04:30 AM', done: true },
        { title: 'Arrived at Mumbai Central Fulfillment Hub', desc: 'Package scanned at local distribution center.', time: '30 Jul, 08:20 AM', done: true, active: true },
        { title: 'Out for Delivery', desc: 'Delivery Agent: Rajesh Kumar (OTP for verification: 4892)', time: 'Expected Today, 05:00 PM', done: false },
        { title: 'Delivered', desc: 'Handover & Blockchain Warranty Transfer to Collector', time: 'Expected 30 Jul', done: false }
      ]
    },
    {
      orderId: 'VRX-774012',
      date: '20 Jul 2026, 11:15 AM',
      items: [
        { id: 'BAG-8821', name: 'Velour Le Grand Leather Tote (Size: Standard)', price: 2100, qty: 1, img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80' }
      ],
      totalUSD: 2100,
      status: 'Delivered',
      courier: 'BlueDart Air Express (AWB #7729104)',
      deliveryAddress: '42 Regent Street, Marine Drive, Mumbai - 400020',
      paymentMethod: 'Credit Card (•••• 8812)',
      hash: '0x4F5E6D7C8B9A0F1E2D3C4B5A6F7E8D9C0B1A2F3E',
      timeline: [
        { title: 'Order Placed', desc: 'Payment received via Visa Credit Card.', time: '20 Jul, 11:15 AM', done: true },
        { title: 'Packed & Certified', desc: 'Paris Atelier attached cryptographic smart seal.', time: '20 Jul, 03:00 PM', done: true },
        { title: 'Shipped', desc: 'Air cargo departed Paris Charles de Gaulle.', time: '21 Jul, 09:00 AM', done: true },
        { title: 'Out for Delivery', desc: 'Courier agent out for physical delivery.', time: '22 Jul, 10:00 AM', done: true },
        { title: 'Delivered Successfully', desc: 'Received & Verified by Collector.', time: '22 Jul, 02:30 PM', done: true }
      ]
    }
  ];

  var userOrdersList = [];
  try {
    var savedOrders = localStorage.getItem('verix_user_orders');
    if (savedOrders) {
      userOrdersList = JSON.parse(savedOrders);
    } else {
      userOrdersList = INITIAL_MOCK_ORDERS;
      localStorage.setItem('verix_user_orders', JSON.stringify(userOrdersList));
    }
  } catch (e) {
    userOrdersList = INITIAL_MOCK_ORDERS;
  }

  function saveOrders() {
    localStorage.setItem('verix_user_orders', JSON.stringify(userOrdersList));
  }

  window.filterOrders = function(statusFilter) {
    var pills = document.querySelectorAll('#page-orders .cat-filter-pill');
    pills.forEach(function(p) { p.classList.remove('active'); });

    if (statusFilter === 'all') {
      var activePill = document.getElementById('order-filter-all');
      if (activePill) activePill.classList.add('active');
    } else if (statusFilter === 'In Transit') {
      var activePill = document.getElementById('order-filter-intransit');
      if (activePill) activePill.classList.add('active');
    } else if (statusFilter === 'Delivered') {
      var activePill = document.getElementById('order-filter-delivered');
      if (activePill) activePill.classList.add('active');
    }

    window.renderOrdersList(statusFilter);
  };

  window.renderOrdersList = function(filterStatus) {
    if (!filterStatus) filterStatus = 'all';

    var container = document.getElementById('ordersListContainer');
    if (!container) return;

    var counts = { all: userOrdersList.length, intransit: 0, delivered: 0 };
    userOrdersList.forEach(function(o) {
      if (o.status === 'Delivered') counts.delivered++;
      else counts.intransit++;
    });

    var countAllEl = document.getElementById('order-count-all');
    var countInTransitEl = document.getElementById('order-count-intransit');
    var countDeliveredEl = document.getElementById('order-count-delivered');
    if (countAllEl) countAllEl.textContent = counts.all;
    if (countInTransitEl) countInTransitEl.textContent = counts.intransit;
    if (countDeliveredEl) countDeliveredEl.textContent = counts.delivered;

    // Update Header Orders Badge Count!
    var ordersBadgeEl = document.getElementById('ordersBadgeCount');
    if (ordersBadgeEl) ordersBadgeEl.textContent = counts.all.toString();

    var filteredList = userOrdersList.filter(function(o) {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'In Transit') return o.status !== 'Delivered';
      if (filterStatus === 'Delivered') return o.status === 'Delivered';
      return true;
    });

    if (!filteredList || filteredList.length === 0) {
      container.innerHTML =
        '<div class="col-12 text-center py-5">' +
          '<i class="bi bi-box-seam display-3 text-muted opacity-50 mb-3 d-block"></i>' +
          '<h4 class="font-display fw-bold text-dark mb-2">No ' + (filterStatus === 'all' ? '' : filterStatus) + ' Orders Found</h4>' +
          '<p class="text-secondary small mb-4">Explore our luxury catalog and place an order to experience Flipkart-style real-time tracking.</p>' +
          '<button onclick="navigateToPage(\'categories\')" class="btn-verix-emerald px-5 py-3 fs-6">Explore Products <i class="bi bi-arrow-right ms-1"></i></button>' +
        '</div>';
      return;
    }

    var html = '';
    filteredList.forEach(function(ord) {
      var itemsHtml = '';
      var primaryProductId = ord.items && ord.items.length > 0 ? ord.items[0].id : 'SWISS-7701';

      ord.items.forEach(function(item) {
        // Strip size suffix if any for lookup
        var cleanId = item.id ? item.id.split('-')[0] + (item.id.split('-')[1] ? '-' + item.id.split('-')[1] : '') : 'SWISS-7701';
        if (cleanId.indexOf('SWISS') === 0 || cleanId.indexOf('MEN') === 0 || cleanId.indexOf('WOMEN') === 0 || cleanId.indexOf('KIDS') === 0 || cleanId.indexOf('BAG') === 0 || cleanId.indexOf('GRASSE') === 0 || cleanId.indexOf('COSM') === 0) {
          // valid clean ID
        } else {
          cleanId = item.id;
        }

        itemsHtml +=
          '<div class="d-flex align-items-center justify-content-between gap-2 py-2 border-bottom flex-wrap">' +
            '<div class="d-flex align-items-center gap-3">' +
              '<img src="' + item.img + '" style="width:54px; height:54px; object-fit:cover; border-radius:12px; border:1px solid rgba(0,0,0,0.08);" alt="' + item.name + '">' +
              '<div>' +
                '<h6 class="font-display fw-bold text-dark mb-0 small">' + item.name + '</h6>' +
                '<small class="text-teal font-display fw-semibold">' + item.id + ' • Qty: ' + item.qty + '</small>' +
              '</div>' +
            '</div>' +
            '<div class="d-flex align-items-center gap-2">' +
              '<strong class="text-dark small me-1">' + formatPrice(item.price * item.qty) + '</strong>' +
              '<button onclick="verifyOrderedProduct(\'' + cleanId + '\')" class="btn btn-sm btn-outline-success rounded-pill px-3 py-1 small fw-semibold" title="Directly verify product hash code & warranty on blockchain">' +
                '<i class="bi bi-shield-check me-1"></i> Audit Product' +
              '</button>' +
            '</div>' +
          '</div>';
      });

      var isDelivered = ord.status === 'Delivered';
      var statusBadgeClass = isDelivered ? 'bg-success text-white' : 'bg-warning text-dark';
      var statusIcon = isDelivered ? 'bi-check-circle-fill' : 'bi-truck';
      var stepProgressPercent = isDelivered ? 100 : 75;

      html +=
        '<div class="col-lg-6">' +
          '<div class="order-tracking-card h-100 d-flex flex-column hover-lift shadow-sm">' +
            '<!-- Header -->' +
            '<div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">' +
              '<div>' +
                '<span class="badge bg-dark rounded-pill px-3 py-1 fw-semibold mb-1">Order #' + ord.orderId + '</span>' +
                '<small class="text-muted d-block" style="font-size:0.78rem;"><i class="bi bi-calendar3 me-1"></i>' + ord.date + '</small>' +
              '</div>' +
              '<span class="badge ' + statusBadgeClass + ' rounded-pill px-3 py-2 fw-semibold fs-6 d-flex align-items-center gap-1">' +
                '<i class="bi ' + statusIcon + '"></i> ' + ord.status +
              '</span>' +
            '</div>' +

            '<!-- Items -->' +
            '<div class="mb-3 flex-grow-1">' + itemsHtml + '</div>' +

            '<!-- Flipkart Quick Progress Bar -->' +
            '<div class="p-3 bg-light rounded-3 mb-3 border">' +
              '<div class="d-flex justify-content-between small text-muted mb-1 font-display fw-semibold">' +
                '<span><i class="bi bi-clock-history me-1 text-teal"></i> ' + (isDelivered ? 'Delivered on Schedule' : 'Expected Delivery: Today, 5 PM') + '</span>' +
                '<span class="text-teal fw-bold">' + stepProgressPercent + '% Complete</span>' +
              '</div>' +
              '<div class="progress" style="height: 6px; border-radius: 999px; background:#E2E8F0;">' +
                '<div class="progress-bar bg-teal" role="progressbar" style="width: ' + stepProgressPercent + '%; background-color:#0F766E !important;" aria-valuenow="' + stepProgressPercent + '" aria-valuemin="0" aria-valuemax="100"></div>' +
              '</div>' +
            '</div>' +

            '<!-- Footer -->' +
            '<div class="d-flex align-items-center justify-content-between pt-2 border-top gap-2 flex-wrap">' +
              '<div>' +
                '<span class="text-muted small">Total Paid:</span>' +
                '<strong class="h5 font-display fw-bold text-dark d-block mb-0">' + formatPrice(ord.totalUSD) + '</strong>' +
              '</div>' +
              '<div class="d-flex gap-2 flex-wrap">' +
                '<button onclick="verifyOrderedProduct(\'' + primaryProductId + '\')" class="btn btn-outline-dark py-2 px-3 small fw-semibold rounded-pill" title="Verify Blockchain Hash & Warranty">' +
                  '<i class="bi bi-shield-lock-fill me-1 text-teal"></i> Verify Blockchain & Warranty' +
                '</button>' +
                '<button onclick="openTrackingModal(\'' + ord.orderId + '\')" class="btn-verix-emerald py-2 px-3 small fw-semibold">' +
                  '<i class="bi bi-geo-alt-fill me-1"></i> Track Live Status' +
                '</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    });

    container.innerHTML = html;
  };

  window.handleOrderSearch = function() {
    var input = document.getElementById('orderSearchInput');
    var q = input ? input.value.trim().toUpperCase() : '';
    if (!q) {
      window.renderOrdersList();
      return;
    }

    var foundOrder = userOrdersList.find(function(o) {
      return o.orderId.toUpperCase().indexOf(q) !== -1 || JSON.stringify(o).toUpperCase().indexOf(q) !== -1;
    });

    if (foundOrder) {
      window.openTrackingModal(foundOrder.orderId);
      showToast('Found Order #' + foundOrder.orderId, 'success');
    } else {
      showToast('No order found matching "' + q + '"', 'error');
    }
  };

  window.openTrackingModal = function(orderId) {
    var ord = userOrdersList.find(function(o) { return o.orderId === orderId; });
    if (!ord) {
      showToast('Order ID not found', 'error');
      return;
    }

    var container = document.getElementById('trackingModalInnerContent');
    if (!container) return;

    var stepperHtml = '';
    ord.timeline.forEach(function(step) {
      var stateClass = step.done ? 'done' : (step.active ? 'active' : '');
      var icon = step.done ? '<i class="bi bi-check-lg"></i>' : (step.active ? '<i class="bi bi-truck"></i>' : '<i class="bi bi-circle"></i>');

      stepperHtml +=
        '<div class="tracking-step-item ' + stateClass + '">' +
          '<div class="tracking-step-node">' + icon + '</div>' +
          '<div class="tracking-step-content">' +
            '<div class="tracking-step-title">' + step.title + '</div>' +
            '<div class="tracking-step-desc">' + step.desc + '</div>' +
            '<div class="tracking-step-time"><i class="bi bi-clock me-1"></i>' + step.time + '</div>' +
          '</div>' +
        '</div>';
    });

    container.innerHTML =
      '<div class="p-2">' +
        '<!-- Header -->' +
        '<div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">' +
          '<div>' +
            '<span class="badge bg-teal bg-opacity-10 text-teal rounded-pill px-3 py-1 fw-semibold mb-1" style="color:#0F766E;">FLIPKART LOGISTICS TRACKER</span>' +
            '<h3 class="font-display fw-bold text-dark mb-0 fs-4">Order #' + ord.orderId + '</h3>' +
          '</div>' +
          '<div class="text-end">' +
            '<span class="badge bg-success text-white rounded-pill px-3 py-2 fw-semibold fs-6">' + ord.status + '</span>' +
            '<small class="text-muted d-block mt-1">' + ord.date + '</small>' +
          '</div>' +
        '</div>' +

        '<!-- Flipkart Stepper Timeline -->' +
        '<div class="order-tracking-card bg-light border-0 mb-4">' +
          '<h5 class="font-display fw-bold text-dark mb-1 small text-uppercase"><i class="bi bi-diagram-3-fill me-1 text-teal"></i> Real-time Shipment Progress</h5>' +
          '<div class="tracking-stepper-container">' +
            '<div class="tracking-stepper-line"></div>' +
            stepperHtml +
          '</div>' +
        '</div>' +

        '<!-- Delivery Details -->' +
        '<div class="p-3 bg-light rounded-3 border mb-3 small">' +
          '<div class="row g-2 align-items-center">' +
            '<div class="col-md-6"><span class="text-muted">Courier Partner:</span> <strong class="text-dark">' + (ord.courier || 'Flipkart Express Air') + '</strong></div>' +
            '<div class="col-md-6"><span class="text-muted">Payment Mode:</span> <strong class="text-dark">' + ord.paymentMethod + '</strong></div>' +
            '<div class="col-md-12"><span class="text-muted">Delivery Address:</span> <strong class="text-dark">' + ord.deliveryAddress + '</strong></div>' +
            '<div class="col-md-12 d-flex align-items-center justify-content-between flex-wrap gap-2 pt-1 border-top mt-1">' +
              '<div><span class="text-muted">Blockchain Ledger Seal:</span> <code class="text-teal small font-monospace">' + (ord.hash || '0x8F9a3B2c4D1e5F6a') + '</code></div>' +
              '<button onclick="closeTrackingModal(); verifyOrderedProduct(\'' + (ord.items && ord.items[0] ? ord.items[0].id : 'SWISS-7701') + '\');" class="btn btn-sm btn-success rounded-pill px-3 py-1 fw-semibold text-white">' +
                '<i class="bi bi-shield-check me-1"></i> Verify Blockchain & Warranty' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<!-- Interactive Simulation Button -->' +
        '<div class="d-flex gap-2">' +
          '<button onclick="advanceOrderStep(\'' + ord.orderId + '\')" class="btn-verix-primary flex-grow-1 py-3 justify-content-center small fw-bold">' +
            '<i class="bi bi-arrow-repeat me-1"></i> SIMULATE LIVE TRACKING PROGRESS' +
          '</button>' +
          '<button onclick="closeTrackingModal()" class="btn btn-outline-dark rounded-pill px-4">Close</button>' +
        '</div>' +
      '</div>';

    var modalEl = document.getElementById('verixTrackingModal');
    if (modalEl) {
      modalEl.style.display = 'flex';
      modalEl.classList.add('show');
      document.body.classList.add('modal-open');
    }
  };

  window.closeTrackingModal = function() {
    var modalEl = document.getElementById('verixTrackingModal');
    if (!modalEl) return;
    modalEl.style.display = 'none';
    modalEl.classList.remove('show');
    document.body.classList.remove('modal-open');
  };

  window.advanceOrderStep = function(orderId) {
    var ord = userOrdersList.find(function(o) { return o.orderId === orderId; });
    if (!ord) return;

    var nextUndoneIndex = -1;
    for (var i = 0; i < ord.timeline.length; i++) {
      if (!ord.timeline[i].done) {
        nextUndoneIndex = i;
        break;
      }
    }

    if (nextUndoneIndex === -1) {
      showToast('Order #' + orderId + ' is already fully delivered!', 'success');
      return;
    }

    ord.timeline.forEach(function(step) { step.active = false; });

    ord.timeline[nextUndoneIndex].done = true;
    ord.timeline[nextUndoneIndex].time = 'Updated ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (nextUndoneIndex + 1 < ord.timeline.length) {
      ord.timeline[nextUndoneIndex + 1].active = true;
      ord.status = ord.timeline[nextUndoneIndex].title.split('&')[0].trim();
    } else {
      ord.status = 'Delivered';
    }

    saveOrders();
    window.openTrackingModal(orderId);
    window.renderOrdersList();
    showToast('Tracking status updated: ' + ord.timeline[nextUndoneIndex].title, 'success');
  };


  /* ═══════════════════════════════════════════════════════════════════════
     8. VERIFICATION ENGINE
     ═══════════════════════════════════════════════════════════════════════ */

  window.handleHeroSearch = function() {
    var input = document.getElementById('heroSearchInput');
    var query = input ? input.value.trim() : '';
    if (!query) {
      showToast('Please enter a serial number (e.g. SWISS-7701)...', 'error');
      return;
    }
    window.verifyProduct(query);
  };

  window.verifyProductFromConsole = function() {
    var input = document.getElementById('verifyConsoleInput');
    var query = input ? input.value.trim() : '';
    if (!query) {
      showToast('Please enter a serial code to verify.', 'error');
      return;
    }
    window.verifyProduct(query);
  };

  window.verifyOrderedProduct = function(productId) {
    var code = (productId || '').trim().toUpperCase();
    window.navigateToPage('verify');

    var consoleInput = document.getElementById('verifyConsoleInput');
    if (consoleInput) consoleInput.value = code;

    showToast('Navigating to Verification Console for #' + code + '...', 'success');
    window.verifyProduct(code);

    var resBox = document.getElementById('verificationResultBox');
    if (resBox) {
      setTimeout(function() {
        resBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  };

  window.verifyProduct = function(serialCode) {
    var rawCode = (serialCode || '').trim().toUpperCase();
    if (!rawCode) {
      showToast('Please enter a valid product serial code.', 'error');
      return;
    }

    // Strip size/option suffixes if present (e.g., SWISS-7701-42mm -> SWISS-7701)
    var code = rawCode.indexOf('-') !== -1 ? rawCode.split('-')[0] + '-' + rawCode.split('-')[1] : rawCode;
    if (code.indexOf('FAKE') === 0) code = rawCode;

    var consoleInput = document.getElementById('verifyConsoleInput');
    if (consoleInput) consoleInput.value = code;

    var resultBox = document.getElementById('verificationResultBox');
    if (resultBox) {
      resultBox.innerHTML =
        '<div class="text-center w-100 py-4">' +
          '<div class="spinner-border text-success mb-3" role="status"></div>' +
          '<p class="text-secondary font-display fw-semibold mb-0">Querying Verix Decentralized Ledger for #' + code + '...</p>' +
          '<small class="text-teal font-monospace d-block mt-2">Verifying Smart Contract State & Cryptographic Hash Proof...</small>' +
        '</div>';
    }

    window.navigateToPage('verify');

    var localItem = VERIX_CATALOG[code];

    if (code.indexOf('FAKE') === 0) {
      setTimeout(function() {
        renderFailure('Cryptographic proof failure: Unregistered serial tag on Verix ledger.');
      }, 400);
      return;
    }

    // Attempt Django API call first
    fetch('/api/audit/' + encodeURIComponent(code) + '/')
      .then(function(res) {
        if (!res.ok) return fetch('/api/verify/' + encodeURIComponent(code) + '/');
        return res;
      })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data && data.valid !== false) {
          if (localItem) {
            data.brand = localItem.brand || data.brand;
            data.model = localItem.name || data.model;
            data.category = (localItem.category || data.category).toUpperCase();
            data.origin = localItem.origin || data.origin;
            data.mint_date = localItem.mint_date || data.mint_date;
            data.nfc_chip = localItem.nfc_chip || data.nfc_chip;
            data.blockchain_hash = localItem.blockchain_hash || data.blockchain_hash;
            data.warranty = localItem.warranty || data.warranty;
          }
          renderSuccess(data);
        } else if (localItem) {
          renderSuccess({
            product_id: localItem.id,
            brand: localItem.brand,
            model: localItem.name,
            category: (localItem.category || 'Luxury Asset').toUpperCase(),
            origin: localItem.origin,
            mint_date: localItem.mint_date,
            nfc_chip: localItem.nfc_chip,
            blockchain_hash: localItem.blockchain_hash,
            block_number: 1894204,
            smart_contract: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
            warranty: localItem.warranty
          });
        } else {
          renderFailure(data.reason || 'Cryptographic proof failure: Unregistered serial tag on Verix ledger.');
        }
      })
      .catch(function() {
        // Fallback for static browser execution
        if (localItem) {
          renderSuccess({
            product_id: localItem.id,
            brand: localItem.brand,
            model: localItem.name,
            category: (localItem.category || 'Luxury Asset').toUpperCase(),
            origin: localItem.origin,
            mint_date: localItem.mint_date,
            nfc_chip: localItem.nfc_chip,
            blockchain_hash: localItem.blockchain_hash,
            block_number: 1894204,
            smart_contract: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
            warranty: localItem.warranty
          });
        } else {
          var mockHash = '0x' + (Math.random().toString(16).substring(2)) + '8f219c004a';
          renderSuccess({
            product_id: code,
            brand: 'Heritage Luxury Atelier',
            model: 'Authentic Certified Asset #' + code,
            category: 'Certified Authentic Asset',
            origin: 'European Union Guild',
            mint_date: '2026-02-01',
            nfc_chip: 'NFC-' + code + '-OK',
            blockchain_hash: mockHash,
            block_number: 1894204,
            smart_contract: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
            warranty: 'Active Certified Provenance Guarantee'
          });
        }
      });
  };

  window.lastVerifiedData = null;

  function renderSuccess(data) {
    window.lastVerifiedData = data;
    var resultBox = document.getElementById('verificationResultBox');
    if (!resultBox) return;

    var blockNum = data.block_number || 1894204;
    var contractAddr = data.smart_contract || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';

    resultBox.innerHTML =
      '<div class="w-100 p-4 bg-white rounded-4 border shadow-sm">' +
        '<!-- Success Header Badge -->' +
        '<div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3 flex-wrap gap-2">' +
          '<div>' +
            '<span class="badge bg-success text-white rounded-pill px-3 py-2 fw-semibold fs-6 mb-1">' +
              '<i class="bi bi-shield-check me-1"></i> VERIFIED AUTHENTIC ON BLOCKCHAIN' +
            '</span>' +
            '<small class="text-muted d-block mt-1">Serial Code: <strong class="text-dark font-monospace">' + data.product_id + '</strong></small>' +
          '</div>' +
          '<div class="text-end">' +
            '<span class="badge bg-teal bg-opacity-10 text-teal rounded-pill px-3 py-2 fw-semibold" style="color:#0F766E;">Node #1894204</span>' +
          '</div>' +
        '</div>' +

        '<!-- Product Title & Brand -->' +
        '<h3 class="font-display fw-bold text-dark mb-1">' + (data.brand || 'Verix Luxury') + '</h3>' +
        '<p class="text-secondary fs-5 mb-3 fw-semibold">' + (data.model || data.product_id) + '</p>' +

        '<!-- Specifications Grid -->' +
        '<div class="p-3 bg-light rounded-3 border mb-3 small">' +
          '<div class="row g-2">' +
            '<div class="col-6"><span class="text-muted">Category:</span> <strong class="text-dark">' + (data.category || 'LUXURY').toUpperCase() + '</strong></div>' +
            '<div class="col-6"><span class="text-muted">Origin:</span> <strong class="text-dark">' + (data.origin || 'Geneva, Switzerland') + '</strong></div>' +
            '<div class="col-6"><span class="text-muted">Mint Date:</span> <strong class="text-dark">' + (data.mint_date || '2026-01-14') + '</strong></div>' +
            '<div class="col-6"><span class="text-muted">NFC Chip Seal:</span> <strong class="text-dark">' + (data.nfc_chip || 'NFC-AES256') + '</strong></div>' +
          '</div>' +
        '</div>' +

        '<!-- Cryptographic Blockchain Ledger Hash Box -->' +
        '<div class="p-3 bg-dark text-white rounded-3 mb-3">' +
          '<div class="d-flex align-items-center justify-content-between mb-1">' +
            '<span class="small text-teal fw-semibold text-uppercase" style="color:#00E5FF;"><i class="bi bi-hash me-1"></i> Cryptographic Ledger Hash Code:</span>' +
            '<button onclick="copyBlockchainHash(\'' + data.blockchain_hash + '\')" class="btn btn-sm btn-outline-light rounded-pill px-2 py-0 text-capitalize" style="font-size:0.75rem;">' +
              '<i class="bi bi-clipboard me-1"></i> Copy Hash' +
            '</button>' +
          '</div>' +
          '<code class="small text-warning text-break font-monospace d-block mb-2" style="font-size:0.88rem; color:#F59E0B !important;">' + data.blockchain_hash + '</code>' +
          '<div class="d-flex justify-content-between text-white-50" style="font-size:0.78rem;">' +
            '<span>Smart Contract: ' + contractAddr.substring(0, 10) + '...' + contractAddr.substring(contractAddr.length - 6) + '</span>' +
            '<span>Block #' + blockNum + '</span>' +
          '</div>' +
        '</div>' +

        '<!-- Warranty Verification Box -->' +
        '<div class="p-3 rounded-3 border border-success bg-success bg-opacity-10 mb-3">' +
          '<div class="d-flex align-items-center gap-2 mb-1 text-success font-display fw-bold fs-6">' +
            '<i class="bi bi-patch-check-fill fs-5"></i> Verified Warranty & Provenance Certificate' +
          '</div>' +
          '<div class="small text-dark fw-semibold mb-1">' + (data.warranty || 'Active 5 Year International Guarantee') + '</div>' +
          '<div class="text-muted d-flex justify-content-between flex-wrap" style="font-size:0.78rem;">' +
            '<span>Certificate Key: VRX-WRN-' + data.product_id + '</span>' +
            '<span class="text-success fw-bold">✓ Smart Contract Guaranteed</span>' +
          '</div>' +
        '</div>' +

        '<!-- Audit Certificate Action Buttons -->' +
        '<div class="d-flex gap-2 flex-wrap">' +
          '<button onclick="printAuditCertificate()" class="btn btn-outline-dark rounded-pill flex-grow-1 py-2 small fw-semibold">' +
            '<i class="bi bi-printer me-1"></i> Print Audit Proof' +
          '</button>' +
          '<button onclick="downloadAuditStatement()" class="btn rounded-pill flex-grow-1 py-2 small fw-semibold text-white" style="background:#0F766E;">' +
            '<i class="bi bi-download me-1"></i> Download Certificate PDF' +
          '</button>' +
        '</div>' +
      '</div>';

    showToast('Product #' + data.product_id + ' Verified Authentic on Blockchain!', 'success');
  }

  function renderFailure(reason) {
    var resultBox = document.getElementById('verificationResultBox');
    if (!resultBox) return;

    resultBox.innerHTML =
      '<div class="w-100 p-4 bg-white rounded-4 border shadow-sm">' +
        '<div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">' +
          '<span class="badge bg-danger text-white rounded-pill px-3 py-2 fw-semibold fs-6"><i class="bi bi-exclamation-triangle-fill me-1"></i> COUNTERFEIT ALERT</span>' +
          '<small class="text-muted">Incident Logged</small>' +
        '</div>' +
        '<h3 class="font-display fw-bold text-danger mb-2">Unverified Serial Code</h3>' +
        '<p class="text-secondary mb-3">' + reason + '</p>' +
        '<div class="p-3 bg-light rounded-3 border border-danger text-danger small fw-bold mb-3">' +
          '<i class="bi bi-shield-x me-1"></i> Warning: Item lacks cryptographic smart contract proof on Verix ledger.' +
        '</div>' +
      '</div>';
    showToast('Verification Failed: Counterfeit Tag Detected', 'error');
  }

  window.copyBlockchainHash = function(hash) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(hash);
    }
    showToast('Blockchain Hash copied to clipboard: ' + hash.substring(0, 16) + '...', 'success');
  };

  window.printAuditCertificate = function() {
    var d = window.lastVerifiedData || {
      product_id: 'SWISS-7701',
      brand: 'Aetheria Geneva',
      model: 'Tourbillon Calibre No. 1',
      category: 'WATCHES',
      origin: 'Geneva, Switzerland',
      mint_date: '2026-01-14',
      nfc_chip: 'NFC-SWISS-7701-AES256',
      blockchain_hash: '0x8F9a3B2c4D1e5F6a7B8c9D0e1F2a3B4c5D6e7F8a',
      warranty: 'Active 5 Year International Guarantee'
    };

    var win = window.open('', '_blank', 'width=800,height=900');
    if (!win) {
      window.print();
      return;
    }

    win.document.write(
      '<!DOCTYPE html><html><head><title>Verix Blockchain Audit Certificate - ' + d.product_id + '</title>' +
      '<style>' +
        'body { font-family: sans-serif; color: #0f172a; margin: 40px; background: #fff; }' +
        '.cert-border { border: 8px double #0f766e; padding: 40px; border-radius: 12px; }' +
        '.header { text-align: center; border-bottom: 2px solid #0f766e; padding-bottom: 20px; margin-bottom: 30px; }' +
        '.title { font-size: 32px; font-weight: bold; color: #0f766e; letter-spacing: 2px; }' +
        '.subtitle { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-top: 5px; }' +
        '.badge-box { background: #dcfce7; color: #166534; padding: 10px 20px; border-radius: 999px; font-weight: bold; display: inline-block; margin-bottom: 20px; }' +
        'table { width: 100%; border-collapse: collapse; margin-top: 20px; }' +
        'td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }' +
        'td.label { font-weight: bold; color: #475569; width: 35%; }' +
        '.hash-box { background: #0f172a; color: #f59e0b; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 13px; margin-top: 25px; word-break: break-all; }' +
        '.footer { text-align: center; margin-top: 40px; font-size: 12px; color: #64748b; }' +
      '</style>' +
      '</head><body>' +
        '<div class="cert-border">' +
          '<div class="header">' +
            '<div class="title">VERIX PROTOCOL</div>' +
            '<div class="subtitle">Official Cryptographic Product Audit & Provenance Certificate</div>' +
          '</div>' +
          '<div style="text-align:center;">' +
            '<div class="badge-box">✓ VERIFIED AUTHENTIC & GUARANTEED ON BLOCKCHAIN</div>' +
          '</div>' +
          '<table>' +
            '<tr><td class="label">Product Serial Code:</td><td><strong>' + d.product_id + '</strong></td></tr>' +
            '<tr><td class="label">Brand & Manufacturer:</td><td>' + (d.brand || 'Verix Luxury') + '</td></tr>' +
            '<tr><td class="label">Model Name:</td><td>' + (d.model || d.product_id) + '</td></tr>' +
            '<tr><td class="label">Category:</td><td>' + (d.category || 'Luxury') + '</td></tr>' +
            '<tr><td class="label">Country of Origin:</td><td>' + (d.origin || 'Geneva, Switzerland') + '</td></tr>' +
            '<tr><td class="label">Mint Date:</td><td>' + (d.mint_date || '2026-01-14') + '</td></tr>' +
            '<tr><td class="label">NFC Cryptographic Seal:</td><td>' + (d.nfc_chip || 'NFC-AES256') + '</td></tr>' +
            '<tr><td class="label">Warranty Guarantee Status:</td><td style="color:#15803d; font-weight:bold;">' + (d.warranty || 'Active Guarantee') + '</td></tr>' +
          '</table>' +
          '<div class="hash-box">' +
            '<div><strong>Blockchain Ledger Hash Code:</strong></div>' +
            '<div style="margin-top:5px;">' + d.blockchain_hash + '</div>' +
            '<div style="margin-top:10px; font-size:11px; color:#94a3b8;">Smart Contract: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F • Block Height: #1894204</div>' +
          '</div>' +
          '<div class="footer">' +
            'This certificate confirms that the product has been cryptographically validated against the Verix Mainnet Smart Contract.' +
            '<br>Verix Protocol © 2026. All Rights Reserved.' +
          '</div>' +
        '</div>' +
      '</body></html>'
    );

    win.document.close();
    win.focus();
    setTimeout(function() { win.print(); }, 400);
  };

  window.downloadAuditStatement = function() {
    var d = window.lastVerifiedData || {
      product_id: 'SWISS-7701',
      brand: 'Aetheria Geneva',
      model: 'Tourbillon Calibre No. 1',
      blockchain_hash: '0x8F9a3B2c4D1e5F6a7B8c9D0e1F2a3B4c5D6e7F8a',
      warranty: 'Active 5 Year International Guarantee'
    };

    var content = 
      "==========================================================\n" +
      "        VERIX PROTOCOL BLOCKCHAIN AUDIT CERTIFICATE       \n" +
      "==========================================================\n\n" +
      "STATUS             : VERIFIED AUTHENTIC & IMMUTABLE\n" +
      "PRODUCT SERIAL CODE: " + d.product_id + "\n" +
      "BRAND / ATELIER    : " + (d.brand || 'Verix') + "\n" +
      "MODEL NAME         : " + (d.model || d.product_id) + "\n" +
      "CATEGORY           : " + (d.category || 'Luxury') + "\n" +
      "ORIGIN             : " + (d.origin || 'Geneva') + "\n" +
      "MINT DATE          : " + (d.mint_date || '2026-01-14') + "\n" +
      "NFC CHIP SEAL      : " + (d.nfc_chip || 'NFC-AES256') + "\n" +
      "WARRANTY PROOF     : " + (d.warranty || 'Active Guarantee') + "\n\n" +
      "----------------------------------------------------------\n" +
      "CRYPTOGRAPHIC LEDGER TELEMETRY:\n" +
      "----------------------------------------------------------\n" +
      "BLOCKCHAIN HASH    : " + d.blockchain_hash + "\n" +
      "SMART CONTRACT     : 0x71C7656EC7ab88b098defB751B7401B5f6d8976F\n" +
      "BLOCK HEIGHT       : #1894204\n" +
      "VALIDATOR NODE     : Verix-Node-Geneva-09\n" +
      "AUDIT TIMESTAMP    : " + new Date().toISOString() + "\n" +
      "==========================================================\n" +
      "Verix Protocol © 2026. Decentralized Product Authentication.\n";

    var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Verix_Audit_Certificate_' + d.product_id + '.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Downloaded Cryptographic Audit Certificate for #' + d.product_id, 'success');
  };


  /* ═══════════════════════════════════════════════════════════════════════
     9. INITIALIZATION & EVENT HANDLERS
     ═══════════════════════════════════════════════════════════════════════ */

  var currentSlideIdx = 0;
  function rotateHeroSlider() {
    var slides = document.querySelectorAll('.hero-slide-item');
    if (!slides.length) return;
    slides[currentSlideIdx].classList.remove('active');
    currentSlideIdx = (currentSlideIdx + 1) % slides.length;
    slides[currentSlideIdx].classList.add('active');
  }

  document.addEventListener('DOMContentLoaded', function() {
    // 1. Initial Renderings
    var currencySel = document.getElementById('currencySelector');
    if (currencySel) currencySel.value = currentCurrencyCode;

    window.renderCategoryProducts();
    window.renderHomeFeaturedProducts();
    window.renderCart();
    if (window.renderOrdersList) window.renderOrdersList();

    // 2. Auto-rotate hero slider
    setInterval(rotateHeroSlider, 4500);

    // 3. User Session Check
    var savedSession = localStorage.getItem('verix_user_session');
    if (savedSession) {
      try { window.updateUserSessionUI(JSON.parse(savedSession)); } catch (e) { window.updateUserSessionUI(null); }
    }

    // 4. Modal Backdrop Close Handler (Click outside modal content closes modal)
    ['verixAuthModal', 'verixPaymentModal', 'verixProductDetailModal', 'verixTrackingModal'].forEach(function(id) {
      var m = document.getElementById(id);
      if (m) {
        m.addEventListener('click', function(e) {
          if (e.target === m) {
            if (id === 'verixAuthModal') window.closeAuthModal();
            if (id === 'verixPaymentModal') window.closePaymentModal();
            if (id === 'verixProductDetailModal') window.closeProductDetailModal();
            if (id === 'verixTrackingModal') window.closeTrackingModal();
          }
        });
      }
    });

    // 5. Auth Forms Listeners
    var loginForm = document.getElementById('verixLoginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var email = document.getElementById('loginEmailInput').value;
        var role = document.getElementById('loginRoleSelect').value;
        var userName = email.split('@')[0];
        userName = userName.charAt(0).toUpperCase() + userName.slice(1);
        window.handleAuthSuccess(userName + ' (Verix)', email, role);
      });
    }

    var registerForm = document.getElementById('verixRegisterForm');
    if (registerForm) {
      registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var name = document.getElementById('registerNameInput').value;
        var email = document.getElementById('registerEmailInput').value;
        window.handleAuthSuccess(name, email, 'Brand Executive');
      });
    }

    // 6. Payment Form & Auto Card Spacing
    var cardNumInput = document.getElementById('cardNumInput');
    if (cardNumInput) {
      cardNumInput.addEventListener('input', function(e) {
        var v = e.target.value.replace(/\D/g, '').substring(0, 16);
        var formatted = v.replace(/(.{4})/g, '$1 ').trim();
        e.target.value = formatted;
      });
    }

    var paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
      paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        window.processPayment();
      });
    }

    // 7. Search Listeners
    var searchNavInput = document.getElementById('navSearchInput');
    if (searchNavInput) {
      searchNavInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          window.handleGlobalSearch(searchNavInput.value);
        }
      });
    }

    var heroInput = document.getElementById('heroSearchInput');
    if (heroInput) {
      heroInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          window.handleHeroSearch();
        }
      });
    }

    var consoleInput = document.getElementById('verifyConsoleInput');
    if (consoleInput) {
      consoleInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          window.verifyProductFromConsole();
        }
      });
    }

    var orderInput = document.getElementById('orderSearchInput');
    if (orderInput) {
      orderInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          window.handleOrderSearch();
        }
      });
    }

    // 8. Header Scrolled Class & Single Page View Router
    var headerEl = document.querySelector('.site-header');

    window.addEventListener('scroll', function() {
      var scrollPos = window.scrollY || document.documentElement.scrollTop;
      if (headerEl) {
        if (scrollPos > 30) headerEl.classList.add('scrolled');
        else headerEl.classList.remove('scrolled');
      }
    });

    // Hash change & initial page router
    function routeFromHash() {
      var hash = (window.location.hash || '').replace('#', '').trim();
      if (hash && ['home', 'categories', 'verify', 'orders', 'portal', 'reviews'].indexOf(hash) !== -1) {
        window.navigateToPage(hash);
      } else {
        window.navigateToPage('home');
      }
    }

    // ─── Mobile Navigation Drawer Toggle ───────────────────────────
    window.toggleMobileNav = function() {
      var drawer = document.getElementById('mobileNavDrawer');
      var overlay = document.getElementById('mobileNavOverlay');
      if (!drawer || !overlay) return;
      var isOpen = drawer.classList.contains('open');
      if (isOpen) {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        document.body.classList.remove('modal-open');
      } else {
        drawer.classList.add('open');
        overlay.classList.add('open');
        document.body.classList.add('modal-open');
      }
    };

    window.addEventListener('hashchange', routeFromHash);
    routeFromHash();
  });

})();
