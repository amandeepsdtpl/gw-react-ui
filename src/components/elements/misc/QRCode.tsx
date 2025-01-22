import React from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  className?: string;
}

export const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 128,
  level = 'L',
  includeMargin = false,
  className = '',
}) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    value
  )}&size=${size}x${size}&ecc=${level}${includeMargin ? '&margin=16' : ''}`;

  return (
    <img
      src={qrUrl}
      alt={`QR Code: ${value}`}
      width={size}
      height={size}
      className={`qrcode ${className}`}
    />
  );
};