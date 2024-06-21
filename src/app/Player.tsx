"use client";

import { useEffect } from 'react';

const Player = () => {
  useEffect(() => {
    console.log("Player component mounted");

    const loadScript = () => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://static.testpress.in/static/js/player.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load script'));
        document.body.appendChild(script);
      });
    };

    loadScript().then(() => {
      const iframe = document.querySelector('iframe') as HTMLIFrameElement;
      if (iframe) {
        const player = new (window as any).Testpress.Player(iframe);
        let isPlaying = false;

        const getTotalWatchTime = () => {
          if (isPlaying) {
            player.played().then((ranges: [number, number][]) => {
              let totalWatchTime = 0;
              ranges.forEach((range: [number, number]) => {
                totalWatchTime += range[1] - range[0];
              });
              console.log('Total watch time:', totalWatchTime.toFixed(2), 'seconds');
            }).catch((error: any) => {
              console.error('Error getting played ranges:', error);
            });
          }
        };

        player.on('play', () => {
          isPlaying = true;
        });

        player.on('pause', () => {
          isPlaying = false;
        });

        player.on('ended', () => {
          isPlaying = false;
          getTotalWatchTime(); // Ensure we capture the final ranges
        });

        setInterval(getTotalWatchTime, 2000);
      }
    }).catch(error => {
      console.error(error.message);
    });

    return () => {
      const script = document.querySelector('script[src="https://static.testpress.in/static/js/player.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div style={{ paddingTop: '56.25%', position: 'relative' }}>
      <h2>Loading Player...</h2>
      <iframe
        src="https://app.tpstreams.com/embed/dcek2m/996NXydJQDU/?access_token=2ad7cdae-ff2f-4244-bfcb-fcc9f32abd27"
        style={{ border: 0, maxWidth: '100%', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        frameBorder="0"
      ></iframe>
    </div>
  );
};

export default Player;
