const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createResume() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const fontSize = 30;

    page.drawText('Saswata Dey', {
        x: 50,
        y: height - 4 * fontSize,
        size: fontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
    });

    page.drawText('QA Engineer & Computer Vision Specialist', {
        x: 50,
        y: height - 6 * fontSize,
        size: 18,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
    });

    page.drawText('Portfolio: https://saswatadey.com', {
        x: 50,
        y: height - 8 * fontSize,
        size: 14,
        font: font,
        color: rgb(0, 0.4, 0.8),
    });

    const content = `
  SUMMARY:
  Passionate Computer Science Graduate specializing in Quality Assurance and Computer Vision.
  
  SKILLS:
  - QA Automation (Selenium)
  - Manual Testing
  - Computer Vision (OpenCV, YOLO)
  - Web Development (Next.js, React)

  EDUCATION:
  - B.Tech in CSE, KIIT University
  - Diploma in CSE, KIIT Polytechnic

  CONTACT:
  Please visit the website for full details.
  `;

    page.drawText(content, {
        x: 50,
        y: height - 12 * fontSize,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
        lineHeight: 20
    });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(path.join(__dirname, '../public/resume.pdf'), pdfBytes);
    console.log('Resume PDF generated successfully at public/resume.pdf');
}

createResume();
