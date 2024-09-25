export const calculateDaysBefore = (taskDay: string, taskWeeks: number): number => {
  const daysOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const sermonDay = "Sun"; // Assuming the sermon is always on Sunday
  
  const taskDayIndex = daysOrder.indexOf(taskDay);
  const sermonDayIndex = daysOrder.indexOf(sermonDay);
  
  let daysDifference = sermonDayIndex - taskDayIndex;
  if (daysDifference <= 0) {
    daysDifference += 7;
  }
  
  return taskWeeks * 7 + daysDifference;
};