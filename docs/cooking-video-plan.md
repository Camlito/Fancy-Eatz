# Fancy Eatz illustrated cooking walkthroughs

Six narrated, captioned picture walkthroughs cover garlic butter chicken, creamy chicken pasta, and salmon with lemon cream, each in Classic and Signature versions. These are illustrated guides, not filmed demonstrations.

AI-created storyboards supply six step-specific images per recipe; the existing Signature meal images illustrate the additional finishing chapters. FFmpeg and its local Flite speech engine render narration and video without external video credits or speech API purchases. Captions are burned in and also supplied as English WebVTT tracks. Playback duration is explicitly distinguished from cooking time.

The production manifest contains scripts, media paths and chapter times. The reusable renderer is `scripts/build-cooking-walkthroughs.py`.

Validation: all six MP4s decode successfully and include H.264 video plus AAC audio; chapter times remain within their media durations. TypeScript and production build checks pass. Browser checks verify chapter seeking, active playback, and switching from the six-step Classic video to the seven-step Signature version.
