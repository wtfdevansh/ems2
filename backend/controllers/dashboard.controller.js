const User = require("../models/user.model")
const path = require('path');
const fs = require('fs');

const user = async (req , res) =>{


    try{

       const email = req.params.email
       console.log(email)
       const foundUser  = await User.findOne({"email" : email})

       if(!foundUser){
         return res.status(404).json({ message: 'User not found' })
       }

       return res.status(200).json({ data: foundUser })

    }catch(error){

        console.log(error)

        return res.status(400).json({ message: 'Failed to fetch user', error: error?.message || error })

    }

}


const editUser = async (req, res) => {
    try {
      
        const email = req.params.email;
        const updateData = req.body;
        
       
        delete updateData.projects;
        delete updateData.department;
        delete updateData.role;
        delete updateData.canAccess;
        delete updateData.createdAt;
        delete updateData._id;
        delete updateData.__v;
        
        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        return res.status(200).json({ 
            message: 'User updated successfully', 
            data: updatedUser 
        });
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ 
            message: 'Failed to update user', 
            error: error?.message || error 
        });
    }
};

const uploadProfilePhoto = async (req, res) => {
    try {
        const email = req.params.email;
        
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No file uploaded' 
            });
        }

        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            // Delete the uploaded file if user not found
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Delete old profile photo if exists
        if (user.profilePhoto) {
            const oldPhotoPath = path.join(__dirname, '../uploads', path.basename(user.profilePhoto));
            if (fs.existsSync(oldPhotoPath)) {
                fs.unlinkSync(oldPhotoPath);
            }
        }

        // Update user with new profile photo path
        const profilePhotoPath = `/uploads/${req.file.filename}`;
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { profilePhoto: profilePhotoPath },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile photo uploaded successfully',
            data: updatedUser
        });

    } catch (error) {
        console.log(error);
        
        // Delete the uploaded file if there's an error
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to upload profile photo',
            error: error?.message || error
        });
    }
};

const getProfilePhoto = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email });
        
        if (!user || !user.profilePhoto) {
            return res.status(404).json({ 
                success: false, 
                message: 'Profile photo not found' 
            });
        }

        const photoPath = path.join(__dirname, '../uploads', path.basename(user.profilePhoto));
        
        if (!fs.existsSync(photoPath)) {
            return res.status(404).json({ 
                success: false, 
                message: 'Profile photo file not found' 
            });
        }

        res.sendFile(photoPath);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile photo',
            error: error?.message || error
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const { search, role, project, canAccess } = req.query;
        
        // Build filter object
        let filter = {};
        
        // Search by name (firstname or lastname)
        if (search) {
            filter.$or = [
                { firstname: { $regex: search, $options: 'i' } },
                { lastname: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Filter by role
        if (role && role !== 'all') {
            filter.role = role;
        }
        
        // Filter by project
        if (project && project !== 'all') {
            filter.project = project;
        }
        
        // Filter by access status
        if (canAccess !== undefined) {
            filter.canAccess = canAccess === 'true';
        }
        
        const users = await User.find(filter)
            .select('-password') // Exclude password from response
            .sort({ createdAt: -1 }); // Sort by newest first
        
        res.status(200).json({
            success: true,
            data: users,
            count: users.length
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error?.message || error
        });
    }
};

const updateUserRoleAndProject = async (req, res) => {
    try {
        const { email } = req.params;
        const { role, project } = req.body;
        
        if (!role && !project) {
            return res.status(400).json({
                success: false,
                message: 'At least one field (role or project) must be provided'
            });
        }
        
        const updateData = {};
        if (role) updateData.role = role;
        if (project) updateData.project = project;
        
        const updatedUser = await User.findOneAndUpdate(
            { email },
            updateData,
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user',
            error: error?.message || error
        });
    }
};

const updateUserAccess = async (req, res) => {
    try {
        const { email } = req.params;
        const { canAccess } = req.body;
        
        if (typeof canAccess !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'canAccess must be a boolean value'
            });
        }
        
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { canAccess },
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: `User access ${canAccess ? 'granted' : 'revoked'} successfully`,
            data: updatedUser
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user access',
            error: error?.message || error
        });
    }
};

const getAccessRequests = async (req, res) => {
    try {
        const users = await User.find({ canAccess: false })
            .select('-password')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: users,
            count: users.length
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch access requests',
            error: error?.message || error
        });
    }
};

const admin = (req , res) =>{

}

module.exports = {
    user, 
    admin, 
    editUser, 
    uploadProfilePhoto, 
    getProfilePhoto,
    getAllUsers,
    updateUserRoleAndProject,
    updateUserAccess,
    getAccessRequests
}