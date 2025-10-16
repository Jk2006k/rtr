import React, { useState } from 'react'

export default function App() {
  const [file, setFile] = useState(null)
  const [extractPath, setExtractPath] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [downloadLink, setDownloadLink] = useState('')
  const [status, setStatus] = useState('')
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      setFile(droppedFiles[0])
      resetState()
    }
  }

  const handleFileSelect = (e) => {
    const selectedFiles = e.target.files
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0])
      resetState()
    }
  }

  const resetState = () => {
    setUploadSuccess(false)
    setExtractPath('')
    setDownloadLink('')
    setStatus('')
  }

  const handleUpload = async (selectedFile) => {
    const uploadFile = selectedFile || file
    if (!uploadFile) return alert('Please upload a file')

    const formData = new FormData()
    formData.append('file', uploadFile)

    try {
      setStatus('Uploading...')
      const res = await fetch('https://rtr-us34.onrender.com/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('Upload failed ❌')
        alert('Upload failed: ' + data.message)
      } else {
        setUploadSuccess(true)
        setExtractPath(data.extractPath)
        setStatus('Upload successful ✅')
        alert('File uploaded successfully')
      }
    } catch (err) {
      setStatus('Error uploading file ❌')
      console.error(err)
    }
  }

  const handleConvert = async () => {
    if (!extractPath) return alert('Please upload and extract first')

    try {
      setStatus('Converting...')
      const res = await fetch('https://rtr-us34.onrender.com/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ extractPath }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.message)

      const zipPath = data.zipPath || data.downloadUrl
      if (!zipPath) throw new Error('Zip path missing in response')

      const fullUrl = zipPath.startsWith('http')
        ? zipPath
        : `https://rtr-us34.onrender.com${zipPath}`

      setDownloadLink(fullUrl)
      setStatus('Conversion completed ✅')
      alert('Conversion completed successfully!')
    } catch (err) {
      setStatus('Conversion failed ❌')
      console.error(err)
    }
  }

  const handleDownload = () => {
    if (!downloadLink) return
    const a = document.createElement('a')
    a.href = downloadLink
    a.download = 'ConvertedReactNativeApp.zip'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleTestFile = async () => {
    try {
      setStatus('Loading test React app...')
      const response = await fetch('https://rtr-us34.onrender.com/test-react-app.zip')
      if (!response.ok) throw new Error('Test file not found')

      const blob = await response.blob()
      const testFile = new File([blob], 'test-react-app.zip', { type: 'application/zip' })
      setFile(testFile)
      setStatus('Test file loaded ✅')
      await handleUpload(testFile)
    } catch (err) {
      setStatus('Failed to load test file ❌')
      console.error('Failed to load test file:', err)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-6'>
      <div className='text-center mb-12 animate-fade-in'>
        <h1 className='text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3'>
          RTR
        </h1>
        <p className='text-xl text-gray-600 font-semibold mb-2'>React to React Native</p>
        <p className='text-sm text-gray-500 max-w-md mx-auto'>
          Transform your web React applications into native mobile apps in seconds
        </p>
      </div>

      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
        className={`border-4 border-dashed rounded-3xl p-16 w-full max-w-2xl text-center cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-2xl ${
          isDragActive 
            ? 'bg-blue-100 border-blue-500 scale-105' 
            : 'bg-white border-gray-300 hover:border-blue-400'
        }`}
      >
        <input
          id="fileInput"
          type="file"
          accept=".zip"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className='flex flex-col items-center justify-center'>
          <svg className={`w-20 h-20 mb-6 transition-colors ${isDragActive ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          {isDragActive ? (
            <p className='text-2xl font-semibold text-blue-600'>Drop your project here! 🚀</p>
          ) : (
            <div>
              <p className='text-2xl font-semibold text-gray-700 mb-3'>
                Drag & drop your React project
              </p>
              <p className='text-base text-gray-500 mb-4'>or click to browse</p>
              <span className='inline-block px-5 py-2 bg-gray-50 text-gray-500 text-sm rounded-full border border-gray-200'>
                Accepts .zip files only
              </span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleTestFile}
        className='mt-8 px-8 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1'
      >
        📦 Try with Sample App
      </button>

      {file && (
        <div className='mt-10 bg-white rounded-2xl p-8 shadow-2xl w-full max-w-2xl border border-gray-100 animate-slide-up'>
          <div className='mb-6'>
            <p className='text-sm text-gray-500 mb-1'>Selected File</p>
            <p className='text-xl font-bold text-gray-800'>{file.name}</p>
          </div>
          {!uploadSuccess ? (
            <button
              onClick={() => handleUpload()}
              className='w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1'
            >
              Upload Project
            </button>
          ) : (
            <button className='w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-2' disabled>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Uploaded Successfully
            </button>
          )}
        </div>
      )}

      {uploadSuccess && !downloadLink && (
        <div className='mt-6 w-full max-w-2xl animate-slide-up'>
          <button
            onClick={handleConvert}
            className='w-full px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center justify-center gap-3'
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Convert to React Native
          </button>
        </div>
      )}

      {downloadLink && (
        <div className='mt-6 w-full max-w-2xl animate-slide-up'>
          <button
            onClick={handleDownload}
            className='flex items-center justify-center gap-3 w-full px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1'
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Converted Project
          </button>
        </div>
      )}

      {status && (
        <div className='mt-8 px-8 py-4 bg-blue-50 border-2 border-blue-200 rounded-2xl shadow-lg animate-slide-up'>
          <p className='text-blue-800 font-semibold text-center text-lg'>{status}</p>
        </div>
      )}

      <div className='mt-16 text-center text-gray-400 text-sm'>
        <p>Seamlessly bridge web and mobile development</p>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.4s ease-out; }
      `}</style>
    </div>
  )
}
