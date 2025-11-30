/**
 * Seviye ve Dünya Konfigürasyonları
 * Tüm oyun seviyelerinin, dünyaların ve şeker tiplerinin tanımları
 */

import { Heart, Smile, Apple, Carrot, Sun } from 'lucide-react';

export const GRID_SIZE = 8;

export const CANDY_DATA = {
  'heart-red': { gradient: 'linear-gradient(135deg, #ff6b9d, #ff4d6d, #e63946, #c1121f, #9d0208)', glow: '#ff4d6d', accent: '#ffb3c1', particle: '#ff1744' },
  'heart-pink': { gradient: 'linear-gradient(135deg, #f9a8d4, #f472b6, #ec4899, #db2777, #be185d)', glow: '#ec4899', accent: '#fce7f3', particle: '#f50057' },
  'heart-blue': { gradient: 'linear-gradient(135deg, #7dd3fc, #38bdf8, #0ea5e9, #0284c7, #0369a1)', glow: '#0ea5e9', accent: '#e0f2fe', particle: '#00b0ff' },
  'heart-yellow': { gradient: 'linear-gradient(135deg, #fef08a, #fde047, #facc15, #eab308, #ca8a04)', glow: '#facc15', accent: '#fef9c3', particle: '#ffd600' },
  'heart-green': { gradient: 'linear-gradient(135deg, #86efac, #4ade80, #22c55e, #16a34a, #15803d)', glow: '#22c55e', accent: '#dcfce7', particle: '#00e676' },
  'heart-purple': { gradient: 'linear-gradient(135deg, #c084fc, #a855f7, #9333ea, #7e22ce, #6b21a8)', glow: '#a855f7', accent: '#e9d5ff', particle: '#d500f9' },
  'heart-orange': { gradient: 'linear-gradient(135deg, #fdba74, #fb923c, #f97316, #ea580c, #c2410c)', glow: '#f97316', accent: '#fed7aa', particle: '#ff6d00' },
  'heart-cyan': { gradient: 'linear-gradient(135deg, #a5f3fc, #67e8f9, #22d3ee, #06b6d4, #0891b2)', glow: '#22d3ee', accent: '#cffafe', particle: '#00e5ff' },
  'butterfly-purple': { gradient: 'linear-gradient(135deg, #c084fc, #a855f7, #9333ea, #7e22ce, #6b21a8)', glow: '#a855f7', accent: '#e9d5ff', particle: '#d500f9' },
  'butterfly-blue': { gradient: 'linear-gradient(135deg, #7dd3fc, #38bdf8, #0ea5e9, #0284c7, #0369a1)', glow: '#0ea5e9', accent: '#e0f2fe', particle: '#00b0ff' },
  'butterfly-cyan': { gradient: 'linear-gradient(135deg, #a5f3fc, #67e8f9, #22d3ee, #06b6d4, #0891b2)', glow: '#22d3ee', accent: '#cffafe', particle: '#00e5ff' },
  'butterfly-pink': { gradient: 'linear-gradient(135deg, #f9a8d4, #f472b6, #ec4899, #db2777, #be185d)', glow: '#ec4899', accent: '#fce7f3', particle: '#f50057' },
  'fruit-red': { gradient: 'linear-gradient(135deg, #ff6b9d, #ff4d6d, #e63946, #c1121f, #9d0208)', glow: '#ff4d6d', accent: '#ffb3c1', particle: '#ff1744' },
  'fruit-green': { gradient: 'linear-gradient(135deg, #86efac, #4ade80, #22c55e, #16a34a, #15803d)', glow: '#22c55e', accent: '#dcfce7', particle: '#00e676' },
  'fruit-yellow': { gradient: 'linear-gradient(135deg, #fef08a, #fde047, #facc15, #eab308, #ca8a04)', glow: '#facc15', accent: '#fef9c3', particle: '#ffd600' },
  'fruit-orange': { gradient: 'linear-gradient(135deg, #fdba74, #fb923c, #f97316, #ea580c, #c2410c)', glow: '#f97316', accent: '#fed7aa', particle: '#ff6d00' },
  'veggie-orange': { gradient: 'linear-gradient(135deg, #fdba74, #fb923c, #f97316, #ea580c, #c2410c)', glow: '#f97316', accent: '#fed7aa', particle: '#ff6d00' },
  'veggie-green': { gradient: 'linear-gradient(135deg, #86efac, #4ade80, #22c55e, #16a34a, #15803d)', glow: '#22c55e', accent: '#dcfce7', particle: '#00e676' },
  'veggie-red': { gradient: 'linear-gradient(135deg, #ff6b9d, #ff4d6d, #e63946, #c1121f, #9d0208)', glow: '#ff4d6d', accent: '#ffb3c1', particle: '#ff1744' },
  'veggie-yellow': { gradient: 'linear-gradient(135deg, #fef08a, #fde047, #facc15, #eab308, #ca8a04)', glow: '#facc15', accent: '#fef9c3', particle: '#ffd600' },
  'star-gold': { gradient: 'linear-gradient(135deg, #fef9c3, #fef08a, #fde047, #facc15, #eab308)', glow: '#facc15', accent: '#fffbeb', particle: '#ffd700' },
  'star-silver': { gradient: 'linear-gradient(135deg, #f1f5f9, #e2e8f0, #cbd5e1, #94a3b8, #64748b)', glow: '#cbd5e1', accent: '#f8fafc', particle: '#c0c0c0' },
  'star-blue': { gradient: 'linear-gradient(135deg, #7dd3fc, #38bdf8, #0ea5e9, #0284c7, #0369a1)', glow: '#0ea5e9', accent: '#e0f2fe', particle: '#00b0ff' },
  'star-purple': { gradient: 'linear-gradient(135deg, #c084fc, #a855f7, #9333ea, #7e22ce, #6b21a8)', glow: '#a855f7', accent: '#e9d5ff', particle: '#d500f9' },
};

export const WORLDS = {
  heart: {
    id: 'heart',
    name: 'Kalp Dünyası',
    icon: Heart,
    color: 'from-pink-500 to-red-500',
    bgGradient: 'from-pink-200 via-red-200 to-pink-300',
    candyTypes: ['heart-red', 'heart-pink', 'heart-blue', 'heart-yellow', 'heart-green', 'heart-purple', 'heart-orange', 'heart-cyan'],
    levels: 20,
    startLevel: 1,
  },
  butterfly: {
    id: 'butterfly',
    name: 'Kelebek Dünyası',
    icon: Smile,
    color: 'from-purple-500 to-blue-500',
    bgGradient: 'from-purple-200 via-blue-200 to-purple-300',
    candyTypes: ['butterfly-purple', 'butterfly-blue', 'butterfly-cyan', 'butterfly-pink'],
    levels: 20,
    startLevel: 21,
  },
  fruit: {
    id: 'fruit',
    name: 'Meyve Dünyası',
    icon: Apple,
    color: 'from-green-500 to-yellow-500',
    bgGradient: 'from-green-200 via-yellow-200 to-green-300',
    candyTypes: ['fruit-red', 'fruit-green', 'fruit-yellow', 'fruit-orange'],
    levels: 20,
    startLevel: 41,
  },
  veggie: {
    id: 'veggie',
    name: 'Sebze Dünyası',
    icon: Carrot,
    color: 'from-orange-500 to-amber-500',
    bgGradient: 'from-orange-200 via-amber-200 to-orange-300',
    candyTypes: ['veggie-orange', 'veggie-green', 'veggie-red', 'veggie-yellow'],
    levels: 20,
    startLevel: 61,
  },
  solar: {
    id: 'solar',
    name: 'Güneş Sistemi',
    icon: Sun,
    color: 'from-yellow-500 to-orange-500',
    bgGradient: 'from-yellow-200 via-orange-200 to-yellow-300',
    candyTypes: ['star-gold', 'star-silver', 'star-blue', 'star-purple'],
    levels: 20,
    startLevel: 81,
  }
};
