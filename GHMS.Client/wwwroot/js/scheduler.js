// ---------------- Add custom styles ----------------
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

window.initScheduler = function (selectedRoom = "All") {
    var bookings = JSON.parse(localStorage.getItem("roomBookings")) || [];
    var guestHouses = JSON.parse(localStorage.getItem("guestHouses")) || [];

    var roomResources = guestHouses.map(gh => ({
        text: gh.GuestName,
        id: gh.RoomId,
        RoomId: gh.RoomId,
        GuestName: gh.GuestName,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
    }));

    var resources = [{
        field: 'RoomId',
        title: 'Room',
        name: 'Rooms',
        allowMultiple: false,
        dataSource: selectedRoom === "All"
            ? roomResources
            : roomResources.filter(r => r.RoomId == selectedRoom),
        textField: 'text',
        idField: 'id',
        colorField: 'color'
    }];

    var dataSource = selectedRoom === "All"
        ? bookings
        : bookings.filter(b => b.RoomId == selectedRoom);

    if (window.schedulerObj) window.schedulerObj.destroy();

    // ---------------- Custom Editor Template ----------------
    var customEditorTemplate = function () {
        return `
        <div class="custom-editor" style="padding: 0; margin: 0;">
            <div style="background: #fff; border-radius: 10px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); padding: 24px 20px 12px 20px; max-width: 600px; margin: auto;">
                <input type="hidden" name="RoomId" />

                <!-- Booking Type -->
                <div style="margin-bottom: 16px;">
                    <label style="font-weight: 500;">Booking Type</label>
                    <select class="e-field e-input" name="BookingType" style="width:100%; margin-top: 4px;">
                        <option value="">Select Booking Type</option>
                        <option>Confirm</option>
                        <option>Tentative Booking</option>
                        <option>Block Room</option>
                    </select>
                </div>

                <!-- Usual Fields -->
                <div class="usual-fields">
                    <div style="display: flex; gap: 16px; margin-bottom: 16px;">
                        <div style="flex: 1;">
                            <label style="font-weight: 500;">First Name</label>
                            <input class="e-field e-input" type="text" name="Fname" style="width:100%; margin-top: 4px;" />
                        </div>
                        <div style="flex: 1;">
                            <label style="font-weight: 500;">Last Name</label>
                            <input class="e-field e-input" type="text" name="Lname" style="width:100%; margin-top: 4px;" />
                        </div>
                    </div>
                    <div style="display: flex; gap: 16px; margin-bottom: 16px;">
                        <div style="flex: 1;">
                            <label style="font-weight: 500;">Gender</label>
                            <select class="e-field e-input" name="Gender" style="width:100%; margin-top: 4px;">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div style="flex: 1;">
                            <label style="font-weight: 500;">Email</label>
                            <input class="e-field e-input" type="email" name="Email" style="width:100%; margin-top: 4px;" />
                        </div>
                    </div>
                    <div style="display: flex; gap: 16px; margin-bottom: 16px;">
                        <div style="flex: 1;">
                            <label style="font-weight: 500;">Mobile</label>
                            <input class="e-field e-input" type="text" name="Mobile" style="width:100%; margin-top: 4px;" />
                        </div>
                        <div style="flex: 1;">
                            <label style="font-weight: 500;">Occupancy Category</label>
                            <input class="e-field e-input" type="text" name="OccupancyCategory" style="width:100%; margin-top: 4px;" />
                        </div>
                    </div>
                    <div style="display: flex; gap: 16px; margin-bottom: 16px;">
                        <div style="flex: 1;">
                            <label style="font-weight: 500;">Department</label>
                            <select class="e-field e-input" name="Department" style="width:100%; margin-top: 4px;">
                                <option value="">Select Department</option>
                                <option>Guest</option>
                                <option>New Joiner</option>
                                <option>HR</option>
                                <option>IT</option>
                            </select>
                        </div>
                        <div style="flex: 1;">
                            <label style="font-weight: 500;">Band Level</label>
                            <input class="e-field e-input" type="text" name="BandLevel" style="width:100%; margin-top: 4px;" />
                        </div>
                    </div>
                </div>

                <!-- Check In / Check Out / Remarks (always visible) -->
                <div style="display: flex; gap: 16px; margin-bottom: 16px;">
                    <div style="flex: 1;">
                        <label style="font-weight: 500;">Check In</label>
                        <input class="e-field" type="datetime-local" name="CheckIn" style="width:100%; margin-top: 4px;" />
                    </div>
                    <div style="flex: 1;">
                        <label style="font-weight: 500;">Check Out</label>
                        <input class="e-field" type="datetime-local" name="CheckOut" style="width:100%; margin-top: 4px;" />
                    </div>
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="font-weight: 500;">Reason</label>
                    <textarea class="e-field e-input" name="Remarks" style="width:100%; margin-top: 4px; min-height: 38px;"></textarea>
                </div>
            </div>
        </div>
        `;
    };

    // ---------------- Initialize the Scheduler ----------------
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
                resourceId: 'RoomId'
            }
        },
        showQuickInfo: false,
        showHeaderBar: false,
        editorTemplate: customEditorTemplate,

        // ---------------- Popup Open Logic ----------------
        popupOpen: function (args) {
            if (args.type === "QuickInfo") args.cancel = true;

            if (args.type === "Editor") {
                if (args.data && !args.data.Id) {
                    var start = args.data.StartTime ? new Date(args.data.StartTime) : new Date();
                    var end = args.data.EndTime ? new Date(args.data.EndTime) : new Date(start.getTime() + 30 * 60000);

                    function formatLocalDateTime(date) {
                        const pad = n => n.toString().padStart(2, "0");
                        return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + "T" + pad(date.getHours()) + ":" + pad(date.getMinutes());
                    }

                    setTimeout(() => {
                        document.querySelector("input[name='CheckIn']").value = formatLocalDateTime(start);
                        document.querySelector("input[name='CheckOut']").value = formatLocalDateTime(end);

                        const roomIdInput = document.querySelector("input[name='RoomId']");
                        if (roomIdInput) {
                            roomIdInput.value = args.data.resourceIds && args.data.resourceIds.length > 0
                                ? args.data.resourceIds[0]
                                : (selectedRoom !== "All" ? selectedRoom : guestHouses[0].RoomId);
                        }
                    }, 50);
                }

                // Toggle usual fields based on Booking Type
                var bookingTypeSelect = document.querySelector("select[name='BookingType']");
                var usualFields = document.querySelector(".usual-fields");

                function toggleFields() {
                    if (bookingTypeSelect.value === "Block Room") usualFields.style.display = "none";
                    else usualFields.style.display = "block";
                }

                bookingTypeSelect.addEventListener("change", toggleFields);
                toggleFields();
            }
        },

        actionBegin: function (args) {
    var bookings = JSON.parse(localStorage.getItem("roomBookings")) || [];
    var guestHouses = JSON.parse(localStorage.getItem("guestHouses")) || [];

    if (args.requestType === "eventCreate") {
        var newBooking = Array.isArray(args.data) ? args.data[0] : args.data;
        if (!newBooking) { args.cancel = true; return; }

        // ---------------- Validate Booking Type ----------------
        if (!newBooking.BookingType || newBooking.BookingType.trim() === "") {
            alert("⚠️ Please select a Booking Type!");
            args.cancel = true;
            return;
        }

        // ---------------- Prevent saving "Block Room" ----------------
        if (newBooking.BookingType === "Block Room") {
            alert("⚠️ 'Block Room' bookings cannot be saved!");
            args.cancel = true;  // cancel creation
            return;
        }

        var selectedRoomId = args.data.resourceIds?.[0] || (selectedRoom !== "All" ? selectedRoom : guestHouses[0]?.RoomId);
        var roomDetails = guestHouses.find(gh => gh.RoomId == selectedRoomId);
        if (!roomDetails) { alert("⚠️ Selected room does not exist!"); args.cancel = true; return; }

        var checkIn = new Date(newBooking.CheckIn || newBooking.StartTime);
        var checkOut = new Date(newBooking.CheckOut || newBooking.EndTime);

        if (checkIn < new Date()) { alert("⛔ Bookings cannot be created in the past!"); args.cancel = true; return; }

        // ---------------- Conflict Check ----------------
        var conflict = bookings.some(b =>
            b.RoomId === roomDetails.RoomId &&
            ((checkIn >= new Date(b.CheckIn || b.StartTime) && checkIn < new Date(b.CheckOut || b.EndTime)) ||
             (checkOut > new Date(b.CheckIn || b.StartTime) && checkOut <= new Date(b.CheckOut || b.EndTime)) ||
             (checkIn <= new Date(b.CheckIn || b.StartTime) && checkOut >= new Date(b.CheckOut || b.EndTime)))
        );
        if (conflict) { alert("⚠️ This room is already booked during the selected time!"); args.cancel = true; return; }

        // ---------------- Store Booking ----------------
        newBooking.Id = newBooking.Id || Date.now();
        newBooking.RoomId = selectedRoomId;
        newBooking.Room = roomDetails.GuestName;
        newBooking.resourceId = selectedRoomId;
        newBooking.resourceIds = [selectedRoomId];
        newBooking.GuestName = roomDetails.GuestName;
        newBooking.Location = roomDetails.Location || "";
        newBooking.StartTime = newBooking.CheckIn;
        newBooking.EndTime = newBooking.CheckOut;
        newBooking.Subject = newBooking.Subject || "Booked";

        bookings.push(newBooking);
        localStorage.setItem("roomBookings", JSON.stringify(bookings));
    }

    if (args.requestType === "eventChange") {
        var data = Array.isArray(args.data) ? args.data[0] : args.data;
        if (!data) return;
        if (new Date(data.StartTime) < new Date()) { alert("⛔ Bookings cannot be moved to the past!"); args.cancel = true; }
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
            ${guestHouses.map(gh => `<option value="${gh.RoomId}">${gh.GuestName}</option>`).join('')}
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
        window.initScheduler(e.target.value === "All" ? "All" : parseInt(e.target.value));
    });
};
