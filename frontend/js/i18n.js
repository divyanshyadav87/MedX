// ===========================
// I18N.JS — Internationalization Module
// Supports English (en) and Hindi (hi)
// ===========================

const translations = {
  en: {
    // --- Navbar ---
    nav_home: 'Home',
    nav_dashboard: 'Medicine Analyzer',
    nav_history: 'History',
    nav_login: 'Log in',
    nav_signup: 'Sign Up',
    nav_signout: 'Sign out',

    // --- Home Hero ---
    hero_badge: 'AI-Powered Medicine Scanner',
    hero_title_1: 'Understand Your Health Reports & Medicines — ',
    hero_title_2: 'Instantly.',
    hero_subtitle: 'Upload a medical report or scan any medicine to get AI-powered insights, normal ranges, side effects, and personalized explanations in seconds.',
    hero_upload: 'Upload Image',
    hero_demo: 'Try Demo',
    hero_trust_hipaa: 'HIPAA Compliant',
    hero_trust_medicines: '10K+ Medicines',
    hero_btn_report: 'Analyze Report',
    hero_btn_scan: 'Scan Medicine',
    hero_avatar_text: 'Joining 50,000+ users across the globe',

    // --- Stats ---
    stat_scans: 'Scans Completed',
    stat_medicines: 'MEDICINES',
    stat_accuracy: 'ACCURACY',
    stat_availability: 'Availability',
    stat_analyzed: 'ANALYZED',
    stat_rating: 'USER RATING',

    // --- Bento Section ---
    bento_section_title: 'Precision Engineering for Health',
    bento_tab_reports: 'Medical Reports',
    bento_tab_scanner: 'Medicine Scanner',
    bento_extract_title: 'Automated Data Extraction',
    bento_extract_desc: 'Our clinical-grade OCR pipeline extracts text from documents with 99.9% accuracy.',
    bento_abnorm_title: 'Abnormality Detection',
    bento_abnorm_desc: 'Values outside normal bounds are highlighted and categorized with clear action points.',
    bento_hemo_title: 'Hemoglobin 9.2 (Critical)',
    bento_hemo_desc: 'Below average normal indicator. Recommended follow up: See a doctor.',
    bento_noconfuse_title: 'No more confusing lab reports.',
    bento_noconfuse_desc: 'Translate medical jargon into plain English. We explain exactly what your body is trying to tell you without the ambiguity.',
    bento_medsec_title: 'Understand medicines in seconds.',
    bento_aidoctor_title: 'AI that explains like a doctor.',
    bento_aidoctor_desc: 'Interactive, clear, and medically accurate explanations tailored to your literacy level.',
    bento_personal_title: 'Personalized to your age & gender',
    bento_personal_desc: 'Context matters. We adapt reference ranges based on your demographic profile.',

    // --- Trust Section ---
    trust_title: 'Built for absolute trust.',
    trust_desc: 'Medical data is sacred. Our architecture is built with privacy and accuracy as non-negotiable foundations.',
    trust_soc2: 'SOC2 Type II Certified',
    trust_encryption: 'End-to-End Encryption',
    trust_context_title: 'Context-Aware Explanations',
    trust_context_desc: 'We don\'t just provide a dictionary translation, but a context map.',
    trust_strict_title: 'Strict Abnormality Detection',
    trust_strict_desc: 'Our engine flags out-of-bounds metrics based on strict guidelines.',
    trust_privacy_title: 'Privacy-First Architecture',
    trust_privacy_desc: 'Your health data is not identified. All data is wiped immediately.',
    trust_checks_title: 'Continuous Checks',
    trust_checks_desc: 'Every insight comes from verifiable sources mapped rigorously.',

    // --- Testimonials ---
    testimonial_1_text: '"MedX is brilliant! I\'ve been looking for everywhere for clear, accurate medical information without paying a huge premium. It\'s truly amazing."',
    testimonial_1_role: 'GENERAL PHYSICIAN, HOSPITAL VIP',
    testimonial_2_text: '"The medical scanner provides reliable drug-drug interaction info. Steps that are easy to understand. It\'s like having a clinical professional in your pocket."',
    testimonial_2_role: 'CLINICAL PHARMACIST',

    // --- How It Works (homepage) ---
    how_title: 'Insights in three simple steps.',
    how_subtitle: 'Designed for speed. Engineered for precision.',
    how_step1_title: '1. Upload or Scan',
    how_step1_desc: 'Snap a photo of your report or medicine and drop it onto our portal.',
    how_step2_title: '2. AI Analysis',
    how_step2_desc: 'Our engine parses every metric, comparing it against global medical databases.',
    how_step3_title: '3. Get Insights',
    how_step3_desc: 'Receive a clear, actionable dashboard of your health data instantly.',

    // --- CTA ---
    cta_title: 'Stop Guessing Your Health Data.',
    cta_subtitle: 'Get clear, AI-powered insights in seconds. Join 50,000+ users taking control of their health literacy.',

    // --- Features ---
    features_badge: 'Features',
    features_title_1: 'Why Choose ',
    features_title_2: 'MedX',
    features_subtitle: 'Powered by cutting-edge artificial intelligence to deliver fast, accurate, and reliable medicine identification.',
    feature_ai_title: 'AI-Powered Analysis',
    feature_ai_desc: 'Advanced neural networks trained on millions of medicine images for unmatched identification accuracy.',
    feature_instant_title: 'Instant Results',
    feature_instant_desc: 'Get comprehensive medicine details in less than 5 seconds. No waiting, no delays.',
    feature_safe_title: 'Safe & Private',
    feature_safe_desc: 'Your data is encrypted and never shared. We follow the highest security and privacy standards.',
    feature_available_title: '24/7 Available',
    feature_available_desc: 'Access MedX anytime, anywhere. Our servers are always running to serve you.',

    // --- How It Works ---
    how_badge: 'How It Works',
    how_title: 'Three Simple Steps',
    how_subtitle: 'Getting detailed medicine information has never been easier.',
    step1_title: 'Upload Image',
    step1_desc: 'Take a photo or upload an image of your medicine from your device.',
    step2_title: 'AI Analysis',
    step2_desc: 'Our advanced AI system scans and identifies the medicine with high accuracy.',
    step3_title: 'Get Results',
    step3_desc: 'Receive instant, detailed information about your medicine — uses, dosage, side effects, and more.',

    // --- Demo ---
    demo_badge: 'Live Demo',
    demo_title_1: 'Try It ',
    demo_title_2: 'Right Now',
    demo_subtitle: 'Experience the power of MedX with our interactive demo scanner.',
    demo_drop: 'Drop your medicine image here',
    demo_browse_hint: 'or click to browse • PNG, JPG up to 10MB',
    demo_browse: 'Browse Files',
    demo_sample: 'Try Sample',
    demo_scanning: 'Analyzing medicine...',
    demo_scanning_sub: 'This usually takes a few seconds',
    demo_identified: 'Identified Successfully',
    demo_ingredients: '💊 Active Ingredients',
    demo_uses: '✅ Primary Uses',
    demo_side_effects_label: '⚠️ Side Effects',
    demo_dosage_label: '💉 Dosage',
    demo_scan_another: 'Scan Another Medicine',

    // --- Testimonials ---
    testimonials_badge: 'Testimonials',
    testimonials_title_1: 'Trusted by ',
    testimonials_title_2: 'Thousands',
    testimonials_subtitle: 'See what our users have to say about MedX.',
    testimonial1: '"MedX helped me identify a medicine I found at home. The results were incredibly detailed and accurate. A must-have tool!"',
    testimonial2: '"As a pharmacist, I use this daily. The AI accurately identifies even generic medicines and provides reliable dosage information."',
    testimonial3: '"My elderly parents can now easily check their medicines. The interface is so simple — just snap a photo and you get everything!"',

    // --- FAQ ---
    faq_badge: 'FAQ',
    faq_title_1: 'Frequently Asked ',
    faq_title_2: 'Questions',
    faq_q1: 'How accurate is MedX?',
    faq_a1: 'MedX achieves over 99% accuracy in identifying medicines. Our neural network is continuously trained on millions of medicine images and pharmaceutical databases to ensure the highest reliability.',
    faq_q2: 'Is my data secure and private?',
    faq_a2: 'Absolutely. All uploads are encrypted using AES-256 encryption. We are HIPAA compliant and never share your data with third parties. Your images are processed securely and deleted after analysis unless you choose to save them.',
    faq_q3: 'What types of medicines can it identify?',
    faq_a3: 'MedX can identify tablets, capsules, syrups, injections, creams, and more. Our database includes over 10,000 medicines from major pharmaceutical brands across the globe.',
    faq_q4: 'Is MedX free to use?',
    faq_a4: 'Yes! MedX offers a generous free tier that includes up to 50 scans per month. For unlimited scans and advanced features like scan history and detailed reports, check out our Pro plan.',
    faq_q5: 'Can I use MedX on my phone?',
    faq_a5: 'Yes! MedX is fully responsive and works great on all devices — smartphones, tablets, and desktops. You can even use your phone\'s camera to capture medicine images directly.',

    // --- CTA ---
    cta_title_1: 'Ready to Scan Your ',
    cta_title_2: 'Medicine',
    cta_subtitle: 'Join thousands of users who trust MedX for instant, accurate medicine identification.',
    cta_button: 'Get Started Free',

    // --- Footer ---
    footer_desc: 'AI-powered medicine identification and analysis. Get instant, reliable information about any medicine with just a photo.',
    footer_product: 'Product',
    footer_features: 'Features',
    footer_demo: 'Demo',
    footer_pricing: 'Pricing',
    footer_api: 'API',
    footer_company: 'Company',
    footer_about: 'About Us',
    footer_careers: 'Careers',
    footer_blog: 'Blog',
    footer_contact: 'Contact',
    footer_legal: 'Legal',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms of Service',
    footer_cookie: 'Cookie Policy',
    footer_hipaa: 'HIPAA',
    footer_social: 'Social',
    footer_copyright: '© 2026 MedX. All rights reserved.',

    // --- Auth ---
    auth_login_title: 'Welcome back',
    auth_login_subtitle: 'Sign in to continue scanning medicines',
    auth_login_email: 'Email',
    auth_login_password: 'Password',
    auth_login_submit: 'Sign In',
    auth_login_or: 'or',
    auth_login_google: 'Continue with Google',
    auth_login_no_account: "Don't have an account? ",
    auth_login_signup_link: 'Sign up',
    auth_signup_title: 'Create your account',
    auth_signup_subtitle: 'Start scanning medicines for free',
    auth_signup_name: 'Full Name',
    auth_signup_email: 'Email',
    auth_signup_password: 'Password (min 6 characters)',
    auth_signup_submit: 'Create Account',
    auth_signup_or: 'or',
    auth_signup_google: 'Continue with Google',
    auth_signup_has_account: 'Already have an account? ',
    auth_signup_login_link: 'Sign in',

    // --- Dashboard ---
    dash_title: 'Medicine Analyzer',
    dash_subtitle: 'Upload or capture a medicine image to get instant AI analysis',
    dash_drop: 'Drop your medicine image here',
    dash_browse_hint: 'or click to browse • PNG, JPG up to 10MB',
    dash_browse: 'Browse Files',
    dash_camera: 'Use Camera',
    dash_analyze: 'Analyze Medicine',
    dash_cancel: 'Cancel',
    dash_analyzing: 'Analyzing medicine...',
    dash_extracting: 'Extracting visual features',
    dash_view_history: 'View Scan History',

    // --- History ---
    hist_title: 'Scan History',
    hist_subtitle: 'Your previously scanned medicines',
    hist_search: 'Search medicines...',
    hist_empty_title: 'No scans yet',
    hist_empty_desc: 'Start by scanning your first medicine',
    hist_empty_btn: 'Scan Medicine',
    hist_no_results: 'No results found',

    // --- Results ---
    res_back: 'Back',
    res_favorite: 'Favorite',
    res_share: 'Share',
    res_price_label: 'APPROXIMATE PRICE',
    res_uses_label: 'PRIMARY USES',
    res_dosage: 'Dosage',
    res_dosage_prescribed: 'As prescribed by doctor',
    res_warnings: 'Clinical Warnings',
    res_side_effects: 'Common Side Effects',
    res_side_effects_disclaimer: '*If these symptoms persist, consult your healthcare provider immediately.',
    res_scan_another: 'Scan Another Medicine',
    res_ingredients: 'Ingredients',
    res_active_substance: 'ACTIVE SUBSTANCE',
    res_precautions: 'General Precautions',

    // --- Language Toggle ---
    lang_label: 'EN',
  },

  hi: {
    // --- Navbar ---
    nav_home: 'होम',
    nav_dashboard: 'दवा विश्लेषक',
    nav_history: 'इतिहास',
    nav_login: 'लॉग इन',
    nav_signup: 'साइन अप',
    nav_signout: 'साइन आउट',

    // --- Home Hero ---
    hero_badge: 'AI-संचालित दवा स्कैनर',
    hero_title_1: 'अपनी स्वास्थ्य रिपोर्ट और दवाओं को समझें — ',
    hero_title_2: 'तुरंत।',
    hero_subtitle: 'एआई-संचालित अंतर्दृष्टि, सामान्य सीमा, दुष्प्रभाव और व्यक्तिगत स्पष्टीकरण सेकंडों में प्राप्त करने के लिए मेडिकल रिपोर्ट अपलोड करें या किसी भी दवा को स्कैन करें।',
    hero_upload: 'छवि अपलोड करें',
    hero_demo: 'डेमो देखें',
    hero_trust_hipaa: 'HIPAA अनुपालित',
    hero_trust_medicines: '10K+ दवाइयाँ',
    hero_btn_report: 'रिपोर्ट विश्लेषण करें',
    hero_btn_scan: 'दवा स्कैन करें',
    hero_avatar_text: 'दुनिया भर में 50,000+ उपयोगकर्ता जुड़ रहे हैं',

    // --- Stats ---
    stat_scans: 'स्कैन पूर्ण',
    stat_medicines: 'दवाइयाँ',
    stat_accuracy: 'सटीकता',
    stat_availability: 'उपलब्धता',
    stat_analyzed: 'विश्लेषित',
    stat_rating: 'उपयोगकर्ता रेटिंग',

    // --- Bento Section ---
    bento_section_title: 'स्वास्थ्य के लिए सटीक इंजीनियरिंग',
    bento_tab_reports: 'मेडिकल रिपोर्ट',
    bento_tab_scanner: 'दवा स्कैनर',
    bento_extract_title: 'स्वचालित डेटा निष्कर्षण',
    bento_extract_desc: 'हमारी क्लिनिकल-ग्रेड OCR पाइपलाइन 99.9% सटीकता के साथ दस्तावेज़ों से टेक्स्ट निकालती है।',
    bento_abnorm_title: 'असामान्यता पहचान',
    bento_abnorm_desc: 'सामान्य सीमा से बाहर के मान को हाइलाइट और स्पष्ट कार्रवाई बिंदुओं के साथ वर्गीकृत किया जाता है।',
    bento_hemo_title: 'हीमोग्लोबिन 9.2 (गंभीर)',
    bento_hemo_desc: 'औसत सामान्य संकेतक से नीचे। अनुशंसित फॉलो अप: डॉक्टर से मिलें।',
    bento_noconfuse_title: 'अब भ्रमित करने वाली लैब रिपोर्ट नहीं।',
    bento_noconfuse_desc: 'चिकित्सा शब्दावली को सरल भाषा में अनुवादित करें। हम बिना अस्पष्टता के बताते हैं कि आपका शरीर क्या कह रहा है।',
    bento_medsec_title: 'दवाओं को सेकंडों में समझें।',
    bento_aidoctor_title: 'AI जो डॉक्टर की तरह समझाता है।',
    bento_aidoctor_desc: 'आपकी समझ के स्तर के अनुरूप इंटरैक्टिव, स्पष्ट और चिकित्सकीय रूप से सटीक स्पष्टीकरण।',
    bento_personal_title: 'आपकी उम्र और लिंग के अनुसार व्यक्तिगत',
    bento_personal_desc: 'संदर्भ मायने रखता है। हम आपकी जनसांख्यिकीय प्रोफ़ाइल के आधार पर संदर्भ श्रेणियाँ अनुकूलित करते हैं।',

    // --- Trust Section ---
    trust_title: 'पूर्ण विश्वास के लिए बनाया गया।',
    trust_desc: 'चिकित्सा डेटा पवित्र है। हमारी वास्तुकला गोपनीयता और सटीकता को अटल नींव के रूप में बनाई गई है।',
    trust_soc2: 'SOC2 Type II प्रमाणित',
    trust_encryption: 'एंड-टू-एंड एन्क्रिप्शन',
    trust_context_title: 'संदर्भ-जागरूक स्पष्टीकरण',
    trust_context_desc: 'हम केवल शब्दकोश अनुवाद नहीं देते, बल्कि एक संदर्भ मानचित्र प्रदान करते हैं।',
    trust_strict_title: 'सख्त असामान्यता पहचान',
    trust_strict_desc: 'हमारा इंजन सख्त दिशानिर्देशों के आधार पर सीमा से बाहर के मेट्रिक्स को चिह्नित करता है।',
    trust_privacy_title: 'गोपनीयता-पहले वास्तुकला',
    trust_privacy_desc: 'आपके स्वास्थ्य डेटा की पहचान नहीं की जाती। सभी डेटा तुरंत मिटा दी जाती है।',
    trust_checks_title: 'निरंतर जाँच',
    trust_checks_desc: 'हर अंतर्दृष्टि सत्यापन योग्य स्रोतों से कठोरता से मैप की जाती है।',

    // --- Testimonials ---
    testimonial_1_text: '"MedX शानदार है! मैं हर जगह स्पष्ट, सटीक चिकित्सा जानकारी ढूंढ रहा था बिना बड़ा प्रीमियम चुकाए। यह वास्तव में अद्भुत है।"',
    testimonial_1_role: 'सामान्य चिकित्सक, हॉस्पिटल VIP',
    testimonial_2_text: '"मेडिकल स्कैनर विश्वसनीय दवा-दवा इंटरैक्शन जानकारी देता है। समझने में आसान कदम। यह जेब में एक क्लिनिकल पेशेवर होने जैसा है।"',
    testimonial_2_role: 'क्लिनिकल फार्मासिस्ट',

    // --- How It Works (homepage) ---
    how_title: 'तीन सरल चरणों में अंतर्दृष्टि।',
    how_subtitle: 'गति के लिए डिज़ाइन किया गया। सटीकता के लिए इंजीनियर किया गया।',
    how_step1_title: '1. अपलोड या स्कैन करें',
    how_step1_desc: 'अपनी रिपोर्ट या दवा की फोटो लें और हमारे पोर्टल पर डालें।',
    how_step2_title: '2. AI विश्लेषण',
    how_step2_desc: 'हमारा इंजन हर मेट्रिक को पार्स करता है, इसे वैश्विक चिकित्सा डेटाबेस से तुलना करता है।',
    how_step3_title: '3. अंतर्दृष्टि प्राप्त करें',
    how_step3_desc: 'तुरंत अपने स्वास्थ्य डेटा का स्पष्ट, कार्रवाई योग्य डैशबोर्ड प्राप्त करें।',

    // --- CTA ---
    cta_title: 'अपने स्वास्थ्य डेटा का अनुमान लगाना बंद करें।',
    cta_subtitle: 'सेकंडों में स्पष्ट, AI-संचालित अंतर्दृष्टि प्राप्त करें। 50,000+ उपयोगकर्ता अपनी स्वास्थ्य साक्षरता पर नियंत्रण ले रहे हैं।',

    // --- Features ---
    features_badge: 'विशेषताएँ',
    features_title_1: 'क्यों चुनें ',
    features_title_2: 'MedX',
    features_subtitle: 'तेज, सटीक और विश्वसनीय दवा पहचान के लिए अत्याधुनिक कृत्रिम बुद्धिमत्ता द्वारा संचालित।',
    feature_ai_title: 'AI-संचालित विश्लेषण',
    feature_ai_desc: 'बेजोड़ पहचान सटीकता के लिए लाखों दवा छवियों पर प्रशिक्षित उन्नत न्यूरल नेटवर्क।',
    feature_instant_title: 'तत्काल परिणाम',
    feature_instant_desc: '5 सेकंड से कम में व्यापक दवा विवरण प्राप्त करें। कोई प्रतीक्षा नहीं।',
    feature_safe_title: 'सुरक्षित और निजी',
    feature_safe_desc: 'आपका डेटा एन्क्रिप्टेड है और कभी साझा नहीं किया जाता। हम उच्चतम सुरक्षा मानकों का पालन करते हैं।',
    feature_available_title: '24/7 उपलब्ध',
    feature_available_desc: 'MedX कभी भी, कहीं भी उपयोग करें। हमारे सर्वर हमेशा चालू रहते हैं।',

    // --- How It Works ---
    how_badge: 'कैसे काम करता है',
    how_title: 'तीन सरल कदम',
    how_subtitle: 'विस्तृत दवा जानकारी प्राप्त करना इतना आसान कभी नहीं था।',
    step1_title: 'छवि अपलोड करें',
    step1_desc: 'अपने डिवाइस से अपनी दवा की फोटो लें या अपलोड करें।',
    step2_title: 'AI विश्लेषण',
    step2_desc: 'हमारी उन्नत AI प्रणाली उच्च सटीकता के साथ दवा को स्कैन करती है और पहचानती है।',
    step3_title: 'परिणाम प्राप्त करें',
    step3_desc: 'अपनी दवा के बारे में तत्काल, विस्तृत जानकारी प्राप्त करें — उपयोग, खुराक, दुष्प्रभाव, और बहुत कुछ।',

    // --- Demo ---
    demo_badge: 'लाइव डेमो',
    demo_title_1: 'अभी ',
    demo_title_2: 'आज़माएं',
    demo_subtitle: 'हमारे इंटरैक्टिव डेमो स्कैनर के साथ MedX की शक्ति का अनुभव करें।',
    demo_drop: 'अपनी दवा की छवि यहाँ डालें',
    demo_browse_hint: 'या ब्राउज़ करने के लिए क्लिक करें • PNG, JPG 10MB तक',
    demo_browse: 'फाइलें ब्राउज़ करें',
    demo_sample: 'नमूना आज़माएं',
    demo_scanning: 'दवा का विश्लेषण हो रहा है...',
    demo_scanning_sub: 'इसमें आमतौर पर कुछ सेकंड लगते हैं',
    demo_identified: 'सफलतापूर्वक पहचानी गई',
    demo_ingredients: '💊 सक्रिय तत्व',
    demo_uses: '✅ प्राथमिक उपयोग',
    demo_side_effects_label: '⚠️ दुष्प्रभाव',
    demo_dosage_label: '💉 खुराक',
    demo_scan_another: 'एक और दवा स्कैन करें',

    // --- Testimonials ---
    testimonials_badge: 'प्रशंसापत्र',
    testimonials_title_1: 'विश्वसनीय ',
    testimonials_title_2: 'हज़ारों द्वारा',
    testimonials_subtitle: 'देखें हमारे उपयोगकर्ता MedX के बारे में क्या कहते हैं।',
    testimonial1: '"MedX ने मुझे घर पर मिली एक दवा की पहचान करने में मदद की। परिणाम अविश्वसनीय रूप से विस्तृत और सटीक थे। एक ज़रूरी उपकरण!"',
    testimonial2: '"एक फार्मासिस्ट के रूप में, मैं इसे रोज़ाना उपयोग करता हूँ। AI जनरिक दवाओं को भी सटीक रूप से पहचानता है।"',
    testimonial3: '"मेरे बुज़ुर्ग माता-पिता अब आसानी से अपनी दवाइयाँ जाँच सकते हैं। इंटरफ़ेस बहुत सरल है!"',

    // --- FAQ ---
    faq_badge: 'अक्सर पूछे जाने वाले प्रश्न',
    faq_title_1: 'अक्सर पूछे जाने वाले ',
    faq_title_2: 'प्रश्न',
    faq_q1: 'MedX कितना सटीक है?',
    faq_a1: 'MedX दवाओं की पहचान में 99% से अधिक सटीकता प्राप्त करता है। हमारा न्यूरल नेटवर्क लगातार लाखों दवा छवियों पर प्रशिक्षित होता है।',
    faq_q2: 'क्या मेरा डेटा सुरक्षित है?',
    faq_a2: 'बिल्कुल। सभी अपलोड AES-256 एन्क्रिप्शन से एन्क्रिप्टेड हैं। हम HIPAA अनुपालित हैं और कभी भी आपका डेटा तीसरे पक्ष के साथ साझा नहीं करते।',
    faq_q3: 'यह किस प्रकार की दवाइयों की पहचान कर सकता है?',
    faq_a3: 'MedX गोलियाँ, कैप्सूल, सिरप, इंजेक्शन, क्रीम और बहुत कुछ पहचान सकता है। हमारे डेटाबेस में दुनिया भर के प्रमुख ब्रांडों की 10,000+ दवाइयाँ हैं।',
    faq_q4: 'क्या MedX मुफ्त है?',
    faq_a4: 'हाँ! MedX प्रति माह 50 स्कैन तक मुफ्त टियर प्रदान करता है। असीमित स्कैन के लिए हमारा प्रो प्लान देखें।',
    faq_q5: 'क्या मैं फोन पर MedX उपयोग कर सकता हूँ?',
    faq_a5: 'हाँ! MedX पूरी तरह से रिस्पॉन्सिव है और सभी डिवाइसों पर बढ़िया काम करता है। आप सीधे फोन कैमरे से दवा की तस्वीर ले सकते हैं।',

    // --- CTA ---
    cta_title_1: 'अपनी ',
    cta_title_2: 'दवा स्कैन करने',
    cta_subtitle: 'तत्काल, सटीक दवा पहचान के लिए हज़ारों उपयोगकर्ताओं से जुड़ें।',
    cta_button: 'मुफ्त शुरू करें',

    // --- Footer ---
    footer_desc: 'AI-संचालित दवा पहचान और विश्लेषण। बस एक फोटो से किसी भी दवा की तत्काल, विश्वसनीय जानकारी प्राप्त करें।',
    footer_product: 'उत्पाद',
    footer_features: 'विशेषताएँ',
    footer_demo: 'डेमो',
    footer_pricing: 'मूल्य निर्धारण',
    footer_api: 'API',
    footer_company: 'कंपनी',
    footer_about: 'हमारे बारे में',
    footer_careers: 'करियर',
    footer_blog: 'ब्लॉग',
    footer_contact: 'संपर्क',
    footer_legal: 'कानूनी',
    footer_privacy: 'गोपनीयता नीति',
    footer_terms: 'सेवा की शर्तें',
    footer_cookie: 'कुकी नीति',
    footer_hipaa: 'HIPAA',
    footer_social: 'सोशल',
    footer_copyright: '© 2026 MedX. सर्वाधिकार सुरक्षित।',

    // --- Auth ---
    auth_login_title: 'वापसी पर स्वागत है',
    auth_login_subtitle: 'दवाइयाँ स्कैन करना जारी रखने के लिए लॉग इन करें',
    auth_login_email: 'ईमेल',
    auth_login_password: 'पासवर्ड',
    auth_login_submit: 'साइन इन करें',
    auth_login_or: 'या',
    auth_login_google: 'Google से जारी रखें',
    auth_login_no_account: 'खाता नहीं है? ',
    auth_login_signup_link: 'साइन अप करें',
    auth_signup_title: 'अपना खाता बनाएं',
    auth_signup_subtitle: 'मुफ्त में दवाइयाँ स्कैन करना शुरू करें',
    auth_signup_name: 'पूरा नाम',
    auth_signup_email: 'ईमेल',
    auth_signup_password: 'पासवर्ड (न्यूनतम 6 अक्षर)',
    auth_signup_submit: 'खाता बनाएं',
    auth_signup_or: 'या',
    auth_signup_google: 'Google से जारी रखें',
    auth_signup_has_account: 'पहले से खाता है? ',
    auth_signup_login_link: 'साइन इन करें',

    // --- Dashboard ---
    dash_title: 'दवा विश्लेषक',
    dash_subtitle: 'तत्काल AI विश्लेषण के लिए दवा की छवि अपलोड या कैप्चर करें',
    dash_drop: 'अपनी दवा की छवि यहाँ डालें',
    dash_browse_hint: 'या ब्राउज़ करने के लिए क्लिक करें • PNG, JPG 10MB तक',
    dash_browse: 'फाइलें ब्राउज़ करें',
    dash_camera: 'कैमरा उपयोग करें',
    dash_analyze: 'दवा का विश्लेषण करें',
    dash_cancel: 'रद्द करें',
    dash_analyzing: 'दवा का विश्लेषण हो रहा है...',
    dash_extracting: 'दृश्य विशेषताएँ निकाली जा रही हैं',
    dash_view_history: 'स्कैन इतिहास देखें',

    // --- History ---
    hist_title: 'स्कैन इतिहास',
    hist_subtitle: 'आपकी पहले स्कैन की गई दवाइयाँ',
    hist_search: 'दवाइयाँ खोजें...',
    hist_empty_title: 'अभी तक कोई स्कैन नहीं',
    hist_empty_desc: 'अपनी पहली दवा स्कैन करके शुरू करें',
    hist_empty_btn: 'दवा स्कैन करें',
    hist_no_results: 'कोई परिणाम नहीं मिला',

    // --- Results ---
    res_back: 'वापस',
    res_favorite: 'पसंदीदा',
    res_share: 'शेयर',
    res_price_label: 'अनुमानित मूल्य',
    res_uses_label: 'प्राथमिक उपयोग',
    res_dosage: 'खुराक',
    res_dosage_prescribed: 'डॉक्टर द्वारा निर्धारित अनुसार',
    res_warnings: 'चिकित्सा चेतावनियाँ',
    res_side_effects: 'सामान्य दुष्प्रभाव',
    res_side_effects_disclaimer: '*यदि ये लक्षण बने रहें, तो तुरंत अपने स्वास्थ्य सेवा प्रदाता से संपर्क करें।',
    res_scan_another: 'एक और दवा स्कैन करें',
    res_ingredients: 'सामग्री',
    res_active_substance: 'सक्रिय पदार्थ',
    res_precautions: 'सामान्य सावधानियाँ',

    // --- Language Toggle ---
    lang_label: 'हि',
  },
};

// --- Current Language ---
let currentLang = localStorage.getItem('MedX_lang') || 'en';

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('MedX_lang', lang);
}

export function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) || translations.en[key] || key;
}

// Apply translations to all elements with data-i18n attribute
export function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = t(key);
    if (text) el.textContent = text;
  });

  // Handle placeholder translations
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const text = t(key);
    if (text) el.placeholder = text;
  });

  // Handle innerHTML translations (for elements with nested HTML like highlights)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const keys = el.getAttribute('data-i18n-html').split(',');
    if (keys.length === 2) {
      el.innerHTML = `${t(keys[0])}<span class="highlight">${t(keys[1])}</span>`;
    } else if (keys.length === 1) {
      el.innerHTML = t(keys[0]);
    }
  });

  // gradient text
  document.querySelectorAll('[data-i18n-gradient]').forEach(el => {
    const keys = el.getAttribute('data-i18n-gradient').split(',');
    if (keys.length === 2) {
      el.innerHTML = `${t(keys[0])}<span class="text-gradient">${t(keys[1])}</span>?`;
    }
  });

  // Update HTML lang attribute
  document.documentElement.lang = currentLang === 'hi' ? 'hi' : 'en';
}

// Create and inject language toggle button into navbar
export function initLanguageToggle() {
  // Find the navbar actions container
  const navbarActions = document.querySelector('.navbar-actions');
  const authLogo = document.querySelector('.auth-logo');

  // Build the toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'btn btn-ghost btn-sm lang-toggle-btn';
  toggleBtn.id = 'langToggleBtn';
  toggleBtn.setAttribute('aria-label', 'Toggle Language');
  toggleBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
    <span class="lang-toggle-label">${currentLang === 'hi' ? 'EN' : 'हिं'}</span>
  `;

  toggleBtn.addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'hi' : 'en';
    setLang(newLang);
    applyTranslations();
    // Update toggle label
    toggleBtn.querySelector('.lang-toggle-label').textContent = newLang === 'hi' ? 'EN' : 'हिं';
  });

  // Inject into navbar or auth page
  if (navbarActions) {
    navbarActions.prepend(toggleBtn);
  } else if (authLogo) {
    // On auth pages, create a floating toggle
    const floatingContainer = document.createElement('div');
    floatingContainer.className = 'lang-toggle-floating';
    floatingContainer.appendChild(toggleBtn);
    document.body.appendChild(floatingContainer);
  }

  // Also add to mobile nav if present
  const mobileNav = document.getElementById('mobileNav');
  if (mobileNav) {
    const mobileToggle = toggleBtn.cloneNode(true);
    mobileToggle.id = 'mobileLangToggle';
    mobileToggle.addEventListener('click', () => {
      const newLang = currentLang === 'en' ? 'hi' : 'en';
      setLang(newLang);
      applyTranslations();
      toggleBtn.querySelector('.lang-toggle-label').textContent = newLang === 'hi' ? 'EN' : 'हिं';
      mobileToggle.querySelector('.lang-toggle-label').textContent = newLang === 'hi' ? 'EN' : 'हिं';
    });
    mobileNav.prepend(mobileToggle);
  }
}
