const { UserFormData } = require("../Models/formdata");

const FillFormData = async (req, res) => {
    try {
        const { VendorType, VendorName, Location, Rating, Price } = req.body;
        
        const existingVendor = await UserFormData.findOne({ VendorType,VendorName, });
        if (existingVendor) {
            return res.status(400).json({
                message: "Vendor already exists",
                success: false
            });
        }

        const newVendor = new UserFormData({ VendorType, VendorName, Location, Rating, Price });
        await newVendor.save();

        return res.status(201).json({
            message: "Data Submitted successfully",
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

module.exports = {
    FillFormData
};
