import { useState, useEffect } from 'react';
import { Volume2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SpeakerSelectorProps {
  selectedDeviceId: string;
  onDeviceChange: (deviceId: string) => void;
}

interface AudioDevice {
  deviceId: string;
  label: string;
}

export const SpeakerSelector = ({
  selectedDeviceId,
  onDeviceChange,
}: SpeakerSelectorProps) => {
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [selectedLabel, setSelectedLabel] = useState('Default Speaker');

  useEffect(() => {
    const getDevices = async () => {
      try {
        // Prompt for mic permission so device labels are exposed for outputs too
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch {
          // ignore — labels may be empty
        }
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const audioOutputs = allDevices
          .filter((device) => device.kind === 'audiooutput')
          .map((device) => ({
            deviceId: device.deviceId,
            label: device.label || `Speaker ${device.deviceId.slice(0, 8)}`,
          }));
        setDevices(audioOutputs);

        if (audioOutputs.length > 0 && !selectedDeviceId) {
          onDeviceChange(audioOutputs[0].deviceId);
          setSelectedLabel(audioOutputs[0].label);
        }
      } catch (err) {
        console.error('Error accessing speakers:', err);
      }
    };

    getDevices();
  }, []);

  useEffect(() => {
    const device = devices.find((d) => d.deviceId === selectedDeviceId);
    if (device) {
      setSelectedLabel(device.label);
    }
  }, [selectedDeviceId, devices]);

  const truncateLabel = (label: string, maxLength: number = 20) => {
    if (label.length <= maxLength) return label;
    return label.slice(0, maxLength) + '...';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 h-9 w-[200px] justify-start bg-white border-[hsl(216_20%_90%)] text-foreground hover:bg-sidebar hover:border-primary/30"
        >
          <Volume2 className="h-4 w-4 stroke-[1.5] shrink-0" />
          <span className="flex-1 truncate text-xs font-medium text-left">
            {truncateLabel(selectedLabel)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-white border border-[hsl(216_20%_90%)]">
        {devices.map((device) => (
          <DropdownMenuItem
            key={device.deviceId}
            onClick={() => {
              onDeviceChange(device.deviceId);
              setSelectedLabel(device.label);
            }}
            className="flex items-center justify-between text-foreground hover:bg-sidebar"
          >
            <span className="truncate pr-2">{device.label}</span>
            {device.deviceId === selectedDeviceId && (
              <Check className="h-4 w-4 shrink-0 text-foreground stroke-[1.5]" />
            )}
          </DropdownMenuItem>
        ))}
        {devices.length === 0 && (
          <DropdownMenuItem disabled className="text-foreground/60">
            No speakers found
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
