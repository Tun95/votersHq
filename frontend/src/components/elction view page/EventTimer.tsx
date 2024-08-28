interface CountdownProps {
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

function EventTimer({ countdown }: CountdownProps) {
  return (
    <div className="event_timer">
      <div className="vent_timer_content">
        <div className="main_bill_headers">
          <h2>
            Ends <span className="green">In</span>
          </h2>
        </div>
        <ul className="c_flex">
          <li className="days a_flex">
            <div className="count">
              <h1>{countdown.days}</h1>
            </div>
            <div className="text">
              <small>Days</small>
            </div>
          </li>
          <li className="hours a_flex">
            <div className="count">
              <h1>{countdown.hours}</h1>
            </div>
            <div className="text">
              <small>Hours</small>
            </div>
          </li>
          <li className="minutes a_flex">
            <div className="count">
              <h1>{countdown.minutes}</h1>
            </div>
            <div className="text">
              <small>Minutes</small>
            </div>
          </li>
          <span className="column">
            <h1>:</h1>
          </span>
          <li className="seconds a_flex">
            <div className="count">
              <h1>{countdown.seconds}</h1>
            </div>
            <div className="text">
              <small>Seconds</small>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default EventTimer;
