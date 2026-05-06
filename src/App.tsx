import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { STAGES, Stage } from './data';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Trophy, Star } from 'lucide-react';
import { completeSession, createSession, StageAnswer } from './api';

export default function App() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [showProfile, setShowProfile] = useState(false);
  const [gender, setGender] = useState<string | null>(null);
  const [age, setAge] = useState<string>('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [selectedAlt, setSelectedAlt] = useState<string[]>([]);
  const [moleScore, setMoleScore] = useState(0);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'success'>('idle');
  const [currentPraise, setCurrentPraise] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [stageAnswers, setStageAnswers] = useState<StageAnswer[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSubmittedResult, setHasSubmittedResult] = useState(false);
  const { width, height } = useWindowSize();

  const praises = ['太棒啦！', '做的真好！', '非常棒！', '继续保持！', '状态真不错！', '太厉害咯！'];

  const handleNext = () => {
    setSelectedOptions([]);
    setSelectedAlt([]);
    setMoleScore(0);
    setFeedbackState('idle');
    
    if (currentStep < STAGES.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      if (nextStep < STAGES.length && STAGES[nextStep].tutorialType) {
        setShowTutorial(true);
      } else {
        setShowTutorial(false);
      }
    }
  };

  const handleStart = () => {
    setShowProfile(true);
    setHasSubmittedResult(false);
  };

  const handleProfileComplete = () => {
    if (!gender || !age) return;
    setSaveError(null);
    setIsSaving(true);

    createSession({ gender, age: Number(age) })
      .then((session) => {
        setSessionId(session.id);
        setStageAnswers([]);
        setHasSubmittedResult(false);
        setShowProfile(false);
        setCurrentStep(0);
        if (STAGES[0].tutorialType) setShowTutorial(true);
      })
      .catch((error: Error) => {
        setSaveError(error.message);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const getStageAnswerString = (stage: Stage): string => {
    if (stage.type === 'multiple-choice') {
      return selectedOptions.length > 0 ? String(stage.options?.[selectedOptions[0]]) : '未作答';
    }
    if (stage.type === 'multi-select') {
      return selectedOptions.map((idx) => String(stage.options?.[idx])).join(', ') || '未作答';
    }
    if (stage.type === 'alternating') {
      return selectedAlt.join(' -> ') || '未作答';
    }
    if (stage.type === 'whack-a-mole') {
      return `点击次数:${moleScore}`;
    }
    return '已完成展示';
  };

  const isCurrentStageCorrect = (stage: Stage): boolean => {
    if (stage.type === 'multiple-choice') {
      return selectedOptions[0] === stage.answer;
    }
    if (stage.type === 'multi-select') {
      const expected = Array.isArray(stage.answer) ? [...stage.answer].sort() : [];
      const actual = [...selectedOptions].sort();
      return JSON.stringify(expected) === JSON.stringify(actual);
    }
    if (stage.type === 'alternating') {
      return JSON.stringify(selectedAlt) === JSON.stringify(stage.answer);
    }
    if (stage.type === 'whack-a-mole') {
      return moleScore > 0;
    }
    return true;
  };

  const handleBottomAction = () => {
    if (feedbackState === 'idle') {
      if (!activeStage) return;
      const answerRecord: StageAnswer = {
        stageId: activeStage.id,
        isCorrect: isCurrentStageCorrect(activeStage),
        answer: getStageAnswerString(activeStage),
      };
      setStageAnswers((prev) => [...prev, answerRecord]);
      setCurrentPraise(praises[Math.floor(Math.random() * praises.length)]);
      setFeedbackState('success');
    } else {
      handleNext();
    }
  };

  const activeStage: Stage | undefined = STAGES[currentStep];

  useEffect(() => {
    if (currentStep < STAGES.length || !sessionId || hasSubmittedResult) return;
    const totalScore = stageAnswers.filter((item) => item.isCorrect).length;
    setIsSaving(true);
    completeSession(sessionId, stageAnswers, totalScore)
      .then(() => {
        setHasSubmittedResult(true);
      })
      .catch((error: Error) => setSaveError(error.message))
      .finally(() => setIsSaving(false));
  }, [currentStep, sessionId, hasSubmittedResult, stageAnswers]);

  const renderTutorial = () => {
    if (!showTutorial || !activeStage) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 touch-none">
        <div className="bg-white p-8 rounded-[30px] flex flex-col items-center justify-center max-w-sm w-[90%] shadow-2xl relative overflow-hidden">
          <div className="text-6xl mb-6 z-10">
            {activeStage.tutorialType === 'slide' ? (
              <div className="animate-finger-slide">👆</div>
            ) : (
              <div className="animate-finger-tap">👆</div>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-800 text-center mb-8 z-10">
            {activeStage.tutorialText}
          </p>
          <button 
            onClick={() => setShowTutorial(false)}
            className="w-full bg-[#34D399] text-white text-2xl font-bold py-5 rounded-[20px] shadow-[0_6px_0_#059669] active:translate-y-[6px] active:shadow-none transition-all z-10"
          >
            我知道了
          </button>
        </div>
      </div>
    );
  };

  const renderProgressBar = () => {
    const progress = Math.max(0, currentStep / STAGES.length) * 100;
    
    return (
      <div className="px-6 py-4 bg-white/80 backdrop-blur sticky top-0 z-40 border-b border-gray-100 shrink-0">
        <div className="h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner flex relative">
          <motion.div 
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
             <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/30 w-full h-1/3 rounded-t-full"></div>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderCurrentStage = () => {
    if (!activeStage) return null;

    return (
      <div className="w-full max-w-lg mx-auto flex-1 p-6 flex flex-col items-center">
        {activeStage.npc && (
           <div className="text-6xl mb-4 p-4 bg-white rounded-full shadow-md border-4 border-gray-100">{activeStage.npc}</div>
        )}
        {activeStage.emoji && (
           <div className="text-8xl mb-6 p-6 bg-white rounded-[30px] shadow-sm border-2 border-gray-100">{activeStage.emoji}</div>
        )}

        <h2 className="text-[26px] font-bold text-gray-800 text-center mb-8 leading-relaxed">
          {activeStage.question}
        </h2>

        {/* Content based on type */}
        <div className="w-full flex flex-col gap-5">
          {activeStage.type === 'multiple-choice' && activeStage.options?.map((opt, idx) => {
            const isSelected = selectedOptions.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => setSelectedOptions([idx])}
                className={`py-6 px-6 text-[22px] font-bold rounded-[25px] transition-all border-4 text-left ${
                  isSelected 
                    ? 'border-[#34D399] bg-[#ECFDF5] text-[#065F46] shadow-sm transform scale-[1.02]' 
                    : 'border-gray-100 bg-white text-gray-700 shadow-sm active:bg-gray-50'
                }`}
              >
                {opt}
              </button>
            )
          })}

          {activeStage.type === 'alternating' && (
             <div className="grid grid-cols-2 gap-5">
                {activeStage.options?.map((opt, idx) => {
                  const clickIndex = selectedAlt.indexOf(opt);
                  const isSelected = clickIndex !== -1;
                  return (
                    <button
                      key={idx}
                      onClick={() => !isSelected && setSelectedAlt([...selectedAlt, opt])}
                      disabled={isSelected}
                      className={`h-28 text-4xl font-extrabold rounded-[25px] border-4 transition-all relative ${
                         isSelected 
                          ? 'bg-gray-100 border-gray-200 text-gray-300' 
                          : 'bg-white border-[#60A5FA] text-[#1E3A8A] shadow-[0_6px_0_#93C5FD] active:translate-y-[6px] active:shadow-none'
                      }`}
                    >
                      {opt}
                      {isSelected && (
                         <div className="absolute -top-3 -right-3 bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold border-2 border-white shadow-sm">
                           {clickIndex + 1}
                         </div>
                      )}
                    </button>
                  )
                })}
             </div>
          )}

          {activeStage.type === 'memory-show' && (
            <div className="grid grid-cols-2 gap-4">
              {activeStage.options?.map((w, i) => (
                <div key={i} className="bg-white py-6 rounded-2xl text-[22px] text-center shadow-sm font-bold border-4 border-[#FCD34D] text-gray-800">
                  {w}
                </div>
              ))}
            </div>
          )}

          {activeStage.type === 'multi-select' && (
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {activeStage.options?.map((opt, idx) => {
                const isSelected = selectedOptions.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedOptions(selectedOptions.filter(i => i !== idx));
                      } else {
                        setSelectedOptions([...selectedOptions, idx]);
                      }
                    }}
                    className={`h-24 text-[20px] font-bold rounded-[20px] border-4 transition-all ${
                      isSelected 
                        ? 'border-[#34D399] bg-[#ECFDF5] text-[#065F46] shadow-sm transform scale-[1.05]' 
                        : 'border-gray-100 bg-white text-gray-600 shadow-sm'
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          )}

          {activeStage.type === 'whack-a-mole' && (
            <div className="grid grid-cols-4 gap-4 p-4 bg-white rounded-[30px] border-4 border-gray-100 relative min-h-[300px]">
              {activeStage.options?.map((num, idx) => (
                <motion.button
                   key={idx}
                   initial={{ opacity: 0, scale: 0, y: 20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   transition={{ delay: idx * 0.5, type: 'spring' }}
                   onClick={() => setMoleScore(prev => prev + 1)}
                   className="h-20 bg-[#FCD34D] rounded-[20px] text-3xl font-extrabold text-yellow-900 shadow-[0_4px_0_#D97706] active:translate-y-[4px] active:shadow-none"
                >
                  {num}
                </motion.button>
              ))}
              <div className="col-span-4 mt-8 flex justify-center">
                 <div className="bg-sky-100 text-sky-800 px-6 py-3 rounded-full text-xl font-bold border-2 border-sky-200">
                    已点击数：{moleScore}
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const canProceed = () => {
    if (!activeStage || showTutorial) return false;
    if (activeStage.type === 'multiple-choice') return selectedOptions.length > 0;
    if (activeStage.type === 'alternating') return selectedAlt.length === activeStage.options?.length;
    if (activeStage.type === 'multi-select') return selectedOptions.length > 0;
    if (activeStage.type === 'whack-a-mole') return moleScore > 0;
    return true;
  };

  if (showProfile) {
    return (
      <div className="min-h-[100dvh] bg-[#E0F2FE] flex flex-col items-center justify-center p-6 space-y-8">
        <h2 className="text-[32px] font-extrabold text-[#0284C7] mb-4">完善个人信息</h2>
        
        <div className="w-full max-w-sm bg-white p-8 rounded-[30px] border-4 border-sky-100 shadow-sm space-y-8">
          <div className="space-y-4">
            <label className="block text-2xl font-bold text-gray-700">您的性别</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setGender('male')}
                className={`py-4 text-2xl font-bold rounded-2xl border-4 transition-all ${gender === 'male' ? 'bg-sky-100 border-sky-400 text-sky-800' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
              >
                👨 爷爷
              </button>
              <button 
                onClick={() => setGender('female')}
                className={`py-4 text-2xl font-bold rounded-2xl border-4 transition-all ${gender === 'female' ? 'bg-pink-100 border-pink-400 text-pink-800' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
              >
                👩 奶奶
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-2xl font-bold text-gray-700">您的年龄</label>
            <div className="flex items-center space-x-2 w-full">
              <input 
                type="number" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="请输入"
                className="w-full text-2xl font-bold p-4 bg-gray-50 border-4 border-gray-100 rounded-2xl focus:outline-none focus:border-sky-400 focus:bg-white text-center"
              />
              <span className="text-2xl font-bold text-gray-600 shrink-0">岁</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleProfileComplete}
          disabled={!gender || !age || isSaving}
          className={`w-full max-w-sm text-[28px] font-extrabold py-6 rounded-[30px] border-4 transition-all tracking-wider ${
             gender && age 
               ? 'bg-[#0EA5E9] text-white border-[#0284C7] shadow-[0_8px_0_#0369A1] active:translate-y-[8px] active:shadow-none' 
               : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
          }`}
        >
          {isSaving ? '保存中...' : '准备好了'}
        </button>
        {saveError && (
          <p className="text-red-500 text-lg font-bold text-center">{saveError}</p>
        )}
        <button
          onClick={() => setShowProfile(false)}
          className="text-[#0284C7] text-xl font-bold underline underline-offset-4"
        >
          返回
        </button>
      </div>
    );
  }

  if (currentStep === -1) {
    return (
      <div className="min-h-[100dvh] bg-[#E0F2FE] flex flex-col items-center justify-center p-6 space-y-12">
        <div className="text-center space-y-6">
          <div className="text-9xl mb-8 animate-bounce">🏡</div>
          <h1 className="text-[44px] font-extrabold text-[#0284C7] drop-shadow-sm tracking-tight leading-tight">脑力小镇</h1>
          <p className="text-2xl text-[#0369A1] font-bold max-w-sm mx-auto">
            活动活动大脑，<br/>每天更年轻！
          </p>
        </div>
        <button 
          onClick={handleStart}
          className="w-full max-w-sm bg-[#0EA5E9] text-white text-[28px] font-extrabold py-6 rounded-[30px] border-4 border-[#0284C7] shadow-[0_8px_0_#0369A1] active:translate-y-[8px] active:shadow-none transition-all tracking-wider"
        >
          开始拜访
        </button>
      </div>
    );
  }

  if (currentStep >= STAGES.length) {
    const totalScore = stageAnswers.filter((item) => item.isCorrect).length;
    const percent = stageAnswers.length > 0 ? Math.round((totalScore / stageAnswers.length) * 100) : 0;

    return (
      <div className="min-h-[100dvh] bg-[#FFFBEB] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <Confetti width={width} height={height} recycle={false} numberOfPieces={800} gravity={0.15} />
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, stiffness: 60 }}
          className="mb-12 bg-white p-10 rounded-full shadow-xl border-8 border-yellow-200"
        >
          <Trophy size={140} className="text-amber-400" fill="#FBBF24" strokeWidth={1} />
        </motion.div>
        
        <h1 className="text-[36px] font-extrabold text-amber-600 mb-6 text-center leading-snug">
          太厉害啦！<br/>您的脑力棒棒的！
        </h1>
        
        <div className="bg-white p-6 sm:p-8 rounded-[30px] w-full max-w-sm shadow-[0_8px_0_0_#FDE68A] border-4 border-yellow-200 mx-auto mb-10">
          <h2 className="text-2xl font-extrabold text-gray-700 mb-8 text-center tracking-wide">您的综合脑力评估</h2>

          {/* 可视化指示槽 */}
          <div className="relative w-full mb-6 pt-10 px-2">
            <motion.div
              initial={{ left: "20%", opacity: 0 }}
              animate={{ left: "85%", opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
              className="absolute top-0 -translate-x-1/2 flex flex-col items-center pb-1 drop-shadow-sm z-10"
            >
              <div className="bg-emerald-500 text-white font-extrabold text-base sm:text-lg px-4 py-1.5 rounded-2xl mb-1 shadow-sm whitespace-nowrap">
                活跃度 {percent}%
              </div>
              {/* 向下的箭头 */}
              <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[12px] border-l-transparent border-r-transparent border-t-emerald-500"></div>
            </motion.div>

            {/* 三段式进度条 */}
            <div className="w-full h-8 rounded-full overflow-hidden flex bg-gray-100 shadow-inner">
              <div className="flex-1 bg-orange-400 border-r-4 border-white/50"></div>
              <div className="flex-[1.5] bg-yellow-400 border-r-4 border-white/50"></div>
              <div className="flex-[1.5] bg-emerald-400"></div>
            </div>

            {/* 底部提示文字 */}
            <div className="flex justify-between w-full text-[15px] sm:text-base font-extrabold mt-4">
              <span className="flex-1 text-left text-orange-500 ml-1">多多锻炼</span>
              <span className="flex-[1.5] text-center text-yellow-500">状态平稳</span>
              <span className="flex-[1.5] text-right text-emerald-500 mr-1">思维敏捷</span>
            </div>
          </div>

          <p className="text-xl text-gray-600 text-center font-bold leading-relaxed mt-8 bg-yellow-50/50 p-4 rounded-2xl border-2 border-yellow-100">
             您的状态属于 <span className="text-2xl text-emerald-500 font-black mx-1">思维敏捷</span><br/>请每天坚持做脑力体操哦！
          </p>
        </div>
        {isSaving && <p className="text-amber-700 text-lg font-bold mb-6">正在保存测评结果...</p>}
        {saveError && <p className="text-red-500 text-lg font-bold mb-6">{saveError}</p>}

        <button 
          onClick={() => {
            setCurrentStep(-1);
            setSessionId(null);
            setStageAnswers([]);
            setSaveError(null);
            setHasSubmittedResult(false);
          }}
          className="w-full max-w-sm bg-[#F59E0B] text-white text-[26px] font-extrabold py-6 rounded-[30px] border-4 border-[#D97706] shadow-[0_8px_0_#B45309] active:translate-y-[8px] active:shadow-none transition-all"
        >
          回到小镇主页
        </button>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-[#F8FAFC] font-sans overflow-hidden select-none">
      {renderTutorial()}
      {renderProgressBar()}
      
      <main className="flex-1 overflow-y-auto w-full">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="min-h-full flex flex-col pb-[120px]"
          >
             {renderCurrentStage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className={`fixed bottom-0 left-0 right-0 p-6 z-30 shrink-0 transition-colors duration-300 border-t-2 ${
        feedbackState === 'success' ? 'bg-[#ECFDF5] border-[#A7F3D0]' : 'bg-white/90 backdrop-blur-md border-gray-100'
      }`}>
        <div className="max-w-lg mx-auto flex flex-col">
          <AnimatePresence>
            {feedbackState === 'success' && (
              <motion.div 
                initial={{ y: 20, opacity: 0, height: 0 }} 
                animate={{ y: 0, opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 text-[#059669] font-extrabold text-[26px] mb-4 ml-2"
              >
                <div className="bg-[#10B981] p-2 rounded-full shadow-sm">
                  <Star size={28} className="text-white" fill="white" strokeWidth={2} />
                </div>
                {currentPraise}
              </motion.div>
            )}
          </AnimatePresence>
          <button 
             onClick={handleBottomAction}
             disabled={feedbackState === 'idle' && !canProceed()}
             className={`w-full py-6 text-[26px] font-extrabold rounded-[30px] transition-all border-4
               ${feedbackState === 'success'
                 ? 'bg-[#10B981] text-white border-[#059669] shadow-[0_8px_0_#047857] active:translate-y-[8px] active:shadow-none'
                 : canProceed()
                 ? 'bg-[#0EA5E9] text-white border-[#0284C7] shadow-[0_8px_0_#0369A1] active:translate-y-[8px] active:shadow-none'
                 : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'}
             `}
          >
            {feedbackState === 'success' ? '继续' : (activeStage?.type === 'memory-show' ? '我记住了' : STAGES[currentStep+1] ? '选好了' : '完成测评')}
          </button>
        </div>
      </div>
    </div>
  );
}
