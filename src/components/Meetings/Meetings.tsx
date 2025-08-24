import { useState, useEffect } from "react";
import MeetingCalendar from "./MeetingCalendar/MeetingCalendar";
import MeetingForm from "./MeetingForm/MeetingForm";
import MeetingList from "./MeetingList/MeetingList";
import MeetingsTitleBar from "./MeetingsTitleBar/MeetingsTitleBar";
import dayjs, { type Dayjs } from "dayjs";
import { api } from "@/utils/api";
import {
  type Student,
  type MeetingWithAttendees,
} from "@/types";
import Students from "../Students/Students";
import LoadingSpinner from "../LoadingSpinner";
import { TRPCClientError } from "@trpc/client";
import type { AppRouter } from "@/server/api/root";

// Initialization
const Meetings = () => {
  // Get current user data immediately
  const { data: currentUser, isLoading: isLoadingUser, error: userError } = api.users.getCurrentUser.useQuery();
  const tutorId = currentUser?.userId || 1; // Fallback to 1 if no user found
  // State Management
  const [meetings, setMeetings] = useState<MeetingWithAttendees[]>([]);
  const [allMeetings, setAllMeetings] = useState<MeetingWithAttendees[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedMeetings, setSelectedMeetings] = useState<MeetingWithAttendees[]>([]);
  const [datedMeetingsWithAttendees, setDatedMeetingsWithAttendees] = useState<MeetingWithAttendees[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isOnMeetingsPage] = useState<boolean>(true);
  const [myDatedMeetings, setMyDatedMeetings] = useState<MeetingWithAttendees[]>([]);
  const [viewDate, setViewDate] = useState(getFirstMonthInView());
  const [uniqueKey, setUniqueKey] = useState<number>(1);

  function getFirstMonthInView() {
    const currentDate = dayjs();
    const firstDayOfMonth = currentDate.subtract(1, "month").startOf("month");
    return firstDayOfMonth;
  }

  const dateToQuery = selectedDate && dayjs.isDayjs(selectedDate) ? selectedDate : dayjs();

  // API Calls - only make calls when we have a valid tutorId
  const { data: getAllMeetings, isLoading: isLoadingAllMeetings, error: allMeetingsError } = api.meetings.getMeetingsByTutorId.useQuery({
    tutor_id: tutorId
  }, {
    enabled: !!tutorId && !!currentUser // Only fetch when user is loaded
  });

  const {data: getDatedMeetings, isLoading: isLoadingDatedMeetings, error: datedMeetingsError} = api.meetings.getMeetingsByRoleAndDate.useQuery(dateToQuery.toDate(), {
    enabled: !!currentUser // Only fetch when user is loaded
  }) as {
    data: MeetingWithAttendees[];
    isLoading: boolean;
    error: TRPCClientError<AppRouter> | null;
  };

  const { data: myStudents, isLoading: isLoadingStudents, error: studentsError } = api.students.getStudentsForRole.useQuery(undefined, {
    enabled: !!currentUser // Only fetch when user is loaded
  }) as {
    data: Student[];
    isLoading: boolean;
    error: TRPCClientError<AppRouter> | null;
  };

  // Update State based on API calls
  useEffect(() => {
    if (getDatedMeetings) {
      setMyDatedMeetings(getDatedMeetings);
    }
    if (myStudents) {
      setStudents(myStudents);
    }
  }, [getDatedMeetings, myStudents]);

  useEffect(() => {
    if (getAllMeetings) {
      const formattedMeetings = getAllMeetings.map(meeting => ({
        ...meeting,
        MeetingAttendees: meeting.MeetingAttendees.map(attendee => ({
          ...attendee,
          name: attendee.name || undefined,
        })),
      }));
      setAllMeetings(formattedMeetings);
    }
  }, [getAllMeetings]);

  // Loading and error states
  const isInitialLoading = isLoadingUser;
  const isDataLoading = isLoadingAllMeetings || isLoadingDatedMeetings || isLoadingStudents;
  const hasErrors = Boolean(userError || allMeetingsError || datedMeetingsError || studentsError);

  // Show initial loading screen while user data loads
  if (isInitialLoading) {
    return (
      <div className="flex flex-column justify-content-center gap-4">
        <LoadingSpinner 
          variant="card" 
          message="Loading user data..." 
          height="400px"
        />
      </div>
    );
  }

  // Show error state if any critical errors occurred
  if (hasErrors) {
    return (
      <div className="flex flex-column justify-content-center gap-4">
        <div className="p-4 border-round bg-red-50 border-red-200">
          <h3 className="text-red-800 mt-0">Error Loading Data</h3>
          <p className="text-red-600 mb-0">
            {(() => {
              const getErrorMessage = (error: unknown): string | null => {
                if (error && typeof error === 'object' && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
                  return (error as { message: string }).message;
                }
                return null;
              };
              
              return getErrorMessage(userError) || 
                     getErrorMessage(allMeetingsError) || 
                     getErrorMessage(datedMeetingsError) || 
                     getErrorMessage(studentsError) || 
                     'An unexpected error occurred while loading data.';
            })()}
          </p>
        </div>
      </div>
    );
  }

  // Render Components
  return (
    <div className="flex flex-column justify-content-center gap-4">
      <div className="flex gap-4 align-items-center justify-content-between w-full">
      <MeetingsTitleBar
        setDate={setDate}
        setViewDate={setViewDate}
        setSelectedDate={setSelectedDate}
        setUniqueKey={setUniqueKey}
      />
      </div>
      <div className="flex">
        {isLoadingAllMeetings ? (
          <LoadingSpinner 
            variant="skeleton" 
            className="w-full"
          />
        ) : (
          <MeetingCalendar
            allMeetings={allMeetings || []}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            uniqueKey={uniqueKey}
            viewDate={viewDate}
            setViewDate={setViewDate}
          />
        )}
      </div>
      <div className="flex flex-column lg:flex-row gap-4">
        {isDataLoading ? (
          <>
            <div className="flex-1">
              <LoadingSpinner 
                variant="card" 
                message="Loading meeting form..." 
                height="300px"
              />
            </div>
            <div className="flex-1">
              <LoadingSpinner 
                variant="card" 
                message="Loading meetings..." 
                height="300px"
              />
            </div>
          </>
        ) : (
          <>
            <MeetingForm
              meetings={meetings}
              setAllMeetings={setAllMeetings}
              setMeetings={setMeetings}
              students={students || []}
              myDatedMeetings={myDatedMeetings}
              setMyDatedMeetings={setMyDatedMeetings}
              selectedMeetings={selectedMeetings}
              setSelectedMeetings={setSelectedMeetings}
              selectedMeetingAttendees={[]}
              datedMeetingsWithAttendees={datedMeetingsWithAttendees}
              selectedDate={selectedDate}
              setDatedMeetingsWithAttendees={setDatedMeetingsWithAttendees}
              isOnMeetingsPage={isOnMeetingsPage}
              isOnStudentsPage={false}
              studentId={0}
            />
            <MeetingList
              meetings={meetings}
              // setMeetings={setMeetings}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              // getDatedMeetings={getDatedMeetings}
              selectedMeetings={selectedMeetings}
              students={students || []}
              setSelectedMeetings={setSelectedMeetings}
              datedMeetingsWithAttendees={datedMeetingsWithAttendees}
              isOnMeetingsPage={isOnMeetingsPage}
              isOnStudentsPage={false}
              studentId={0}
              />
          </>
        )}
        </div>
      <Students isOnMeetingsPage={isOnMeetingsPage} />
    </div>
  );
};

export default Meetings;
