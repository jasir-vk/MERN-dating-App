import React, { useState } from 'react';
import styles from './compatibilityScore.module.css';

const CompatibilityScore = ({ score, breakdown, compact = false }) => {
    const [showBreakdown, setShowBreakdown] = useState(false);

    const getScoreColor = (score) => {
        if (score >= 80) return 'var(--success-green, #4CAF50)';
        if (score >= 60) return 'var(--warning-orange, #FF9800)';
        return 'var(--error-red, #F44336)';
    };

    const getScoreLabel = (score) => {
        if (score >= 90) return 'Excellent Match!';
        if (score >= 75) return 'Great Match';
        if (score >= 60) return 'Good Match';
        if (score >= 40) return 'Moderate Match';
        return 'Low Match';
    };

    // Calculate SVG circle properties
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    // Compact version (for profile cards)
    if (compact) {
        return (
            <div className={styles.compactScore}>
                <div className={styles.compactCircle}>
                    <svg width="60" height="60" viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id="scoreGradientCompact" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#4B134F" />
                                <stop offset="100%" stopColor="#FF4081" />
                            </linearGradient>
                        </defs>
                        {/* Background circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            stroke="#E0E0E0"
                            strokeWidth="6"
                            fill="none"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            stroke="url(#scoreGradientCompact)"
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className={styles.progressCircle}
                            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                        />
                    </svg>
                    <div className={styles.compactText}>
                        <span className={styles.compactNumber}>{score}%</span>
                    </div>
                </div>
            </div>
        );
    }

    // Full version (for profile view)
    return (
        <div className={styles.scoreContainer}>
            <div className={styles.circularScore}>
                <svg width="120" height="120" viewBox="0 0 100 100">
                    <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4B134F" />
                            <stop offset="100%" stopColor="#FF4081" />
                        </linearGradient>
                    </defs>
                    {/* Background circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        stroke="#E0E0E0"
                        strokeWidth="8"
                        fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        stroke="url(#scoreGradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className={styles.progressCircle}
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    />
                </svg>
                <div className={styles.scoreText}>
                    <span className={styles.scoreNumber}>{score}%</span>
                    <span className={styles.scoreLabel}>Match</span>
                </div>
            </div>

            <div className={styles.scoreLabelText}>
                <span style={{ color: getScoreColor(score) }}>
                    {getScoreLabel(score)}
                </span>
            </div>

            {breakdown && breakdown.length > 0 && (
                <div className={styles.breakdownSection}>
                    <button
                        className={styles.breakdownToggle}
                        onClick={() => setShowBreakdown(!showBreakdown)}
                    >
                        {showBreakdown ? '▲ Hide Details' : '▼ Show Details'}
                    </button>

                    {showBreakdown && (
                        <div className={styles.breakdown}>
                            <p className={styles.breakdownSubtitle}>Here's why:</p>

                            {breakdown.map((factor, idx) => (
                                <div key={idx} className={styles.factor}>
                                    <div className={styles.factorHeader}>
                                        <span className={styles.factorName}>
                                            <span className={styles.factorIcon}>{factor.icon}</span>
                                            {factor.name}
                                        </span>
                                        <span
                                            className={styles.factorScore}
                                            style={{ color: getScoreColor(factor.score) }}
                                        >
                                            {Math.round(factor.score)}%
                                        </span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={styles.progress}
                                            style={{
                                                width: `${factor.score}%`,
                                                background: getScoreColor(factor.score)
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CompatibilityScore;
