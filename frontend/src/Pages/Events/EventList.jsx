import React, { useEffect, useState } from 'react';
import './Eventlist.css';
import { databases } from '../../appwrite/config';
import Swal from 'sweetalert2';

const EventList = ({ events, setEvents }) => {
    const [editingEvent, setEditingEvent] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await databases.deleteDocument("670c9d0800197fd1f0c9", "670c9d130038756ef057", id);
                setEvents((prevEvents) => prevEvents.filter(event => event.$id !== id));
                Swal.fire('Deleted!', 'Your event has been deleted.', 'success');
            } catch (err) {
                console.error('Delete event error:', err);
                Swal.fire('Error!', 'Failed to delete event.', 'error');
            }
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setTitle(event.Title);
        setDescription(event.Description);
        setDate(event.Date);
        setLocation(event.Location);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updatedEvent = await databases.updateDocument(
                "670c9d0800197fd1f0c9",
                "670c9d130038756ef057",
                editingEvent.$id,
                { Title: title, Description: description, Date: date, Location: location }
            );
            setEvents((prevEvents) =>
                prevEvents.map((event) => (event.$id === editingEvent.$id ? updatedEvent : event))
            );
            Swal.fire('Success!', 'Event updated successfully!', 'success');
            setEditingEvent(null);
            setTitle('');
            setDescription('');
            setDate('');
            setLocation('');
        } catch (err) {
            console.error('Update event error:', err);
            Swal.fire('Error!', 'Failed to update event.', 'error');
        }
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await databases.listDocuments("670c9d0800197fd1f0c9", "670c9d130038756ef057");
                setEvents(response.documents);
            } catch (err) {
                console.error('Error fetching events:', err);
            }
        };

        fetchEvents();
    }, [setEvents]);

    return (
        <>
            <h1 className='text-center display-4 pt-5'>Event Lists</h1>
            <div className="event-list">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">S.NO</th>
                            <th scope="col">Title</th>
                            <th scope="col">Description</th>
                            <th scope="col">Date</th>
                            <th scope="col">Location</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.length > 0 ? (
                            events.map((event, index) => (
                                <tr key={event.$id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{event.Title}</td>
                                    <td>{event.Description}</td>
                                    <td>{event.Date}</td>
                                    <td>{event.Location}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary w-50"
                                            onClick={() => handleEdit(event)}
                                            data-toggle="modal"
                                            data-target="#editModal"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger w-50"
                                            onClick={() => handleDelete(event.$id)}
                                            style={{ marginLeft: '5px' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-events">
                                    No events found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editModalLabel">Edit Event</h5>
                            <button type="button" className="close" onClick={() => setEditingEvent(null)} aria-label="Close">
                                {/* <span aria-hidden="true">&times;</span> */}
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleUpdate}>
                                <div className="form-group">
                                    <label htmlFor="title">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="date">Date</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        id="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="location">Location</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventList;
