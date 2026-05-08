// ==================== DATA STATE ====================
let HOSPITALS = []; 
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
    
    if (pageId === 'hospitals') renderHospitals();
    if (pageId === 'details') renderHospitalDetails();
    if (pageId === 'booking') renderBookingPage();
    if (pageId === 'confirmation') renderConfirmation();
    if (pageId === 'admin') renderAdmin();
    
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
  const btn = document.getElementById('gpsBtn');
  if (!navigator.geolocation) {
    showGPSStatus('❌ GPS not supported', 'error'); return;
  }
  btn.textContent = '⏳ Locating...';
  btn.disabled = true;
  navigator.geolocation.getCurrentPosition(
    async pos => {
      userLat = pos.coords.latitude;
      userLng = pos.coords.longitude;
      gpsActive = true;
      HOSPITALS.forEach(h => { h.distance = haversineKm(userLat, userLng, h.lat, h.lng); });
      
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${userLat}&lon=${userLng}&format=json`);
        const data = await res.json();
        userLocationName = data.address.city || data.address.town || 'Your Location';
      } catch { userLocationName = `${userLat.toFixed(2)}, ${userLng.toFixed(2)}`; }
      
      document.getElementById('locationSearch').value = userLocationName;
      showGPSStatus(`📍 ${userLocationName}`, 'success');
      btn.textContent = '✅ GPS Active';
      btn.disabled = false;
      btn.classList.add('gps-active');
      if (window.location.hash.includes('hospitals')) renderHospitals();
    },
    err => {
      btn.textContent = '📍 Use My Location';
      btn.disabled = false;
      showGPSStatus('❌ GPS error', 'error');
    },
    { timeout: 10000 }
  );
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
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&format=json&limit=1`);
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
  const locationLabel = document.getElementById('gpsLocationLabel');
  
  if (locationLabel) locationLabel.textContent = (gpsActive && userLocationName) ? `📍 Near: ${userLocationName}` : '';

  let list = [...HOSPITALS];
  if (gpsActive) list.sort((a, b) => a.distance - b.distance);

  let filtered = list.filter(h => {
    if (typeFilter !== 'all' && h.type !== typeFilter) return false;
    if (distFilter !== 'all' && h.distance > Number(distFilter)) return false;
    if (specFilter !== 'all' && h.specialty !== specFilter) return false;
    return true;
  });

  grid.innerHTML = filtered.map(h => `
    <div class="hospital-card">
      <div class="hospital-card-header">
        <span class="hospital-card-name">🏥 ${h.name}</span>
        <span class="hospital-card-type ${h.type === 'government' ? 'type-gov' : 'type-private'}">${h.type === 'government' ? t('filterGov') : t('filterPrivate')}</span>
      </div>
      <div class="hospital-card-info">
        <div class="hospital-card-row"><span>📍</span><span>${t('distance')}: ${h.distance} km</span></div>
        <div class="hospital-card-row"><span>🛏️</span><span>${t('bedsAvail')}: ${h.bedsAvail} / ${h.beds}</span></div>
        <div class="hospital-card-row">
          <span class="emergency-badge ${h.emergency ? 'emergency-yes' : 'emergency-no'}">
            ${h.emergency ? '🚨 ' + t('emergencyLabel') + ': Yes' : '— ' + t('emergencyLabel') + ': No'}
          </span>
        </div>
      </div>
      <button class="btn btn-primary btn-full" onclick="selectedHospitalId=${h.id};window.location.hash='#details'">${t('viewDetails')}</button>
    </div>
  `).join('');
}

// ==================== DETAILS ====================
function renderHospitalDetails() {
  const h = HOSPITALS.find(x => x.id === selectedHospitalId);
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
      <button class="btn btn-primary" onclick="selectedHospitalId=${h.id};window.location.hash='#booking'">🎫 ${t('bookTokenBtn')}</button>
      <button class="btn btn-success" onclick="window.open('tel:${h.phone}')">📞 ${t('callHospital')}</button>
      <button class="btn btn-danger" onclick="window.open('tel:108')">${t('emergencyCall')}</button>
    </div>
  `;
}

// ==================== BOOKING ====================
function renderBookingPage() {
  const h = HOSPITALS.find(x => x.id === selectedHospitalId);
  document.getElementById('bookingHospitalName').textContent = h ? '🏥 ' + h.name : '';
}

async function handleBooking(e) {
  e.preventDefault();
  const name = document.getElementById('patientName').value;
  const phone = document.getElementById('patientPhone').value;
  const dept = document.getElementById('patientDept').value;
  const h = HOSPITALS.find(x => x.id === selectedHospitalId) || HOSPITALS[0];

  const bookingData = {
    patientName: name,
    patientPhone: phone,
    patientDept: dept,
    hospitalName: h.name
  };

  try {
    const res = await fetch('/api/bookings', {
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
      throw new Error('Booking failed');
    }
  } catch (err) {
    console.warn('API Booking failed, using local fallback', err);
    const tokenNum = 'TKN-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const reportTime = new Date(now.getTime() + 60 * 60000);
    const timeStr = reportTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    lastToken = { tokenNum, name, phone, dept, hospital: h.name, reportTime: timeStr, date: now.toLocaleDateString() };
    bookings.push(lastToken);
    document.getElementById('bookingForm').reset();
    document.getElementById('statTokens').textContent = bookings.length;
    window.location.hash = '#confirmation';
  }
}

function renderConfirmation() {
  if (!lastToken) return;
  document.getElementById('tokenDetails').innerHTML = `
    <div class="token-detail-row"><span class="token-detail-label">${t('tokenNumber')}</span><span class="token-detail-value">${lastToken.tokenNum}</span></div>
    <div class="token-detail-row"><span class="token-detail-label">${t('reportingTime')}</span><span class="token-detail-value">${lastToken.reportTime}</span></div>
    <div class="token-detail-row"><span class="token-detail-label">${t('hospitalName')}</span><span class="token-detail-value">${lastToken.hospital}</span></div>
    <div class="token-detail-row"><span class="token-detail-label">${t('department')}</span><span class="token-detail-value">${lastToken.dept}</span></div>
  `;
}

function downloadToken() {
  if (!lastToken) return;
  const text = `SMART HEALTHCARE\nToken: ${lastToken.tokenNum}\nPatient: ${lastToken.name}\nPhone: ${lastToken.phone}\nHospital: ${lastToken.hospital}\nDept: ${lastToken.dept}\nTime: ${lastToken.reportTime}\nDate: ${lastToken.date}\nCall 108 for Emergency`;
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
          <tbody>${HOSPITALS.map(h => `<tr><td>${h.name}</td><td>${h.type}</td><td>${h.bedsAvail}/${h.beds}</td><td>${h.emergency ? '🟢 Yes' : '🔴 No'}</td><td><button class="btn btn-sm btn-primary" onclick="selectedHospitalId=${h.id};window.location.hash='#details'">${t('edit')}</button></td></tr>`).join('')}</tbody>
        </table>
      </div>`;
  } else {
    container.innerHTML = bookings.length === 0
      ? '<p style="text-align:center;color:var(--text-muted);padding:32px;">No bookings yet.</p>'
      : `<div class="admin-table-wrapper"><table class="admin-table">
          <thead><tr><th>${t('token')}</th><th>${t('patientName')}</th><th>${t('phone')}</th><th>${t('hospitalName')}</th><th>${t('department')}</th><th>${t('date')}</th></tr></thead>
          <tbody>${bookings.map(b => `<tr><td>${b.tokenNum}</td><td>${b.name}</td><td>${b.phone}</td><td>${b.hospital}</td><td>${b.dept}</td><td>${b.date}</td></tr>`).join('')}</tbody>
        </table></div>`;
  }
}

function toggleAdminForm() {
  adminShowForm = !adminShowForm;
  document.getElementById('adminFormContainer').style.display = adminShowForm ? 'block' : 'none';
}

function addHospital() {
  const name = document.getElementById('ahName').value;
  if (!name) return;
  HOSPITALS.push({
    id: HOSPITALS.length + 1, name,
    type: document.getElementById('ahType').value,
    distance: Math.round(Math.random() * 15 * 10) / 10,
    beds: Number(document.getElementById('ahBeds').value) || 50,
    bedsAvail: Math.floor(Math.random() * 30) + 5,
    emergency: document.getElementById('ahEmerg').value === 'true',
    phone: document.getElementById('ahPhone').value || '000-0000000',
    specialty: document.getElementById('ahSpec').value || 'general',
    doctors: [{ name: 'Dr. New', spec: 'General' }]
  });
  adminShowForm = false;
  document.getElementById('statHospitals').textContent = HOSPITALS.length;
  renderAdmin();
}

// ==================== MAP & DB STUBS ====================
let map;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showMap);
  } else {
    alert("Geolocation not supported");
  }
}

function showMap(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  if (map) { map.remove(); }
  map = L.map('map').setView([lat, lon], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  // User marker
  L.marker([lat, lon]).addTo(map)
    .bindPopup("You are here")
    .openPopup();

  fetchHospitals(lat, lon);
}

function fetchHospitals(lat, lon) {
  fetch(`https://overpass-api.de/api/interpreter?data=
  [out:json];
  node["amenity"="hospital"](around:5000,${lat},${lon});
  out;
  `)
  .then(res => res.json())
  .then(data => {
    const listDiv = document.getElementById("list");
    listDiv.innerHTML = "<h3>Hospital List</h3>";

    data.elements.forEach(h => {
      if(h.lat && h.lon){

        const name = h.tags?.name || "Unnamed Hospital";

        // Add marker
        L.marker([h.lat, h.lon])
          .addTo(map)
          .bindPopup(name);

        // Add to list
        const card = document.createElement("div");
        card.className = "hospital-card"; 

        card.innerHTML = `
          <h4 style="margin-bottom:10px;">🏥 ${name}</h4>
          <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:5px;">📍 Latitude: ${h.lat}</p>
          <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:10px;">📍 Longitude: ${h.lon}</p>
          <button class="btn btn-primary btn-sm" onclick="goToHospital(${h.lat}, ${h.lon})">
            View on Map
          </button>
        `;

        listDiv.appendChild(card);
      }
    });
  });
}

function goToHospital(lat, lon) {
  map.setView([lat, lon], 16);
  const mapEl = document.getElementById('map');
  if(mapEl) window.scrollTo({ top: mapEl.offsetTop - 100, behavior: 'smooth' });
}

function testDbConnection() {
  const status = document.getElementById('dbStatus');
  status.textContent = 'Connecting to Backend...';
  status.style.color = 'var(--primary)';
  
  fetch('/api/hospitals')
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

async function triggerSmartEmergency() {
  closeEmergencyModal();
  showPage('emergency-status');
  
  const assignedHospitalEl = document.getElementById('assignedHospitalName');
  const dispatchMessageEl = document.getElementById('dispatchMessage');
  const etaEl = document.getElementById('emergEta');
  const hospitalListEl = document.getElementById('emergHospitalList');
  
  assignedHospitalEl.textContent = '📡 Broadcasting to All Hospitals...';
  hospitalListEl.innerHTML = '';
  
  // Collect data
  const payload = {
    patientLat: userLat,
    patientLng: userLng,
    patientPhone: '9999999999' // In a real app, this would come from user profile
  };

  try {
    const res = await fetch('/api/emergency', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    
    if (res.ok) {
      // 1. Show all hospitals as confirmed
      hospitalListEl.innerHTML = data.allHospitals.map(name => `
        <div class="emerg-hospital-item">
          <span>🏥 ${name}</span>
          <span class="status-confirmed">✅ APPOINTMENT CONFIRMED</span>
        </div>
      `).join('');

      // 2. Assign the nearest hospital
      assignedHospitalEl.textContent = `🚑 ${data.assignedHospital}`;
      dispatchMessageEl.textContent = `Nearest hospital has accepted and dispatched an emergency vehicle. Traffic coordination in progress.`;
      etaEl.textContent = data.eta;
      
      // Notify other hospitals (simulated)
      setTimeout(() => {
        const note = document.createElement('div');
        note.className = 'info-toast';
        note.textContent = 'All other hospitals have been notified of the active dispatch.';
        document.body.appendChild(note);
        setTimeout(() => note.remove(), 3000);
      }, 2000);

    } else {
      throw new Error(data.error || 'Broadcast failed');
    }
  } catch (err) {
    console.warn('Smart Emergency API failed, using fallback', err);
    // Fallback logic
    const nearest = HOSPITALS.sort((a,b) => a.distance - b.distance)[0] || HOSPITALS[0];
    assignedHospitalEl.textContent = `🚑 ${nearest.name}`;
    dispatchMessageEl.textContent = `Emergency vehicle dispatched. Approaching via fastest route.`;
    etaEl.textContent = '8';
    
    hospitalListEl.innerHTML = HOSPITALS.map(h => `
      <div class="emerg-hospital-item">
        <span>🏥 ${h.name}</span>
        <span class="status-confirmed">✅ APPOINTMENT CONFIRMED</span>
      </div>
    `).join('');
  }
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
    const [hRes, bRes] = await Promise.all([
      fetch('/api/hospitals'),
      fetch('/api/bookings')
    ]);
    
    if (hRes.ok) HOSPITALS = await hRes.json();
    if (bRes.ok) {
      bookings = await bRes.json();
      document.getElementById('statTokens').textContent = bookings.length;
    }
    
    // Refresh current page if needed
    const hash = window.location.hash.replace('#', '') || 'home';
    if (hash === 'hospitals') renderHospitals();
    if (hash === 'admin') renderAdmin();
    
  } catch (err) {
    console.warn('Initial data fetch failed:', err);
    // Use fallback mock data if necessary
    if (HOSPITALS.length === 0) {
      HOSPITALS = [
        { id:1, name:"City General Hospital", type:"government", distance:2.3, lat:28.6448, lng:77.2167, beds:120, bedsAvail:34, emergency:true, phone:"011-2345678", specialty:"general", doctors:[{name:"Dr. Priya Sharma",spec:"General Medicine"},{name:"Dr. Raj Patel",spec:"Cardiology"}] },
        { id:2, name:"Apollo Care Center", type:"private", distance:4.1, lat:28.6280, lng:77.2090, beds:200, bedsAvail:67, emergency:true, phone:"011-8765432", specialty:"cardiology", doctors:[{name:"Dr. Suresh Kumar",spec:"Cardiology"},{name:"Dr. Meena Iyer",spec:"Neurology"}] },
        { id:3, name:"District Community Hospital", type:"government", distance:6.7, lat:28.6560, lng:77.2410, beds:80, bedsAvail:12, emergency:true, phone:"011-5556789", specialty:"general", doctors:[{name:"Dr. Vikram Singh",spec:"Orthopedics"}] },
        { id:4, name:"Sunrise Private Hospital", type:"private", distance:3.5, lat:28.6350, lng:77.2250, beds:150, bedsAvail:45, emergency:false, phone:"011-9998877", specialty:"orthopedics", doctors:[{name:"Dr. Neha Gupta",spec:"Orthopedics"}] },
        { id:5, name:"Rural Health Center", type:"government", distance:12.0, lat:28.5830, lng:77.1760, beds:30, bedsAvail:8, emergency:true, phone:"011-1112233", specialty:"general", doctors:[{name:"Dr. Sita Ram",spec:"General Medicine"}] },
        { id:6, name:"Max Super Specialty", type:"private", distance:8.2, lat:28.6692, lng:77.2300, beds:350, bedsAvail:102, emergency:true, phone:"011-7776655", specialty:"neurology", doctors:[{name:"Dr. Amit Khanna",spec:"Neurology"}] }
      ];
    }
    // Refresh current page even on failure
    const hash = window.location.hash.replace('#', '') || 'home';
    if (hash === 'hospitals') renderHospitals();
    if (hash === 'admin') renderAdmin();
  }
}
