export interface Event {
  title: string;
  start: Date;
  end: Date;
}

export function createCalendarEvents(): Event[] {
  // Replace this with your own logic to generate the calendar events
  const events: Event[] = [
    {
      title: 'Task 1',
      start: new Date(2023, 5, 1),
      end: new Date(2023, 5, 2),
    },
    {
      title: 'Task 2',
      start: new Date(2023, 5, 3),
      end: new Date(2023, 5, 4),
    },
    // Add more events as needed
  ];

  return events;
}
