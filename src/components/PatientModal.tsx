"use client";

import { useState, useEffect } from "react";
import { X, Loader2, UserPlus, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { Patient, CONDITIONS, STATUSES } from "@/types/patient";

interface Props {
  patient?: Patient | null;
  onClose: () => void;
  onSaved: () => void;
}

interface FormErrors {
  [key: string]: string;
}

const INITIAL_FORM = { name: "", email: "", phone: "", age: "", condition: "Hypertension", notes: "", status: "Active" };

export default function PatientModal({ patient, onClose, onSaved }: Props) {
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(patient);

  useEffect(() => {
    if (patient) {
      setForm({
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        age: String(patient.age),
        condition: patient.condition,
        notes: patient.notes || "",
        status: patient.status,
      });
    }
  }, [patient]);

  const set = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setErrors({});
    try {
      const url = isEditing ? `/api/patients/${patient!.id}` : "/api/patients";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ ...form, email: form.email.trim() }),
});
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) {
          const errMap: FormErrors = {};
          data.errors.forEach((e: { field: string; message: string }) => { errMap[e.field] = e.message; });
          setErrors(errMap);
        } else {
          toast.error(data.error || "Something went wrong");
        }
        return;
      }
      toast.success(isEditing ? "Patient updated successfully!" : "Patient added successfully!");
      onSaved();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              {isEditing ? <Pencil className="w-4 h-4 text-blue-600" /> : <UserPlus className="w-4 h-4 text-blue-600" />}
            </div>
            <div>
              <h2 className="font-display font-bold text-slate-900">{isEditing ? "Edit Patient" : "Add New Patient"}</h2>
              <p className="text-xs text-slate-500">{isEditing ? "Update patient information" : "Fill in the patient details below"}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label>
              <input className={`input-field ${errors.name ? "input-error" : ""}`} placeholder="John Doe" value={form.name} onChange={(e) => set("name", e.target.value)} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address *</label>
              <input type="email" className={`input-field ${errors.email ? "input-error" : ""}`} placeholder="john@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone Number *</label>
              <input className={`input-field ${errors.phone ? "input-error" : ""}`} placeholder="+880-xxxxxxxx" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Age *</label>
              <input type="number" min="0" max="150" className={`input-field ${errors.age ? "input-error" : ""}`} placeholder="35" value={form.age} onChange={(e) => set("age", e.target.value)} />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
              <select className="input-field" value={form.status} onChange={(e) => set("status", e.target.value)}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Medical Condition *</label>
              <select className={`input-field ${errors.condition ? "input-error" : ""}`} value={form.condition} onChange={(e) => set("condition", e.target.value)}>
                {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
              {errors.condition && <p className="text-red-500 text-xs mt-1">{errors.condition}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Notes <span className="text-slate-400 font-normal">(optional)</span></label>
              <textarea rows={3} className="input-field resize-none" placeholder="Additional notes about the patient..." value={form.notes} onChange={(e) => set("notes", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary" disabled={saving}>Cancel</button>
          <button onClick={handleSubmit} className="btn-primary" disabled={saving}>
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : isEditing ? "Update Patient" : "Add Patient"}
          </button>
        </div>
      </div>
    </div>
  );
}
