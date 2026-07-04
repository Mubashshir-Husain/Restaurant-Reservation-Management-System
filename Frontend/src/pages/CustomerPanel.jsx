import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOwnReservations,
  fetchTimeSlots,
  checkTableAvailability,
  createReservation,
  cancelOwnReservation,
  clearReservationState,
  clearAvailableTables,
} from '../store/slices/reservationSlice.js';
import {
  Calendar,
  Clock,
  Users,
  Search,
  Check,
  AlertCircle,
  XCircle,
  Clock3,
  CalendarCheck,
  Sparkles,
} from 'lucide-react';
import Spinner from '../components/Spinner.jsx';

export default function CustomerPanel({ showToast }) {
  const dispatch = useDispatch();

  // Redux Selectors
  const {
    reservations,
    timeSlots,
    availableTables,
    loading,
    checkingAvailability,
    error,
    success,
  } = useSelector((state) => state.reservations);

  // Local state for checking availability
  const getTodayDateString = () => {
    const tzOffset = new Date().getTimezoneOffset() * 60000; // offset in milliseconds
    return new Date(Date.now() - tzOffset).toISOString().split('T')[0];
  };

  const [searchParams, setSearchParams] = useState({
    date: getTodayDateString(),
    timeSlot: '',
    guests: 2,
  });

  const [selectedTableId, setSelectedTableId] = useState(''); // Empty means "Auto-Assign"
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    dispatch(fetchOwnReservations());
    dispatch(fetchTimeSlots());
    return () => {
      dispatch(clearReservationState());
      dispatch(clearAvailableTables());
    };
  }, [dispatch]);

  // Set first time slot as default when slots finish loading
  useEffect(() => {
    if (timeSlots.length > 0 && !searchParams.timeSlot) {
      setSearchParams((prev) => ({ ...prev, timeSlot: timeSlots[0] }));
    }
  }, [timeSlots, searchParams.timeSlot]);

  // Handle operation success/error notifications
  useEffect(() => {
    if (success) {
      showToast('Reservation confirmed successfully!', 'success');
      dispatch(fetchOwnReservations());
      dispatch(clearReservationState());
      dispatch(clearAvailableTables());
      setHasSearched(false);
      setSelectedTableId('');
    }
    if (error) {
      showToast(error, 'error');
      dispatch(clearReservationState());
    }
  }, [success, error, dispatch, showToast]);

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.name === 'guests' ? Number(e.target.value) : e.target.value,
    });
    setHasSearched(false);
    setSelectedTableId('');
  };

  const handleCheckAvailability = (e) => {
    e.preventDefault();
    if (!searchParams.date || !searchParams.timeSlot || searchParams.guests < 1) {
      showToast('Please fill in all availability search options', 'error');
      return;
    }
    dispatch(checkTableAvailability(searchParams)).then(() => {
      setHasSearched(true);
    });
  };

  const handleBookTable = (e) => {
    e.preventDefault();
    const payload = {
      date: searchParams.date,
      timeSlot: searchParams.timeSlot,
      guests: searchParams.guests,
    };
    if (selectedTableId) {
      payload.tableId = selectedTableId;
    }
    dispatch(createReservation(payload));
  };

  const handleCancelBooking = (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      dispatch(cancelOwnReservation(id)).then((res) => {
        if (!res.error) {
          showToast('Reservation successfully cancelled.', 'success');
        }
      });
    }
  };

  return (
    <div className="space-y-10 pb-16 animate-fade-in">
      {/* Upper Grid: Booking Form & Active Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Reservation Wizard (Left Panel) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-2 mb-6">
            <CalendarCheck className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Book a Table</h2>
          </div>

          <form className="space-y-6">
            {/* Step 1: Select Date & Time & Guest Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  1. Choose Date
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <input
                    type="date"
                    name="date"
                    value={searchParams.date}
                    onChange={handleSearchChange}
                    min={getTodayDateString()}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all text-sm cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    2. Time Slot
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Clock className="h-4 w-4" />
                    </span>
                    <select
                      name="timeSlot"
                      value={searchParams.timeSlot}
                      onChange={handleSearchChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all text-sm cursor-pointer"
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    3. Guests
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Users className="h-4 w-4" />
                    </span>
                    <input
                      type="number"
                      name="guests"
                      value={searchParams.guests}
                      onChange={handleSearchChange}
                      min="1"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckAvailability}
                disabled={checkingAvailability}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
              >
                {checkingAvailability ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Check Availability
                  </>
                )}
              </button>
            </div>

            {/* Step 2: Choose Table & Confirm */}
            {hasSearched && (
              <div className="border-t border-slate-100 pt-6 space-y-4 animate-scale-up">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-505 mb-2">
                  4. Select Table Options
                </label>

                {availableTables.length === 0 ? (
                  <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl flex items-start gap-2.5 text-xs animate-shake">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-550" />
                    <span>No tables are available for the selected slot and party size. Please try another time.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto pr-1">
                      {/* Auto assign card */}
                      <div
                        onClick={() => setSelectedTableId('')}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center text-center ${
                          selectedTableId === ''
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                            : 'bg-slate-50 border-slate-205 hover:border-slate-300 text-slate-500'
                        }`}
                      >
                        <Sparkles className="h-4 w-4 mb-1 text-amber-500" />
                        <span className="text-xs font-bold">Auto-Assign</span>
                        <span className="text-[9px] mt-0.5 text-slate-450">Best fit table</span>
                      </div>

                      {/* Explicit table choices */}
                      {availableTables.map((table) => (
                        <div
                          key={table._id}
                          onClick={() => setSelectedTableId(table._id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center text-center ${
                            selectedTableId === table._id
                              ? 'bg-emerald-50 border-emerald-505 text-emerald-600'
                              : 'bg-slate-50 border-slate-205 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span className="text-sm font-black">{table.label}</span>
                          <span className="text-[10px] text-slate-500">Seats: {table.capacity}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleBookTable}
                      disabled={loading}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-500/10 flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer mt-4"
                    >
                      {loading ? (
                        <Spinner size="sm" className="!border-t-white" />
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Confirm Reservation
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* My Reservations Log (Right Panel) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-md h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Reservations</h2>
            </div>
            <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-bold border border-slate-200/50">
              Total: {reservations.length}
            </span>
          </div>

          {loading && reservations.length === 0 ? (
            <div className="flex-grow flex items-center justify-center py-20">
              <Spinner size="md" />
            </div>
          ) : reservations.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center py-20 text-center text-slate-400">
              <CalendarCheck className="h-12 w-12 text-slate-300 mb-3" />
              <span className="font-semibold text-sm text-slate-650">No reservations found.</span>
              <p className="text-xs text-slate-500 mt-1">Book your table using the wizard on the left.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {reservations.map((res) => {
                const isCancelled = res.status === 'cancelled';
                return (
                  <div
                    key={res._id}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 ${
                      isCancelled
                        ? 'bg-slate-50/50 border-slate-100 opacity-60'
                        : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    {/* Reservation Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-slate-800 tracking-tight">
                          Table {res.table?.label || 'Auto'}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 ${
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
                              <Check className="h-2.5 w-2.5" />
                              Confirmed
                            </>
                          )}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {res.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                          {res.timeSlot} (90m)
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          {res.guests} Guests
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelBooking(res._id)}
                        className="w-full sm:w-auto bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-500 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-rose-200 transition-all duration-300 font-semibold text-xs cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
