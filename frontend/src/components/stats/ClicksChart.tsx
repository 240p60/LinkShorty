import type { ChartDataPoint } from "@app/types";
import { Card } from "@components/common/Card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ClicksChartProps {
  data: ChartDataPoint[];
}

export function ClicksChart({ data }: ClicksChartProps) {
  const hasData = data.some((d) => d.clicks > 0);

  return (
    <Card>
      <h3 className="text-sm font-medium text-gray-300 mb-4">Клики за 7 дней</h3>
      {hasData ? (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <XAxis
                dataKey="date"
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
                axisLine={{ stroke: "#374151" }}
              />
              <YAxis
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
                axisLine={{ stroke: "#374151" }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F3F4F6",
                }}
                labelStyle={{ color: "#9CA3AF" }}
              />
              <Bar dataKey="clicks" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
          Данных о кликах пока нет
        </div>
      )}
    </Card>
  );
}
