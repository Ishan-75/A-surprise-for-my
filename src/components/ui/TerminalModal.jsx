import React, { useState, useRef, useEffect } from 'react';
import { X, Terminal as TerminalIcon, Send, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import sound from '../../utils/soundEffects';

export const TerminalModal = ({ isOpen, onClose }) => {
  const { siteConfig, discoverSecret, showToast } = useApp();
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState([
    { text: "LOVE.EXE SECURE MAINFRAME [Version 2.14.0]", type: "system" },
    { text: "Terminal connected. Type 'HELP' to scan commands, or try secret passcodes...", type: "info" }
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cmd = inputVal.trim().toUpperCase();
    if (!cmd) return;

    sound.playKeyBlip();
    const newLogs = [...logs, { text: `> ${inputVal}`, type: "user" }];

    if (siteConfig.secretCodes && siteConfig.secretCodes[cmd]) {
      sound.playSecret();
      discoverSecret('egg-terminal-hacker');
      newLogs.push({ text: siteConfig.secretCodes[cmd], type: "success" });
    } else if (cmd === 'CLEAR') {
      setLogs([{ text: "Terminal cleared.", type: "system" }]);
      setInputVal('');
      return;
    } else {
      sound.playRedFlag();
      newLogs.push({
        text: `Command '${cmd}' unrecognized. Try 'HELP' for valid codes.`,
        type: "error"
      });
    }

    setLogs(newLogs);
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl glass-panel rounded-2xl border border-[#ea9ab2]/35 shadow-2xl shadow-[#b82e4f]/25 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#12071e] px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#b82e4f] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#fae19c] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#82c0cc] inline-block" />
            </div>
            <span className="font-mono text-xs font-semibold text-[#ea9ab2] ml-2 flex items-center gap-1.5">
              <TerminalIcon className="w-3.5 h-3.5" /> Cyber Boyfriend Console
            </span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Console Body */}
        <div className="p-4 bg-black/85 font-mono text-xs overflow-y-auto flex-1 space-y-2 crt-overlay min-h-[260px] max-h-[400px]">
          {logs.map((log, idx) => (
            <div
              key={idx}
              className={`leading-relaxed ${
                log.type === 'user'
                  ? 'text-[#fae19c] font-semibold'
                  : log.type === 'success'
                  ? 'text-emerald-300 bg-emerald-950/30 p-2 rounded border border-emerald-500/30'
                  : log.type === 'error'
                  ? 'text-[#f28482]'
                  : log.type === 'system'
                  ? 'text-[#ea9ab2]'
                  : 'text-gray-300'
              }`}
            >
              {log.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3 bg-[#12071e] border-t border-white/10 flex items-center gap-2">
          <span className="font-mono text-[#ea9ab2] font-bold ml-1">{'>'}</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type code (e.g. SUGANTHI, HELP, SNACKS)..."
            className="flex-1 bg-transparent font-mono text-xs text-white placeholder-gray-400 focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#941b36] to-[#b82e4f] hover:from-[#b82e4f] hover:to-[#ea9ab2] text-white font-mono text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md shadow-[#b82e4f]/30"
          >
            <Send className="w-3 h-3" />
            <span>EXEC</span>
          </button>
        </form>
      </div>
    </div>
  );
};
