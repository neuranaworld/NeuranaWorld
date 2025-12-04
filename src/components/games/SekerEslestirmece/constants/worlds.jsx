import { Heart, Smile, Apple, Carrot, Sun } from 'lucide-react';

// Oyun Dünyaları
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
