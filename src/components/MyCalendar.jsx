import React from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const localizer = momentLocalizer(moment);

export default function MyCalendar() {
  return (
    <div>
      <Calendar localizer={localizer} />
    </div>
  );
}
