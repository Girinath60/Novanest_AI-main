import React, { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import SlotModal from './modals/SlotModal';
import Button from '../../components/common/Button';

const OfficeHours = ({ activeMentorships = [], handleJoinMeeting }) => {
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [officeHoursSettings, setOfficeHoursSettings] = useState({
    sessionLength: '30 minutes',
    bufferTime: 'No buffer',
    timeZone: 'Eastern Time (ET)',
    weeklyAvailability: {
      Monday: { start: '9:00 AM', end: '5:00 PM' },
      Tuesday: { start: '9:00 AM', end: '5:00 PM' },
      Wednesday: { start: '9:00 AM', end: '5:00 PM' },
      Thursday: { start: '9:00 AM', end: '5:00 PM' },
      Friday: { start: '9:00 AM', end: '5:00 PM' }
    }
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handle calendar navigation
  const navigateCalendar = (direction) => {
    const newMonth = new Date(calendarMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCalendarMonth(newMonth);
  };

  // Update settings
  const updateOfficeHoursSetting = (key, value) => {
    setOfficeHoursSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Update weekly availability
  const updateWeeklyAvailability = (day, field, value) => {
    setOfficeHoursSettings(prev => ({
      ...prev,
      weeklyAvailability: {
        ...prev.weeklyAvailability,
        [day]: {
          ...prev.weeklyAvailability[day],
          [field]: value
        }
      }
    }));
  };

  // Function to get days in a month for calendar
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startOffset = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Generate previous month's trailing days
    let days = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({ 
        date: new Date(year, month - 1, prevMonthLastDay - i),
        currentMonth: false,
        isWeekend: [0, 6].includes(new Date(year, month - 1, prevMonthLastDay - i).getDay())
      });
    }
    
    // Generate current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ 
        date, 
        currentMonth: true,
        isWeekend: [0, 6].includes(date.getDay())
      });
    }
    
    // Generate next month's leading days to fill out the calendar grid (6 rows x 7 days = 42)
    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day++) {
      days.push({ 
        date: new Date(year, month + 1, day),
        currentMonth: false,
        isWeekend: [0, 6].includes(new Date(year, month + 1, day).getDay())
      });
    }
    
    return days;
  };

  // Handle saving office hours settings
  const handleSaveOfficeHoursSettings = () => {
    setSaving(true);
    
    // Here you would normally make an API call
    // For now, just simulate a save with a timeout
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  // Add ability to edit or delete slots
  const handleDeleteSlot = (slotToDelete) => {
    setAvailabilitySlots(availabilitySlots.filter(slot => 
      slot.date !== slotToDelete.date || 
      slot.startTime !== slotToDelete.startTime ||
      slot.endTime !== slotToDelete.endTime
    ));
  };

  // Add a function to edit slots
  const handleEditSlot = (oldSlot) => {
    // Set the selected date for the modal
    setSelectedDate(oldSlot.date);
    
    // Delete the old slot
    handleDeleteSlot(oldSlot);
    
    // Open the modal to create a new one
    setShowSlotModal(true);
    
    // Note: SlotModal will handle showing the form with available times
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Office Hours</h2>
        <p className="text-gray-600 mt-1">Set your availability for mentorship sessions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Calendar Column */}
        <div className="lg:col-span-3">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Your Schedule</h3>
              <div className="space-x-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigateCalendar(-1)}
                >
                  Previous
                </Button>
                <span className="text-sm font-medium text-gray-600">
                  {format(calendarMonth, 'MMMM yyyy')}
                </span>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigateCalendar(1)}
                >
                  Next
                </Button>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mt-2">
                {getDaysInMonth(calendarMonth).map((day, i) => {
                  const dateStr = format(day.date, 'yyyy-MM-dd');
                  const isToday = isSameDay(day.date, new Date());
                  const isSelected = selectedDate && isSameDay(day.date, new Date(selectedDate));
                  const daySlots = availabilitySlots.filter(slot => 
                    slot.date === dateStr
                  );
                  
                  return (
                    <div 
                      key={i} 
                      className={`aspect-square p-1 border rounded-md cursor-pointer
                        ${!day.currentMonth ? 'bg-gray-50 text-gray-400' : ''}
                        ${isToday ? 'border-blue-500' : 'border-gray-200'}
                        ${isSelected ? 'bg-blue-50' : ''}
                        ${day.isWeekend && day.currentMonth ? 'bg-gray-50' : ''}
                        hover:border-blue-500 hover:bg-blue-50
                      `}
                      onClick={() => {
                        setSelectedDate(dateStr);
                        setShowSlotModal(true);
                      }}
                    >
                      <div className="h-full flex flex-col justify-between">
                        <span className="text-sm font-medium">{format(day.date, 'd')}</span>
                        <div className="mt-1 space-y-1">
                          {daySlots.slice(0, 2).map((slot, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <span className="block text-[10px] p-0.5 bg-blue-100 text-blue-800 rounded truncate">
                                {slot.startTime}
                              </span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent calendar cell click
                                  handleEditSlot(slot);
                                }} 
                                className="text-[8px] text-gray-500 hover:text-blue-600"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                            </div>
                          ))}
                          {daySlots.length > 2 && (
                            <span className="block text-[10px] p-0.5 bg-gray-100 text-gray-800 rounded">
                              +{daySlots.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2 items-center">
                  <div className="w-4 h-4 bg-blue-100 rounded-sm border border-blue-300"></div>
                  <span className="text-sm text-gray-600">Available</span>
                </div>
                <div className="flex space-x-2 items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                  <span className="text-sm text-gray-600">Booked</span>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
                    setShowSlotModal(true);
                  }}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  }
                >
                  Add New
                </Button>
              </div>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden mt-6">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Upcoming Sessions</h3>
            </div>
            <div className="p-4">
              {activeMentorships.filter(m => m.nextSession).length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {activeMentorships.filter(m => m.nextSession).map((mentorship, idx) => (
                    <div key={idx} className="py-3 flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full object-cover"
                            src={mentorship.mentee?.profilePhoto || "/avatar-placeholder.png"}
                            alt=""
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/avatar-placeholder.png";
                            }}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {mentorship.mentee?.name || 'Entrepreneur'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(mentorship.nextSession), 'MMMM d, yyyy • h:mm a')}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button 
                          variant="primary"
                          size="sm"
                          onClick={() => handleJoinMeeting(mentorship)}
                        >
                          Join Meeting
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No upcoming sessions scheduled</p>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    }
                  >
                    Set Your Availability
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* All Availability Slots */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden mt-6">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">All Availability Slots</h3>
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
                  setShowSlotModal(true);
                }}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                }
              >
                Add New
              </Button>
            </div>
            <div className="p-4">
              {availabilitySlots.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {availabilitySlots
                    .sort((a, b) => new Date(a.date) - new Date(b.date) || 
                      a.startTime.localeCompare(b.startTime))
                    .map((slot, idx) => (
                    <div key={idx} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {format(new Date(slot.date), 'MMM d, yyyy')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {slot.startTime} - {slot.endTime} 
                          <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                            slot.type === 'available' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {slot.type === 'available' ? 'Available' : 'Busy'}
                          </span>
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditSlot(slot)}
                          title="Edit slot"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </Button>
                        <Button 
                          variant="ghost"
                          size="icon" 
                          onClick={() => handleDeleteSlot(slot)}
                          title="Delete slot"
                          className="text-red-500 hover:bg-red-50"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No availability slots created yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
                      setShowSlotModal(true);
                    }}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    }
                  >
                    Create Your First Slot
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Settings Column */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Availability Settings</h3>
            </div>
            <div className="p-4">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSaveOfficeHoursSettings();
              }}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="session-length" className="block text-sm font-medium text-gray-700">
                      Session Length
                    </label>
                    <select 
                      id="session-length" 
                      name="session-length" 
                      value={officeHoursSettings.sessionLength}
                      onChange={(e) => updateOfficeHoursSetting('sessionLength', e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-gray-800"
                    >
                      <option>30 minutes</option>
                      <option>45 minutes</option>
                      <option>60 minutes</option>
                      <option>90 minutes</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="buffer-time" className="block text-sm font-medium text-gray-700">
                      Buffer Between Meetings
                    </label>
                    <select 
                      id="buffer-time" 
                      name="buffer-time"
                      value={officeHoursSettings.bufferTime}
                      onChange={(e) => updateOfficeHoursSetting('bufferTime', e.target.value)} 
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-gray-800"
                    >
                      <option>No buffer</option>
                      <option>5 minutes</option>
                      <option>10 minutes</option>
                      <option>15 minutes</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weekly Availability
                    </label>
                    <div className="space-y-2">
                      {Object.keys(officeHoursSettings.weeklyAvailability).map(day => (
                        <div key={day} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{day}</span>
                          <div className="flex space-x-2">
                            <select 
                              className="block w-24 pl-2 pr-6 py-1 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md text-gray-800"
                              value={officeHoursSettings.weeklyAvailability[day].start}
                              onChange={(e) => updateWeeklyAvailability(day, 'start', e.target.value)}
                            >
                              {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'].map(time => (
                                <option key={time}>{time}</option>
                              ))}
                            </select>
                            <span className="text-sm text-gray-500 flex items-center">to</span>
                            <select 
                              className="block w-24 pl-2 pr-6 py-1 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md text-gray-800"
                              value={officeHoursSettings.weeklyAvailability[day].end}
                              onChange={(e) => updateWeeklyAvailability(day, 'end', e.target.value)}
                            >
                              {['3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'].map(time => (
                                <option key={time}>{time}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-gray-700">Time Zone</h4>
                      <span className="text-xs text-gray-500">Current: {officeHoursSettings.timeZone}</span>
                    </div>
                    <select 
                      value={officeHoursSettings.timeZone}
                      onChange={(e) => updateOfficeHoursSetting('timeZone', e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-gray-800"
                    >
                      <option>Eastern Time (ET)</option>
                      <option>Central Time (CT)</option>
                      <option>Mountain Time (MT)</option>
                      <option>Pacific Time (PT)</option>
                    </select>
                  </div>
                  
                  {saveSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md">
                      Settings saved successfully!
                    </div>
                  )}
                  
                  <div className="flex justify-end pt-4">
                    <Button 
                      variant="outline"
                      type="submit" 
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Time Slot Modal */}
      {showSlotModal && (
        <SlotModal 
          selectedDate={selectedDate}
          setShowSlotModal={setShowSlotModal}
          availabilitySlots={availabilitySlots}
          setAvailabilitySlots={setAvailabilitySlots}
        />
      )}
    </>
  );
};

export default OfficeHours;