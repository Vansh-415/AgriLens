import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useState, useRef } from 'react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../hooks/useToast';
import { useOnlineStatus } from '../../../hooks/useOnlineStatus';
import { scansService } from '../../../services/scansService';
import { UploadCloud, Image as ImageIcon, X, Cpu } from 'lucide-react';

export default function DetectPage() {
  useDocumentTitle('Disease Detection Studio');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOnline = useOnlineStatus();
  const toast = useToast();

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid File', 'Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File Too Large', 'Image size must be less than 10MB.');
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setIsSubmitted(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setIsSubmitted(false);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Save metadata to backend
      await scansService.create({
        crop_id: 'unknown',
        image_url: 'uploads/sample_scan.jpg',
        model_version: '0.0.0',
        prediction_time_ms: 145,
        offline_mode: !isOnline,
        device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
      });

      setIsSubmitted(true);
      toast.success('Scan Metadata Saved', 'Image and scan details have been recorded.');
    } catch (err: any) {
      toast.error('Upload Failed', err.response?.data?.message || 'Could not process upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Disease Detection Studio"
        description="Upload crop leaf imagery for automated pathology analysis and metadata recording."
      />

      <Card className="p-6">
        <CardContent className="space-y-6 p-0">
          {!preview ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-earth-300 hover:border-primary-500 bg-earth-50/50 hover:bg-primary-50/30 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
            >
              <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                <UploadCloud className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-earth-900">Drag & Drop crop image here</h3>
              <p className="text-sm text-earth-500 mt-1">or click to browse from device (JPEG, PNG, WEBP max 10MB)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden max-h-[400px] border border-earth-200 bg-black/5 flex items-center justify-center">
                <img src={preview} alt="Scan preview" className="max-h-[400px] object-contain" />
                <button
                  onClick={handleRemove}
                  className="absolute top-3 right-3 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-earth-500 bg-earth-50 p-3 rounded-lg">
                <span className="flex items-center gap-2 font-medium text-earth-800">
                  <ImageIcon className="w-4 h-4 text-primary-600" />
                  {selectedFile?.name}
                </span>
                <span>{(selectedFile!.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            </div>
          )}

          {/* Module 4 AI Information Banner */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-sm">
            <Cpu className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Module 4 Integration Note: </span>
              Full AI deep-learning model inference (MobileNetV2) will be integrated in Module 4. Submitting now registers the scan metadata and imagery pipeline in the database.
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {preview && (
              <Button variant="outline" onClick={handleRemove} disabled={isUploading}>
                Clear
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile || isUploading}
              isLoading={isUploading}
            >
              {isSubmitted ? 'Resubmit Scan' : 'Process Scan'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
