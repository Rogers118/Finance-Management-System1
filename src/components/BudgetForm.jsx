import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import '../styles/fintech.css';
import { FiLogOut } from 'react-icons/fi';

const BudgetForm = ({ refreshData }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/budget', { category, amount: parseFloat(amount) });
      toast.success('✅ Budget set successfully!');
      refreshData();
      setCategory('');
      setAmount('');
    } catch (err) {
      toast.error('⚠️ Error setting budget');
      console.error(err);
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
        <label className="text-sm text-gray-300 mb-1">Budget Amount (Ksh)</label>
        <input
          type="number"
          placeholder="Enter amount in Ksh"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          disabled={loading}
          className="p-2 rounded-md bg-gray-800 text-gray-100 placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-green-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`mt-2 p-2 rounded-md text-white font-medium transition ${
          loading
            ? 'bg-gray-700 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {loading ? 'Setting...' : '💾 Set Budget'}
      </button>
    </form>
  );
};

export default BudgetForm;
