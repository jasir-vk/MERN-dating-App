import React, { useContext, useEffect, useState } from "react";
import styles from "./Received.module.css";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import ConfirmationModal from "../../Components/ConfirmationModal/ConfirmationModal";
import Toast from "../../Components/Toast/Toast";
import SkeletonLoader from "../../Components/SkeletonLoader/SkeletonLoader";
import EmptyState from "../../Components/EmptyState/EmptyState";
import { AcceptRequest, RejectRequest, getReceivedRequest } from "../../Services/ReceivedRequestAPI";
import { ModalContext } from "../../StateManagement/ModalContext";

const Received = () => {
    const { setPageName } = useContext(ModalContext);
    const [receivedRequests, setReceivedRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingActions, setLoadingActions] = useState({})
    const [animatingCards, setAnimatingCards] = useState({})
    const [confirmModal, setConfirmModal] = useState({ show: false, type: '', senderId: null, senderName: '' })
    const [toast, setToast] = useState({ show: false, message: '', type: '' })

    const showConfirmation = (type, senderId, senderName) => {
        setConfirmModal({ show: true, type, senderId, senderName })
    }

    const handleConfirmAction = async () => {
        const { type, senderId } = confirmModal
        setConfirmModal({ show: false, type: '', senderId: null, senderName: '' })

        if (type === 'accept') {
            await handleAcceptRequest(senderId)
        } else if (type === 'reject') {
            await handleRejectRequest(senderId)
        }
    }

    const handleAcceptRequest = async (senderId) => {
        setLoadingActions(prev => ({ ...prev, [senderId]: 'accepting' }))
        setAnimatingCards(prev => ({ ...prev, [senderId]: 'accepting' }))

        // Wait for animation to complete
        setTimeout(async () => {
            try {
                const response = await AcceptRequest(senderId)
                if (response && response.success) {
                    setReceivedRequests((prevRequests) =>
                        prevRequests.filter((request) => request.senderId._id !== senderId)
                    )
                    setToast({ show: true, message: 'Request accepted successfully!', type: 'success' })
                } else {
                    setToast({ show: true, message: 'Failed to accept request', type: 'error' })
                    setAnimatingCards(prev => ({ ...prev, [senderId]: null }))
                }
            } catch (error) {
                setToast({ show: true, message: 'Network error. Please try again.', type: 'error' })
                setAnimatingCards(prev => ({ ...prev, [senderId]: null }))
            } finally {
                setLoadingActions(prev => ({ ...prev, [senderId]: null }))
            }
        }, 600)
    }

    const handleRejectRequest = async (senderId) => {
        setLoadingActions(prev => ({ ...prev, [senderId]: 'rejecting' }))
        setAnimatingCards(prev => ({ ...prev, [senderId]: 'rejecting' }))

        // Wait for animation to complete
        setTimeout(async () => {
            try {
                const response = await RejectRequest(senderId)
                if (response && response.success) {
                    setReceivedRequests((prevRequests) =>
                        prevRequests.filter((request) => request.senderId._id !== senderId)
                    )
                    setToast({ show: true, message: 'Request rejected successfully', type: 'info' })
                } else {
                    setToast({ show: true, message: 'Failed to reject request', type: 'error' })
                    setAnimatingCards(prev => ({ ...prev, [senderId]: null }))
                }
            } catch (error) {
                setToast({ show: true, message: 'Network error. Please try again.', type: 'error' })
                setAnimatingCards(prev => ({ ...prev, [senderId]: null }))
            } finally {
                setLoadingActions(prev => ({ ...prev, [senderId]: null }))
            }
        }, 600)
    }

    useEffect(() => {
        setPageName("Received");
    }, [setPageName]);

    useEffect(() => {
        const fetchReceivedRequest = async () => {
            try {
                const response = await getReceivedRequest();
                if (response && response.success) {
                    const pendingRequests = response.receiveRequests.filter(
                        (request) => request.status === 'pending'
                    );
                    setReceivedRequests(pendingRequests);
                } else {
                    console.log("fetching profiles error");
                }
            } catch (error) {
                console.log("Frontend api not responded");
            } finally {
                setLoading(false);
            }
        };
        fetchReceivedRequest()
    }, [])

    if (loading) {
        return (
            <>
                <Header loading={true} />
                <div className={styles.app}>
                    <div className={styles.receivedGrid}>
                        <SkeletonLoader variant="receivedCard" count={6} />
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header loading={false} />
            <div className={styles.app}>
                {receivedRequests.length === 0 ? (
                    <EmptyState
                        icon="💌"
                        title="No Requests Yet"
                        subtitle="People who are interested in you will appear here"
                    />
                ) : (
                    <div className={styles.receivedGrid}>
                        {receivedRequests.map((receive, index) => {
                            const senderId = receive.senderId._id;
                            const isAnimating = animatingCards[senderId];
                            const isLoading = loadingActions[senderId];

                            return (
                                <div
                                    key={senderId}
                                    className={`${styles.receivedCard} ${
                                        isAnimating === 'accepting' ? styles.cardAccepting :
                                        isAnimating === 'rejecting' ? styles.cardRejecting : ''
                                    }`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className={styles.cardImageContainer}>
                                        <img
                                            src={receive.senderId?.profile?.profile_image_urls?.[0]}
                                            alt={receive.senderId.name}
                                            className={styles.cardImage}
                                        />
                                        <div className={styles.imageGradient}></div>
                                    </div>

                                    <div className={styles.cardInfo}>
                                        <div className={styles.cardHeader}>
                                            <div>
                                                <h3 className={styles.cardName}>{receive.senderId?.name}</h3>
                                                <p className={styles.cardDetails}>
                                                    {receive.senderId?.profile?.gender && receive.senderId?.profile?.age &&
                                                        `${receive.senderId.profile.gender}, ${receive.senderId.profile.age}`
                                                    }
                                                </p>
                                            </div>
                                            <div className={styles.matchBadge}>
                                                <span className={styles.matchIcon}>⭐</span>
                                                <span className={styles.matchText}>New</span>
                                            </div>
                                        </div>

                                        <p className={styles.receivedDate}>
                                            Received {new Date(receive.updatedAt).toLocaleDateString()}
                                        </p>

                                        <div className={styles.actionButtons}>
                                            <button
                                                className={`${styles.actionButton} ${styles.acceptButton}`}
                                                onClick={() => !isLoading && showConfirmation('accept', senderId, receive.senderId.name)}
                                                disabled={isLoading}
                                            >
                                                {isLoading === 'accepting' ? 'Accepting...' : 'Accept'}
                                            </button>
                                            <button
                                                className={`${styles.actionButton} ${styles.rejectButton}`}
                                                onClick={() => !isLoading && showConfirmation('reject', senderId, receive.senderId.name)}
                                                disabled={isLoading}
                                            >
                                                {isLoading === 'rejecting' ? 'Rejecting...' : 'Reject'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.show}
                title={confirmModal.type === 'accept' ? 'Accept Request?' : 'Reject Request?'}
                message={`Are you sure you want to ${confirmModal.type} the request from ${confirmModal.senderName}?`}
                confirmText={confirmModal.type === 'accept' ? 'Accept' : 'Reject'}
                cancelText="Cancel"
                onConfirm={handleConfirmAction}
                onCancel={() => setConfirmModal({ show: false, type: '', senderId: null, senderName: '' })}
                type={confirmModal.type === 'accept' ? 'success' : 'danger'}
            />

            {/* Toast Notification */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={2000}
                    onClose={() => setToast({ show: false, message: '', type: '' })}
                />
            )}
        </>);
};

export default Received;
