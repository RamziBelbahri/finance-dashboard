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
    <>
      <h2>Dashboard</h2>
      <div>
        Create Transaction Form:
        <CreateTransaction loadTransactions={loadTransactions} />
      </div>
      <div>
        <h3>Balance : ${balance.toFixed(2)}</h3>
        <h4>Income: ${totalIncome.toFixed(2)}</h4>
        <h4>Expenses: ${totalExpense.toFixed(2)}</h4>
      </div>
      {
        transactions.length === 0 && (
          <p>
            No transactions yet.
          </p>
        )
      }
      {
        sortedTransactions.map((transaction) => {
          return <TransactionCard id={transaction.id} amount={transaction.amount} description={transaction.description} transactionDate={transaction.transactionDate}
            type={transaction.type} key={transaction.id} />
        })
      }
    </>
  );


}