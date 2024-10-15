import React, { useState, useEffect } from 'react';
import './Eventform.css';
import EventList from './EventList';
import { ID } from 'appwrite';
import Swal from 'sweetalert2';
import { databases } from '../../appwrite/config';

const EventForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    
    const fetchEvents = async () => {
        try {
            const response = await databases.listDocuments(
                "670c9d0800197fd1f0c9", // Database ID
                "670c9d130038756ef057" // Collection ID
            );
            setEvents(response.documents);
        } catch (error) {
            console.error('Fetch Events Error:', error);
            setError('Failed to fetch events.');
        }
    };

    const createEvent = async (title, description, date, location) => {
        try {
            const event = await databases.createDocument(
                "670c9d0800197fd1f0c9", // Database ID
                "670c9d130038756ef057", // Collection ID
                ID.unique(),
                { Title: title, Description: description, Date: date, Location: location }
            );
            console.log('Event Created:', event);
            return event;
        } catch (error) {
            console.error('Create Event Error:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description || !date || !location) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const eventData = await createEvent(title, description, date, location);
            fetchEvents();
            setSuccess('Event created successfully!');
            Swal.fire('Success!', 'Event created successfully!', 'success');
            setTitle('');
            setDescription('');
            setDate('');
            setLocation('');
        } catch (err) {
            console.error(err);
            setError('Failed to create event.');
            Swal.fire('Error!', 'Failed to create event.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
        const intervalId = setInterval(fetchEvents, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <div className="event-form">
                <h2>Create Event</h2>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Date:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Location:</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className='w-25'>
                        {loading ? 'Creating...' : 'Create Event'}
                    </button>
                </form>
            </div>
            <EventList events={events} setEvents={setEvents} />
        </>
    );
};

export default EventForm;
