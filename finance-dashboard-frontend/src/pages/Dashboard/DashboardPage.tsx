import { getTransactions } from "../../api/transactions";
import TransactionCard from "./TransactionCard";
import CreateTransaction from "./CreateTransaction";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function DashboardPage() {
  const {
    data: transactions = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions
  });

  const summary = useMemo(() => transactions.reduce((acc, cur) => {
    (cur.type === "INCOME") ? acc.income += cur.amount : acc.expense += cur.amount;
    return acc;
  }
    , {
      income: 0,
      expense: 0
    })
    , [transactions])
  const balance = useMemo(() =>
    (summary.income - summary.expense), [transactions]);
  const sortedTransactions = useMemo(() =>
    [...transactions].sort(
      (a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
    )
    , [transactions]);

  return (
    <div className="min-h-screen bg-blue-200 p-6 text-black">
      <div className="max-w-5x1 mx-auto">
        <h1 className="text-center text-3xl text-white font-bold bg-blue-700 rounded-xl p-2 mb-4">Finance Dashboard</h1>
        <div>
          <CreateTransaction />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="text-gray-500">Balance</h3>
            <p className="text-2xl font-bold text-600">${balance.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="text-gray-500">Income</h3>
            <p className="text-2xl font-bold text-green-600">${summary.income.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="text-gray-500">Expenses</h3>
            <p className="text-2xl font-bold text-red-600">${summary.expense.toFixed(2)}</p>
          </div>
        </div>
        {
          (error && !isLoading) &&
          <div className="text-red-400 text-center mt-10">
            {error.message}
            <button
              className="block mt-3 text-blue-400 underline"
              onClick={() => refetch()}
            >
              Retry
            </button>
          </div>
        }
        {
          (isLoading) &&
          <div className="text-white text-center mt-10">
            Loading transactions...
          </div>
        }
        {
          (!isLoading && transactions.length === 0) && (
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