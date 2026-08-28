// Defines the data required by the MetricCard component.
type MetricCardProps = {
  label: string;
  value: number;
};

// Displays a single dashboard metric.
export default function MetricCard({
  label,
  value,
}: MetricCardProps) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-gray-900">
        {value}
      </p>
    </article>
  );
}