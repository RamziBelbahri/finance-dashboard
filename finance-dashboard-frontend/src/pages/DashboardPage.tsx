import { useEffect, useState, type ChangeEvent } from "react";
import { getTransactions, type CreateTransactionRequest } from "../api/transactions";
import { TRANSACTION_URL, type Transaction, type TransactionType } from "../types/transaction";
import api from "../api/axios";

function TransactionCard({ amount, description, transactionDate, type }: Transaction) {
  return (
    <>
      <p>{amount}</p>
      <p>{description}</p>
      <p>{transactionDate}</p>
      <p>{type}</p>
    </>
  );
}

function CreateTransaction({ loadTransactions }: { loadTransactions: () => Promise<void> }) {
  const [transactionDetails, setTransactionDetails] = useState({
    amount: "",
    description: "",
    date: "",
    type: "EXPENSE" as TransactionType
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;

    setTransactionDetails(prev => {
      return {
        ...prev,
        [name]: value
      }
    })
  };

  const handleSubmit = async () => {
    try {
      const newTransaction: CreateTransactionRequest = {...transactionDetails, amount: Number(transactionDetails.amount), transactionDate: transactionDetails.date};
      await api.post(TRANSACTION_URL, newTransaction);
      await loadTransactions();
      setTransactionDetails(
        {
          amount: "",
          description: "",
          date: "",
          type: "EXPENSE"
        }
      )
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <input name="amount" type="number" value={transactionDetails.amount} onChange={handleChange} placeholder="Amount" />
      <input name="description" type="text" value={transactionDetails.description} onChange={handleChange} placeholder="Description" />
      <input name="date" type="date" value={transactionDetails.date} onChange={handleChange} placeholder="date created" />
      <select name="type" value={transactionDetails.type} onChange={handleChange}>
        <option value="EXPENSE">
          Expense
        </option>
        <option value="INCOME">
          Income
        </option>
      </select>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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
      <h2>Dasheboard</h2>
      <div>
        Create Transaction Form:
        <CreateTransaction loadTransactions={loadTransactions} />
      </div>
      {
        transactions.map((transaction) => {
          return <TransactionCard id={transaction.id} amount={transaction.amount} description={transaction.description} transactionDate={transaction.transactionDate}
            type={transaction.type} key={transaction.id} />
        })
      }
    </>
  );


}