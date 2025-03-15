import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export function DatePickerWithPresets({ date, setDate }) {
  const [selectedPreset, setSelectedPreset] = React.useState("")

  const presets = [
    {
      name: "Today",
      value: new Date(),
    },
    {
      name: "Yesterday",
      value: new Date(Date.now() - 86400000),
    },
    {
      name: "Last 7 days",
      value: new Date(Date.now() - 7 * 86400000),
    },
    {
      name: "Last 30 days",
      value: new Date(Date.now() - 30 * 86400000),
    },
    {
      name: "Last 90 days",
      value: new Date(Date.now() - 90 * 86400000),
    },
    {
      name: "Current year",
      value: new Date(new Date().getFullYear(), 0, 1),
    },
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <Select
          defaultValue={selectedPreset}
          onValueChange={(value) => {
            setSelectedPreset(value)
            const selectedPreset = presets.find(preset => preset.name === value)
            if (selectedPreset) {
              setDate(selectedPreset.value)
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            {presets.map((preset) => (
              <SelectItem key={preset.name} value={preset.name}>
                {preset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </div>
      </PopoverContent>
    </Popover>
  )
}