if (!document.getElementById('scheduler-styles')) {
    var style = document.createElement('style');
    style.id = 'scheduler-styles';
    style.innerHTML = `
    #custom-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding: 10px 15px;
        background-color: #f5f5f5;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    #custom-header .left-section,
    #custom-header .center-section,
    #custom-header .right-section {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    #custom-header button {
        padding: 6px 12px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: white;
        cursor: pointer;
        font-weight: 500;
        transition: background 0.2s;
    }
    #custom-header button:hover {
        background-color: #0078D7;
        color: white;
        border-color: #0078D7;
    }
    #custom-header select {
        padding: 6px 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: white;
        cursor: pointer;
    }
    #custom-header span#dateRange {
        font-weight: 600;
        color: #333;
    }
    `;
    document.head.appendChild(style);
}
 
// ---------------- Initialize Scheduler ----------------
window.initScheduler = function (selectedRoom = "All") {
    var bookings = JSON.parse(localStorage.getItem("roomBookings")) || [];
    var guestHouses = JSON.parse(localStorage.getItem("guestHouses")) || [];
 
    // Build room resources dynamically
    var roomResources = guestHouses.map(gh => ({
        text: gh.GuestName,
        id: gh.GuestName,
        RoomId: gh.RoomId,
        GuestName: gh.GuestName,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
    }));
 
    // Configure resources based on room selection
    var resources = [{
        field: 'Room',
        title: 'Room',
        name: 'Rooms',
        allowMultiple: false,
        dataSource: selectedRoom === "All" ? roomResources : [{ text: selectedRoom, id: selectedRoom, color: '#0078D7' }],
        textField: 'text',
        idField: 'id',
        colorField: 'color'
    }];
 
    // Filter bookings for selected room
    var dataSource = selectedRoom === "All" ? bookings : bookings.filter(b => b.Room === selectedRoom);
 
    // Destroy previous scheduler if exists
    if (window.schedulerObj) window.schedulerObj.destroy();
 
    // Initialize the scheduler
    window.schedulerObj = new ej.schedule.Schedule({
        height: '600px',
        width: '100%',
        selectedDate: new Date(),
        currentView: selectedRoom === "All" ? 'TimelineWeek' : 'Week',
        views: ['Day', 'Week', 'Month', 'TimelineDay', 'TimelineWeek', 'TimelineMonth'],
        group: { resources: ['Rooms'] },
        resources: resources,
        eventSettings: {
            dataSource: dataSource,
            fields: {
                id: 'Id',
                subject: { name: 'Subject' },
                startTime: { name: 'StartTime' },
                endTime: { name: 'EndTime' },
                resourceId: 'Room'
            }
        },
        showQuickInfo: true,
        showHeaderBar: false,
 
        // ---------------- Prevent duplicate & past bookings ----------------
        popupOpen: function (args) {
            if (args.type === "QuickInfo") {
                args.cancel = true;
 
                var now = new Date();
                if (args.startTime < now) {
                    alert("⛔ You cannot create a booking in the past!");
                    return;
                }
 
                // ✅ Always pick the correct room
                var room;
                if (selectedRoom === "All") {
                    room = args.resource?.[0]?.id || roomResources[0].id;
                } else {
                    room = selectedRoom;
                }
 
                // Check for duplicate booking in same room & overlapping time
                var conflict = bookings.some(b =>
                    b.Room === room &&
                    ((args.startTime >= new Date(b.StartTime) && args.startTime < new Date(b.EndTime)) ||
                     (args.endTime > new Date(b.StartTime) && args.endTime <= new Date(b.EndTime)) ||
                     (args.startTime <= new Date(b.StartTime) && args.endTime >= new Date(b.EndTime)))
                );
 
                if (conflict) {
                    alert("⚠️ This room is already booked during the selected time!");
                    return;
                }
 
                // Unique ID
                var newId = Date.now();
 
                // Find GuestHouse details
                var roomDetails = guestHouses.find(gh => gh.GuestName === room);
 
                // Create booking with full details
                var newBooking = {
                    Id: newId,
                    Subject: "Booked",
                    StartTime: args.startTime,
                    EndTime: args.endTime,
                    Room: room,
                    RoomId: roomDetails?.RoomId || 0,
                    GuestName: roomDetails?.GuestName || "",
                    Location: roomDetails?.Location || "",
                    resourceIds: [room]
                };
 
                // Save booking
                bookings.push(newBooking);
                localStorage.setItem("roomBookings", JSON.stringify(bookings));
 
                // Add booking to scheduler
                window.schedulerObj.addEvent(newBooking);
            }
        },
 
        // ---------------- Prevent moving bookings to the past ----------------
        actionBegin: function (args) {
            if (args.requestType === "eventChange" || args.requestType === "eventCreate") {
                var data = args.data instanceof Array ? args.data[0] : args.data;
                if (new Date(data.StartTime) < new Date()) {
                    alert("⛔ Bookings cannot be moved or created in the past!");
                    args.cancel = true;
                }
            }
        }
    });
 
    window.schedulerObj.appendTo('#Scheduler');
 
    // ---------------- Custom Header ----------------
    var schedulerContainer = document.getElementById('Scheduler');
    var headerDiv = document.createElement('div');
    headerDiv.id = 'custom-header';
    headerDiv.innerHTML = `
    <div class="left-section">
        <button id="prevBtn">&#8592;</button>
        <span id="dateRange"></span>
        <button id="nextBtn">&#8594;</button>
    </div>
    <div class="center-section">
        <select id="roomFilter">
            <option value="All">All Rooms</option>
            ${guestHouses.map(gh => `<option value="${gh.GuestName}">${gh.GuestName}</option>`).join('')}
        </select>
    </div>
    <div class="right-section">
        <button id="dayBtn">Day</button>
        <button id="weekBtn">Week</button>
        <button id="monthBtn">Month</button>
        <button id="timelineDayBtn">TimelineDay</button>
        <button id="timelineWeekBtn">TimelineWeek</button>
        <button id="timelineMonthBtn">TimelineMonth</button>
    </div>
    `;
    schedulerContainer.prepend(headerDiv);
 
    // ---------------- Date Range ----------------
    function updateDateRange() {
        var start = new Date(window.schedulerObj.selectedDate);
        var end = new Date(start);
        if (window.schedulerObj.currentView.includes('Week')) {
            end.setDate(start.getDate() + 6);
        } else if (window.schedulerObj.currentView === 'Month') {
            end.setMonth(start.getMonth() + 1);
            end.setDate(0);
        }
        document.getElementById('dateRange').innerText = `${start.toDateString()} - ${end.toDateString()}`;
    }
    updateDateRange();
 
    // ---------------- Navigation ----------------
    document.getElementById('prevBtn').onclick = () => {
        window.schedulerObj.selectedDate = new Date(window.schedulerObj.selectedDate.setDate(window.schedulerObj.selectedDate.getDate() - 1));
        updateDateRange();
    };
    document.getElementById('nextBtn').onclick = () => {
        window.schedulerObj.selectedDate = new Date(window.schedulerObj.selectedDate.setDate(window.schedulerObj.selectedDate.getDate() + 1));
        updateDateRange();
    };
 
    // ---------------- View Buttons ----------------
    document.getElementById('dayBtn').onclick = () => { window.schedulerObj.currentView = 'Day'; updateDateRange(); };
    document.getElementById('weekBtn').onclick = () => { window.schedulerObj.currentView = 'Week'; updateDateRange(); };
    document.getElementById('monthBtn').onclick = () => { window.schedulerObj.currentView = 'Month'; updateDateRange(); };
    document.getElementById('timelineDayBtn').onclick = () => { window.schedulerObj.currentView = 'TimelineDay'; updateDateRange(); };
    document.getElementById('timelineWeekBtn').onclick = () => { window.schedulerObj.currentView = 'TimelineWeek'; updateDateRange(); };
    document.getElementById('timelineMonthBtn').onclick = () => { window.schedulerObj.currentView = 'TimelineMonth'; updateDateRange(); };
 
    // ---------------- Room Filter ----------------
    var roomFilter = document.getElementById('roomFilter');
    roomFilter.value = selectedRoom;
    roomFilter.addEventListener('change', function (e) {
        window.initScheduler(e.target.value); // reload scheduler dynamically
    });
};