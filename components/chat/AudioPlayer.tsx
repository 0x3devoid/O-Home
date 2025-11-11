import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon } from '../Icons';

interface AudioPlayerProps {
    url: string;
    duration: number;
}

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, duration }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const togglePlayPause = (e: React.MouseEvent) => {
        e.stopPropagation();
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(console.error);
        }
        setIsPlaying(!isPlaying);
    };
    
    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressRef.current || !audioRef.current) return;
        const progressBar = progressRef.current;
        const rect = progressBar.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
        const seekTime = percentage * duration;
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsSeeking(true);
        handleSeek(e);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isSeeking) return;
        // Re-cast to a React mouse event to satisfy handleSeek
        handleSeek(e as unknown as React.MouseEvent<HTMLDivElement>);
    };

    const handleMouseUp = () => {
        setIsSeeking(false);
    };
    
    useEffect(() => {
        if (isSeeking) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isSeeking]);


    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="flex items-center gap-2 w-48">
            <audio ref={audioRef} src={url} preload="metadata"></audio>
            <button onClick={togglePlayPause} className="flex-shrink-0">
                <PlayIcon className={`w-8 h-8 ${isPlaying ? '' : 'transform rotate-90'}`} />
            </button>
            <div className="flex-grow flex items-center gap-2">
                <div 
                  ref={progressRef}
                  onMouseDown={handleMouseDown}
                  className="w-full h-1.5 bg-gray-300 rounded-full cursor-pointer"
                >
                    <div className="h-full bg-violet-500 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="text-xs font-mono w-10 text-right">{formatTime(currentTime)}</span>
            </div>
        </div>
    );
};

export default AudioPlayer;
