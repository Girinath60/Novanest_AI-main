import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const SlotModal = ({ selectedDate, setShowSlotModal, availabilitySlots, setAvailabilitySlots }) => {
  const [startTime, setStartTime] = useState('9:00 AM');
  const [endTime, setEndTime] = useState('10:00 AM');
  const [slotType, setSlotType] = useState('available');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState('weekly');
  const [recurringEndDate, setRecurringEndDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Set a default recurring end date (4 weeks from selected date)
  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      date.setDate(date.getDate() + 28);
      setRecurringEndDate(format(date, 'yyyy-MM-dd'));
    }
  }, [selectedDate]);

  // Generate time options for the dropdown
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 20; hour++) {
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
      times.push(`${hour12}:00 ${ampm}`);
      times.push(`${hour12}:30 ${ampm}`);
    }
    return times;
  };
  
  // Validate time slot selection
  const validateTimeSlot = () => {
    const timeToMinutes = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      
      if (period === 'PM' && hours !== 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
      
      return hours * 60 + minutes;
    };
    
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    
    if (startMinutes >= endMinutes) {
      setErrorMessage('End time must be after start time');
      return false;
    }
    
    // Check for overlapping slots
    const hasOverlap = availabilitySlots.some(slot => {
      if (slot.date !== selectedDate) return false;
      
      const slotStartMinutes = timeToMinutes(slot.startTime);
      const slotEndMinutes = timeToMinutes(slot.endTime);
      
      // Check if the new slot overlaps with an existing slot
      return (
        (startMinutes >= slotStartMinutes && startMinutes < slotEndMinutes) ||
        (endMinutes > slotStartMinutes && endMinutes <= slotEndMinutes) ||
        (startMinutes <= slotStartMinutes && endMinutes >= slotEndMinutes)
      );
    });
    
    if (hasOverlap) {
      setErrorMessage('This time slot overlaps with an existing slot');
      return false;
    }
    
    setErrorMessage('');
    return true;
  };
  
  // Generate recurring slots
  const generateRecurringSlots = (baseSlot) => {
    const slots = [baseSlot];
    
    if (!isRecurring || !recurringEndDate) return slots;
    
    const startDate = new Date(selectedDate);
    const endDate = new Date(recurringEndDate);
    let currentDate = new Date(startDate);
    
    // Add days based on recurring type
    const addDays = recurringType === 'weekly' ? 7 : 
                    recurringType === 'biweekly' ? 14 : 1;
    
    currentDate.setDate(currentDate.getDate() + addDays);
    
    while (currentDate <= endDate) {
      slots.push({
        ...baseSlot,
        date: format(currentDate, 'yyyy-MM-dd')
      });
      currentDate.setDate(currentDate.getDate() + addDays);
    }
    
    return slots;
  };
  
  // Handle form submission to add a new time slot
  const handleAddTimeSlot = (e) => {
    e.preventDefault();
    
    if (!validateTimeSlot()) return;
    
    const newSlot = {
      date: selectedDate,
      startTime,
      endTime,
      type: slotType
    };
    
    const slotsToAdd = generateRecurringSlots(newSlot);
    setAvailabilitySlots([...availabilitySlots, ...slotsToAdd]);
    setShowSlotModal(false);
  };

  // Overlay animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        duration: 0.5,
        bounce: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 overflow-y-auto"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <motion.div 
            className="fixed inset-0 transition-opacity" 
            aria-hidden="true"
            onClick={() => setShowSlotModal(false)}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="absolute inset-0 bg-gray-900 opacity-75 backdrop-blur-sm"></div>
          </motion.div>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="inline-block align-bottom bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10"></div>
              
              <h3 className="text-xl leading-6 font-bold text-white">
                Add Availability Slot
              </h3>
              <p className="mt-1 text-sm text-blue-100">
                Set when you're available for mentorship sessions
              </p>
            </div>

            <div className="bg-white p-6">
              {errorMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm rounded"
                >
                  <p>{errorMessage}</p>
                </motion.div>
              )}
              
              <form onSubmit={handleAddTimeSlot}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input 
                      type="date"
                      className="pl-10 block w-full border border-gray-300 rounded-lg py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={selectedDate}
                      disabled
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <select 
                        id="startTime" 
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="pl-10 block w-full border border-gray-300 rounded-lg py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      >
                        {generateTimeOptions().map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <select 
                        id="endTime"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="pl-10 block w-full border border-gray-300 rounded-lg py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      >
                        {generateTimeOptions().map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Slot Type
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <select 
                      id="type"
                      value={slotType}
                      onChange={(e) => setSlotType(e.target.value)}
                      className="pl-10 block w-full border border-gray-300 rounded-lg py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="available">Available for Mentorship</option>
                      <option value="busy">Busy / Unavailable</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center">
                    <input
                      id="recurring"
                      type="checkbox"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="recurring" className="ml-2 block text-sm font-medium text-gray-700">
                      Make this a recurring slot
                    </label>
                  </div>
                </div>
                
                {isRecurring && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 pl-4 border-l-2 border-blue-200"
                  >
                    <div className="mb-3">
                      <label htmlFor="recurringType" className="block text-sm font-medium text-gray-700 mb-1">
                        Repeat
                      </label>
                      <select
                        id="recurringType"
                        value={recurringType}
                        onChange={(e) => setRecurringType(e.target.value)}
                        className="block w-full border border-gray-300 rounded-lg py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                      </select>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="recurringEndDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Until
                      </label>
                      <input
                        type="date"
                        id="recurringEndDate"
                        value={recurringEndDate}
                        onChange={(e) => setRecurringEndDate(e.target.value)}
                        min={selectedDate}
                        className="block w-full border border-gray-300 rounded-lg py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </motion.div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  <motion.button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setShowSlotModal(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add Time Slot
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SlotModal;