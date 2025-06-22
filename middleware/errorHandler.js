const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    // Default error
    let error = { ...err };
    error.message = err.message;
    
    // Validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = {
            statusCode: 400,
            message: message.join(', ')
        };
    }
    
    // Cast error
    if (err.name === 'CastError') {
        const message = 'Invalid data format';
        error = {
            statusCode: 400,
            message
        };
    }
    
    // Duplicate key error
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = {
            statusCode: 400,
            message
        };
    }
    
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = { errorHandler };