import { supabase } from './supabase';

export type TeacherEventAttendance = {
  eventId: string;
  eventCode: string;
  title: string;
  start: string | null;
  end: string | null;
  attendees: {
    studentId: string;
    scannedAt: string;
  }[];
};

export async function getTeacherEventAttendance(
  teacherId: string
): Promise<TeacherEventAttendance[]> {
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('id, event_code, title, start_time, end_time')
    .eq('created_by', teacherId)
    .order('created_at', { ascending: false });

  if (eventsError || !events) {
    console.error('TEACHER EVENTS ERROR:', eventsError);
    return [];
  }

  if (events.length === 0) {
    return [];
  }

  const eventIds = events.map((event) => event.id);

  const { data: attendance, error: attendanceError } = await supabase
    .from('attendance')
    .select('event_id, student_id, scanned_at')
    .in('event_id', eventIds)
    .order('scanned_at', { ascending: false });

  if (attendanceError) {
    console.error('TEACHER ATTENDANCE ERROR:', attendanceError);
    return [];
  }

  return events.map((event) => ({
    eventId: event.id,
    eventCode: event.event_code,
    title: event.title,
    start: event.start_time,
    end: event.end_time,
    attendees: (attendance ?? [])
      .filter((record) => record.event_id === event.id)
      .map((record) => ({
        studentId: record.student_id,
        scannedAt: record.scanned_at,
      })),
  }));
}