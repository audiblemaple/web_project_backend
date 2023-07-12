const PDFDocument = require('pdfkit-table');

// Convert "HH:MM:SS" format into seconds
function toSeconds(time) {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return (hours * 60 + minutes) * 60 + seconds;
}

// Convert seconds back to "HH:MM:SS" format
function toHHMMSS(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map(v => v < 10 ? '0' + v : v).join(':');
}

function buildPDF(user, workSessions, dataCallback, endCallback) {
    const doc = new PDFDocument({ margin: 30, size: 'A4', bufferPages: true, font: 'Courier' });

    doc.on('data', dataCallback);
    doc.on('end', endCallback);

    let rows = workSessions.map(session => {
        let yearMonthDay = `${session.yearMonth}-${session.day}`;
        return [yearMonthDay, session.clockIn, session.clockOut, session.duration, session.working_from, session.user_note]
    });
    
    // get current date and format month and year for title
    const currentDate = new Date();
    const d = currentDate.toString().split(" ");
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const currentMonth = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();

    doc
      .font("Helvetica-Bold")
      .fontSize(22)
      .fillColor('#720f0b')
      .text("SolidRun Monthly Attendance Report", { align: 'center' })
      .moveDown()
      .fontSize(16)
      .fillColor('#b20000')
      .text(`Worker: ${user.username}`, { align: 'left' })
      .fontSize(10)
      .moveDown()
      .moveDown();

    const table = {
        title:
        `${currentMonth} ${currentYear} Attendance Report`,
        subtitle: `Created at: ${d[0]} ${d[1]} ${d[2]} ${d[3]} ${d[4]}`,
        divider: {
          header: { disabled: true },
          horizontal: { disabled: false, width: 1, opacity: 1 },
          padding: 5,
          columnSpacing: 10,
        },
        headers: [
          { label: "Date", width: 80, renderer: null },
          { label: "Clock In", width: 80, renderer: null },
          { label: "Clock Out", width: 80, renderer: null },
          { label: "Total Time", width: 80, renderer: null },
          { label: "Working From", width: 80, renderer: null },
          { label: "Note", width: 100, renderer: null },
        ],
        rows: rows
    };

    doc.table(table, {
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(12).fillColor('#812e2b'),
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
            doc.font("Helvetica-Bold").fontSize(10).fillColor('#951814');
            indexColumn === 0 && doc.addBackground(rectRow, 'pink', 0.15);
        },
    });

    // Calculate total seconds
    let totalSeconds = workSessions.reduce((total, session) => {
        return session.duration ? total + toSeconds(session.duration) : total;
    }, 0);

    // Convert total seconds back to "HH:MM:SS" format
    let totalDuration = toHHMMSS(totalSeconds);

    // Add total duration to the document
    doc.moveDown().fontSize(12).fillColor('black')
    .text(`Total Work Time: ${totalDuration}`, { align: 'center' });
    // doc.moveDown().fontSize(12).fillColor('black')
    // .text(`(in HH:MM:SS)`, { align: 'center' });

    doc.end();
}

module.exports = { buildPDF };