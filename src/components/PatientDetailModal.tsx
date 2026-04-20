import { X, Pencil, Mail, Phone, Calendar, Activity, FileText, Clock } from "lucide-react";
import { Patient } from "@/types/patient";

interface Props {
  patient: Patient;
  onClose: () => void;
  onEdit: (p: Patient) => void;
}

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Inactive: "bg-slate-100 text-slate-600 border-slate-200",
  Critical: "bg-red-50 text-red-700 border-red-200",
  Recovered: "bg-blue-50 text-blue-700 border-blue-200",
};

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function PatientDetailModal({ patient, onClose, onEdit }: Props) {
  const created = new Date(patient.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 pt-6 pb-12 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-blue-100 hover:text-white hover:bg-blue-500/50 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold shadow-lg border border-white/30">
              {patient.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-xl">{patient.name}</h2>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-semibold mt-1 ${statusStyles[patient.status] || statusStyles.Active}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />{patient.status}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-0 pb-6 -mt-6">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4">
            <InfoRow icon={Mail} label="Email" value={patient.email} />
            <InfoRow icon={Phone} label="Phone" value={patient.phone} />
            <InfoRow icon={Calendar} label="Age" value={`${patient.age} years old`} />
            <InfoRow icon={Activity} label="Condition" value={patient.condition} />
            <InfoRow icon={Clock} label="Registered" value={created} />
            {patient.notes && <InfoRow icon={FileText} label="Notes" value={patient.notes} />}
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1">Close</button>
            <button onClick={() => onEdit(patient)} className="btn-primary flex-1">
              <Pencil className="w-4 h-4" /> Edit Patient
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
