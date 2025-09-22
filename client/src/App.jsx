import React ,{useState} from 'react';
import {useDropzone} from "react-dropzone";

export default function App(){
    const [file,setFile]=useState(null);
    const onDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0])
    }
    const {getRootProps,getInputProps,isDragActive} = useDropzone({ onDrop, accept: { "application/zip": [".zip"] }});
    const handleUpload=async()=>{
        if(!file){
            alert("Please upload a file");
        }
        const formData=new formData()
        formData.append("file",file);
        try{
            const res=await fetch("http://localhost:5000/upload",{
                method:"Post",
                body:formData
            })
            const data=await res.json();
            alert("File uploaded successfully",data);

        }catch(err){
            alert("Error uploading file",err);
        }
    }
    return(
            <div className='flex flex-col items-center justify-center h-screen bg-red-100'>
                <h1 className='text-3xl font-bold mb-6'>RTR</h1>
                <div
                {...getRootProps()}
                className={`border-4 border-dashed rounded-xl p-10 w-96 text-center cursor-pointer transition ${
                isDragActive ? "bg-blue-200 border-blue-500" : "bg-white border-gray-400"
                }`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                <p>Drop the project zip here...</p>
                ) : (
                <p>Click or drag & drop your React project (.zip)</p>
                )}
            </div>

            {file && (
                <div className="mt-4 text-center">
                <p className="mb-2">Selected File: {file.name}</p>
                <button
                    onClick={handleUpload}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Upload & Convert
                </button>
                </div>
            )}
    
        </div>
            
    )        
}
