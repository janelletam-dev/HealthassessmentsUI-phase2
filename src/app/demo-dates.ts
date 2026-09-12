// The story's dates, worked out from the day the demo runs, so a demo given
// in three months' time is still fresh. Janelle, 12 Sep: "ensure that the
// dates on booking the pharmacy appointment date is dynamic, so whatever time
// the sales team uses to demo, in 2-3 months time, it will always be fresh".
//
// NO FRAME: these are dates, not copy. The shape of the story is fixed: the
// Health Insights Assessment is submitted and reported today, the pharmacy
// appointment is a weekday about twelve days on, and the advanced report
// follows two working days after that.

const DAY_MS = 86_400_000;
const atMidnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const addDays = (d: Date, n: number) => atMidnight(new Date(d.getTime() + n * DAY_MS));
/** Saturday and Sunday roll on to the Monday. */
const weekday = (d: Date) => (d.getDay() === 6 ? addDays(d, 2) : d.getDay() === 0 ? addDays(d, 1) : d);

export const TODAY = atMidnight(new Date());
export const SUBMITTED = weekday(TODAY);
export const APPOINTMENT = weekday(addDays(TODAY, 12));
export const ADVANCED_REPORT = weekday(addDays(APPOINTMENT, 2));
export const APPOINTMENT_TIME = "10:15 AM";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const pad = (n: number) => String(n).padStart(2, "0");
export const monthName = (d: Date) => MONTHS[d.getMonth()];
export const monthShort = (d: Date) => MONTHS[d.getMonth()].slice(0, 3);
export const dayShort = (d: Date) => DAYS[d.getDay()].slice(0, 3);
/** 16 September 2026 */
export const long = (d: Date) => `${d.getDate()} ${monthName(d)} ${d.getFullYear()}`;
/** 16 September */
export const dayMonth = (d: Date) => `${d.getDate()} ${monthName(d)}`;
/** Wednesday 16 September 2026 */
export const weekdayLong = (d: Date) => `${DAYS[d.getDay()]} ${long(d)}`;
/** Fri, 18 Sep 2026 */
export const shortComma = (d: Date) => `${dayShort(d)}, ${d.getDate()} ${monthShort(d)} ${d.getFullYear()}`;
/** Fri, 18 Sep */
export const pill = (d: Date) => `${dayShort(d)}, ${d.getDate()} ${monthShort(d)}`;
/** Sep 4 2026, the way the partner's results page writes it. */
export const usShort = (d: Date) => `${monthShort(d)} ${d.getDate()} ${d.getFullYear()}`;
/** 04/09/2026 */
export const dmy = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
/** 04 Sep 2026, the clinician's queue. */
export const queue = (d: Date) => `${pad(d.getDate())} ${monthShort(d)} ${d.getFullYear()}`;
