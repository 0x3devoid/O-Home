import React, { useState, useRef, useCallback } from 'react';
import { CameraIcon, ImageIcon, CloseIcon, MapPinIcon } from '../Icons';
import { User } from '../../types';

export interface SimplifiedPropertyData {
  images: File[];
  videos: File[];
  description: string;
  postType: 'property' | 'text';
  location?: string;
  price?: number;
  beds?: number;
  baths?: number;
  type?: 'rent' | 'sale';
}

interface SimplifiedPostFormProps {
  onSubmit: (data: SimplifiedPropertyData) => Promise<void>;
  currentUser: User;
  onCancel: () => void;
  onPostSuccess: () => void;
}

const SimplifiedPostForm: React.FC<SimplifiedPostFormProps> = ({
  onSubmit,
  currentUser,
  onCancel,
  onPostSuccess,
}) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');
  const [postType, setPostType] = useState<'property' | 'text'>('property');
  const [propertyType, setPropertyType] = useState<'rent' | 'sale'>('rent');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (validFiles.length > 0) {
      setMediaFiles(prev => [...prev, ...validFiles].slice(0, 10)); // Max 10 files
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (validFiles.length > 0) {
      setMediaFiles(prev => [...prev, ...validFiles].slice(0, 10)); // Max 10 files
    }
  };

  const removeFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      alert('Please add a description');
      return;
    }

    if (postType === 'property' && mediaFiles.length === 0) {
      alert('Please add at least one photo or video');
      return;
    }

    setIsSubmitting(true);

    try {
      const images = mediaFiles.filter(file => file.type.startsWith('image/'));
      const videos = mediaFiles.filter(file => file.type.startsWith('video/'));

      const postData: SimplifiedPropertyData = {
        images,
        videos,
        description: description.trim(),
        postType,
        location: location.trim() || undefined,
        price: price ? parseFloat(price) : undefined,
        beds: beds ? parseInt(beds) : undefined,
        baths: baths ? parseInt(baths) : undefined,
        type: propertyType,
      };

      await onSubmit(postData);
      onPostSuccess();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isVideoFile = (file: File) => file.type.startsWith('video/');

  return (
    <div className="bg-white rounded-2xl shadow-xl max-w-2xl mx-auto w-full max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Create Post</h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <CloseIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Post Type Toggle */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => setPostType('property')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              postType === 'property'
                ? 'bg-white text-violet-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Property
          </button>
          <button
            type="button"
            onClick={() => setPostType('text')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              postType === 'text'
                ? 'bg-white text-violet-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Text Post
          </button>
        </div>

        {/* Media Upload */}
        {postType === 'property' && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-violet-500 bg-violet-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-violet-100 rounded-full">
                <CameraIcon className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Photos or Videos</p>
                <p className="text-sm text-gray-500 mt-1">
                  Drag and drop or click to upload
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
              >
                Choose Files
              </button>
            </div>
          </div>
        )}

        {/* Media Preview */}
        {mediaFiles.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {mediaFiles.map((file, index) => (
              <div key={index} className="relative group">
                {isVideoFile(file) ? (
                  <video
                    src={URL.createObjectURL(file)}
                    className="w-full h-32 object-cover rounded-lg"
                    controls={false}
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
                {isVideoFile(file) && (
                  <div className="absolute bottom-2 left-2 p-1 bg-black/50 text-white rounded-full">
                    <CameraIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={postType === 'property' ? 'Describe your property...' : 'What\'s on your mind?'}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            rows={4}
            maxLength={1000}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {description.length}/1000
          </div>
        </div>

        {/* Property Details */}
        {postType === 'property' && (
          <div className="space-y-3">
            {/* Location */}
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Property location"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Property Type */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPropertyType('rent')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  propertyType === 'rent'
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                For Rent
              </button>
              <button
                type="button"
                onClick={() => setPropertyType('sale')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  propertyType === 'sale'
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                For Sale
              </button>
            </div>

            {/* Price and Details */}
            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="number"
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                placeholder="Beds"
                min="0"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="number"
                value={baths}
                onChange={(e) => setBaths(e.target.value)}
                placeholder="Baths"
                min="0"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SimplifiedPostForm;
