import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function useEventWatcher (events, onUpdate) {
    useEffect(() => {
        if (!events?.length) return;

        const timers = [];
        const now = Date.now();

        // Игнорируем события, которые уже давно прошли
        const activeEvents = events.filter(
            e => new Date(e.dateTime).getTime() > now - 5000
        );

        activeEvents.forEach(event => {
            const eventTime = new Date(event.dateTime).getTime();
            const diff = eventTime - now;

            if (diff <= 0) {
                // Событие прошло — помечаем как завершённое
                if (!event.notifiedStart) {
                    toast.success(`Event "${event.name}" time has come!`);
                    onUpdate({
                        ...event,
                        notifiedStart: true,
                        notifiedBefore: true,
                    });
                }
                return;
            }

            // За сколько времени до события уведомлять
            const notifyBeforeMs = event.notifyBefore * 60000;
            const before = diff - notifyBeforeMs;

            // Уведомление заранее
            if (before > 0 && !event.notifiedBefore) {
                timers.push(
                    setTimeout(() => {
                        toast.info(
                            `Reminder: "${event.name}" will start soon!`
                        );
                        onUpdate({ ...event, notifiedBefore: true });
                    }, before)
                );
            }

            // Уведомление в момент события
            if (!event.notifiedStart) {
                timers.push(
                    setTimeout(() => {
                        toast.success(`Event "${event.name}" time has come!`);
                        onUpdate({ ...event, notifiedStart: true });
                    }, diff)
                );
            }
        });

        return () => timers.forEach(t => clearTimeout(t));
    }, [events, onUpdate]);
}
