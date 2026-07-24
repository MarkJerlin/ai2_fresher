import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { chatAPI } from '../services/api';
import { 
  FaRobot, FaPaperPlane, FaMicrophone, FaVolumeUp, FaVolumeMute, 
  FaPlus, FaTrashAlt, FaCommentAlt, FaLightbulb, FaSearch
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const GeminiStarIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z" fill="url(#gemini-grad)" />
    <defs>
      <linearGradient id="gemini-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4285F4" />
        <stop offset="0.5" stopColor="#9B51E0" />
        <stop offset="1" stopColor="#EA4335" />
      </linearGradient>
    </defs>
  </svg>
);

const chatbotTranslations = {
  en: {
    initialTitle: "Campus Orientation & Info",
    initialGreeting: (name) => `Hello ${name}! 👋 I am your GDG Gemini AI Assistant. Ask me anything about campus maps, department timetables, syllabus downloads, Freshers Fiesta party passes, or student clubs!`,
    newChatTitle: "New Chat",
    newChatInitial: "Hello! 👋 How can I help you today? Ask me about campus navigation, department syllabuses, party passes, or student clubs!",
    sidebarTitle: "Gemini AI History",
    newChatBtn: "New Chat",
    searchPlaceholder: "Search chat history...",
    recentConvs: "Recent Conversations",
    noHistory: "No history matches found.",
    deleteSession: "Delete Chat Session",
    voiceOn: "Voice On",
    voiceOff: "Voice Off",
    thinking: "Gemini AI thinking...",
    inputPlaceholder: "Ask Gemini AI anything about freshers events, timetables, syllabus...",
    sendBtn: "Send",
    greeting: (name) => `Hey ${name}! 👋 Welcome to college life! 🎓 Ask me anything about campus snacks, CSE timetables, Freshers Fiesta dress codes, or joining student clubs!`,
    fallback: (name) => `Hey ${name}! I'm your GDG Gemini Campus Buddy! Here are top topics you can ask me about:\n• **🍕 Canteen Snacks & Chill Spots**\n• **🎓 75% Attendance Rules & CGPA Tips**\n• **🗺️ Turing Block & Campus Locations**\n• **🎉 Freshers Fiesta Passes & T-Shirt Sizes**\n• **📚 Downloading CSE/IT Timetable PDFs**\n\nWhat would you like to explore?`,
    attendance: "🎓 **Attendance Policy Pro-Tip!**\n\nCollege regulation requires a minimum of **75% attendance** per subject to sit for semester exams! Keep track of your daily attendance percentage directly inside your **Dashboard** profile!",
    canteen: "🍕 **Best Campus Food & Chill Spots!**\n\n• **Main Student Canteen:** Ground Floor near Central Quad (Famous for hot samosas, cold coffee, & cheese maggi! ☕)\n• **Turing Cyber Cafe:** Turing Block Basement (Great espresso, quick sandwiches & charging plugs).",
    cgpa: "✍️ **Acing 1st Year Semester Exams & Scoring 9.0+ CGPA:**\n\n1. Download Regulation 2024 Syllabuses & Lecture Notes from **Resources**.\n2. Review internal assessment question banks early.\n3. Stay consistent with lab assignments—freshman year CGPA boosts your overall placement score!",
    library: "📚 **Central Library & Quiet Study Zones:**\n\nLocated directly opposite the Admin Block. Open **8:00 AM to 8:00 PM** with high-speed campus Wi-Fi, air-conditioned quiet reading pods, and free digital reference book archives!",
    transport: "🚌 **Hostel & Campus Bus Timings:**\n\n• **College Buses:** Depart daily at 4:30 PM from South Gate.\n• **Hostel Curfew:** 9:30 PM entry cutoff for 1st-year freshman blocks!",
    dj: "🎧 **DJ Party Sets & Song Wishlist:**\n\nDJ Spark will be dropping festival EDM & Rock hits at the Fiesta! Open the **Interactive Beatmaker** in the **Party** page to listen to hit tracks (*Alan Walker - Faded, Guns N' Roses, Dua Lipa, Travis Scott - FE!N*) and favorite your song requests!",
    turing_cse: "🏛️ **Turing Block (CSE Department)**\n\nLocated at **North Campus, Quad 1**. It houses CSE Lecture Halls 101–304, Advanced AI & Data Science Labs, and the GDG Student Hub. You can view full indoor floor layouts on the **Campus Map** page!",
    babbage_it: "🏛️ **Babbage Block (IT Department)**\n\nLocated at **North Campus, Quad 2**. It features IT Lecture Rooms, High-Performance Cloud Computing Labs, and the Turing Guild Hackerspace.",
    tesla_ece_mech: "🏛️ **Tesla Block (ECE & MECH Departments)**\n\nLocated at **South Campus, Block C**. It houses Electronics Robotics Labs, Mechanical CAD/CAM Workshops, and the Indoor Drone Flight Trial Cage.",
    blocks_all: "🗺️ The campus features 4 main blocks:\n• **Turing Block:** CSE Department & AI Labs\n• **Babbage Block:** IT Department & Cloud Labs\n• **Tesla Block:** ECE & MECH Engineering Workshops\n• **Admin Building:** Main Auditorium & Administrative Offices\n\nCheck out the interactive floor-by-floor map on the **Campus Map** page!",
    party: "🎉 **Freshers Welcome Fiesta 2026**\n\n• **Date & Time:** August 15, 2026 at 6:00 PM\n• **Venue:** Main Campus Auditorium\n• **Dress Code:** Neon Glam & Retro Cyberpunk\n• **Food & Souvenirs:** Includes Veg/Non-Veg Catering Box and custom T-Shirt size (XS–XXXL).\n\nYou can reserve your pass on the **Party** page!",
    timetable: "📚 **Academic Resources & Downloads**\n\nOfficial Regulations 2024 Syllabuses, Weekly Class Timetables, and Lecture Notes for **CSE, IT, ECE, and MECH** are available as downloadable A4 PDF files on the **Resources** page!",
    clubs: "🚀 **Campus Student Clubs**\n\n1. **GDG On Campus:** Google Developer Student Club\n2. **Robotics & IoT Club:** Drones & Robowars\n3. **Coding Ninjas:** DSA & Competitive Programming\n4. **Turing Guild:** Open Source & Linux Kernels\n5. **Sports Club:** Football, Cricket & Futsal Leagues\n\nVisit the **Clubs** page to join your favorite groups!",
    faculty: "👨‍🏫 **Faculty Directory & HODs**\n\nFind office hours, email contacts, and research specializations for all department professors on the **Faculty** page!",
    categories: [
      {
        category: "🍕 Campus Life & Chill",
        items: [
          "🍕 Where is the best canteen snack spot?",
          "🎓 What is the 75% attendance rule?",
          "📚 Where is Central Library & Wi-Fi?",
          "🚌 What are hostel & bus timings?"
        ]
      },
      {
        category: "🎉 Fiesta & Party",
        items: [
          "🎉 What is the Freshers Party schedule & dress code?",
          "🥗 Are food boxes & T-Shirts included with party pass?",
          "🎧 Who is performing at the DJ set & how to request songs?"
        ]
      },
      {
        category: "📚 Academics & Notes",
        items: [
          "📚 Download CSE Timetable & Syllabus PDF",
          "✍️ How to score 9.0+ CGPA in 1st year exams?"
        ]
      },
      {
        category: "🚀 Clubs & Gaming",
        items: [
          "🚀 Which club is best for beginner coders?",
          "🛸 Where are Robotics & Drone trial flights?",
          "⚽ How to join the Freshers Futsal League?"
        ]
      }
    ]
  },
  ta: {
    initialTitle: "வளாக வழிகாட்டி & தகவல்",
    initialGreeting: (name) => `வணக்கம் ${name}! 👋 நான் உங்கள் GDG ஜெமினி AI உதவியாளர். வளாக வரைபடங்கள், துறை கால அட்டவணைகள், பாடத்திட்டப் பதிவிறக்கங்கள், வரவேற்பு விழா பாஸ்கள் அல்லது மாணவர் மன்றங்கள் பற்றி என்னிடம் எதையும் கேளுங்கள்!`,
    newChatTitle: "புதிய அரட்டை",
    newChatInitial: "வணக்கம்! 👋 இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்? வளாக வழிசெலுத்தல், துறை பாடத்திட்டங்கள், பார்ட்டி பாஸ்கள் அல்லது மாணவர் மன்றங்கள் பற்றி என்னிடம் கேளுங்கள்!",
    sidebarTitle: "Gemini AI வரலாறு",
    newChatBtn: "புதிய அரட்டை",
    searchPlaceholder: "உரையாடல் வரலாற்றைத் தேடு...",
    recentConvs: "சமீபத்திய உரையாடல்கள்",
    noHistory: "உரையாடல்கள் எதுவும் இல்லை.",
    deleteSession: "அரட்டையை நீக்கு",
    voiceOn: "குரல் ஆன்",
    voiceOff: "குரல் ஆஃப்",
    thinking: "ஜெமினி AI சிந்திக்கிறது...",
    inputPlaceholder: "வளாக நிகழ்வுகள், கால அட்டவணைகள், பாடத்திட்டம் பற்றி எதையும் கேளுங்கள்...",
    sendBtn: "அனுப்பு",
    greeting: (name) => `வணக்கம் ${name}! 👋 கல்லூரி வாழ்க்கைக்கு உங்களை வரவேற்கிறோம்! 🎓 உணவு விடுதிகள், கணினி அறிவியல் கால அட்டவணை, வரவேற்பு விழா ஆடை குறியீடு அல்லது மாணவர் மன்றங்களில் சேருவது பற்றி என்னிடம் கேளுங்கள்!`,
    fallback: (name) => `வணக்கம் ${name}! நான் உங்கள் GDG ஜெமினி வளாக நண்பன்! நீங்கள் என்னிடம் கேட்கக்கூடிய முக்கிய தலைப்புகள் இதோ:\n• **🍕 உணவக தின்பண்டங்கள் & தங்கும் இடங்கள்**\n• **🎓 75% வருகைப்பதிவு விதிகள் & CGPA குறிப்புகள்**\n• **🗺️ டூரிங் பிளாக் & வளாக இருப்பிடங்கள்**\n• **🎉 புதியவர் வரவேற்பு விழா பாஸ்கள் & டி-ஷர்ட் அளவுகள்**\n• **📚 சி.எஸ்.இ/ஐ.டி கால அட்டவணை PDF-களை பதிவிறக்குதல்**\n\nநீங்கள் எதை ஆராய விரும்புகிறீர்கள்?`,
    attendance: "🎓 **வருகைப்பதிவு கொள்கை குறிப்பு!**\n\nசெமஸ்டர் தேர்வுகளுக்கு எழுத ஒவ்வொரு பாடத்திலும் குறைந்தபட்சம் **75% வருகைப்பதிவு** தேவை! உங்கள் தினசரி வருகை சதவீதத்தை நேரடியாக உங்கள் **டாஷ்போர்டு** சுயவிவரத்தில் கண்காணிக்கவும்!",
    canteen: "🍕 **சிறந்த வளாக உணவு & தங்கும் இடங்கள்!**\n\n• **முதன்மை உணவகம்:** மத்திய மைதானத்திற்கு அருகில் உள்ள தரை தளம் (சூடான சமோசாக்கள், கோல்ட் காபி மற்றும் சீஸ் மேகிக்கு பிரபலமானது! ☕)\n• **டியூரிங் சைபர் கஃபே:** டியூரிங் பிளாக் அடித்தளம் (சிறந்த எஸ்பிரெசோ, விரைவான சாண்ட்விச்கள் & சார்ஜிங் சாக்கெட்டுகள்).",
    cgpa: "✍️ **முதலாம் ஆண்டு செமஸ்டர் தேர்வுகளில் வெற்றி பெற்று 9.0+ CGPA பெறுவது எப்படி:**\n\n1. விதிகள் 2024 பாடத்திட்டம் மற்றும் விரிவுரை குறிப்புகளை **பாடத்திட்டங்கள்** பக்கத்திலிருந்து பதிவிறக்கவும்.\n2. மாதிரி வினா வங்கிகளை முன்கூட்டியே மதிப்பாய்வு செய்யவும்.\n3. ஆய்வகப் பணிகளைத் தொடர்ந்து முடிக்கவும்—முதலாம் ஆண்டு CGPA உங்கள் வேலைவாய்ப்பு வாய்ப்புகளை அதிகரிக்கும்!",
    library: "📚 **மைய நூலகம் & அமைதியான படிப்பு மண்டலங்கள்:**\n\nநிர்வாக கட்டிடத்திற்கு நேர் எதிரே அமைந்துள்ளது. காலை **8:00 மணி முதல் இரவு 8:00 மணி வரை** திறந்திருக்கும். அதிவேக வைஃபை, குளிர்சாதன வசதி கொண்ட தனி படிப்பு அறைகள் மற்றும் இலவச டிஜிட்டல் புத்தக காப்பகங்கள் உள்ளன!",
    transport: "🚌 **விடுதி & கல்லூரி பேருந்து நேரங்கள்:**\n\n• **கல்லூரி பேருந்துகள்:** தினமும் மாலை 4:30 மணிக்கு தெற்கு வாசலில் இருந்து புறப்படும்.\n• **விடுதி விதிகள்:** முதலாம் ஆண்டு மாணவர் விடுதிகளுக்கு இரவு 9:30 மணிக்குள் நுழைய வேண்டும்!",
    dj: "🎧 **டிஜே பார்ட்டி மற்றும் பாடல் கோரிக்கை:**\n\nவரவேற்பு விழாவில் டிஜே ஸ்பார்க் சிறந்த EDM & ராக் ஹிட் பாடல்களை இசைப்பார்! உங்களுக்குப் பிடித்த பாடல்களை (*Alan Walker - Faded, Guns N' Roses, Dua Lipa, Travis Scott - FE!N*) கோர **பார்ட்டி** பக்கத்தில் உள்ள **ஊடாடும் இசை பீட்மேக்கரை** திறக்கவும்!",
    turing_cse: "🏛️ **டூரிங் பிளாக் (கணினி அறிவியல் துறை)**\n\n**வடக்கு வளாகம், குவாட் 1** இல் அமைந்துள்ளது. இதில் சி.எஸ்.இ விரிவுரை அரங்குகள் 101–304, மேம்பட்ட ஏআই ஆய்வகங்கள் மற்றும் ஜிடிஜி மாணவர் மையம் உள்ளன. முழுமையான தள வரைபடங்களை **வளாக வரைபடம்** பக்கத்தில் காணலாம்!",
    babbage_it: "🏛️ **பாபேஜ் பிளாக் (தகவல் தொழில்நுட்ப துறை)**\n\n**வடக்கு வளாகம், குவாட் 2** இல் அமைந்துள்ளது. இதில் ஐ.டி விரிவுரை அறைகள், கிளவுட் கம்ப்யூட்டிங் ஆய்வகங்கள் மற்றும் டியூரிங் கில்ட் ஹேக்கர்ஸ்பேஸ் உள்ளன.",
    tesla_ece_mech: "🏛️ **டெஸ்லா பிளாக் (மின்னணுவியல் & இயந்திரப் பொறியியல் துறைகள்)**\n\n**தெற்கு வளாகம், பிளாக் சி** இல் அமைந்துள்ளது. రోబోటిక్స్ ల్యాబ్‌లు, మెకానికల్ CAD/CAM వర్క్‌షాప్‌లు మరియు డ్రోన్ విమాన ప్రయోగ కేజ్ ఉన్నాయి.",
    blocks_all: "🗺️ வளாகத்தில் 4 முக்கிய கட்டிடங்கள் உள்ளன:\n• **டூரிங் பிளாக்:** சி.எஸ்.இ துறை & ஏআই ஆய்வகங்கள்\n• **பாபேஜ் பிளாக்:** ஐ.டி துறை & கிளவுட் ஆய்வகங்கள்\n• **டெஸ்லா பிளாக்:** ECE & மெக்கானிக்கல் பட்டறைகள்\n• **நிர்வாக கட்டிடம்:** Admin Building: Main Auditorium & Administrative Offices\n\nCheck out the interactive floor-by-floor map on the **Campus Map** page!",
    party: "🎉 **புதியவர் வரவேற்பு விழா 2026**\n\n• **தேதி & நேரம்:** ஆகஸ்ட் 15, 2026 மாலை 6:00 மணி\n• **இடம்:** முதன்மை அரங்கம்\n• **ஆடை குறியீடு:** நியான் கிளாம் & ரெட்ரோ சைபர்பங்க்\n• **உணவு & நினைவுப் பொருட்கள்:** சைவ/அசைவ உணவு பெட்டி மற்றும் டி-ஷர்ட் (XS–XXXL) அடங்கும்.\n\nஉங்கள் பாஸை **பார்ட்டி** பக்கத்தில் பதிவு செய்யலாம்!",
    timetable: "📚 **அகாடமிக் வளங்கள் & பதிவிறக்கங்கள்**\n\n**CSE, IT, ECE, మరియు MECH** ஆகிய துறைகளுக்கான கால அட்டவணைகள் మరియు பாடத்திட்டங்கள் **பாடத்திட்டங்கள்** பக்கத்தில் A4 PDF கோப்புகளாக பதிவிறக்கம் செய்ய கிடைக்கின்றன!",
    clubs: "🚀 **வளாக மாணவர் மன்றங்கள்**\n\n1. **GDG On Campus:** கூகிள் டெவலப்பர் மாணவர் மன்றம்\n2. **ரோபாட்டிக்స్ மன்றம்:** Drones & Robowars\n3. **கோடிங் நிஞ்ஜாக்கள்:** DSA & போட்டி நிரலாக்கம்\n4. **டியூரிங் கில்ட்:** ஓப்பன் சோர்ஸ் & லினக்ஸ் கர்னல்கள்\n5. **விளையாட்டு மன்றம்:** கால்பந்து, கிரிக்கெட் போட்டிகள்\n\nஉங்களுக்குப் பிடித்த மன்றங்களில் சேர **மன்றங்கள்** பக்கத்தைப் பார்வையிடவும்!",
    faculty: "👨‍🏫 **பேராசிரியர்கள் டைரக்டரி & துறைத் தலைவர்கள்**\n\nஅனைத்து பேராசிரியர்களின் அலுவலக நேரம், மின்னஞ்சல் தொடர்புகள் மற்றும் ஆராய்ச்சி விவரங்களை **பேராசிரியர்கள்** பக்கத்தில் கண்டறியவும்!",
    categories: [
      {
        category: "🍕 வளாக வாழ்க்கை & உணவு",
        items: [
          "🍕 சிறந்த உணவக தின்பண்டம் எங்கு கிடைக்கும்?",
          "🎓 75% வருகைப்பதிவு விதி என்ன?",
          "📚 மத்திய நூலகம் & வைஃபை எங்கு உள்ளது?",
          "🚌 விடுதி மற்றும் பேருந்து நேரங்கள் என்ன?"
        ]
      },
      {
        category: "🎉 வரவேற்பு விழா & பார்ட்டி",
        items: [
          "🎉 புதியவர் பார்ட்டி அட்டவணை & ஆடை குறியீடு என்ன?",
          "🥗 பார்ட்டி பாஸுடன் உணவு மற்றும் டி-ஷர்ட் கிடைக்குமா?",
          "🎧 டிஜே செட்டில் யார் பாடுகிறார்கள் & பாட்டு கேட்பது எப்படி?"
        ]
      },
      {
        category: "📚 கல்வி & குறிப்புகள்",
        items: [
          "📚 சி.எஸ்.இ கால அட்டவணை & பாடத்திட்ட PDF பதிவிறக்கம்",
          "✍️ முதலாம் ஆண்டு தேர்வில் 9.0+ CGPA பெறுவது எப்படி?"
        ]
      },
      {
        category: "🚀 மன்றங்கள் & கேமிங்",
        items: [
          "🚀 தொடக்க நிலை குறியீட்டாளர்களுக்கு எந்த மன்றம் சிறந்தது?",
          "🛸 ரோபாட்டிக்ஸ் & ட்ரோன் சோதனை பறப்புகள் எங்கு நடைபெறும்?",
          "⚽ புதியவர்கள் புட்சல் லீக்கில் எவ்வாறு சேருவது?"
        ]
      }
    ]
  },
  te: {
    initialTitle: "క్యాంపస్ ఓరియంటేషన్ & సమాచారం",
    initialGreeting: (name) => `హలో ${name}! 👋 నేను మీ GDG జెమిని AI సహాయకుడిని. క్యాంపస్ మ్యాప్‌లు, డిపార్ట్‌మెంట్ టైమ్‌టేబుల్‌లు, సిలబస్ డౌన్‌లోడ్‌లు, ఫ్రెషర్స్ ఫియస్టా పార్టీ పాస్‌లు లేదా స్టూడెంట్ క్లబ్‌ల గురించి నన్ను ఏదైనా అడగండి!`,
    newChatTitle: "కొత్త చాట్",
    newChatInitial: "హలో! 👋 ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను? క్యాంపస్ నావిగేషన్, డిపార్ట్‌మెంట్ సిలబస్, పార్టీ పాస్‌లు లేదా స్టూడెంట్ క్లబ్‌ల గురించి నన్ను అడగండి!",
    sidebarTitle: "జెమిని AI చరిత్ర",
    newChatBtn: "కొత్త చాట్",
    searchPlaceholder: "చాట్ చరిత్రను వెతకండి...",
    recentConvs: "సమీప సంభాషణలు",
    noHistory: "చరిత్ర ఫలితాలు కనుగొనబడలేదు.",
    deleteSession: "చాట్ సెషన్‌ను తొలగించండి",
    voiceOn: "వాయిస్ ఆన్",
    voiceOff: "వాయిస్ ఆఫ్",
    thinking: "జెమిని AI ఆలోచిస్తోంది...",
    inputPlaceholder: "ఫ్రెషర్స్ ఈవెంట్‌లు, టైమ్‌టేబుల్‌లు, సిలబస్ గురించి జెమిని AI ని ఏదైనా అడగండి...",
    sendBtn: "పంపించు",
    greeting: (name) => `హే ${name}! 👋 కాలేజీ జీవితానికి స్వాగతం! 🎓 క్యాంపస్ స్నాక్స్, CSE టైమ్‌టేబుల్స్, ఫ్రెషర్స్ ఫియస్టా డ్రెస్ కోడ్‌లు లేదా స్టూడెంట్ క్లబ్‌లలో చేరడం గురించి నన్ను ఏదైనా అడగండి!`,
    fallback: (name) => `హే ${name}! నేను మీ GDG జెమిని క్యాంపస్ బడ్డీని! మీరు నన్ను అడగగల ప్రధాన అంశాలు ఇక్కడ ఉన్నాయి:\n• **🍕 క్యాంటీన్ స్నాక్స్ & చిల్ స్పాట్స్**\n• **🎓 75% హాజరు నియమాలు & CGPA చిట్కాలు**\n• **🗺️ ట్యూరింగ్ బ్లాక్ & క్యాంపస్ లొకేషన్స్**\n• **🎉 ఫ్రెషర్స్ ఫియస్టా పాస్‌లు & టీ-భర్టు సైజులు**\n• **📚 CSE/IT టైమ్‌టేబుల్ PDFలను డౌన్‌లోడ్ చేయడం**\n\nమీరు దేనిని అన్వేషించాలనుకుంటున్నారు?`,
    attendance: "🎓 **హాజరు విధానం చిట్కా!**\n\nసెమిస్టర్ పరీక్షలకు హాజరు కావడానికి ప్రతి సబ్జెక్టులో కనీసం **75% హాజరు** అవసరం! మీ రోజువారీ హాజరు శాతాన్ని నేరుగా మీ **డాష్‌బోర్డ్** ప్రొఫైల్‌లో ట్రాక్ చేయండి!",
    canteen: "🍕 **ఉత్తమ క్యాంపస్ ఫుడ్ & చిల్ స్పాట్స్!**\n\n• **ప్రధాన క్యాంటీన్:** సెంట్రల్ క్వాడ్ సమీపంలో గ్రౌండ్ ఫ్లోర్ (వేడి సమోసాలు, కోల్డ్ కాఫీ & చీజ్ మ్యాగీకి ప్రసిద్ధి! ☕)\n• **ట్యూరింగ్ సైబర్ కేఫ్:** ట్యూరింగ్ బ్లాక్ బేస్మెంట్ (గొప్ప ఎస్ప్రెస్సో, శీఘ్ర శాండ్‌విచ్‌లు & ఛార్జింగ్ సాకెట్లు).",
    cgpa: "✍️ **1వ సంవత్సరం సెమిస్టర్ పరీక్షలలో విజయం సాధించడం & 9.0+ CGPA సాధించడం:**\n\n1. **వనరులు** పేజీ నుండి రెగ్యులేషన్ 2024 సిలబస్ & లెక్చర్ నోట్స్ డౌన్‌లోడ్ చేసుకోండి.\n2. ఇంటర్నల్ పరీక్షల ప్రశ్న పత్రాలను ముందుగానే సమీక్షించండి.\n3. ల్యాబ్ అసైన్‌మెంట్‌లను క్రమ తప్పకుండా పూర్తి చేయండి—మొదటి సంవత్సరం CGPA మీ ప్లేస్‌మెంట్ స్కోర్‌ను పెంచుతుంది!",
    library: "📚 **సెంట్రల్ లైబ్రరీ & ప్రశాంతమైన స్టడీ జోన్లు:**\n\nఅడ్మిన్ బ్లాక్‌కు నేరుగా ఎదురుగా ఉంది. ఉదయం **8:00 నుండి రాత్రి 8:00 వరకు** తెరిచి ఉంటుంది. హై-స్పీడ్ వై-ఫై, ఎయిర్ కండిషన్డ్ రీడింగ్ పాడ్‌లు మరియు ఉచిత డిజిటల్ పుస్తక నిధి ఉన్నాయి!",
    transport: "🚌 **హాస్టల్ & క్యాంపస్ బస్సు వేళలు:**\n\n• **కళాశాల బస్సులు:** ప్రతిరోజూ సాయంత్రం 4:30 గంటలకు సౌత్ గేట్ నుండి బయలుదేరుతాయి.\n• **హాస్టల్ నియమం:** మొదటి సంవత్సరం విద్యార్థుల హాస్టళ్లకు రాత్రి 9:30 గంటల లోపు ప్రవేశించాలి!",
    dj: "🎧 **DJ పార్టీ సెట్లు & పాటల అభ్యర్థన:**\n\nDJ స్పార్క్ ఫ్రెషర్స్ పార్టీలో అద్భుతమైన EDM & రాక్ హిట్‌లను ప్లే చేస్తారు! మీకు ఇష్టమైన పాటలను (*Alan Walker - Faded, Guns N' Roses, Dua Lipa, Travis Scott - FE!N*) అభ్యర్థించడానికి **పార్టీ** పేజీలోని **ఇంటరాక్టివ్ బీట్‌మేకర్** తెరవండి!",
    turing_cse: "🏛️ **ట్యూరింగ్ బ్లాక్ (CSE విభాగం)**\n\n**ఉత్తర క్యాంపస్, క్వాడ్ 1** లో ఉంది. ఇందులో CSE లెక్చర్ హాళ్లు 101–304, అడ్వాన్స్‌డ్ AI ల్యాబ్‌లు మరియు GDG స్టూడెంట్ హబ్ ఉన్నాయి. పూర్తి అంతస్తుల లేఅవుట్లను **క్యాంపస్ మ్యాప్** పేజీలో చూడవచ్చు!",
    babbage_it: "🏛️ **బాబేజ్ బ్లాక్ (IT విభాగం)**\n\n**ఉత్తర క్యాంపస్, క్వాడ్ 2** లో ఉంది. ఇందులో IT లెక్చర్ గదులు, క్లౌడ్ కంప్యూటింగ్ ల్యాబ్‌లు మరియు ట్యూరింగ్ గిల్డ్ హ్యాకర్ స్పేస్ ఉన్నాయి.",
    tesla_ece_mech: "🏛️ **టెస్లా బ్లాక్ (ECE & MECH విభాగాలు)**\n\n**దక్షిణ క్యాంపస్, బ్లాక్ సి** లో ఉంది. రోబోటిక్స్ ల్యాబ్‌లు, మెకానికల్ CAD/CAM వర్క్‌షాప్‌లు మరియు డ్రోన్ విమాన ప్రయోగ కేజ్ ఉన్నాయి.",
    blocks_all: "🗺️ క్యాంపస్ లో 4 ప్రధాన బ్లాక్‌లు ఉన్నాయి:\n• **ట్యూరింగ్ బ్లాక్:** CSE విభాగం & AI ల్యాబ్‌లు\n• **బాబేజ్ బ్లాక్:** IT విభాగం & క్లౌడ్ ల్యాబ్‌లు\n• **టెస్లా బ్లాక్:** ECE & MECH వర్క్‌షాప్‌లు\n• **అడ్మిన్ బిల్డింగ్:** మెయిన్ ఆడిటోరియం & అడ్మినిస్ట్రేటివ్ ఆఫీసులు\n\nఇంటరాక్టివ్ మ్యాప్‌ను **క్యాంపస్ మ్యాప్** పేజీలో చూడండి!",
    party: "🎉 **ఫ్రెషర్స్ వెల్కమ్ ఫియస్టా 2026**\n\n• **తేదీ & సమయం:** ఆగస్టు 15, 2026 సాయంత్రం 6:00 గంటలకు\n• **వేదిక:** ప్రధాన ఆడిటోరియం\n• **డ్రెస్ కోడ్:** నియాన్ గ్లామ్ & రెట్రో సైబర్‌పంక్\n• **ఆహారం & సావనీర్లు:** వెజ్/నాన్-వెజ్ ఫుడ్ బాక్స్ మరియు టీ-షర్టు (XS–XXXL) ఉంటాయి.\n\nమీరు మీ పాస్‌ను **పార్టీ** పేజీలో బుక్ చేసుకోవచ్చు!",
    timetable: "📚 **విద్యా వనరులు & డౌన్‌లోడ్‌లు**\n\n**CSE, IT, ECE, మరియు MECH** కొరకు టైమ్‌టేబుల్స్ మరియు సిలబస్ **వనరులు** పేజీలో A4 PDF ఫైల్‌లుగా డౌన్‌లోడ్ చేసుకోవడానికి అందుబాటులో ఉన్నాయి!",
    clubs: "🚀 **క్యాంపస్ స్టూడెంట్ క్లబ్‌లు**\n\n1. **GDG On Campus:** గూగుల్ డెవలపర్ స్టూడెంట్ క్లబ్\n2. **రోబోటిక్స్ క్లబ్:** డ్రోన్లు & రోబోటిక్ యుద్ధాలు\n3. **కోడింగ్ నింజాలు:** DSA & కాంపిటీటివ్ ప్రోగ్రామింగ్\n4. **ట్యూరింగ్ గిల్డ్:** ఓపెన్ సోర్స్ & లినక్స్ కెర్నల్స్\n5. **స్పోర్ట్స్ క్లబ్:** ఫుట్‌బాల్, క్రికెట్ లీగ్‌లు\n\nమీకు ఇష్టమైన క్లబ్‌లలో చేరడానికి **క్లబ్‌లు** పేజీని సందర్శించండి!",
    faculty: "👨‍🏫 **ఫ్యాకల్టీ డైరెక్టరీ & HODలు**\n\nప్రతి విభాగం ప్రొఫెసర్ల సంప్రదింపు సమాచారం, ఈమెయిల్ మరియు పరిశోధన వివరాలను **ఫ్యాకల్టీ** పేజీలో కనుగొనండి!",
    categories: [
      {
        category: "🍕 క్యాంపస్ లైఫ్ & చిల్",
        items: [
          "🍕 ఉత్తమ క్యాంటీన్ స్నాక్ స్పాట్ ఎక్కడ ఉంది?",
          "🎓 75% హాజరు నిబంధన ఏమిటి?",
          "📚 సెంట్రల్ లైబ్రరీ & వై-ఫై ఎక్కడ ఉంది?",
          "🚌 హాస్టల్ & బస్సు వేళలు ఏమిటి?"
        ]
      },
      {
        category: "🎉 ఫియస్టా & పార్టీ",
        items: [
          "🎉 ఫ్రెషర్స్ పార్టీ షెడ్యూల్ & డ్రెస్ కోడ్ ఏమిటి?",
          "🥗 పార్టీ పాస్‌తో పాటు ఫుడ్ బాక్స్ & టీ-షర్ట్ ఉంటాయా?",
          "🎧 DJ సెట్‌లో ఎవరు పాడుతున్నారు & పాటల అభ్యర్థన ఎలా చేయాలి?"
        ]
      },
      {
        category: "📚 అకడమిక్స్ & నోట్స్",
        items: [
          "📚 CSE టైమ్‌టేబుల్ & సిలబస్ PDF డౌన్‌లోడ్ చేసుకోండి",
          "✍️ 1వ సంవత్సరం పరీక్షల్లో 9.0+ CGPA ఎలా సాధించాలి?"
        ]
      },
      {
        category: "🚀 క్లబ్‌లు & గేమింగ్",
        items: [
          "🚀 ప్రారంభకులకు ఏ క్లబ్ ఉత్తమమైనది?",
          "🛸 రోబోటిక్స్ & డ్రోన్ ట్రయల్స్ ఎక్కడ ఉన్నాయి?",
          "⚽ ఫ్రెషర్స్ ఫుట్సల్ లీగ్‌లో ఎలా చేరాలి?"
        ]
      }
    ]
  },
  ml: {
    initialTitle: "ക്യാമ്പസ് ഓറിയന്റേഷൻ & വിവരങ്ങൾ",
    initialGreeting: (name) => `ഹലോ ${name}! 👋 ഞാൻ നിങ്ങളുടെ GDG ജെമിനി AI അസിസ്റ്റന്റാണ്. ക്യാമ്പസ് മാപ്പുകൾ, ഡിപ്പാർട്ട്മെന്റ് ടൈംടേബിളുകൾ, സിലബസ് ഡൗൺലോഡുകൾ, ഫ്രഷേഴ്സ് ഫിയസ്റ്റ പാർട്ടി പാസുകൾ അല്ലെങ്കിൽ സ്റ്റുഡന്റ് ക്ലബ്ബുകൾ എന്നിവയെക്കുറിച്ച് എന്നോട് എന്ത് വേണമെങ്കിലും ചോദിക്കാം!`,
    newChatTitle: "പുതിയ ചാറ്റ്",
    newChatInitial: "ഹലോ! 👋 ഇന്ന് ഞാൻ നിങ്ങൾക്ക് എങ്ങനെ സഹായിക്കണം? ക്യാമ്പസ് നാവിഗേഷൻ, ഡിപ്പാർട്ട്മെന്റ് സിലബസ്, പാർട്ടി പാസുകൾ അല്ലെങ്കിൽ സ്റ്റുഡന്റ് ക്ലബ്ബുകൾ എന്നിവയെക്കുറിച്ച് എന്നോട് ചോദിക്കൂ!",
    sidebarTitle: "Gemini AI ചരിത്രം",
    newChatBtn: "പുതിയ ചാറ്റ്",
    searchPlaceholder: "ചരിത്രം തിരയുക...",
    recentConvs: "സമീപകാല സംഭാഷണങ്ങൾ",
    noHistory: "ചരിത്രം കണ്ടെത്താനായില്ല.",
    deleteSession: "ചാറ്റ് സെഷൻ ഇല്ലാതാക്കുക",
    voiceOn: "വോയിസ് ഓൺ",
    voiceOff: "വോയിസ് ഓഫ്",
    thinking: "Gemini AI ചിന്തിക്കുന്നു...",
    inputPlaceholder: "ക്യാമ്പസ് വിവരങ്ങൾ, ടൈംടേബിൾ, സിലബസ് എന്നിവയെക്കുറിച്ച് ചോദിക്കൂ...",
    sendBtn: "അയക്കുക",
    greeting: (name) => `ഹേയ് ${name}! 👋 കോളേജ് ജീവിതത്തിലേക്ക് സ്വാഗതം! 🎓 ക്യാമ്പസ് ലഘുഭക്ഷണങ്ങൾ, CSE ടൈംടേബിളുകൾ, ഫ്രഷേഴ്സ് ഫിയസ്റ്റ ഡ്രസ് കോഡുകൾ അല്ലെങ്കിൽ സ്റ്റുഡന്റ് ക്ലബ്ബുകളിൽ ചേരുന്നതിനെക്കുറിച്ച് എന്നോട് ചോദിക്കൂ!`,
    fallback: (name) => `ഹേയ് ${name}! ഞാൻ നിങ്ങളുടെ GDG ജെമിനി ക്യാമ്പസ് കൂട്ടുകാരനാണ്! നിങ്ങൾക്ക് എന്നോട് ചോദിക്കാൻ കഴിയുന്ന പ്രധാന കാര്യങ്ങൾ ഇതാ:\n• **🍕 കാന്റീൻ ഭക്ഷണവും ചില്ല് സ്പോട്ടുകളും**\n• **🎓 75% ഹാജർ നിയമങ്ങളും CGPA നുറുങ്ങുകളും**\n• **🗺️ ട്യൂറിംഗ് ബ്ലോക്കും ക്യാമ്പസ് ലൊക്കേഷനുകളും**\n• **🎉 ഫ്രഷേഴ്സ് ഫിയസ്റ്റ പാസുകളും ടി-ഷർട്ട് സൈസുകളും**\n• **📚 CSE/IT ടൈംടേബിൾ PDF ഡൗൺലോഡ് ചെയ്യൽ**\n\nനിങ്ങൾക്ക് എന്താണ് പര്യവേക്ഷണം ചെയ്യേണ്ടത്?`,
    attendance: "🎓 **ഹാജർ പോളിസി ടിപ്പ്!**\n\nസമസ്റ്റർ പരീക്ഷകൾ എഴുതാൻ ഓരോ വിഷയത്തിലും കുറഞ്ഞത് **75% ഹാജർ** ആവശ്യമാണ്! നിങ്ങളുടെ പ്രതിദിന ഹാജർ ശതമാനം നിങ്ങളുടെ **ഡാഷ്ബോർഡ്** പ്രൊഫൈലിൽ നേരിട്ട് ട്രാക്ക് ചെയ്യാം!",
    canteen: "🍕 **ഏറ്റവും മികച്ച ക്യാമ്പസ് ഭക്ഷണവും ചില്ല് സ്പോട്ടുകളും!**\n\n• **പ്രധാന കാന്റീൻ:** സെൻട്രൽ ക്വാഡിന് സമീപം ഗ്രൗണ്ട് ഫ്ലോർ (ചൂടുള്ള സമോസകൾ, കോൾഡ് കോഫി, ചീസ് മാഗി എന്നിവയ്ക്ക് പ്രശസ്തമാണ്! ☕)\n• **ട്യൂറിംഗ് സൈബർ കഫേ:** ട്യൂറിംഗ് ബ്ലോക്ക് ബേസ്മെന്റ് (നല്ല എസ്പ്രെസ്സോ, ക്വിക്ക് സാൻഡ്വിച്ചുകൾ, ചാർജിംഗ് പോയിന്റുകൾ).",
    cgpa: "✍️ **ഒന്നാം വർഷ സെമസ്റ്റർ പരീക്ഷകളിൽ വിജയിക്കാനും 9.0+ CGPA നേടാനും:**\n\n1. **റിസോഴ്സസ്** പേജിൽ നിന്ന് റെഗുലേഷൻ 2024 സിലബസും ലെക്ചർ നോട്ടുകളും ഡൗൺലോഡ് ചെയ്യുക.\n2. ഇന്റേണൽ പരീക്ഷാ ചോദ്യപേപ്പറുകൾ മുൻകൂട്ടി പരിശോധിക്കുക.\n3. ലാബ് അസൈൻമെന്റുകൾ കൃത്യമായി പൂർത്തിയാക്കുക—ഒന്നാം വർഷത്തെ CGPA നിങ്ങളുടെ പ്ലേസ്മെന്റ് സ്കോർ വർദ്ധിപ്പിക്കും!",
    library: "📚 **സെൻട്രൽ ലൈബ്രറിയും ശാന്തമായ പഠന മേഖലകളും:**\n\nഅഡ്മിൻ ബ്ലോക്കിന് തൊട്ടുമുന്നിലാണ് സ്ഥിതി ചെയ്യുന്നത്. രാവിലെ **8:00 മുതൽ രാത്രി 8:00 വരെ** തുറന്നിരിക്കും. അതിവേഗ വൈഫൈ, എയർ കണ്ടീഷൻഡ് റീഡിംഗ് പോഡുകൾ, സൌജന്യ ഡിജിറ്റൽ പുസ്തക ശേഖരം എന്നിവ ലഭ്യമാണ്!",
    transport: "🚌 **ഹോസ്റ്റൽ & ക്യാമ്പസ് ബസ് സമയങ്ങൾ:**\n\n• **കോളേജ് ബസുകൾ:** ദിവസവും വൈകുന്നേരം 4:30 ന് സൗത്ത് ഗേറ്റിൽ നിന്ന് പുറപ്പെടുന്നു.\n• **ഹോസ്റ്റൽ നിയമം:** ഒന്നാം വർഷ ഹോസ്റ്റലുകളിൽ രാത്രി 9:30 ന് മുൻപായി പ്രവേശിക്കണം!",
    dj: "🎧 **ഡിജെ പാർട്ടി സെറ്റുകളും പാട്ട് അഭ്യർത്ഥനയും:**\n\nഡിജെ സ്പാർക്ക് ഫ്രഷേഴ്സ് പാർട്ടിയിൽ മികച്ച EDM & റോക്ക് ഹിറ്റുകൾ അവതരിപ്പിക്കും! നിങ്ങൾക്ക് ഇഷ്ടമുള്ള പാട്ടുകൾ (*Alan Walker - Faded, Guns N' Roses, Dua Lipa, Travis Scott - FE!N*) ആവശ്യപ്പെടാൻ **പാർട്ടി** പേജിലെ **ഇന്റരാക്റ്റീവ് ബീറ്റ്മേക്കർ** തുറക്കുക!",
    turing_cse: "🏛️ **ട്യൂറിംഗ് ബ്ലോക്ക് (CSE ഡിപ്പാർട്ട്മെന്റ്)**\n\n**നോർത്ത് ക്യാമ്പസ്, ക്വാഡ് 1** ൽ സ്ഥിതി ചെയ്യുന്നു. ഇതിൽ CSE ലെക്ചർ ഹാളുകൾ 101–304, അഡ്വാൻസ്ഡ് AI ലാബുകൾ, GDG സ്റ്റുഡന്റ് ഹബ് എന്നിവ അടങ്ങിയിരിക്കുന്നു. പൂർണ്ണമായ ഫ്ലോർ പ്ലാനുകൾ **ക്യാമ്പസ് മാപ്പ്** പേജിൽ കാണാം!",
    babbage_it: "🏛️ **ബാബേജ് ബ്ലോക്ക് (IT ഡിപ്പാർട്ട്മെന്റ്)**\n\n**നോർത്ത് ക്യാമ്പസ്, ക്വാഡ് 2** ൽ സ്ഥിതി ചെയ്യുന്നു. ഇതിൽ IT ലെക്ചർ റൂമുകൾ, ക്ലൗഡ് കമ്പ്യൂട്ടിംഗ് ലാബുകൾ, ട്യൂറിംഗ് ഗിൽഡ് ഹാക്കർ സ്പേസ് എന്നിവ അടങ്ങിയിരിക്കുന്നു.",
    tesla_ece_mech: "🏛️ **ടെസ്ല ബ്ലോക്ക് (ECE & MECH ഡിപ്പാർട്ട്മെന്റുകൾ)**\n\n**സൗത്ത് ക്യാമ്പസ്, ബ്ലോക്ക് സി** ൽ സ്ഥിതി ചെയ്യുന്നു. റോബോട്ടിക്സ് ലാബുകൾ, മെക്കാനിക്കൽ CAD/CAM വർക്ക്ഷോപ്പുകൾ, ഡ്രോൺ ഫ്ലൈറ്റ് ടെസ്റ്റ് ഏരിയ എന്നിവ ഇവിടെയുണ്ട്.",
    blocks_all: "🗺️ ക്യാമ്പസിൽ 4 പ്രധാന ബ്ലോക്കുകളുണ്ട്:\n• **ട്യൂറിംഗ് ബ്ലോക്ക്:** CSE ഡിപ്പാർട്ട്മെന്റും AI ലാബുകളും\n• **ബാബേജ് ബ്ലോക്ക്:** IT ഡിപ്പാർട്ട്മെന്റും ക്ലൗഡ് ലാബുകളും\n• **ടെസ്ല ബ്ലോക്ക്:** ECE & MECH വർക്ക്ഷോപ്പുകൾ\n• **അഡ്മിൻ കെട്ടിടം:** പ്രധാന ഓഡിറ്റോറിയവും അഡ്മിനിസ്ട്രേറ്റീവ് ഓഫീസുകളും\n\nഇന്റരാക്റ്റീവ് മാപ്പ് **ക്യാമ്പസ് മാപ്പ്** പേജിൽ കാണുക!",
    party: "🎉 **ഫ്രഷേഴ്സ് വെൽക്കം ഫിയസ്റ്റ 2026**\n\n• **തീയതിയും സമയവും:** ഓഗസ്റ്റ് 15, 2026 വൈകുന്നേരം 6:00 മണിക്ക്\n• **വേദി:** പ്രധാന ഓഡിറ്റോറിയം\n• **ഡ്രസ് കോഡ്:** നിയോൺ ഗ്ലാം & റെട്രോ സൈബർപങ്ക്\n• **ഭക്ഷണവും ടി-ഷർട്ടും:** വെജ്/നോൺ-വെജ് ഭക്ഷണ ബോക്സും ടി-ഷർട്ടും (XS–XXXL) ഉൾപ്പെടുന്നു.\n\nനിങ്ങളുടെ പാസ് **പാർട്ടി** പേജിൽ ബുക്ക് ചെയ്യാം!",
    timetable: "📚 **അക്കാദമിക് റിസോഴ്സുകളും ഡൗൺലോഡുകളും**\n\n**CSE, IT, ECE, MECH** എന്നിവയ്ക്കുള്ള സമയവിവരപ്പട്ടികയും സിലബസും **റിസോഴ്സസ്** പേജിൽ A4 PDF ഫയലുകളായി ഡൗൺലോഡ് ചെയ്യാൻ ലഭ്യമാണ്!",
    clubs: "🚀 **ക്യാമ്പസ് സ്റ്റുഡന്റ് ക്ലബ്ബുകൾ**\n\n1. **GDG On Campus:** ഗൂഗിൾ ഡെവലപ്പർ സ്റ്റുഡന്റ് ക്ലബ്ബ്\n2. **റോബോട്ടിക്സ് ക്ലബ്ബ്:** ഡ്രോണുകളും റോബോറ്റ് യുദ്ധങ്ങളും\n3. **കോഡിംഗ് നിഞ്ചാസ്:** DSA & കോംപറ്റിറ്റീവ് പ്രോഗ്രാമിംഗ്\n4. **ട്യൂറിംഗ് ഗിൽഡ്:** ഓപ്പൺ സോഴ്സ് & ലിനക്സ് കേർണലുകൾ\n5. **സ്പോർട്സ് ക്ലബ്ബ്:** ഫുട്ബോൾ, ക്രിക്കറ്റ് ലീഗുകൾ\n\nനിങ്ങൾക്ക് താൽപ്പര്യമുള്ള ക്ലബ്ബുകളിൽ ചേരാൻ **ക്ലബ്ബുകൾ** പേജ് സന്ദർശിക്കുക!",
    faculty: "👨‍🏫 **ഫാക്കൽറ്റി ഡയറക്ടറിയും HODമാരും**\n\nഡിപ്പാർട്ട്മെന്റിലെ എല്ലാ പ്രൊഫസറുകളുടെയും ഓഫീസ് സമയം, ഇമെയിൽ വിലാസങ്ങൾ, ഗവേഷണ വിവരങ്ങൾ എന്നിവ **ഫാക്കൽറ്റി** പേജിൽ കണ്ടെത്താം!",
    categories: [
      {
        category: "🍕 ക്യാമ്പസ് ജീവിതം & ചില്ല്",
        items: [
          "🍕 ഏറ്റവും നല്ല കാന്റീൻ സ്നാക്ക് സ്പോട്ട് എവിടെയാണ്?",
          "🎓 75% ഹാജർ നിയമം എന്താണ്?",
          "📚 സെൻട്രൽ ലൈബ്രറി & വൈഫൈ എവിടെയാണ്?",
          "🚌 ഹോസ്റ്റൽ & ബസ് സമയങ്ങൾ എന്തൊക്കെയാണ്?"
        ]
      },
      {
        category: "🎉 ഫിയസ്റ്റ & പാർട്ടി",
        items: [
          "🎉 ഫ്രഷേഴ്സ് പാർട്ടി ഷെഡ്യൂളും ഡ്രസ് കോഡും എന്താണ്?",
          "🥗 പാർട്ടി പാസിനൊപ്പം ഭക്ഷണ ബോക്സും ടി-ഷർട്ടും ഉണ്ടോ?",
          "🎧 ഡിജെ സെറ്റിൽ ആരാണ് അവതരിപ്പിക്കുന്നത് & പാട്ടുകൾ എങ്ങനെ ആവശ്യപ്പെടാം?"
        ]
      },
      {
        category: "📚 അക്കാദമിക്സും കുറിപ്പുകളും",
        items: [
          "📚 CSE ടൈംടേബിളും സിലബസ് PDF ഉം ഡൗൺലോഡ് ചെയ്യുക",
          "✍️ ഒന്നാം വർഷ പരീക്ഷയിൽ എങ്ങനെ 9.0+ CGPA നേടാം?"
        ]
      },
      {
        category: "🚀 ക്ലബ്ബുകളും ഗെയിമിംഗും",
        items: [
          "🚀 തുടക്കക്കാർക്ക് ഏറ്റവും അനുയോജ്യമായ ക്ലബ്ബ് ഏതാണ്?",
          "🛸 റോബോട്ടിക്സ് & ഡ്രോൺ ട്രയൽസ് എവിടെയാണ് നടക്കുന്നത്?",
          "⚽ ഫ്രഷേഴ്സ് ഫുട്സൽ ലീഗിൽ എങ്ങനെ പങ്കെടുക്കാം?"
        ]
      }
    ]
  },
  hi: {
    initialTitle: "कैंपस ओरिएंटेशन और जानकारी",
    initialGreeting: (name) => `हेलो ${name}! 👋 मैं आपका GDG जेमिनी AI सहायक हूँ। कैंपस मानचित्र, विभाग समय सारणी, पाठ्यक्रम डाउनलोड, फ्रेशर्स फिएस्टा पार्टी पास या छात्र क्लबों के बारे में मुझसे कुछ भी पूछें!`,
    newChatTitle: "नया चैट",
    newChatInitial: "हेलो! 👋 आज मैं आपकी क्या मदद कर सकता हूँ? कैंपस नेविगेशन, विभाग पाठ्यक्रम, पार्टी पास या छात्र क्लबों के बारे में मुझसे पूछें!",
    sidebarTitle: "जेमिनी AI इतिहास",
    newChatBtn: "नया चैट",
    searchPlaceholder: "चैट इतिहास खोजें...",
    recentConvs: "समीप बातचीत",
    noHistory: "इतिहास का कोई परिणाम नहीं मिला।",
    deleteSession: "चैट सत्र हटाएं",
    voiceOn: "आवाज चालू",
    voiceOff: "आवाज बंद",
    thinking: "Gemini AI सोच रहा है...",
    inputPlaceholder: "कैंपस इवेंट, समय सारणी, पाठ्यक्रम के बारे में कुछ भी पूछें...",
    sendBtn: "भेजें",
    greeting: (name) => `हे ${name}! 👋 कॉलेज जीवन में आपका स्वागत है! 🎓 कैंपस स्नैक्स, CSE समय सारणी, फ्रेशर्स फिएस्टा ड्रेस कोड या छात्र क्लबों में शामिल होने के बारे में मुझसे कुछ भी पूछें!`,
    fallback: (name) => `हे ${name}! मैं आपका GDG जेमिनी कैंपस बडी हूँ! यहाँ मुख्य विषय दिए गए हैं जिनके बारे में आप मुझसे पूछ सकते हैं:\n• **🍕 कैंटीन स्नैक्स और चिल स्पॉट**\n• **🎓 75% उपस्थिति नियम और CGPA टिप्स**\n• **🗺️ ट्यूरिंग ब्लॉक और कैंपस स्थान**\n• **🎉 फ्रेशर्स फिएस्टा पास और टी-शर्ट के आकार**\n• **📚 CSE/IT समय सारणी PDF डाउनलोड करना**\n\nआप क्या खोजना चाहते हैं?`,
    attendance: "🎓 **उपस्थिति नीति टिप!**\n\nसेमेस्टर परीक्षा देने के लिए प्रत्येक विषय में न्यूनतम **75% उपस्थिति** आवश्यक है! सीधे अपने **डैशबोर्ड** प्रोफ़ाइल में अपनी दैनिक उपस्थिति प्रतिशत पर नज़र रखें!",
    canteen: "🍕 **कैंपस के बेहतरीन भोजन और चिल स्पॉट!**\n\n• **मुख्य छात्र कैंटीन:** सेंट्रल क्वाड के पास भूतल (गर्म समोसे, कोल्ड कॉफी और पनीर मैगी के लिए प्रसिद्ध! ☕)\n• **ट्यूरिंग साइबर कैफे:** ट्यूरिंग ब्लॉक बेसमेंट (बढ़िया एस्प्रेसो, झटपट सैंडविच और चार्जिंग सॉकेट)।",
    cgpa: "✍️ **प्रथम वर्ष की सेमेस्टर परीक्षाओं में सफलता और 9.0+ CGPA प्राप्त करना:**\n\n1. **संसाधन** पेज से विनियम 2024 पाठ्यक्रम और व्याख्यान नोट्स डाउनलोड करें।\n2. आंतरिक परीक्षाओं के प्रश्न पत्रों की पहले से समीक्षा करें।\n3. लैब असाइनमेंट नियमित रूप से पूरा करें—प्रथम वर्ष का CGPA आपके प्लेसमेंट स्कोर को बढ़ाता है!",
    library: "📚 **केंद्रीय पुस्तकालय और शांत अध्ययन क्षेत्र:**\n\nएडमिन ब्लॉक के ठीक सामने स्थित है। सुबह **8:00 बजे से रात 8:00 बजे तक** खुला रहता है। वातानुकूलित शांत अध्ययन केबिन और मुफ्त डिजिटल संदर्भ पुस्तकें उपलब्ध हैं!",
    transport: "🚌 **छात्रावास और कैंपस बस का समय:**\n\n• **कॉलेज बसें:** रोजाना शाम 4:30 बजे साउथ गेट से रवाना होती हैं।\n• **छात्रावास नियम:** प्रथम वर्ष के छात्रों के छात्रावासों में रात 9:30 बजे से पहले प्रवेश करना होगा!",
    dj: "🎧 **डीजे पार्टी सेट और गीतों का अनुरोध:**\n\nडीजे स्पार्क फ्रेशर्स पार्टी में शानदार ईडीएम और रॉक हिट प्रस्तुत करेंगे! अपने पसंदीदा गीतों (*Alan Walker - Faded, Guns N' Roses, Dua Lipa, Travis Scott - FE!N*) का अनुरोध करने के लिए **पार्टी** पेज पर **इंटरैक्टिव बीटमेकर** खोलें!",
    turing_cse: "🏛️ **ट्यूरिंग ब्लॉक (CSE विभाग)**\n\n**उत्तरी परिसर, क्वाड 1** में स्थित है। इसमें CSE व्याख्यान कक्ष 101–304, उन्नत AI प्रयोगशालाएँ और GDG छात्र हब शामिल हैं। विस्तृत मंजिल योजनाएं **कैंपस मानचित्र** पेज पर देखी जा सकती हैं!",
    babbage_it: "🏛️ **बाबेज ब्लॉक (IT विभाग)**\n\n**उत्तरी परिसर, क्वाड 2** में स्थित है। इसमें IT व्याख्यान कक्ष, क्लाउड कंप्यूटिंग प्रयोगशालाएँ और ट्यूरिंग गिल्ड हैकरस्पेस हैं।",
    tesla_ece_mech: "🏛️ **टेस्ला ब्लॉक (ECE और MECH विभाग)**\n\n**दक्षिणी परिसर, ब्लॉक सी** में स्थित है। इसमें रोबोटिक्स प्रयोगशालाएँ, मैकेनिकल CAD/CAM कार्यशालाएँ और ड्रोन उड़ान परीक्षण क्षेत्र शामिल हैं।",
    blocks_all: "🗺️ कैंपस में 4 मुख्य ब्लॉक हैं:\n• **ट्यूरिंग ब्लॉक:** CSE विभाग और AI प्रयोगशालाएँ\n• **बाबेज ब्लॉक:** IT विभाग और क्लाउड प्रयोगशालाएँ\n• **टेस्ला ब्लॉक:** ECE और MECH कार्यशालाएँ\n• **एडमिन भवन:** मुख्य सभागार और प्रशासनिक कार्यालय\n\n    मंजिल-वार गाइड को **कैंपस मानचित्र** पेज पर देखें!",
    party: "🎉 **फ्रेशर्स स्वागत फिएस्टा 2026**\n\n• **दिनांक और समय:** 15 अगस्त, 2026 शाम 6:00 बजे\n• **स्थान:** मुख्य सभागार\n• **ड्रेस कोड:** नियॉन ग्लैम और रेट्रो साइबरपंक\n• **भोजन और टी-शर्ट:** शाकाहारी/मांसाहारी भोजन बॉक्स और टी-शर्ट (XS–XXXL) शामिल हैं।\n\nआप **पार्टी** पेज पर अपना पास बुक कर सकते हैं!",
    timetable: "📚 **अकादमिक संसाधन और डाउनलोड**\n\n**CSE, IT, ECE और MECH** के लिए समय सारणी और पाठ्यक्रम **संसाधन** पेज पर A4 PDF फाइलों के रूप में डाउनलोड करने के लिए उपलब्ध हैं!",
    clubs: "🚀 **कैंपस छात्र क्लब**\n\n1. **GDG On Campus:** गूगल डेवलपर छात्र क्लब\n2. **रोबोटिक्स क्लब:** ड्रोन और रोबोट युद्ध\n3. **कोडिंग निन्जा:** DSA और प्रतिस्पर्धी प्रोग्रामिंग\n4. **ट्यूरिंग गिल्ड:** ओपन सोर्स और लिनक्स कर्नेल\n5. **स्पोर्ट्स क्लब:** फुटबॉल, क्रिकेट लीग\n\nअपने पसंदीदा क्लबों में शामिल होने के लिए **क्लब** पेज पर जाएं!",
    faculty: "👨‍🏫 **संकाय निर्देशिका और विभागाध्यक्ष**\n\nसभी विभाग के प्रोफेसरों के कार्यालय समय, ईमेल संपर्क और अनुसंधान विवरण **संकाय** पेज पर खोजें!",
    categories: [
      {
        category: "🍕 कैंपस लाइफ और चिल",
        items: [
          "🍕 सबसे अच्छा कैंटीन स्नैक स्पॉट कहाँ है?",
          "🎓 75% उपस्थिति का नियम क्या है?",
          "📚 केंद्रीय पुस्तकालय और वाई-फाई कहाँ है?",
          "🚌 छात्रावास और बस का समय क्या है?"
        ]
      },
      {
        category: "🎉 फिएस्टा और पार्टी",
        items: [
          "🎉 फ्रेशर्स पार्टी का शेड्यूल और ड्रेस कोड क्या है?",
          "🥗 क्या पार्टी पास के साथ फूड बॉक्स और टी-शर्ट शामिल हैं?",
          "🎧 डीजे सेट में कौन प्रस्तुति दे रहा है और गाने का अनुरोध कैसे करें?"
        ]
      },
      {
        category: "📚 शिक्षा और नोट्स",
        items: [
          "📚 CSE समय सारणी और पाठ्यक्रम PDF डाउनलोड करें",
          "✍️ प्रथम वर्ष की परीक्षाओं में 9.0+ CGPA कैसे प्राप्त करें?"
        ]
      },
      {
        category: "🚀 क्लब और गेमिंग",
        items: [
          "🚀 शुरुआती कोडर्स के लिए कौन सा क्लब सबसे अच्छा है?",
          "🛸 रोबोटिक्स और ड्रोन ट्रायल उड़ानें कहाँ हैं?",
          "⚽ फ्रेशर्स फुटसल लीग में कैसे शामिल हों?"
        ]
      }
    ]
  }
};

const ChatbotPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();

  // Sessions state stored in localStorage per user
  const storageKey = `gemini_chat_sessions_${user?.id || user?.email || 'guest'}`;

  const [sessions, setSessions] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  });

  const [activeSessionId, setActiveSessionId] = useState('');

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const messagesEndRef = useRef(null);

  // Initialize or fallback activeSession
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0] || { id: '', title: '', messages: [] };
  const messages = activeSession?.messages || [];

  // Initialize sessions dynamically based on active language if none exist
  useEffect(() => {
    if (sessions.length === 0) {
      const initialId = Date.now().toString();
      const currentTrans = chatbotTranslations[language] || chatbotTranslations['en'];
      const greetingText = currentTrans.initialGreeting(user?.name ? user.name.split(' ')[0] : (language === 'te' ? 'ఫ్రెషర్' : language === 'ta' ? 'புதியவர்' : language === 'ml' ? 'ഫ്രഷർ' : language === 'hi' ? 'नवागंतुक' : 'Fresher'));
      const initialSession = {
        id: initialId,
        title: currentTrans.initialTitle,
        updatedAt: new Date().toISOString(),
        messages: [
          {
            text: greetingText,
            sender: 'bot',
            time: new Date().toISOString()
          }
        ]
      };
      setSessions([initialSession]);
      setActiveSessionId(initialId);
    } else if (!activeSessionId && sessions[0]) {
      setActiveSessionId(sessions[0].id);
    }
  }, [language, sessions.length, user, activeSessionId]);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(sessions));
      } catch (e) {}
    }
  }, [sessions, storageKey]);

  // Auto-scroll to message bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Create New Chat session
  const handleNewChat = () => {
    const newId = Date.now().toString();
    const currentTrans = chatbotTranslations[language] || chatbotTranslations['en'];
    const newSession = {
      id: newId,
      title: currentTrans.newChatTitle,
      updatedAt: new Date().toISOString(),
      messages: [
        {
          text: currentTrans.newChatInitial,
          sender: 'bot',
          time: new Date().toISOString()
        }
      ]
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
  };

  // Delete session
  const handleDeleteSession = (idToDelete, e) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      setSessions([]);
      setActiveSessionId('');
      return;
    }
    const updated = sessions.filter(s => s.id !== idToDelete);
    setSessions(updated);
    if (activeSessionId === idToDelete) {
      setActiveSessionId(updated[0].id);
    }
  };

  // Voice Speech Recognition
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'te' ? 'te-IN' : language === 'ta' ? 'ta-IN' : language === 'ml' ? 'ml-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  // Speech synthesis for AI responses
  const speakText = (text) => {
    if (!isSpeechEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'te' ? 'te-IN' : language === 'ta' ? 'ta-IN' : language === 'ml' ? 'ml-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Send message
  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMessage = { text, sender: 'user', time: new Date().toISOString() };

    // Update session title if default
    let updatedTitle = activeSession.title;
    const currentTrans = chatbotTranslations[language] || chatbotTranslations['en'];
    if (activeSession.title === "New Chat" || activeSession.title === currentTrans.newChatTitle || activeSession.title === "Campus Orientation & Info" || activeSession.title === currentTrans.initialTitle) {
      updatedTitle = text.slice(0, 28) + (text.length > 28 ? '...' : '');
    }

    // Append user message to active session
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          title: updatedTitle,
          updatedAt: new Date().toISOString(),
          messages: [...s.messages, userMessage]
        };
      }
      return s;
    }));

    setInputText('');
    setIsLoading(true);

    try {
      let botReplyText = "";
      try {
        const res = await chatAPI.sendMessage(text, activeSession.messages);
        botReplyText = res.data.response;
      } catch (err) {
        // Multi-lingual targeted keyword response matcher
        const lower = text.toLowerCase();
        const tObj = chatbotTranslations[language] || chatbotTranslations['en'];
        const namePart = user?.name ? user.name.split(' ')[0] : 'buddy';

        const isAttendance = lower.includes('attendance') || lower.includes('75%') || lower.includes('bunk') || lower.includes('rule') || lower.includes('வருகை') || lower.includes('ഹാജർ') || lower.includes('उपस्थिति') || lower.includes('హాజరు');
        const isCanteen = lower.includes('canteen') || lower.includes('snack') || lower.includes('food') || lower.includes('coffee') || lower.includes('maggi') || lower.includes('cafeteria') || lower.includes('உணவகம்') || lower.includes('ഭക്ഷണശാല') || lower.includes('कैंटीन') || lower.includes('క్యాంటీన్');
        const isCgpa = lower.includes('cgpa') || lower.includes('exam') || lower.includes('grade') || lower.includes('score') || lower.includes('pass') || lower.includes('தேர்வு') || lower.includes('പരീക്ഷ') || lower.includes('परीक्षा') || lower.includes('పరీక్ష');
        const isLibrary = lower.includes('library') || lower.includes('wifi') || lower.includes('reading') || lower.includes('நூலகம்') || lower.includes('ലൈബ്രറി') || lower.includes('पुस्तकालय') || lower.includes('లైబ్రరీ');
        const isTransport = lower.includes('hostel') || lower.includes('bus') || lower.includes('transport') || lower.includes('curfew') || lower.includes('பேருந்து') || lower.includes('ബസ്') || lower.includes('बस') || lower.includes('బస్సు') || lower.includes('விடுதி');
        const isDj = lower.includes('dj') || lower.includes('song') || lower.includes('music') || lower.includes('beat') || lower.includes('பாடல்') || lower.includes('പാട്ട്') || lower.includes('गीत') || lower.includes('పాట') || lower.includes('wishlist');
        const isTuring = lower.includes('turing') || lower.includes('டூரிங்') || lower.includes('ട്യൂറിംഗ്') || lower.includes('ट्यूरिंग') || lower.includes('ట్యూరింగ్');
        const isBabbage = lower.includes('babbage') || lower.includes('பாபேஜ்') || lower.includes('ബാബേജ്') || lower.includes('बाबेज') || lower.includes('బాబేజ్');
        const isTesla = lower.includes('tesla') || lower.includes('டெஸ்லா') || lower.includes('ടെസ്ല') || lower.includes('टेस्ला') || lower.includes('టెస్లా');
        const isLocation = lower.includes('where is') || lower.includes('location') || lower.includes('building') || lower.includes('block') || lower.includes('ఎక్కడ') || lower.includes('எங்கே') || lower.includes('എവിടെ') || lower.includes('कहाँ');
        const isParty = lower.includes('party') || lower.includes('fiesta') || lower.includes('dress') || lower.includes('விழா') || lower.includes('ஆഘോഷം') || lower.includes('उत्सव') || lower.includes('పండుగ') || lower.includes('ఫియస్టా') || lower.includes('ఫ్రెషర్స్');
        const isTimetable = lower.includes('timetable') || lower.includes('syllabus') || lower.includes('notes') || lower.includes('download') || lower.includes('resource') || lower.includes('సిలబస్') || lower.includes('സിലബസ്') || lower.includes('पाठ्यक्रम') || lower.includes('பாடத்திட்டங்கள்');
        const isClubs = lower.includes('club') || lower.includes('gdg') || lower.includes('ninjas') || lower.includes('robotics') || lower.includes('sports') || lower.includes('futsal') || lower.includes('மன்றம்') || lower.includes('ക്ലബ്ബ്') || lower.includes('क्लब') || lower.includes('క్లబ్');
        const isFaculty = lower.includes('faculty') || lower.includes('professor') || lower.includes('hod') || lower.includes('teacher') || lower.includes('ஆசிரியர்') || lower.includes('അധ്യാപകർ') || lower.includes('शिक्षक') || lower.includes('ఫ్యాకల్టీ');
        const isHi = lower.includes('hi') || lower.includes('hello') || lower.includes('hey') || lower.includes('வணக்கம்') || lower.includes('ஹലോ') || lower.includes('नमस्ते') || lower.includes('హలో');

        if (isAttendance) {
          botReplyText = tObj.attendance;
        } else if (isCanteen) {
          botReplyText = tObj.canteen;
        } else if (isCgpa) {
          botReplyText = tObj.cgpa;
        } else if (isLibrary) {
          botReplyText = tObj.library;
        } else if (isTransport) {
          botReplyText = tObj.transport;
        } else if (isDj) {
          botReplyText = tObj.dj;
        } else if (isTuring) {
          botReplyText = tObj.turing_cse;
        } else if (isBabbage) {
          botReplyText = tObj.babbage_it;
        } else if (isTesla) {
          botReplyText = tObj.tesla_ece_mech;
        } else if (isLocation) {
          botReplyText = tObj.blocks_all;
        } else if (isParty) {
          botReplyText = tObj.party;
        } else if (isTimetable) {
          botReplyText = tObj.timetable;
        } else if (isClubs) {
          botReplyText = tObj.clubs;
        } else if (isFaculty) {
          botReplyText = tObj.faculty;
        } else if (isHi) {
          botReplyText = tObj.greeting(namePart);
        } else {
          botReplyText = tObj.fallback(namePart);
        }
      }

      const botMessage = { text: botReplyText, sender: 'bot', time: new Date().toISOString() };

      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            updatedAt: new Date().toISOString(),
            messages: [...s.messages, botMessage]
          };
        }
        return s;
      }));

      speakText(botReplyText);

    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentTrans = chatbotTranslations[language] || chatbotTranslations['en'];
  const [selectedCategory, setSelectedCategory] = useState(currentTrans.categories[0].category);

  // Sync selectedCategory tab if language changes
  useEffect(() => {
    setSelectedCategory(currentTrans.categories[0].category);
  }, [language, currentTrans]);

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid px-3 py-2 d-flex gap-3" style={{ height: 'calc(100vh - 90px)', backgroundColor: '#F8F9FA' }}>
      
      {/* 1. Left Sidebar: Gemini Chat History */}
      <div 
        className="d-flex flex-column border bg-white rounded-4 shadow-sm overflow-hidden flex-shrink-0"
        style={{ width: '280px', height: '100%', zIndex: 10 }}
      >
        {/* Sidebar Header */}
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <GeminiStarIcon size={24} />
            <strong className="fw-bold text-dark" style={{ fontSize: '0.98rem', letterSpacing: '-0.3px' }}>
              {currentTrans.sidebarTitle}
            </strong>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-3 border-bottom">
          <button
            onClick={handleNewChat}
            className="btn btn-primary w-100 py-2.5 rounded-pill fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
            style={{ fontSize: '0.88rem' }}
          >
            <FaPlus size={12} /> {currentTrans.newChatBtn}
          </button>
        </div>

        {/* Search Session Filter */}
        <div className="px-3 pt-3 pb-2">
          <div className="position-relative">
            <FaSearch className="position-absolute text-muted" style={{ left: '12px', top: '10px', fontSize: '0.75rem' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={currentTrans.searchPlaceholder}
              className="form-control bg-light border-0 ps-4 pe-3 py-1.5 small rounded-pill text-dark"
              style={{ fontSize: '0.78rem' }}
            />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-grow-1 overflow-auto p-2">
          <span className="text-muted fw-bold d-block px-3 py-1 text-uppercase" style={{ fontSize: '0.65rem' }}>
            {currentTrans.recentConvs} ({sessions.length})
          </span>

          {filteredSessions.length === 0 ? (
            <div className="text-center py-4 text-muted small">{currentTrans.noHistory}</div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`p-2.5 mb-1 rounded-3 cursor-pointer d-flex align-items-center justify-content-between transition-all ${
                    isActive ? 'bg-primary bg-opacity-10 text-primary fw-bold' : 'text-dark hover-bg-light'
                  }`}
                  style={{ fontSize: '0.84rem' }}
                >
                  <div className="d-flex align-items-center gap-2 overflow-hidden me-2">
                    <FaCommentAlt className={isActive ? 'text-primary' : 'text-muted'} style={{ fontSize: '0.75rem', flexShrink: 0 }} />
                    <span className="text-truncate">{session.title}</span>
                  </div>
                  
                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className="btn btn-sm border-0 p-1 text-muted opacity-50 hover-opacity-100"
                    title={currentTrans.deleteSession}
                  >
                    <FaTrashAlt style={{ fontSize: '0.72rem' }} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-3 border-top bg-light d-flex align-items-center gap-2">
          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
            {user?.name ? user.name[0] : 'S'}
          </div>
          <div className="overflow-hidden">
            <div className="fw-semibold text-dark text-truncate" style={{ fontSize: '0.82rem' }}>{user?.name || 'Fresher Student'}</div>
            <div className="text-muted text-truncate" style={{ fontSize: '0.65rem' }}>{user?.email || 'student@university.edu'}</div>
          </div>
        </div>
      </div>

      {/* 2. Right Main Chat Workspace */}
      <div className="flex-grow-1 d-flex flex-column h-100 bg-white border rounded-4 shadow-sm overflow-hidden">
        
        {/* Workspace Top Bar */}
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-white">
          <div className="d-flex align-items-center gap-2">
            <GeminiStarIcon size={26} />
            <div>
              <strong className="text-dark d-block" style={{ fontSize: '0.98rem' }}>{activeSession.title}</strong>
              <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25" style={{ fontSize: '0.65rem' }}>
                Google Gemini 1.5 Flash AI Active
              </span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
              className={`btn btn-sm rounded-pill px-3 py-1 border ${isSpeechEnabled ? 'btn-primary' : 'btn-light text-muted'}`}
              style={{ fontSize: '0.78rem' }}
              title="Toggle Audio Voice Response"
            >
              {isSpeechEnabled ? <><FaVolumeUp /> {currentTrans.voiceOn}</> : <><FaVolumeMute /> {currentTrans.voiceOff}</>}
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-grow-1 p-4 overflow-auto bg-light" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`d-flex gap-3 max-w-75 ${isUser ? 'align-self-end flex-row-reverse' : 'align-self-start'}`}
                style={{ maxWidth: '82%' }}
              >
                {/* Avatar */}
                <div 
                  className={`rounded-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0 ${
                    isUser ? 'bg-primary text-white' : 'bg-white border'
                  }`} 
                  style={{ width: '38px', height: '38px' }}
                >
                  {isUser ? (
                    <strong style={{ fontSize: '0.85rem' }}>{user?.name ? user.name[0] : 'U'}</strong>
                  ) : (
                    <GeminiStarIcon size={20} />
                  )}
                </div>

                {/* Message Bubble */}
                <div 
                  className={`p-3 rounded-4 shadow-sm ${
                    isUser ? 'bg-primary text-white rounded-top-right-0' : 'bg-white border text-dark rounded-top-left-0'
                  }`}
                >
                  <p className="mb-0 small" style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </p>
                  <div 
                    className={`text-end mt-1 ${isUser ? 'text-white-50' : 'text-muted'}`} 
                    style={{ fontSize: '0.62rem' }}
                  >
                    {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="d-flex align-items-center gap-3 align-self-start">
              <div className="rounded-circle bg-white border d-flex align-items-center justify-content-center shadow-sm" style={{ width: '38px', height: '38px' }}>
                <GeminiStarIcon size={20} />
              </div>
              <div className="bg-white p-3 rounded-4 border shadow-sm d-flex align-items-center gap-2">
                <div className="spinner-grow spinner-grow-sm text-primary" role="status"></div>
                <span className="small text-muted">{currentTrans.thinking}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Categorized Suggested Prompts */}
        <div className="px-4 pt-3 bg-white border-top">
          {/* Category Tabs */}
          <div className="d-flex gap-2 overflow-auto pb-2 border-bottom mb-2">
            {currentTrans.categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat.category)}
                className={`btn btn-sm rounded-pill text-nowrap px-3 py-1 fw-semibold ${
                  selectedCategory === cat.category
                    ? 'btn-primary text-white shadow-sm'
                    : 'btn-light border text-secondary'
                }`}
                style={{ fontSize: '0.76rem' }}
              >
                {cat.category}
              </button>
            ))}
          </div>

          {/* Prompt Chips for active category */}
          <div className="d-flex gap-2 overflow-auto pb-2">
            {(currentTrans.categories.find(c => c.category === selectedCategory)?.items || []).map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(item)}
                className="btn btn-sm btn-white border rounded-pill text-dark text-nowrap px-3 py-1.5 small shadow-sm hover-border-primary hover-text-primary"
                style={{ fontSize: '0.78rem' }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-white border-top">
          <div className="input-group bg-light rounded-pill border p-1 shadow-sm">
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`btn rounded-circle p-2 border-0 ${isListening ? 'btn-danger text-white animate-pulse' : 'text-muted hover-text-primary'}`}
              title="Voice Input (Speech-to-Text)"
            >
              <FaMicrophone />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={currentTrans.inputPlaceholder}
              className="form-control bg-transparent border-0 shadow-none text-dark small px-3"
            />

            <button
              onClick={() => handleSend()}
              disabled={isLoading || !inputText.trim()}
              className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center gap-2 fw-semibold"
            >
              <FaPaperPlane size={12} /> {currentTrans.sendBtn}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatbotPage;
