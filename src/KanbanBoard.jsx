import React, { useState, useEffect } from "react";
import "./App.css";
// Import icons and images
import urgentIcon from "./assets/icons/SVG - Urgent Priority grey.svg";
import highIcon from "./assets/icons/Img - High Priority.svg";
import mediumIcon from "./assets/icons/Img - Medium Priority.svg";
import lowIcon from "./assets/icons/Img - Low Priority.svg";
import noPriorityIcon from "./assets/icons/No-priority.svg";
import todoIcon from "./assets/icons/To-do.svg";
import inProgressIcon from "./assets/icons/in-progress.svg";
import doneIcon from "./assets/icons/Done.svg";
import backlogIcon from "./assets/icons/Backlog.svg";
import addIcon from "./assets/icons/add.svg";
import userImage from "./assets/icons/img.png";

// Import data
import { ticketsData, usersData } from "./data";

// Define the custom priority order (reversed)
const priorityOrder = [0, 4, 3, 2, 1]; // Order: No Priority, Urgent, High, Medium, Low

// Define mappings for priority levels to human-readable strings and icons
const priorityLabels = {
  4: "Urgent",
  3: "High",
  2: "Medium",
  1: "Low",
  0: "No priority",
};

// Mapping status to icons
const statusIcons = {
  Todo: todoIcon,
  "In progress": inProgressIcon,
  Done: doneIcon,
  Backlog: backlogIcon,
};

// Mapping priority levels to icons
const priorityIcons = {
  4: urgentIcon,
  3: highIcon,
  2: mediumIcon,
  1: lowIcon,
  0: noPriorityIcon,
};

// Ticket component to display individual ticket details
const Ticket = ({ ticket, users }) => {
  const { id, title, tag, status, priority, userId } = ticket;

  // Find the user by userId
  const user = users.find((user) => user.id === userId);
  const userImage = user ? user.img : ""; // Get user's image or set a default image

  return (
    <div key={id} className={`ticket priority-${priority}`}>
      {/* Ticket Header */}
      <div className="ticket-header-1">
        <div>{id}</div>
        {/* Display user image dynamically */}
        <img src={userImage} alt={user?.name || "User"} className="left-img" />
      </div>

      {/* Ticket Title Section */}
      <div className="ticket-header">
        {/* Display status icon dynamically */}
        <img src={statusIcons[status]} alt={status} className="status-icon" />
        <h3>{title}</h3>
      </div>

      {/* Ticket Footer */}
      <div className="ticket-footer">
        {/* Display priority icon dynamically */}
        <img
          src={priorityIcons[priority]}
          alt={priorityLabels[priority]}
          className="priority-icon"
        />
        <div>
          {/* Display tag */}
          <div className="tag0"></div>
          <span className="tag">{tag[0]}</span>
        </div>
      </div>
    </div>
  );
};

// KanbanBoard component to manage and display the Kanban board
const KanbanBoard = () => {
  const [grouping, setGrouping] = useState("status"); // State to track grouping criteria
  const [ordering, setOrdering] = useState("priority"); // State to track ordering criteria
  const [groupedTickets, setGroupedTickets] = useState({}); // State to store grouped tickets
  const [controlsVisible, setControlsVisible] = useState(false); // State to toggle visibility of controls

  useEffect(() => {
    // Function to group tickets based on the selected grouping criteria
    const groupTickets = () => {
      let grouped = {};
      if (grouping === "status") {
        grouped = ticketsData.reduce((acc, ticket) => {
          const key = ticket.status;
          acc[key] = acc[key] || [];
          acc[key].push(ticket);
          return acc;
        }, {});
      } else if (grouping === "user") {
        grouped = ticketsData.reduce((acc, ticket) => {
          const key = ticket.userId;
          acc[key] = acc[key] || [];
          acc[key].push(ticket);
          return acc;
        }, {});
      } else if (grouping === "priority") {
        grouped = ticketsData.reduce((acc, ticket) => {
          const key = priorityLabels[ticket.priority];
          acc[key] = acc[key] || [];
          acc[key].push(ticket);
          return acc;
        }, {});
      }
      setGroupedTickets(grouped);
    };

    groupTickets();
  }, [grouping]); // Re-run grouping whenever the grouping criteria changes

  // Function to sort tickets based on the selected ordering criteria
  const sortedTickets = (ticketList) => {
    if (ordering === "priority") {
      return [...ticketList].sort((a, b) => b.priority - a.priority); // Sort by priority
    } else if (ordering === "title") {
      return [...ticketList].sort((a, b) => a.title.localeCompare(b.title)); // Sort by title
    }
    return ticketList;
  };

  // Get user details by userId
  const getUserDetails = (userId) => {
    const user = usersData.find((user) => user.id === userId);
    return user ? { name: user.name, img: user.img } : {};
  };

  return (
    <div className="kanban-board">
      <button
        className="display-controls-button"
        onClick={() => setControlsVisible(!controlsVisible)}
      >
        Display Controls
      </button>

      {controlsVisible && (
        <div className="controls-panel">
          {/* Grouping Control */}
          <div className="control-group">
            <label>Grouping:</label>
            <select
              onChange={(e) => setGrouping(e.target.value)}
              value={grouping}
            >
              <option value="status">Status</option>
              <option value="priority">Priority</option>
              <option value="user">User</option>
            </select>
          </div>

          {/* Ordering Control */}
          <div className="control-group">
            <label>Ordering:</label>
            <select
              onChange={(e) => setOrdering(e.target.value)}
              value={ordering}
            >
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      )}

      <div className="board-columns">
        {Object.keys(groupedTickets)
          .sort((a, b) => {
            const priorityA = Object.keys(priorityLabels).find(
              (key) => priorityLabels[key] === a
            );
            const priorityB = Object.keys(priorityLabels).find(
              (key) => priorityLabels[key] === b
            );

            // Sort groups based on priority order
            return (
              priorityOrder.indexOf(Number(priorityA)) -
              priorityOrder.indexOf(Number(priorityB))
            );
          })
          .map((group) => {
            const isUserGrouping = grouping === "user";
            const isPriorityGrouping = grouping === "priority";
            const userDetails = isUserGrouping ? getUserDetails(group) : {};
            return (
              <div key={group} className="column">
                <div className="column-header">
                  <div className="header-left">
                    {isPriorityGrouping ? (
                      <img
                        src={
                          priorityIcons[
                            Object.keys(priorityLabels).find(
                              (key) => priorityLabels[key] === group
                            )
                          ] || noPriorityIcon
                        }
                        alt={group}
                        className="header-img"
                      />
                    ) : isUserGrouping && userDetails.img ? (
                      <img
                        src={userDetails.img}
                        alt={userDetails.name}
                        className="header-img"
                      />
                    ) : (
                      <img
                        src={statusIcons[group] || userImage}
                        alt={group}
                        className="header-img"
                      />
                    )}
                    <h5>
                      {isUserGrouping
                        ? userDetails.name
                        : isPriorityGrouping
                        ? group
                        : group}{" "}
                      <span className="count">{groupedTickets[group].length} </span>
                    </h5>
                  </div>
                  <div className="header-right">
                    <img src={addIcon} alt="Add" className="header-icon" />
                    <img
                      src={noPriorityIcon}
                      alt="No priority"
                      className="header-icon"
                    />
                  </div>
                </div>
                {sortedTickets(groupedTickets[group]).map((ticket) => (
                  <Ticket key={ticket.id} ticket={ticket} users={usersData} />
                ))}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default KanbanBoard;
