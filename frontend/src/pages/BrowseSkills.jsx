import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './BrowseSkills.css';

const BrowseSkills = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showCalendar, setShowCalendar] = useState(null); // Track which skill's calendar is open
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookings, setBookings] = useState([]); // Temporary storage for bookings

  // Mock skills data
  const skills = [
    {
      id: 1,
      name: 'JavaScript Fundamentals',
      category: 'Programming',
      tutor: 'Alex Johnson',
      rating: 4.8,
      students: 1240,
      price: 25,
      level: 'Beginner',
      description: 'Learn the basics of JavaScript including variables, functions, and DOM manipulation.',
      tags: ['Web Development', 'Frontend', 'JavaScript']
    },
    {
      id: 2,
      name: 'Python for Data Science',
      category: 'Data Science',
      tutor: 'Sarah Miller',
      rating: 4.9,
      students: 890,
      price: 40,
      level: 'Intermediate',
      description: 'Introduction to data analysis with Python using pandas and numpy libraries.',
      tags: ['Python', 'Data Analysis', 'Machine Learning']
    },
    {
      id: 3,
      name: 'UI/UX Design Principles',
      category: 'Design',
      tutor: 'Emma Wilson',
      rating: 4.7,
      students: 650,
      price: 30,
      level: 'Beginner',
      description: 'Fundamental principles of user interface and user experience design.',
      tags: ['Figma', 'Design Thinking', 'Prototyping']
    },
    {
      id: 4,
      name: 'Advanced React Patterns',
      category: 'Programming',
      tutor: 'Michael Chen',
      rating: 4.9,
      students: 720,
      price: 35,
      level: 'Advanced',
      description: 'Learn advanced React patterns and best practices for building scalable applications.',
      tags: ['React', 'Frontend', 'State Management']
    },
    {
      id: 5,
      name: 'Digital Marketing Strategy',
      category: 'Business',
      tutor: 'David Brown',
      rating: 4.6,
      students: 540,
      price: 28,
      level: 'Intermediate',
      description: 'Comprehensive guide to creating and executing digital marketing campaigns.',
      tags: ['SEO', 'Social Media', 'Analytics']
    },
    {
      id: 6,
      name: 'Photography Basics',
      category: 'Creative',
      tutor: 'Lisa Garcia',
      rating: 4.8,
      students: 420,
      price: 22,
      level: 'Beginner',
      description: 'Learn the fundamentals of photography including composition and lighting.',
      tags: ['Camera', 'Composition', 'Lighting']
    }
  ];

  const categories = ['all', 'Programming', 'Data Science', 'Design', 'Business', 'Creative'];

  // Filter and sort skills
  const filteredSkills = skills
    .filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          skill.tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          skill.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.students - a.students;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

  // Handle category selection without page scroll
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Prevent default behavior that might cause scrolling
    return false;
  };

  // Open calendar for a specific skill
  const openCalendar = (skillId) => {
    setShowCalendar(skillId);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // Close calendar
  const closeCalendar = () => {
    setShowCalendar(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Confirm booking
  const confirmBooking = (skill) => {
    if (selectedDate && selectedTime) {
      const newBooking = {
        id: Date.now(), // Unique ID based on timestamp
        skillId: skill.id,
        skillName: skill.name,
        tutor: skill.tutor,
        date: selectedDate,
        time: selectedTime,
        price: skill.price,
        bookingDate: new Date().toISOString()
      };
      
      setBookings([...bookings, newBooking]);
      closeCalendar();
      alert(`Successfully booked ${skill.name} with ${skill.tutor} on ${selectedDate} at ${selectedTime}`);
    } else {
      alert('Please select both date and time');
    }
  };

  // Generate next 7 days for booking
  const generateNext7Days = () => {
    const days = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour}:00`);
      if (hour !== 17) { // Don't add 17:30 as it would be 18:00
        slots.push(`${hour}:30`);
      }
    }
    return slots;
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="browse-skills">
      <div className="browse-skills-container">
        <div className="browse-skills-header">
          <h1>Browse Skills</h1>
          <div className="user-info">
            <span className="welcome-text">Welcome back, {user?.name || 'User'}!</span>
            <div className="credits-badge">
              <span>{user?.credits || 0} Credits</span>
            </div>
          </div>
        </div>

        <div className="browse-filters">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search skills, tutors, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="category-filter">
            <select 
              value={selectedCategory} 
              onChange={(e) => handleCategorySelect(e.target.value)}
              className="category-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="sort-filter">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="skills-grid">
          {filteredSkills.length > 0 ? (
            filteredSkills.map(skill => (
              <div key={skill.id} className="skill-card">
                <div className="skill-header">
                  <h3 className="skill-name">{skill.name}</h3>
                  <div className="skill-price">{skill.price} credits</div>
                </div>
                
                <div className="skill-meta">
                  <div className="skill-tutor">by {skill.tutor}</div>
                  <div className="skill-category">{skill.category}</div>
                </div>
                
                <div className="skill-rating">
                  <span className="rating-stars">
                    {'★'.repeat(Math.floor(skill.rating))}{'☆'.repeat(5 - Math.floor(skill.rating))}
                  </span>
                  <span className="rating-value">{skill.rating}</span>
                  <span className="student-count">({skill.students} students)</span>
                </div>
                
                <p className="skill-description">{skill.description}</p>
                
                <div className="skill-tags">
                  {skill.tags.map((tag, index) => (
                    <span key={index} className="skill-tag">{tag}</span>
                  ))}
                </div>
                
                <div className="skill-level">
                  <span className={`level-badge ${skill.level.toLowerCase()}`}>
                    {skill.level}
                  </span>
                </div>
                
                <div className="skill-actions">
                  <button className="btn btn-secondary">View Details</button>
                  <button className="btn btn-primary" onClick={() => openCalendar(skill.id)}>
                    Book Session
                  </button>
                </div>

                {/* Calendar Modal */}
                {showCalendar === skill.id && (
                  <div className="calendar-modal">
                    <div className="calendar-overlay" onClick={closeCalendar}></div>
                    <div className="calendar-content">
                      <div className="calendar-header">
                        <h3>Book Session: {skill.name}</h3>
                        <button className="close-btn" onClick={closeCalendar}>×</button>
                      </div>
                      
                      <div className="calendar-body">
                        <div className="date-selection">
                          <h4>Select Date</h4>
                          <div className="date-grid">
                            {generateNext7Days().map((date, index) => (
                              <button
                                key={index}
                                className={`date-btn ${selectedDate && selectedDate.toDateString() === date.toDateString() ? 'selected' : ''}`}
                                onClick={() => handleDateSelect(date)}
                              >
                                {formatDate(date)}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {selectedDate && (
                          <div className="time-selection">
                            <h4>Select Time</h4>
                            <div className="time-grid">
                              {generateTimeSlots().map(time => (
                                <button
                                  key={time}
                                  className={`time-btn ${selectedTime === time ? 'selected' : ''}`}
                                  onClick={() => handleTimeSelect(time)}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {selectedDate && selectedTime && (
                          <div className="booking-summary">
                            <h4>Booking Summary</h4>
                            <p><strong>Skill:</strong> {skill.name}</p>
                            <p><strong>Tutor:</strong> {skill.tutor}</p>
                            <p><strong>Date:</strong> {selectedDate.toDateString()}</p>
                            <p><strong>Time:</strong> {selectedTime}</p>
                            <p><strong>Price:</strong> {skill.price} credits</p>
                            <button className="btn btn-primary" onClick={() => confirmBooking(skill)}>
                              Confirm Booking
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-results">
              <h3>No skills found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseSkills;