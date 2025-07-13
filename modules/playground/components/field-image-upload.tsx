import React, { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormType } from '../types/form.type';

export const FieldImageUpload = () => {
    const form = useFormContext<FormType>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileSelect = async (file: File) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            form.setError('image_url', {
                type: 'manual',
                message: 'Please select a valid image file'
            });
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            form.setError('image_url', {
                type: 'manual',
                message: 'Image file size must be less than 10MB'
            });
            return;
        }

        setUploading(true);

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('file', file);

            // Upload file to FAL storage
            const response = await fetch('/api/fal/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const data = await response.json();

            // Set the image URL in the form
            form.setValue('image_url', data.url);
            form.clearErrors('image_url');

            // Create preview
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);

        } catch (error) {
            console.error('Upload error:', error);
            form.setError('image_url', {
                type: 'manual',
                message: 'Failed to upload image. Please try again.'
            });
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const clearImage = () => {
        form.setValue('image_url', '');
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Input Image</FormLabel>
                    <FormControl>
                        <div className="space-y-4">
                            {/* File upload area */}
                            <div className="border-2 border border-pink-200/20 rounded-lg p-4 text-center">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    disabled={form.formState.isSubmitting || uploading}
                                />

                                {preview ? (
                                    <div className="space-y-2">
                                        <div className="mx-auto w-32 h-32 relative">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                        <div className="flex gap-2 justify-center">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="text-sm"
                                                size="sm"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={form.formState.isSubmitting || uploading}
                                            >
                                                {uploading ? 'Uploading...' : 'Change Image'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="text-sm"
                                                size="sm"
                                                onClick={clearImage}
                                                disabled={form.formState.isSubmitting || uploading}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <svg
                                                className="w-8 h-8 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="text-sm"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={form.formState.isSubmitting || uploading}
                                            >
                                                {uploading ? 'Uploading...' : 'Select Image'}
                                            </Button>
                                            <p className="text-sm text-gray-500 mt-2">
                                                PNG, JPG up to 10MB
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Manual URL input as fallback */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-pink-300/50">
                                    Alternative :URL of image:
                                </label>
                                <Input
                                    {...field}
                                    placeholder="https://example.com/image.jpg"
                                    disabled={form.formState.isSubmitting || uploading}
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                        if (e.target.value) {
                                            setPreview(null); // Clear file preview if URL is entered
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                        Upload an image or provide URL.
                    </FormDescription>
                </FormItem>
            )}
        />
    );
}; 