import type { SummaryCardProps } from "../../types/transaction";

export default function SummaryCard( {title, color, value} : SummaryCardProps) {
    return(
        <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="text-gray-500">{title}</h3>
            <p className={`text-2xl font-bold ${color}`}>${value.toFixed(2)}</p>
          </div>
    );
}