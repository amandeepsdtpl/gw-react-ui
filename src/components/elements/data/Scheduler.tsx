import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, MoreVertical } from 'lucide-react';

interface SchedulerEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  description?: string;
  allDay?: boolean;
  recurring?: boolean;
}

interface SchedulerProps {
  events: SchedulerEvent[];
  onEventAdd?: (event: Omit<SchedulerEvent, 'id'>) => void;
  onEventUpdate?: (event: SchedulerEvent) => void;
  onEventDelete?: (eventId: string) => void;
  onEventClick?: (event: SchedulerEvent) => void;
  view?: 'day' | 'week' | 'month';
  minTime?: number;
  maxTime?: number;
  className?: string;
  readOnly?: boolean;
}

export const Scheduler: React.FC<SchedulerProps> = ({
  events,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  onEventClick,
  view = 'week',
  minTime = 0,
  maxTime = 24,
  className = '',
  readOnly = false,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggedEvent, setDraggedEvent] = useState<SchedulerEvent | null>(null);
  const [resizingEvent, setResizingEvent] = useState<SchedulerEvent | null>(null);
  const [contextMenuEvent, setContextMenuEvent] = useState<{
    event: SchedulerEvent;
    x: number;
    y: number;
  } | null>(null);
  
  const gridRef = useRef<HTMLDivElement>(null);

  // Helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getWeekDays = (date: Date) => {
    const days = [];
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());

    for (let i = 0; i < 7; i++) {
      days.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }
    return days;
  };

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const getEventPosition = (event: SchedulerEvent) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const startHours = start.getHours() + start.getMinutes() / 60;
    const endHours = end.getHours() + end.getMinutes() / 60;
    const duration = endHours - startHours;

    return {
      top: `${((startHours - minTime) / (maxTime - minTime)) * 100}%`,
      height: `${(duration / (maxTime - minTime)) * 100}%`,
    };
  };

  // Event handlers
  const handleEventDragStart = (event: SchedulerEvent, e: React.DragEvent) => {
    if (readOnly) return;
    e.dataTransfer.setData('text/plain', ''); // Required for Firefox
    setDraggedEvent(event);
  };

  const handleEventDragEnd = () => {
    setDraggedEvent(null);
  };

  const handleEventDrop = (date: Date, hour: number) => {
    if (!draggedEvent || readOnly) return;

    const newStart = new Date(date);
    newStart.setHours(hour);
    newStart.setMinutes(0);

    const duration = draggedEvent.end.getTime() - draggedEvent.start.getTime();
    const newEnd = new Date(newStart.getTime() + duration);

    onEventUpdate?.({
      ...draggedEvent,
      start: newStart,
      end: newEnd,
    });
  };

  const handleEventResize = (event: SchedulerEvent, direction: 'top' | 'bottom', delta: number) => {
    if (readOnly) return;

    const newEvent = { ...event };
    if (direction === 'top') {
      newEvent.start = new Date(event.start.getTime() + delta * 60000);
    } else {
      newEvent.end = new Date(event.end.getTime() + delta * 60000);
    }

    onEventUpdate?.(newEvent);
  };

  const handleEventClick = (event: SchedulerEvent, e: React.MouseEvent) => {
    if (e.type === 'contextmenu') {
      e.preventDefault();
      setContextMenuEvent({ event, x: e.clientX, y: e.clientY });
    } else {
      onEventClick?.(event);
    }
  };

  const handleGridClick = (date: Date, hour: number) => {
    if (readOnly) return;

    const start = new Date(date);
    start.setHours(hour);
    start.setMinutes(0);

    const end = new Date(start);
    end.setHours(hour + 1);

    onEventAdd?.({
      title: 'New Event',
      start,
      end,
      allDay: false,
    });
  };

  // Navigation
  const navigateToday = () => setCurrentDate(new Date());
  const navigatePrev = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') newDate.setDate(newDate.getDate() - 1);
    else if (view === 'week') newDate.setDate(newDate.getDate() - 7);
    else newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') newDate.setDate(newDate.getDate() + 1);
    else if (view === 'week') newDate.setDate(newDate.getDate() + 7);
    else newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // Render functions
  const renderTimeGrid = () => {
    const hours = [];
    for (let i = minTime; i < maxTime; i++) {
      hours.push(
        <div key={i} className="time-slot">
          <div className="time-label">{formatTime(i)}</div>
          <div className="time-grid-line" />
        </div>
      );
    }
    return hours;
  };

  const renderEvents = (date: Date) => {
    return events
      .filter(event => {
        const eventDate = new Date(event.start);
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      })
      .map(event => {
        const position = getEventPosition(event);
        return (
          <div
            key={event.id}
            className={`
              scheduler-event
              ${draggedEvent?.id === event.id ? 'dragging' : ''}
              ${resizingEvent?.id === event.id ? 'resizing' : ''}
            `}
            style={{
              ...position,
              backgroundColor: event.color || 'var(--gw-primary)',
            }}
            draggable={!readOnly}
            onDragStart={e => handleEventDragStart(event, e)}
            onDragEnd={handleEventDragEnd}
            onClick={e => handleEventClick(event, e)}
            onContextMenu={e => handleEventClick(event, e)}
          >
            <div className="event-title">{event.title}</div>
            {event.description && (
              <div className="event-description">{event.description}</div>
            )}
            {!readOnly && (
              <>
                <div
                  className="resize-handle top"
                  onMouseDown={e => {
                    e.stopPropagation();
                    setResizingEvent(event);
                  }}
                />
                <div
                  className="resize-handle bottom"
                  onMouseDown={e => {
                    e.stopPropagation();
                    setResizingEvent(event);
                  }}
                />
              </>
            )}
          </div>
        );
      });
  };

  return (
    <div className={`scheduler ${className}`}>
      <div className="scheduler-header">
        <div className="scheduler-navigation">
          <button onClick={navigatePrev} className="nav-button">
            <ChevronLeft size={20} />
          </button>
          <button onClick={navigateToday} className="today-button">
            Today
          </button>
          <button onClick={navigateNext} className="nav-button">
            <ChevronRight size={20} />
          </button>
        </div>
        <h2 className="current-date">
          {currentDate.toLocaleDateString('default', {
            month: 'long',
            year: 'numeric',
            ...(view !== 'month' && { day: 'numeric' }),
          })}
        </h2>
        <div className="view-controls">
          <button
            className={`view-button ${view === 'day' ? 'active' : ''}`}
            onClick={() => view !== 'day' && setCurrentDate(new Date())}
          >
            Day
          </button>
          <button
            className={`view-button ${view === 'week' ? 'active' : ''}`}
            onClick={() => view !== 'week' && setCurrentDate(new Date())}
          >
            Week
          </button>
          <button
            className={`view-button ${view === 'month' ? 'active' : ''}`}
            onClick={() => view !== 'month' && setCurrentDate(new Date())}
          >
            Month
          </button>
        </div>
      </div>

      <div className="scheduler-content" ref={gridRef}>
        <div className="time-grid">{renderTimeGrid()}</div>
        <div className="events-grid">
          {view === 'day' && (
            <div className="day-view">
              <div className="day-column">
                <div className="day-header">
                  {currentDate.toLocaleDateString('default', { weekday: 'long' })}
                </div>
                <div className="day-events">{renderEvents(currentDate)}</div>
              </div>
            </div>
          )}
          {view === 'week' && (
            <div className="week-view">
              {getWeekDays(currentDate).map(day => (
                <div key={day.toISOString()} className="day-column">
                  <div className="day-header">
                    {day.toLocaleDateString('default', {
                      weekday: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="day-events">{renderEvents(day)}</div>
                </div>
              ))}
            </div>
          )}
          {view === 'month' && (
            <div className="month-view">
              {Array.from({ length: getDaysInMonth(currentDate) }).map((_, i) => {
                const day = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  i + 1
                );
                return (
                  <div key={day.toISOString()} className="month-day">
                    <div className="day-header">{i + 1}</div>
                    <div className="day-events">{renderEvents(day)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {contextMenuEvent && (
        <div
          className="context-menu"
          style={{
            position: 'fixed',
            top: contextMenuEvent.y,
            left: contextMenuEvent.x,
          }}
        >
          <button
            onClick={() => {
              onEventClick?.(contextMenuEvent.event);
              setContextMenuEvent(null);
            }}
          >
            Edit
          </button>
          {!readOnly && (
            <button
              onClick={() => {
                onEventDelete?.(contextMenuEvent.event.id);
                setContextMenuEvent(null);
              }}
              className="delete"
            >
              Delete
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        .scheduler {
          display: flex;
          flex-direction: column;
          height: 100%;
          background-color: var(--gw-background);
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
        }

        .scheduler-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid var(--gw-border-color);
        }

        .scheduler-navigation {
          display: flex;
          gap: 0.5rem;
        }

        .nav-button,
        .today-button,
        .view-button {
          padding: 0.5rem;
          border: none;
          background: none;
          color: var(--gw-text-primary);
          border-radius: var(--gw-border-radius);
          cursor: pointer;
          transition: var(--gw-transition);
        }

        .nav-button:hover,
        .today-button:hover,
        .view-button:hover {
          background-color: var(--gw-background-secondary);
        }

        .view-button.active {
          background-color: var(--gw-primary);
          color: white;
        }

        .current-date {
          font-size: 1.25rem;
          font-weight: 500;
          color: var(--gw-text-primary);
        }

        .view-controls {
          display: flex;
          gap: 0.5rem;
        }

        .scheduler-content {
          flex: 1;
          display: flex;
          overflow: auto;
        }

        .time-grid {
          flex-shrink: 0;
          width: 60px;
          border-right: 1px solid var(--gw-border-color);
        }

        .time-slot {
          height: 60px;
          position: relative;
        }

        .time-label {
          position: absolute;
          top: -0.5rem;
          right: 0.5rem;
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
        }

        .time-grid-line {
          position: absolute;
          left: 0;
          right: -1px;
          top: 0;
          height: 1px;
          background-color: var(--gw-border-color);
        }

        .events-grid {
          flex: 1;
          position: relative;
        }

        .day-view,
        .week-view {
          display: flex;
          height: 100%;
        }

        .day-column {
          flex: 1;
          min-width: 150px;
          border-right: 1px solid var(--gw-border-color);
        }

        .day-header {
          padding: 0.5rem;
          text-align: center;
          border-bottom: 1px solid var(--gw-border-color);
          font-weight: 500;
        }

        .day-events {
          position: relative;
          height: calc(100% - 2.5rem);
        }

        .month-view {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          background-color: var(--gw-border-color);
        }

        .month-day {
          background-color: var(--gw-background);
          min-height: 100px;
          padding: 0.5rem;
        }

        .scheduler-event {
          position: absolute;
          left: 0;
          right: 0;
          margin: 0 2px;
          padding: 0.25rem 0.5rem;
          border-radius: var(--gw-border-radius);
          color: white;
          font-size: 0.875rem;
          overflow: hidden;
          cursor: pointer;
          transition: var(--gw-transition);
        }

        .scheduler-event:hover {
          opacity: 0.9;
        }

        .scheduler-event.dragging {
          opacity: 0.5;
        }

        .event-title {
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .event-description {
          font-size: 0.75rem;
          opacity: 0.9;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .resize-handle {
          position: absolute;
          left: 0;
          right: 0;
          height: 4px;
          cursor: ns-resize;
        }

        .resize-handle.top {
          top: 0;
        }

        .resize-handle.bottom {
          bottom: 0;
        }

        .context-menu {
          position: fixed;
          background-color: var(--gw-background);
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          box-shadow: var(--gw-shadow-lg);
          padding: 0.5rem;
          z-index: 1000;
        }

        .context-menu button {
          display: block;
          width: 100%;
          padding: 0.5rem 1rem;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          transition: var(--gw-transition);
        }

        .context-menu button:hover {
          background-color: var(--gw-background-secondary);
        }

        .context-menu button.delete {
          color: var(--gw-error-500);
        }

        /* Material Design styles */
        [data-design-system="material"] .scheduler {
          font-family: var(--gw-font-family);
          box-shadow: var(--gw-shadow-md);
          border: none;
        }

        [data-design-system="material"] .scheduler-event {
          box-shadow: var(--gw-shadow-sm);
        }

        [data-design-system="material"] .nav-button,
        [data-design-system="material"] .today-button,
        [data-design-system="material"] .view-button {
          font-weight: 500;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
};