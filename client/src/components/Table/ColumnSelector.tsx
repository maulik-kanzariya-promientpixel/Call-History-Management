import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EXTRA_COLUMNS, type ExtraColumnKey } from "@/utils/table/columns";
import { SlidersHorizontal } from "lucide-react";

interface Props {
  selected: ExtraColumnKey[];
  onChange: (cols: ExtraColumnKey[]) => void;
}

const ColumnSelector = ({ selected, onChange }: Props) => {
  const toggle = (key: ExtraColumnKey) => {
    onChange(
      selected.includes(key)
        ? selected.filter((k) => k !== key)
        : [...selected, key]
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Columns
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {EXTRA_COLUMNS.map((col) => (
          <DropdownMenuCheckboxItem
            key={col.key}
            checked={selected.includes(col.key)}
            onCheckedChange={() => toggle(col.key)}
          >
            {col.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColumnSelector;
