import React from 'react';

export default function SkeletonCard() {
    return (
        <div className="tramite-card skeleton-card">
            <div className="card-top skeleton-pulse" style={{ height: '32px', width: '60%', marginBottom: '1rem', borderRadius: '4px' }}></div>
            <div className="card-body">
                <div className="skeleton-pulse" style={{ height: '24px', width: '100%', marginBottom: '0.5rem', borderRadius: '4px' }}></div>
                <div className="skeleton-pulse" style={{ height: '24px', width: '80%', marginBottom: '1.5rem', borderRadius: '4px' }}></div>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <div className="skeleton-pulse" style={{ height: '24px', width: '80px', borderRadius: '12px' }}></div>
                    <div className="skeleton-pulse" style={{ height: '24px', width: '120px', borderRadius: '12px' }}></div>
                </div>
            </div>
            <div className="card-bottom">
                <div className="skeleton-pulse" style={{ height: '14px', width: '150px', borderRadius: '4px' }}></div>
                <div className="skeleton-pulse" style={{ height: '36px', width: '100px', borderRadius: '6px' }}></div>
            </div>
        </div>
    );
}
