function queueSnapshot(centre, bookings) {
  const bookedToday = bookings.filter(booking => booking.centreId === centre.id && ['confirmed', 'checked_in'].includes(booking.status));
  const queueCount = Math.max(0, centre.queueCount || 0);
  const capacityPerHour = centre.capacityPerHour || 42;
  const averageServiceMinutes = Math.max(1, Math.round(60 / capacityPerHour));
  return {
    centreId: centre.id,
    queueCount,
    capacityPerHour,
    averageServiceMinutes,
    estimatedWaitMinutes: Math.max(0, Math.round(queueCount * averageServiceMinutes)),
    bookedToday: bookedToday.length,
    updatedAt: new Date().toISOString()
  };
}

function tokenEta(booking, snapshot) {
  const position = Math.max(1, Number(String(booking.token || '').replace(/\D/g, '')) - 1);
  return { token: booking.token, position, estimatedWaitMinutes: Math.max(0, Math.round((snapshot.queueCount + position) * snapshot.averageServiceMinutes)) };
}

module.exports = { queueSnapshot, tokenEta };
