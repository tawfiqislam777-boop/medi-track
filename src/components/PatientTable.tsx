import { Eye, Pencil, Trash2, User } from "lucide-react";
import { Patient } from "@/types/patient";

interface Props {
  patients: Patient[];
  loading: boolean;
  onView: (p: Patient) => void;
  onEdit: (p: Patient) => void;
  onDelete: (p: Patient) => void;
}

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Inactive: "bg-slate-100 text-slate-600 border-slate-200",
  Critical: "bg-red-50 text-red-700 border-red-200",
  Recovered: "bg-blue-50 text-blue-700 border-blue-200",
};

function SkeletonRow() {
  return (
    <tr>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-4 py-4">
          <div className={`h-4 shimmer rounded ${i === 1 ? "w-32" : i === 2 ? "w-40" : "w-24"}`} />
        </td>
      ))}
    </tr>
  );
}

export default function PatientTable({ patients, loading, onView, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/60">
            <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
            <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
            <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Age</th>
            <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Condition</th>
            <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : patients.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-20 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <User className="w-7 h-7 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">No patients found</p>
                  <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
                </div>
              </td>
            </tr>
          ) : (
            patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors animate-fade-in group">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                      {patient.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{patient.name}</p>
                      <p className="text-xs text-slate-400 md:hidden">{patient.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <p className="text-sm text-slate-700">{patient.email}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{patient.phone}</p>
                </td>
                <td className="px-4 py-4 hidden sm:table-cell">
                  <span className="text-sm font-medium text-slate-700">{patient.age} yrs</span>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                    {patient.condition}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-semibold ${statusStyles[patient.status] || statusStyles.Active}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
                    {patient.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onView(patient)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => onEdit(patient)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(patient)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
