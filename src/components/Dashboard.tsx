"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, UserPlus, Activity, AlertCircle, Search, Filter, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import PatientTable from "./PatientTable";
import PatientModal from "./PatientModal";
import DeleteModal from "./DeleteModal";
import PatientDetailModal from "./PatientDetailModal";
import StatsCard from "./StatsCard";
import { Patient, CONDITIONS } from "@/types/patient";

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [conditionFilter, setConditionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [deletePatient, setDeletePatient] = useState<Patient | null>(null);
  const [viewPatient, setViewPatient] = useState<Patient | null>(null);

  // Stats
  const [stats, setStats] = useState({ total: 0, active: 0, critical: 0, conditions: 0 });

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        condition: conditionFilter,
        status: statusFilter,
        page: String(page),
        limit: String(limit),
      });
      const res = await fetch(`/api/patients?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPatients(data.patients);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  }, [search, conditionFilter, statusFilter, page]);

  const fetchStats = useCallback(async () => {
    try {
      const [allRes, activeRes, criticalRes] = await Promise.all([
        fetch("/api/patients?limit=1"),
        fetch("/api/patients?status=Active&limit=1"),
        fetch("/api/patients?status=Critical&limit=1"),
      ]);
      const [all, active, critical] = await Promise.all([allRes.json(), activeRes.json(), criticalRes.json()]);
      setStats({
        total: all.total || 0,
        active: active.total || 0,
        critical: critical.total || 0,
        conditions: CONDITIONS.length,
      });
    } catch {}
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchPatients();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, conditionFilter, statusFilter]);

  useEffect(() => {
    fetchPatients();
  }, [page]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleSaved = () => {
    fetchPatients();
    fetchStats();
    setShowAddModal(false);
    setEditPatient(null);
  };

  const handleDeleted = () => {
    fetchPatients();
    fetchStats();
    setDeletePatient(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg text-slate-900 leading-none">MediTrack</h1>
                <p className="text-xs text-slate-500 mt-0.5">Patient Management System</p>
              </div>
            </div>
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Patient</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Patients" value={stats.total} icon={Users} color="blue" trend="All registered" />
          <StatsCard title="Active" value={stats.active} icon={Activity} color="green" trend="Currently active" />
          <StatsCard title="Critical" value={stats.critical} icon={AlertCircle} color="red" trend="Need attention" />
          <StatsCard title="Conditions" value={stats.conditions} icon={Filter} color="purple" trend="Tracked types" />
        </div>

        {/* Patient Table Card */}
        <div className="card">
          {/* Filters */}
          <div className="p-5 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <select
                value={conditionFilter}
                onChange={(e) => { setConditionFilter(e.target.value); setPage(1); }}
                className="input-field w-full sm:w-48"
              >
                <option value="All">All Conditions</option>
                {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="input-field w-full sm:w-40"
              >
                <option value="All">All Statuses</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Critical</option>
                <option>Recovered</option>
              </select>
              <button onClick={fetchPatients} className="btn-secondary shrink-0" title="Refresh">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2.5 text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-700">{patients.length}</span> of{" "}
              <span className="font-semibold text-slate-700">{total}</span> patients
            </div>
          </div>

          <PatientTable
            patients={patients}
            loading={loading}
            onView={setViewPatient}
            onEdit={setEditPatient}
            onDelete={setDeletePatient}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary text-xs px-3 py-2 disabled:opacity-40"
              >
                ← Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                        page === p
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary text-xs px-3 py-2 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showAddModal && (
        <PatientModal onClose={() => setShowAddModal(false)} onSaved={handleSaved} />
      )}
      {editPatient && (
        <PatientModal patient={editPatient} onClose={() => setEditPatient(null)} onSaved={handleSaved} />
      )}
      {deletePatient && (
        <DeleteModal patient={deletePatient} onClose={() => setDeletePatient(null)} onDeleted={handleDeleted} />
      )}
      {viewPatient && (
        <PatientDetailModal patient={viewPatient} onClose={() => setViewPatient(null)} onEdit={(p) => { setViewPatient(null); setEditPatient(p); }} />
      )}
    </div>
  );
}
