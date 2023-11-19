import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectItem = {
  label: string;
  value: string;
};

type SelectProps = {
  items: SelectItem[];
};

export function SelectItems({ items }: SelectProps) {
  return (
    <Select defaultValue={items[0].value}>
      <SelectTrigger className="w-[180px] border-gray-600 focus:border-background">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem value={item.value} key={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
