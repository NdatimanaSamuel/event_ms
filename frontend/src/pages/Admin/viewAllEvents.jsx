import { useEffect, useState } from "react";
import SideBarMenu from "../../components/SideBarMenu";
import { useDispatch, useSelector } from "react-redux";
import { getEvents, removeEvent } from "../../redux/features/events/eventSlice";
import { Link, Navigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";


const ViewAllEvents = () => {


  const dispatch = useDispatch();
  const { events, isLoading, isError, message } = useSelector(
    (state) => state.event
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(3); // Change this value to display more records per page

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

// delete events
const deleteEvent = async (id) => {
  await dispatch(removeEvent(id));
  await dispatch(getEvents());
  toast.success("Event deleted successfully!");
};

const { user } = useSelector((state) => state.auth);

if (!user) {
  return <Navigate to="/login" />;
}

if (user.role !== "admin") {
  // For example, if only customers are allowed to make a booking
  return <Navigate to="/unauthorized" />; // Redirect to an unauthorized page
  }
  
    // Get current bookings for pagination
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = events.slice(indexOfFirstRecord, indexOfLastRecord);
  
    const totalPages = Math.ceil(events.length / recordsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  return (
    <div>
      <ToastContainer/>
      <div className="flex">
        <aside className="bg-sidebarBg shadow-lg h-screen fixed left-0 w-64">
          <SideBarMenu />
        </aside>

        <section id="main-content" className="ml-64 flex-grow">
          <header className="bg-white shadow-lg">
            <div className="flex justify-between items-center py-4 px-6">
              <h2 className="text-xl font-bold toggle-btn">
                <i className="fa fa-bars"></i> Dashboard
              </h2>
              <div className="flex items-center">
                <div className="mr-6">
                  <input
                    type="text"
                    placeholder="Search Here..."
                    
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                  <i className="fa fa-search"></i>
                </div>
                <div className="flex items-center">
                  <img
                    src={
                      "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-0.jpg"
                    }
                    alt="User"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p>Admin</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="container mx-auto mt-10 ml-10">
            <h2 className="text-2xl font-bold mb-4">View Events</h2>
            {isLoading ? (
              <p>Loading...</p>
            ) : isError ? (
              <p>Error: {message}</p>
              ) : (
                <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ticket Number
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Remaining Ticket
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Orgnaizer
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentRecords.map((event) => (
                    <tr key={event.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {event.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {event.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {event.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {" "}
                        {event.ticketInitialNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {event.ticketRemainNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {event.organizer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                      to={`/update/${event._id}`} // Pass the event ID as a URL parameter
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      Update
                    </Link>
                      <Link
                          onClick={() => deleteEvent(event._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                      </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
                  </table>
                  <div className="mt-4 flex justify-center">
                <nav>
                  <ul className="flex list-none">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <li key={index} className={`px-3 py-1 border ${index + 1 === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} cursor-pointer`} onClick={() => paginate(index + 1)}>
                        {index + 1}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
                  </>
            )}
          </div>
        </section>
      </div>
         </div>
  );
};

export default ViewAllEvents;
