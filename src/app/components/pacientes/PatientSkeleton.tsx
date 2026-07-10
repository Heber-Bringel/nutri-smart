export function PatientSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 border-b border-slate-100 animate-pulse bg-white">
      {/* Avatar Circular */}
      <div className="w-7 h-7 rounded-full bg-slate-200 flex-shrink-0" />
      
      {/* Nome e E-mail */}
      <div className="flex-1 min-w-0">
        <div className="h-3.5 bg-slate-200 rounded w-1/3 mb-2" />
        <div className="h-2.5 bg-slate-100 rounded w-1/4" />
      </div>
      
      {/* Data do último atendimento */}
      <div className="w-20 h-2.5 bg-slate-100 rounded flex-shrink-0" />
    </div>
  );
}
