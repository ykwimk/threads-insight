import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Props {
  title: string;
  description?: string;
  value: number | string;
}

export default function UserInsightsCard({ title, description, value }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value || 0}</p>
      </CardContent>
    </Card>
  );
}
