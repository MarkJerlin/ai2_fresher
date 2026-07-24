import React, { createContext, useContext, useState, useEffect } from 'react';
import { extraTranslations } from './translationExtensions';

const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' }
];

export const translations = {
  en: {
    nav_home: 'Home',
    nav_party: 'Party',
    nav_departments: 'Departments',
    nav_facilities: 'Facilities',
    nav_faculty: 'Faculty',
    nav_clubs: 'Clubs',
    nav_resources: 'Resources',
    nav_map: 'Campus Map',
    nav_chatbot: '🤖 AI Chatbot',
    nav_signin: 'Sign In',
    nav_join: 'Join Connect',
    nav_signout: 'Sign Out',
    nav_dashboard: 'Dashboard',
    nav_profile: 'My Profile',

    landing_badge: 'Google Developer Groups On Campus',
    landing_title: 'Everything a Fresher Needs — One Smart Portal.',
    landing_sub: 'Navigate campus life smoothly. Explore events, find your faculty advisors, connect with clubs, download resources, and register for Freshers Fiesta 2026!',
    landing_btn_party: 'Join Freshers Party 🎉',
    landing_btn_reg: 'Register Account',
    landing_countdown_tag: 'GET READY FOR THE BIGGEST FIESTA',
    landing_countdown_title: 'Freshers Welcome Party 2026',
    landing_stats_students: 'First-Year Students',
    landing_stats_events: 'Active Live Events',
    landing_stats_clubs: 'Campus Clubs',
    landing_stats_depts: 'Academic Departments',

    party_title: 'Freshers Fiesta 2026',
    party_sub: 'Grand Welcome Celebration, Interactive Beatmaker & Entry Pass Registration',
    party_pass_tag: 'Official Entry Pass',
    party_pass_btn: 'Confirm Party Registration Pass',
    party_food_label: 'Catering Option',
    party_tshirt_label: 'Souvenir T-Shirt Size',
    party_beat_title: '🎧 Interactive Hit Track Beatmaker',

    dept_title: 'University Departments',
    dept_sub: 'Explore branches, meet heads of departments, and locate class blocks.',
    dept_hod: 'Head of Department',
    dept_block: 'Block Location',
    dept_btn: 'View Department Hub & Photos',

    faculty_title: 'Faculty Directory & Advisors',
    faculty_sub: 'Meet your department professors, mentors, and office hours contact.',
    faculty_search: 'Search professor by name, department, or research area...',

    clubs_title: 'Student Clubs & Societies',
    clubs_sub: 'Join vibrant groups to build coding skills, run robots, play sports, or showcase talents.',
    clubs_reg_btn: 'Register Club',

    resources_title: 'Academic Resources & Syllabuses',
    resources_sub: 'Official Regulation 2024 Syllabuses, Weekly Timetables & A4 PDF Lecture Notes.',
    resources_dl_btn: 'Download PDF Document',

    map_title: 'Interactive Campus Map',
    map_sub: 'Indoor floor-by-floor navigation guide for all university blocks.',

    chatbot_title: 'Gemini AI Assistant',
    chatbot_sub: 'Ask your 24/7 AI Campus Buddy anything about freshers week!'
  },

  ta: {
    nav_home: 'முகப்பு',
    nav_party: 'விழா விருந்து',
    nav_departments: 'துறைகள்',
    nav_facilities: 'வசதிகள்',
    nav_faculty: 'பேராசிரியர்கள்',
    nav_clubs: 'மன்றங்கள்',
    nav_resources: 'பாடத்திட்டங்கள்',
    nav_map: 'வளாக வரைபடம்',
    nav_chatbot: '🤖 AI சாட்பாட்',
    nav_signin: 'உள்நுழைக',
    nav_join: 'இணையுங்கள்',
    nav_signout: 'வெளியேறு',
    nav_dashboard: 'டாஷ்போர்டு',
    nav_profile: 'என் சுயவிவரம்',

    landing_badge: 'கூகிள் டெவலப்பர் குரூப்ஸ் கேம்பஸ்',
    landing_title: 'பெரிய மாணவருக்கு தேவையான அனைத்தும் — ஒரே ஸ்மார்ட் போர்ட்டலில்.',
    landing_sub: 'கல்லூரி வாழ்க்கையை சுலபமாக அமையுங்கள். நிகழ்வுகள், ஆசிரியர்கள், மன்றங்கள், பாடத்திட்டங்கள் மற்றும் வரவேற்பு விழா 2026-ல் பங்கேற்கவும்!',
    landing_btn_party: 'வரவேற்பு விழாவில் இணையுங்கள் 🎉',
    landing_btn_reg: 'கணக்கு தொடங்குங்கள்',
    landing_countdown_tag: 'மிகப்பெரிய வரவேற்பு விழாவுக்கு தயாராகுங்கள்',
    landing_countdown_title: 'புதியவர் வரவேற்பு விழா 2026',
    landing_stats_students: 'முதல் ஆண்டு மாணவர்கள்',
    landing_stats_events: 'நேரலை நிகழ்வுகள்',
    landing_stats_clubs: 'வளாக மன்றங்கள்',
    landing_stats_depts: 'கல்வித் துறைகள்',

    party_title: 'புதியவர் வரவேற்பு விழா 2026',
    party_sub: 'பிரமாண்ட வரவேற்பு கொண்டாட்டம், DJ இசை மற்றும் நுழைவு பாஸ் பதிவு',
    party_pass_tag: 'அதிகாரப்பூர்வ நுழைவு பாஸ்',
    party_pass_btn: 'பாஸ் பதிவை உறுதிசெய்க',
    party_food_label: 'உணவு விருப்பம்',
    party_tshirt_label: 'டி-ஷர்ட் அளவு',
    party_beat_title: '🎧 ஊடாடும் இசை பீட்மேக்கர்',

    dept_title: 'பல்கலைக்கழகத் துறைகள்',
    dept_sub: 'பிரிவுகள், துறைத் தலைவர்கள் மற்றும் வகுப்பறை கட்டிடங்களைக் கண்டறியவும்.',
    dept_hod: 'துறைத் தலைவர் (HOD)',
    dept_block: 'கட்டிட அமைவிடம்',
    dept_btn: 'துறை மையம் & புகைப்படங்களைக் காண்க',

    faculty_title: 'பேராசிரியர்கள் & வழிகாட்டிகள்',
    faculty_sub: 'உங்கள் துறை பேராசிரியர்கள் மற்றும் தொடர்பு நேரங்களை அறியவும்.',
    faculty_search: 'பேராசிரியர் பெயர் அல்லது துறை மூலம் தேடுங்கள்...',

    clubs_title: 'மாணவர் மன்றங்கள் & அமைப்புகள்',
    clubs_sub: 'கோடிங், ரோபோடிக்ஸ், விளையாட்டு மற்றும் கலை மன்றங்களில் இணையுங்கள்.',
    clubs_reg_btn: 'மன்றத்தில் இணையுங்கள்',

    resources_title: 'கல்வி பாடத்திட்டங்கள் & பதிவிறக்கங்கள்',
    resources_sub: 'அதிகாரப்பூர்வ விதிகள் 2024 பாடத்திட்டம் & நேர அட்டவணை A4 PDF கோப்புகள்.',
    resources_dl_btn: 'PDF பதிவிறக்கம் செய்யுங்கள',

    map_title: 'வளாக வரைபடம்',
    map_sub: 'அனைத்து கட்டிடங்களுக்கான உள்ளக தள வழிகாட்டி.',

    chatbot_title: 'Gemini AI உதவியாளர்',
    chatbot_sub: 'உங்கள் 24/7 AI தோழனிடம் எது வேண்டுமானாலும் கேளுங்கள்!'
  },
  te: {
    nav_home: 'హోమ్',
    nav_party: 'పార్టీ',
    nav_departments: 'విభాగాలు',
    nav_facilities: 'సౌకర్యాలు',
    nav_faculty: 'ఫ్యాకల్టీ',
    nav_clubs: 'క్లబ్‌లు',
    nav_resources: 'వనరులు',
    nav_map: 'క్యాంపస్ మ్యాప్',
    nav_chatbot: '🤖 AI చాట్‌బాట్',
    nav_signin: 'సైన్ ఇన్',
    nav_join: 'కనెక్ట్‌లో చేరండి',
    nav_signout: 'సైన్ అవుట్',
    nav_dashboard: 'డాష్‌బోర్డ్',
    nav_profile: 'నా ప్రొఫైల్',

    landing_badge: 'గూగుల్ డెవలపర్ గ్రూప్స్ ఆన్ క్యాంపస్',
    landing_title: 'ఫ్రెషర్స్‌కు కావలసినవన్నీ — ఒకే స్మార్ట్ పోర్టల్‌లో.',
    landing_sub: 'క్యాంపస్ జీవితాన్ని సులభంగా నావిగేట్ చేయండి. ఈవెంట్‌లను అన్వేషించండి, మీ ఫ్యాకల్టీ సలహాదారులను కనుగొనండి, క్లబ్‌లతో కనెక్ట్ అవ్వండి, వనరులను డౌన్‌లోడ్ చేసుకోండి మరియు ఫ్రెషర్స్ ఫియస్టా 2026 కోసం నమోదు చేసుకోండి!',
    landing_btn_party: 'ఫ్రెషర్స్ పార్టీలో చేరండి 🎉',
    landing_btn_reg: 'ఖాతా నమోదు',
    landing_countdown_tag: 'అతిపెద్ద ఫియస్టా కోసం సిద్ధంగా ఉండండి',
    landing_countdown_title: 'ఫ్రెషర్స్ వెల్కమ్ పార్టీ 2026',
    landing_stats_students: 'మొదటి సంవత్సరం విద్యార్థులు',
    landing_stats_events: 'యాక్టివ్ లైవ్ ఈవెంట్‌లు',
    landing_stats_clubs: 'క్యాంపస్ క్లబ్‌లు',
    landing_stats_depts: 'విద్యా విభాగాలు',

    party_title: 'ఫ్రెషర్స్ ఫియస్టా 2026',
    party_sub: 'భారీ స్వాగత వేడుక, ఇంటరాక్టివ్ బీట్‌మేకర్ & ఎంట్రీ పాస్ రిజిస్ట్రేషన్',
    party_pass_tag: 'అధికారిక ఎంట్రీ పాస్',
    party_pass_btn: 'పార్టీ రిజిస్ట్రేషన్ పాస్ నిర్ధారించండి',
    party_food_label: 'క్యాటరింగ్ ఎంపిక',
    party_tshirt_label: 'సావనీర్ టీ-షర్టు పరిమాణం',
    party_beat_title: '🎧 ఇంటరాక్టివ్ హిట్ ట్రాక్ బీట్‌మేకర్',

    dept_title: 'యూనివర్సిటీ విభాగాలు',
    dept_sub: 'శాఖలను అన్వేషించండి, విభాగాల అధిపతులను కలవండి మరియు తరగతి గదులను కనుగొనండి.',
    dept_hod: 'విభాగపు అధిపతి',
    dept_block: 'బ్లాక్ స్థానం',
    dept_btn: 'డిపార్ట్‌మెంట్ హబ్ & ఫోటోలను వీక్షించండి',

    faculty_title: 'ఫ్యాకల్టీ డైరెక్టరీ & సలహాదారులు',
    faculty_sub: 'మీ విభాగ ప్రొఫెసర్లు, సలహాదారులు మరియు సంప్రదింపు సమాచారాన్ని కనుగొనండి.',
    faculty_search: 'పేరు, విభాగం లేదా పరిశోధనా రంగం ద్వారా ప్రొఫెసర్‌ను వెతకండి...',

    clubs_title: 'విద్యార్థి క్లబ్‌లు & సంఘాలు',
    clubs_sub: 'కోడింగ్ నైపుణ్యాలను పెంపొందించుకోవడానికి, రోబోట్‌లను నడపడానికి లేదా క్రీడలలో పాల్గొనడానికి సమూహాలలో చేరండి.',
    clubs_reg_btn: 'క్లబ్ నమోదు',

    resources_title: 'విద్యా వనరులు & సిలబస్‌లు',
    resources_sub: 'అధికారిక రెగ్యులేషన్ 2024 సిలబస్‌లు, వారపు టైమ్‌టేబుల్స్ & పిడిఎఫ్ లెక్చర్ నోట్స్.',
    resources_dl_btn: 'PDF పత్రాన్ని డౌన్‌లోడ్ చేయండి',

    map_title: 'ఇంటరాక్టివ్ క్యాంపస్ మ్యాప్',
    map_sub: 'అన్ని విశ్వవిద్యాలయ బ్లాక్‌ల కోసం ఇండోర్ ఫ్లోర్-బై-ఫ్లోర్ నావిగేషన్ గైడ్.',

    chatbot_title: 'జెమిని AI సహాయకుడు',
    chatbot_sub: 'ఫ్రెషర్స్ వారం గురించి మీ 24/7 AI క్యాంపస్ స్నేహితుడిని ఏదైనా అడగండి!'
  },

  ml: {
    nav_home: 'ഹോം',
    nav_party: 'പാർട്ടി',
    nav_departments: 'വകുപ്പുകൾ',
    nav_facilities: 'സൗകര്യങ്ങൾ',
    nav_faculty: 'അധ്യാപകർ',
    nav_clubs: 'ക്ലബ്ബുകൾ',
    nav_resources: 'പാഠ്യപദ്ധതി',
    nav_map: 'ക്യാമ്പസ് മാപ്പ്',
    nav_chatbot: '🤖 AI ചാറ്റ്ബോട്ട്',
    nav_signin: 'ലോഗിн',
    nav_join: 'കണക്റ്റിൽ ചേരുക',
    nav_signout: 'ലോഗ് ഔട്ട്',
    nav_dashboard: 'ഡാഷ്ബോർഡ്',
    nav_profile: 'എന്റെ പ്രൊഫൈൽ',

    landing_badge: 'ഗൂഗിൾ ഡെവലപ്പർ ഗ്രൂപ്പ്സ് ഓൺ ക്യാമ്പസ്',
    landing_title: 'ഒരു ഫ്രഷറിന് ആവശ്യമായതെല്ലാം — ഒരു സ്മാർട്ട് പോർട്ടലിൽ.',
    landing_sub: 'ക്യാമ്പസ് ജീവിതം സുഗമമായി നയിക്കുക. ഇവന്റുകൾ പര്യവേക്ഷണം ചെയ്യുക, നിങ്ങളുടെ ഫാക്കൽറ്റി ഉപദേശകരെ കണ്ടെത്തുക, ക്ലബ്ബുകളുമായി ബന്ധപ്പെടുക, റിസോഴ്സുകൾ ഡൗൺലോഡ് ചെയ്യുക, ഫ്രഷേഴ്സ് ഫിയസ്റ്റ 2026-നായി രജിസ്റ്റർ ചെയ്യുക!',
    landing_btn_party: 'ഫ്രഷേഴ്സ് പാർട്ടിയിൽ പങ്കെടുക്കുക 🎉',
    landing_btn_reg: 'അക്കൗണ്ട് രജിസ്റ്റർ ചെയ്യുക',
    landing_countdown_tag: 'ഏറ്റവും വലിയ ആഘോഷത്തിനായി തയ്യാറെടുക്കുക',
    landing_countdown_title: 'ഫ്രഷേഴ്സ് വെൽക്കം പാർട്ടി 2026',
    landing_stats_students: 'ഒന്നാം വർഷ വിദ്യാർത്ഥികൾ',
    landing_stats_events: 'സജീവ തത്സമയ ഇവന്റുകൾ',
    landing_stats_clubs: 'ക്യാമ്പസ് ക്ലബ്ബുകൾ',
    landing_stats_depts: 'അക്കാദമിക് വകുപ്പുകൾ',

    party_title: 'ഫ്രഷേഴ്സ് ഫിയസ്റ്റ 2026',
    party_sub: 'മഹത്തായ സ്വാഗത ആഘോഷം, ഇന്റരാക്റ്റീവ് ബീറ്റ്മേക്കർ & എൻട്രി പാസ് രജിസ്ട്രേഷൻ',
    party_pass_tag: 'ഔദ്യോഗിക എൻട്രി പാസ്',
    party_pass_btn: 'പാർട്ടി രജിസ്ട്രേഷൻ പാസ് സ്ഥിരീകരിക്കുക',
    party_food_label: 'ഭക്ഷണ ഓപ്ഷൻ',
    party_tshirt_label: 'ടി-ഷർട്ട് സൈസ്',
    party_beat_title: '🎧 ഇന്റരാക്റ്റീവ് ഹിറ്റ് ട്രാക്ക് ബീറ്റ്മേക്കർ',

    dept_title: 'യൂണിവേഴ്സിറ്റി വകുപ്പുകൾ',
    dept_sub: 'ശാഖകൾ പര്യവേക്ഷണം ചെയ്യുക, വകുപ്പ് മേധാവികളെ കാണുക, ക്ലാസ് ബ്ലോക്കുകൾ കണ്ടെത്തുക.',
    dept_hod: 'വകുപ്പ് മേധാവി',
    dept_block: 'ബ്ലോക്ക് ലൊക്കേഷൻ',
    dept_btn: 'ഡിപ്പാർട്ട്മെന്റ് ഹബ്ബും ഫോട്ടോകളും കാണുക',

    faculty_title: 'ഫാക്കൽറ്റി ഡയറക്ടറിയും ഉപദേശകരും',
    faculty_sub: 'നിങ്ങളുടെ വകുപ്പിലെ പ്രൊഫസർമാരെയും മെന്റർമാരെയും കാണുക, ഓഫീസ് സമയം കണ്ടെത്തുക.',
    faculty_search: 'പേര്, വകുപ്പ്, അല്ലെങ്കിൽ ഗവേഷണ മേഖല അനുസരിച്ച് പ്രൊഫസറെ തിരയുക...',

    clubs_title: 'വിദ്യാർത്ഥി ക്ലബ്ബുകളും സൊസൈറ്റികളും',
    clubs_sub: 'കോഡിംഗ് കഴിവുകൾ വികസിപ്പിക്കുന്നതിനും റോബോട്ടുകൾ നിർമ്മിക്കുന്നതിനും കായിക വിനോദങ്ങളിൽ ഏർപ്പെടുന്നതിനും ക്ലബ്ബുകളിൽ ചേരുക.',
    clubs_reg_btn: 'ക്ലബ് രജിസ്റ്റർ ചെയ്യുക',

    resources_title: 'അക്കാദമിക് റിസോഴ്സുകളും സിലബസുകളും',
    resources_sub: 'ഔദ്യോഗിക റെഗുലേഷൻ 2024 സിലബസുകൾ, പ്രതിവാര സമയവിവരപ്പട്ടികകൾ, പിഡിഎഫ് കുറിപ്പുകൾ.',
    resources_dl_btn: 'PDF ഡോക്യുമെന്റ് ഡൗൺലോഡ് ചെയ്യുക',

    map_title: 'ഇന്റരാക്റ്റീവ് ക്യാമ്പസ് മാപ്പ്',
    map_sub: 'എല്ലാ സർവകലാശാല ബ്ലോക്കുകൾക്കുമുള്ള ഇൻഡോർ ഫ്ലോർ ഗൈഡ്.',

    chatbot_title: 'Gemini AI അസിസ്റ്റന്റ്',
    chatbot_sub: 'ഫ്രഷേഴ്സ് വാരത്തെക്കുറിച്ച് നിങ്ങളുടെ AI ക്യാമ്പസ് സുഹൃത്തിനോട് ചോദിക്കൂ!'
  },

  hi: {
    nav_home: 'मुख्य पृष्ठ',
    nav_party: 'पार्टी',
    nav_departments: 'विभाग',
    nav_facilities: 'सुविधाएं',
    nav_faculty: 'शिक्षक संघ',
    nav_clubs: 'क्लब',
    nav_resources: 'अध्ययन सामग्री',
    nav_map: 'कैंपस मानचित्र',
    nav_chatbot: '🤖 AI चैटबॉट',
    nav_signin: 'साइन इन',
    nav_join: 'कनेक्ट से जुड़ें',
    nav_signout: 'साइन आउट',
    nav_dashboard: 'डैशबोर्ड',
    nav_profile: 'मेरी प्रोफ़ाइल',

    landing_badge: 'गूगल डेवलपर ग्रुप्स ऑन कैंपस',
    landing_title: 'एक नए छात्र की हर ज़रूरत — एक ही स्मार्ट पोर्टल पर।',
    landing_sub: 'कैंपस जीवन को आसानी से समझें। कार्यक्रमों का पता लगाएं, अपने संकाय सलाहकारों से मिलें, क्लबों से जुड़ें, संसाधन डाउनलोड करें, और फ्रेशर्स फिएस्टा 2026 के लिए पंजीकरण करें!',
    landing_btn_party: 'फ्रेशर्स पार्टी में शामिल हों 🎉',
    landing_btn_reg: 'पंजीकरण करें',
    landing_countdown_tag: 'सबसे बड़े उत्सव के लिए तैयार हो जाइए',
    landing_countdown_title: 'फ्रेशर्स स्वागत पार्टी 2026',
    landing_stats_students: 'प्रथम वर्ष के छात्र',
    landing_stats_events: 'सक्रिय लाइव इवेंट',
    landing_stats_clubs: 'कैंपस क्लब',
    landing_stats_depts: 'अकादमिक विभाग',

    party_title: 'फ्रेशर्स फिएस्टा 2026',
    party_sub: 'भव्य स्वागत समारोह, इंटरैक्टिव बीटमेकर और प्रवेश पास पंजीकरण',
    party_pass_tag: 'आधिकारिक प्रवेश पास',
    party_pass_btn: 'पंजीकरण पास की पुष्टि करें',
    party_food_label: 'भोजन का विकल्प',
    party_tshirt_label: 'टी-शर्ट का आकार',
    party_beat_title: '🎧 इंटरैक्टिव हिट ट्रैक बीटमेकर',

    dept_title: 'विश्वविद्यालय के विभाग',
    dept_sub: 'शाखाओं का पता लगाएं, विभागाध्यक्षों से मिलें और कक्षाओं के ब्लॉक खोजें।',
    dept_hod: 'विभागाध्यक्ष',
    dept_block: 'ब्लॉक का स्थान',
    dept_btn: 'विभाग हब और तस्वीरें देखें',

    faculty_title: 'संकाय निर्देशिका और सलाहकार',
    faculty_sub: 'अपने विभाग के प्रोफेसरों, आकाओं से मिलें और संपर्क समय जानें।',
    faculty_search: 'नाम, विभाग या अनुसंधान क्षेत्र द्वारा प्रोफेसर खोजें...',

    clubs_title: 'छात्र क्लब और समितियां',
    clubs_sub: 'कोडिंग कौशल बनाने, रोबोट चलाने, खेल खेलने या प्रतिभा दिखाने के लिए समूहों में शामिल हों।',
    clubs_reg_btn: 'क्लब पंजीकरण',

    resources_title: 'अकादमिक संसाधन और पाठ्यक्रम',
    resources_sub: 'आधिकारिक नियमन 2024 पाठ्यक्रम, साप्ताहिक समय सारणी और व्याख्यान नोट्स।',
    resources_dl_btn: 'PDF डाउनलोड करें',

    map_title: 'इंटरैक्टिव कैंपस मानचित्र',
    map_sub: 'सभी विश्वविद्यालय ब्लॉकों के लिए इनडोर मंजिल-वार गाइड।',

    chatbot_title: 'जेमिनी AI सहायक',
    chatbot_sub: 'फ्रेशर्स सप्ताह के बारे में अपने AI कैंपस मित्र से कुछ भी पूछें!'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('gdg_portal_language') || 'en';
  });

  const setLanguage = (langCode) => {
    setLanguageState(langCode);
    localStorage.setItem('gdg_portal_language', langCode);
  };

  const t = (key) => {
    return translations[language]?.[key] || 
           extraTranslations[language]?.[key] || 
           translations['en']?.[key] || 
           extraTranslations['en']?.[key] || 
           key;
  };

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, LANGUAGES, currentLangObj }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
