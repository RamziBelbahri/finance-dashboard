import type { Transaction } from "../../types/transaction";

export default function TransactionCard({ amount, description, transactionDate, type }: Transaction) {
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4 flex justify-between items-center">
      <h3 className="font-semibold">{description}</h3>
      <p className="text-sm text-gray-500">{transactionDate}</p>
      <div className="text-right">
        <p className={
          type === "INCOME"
          ? "text-green-600 font-bold"
          : "text-red-600 font-bold"
        }>
          ${amount.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">{type}</p>
      </div>
    </div>
  );
}