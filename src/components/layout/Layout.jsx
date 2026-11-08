import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { StarfieldBackground } from '../effects/StarfieldBackground';
import { CursorHearts } from '../effects/CursorHearts';
import { Navbar } from '../navigation/Navbar';
import { AudioPlayer } from '../audio/AudioPlayer';
import { Footer } from './Footer';
import { ToastNotification } from '../ui/ToastNotification';
import { TerminalModal } from '../ui/TerminalModal';
import { TrophyModal } from '../ui/TrophyModal';
import { HugKissOverlay } from '../ui/HugKissOverlay';

export const Layout = () => {
  const location = useLocation();
  const isIntroPage = location.pathname === '/';

  const [terminalOpen, setTerminalOpen] = useState(false);
  const [trophyOpen, setTrophyOpen] = useState(false);
  const [overlayAction, setOverlayAction] = useState(null); // 'hug' or 'kiss'

  return (
    <div className="relative min-h-screen flex flex-col bg-[#080314] text-white selection:bg-pink-500 selection:text-white">
      {/* Background Starfield Canvas */}
      <StarfieldBackground />

      {/* Trailing Cursor Hearts (Desktop only) */}
      <CursorHearts />

      {/* Floating Toast Notification */}
      <ToastNotification />

      {/* Persistent Audio Controller */}
      <AudioPlayer />

      {/* Navigation (Hidden on Intro Page for full cinematic immersion) */}
      {!isIntroPage && (
        <Navbar 
          onOpenTerminal={() => setTerminalOpen(true)}
          onOpenTrophies={() => setTrophyOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full relative z-10 flex flex-col">
        <Outlet context={{ triggerOverlay: (type) => setOverlayAction(type) }} />
      </main>

      {/* Footer (Hidden on Intro Page) */}
      {!isIntroPage && <Footer />}

      {/* Secret Cyber Terminal Modal */}
      <TerminalModal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />

      {/* Trophy Case Modal */}
      <TrophyModal
        isOpen={trophyOpen}
        onClose={() => setTrophyOpen(false)}
      />

      {/* Fullscreen Hug / Kiss Overlay */}
      <HugKissOverlay
        type={overlayAction}
        onClose={() => setOverlayAction(null)}
      />
    </div>
  );
};
