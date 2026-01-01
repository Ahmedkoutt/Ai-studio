
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState, Question } from '../types';

interface Props {
  state: AppState;
  onSetQuestions: (questions: Question[]) => void;
}

const QuestionsDisplayPage: React.FC<Props> = ({ state, onSetQuestions }) => {
  const navigate = useNavigate();

  const handleDeleteAll = () => {
    if (confirm('هل ترغب حقاً في مسح كافة الأسئلة؟')) {
      onSetQuestions([]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `أسئلة اختبار من الخبير التعليمي Gemini:\n${state.questions.map(q => `${q.id}. ${q.text}`).join('\n')}`;
    if (navigator.share) {
      navigator.share({
        title: 'أسئلة اختبار Gemini',
        text: text,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert("تم نسخ الأسئلة إلى الحافظة لمشاركتها!");
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-white px-4 py-3 border-b border-slate-200 shadow-sm shrink-0 print:hidden">
        <div className="flex items-center gap-2">
           <button onClick={() => navigate(-1)} className="size-8 flex items-center justify-center rounded-full hover:bg-slate-100">
              <span className="material-symbols-outlined text-slate-600">arrow_forward</span>
           </button>
           <h1 className="text-sm font-bold text-slate-800">بنك الأسئلة</h1>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button onClick={() => navigate('/chat')} className="flex h-8 w-10 items-center justify-center rounded-lg text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">chat</span>
          </button>
          <button className="flex h-8 w-10 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
            <span className="material-symbols-outlined text-[18px]">quiz</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar pb-10">
        
        {/* ترويسة الاختبار الرسمية (تظهر فقط في الطباعة) */}
        <div className="exam-header">
          <div className="flex justify-between items-start mb-6">
            <div className="text-right space-y-1">
              <p className="font-bold text-lg">اختبار: {state.settings.chapterName || 'مادة تعليمية'}</p>
              <p className="text-sm text-slate-600 font-bold">المستوى: {state.settings.difficulty === 'easy' ? 'سهل' : state.settings.difficulty === 'medium' ? 'متوسط' : 'صعب'}</p>
            </div>
            <div className="text-center">
              <p className="font-black text-xl border-2 border-black px-4 py-2">اختبار Gemini الذكي</p>
            </div>
            <div className="text-left space-y-1">
              <p className="text-sm">التاريخ: {new Date().toLocaleDateString('ar-EG')}</p>
              <p className="text-sm">عدد الأسئلة: {state.questions.length}</p>
            </div>
          </div>
          
          <div className="border-2 border-black p-4 grid grid-cols-2 gap-y-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="font-bold">اسم الطالب:</span>
              <span className="border-b border-dotted border-black flex-1 min-w-[200px]">......................................................</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">رقم الجلوس:</span>
              <span className="border-b border-dotted border-black w-24">...................</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">الفصل:</span>
              <span className="border-b border-dotted border-black w-32">...................</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <div className="border-2 border-black p-2 flex items-center gap-4">
                <span className="font-bold">الدرجة:</span>
                <span className="text-xl"> / {state.questions.length * 2}</span>
              </div>
            </div>
          </div>
          <div className="text-center font-bold underline mb-6 text-lg italic">أجب عن الأسئلة التالية بكل دقة:</div>
        </div>

        {/* أزرار التحكم (مخفية في الطباعة) */}
        <div className="grid grid-cols-4 gap-2 print:hidden">
          <button onClick={handlePrint} className="flex flex-col items-center gap-1.5 bg-white p-2.5 rounded-xl border border-slate-200 hover:border-primary transition-all shadow-sm">
            <span className="material-symbols-outlined text-primary text-lg">print</span>
            <span className="text-[9px] font-bold text-slate-600">طباعة</span>
          </button>
          <button onClick={handlePrint} className="flex flex-col items-center gap-1.5 bg-white p-2.5 rounded-xl border border-slate-200 hover:border-primary transition-all shadow-sm">
            <span className="material-symbols-outlined text-blue-500 text-lg">picture_as_pdf</span>
            <span className="text-[9px] font-bold text-slate-600">حفظ PDF</span>
          </button>
          <button onClick={handleShare} className="flex flex-col items-center gap-1.5 bg-white p-2.5 rounded-xl border border-slate-200 hover:border-primary transition-all shadow-sm">
            <span className="material-symbols-outlined text-green-500 text-lg">share</span>
            <span className="text-[9px] font-bold text-slate-600">مشاركة</span>
          </button>
          <button onClick={handleDeleteAll} className="flex flex-col items-center gap-1.5 bg-white p-2.5 rounded-xl border border-slate-200 hover:border-red-400 transition-all shadow-sm">
            <span className="material-symbols-outlined text-red-500 text-lg">delete_sweep</span>
            <span className="text-[9px] font-bold text-slate-600">مسح</span>
          </button>
        </div>

        <div className="space-y-4">
          {state.questions.length > 0 ? (
            state.questions.map((q) => (
              <div key={q.id} className="question-card rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3 print:hidden">
                  <span className="flex items-center justify-center size-6 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">#{q.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${q.type === 'mcq' ? 'bg-blue-50 text-primary' : 'bg-purple-50 text-purple-600'}`}>
                    {q.type === 'mcq' ? 'اختياري' : 'صواب/خطأ'}
                  </span>
                </div>
                
                <p className="question-text text-xs font-bold text-slate-800 leading-6 text-right mb-4">
                  <span className="hidden print:inline-block ml-2">{q.id}- </span>
                  {q.text}
                </p>

                {q.type === 'mcq' ? (
                  <div className="grid gap-2">
                    {q.options?.map((opt, idx) => (
                      <div key={idx} className={`option-item p-2.5 rounded-lg border text-[11px] text-right flex items-center justify-between ${state.settings.showAnswers && opt === q.answer ? 'border-green-400 bg-green-50/50 text-green-700 font-bold' : 'border-slate-100 bg-slate-50 text-slate-600'}`}>
                        <div className="flex items-center gap-2">
                          <span className="print:inline-block hidden border border-black size-4 rounded-sm ml-1"></span>
                          <span>{opt}</span>
                        </div>
                        {state.settings.showAnswers && opt === q.answer && <span className="material-symbols-outlined text-sm print:hidden">check_circle</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {['صواب', 'خطأ'].map((opt) => (
                      <div key={opt} className={`flex-1 p-2.5 rounded-lg border text-[11px] text-center ${state.settings.showAnswers && opt === q.answer ? 'border-green-400 bg-green-50/50 text-green-700 font-bold' : 'border-slate-100 bg-slate-50 text-slate-600'}`}>
                        {opt}
                      </div>
                    ))}
                  </div>
                )}

                {/* مفتاح الحل للطباعة (يظهر فقط إذا كان مفعل) */}
                {state.settings.showAnswers && (
                  <div className="answer-key hidden text-[10pt] mt-2 italic">
                    الإجابة الصحيحة: {q.answer}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 opacity-50 print:hidden">
               <span className="material-symbols-outlined text-5xl mb-2">inventory_2</span>
               <p className="text-xs font-bold">لا توجد أسئلة منشأة حالياً</p>
            </div>
          )}
        </div>
        
        {/* عبارة ختامية للطباعة */}
        <div className="hidden print:block text-center mt-10 font-bold border-t border-black pt-4">
           --- انتهت الأسئلة مع تمنياتنا بالتوفيق والنجاح ---
        </div>
      </main>
      
      <footer className="p-4 text-center border-t border-slate-100 bg-white print:hidden">
          <p className="text-[9px] text-slate-400 font-bold">حقوق الإعداد: أحمد قط جادالله &copy; ٢٠٢٤</p>
      </footer>
    </div>
  );
};

export default QuestionsDisplayPage;
