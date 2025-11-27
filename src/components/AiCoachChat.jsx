import React, { useState } from "react";

const AiCoachChat = ({ stats }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm your AI coach 🤖. Ask me about your spending, savings, or trends!" },
  ]);
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("friendly");

  // Utility: simple tone transformer
  const toneText = (text) => {
    switch (tone) {
      case "formal":
        return text.replace("!", ".").replace("💰", "").replace("⚠️", "");
      case "direct":
        return text.replace("You're", "You are").replace("Keep", "Continue").replace("Try", "Do").replace("⚠️", "!");
      default:
        return text;
    }
  };

  // Simple local heuristic "AI"
  const getInsightResponse = (query) => {
    const { totalIncome = 0, totalExpense = 0, balance = 0 } = stats;
    const savingRate = totalIncome ? (balance / totalIncome) * 100 : 0;

    query = query.toLowerCase();

    if (query.includes("summary") || query.includes("report")) {
      return `You’ve earned Ksh ${totalIncome.toFixed(2)} and spent Ksh ${totalExpense.toFixed(
        2
      )}. Your balance is Ksh ${balance.toFixed(2)}.`;
    }
    if (query.includes("save") || query.includes("savings")) {
      if (savingRate > 40)
        return "Excellent savings habits! You’re well on track 💰";
      if (savingRate > 20)
        return "Good savings! You could push it a little higher for future goals.";
      return "Your savings are quite low — consider trimming some expenses ⚠️";
    }
    if (query.includes("spend") || query.includes("expense"))
      return `Your total spending is Ksh ${totalExpense.toFixed(
        2
      )}. Try to keep it below 70% of your income.`;

    if (query.includes("forecast") || query.includes("predict")) {
      const forecast = (balance * 1.05).toFixed(2);
      return `If you continue at this rate, your projected balance next month could be around Ksh ${forecast}.`;
    }

    if (query.includes("hello") || query.includes("hi"))
      return "Hello there 👋! What would you like to know about your finances today?";

    return "Hmm, I didn’t quite get that. Try asking things like 'show my summary', 'how much did I save', or 'predict my balance'.";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    const botMsg = { sender: "bot", text: toneText(getInsightResponse(input)) };
    setMessages([...messages, userMsg, botMsg]);
    setInput("");
  };

  const styles = {
   floatButton: {
  position: "fixed",
  bottom: "24px",
  right: "24px",
  background: "#2563eb",
  color: "#fff",
  borderRadius: "50%",
  width: "60px",
  height: "60px",
  border: "none",
  fontSize: "24px",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
  zIndex: 9999, // ✅ added to ensure it appears on top
},

panel: {
  position: "fixed",
  bottom: "100px",
  right: "24px",
  width: "320px",
  background: "#1e293b",
  color: "#fff",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
  display: "flex",
  flexDirection: "column",
  padding: "12px",
  zIndex: 9999, // ✅ also added
},

    messages: {
      flexGrow: 1,
      overflowY: "auto",
      maxHeight: "260px",
      padding: "8px",
    },
    msg: {
      margin: "8px 0",
      padding: "8px 10px",
      borderRadius: "10px",
      maxWidth: "80%",
      lineHeight: "1.4",
    },
    user: {
      background: "#2563eb",
      alignSelf: "flex-end",
    },
    bot: {
      background: "#334155",
      alignSelf: "flex-start",
    },
    inputRow: {
      display: "flex",
      gap: "8px",
      marginTop: "8px",
    },
    input: {
      flexGrow: 1,
      padding: "8px",
      borderRadius: "8px",
      border: "none",
      outline: "none",
    },
    sendBtn: {
      background: "#22c55e",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "8px 12px",
      cursor: "pointer",
    },
    toneSelector: {
      marginBottom: "8px",
      fontSize: "0.85rem",
      color: "#cbd5e1",
    },
  };

  return (
    <>
      <button style={styles.floatButton} onClick={() => setOpen(!open)}>
        💬
      </button>

      {open && (
        <div style={styles.panel}>
          <div style={styles.toneSelector}>
            Tone:{" "}
            <select value={tone} onChange={(e) => setTone(e.target.value)}>
              <option value="friendly">Friendly</option>
              <option value="formal">Formal</option>
              <option value="direct">Direct</option>
            </select>
          </div>

          <div style={styles.messages}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  ...styles.msg,
                  ...(m.sender === "user" ? styles.user : styles.bot),
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div style={styles.inputRow}>
            <input
              type="text"
              value={input}
              placeholder="Ask something..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              style={styles.input}
            />
            <button style={styles.sendBtn} onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AiCoachChat;
