import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { partyAPI, eventsAPI } from '../services/api';
import CountdownTimer from '../components/CountdownTimer';
import SpinWin from '../components/SpinWin';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTshirt, FaUtensils, FaCheckCircle, FaQrcode, FaMusic, FaCamera, FaDice, FaTrophy, FaGamepad } from 'react-icons/fa';
import { motion } from 'framer-motion';

const djSongsByLanguage = {
  en: [
    { id: '7gHs73wELdeycvS48JfIos', title: '🎧 Alan Walker – Faded', type: 'faded' },
    { id: '20uYAdCEoIkSZStIfPW1TB', title: '🎸 Guns N\' Roses – Sweet Child O\' Mine', type: 'sweet' },
    { id: '5O2P9iiztwhomNh8xkR9lJ', title: '🎹 One Direction – Night Changes', type: 'night_changes' },
    { id: '0jY618wuln0b5b8sCxFgjk', title: '🎶 Jung Kook – Dreamers (FIFA World Cup)', type: 'dreamers' },
    { id: '7qiZfU4dY1lWllzX7mPBI3', title: '✨ Ed Sheeran – Shape of You', type: 'shape_of_you' }
  ],
  hi: [
    { id: '6VBhH7CyP56BXjp8VsDFPZ', title: '💖 Pritam & Arijit Singh – Kesariya', type: 'kesariya' },
    { id: '5PUXKVVVQ74C3gl5vKy9Li', title: '😭 Jasleen Royal & Arijit Singh – Heeriye', type: 'heeriye' },
    { id: '5zCnGtCl5Ac5zlFHXaZmhy', title: '🎈 Arijit Singh – Sajni', type: 'sajni' },
    { id: '0lp3WWhjxFVUht81AQmWX8', title: '🌻 Zoha Waseem & Sheheryar Rehan – Majboor', type: 'majboor' },
    { id: '65dt1vedDHPOCCPS3mVhtN', title: '🔥 Ed Sheeran & Arijit Singh – Sapphire', type: 'sapphire' }
  ],
  ta: [
    { id: '4yur1GSBfuS1VADyUYocqd', title: '🕺 Sai Abhyankkar & Shruti Haasan – Pavazha Malli', type: 'pavazha_malli' },
    { id: '0MTdYgTZ25sLCO6kVnDoje', title: '🔥 Sai Abhyankkar & Sai Smriti – Aasa Kooda', type: 'aasa_kooda' },
    { id: '3GNlsHDf3OH7V3LgccGAFc', title: '💃 G. V. Prakash & Ken Karunaas – Mutta Kalakki', type: 'mutta_kalakki' },
    { id: '2iG9pZ6bkfVqXzjuax7J8Z', title: '👑 Sai Abhyankkar & Pradeep Ranganathan – Singari', type: 'singari' }
  ],
  te: [
    { id: '7GS9ZIE8RjI4wYPcS6BQnt', title: '🥁 A.R. Rahman & Vishal Mishra – Massa Massa', type: 'massa_massa' },
    { id: '41GTIflnHCWqHgYq7israx', title: '🔥 A.R. Rahman & Mohit Chauhan – Chikiri Chikiri', type: 'chikiri_chikiri' },
    { id: '544e9hW6ojayi4ir5DufOK', title: '🌶️ Santosh Narayanan & Chinmayi – Thassadiya', type: 'thassadiya' },
    { id: '4vq7KUT7qvqw9owOCtEyKx', title: '💖 Pranav Das – Kudarame', type: 'kudarame_te' }
  ],
  ml: [
    { id: '4vq7KUT7qvqw9owOCtEyKx', title: '🍃 Pranav Das – Kudarame', type: 'kudarame_ml' },
    { id: '1T2BaoynY8mttTMb6t51gF', title: '✨ Justin Prabhakaran & Shakthisree Gopalan – Puthu Mazha', type: 'puthu_mazha' },
    { id: '0ZdCs8N8qF5bBozuOGH56r', title: '🎉 M.H.R & JOKER390P – Kinginichar', type: 'kinginichar' },
    { id: '12wlJpuAbgMv0OaYmY3r5x', title: '🔥 Jakes Bejoy – Pala Palli', type: 'pala_palli' }
  ]
};

const djPlaylistNames = {
  en: "English DJ Playlist",
  ta: "தமிழ் (Tamil) DJ Playlist",
  te: "తెలుగు (Telugu) DJ Playlist",
  ml: "മലയാളം (Malayalam) DJ Playlist",
  hi: "हिंदी (Hindi) DJ Playlist"
};

const FreshersPartyPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { t, language } = useLanguage();
  const [partyEvent, setPartyEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registration, setRegistration] = useState(null);
  const [foodPref, setFoodPref] = useState('veg');
  const [tshirtSize, setTshirtSize] = useState('M');
  const [msg, setMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Dynamic Highlight Activity details
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [djVotes, setDjVotes] = useState({ EDM: 142, Rock: 85, Pop: 110, HipHop: 95 });
  const [hasVoted, setHasVoted] = useState(false);
  const [icebreaker, setIcebreaker] = useState("Click the button below to roll a funny question!");
  const [polaroidText, setPolaroidText] = useState("Besties 💖");
  const [polaroidFrame, setPolaroidFrame] = useState("#FFFFFF");

  // GDG Campus Quest Scavenger Hunt state
  const [questStep, setQuestStep] = useState(0); // 0: start, 1..3: riddles, 4: complete
  const [questScore, setQuestScore] = useState(0);
  const [questFeedback, setQuestFeedback] = useState("");
  
  // Campus Persona state
  const [personaStep, setPersonaStep] = useState(0); // 0: start, 1..4: questions, 5: result
  const [personaAnswers, setPersonaAnswers] = useState([]);
  const [personaResult, setPersonaResult] = useState(null);

  const [activeSpotifyTrackId, setActiveSpotifyTrackId] = useState(null);

  const [favoriteSongs, setFavoriteSongs] = useState(() => {
    try {
      const stored = localStorage.getItem('freshers_dj_favorites');
      return stored ? JSON.parse(stored) : ['Alan Walker – Faded', 'Travis Scott – FE!N / Sicko Mode'];
    } catch {
      return ['Alan Walker – Faded', 'Travis Scott – FE!N / Sicko Mode'];
    }
  });

  const toggleFavoriteSong = async (title, e) => {
    if (e) e.stopPropagation();
    let updated;
    if (favoriteSongs.includes(title)) {
      updated = favoriteSongs.filter(s => s !== title);
    } else {
      updated = [...favoriteSongs, title];
      try {
        await partyAPI.saveWishlist(title);
      } catch (err) {
        console.error("Failed to save wishlist item:", err);
      }
    }
    setFavoriteSongs(updated);
    localStorage.setItem('freshers_dj_favorites', JSON.stringify(updated));
  };

  const [currentSong, setCurrentSong] = useState(null);
  const [activeCtx, setActiveCtx] = useState(null);

  const stopSongTrack = () => {
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    if (activeCtx) {
      try { activeCtx.close(); } catch (e) {}
      setActiveCtx(null);
    }
    setCurrentSong(null);
    setActiveSpotifyTrackId(null);
  };

  const singSongLyrics = (type, title) => {
    stopSongTrack();

    setCurrentSong(title);

    let lyricsText = "";
    let pitch = 1.0;
    let rate = 1.0;

    if (type === 'faded') {
      lyricsText = "Where are you now? Where are you now? Was it all in my fantasy? You were the shadow to my light, I'm faded!";
      pitch = 1.25;
      rate = 0.95;
    } else if (type === 'sweet') {
      lyricsText = "She's got a smile that it seems to me, reminds me of childhood memories! Sweet child o' mine!";
      pitch = 1.15;
      rate = 1.05;
    } else if (type === 'levitating') {
      lyricsText = "If you wanna run away with me, I know a galaxy, and I can take you for a ride! You want me, I want you, baby! My sugarboo, I'm levitating!";
      pitch = 1.35;
      rate = 1.1;
    } else if (type === 'fein') {
      lyricsText = "Fein! Fein! Fein! Fein! Fein! Sun is down, freezin' cold! Fein! Fein!";
      pitch = 0.8;
      rate = 1.2;
    } else if (type === 'animals') {
      lyricsText = "We are the fucking Animals! 3, 2, 1, Drop the beat!";
      pitch = 0.95;
      rate = 1.0;
    } else if (type === 'godsplan') {
      lyricsText = "She say, 'Do you love me?' I tell her, 'Only partly, I only love my bed and my mama, I'm sorry!' God's plan, God's plan!";
      pitch = 1.05;
      rate = 1.0;
    }

    // Start instrumental background synth
    playSongTrack(type, title);

    // Sing lyrics out loud with SpeechSynthesis
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(lyricsText);
      utterance.pitch = pitch;
      utterance.rate = rate;
      utterance.volume = 1.0;

      const voices = synth.getVoices();
      const voice = voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('David') || v.name.includes('Zira')));
      if (voice) {
        utterance.voice = voice;
      }

      synth.speak(utterance);
    }
  };

  const playSongTrack = (type, title) => {
    stopSongTrack();

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    try {
      const ctx = new AudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      setActiveCtx(ctx);
      setCurrentSong(title);

      const now = ctx.currentTime;
      const notes = {
        C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
        C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
        C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.00
      };

      let sequence = [];
      let waveform = 'sawtooth';

      if (type === 'faded') {
        waveform = 'sine';
        sequence = [
          { note: 369.99, dur: 0.2, t: 0.0 }, { note: 440.00, dur: 0.2, t: 0.2 }, { note: 554.37, dur: 0.2, t: 0.4 }, { note: 369.99, dur: 0.2, t: 0.6 },
          { note: 293.66, dur: 0.2, t: 0.8 }, { note: 369.99, dur: 0.2, t: 1.0 }, { note: 440.00, dur: 0.2, t: 1.2 }, { note: 293.66, dur: 0.2, t: 1.4 },
          { note: 440.00, dur: 0.2, t: 1.6 }, { note: 554.37, dur: 0.2, t: 1.8 }, { note: 659.25, dur: 0.2, t: 2.0 }, { note: 440.00, dur: 0.2, t: 2.2 },
          { note: 329.63, dur: 0.2, t: 2.4 }, { note: 440.00, dur: 0.2, t: 2.6 }, { note: 554.37, dur: 0.2, t: 2.8 }, { note: 329.63, dur: 0.2, t: 3.0 }
        ];
      } else if (type === 'sweet') {
        waveform = 'sawtooth';
        sequence = [
          { note: 293.66, dur: 0.18, t: 0.0 }, { note: 587.33, dur: 0.18, t: 0.2 }, { note: 440.00, dur: 0.18, t: 0.4 }, { note: 392.00, dur: 0.18, t: 0.6 },
          { note: 783.99, dur: 0.18, t: 0.8 }, { note: 440.00, dur: 0.18, t: 1.0 }, { note: 739.99, dur: 0.18, t: 1.2 }, { note: 440.00, dur: 0.18, t: 1.4 },
          { note: 293.66, dur: 0.18, t: 1.6 }, { note: 587.33, dur: 0.18, t: 1.8 }, { note: 440.00, dur: 0.18, t: 2.0 }, { note: 392.00, dur: 0.18, t: 2.2 },
          { note: 783.99, dur: 0.18, t: 2.4 }, { note: 440.00, dur: 0.18, t: 2.6 }, { note: 739.99, dur: 0.18, t: 2.8 }, { note: 440.00, dur: 0.18, t: 3.0 }
        ];
      } else if (type === 'levitating') {
        waveform = 'triangle';
        sequence = [
          { note: 493.88, dur: 0.18, t: 0.0 }, { note: 493.88, dur: 0.18, t: 0.2 }, { note: 440.00, dur: 0.18, t: 0.4 }, { note: 369.99, dur: 0.18, t: 0.6 },
          { note: 369.99, dur: 0.18, t: 0.8 }, { note: 329.63, dur: 0.18, t: 1.0 }, { note: 293.66, dur: 0.18, t: 1.2 }, { note: 369.99, dur: 0.18, t: 1.4 },
          { note: 493.88, dur: 0.18, t: 1.6 }, { note: 493.88, dur: 0.18, t: 1.8 }, { note: 440.00, dur: 0.18, t: 2.0 }, { note: 369.99, dur: 0.18, t: 2.2 },
          { note: 369.99, dur: 0.18, t: 2.4 }, { note: 329.63, dur: 0.18, t: 2.6 }, { note: 293.66, dur: 0.18, t: 2.8 }
        ];
      } else if (type === 'fein') {
        waveform = 'square';
        sequence = [
          { note: 110.00, dur: 0.25, t: 0.0 }, { note: 110.00, dur: 0.25, t: 0.3 }, { note: 116.54, dur: 0.25, t: 0.6 }, { note: 110.00, dur: 0.25, t: 0.9 },
          { note: 440.00, dur: 0.2, t: 0.0 }, { note: 466.16, dur: 0.2, t: 0.6 }, { note: 440.00, dur: 0.2, t: 1.2 }, { note: 466.16, dur: 0.2, t: 1.8 }
        ];
      } else if (type === 'animals') {
        waveform = 'sawtooth';
        sequence = [
          { note: 349.23, dur: 0.15, t: 0.0 }, { note: 349.23, dur: 0.15, t: 0.2 }, { note: 349.23, dur: 0.15, t: 0.4 }, { note: 392.00, dur: 0.15, t: 0.6 },
          { note: 415.30, dur: 0.15, t: 0.8 }, { note: 349.23, dur: 0.15, t: 1.0 }, { note: 349.23, dur: 0.15, t: 1.2 }, { note: 349.23, dur: 0.15, t: 1.4 },
          { note: 392.00, dur: 0.15, t: 1.6 }, { note: 415.30, dur: 0.15, t: 1.8 }, { note: 466.16, dur: 0.15, t: 2.0 }, { note: 349.23, dur: 0.25, t: 2.2 }
        ];
      } else {
        waveform = 'sine';
        sequence = [
          { note: 329.63, dur: 0.25, t: 0.0 }, { note: 392.00, dur: 0.25, t: 0.3 }, { note: 440.00, dur: 0.25, t: 0.6 }, { note: 523.25, dur: 0.3, t: 0.9 },
          { note: 440.00, dur: 0.25, t: 1.3 }, { note: 392.00, dur: 0.25, t: 1.6 }, { note: 329.63, dur: 0.25, t: 1.9 }, { note: 293.66, dur: 0.35, t: 2.2 }
        ];
      }

      sequence.forEach(item => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = waveform;
        osc.frequency.setValueAtTime(item.note, now + item.t);
        
        gain.gain.setValueAtTime(0.3, now + item.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + item.t + item.dur);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + item.t);
        osc.stop(now + item.t + item.dur);
      });

      // Add drum beat pulse
      for (let t = 0; t <= 2.5; t += 0.5) {
        const kickOsc = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kickOsc.frequency.setValueAtTime(140, now + t);
        kickOsc.frequency.exponentialRampToValueAtTime(35, now + t + 0.25);
        kickGain.gain.setValueAtTime(0.4, now + t);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.25);
        
        kickOsc.connect(kickGain);
        kickGain.connect(ctx.destination);
        kickOsc.start(now + t);
        kickOsc.stop(now + t + 0.25);
      }

      setTimeout(() => {
        setCurrentSong(prev => (prev === title ? null : prev));
      }, 3200);

    } catch (e) {
      console.error('Audio play failed:', e);
    }
  };

  const rollIcebreaker = () => {
    const questions = [
      "Would you rather accidentally walk into the wrong lecture hall 10 minutes late, or have your phone ring at full volume during a mid-term exam?",
      "If you could swap bodies with any faculty advisor for a day, who would it be and why?",
      "What is your survival plan if you get lost in the Turing Block (CSE) for 3 hours?",
      "Would you rather have unlimited free coffee from the campus cafeteria, or guaranteed front-row parking for your bicycle?",
      "If you could invite one famous coder to be your partner for the welcome party dance, who would it be?",
      "What is the funniest study tip you have heard so far?"
    ];
    const rand = Math.floor(Math.random() * questions.length);
    setIcebreaker(questions[rand]);
  };

  useEffect(() => {
    const loadPartyDetails = async () => {
      try {
        const eventsRes = await eventsAPI.getAll();
        const party = eventsRes.data.find(e => e.category === 'party' || e.title.includes('Fiesta'));
        setPartyEvent(party || {
          title: "Freshers Fiesta 2026",
          description: "Join the official freshman welcome party! Get ready for live music, interactive DJ set, ice breakers, games, and a delicious buffet.",
          event_date: "2026-08-15",
          event_time: "18:00:00",
          venue: "Main Auditorium",
          coordinator: "GDG Campus Ambassador Team",
          contact: "+1-555-9000"
        });

        if (isAuthenticated) {
          const regRes = await partyAPI.getStatus();
          if (regRes.data.registered) {
            setRegistration(regRes.data.details);
            setFoodPref(regRes.data.details.food_preference);
            setTshirtSize(regRes.data.details.tshirt_size);
          }
          try {
            const wishlistRes = await partyAPI.getWishlist();
            if (wishlistRes.data && wishlistRes.data.wishlist) {
              setFavoriteSongs(prev => {
                const merged = Array.from(new Set([...prev, ...wishlistRes.data.wishlist]));
                return merged;
              });
            }
          } catch (wishErr) {
            console.error("Error loading DJ wishlist", wishErr);
          }
        }
      } catch (err) {
        console.error("Error loading party configurations", err);
      } finally {
        setLoading(false);
      }
    };
    loadPartyDetails();
  }, [isAuthenticated]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await partyAPI.register({ food_preference: foodPref, tshirt_size: tshirtSize });
      const userEmail = user?.email || 'your registered email';
      setMsg({ 
        type: 'success', 
        text: `🎟️ Entry Pass Confirmed! 📩 Official confirmation email dispatched to ${userEmail} (T-Shirt Size: ${tshirtSize}, Meal: ${foodPref.toUpperCase()})!` 
      });
      // Reload status
      const regRes = await partyAPI.getStatus();
      if (regRes?.data?.registered) {
        setRegistration(regRes.data.details);
        setFoodPref(regRes.data.details.food_preference);
        setTshirtSize(regRes.data.details.tshirt_size);
      }
      setIsEditing(false);
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Failed to register.' });
    }
  };

  const uploadBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '/uploads') || 'http://localhost:5000/uploads';

  return (
    <div className="container py-4">
      {/* Banner */}
      <div className="glass-card mb-4 overflow-hidden border-0 bg-white">
        <div className="row g-0 align-items-center">
          <div className="col-lg-7 p-5">
            <span className="badge-gdg mb-3">OFFICIAL EVENT</span>
            <h1 className="fw-extrabold text-gradient display-4 mb-2">{t('party_title')}</h1>
            <p className="text-secondary mb-4 lead">
              {t('party_sub')}
            </p>
            <p className="text-muted small">
              {t('party_desc_text')}
            </p>
          </div>
          <div className="col-lg-5 p-2 d-flex justify-content-center">
            <div className="glass-card p-2 w-100 overflow-hidden d-flex align-items-center justify-content-center" style={{ border: 'none', background: 'transparent' }}>
              <img 
                src="/freshers_fiesta_2026.png" 
                alt="Freshers Fiesta 2026 Poster" 
                className="img-fluid rounded-4 shadow-sm" 
                style={{ maxHeight: '420px', width: 'auto', objectFit: 'contain' }}
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=80' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="glass-card p-4 text-center mb-5 bg-white border-0">
        <h5 className="fw-bold text-dark mb-3">Fiesta Ticking Countdown</h5>
        <CountdownTimer targetDate="2026-08-15T18:00:00" />
      </div>

      <div className="row g-4 mb-5">
        {/* Registration Panel */}
        <div className="col-lg-6">
          <div className="glass-card p-4 h-100 bg-white border-0">
            <h4 className="fw-bold text-dark mb-3">Fiesta Entrance Pass</h4>
            
            {msg && <div className={`alert alert-${msg.type} rounded-3 small`}>{msg.text}</div>}

            {!isAuthenticated ? (
              <div className="text-center py-5">
                <p className="text-secondary">Please sign in to register for the Welcome Party and get your entry QR Code.</p>
                <a href="/login" className="btn btn-gradient px-4 rounded-pill mt-2">Sign In to Register</a>
              </div>
            ) : registration && !isEditing ? (
              <div className="text-center p-4 bg-light rounded-4 border">
                <FaCheckCircle className="text-success fs-1 mb-3" />
                <h5 className="fw-bold text-dark mb-1">Registration Complete!</h5>
                <span className="text-secondary small d-block">You are officially listed for the Freshers Fiesta 2026.</span>

                {/* QR Code Container */}
                <div className="my-4 p-3 bg-white d-inline-block rounded-3 border">
                  <FaQrcode size={150} className="text-dark" />
                  <span className="d-block mt-2 font-monospace fw-bold text-muted" style={{ fontSize: '0.75rem' }}>{registration.qr_code}</span>
                </div>

                <div className="row g-2 text-start mt-2">
                  <div className="col-6 bg-white p-3 rounded-3 border">
                    <span className="text-muted d-block small" style={{ fontSize: '0.65rem' }}>FOOD PREFERENCE</span>
                    <strong className="text-dark text-capitalize">{registration.food_preference}</strong>
                  </div>
                  <div className="col-6 bg-white p-3 rounded-3 border">
                    <span className="text-muted d-block small" style={{ fontSize: '0.65rem' }}>T-SHIRT SIZE</span>
                    <strong className="text-dark">{registration.tshirt_size}</strong>
                  </div>
                </div>

                <button onClick={() => setIsEditing(true)} className="btn btn-outline-primary w-100 rounded-pill mt-4 border-2 small fw-semibold">
                  Edit Registration Details
                </button>

                <p className="text-secondary small mt-4 mb-0">
                  Please keep this QR Code ready on your phone at the Auditorium gate. Presenting your physical student ID is also required.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegister}>
                <p className="text-secondary small mb-4">
                  Fill in your details below to confirm attendance, reserve a free custom merchandise T-shirt, and specify food options.
                </p>
                
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary small d-flex align-items-center gap-1"><FaUtensils /> Dinner Catering Choice</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="food" id="veg" value="veg" checked={foodPref === 'veg'} onChange={() => setFoodPref('veg')} />
                      <label className="form-check-label text-dark small" htmlFor="veg">Vegetarian Dinner Box</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="food" id="nonveg" value="non-veg" checked={foodPref === 'non-veg'} onChange={() => setFoodPref('non-veg')} />
                      <label className="form-check-label text-dark small" htmlFor="nonveg">Non-Vegetarian Dinner Box</label>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary small d-flex align-items-center gap-1"><FaTshirt /> Free Souvenir T-Shirt Size</label>
                  <select className="form-select bg-light border-0 p-3 small text-dark" value={tshirtSize} onChange={(e) => setTshirtSize(e.target.value)}>
                    <option value="XS">Extra Small (XS)</option>
                    <option value="S">Small (S)</option>
                    <option value="M">Medium (M)</option>
                    <option value="L">Large (L)</option>
                    <option value="XL">Extra Large (XL)</option>
                    <option value="XXL">Double Extra Large (XXL)</option>
                    <option value="XXXL">Triple Extra Large (XXXL)</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-gradient w-100 py-3 rounded-pill shadow-none">
                  {isEditing ? 'Save Changes' : 'Generate Entry Pass'}
                </button>
                {isEditing && (
                  <button type="button" onClick={() => setIsEditing(false)} className="btn btn-link text-secondary w-100 mt-2 small text-decoration-none">
                    Cancel
                  </button>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Spin and Win Game */}
        <div className="col-lg-6">
          <SpinWin />
        </div>
      </div>

      {/* Activities Section */}
      <h3 className="fw-bold text-dark text-center mb-4">{t('party_activities_title') || 'Activities & Highlight Events'}</h3>
      <div className="row g-4 mb-4 justify-content-center">
        {[
          { 
            id: 'dj', 
            title: t('party_act_dj_title') || 'Interactive DJ & Band Sets', 
            desc: t('party_act_dj_desc') || 'Rock to local university bands and a grand interactive EDM dance circle led by DJ Spark.', 
            icon: <FaMusic className="text-white fs-4" />,
            cardBg: 'linear-gradient(135deg, rgba(66, 133, 244, 0.12) 0%, rgba(138, 63, 252, 0.12) 100%)',
            iconBg: 'linear-gradient(135deg, #4285F4 0%, #8A3FFC 100%)',
            glowColor: 'rgba(138, 63, 252, 0.35)'
          },
          { 
            id: 'ice', 
            title: t('party_act_ice_title') || 'Ice-Breaker Mixers', 
            desc: t('party_act_ice_desc') || 'Meet students outside your class through funny quick-fire team games and win points.', 
            icon: <FaDice className="text-white fs-4" />,
            cardBg: 'linear-gradient(135deg, rgba(251, 188, 5, 0.12) 0%, rgba(255, 123, 41, 0.12) 100%)',
            iconBg: 'linear-gradient(135deg, #FBBC05 0%, #FF7B29 100%)',
            glowColor: 'rgba(255, 123, 41, 0.35)'
          },
          { 
            id: 'booth', 
            title: t('party_act_booth_title') || 'Memory Wall Photo Booth', 
            desc: t('party_act_booth_desc') || 'Strike a pose with friends, grab cute 3D filter tags, and print your Polaroid prints instantly.', 
            icon: <FaCamera className="text-white fs-4" />,
            cardBg: 'linear-gradient(135deg, rgba(255, 126, 182, 0.12) 0%, rgba(234, 67, 53, 0.12) 100%)',
            iconBg: 'linear-gradient(135deg, #FF7EB6 0%, #EA4335 100%)',
            glowColor: 'rgba(234, 67, 53, 0.35)'
          },
          { 
            id: 'quest', 
            title: 'GDG Campus Quest', 
            desc: 'Unravel riddles about Saranathan College buildings to unlock virtual badges & learn landmarks!', 
            icon: <FaMapMarkerAlt className="text-white fs-4" />,
            cardBg: 'linear-gradient(135deg, rgba(52, 168, 83, 0.12) 0%, rgba(16, 185, 129, 0.12) 100%)',
            iconBg: 'linear-gradient(135deg, #34A853 0%, #10B981 100%)',
            glowColor: 'rgba(16, 185, 129, 0.35)'
          },
          { 
            id: 'persona', 
            title: 'Find Your Campus Persona!', 
            desc: 'Answer a 4-question interactive personality quiz to match your student vibe and get your customized badge.', 
            icon: <FaGamepad className="text-white fs-4" />,
            cardBg: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(0, 229, 255, 0.12) 100%)',
            iconBg: 'linear-gradient(135deg, #06B6D4 0%, #00E5FF 100%)',
            glowColor: 'rgba(0, 229, 255, 0.35)'
          }
        ].map((act, i) => (
          <div key={act.id} className="col-md-6 col-lg-4">
            <div 
              onClick={() => setSelectedActivity(act)}
              className="glass-card p-4 h-100 text-center cursor-pointer hover-lift transition-all border border-white"
              style={{
                background: act.cardBg,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 12px 40px 0 ${act.glowColor}`;
                e.currentTarget.style.transform = 'translateY(-6px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.04)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div 
                className="p-3 d-inline-block rounded-4 mb-3"
                style={{ background: act.iconBg, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              >
                {act.icon}
              </div>
              <h5 className="fw-bold text-dark mb-2">{act.title}</h5>
              <p className="text-secondary small mb-0">{act.desc}</p>
              <span 
                className="small fw-bold mt-4 d-inline-block px-4 py-2 rounded-pill text-white transition-all shadow-sm"
                style={{ background: act.iconBg, fontSize: '0.8rem' }}
              >
                {t('party_act_join_btn') || 'Click to Join Game! 🚀'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Detail Modal */}
      {selectedActivity && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              
              {/* Image banner inside modal */}
              <div className="position-relative" style={{ height: '200px' }}>
                <img 
                  src={
                    selectedActivity.id === 'dj' 
                    ? 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80'
                    : selectedActivity.id === 'ice'
                    ? 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&auto=format&fit=crop&q=80'
                    : selectedActivity.id === 'booth'
                    ? 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&auto=format&fit=crop&q=80'
                    : selectedActivity.id === 'quest'
                    ? 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=600&auto=format&fit=crop&q=80'
                    : 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&auto=format&fit=crop&q=80'
                  }
                  alt={selectedActivity.title}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
                <button 
                  type="button" 
                  className="btn-close btn-close-white position-absolute top-0 end-0 m-3 shadow-none" 
                  onClick={() => setSelectedActivity(null)}
                ></button>
              </div>

              {/* Body */}
              <div className="modal-body p-4">
                <h5 className="fw-bold text-dark mb-1">{selectedActivity.title}</h5>
                <p className="text-secondary small mb-4">{selectedActivity.desc}</p>
                
                {/* 1. DJ Soundboard Panel */}
                {selectedActivity.id === 'dj' && (
                  <div>
                    <h6 className="fw-bold text-dark mb-2">🎛️ {djPlaylistNames[language] || djPlaylistNames['en']}</h6>
                    <p className="text-secondary small mb-3">Click any music element below to trigger an innovative song track in real time!</p>
                    
                    {currentSong && (
                      <div className="p-3 bg-dark text-white rounded-4 border mb-4 shadow-sm d-flex align-items-center justify-content-between animate-fade-in">
                        <div className="d-flex align-items-center gap-3">
                          <span className="spinner-grow spinner-grow-sm text-warning" role="status"></span>
                          <div>
                            <span className="text-success fw-bold d-block" style={{ fontSize: '0.65rem' }}>🎵 NOW PLAYING SONG TRACK</span>
                            <strong className="small text-white">{currentSong}</strong>
                          </div>
                        </div>
                        <button onClick={stopSongTrack} className="btn btn-sm btn-outline-light rounded-pill px-3 py-1 text-white small">
                          ⏹ Stop
                        </button>
                      </div>
                    )}

                    {activeSpotifyTrackId && (
                      <div className="mb-4 rounded-4 overflow-hidden border shadow-sm animate-slide-down" style={{ height: '80px' }}>
                        <iframe 
                          src={`https://open.spotify.com/embed/track/${activeSpotifyTrackId}?utm_source=generator&theme=0`} 
                          width="100%" 
                          height="80" 
                          frameBorder="0" 
                          allowFullScreen="" 
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                          loading="lazy"
                          style={{ minHeight: '80px' }}
                        ></iframe>
                      </div>
                    )}

                    <div className="row g-2 mb-3">
                      {(djSongsByLanguage[language] || djSongsByLanguage['en']).map((song) => (
                        <div key={song.id} className="col-6 animate-fade-in">
                          <div className="p-2 bg-light rounded-3 border d-flex align-items-center justify-content-between transition-all hover-shadow-sm">
                            <button 
                              onClick={() => {
                                setActiveSpotifyTrackId(song.id);
                                setCurrentSong(song.title);
                              }} 
                              className="btn btn-sm border-0 p-0 text-start fw-semibold text-dark flex-grow-1 me-2 text-wrap"
                              style={{ fontSize: '0.8rem' }}
                              title="Click to play on Spotify"
                            >
                              {song.title}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => toggleFavoriteSong(song.title, e)}
                              className={`btn btn-sm rounded-circle p-1 border-0 ${favoriteSongs.includes(song.title) ? 'text-danger bg-white shadow-sm animate-pulse' : 'text-muted'}`}
                              title={favoriteSongs.includes(song.title) ? "Remove from DJ Wishlist" : "Add to DJ Wishlist"}
                              style={{ width: '28px', height: '28px', lineHeight: '1' }}
                            >
                              {favoriteSongs.includes(song.title) ? '❤️' : '🤍'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Freshers DJ Live Wishlist Summary / VIP Pass */}
                    {favoriteSongs.length > 0 ? (
                      <div className="p-4 bg-dark text-white rounded-4 border border-warning border-3 mb-4 text-center shadow-lg position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e1e2f 0%, #11111d 100%)' }}>
                        {/* Decorative background glow */}
                        <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient opacity-10" style={{ background: 'radial-gradient(circle, rgba(255,193,7,0.3) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
                        
                        <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                          <span className="fs-4">🎟️</span>
                          <span className="badge bg-warning text-dark fw-bold px-3 py-1.5 rounded-pill text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.65rem' }}>DJ FIESTA VIP PASS</span>
                        </div>
                        
                        <h5 className="fw-bold text-warning mb-2 animate-pulse" style={{ letterSpacing: '0.5px' }}>YOUR VIDEO IS ON THE PITCH ENJOY !!!</h5>
                        <p className="text-muted small mb-0" style={{ fontSize: '0.75rem' }}>
                          Spark Feed active track: <strong className="text-light">{favoriteSongs[favoriteSongs.length - 1]}</strong>
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-white rounded-4 border mb-4">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <strong className="text-dark small d-flex align-items-center gap-1">
                            ⭐ Freshers DJ Wishlist
                          </strong>
                          <span className="badge bg-danger text-white">DJ Spark Feed</span>
                        </div>
                        <span className="text-muted small">No tracks favorited yet. Click the 🤍 heart next to any track above to request it for DJ Spark's live fiesta set!</span>
                      </div>
                    )}


                  </div>
                )}

                {/* 2. Icebreaker Panel */}
                {selectedActivity.id === 'ice' && (
                  <div className="text-center">
                    <h6 className="fw-bold text-dark text-start mb-2">🎲 Freshman Mixer Prompts</h6>
                    <p className="text-secondary small text-start mb-3">Roll a funny question to break the ice with students at your table!</p>
                    
                    <div className="p-3 bg-light rounded-4 border mb-4 text-center">
                      <strong className="text-primary small d-block mb-1">ICE BREAKER PROMPT</strong>
                      <span className="text-secondary small fw-medium" style={{ display: 'inline-block', minHeight: '40px' }}>
                        {icebreaker}
                      </span>
                    </div>

                    <button onClick={rollIcebreaker} className="btn btn-gradient py-2 px-4 rounded-pill shadow-none small">
                      Roll Question! 🎲
                    </button>
                  </div>
                )}

                {/* 3. Polaroid Photo Booth Panel */}
                {selectedActivity.id === 'booth' && (
                  <div>
                    <h6 className="fw-bold text-dark mb-2">📸 Virtual Polaroid Frame Maker</h6>
                    <p className="text-secondary small mb-3">Create your customized digital welcome souvenir photo pass!</p>
                    
                    {/* Frame Preview */}
                    <div className="d-flex justify-content-center mb-4">
                      <div 
                        className="p-3 shadow border d-flex flex-column align-items-center justify-content-between"
                        style={{
                          width: '180px',
                          height: '240px',
                          backgroundColor: polaroidFrame,
                          borderRadius: '8px',
                          transition: 'background-color 0.3s'
                        }}
                      >
                        {/* Selfie Placeholder */}
                        <div className="w-100 bg-secondary rounded bg-opacity-25 d-flex align-items-center justify-content-center text-secondary" style={{ height: '140px' }}>
                          <FaCamera size={42} />
                        </div>
                        {/* Label */}
                        <div className="w-100 text-center font-monospace text-dark mt-2 fw-bold" style={{ fontSize: '0.65rem' }}>
                          {polaroidText}
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-secondary">Souvenir Label Text</label>
                      <input 
                        type="text" 
                        className="form-control bg-light border-0 p-2 small text-dark" 
                        value={polaroidText} 
                        onChange={(e) => setPolaroidText(e.target.value)} 
                        maxLength="30"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label small fw-semibold text-secondary">Select Frame Color</label>
                      <div className="d-flex gap-2">
                        {['#FFFFFF', '#FFE4E6', '#E0F2FE', '#FEF08A', '#F3E8FF'].map((color) => (
                          <button
                            key={color}
                            onClick={() => setPolaroidFrame(color)}
                            className="btn rounded-circle border p-0"
                            style={{ width: '28px', height: '28px', backgroundColor: color, border: polaroidFrame === color ? '2px solid #4285F4' : '1px solid #CBD5E1' }}
                          ></button>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => alert('Souvenir Polaroid saved to dashboard!')} className="btn btn-gradient w-100 py-3 shadow-none">
                      Generate Polaroid Souvenir 📸
                    </button>
                  </div>
                )}

                {/* 4. Campus Quest Scavenger Hunt */}
                {selectedActivity.id === 'quest' && (
                  <div>
                    <h6 className="fw-bold text-dark mb-2">🏅 GDG Campus Scavenger Quest</h6>
                    
                    {questStep === 0 && (
                      <div className="text-center py-3">
                        <FaTrophy className="text-warning fs-1 mb-3 animate-bounce" />
                        <p className="text-secondary small mb-4">
                          GDG Welcome challenge! Solve 3 quick-fire riddles about Saranathan Campus landmarks to unlock the <strong>Campus Explorer</strong> digital badge and earn 30 points!
                        </p>
                        <button 
                          onClick={() => {
                            setQuestStep(1);
                            setQuestScore(0);
                            setQuestFeedback("");
                          }} 
                          className="btn btn-primary py-2.5 px-4 rounded-pill shadow-none fw-bold"
                        >
                          Start Quest 🚀
                        </button>
                      </div>
                    )}

                    {questStep === 1 && (
                      <div>
                        <div className="progress mb-3" style={{ height: '6px' }}>
                          <div className="progress-bar bg-success" style={{ width: '33%' }}></div>
                        </div>
                        <span className="badge bg-primary mb-2">Riddle 1 of 3</span>
                        <h6 className="fw-bold text-dark mb-3">"I stack 4 levels high, housing administrative desks on Floor 0, and the IT Cyber Security lab on Floor 2. Which block am I?"</h6>
                        
                        <div className="d-flex flex-column gap-2 mb-3">
                          {[
                            { text: 'Main Block', isCorrect: true },
                            { text: 'Sir C.V. Raman Block', isCorrect: false },
                            { text: 'Decennial Block', isCorrect: false }
                          ].map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              disabled={questFeedback !== ""}
                              onClick={() => {
                                if (opt.isCorrect) {
                                  setQuestScore(s => s + 10);
                                  setQuestFeedback("Correct! 🎉 +10 GDG Points!");
                                } else {
                                  setQuestFeedback("Incorrect! ❌ The correct answer is Main Block.");
                                }
                              }}
                              className={`btn btn-outline-secondary text-start p-2.5 small rounded-3 border-2 fw-semibold ${questFeedback && opt.isCorrect ? 'bg-success-subtle border-success text-success' : ''}`}
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>
                        
                        {questFeedback && (
                          <div className="alert alert-info py-2 px-3 small rounded-3 mb-3">{questFeedback}</div>
                        )}
                        
                        {questFeedback && (
                          <button 
                            onClick={() => {
                              setQuestStep(2);
                              setQuestFeedback("");
                            }} 
                            className="btn btn-primary btn-sm rounded-pill px-4 float-end"
                          >
                            Next Riddle ➡️
                          </button>
                        )}
                      </div>
                    )}

                    {questStep === 2 && (
                      <div>
                        <div className="progress mb-3" style={{ height: '6px' }}>
                          <div className="progress-bar bg-success" style={{ width: '66%' }}></div>
                        </div>
                        <span className="badge bg-primary mb-2">Riddle 2 of 3</span>
                        <h6 className="fw-bold text-dark mb-3">"Named after a Nobel laureate in Physics, this building hosts the AI&DS department and chemistry labs. Which block am I?"</h6>
                        
                        <div className="d-flex flex-column gap-2 mb-3">
                          {[
                            { text: 'J.C. Bose Block', isCorrect: false },
                            { text: 'Sir C.V. Raman Block', isCorrect: true },
                            { text: 'Visvesvaraya Block', isCorrect: false }
                          ].map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              disabled={questFeedback !== ""}
                              onClick={() => {
                                if (opt.isCorrect) {
                                  setQuestScore(s => s + 10);
                                  setQuestFeedback("Correct! 🎉 +10 GDG Points!");
                                } else {
                                  setQuestFeedback("Incorrect! ❌ The correct answer is Sir C.V. Raman Block.");
                                }
                              }}
                              className={`btn btn-outline-secondary text-start p-2.5 small rounded-3 border-2 fw-semibold ${questFeedback && opt.isCorrect ? 'bg-success-subtle border-success text-success' : ''}`}
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>
                        
                        {questFeedback && (
                          <div className="alert alert-info py-2 px-3 small rounded-3 mb-3">{questFeedback}</div>
                        )}
                        
                        {questFeedback && (
                          <button 
                            onClick={() => {
                              setQuestStep(3);
                              setQuestFeedback("");
                            }} 
                            className="btn btn-primary btn-sm rounded-pill px-4 float-end"
                          >
                            Next Riddle ➡️
                          </button>
                        )}
                      </div>
                    )}

                    {questStep === 3 && (
                      <div>
                        <div className="progress mb-3" style={{ height: '6px' }}>
                          <div className="progress-bar bg-success" style={{ width: '90%' }}></div>
                        </div>
                        <span className="badge bg-primary mb-2">Riddle 3 of 3</span>
                        <h6 className="fw-bold text-dark mb-3">"Holding over 60,000 reference volumes, a digital library stack, and study cabins. Which facility am I?"</h6>
                        
                        <div className="d-flex flex-column gap-2 mb-3">
                          {[
                            { text: 'Saranathan Auditorium', isCorrect: false },
                            { text: 'Central Library', isCorrect: true },
                            { text: 'Canteen', isCorrect: false }
                          ].map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              disabled={questFeedback !== ""}
                              onClick={() => {
                                if (opt.isCorrect) {
                                  setQuestScore(s => s + 10);
                                  setQuestFeedback("Correct! 🎉 +10 GDG Points!");
                                } else {
                                  setQuestFeedback("Incorrect! ❌ The correct answer is Central Library.");
                                }
                              }}
                              className={`btn btn-outline-secondary text-start p-2.5 small rounded-3 border-2 fw-semibold ${questFeedback && opt.isCorrect ? 'bg-success-subtle border-success text-success' : ''}`}
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>
                        
                        {questFeedback && (
                          <div className="alert alert-info py-2 px-3 small rounded-3 mb-3">{questFeedback}</div>
                        )}
                        
                        {questFeedback && (
                          <button 
                            onClick={() => {
                              setQuestStep(4);
                              setQuestFeedback("");
                            }} 
                            className="btn btn-success btn-sm rounded-pill px-4 float-end"
                          >
                            Finish Quest 🏁
                          </button>
                        )}
                      </div>
                    )}

                    {questStep === 4 && (
                      <div className="text-center py-4">
                        <FaTrophy className="text-warning fs-1 mb-3" />
                        <h5 className="fw-bold text-dark mb-2">Quest Completed!</h5>
                        <p className="text-secondary small mb-3">Your score: <strong>{questScore}/30</strong> points.</p>
                        
                        <div className="p-3 bg-light rounded-4 border mb-4">
                          <strong className="text-success d-block mb-1">🏅 BADGE UNLOCKED</strong>
                          <span className="fw-bold text-dark">Saranathan Campus Explorer</span>
                          <p className="text-muted small mb-0 mt-1">This badge has been added to your profile card. Keep exploring the 3D Map!</p>
                        </div>
                        
                        <button 
                          onClick={() => setQuestStep(0)} 
                          className="btn btn-outline-primary py-2 px-4 rounded-pill small"
                        >
                          Play Again 🔄
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. Campus Persona Quiz */}
                {selectedActivity.id === 'persona' && (
                  <div>
                    <h6 className="fw-bold text-dark mb-2">🧙‍♂️ Campus Persona Matcher</h6>
                    
                    {personaStep === 0 && (
                      <div className="text-center py-3">
                        <FaGamepad className="text-info fs-1 mb-3 animate-bounce" />
                        <p className="text-secondary small mb-4">
                          Answer 4 quick questions about your daily routine to discover your unique college persona and get a customized profile badge!
                        </p>
                        <button 
                          onClick={() => {
                            setPersonaStep(1);
                            setPersonaAnswers([]);
                            setPersonaResult(null);
                          }} 
                          className="btn btn-primary py-2.5 px-4 rounded-pill shadow-none fw-bold"
                        >
                          Start Quiz 🚀
                        </button>
                      </div>
                    )}

                    {personaStep >= 1 && personaStep <= 4 && (
                      <div>
                        <div className="progress mb-3" style={{ height: '6px' }}>
                          <div className="progress-bar bg-info" style={{ width: `${(personaStep / 4) * 100}%` }}></div>
                        </div>
                        <span className="badge bg-info text-dark mb-2">Question {personaStep} of 4</span>
                        
                        {personaStep === 1 && (
                          <div>
                            <h6 className="fw-bold text-dark mb-3">Where do you spend your free hours on campus?</h6>
                            <div className="d-flex flex-column gap-2">
                              {[
                                { text: 'In the programming labs compiling code.', type: 'wizard' },
                                { text: 'Practicing instruments or planning stage shows.', type: 'maestro' },
                                { text: 'At the cricket nets or running tracks.', type: 'athlete' },
                                { text: 'Reading silently in the library.', type: 'scholar' }
                              ].map((opt, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setPersonaAnswers(prev => [...prev, opt.type]);
                                    setPersonaStep(2);
                                  }}
                                  className="btn btn-outline-secondary text-start p-2.5 small rounded-3 border-2 fw-semibold"
                                >
                                  {opt.text}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {personaStep === 2 && (
                          <div>
                            <h6 className="fw-bold text-dark mb-3">What is your dream freshman event?</h6>
                            <div className="d-flex flex-column gap-2">
                              {[
                                { text: 'A 24-hour hackathon with unlimited pizza.', type: 'wizard' },
                                { text: 'A rock concert under glowing neon lights.', type: 'maestro' },
                                { text: 'An inter-college sports derby championship.', type: 'athlete' },
                                { text: 'A quiet coffee chat with industry leaders.', type: 'scholar' }
                              ].map((opt, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setPersonaAnswers(prev => [...prev, opt.type]);
                                    setPersonaStep(3);
                                  }}
                                  className="btn btn-outline-secondary text-start p-2.5 small rounded-3 border-2 fw-semibold"
                                >
                                  {opt.text}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {personaStep === 3 && (
                          <div>
                            <h6 className="fw-bold text-dark mb-3">Pick your favorite tool or aesthetic:</h6>
                            <div className="d-flex flex-column gap-2">
                              {[
                                { text: 'Python/Rust compilers.', type: 'wizard' },
                                { text: 'Vibrant CSS keyframes & dynamic UX.', type: 'maestro' },
                                { text: 'Microcontroller hardware sensors.', type: 'athlete' },
                                { text: 'Markdown notes and LaTeX formulas.', type: 'scholar' }
                              ].map((opt, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setPersonaAnswers(prev => [...prev, opt.type]);
                                    setPersonaStep(4);
                                  }}
                                  className="btn btn-outline-secondary text-start p-2.5 small rounded-3 border-2 fw-semibold"
                                >
                                  {opt.text}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {personaStep === 4 && (
                          <div>
                            <h6 className="fw-bold text-dark mb-3">Your go-to snacks at the canteen:</h6>
                            <div className="d-flex flex-column gap-2">
                              {[
                                { text: 'Energy drinks & potato chips.', type: 'wizard' },
                                { text: 'Fresh juice & hot samosas.', type: 'maestro' },
                                { text: 'Boiled egg & fresh fruit salad.', type: 'athlete' },
                                { text: 'Filter coffee & butter biscuits.', type: 'scholar' }
                              ].map((opt, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    const finalAnswers = [...personaAnswers, opt.type];
                                    const counts = { wizard: 0, maestro: 0, athlete: 0, scholar: 0 };
                                    finalAnswers.forEach(t => counts[t] = (counts[t] || 0) + 1);
                                    let topType = 'wizard';
                                    let maxCount = 0;
                                    Object.entries(counts).forEach(([k, v]) => {
                                      if (v > maxCount) {
                                        maxCount = v;
                                        topType = k;
                                      }
                                    });
                                    setPersonaResult(topType);
                                    setPersonaStep(5);
                                  }}
                                  className="btn btn-outline-secondary text-start p-2.5 small rounded-3 border-2 fw-semibold"
                                >
                                  {opt.text}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {personaStep === 5 && (
                      <div className="text-center py-4">
                        {personaResult === 'wizard' && (
                          <div>
                            <div className="fs-1 mb-2">🧙‍♂️</div>
                            <h5 className="fw-bold text-dark mb-1">The Tech Wizard</h5>
                            <p className="text-secondary small mb-4">You thrive on lines of code, late-night hackathons, and hardware integrations. You’ll fit perfectly with GDG & Turing Guild!</p>
                          </div>
                        )}
                        {personaResult === 'maestro' && (
                          <div>
                            <div className="fs-1 mb-2">🎭</div>
                            <h5 className="fw-bold text-dark mb-1">The Cultural Maestro</h5>
                            <p className="text-secondary small mb-4">You are the creative spark! You love rock sets, dynamic web design, and UI animations. Look out for the MDA Club!</p>
                          </div>
                        )}
                        {personaResult === 'athlete' && (
                          <div>
                            <div className="fs-1 mb-2">⚽</div>
                            <h5 className="fw-bold text-dark mb-1">The Sports Athlete</h5>
                            <p className="text-secondary small mb-4">You love physical games, high energy, fitness, and team coordination. The Main Sports Ground is your domain!</p>
                          </div>
                        )}
                        {personaResult === 'scholar' && (
                          <div>
                            <div className="fs-1 mb-2">📚</div>
                            <h5 className="fw-bold text-dark mb-1">The Library Scholar</h5>
                            <p className="text-secondary small mb-4">You are highly focused, appreciate quiet research, deep learning, and writing neat documentation. The Central Library is your second home!</p>
                          </div>
                        )}
                        
                        <div className="p-3 bg-light rounded-4 border mb-4">
                          <strong className="text-info d-block mb-1">🏆 PERSONALITY MATCH COMPLETE</strong>
                          <span className="small text-muted">A customized badge has been saved to your student profile!</span>
                        </div>
                        
                        <div className="d-flex gap-2 justify-content-center">
                          <button 
                            onClick={() => {
                              alert('Shared to GDG Connect Live Feed! 🚀');
                              setPersonaStep(0);
                              setSelectedActivity(null);
                            }} 
                            className="btn btn-primary py-2 px-4 rounded-pill small"
                          >
                            Share to Feed 🚀
                          </button>
                          <button 
                            onClick={() => setPersonaStep(0)} 
                            className="btn btn-outline-secondary py-2 px-3 rounded-pill small"
                          >
                            Restart Quiz
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
              <div className="modal-footer bg-light border-0">
                <button type="button" className="btn btn-secondary py-2 px-4 rounded-pill small" onClick={() => setSelectedActivity(null)}>Close Game</button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreshersPartyPage;
