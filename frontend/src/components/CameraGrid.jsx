import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faExclamationTriangle, faExpand, faMapMarkerAlt, faDoorOpen, faEdit, faTrash, faTimes, faSave } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

// Dummy camera to show when camera is not available
const DummyCamera = ({ cameraId, position, location, locality, onEdit, onDelete }) => {
    const navigate = useNavigate();

    const handleCardClick = (e) => {
        if (!e.target.closest('.action-buttons')) {
            navigate(`/camera/${cameraId}`);
        }
    };

    return (
        <div
            className="relative bg-[#4A4A4A] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300 group"
            onClick={handleCardClick}
        >
            {/* Camera Header */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-3 z-10">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faVideo} className="text-gray-400" />
                            <span className="text-white font-medium">Camera #{cameraId}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 text-gray-300 text-xs ml-5">
                            <div className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faDoorOpen} className="text-xs" />
                                <span>{position}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs" />
                                <span>{location}</span>
                            </div>
                            {locality && (
                                <div className="flex items-center gap-1">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs text-purple-400" />
                                    <span className="text-purple-300">{locality}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-red-600/80 px-2 py-1 rounded">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-white text-xs" />
                        <span className="text-white text-xs">Offline</span>
                    </div>
                </div>
            </div>

            {/* Dummy Content */}
            <div className="w-full h-64 flex flex-col items-center justify-center">
                <FontAwesomeIcon icon={faVideo} className="text-gray-600 text-6xl mb-4" />
                <p className="text-gray-500 text-lg">Camera Unavailable</p>
                <p className="text-gray-600 text-sm mt-2">Click to view details</p>
            </div>

            {/* Action Buttons (visible on hover) */}
            <div className="action-buttons absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                    }}
                    className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-all shadow-lg"
                    title="Edit Camera"
                >
                    <FontAwesomeIcon icon={faEdit} className="text-white" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-all shadow-lg"
                    title="Delete Camera"
                >
                    <FontAwesomeIcon icon={faTrash} className="text-white" />
                </button>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
                    <FontAwesomeIcon icon={faExpand} className="text-white text-2xl" />
                </div>
            </div>
        </div>
    );
};

DummyCamera.propTypes = {
    cameraId: PropTypes.number.isRequired,
    position: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    locality: PropTypes.string,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

// Live camera feed component
const LiveCamera = ({ cameraId, position, location, locality, videoFeedUrl, isEnabled, onToggle, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);

    const handleCardClick = (e) => {
        // Only navigate if not clicking the toggle switch or action buttons
        if (!e.target.closest('.toggle-switch') && !e.target.closest('.action-buttons')) {
            navigate(`/camera/${cameraId}`);
        }
    };

    return (
        <div
            className="relative bg-[#4A4A4A] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300 group"
            onClick={handleCardClick}
        >
            {/* Camera Header */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-3 z-10">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faVideo} className={isEnabled ? "text-green-400" : "text-gray-400"} />
                            <span className="text-white font-medium">Camera #{cameraId}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 text-gray-300 text-xs ml-5">
                            <div className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faDoorOpen} className="text-xs" />
                                <span>{position}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs" />
                                <span>{location}</span>
                            </div>
                            {locality && (
                                <div className="flex items-center gap-1">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs text-purple-400" />
                                    <span className="text-purple-300">{locality}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Toggle Switch */}
                    <div className="toggle-switch flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isEnabled}
                                onChange={() => onToggle(cameraId)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Video Feed or Disabled State */}
            {isEnabled ? (
                imageError ? (
                    <div className="w-full h-64 flex flex-col items-center justify-center bg-[#3A3A3A]">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-6xl mb-4" />
                        <p className="text-gray-400 text-lg">Feed Error</p>
                    </div>
                ) : (
                    <img
                        src={videoFeedUrl}
                        alt={`Camera ${cameraId} Feed`}
                        className="w-full h-64 object-cover"
                        onError={() => setImageError(true)}
                    />
                )
            ) : (
                <div className="w-full h-64 flex flex-col items-center justify-center bg-[#3A3A3A]">
                    <FontAwesomeIcon icon={faVideo} className="text-gray-600 text-6xl mb-4" />
                    <p className="text-gray-400 text-lg">Camera Disabled</p>
                    <p className="text-gray-500 text-sm mt-2">Turn on to view feed</p>
                </div>
            )}

            {/* Action Buttons (visible on hover) */}
            <div className="action-buttons absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                    }}
                    className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-all shadow-lg"
                    title="Edit Camera"
                >
                    <FontAwesomeIcon icon={faEdit} className="text-white" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-all shadow-lg"
                    title="Delete Camera"
                >
                    <FontAwesomeIcon icon={faTrash} className="text-white" />
                </button>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
                    <FontAwesomeIcon icon={faExpand} className="text-white text-2xl" />
                </div>
            </div>
        </div>
    );
};

LiveCamera.propTypes = {
    cameraId: PropTypes.number.isRequired,
    position: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    locality: PropTypes.string,
    videoFeedUrl: PropTypes.string.isRequired,
    isEnabled: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

// Camera Modal for Add/Edit
const CameraModal = ({ camera, onSave, onClose, title }) => {
    const [formData, setFormData] = useState(camera || {
        id: Date.now(),
        position: "",
        location: "",
        locality: "",
        model: "",
        lat: 28.6139,
        lng: 77.209,
        url: "http://localhost:5000/video_feed",
        isOnline: false,
        isEnabled: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#2C2C2C] rounded-xl p-6 max-w-md w-full shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">
                            Camera ID
                        </label>
                        <input
                            type="number"
                            value={formData.id}
                            onChange={(e) => setFormData({ ...formData, id: parseInt(e.target.value) })}
                            className="w-full bg-[#3A3A3A] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                            required
                            disabled={!!camera}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">
                            Position
                        </label>
                        <input
                            type="text"
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            placeholder="e.g., Main Entrance"
                            className="w-full bg-[#3A3A3A] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">
                            Location (Area)
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="e.g., Rohini"
                            className="w-full bg-[#3A3A3A] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">
                            Locality / Building
                        </label>
                        <input
                            type="text"
                            value={formData.locality}
                            onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                            placeholder="e.g., Sector 10, Mall Complex"
                            className="w-full bg-[#3A3A3A] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">
                            Camera Model
                        </label>
                        <input
                            type="text"
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            placeholder="e.g., Hikvision DS-2CD2043G0-I"
                            className="w-full bg-[#3A3A3A] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-2">
                                Latitude
                            </label>
                            <input
                                type="number"
                                step="0.0001"
                                value={formData.lat}
                                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                                className="w-full bg-[#3A3A3A] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-2">
                                Longitude
                            </label>
                            <input
                                type="number"
                                step="0.0001"
                                value={formData.lng}
                                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                                className="w-full bg-[#3A3A3A] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-gray-300">
                            <input
                                type="checkbox"
                                checked={formData.isOnline}
                                onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
                                className="w-4 h-4 rounded"
                            />
                            <span>Camera Online</span>
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <FontAwesomeIcon icon={faSave} />
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

CameraModal.propTypes = {
    camera: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ camera, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#2C2C2C] rounded-xl p-6 max-w-md w-full shadow-2xl">
                <div className="text-center">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-5xl mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Delete Camera</h2>
                    <p className="text-gray-300 mb-1">
                        Are you sure you want to delete <strong>Camera #{camera.id}</strong>?
                    </p>
                    <p className="text-gray-400 text-sm mb-6">
                        {camera.position} - {camera.location}
                    </p>
                    <p className="text-red-400 text-sm mb-6">
                        This action cannot be undone.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

DeleteConfirmModal.propTypes = {
    camera: PropTypes.object.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

// Main CameraGrid component
const CameraGrid = ({ selectedLocation = "All", selectedLocality = "All", cameras, setCameras, setShowAddModal }) => {
    const [editingCamera, setEditingCamera] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [cameraToDelete, setCameraToDelete] = useState(null);

    // Toggle camera enabled/disabled
    const toggleCamera = (cameraId) => {
        setCameras(prevCameras =>
            prevCameras.map(camera =>
                camera.id === cameraId
                    ? { ...camera, isEnabled: !camera.isEnabled }
                    : camera
            )
        );
    };

    // Open edit modal
    const handleEdit = (camera) => {
        setEditingCamera(camera);
        setShowEditModal(true);
    };

    // Handle edit save
    const handleSaveEdit = (updatedCamera) => {
        setCameras(prevCameras =>
            prevCameras.map(cam =>
                cam.id === updatedCamera.id ? updatedCamera : cam
            )
        );
        setShowEditModal(false);
        setEditingCamera(null);
    };

    // Confirm delete
    const confirmDelete = (camera) => {
        setCameraToDelete(camera);
        setShowDeleteModal(true);
    };

    // Handle delete
    const handleDelete = () => {
        setCameras(prevCameras =>
            prevCameras.filter(cam => cam.id !== cameraToDelete.id)
        );
        setShowDeleteModal(false);
        setCameraToDelete(null);
    };

    // Filter cameras based on selected location and locality
    const filteredCameras = cameras.filter((camera) => {
        const locationMatch = selectedLocation === "All" || camera.location === selectedLocation;
        const localityMatch = selectedLocality === "All" || camera.locality === selectedLocality;
        return locationMatch && localityMatch;
    });

    const enabledCameras = filteredCameras.filter(cam => cam.isEnabled).length;

    return (
        <div className="w-full">
            {/* Header Stats */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faVideo} className="text-green-400" />
                        <span className="text-lg font-medium">
                            {enabledCameras} / {filteredCameras.length} Cameras Enabled
                            {selectedLocation !== "All" && ` in ${selectedLocation}`}
                            {selectedLocality !== "All" && ` - ${selectedLocality}`}
                        </span>
                    </div>
                </div>
            </div>

            {/* Camera Grid */}
            {filteredCameras.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCameras.map((camera) => (
                        camera.isOnline ? (
                            <LiveCamera
                                key={camera.id}
                                cameraId={camera.id}
                                position={camera.position}
                                location={camera.location}
                                locality={camera.locality}
                                videoFeedUrl={camera.url}
                                isEnabled={camera.isEnabled}
                                onToggle={toggleCamera}
                                onEdit={() => handleEdit(camera)}
                                onDelete={() => confirmDelete(camera)}
                            />
                        ) : (
                            <DummyCamera
                                key={camera.id}
                                cameraId={camera.id}
                                position={camera.position}
                                location={camera.location}
                                locality={camera.locality}
                                onEdit={() => handleEdit(camera)}
                                onDelete={() => confirmDelete(camera)}
                            />
                        )
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-400">
                    <FontAwesomeIcon icon={faVideo} className="text-6xl mb-4" />
                    <p className="text-xl">
                        No cameras found
                        {selectedLocation !== "All" && ` in ${selectedLocation}`}
                        {selectedLocality !== "All" && ` - ${selectedLocality}`}
                    </p>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editingCamera && (
                <CameraModal
                    camera={editingCamera}
                    onSave={handleSaveEdit}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingCamera(null);
                    }}
                    title="Edit Camera"
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && cameraToDelete && (
                <DeleteConfirmModal
                    camera={cameraToDelete}
                    onConfirm={handleDelete}
                    onCancel={() => {
                        setShowDeleteModal(false);
                        setCameraToDelete(null);
                    }}
                />
            )}
        </div>
    );
};

CameraGrid.propTypes = {
    selectedLocation: PropTypes.string,
    selectedLocality: PropTypes.string,
    cameras: PropTypes.array.isRequired,
    setCameras: PropTypes.func.isRequired,
    setShowAddModal: PropTypes.func.isRequired,
};

export default CameraGrid;
