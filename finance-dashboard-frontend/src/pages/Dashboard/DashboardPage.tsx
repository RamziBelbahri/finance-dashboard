import { useEffect, useState } from "react";
import { getTransactions } from "../../api/transactions";
import { type Transaction } from "../../types/transaction";
import TransactionCard from "./TransactionCard";
import CreateTransaction from "./CreateTransaction";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const totalIncome = transactions.filter(t => t.type === "INCOME").reduce((acc, cur) => acc += cur.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "EXPENSE").reduce((acc, cur) => acc += cur.amount, 0);
  const balance = totalIncome - totalExpense;
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
  )

  const loadTransactions = async () => {
    try {
      const transactions = await getTransactions();
      setTransactions(transactions);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-blue-200 p-6 text-black">
      <div className="max-w-5x1 mx-auto">
        <h1 className="text-center text-3xl text-white font-bold bg-blue-700 rounded-xl p-2 mb-4">Finance Dashboard</h1>
        <div>
          <CreateTransaction loadTransactions={loadTransactions} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="text-gray-500">Balance</h3>
            <p className="text-2xl font-bold text-600">${balance.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="text-gray-500">Income</h3>
            <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="text-gray-500">Expenses</h3>
            <p className="text-2xl font-bold text-red-600">${totalExpense.toFixed(2)}</p>
          </div>
        </div>
        {
          transactions.length === 0 && (
            <div className="bg-white rounded-xl p-6 text-center text-gray-500">
              No transactions yet.
            </div>
          )
        }
        {
          sortedTransactions.map((transaction) => {
            return <TransactionCard id={transaction.id} amount={transaction.amount} description={transaction.description} transactionDate={transaction.transactionDate}
              type={transaction.type} key={transaction.id} />
          })
        }
      </div>
    </div>
  );


}