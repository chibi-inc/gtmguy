export default function getUtcStartOfMonth(date: Date = new Date()): Date {
    return new Date(Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        1,
        0, 0, 0, 0
    ));
 }