"use client";

import { useState, useEffect } from "react";

const EMOTIONS = [
  { id: "joy", emoji: "😊", label: "기쁨", className: "text-tertiary" },
  { id: "calm", emoji: "✨", label: "평온", className: "text-on-secondary-container" },
  { id: "surprise", emoji: "😐", label: "무난함", className: "text-outline" },
  { id: "sadness", emoji: "☁️", label: "우울", className: "text-primary" },
  { id: "anger", emoji: "🔥", label: "분노", className: "text-error" },
];

export default function Home() {
  const [diary, setDiary] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("journal");
  const [memories, setMemories] = useState<{datetime: string, diary: string, emotionId?: string | null}[]>([]);

  useEffect(() => {
    setIsMounted(true);
    // 로컬 스토리지에서 저장된 일기 불러오기
    const savedMemories = localStorage.getItem("ai-diary-memories");
    if (savedMemories) {
      try {
        setMemories(JSON.parse(savedMemories));
      } catch (e) {
        console.error("Failed to parse memories from local storage");
      }
    }
  }, []);

  const handleAnalyze = async () => {
    if (!diary.trim()) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diary }),
      });
      
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      
      const data = await response.json();
      setSelectedEmotion(data.emotionId);
      setAnalysisResult(data.feedback);
    } catch (error) {
      console.error("AI 분석 오류:", error);
      setAnalysisResult("AI 분석에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToJournal = async () => {
    if (!diary.trim()) return;
    setIsSaving(true);
    try {
      const sheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;
      const isoDatetime = new Date().toISOString();
      
      // 로컬 스토리지에 우선 저장 (사용자 경험 향상)
      const newMemory = { datetime: isoDatetime, diary, emotionId: selectedEmotion };
      const updatedMemories = [newMemory, ...memories];
      setMemories(updatedMemories);
      localStorage.setItem("ai-diary-memories", JSON.stringify(updatedMemories));

      if (sheetUrl) {
        const response = await fetch(sheetUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            datetime: isoDatetime,
            diary: diary
          })
        });
        
        const result = await response.json();
        if (result.status !== "success") {
          console.error("구글 시트 저장 실패:", result.message);
        }
      }

      setDiary("");
      setAnalysisResult("");
      setSelectedEmotion(null);
      alert("성공적으로 기록되었습니다.");
      setActiveTab("memories"); // 저장 후 추억 탭으로 이동
      
    } catch (error) {
      console.error("저장 중 오류 발생:", error);
      alert("기기에 일기를 저장했지만, 네트워크 문제로 구글 시트 백업에는 실패했을 수 있습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const getEmotionEmoji = (id: string | null | undefined) => {
    if (!id) return "📝";
    const emotion = EMOTIONS.find(e => e.id === id);
    return emotion ? emotion.emoji : "📝";
  };

  return (
    <>
      <header className="bg-[#f6f6f8] dark:bg-gray-950 fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-[#6200EE] dark:text-[#a98fff] p-2 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-colors rounded-full active:scale-95 duration-200">
            menu
          </button>
          <h1 className="text-xl font-bold text-[#6200EE] dark:text-[#a98fff] tracking-tighter font-headline">마음의 다락방</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
            <img alt="User profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAw4SCIqSK3BM2qCbRcpAyR6c69lM1zBlZMgRkalk20w-IMkWFKW-uLfsmW_6aRGR55Icxas4zJVkfPwC9PIZtu5rz450xuMfKyTjnw6K9J0cA7w4chSn_zF4YlPyADbw3IvYCJnVlSu9eTjArSl0S2Zx58I2YTrjFP3YDy-QrUgPhvo83tuoEroUEHEQwquKghVqqxunjv7wDaJTpSdsLb23WCBHvm3Y6roIwWGOLTy9lqFHCnz4iFnvbMOLKNWp-2xihj_40HbMrH"/>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-5xl mx-auto min-h-screen">
        {activeTab === "journal" ? (
          <>
            {/* Header Section: Editorial Layout */}
            <section className="mb-12">
              <span className="text-primary font-bold tracking-widest uppercase text-xs font-headline">
                {isMounted && new Date().toLocaleDateString('ko-KR', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
              <h2 className="text-5xl md:text-7xl font-extrabold font-headline text-on-surface mt-2 mb-6 leading-tight tracking-tighter break-keep">
                오늘 당신의 <br/> <span className="text-primary">마음</span>은 어떤가요?
              </h2>
            </section>

            {/* Main Workspace: Bento Style */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Diary Entry Area */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_-4px_32px_0_rgba(45,47,49,0.04)] relative group">
                  <div className="absolute top-8 right-8 flex gap-2">
                    <span className="material-symbols-outlined text-outline-variant hover:text-primary cursor-pointer transition-colors">image</span>
                    <span className="material-symbols-outlined text-outline-variant hover:text-primary cursor-pointer transition-colors">mic</span>
                  </div>
                  
                  <label className="block text-sm font-semibold text-outline mb-4">당신의 이야기</label>
                  <textarea 
                    className="w-full min-h-[400px] bg-transparent border-none outline-none focus:ring-0 text-xl leading-relaxed font-body placeholder:text-outline-variant/50 resize-none" 
                    placeholder="이곳에 오늘 하루의 생각과 감정을 자유롭게 적어보세요..."
                    value={diary}
                    onChange={(e) => setDiary(e.target.value)}
                  />
                  
                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !diary.trim()}
                      className={`px-8 py-4 rounded-full font-headline font-bold flex items-center gap-3 transition-all min-w-[200px] justify-center ${isAnalyzing || !diary.trim() ? 'bg-surface-dim text-on-surface-variant cursor-not-allowed' : 'bg-primary text-white hover:scale-105 active:scale-95 shadow-lg shadow-primary/20'}`}
                    >
                      {isAnalyzing ? "분석 중..." : "AI 분석하기"}
                      <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>
                        {isAnalyzing ? "hourglass_empty" : "auto_awesome"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Analysis Sidebar: The Mood Bloom */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Emotion Selector/Display */}
                <div className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
                  <h3 className="text-sm font-bold font-headline text-outline mb-8 tracking-widest uppercase">발견된 감정의 결</h3>
                  <div className="flex items-center justify-between gap-2 px-2">
                    {EMOTIONS.map((emotion) => {
                      const isActive = selectedEmotion === emotion.id;
                      if (isActive) {
                        return (
                          <div key={emotion.id} className="flex flex-col items-center gap-2 group cursor-pointer scale-150 relative transition-all">
                            <div className="absolute inset-0 bg-secondary-container/30 blur-2xl rounded-full scale-150"></div>
                            <span className="text-4xl relative select-none">{emotion.emoji}</span>
                            <span className={`text-[10px] font-bold font-headline uppercase ${emotion.className} relative`}>{emotion.label}</span>
                          </div>
                        );
                      }
                      
                      return (
                        <div 
                          key={emotion.id} 
                          onClick={() => setSelectedEmotion(emotion.id)}
                          className="flex flex-col items-center gap-2 group cursor-pointer opacity-40 hover:opacity-100 transition-all"
                        >
                          <span className="text-3xl grayscale group-hover:grayscale-0 transition-all select-none">{emotion.emoji}</span>
                          <span className={`text-[10px] font-bold font-headline uppercase ${emotion.className}`}>{emotion.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Insights Card */}
                {analysisResult && (
                  <div className="ai-mesh bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10 min-h-[300px] animate-in fade-in duration-500">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-sm" style={{fontVariationSettings: "'FILL' 1"}}>psychology</span>
                      </div>
                      <h3 className="text-lg font-bold font-headline">Gemini의 공감</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-on-surface-variant leading-relaxed font-body">
                        {analysisResult}
                      </p>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-outline-variant/10 flex flex-col gap-6">
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-xs font-bold font-headline">감정 균형점</span>
                        <span className="bg-tertiary-container text-on-tertiary-container px-4 py-1 rounded-full text-xs font-bold font-headline">사색의 깊이</span>
                        <span className="bg-primary-container/20 text-primary px-4 py-1 rounded-full text-xs font-bold font-headline">따뜻한 시선</span>
                      </div>
                      
                      <button 
                        onClick={handleSaveToJournal}
                        disabled={isSaving}
                        className="w-full bg-surface-container text-primary font-bold py-3 rounded-full hover:bg-primary hover:text-white transition-colors duration-300 disabled:opacity-50"
                      >
                        {isSaving ? "보관 중..." : "다락방에 일기 보관하기"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : activeTab === "memories" ? (
          <>
            <section className="mb-12">
              <h2 className="text-5xl font-extrabold font-headline text-on-surface mt-2 mb-2 leading-tight tracking-tighter">
                나의 <span className="text-primary">추억</span>
              </h2>
              <p className="text-on-surface-variant font-body">그동안 기록한 소중한 마음의 흔적들입니다.</p>
            </section>

            <div className="space-y-6">
              {memories.length === 0 ? (
                <div className="bg-surface-container-lowest rounded-xl p-12 text-center shadow-sm border border-outline-variant/10">
                  <span className="text-6xl mb-4 block">📦</span>
                  <h3 className="text-xl font-bold font-headline text-outline mb-2">아직 보관된 추억이 없어요</h3>
                  <p className="text-on-surface-variant font-body">오늘의 감정을 일기장에 기록해보세요.</p>
                </div>
              ) : (
                memories.map((mem, index) => {
                  const date = new Date(mem.datetime);
                  const formattedDate = date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
                  const formattedTime = date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <article key={index} className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_-4px_32px_0_rgba(45,47,49,0.04)] border border-outline-variant/5 flex flex-col md:flex-row gap-6 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex-shrink-0 flex md:flex-col items-center md:items-start gap-4 md:w-32">
                        <div className="text-5xl">{getEmotionEmoji(mem.emotionId)}</div>
                        <div>
                          <p className="font-headline font-bold text-sm text-on-surface">{formattedDate}</p>
                          <p className="font-body text-xs text-outline">{formattedTime}</p>
                        </div>
                      </div>
                      <div className="flex-grow pl-0 md:pl-6 md:border-l border-outline-variant/10">
                        <p className="text-on-surface text-lg leading-relaxed font-body whitespace-pre-wrap">
                          {mem.diary}
                        </p>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[60vh]">
            <p className="text-outline font-headline">해당 메뉴는 준비 중입니다.</p>
          </div>
        )}
      </main>

      {/* BottomNavBar Shell */}
      <nav className="bg-[#f0f1f3]/70 dark:bg-gray-900/70 backdrop-blur-xl fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 rounded-t-[3rem] z-50 shadow-[0_-4px_32px_0_rgba(45,47,49,0.04)]">
        <button 
          onClick={() => setActiveTab('journal')}
          className={`flex flex-col items-center justify-center p-3 rounded-full transition-all duration-300 ease-out min-w-[72px] ${activeTab === 'journal' ? 'bg-[#652fe7] text-white shadow-lg shadow-primary/20 -translate-y-2' : 'text-gray-500 hover:text-[#6200EE]'}`}
        >
          <span className="material-symbols-outlined">edit_note</span>
          <span className="font-body text-[11px] font-medium mt-1">일기장</span>
        </button>
        <button 
          onClick={() => setActiveTab('insights')}
          className={`flex flex-col items-center justify-center p-3 rounded-full transition-all duration-300 ease-out min-w-[72px] ${activeTab === 'insights' ? 'bg-[#652fe7] text-white shadow-lg shadow-primary/20 -translate-y-2' : 'text-gray-500 hover:text-[#6200EE]'}`}
        >
          <span className="material-symbols-outlined">analytics</span>
          <span className="font-body text-[11px] font-medium mt-1">분석</span>
        </button>
        <button 
          onClick={() => setActiveTab('memories')}
          className={`flex flex-col items-center justify-center p-3 rounded-full transition-all duration-300 ease-out min-w-[72px] ${activeTab === 'memories' ? 'bg-[#652fe7] text-white shadow-lg shadow-primary/20 -translate-y-2' : 'text-gray-500 hover:text-[#6200EE]'}`}
        >
          <span className="material-symbols-outlined">auto_stories</span>
          <span className="font-body text-[11px] font-medium mt-1">추억</span>
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center p-3 rounded-full transition-all duration-300 ease-out min-w-[72px] ${activeTab === 'settings' ? 'bg-[#652fe7] text-white shadow-lg shadow-primary/20 -translate-y-2' : 'text-gray-500 hover:text-[#6200EE]'}`}
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-body text-[11px] font-medium mt-1">설정</span>
        </button>
      </nav>
    </>
  );
}