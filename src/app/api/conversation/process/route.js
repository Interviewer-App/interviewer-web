import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await generateAIResponse(message, conversationHistory || []);

    return NextResponse.json({
      response: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Conversation API Error:", error);
    return NextResponse.json(
      { error: "Failed to process conversation" },
      { status: 500 }
    );
  }
}

async function generateAIResponse(userMessage, history) {
  try {
    // Use Google Gemini AI if available
    if (process.env.GOOGLE_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Build conversation context
      let conversationContext = `You are a friendly and professional AI interview assistant. Your role is to help candidates prepare for job interviews through practice conversations. 

Guidelines:
- Be encouraging and supportive
- Ask thoughtful follow-up questions
- Provide constructive feedback when appropriate
- Keep responses conversational and natural
- Focus on interview-related topics when possible
- Be concise but helpful

Previous conversation:
${history.map(msg => `${msg.type}: ${msg.content}`).join('\n')}

Current user message: ${userMessage}

Respond naturally and helpfully:`;

      const result = await model.generateContent(conversationContext);
      const response = await result.response;
      return response.text();
    }
  } catch (error) {
    console.error("AI Response Error:", error);
  }

  // Fallback to predefined responses
  return generateFallbackResponse(userMessage, history);
}

function generateFallbackResponse(userMessage, history) {
  const message = userMessage.toLowerCase();
  
  // Interview-focused responses
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello! I'm your AI interview assistant. I'm here to help you practice for your upcoming interview. What position are you preparing for, or would you like to start with some common interview questions?";
  }
  
  if (message.includes('interview') || message.includes('job') || message.includes('position')) {
    return "Great! Let's practice some interview skills. I can help you with common questions like 'Tell me about yourself' or 'Why do you want to work here?' Which type of questions would you like to practice?";
  }
  
  if (message.includes('nervous') || message.includes('anxiety') || message.includes('stressed')) {
    return "It's completely normal to feel nervous before an interview. Here are some tips: Take deep breaths, prepare your key stories, and remember that the interviewer wants you to succeed. Would you like to practice answering some questions to build confidence?";
  }
  
  if (message.includes('strength') || message.includes('weakness')) {
    return "When discussing strengths, be specific and provide examples that relate to the job. For weaknesses, choose something you're actively working to improve and explain your improvement plan. Would you like to practice these questions?";
  }
  
  if (message.includes('tell me about yourself') || message.includes('introduce yourself')) {
    return "This is a great opening question! Structure your answer with: Present (current role/situation), Past (relevant experience), and Future (why you're interested in this role). Keep it to 2-3 minutes. Would you like to practice your response?";
  }
  
  if (message.includes('why do you want') || message.includes('why are you interested')) {
    return "Show that you've researched the company and role. Connect your skills and interests to what they're looking for. Mention specific aspects of the company or role that excite you. What interests you about the position you're applying for?";
  }
  
  if (message.includes('questions') || message.includes('ask')) {
    return "Excellent! Always have thoughtful questions prepared. Good options include: 'What does success look like in this role?' 'What are the biggest challenges facing the team?' 'What's the company culture like?' What specific aspects would you like to know about?";
  }
  
  if (message.includes('thank') || message.includes('bye') || message.includes('goodbye')) {
    return "You're very welcome! Remember: be confident, be authentic, and let your enthusiasm shine through. Don't forget to follow up with a thank-you email after the interview. Good luck!";
  }
  
  if (message.includes('salary') || message.includes('compensation') || message.includes('benefits')) {
    return "Salary discussions can be tricky. Do your research beforehand to know market rates. If asked early, you can say 'I'm more interested in finding the right fit first, but I'm sure we can work something out that's fair for both sides.' What's your approach to salary negotiations?";
  }
  
  if (message.includes('experience') || message.includes('background')) {
    return "Great! When discussing your experience, use the STAR method: Situation, Task, Action, Result. This helps you give structured, compelling answers. Can you think of a challenging situation you've faced that demonstrates your skills?";
  }
  
  // Default responses for general conversation
  const responses = [
    "That's interesting! Can you tell me more about that and how it relates to your career goals?",
    "I understand. How did that experience shape your approach to work or problem-solving?",
    "That's a great point. What skills did you develop from that experience that would be valuable in an interview setting?",
    "Excellent! How would you present that experience to a potential employer?",
    "I see. What would you do differently if you faced a similar situation in a new role?",
    "That shows great initiative. How do you think that experience makes you a strong candidate?",
    "Interesting perspective. How would you explain the value of that experience to an interviewer?",
    "That's valuable experience. What key lessons did you learn that you could share in an interview?"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}
