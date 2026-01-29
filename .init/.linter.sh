#!/bin/bash
cd /home/kavia/workspace/code-generation/my-music-library-312322-312339/music_player_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

