import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Camera, Scan } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QRScannerProps {
  onScanSuccess: (touristId: string) => void;
  onScanError: (error: string) => void;
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
}

const QRScanner = ({ onScanSuccess, onScanError, isScanning, setIsScanning }: QRScannerProps) => {
  const [error, setError] = useState<string>('');

  const handleResult = (result: any, error: any) => {
    if (result && result.text) {
      try {
        // Extract tourist ID from QR code
        const touristId = result.text.trim();
        setError('');
        setIsScanning(false);
        onScanSuccess(touristId);
      } catch (err) {
        setError('Invalid QR code format');
        onScanError('Invalid QR code format');
      }
    }

    if (error) {
      console.error('QR Scanner Error:', error);
    }
  };

  const handleError = (error: any) => {
    console.error('Camera Error:', error);
    setError('Camera access denied or unavailable');
    onScanError('Camera access denied or unavailable');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Scan className="h-5 w-5 text-primary" />
          QR Code Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isScanning ? (
          <div className="text-center space-y-4">
            <div className="p-8 border-2 border-dashed border-muted rounded-lg">
              <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Click below to start scanning tourist QR codes
              </p>
            </div>
            <Button 
              onClick={() => setIsScanning(true)}
              className="w-full"
              size="lg"
            >
              <Camera className="h-4 w-4 mr-2" />
              Start Scanning
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <QrReader
                onResult={handleResult}
                constraints={{ 
                  facingMode: 'environment',
                  width: 300,
                  height: 300
                }}
                className="w-full"
                videoStyle={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px'
                }}
              />
              <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none">
                <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-primary"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-primary"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-primary"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-primary"></div>
              </div>
            </div>
            <Button 
              onClick={() => setIsScanning(false)}
              variant="outline"
              className="w-full"
            >
              Stop Scanning
            </Button>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default QRScanner;