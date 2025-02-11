import { Line, LineChart, XAxis, YAxis } from 'recharts';

interface Props {
  data: any;
}

export default function Chart({ data }: Props) {
  return (
    <LineChart width={500} height={300} data={data.profileViews}>
      <XAxis dataKey="date" />
      <YAxis />
      <Line type="monotone" dataKey="views" stroke="#8884d8" />
    </LineChart>
  );
}
