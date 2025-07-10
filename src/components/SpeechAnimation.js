'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './SpeechAnimation.module.css';
import Image from 'next/image';

const SpeechAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const visualsRef = useRef(null);
  const c1Ref = useRef(null);
  const c2Ref = useRef(null);
  const d3Ref = useRef(null);

  useEffect(() => {
    // Create circles for each animation
    const createCircles = (ref, count) => {
      if (!ref.current) return;
      
      const box = ref.current.querySelector(`.${styles.box}`);
      if (!box) return;
      
      // Clear existing circles
      box.innerHTML = '';
      
      // Create new circles
      for (let i = 0; i < count; i++) {
        const circle = document.createElement('div');
        circle.className = styles.circle;
        box.appendChild(circle);
      }
    };

    createCircles(c1Ref, 15);
    createCircles(c2Ref, 15);
    createCircles(d3Ref, 45);
    
    // Auto-play the animation after component mounts
    setTimeout(() => {
      handlePlay();
    }, 500);
  }, []);

  const handlePlay = () => {
    if (visualsRef.current) {
      const visuals = visualsRef.current.querySelectorAll(`.${styles.visual}`);
      
      // First add the load class to show the expansion animation
      visuals.forEach(visual => {
        visual.classList.add(styles.load);
      });
      
      // Then after a short delay, remove load and add ani class
      setTimeout(() => {
        visuals.forEach(visual => {
          visual.classList.add(styles.ani);
          visual.classList.remove(styles.load);
        });
        setIsAnimating(true);
      }, 200);
    }
  };

  const handleStop = () => {
    if (visualsRef.current) {
      const boxes = visualsRef.current.querySelectorAll(`.${styles.visual} .${styles.box}`);
      const circles = visualsRef.current.querySelectorAll(`.${styles.circle}`);
      
      // Freeze animations in place
      boxes.forEach(box => {
        const transform = getComputedStyle(box).transform;
        box.style.transform = transform;
      });
      
      circles.forEach(circle => {
        const borderColor = getComputedStyle(circle).borderColor;
        const transform = getComputedStyle(circle).transform;
        
        circle.style.borderColor = borderColor;
        circle.style.transform = transform;
      });
      
      // Remove animation classes
      const visuals = visualsRef.current.querySelectorAll(`.${styles.visual}`);
      visuals.forEach(visual => {
        visual.classList.remove(styles.ani);
      });
      
      // Remove inline styles in next frame
      requestAnimationFrame(() => {
        boxes.forEach(box => box.removeAttribute('style'));
        circles.forEach(circle => circle.removeAttribute('style'));
      });
      
      setIsAnimating(false);
    }
  };

  return (
    <div className={styles.area + ' ' + styles.final}>
      <div ref={visualsRef} className={styles.box + ' ' + styles.visuals}>
        <div ref={c1Ref} className={styles.box + ' ' + styles.visual + ' ' + styles.c1}>
          <div className={styles.box}></div>
        </div>
        <div ref={c2Ref} className={styles.box + ' ' + styles.visual + ' ' + styles.c2}>
          <div className={styles.box}></div>
        </div>
        <div ref={d3Ref} className={styles.box + ' ' + styles.visual + ' ' + styles.d3}>
          <div className={styles.box + ' ' + styles.p3d}></div>
        </div>
        <div className=' bg-white rounded-md h-20 aspect-square'>
          <Image src="/skillchecker.png" alt="Logo" width={100} height={100} className="w-full h-full object-cover rounded-md" />
        </div>
      </div>
      
      {/* Control buttons */}
      {false && (
        <div>
          <button id="btn-play" className={styles.button} onClick={handlePlay}>Play</button>
          <button id="btn-stop" className={styles.button} onClick={handleStop}>Stop</button>
        </div>
      )}
    </div>
  );
};

export default SpeechAnimation;
