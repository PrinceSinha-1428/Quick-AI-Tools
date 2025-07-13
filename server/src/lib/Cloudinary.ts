import {v2 as cloudinary} from 'cloudinary';
import { CloudinaryApiKey, CloudinaryName, CloudinarySecretKey } from './enviromentConfig';

const connectCloudinary = async () => {
    cloudinary.config({
        cloud_name: CloudinaryName,
        api_key: CloudinaryApiKey,
        api_secret: CloudinarySecretKey
    })
}

export default connectCloudinary;