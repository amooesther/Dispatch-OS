"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { mockStatusBreakdown } from "@/mocks";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = [
  "var(--success)",
  "var(--primary)",
  "var(--warning)",
  "var(--info)",
  "var(--danger)",
  "#8b5cf6",
];

export function StatusChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Status</CardTitle>
      </CardHeader>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mockStatusBreakdown}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={72}
              dataKey="count"
              nameKey="status"
              paddingAngle={2}
            >
              {mockStatusBreakdown.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: 12,
              }}
              formatter={(v, name) => [`${v as number} orders`, name as string]}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ color: "var(--muted)", fontSize: 11 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
