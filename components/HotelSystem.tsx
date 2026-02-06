
import React, { useState } from 'react';
import { Room, RoomCategory, Reservation } from '../types';

const INITIAL_ROOMS: Room[] = [
  { id: 101, type: RoomCategory.STANDARD, price: 99, available: true, description: "Cozy room with queen bed and city view." },
  { id: 102, type: RoomCategory.STANDARD, price: 99, available: true, description: "Efficient space perfect for business travelers." },
  { id: 201, type: RoomCategory.DELUXE, price: 179, available: true, description: "Spacious room with king bed, balcony and ocean view." },
  { id: 202, type: RoomCategory.DELUXE, price: 179, available: false, description: "Premium suite with extra lounge area." },
  { id: 301, type: RoomCategory.SUITE, price: 349, available: true, description: "Luxury suite with private jacuzzi and panorama view." },
];

export const HotelSystem: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [bookingStep, setBookingStep] = useState<'browse' | 'pay' | 'confirm'>('browse');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [guestName, setGuestName] = useState('');

  const handleBookClick = (room: Room) => {
    setSelectedRoom(room);
    setBookingStep('pay');
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !selectedRoom) return;

    const newRes: Reservation = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      roomId: selectedRoom.id,
      customerName: guestName,
      date: new Date().toLocaleDateString()
    };

    setReservations([...reservations, newRes]);
    setRooms(rooms.map(r => r.id === selectedRoom.id ? { ...r, available: false } : r));
    setBookingStep('confirm');
  };

  const cancelReservation = (resId: string) => {
    const res = reservations.find(r => r.id === resId);
    if (!res) return;

    setRooms(rooms.map(r => r.id === res.roomId ? { ...r, available: true } : r));
    setReservations(reservations.filter(r => r.id !== resId));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Elite Stays Hotel</h2>
          <p className="text-slate-500">Find and book your perfect getaway.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-3 rounded-lg border flex flex-col items-center">
            <span className="text-xs text-slate-400 uppercase font-bold">Available</span>
            <span className="text-xl font-bold text-emerald-600">{rooms.filter(r => r.available).length}</span>
          </div>
          <div className="bg-white p-3 rounded-lg border flex flex-col items-center">
            <span className="text-xs text-slate-400 uppercase font-bold">Booked</span>
            <span className="text-xl font-bold text-indigo-600">{reservations.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map(room => (
              <div key={room.id} className={`p-5 rounded-2xl border transition-all ${room.available ? 'bg-white border-slate-200 hover:shadow-md' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${
                      room.type === RoomCategory.SUITE ? 'bg-amber-100 text-amber-700' :
                      room.type === RoomCategory.DELUXE ? 'bg-purple-100 text-purple-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {room.type}
                    </span>
                    <h3 className="text-lg font-bold mt-1">Room {room.id}</h3>
                  </div>
                  <p className="text-xl font-bold text-slate-900">${room.price}<span className="text-sm font-normal text-slate-400">/night</span></p>
                </div>
                <p className="text-sm text-slate-600 mb-6">{room.description}</p>
                <button 
                  disabled={!room.available}
                  onClick={() => handleBookClick(room)}
                  className={`w-full py-2.5 rounded-xl font-semibold transition ${
                    room.available 
                      ? 'bg-slate-900 text-white hover:bg-slate-800' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {room.available ? 'Check Availability' : 'Fully Booked'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Your Reservations</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {reservations.length === 0 ? (
                <div className="p-10 text-center space-y-2">
                  <div className="text-4xl">🏨</div>
                  <p className="text-sm text-slate-400">You have no active bookings.</p>
                </div>
              ) : (
                reservations.map(res => (
                  <div key={res.id} className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold">Room {res.roomId}</p>
                      <p className="text-xs text-slate-500">ID: {res.id} • {res.customerName}</p>
                    </div>
                    <button 
                      onClick={() => cancelReservation(res.id)}
                      className="text-xs text-rose-500 font-bold hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingStep !== 'browse' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            {bookingStep === 'pay' && (
              <div className="p-8 space-y-6">
                <div className="text-center">
                  <div className="inline-block p-3 rounded-full bg-indigo-50 text-indigo-600 mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  </div>
                  <h3 className="text-2xl font-bold">Secure Booking</h3>
                  <p className="text-slate-500">Complete your details to confirm room {selectedRoom?.id}</p>
                </div>

                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Guest Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      placeholder="Enter full name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                    />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">Total Due</p>
                      <p className="text-2xl font-bold text-slate-900">${selectedRoom?.price}</p>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-8 h-5 bg-slate-300 rounded"></div>
                      <div className="w-8 h-5 bg-slate-300 rounded"></div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => setBookingStep('browse')}
                      className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              </div>
            )}

            {bookingStep === 'confirm' && (
              <div className="p-8 text-center space-y-6">
                <div className="inline-block p-4 rounded-full bg-emerald-50 text-emerald-600 animate-bounce">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h3>
                  <p className="text-slate-500">Your stay at Elite Stays is all set. We've sent details to your email.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Reference ID</p>
                  <p className="text-lg font-mono font-bold text-indigo-600">{reservations[reservations.length - 1]?.id}</p>
                </div>
                <button 
                  onClick={() => {
                    setBookingStep('browse');
                    setGuestName('');
                  }}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition"
                >
                  Back to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
