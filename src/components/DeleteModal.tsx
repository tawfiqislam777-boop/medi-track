"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Patient } from "@/types/patient";

interface Props {
  patient: Patient;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteModal({ patient, onClose, onDeleted }: Props) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/patients/${patient.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to delete patient");
        return;
      }
      toast.success(`${patient.name} has been removed`);
      onDeleted();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="font-display font-bold text-slate-900 text-lg">Delete Patient</h2>
              <p className="text-sm text-slate-500">This action cannot be undone</p>
            </div>
          </div>
          <p className="text-slate-600 text-sm bg-slate-50 rounded-xl p-4">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-slate-900">{patient.name}</span> from the system?
            All their data will be permanently deleted.
          </p>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary" disabled={deleting}>Cancel</button>
          <button onClick={handleDelete} className="btn-danger" disabled={deleting}>
            {deleting ? <><Loader2 className="w-4 h-4 animate-spin" />Deleting...</> : "Delete Patient"}
          </button>
        </div>
      </div>
    </div>
  );
}
