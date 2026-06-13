import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

export default function PrizeWheel({ open, onOpenChange, rewards, onWinReward, memberName }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [rotation, setRotation] = useState(0);
  const audioRef = useRef(null);

  const speakReward = (rewardText) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`You won: ${rewardText}`);
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const activeRewards = rewards.filter(r => r.is_active !== false);
  const segmentAngle = 360 / activeRewards.length;

  const handleSpin = () => {
    if (isSpinning || activeRewards.length === 0) return;

    setIsSpinning(true);
    setSelectedReward(null);

    // Random spins between 5-8 full rotations plus random segment
    const spins = 5 + Math.random() * 3;
    const randomIndex = Math.floor(Math.random() * activeRewards.length);
    const finalAngle = spins * 360 + randomIndex * segmentAngle + segmentAngle / 2;

    setRotation(finalAngle);

    // After animation completes, show the winner
    setTimeout(() => {
      setIsSpinning(false);
      const wonReward = activeRewards[randomIndex];
      setSelectedReward(wonReward);
      onWinReward(wonReward);
      // Speak the reward for preschoolers
      speakReward(wonReward.title);
    }, 4000);
  };

  const getSegmentColor = (index) => {
    const colors = [
      "from-red-400 to-red-500",
      "from-blue-400 to-blue-500",
      "from-green-400 to-green-500",
      "from-yellow-400 to-yellow-500",
      "from-purple-400 to-purple-500",
      "from-pink-400 to-pink-500",
      "from-orange-400 to-orange-500",
      "from-teal-400 to-teal-500"
    ];
    return colors[index % colors.length];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            🎉 {memberName}'s Prize Wheel!
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {activeRewards.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No rewards available yet.</p>
              <p className="text-sm text-gray-400">Ask a parent to add some prizes!</p>
            </div>
          ) : (
            <>
              {/* Wheel Container */}
              <div className="relative flex items-center justify-center">
                {/* Pointer Arrow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
                  <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-red-500 drop-shadow-lg" />
                </div>

                {/* The Wheel */}
                <motion.div
                  animate={{ rotate: rotation }}
                  transition={{ duration: 4, ease: "easeOut" }}
                  className="relative w-80 h-80 rounded-full shadow-2xl border-8 border-gray-800"
                  style={{ transformOrigin: "center" }}
                >
                  {/* Center Circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg z-10 flex items-center justify-center border-4 border-white">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>

                  {/* Wheel Segments */}
                  {activeRewards.map((reward, index) => {
                    const angle = index * segmentAngle;
                    return (
                      <div
                        key={reward.id}
                        className="absolute top-0 left-0 w-full h-full"
                        style={{
                          transform: `rotate(${angle}deg)`,
                          transformOrigin: "center"
                        }}
                      >
                        <div
                          className={`absolute top-0 left-1/2 w-40 h-40 -translate-x-1/2 bg-gradient-to-br ${getSegmentColor(index)} clip-triangle flex items-start justify-center pt-8`}
                          style={{
                            clipPath: `polygon(50% 0%, ${50 - Math.tan((segmentAngle * Math.PI) / 360) * 100}% 100%, ${50 + Math.tan((segmentAngle * Math.PI) / 360) * 100}% 100%)`
                          }}
                        >
                          <div className="text-center text-white font-semibold text-sm px-2">
                            <div className="text-2xl mb-1">{reward.icon || "🎁"}</div>
                            <div className="line-clamp-2 text-xs">{reward.title}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Spin Button */}
              <div className="mt-8 text-center">
                {!selectedReward && (
                  <Button
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className="h-14 px-8 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-bold text-lg shadow-lg disabled:opacity-50"
                  >
                    {isSpinning ? "Spinning..." : "TAP TO SPIN!"}
                  </Button>
                )}
              </div>

              {/* Winner Announcement */}
              <AnimatePresence>
                {selectedReward && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-400 text-center"
                  >
                    <div className="text-6xl mb-3">{selectedReward.icon || "🎁"}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">You Won!</h3>
                    <p className="text-xl text-gray-700 font-semibold">{selectedReward.title}</p>
                    {selectedReward.description && (
                      <p className="text-sm text-gray-600 mt-2">{selectedReward.description}</p>
                    )}
                    <div className="flex gap-3 mt-6">
                      <Button
                        onClick={() => speakReward(selectedReward.title)}
                        variant="outline"
                        className="rounded-xl"
                      >
                        🔊 Say it again!
                      </Button>
                      <Button
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl bg-gray-900 hover:bg-gray-800"
                      >
                        Awesome! 🎉
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}