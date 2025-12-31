'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface DownloadBackupButtonProps {
  backupData: any;
}

export function DownloadBackupButton({ backupData }: DownloadBackupButtonProps) {
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculators-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="default" onClick={handleDownload} className="w-full md:w-auto">
      <Download className="h-4 w-4 mr-2" />
      Download JSON
    </Button>
  );
}

