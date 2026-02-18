import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { setPlayerName } from '../../services/firebase';

interface PlayerNameInputProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
}

export function PlayerNameInput({ isOpen, onClose, currentName }: PlayerNameInputProps) {
  const [name, setName] = useState(currentName);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = name.trim();
    if (trimmed) {
      setPlayerName(trimmed);
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-primary-800">Your Commander Name</h3>
        <p className="text-sm text-gray-500">This appears on leaderboards and in challenges.</p>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={20}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm"
          placeholder="Enter your name..."
          autoFocus
          onKeyDown={e => e.key === 'Enter' && handleSave()}
        />
        <div className="flex gap-3">
          <Button variant="primary" onClick={handleSave} className="flex-1">
            Save
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
