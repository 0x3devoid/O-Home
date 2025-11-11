import React, { useState, useRef, useEffect } from 'react';
import { User } from '../../types';
import { CameraIcon, VideoIcon, ImageIcon, CloseIcon, PlayIcon } from '../Icons';

interface StoryCreatorProps {
    currentUser: User;
    onClose: () => void;
    onCreateStory: (storyFile: File, type: 'image' | 'video', duration?: number) => void;
}

const StoryCreator: React.FC<StoryCreatorProps> = ({ currentUser, onClose, onCreateStory }) => {
    const [mode, setMode] = useState<'capture' | 'preview'>('capture');
    const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
    const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    // Camera setup
    useEffect(() => {
        if (mode === 'capture') {
            startCamera();
        }
        return () => {
            stopCamera();
        };
    }, [mode]);

    // Recording timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime(prev => {
                    if (prev >= 30) { // 30 second max
                        stopRecording();
                        return 30;
                    }
                    return prev + 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user' },
                audio: mediaType === 'video'
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Camera access denied:', error);
            alert('Camera access is required to create stories');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        setCapturedMedia(url);
                        setMode('preview');
                    }
                }, 'image/jpeg');
            }
        }
    };

    const startRecording = () => {
        if (streamRef.current) {
            const mediaRecorder = new MediaRecorder(streamRef.current, {
                mimeType: 'video/webm'
            });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                setCapturedMedia(url);
                setMode('preview');
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setCapturedMedia(url);
            setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
            setMode('preview');
        }
    };

    const handleCreateStory = () => {
        if (capturedMedia) {
            // Convert blob URL back to file
            fetch(capturedMedia)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], mediaType === 'video' ? 'story.webm' : 'story.jpg', {
                        type: mediaType === 'video' ? 'video/webm' : 'image/jpeg'
                    });
                    onCreateStory(file, mediaType, mediaType === 'video' ? recordingTime : 5);
                });
        }
    };

    const togglePlayback = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const retake = () => {
        setCapturedMedia(null);
        setMode('capture');
        setRecordingTime(0);
        setIsPlaying(false);
    };

    if (mode === 'capture') {
        return (
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                <div className="relative w-full h-full max-w-md">
                    {/* Camera View */}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
                        <div className="flex items-center justify-between">
                            <button onClick={onClose} className="text-white">
                                <CloseIcon className="w-6 h-6" />
                            </button>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setMediaType('image')}
                                    className={`p-2 rounded-full ${mediaType === 'image' ? 'bg-white text-black' : 'bg-white/20 text-white'}`}
                                >
                                    <ImageIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setMediaType('video')}
                                    className={`p-2 rounded-full ${mediaType === 'video' ? 'bg-white text-black' : 'bg-white/20 text-white'}`}
                                >
                                    <VideoIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
                        <div className="flex items-center justify-center gap-4">
                            {/* Upload Button */}
                            <label className="bg-white/20 text-white p-3 rounded-full cursor-pointer hover:bg-white/30 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <CameraIcon className="w-6 h-6" />
                            </label>

                            {/* Capture/Record Button */}
                            <button
                                onClick={mediaType === 'image' ? capturePhoto : (isRecording ? stopRecording : startRecording)}
                                className={`relative w-20 h-20 rounded-full transition-all ${
                                    mediaType === 'image' 
                                        ? 'bg-white hover:bg-gray-200' 
                                        : isRecording 
                                            ? 'bg-red-500 animate-pulse' 
                                            : 'bg-red-500 hover:bg-red-600'
                                }`}
                            >
                                {mediaType === 'video' && isRecording && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-white font-bold">{recordingTime}s</span>
                                    </div>
                                )}
                                {mediaType === 'image' && (
                                    <div className="absolute inset-2 bg-gray-800 rounded-full"></div>
                                )}
                            </button>

                            {/* Spacer */}
                            <div className="w-12"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (mode === 'preview' && capturedMedia) {
        return (
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                <div className="relative w-full h-full max-w-md">
                    {/* Media Preview */}
                    {mediaType === 'image' ? (
                        <img src={capturedMedia} alt="Story preview" className="w-full h-full object-contain" />
                    ) : (
                        <video
                            ref={videoRef}
                            src={capturedMedia}
                            className="w-full h-full object-contain"
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                        />
                    )}

                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
                        <div className="flex items-center justify-between">
                            <button onClick={retake} className="text-white">
                                <CloseIcon className="w-6 h-6" />
                            </button>
                            <span className="text-white font-medium">
                                {mediaType === 'video' ? `${recordingTime}s video` : 'Photo'}
                            </span>
                            <div className="w-6"></div>
                        </div>
                    </div>

                    {/* Video Play/Pause Overlay */}
                    {mediaType === 'video' && !isPlaying && (
                        <button
                            onClick={togglePlayback}
                            className="absolute inset-0 flex items-center justify-center bg-black/20"
                        >
                            <div className="bg-white/20 rounded-full p-4">
                                <PlayIcon className="w-8 h-8 text-white" />
                            </div>
                        </button>
                    )}

                    {/* Actions */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={retake}
                                className="px-6 py-3 bg-white/20 text-white rounded-full font-medium hover:bg-white/30 transition-colors"
                            >
                                Retake
                            </button>
                            <button
                                onClick={handleCreateStory}
                                className="px-8 py-3 bg-violet-600 text-white rounded-full font-medium hover:bg-violet-700 transition-colors"
                            >
                                Add to Story
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default StoryCreator;
