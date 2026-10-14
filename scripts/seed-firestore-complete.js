/**
 * PRATIK PHATAKE (प्रतीक फटाके) — Complete Cloud Firestore Seeder
 * Project: pratik-phatake
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, deleteDoc, collection, getDocs } = require('firebase/firestore');
const demoData = require('./demo-data-extracted.cjs');

const firebaseConfig = {
  apiKey: "AIzaSyAo2DNghKrS5SuZiAC0Tepxfr7xb6u7lt0",
  authDomain: "pratik-phatake.firebaseapp.com",
  projectId: "pratik-phatake",
  storageBucket: "pratik-phatake.firebasestorage.app",
  messagingSenderId: "688105902720",
  appId: "1:688105902720:web:3bc726dd0f87f83d450c65"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const currentYear = new Date().getFullYear();

const offers = [
  {
    id: 'off-diwali-10',
    code: 'DIWALI10',
    title: {
      mr: 'दिवाळी महा धमाका १०% सवलत',
      hi: 'दीवाली महा धमाका १०% छूट',
      en: 'Diwali Maha Dhamaka 10% Off'
    },
    description: {
      mr: '₹३,००० च्या पुढील बिलावर १०% थेट सवलत (कमाल ₹१,००० पर्यंत)',
      hi: '₹३,००० से अधिक बिल पर १०% तुरंत छूट (अधिकतम ₹१,०००)',
      en: '10% instant discount on orders above ₹3,000 (Max ₹1,000)'
    },
    offerType: 'bill_discount',
    discountType: 'percentage',
    discountValue: 10,
    minimumAmount: 3000,
    maximumDiscount: 1000,
    startDate: `${currentYear}-01-01`,
    endDate: `${currentYear + 1}-12-31`,
    stackingAllowed: false,
    usageLimit: 500,
    usageCount: 24,
    active: true
  },
  {
    id: 'off-family-flat500',
    code: 'FAMILY500',
    title: {
      mr: 'कौटुंबिक कॉम्बो ₹५०० ऑफ',
      hi: 'पारिवारिक कॉम्बो ₹५०० छूट',
      en: 'Family Combo ₹500 Flat Off'
    },
    description: {
      mr: '₹५,००० च्या पुढील बिलावर थेट ₹५०० रोख सवलत',
      hi: '₹५,००० से अधिक खरीदारी पर ₹५०० सीधी छूट',
      en: 'Flat ₹500 discount on cart value above ₹5,000'
    },
    offerType: 'bill_discount',
    discountType: 'fixed',
    discountValue: 500,
    minimumAmount: 5000,
    startDate: `${currentYear}-01-01`,
    endDate: `${currentYear + 1}-12-31`,
    stackingAllowed: false,
    usageLimit: 200,
    usageCount: 15,
    active: true
  },
  {
    id: 'off-skyshots-15',
    code: 'SKYSHOT15',
    title: {
      mr: 'स्काय शॉट्स १५% विशेष ऑफर',
      hi: 'स्काई शॉट्स १५% विशेष छूट',
      en: 'Sky Shots 15% Special Bonanza'
    },
    description: {
      mr: 'सर्व स्काय शॉट्स उत्पादनांवर १५% सवलत',
      hi: 'सभी स्काई शॉट्स उत्पादों पर १५% छूट',
      en: '15% discount on all Sky Shots category fireworks'
    },
    offerType: 'category_discount',
    discountType: 'percentage',
    discountValue: 15,
    minimumAmount: 2000,
    maximumDiscount: 750,
    eligibleCategoryIds: ['cat-skyshots', 'cat-sky-shots'],
    startDate: `${currentYear}-01-01`,
    endDate: `${currentYear + 1}-12-31`,
    stackingAllowed: true,
    usageCount: 42,
    active: true
  },
  {
    id: 'off-vip-20',
    code: 'VIPPHATAKE',
    title: {
      mr: 'व्हीआयपी ग्राहक २०% कूपन',
      hi: 'वीआईपी ग्राहक २०% कूपन',
      en: 'VIP Customer 20% Special'
    },
    description: {
      mr: '₹१०,००० च्या पुढील भव्य बिलावर २०% मोठी सवलत',
      hi: '₹१०,००० से अधिक बिल पर २०% विशेष छूट',
      en: '20% mega discount on billing above ₹10,000'
    },
    offerType: 'coupon',
    discountType: 'percentage',
    discountValue: 20,
    minimumAmount: 10000,
    maximumDiscount: 3000,
    startDate: `${currentYear}-01-01`,
    endDate: `${currentYear + 1}-12-31`,
    stackingAllowed: false,
    usageLimit: 50,
    usageCount: 6,
    active: true
  }
];

async function seedFirestore() {
  console.log("=============================================================");
  console.log("PRATIK PHATAKE (प्रतीक फटाके) — Firestore Database Seeder");
  console.log("Connecting to Cloud Firestore project:", firebaseConfig.projectId);
  console.log("=============================================================");

  try {
    // 1. Delete test document
    try {
      await deleteDoc(doc(db, 'products', 'prod-test-connection'));
    } catch (e) {
      // ignore
    }

    // 2. Categories
    console.log("\n-> Seeding Categories...");
    const categories = demoData.getCategories();
    for (const cat of categories) {
      await setDoc(doc(db, 'categories', cat.id), cat);
      console.log(`   + Category: [${cat.id}] ${cat.name.mr} (${cat.name.en})`);
    }

    // 3. Products
    console.log("\n-> Seeding Fireworks Products Catalog...");
    const products = demoData.getProducts();
    for (const prod of products) {
      await setDoc(doc(db, 'products', prod.id), prod);
      console.log(`   + Product: [${prod.sku}] ${prod.name.mr} - MRP ₹${prod.retailPrice}`);
    }

    // 4. Banners
    console.log("\n-> Seeding Promotional Banners...");
    const banners = demoData.getBanners();
    for (const ban of banners) {
      await setDoc(doc(db, 'banners', ban.id), ban);
      console.log(`   + Banner: [${ban.id}] ${ban.title.mr}`);
    }

    // 5. Offers & Discounts
    console.log("\n-> Seeding Offers & Coupons...");
    for (const off of offers) {
      await setDoc(doc(db, 'offers', off.id), off);
      console.log(`   + Offer: [${off.code}] ${off.title.mr}`);
    }

    // 6. Store Settings
    console.log("\n-> Seeding Store Settings...");
    const settings = demoData.getStoreSettings();
    await setDoc(doc(db, 'settings', 'store'), settings);
    console.log(`   + Settings: ${settings.businessNameMarathi} (${settings.licenseNumber})`);

    // 7. Demo Inquiries
    console.log("\n-> Seeding Sample Inquiries...");
    const inquiries = demoData.getDemoInquiries();
    for (const inq of inquiries) {
      await setDoc(doc(db, 'inquiries', inq.id), inq);
      console.log(`   + Inquiry: [${inq.inquiryNumber}] ${inq.customerName}`);
    }

    // 8. Inventory Movements
    console.log("\n-> Seeding Inventory Movements...");
    const movements = demoData.getDemoInventoryMovements();
    for (const mov of movements) {
      await setDoc(doc(db, 'inventoryMovements', mov.id), mov);
      console.log(`   + Movement: [${mov.id}] ${mov.productName} (${mov.movementType} ${mov.quantityChange})`);
    }

    // 9. Users
    console.log("\n-> Seeding Store Staff & User Profiles...");
    const users = demoData.getDemoUsers();
    for (const u of users) {
      await setDoc(doc(db, 'users', u.uid), u);
      console.log(`   + User: [${u.role}] ${u.displayName} (${u.email})`);
    }

    // 10. Verification of Live Firestore Collections
    console.log("\n=============================================================");
    console.log("Verifying Live Cloud Firestore collections count:");
    const prodSnap = await getDocs(collection(db, 'products'));
    const catSnap = await getDocs(collection(db, 'categories'));
    const banSnap = await getDocs(collection(db, 'banners'));
    const offSnap = await getDocs(collection(db, 'offers'));
    const inqSnap = await getDocs(collection(db, 'inquiries'));
    const movSnap = await getDocs(collection(db, 'inventoryMovements'));
    const usrSnap = await getDocs(collection(db, 'users'));

    console.log(`   Products in Firestore:            ${prodSnap.size}`);
    console.log(`   Categories in Firestore:          ${catSnap.size}`);
    console.log(`   Banners in Firestore:             ${banSnap.size}`);
    console.log(`   Offers in Firestore:              ${offSnap.size}`);
    console.log(`   Inquiries in Firestore:           ${inqSnap.size}`);
    console.log(`   Inventory Movements in Firestore: ${movSnap.size}`);
    console.log(`   Users in Firestore:               ${usrSnap.size}`);
    console.log("=============================================================");
    console.log("ALL FIREBASE FIRESTORE DATA SUCCESSFULLY STORED & LIVE!");
    process.exit(0);
  } catch (err) {
    console.error("Firestore seeding error:", err);
    process.exit(1);
  }
}

seedFirestore();
