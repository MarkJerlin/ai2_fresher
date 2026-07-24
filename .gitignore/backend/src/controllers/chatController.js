const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../db');
require('dotenv').config();

// Initialize the Google Generative AI with the API Key
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// System instruction context for the GDG Freshers Connect AI Assistant
const systemInstruction = `
You are the AI Campus Assistant named "GDG Freshers Connect Bot", designed specifically for first-year college freshers.
Your job is to provide friendly, polite, informative, and encouraging assistance on college matters.
You have access to information about:
- Freshers Fiesta 2026: Official party on August 15, 2026 at 6:00 PM in the Main Auditorium. Dress code is 'Retro Glam' or 'Vibrant Casuals'. Activities include DJ, live bands, games, lucky draw, and photo booths.
- Departments: CSE (Turing Block), IT (Babbage Building), ECE (Tesla Block), MECH (Workshop Block A).
- Faculty Advisors: Dr. Charles Babbage (CSE), Prof. Ada Lovelace (CSE), Dr. Tim Berners-Lee (IT Dean), Dr. Claude Shannon (ECE).
- Campus Clubs: GDG (Google Developer Groups - Tech), Robotics & IoT (Tech), MDA (Music & Dramatic Arts - Cultural).
- College Rules: 75% attendance is mandatory. Identity cards must be worn. Campus is ragging-free (strict penalties apply).
- Facilities: Library (Central Block), Cafeteria (Student Center), Sports Arena (West Zone).
- Study Tips: Attend lectures regularly, join a technical club like GDG early, build small hands-on projects, and maintain good relationships with mentors.

Rules for response:
1. Always maintain a helpful, welcoming student-mentor persona.
2. If asked about event schedules or registrations, guide them to the Events Page or Freshers Party Page.
3. Keep answers relatively concise and easy to read using lists where appropriate.
4. If you don't know the answer, politely state that they should contact the student helpdesk or visit the Admin Block.
5. If GEMINI_API_KEY is not configured, fall back to pre-defined answers based on keyword matching.
`;

const handleChatMessage = async (req, res) => {
  try {
    const { message, history } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    let aiResponse = '';

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Format history for Gemini chat (must use role: "user" | "model" and parts: [{ text: "..." }])
        const geminiHistory = (history || []).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));

        // Insert system instruction as the first turn or prepend to the message if not supported in custom configurations
        const chat = model.startChat({
          history: geminiHistory,
          systemInstruction: systemInstruction
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        aiResponse = response.text();
      } catch (geminiError) {
        console.error('Gemini API call failed, falling back to rule engine:', geminiError.message);
        aiResponse = ruleBasedFallback(message);
      }
    } else {
      // Fallback if API key is missing
      aiResponse = ruleBasedFallback(message);
    }

    // Save to database
    await db.query(
      'INSERT INTO chat_history (user_id, message, response) VALUES (?, ?, ?)',
      [userId, message, aiResponse]
    );

    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Error processing chat message.', error: error.message });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const [history] = await db.query(
      'SELECT message, response, created_at FROM chat_history WHERE user_id = ? ORDER BY created_at ASC LIMIT 50',
      [req.user.id]
    );
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat history', error: error.message });
  }
};

// Keyword based fallback matcher for offline demonstration / fallback
function ruleBasedFallback(message) {
  const msg = message.toLowerCase();

  if (msg.includes('party') || msg.includes('fiesta') || msg.includes('welcome')) {
    return '🎉 **Freshers Fiesta 2026** is the official welcome party! \n- **Date:** August 15, 2026\n- **Time:** 6:00 PM\n- **Venue:** Main Auditorium\n- **Dress Code:** Retro Glam / Vibrant Casuals\nRegister on the **Freshers Party** tab in your dashboard to generate your entry QR code!';
  }
  if (msg.includes('club') || msg.includes('gdg')) {
    return '💻 We highly recommend joining **Google Developer Groups (GDG) On Campus**! It is a great place to build projects, learn cloud and AI tools, and connect with peers. Other clubs include **Robotics & IoT** and **Music & Dramatic Arts (MDA)**.';
  }
  if (msg.includes('faculty') || msg.includes('advisor') || msg.includes('teacher')) {
    return '📚 Here are your freshman faculty advisors:\n- **CSE:** Dr. Charles Babbage & Prof. Ada Lovelace\n- **IT:** Dr. Tim Berners-Lee (Dean)\n- **ECE:** Dr. Claude Shannon\nCheck the **Faculty** section in the main portal for emails and office hours!';
  }
  if (msg.includes('map') || msg.includes('navig') || msg.includes('auditorium') || msg.includes('turing') || msg.includes('babbage') || msg.includes('tesla')) {
    return '🗺️ **Campus Navigation Info:**\n- **Main Auditorium:** Central Academic Square\n- **CSE Department:** Turing Block (3rd Floor)\n- **IT Department:** Babbage Building (2nd Floor)\n- **ECE Department:** Tesla Block (Ground Floor)\nUse the **Interactive Map** on our resources page to explore the entire campus layout!';
  }
  if (msg.includes('attendance') || msg.includes('rules') || msg.includes('mandatory')) {
    return '⚠️ **College Regulations:**\n- You must maintain at least **75% attendance** in each subject to be eligible for exams.\n- Identity cards are mandatory on campus.\n- The campus is strictly anti-ragging with severe disciplinary consequences for offenders.';
  }
  if (msg.includes('timetable') || msg.includes('schedule') || msg.includes('classes')) {
    return '📅 Regular classes begin on **August 10, 2026**. You can view and download your division’s official timetable on your **User Dashboard** under the Timetable sub-tab.';
  }
  return '👋 Hello! I am your GDG AI Freshers Assistant. I can help you with campus navigation, Freshers Fiesta details, faculty info, club registrations, and college rules. Try asking "When is the Freshers Party?" or "Which clubs should I join?".';
}

module.exports = { handleChatMessage, getChatHistory };
