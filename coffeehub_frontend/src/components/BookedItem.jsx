import React from 'react'

const BookedItem = ({b,cancelBooking}) => {
  return (
    <div className="flex items-center justify-between">
                <div>
                  <p><strong>Booking ID:</strong> {b.id}</p>
                  <p><strong>Table:</strong> {b.tableId}</p>
                  <p><strong>Date & Time:</strong> {b.bookingDatetime}</p>
                  <p><strong>Party Size:</strong> {b.partySize}</p>
                  {b.specialRequests && (
                    <p><strong>Requests:</strong> {b.specialRequests}</p>
                  )}
                  {b.status && (
                    <p><strong>Status:</strong> {b.status}</p>
                  )}
                </div>
                {b.status !== "CANCELLED" && (
                  <button
                    onClick={() => cancelBooking(b.id)}
                    className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold"
                  >
                    Cancel
                  </button>
                )}
              </div>
  )
}

export default BookedItem