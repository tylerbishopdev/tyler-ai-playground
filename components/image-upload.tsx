'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label: string;
    description?: string;
    className?: string;
}

export const ImageUpload = ({
    value,
    onChange,
    label,
    description,
    className = '',
}: ImageUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlValue, setUrlValue] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/fal/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const result = await response.json();
            onChange(result.url);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    }, [onChange]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUpload(e.dataTransfer.files[0]);
        }
    }, [handleUpload]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleUpload(e.target.files[0]);
        }
    }, [handleUpload]);

    const handleUrlSubmit = useCallback(() => {
        if (urlValue.trim()) {
            onChange(urlValue.trim());
            setUrlValue('');
            setShowUrlInput(false);
        }
    }, [urlValue, onChange]);

    const clearImage = useCallback(() => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [onChange]);

    return (
        <div className={`space-y-3 ${className}`}>
            <Label className="text-sm font-medium">{label}</Label>

            {value ? (
                <div className="relative">
                    <div className="relative w-full h-48 border border-border rounded-lg overflow-hidden bg-muted">
                        <Image
                            src={value}
                            alt="Uploaded image"
                            fill
                            className="object-cover"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={clearImage}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 break-all">{value}</p>
                </div>
            ) : (
                <>
                    <div
                        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${dragActive
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="flex flex-col items-center justify-center space-y-3">
                            {isUploading ? (
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            ) : (
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            )}

                            <div className="text-center">
                                <p className="text-sm font-medium">
                                    {isUploading ? 'Uploading...' : 'Drop image here or click to select'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    PNG, JPG, GIF up to 10MB
                                </p>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Select File
                            </Button>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileSelect}
                            disabled={isUploading}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-xs text-muted-foreground">or</span>
                        <div className="flex-1 h-px bg-border" />
                    </div>

                    {showUrlInput ? (
                        <div className="flex gap-2">
                            <Input
                                placeholder="https://example.com/image.jpg"
                                value={urlValue}
                                onChange={(e) => setUrlValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                            />
                            <Button type="button" onClick={handleUrlSubmit} size="sm">
                                Use URL
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowUrlInput(false)}
                                size="sm"
                            >
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => setShowUrlInput(true)}
                        >
                            Use Image URL Instead
                        </Button>
                    )}
                </>
            )}

            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
        </div>
    );
}; 