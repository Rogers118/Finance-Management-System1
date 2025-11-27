import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TransactionForm from './TransactionForm';
import BudgetForm from './BudgetForm';
import TransactionList from './TransactionList';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../services/api';
import AiInsights from './AiInsights';
import './Dashboard.css';
import '../styles/fintech.css';
import { FiLogOut } from 'react-icons/fi';






import AiCoachChat from './AiCoachChat';


ChartJS.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const Dashboard = ({ setAuth }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [balance, setBalance] = useState(0);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [lineChartData, setLineChartData] = useState({ labels: [], datasets: [] });
  const [chartType, setChartType] = useState('pie');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const transRes = await api.get('/transaction');
      setTransactions(transRes.data);
      const budgetRes = await api.get('/budget');
      setBudgets(budgetRes.data);

      const totalIncome = transRes.data
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const totalExpense = transRes.data
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      setBalance(totalIncome - totalExpense);

      localStorage.setItem('totalIncome', totalIncome.toString());
      localStorage.setItem('totalExpense', totalExpense.toString());

      const expenseCategories = {};
      transRes.data
        .filter((t) => t.type === 'expense')
        .forEach((t) => {
          expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
        });
      setChartData({
        labels: Object.keys(expenseCategories),
        datasets: [
          {
            label: 'Expenses by Category',
            data: Object.values(expenseCategories),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          },
        ],
      });

      const dates = [...new Set(transRes.data.map((t) => new Date(t.date).toLocaleDateString()))].sort();
      const expenseByDate = dates.map((date) => {
        return transRes.data
          .filter((t) => t.type === 'expense' && new Date(t.date).toLocaleDateString() === date)
          .reduce((sum, t) => sum + t.amount, 0);
      });
      setLineChartData({
        labels: dates,
        datasets: [
          {
            label: 'Expenses Over Time (Ksh)',
            data: expenseByDate,
            borderColor: '#36A2EB',
            tension: 0.2,
          },
        ],
      });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setAuth(false);
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    navigate('/login');
  };

  const userId = localStorage.getItem('userId');

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">💸 SmartBudget</h2>
        <nav className="sidebar-nav">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Overview</button>
          <button onClick={() => document.getElementById('transactions').scrollIntoView()}>Transactions</button>
          <button onClick={() => document.getElementById('charts').scrollIntoView()}>Charts</button>
          <button onClick={() => document.getElementById('insights').scrollIntoView()}>AI Insights</button>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Manage your finances smartly with live analytics.</p>
        </header>

        {/* Balance Cards */}
        <section className="cards">
          <div className="card">
            <h3>Total Balance</h3>
            <p className="value green">Ksh {balance.toFixed(2)}</p>
          </div>
          <div className="card">
            <h3>Total Income</h3>
            <p className="value">Ksh {transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</p>
          </div>
          <div className="card">
            <h3>Total Expenses</h3>
            <p className="value red">Ksh {transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</p>
          </div>
        </section>

        {/* Forms */}
        <section className="forms">
          <div className="form-box">
            <h3>Add Transaction</h3>
            <TransactionForm refreshData={fetchData} />
          </div>
          <div className="form-box">
            <h3>Set Budget</h3>
            <BudgetForm refreshData={fetchData} />
          </div>
        </section>

        {/* Transactions */}
        <section id="transactions" className="transactions">
          <h3>Transactions</h3>
          {loading ? <p>Loading...</p> : (
            <TransactionList transactions={transactions} budgets={budgets} refreshData={fetchData} />
          )}
        </section>

        {/* Charts */}
        <section id="charts" className="charts">
          <div className="chart-header">
            <h3>Expense Insights</h3>
            <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
              <option value="pie">Pie Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
            </select>
          </div>
          {loading ? <p>Loading charts...</p> : (
            <div className="chart-box">
              {chartType === 'pie' ? <Pie data={chartData} /> :
               chartType === 'bar' ? <Bar data={chartData} /> :
               <Line data={lineChartData} />}
            </div>
          )}
        </section>

        {/* AI Insights */}
        <section id="insights" className="insights">
          <AiInsights userId={userId} />
        </section>
      </main>
     <AiCoachChat
  stats={{
    totalIncome: transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpense: transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0),
    balance: balance,
  }}
/>


    </div>
  );
};

export default Dashboard;
