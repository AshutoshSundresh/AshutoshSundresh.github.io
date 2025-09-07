/* eslint-disable @next/next/no-img-element */
import React, { useState, TouchEvent } from 'react';
import type { IOSLockscreenProps } from '../types';
import Image from 'next/image';
import useClock from '../hooks/useClock';
import usePinEntry from '../hooks/usePinEntry';
import useVerticalSwipe from '../hooks/useVerticalSwipe';

const IOSLockscreen: React.FC<IOSLockscreenProps> = ({ onUnlock }) => {
  const timeHhMm = useClock('h:mm');
  const timeDate = useClock('EEEE, MMMM d');

  const [showKeypad, setShowKeypad] = useState(false);
  const { password, isShaking, isExiting, submit, press } = usePinEntry(() => onUnlock());
  const { swipeStartY, swipeDistance, onTouchStart, onTouchMove, onTouchEnd } = useVerticalSwipe();

  // Handle PIN submission
  const handleSubmit = () => submit();

  // Handle keypad input
  const handleKeyPress = (key: string) => {
    if (key === 'cancel') setShowKeypad(false);
    press(key);
  };

  // Handle touch events for swipe gesture
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => onTouchStart(e.touches[0].clientY);
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => onTouchMove(e.touches[0].clientY, !showKeypad, showKeypad);
  const handleTouchEnd = () => {
    const final = onTouchEnd();
    if (!showKeypad) {
      if (final > 100) setShowKeypad(true);
    } else {
      if (final < -100) setShowKeypad(false);
    }
  };

  // Calculate transition styles based on swipe distance
  const contentTransform = {
    transform: swipeDistance ? `translateY(-${swipeDistance}px)` : 'translateY(0)',
    transition: swipeDistance ? 'none' : 'transform 0.3s ease-out'
  };

  // Generate dot indicators for PIN entry
  const renderPinDots = () => {
    const dots = [];
    for (let i = 0; i < 5; i++) {
      dots.push(
        <div 
          key={i}
          className={`w-3.5 h-3.5 rounded-full mx-2 ${
            password.length > i 
              ? 'bg-white animate-dot-pop' 
              : 'bg-white/20 border border-white/30'
          }`}
          style={{
            // Add slight delay to each dot's animation based on its position
            animationDelay: password.length > i ? `${(password.length - 1 - i) * -0.05}s` : '0s'
          }}
        />
      );
    }
    return dots;
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center ios-lockscreen-enter ${isExiting ? 'ios-lockscreen-exit' : ''} ios-lockscreen-bg`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* iOS-style wallpaper overlay with subtle pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-20 noise-bg"
      ></div>

      {/* iOS Status Bar - with blur effect */}
      <div className="w-full px-4 pt-4 pb-2 flex justify-between items-center text-white text-xs z-10 bg-black/10 backdrop-blur-sm">
        <div className="font-medium">Ashutosh Sundresh</div>

      </div>

      {/* Main lockscreen content that slides up/down */}
      {!showKeypad ? (
        <>
          {/* Clock and Date */}
          <div 
            className="flex flex-col items-center text-white z-10 justify-center"
            style={contentTransform}
          >
            {/* Lock Icon */}
            <div className="mb-6 mt-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            
            <div className="text-7xl mb-2 font-light drop-shadow-lg">{timeHhMm}</div>
            <div className="text-lg drop-shadow">{timeDate}</div>
          </div>

          {/* Bottom section */}
          <div 
            className="mt-auto mb-12 w-full flex flex-col items-center z-10"
            style={contentTransform}
          >
            
            {/* iOS "Swipe up to unlock" text with animated indicator */}
            <div className="flex flex-col items-center mt-6">
              <div className="text-xs font-medium text-white/80 mb-2">
                Swipe up to unlock
              </div>
              <div className="mt-2 w-10 h-1 bg-white/40 rounded-full animate-pulse-up"></div>
            </div>
          </div>
        </>
      ) : (
        // iOS-style Keypad
        <div 
          className="w-full h-full flex flex-col items-center justify-center z-20 animate-fade-in"
          style={{
            transform: swipeDistance < 0 ? `translateY(${-swipeDistance}px)` : 'translateY(0)'
          }}
        >
          {/* Background blur */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-md z-0"
            style={{
              opacity: Math.max(1 + (swipeDistance / 150), 0.3) // Fade out as user swipes down
            }}
          ></div>
          
          {/* Question and PIN indicator */}
          <div className="w-full flex flex-col items-center z-10">
            <h2 className="text-white text-sm font-medium mb-5 text-center px-6">
              What is the number of ways you can arrange the letters in the word "Ashutosh"?
            </h2>
            
            <div className={`flex justify-center mb-8 ${isShaking ? 'animate-shake' : ''}`}>
              {renderPinDots()}
            </div>
          </div>
          
          {/* Numeric Keypad */}
          <div className="w-full max-w-xs grid grid-cols-3 gap-6 px-6 z-10 mt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'delete'].map((key, i) => (
              <button
                key={i}
                className={`
                  h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl font-light
                  ${key === '' ? 'invisible' : key === 'delete' ? 'bg-transparent' : 'bg-white/20 backdrop-blur-sm active:bg-white/40'}
                `}
                onClick={() => key !== '' && handleKeyPress(key.toString())}
                disabled={key === ''}
              >
                {key === 'delete' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.707 4.879A3 3 0 018.828 4H15a3 3 0 013 3v6a3 3 0 01-3 3H8.828a3 3 0 01-2.12-.879l-4.415-4.414a1 1 0 010-1.414l4.414-4.414zm4 2.414a1 1 0 00-1.414 1.414L10.586 10l-1.293 1.293a1 1 0 101.414 1.414L12 11.414l1.293 1.293a1 1 0 001.414-1.414L13.414 10l1.293-1.293a1 1 0 00-1.414-1.414L12 8.586l-1.293-1.293z" clipRule="evenodd" />
                  </svg>
                ) : key}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Displays opacity based on swipe distance */}
      <div 
        className="fixed inset-0 bg-black/50 z-0 pointer-events-none"
        style={{ 
          opacity: Math.min(swipeDistance / 150, 0.7),
          transition: swipeDistance ? 'none' : 'opacity 0.3s ease-out'
        }}
      ></div>
    </div>
  );
};

export default IOSLockscreen;
