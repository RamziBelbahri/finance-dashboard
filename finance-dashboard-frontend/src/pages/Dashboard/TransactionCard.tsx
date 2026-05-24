import type { Transaction } from "../../types/transaction";

export default function TransactionCard({ amount, description, transactionDate, type }: Transaction) {
  return (
    <div>
      <h4>{description}</h4>
      <p>{transactionDate}</p>
      <p>{type}</p>

      <strong style={{
        color:
          type === "INCOME"
            ? "green"
            : "red"
      }}>
        ${amount.toFixed(2)}
      </strong>
    </div>
  );
}