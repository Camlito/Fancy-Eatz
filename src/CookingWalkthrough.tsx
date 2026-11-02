import { useRef, useState } from 'react';
import { cookingWalkthroughs } from './cookingWalkthroughs';

export default function CookingWalkthrough({ title, version, steps = [] }: {
  title: string;
  version: 'classic' | 'signature';
  steps?: string[];
}) {
  const guide = cookingWalkthroughs[title.replace(/^Fancy Eatz Signature /, '')]?.[version];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [showCaptions, setShowCaptions] = useState(false);
  if (!guide) return <section className='cooking-walkthrough guided-cook-mode' aria-label='Interactive cooking lesson'>
    <div className='walkthrough-intro'><div><p className='eyebrow'>FANCY EATZ COOK-ALONG</p><h4>{title}</h4><p>{version === 'classic' ? 'Classic preparation' : 'Signature preparation'} · Guided steps based on this recipe's actual instructions.</p></div>
    <button type='button' className='primary' onClick={()=>setExpanded(v=>!v)} aria-expanded={expanded}>{expanded ? 'Close Lesson' : 'Start Cooking Lesson'}</button></div>
    {expanded && <div className='guided-cook-panel'>
      {steps.length ? <><p className='walkthrough-version'>Step {Math.min(activeStep+1,steps.length)} of {steps.length}</p>
        <div className='guided-step-content' aria-live='polite'><span className='guided-step-number'>{activeStep+1}</span><p>{steps[Math.min(activeStep,steps.length-1)]}</p></div>
        <div className='guided-progress' role='progressbar' aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={Math.min(activeStep+1,steps.length)} aria-label='Cooking lesson progress'><span style={{width:`${Math.min((activeStep+1)/steps.length*100,100)}%`}} /></div>
        <div className='walkthrough-transport'><button type='button' disabled={activeStep===0} onClick={()=>setActiveStep(i=>Math.max(0,i-1))}>Previous Step</button><button type='button' onClick={()=>setActiveStep(0)}>Restart</button><button type='button' disabled={activeStep>=steps.length-1} onClick={()=>setActiveStep(i=>Math.min(steps.length-1,i+1))}>Next Step</button></div>
        <details className='walkthrough-text-steps'><summary>View all {steps.length} instructions</summary><ol>{steps.map((step,i)=><li key={i}>{step}</li>)}</ol></details>
      </> : <p>Detailed instructions for this meal are being prepared. No unrelated video will be shown.</p>}
      <p className='walkthrough-disclosure'>Interactive written cook-along, not a filmed video. Follow food safety temperatures and the recipe's actual cooking times.</p>
    </div>}
  </section>;

  async function playStep(index: number) {
    const video = videoRef.current;
    if (!video || !guide.steps[index]) return;
    setError('');
    try {
      if (video.readyState < 1) {
        await new Promise<void>((resolve, reject) => {
          const cleanup = () => {
            video.removeEventListener('loadedmetadata', ready);
            video.removeEventListener('error', failed);
          };
          const ready = () => { cleanup(); resolve(); };
          const failed = () => { cleanup(); reject(new Error('Video could not load')); };
          video.addEventListener('loadedmetadata', ready, { once: true });
          video.addEventListener('error', failed, { once: true });
          video.load();
        });
      }
      if (video !== videoRef.current) return;
      video.currentTime = guide.steps[index].start;
      setActiveStep(index);
      await video.play();
    } catch { setError('Press Play in the video controls to continue.'); }
  }

  return (
    <section className='cooking-walkthrough' aria-label='Illustrated cooking walkthrough'>
      <div className='walkthrough-intro'>
        <div><p className='eyebrow'>COOK ALONG WITH FANCY EATZ</p><h4>A little guidance, one step at a time.</h4><p>Illustrated pictures, synthesized narration, and captions. Pause while you cook, then pick up where you left off.</p></div>
        <button type='button' className='primary' aria-expanded={expanded} onClick={() => { setExpanded(value => !value); setError(''); }}>{expanded ? 'Close Video Guide' : 'Watch Step-by-Step'}</button>
      </div>
      {expanded && <div className='walkthrough-player'>
        <p className='walkthrough-version'>{version === 'classic' ? 'Classic' : 'Fancy Eatz Signature'} · {guide.steps.length} steps · About {Math.ceil(guide.duration / 60)} minute{Math.ceil(guide.duration / 60) === 1 ? '' : 's'} of viewing</p>
        <video key={guide.src} ref={videoRef} controls playsInline preload='metadata' poster={guide.poster} aria-label={`${title} ${version} illustrated video guide`}
          onLoadedMetadata={() => { setActiveStep(0); setError(''); }}
          onTimeUpdate={event => {
            const currentTime = event.currentTarget.currentTime;
            const index = guide.steps.findIndex(step => currentTime >= step.start && currentTime < step.end);
            if (index >= 0) setActiveStep(index);
          }}
          onError={() => { setError('This video could not load. Use the illustrated chapter captions below or the full written recipe.'); setShowCaptions(true); }}>
          <source src={guide.src} type='video/mp4' />
          <track kind='captions' src={guide.captions} srcLang='en' label='English captions' />
          Your browser does not support video playback. Use the written steps below.
        </video>
        <p className='walkthrough-current-step'><b>Step {Math.min(activeStep + 1, guide.steps.length)}: </b>{(guide.steps[activeStep] || guide.steps[0]).caption}</p>
        <p className='walkthrough-disclosure'>AI-created illustrations and synthesized narration—not live cooking footage. Video playback time is not cooking time. Follow the written times and food-thermometer targets.</p>
        <button type='button' className='ghost walkthrough-start' onClick={() => playStep(0)}>Play from Beginning</button>
        <div className='walkthrough-transport' role='group' aria-label='Video step controls'>
          <button type='button' disabled={activeStep === 0} onClick={() => playStep(activeStep - 1)}>← Previous Step</button>
          <button type='button' onClick={() => playStep(activeStep)}>Replay This Step</button>
          <button type='button' disabled={activeStep >= guide.steps.length - 1} onClick={() => playStep(activeStep + 1)}>Next Step →</button>
        </div>
        <div className='walkthrough-chapters' role='group' aria-label='Cooking video chapters'>{guide.steps.map((step, index) => <button type='button' key={step.label} aria-pressed={activeStep === index} onClick={() => playStep(index)}><span>{index + 1}</span>{step.label}</button>)}</div>
        {error && <p className='walkthrough-error' role='status'>{error}</p>}
        <details className='walkthrough-text-steps' open={showCaptions} onToggle={event => setShowCaptions(event.currentTarget.open)}>
          <summary>Read all {guide.steps.length} illustrated-guide captions</summary>
          <ol>{guide.steps.map(step => <li key={step.label}><strong>{step.label}</strong><p>{step.caption}</p></li>)}</ol>
        </details>
      </div>}
    </section>
  );
}
