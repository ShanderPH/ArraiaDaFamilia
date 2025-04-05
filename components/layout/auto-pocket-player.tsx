"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

declare global {
    interface Window {
        onYouTubeIframeAPIReady?: () => void;
        YT?: {
            Player: new (
                elementId: string,
                config: {
                    videoId: string;
                    playerVars?: {
                        autoplay?: 0 | 1;
                        controls?: 0 | 1;
                        mute?: 0 | 1;
                        playsinline?: 0 | 1;
                    };
                    events?: {
                        onReady?: (event: any) => void;
                        onStateChange?: (event: any) => void;
                        onError?: (event: any) => void;
                    };
                }
            ) => any;
            PlayerState?: {
                PLAYING: number;
                PAUSED: number;
                ENDED: number;
            };
        };
    }
}

type MediaType = "spotify" | "youtube";

interface AutoPocketPlayerProps {
    mediaType: MediaType;
    mediaId: string;
    autoPlay?: boolean;
}

export function AutoPocketPlayer({
    mediaType = "spotify",
    mediaId,
    autoPlay = true,
}: AutoPocketPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true); // Start muted to enable autoplay
    const [playerReady, setPlayerReady] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Use useRef for the player reference
    const ytPlayerRef = useRef<any | null>(null);
    const playerContainerId = "yt-player-container";

    // Track user interaction with the document
    useEffect(() => {
        const handleUserInteraction = () => {
            setHasInteracted(true);

            // Try to unmute and play after user interaction if player is ready
            if (playerReady && ytPlayerRef.current && isPlaying && isMuted) {
                ytPlayerRef.current.unMute();
                setIsMuted(false);
            }

            // Remove listeners after first interaction
            document.removeEventListener("click", handleUserInteraction);
            document.removeEventListener("touchstart", handleUserInteraction);
        };

        document.addEventListener("click", handleUserInteraction);
        document.addEventListener("touchstart", handleUserInteraction);

        return () => {
            document.removeEventListener("click", handleUserInteraction);
            document.removeEventListener("touchstart", handleUserInteraction);
        };
    }, [playerReady, isPlaying, isMuted]);

    // Initialize YouTube player
    useEffect(() => {
        if (mediaType !== "youtube") return;

        // Create container for the player
        if (!document.getElementById(playerContainerId)) {
            const container = document.createElement("div");
            container.id = playerContainerId;
            container.style.position = "absolute";
            container.style.visibility = "hidden";
            container.style.width = "1px";
            container.style.height = "1px";
            document.body.appendChild(container);
        }

        // Load YouTube API
        if (!window.YT) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName("script")[0];
            if (firstScriptTag.parentNode) {
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            }

            window.onYouTubeIframeAPIReady = initYouTubePlayer;
        } else {
            initYouTubePlayer();
        }

        return () => {
            if (ytPlayerRef.current) {
                ytPlayerRef.current.destroy();
            }
        };
    }, [mediaType, mediaId]);

    const initYouTubePlayer = () => {
        if (!window.YT?.Player) return;

        ytPlayerRef.current = new window.YT.Player(playerContainerId, {
            videoId: mediaId,
            playerVars: {
                autoplay: autoPlay ? 1 : 0,
                controls: 0,
                mute: 1, // Start muted to comply with mobile autoplay policies
                playsinline: 1, // Required for iOS
            },
            events: {
                onReady: (event) => {
                    setPlayerReady(true);

                    // Initial state - must be done here for mobile
                    if (autoPlay) {
                        event.target.playVideo();
                        setIsPlaying(true);
                    }
                },
                onStateChange: (event) => {
                    if (window.YT?.PlayerState) {
                        setIsPlaying(
                            event.data === window.YT.PlayerState.PLAYING
                        );
                    }
                },
                onError: (event) => {
                    console.error("YouTube player error:", event.data);
                },
            },
        });
    };

    // Toggle play/pause
    const togglePlayPause = () => {
        if (mediaType === "youtube" && ytPlayerRef.current && playerReady) {
            if (isPlaying) {
                ytPlayerRef.current.pauseVideo();
            } else {
                ytPlayerRef.current.playVideo();

                // If user has interacted, we can unmute
                if (hasInteracted && isMuted) {
                    ytPlayerRef.current.unMute();
                    setIsMuted(false);
                }
            }
        } else {
            setIsPlaying(!isPlaying);
        }
    };

    // Toggle mute state
    const toggleMute = () => {
        if (mediaType === "youtube" && ytPlayerRef.current && playerReady) {
            if (isMuted) {
                ytPlayerRef.current.unMute();
                setIsMuted(false);
            } else {
                ytPlayerRef.current.mute();
                setIsMuted(true);
            }
        }
    };

    return (
        <div className="flex items-center h-10">
            <div className="flex items-center gap-2 bg-secondary rounded-full px-3 py-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={togglePlayPause}
                >
                    {isPlaying ? (
                        <Pause className="h-3 w-3" />
                    ) : (
                        <Play className="h-3 w-3" />
                    )}
                </Button>

                {mediaType === "youtube" && playerReady && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={toggleMute}
                    >
                        {isMuted ? (
                            <VolumeX className="h-3 w-3" />
                        ) : (
                            <Volume2 className="h-3 w-3" />
                        )}
                    </Button>
                )}

                <span className="text-xs font-medium">
                    {mediaType === "spotify" ? "Spotify" : "YouTube"}{" "}
                    {isPlaying ? "Playing" : "Paused"}
                </span>
            </div>
        </div>
    );
}
