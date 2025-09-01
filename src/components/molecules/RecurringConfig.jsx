import React from "react";
import FormField from "@/components/molecules/FormField";
import Checkbox from "@/components/atoms/Checkbox";
import Label from "@/components/atoms/Label";
import { cn } from "@/utils/cn";

const RecurringConfig = ({
  isRecurring = false,
  frequency = "daily",
  selectedDays = [],
  recurringTime = "09:00",
  onToggleRecurring,
  onFrequencyChange,
  onDaysChange,
  onTimeChange,
  errors = {}
}) => {
  const weekDays = [
    { value: "monday", label: "Mon" },
    { value: "tuesday", label: "Tue" },
    { value: "wednesday", label: "Wed" },
    { value: "thursday", label: "Thu" },
    { value: "friday", label: "Fri" },
    { value: "saturday", label: "Sat" },
    { value: "sunday", label: "Sun" }
  ];

  const handleDayToggle = (day) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    onDaysChange(newDays);
  };

  if (!isRecurring) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={isRecurring}
            onChange={onToggleRecurring}
            id="recurring-toggle"
          />
          <Label htmlFor="recurring-toggle" className="text-sm font-medium text-gray-700">
            Make this a recurring task
          </Label>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <Checkbox
          checked={isRecurring}
          onChange={onToggleRecurring}
          id="recurring-toggle"
        />
        <Label htmlFor="recurring-toggle" className="text-sm font-medium text-gray-700">
          Make this a recurring task
        </Label>
      </div>

      <div className="pl-7 space-y-4">
        <FormField
          label="Frequency"
          type="select"
          value={frequency}
          onChange={(e) => onFrequencyChange(e.target.value)}
          error={errors.frequency}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom</option>
        </FormField>

        {(frequency === "weekly" || frequency === "custom") && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Select Days {frequency === "weekly" ? "(Weekly)" : "(Custom)"}
            </Label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => handleDayToggle(day.value)}
                  className={cn(
                    "px-3 py-2 text-sm rounded-md border transition-colors",
                    selectedDays.includes(day.value)
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  )}
                >
                  {day.label}
                </button>
              ))}
            </div>
            {errors.selectedDays && (
              <p className="text-sm text-red-600">{errors.selectedDays}</p>
            )}
          </div>
        )}

        <FormField
          label="Time"
          type="time"
          value={recurringTime}
          onChange={(e) => onTimeChange(e.target.value)}
          error={errors.recurringTime}
        />
      </div>
    </div>
  );
};

export default RecurringConfig;