const Joi = require('joi');

const resumeSchema = Joi.object({
    template: Joi.string().valid('minimal', 'modern', 'professional', 'creative').required(),
    personalDetails: Joi.object({
        fullName: Joi.string().min(2).max(100).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().min(10).max(20).required(),
        website: Joi.string().uri().allow('').optional(),
        address: Joi.string().max(200).allow('').optional()
    }).required(),
    summary: Joi.string().min(50).max(1000).required(),
    workExperience: Joi.array().items(
        Joi.object({
            jobTitle: Joi.string().min(2).max(100).required(),
            employer: Joi.string().min(2).max(100).required(),
            location: Joi.string().max(100).allow('').optional(),
            startDate: Joi.string().pattern(/^\d{4}-\d{2}$/).required(),
            endDate: Joi.string().pattern(/^\d{4}-\d{2}$/).allow('').optional(),
            description: Joi.string().min(10).max(2000).required()
        })
    ).min(1).required(),
    education: Joi.array().items(
        Joi.object({
            school: Joi.string().min(2).max(100).required(),
            degree: Joi.string().min(2).max(100).required(),
            location: Joi.string().max(100).allow('').optional(),
            startDate: Joi.string().pattern(/^\d{4}-\d{2}$/).required(),
            endDate: Joi.string().pattern(/^\d{4}-\d{2}$/).allow('').optional()
        })
    ).min(1).required(),
    skills: Joi.array().items(
        Joi.object({
            skill: Joi.string().min(2).max(50).required()
        })
    ).min(1).required()
});

const validateResumeData = (req, res, next) => {
    const { error, value } = resumeSchema.validate(req.body, { 
        abortEarly: false,
        stripUnknown: true
    });
    
    if (error) {
        const validationErrors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Please check the following fields:',
            validationErrors
        });
    }
    
    req.body = value;
    next();
};

module.exports = { validateResumeData };