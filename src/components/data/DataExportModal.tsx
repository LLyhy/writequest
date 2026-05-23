import { useState } from 'react';
import { useDataExportStore } from '../../stores';
import { PixelPanel } from '../ui/PixelPanel';
import { PixelButton } from '../ui/PixelButton';
import { X, Download, CheckCircle2 } from 'lucide-react';

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DataExportModal({ isOpen, onClose }: DataExportModalProps) {
  const { exportOptions, setExportOption, exportData, resetAllOptions } = useDataExportStore();
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `writequest-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExported(true);
  };

  const handleClose = () => {
    resetAllOptions();
    setExported(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <PixelPanel className="max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-pixel text-white">导出数据</h2>
          <PixelButton variant="secondary" size="sm" onClick={handleClose}>
            <X size={16} />
          </PixelButton>
        </div>

        {exported ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="mx-auto text-green-400 mb-4" />
            <p className="text-white mb-4">导出成功！</p>
            <PixelButton variant="primary" onClick={handleClose}>
              关闭
            </PixelButton>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              <p className="text-gray-300 text-sm">选择要导出的数据：</p>
              {Object.entries(exportOptions).map(([key, value]) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setExportOption(key as any, e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-200 text-sm">
                    {key.replace('include', '')}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <PixelButton variant="secondary" onClick={handleClose} className="flex-1">
                取消
              </PixelButton>
              <PixelButton variant="primary" onClick={handleExport} className="flex-1">
                <Download size={16} className="mr-2" />
                导出
              </PixelButton>
            </div>
          </>
        )}
      </PixelPanel>
    </div>
  );
}
