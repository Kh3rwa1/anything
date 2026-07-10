import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { WebView } from 'react-native-webview';

interface VideoPlayerContainerProps {
  videoUrl: string;
}

function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function VideoPlayerContainer({ videoUrl }: VideoPlayerContainerProps) {
  const youtubeId = getYouTubeVideoId(videoUrl);

  const player = useVideoPlayer(youtubeId ? 'https://www.w3schools.com/html/mov_bbb.mp4' : videoUrl, (p) => {
    p.loop = false;
    if (!youtubeId) {
      p.play();
    }
  });

  useEffect(() => {
    if (player && videoUrl && !youtubeId) {
      player.replace(videoUrl);
      player.play();
    }
  }, [videoUrl, player, youtubeId]);

  if (youtubeId) {
    return (
      <View style={styles.container}>
        <WebView
          style={styles.video}
          source={{ uri: `https://www.youtube.com/embed/${youtubeId}?autoplay=1&modestbranding=1&rel=0` }}
          allowsFullscreenVideo
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        nativeControls
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
