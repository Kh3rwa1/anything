import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

interface VideoPlayerContainerProps {
  videoUrl: string;
}

export function VideoPlayerContainer({ videoUrl }: VideoPlayerContainerProps) {
  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = false;
    p.play();
  });

  // Re-run play if videoUrl changes
  useEffect(() => {
    if (player && videoUrl) {
      player.replace(videoUrl);
      player.play();
    }
  }, [videoUrl, player]);

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
