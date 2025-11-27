import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

// ✅ Currency formatter for Kenyan Shillings
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2
    }).format(amount);
};

const TransactionList = ({ transactions, budgets, refreshData, checkBudgetAlerts }) => {
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    const handleEdit = (trans) => {
        setEditingId(trans._id);
        setEditForm({
            type: trans.type,
            amount: trans.amount,
            category: trans.category,
            description: trans.description || ''
        });
    };

    const handleUpdate = async (id) => {
        try {
            await api.put(`/transactions/${id}`, editForm);
            setEditingId(null);
            toast.success('Transaction updated successfully!');
            checkBudgetAlerts(editForm.category, editForm.amount, editForm.type);
            refreshData();
        } catch (err) {
            toast.error('Error updating transaction');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/transaction/${id}`);
            toast.success('Transaction deleted successfully!');
            refreshData();
        } catch (err) {
            toast.error('Error deleting transaction');
            console.error(err);
        }
    };

    const getBudgetStatus = (category) => {
        const budget = budgets.find(b => b.category === category);
        if (!budget) return '';
        const spent = transactions
            .filter(t => t.category === category && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        return `Spent: ${formatCurrency(spent)} / ${formatCurrency(budget.amount)}`;
    };

    return (
        <table>
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Amount (KSh)</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Budget Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map(trans => (
                    <tr key={trans._id}>
                        {editingId === trans._id ? (
                            <>
                                <td>
                                    <select
                                        value={editForm.type}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, type: e.target.value })
                                        }
                                    >
                                        <option value="income">Income</option>
                                        <option value="expense">Expense</option>
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={editForm.amount}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                amount: parseFloat(e.target.value),
                                            })
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={editForm.category}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                category: e.target.value,
                                            })
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={editForm.description}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                description: e.target.value,
                                            })
                                        }
                                    />
                                </td>
                                <td>{new Date(trans.date).toLocaleDateString()}</td>
                                <td>{getBudgetStatus(editForm.category)}</td>
                                <td>
                                    <button onClick={() => handleUpdate(trans._id)}>Save</button>
                                    <button onClick={() => setEditingId(null)}>Cancel</button>
                                </td>
                            </>
                        ) : (
                            <>
                                <td>{trans.type}</td>
                                <td>{formatCurrency(trans.amount)}</td>
                                <td>{trans.category}</td>
                                <td>{trans.description}</td>
                                <td>{new Date(trans.date).toLocaleDateString()}</td>
                                <td>{getBudgetStatus(trans.category)}</td>
                                <td>
                                    <button onClick={() => handleEdit(trans)}>Edit</button>
                                    <button onClick={() => handleDelete(trans._id)}>Delete</button>
                                </td>
                            </>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TransactionList;

