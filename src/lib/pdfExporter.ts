import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateItineraryPDF = (trip: any, destination: string, startDate: string) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.text('TripSync Itinerary', 105, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text(`${destination} | ${startDate}`, 105, 30, { align: 'center' });
  
  // Budget Summary
  doc.setFontSize(16);
  doc.text('Budget Summary (INR)', 14, 45);
  doc.setFontSize(12);
  doc.text(`Total: ₹${trip.budgetEstimate.total}`, 14, 52);
  
  // Itinerary
  let y = 65;
  trip.itinerary.forEach((day: any) => {
    doc.setFontSize(16);
    doc.text(`Day ${day.day}`, 14, y);
    y += 10;
    
    const tableData = day.activities.map((a: any) => [a.time, a.activity, a.description, a.cost || '-']);
    
    autoTable(doc, {
      startY: y,
      head: [['Time', 'Activity', 'Description', 'Cost']],
      body: tableData,
    });
    
    // @ts-ignore
    y = doc.lastAutoTable.finalY + 15;
  });

  doc.save(`TripSync_${destination}_${startDate}.pdf`);
};
