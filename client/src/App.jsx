import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'

export default function App() {
  const [file, setFile] = useState(null)
  const [extractPath, setExtractPath] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [downloadLink, setDownloadLink] = useState('')

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0])
    setUploadSuccess(false)
    setExtractPath('')
    setDownloadLink('')
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/zip': ['.zip'] },
  })

  const handleUpload = async () => {
    if (!file) return alert('Please upload a file')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) {
        alert('Upload failed: ' + data.message)
      } else {
        setUploadSuccess(true)
        setExtractPath(data.extractPath)
        alert('File uploaded successfully')
      }
    } catch (err) {
      alert('Error uploading file')
      console.error(err)
    }
  }

  const handleConvert = async () => {
    if (!extractPath) return alert('Please upload and extract first')

    try {
      const res = await fetch('http://localhost:3000/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ extractPath }),
      })
      const data = await res.json()
      setDownloadLink(`http://localhost:3000/${data.zipPath}`)
      alert('Conversion Completed')
    } catch (err) {
      alert('Conversion Failed')
      console.error(err)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-red-100'>
      <h1 className='text-3xl font-bold mb-6'>RTR - React to React Native</h1>

      <div
        {...getRootProps()}
        className={`border-4 border-dashed rounded-xl p-10 w-96 text-center cursor-pointer transition ${
          isDragActive ? 'bg-blue-200 border-blue-500' : 'bg-white border-gray-400'
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
        <div className='mt-4 text-center'>
          <p className='mb-2'>Selected File: {file.name}</p>
          {!uploadSuccess ? (
            <button
              onClick={handleUpload}
              className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
            >
              Upload
            </button>
          ) : (
            <button className='px-4 py-2 bg-green-500 text-white rounded-lg' disabled>
              Uploaded Successfully
            </button>
          )}
        </div>
      )}

      {uploadSuccess && (
        <div className='mt-4'>
          <button
            onClick={handleConvert}
            className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600'
          >
            Convert to React Native
          </button>
        </div>
      )}

      {downloadLink && (
        <div className='mt-4'>
          <a href={downloadLink} className='text-blue-700 underline' download>
            Download Converted Project
          </a>
        </div>
      )}
    </div>
  )
}
