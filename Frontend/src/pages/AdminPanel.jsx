import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTables,
  createTable,
  updateTable,
  deleteTable,
  clearTableState,
} from '../store/slices/tableSlice.js';
import {
  fetchAllReservations,
  adminUpdateReservation,
  adminCancelReservation,
  clearReservationState,
  fetchTimeSlots,
} from '../store/slices/reservationSlice.js';
import {
  Layers,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Mail,
  ToggleLeft,
  ToggleRight,
  Filter,
} from 'lucide-react';
import Spinner from '../components/Spinner.jsx';
import Modal from '../components/Modal.jsx';

export default function AdminPanel({ showToast }) {
  const dispatch = useDispatch();

  // Redux States
  const { tables, loading: tablesLoading, error: tablesError, success: tablesSuccess } = useSelector((state) => state.tables);
  const { reservations, timeSlots, loading: resLoading, error: resError, success: resSuccess } = useSelector((state) => state.reservations);

  // Tab State
  const [activeTab, setActiveTab] = useState('tables'); // 'tables' or 'reservations'

  // Modals & Forms State
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [tableModalMode, setTableModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableFormData, setTableFormData] = useState({
    label: '',
    capacity: 2,
    isActive: true,
  });

  const [isResModalOpen, setIsResModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [resFormData, setResFormData] = useState({
    date: '',
    timeSlot: '',
    guests: 2,
    tableId: '',
    status: 'confirmed',
  });

  const [dateFilter, setDateFilter] = useState('');

  // Initial Data Fetch
  useEffect(() => {
    dispatch(fetchTables());
    dispatch(fetchAllReservations());
    dispatch(fetchTimeSlots());
    return () => {
      dispatch(clearTableState());
      dispatch(clearReservationState());
    };
  }, [dispatch]);

  // Handle Operations Success
  useEffect(() => {
    if (tablesSuccess) {
      showToast(
        tableModalMode === 'create'
          ? 'Table created successfully!'
          : 'Table updated successfully!',
        'success'
      );
      setIsTableModalOpen(false);
      dispatch(clearTableState());
    }
    if (tablesError) {
      showToast(tablesError, 'error');
      dispatch(clearTableState());
    }
  }, [tablesSuccess, tablesError, tableModalMode, dispatch, showToast]);

  useEffect(() => {
    if (resSuccess) {
      showToast('Reservation updated successfully!', 'success');
      setIsResModalOpen(false);
      dispatch(fetchAllReservations(dateFilter));
      dispatch(clearReservationState());
    }
    if (resError) {
      showToast(resError, 'error');
      dispatch(clearReservationState());
    }
  }, [resSuccess, resError, dispatch, showToast, dateFilter]);

  // Filter handlers
  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
    dispatch(fetchAllReservations(e.target.value));
  };

  const handleClearFilter = () => {
    setDateFilter('');
    dispatch(fetchAllReservations(''));
  };

  // Table operations
  const openCreateTableModal = () => {
    setTableModalMode('create');
    setTableFormData({ label: '', capacity: 2, isActive: true });
    setIsTableModalOpen(true);
  };

  const openEditTableModal = (table) => {
    setTableModalMode('edit');
    setSelectedTable(table);
    setTableFormData({
      label: table.label,
      capacity: table.capacity,
      isActive: table.isActive,
    });
    setIsTableModalOpen(true);
  };

  const handleTableFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTableFormData({
      ...tableFormData,
      [name]: type === 'checkbox' ? checked : name === 'capacity' ? Number(value) : value,
    });
  };

  const handleTableSubmit = (e) => {
    e.preventDefault();
    if (!tableFormData.label.trim() || tableFormData.capacity < 1) {
      showToast('Please fill in all table details correctly', 'error');
      return;
    }
    if (tableModalMode === 'create') {
      dispatch(createTable(tableFormData));
    } else {
      dispatch(updateTable({ id: selectedTable._id, updates: tableFormData }));
    }
  };

  const handleDeleteTable = (id) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      dispatch(deleteTable(id)).then((res) => {
        if (!res.error) {
          showToast('Table deleted successfully.', 'success');
        }
      });
    }
  };

  const handleToggleTableActive = (table) => {
    dispatch(
      updateTable({
        id: table._id,
        updates: { isActive: !table.isActive },
      })
    ).then((res) => {
      if (!res.error) {
        showToast(
          `Table is now ${!table.isActive ? 'Active' : 'Inactive'}.`,
          'success'
        );
      }
    });
  };

  // Reservation operations
  const openEditResModal = (res) => {
    setSelectedReservation(res);
    setResFormData({
      date: res.date,
      timeSlot: res.timeSlot,
      guests: res.guests,
      tableId: res.table?._id || '',
      status: res.status,
    });
    setIsResModalOpen(true);
  };

  const handleResFormChange = (e) => {
    setResFormData({
      ...resFormData,
      [e.target.name]: e.target.name === 'guests' ? Number(e.target.value) : e.target.value,
    });
  };

  const handleResSubmit = (e) => {
    e.preventDefault();
    dispatch(
      adminUpdateReservation({
        id: selectedReservation._id,
        updates: resFormData,
      })
    );
  };

  const handleCancelReservation = (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      dispatch(adminCancelReservation(id)).then((res) => {
        if (!res.error) {
          showToast('Reservation successfully cancelled.', 'success');
        }
      });
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* Sub Header & Tab Selectors */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('tables')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'tables'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="h-4 w-4" />
            Tables Manager
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'reservations'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Reservations Board
          </button>
        </div>

        {activeTab === 'tables' ? (
          <button
            onClick={openCreateTableModal}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl border border-slate-250 transition-all duration-300 text-sm cursor-pointer"
          >
            <Plus className="h-4 w-4 text-emerald-600" />
            Add New Table
          </button>
        ) : (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-slate-500 text-xs font-bold hidden md:inline">Filter Date:</span>
            <div className="relative flex-grow sm:flex-grow-0">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Filter className="h-3.5 w-3.5" />
              </span>
              <input
                type="date"
                value={dateFilter}
                onChange={handleDateFilterChange}
                className="bg-slate-50 border border-slate-200 text-slate-750 text-xs rounded-xl py-2 pl-9 pr-3 focus:bg-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              />
            </div>
            {dateFilter && (
              <button
                onClick={handleClearFilter}
                className="text-xs text-rose-600 hover:text-rose-500 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tab: Tables Manager Content */}
      {activeTab === 'tables' && (
        <div className="space-y-6">
          {tablesLoading && tables.length === 0 ? (
            <div className="flex justify-center py-20">
              <Spinner size="md" />
            </div>
          ) : tables.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
              <Layers className="h-12 w-12 text-slate-250 mx-auto mb-3" />
              <span className="font-semibold text-sm text-slate-650">No tables loaded.</span>
              <p className="text-xs text-slate-500 mt-1">Add reference restaurant tables to initialize booking inventory.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
              {tables.map((table) => (
                <div
                  key={table._id}
                  className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md flex flex-col justify-between h-44 transition-all duration-300 ${
                    table.isActive ? 'border-slate-200' : 'border-slate-150 opacity-60 bg-slate-50/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 tracking-tight">{table.label}</h4>
                      <span className="text-slate-550 text-xs mt-1 flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-slate-405" />
                        Capacity: {table.capacity}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleTableActive(table)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        table.isActive
                          ? 'text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
                          : 'text-slate-400 border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                      title={table.isActive ? 'Deactivate Table' : 'Activate Table'}
                    >
                      {table.isActive ? (
                        <ToggleRight className="h-5 w-5" />
                      ) : (
                        <ToggleLeft className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center gap-3 border-t border-slate-100 pt-4 mt-4">
                    <button
                      onClick={() => openEditTableModal(table)}
                      className="flex-grow flex items-center justify-center gap-1.5 bg-slate-50 border border-slate-200 hover:border-slate-350 hover:text-slate-805 text-slate-500 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTable(table._id)}
                      className="flex-grow flex items-center justify-center gap-1.5 bg-slate-55 border border-slate-200 hover:border-rose-200 hover:text-rose-600 text-slate-500 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Reservations Board Content */}
      {activeTab === 'reservations' && (
        <div className="space-y-6">
          {resLoading && reservations.length === 0 ? (
            <div className="flex justify-center py-20">
              <Spinner size="md" />
            </div>
          ) : reservations.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
              <Calendar className="h-12 w-12 text-slate-250 mx-auto mb-3" />
              <span className="font-semibold text-sm text-slate-650">No reservations found.</span>
              <p className="text-xs text-slate-505 mt-1">Try selecting a different filter date or clear filters.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 animate-fade-in">
              {reservations.map((res) => {
                const isCancelled = res.status === 'cancelled';
                return (
                  <div
                    key={res._id}
                    className={`bg-white border p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all duration-300 shadow-sm ${
                      isCancelled
                        ? 'border-slate-100 opacity-60 bg-slate-50/50'
                        : 'border-slate-200 hover:border-slate-250'
                    }`}
                  >
                    {/* User and date info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 flex-grow">
                      {/* Column 1: Customer info */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <span className="font-bold text-slate-800 text-sm">{res.user?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <span>{res.user?.email || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Column 2: Booking settings */}
                      <div className="space-y-1 text-xs text-slate-550">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>Date: <strong className="text-slate-800">{res.date}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>Time: <strong className="text-slate-800">{res.timeSlot}</strong></span>
                        </div>
                      </div>

                      {/* Column 3: Table and status info */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-slate-500">Table: <strong className="text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{res.table?.label || 'Auto'}</strong></span>
                          <span className="text-slate-500">Guests: <strong className="text-slate-850 font-bold">{res.guests}</strong></span>
                        </div>
                        <div>
                          <span
                            className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                              isCancelled
                                ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            }`}
                          >
                            {isCancelled ? (
                              <>
                                <XCircle className="h-2.5 w-2.5" />
                                Cancelled
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-2.5 w-2.5" />
                                Confirmed
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Column 4: Admin Controls */}
                    <div className="flex md:flex-col items-center sm:justify-end gap-3 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                      <button
                        onClick={() => openEditResModal(res)}
                        className="flex-grow md:flex-grow-0 flex items-center justify-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 transition-all font-semibold text-xs cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" />
                        Modify
                      </button>
                      {!isCancelled && (
                        <button
                          onClick={() => handleCancelReservation(res._id)}
                          className="flex-grow md:flex-grow-0 flex items-center justify-center gap-1 bg-slate-50 hover:bg-rose-50 text-rose-600 hover:text-rose-500 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-rose-200 transition-all font-semibold text-xs cursor-pointer"
                        >
                          <XCircle className="h-3 w-3" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Table Editor/Creator Modal */}
      <Modal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        title={tableModalMode === 'create' ? 'Add New Table' : 'Edit Table Details'}
      >
        <form onSubmit={handleTableSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Table Label
            </label>
            <input
              type="text"
              name="label"
              value={tableFormData.label}
              onChange={handleTableFormChange}
              placeholder="e.g. T8"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Seating Capacity
            </label>
            <input
              type="number"
              name="capacity"
              value={tableFormData.capacity}
              onChange={handleTableFormChange}
              min="1"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all text-sm"
            />
          </div>

          {tableModalMode === 'edit' && (
            <div className="flex items-center gap-2.5 pt-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={tableFormData.isActive}
                onChange={handleTableFormChange}
                className="h-4 w-4 bg-white border-slate-300 rounded text-emerald-600 focus:ring-transparent cursor-pointer"
              />
              <label htmlFor="isActive" className="text-sm font-semibold text-slate-650 cursor-pointer">
                Table is active and open for booking
              </label>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsTableModalOpen(false)}
              className="flex-grow bg-slate-100 hover:bg-slate-200 text-slate-650 border border-slate-200 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={tablesLoading}
              className="flex-grow bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg hover:shadow-emerald-500/10 flex items-center justify-center cursor-pointer"
            >
              {tablesLoading ? <Spinner size="sm" className="!border-t-white" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Reservation Editor Modal */}
      <Modal
        isOpen={isResModalOpen}
        onClose={() => setIsResModalOpen(false)}
        title="Modify Reservation Details"
      >
        <form onSubmit={handleResSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 mb-2">
              Reservation Date
            </label>
            <input
              type="date"
              name="date"
              value={resFormData.date}
              onChange={handleResFormChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all text-sm cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 mb-2">
                Time Slot
              </label>
              <select
                name="timeSlot"
                value={resFormData.timeSlot}
                onChange={handleResFormChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all text-sm cursor-pointer"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 mb-2">
                Guests
              </label>
              <input
                type="number"
                name="guests"
                value={resFormData.guests}
                onChange={handleResFormChange}
                min="1"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 mb-2">
              Table Assigned
            </label>
            <select
              name="tableId"
              value={resFormData.tableId}
              onChange={handleResFormChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all text-sm cursor-pointer"
            >
              {tables.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.label} (Seats: {t.capacity} {t.isActive ? '' : '- Inactive'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 mb-2">
              Status
            </label>
            <select
              name="status"
              value={resFormData.status}
              onChange={handleResFormChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all text-sm cursor-pointer"
            >
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsResModalOpen(false)}
              className="flex-grow bg-slate-100 hover:bg-slate-200 text-slate-650 border border-slate-205 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={resLoading}
              className="flex-grow bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg hover:shadow-emerald-500/10 flex items-center justify-center cursor-pointer"
            >
              {resLoading ? <Spinner size="sm" className="!border-t-white" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
