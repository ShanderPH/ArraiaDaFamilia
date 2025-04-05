"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Music, Youtube, Play, Pause } from "lucide-react";

// Extend the Window interface to include onYouTubeIframeAPIReady
declare global {
    interface Window {
        onYouTubeIframeAPIReady?: () => void;
    }
}

type MediaType = "spotify" | "youtube";

interface AutoPocketPlayerProps {
    // Pre-configured media settings
    mediaType: MediaType;
    mediaId: string;
    autoPlay?: boolean;
}

export function AutoPocketPlayer({
    mediaType = "spotify",
    mediaId,
    autoPlay = true,
}: AutoPocketPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [isOpen, setIsOpen] = useState(false);
    const playerRef = useRef(null);

    // YouTube iframe API reference
    const [ytPlayer, setYtPlayer] = useState<YT.Player | null>(null);

    // Initialize YouTube player
    useEffect(() => {
        // Only initialize YouTube API if we're using YouTube
        if (mediaType !== "youtube") return;

        // Load YouTube iframe API if not already loaded
        if (!window.YT) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName("script")[0];
            if (firstScriptTag.parentNode) {
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            }

            // Define onYouTubeIframeAPIReady globally
            window.onYouTubeIframeAPIReady = initYouTubePlayer;
        } else {
            // If already loaded, just initialize player
            initYouTubePlayer();
        }

        // Cleanup
        return () => {
            if (ytPlayer) {
                ytPlayer.destroy();
            }
        };
    }, [mediaType, mediaId]);

    // Function to initialize YouTube player
    const initYouTubePlayer = () => {
        if (!window.YT?.Player) return;

        // Create a hidden container for the player if it doesn't exist
        if (!document.getElementById("yt-player-container")) {
            const container = document.createElement("div");
            container.id = "yt-player-container";
            container.style.position = "absolute";
            container.style.visibility = "hidden";
            container.style.width = "1px";
            container.style.height = "1px";
            document.body.appendChild(container);
        }

        // Create the player
        const player = new window.YT.Player("yt-player-container", {
            videoId: mediaId,
            playerVars: {
                autoplay: autoPlay ? 1 : 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                playsinline: 1,
            },
            events: {
                onReady: (event) => {
                    if (autoPlay) event.target.playVideo();
                    setYtPlayer(event.target);
                },
                onStateChange: (event) => {
                    // Update playing state based on video state
                    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
                },
            },
        });
    };

    // Format the embed URL for Spotify
    const getSpotifyEmbedUrl = () => {
        if (mediaId.includes("spotify:")) {
            const parts = mediaId.replace("spotify:", "").split(":");
            return `https://open.spotify.com/embed/${parts.join("/")}`;
        }
        return `https://open.spotify.com/embed/${mediaId}`;
    };

    // Toggle play/pause state
    const togglePlayPause = () => {
        if (mediaType === "youtube" && ytPlayer) {
            if (isPlaying) {
                ytPlayer.pauseVideo();
            } else {
                ytPlayer.playVideo();
            }
            // The state will be updated via the onStateChange event
        } else {
            // For Spotify or if YouTube player isn't ready
            setIsPlaying(!isPlaying);
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

                <span className="text-xs font-medium">
                    {mediaType === "spotify" ? "Spotify" : "YouTube"}{" "}
                    {isPlaying ? "Playing" : "Paused"}
                </span>
            </div>

            {/* Hidden iframe for YouTube autoplay on page load */}
            {mediaType === "youtube" && autoPlay && (
                <iframe
                    src={`https://www.youtube.com/embed/${mediaId}?autoplay=1&mute=0`}
                    width="1"
                    height="1"
                    style={{
                        position: "absolute",
                        opacity: 0,
                        pointerEvents: "none",
                    }}
                    allow="autoplay"
                ></iframe>
            )}
        </div>
    );
}
