import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface MetricSliderProps {
  label: string;
  value: number[];
  setValue: (val: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
}

const MetricSlider: React.FC<MetricSliderProps> = ({
  label,
  value,
  setValue,
  min = 0,
  max = 10,
  step = 1,
  minLabel = "Low",
  maxLabel = "High",
}) => {
  return (
    <div className="space-y-4">
      <Label>
        {label}
        <span className="text-sm text-gray-500 ml-2">
          ({value[0]}/{max})
        </span>
      </Label>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">{minLabel}</span>
        <Slider
          value={value}
          onValueChange={setValue}
          min={min}
          max={max}
          step={step}
          className="flex-1"
        />
        <span className="text-sm text-gray-500">{maxLabel}</span>
      </div>
    </div>
  );
};

export default MetricSlider;
