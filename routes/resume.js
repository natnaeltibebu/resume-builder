const express = require('express');
const router = express.Router();
const { validateResumeData } = require('../middleware/validation');
const { generatePDF } = require('../services/pdfGenerator');
const { cleanupTempFiles } = require('../utils/fileUtils');

// Generate and download resume PDF
router.post('/generate-pdf', validateResumeData, async (req, res) => {
    try {
        const resumeData = req.body;
        
        // Generate PDF
        const pdfBuffer = await generatePDF(resumeData);
        
        // Set response headers for file download
        const filename = `${resumeData.personalDetails.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        
        // Send the PDF
        res.send(pdfBuffer);
        
        // Cleanup any temporary files (if needed)
        await cleanupTempFiles();
        
    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({
            error: 'PDF Generation Failed',
            message: 'Unable to generate your resume PDF. Please try again.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Preview resume data (for debugging)
router.post('/preview', validateResumeData, (req, res) => {
    try {
        const resumeData = req.body;
        res.json({
            message: 'Resume data received successfully',
            data: resumeData,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(400).json({
            error: 'Invalid resume data',
            message: error.message
        });
    }
});

// Get resume templates list
router.get('/templates', (req, res) => {
    const templates = [
        {
            id: 'minimal',
            name: 'Minimal',
            description: 'Clean and simple design perfect for any industry'
        },
        {
            id: 'modern',
            name: 'Modern',
            description: 'Contemporary layout with sidebar for skills and contact info'
        },
        {
            id: 'professional',
            name: 'Professional',
            description: 'Traditional format ideal for corporate positions'
        },
        {
            id: 'creative',
            name: 'Creative',
            description: 'Eye-catching design for creative professionals'
        }
    ];
    
    res.json({ templates });
});

module.exports = router;