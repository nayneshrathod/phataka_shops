import { Injectable } from '@angular/core';
import { Product, Category, Banner, Inquiry, InventoryMovement, UserProfile, StoreSettings } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class DemoDataService {
  getCategories(): Category[] {
    return [
      {
        id: 'cat-sparklers',
        slug: 'sparklers',
        name: { mr: 'फुलबाज्या', hi: 'फूलझड़ियां', en: 'Sparklers' },
        description: {
          mr: 'सुरक्षित आणि मनमोहक रंगीबेरंगी फुलबाज्या - मुलांसाठी व कुटुंबासाठी आदर्श.',
          hi: 'सुरक्षित और मनमोहक रंगीन फूलझड़ियां - बच्चों और परिवार के लिए उपयुक्त।',
          en: 'Sparkling joy with low smoke and vibrant golden, silver and color sparks.'
        },
        image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&auto=format&fit=crop&q=80',
        sortOrder: 1,
        active: true
      },
      {
        id: 'cat-chakkars',
        slug: 'ground-chakkars',
        name: { mr: 'भुईचक्र', hi: 'जमीनी चकरी', en: 'Ground Chakkars' },
        description: {
          mr: 'जमिनीवर वेगाने फिरणारे तेजस्वी चक्र आणि सुवर्ण किरणे.',
          hi: 'जमीन पर तेजी से घूमने वाले सुनहरे और रंगीन चक्र।',
          en: 'Spinning wheels throwing majestic showers of golden and silver embers.'
        },
        image: 'https://images.unsplash.com/photo-1543877087-eb71552097c2?w=600&auto=format&fit=crop&q=80',
        sortOrder: 2,
        active: true
      },
      {
        id: 'cat-flowerpots',
        slug: 'flower-pots',
        name: { mr: 'अनार / झाड', hi: 'अनार / फव्वारा', en: 'Flower Pots' },
        description: {
          mr: 'आकाशात उंच उसळणारे रंगीबेरंगी कारंजे आणि लखलखाट.',
          hi: 'ऊंचाई तक उठने वाले खूबसूरत सुनहरे और बहुरंगी फव्वारे।',
          en: 'Towering fountains rising into the night sky with brilliant glitter.'
        },
        image: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=600&auto=format&fit=crop&q=80',
        sortOrder: 3,
        active: true
      },
      {
        id: 'cat-fountains',
        slug: 'fountain-fireworks',
        name: { mr: 'रंगीबेरंगी कारंजे', hi: 'कलर फाउंटेन', en: 'Fountain Cones' },
        description: {
          mr: 'मल्टिकलर लेयर कारंजे व जादूई रोषणाई प्रभाव.',
          hi: 'रंग-बिरंगी परतों वाले विशेष फाउंटेन और प्रकाश प्रभाव।',
          en: 'Multi-stage color changing fountains with crackling silver whistle effects.'
        },
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&auto=format&fit=crop&q=80',
        sortOrder: 4,
        active: true
      },
      {
        id: 'cat-skyshots',
        slug: 'sky-shots',
        name: { mr: 'स्काय शॉट्स', hi: 'आकाशीय शॉट्स', en: 'Sky Shots & Aerials' },
        description: {
          mr: 'आकाशात जाऊन फुटणारे भव्य रोषणाईचे नयनरम्य शॉट्स.',
          hi: 'आसमान में बिखरने वाले शानदार रंगीन आकाशीय दृश्य।',
          en: 'High-altitude aerial fireworks delivering spectacular panoramic night sky bursts.'
        },
        image: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&auto=format&fit=crop&q=80',
        sortOrder: 5,
        active: true
      },
      {
        id: 'cat-assortments',
        slug: 'assortment-packs',
        name: { mr: 'कौटुंबिक कॉम्बो बॉक्स', hi: 'फैमिली गिफ्ट पैक', en: 'Family Assortment Gift Boxes' },
        description: {
          mr: 'संपूर्ण कुटुंबाच्या आनंदासाठी सर्व प्रकारच्या फटाक्यांचा परिपूर्ण संच.',
          hi: 'पूरे परिवार के आनंद के लिए सभी पटाखों का संपूर्ण उपहार सेट।',
          en: 'Comprehensive curated gift hampers packed with varieties for the whole family.'
        },
        image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
        sortOrder: 6,
        active: true
      },
      {
        id: 'cat-greencrackers',
        slug: 'green-crackers',
        name: { mr: 'अधिकृत हरित फटाके', hi: 'प्रमाणित हरित पटाखे', en: 'Certified Green Crackers' },
        description: {
          mr: 'CSIR-NEERI मान्यताप्राप्त ३०% कमी धूर व प्रदूषण निर्माण करणारे अधिकृत फटाके.',
          hi: 'CSIR-NEERI अनुमोदित 30% कम धुआं और कम उत्सर्जन वाले अधिकृत पटाखे।',
          en: 'Eco-conscious formulations with reduced particulate emissions and green QR tags.'
        },
        image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=600&auto=format&fit=crop&q=80',
        sortOrder: 7,
        active: true
      },
      {
        id: 'cat-novelty',
        slug: 'novelty-kids',
        name: { mr: 'मुलांसाठी सुरक्षित फॅन्सी फटाके', hi: 'बच्चों के फैंसी पटाखे', en: 'Kids & Novelty Series' },
        description: {
          mr: 'पॉप-पॉप, रोल कॅप्स, साप गोळी, आणि कमी आवाजाचे सुरक्षित खेळणे.',
          hi: 'पॉप-पॉप, रोल कैप्स, सांप गोली और कम आवाज वाले सुरक्षित खिलौने।',
          en: 'Fun, sparkler-safe novelties, popping strips, and soundless visual toys.'
        },
        image: 'https://images.unsplash.com/photo-1576267423048-15c0040fec78?w=600&auto=format&fit=crop&q=80',
        sortOrder: 8,
        active: true
      }
    ];
  }

  getProducts(): Product[] {
    return [
      // 1. Sparklers
      {
        id: 'prod-spk-10cm-gold',
        sku: 'SPK-10-GLD',
        slug: '10cm-electric-gold-sparklers',
        name: {
          mr: '१० सेमी इलेक्ट्रिक गोल्ड फुलबाज्या (१० नग)',
          hi: '10 सेमी इलेक्ट्रिक गोल्ड फूलझड़ी (10 नग)',
          en: '10cm Electric Golden Sparklers (Pack of 10)'
        },
        description: {
          mr: 'लहान मुलांसाठी अत्यंत सुरक्षित, कमी धूर निर्माण करणाऱ्या सोनेरी किरणांच्या फुलबाज्या.',
          hi: 'बच्चों के लिए सुरक्षित, कम धुएं वाली सुनहरी चमक देने वाली फूलझड़ियां।',
          en: 'Classic golden sparks with minimal smoke, safe for kids under adult supervision.'
        },
        categoryId: 'cat-sparklers',
        categoryName: 'Sparklers',
        images: ['https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 65,
        costPrice: 42,
        stockQuantity: 450,
        lowStockThreshold: 50,
        manufacturer: 'Standard Fireworks Sivakasi',
        safetyInformation: {
          mr: 'हातात सरळ धरावे, चेहऱ्यापासून व कपड्यांपासून सुरक्षित अंतर ठेवावे. विझल्यावर पाण्यात टाकावे.',
          hi: 'हाथ में सीधा पकड़ें, चेहरे और कपड़ों से दूरी रखें। बुझने पर पानी में डालें।',
          en: 'Hold at arm\'s length. Point away from clothing and body. Plunge spent wires into water.'
        },
        soundLevel: 'Soundless (Light only)',
        visualEffect: 'Golden Electric Glitter',
        piecesPerBox: 10,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-SPK01',
        featured: true,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },
      {
        id: 'prod-spk-15cm-color',
        sku: 'SPK-15-CLR',
        slug: '15cm-tri-color-sparklers',
        name: {
          mr: '१५ सेमी तिरंगा रंगीबेरंगी फुलबाज्या (१० नग)',
          hi: '15 सेमी तिरंगा बहुरंगी फूलझड़ी (10 नग)',
          en: '15cm Tri-Color Sparklers (Pack of 10)'
        },
        description: {
          mr: 'लाल, हिरवे आणि पिवळे रंग बदलणाऱ्या खास तिरंगा फुलबाज्या.',
          hi: 'लाल, हरे और सुनहरे रंग में बदलने वाली विशेष तिरंगा फूलझड़ियां।',
          en: 'Color-shifting sparks that alternate between emerald green, ruby red, and gold.'
        },
        categoryId: 'cat-sparklers',
        categoryName: 'Sparklers',
        images: ['https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 120,
        costPrice: 78,
        stockQuantity: 320,
        lowStockThreshold: 40,
        manufacturer: 'Sri Kaliswari Fireworks',
        safetyInformation: {
          mr: 'फक्त खुल्या हवेत वापरा. लहान मुलांना मोठ्यांच्या देखरेखीखालीच द्या.',
          hi: 'केवल खुली हवा में इस्तेमाल करें। बच्चों को बड़ों की निगरानी में ही दें।',
          en: 'Use strictly outdoors in open area. Supervise children closely.'
        },
        soundLevel: 'Soundless (Light only)',
        visualEffect: 'Tri-Color Chromatic Sparks',
        piecesPerBox: 10,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-SPK02',
        featured: false,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },
      {
        id: 'prod-spk-30cm-mega',
        sku: 'SPK-30-MGA',
        slug: '30cm-mega-jumbo-gold-sparklers',
        name: {
          mr: '३० सेमी मेगा जंबो गोल्ड फुलबाज्या (५ नग)',
          hi: '30 सेमी मेगा जंबो गोल्ड फूलझड़ी (5 नग)',
          en: '30cm Mega Jumbo Golden Sparklers (5 Pcs)'
        },
        description: {
          mr: 'दीर्घकाळ चालणाऱ्या ३० सेमी लांबीच्या भव्य सोनेरी फुलबाज्या.',
          hi: 'लंबे समय तक जलने वाली 30 सेमी लंबी मनमोहक सुनहरी फूलझड़ियां।',
          en: 'Long-duration burn delivering 3+ minutes of intense golden aura.'
        },
        categoryId: 'cat-sparklers',
        categoryName: 'Sparklers',
        images: ['https://images.unsplash.com/photo-1543877087-eb71552097c2?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 180,
        costPrice: 115,
        stockQuantity: 180,
        lowStockThreshold: 30,
        manufacturer: 'Coronation Fireworks',
        safetyInformation: {
          mr: 'लांब तारा असल्याने व्यवस्थित पकडावे. पेटवल्यानंतर जमिनीवर फेकू नये.',
          hi: 'लंबा तार है, मजबूती से पकड़ें। जलने के बाद जमीन पर न फेंकें।',
          en: 'Hold firmly at handle end. Do not discard hot wire on flammable surfaces.'
        },
        soundLevel: 'Soundless (Light only)',
        visualEffect: 'Long Burning Golden Halo',
        piecesPerBox: 5,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-SPK03',
        featured: true,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },

      // 2. Ground Chakkars
      {
        id: 'prod-chk-deluxe-10',
        sku: 'CHK-DLX-10',
        slug: 'ground-chakkar-deluxe',
        name: {
          mr: 'डिलक्स भुईचक्र (१० नग)',
          hi: 'डीलक्स जमीनी चकरी (10 नग)',
          en: 'Deluxe Ground Chakkars (10 Pcs)'
        },
        description: {
          mr: 'जमिनीवर वेगाने गोल फिरणारे आणि सुवर्णकिरणांचे वर्तुळ तयार करणारे लोकप्रिय भुईचक्र.',
          hi: 'जमीन पर तेजी से चक्कर लगाने वाली सुनहरी रोशनी की चकरी।',
          en: 'High-rpm ground spinners producing brilliant rotating wheels of golden light.'
        },
        categoryId: 'cat-chakkars',
        categoryName: 'Ground Chakkars',
        images: ['https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 160,
        costPrice: 105,
        stockQuantity: 280,
        lowStockThreshold: 35,
        manufacturer: 'Standard Fireworks Sivakasi',
        safetyInformation: {
          mr: 'सपाट जमिनीवर ठेवून अगरबत्तीने पेटवावे आणि किमान ५ मीटर दूर उभे राहावे.',
          hi: 'समतल जमीन पर रखकर अगरबत्ती से जलाएं और 5 मीटर दूरी बनाएं।',
          en: 'Place on flat concrete. Light with incense stick and retreat 5 meters.'
        },
        soundLevel: 'Low',
        visualEffect: 'Whirling Golden Wheel',
        piecesPerBox: 10,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-CHK01',
        featured: true,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },
      {
        id: 'prod-chk-special-zamin',
        sku: 'CHK-SPC-ZMN',
        slug: 'special-zamin-chakkar-big',
        name: {
          mr: 'स्पेशल मोठा जमीन चक्र (१० नग)',
          hi: 'स्पेशल बड़ा जमीन चकरी (10 नग)',
          en: 'Special Big Zamin Chakkar (10 Pcs)'
        },
        description: {
          mr: 'जास्त वेळ फिरणारे आणि लाल व हिरव्या ठिणग्या उधळणारे मोठे चक्र.',
          hi: 'लंबे समय तक घूमने वाली लाल और हरी चिंगारियां बिखेरने वाली चकरी।',
          en: 'Larger diameter wheel with dual-stage emerald and gold sparks.'
        },
        categoryId: 'cat-chakkars',
        categoryName: 'Ground Chakkars',
        images: ['https://images.unsplash.com/photo-1543877087-eb71552097c2?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 220,
        costPrice: 145,
        stockQuantity: 190,
        lowStockThreshold: 30,
        manufacturer: 'Sri Kaliswari Fireworks',
        safetyInformation: {
          mr: 'फक्त मोकळ्या जागेत वापरा, वाहनांनजीक किंवा कोरड्या गवतात पेटवू नका.',
          hi: 'खुले स्थान पर उपयोग करें, वाहनों या सूखे घास के निकट न जलाएं।',
          en: 'Clear surrounding perimeter of flammable material before lighting.'
        },
        soundLevel: 'Low',
        visualEffect: 'Dual-color spinning vortex',
        piecesPerBox: 10,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-CHK02',
        featured: false,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },
      {
        id: 'prod-chk-spinning-flower',
        sku: 'CHK-SPN-FLW',
        slug: 'spinning-flower-chakkar',
        name: {
          mr: 'फ्लॉवर फिरकी चक्र (५ नग)',
          hi: 'फ्लावर फिरकी चकरी (5 नग)',
          en: 'Spinning Flower Whistling Wheel (5 Pcs)'
        },
        description: {
          mr: 'हळूवार शिटीचा मंजुळ नाद आणि फुलासारखा उमलणारा प्रकाश प्रभाव.',
          hi: 'मधुर सीटी की आवाज और फूल जैसा खिलने वाला प्रकाश प्रभाव।',
          en: 'Audible musical whistle combined with floral fountain burst upon spin.'
        },
        categoryId: 'cat-chakkars',
        categoryName: 'Ground Chakkars',
        images: ['https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 280,
        costPrice: 185,
        stockQuantity: 110,
        lowStockThreshold: 20,
        manufacturer: 'Coronation Fireworks',
        safetyInformation: {
          mr: 'फिरताना अंगावर येणार नाही याची दक्षता घ्या. सपाट जमिनीवरच पेटवा.',
          hi: 'घूमते समय सावधानी रखें। समतल जमीन पर ही जलाएं।',
          en: 'Ensure level surface so spinner does not tilt or migrate during burn.'
        },
        soundLevel: 'Low',
        visualEffect: 'Whistling Floral Flare',
        piecesPerBox: 5,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-CHK03',
        featured: false,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },

      // 3. Flower Pots (अनार)
      {
        id: 'prod-flp-gold-deluxe',
        sku: 'FLP-GLD-DLX',
        slug: 'flower-pot-gold-deluxe',
        name: {
          mr: 'अनार डिलक्स सुवर्ण झाड (१० नग)',
          hi: 'अनार डीलक्स गोल्डन फाउंटेन (10 नग)',
          en: 'Flower Pot Gold Deluxe (Pack of 10)'
        },
        description: {
          mr: '१० फूट उंचीपर्यंत उसळणारे सोनेरी तुषार आणि प्रकाश झाड.',
          hi: '10 फीट की ऊंचाई तक उठने वाला सुनहरी फव्वारा।',
          en: 'Magnificent 10-foot vertical golden shower with crackling embers.'
        },
        categoryId: 'cat-flowerpots',
        categoryName: 'Flower Pots',
        images: ['https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 240,
        costPrice: 155,
        stockQuantity: 340,
        lowStockThreshold: 40,
        manufacturer: 'Standard Fireworks Sivakasi',
        safetyInformation: {
          mr: 'अनार सरळ जमिनीवर ठेवावा. तोंड थेट अनारावर ठेवून पेटवू नये. बाजूने अगरबत्ती लावावी.',
          hi: 'अनार को सीधा रखें। चेहरा ऊपर न रखें, किनारे से अगरबत्ती लगाएं।',
          en: 'Never lean over top while lighting. Light fuse from side at arm\'s length.'
        },
        soundLevel: 'Low',
        visualEffect: 'Towering Golden Cascades',
        piecesPerBox: 10,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-FLP01',
        featured: true,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },
      {
        id: 'prod-flp-tri-color-jumbo',
        sku: 'FLP-TRI-JMB',
        slug: 'flower-pot-tri-color-jumbo',
        name: {
          mr: 'अनार जंबो तिरंगा फव्वारा (५ नग)',
          hi: 'अनार जंबो तिरंगा फाउंटेन (5 नग)',
          en: 'Flower Pot Tri-Color Jumbo (Pack of 5)'
        },
        description: {
          mr: '१५ फूट उंची, सुरुवातीला लाल, मग पांढरा आणि शेवटी हिरवा प्रकाश देणारे मोठे झाड.',
          hi: '15 फीट ऊंचाई, पहले लाल फिर सफेद और अंत में हरा प्रकाश देने वाला जंबो अनार।',
          en: 'High-reach 15ft tri-stage chromatic transition with glittering crown.'
        },
        categoryId: 'cat-flowerpots',
        categoryName: 'Flower Pots',
        images: ['https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 380,
        costPrice: 250,
        stockQuantity: 160,
        lowStockThreshold: 25,
        manufacturer: 'Sri Kaliswari Fireworks',
        safetyInformation: {
          mr: 'किमान ७ मीटर सुरक्षित अंतर ठेवावे. वर कोणतेही झाड किंवा विजेच्या तारा नसाव्यात.',
          hi: 'कम से कम 7 मीटर दूरी रखें। ऊपर पेड़ या बिजली के तार न हों।',
          en: 'Verify clear overhead clearance free of eaves, branches, or wires.'
        },
        soundLevel: 'Low',
        visualEffect: 'Tri-Color High Altitude Eruption',
        piecesPerBox: 5,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-FLP02',
        featured: true,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },
      {
        id: 'prod-flp-koti-ashoka',
        sku: 'FLP-KOT-ASH',
        slug: 'ashoka-koti-flowerpot',
        name: {
          mr: 'अशोका कोटी अनार (१० नग)',
          hi: 'अशोका कोटी अनार (10 नग)',
          en: 'Ashoka Koti Classical Flowerpot (10 Pcs)'
        },
        description: {
          mr: 'पारंपरिक आणि मनपसंत अशोका अनार, शांत व मंद सोनेरी रोषणाई.',
          hi: 'पारंपरिक और लोकप्रिय अशोका अनार, शांत एवं खूबसूरत सुनहरी रोशनी।',
          en: 'Traditional calm silver-gold weeping willow fountain effect.'
        },
        categoryId: 'cat-flowerpots',
        categoryName: 'Flower Pots',
        images: ['https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 190,
        costPrice: 125,
        stockQuantity: 220,
        lowStockThreshold: 30,
        manufacturer: 'Meena Fireworks',
        safetyInformation: {
          mr: 'सपाट जमिनीवर उभा करून पेटवावा.',
          hi: 'समतल जमीन पर सीधा खड़ा करके जलाएं।',
          en: 'Ensure stable vertical orientation on firm surface.'
        },
        soundLevel: 'Soundless (Light only)',
        visualEffect: 'Silver Willows',
        piecesPerBox: 10,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-FLP03',
        featured: false,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },

      // 4. Fountain Fireworks
      {
        id: 'prod-fnt-peacock-cone',
        sku: 'FNT-PCK-01',
        slug: 'dancing-peacock-fountain',
        name: {
          mr: 'डान्सिंग पिकॉक फव्वारा (२ नग)',
          hi: 'डांसिंग पीकॉक फाउंटेन (2 नग)',
          en: 'Dancing Peacock Majestic Fountain (Pair)'
        },
        description: {
          mr: 'मोराच्या पिसाऱ्यासारखे बहुरंगी आणि विलोभनीय कारंजे, हिरवा, निळा आणि सोनेरी रंग.',
          hi: 'मोरपंख जैसा बहुरंगी और सुंदर फाउंटेन - हरा, नीला और सुनहरा रंग।',
          en: 'Peacock plume shaped broad spread fan fountain in peacock hues.'
        },
        categoryId: 'cat-fountains',
        categoryName: 'Fountain Fireworks',
        images: ['https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 320,
        costPrice: 210,
        stockQuantity: 85,
        lowStockThreshold: 15,
        manufacturer: 'Standard Fireworks Sivakasi',
        safetyInformation: {
          mr: 'खुल्या आवारात ठेवावे, लहान मुले किमान १० फूट दूर असावीत.',
          hi: 'खुले आंगन में रखें, बच्चों को 10 फीट की दूरी पर रखें।',
          en: 'Wide perimeter required due to fan-out plume dispersion.'
        },
        soundLevel: 'Low',
        visualEffect: 'Peacock Plume Fan Burst',
        piecesPerBox: 2,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-FNT01',
        featured: true,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },
      {
        id: 'prod-fnt-crackle-volcano',
        sku: 'FNT-VLC-02',
        slug: 'crackling-volcano-cone',
        name: {
          mr: 'क्रॅकलिंग व्होल्कॅनो कोन (३ नग)',
          hi: 'क्रैकिंग ज्वालामुखी कोन (3 नग)',
          en: 'Crackling Volcano Fountain Cone (3 Pcs)'
        },
        description: {
          mr: 'ज्वालामुखीसारखा उसळणारा प्रकाश आणि कुरकुरीत चुरचुर आवाज.',
          hi: 'ज्वालामुखी जैसा उछलता प्रकाश और मधुर चटकने की आवाज।',
          en: 'Volcanic intensity cone fountain with crackling silver micro-stars.'
        },
        categoryId: 'cat-fountains',
        categoryName: 'Fountain Fireworks',
        images: ['https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 290,
        costPrice: 190,
        stockQuantity: 95,
        lowStockThreshold: 20,
        manufacturer: 'Coronation Fireworks',
        safetyInformation: {
          mr: 'पेटवल्यानंतर त्वरित मागे व्हावे.',
          hi: 'जलाने के तुरंत बाद सुरक्षित पीछे हटें।',
          en: 'Retreat 6 meters immediately upon ignition.'
        },
        soundLevel: 'Medium',
        visualEffect: 'Silver Crackling Stars',
        piecesPerBox: 3,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-FNT02',
        featured: false,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },

      // 5. Sky Shots & Aerials
      {
        id: 'prod-sky-12-shot-color',
        sku: 'SKY-12-REP',
        slug: '12-shots-multicolor-aerial-repeater',
        name: {
          mr: '१२ शॉट्स मल्टीकलर स्काय रिपीटर (१ बॉक्स)',
          hi: '12 शॉट्स बहुरंगी आकाशीय रिपीटर (1 बॉक्स)',
          en: '12 Shots Multi-Color Aerial Cake'
        },
        description: {
          mr: 'एकदा पेटवल्यावर आकाशात एकापाठोपाठ १२ भव्य रंगीबेरंगी स्फोट आणि चांदण्यांचा पाऊस.',
          hi: 'एक बार जलाने पर आसमान में लगातार 12 शानदार रंगीन धमाके और तारों की बारिश।',
          en: 'Continuous 12-burst aerial cake illuminating the night sky with multicolored brocades.'
        },
        categoryId: 'cat-skyshots',
        categoryName: 'Sky Shots & Aerials',
        images: ['https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 650,
        costPrice: 420,
        stockQuantity: 140,
        lowStockThreshold: 25,
        manufacturer: 'Standard Fireworks Sivakasi',
        safetyInformation: {
          mr: 'फक्त मोकळ्या मैदानात वापरा. बॉक्सच्या आजूबाजूला विटा किंवा दगड लावून स्थिर करा. इमारतींपासून २० मीटर दूर असावे.',
          hi: 'केवल खुले मैदान में उपयोग करें। बॉक्स को ईंटों से सहारा देकर स्थिर करें। इमारतों से 20 मीटर दूर रहें।',
          en: 'Secure base with bricks on level ground. Keep 20+ meters clearance from buildings.'
        },
        soundLevel: 'Medium',
        visualEffect: '12-Shot Brocade Crown & Palms',
        piecesPerBox: 1,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-SKY01',
        featured: true,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },
      {
        id: 'prod-sky-30-shot-glory',
        sku: 'SKY-30-GLR',
        slug: '30-shots-night-glory-mega-cake',
        name: {
          mr: '३० शॉट्स नाईट ग्लोरी मेगा स्काय शो',
          hi: '30 शॉट्स नाइट ग्लोरी मेगा आकाशीय शो',
          en: '30 Shots Night Glory Mega Sky Cake'
        },
        description: {
          mr: 'दिवाळीच्या रात्रीसाठी राजेशाही स्काय शो. ३० सेकंदांत ३० विविध रंगांचे व आकारांचे आकाशीय तुषार.',
          hi: 'दिवाली की रात के लिए भव्य शो। 30 विभिन्न रंगों और आकृतियों के आकाशीय नजारे।',
          en: 'Premier 30-burst celebratory display featuring chrysanthemums, willows, and pistils.'
        },
        categoryId: 'cat-skyshots',
        categoryName: 'Sky Shots & Aerials',
        images: ['https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 1450,
        costPrice: 950,
        stockQuantity: 65,
        lowStockThreshold: 15,
        manufacturer: 'Coronation Fireworks',
        safetyInformation: {
          mr: 'कडक सुरक्षा नियमांचे पालन करा. पाठीमागे १५ मीटर अंतरावर उभे राहा.',
          hi: 'सुरक्षा नियमों का पालन करें। कम से कम 15 मीटर दूर खड़े हों।',
          en: 'Professional outdoor cake. Ensure spectator distance of at least 15 meters.'
        },
        soundLevel: 'Medium',
        visualEffect: 'Synchronized Grand Aerial Finale',
        piecesPerBox: 1,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-SKY02',
        featured: true,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },
      {
        id: 'prod-sky-single-shot-thunder',
        sku: 'SKY-SGL-THN',
        slug: 'single-shot-aerial-chrysanthemum',
        name: {
          mr: 'सिंगल स्काय शॉट क्रायसॅन्थेमम (५ पाईप)',
          hi: 'सिंगल स्काई शॉट गुलदाउदी (5 पाइप)',
          en: 'Single Sky Shot Chrysanthemum (Pack of 5)'
        },
        description: {
          mr: 'आकाशात १०० फूट उंचीवर जाऊन विशाल फुलासारखा फुटणारा स्वतंत्र शॉट.',
          hi: 'आसमान में 100 फीट ऊपर जाकर विशाल फूल की तरह खिलने वाला शॉट।',
          en: 'High-flying single tubes deploying enormous glittering floral peony patterns.'
        },
        categoryId: 'cat-skyshots',
        categoryName: 'Sky Shots & Aerials',
        images: ['https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 320,
        costPrice: 210,
        stockQuantity: 120,
        lowStockThreshold: 20,
        manufacturer: 'Sri Kaliswari Fireworks',
        safetyInformation: {
          mr: 'पाईप जमिनीत किंवा वाळूच्या कुंडीत उभी ठेवावी. हातात धरून पेटवू नये.',
          hi: 'पाइप को रेत में सीधा गाड़कर जलाएं। हाथ में पकड़कर कभी न जलाएं।',
          en: 'Anchor launch tube in bucket of sand. NEVER hold in hand.'
        },
        soundLevel: 'Medium',
        visualEffect: 'Golden Chrysanthemum Burst',
        piecesPerBox: 5,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-SKY03',
        featured: false,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },

      // 6. Family Assortments
      {
        id: 'prod-ast-shubh-diwali',
        sku: 'AST-SHB-01',
        slug: 'shubh-diwali-family-gift-box',
        name: {
          mr: 'शुभ दिवाळी फॅमिली गिफ्ट बॉक्स (२५ आयटम्स)',
          hi: 'शुभ दिवाली फैमिली गिफ्ट बॉक्स (25 आइटम्स)',
          en: 'Shubh Diwali Family Gift Box (25 Items Curated)'
        },
        description: {
          mr: 'लहान मुलांच्या फुलबाज्या, अनार, चक्र, कारंजे आणि आकर्षक फटाक्यांचा परिपूर्ण २५ वस्तूंचा बॉक्स.',
          hi: 'बच्चों की फूलझड़ियां, अनार, चकरी और फैंसी पटाखों का सम्पूर्ण 25 वस्तुओं का सुंदर पैक।',
          en: 'Family package containing handpicked sparklers, ground wheels, flowerpots and fancy toys.'
        },
        categoryId: 'cat-assortments',
        categoryName: 'Family Assortment Gift Boxes',
        images: ['https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 1250,
        costPrice: 850,
        stockQuantity: 95,
        lowStockThreshold: 15,
        manufacturer: 'Standard Fireworks Sivakasi',
        safetyInformation: {
          mr: 'प्रत्येक फटाक्यावरील सूचना स्वतंत्रपणे वाचूनच वापरा. सुरक्षित जागेत साठवून ठेवा.',
          hi: 'प्रत्येक पटाखे पर लिखे निर्देश पढ़कर ही उपयोग करें। सूखी जगह पर रखें।',
          en: 'Store in cool, dry location. Follow safety instructions enclosed on each item.'
        },
        soundLevel: 'Low',
        visualEffect: 'Mixed Celebration Hamper',
        piecesPerBox: 25,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-AST01',
        featured: true,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },
      {
        id: 'prod-ast-maharaja-royal',
        sku: 'AST-MAH-02',
        slug: 'maharaja-royal-celebration-hamper',
        name: {
          mr: 'महाराजा रॉयल सेलिब्रेशन हॅम्पर (४५ आयटम्स)',
          hi: 'महाराजा रॉयल सेलिब्रेशन हैंपर (45 आइटम्स)',
          en: 'Maharaja Royal Celebration Mega Hamper (45 Items)'
        },
        description: {
          mr: 'मोठ्या कुटुंबांसाठी आणि सोसायट्यांसाठी भव्य ४५ उत्पादनांचा महासंच. स्काय शॉट्स सह.',
          hi: 'बड़े परिवारों और उत्सवों के लिए 45 प्रीमियम उत्पादों का महासंग्रह। स्काई शॉट्स सहित।',
          en: 'Grand celebratory festival trunk packed with top-shelf aerials and premium family classics.'
        },
        categoryId: 'cat-assortments',
        categoryName: 'Family Assortment Gift Boxes',
        images: ['https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 2850,
        costPrice: 1950,
        stockQuantity: 40,
        lowStockThreshold: 10,
        manufacturer: 'Standard Fireworks Sivakasi',
        safetyInformation: {
          mr: 'कोरड्या व हवेशीर जागी ठेवा. उष्णतेपासून लांब ठेवा.',
          hi: 'सूखी और हवादार जगह पर रखें। गर्मी से दूर रखें।',
          en: 'Keep away from sparks, open flames, and heat sources.'
        },
        soundLevel: 'Medium',
        visualEffect: 'Comprehensive Royal Experience',
        piecesPerBox: 45,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-AST02',
        featured: true,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },
      {
        id: 'prod-ast-kids-delight',
        sku: 'AST-KID-03',
        slug: 'kids-delight-soundless-pack',
        name: {
          mr: 'किड्स डिलाईट विनाआवाज संच (१५ आयटम्स)',
          hi: 'किड्स डिलाइट ध्वनि-मुक्त सेट (15 आइटम्स)',
          en: 'Kids Delight Low-Noise / Soundless Pack (15 Items)'
        },
        description: {
          mr: 'कोणताही कर्कश आवाज नसलेला, केवळ प्रकाश, रंग आणि रोषणाई असलेला मुलांसाठीचा सुरक्षित संच.',
          hi: 'बिना किसी तेज आवाज का, केवल सुंदर रोशनी और रंगों वाला बच्चों का सुरक्षित पैक।',
          en: 'Pet and child friendly soundless celebration box emphasizing colorful light patterns.'
        },
        categoryId: 'cat-assortments',
        categoryName: 'Family Assortment Gift Boxes',
        images: ['https://images.unsplash.com/photo-1576267423048-15c0040fec78?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 750,
        costPrice: 500,
        stockQuantity: 115,
        lowStockThreshold: 20,
        manufacturer: 'Coronation Fireworks',
        safetyInformation: {
          mr: 'लहान मुलांच्या हाती देताना मोठ्यांचे मार्गदर्शन आवश्यक.',
          hi: 'बच्चों को देते समय बड़ों का मार्गदर्शन जरूरी।',
          en: 'Adult supervision required for all activities.'
        },
        soundLevel: 'Soundless (Light only)',
        visualEffect: 'Sparkling Colors & Novelties',
        piecesPerBox: 15,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-AST03',
        featured: false,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },

      // 7. Green Crackers
      {
        id: 'prod-grn-swas-maroon',
        sku: 'GRN-SWS-MRN',
        slug: 'swas-certified-green-maroon',
        name: {
          mr: 'SWAS प्रमाणित हरित मरुण फटाका (५ नग)',
          hi: 'SWAS प्रमाणित हरित मरून पटाखा (5 नग)',
          en: 'SWAS Certified Green Safe Maroon (5 Pcs)'
        },
        description: {
          mr: 'NEERI-SWAS तंत्रज्ञान: धूर सोडण्याऐवजी पाण्याची वाफ निर्माण करून धूळ कमी करणारा परवानाधारक आवाज फटाका.',
          hi: 'NEERI-SWAS तकनीक: 30% कम उत्सर्जन और जलवाष्प आधारित सुरक्षित ग्रीन पटाखा।',
          en: 'CSIR-NEERI SWAS (Safe Water Releaser) formula suppressing particulate emissions.'
        },
        categoryId: 'cat-greencrackers',
        categoryName: 'Certified Green Crackers',
        images: ['https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 180,
        costPrice: 110,
        stockQuantity: 210,
        lowStockThreshold: 30,
        manufacturer: 'Standard Fireworks Sivakasi',
        safetyInformation: {
          mr: 'जमिनीवर ठेवून अगरबत्तीने पेटवा आणि किमान १० मीटर दूर जा.',
          hi: 'जमीन पर रखकर अगरबत्ती से सुलगाएं और 10 मीटर पीछे हटें।',
          en: 'Place on ground, light fuse, retreat 10 meters. Within PESO decibel limits.'
        },
        soundLevel: 'Medium',
        visualEffect: 'Crisp Sound Flash',
        piecesPerBox: 5,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-SWS01',
        featured: true,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },
      {
        id: 'prod-grn-star-neeri',
        sku: 'GRN-STR-02',
        slug: 'star-neeri-green-chilli',
        name: {
          mr: 'STAR तंत्रज्ञान ग्रीन लवंगी फटाके (१० पाकिटे)',
          hi: 'STAR तकनीक ग्रीन मिर्ची पटाखे (10 पैकेट)',
          en: 'STAR Low-Sulfur Certified Green Crackers (Pack of 10)'
        },
        description: {
          mr: 'कमी सल्फर व सुरक्षित फॉर्म्युला आधारित पारंपरिक आवाज फटाके.',
          hi: 'कम सल्फर और सुरक्षित फॉर्मूले पर आधारित हरित आवाज पटाखे।',
          en: 'Safe Thermite and eco-oxidizer formulation eliminating banned barium salts.'
        },
        categoryId: 'cat-greencrackers',
        categoryName: 'Certified Green Crackers',
        images: ['https://images.unsplash.com/photo-1543877087-eb71552097c2?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 150,
        costPrice: 95,
        stockQuantity: 310,
        lowStockThreshold: 45,
        manufacturer: 'Sri Kaliswari Fireworks',
        safetyInformation: {
          mr: 'फक्त मोकळ्या जागेत पेटवावे.',
          hi: 'केवल खुले मैदान में उपयोग करें।',
          en: 'Strictly for open outdoor ground use. Dispose remnants safely.'
        },
        soundLevel: 'Medium',
        visualEffect: 'Rapid Festive Spark & Sound',
        piecesPerBox: 10,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-STR02',
        featured: false,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },

      // 8. Kids & Novelty
      {
        id: 'prod-nov-pop-pop',
        sku: 'NOV-POP-01',
        slug: 'pop-pop-snappers-mega-pack',
        name: {
          mr: 'पॉप-पॉप मॅजिक स्नॅपर्स (१० बॉक्स)',
          hi: 'पॉप-पॉप मैजिक स्नैपर्स (10 बॉक्स)',
          en: 'Pop-Pop Magic Snappers (10 Boxes)'
        },
        description: {
          mr: 'फक्त जमिनीवर फेकल्यावर हलका आवाज करणारे मुलांचे सुरक्षित स्नॅपर्स. काडीपेटीची गरज नाही.',
          hi: 'जमीन पर फेंकते ही हल्की आवाज करने वाले बच्चों के सुरक्षित स्नैपर्स। माचिस की जरूरत नहीं।',
          en: 'Throwdown paper snaps that detonate safely on contact with hard surfaces. No flame needed.'
        },
        categoryId: 'cat-novelty',
        categoryName: 'Kids & Novelty Series',
        images: ['https://images.unsplash.com/photo-1576267423048-15c0040fec78?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 80,
        costPrice: 45,
        stockQuantity: 500,
        lowStockThreshold: 60,
        manufacturer: 'Standard Fireworks Sivakasi',
        safetyInformation: {
          mr: 'तोंडात घालू नये. लोकांवर किंवा प्राण्यांवर फेकू नये.',
          hi: 'मुंह में न डालें। लोगों या पशुओं पर न फेंकें।',
          en: 'Do not throw toward people or animals. Non-toxic friction snaps.'
        },
        soundLevel: 'Low',
        visualEffect: 'Tiny Snap',
        piecesPerBox: 50,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-NOV01',
        featured: true,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },
      {
        id: 'prod-nov-serpent-eggs',
        sku: 'NOV-SRP-02',
        slug: 'black-snake-serpent-tablets',
        name: {
          mr: 'काळा नाग साप गोळी (१० पाकिटे)',
          hi: 'काला सांप गोली (10 पैकेट)',
          en: 'Black Snake Serpent Tablets (10 Packs)'
        },
        description: {
          mr: 'पेटवल्यावर काळ्या सापासारखी वाढणारी सुरक्षित गोळी, मुलांचे आवडते आकर्षण.',
          hi: 'जलाने पर सांप की तरह बढ़ने वाली सुरक्षित गोली, बच्चों का मनपसंद खेल।',
          en: 'Classic growing serpent carbon pills burning gently without loud pop.'
        },
        categoryId: 'cat-novelty',
        categoryName: 'Kids & Novelty Series',
        images: ['https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 70,
        costPrice: 40,
        stockQuantity: 420,
        lowStockThreshold: 50,
        manufacturer: 'Meena Fireworks',
        safetyInformation: {
          mr: 'बाहेर मोकळ्या हवेत पेटवावे.',
          hi: 'बाहर खुली हवा में जलाएं।',
          en: 'Use outdoors on flat stone or concrete surface.'
        },
        soundLevel: 'Soundless (Light only)',
        visualEffect: 'Expanding Carbon Serpent',
        piecesPerBox: 10,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-NOV02',
        featured: false,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },
      {
        id: 'prod-nov-magic-butterfly',
        sku: 'NOV-BTF-03',
        slug: 'flying-magic-butterfly',
        name: {
          mr: 'उडणारे जादूई फुलपाखरू (१० नग)',
          hi: 'उड़ने वाली जादूई तितली (10 नग)',
          en: 'Flying Magic Butterfly Spinner (10 Pcs)'
        },
        description: {
          mr: 'जमिनीवरून गिरक्या घेत हवेत उडणारे रंगीबेरंगी फुलपाखरू.',
          hi: 'जमीन से उड़कर हवा में जाने वाली सुंदर रंगीन तितली।',
          en: 'Ascending novelty helicopter spinning upwards with emerald wings.'
        },
        categoryId: 'cat-novelty',
        categoryName: 'Kids & Novelty Series',
        images: ['https://images.unsplash.com/photo-1543877087-eb71552097c2?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 190,
        costPrice: 120,
        stockQuantity: 150,
        lowStockThreshold: 25,
        manufacturer: 'Coronation Fireworks',
        safetyInformation: {
          mr: 'उंच उडणारे असल्याने वर मोकळे आकाश असावे.',
          hi: 'ऊपर खुला आसमान होना चाहिए।',
          en: 'Ensure open overhead sky. Do not launch near balconies.'
        },
        soundLevel: 'Low',
        visualEffect: 'Ascending Wing Flare',
        piecesPerBox: 10,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-NOV03',
        featured: false,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },
      {
        id: 'prod-flp-color-koti',
        sku: 'FLP-CLR-KOT',
        slug: 'color-koti-flowerpot-box',
        name: {
          mr: 'कलर कोटी अनार (५ नग)',
          hi: 'कलर कोटी अनार (5 नग)',
          en: 'Color Koti Fountain Pack (5 Pcs)'
        },
        description: {
          mr: 'जांभळा, पिवळा व गुलाबी रंग उधळणारे खास अनार.',
          hi: 'बैंगनी, पीला और गुलाबी रंग बिखेरने वाला विशेष अनार।',
          en: 'Vibrant neon-hued violet, amber and pink fountain blooms.'
        },
        categoryId: 'cat-flowerpots',
        categoryName: 'Flower Pots',
        images: ['https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 260,
        costPrice: 170,
        stockQuantity: 130,
        lowStockThreshold: 20,
        manufacturer: 'Sri Kaliswari Fireworks',
        safetyInformation: {
          mr: 'सपाट जमिनीवर उभा करून पेटवावा.',
          hi: 'समतल जमीन पर सीधा खड़ा करके जलाएं।',
          en: 'Place vertically on flat surface away from drafts.'
        },
        soundLevel: 'Low',
        visualEffect: 'Neon Chromatic Fountain',
        piecesPerBox: 5,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-FLP04',
        featured: false,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },
      {
        id: 'prod-spk-col-50cm',
        sku: 'SPK-50-COL',
        slug: '50cm-giant-celebration-sparklers',
        name: {
          mr: '५० सेमी महाकाय सेलिब्रेशन फुलबाज्या (५ नग)',
          hi: '50 सेमी विशाल सेलिब्रेशन फूलझड़ी (5 नग)',
          en: '50cm Giant Celebration Sparklers (Pack of 5)'
        },
        description: {
          mr: 'मोठ्या समारंभांसाठी आणि उत्सवासाठी खास महाकाय ५० सेमी फुलबाज्या.',
          hi: 'भव्य आयोजनों और त्योहारों के लिए 50 सेमी विशाल फूलझड़ियां।',
          en: 'Extra-long celebratory gold wand sparkler with extensive 5-minute glow.'
        },
        categoryId: 'cat-sparklers',
        categoryName: 'Sparklers',
        images: ['https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 250,
        costPrice: 165,
        stockQuantity: 80,
        lowStockThreshold: 15,
        manufacturer: 'Standard Fireworks Sivakasi',
        safetyInformation: {
          mr: 'मोठ्या व्यक्तींनीच हाताळावे. विझल्यानंतर पाण्यात बुडवावे.',
          hi: 'वयस्क व्यक्ति ही उपयोग करें। बुझने पर पानी में डालें।',
          en: 'For adult handling only. Fully extinguish wire in water tub.'
        },
        soundLevel: 'Soundless (Light only)',
        visualEffect: 'Extended Golden Aura',
        piecesPerBox: 5,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-SPK04',
        featured: false,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      },
      {
        id: 'prod-chk-whistling-disco',
        sku: 'CHK-WHI-DSC',
        slug: 'disco-whistling-deluxe-wheel',
        name: {
          mr: 'डिस्को व्हिसलिंग डिलक्स चक्र (५ नग)',
          hi: 'डिस्को विसलिंग डीलक्स चकरी (5 नग)',
          en: 'Disco Whistling Deluxe Ground Wheel (5 Pcs)'
        },
        description: {
          mr: 'फिरताना रंग बदलणारे आणि मंजुळ आवाज करणारे आधुनिक चक्र.',
          hi: 'घूमते समय रंग बदलने वाली और सीटी जैसी आवाज वाली आधुनिक चकरी।',
          en: 'Color morphing wheel emitting acoustic pleasant whistle tone.'
        },
        categoryId: 'cat-chakkars',
        categoryName: 'Ground Chakkars',
        images: ['https://images.unsplash.com/photo-1543877087-eb71552097c2?w=800&auto=format&fit=crop&q=80'],
        retailPrice: 310,
        costPrice: 200,
        stockQuantity: 95,
        lowStockThreshold: 20,
        manufacturer: 'Coronation Fireworks',
        safetyInformation: {
          mr: 'सपाट फरशीवर किंवा रस्त्यावरच पेटवावे.',
          hi: 'समतल फर्श या सड़क पर ही जलाएं।',
          en: 'Smooth level surface mandatory for spin stability.'
        },
        soundLevel: 'Low',
        visualEffect: 'Chromatic Whistle Vortex',
        piecesPerBox: 5,
        complianceStatus: 'green_cracker',
        greenCrackerCode: 'CSIR-NEERI/GC-2024-CHK04',
        featured: false,
        active: true,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z'
      }
    ];
  }

  getBanners(): Banner[] {
    return [
      {
        id: 'ban-diwali-grand',
        title: {
          mr: 'भव्य दीपोत्सव महोत्सव २०२६',
          hi: 'भव्य दीपोत्सव महा-उत्सव 2026',
          en: 'Grand Diwali Festival 2026 Celebration'
        },
        subtitle: {
          mr: '१००% अधिकृत हरित फटाके, दर्जेदार उत्पादने आणि आकर्षक दर!',
          hi: '100% अधिकृत हरित पटाखे, बेहतरीन गुणवत्ता और उचित मूल्य!',
          en: '100% Certified Green Crackers, Top Brands & Festive Store Inquiries Open!'
        },
        imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1600&auto=format&fit=crop&q=80',
        targetUrl: '/products',
        buttonText: {
          mr: 'कॅटलॉग पहा',
          hi: 'कैटलॉग देखें',
          en: 'Explore Catalog'
        },
        startDate: '2026-09-01',
        endDate: '2026-11-30',
        active: true,
        sortOrder: 1
      },
      {
        id: 'ban-green-crackers',
        title: {
          mr: 'पर्यावरणपूरक हरित फटाके दालन',
          hi: 'पर्यावरण-अनुकूल हरित आतिशबाजी',
          en: 'Eco-Friendly Certified Green Crackers'
        },
        subtitle: {
          mr: 'CSIR-NEERI मान्यताप्राप्त - सुरक्षित आनंद, स्वच्छ पर्यावरण.',
          hi: 'CSIR-NEERI अनुमोदित - सुरक्षित खुशियां, स्वच्छ वातावरण।',
          en: '30% Lower Particulate Emissions & Barium-Free Formulas.'
        },
        imageUrl: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1600&auto=format&fit=crop&q=80',
        targetUrl: '/categories',
        buttonText: {
          mr: 'हरित फटाके प्रकार',
          hi: 'हरित श्रेणियां',
          en: 'Browse Categories'
        },
        startDate: '2026-09-01',
        endDate: '2026-11-30',
        active: true,
        sortOrder: 2
      }
    ];
  }

  getStoreSettings(): StoreSettings {
    return {
      businessName: 'Pratik Phatake',
      businessNameMarathi: 'प्रतीक फटाके',
      taglineMarathi: 'सुरक्षित आणि आनंददायी दिवाळी साजरी करा',
      taglineEnglish: 'Celebrate a safe, joyful & vibrant Diwali',
      logo: 'assets/logo.png',
      contactNumber: '+91 98220 12345',
      whatsappNumber: '+919822012345',
      email: 'contact@pratikphatake.com',
      address: 'दुकान क्र. १२, फटाके गल्ली, लक्ष्मी रोड, पुणे, महाराष्ट्र ४११०३०',
      workingHours: 'सकाळी ९:०० ते रात्री १०:०० (सणांच्या दिवसांत रोज सुरू)',
      licenseNumber: 'PESO-PUN-RET-2024/7890 (Valid till 31-Dec-2027)',
      gstin: '27ABCDE1234F1Z5',
      currency: '₹',
      defaultLanguage: 'mr',
      statutoryNoticeMarathi: 'सर्वोच्च न्यायालयाच्या आदेशानुसार व भारतीय कायद्यानुसार फटाक्यांची ऑनलाइन विक्री, ऑनलाइन पेमेंट आणि कुरिअर घरपोच डिलिव्हरी पूर्णतः प्रतिबंधित आहे. ही वेबसाइट केवळ माहितीपर कॅटलॉग व दुकानात प्रत्यक्ष खरेदीसाठी संपर्क चौकशीकरिता आहे.',
      statutoryNoticeEnglish: 'As per Supreme Court mandates and Indian statutory regulations, online sale, payment processing and home delivery of fireworks are strictly prohibited. This website functions exclusively as a product catalog and store inquiry platform for physical walk-in purchase at our licensed retail outlet.',
      googleMapsUrl: 'https://maps.google.com/?q=Laxmi+Road+Pune'
    };
  }

  getDemoInquiries(): Inquiry[] {
    return [
      {
        id: 'inq-1001',
        inquiryNumber: 'INQ-2026-1001',
        customerName: 'राजेश कुलकर्णी (Rajesh Kulkarni)',
        phone: '+91 98221 54321',
        email: 'rajesh.kulkarni@example.com',
        items: [
          {
            productId: 'prod-ast-shubh-diwali',
            productName: 'शुभ दिवाळी फॅमिली गिफ्ट बॉक्स',
            sku: 'AST-SHB-01',
            quantity: 2,
            estimatedPrice: 1250
          },
          {
            productId: 'prod-spk-10cm-gold',
            productName: '१० सेमी इलेक्ट्रिक गोल्ड फुलबाज्या',
            sku: 'SPK-10-GLD',
            quantity: 5,
            estimatedPrice: 65
          }
        ],
        totalEstimatedAmount: 2825,
        message: 'शनिवारी संध्याकाळी दुकानात येऊन खरेदी करू इच्छितो. स्टॉक राखून ठेवता येईल का?',
        status: 'new',
        source: 'website_catalog',
        consent: true,
        staffNotes: 'ग्राहकाशी संपर्क करून शनिवारच्या दुकानातील उपलब्धतेबद्दल माहिती दिली.',
        createdAt: '2026-10-12T14:30:00Z',
        updatedAt: '2026-10-12T14:30:00Z'
      },
      {
        id: 'inq-1002',
        inquiryNumber: 'INQ-2026-1002',
        customerName: 'अमित जोशी (Amit Joshi)',
        phone: '+91 94220 98765',
        email: 'amit.joshi@example.com',
        items: [
          {
            productId: 'prod-sky-30-shot-glory',
            productName: '३० शॉट्स नाईट ग्लोरी मेगा स्काय शो',
            sku: 'SKY-30-GLR',
            quantity: 1,
            estimatedPrice: 1450
          }
        ],
        totalEstimatedAmount: 1450,
        message: 'सोसायटीच्या दिवाळी कार्यक्रमासाठी हवे आहेत. बल्क डिस्काउंट मिळेल का?',
        status: 'contacted',
        source: 'website_catalog',
        consent: true,
        staffNotes: 'फोनवर बोलणे झाले, थेट दुकानात येण्यास सांगितले आहे.',
        createdAt: '2026-10-11T11:15:00Z',
        updatedAt: '2026-10-11T15:20:00Z'
      },
      {
        id: 'inq-1003',
        inquiryNumber: 'INQ-2026-1003',
        customerName: 'प्रिया देसाई (Priya Desai)',
        phone: '+91 97654 32109',
        email: 'priya.desai@example.com',
        items: [
          {
            productId: 'prod-ast-kids-delight',
            productName: 'किड्स डिलाईट विनाआवाज संच',
            sku: 'AST-KID-03',
            quantity: 3,
            estimatedPrice: 750
          }
        ],
        totalEstimatedAmount: 2250,
        message: 'लहान मुलांसाठी बिनआवाजी फटाके हवे आहेत.',
        status: 'closed',
        source: 'whatsapp_lead',
        consent: true,
        staffNotes: 'ग्राहकाने दुकानात प्रत्यक्ष भेट देऊन खरेदी पूर्ण केली.',
        createdAt: '2026-10-10T09:45:00Z',
        updatedAt: '2026-10-10T17:00:00Z'
      }
    ];
  }

  getDemoInventoryMovements(): InventoryMovement[] {
    return [
      {
        id: 'mov-501',
        productId: 'prod-spk-10cm-gold',
        productName: '१० सेमी इलेक्ट्रिक गोल्ड फुलबाज्या',
        sku: 'SPK-10-GLD',
        movementType: 'STOCK_IN',
        quantityChange: 500,
        previousQuantity: 0,
        newQuantity: 500,
        reason: 'दिवाळी सण हंगाम - नवीन स्टॉक आवक (Standard Fireworks Sivakasi)',
        performedBy: 'admin@pratikphatake.com',
        createdAt: '2026-09-15T10:00:00Z'
      },
      {
        id: 'mov-502',
        productId: 'prod-spk-10cm-gold',
        productName: '१० सेमी इलेक्ट्रिक गोल्ड फुलबाज्या',
        sku: 'SPK-10-GLD',
        movementType: 'STOCK_OUT',
        quantityChange: -50,
        previousQuantity: 500,
        newQuantity: 450,
        reason: 'दुकानातील प्रत्यक्ष काउंटर विक्री',
        performedBy: 'staff@pratikphatake.com',
        createdAt: '2026-10-10T18:00:00Z'
      },
      {
        id: 'mov-503',
        productId: 'prod-flp-gold-deluxe',
        productName: 'अनार डिलक्स सुवर्ण झाड',
        sku: 'FLP-GLD-DLX',
        movementType: 'STOCK_IN',
        quantityChange: 400,
        previousQuantity: 0,
        newQuantity: 400,
        reason: 'नवीन लॉट आवक',
        performedBy: 'admin@pratikphatake.com',
        createdAt: '2026-09-20T11:00:00Z'
      },
      {
        id: 'mov-504',
        productId: 'prod-flp-gold-deluxe',
        productName: 'अनार डिलक्स सुवर्ण झाड',
        sku: 'FLP-GLD-DLX',
        movementType: 'DAMAGE',
        quantityChange: -5,
        previousQuantity: 400,
        newQuantity: 395,
        reason: 'वाहतुकीदरम्यान खोके दबल्यामुळे खराब झालेला स्टॉक बाद केला',
        performedBy: 'admin@pratikphatake.com',
        createdAt: '2026-09-21T15:30:00Z'
      }
    ];
  }

  getDemoUsers(): UserProfile[] {
    return [
      {
        uid: 'user-super-admin-01',
        email: 'superadmin@pratikphatake.com',
        displayName: 'प्रतीक मालक (Pratik Phatake)',
        role: 'super_admin',
        phone: '+91 98220 12345',
        active: true,
        createdAt: '2026-01-01T00:00:00Z'
      },
      {
        uid: 'user-admin-02',
        email: 'admin@pratikphatake.com',
        displayName: 'स्टोअर मॅनेजर (Store Manager)',
        role: 'admin',
        phone: '+91 98220 99999',
        active: true,
        createdAt: '2026-02-01T00:00:00Z'
      },
      {
        uid: 'user-staff-03',
        email: 'staff@pratikphatake.com',
        displayName: 'काउंटर स्टाफ (Billing Staff)',
        role: 'staff',
        phone: '+91 98220 88888',
        active: true,
        createdAt: '2026-03-01T00:00:00Z'
      },
      {
        uid: 'user-customer-04',
        email: 'customer@pratikphatake.com',
        displayName: 'राहुल शिंदे (Rahul Shinde - ग्राहक)',
        role: 'customer',
        phone: '+91 98220 77777',
        active: true,
        createdAt: '2026-04-01T00:00:00Z'
      }
    ];
  }
}
