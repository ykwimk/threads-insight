import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '../ui/chart';

interface Props {
  data: Array<{ [key: string]: any }>;
  config?: { [key: string]: any };
  nameKey?: string;
}

export default function Chart({
  data,
  config = {
    desktop: {
      label: 'Desktop',
      color: 'hsl(var(--chart-1))',
    },
    mobile: {
      label: 'Mobile',
      color: 'hsl(var(--chart-2))',
    },
  },
  nameKey,
}: Props) {
  if (data.length === 0) {
    return <p className="text-center text-gray-500">📉 데이터 없음</p>;
  }

  return (
    <ChartContainer className="min-h-[250px] w-full" config={config}>
      <LineChart data={data} width={500} height={250}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(5)}
        />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="views"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          name={nameKey}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
