import { useState, useEffect } from 'react';
import { Mic, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface MicrophoneSelectorProps {
  selectedDeviceId: string;
  onDeviceChange: (deviceId: string) => void;
  audioLevel: number; // 0-100
}

interface AudioDevice {
  deviceId: string;
  label: string;
}

export const MicrophoneSelector = ({
  selectedDeviceId,
  onDeviceChange,
  audioLevel,
}: MicrophoneSelectorProps) => {
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [selectedLabel, setSelectedLabel] = useState('Default Microphone');

  useEffect(() => {
    const getDevices = async () => {
      try {
        // Request permission first
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = allDevices
          .filter(device => device.kind === 'audioinput')
          .map(device => ({
            deviceId: device.deviceId,
            label: device.label || `Microphone ${device.deviceId.slice(0, 8)}`,
          }));
        setDevices(audioInputs);
        
        if (audioInputs.length > 0 && !selectedDeviceId) {
          onDeviceChange(audioInputs[0].deviceId);
          setSelectedLabel(audioInputs[0].label);
        }
      } catch (err) {
        console.error('Error accessing microphones:', err);
      }
    };

    getDevices();
  }, []);

  useEffect(() => {
    const device = devices.find(d => d.deviceId === selectedDeviceId);
    if (device) {
      setSelectedLabel(device.label);
    }
  }, [selectedDeviceId, devices]);

  const truncateLabel = (label: string, maxLength: number = 20) => {
    if (label.length <= maxLength) return label;
    return label.slice(0, maxLength) + '...';
  };

  // Audio level bars (5 bars)
  const renderAudioLevels = () => {
    const activeThresholds = [10, 25, 45, 65, 85];
    
    return (
      <div className="flex items-end gap-0.5 h-4">
        {activeThresholds.map((threshold, i) => (
          <div
            key={i}
            className={cn(
              "w-1 rounded-sm transition-all duration-75",
              audioLevel >= threshold ? "bg-brand" : "bg-foreground/20"
            )}
            style={{ height: `${(i + 1) * 20}%` }}
          />
        ))}
      </div>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 h-9 w-[200px] justify-start bg-white border-[hsl(216_20%_90%)] text-foreground hover:bg-sidebar hover:border-primary/30"
        >
          <Mic className="h-4 w-4 stroke-[1.5] shrink-0" />
          <span className="flex-1 truncate text-xs font-medium text-left">
            {truncateLabel(selectedLabel)}
          </span>
          {renderAudioLevels()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-white border border-[hsl(216_20%_90%)]">
        {devices.map(device => (
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
            No microphones found
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
