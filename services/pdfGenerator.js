const PDFDocument = require('pdfkit');

const generatePDF = async (resumeData) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                margins: { top: 50, bottom: 50, left: 50, right: 50 }
            });
            
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
            doc.on('error', reject);
            
            const { personalDetails, summary, workExperience, education, skills } = resumeData;
            
            // Helper function for consistent spacing
            const addSection = (title, content) => {
                // Check if we need a new page
                if (doc.y > 700) {
                    doc.addPage();
                }
                
                doc.fontSize(14).font('Helvetica-Bold').text(title.toUpperCase());
                doc.moveDown(0.3);
                
                // Add underline
                const titleWidth = doc.widthOfString(title.toUpperCase());
                doc.moveTo(doc.x, doc.y - 5)
                   .lineTo(doc.x + titleWidth, doc.y - 5)
                   .stroke();
                
                doc.moveDown(0.5);
                content();
                doc.moveDown(1);
            };
            
            // Header Section
            doc.fontSize(28).font('Helvetica-Bold').text(personalDetails.fullName, { align: 'center' });
            doc.moveDown(0.5);
            
            // Contact Info
            doc.fontSize(11).font('Helvetica');
            const contactLines = [];
            contactLines.push(personalDetails.email);
            contactLines.push(personalDetails.phone);
            if (personalDetails.website) contactLines.push(personalDetails.website);
            if (personalDetails.address) contactLines.push(personalDetails.address);
            
            const contactInfo = contactLines.join(' | ');
            doc.text(contactInfo, { align: 'center' });
            doc.moveDown(1);
            
            // Horizontal line
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
            doc.moveDown(1);
            
            // Professional Summary
            addSection('Professional Summary', () => {
                doc.fontSize(11).font('Helvetica').text(summary, { 
                    align: 'justify',
                    lineGap: 2
                });
            });
            
            // Work Experience
            addSection('Work Experience', () => {
                workExperience.forEach((exp, index) => {
                    if (index > 0) doc.moveDown(0.8);
                    
                    // Job title and date on same line
                    const startY = doc.y;
                    doc.fontSize(13).font('Helvetica-Bold').text(exp.jobTitle, 50, startY);
                    
                    const dateRange = `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`;
                    doc.fontSize(11).font('Helvetica').text(dateRange, 545 - doc.widthOfString(dateRange), startY);
                    
                    doc.y = startY + 18;
                    
                    // Company and location
                    doc.fontSize(12).font('Helvetica-Oblique').text(exp.employer);
                    if (exp.location) {
                        doc.fontSize(10).font('Helvetica').fillColor('#666666').text(exp.location);
                        doc.fillColor('#000000');
                    }
                    
                    doc.moveDown(0.3);
                    
                    // Description
                    doc.fontSize(11).font('Helvetica').text(exp.description, { 
                        align: 'justify',
                        lineGap: 1
                    });
                });
            });
            
            // Education
            addSection('Education', () => {
                education.forEach((edu, index) => {
                    if (index > 0) doc.moveDown(0.8);
                    
                    // Degree and date on same line
                    const startY = doc.y;
                    doc.fontSize(13).font('Helvetica-Bold').text(edu.degree, 50, startY);
                    
                    const dateRange = `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`;
                    doc.fontSize(11).font('Helvetica').text(dateRange, 545 - doc.widthOfString(dateRange), startY);
                    
                    doc.y = startY + 18;
                    
                    // School and location
                    doc.fontSize(12).font('Helvetica-Oblique').text(edu.school);
                    if (edu.location) {
                        doc.fontSize(10).font('Helvetica').fillColor('#666666').text(edu.location);
                        doc.fillColor('#000000');
                    }
                });
            });
            
            // Skills
            addSection('Skills', () => {
                // Create skill boxes/tags
                const skillsPerRow = 3;
                const skillWidth = 150;
                const skillHeight = 25;
                const marginBetween = 20;
                
                skills.forEach((skill, index) => {
                    const row = Math.floor(index / skillsPerRow);
                    const col = index % skillsPerRow;
                    
                    const x = 50 + col * (skillWidth + marginBetween);
                    const y = doc.y + row * (skillHeight + 10);
                    
                    // Draw skill box
                    doc.rect(x, y, skillWidth, skillHeight)
                       .fillAndStroke('#f8f9fa', '#dee2e6');
                    
                    // Add skill text
                    doc.fillColor('#000000')
                       .fontSize(10)
                       .font('Helvetica')
                       .text(skill.skill, x + 10, y + 8, {
                           width: skillWidth - 20,
                           align: 'center'
                       });
                });
                
                // Adjust Y position after skills
                const rows = Math.ceil(skills.length / skillsPerRow);
                doc.y += rows * (skillHeight + 10);
            });
            
            // Footer
            doc.fontSize(8).font('Helvetica').fillColor('#888888')
               .text(`Generated on ${new Date().toLocaleDateString()}`, 50, doc.page.height - 50);
            
            doc.end();
            
        } catch (error) {
            console.error('PDF Generation Error:', error);
            reject(new Error(`PDF generation failed: ${error.message}`));
        }
    });
};

const formatDate = (dateStr) => {
    if (!dateStr) return 'Present';
    const [year, month] = dateStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};

// Template variations
const generateMinimalPDF = async (resumeData) => {
    // Use the main generatePDF function for minimal style
    return generatePDF(resumeData);
};

const generateModernPDF = async (resumeData) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                margins: { top: 30, bottom: 30, left: 30, right: 30 }
            });
            
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);
            
            const { personalDetails, summary, workExperience, education, skills } = resumeData;
            
            // Modern template with sidebar effect using colors and layout
            const sidebarWidth = 180;
            const mainContentX = sidebarWidth + 40;
            
            // Sidebar background
            doc.rect(0, 0, sidebarWidth, doc.page.height).fill('#2c3e50');
            
            // Sidebar content
            doc.fillColor('#ffffff');
            doc.fontSize(20).font('Helvetica-Bold').text(personalDetails.fullName, 20, 50, {
                width: sidebarWidth - 40,
                align: 'center'
            });
            
            doc.moveDown(2);
            
            // Contact section in sidebar
            doc.fontSize(12).font('Helvetica-Bold').text('CONTACT', 20);
            doc.moveDown(0.5);
            doc.fontSize(9).font('Helvetica');
            doc.text(personalDetails.email, 20, doc.y, { width: sidebarWidth - 40 });
            doc.text(personalDetails.phone, 20, doc.y + 5, { width: sidebarWidth - 40 });
            if (personalDetails.address) {
                doc.text(personalDetails.address, 20, doc.y + 5, { width: sidebarWidth - 40 });
            }
            
            doc.moveDown(2);
            
            // Skills in sidebar
            doc.fontSize(12).font('Helvetica-Bold').text('SKILLS', 20);
            doc.moveDown(0.5);
            doc.fontSize(9).font('Helvetica');
            skills.forEach(skill => {
                doc.text(`• ${skill.skill}`, 20, doc.y + 5, { width: sidebarWidth - 40 });
            });
            
            // Main content area
            doc.fillColor('#000000');
            let currentY = 50;
            
            // Summary
            doc.fontSize(14).font('Helvetica-Bold').text('PROFESSIONAL SUMMARY', mainContentX, currentY);
            currentY += 25;
            doc.fontSize(11).font('Helvetica').text(summary, mainContentX, currentY, {
                width: 565 - mainContentX,
                align: 'justify'
            });
            currentY = doc.y + 30;
            
            // Work Experience
            doc.fontSize(14).font('Helvetica-Bold').text('WORK EXPERIENCE', mainContentX, currentY);
            currentY += 25;
            
            workExperience.forEach(exp => {
                doc.fontSize(12).font('Helvetica-Bold').text(exp.jobTitle, mainContentX, currentY);
                doc.fontSize(11).font('Helvetica-Oblique').text(exp.employer, mainContentX, currentY + 15);
                doc.fontSize(10).font('Helvetica').text(`${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`, mainContentX, currentY + 30);
                doc.fontSize(10).font('Helvetica').text(exp.description, mainContentX, currentY + 45, {
                    width: 565 - mainContentX,
                    align: 'justify'
                });
                currentY = doc.y + 20;
                
                if (currentY > 700) {
                    doc.addPage();
                    // Redraw sidebar on new page
                    doc.rect(0, 0, sidebarWidth, doc.page.height).fill('#2c3e50');
                    currentY = 50;
                }
            });
            
            // Education
            doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').text('EDUCATION', mainContentX, currentY);
            currentY += 25;
            
            education.forEach(edu => {
                doc.fontSize(12).font('Helvetica-Bold').text(edu.degree, mainContentX, currentY);
                doc.fontSize(11).font('Helvetica-Oblique').text(edu.school, mainContentX, currentY + 15);
                doc.fontSize(10).font('Helvetica').text(`${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`, mainContentX, currentY + 30);
                currentY += 50;
            });
            
            doc.end();
            
        } catch (error) {
            reject(error);
        }
    });
};

// Export function that handles template selection
const generatePDFByTemplate = async (resumeData) => {
    const { template } = resumeData;
    
    switch (template) {
        case 'modern':
            return generateModernPDF(resumeData);
        case 'minimal':
        case 'professional':
        case 'creative':
        default:
            return generatePDF(resumeData);
    }
};

module.exports = { generatePDF: generatePDFByTemplate };