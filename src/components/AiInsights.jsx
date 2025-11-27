import React, { useEffect, useState } from "react";
import HealthGauge from "./HealthGauge";
import '../styles/fintech.css';
import { FiLogOut } from 'react-icons/fi';

const AiInsights = () => {
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [insights, setInsights] = useState([]);
  const [financialScore, setFinancialScore] = useState(0);
  const [forecast, setForecast] = useState(null);
  const [motivation, setMotivation] = useState("");

  // Fetch and analyze financial data
  const fetchInsights = () => {
    const income = parseFloat(localStorage.getItem("totalIncome")) || 0;
    const expense = parseFloat(localStorage.getItem("totalExpense")) || 0;
    const balance = income - expense;

    setStats({ totalIncome: income, totalExpense: expense, balance });

    const today = new Date().toISOString().split("T")[0];
    const prevData = JSON.parse(localStorage.getItem("ai_trend_data")) || [];

    const updatedData = [...prevData.filter((d) => d.date !== today), { date: today, income, expense }];
    localStorage.setItem("ai_trend_data", JSON.stringify(updatedData));

    const savingsRate = income > 0 ? (balance / income) * 100 : 0;
    const expenseRate = income > 0 ? (expense / income) * 100 : 0;
    const messages = [];

    // --- Core financial feedback ---
    if (income === 0 && expense === 0) {
      messages.push("No data yet. Add some transactions to get started!");
    } else {
      if (savingsRate >= 50) messages.push("💎 Excellent — you’re saving over half your income!");
      else if (savingsRate >= 20) messages.push("👏 Good job maintaining a healthy savings rate.");
      else if (savingsRate >= 0) messages.push("⚠️ You can improve your savings discipline.");
      else messages.push("🚨 Spending exceeds income — review your major expenses!");
    }

    // --- Expense trend feedback ---
    if (prevData.length > 3) {
      const lastExpense = prevData[prevData.length - 2]?.expense || 0;
      const trend = expense - lastExpense;
      const trendPercent = lastExpense ? ((trend / lastExpense) * 100).toFixed(1) : 0;
      if (trend > 0) messages.push(`📈 Expenses increased by ${trendPercent}% since yesterday.`);
      else if (trend < 0) messages.push(`📉 Expenses dropped by ${Math.abs(trendPercent)}% — great work!`);
    }

    // --- Category awareness ---
    const categoryData = JSON.parse(localStorage.getItem("category_spending")) || {};
    if (Object.keys(categoryData).length > 0) {
      const topCategory = Object.entries(categoryData).sort((a, b) => b[1] - a[1])[0];
      if (topCategory)
        messages.push(`🔥 Top spending category: ${topCategory[0]} — Ksh ${topCategory[1].toFixed(2)}.`);
    }

    // --- Score ---
    const score = Math.min(100, Math.max(0, Math.round(savingsRate + (100 - expenseRate) / 2)));
    setFinancialScore(score);

    // --- Forecast ---
    const forecastMsg = generateForecast(updatedData);
    if (forecastMsg) messages.push(forecastMsg.message);
    setForecast(forecastMsg);

    // --- Motivation ---
    const motivationMsg = generateMotivation(updatedData, savingsRate, expenseRate, score);
    setMotivation(motivationMsg);

    setInsights(messages);
  };

  // Forecast system
  const generateForecast = (data) => {
    if (data.length < 3) return null;

    const expenses = data.map((d) => d.expense);
    const incomes = data.map((d) => d.income);
    const avgExpense = expenses.reduce((a, b) => a + b, 0) / expenses.length;
    const avgIncome = incomes.reduce((a, b) => a + b, 0) / incomes.length;

    const dailyBalance = avgIncome - avgExpense;
    const daysElapsed = data.length;
    const estimatedMonthEnd = dailyBalance * 30;
    const confidence = Math.min(100, (daysElapsed / 30) * 100);

    const message =
      dailyBalance > 0
        ? `🧮 Forecast: You’re on track to save around Ksh ${estimatedMonthEnd.toFixed(
            2
          )} this month. Confidence: ${confidence.toFixed(0)}%.`
        : `⚠️ Forecast: You may end the month with a deficit of about Ksh ${Math.abs(
            estimatedMonthEnd
          ).toFixed(2)}. Confidence: ${confidence.toFixed(0)}%.`;

    return { message, confidence, estimatedMonthEnd, dailyBalance };
  };

  // Motivational engine — daily goals, streaks, tone adjustment
  const generateMotivation = (data, savingsRate, expenseRate, score) => {
    const today = new Date().toISOString().split("T")[0];
    const streakData = JSON.parse(localStorage.getItem("motivation_streak")) || {
      streak: 0,
      lastDate: null,
    };

    let newStreak = streakData.streak;

    if (streakData.lastDate !== today) {
      if (savingsRate >= 20 && expenseRate < 80) {
        newStreak += 1;
      } else {
        newStreak = 0;
      }
      localStorage.setItem("motivation_streak", JSON.stringify({ streak: newStreak, lastDate: today }));
    }

    // --- Choose tone based on streak and score ---
    if (newStreak >= 5)
      return `🔥 You’re unstoppable! ${newStreak}-day streak of solid budgeting. Keep the momentum rolling!`;
    if (score >= 80) return "💪 Outstanding! You’re managing your finances like a pro.";
    if (score >= 60) return "🌟 Doing well — keep tracking daily to strengthen your financial habits.";
    if (score >= 40) return "🧭 You're improving. Try cutting 10% of discretionary spending this week.";
    return "🩶 Don’t stress — review your top expenses and set a small daily goal for progress.";
  };

  useEffect(() => {
    fetchInsights();
    window.addEventListener("storage", fetchInsights);
    return () => window.removeEventListener("storage", fetchInsights);
  }, []);

  return (
    <div
      style={{
        background: "#1f2937",
        padding: "2rem",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        textAlign: "center",
        maxWidth: "600px",
        margin: "0 auto",
        color: "#f5f5f5",
      }}
    >
      <h2 style={{ marginBottom: "1rem", color: "#60a5fa" }}>AI Financial Insights</h2>
      <HealthGauge score={financialScore} />

      <div
        style={{
          marginTop: "1.5rem",
          background: "#111827",
          padding: "1rem",
          borderRadius: "12px",
          textAlign: "left",
        }}
      >
        <h3 style={{ marginBottom: "0.5rem", color: "#93c5fd" }}>Summary</h3>
        <p>💰 Income: Ksh {stats.totalIncome.toFixed(2)}</p>
        <p>💸 Expenses: Ksh {stats.totalExpense.toFixed(2)}</p>
        <p>📊 Balance: Ksh {stats.balance.toFixed(2)}</p>
      </div>

      <div
        style={{
          marginTop: "1rem",
          background: "#111827",
          padding: "1rem",
          borderRadius: "12px",
          textAlign: "left",
        }}
      >
        <h3 style={{ marginBottom: "0.5rem", color: "#60a5fa" }}>AI Insights</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {insights.map((msg, i) => (
            <li key={i} style={{ marginBottom: "0.6rem" }}>
              {msg}
            </li>
          ))}
        </ul>
      </div>

      {forecast && (
        <div
          style={{
            marginTop: "1.5rem",
            background: "#0f172a",
            padding: "1rem",
            borderRadius: "12px",
            border: `1px solid ${forecast.dailyBalance > 0 ? "#22c55e" : "#ef4444"}`,
          }}
        >
          <h3 style={{ color: forecast.dailyBalance > 0 ? "#22c55e" : "#ef4444" }}>📅 Month-End Forecast</h3>
          <p>{forecast.message}</p>
        </div>
      )}

      <div
        style={{
          marginTop: "1.5rem",
          background: "#0f172a",
          padding: "1rem",
          borderRadius: "12px",
          border: "1px solid #60a5fa",
        }}
      >
        <h3 style={{ color: "#60a5fa" }}>💬 Motivation</h3>
        <p>{motivation}</p>
      </div>
    </div>
  );
};

export default AiInsights;

