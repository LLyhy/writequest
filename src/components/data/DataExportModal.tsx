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
    &lt;div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"&gt;
      &lt;PixelPanel className="max-w-md w-full max-h-[80vh] overflow-y-auto"&gt;
        &lt;div className="flex items-center justify-between mb-4"&gt;
          &lt;h2 className="text-xl font-pixel text-white"&gt;导出数据&lt;/h2&gt;
          &lt;PixelButton variant="secondary" size="sm" onClick={handleClose}&gt;
            &lt;X size={16} /&gt;
          &lt;/PixelButton&gt;
        &lt;/div&gt;

        {exported ? (
          &lt;div className="text-center py-8"&gt;
            &lt;CheckCircle2 size={48} className="mx-auto text-green-400 mb-4" /&gt;
            &lt;p className="text-white mb-4"&gt;导出成功！&lt;/p&gt;
            &lt;PixelButton variant="primary" onClick={handleClose}&gt;
              关闭
            &lt;/PixelButton&gt;
          &lt;/div&gt;
        ) : (
          &lt;&gt;
            &lt;div className="space-y-3 mb-6"&gt;
              &lt;p className="text-gray-300 text-sm"&gt;选择要导出的数据：&lt;/p&gt;
              {Object.entries(exportOptions).map(([key, value]) =&gt; (
                &lt;label key={key} className="flex items-center gap-3 cursor-pointer"&gt;
                  &lt;input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =&gt; setExportOption(key as any, e.target.checked)}
                    className="w-4 h-4"
                  /&gt;
                  &lt;span className="text-gray-200 text-sm"&gt;
                    {key.replace('include', '')}
                  &lt;/span&gt;
                &lt;/label&gt;
              ))}
            &lt;/div&gt;
            &lt;div className="flex gap-3"&gt;
              &lt;PixelButton variant="secondary" onClick={handleClose} className="flex-1"&gt;
                取消
              &lt;/PixelButton&gt;
              &lt;PixelButton variant="primary" onClick={handleExport} className="flex-1"&gt;
                &lt;Download size={16} className="mr-2" /&gt;
                导出
              &lt;/PixelButton&gt;
            &lt;/div&gt;
          &lt;/&gt;
        )}
      &lt;/PixelPanel&gt;
    &lt;/div&gt;
  );
}
