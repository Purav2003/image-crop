import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import Cropper from 'react-easy-crop';
import 'tailwindcss/tailwind.css'; // Ensure Tailwind CSS is imported

const CropImage = () => {
    const [aspectRatio, setAspectRatio] = useState(1);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [fileName, setFileName] = useState('');
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [image, setImage] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [base64Image, setBase64Image] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedImage = localStorage.getItem('uploadedImage');
        if (storedImage) {
            setImage(storedImage);
            setFileList([
                {
                    file1: [{ thumbUrl: storedImage }],
                    file2: [{ thumbUrl: storedImage }],
                    file3: [{ thumbUrl: storedImage }],
                    file: [{ thumbUrl: storedImage }],
                }
            ]);
        } else {
            console.error("No image found in localStorage.");
        }
    }, []);

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
        setFileName(aspectRatio === 1 ? "file1" : aspectRatio === 1.91 ? "file2" : "file3");

        const img = new Image();
        img.src = image;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const scaleX = img.naturalWidth / img.width;
            const scaleY = img.naturalHeight / img.height;

            let canvasWidth, canvasHeight;

            switch (aspectRatio) {
                case 1.91:
                    canvasWidth = 600;
                    canvasHeight = 314;
                    break;
                case 9 / 16:
                    canvasWidth = 1080;
                    canvasHeight = 1920;
                    break;
                case 1:
                    canvasWidth = Math.max(300, img.width);
                    canvasHeight = Math.max(300, img.height);
                    break;
                default:
                    canvasWidth = 300;
                    canvasHeight = 300;
            }

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(
                img,
                croppedAreaPixels.x * scaleX,
                croppedAreaPixels.y * scaleY,
                croppedAreaPixels.width * scaleX,
                croppedAreaPixels.height * scaleY,
                0,
                0,
                canvasWidth,
                canvasHeight
            );
            setBase64Image(canvas.toDataURL('image/jpeg'));
        };
    };

    const handleSubmitImage = () => {
        if (fileName && croppedAreaPixels) {
            const updatedFileList = fileList.map(file => ({
                ...file,
                [fileName]: [
                    {
                        ...file[fileName][0],
                        thumbUrl: base64Image,
                    }
                ],
            }));
            setFileList(updatedFileList);
        } else {
            console.error("File name or cropped area pixels are missing.");
        }
    };

    const saveChanges = async () => {
        if (!fileList.length) {
            console.error("No files to save.");
            return;
        }

        setLoading(true);

        for (const file of fileList) {
            for (const key of Object.keys(file)) {
                if (key.startsWith('file') && key !== 'file') {
                    const aspectRatioFile = file[key][0];
                    const base64String = aspectRatioFile.thumbUrl.split(',')[1];
                    const byteCharacters = atob(base64String);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: 'image/png' });
                    const fileName = aspectRatioFile?.originFileObj?.name || 'image.png';
                    const file_upload = new File([blob], fileName, { type: 'image/png' });
                    console.log(file_upload)
                    // Handle file_upload here, e.g., uploading to a server
                }
            }
        }

        setLoading(false);
    };

    const handlePreviewClick = (file, aspectRatio) => {
        setZoom(1);
        setImage(file?.thumbUrl);
        setAspectRatio(aspectRatio);
    };

    return (
        <div className="relative p-6 bg-gray-50 border border-gray-300 rounded-lg shadow-lg">
            <div className="mb-6">
                {fileList.length > 0 && (
                    <>
                        <div className="mb-4">
                            <span className="text-lg font-semibold text-indigo-600">
                                <span className="text-red-500">*</span> Crop image as per the ratio
                            </span><br />
                            <span className="text-sm text-gray-600">
                                Please crop the image in all the respected sizes given below
                            </span>
                        </div>
                        <div className="flex space-x-6">
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-medium text-gray-700">Ratio - 1:1</span>
                                <img
                                    src={fileList[0]?.file1[0]?.thumbUrl}
                                    alt="1"
                                    className="w-32 h-32 object-cover rounded border-2 border-blue-500 cursor-pointer mt-2"
                                    onClick={() => handlePreviewClick(fileList[0].file[0], 1 / 1)}
                                />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-medium text-gray-700">Ratio - 1.91:1</span>
                                <img
                                    src={fileList[0]?.file2[0]?.thumbUrl}
                                    alt="2"
                                    className="w-48 h-32 object-cover rounded border-2 border-green-500 cursor-pointer mt-2"
                                    onClick={() => handlePreviewClick(fileList[0].file[0], 1.91)}
                                />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-medium text-gray-700">Ratio - 9:16</span>
                                <img
                                    src={fileList[0]?.file3[0]?.thumbUrl}
                                    alt="3"
                                    className="w-24 h-40 object-cover rounded border-2 border-red-500 cursor-pointer mt-2"
                                    onClick={() => handlePreviewClick(fileList[0].file[0], 9 / 16)}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
            {image && (
                <div className="relative w-full h-80 border border-gray-300 rounded-lg overflow-hidden">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        imageStyle={{ width: '100%', height: '100%' }}
                    />
                </div>
            )}
            {image && (
                <>
                    <div className="mt-4">
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="w-full accent-indigo-500"
                        />
                    </div>
                    <button onClick={handleSubmitImage} className="mt-4 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700">
                        Save Changes
                    </button>
                </>
            )}
            <div className="flex justify-end mt-6 space-x-4">
                <button className="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600" onClick={saveChanges}>
                    {loading ? <Spin /> : "Upload"}
                </button>
            </div>
        </div>
    );
};

export default CropImage;
