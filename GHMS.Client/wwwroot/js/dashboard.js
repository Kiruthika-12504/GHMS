window.Dashboard = {
    bookingChartInstance: null,
    segmentationChartInstance: null,
    checkInOutChartInstance: null,
    bookingChartFullInstance: null,
    segmentationChartFullInstance: null,
    checkInOutChartFullInstance: null,
 
    initCards: function () {
        console.log("Dashboard cards initialized");
    },
 
    initTable: function (showAll = false) {
        if (window.RoomsData && document.getElementById('roomsGrid')) {
            var existingGrid = document.getElementById('roomsGrid').ej2_instances;
            if (existingGrid && existingGrid.length > 0) {
                existingGrid[0].destroy();
                document.getElementById('roomsGrid').innerHTML = "";
            }
 
            var grid = new ej.grids.Grid({
                dataSource: window.RoomsData,
                allowPaging: true,
                allowSorting: true,
                allowFiltering: true,
                pageSettings: { pageSize: showAll ? window.RoomsData.length : 5 },
                filterSettings: { type: 'CheckBox' },
                columns: [
                    { field: 'RoomNo', headerText: 'Room No', width: 120, textAlign: 'Center' },
                    { field: 'Type', headerText: 'Type', width: 120 },
                    { field: 'Capacity', headerText: 'Capacity', width: 120, textAlign: 'Center' },
                    { field: 'Status', headerText: 'Status', width: 120 },
                    { field: 'CurrentGuest', headerText: 'Current Guest', width: 150 },
                    { field: 'CheckIn', headerText: 'Check-In', width: 150 },
                    { field: 'CheckOut', headerText: 'Check-Out', width: 150 },
                    { field: 'Remarks', headerText: 'Remarks', width: 200 }
                ],
                created: function () {
                    console.log('Grid created');
                },
                actionBegin: function (args) {
                    if (args.requestType === 'filterMenuOpen') {
                        const popup = document.querySelector('.e-filter-popup');
                        if (popup) {
                            popup.style.position = 'fixed';
                            popup.style.top = '50%';
                            popup.style.left = '50%';
                            popup.style.transform = 'translate(-50%, -50%)';
                            popup.style.zIndex = 2000;
                        }
                    }
                }
            });
 
            grid.appendTo('#roomsGrid');
        }
    },
 
    initCharts: function () {
        console.log("Dashboard charts initialized");
        Dashboard.renderBooking("bookingChart", "bookingChartInstance");
        Dashboard.renderSegmentation("segmentationChart", "segmentationChartInstance");
        Dashboard.renderCheckInOut("checkInOutChart", "checkInOutChartInstance");
    },
 
    initFullChart: function (chartName) {
        console.log("Init full chart:", chartName);
        if (chartName === "Booking") {
            Dashboard.renderBooking("bookingChartFull", "bookingChartFullInstance");
        } else if (chartName === "Segmentation") {
            Dashboard.renderSegmentation("segmentationChartFull", "segmentationChartFullInstance");
        } else if (chartName === "CheckInOut") {
            Dashboard.renderCheckInOut("checkInOutChartFull", "checkInOutChartFullInstance");
        }
    },
 
    renderBooking: function (canvasId, instanceName) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        if (Dashboard[instanceName]) {
            Dashboard[instanceName].destroy();
        }
        Dashboard[instanceName] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
                datasets: [{
                    label: 'Bookings',
                    data: [45, 60, 55, 70, 80, 65, 75, 50, 60, 70, 80, 90],
                    backgroundColor: '#4F46E5'
                }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
    },
 
    renderSegmentation: function (canvasId, instanceName) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        if (Dashboard[instanceName]) {
            Dashboard[instanceName].destroy();
        }
        Dashboard[instanceName] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['New Joiners', 'Guests', 'Others'],
                datasets: [{
                    data: [15, 70, 15],
                    backgroundColor: ['#22C55E', '#3B82F6', '#FACC15']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                radius: '70%',
                plugins: { legend: { display: false }, tooltip: { enabled: true } }
            }
        });
    },
 
    renderCheckInOut: function (canvasId, instanceName) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        if (Dashboard[instanceName]) {
            Dashboard[instanceName].destroy();
        }
        Dashboard[instanceName] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Check-In',
                        data: [12, 15, 10, 20, 18, 25, 22],
                        borderColor: '#22C55E',
                        backgroundColor: 'rgba(34,197,94,0.2)',
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: 'Check-Out',
                        data: [10, 12, 14, 18, 16, 20, 19],
                        borderColor: '#EF4444',
                        backgroundColor: 'rgba(239,68,68,0.2)',
                        fill: true,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false }, tooltip: { enabled: true } }
            }
        });
    },
 
    // ---------------------
    // NEW: Resize Chart
    // ---------------------
    resizeChart: function (chartName) {
        let chartInstance = null;
 
        if (chartName === "Booking") chartInstance = Dashboard.bookingChartFullInstance || Dashboard.bookingChartInstance;
        else if (chartName === "Segmentation") chartInstance = Dashboard.segmentationChartFullInstance || Dashboard.segmentationChartInstance;
        else if (chartName === "CheckInOut") chartInstance = Dashboard.checkInOutChartFullInstance || Dashboard.checkInOutChartInstance;
 
        if (chartInstance) {
            chartInstance.resize();
        } else {
            console.warn("Chart instance not found for resize:", chartName);
        }
    }
};