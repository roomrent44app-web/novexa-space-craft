import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminSelect({ value, onChange, options, label }: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  label: string;
}) {
  return <Select value={value} onValueChange={onChange}>
    <SelectTrigger aria-label={label} className="admin-select"><SelectValue /></SelectTrigger>
    <SelectContent>{options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
  </Select>;
}