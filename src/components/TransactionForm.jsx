import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const TransactionForm = ({ refreshData, checkBudgetAlerts }) => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const parsedAmount = parseFloat(amount);
      await api.post('/transaction', { type, amount: parsedAmount, category, description });
      toast.success('✅ Transaction added successfully!');
      checkBudgetAlerts(category, parsedAmount, type);
      refreshData();
      setAmount('');
      setCategory('');
      setDescription('');
    } catch (err) {
      console.error('Error adding transaction:', err.response?.data || err.message);
      toast.error(err.response?.data?.msg || '⚠️ Error adding transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-3 bg-gray-900 p-4 rounded-lg shadow-md border border-gray-800"
    >
      <div className="flex flex-col">
        <label className="text-sm text-gray-300 mb-1">Transaction Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          disabled={loading}
          className={`p-2 rounded-md border ${
            type === 'income'
              ? 'bg-green-900/30 border-green-700 text-green-300'
              : 'bg-red-900/30 border-red-700 text-red-300'
          } focus:outline-none`}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-300 mb-1">Amount (Ksh)</label>
        <input
          type="number"
          placeholder="Enter amount in Ksh"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          disabled={loading}
          className="p-2 rounded-md bg-gray-800 text-gray-100 placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-300 mb-1">Category</label>
        <input
          type="text"
          placeholder="e.g., Food, Transport, Rent"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          disabled={loading}
          className="p-2 rounded-md bg-gray-800 text-gray-100 placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-300 mb-1">Description</label>
        <input
          type="text"
          placeholder="Optional note (e.g., dinner at Java)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          className="p-2 rounded-md bg-gray-800 text-gray-100 placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`mt-2 p-2 rounded-md text-white font-medium transition ${
          loading
            ? 'bg-gray-700 cursor-not-allowed'
            : type === 'income'
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        {loading ? 'Adding...' : '💰 Add Transaction'}
      </button>
    </form>
  );
};

export default TransactionForm;
