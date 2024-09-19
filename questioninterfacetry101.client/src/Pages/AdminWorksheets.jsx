import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Edit, Trash2, FileJson, Plus } from 'lucide-react'

const getToken = () => {
    return sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken')
}

const truncateTitle = (title, maxLength) => {
    if (title.length <= maxLength) return title
    return title.slice(0, maxLength) + '...'
}

function AdminWorksheets() {
    const [worksheets, setWorksheets] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetchWorksheets()
    }, [])

    const fetchWorksheets = async () => {
        setLoading(true)
        setError(null)
        try {
            const token = getToken()

            if (!token) {
                throw new Error('No JWT token found.')
            }

            console.log('Fetching worksheets...')
            const response = await axios.get('https://localhost:7226/api/Worksheet', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!Array.isArray(response.data)) {
                throw new Error('API response is not an array')
            }

            setWorksheets(response.data)
        } catch (error) {
            console.error('Error fetching worksheets:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (id) => {
        navigate(`/Subject/WorksheetList/${id}`)
    }

    const handleDelete = async (id) => {
        try {
            const token = getToken()
            if (!token) {
                throw new Error('No JWT token found.')
            }
            await axios.delete(`https://localhost:7226/api/Worksheet/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setWorksheets(worksheets.filter(worksheet => worksheet.worksheetId !== id))
        } catch (error) {
            console.error('Error deleting worksheet:', error)
            setError(error.message)
        }
    }

    const handleGetJson = async (id) => {
        try {
            const token = getToken()
            if (!token) {
                throw new Error('No JWT token found.')
            }
            const response = await axios.get(`https://localhost:7226/api/Worksheet/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            console.log(JSON.stringify(response.data, null, 2))
        } catch (error) {
            console.error('Error fetching worksheet JSON:', error)
            setError(error.message)
        }
    }

    const filteredWorksheets = worksheets.filter(worksheet => {
        const title = worksheet.title && worksheet.title.text ? worksheet.title.text : ''
        return title.toLowerCase().includes(searchTerm.toLowerCase())
    })

    if (loading) {
        return <div className="min-h-screen bg-gray-900 text-gray-100 p-8 flex items-center justify-center">Loading...</div>
    }

    if (error) {
        return <div className="min-h-screen bg-gray-900 text-gray-100 p-8 flex items-center justify-center">Error: {error}</div>
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Admin Worksheets</h2>
                <div className="mb-4 flex justify-between items-center">
                    <input
                        type="text"
                        placeholder="Search worksheets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={() => navigate('/Subject/WorksheetList/New')}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md flex items-center"
                    >
                        <Plus className="mr-2" size={16} />
                        Create New Worksheet
                    </button>
                </div>
                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-700">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Questions</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created At</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredWorksheets.length > 0 ? (
                                filteredWorksheets.map((worksheet) => (
                                    <tr key={worksheet.worksheetId} className="hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">{worksheet.worksheetId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {worksheet.title && worksheet.title.text
                                                ? truncateTitle(worksheet.title.text, 30)
                                                : 'Untitled'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{worksheet.qus ? worksheet.qus.length : 0}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(worksheet.createdAt).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(worksheet.worksheetId)}
                                                className="text-blue-500 hover:text-blue-600 mr-2"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(worksheet.worksheetId)}
                                                className="text-red-500 hover:text-red-600 mr-2"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleGetJson(worksheet.worksheetId)}
                                                className="text-green-500 hover:text-green-600"
                                            >
                                                <FileJson size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-400">No worksheets available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminWorksheets