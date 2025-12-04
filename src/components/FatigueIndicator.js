import React, { useState } from 'react';
import { useFatigue } from '../contexts/FatigueContext';

export default function FatigueIndicator() {
  const { isTracking, fatigueLevel, stats, notifications, startTracking, stopTracking, getFatigueStatus } = useFatigue();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isTracking) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999
      }}>
        <button
          onClick={startTracking}
          style={{
            padding: '12px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>&#128564;</span>
          <span>Yorgunluk Takibi</span>
        </button>
      </div>
    );
  }

  const status = getFatigueStatus();

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999
    }}>
      {/* Mini Indicator */}
      {!isExpanded && (
        <div
          onClick={() => setIsExpanded(true)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: status.color,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'all 0.3s',
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          <div style={{ fontSize: '24px' }}>
            {status.level === 'critical' ? '🚨' : status.level === 'high' ? '😰' : status.level === 'medium' ? '😐' : '😊'}
          </div>
          <div style={{ fontSize: '12px' }}>{fatigueLevel}%</div>
        </div>
      )}

      {/* Expanded Panel */}
      {isExpanded && (
        <div style={{
          width: '320px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: status.color,
            color: 'white',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Yorgunluk Seviyesi</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{status.text}</div>
            </div>
            <div style={{ fontSize: '40px' }}>
              {status.level === 'critical' ? '🚨' : status.level === 'high' ? '😰' : status.level === 'medium' ? '😐' : '😊'}
            </div>
          </div>

          {/* Progress */}
          <div style={{ padding: '16px' }}>
            <div style={{
              height: '8px',
              background: '#e0e0e0',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '16px'
            }}>
              <div style={{
                height: '100%',
                width: `${fatigueLevel}%`,
                background: status.color,
                transition: 'width 0.5s'
              }} />
            </div>

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ textAlign: 'center', padding: '8px', background: '#f5f5f5', borderRadius: '8px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#667eea' }}>{stats.totalActions}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>Toplam Aksiyon</div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px', background: '#f5f5f5', borderRadius: '8px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f44336' }}>{stats.errors}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>Hata</div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px', background: '#f5f5f5', borderRadius: '8px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#FF9800' }}>{stats.avgResponseTime}s</div>
                <div style={{ fontSize: '11px', color: '#666' }}>Ort. Süre</div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px', background: '#f5f5f5', borderRadius: '8px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4CAF50' }}>{stats.sessionDuration}dk</div>
                <div style={{ fontSize: '11px', color: '#666' }}>Süre</div>
              </div>
            </div>

            {/* Latest Notification */}
            {notifications.length > 0 && (
              <div style={{
                padding: '12px',
                background: notifications[0].level === 'critical' ? '#ffebee' : notifications[0].level === 'warning' ? '#fff3e0' : '#e3f2fd',
                borderRadius: '8px',
                marginBottom: '12px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                  {notifications[0].level === 'critical' ? '🚨' : notifications[0].level === 'warning' ? '⚠️' : 'ℹ️'}
                  {' '}{notifications[0].message}
                </div>
                <div style={{ fontSize: '10px', color: '#666' }}>{notifications[0].timestamp}</div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setIsExpanded(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Küçült
              </button>
              <button
                onClick={stopTracking}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Durdur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
