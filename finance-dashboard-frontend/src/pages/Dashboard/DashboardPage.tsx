import { getSummary, getTransactions } from "../../api/transactions";
import TransactionCard from "./TransactionCard";
import CreateTransaction from "./CreateTransaction";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import SummaryCard from "./SummaryCard";

export default function DashboardPage() {
  const [filter, setFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
  const {
    data: transactions = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["transactions", filter],
    queryFn: () => getTransactions(filter)
  });

  const { data: summary } = useQuery({
    queryKey: ["transactions-summary"],
    queryFn: getSummary
  });

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
          <SummaryCard title="Balance" color="text-600" value={summary?.balance ?? 0} />
          <SummaryCard title="Income" color="text-green-600" value={summary?.totalIncome ?? 0} />
          <SummaryCard title="Expense" color="text-red-600" value={summary?.totalExpense ?? 0} />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value as "ALL" | "INCOME" | "EXPENSE")}>
          <option value="ALL" >ALL</option>
          <option value="INCOME" >INCOME</option>
          <option value="EXPENSE" >EXPENSE</option>
        </select>
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