import type { Transaction } from "../../types/transaction";
import { formatCurrency, formatStringDate } from "../../utils/formatters";

export default function TransactionCard({ amount, description, transactionDate, type }: Transaction) {
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4 flex justify-between items-center">
      <h3 className="font-semibold">{description}</h3>
      <p className="text-sm text-gray-500">{formatStringDate(transactionDate)}</p>
      <div className="text-right">
        <p className={
          type === "INCOME"
          ? "text-green-600 font-bold"
          : "text-red-600 font-bold"
        }>
          {formatCurrency(amount)}
        </p>
        <p className="text-sm text-gray-500">{type}</p>
      </div>
    </div>
  );
}