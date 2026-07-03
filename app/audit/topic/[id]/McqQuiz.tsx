"use client";

import { useState } from "react";

type Mcq = {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
};

export default function McqQuiz({ mcqs }: { mcqs: Mcq[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);

  if (!mcqs || mcqs.length === 0) {
    return null; // Don't show the quiz button if there are no questions
  }

  const currentMcq = mcqs[currentIndex];
  const isFinished = currentIndex >= mcqs.length;

  const handleCheck = () => {
    if (!selectedAnswer) return;
    setIsChecked(true);
    if (selectedAnswer === currentMcq.correct_answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsChecked(false);
    setCurrentIndex(currentIndex + 1);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Optional: Reset quiz on close
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsChecked(false);
  };

  return (
    <>
      {/* Launch Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-center rounded-xl bg-red-600 p-4 font-bold text-white transition-colors hover:bg-red-700 active:scale-95"
      >
        📝 Test Your Knowledge ({mcqs.length} Questions)
      </button>

      {/* Quiz Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl md:p-8">
            
            <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-xl font-bold text-white">Module Quiz</h2>
              <button onClick={handleClose} className="text-2xl text-zinc-500 hover:text-white">×</button>
            </div>

            {isFinished ? (
              <div className="py-10 text-center">
                <h3 className="mb-2 text-3xl font-black text-white">Quiz Complete!</h3>
                <p className="text-lg text-zinc-400">You scored {score} out of {mcqs.length}</p>
                <button onClick={handleClose} className="mt-8 rounded-xl bg-zinc-800 px-8 py-3 font-bold text-white hover:bg-zinc-700">
                  Close and Return to Lesson
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                
                {/* Question Header */}
                <div>
                  <span className="mb-2 inline-block rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-400">
                    Question {currentIndex + 1} of {mcqs.length}
                  </span>
                  <p className="text-lg font-medium text-white md:text-xl">{currentMcq.question}</p>
                </div>

                {/* Options */}
                <div className="flex flex-col gap-3">
                  {[
                    { key: "A", text: currentMcq.option_a },
                    { key: "B", text: currentMcq.option_b },
                    { key: "C", text: currentMcq.option_c },
                    { key: "D", text: currentMcq.option_d },
                  ].map((opt) => {
                    let btnStyle = "border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800";
                    
                    if (isChecked) {
                      if (opt.key === currentMcq.correct_answer) btnStyle = "border-green-500 bg-green-500/10 text-green-400";
                      else if (opt.key === selectedAnswer) btnStyle = "border-red-500 bg-red-500/10 text-red-400";
                      else btnStyle = "border-zinc-800 bg-zinc-950 text-zinc-600 opacity-50";
                    } else if (selectedAnswer === opt.key) {
                      btnStyle = "border-red-500 bg-red-600/10 text-white";
                    }

                    return (
                      <button
                        key={opt.key}
                        disabled={isChecked}
                        onClick={() => setSelectedAnswer(opt.key)}
                        className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors ${btnStyle}`}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-sm font-bold shadow-inner">
                          {opt.key}
                        </span>
                        <span className="font-medium">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanations & Action Buttons */}
                {isChecked ? (
                  <div className="mt-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                      <p className="text-sm font-bold uppercase tracking-wider text-zinc-500">Explanation</p>
                      <p className="mt-1 text-zinc-300">{currentMcq.explanation || "No explanation provided."}</p>
                    </div>
                    <button onClick={handleNext} className="w-full rounded-xl bg-white p-4 font-bold text-black transition-colors hover:bg-zinc-200">
                      {currentIndex === mcqs.length - 1 ? "Finish Quiz" : "Next Question →"}
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={!selectedAnswer}
                    onClick={handleCheck}
                    className="mt-4 w-full rounded-xl bg-red-600 p-4 font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                  >
                    Check Answer
                  </button>
                )}

              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
