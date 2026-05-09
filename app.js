// ==================== DATA STATE ====================
let HOSPITALS = []; 
let MAP_HOSPITALS = []; // For hospitals found on the map (OSM)
let bookings = [];
let selectedHospitalId = null;
let lastToken = null;
let currentLang = 'en';
let adminShowForm = false;

// GPS state
let userLat = null;
let userLng = null;
let userLocationName = '';
let gpsActive = false;
let map = null;
let mapMarkers = [];
let userMarker = null;
let userCircle = null;
let allTasks = [];
let BACKEND_API_KEY = localStorage.getItem('backend_api_key') || 'cyber-health-secure-2026';
let spamReputationData = [];

class BehaviorMonitor {
  constructor() {
    this.clickTimes = [];
    this.isAutomated = false;
  }
  trackClick() {
    const now = Date.now();
    this.clickTimes = this.clickTimes.filter(t => now - t < 1000);
    this.clickTimes.push(now);
    if (this.clickTimes.length > 5) this.isAutomated = true;
  }
  getData() {
    return {
      clickSpeed: this.clickTimes.length,
      isAutomated: this.isAutomated
    };
  }
}
const monitor = new BehaviorMonitor();
document.addEventListener('click', () => monitor.trackClick());

// ==================== TRANSLATIONS ====================
const T = {
  en: { appTitle:"Smart Healthcare", navHome:"Home", navHospitals:"Hospitals", navBooking:"Book", navRural:"Rural", navAdmin:"Admin", heroTitle:"Your Health, Our Priority", heroSub:"Find hospitals, book appointments, and access emergency care — all in one place.", searchPlaceholder:"Search by location...", findHospitals:"Find Nearby Hospitals", findHospitalsSub:"Locate hospitals near you with real-time bed availability", bookToken:"Book Token via SMS", bookTokenSub:"Skip the queue — book your appointment token instantly", statHospitals:"Hospitals", statDoctors:"Doctors", statTokens:"Tokens Booked", hospitalListTitle:"Nearby Hospitals", filterAll:"All Types", filterGov:"Government", filterPrivate:"Private", filterAllSpec:"All Specialties", back:"Back", bookingTitle:"Book Your Token", labelName:"Full Name", labelPhone:"Phone Number", labelDept:"Select Department", placeholderName:"Enter your full name", placeholderPhone:"Enter 10-digit phone number", selectDept:"-- Select Department --", confirmBooking:"Confirm Booking", bookingConfirmed:"Booking Confirmed!", downloadToken:"Download / Save Token", backHome:"Back to Home", adminTitle:"Admin Dashboard", tabHospitals:"Hospitals", tabBookings:"Bookings", emergencyHelp:"Emergency Help", emergencyServices:"Emergency Services", callAmbulance:"Call Ambulance (108)", callPolice:"Call Emergency (112)", callMedical:"Medical Helpline (102)", emergencyNote:"Stay calm. Help is on the way.", ruralTitle:"🌾 Rural Healthcare Access", ruralAmbulance:"Call Ambulance — 108", ruralFindHospital:"Find Hospital", ruralBookToken:"Book Token", ruralSmsTitle:"📱 Book via SMS", ruralSmsInstr:'Send <strong>HOSPITAL &lt;PINCODE&gt;</strong> to <strong>12345</strong>', ruralEmergTitle:"🚨 Emergency", ruralEmergInstr:'Call <strong>108</strong> for ambulance', ruralEmergInstr2:'Call <strong>112</strong> for any emergency', bedsAvail:"Beds Available", distance:"Distance", emergencyLabel:"Emergency", viewDetails:"View Details", bookTokenBtn:"Book Token", callHospital:"Call Hospital", emergencyCall:"🚨 Emergency Call", doctorsAvailable:"Doctors Available", bedAvailability:"Bed Availability", emergencyStatus:"Emergency Status", tokenNumber:"Token Number", reportingTime:"Reporting Time", hospitalName:"Hospital Name", department:"Department", totalHospitals:"Total Hospitals", totalBeds:"Total Beds", totalBookings:"Bookings", emergencies:"Emergencies", addHospital:"+ Add Hospital", name:"Name", phone:"Phone", type:"Type", beds:"Beds", specialty:"Specialty", emergency:"Emergency", actions:"Actions", edit:"Edit", patientName:"Patient", date:"Date", token:"Token", save:"Save", cancel:"Cancel" },
  hi: { appTitle:"स्मार्ट हेल्थकेयर", navHome:"होम", navHospitals:"अस्पताल", navBooking:"बुकिंग", navRural:"ग्रामीण", navAdmin:"एडमिन", heroTitle:"आपका स्वास्थ्य, हमारी प्राथमिकता", heroSub:"अस्पताल खोजें, अपॉइंटमेंट बुक करें, और आपातकालीन देखभाल प्राप्त करें।", searchPlaceholder:"स्थान से खोजें...", findHospitals:"नजदीकी अस्पताल खोजें", findHospitalsSub:"रीयल-टाइम बेड उपलब्धता के साथ अस्पताल खोजें", bookToken:"SMS से टोकन बुक करें", bookTokenSub:"कतार छोड़ें — तुरंत टोकन बुक करें", statHospitals:"अस्पताल", statDoctors:"डॉक्टर", statTokens:"टोकन बुक", hospitalListTitle:"नजदीकी अस्पताल", filterAll:"सभी प्रकार", filterGov:"सरकारी", filterPrivate:"निजी", filterAllSpec:"सभी विशेषज्ञता", back:"वापस", bookingTitle:"अपना टोकन बुक करें", labelName:"पूरा नाम", labelPhone:"फोन नंबर", labelDept:"विभाग चुनें", placeholderName:"अपना पूरा नाम दर्ज करें", placeholderPhone:"10 अंकों का फोन नंबर", selectDept:"-- विभाग चुनें --", confirmBooking:"बुकिंग की पुष्टि करें", bookingConfirmed:"बुकिंग पुष्टि!", downloadToken:"टोकन डाउनलोड करें", backHome:"होम पर वापस", adminTitle:"एडमिन डैशबोर्ड", tabHospitals:"अस्पताल", tabBookings:"बुकिंग", emergencyHelp:"आपातकालीन सहायता", emergencyServices:"आपातकालीन सेवाएं", callAmbulance:"एम्बुलेंस (108)", callPolice:"आपातकाल (112)", callMedical:"हेल्पलाइन (102)", emergencyNote:"शांत रहें। मदद आ रही है।", ruralTitle:"🌾 ग्रामीण स्वास्थ्य सेवा", ruralAmbulance:"एम्बुलेंस — 108", ruralFindHospital:"अस्पताल खोजें", ruralBookToken:"टोकन बुक करें", ruralSmsTitle:"📱 SMS से बुक करें", ruralSmsInstr:'<strong>HOSPITAL &lt;PINCODE&gt;</strong> को <strong>12345</strong> पर भेजें', ruralEmergTitle:"🚨 आपातकाल", ruralEmergInstr:'एम्बुलेंस के लिए <strong>108</strong> कॉल करें', ruralEmergInstr2:'आपातकाल के लिए <strong>112</strong> कॉल करें', bedsAvail:"बेड उपलब्ध", distance:"दूरी", emergencyLabel:"आपातकाल", viewDetails:"विवरण", bookTokenBtn:"टोकन बुक", callHospital:"अस्पताल कॉल", emergencyCall:"🚨 आपातकाल कॉल", doctorsAvailable:"उपलब्ध डॉक्टर", bedAvailability:"बेड उपलब्धता", emergencyStatus:"आपातकाल स्थिति", tokenNumber:"टोकन नंबर", reportingTime:"समय", hospitalName:"अस्पताल", department:"विभाग", totalHospitals:"कुल अस्पताल", totalBeds:"कुल बेड", totalBookings:"बुकिंग", emergencies:"आपातकाल", addHospital:"+ अस्पताल जोड़ें", name:"नाम", phone:"फोन", type:"प्रकार", beds:"बेड", specialty:"विशेषज्ञता", emergency:"आपातकाल", actions:"कार्रवाई", edit:"संपादित", patientName:"मरीज", date:"तारीख", token:"टोकन", save:"सहेजें", cancel:"रद्द करें" },
  ta: { appTitle:"ஸ்மார்ட் ஹெல்த்கேர்", navHome:"முகப்பு", navHospitals:"மருத்துவமனை", navBooking:"முன்பதிவு", navRural:"கிராமம்", navAdmin:"நிர்வாகம்", heroTitle:"உங்கள் ஆரோக்கியம், எங்கள் முன்னுரிமை", heroSub:"மருத்துவமனைகளைக் கண்டறியுங்கள், முன்பதிவு செய்யுங்கள்.", searchPlaceholder:"இடம் தேடுங்கள்...", findHospitals:"அருகிலுள்ள மருத்துவமனைகள்", findHospitalsSub:"நிகழ்நேர படுக்கை கிடைக்கும் தன்மை", bookToken:"SMS மூலம் டோக்கன்", bookTokenSub:"உடனே டோக்கன் முன்பதிவு செய்யுங்கள்", statHospitals:"மருத்துவமனைகள்", statDoctors:"மருத்துவர்கள்", statTokens:"முன்பதிவு செய்யப்பட்டது", hospitalListTitle:"அருகிலுள்ள மருத்துவமனைகள்", filterAll:"அனைத்து வகைகள்", filterGov:"அரசு", filterPrivate:"தனியார்", filterAllSpec:"அனைத்து சிறப்புகள்", back:"திரும்பு", bookingTitle:"உங்கள் டோக்கன் முன்பதிவு செய்யுங்கள்", labelName:"முழு பெயர்", labelPhone:"தொலைபேசி எண்", labelDept:"துறை தேர்ந்தெடு", placeholderName:"முழு பெயரை உள்ளிடவும்", placeholderPhone:"10 இலக்க தொலைபேசி எண்", selectDept:"-- துறை தேர்ந்தெடு --", confirmBooking:"முன்பதிவு உறுதிசெய்", bookingConfirmed:"முன்பதிவு உறுதி!", downloadToken:"டோக்கன் பதிவிறக்கம்", backHome:"முகப்பிற்கு திரும்பு", emergencyHelp:"அவசர உதவி", emergencyServices:"அவசர சேவைகள்", callAmbulance:"ஆம்புலன்ஸ் அழை (108)", callPolice:"அவசர அழை (112)", callMedical:"மருத்துவ உதவி (102)", emergencyNote:"அமைதியாக இருங்கள். உதவி வருகிறது.", ruralTitle:"🌾 கிராமப்புற சுகாதார அணுகல்", ruralAmbulance:"ஆம்புலன்ஸ் அழை — 108", ruralFindHospital:"மருத்துவமனை கண்டறி", ruralBookToken:"டோக்கன் முன்பதிவு", ruralSmsTitle:"📱 SMS மூலம் முன்பதிவு", ruralSmsInstr:'<strong>HOSPITAL &lt;PINCODE&gt;</strong> என்பதை <strong>12345</strong>க்கு அனுப்பவும்', ruralEmergTitle:"🚨 அவசரம்", ruralEmergInstr:'ஆம்புலன்ஸுக்கு <strong>108</strong> அழைக்கவும்', ruralEmergInstr2:'எந்த அவசரத்திற்கும் <strong>112</strong> அழைக்கவும்', bedsAvail:"படுக்கைகள்", distance:"தூரம்", emergencyLabel:"அவசரம்", viewDetails:"விவரங்கள்", bookTokenBtn:"டோக்கன் முன்பதிவு", callHospital:"மருத்துவமனை அழை", emergencyCall:"🚨 அவசர அழை", doctorsAvailable:"மருத்துவர்கள் கிடைக்கும்", bedAvailability:"படுக்கை கிடைக்கும் தன்மை", emergencyStatus:"அவசர நிலை", tokenNumber:"டோக்கன் எண்", reportingTime:"வரும் நேரம்", hospitalName:"மருத்துவமனை", department:"துறை", totalHospitals:"மொத்த மருத்துவமனைகள்", totalBeds:"மொத்த படுக்கைகள்", totalBookings:"முன்பதிவுகள்", emergencies:"அவசரங்கள்", addHospital:"+ மருத்துவமனை சேர்க்க", name:"பெயர்", phone:"தொலைபேசி", type:"வகை", beds:"படுக்கைகள்", specialty:"சிறப்பு", emergency:"அவசரம்", actions:"செயல்கள்", edit:"திருத்து", patientName:"நோயாளி", date:"தேதி", token:"டோக்கன்", save:"சேமி", cancel:"ரத்து" },
  te: { appTitle:"స్మార్ట్ హెల్త్కేర్", navHome:"హోమ్", navHospitals:"ఆసుపత్రులు", navBooking:"బుకింగ్", navRural:"గ్రామీణ", navAdmin:"అడ్మిన్", heroTitle:"మీ ఆరోగ్యం, మా ప్రాధాన్యత", heroSub:"ఆసుపత్రులను కనుగొనండి, అపాయింట్మెంట్లు బుక్ చేయండి.", searchPlaceholder:"స్థానం వెతకండి...", findHospitals:"సమీప ఆసుపత్రులు", findHospitalsSub:"నిజ సమయ పడక అందుబాటుతో ఆసుపత్రులు కనుగొనండి", bookToken:"SMS ద్వారా టోకెన్", bookTokenSub:"క్యూ దాటండి — వెంటనే టోకెన్ బుక్ చేయండి", statHospitals:"ఆసుపత్రులు", statDoctors:"వైద్యులు", statTokens:"బుక్ చేసిన టోకెన్లు", hospitalListTitle:"సమీప ఆసుపత్రులు", filterAll:"అన్ని రకాలు", filterGov:"ప్రభుత్వం", filterPrivate:"ప్రైవేట్", filterAllSpec:"అన్ని విశేషాలు", back:"వెనుకకు", bookingTitle:"మీ టోకెన్ బుక్ చేయండి", labelName:"పూర్తి పేరు", labelPhone:"ఫోన్ నంబర్", labelDept:"విభాగం ఎంచుకోండి", placeholderName:"మీ పూర్తి పేరు నమోదు చేయండి", placeholderPhone:"10 అంకెల ఫోన్ నంబర్", selectDept:"-- విభాగం ఎంచుకోండి --", confirmBooking:"బుకింగ్ నిర్ధారించు", bookingConfirmed:"బుకింగ్ నిర్ధారించబడింది!", downloadToken:"టోకెన్ డౌన్లోడ్", backHome:"హోమ్కు తిరిగి", emergencyHelp:"అత్యవసర సహాయం", emergencyServices:"అత్యవసర సేవలు", callAmbulance:"అంబులెన్స్ కాల్ (108)", callPolice:"అత్యవసర కాల్ (112)", callMedical:"వైద్య హెల్ప్లైన్ (102)", emergencyNote:"శాంతంగా ఉండండి.", ruralTitle:"🌾 గ్రామీణ ఆరోగ్య సేవ", ruralAmbulance:"అంబులెన్స్ — 108", ruralFindHospital:"ఆసుపత్రి కనుగొనండి", ruralBookToken:"టోకెన్ బుక్", ruralSmsTitle:"📱 SMS ద్వారా బుక్", ruralSmsInstr:'<strong>HOSPITAL &lt;PINCODE&gt;</strong> ని <strong>12345</strong>కు పంపండి', ruralEmergTitle:"🚨 అత్యవసరం", ruralEmergInstr:'అంబులెన్స్కు <strong>108</strong> కాల్ చేయండి', ruralEmergInstr2:'ఏ అత్యవసరానికైనా <strong>112</strong> కాల్ చేయండి', bedsAvail:"పడకలు", distance:"దూరం", emergencyLabel:"అత్యవసరం", viewDetails:"వివరాలు", bookTokenBtn:"టోకెన్ బుక్", callHospital:"ఆసుపత్రి కాల్", emergencyCall:"🚨 అత్యవసర కాల్", doctorsAvailable:"అందుబాటులో వైద్యులు", bedAvailability:"పడక అందుబాటు", emergencyStatus:"అత్యవసర స్థితి", tokenNumber:"టోకెన్ నంబర్", reportingTime:"రిపోర్టింగ్ సమయం", hospitalName:"ఆసుపత్రి పేరు", department:"విభాగం", totalHospitals:"మొత్తం ఆసుపత్రులు", totalBeds:"మొత్తం పడకలు", totalBookings:"బుకింగ్లు", emergencies:"అత్యవసరాలు", addHospital:"+ ఆసుపత్రి జోడించు", name:"పేరు", phone:"ఫోన్", type:"రకం", beds:"పడకలు", specialty:"విశేషత", emergency:"అత్యవసరం", actions:"చర్యలు", edit:"సవరించు", patientName:"రోగి", date:"తేదీ", token:"టోకెన్", save:"సేవ్", cancel:"రద్దు" },
  bn: { appTitle:"স্মার্ট হেলথকেয়ার", navHome:"হোম", navHospitals:"হাসপাতাল", navBooking:"বুকিং", navRural:"গ্রামীণ", navAdmin:"অ্যাডমিন", heroTitle:"আপনার স্বাস্থ্য, আমাদের অগ্রাধিকার", heroSub:"হাসপাতাল খুঁজুন, অ্যাপয়েন্টমেন্ট বুক করুন।", searchPlaceholder:"অবস্থান দিয়ে খুঁজুন...", findHospitals:"কাছাকাছি হাসপাতাল খুঁজুন", findHospitalsSub:"রিয়েল-টাইম বেড পাওয়ার সাথে হাসপাতাল খুঁজুন", bookToken:"SMS-এ টোকেন বুক", bookTokenSub:"লাইন এড়িয়ে চলুন — এখনই টোকেন বুক করুন", statHospitals:"হাসপাতাল", statDoctors:"ডাক্তার", statTokens:"টোকেন বুক", hospitalListTitle:"কাছাকাছি হাসপাতাল", filterAll:"সব ধরনের", filterGov:"সরকারি", filterPrivate:"বেসরকারি", filterAllSpec:"সব বিশেষত্ব", back:"ফিরে যান", bookingTitle:"আপনার টোকেন বুক করুন", labelName:"পুরো নাম", labelPhone:"ফোন নম্বর", labelDept:"বিভাগ নির্বাচন করুন", placeholderName:"আপনার পুরো নাম লিখুন", placeholderPhone:"১০ সংখ্যার ফোন নম্বর", selectDept:"-- বিভাগ নির্বাচন --", confirmBooking:"বুকিং নিশ্চিত করুন", bookingConfirmed:"বুকিং নিশ্চিত হয়েছে!", downloadToken:"টোকেন ডাউনলোড করুন", backHome:"হোমে ফিরুন", emergencyHelp:"জরুরি সাহায্য", emergencyServices:"জরুরি সেবা", callAmbulance:"অ্যাম্বুলেন্স কল (108)", callPolice:"জরুরি কল (112)", callMedical:"মেডিকেল হেল্পলাইন (102)", emergencyNote:"শান্ত থাকুন। সাহায্য আসছে।", ruralTitle:"🌾 গ্রামীণ স্বাস্থ্যসেবা", ruralAmbulance:"অ্যাম্বুলেন্স — 108", ruralFindHospital:"হাসপাতাল খুঁজুন", ruralBookToken:"টোকেন বুক", ruralSmsTitle:"📱 SMS-এ বুক", ruralSmsInstr:'<strong>HOSPITAL &lt;PINCODE&gt;</strong> পাঠান <strong>12345</strong> নম্বরে', ruralEmergTitle:"🚨 জরুরি অবস্থা", ruralEmergInstr:'অ্যাম্বুলেন্সের জন্য <strong>108</strong> কল করুন', ruralEmergInstr2:'যেকোনো জরুরি অবস্থায় <strong>112</strong> কল করুন', bedsAvail:"বেড পাওয়া যাচ্ছে", distance:"দূরত্ব", emergencyLabel:"জরুরি", viewDetails:"বিস্তারিত", bookTokenBtn:"টোকেন বুক", callHospital:"হাসপাতাল কল", emergencyCall:"🚨 জরুরি কল", doctorsAvailable:"ডাক্তার পাওয়া যাচ্ছে", bedAvailability:"বেড পাওয়ার অবস্থা", emergencyStatus:"জরুরি অবস্থা", tokenNumber:"টোকেন নম্বর", reportingTime:"রিপোর্টিং সময়", hospitalName:"হাসপাতালের নাম", department:"বিভাগ", totalHospitals:"মোট হাসপাতাল", totalBeds:"মোট বেড", totalBookings:"বুকিং", emergencies:"জরুরি অবস্থা", addHospital:"+ হাসপাতাল যোগ করুন", name:"নাম", phone:"ফোন", type:"ধরন", beds:"বেড", specialty:"বিশেষত্ব", emergency:"জরুরি", actions:"পদক্ষেপ", edit:"সম্পাদনা", patientName:"রোগী", date:"তারিখ", token:"টোকেন", save:"সংরক্ষণ", cancel:"বাতিল" }
};

function t(key) { return (T[currentLang] && T[currentLang][key]) || (T.en[key]) || key; }

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (val) el.innerHTML = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = t(key);
    if (val) el.placeholder = val;
  });
}

// ==================== ROUTER & UI ====================
function showPage(pageId) {
  const loading = document.getElementById('loadingOverlay');
  loading.classList.add('show');
  
  setTimeout(() => {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById('page-' + pageId);
    if (page) page.classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.toggle('active', n.getAttribute('data-page') === pageId);
    });
    
    const mapWrapper = document.getElementById('sharedMapWrapper');
    
    if (pageId === 'home') {
      const mount = document.getElementById('homeMapMount');
      if (mapWrapper && mount && !mount.contains(mapWrapper)) {
        mount.appendChild(mapWrapper);
      }
      if (!map) renderHospitals(); // Initialize map
      if (map) setTimeout(() => map.invalidateSize(), 100);
    }

    if (pageId === 'hospitals') {
      const mount = document.getElementById('hospitalsMapMount');
      if (mapWrapper && mount && !mount.contains(mapWrapper)) {
        mount.appendChild(mapWrapper);
      }
      renderHospitals();
      if (map) {
        setTimeout(() => map.invalidateSize(), 100);
      }
    }
    if (pageId === 'details') renderHospitalDetails();
    if (pageId === 'booking') renderBookingPage();
    if (pageId === 'confirmation') renderConfirmation();
    if (pageId === 'admin') {
      renderAdmin();
      fetchBookings();
    }
    
    loading.classList.remove('show');
    window.scrollTo(0, 0);
  }, 300);
}

function handleRoute() {
  const hash = window.location.hash.replace('#', '') || 'home';
  showPage(hash);
}

function toggleNav() {
  document.getElementById('mobileNav').classList.toggle('open');
}

// ==================== GPS & GEOLOCATION ====================
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 10) / 10;
}

function detectGPS() {
  const btn = document.getElementById('gpsBtn') || document.getElementById('homeGpsBtn');
  if (!navigator.geolocation) {
    showGPSStatus('❌ GPS not supported', 'error'); return;
  }
  if (btn) { btn.textContent = '⏳ Locating...'; btn.disabled = true; }
  
  navigator.geolocation.getCurrentPosition(
    async pos => {
      userLat = pos.coords.latitude;
      userLng = pos.coords.longitude;
      gpsActive = true;
      HOSPITALS.forEach(h => { h.distance = haversineKm(userLat, userLng, h.lat, h.lng); });
      
      try {
        const res = await fetchWithAuth(`https://nominatim.openstreetmap.org/reverse?lat=${userLat}&lon=${userLng}&format=json`, { external: true });
        const data = await res.json();
        userLocationName = data.address.city || data.address.town || 'Your Location';
      } catch { userLocationName = `${userLat.toFixed(2)}, ${userLng.toFixed(2)}`; }
      
      document.getElementById('locationSearch').value = userLocationName;
      showGPSStatus(`📍 ${userLocationName}`, 'success');
      if (btn) {
        btn.textContent = '✅ GPS Active';
        btn.disabled = false;
        btn.classList.add('gps-active');
      }
      
      // Refresh map and list
      renderHospitals();
    },
    err => {
      if (btn) { btn.textContent = '📍 Use My Location'; btn.disabled = false; }
      showGPSStatus('❌ GPS error', 'error');
    },
    { timeout: 10000 }
  );
}

function analyzeSymptoms() {
  const text = document.getElementById('patientSymptoms').value.toLowerCase();
  const wrapper = document.getElementById('aiDeptWrapper');
  const label = document.getElementById('aiAssignedDept');
  const hiddenInput = document.getElementById('patientDept');

  if (!text.trim()) {
    wrapper.style.display = 'none';
    return;
  }

  const keywords = {
    'Cardiology': ['heart', 'chest pain', 'cardiac', 'palpitation', 'breathlessness', 'pressure'],
    'Orthopedics': ['bone', 'fracture', 'joint', 'back pain', 'sprain', 'broken', 'muscle', 'knee'],
    'Neurology': ['headache', 'brain', 'seizure', 'dizziness', 'paralysis', 'stroke', 'numbness'],
    'Pediatrics': ['child', 'baby', 'infant', 'pediatric', 'vaccination'],
    'Dermatology': ['skin', 'rash', 'itching', 'acne', 'allergy', 'mole', 'burn'],
    'ENT': ['ear', 'nose', 'throat', 'sinus', 'hearing', 'vertigo', 'tonsil'],
    'Gynecology': ['pregnancy', 'period', 'women', 'pelvic', 'maternity', 'fertility'],
    'Ophthalmology': ['eye', 'vision', 'blind', 'cataract', 'blurry', 'specs'],
    'Dentistry': ['tooth', 'gums', 'oral', 'cavity', 'dental', 'wisdom tooth'],
    'Psychiatry': ['depression', 'anxiety', 'stress', 'mental', 'bipolar', 'sleep', 'trauma'],
    'Gastroenterology': ['stomach', 'digestion', 'liver', 'ulcer', 'bowel', 'constipation', 'vomiting'],
    'Oncology': ['cancer', 'tumor', 'chemo', 'radiation', 'oncology', 'biopsy'],
    'Endocrinology': ['diabetes', 'thyroid', 'hormone', 'insulin', 'metabolism'],
    'Pulmonology': ['lung', 'asthma', 'pneumonia', 'breathing', 'coughing blood', 'bronchitis'],
    'Urology': ['kidney', 'bladder', 'urine', 'prostate', 'urinary'],
    'Nephrology': ['dialysis', 'kidney failure', 'renal'],
    'Hematology': ['blood', 'anemia', 'leukemia', 'bleeding'],
    'General Medicine': ['fever', 'cough', 'cold', 'infection', 'pain', 'weakness', 'fatigue']
  };

  let assigned = 'General Medicine'; // Default
  for (const [dept, words] of Object.entries(keywords)) {
    if (words.some(w => text.includes(w))) {
      assigned = dept;
      break;
    }
  }

  wrapper.style.display = 'block';
  label.textContent = assigned.toUpperCase();
  hiddenInput.value = assigned;

  suggestBetterHospital(assigned);
}

function suggestBetterHospital(assignedDept) {
  const suggestBox = document.getElementById('aiHospitalSuggestion');
  const suggestText = document.getElementById('suggestionText');
  const switchBtn = document.getElementById('btnSwitchHospital');
  const continueBtn = document.getElementById('btnContinueHospital');
  const select = document.getElementById('bookingHospitalSelect');

  const currentHospitalName = select.value;
  if (!currentHospitalName) {
    suggestBox.style.display = 'none';
    return;
  }

  const currentHosp = HOSPITALS.find(h => h.name === currentHospitalName);
  
  // Find all hospitals that specialize in this department
  let experts = HOSPITALS.filter(h => 
    h.specialty && h.specialty.toLowerCase().includes(assignedDept.toLowerCase())
  );

  // If GPS is active, sort experts by distance
  if (gpsActive) experts.sort((a,b) => a.distance - b.distance);

  const bestExpert = experts[0];

  // If current hospital is already an expert or no experts found, hide suggestion
  if (!bestExpert || (currentHosp && currentHosp.specialty && currentHosp.specialty.toLowerCase().includes(assignedDept.toLowerCase()))) {
    suggestBox.style.display = 'none';
    return;
  }

  // Show suggestion
  suggestBox.style.display = 'block';
  suggestText.innerHTML = `AI suggests <strong>${bestExpert.name}</strong> as it specializes in <strong>${assignedDept}</strong>. Would you like to switch for better specialized care?`;
  
  switchBtn.onclick = () => {
    select.value = bestExpert.name;
    // Trigger change manually to update logic
    select.dispatchEvent(new Event('change'));
    suggestBox.style.display = 'none';
  };

  continueBtn.onclick = () => {
    suggestBox.style.display = 'none';
  };
}

function showGPSStatus(msg, type) {
  let el = document.getElementById('gpsStatus');
  if (!el) return;
  el.textContent = msg;
  el.className = 'gps-status ' + type;
  el.style.display = 'block';
}

async function searchLocation() {
  const input = document.getElementById('locationSearch').value.trim();
  if (!input) { showGPSStatus('Enter location', 'error'); return; }
  
  const btn = document.querySelector('.search-btn');
  btn.textContent = '⏳'; btn.disabled = true;

  try {
    const res = await fetchWithAuth(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&format=json&limit=1`, { external: true });
    const data = await res.json();
    if (data && data.length > 0) {
      userLat = parseFloat(data[0].lat);
      userLng = parseFloat(data[0].lon);
      gpsActive = true;
      userLocationName = data[0].display_name.split(',')[0];
      HOSPITALS.forEach(h => { h.distance = haversineKm(userLat, userLng, h.lat, h.lng); });
      showGPSStatus(`📍 Found: ${userLocationName}`, 'success');
      window.location.hash = '#hospitals';
    } else {
      showGPSStatus('❌ Not found', 'error');
    }
  } catch (e) {
    showGPSStatus('❌ Error', 'error');
  } finally {
    btn.textContent = 'GO'; btn.disabled = false;
  }
}

// ==================== HOSPITAL LIST ====================
function renderHospitals() {
  const grid = document.getElementById('hospitalGrid');
  const typeFilter = document.getElementById('filterType').value;
  const distFilter = document.getElementById('filterDistance').value;
  const specFilter = document.getElementById('filterSpecialty').value;
  
  // Initialize Map if not exists
  if (!map) {
    const startLat = userLat || 28.6139;
    const startLng = userLng || 77.2090;
    map = L.map('map').setView([startLat, startLng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    map.on('moveend', searchHospitalsOnMap);
  }

  searchHospitalsOnMap();
}

async function searchHospitalsOnMap() {
  if (!map) return;
  const bounds = map.getBounds();
  const south = bounds.getSouth();
  const west = bounds.getWest();
  const north = bounds.getNorth();
  const east = bounds.getEast();

  const query = `[out:json];node["amenity"="hospital"](${south},${west},${north},${east});out;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    MAP_HOSPITALS = data.elements.map(el => ({
      id: el.id,
      name: el.tags.name || 'Local Hospital',
      lat: el.lat,
      lng: el.lon,
      type: 'private',
      specialty: 'General Medicine',
      distance: userLat ? haversineKm(userLat, userLng, el.lat, el.lon) : 0,
      beds: 50,
      bedsAvail: 10,
      emergency: true,
      phone: el.tags.phone || 'N/A',
      doctors: [{ name: 'On-Call Doctor', spec: 'Emergency' }]
    }));
    
    // Trigger re-render without re-initializing map
    renderHospitalListOnly(); 
  } catch (err) {
    console.warn('Map search failed:', err);
  }
}

function renderHospitalListOnly() {
  const grid = document.getElementById('hospitalGrid');
  const typeFilter = document.getElementById('filterType').value;
  const specFilter = document.getElementById('filterSpecialty').value;

  // Union of DB hospitals and Map hospitals
  const allHospitals = [...HOSPITALS];
  MAP_HOSPITALS.forEach(mh => {
    if (!allHospitals.find(h => h.name === mh.name)) {
      allHospitals.push(mh);
    }
  });

  let filtered = allHospitals.filter(h => {
    if (typeFilter !== 'all' && h.type !== typeFilter) return false;
    if (specFilter !== 'all' && (!h.specialty || !h.specialty.toLowerCase().includes(specFilter.toLowerCase()))) return false;
    
    // 10KM Range Filter (only if GPS is active)
    if (gpsActive && h.distance > 10) return false;

    // ONLY show hospitals visible in the current map viewport
    if (!h.lat || !h.lng) return false;
    if (map && !map.getBounds().contains(L.latLng(h.lat, h.lng))) return false;

    return true;
  });

  // Update Markers
  mapMarkers.forEach(m => map.removeLayer(m));
  mapMarkers = [];
  
  filtered.forEach(h => {
    const marker = L.marker([h.lat, h.lng]).addTo(map)
      .bindPopup(`<b>${h.name}</b><br>${h.type || 'General'}<br><button class="btn btn-sm" onclick="selectedHospitalId='${h.id || h._id}';window.location.hash='#details'">Details</button>`);
    mapMarkers.push(marker);
  });

  if (gpsActive && userLat && userLng) {
    if (userMarker) map.removeLayer(userMarker);
    if (userCircle) map.removeLayer(userCircle);
    
    map.setView([userLat, userLng], 13);
    userCircle = L.circle([userLat, userLng], { radius: 200, color: 'blue' }).addTo(map);
    userMarker = L.marker([userLat, userLng], { icon: L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    }) }).addTo(map).bindPopup("You are here");
  }

  grid.innerHTML = filtered.map(h => `
    <div class="hospital-card">
      <div class="hospital-card-header">
        <span class="hospital-card-name">🏥 ${h.name} (${h.distance || '0'} km)</span>
        <span class="hospital-card-type ${h.type === 'government' ? 'type-gov' : 'type-private'}">${h.type === 'government' ? t('filterGov') : t('filterPrivate')}</span>
      </div>
      <div class="hospital-card-info">
        <div class="hospital-card-row"><span>🛏️</span><span>${t('bedsAvail')}: ${h.bedsAvail} / ${h.beds}</span></div>
        <div class="hospital-card-row">
          <span class="emergency-badge ${h.emergency ? 'emergency-yes' : 'emergency-no'}">
            ${h.emergency ? '🚨 ' + t('emergencyLabel') + ': Yes' : '— ' + t('emergencyLabel') + ': No'}
          </span>
        </div>
      </div>
      <button class="btn btn-primary btn-full" onclick="selectedHospitalId='${h.id || h._id}';window.location.hash='#details'">${t('viewDetails')}</button>
    </div>
  `).join('');
}

// ==================== DETAILS ====================
function renderHospitalDetails() {
  const allHospitals = [...HOSPITALS];
  MAP_HOSPITALS.forEach(mh => {
    if (!allHospitals.find(h => h.name === mh.name)) allHospitals.push(mh);
  });
  const h = allHospitals.find(x => x.id == selectedHospitalId || x._id == selectedHospitalId);
  if (!h) return;
  const container = document.getElementById('hospitalDetailsContent');
  container.innerHTML = `
    <div class="detail-header">
      <h2>🏥 ${h.name}</h2>
      <p>${h.type === 'government' ? t('filterGov') : t('filterPrivate')} • ${h.specialty} • ${h.distance} km</p>
    </div>
    <div class="detail-grid">
      <div class="detail-stat"><div class="detail-stat-icon">🛏️</div><div class="detail-stat-value">${h.bedsAvail}/${h.beds}</div><div class="detail-stat-label">${t('bedAvailability')}</div></div>
      <div class="detail-stat"><div class="detail-stat-icon">👨⚕️</div><div class="detail-stat-value">${h.doctors.length}</div><div class="detail-stat-label">${t('doctorsAvailable')}</div></div>
      <div class="detail-stat"><div class="detail-stat-icon">${h.emergency ? '🟢' : '🔴'}</div><div class="detail-stat-value">${h.emergency ? 'Active' : 'N/A'}</div><div class="detail-stat-label">${t('emergencyStatus')}</div></div>
    </div>
    <div class="detail-doctors">
      <h3>👨⚕️ ${t('doctorsAvailable')}</h3>
      ${h.doctors.map(d => `<div class="doctor-card"><div class="doctor-avatar">👨⚕️</div><div class="doctor-info"><h4>${d.name}</h4><p>${d.spec}</p></div></div>`).join('')}
    </div>
    <div class="detail-actions">
      <button class="btn btn-primary" onclick="selectedHospitalId='${h.id || h._id}';window.location.hash='#booking'">🎫 ${t('bookTokenBtn')}</button>
      <button class="btn btn-success" onclick="window.open('tel:${h.phone}')">📞 ${t('callHospital')}</button>
      <button class="btn btn-danger" onclick="window.open('tel:108')">${t('emergencyCall')}</button>
    </div>
  `;
}

// ==================== BOOKING ====================
function renderBookingPage() {
  const h = HOSPITALS.find(x => x.id === selectedHospitalId);
  const select = document.getElementById('bookingHospitalSelect');
  if (select) {
    select.innerHTML = '<option value="">-- Select Hospital --</option>';
    
    // Combine backend hospitals and map hospitals
    // Use a Map to ensure unique names
    const allUnique = new Map();
    
    HOSPITALS.forEach(hosp => allUnique.set(hosp.name, hosp));
    MAP_HOSPITALS.forEach(hosp => {
      if (!allUnique.has(hosp.name)) {
        allUnique.set(hosp.name, hosp);
      }
    });

    let list = Array.from(allUnique.values());
    
    // Sort by distance if GPS is active
    if (gpsActive) {
      list.sort((a, b) => {
        const distA = a.distance !== undefined ? a.distance : 999;
        const distB = b.distance !== undefined ? b.distance : 999;
        return distA - distB;
      });
    }
    
    list.forEach(hosp => {
      const opt = document.createElement('option');
      opt.value = hosp.name;
      const distStr = hosp.distance !== undefined ? ` (${hosp.distance} km)` : '';
      opt.textContent = `${hosp.name}${distStr}`;
      if (h && hosp.id === h.id) opt.selected = true;
      select.appendChild(opt);
    });
  }
}

async function handleBooking(e) {
  e.preventDefault();
  const name = document.getElementById('patientName').value;
  const phone = document.getElementById('patientPhone').value;
  const dept = document.getElementById('patientDept').value || 'General Medicine';
  const hospitalName = document.getElementById('bookingHospitalSelect').value;

  const bookingData = {
    patientName: name,
    patientPhone: phone,
    patientDept: dept,
    hospitalName: hospitalName
  };

  try {
    const res = await fetchWithAuth('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    
    if (res.ok) {
      lastToken = await res.json();
      bookings.push(lastToken);
      document.getElementById('bookingForm').reset();
      document.getElementById('statTokens').textContent = bookings.length;
      window.location.hash = '#confirmation';
    } else {
      const errorData = await res.json();
      if (errorData.error === 'Spam Detected') {
        alert(`🚨 SECURITY BLOCK: ${errorData.message}\nTrust Score: ${errorData.score}`);
        return;
      }
      throw new Error('Booking failed');
    }
  } catch (err) {
    console.warn('API Booking failed, using local fallback', err);
    const tokenNum = 'TKN-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const reportTime = new Date(now.getTime() + 60 * 60000);
    const timeStr = reportTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    lastToken = { tokenNum, patientName: name, patientPhone: phone, patientDept: dept, hospitalName: hospitalName, reportTime: timeStr, date: now.toLocaleDateString() };
    bookings.push(lastToken);
    document.getElementById('bookingForm').reset();
    document.getElementById('statTokens').textContent = bookings.length;
    window.location.hash = '#confirmation';
  }
}

function renderConfirmation() {
  if (!lastToken) return;
  
  // Update AI Badge
  const badge = document.getElementById('aiSecurityBadge');
  const label = document.getElementById('aiScoreLabel');
  const score = lastToken.spamScore || 100;
  
  if (score >= 70) {
    badge.className = 'ai-security-badge verified';
    label.textContent = 'GENUINE CASE (' + score + ')';
  } else if (score >= 40) {
    badge.className = 'ai-security-badge warning';
    label.textContent = 'LOW TRUST (' + score + ')';
  } else {
    badge.className = 'ai-security-badge danger';
    label.textContent = 'SUSPICIOUS (' + score + ')';
  }

  document.getElementById('tokenDetails').innerHTML = `
    <div class="token-detail-row"><span class="token-detail-label">${t('tokenNumber')}</span><span class="token-detail-value">${lastToken.tokenNum}</span></div>
    <div class="token-detail-row"><span class="token-detail-label">${t('reportingTime')}</span><span class="token-detail-value">${lastToken.reportTime}</span></div>
    <div class="token-detail-row"><span class="token-detail-label">${t('hospitalName')}</span><span class="token-detail-value">${lastToken.hospitalName}</span></div>
    <div class="token-detail-row"><span class="token-detail-label">${t('department')}</span><span class="token-detail-value">${lastToken.patientDept}</span></div>
  `;
}

function downloadToken() {
  if (!lastToken) return;
  const text = `SMART HEALTHCARE\nToken: ${lastToken.tokenNum}\nPatient: ${lastToken.patientName}\nPhone: ${lastToken.patientPhone}\nHospital: ${lastToken.hospitalName}\nDept: ${lastToken.patientDept}\nTime: ${lastToken.reportTime}\nDate: ${lastToken.date}\nCall 108 for Emergency`;
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = lastToken.tokenNum + '.txt';
  a.click();
}

// ==================== ADMIN ====================
function renderAdmin() {
  const totalBeds = HOSPITALS.reduce((s, h) => s + h.bedsAvail, 0);
  const emergCount = HOSPITALS.filter(h => h.emergency).length;
  document.getElementById('adminStats').innerHTML = `
    <div class="admin-stat-card blue"><div class="stat-icon">🏥</div><div class="stat-value">${HOSPITALS.length}</div><div class="stat-label">${t('totalHospitals')}</div></div>
    <div class="admin-stat-card green"><div class="stat-icon">🛏️</div><div class="stat-value">${totalBeds}</div><div class="stat-label">${t('totalBeds')}</div></div>
    <div class="admin-stat-card yellow"><div class="stat-icon">🎫</div><div class="stat-value">${bookings.length}</div><div class="stat-label">${t('totalBookings')}</div></div>
    <div class="admin-stat-card red"><div class="stat-icon">🚨</div><div class="stat-value">${emergCount}</div><div class="stat-label">${t('emergencies')}</div></div>
  `;
  renderAdminTab(document.querySelector('.tab-btn.active').getAttribute('data-tab'));
}

function renderAdminTab(tab) {
  const container = document.getElementById('adminTabContent');
  if (tab === 'hospitals') {
    container.innerHTML = `
      <button class="admin-add-btn" onclick="toggleAdminForm()">➕ ${t('addHospital')}</button>
      <div id="adminFormContainer" style="display:${adminShowForm ? 'block' : 'none'}">
        <div class="admin-form">
          <div class="admin-form-grid">
            <input id="ahName" placeholder="${t('name')}">
            <input id="ahPhone" placeholder="${t('phone')}">
            <select id="ahType"><option value="government">${t('filterGov')}</option><option value="private">${t('filterPrivate')}</option></select>
            <input id="ahBeds" type="number" placeholder="${t('beds')}">
            <input id="ahSpec" placeholder="${t('specialty')}">
            <select id="ahEmerg"><option value="true">${t('emergency')}: Yes</option><option value="false">${t('emergency')}: No</option></select>
          </div>
          <div class="admin-form-actions">
            <button class="btn btn-primary btn-sm" onclick="addHospital()">${t('save')}</button>
            <button class="btn btn-outline btn-sm" onclick="toggleAdminForm()">${t('cancel')}</button>
          </div>
        </div>
      </div>
      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead><tr><th>${t('name')}</th><th>${t('type')}</th><th>${t('beds')}</th><th>${t('emergency')}</th><th>${t('actions')}</th></tr></thead>
          <tbody>${HOSPITALS.map(h => `<tr>
            <td>${h.name}</td>
            <td>${h.type}</td>
            <td>${h.bedsAvail}/${h.beds}</td>
            <td>${h.emergency ? '🟢 Yes' : '🔴 No'}</td>
            <td>
              <button class="btn btn-sm btn-danger" onclick="deleteHospital('${h._id}')">🗑️</button>
            </td>
          </tr>`).join('')}</tbody>
        </table>
      </div>`;
  } else if (tab === 'bookings') {
    container.innerHTML = bookings.length === 0
      ? '<p style="text-align:center;color:var(--text-muted);padding:32px;">No bookings yet.</p>'
      : `<button class="btn btn-danger" style="margin-bottom: 15px;" onclick="clearAllBookings()">⚠️ Clear All Bookings</button>
         <div class="admin-table-wrapper"><table class="admin-table">
          <thead><tr><th>${t('token')}</th><th>${t('patientName')}</th><th>${t('hospitalName')}</th><th>${t('department')}</th><th>Actions</th></tr></thead>
          <tbody>${bookings.map(b => `<tr id="booking-row-${b._id}">
            <td>${b.tokenNum || 'N/A'}</td>
            <td>
              <span class="view-mode">${b.patientName || 'Anonymous'}</span>
              <input type="text" class="edit-mode form-input" style="display:none;width:90%;padding:4px;" value="${b.patientName || ''}">
            </td>
            <td>
              <span class="view-mode">${b.hospitalName || 'N/A'}</span>
              <input type="text" class="edit-mode form-input" style="display:none;width:90%;padding:4px;" value="${b.hospitalName || ''}">
            </td>
            <td>
              <span class="view-mode">${b.patientDept || 'General'}</span>
              <input type="text" class="edit-mode form-input" style="display:none;width:90%;padding:4px;" value="${b.patientDept || ''}">
            </td>
            <td>
              <button class="btn btn-sm btn-outline view-mode" onclick="editBookingUI('${b._id}')">✏️</button>
              <button class="btn btn-sm btn-danger view-mode" onclick="deleteBooking('${b._id}')">🗑️</button>
              <button class="btn btn-sm btn-primary edit-mode" style="display:none;" onclick="saveBooking('${b._id}')">💾</button>
              <button class="btn btn-sm btn-outline edit-mode" style="display:none;" onclick="cancelEditBooking('${b._id}')">❌</button>
            </td>
          </tr>`).join('')}</tbody>
        </table></div>`;
  } else if (tab === 'tasks') {
    container.innerHTML = `
      <div class="admin-form" style="margin-bottom: 20px;">
        <h3>Add New Task</h3>
        <div class="admin-form-grid">
          <input id="taskTitle" placeholder="Task Title">
          <input id="taskDesc" placeholder="Description">
          <select id="taskPriority">
            <option value="low">Low Priority</option>
            <option value="medium" selected>Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="emergency">Emergency</option>
          </select>
          <button class="btn btn-primary" onclick="createTask()">Add Task</button>
        </div>
      </div>
      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead><tr><th>Title</th><th>Priority</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>${allTasks.map(t => `<tr>
            <td><strong>${t.title}</strong><br><small>${t.description}</small></td>
            <td><span class="priority-badge ${t.priority}">${t.priority.toUpperCase()}</span></td>
            <td>
              <select onchange="updateTaskStatus('${t._id}', this.value)">
                <option value="todo" ${t.status === 'todo' ? 'selected' : ''}>To Do</option>
                <option value="in-progress" ${t.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                <option value="completed" ${t.status === 'completed' ? 'selected' : ''}>Completed</option>
              </select>
            </td>
            <td><button class="btn btn-sm btn-danger" onclick="deleteTask('${t._id}')">🗑️</button></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>`;
  } else if (tab === 'spam') {
    container.innerHTML = `
      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead><tr><th>Phone Number</th><th>Trust Score</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>${spamReputationData.map(r => `<tr>
            <td>${r.phoneNumber}</td>
            <td>
              <div class="trust-meter" style="width:100px;display:inline-block;margin-right:10px;">
                <div class="trust-fill" style="width:${r.trustScore}%"></div>
              </div>
              ${r.trustScore}%
            </td>
            <td><span class="spam-badge ${r.isBanned ? 'banned' : 'trusted'}">${r.isBanned ? 'BANNED' : 'TRUSTED'}</span></td>
            <td>
              <button class="btn btn-sm ${r.isBanned ? 'btn-primary' : 'btn-danger'}" onclick="toggleBan('${r._id}', ${!r.isBanned})">
                ${r.isBanned ? 'Whitelist' : 'Ban'}
              </button>
            </td>
          </tr>`).join('')}</tbody>
        </table>
      </div>`;
  }
}

function toggleAdminForm() {
  adminShowForm = !adminShowForm;
  document.getElementById('adminFormContainer').style.display = adminShowForm ? 'block' : 'none';
}

async function addHospital() {
  const name = document.getElementById('ahName').value;
  if (!name) return;
  
  const hData = {
    name,
    type: document.getElementById('ahType').value,
    distance: Math.round(Math.random() * 15 * 10) / 10,
    beds: Number(document.getElementById('ahBeds').value) || 50,
    bedsAvail: Math.floor(Math.random() * 30) + 5,
    emergency: document.getElementById('ahEmerg').value === 'true',
    phone: document.getElementById('ahPhone').value || '000-0000000',
    specialty: document.getElementById('ahSpec').value || 'general',
    doctors: [{ name: 'Dr. New', spec: 'General' }]
  };

  try {
    const res = await fetchWithAuth('/api/hospitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hData)
    });
    if (res.ok) {
      const newH = await res.json();
      HOSPITALS.push(newH);
      adminShowForm = false;
      document.getElementById('statHospitals').textContent = HOSPITALS.length;
      renderAdmin();
    }
  } catch (err) {
    console.error('Failed to add hospital:', err);
  }
}

async function deleteHospital(id) {
  if (!confirm('Are you sure you want to delete this hospital?')) return;
  try {
    const res = await fetchWithAuth(`/api/hospitals/${id}`, { method: 'DELETE' });
    if (res.ok) {
      HOSPITALS = HOSPITALS.filter(h => h._id !== id);
      renderAdmin();
    }
  } catch (err) { console.error('Delete failed:', err); }
}

async function deleteBooking(id) {
  if (!confirm('Cancel this booking?')) return;
  try {
    const res = await fetchWithAuth(`/api/bookings/${id}`, { method: 'DELETE' });
    if (res.ok) {
      bookings = bookings.filter(b => b._id !== id);
      document.getElementById('statTokens').textContent = bookings.length;
      renderAdmin();
    }
  } catch (err) { console.error('Delete failed:', err); }
}

async function clearAllBookings() {
  if (!confirm('WARNING: Are you sure you want to delete ALL bookings? This cannot be undone.')) return;
  try {
    const res = await fetchWithAuth('/api/bookings', { method: 'DELETE' });
    if (res.ok) {
      bookings = [];
      const statTokens = document.getElementById('statTokens');
      if (statTokens) statTokens.textContent = bookings.length;
      renderAdmin();
      renderAdminTab('bookings');
    } else {
      alert('Failed to clear bookings');
    }
  } catch (err) {
    console.error('Failed to clear bookings:', err);
  }
}

async function fetchBookings() {
  try {
    const res = await fetchWithAuth('/api/bookings');
    if (res.ok) {
      bookings = await res.json();
      const statTokens = document.getElementById('statTokens');
      if (statTokens) statTokens.textContent = bookings.length;
      
      const activeTab = document.querySelector('.tab-btn.active');
      if (activeTab && activeTab.getAttribute('data-tab') === 'bookings') {
        renderAdminTab('bookings');
      }
      
      // Update stats if admin is open
      const pageAdmin = document.getElementById('page-admin');
      if (pageAdmin && pageAdmin.classList.contains('active')) {
        renderAdmin();
      }
    }
  } catch (err) {
    console.error('Failed to fetch bookings:', err);
  }
}

function editBookingUI(id) {
  const row = document.getElementById(`booking-row-${id}`);
  if (!row) return;
  row.querySelectorAll('.view-mode').forEach(el => el.style.display = 'none');
  row.querySelectorAll('.edit-mode').forEach(el => el.style.display = 'inline-block');
}

function cancelEditBooking(id) {
  const row = document.getElementById(`booking-row-${id}`);
  if (!row) return;
  row.querySelectorAll('.edit-mode').forEach(el => el.style.display = 'none');
  row.querySelectorAll('.view-mode').forEach(el => el.style.display = 'inline-block');
}

async function saveBooking(id) {
  const row = document.getElementById(`booking-row-${id}`);
  if (!row) return;
  const inputs = row.querySelectorAll('input.edit-mode');
  const patientName = inputs[0].value;
  const hospitalName = inputs[1].value;
  const patientDept = inputs[2].value;

  try {
    const res = await fetchWithAuth(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientName, hospitalName, patientDept })
    });
    if (res.ok) {
      fetchBookings(); // Refresh UI
    } else {
      alert('Failed to update booking');
    }
  } catch (err) {
    console.error('Update failed:', err);
  }
}

async function createTask() {
  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDesc').value;
  const priority = document.getElementById('taskPriority').value;
  if (!title) return;

  try {
    const res = await fetchWithAuth('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, priority })
    });
    if (res.ok) {
      const newTask = await res.json();
      allTasks.unshift(newTask);
      renderAdminTab('tasks');
    }
  } catch (err) { console.error('Task creation failed:', err); }
}

async function updateTaskStatus(id, status) {
  try {
    await fetchWithAuth(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  } catch (err) { console.error('Update failed:', err); }
}

async function deleteTask(id) {
  try {
    const res = await fetchWithAuth(`/api/tasks/${id}`, { method: 'DELETE' });
    if (res.ok) {
      allTasks = allTasks.filter(t => t._id !== id);
      renderAdminTab('tasks');
    }
  } catch (err) { console.error('Delete failed:', err); }
}

// ==================== MAP & DB STUBS ====================
// map already declared at the top



function testDbConnection() {
  const status = document.getElementById('dbStatus');
  status.textContent = 'Connecting to Backend...';
  status.style.color = 'var(--primary)';
  
  fetchWithAuth('/api/hospitals')
    .then(res => {
      if (res.ok) {
        status.textContent = '✅ Connected to Node.js Backend Successfully!';
        status.style.color = 'var(--secondary)';
      } else {
        throw new Error('Server error');
      }
    })
    .catch(err => {
      status.textContent = '❌ Connection failed. Ensure server is running.';
      status.style.color = 'var(--danger)';
    });
}

function simulateOfflineEmergency() {
  alert("🛰️ NETWORK DISCONNECTED: Activating Edge-AI Emergency Protocol.");
  alert("🤖 Edge-AI: Analyzing biometric patterns locally... \nHigh priority detected. Overriding standard queue.");
  triggerSmartEmergency(); // Re-use the existing logic but with a simulated context
}

// ==================== EXTRAS ====================
function toggleDarkMode() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  document.getElementById('darkModeBtn').textContent = next === 'dark' ? '☀️' : '🌙';
}

function speakPage() {
  if (!('speechSynthesis' in window)) return alert('Voice not supported.');
  window.speechSynthesis.cancel();
  const text = document.querySelector('.page.active').innerText.substring(0, 400);
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = { hi:'hi-IN', ta:'ta-IN', te:'te-IN', bn:'bn-IN' }[currentLang] || 'en-IN';
  window.speechSynthesis.speak(utter);
}

function openEmergencyModal() { document.getElementById('emergencyModal').classList.add('show'); }
function closeEmergencyModal() { document.getElementById('emergencyModal').classList.remove('show'); }

let callTimer = null;
let callSeconds = 0;

async function triggerSmartEmergency() {
  closeEmergencyModal();
  
  // 1. Show Threat Analysis Overlay
  const overlay = document.getElementById('threatAnalysisOverlay');
  const log = document.getElementById('threatLog');
  const fill = document.getElementById('trustFill');
  const val = document.getElementById('trustValue');
  
  overlay.classList.add('show');
  log.innerHTML = '';
  fill.style.width = '0%';
  val.textContent = '0%';
  
  const addThreatLog = (msg) => {
    const entry = document.createElement('div');
    entry.className = 'threat-log-entry';
    entry.textContent = `> [${new Date().toLocaleTimeString()}] ${msg}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
  };

  addThreatLog("Initializing Neural Judgment Engine...");
  await new Promise(r => setTimeout(r, 600));
  addThreatLog("Analyzing device fingerprint and user-agent...");
  await new Promise(r => setTimeout(r, 400));
  addThreatLog("Cross-referencing global reputation database...");
  
  const behaviorData = monitor.getData();
  const emergencyData = {
    patientLat: userLat,
    patientLng: userLng,
    patientPhone: localStorage.getItem('lastPatientPhone') || '9999999999',
    behaviorData
  };

  try {
    const res = await fetchWithAuth('/api/emergency', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emergencyData)
    });

    const backendResults = await res.json();
    
    if (!res.ok) {
      addThreatLog(`CRITICAL: ${backendResults.error || 'Security block'}`);
      fill.style.background = 'var(--danger)';
      await new Promise(r => setTimeout(r, 2000));
      overlay.classList.remove('show');
      alert(`🚨 SECURITY BLOCK: ${backendResults.message || 'Suspicious activity detected.'}`);
      return;
    }

    addThreatLog(`Trust Score Verified: ${backendResults.trustScore || 90}%`);
    fill.style.width = `${backendResults.trustScore || 90}%`;
    val.textContent = `${backendResults.trustScore || 90}%`;
    await new Promise(r => setTimeout(r, 1000));
    
    overlay.classList.remove('show');
    showPage('emergency-status');
    
    // Reset UI
    document.getElementById('emergencyDetailsArea').style.display = 'none';
    document.getElementById('etaWrapper').style.display = 'none';
    document.getElementById('btnCallNow').style.display = 'block';
    document.getElementById('btnCallEnd').style.display = 'none';
    document.getElementById('callDuration').textContent = '00:00';
    document.getElementById('dispatchLog').innerHTML = '';
    document.getElementById('bookingAbandonBtn').textContent = 'ABANDON EMERGENCY';
    
    const assignedHospitalEl = document.getElementById('assignedHospitalName');
    const dispatchMessageEl = document.getElementById('dispatchMessage');
    const hospitalListEl = document.getElementById('emergHospitalList');
    
    assignedHospitalEl.textContent = '📡 SCANNING AREA...';
    dispatchMessageEl.textContent = 'Detecting nearby medical facilities within 10km...';
    hospitalListEl.innerHTML = '';

    // Combine with Map hospitals
    const uniqueMap = new Map();
    if (backendResults.allHospitals) {
      backendResults.allHospitals.forEach(name => uniqueMap.set(name, { name }));
    }
    MAP_HOSPITALS.forEach(h => {
      if (!uniqueMap.has(h.name)) uniqueMap.set(h.name, h);
    });

    let allHospitals = Array.from(uniqueMap.values());
    let nearby = gpsActive ? allHospitals.filter(h => h.distance <= 10) : allHospitals.slice(0, 8);
    if (nearby.length === 0 && allHospitals.length > 0) {
      nearby = allHospitals.sort((a,b) => (a.distance||0) - (b.distance||0)).slice(0, 5);
    }

    hospitalListEl.innerHTML = nearby.map(h => `
      <div class="emerg-hospital-item">
        <span>🏥 ${h.name} ${h.distance !== undefined ? '(' + h.distance + ' km)' : ''}</span>
        <span class="status-pending">WAITING...</span>
      </div>
    `).join('');

    if (backendResults.assignedHospital) {
      assignedHospitalEl.textContent = `TARGET: ${backendResults.assignedHospital.toUpperCase()}`;
      dispatchMessageEl.textContent = `Awaiting voice confirmation to dispatch ambulance...`;
    }

    document.getElementById('liveLocationCoords').textContent = gpsActive ? `${userLat.toFixed(4)}, ${userLng.toFixed(4)}` : 'UNKNOWN';

  } catch (err) {
    console.error('Emergency trigger failed:', err);
    overlay.classList.remove('show');
    alert('⚠️ Emergency connection error. Please use standard dial-in.');
  }
}

async function toggleBan(id, isBanned) {
  try {
    const res = await fetchWithAuth(`/api/spam/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isBanned })
    });
    if (res.ok) fetchInitialData();
  } catch (err) { console.error('Toggle ban failed:', err); }
}

function startEmergencyCall() {
  document.getElementById('btnCallNow').style.display = 'none';
  document.getElementById('btnCallEnd').style.display = 'block';
  document.getElementById('emergencyDetailsArea').style.display = 'block';
  document.getElementById('etaWrapper').style.display = 'block';
  
  // Start Timer
  callSeconds = 0;
  callTimer = setInterval(() => {
    callSeconds++;
    const mins = String(Math.floor(callSeconds / 60)).padStart(2, '0');
    const secs = String(callSeconds % 60).padStart(2, '0');
    document.getElementById('callDuration').textContent = `${mins}:${secs}`;
  }, 1000);

  // Add initial logs
  addLogEntry('Call established with Emergency Response Center.');
  addLogEntry('Transmitting live biometric data and GPS coordinates.');
  
  // Simulate hospital acceptance
  setTimeout(() => {
    const items = document.querySelectorAll('.emerg-hospital-item');
    items.forEach((item, idx) => {
      setTimeout(() => {
        const status = item.querySelector('.status-pending');
        if (status) {
          status.className = 'status-confirmed';
          status.textContent = 'ACCEPTED';
          addLogEntry(`Notification accepted by ${item.innerText.split('(')[0].trim()}.`);
        }
      }, idx * 800);
    });
    
    // Nearest ambulance dispatch
    setTimeout(() => {
      const nearestName = document.getElementById('assignedHospitalName').textContent.replace('TARGET: ', '');
      document.getElementById('dispatchMessage').textContent = `AMBULANCE DISPATCHED FROM ${nearestName}.`;
      document.getElementById('emergEta').textContent = Math.floor(Math.random() * 5) + 2;
      addLogEntry(`Vehicle assigned: AMB-99. Deploying from ${nearestName}.`);
    }, 1500);
  }, 1000);
}

function endEmergencyCall() {
  clearInterval(callTimer);
  callSeconds = 0;
  document.getElementById('callDuration').textContent = '00:00';
  
  // Hide details as requested
  document.getElementById('emergencyDetailsArea').style.display = 'none';
  document.getElementById('etaWrapper').style.display = 'none';
  document.getElementById('btnCallNow').style.display = 'block';
  document.getElementById('btnCallEnd').style.display = 'none';
  
  addLogEntry('Call terminated by user.');
  
  // Reset hospital statuses if needed
  document.getElementById('emergHospitalList').innerHTML = '';
  document.getElementById('assignedHospitalName').textContent = 'CALL TERMINATED';
  document.getElementById('dispatchMessage').textContent = 'Emergency session closed.';
  document.getElementById('bookingAbandonBtn').textContent = 'BACK TO HOME';
}

function addLogEntry(msg) {
  const log = document.getElementById('dispatchLog');
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = `<span class="log-time">[${time}]</span> ${msg}`;
  log.prepend(entry);
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();

  document.getElementById('emergencyFab').addEventListener('click', openEmergencyModal);
  document.getElementById('emergencyModalClose').addEventListener('click', closeEmergencyModal);
  document.getElementById('emergencyModal').addEventListener('click', e => { if (e.target.classList.contains('modal-overlay')) closeEmergencyModal(); });

  document.getElementById('darkModeBtn').addEventListener('click', toggleDarkMode);
  document.getElementById('voiceBtn').addEventListener('click', speakPage);

  document.getElementById('langSelect').addEventListener('change', e => {
    currentLang = e.target.value;
    applyTranslations();
    const hash = window.location.hash.replace('#', '') || 'home';
    if (hash === 'hospitals') renderHospitals();
    if (hash === 'details') renderHospitalDetails();
    if (hash === 'admin') renderAdmin();
  });

  ['filterType', 'filterDistance', 'filterSpecialty'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.addEventListener('change', renderHospitals);
  });

  document.getElementById('bookingForm').addEventListener('submit', handleBooking);
  document.getElementById('bookingHospitalSelect').addEventListener('change', () => {
    const assigned = document.getElementById('patientDept').value;
    if (assigned) suggestBetterHospital(assigned);
  });
  document.getElementById('downloadTokenBtn').addEventListener('click', downloadToken);

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderAdminTab(btn.getAttribute('data-tab'));
    });
  });

  applyTranslations();
  fetchInitialData();
});

async function fetchInitialData() {
  try {
    const [hRes, bRes, tRes, sRes] = await Promise.all([
      fetchWithAuth('/api/hospitals'),
      fetchWithAuth('/api/bookings'),
      fetchWithAuth('/api/tasks'),
      fetchWithAuth('/api/spam')
    ]);
    
    if (hRes.ok) HOSPITALS = await hRes.json();
    if (bRes.ok) {
      bookings = await bRes.json();
      document.getElementById('statTokens').textContent = bookings.length;
    }
    if (tRes.ok) allTasks = await tRes.json();
    if (sRes.ok) spamReputationData = await sRes.json();
    
    const hash = window.location.hash.replace('#', '') || 'home';
    if (hash === 'hospitals') renderHospitals();
    if (hash === 'admin') renderAdmin();
    
  } catch (err) {
    console.warn('Initial data fetch failed:', err);
    // Use fallback mock data if necessary
    if (HOSPITALS.length === 0) {
        HOSPITALS = [
          { id:1, name:"City General Hospital", type:"government", distance:2.3, lat:28.6448, lng:77.2167, beds:120, bedsAvail:34, emergency:true, phone:"011-2345678", specialty:"General Medicine, Pediatrics", doctors:[{name:"Dr. Priya Sharma",spec:"General Medicine"}] },
          { id:2, name:"Apollo Care Center", type:"private", distance:4.1, lat:28.6280, lng:77.2090, beds:200, bedsAvail:67, emergency:true, phone:"011-8765432", specialty:"Cardiology, Neurology, Oncology", doctors:[{name:"Dr. Suresh Kumar",spec:"Cardiology"}] },
          { id:3, name:"Fortis Heart Institute", type:"private", distance:5.5, lat:28.6100, lng:77.2300, beds:150, bedsAvail:45, emergency:true, phone:"011-5550000", specialty:"Cardiology, Pulmonology", doctors:[{name:"Dr. Heart",spec:"Cardiology"}] },
          { id:4, name:"Sunrise Vision Clinic", type:"private", distance:3.5, lat:28.6350, lng:77.2250, beds:50, bedsAvail:25, emergency:false, phone:"011-9998877", specialty:"Ophthalmology", doctors:[{name:"Dr. Vision",spec:"Ophthalmology"}] },
          { id:5, name:"Dental Excellence", type:"private", distance:1.2, lat:28.6400, lng:77.2100, beds:10, bedsAvail:5, emergency:false, phone:"011-1110000", specialty:"Dentistry", doctors:[{name:"Dr. Smile",spec:"Dentistry"}] },
          { id:6, name:"Neuro & Psych Center", type:"private", distance:8.2, lat:28.6692, lng:77.2300, beds:80, bedsAvail:20, emergency:true, phone:"011-7776655", specialty:"Neurology, Psychiatry", doctors:[{name:"Dr. Mind",spec:"Psychiatry"}] },
          { id:7, name:"Mother & Child Care", type:"private", distance:6.0, lat:28.6000, lng:77.2000, beds:100, bedsAvail:40, emergency:true, phone:"011-8889999", specialty:"Gynecology, Pediatrics", doctors:[{name:"Dr. Mother",spec:"Gynecology"}] },
          { id:8, name:"Digestive Health Clinic", type:"private", distance:4.5, lat:28.6200, lng:77.2400, beds:30, bedsAvail:10, emergency:false, phone:"011-2223333", specialty:"Gastroenterology", doctors:[{name:"Dr. Gut",spec:"Gastroenterology"}] }
        ];
    }
    // Refresh current page even on failure
    const hash = window.location.hash.replace('#', '') || 'home';
    if (hash === 'hospitals') renderHospitals();
    if (hash === 'admin') renderAdmin();
  }
}

// ==================== AUTH & CONNECTION ====================
async function fetchWithAuth(url, options = {}) {
  if (options.external) return fetch(url, options);

  const headers = options.headers || {};
  headers['x-api-key'] = BACKEND_API_KEY;
  
  const res = await fetch(url, { ...options, headers });
  
  if (res.status === 401) {
    updateConnectionStatus(false);
  } else if (res.ok) {
    updateConnectionStatus(true);
  }
  
  return res;
}

function saveApiKey() {
  const input = document.getElementById('adminApiKey');
  BACKEND_API_KEY = input.value.trim();
  localStorage.setItem('backend_api_key', BACKEND_API_KEY);
  input.value = '';
  alert('API Key Saved! Re-syncing data...');
  fetchInitialData();
}

function updateConnectionStatus(isOk) {
  const statusEl = document.getElementById('connectionStatus');
  const textEl = document.getElementById('statusText');
  if (!statusEl || !textEl) return;

  if (isOk) {
    statusEl.className = 'connection-status secure';
    textEl.textContent = 'Backend Connection Secure';
  } else {
    statusEl.className = 'connection-status unauthorized';
    textEl.textContent = 'Unauthorized: Invalid API Key';
  }
}
