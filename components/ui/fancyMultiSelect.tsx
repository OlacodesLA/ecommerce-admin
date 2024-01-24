import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

interface Framework {
  value: string;
  name: string;
}

interface FancyMultiSelectProps {
  selected: Framework[];
  onChange: (selected: Framework[]) => void;
  options: Framework[];
  placeholder: string;
}

export function FancyMultiSelect({
  selected,
  onChange,
  options,
  placeholder,
}: FancyMultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback(
    (framework: Framework) => {
      onChange(
        Array.isArray(selected)
          ? selected.filter((s) => s.value !== framework.value)
          : []
      );
    },
    [onChange, selected]
  );
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "" && selected.length > 0) {
            onChange(selected.slice(0, -1));
          }
        }
        // Prevent the form from submitting when pressing "Enter"
        if (e.key === "Enter") {
          e.preventDefault();
        }
        // This is not a default behavior of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [onChange, selected]
  );

  const selectables = options.filter(
    (framework) =>
      !Array.isArray(selected) ||
      !selected.some((s) => s.value === framework.value)
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected?.map((framework) => (
            <Badge key={framework.value} variant="secondary">
              {framework.name}
              <button
                style={{ backgroundColor: framework.value }}
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(framework);
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleUnselect(framework)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((framework) => (
                <CommandItem
                  key={framework.value}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onSelect={() => {
                    setInputValue("");
                    onChange([...selected, framework]);
                  }}
                  className={"cursor-pointer"}
                >
                  {framework.name}{" "}
                  <span
                    className="w-3 h-3 rounded-full ml-3 mt-1"
                    style={{ backgroundColor: framework.value }}
                  ></span>
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
