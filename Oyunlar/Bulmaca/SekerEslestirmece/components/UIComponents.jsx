/**
 * UI Bileşenleri
 * Skor göstergeleri, başarımlar, ilerleme çubukları vb.
 */

import React from 'react';
import { Trophy, Crown, Target, Flame, Star } from 'lucide-react';

export const ScoreCard = ({ score }) => (
  <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-3 text-center">
    <div className="text-purple-600 text-xs font-bold">🎯 PUAN</div>
    <div className="text-2xl font-black text-purple-900">{score}</div>
  </div>
);

export const MovesCard = ({ moves }) => (
  <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl p-3 text-center">
    <div className="text-pink-600 text-xs font-bold">🎮 HAMLE</div>
    <div className="text-2xl font-black text-pink-900">{moves}</div>
  </div>
);

export const ComboCard = ({ combo }) => (
  <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-3 text-center">
    <div className="text-orange-600 text-xs font-bold">🔥 KOMBO</div>
    <div className="text-2xl font-black text-orange-900">{combo > 0 ? `x${combo}` : '-'}</div>
  </div>
);

export const SpecialsCard = ({ specialsUsed }) => (
  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-3 text-center">
    <div className="text-blue-600 text-xs font-bold">⚡ ÖZEL</div>
    <div className="text-2xl font-black text-blue-900">{specialsUsed}</div>
  </div>
);

export const ProgressBar = ({ score, targetScore, worldColor }) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm font-bold text-gray-600 mb-1">
      <span>Hedef: {targetScore}</span>
      <span>{score} / {targetScore}</span>
    </div>
    <div className="bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
      <div
        className={`h-full bg-gradient-to-r ${worldColor} transition-all duration-500 shadow-lg relative`}
        style={{
          width: `${Math.min((score / targetScore) * 100, 100)}%`,
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4)'
        }}
      >
        {score >= targetScore && (
          <div className="absolute inset-0 bg-white opacity-30 animate-pulse" />
        )}
      </div>
    </div>
  </div>
);

export const ComboIndicator = ({ combo, worldColor }) => {
  if (combo <= 1) return null;

  return (
    <div className={`mb-3 bg-gradient-to-r ${worldColor} text-white p-4 rounded-xl text-center shadow-2xl`}
         style={{ animation: 'candy-pulse 0.5s ease-in-out infinite' }}>
      <div className="text-2xl font-black flex items-center justify-center gap-2">
        <Flame className="animate-bounce" size={28} />
        <span>KOMBO x{combo}!</span>
        <Flame className="animate-bounce" size={28} />
      </div>
    </div>
  );
};

export const AchievementToast = ({ achievements }) => (
  <div className="fixed top-4 right-4 z-50 space-y-2">
    {achievements.map(achievement => (
      <div
        key={achievement.id}
        className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-2xl font-bold text-lg"
        style={{ animation: 'combo-bounce 0.5s ease-out' }}
      >
        {achievement.text}
      </div>
    ))}
  </div>
);

export const LevelCompleteModal = ({ stars, score, maxCombo, specialsUsed, worldColor, onNext }) => (
  <div className={`mb-4 bg-gradient-to-r ${worldColor} text-white p-6 rounded-2xl text-center shadow-2xl`}>
    <div className="text-4xl font-black mb-4">🎉 SEVİYE TAMAMLANDI! 🎉</div>
    <div className="flex justify-center gap-3 mb-4">
      {[...Array(3)].map((_, i) => (
        <Star key={i} size={50} className={i < stars ? 'text-yellow-300 fill-yellow-300' : 'text-gray-400'}
              style={{ animation: i < stars ? 'spin 1s ease-in-out infinite' : 'none' }} />
      ))}
    </div>
    <div className="space-y-2 mb-4">
      <div className="text-2xl font-bold">Puan: {score}</div>
      <div className="text-lg">Max Kombo: x{maxCombo}</div>
      <div className="text-lg">Özel Şekerler: {specialsUsed}</div>
    </div>
    <button
      onClick={onNext}
      className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition text-lg shadow-lg"
    >
      Sonraki Seviye →
    </button>
  </div>
);

export const GameOverModal = ({ score, targetScore, maxCombo, onRetry }) => (
  <div className="mb-4 bg-gradient-to-r from-red-400 to-pink-500 text-white p-6 rounded-2xl text-center shadow-2xl">
    <div className="text-4xl font-black mb-4">💔 OYUN BİTTİ! 💔</div>
    <div className="space-y-2 mb-4">
      <div className="text-xl font-bold">Puan: {score} / {targetScore}</div>
      <div className="text-lg">Max Kombo: x{maxCombo}</div>
    </div>
    <button
      onClick={onRetry}
      className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition text-lg shadow-lg"
    >
      Tekrar Dene
    </button>
  </div>
);

export const PowerUpLegend = () => (
  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
    <div className="bg-blue-50 px-3 py-2 rounded-lg">
      <div className="font-bold text-blue-800">Çizgili (4)</div>
      <div className="text-blue-600">Satır/Sütun</div>
    </div>
    <div className="bg-red-50 px-3 py-2 rounded-lg">
      <div className="font-bold text-red-800">Sarmalı (5)</div>
      <div className="text-red-600">3x3 Patlama</div>
    </div>
    <div className="bg-purple-50 px-3 py-2 rounded-lg">
      <div className="font-bold text-purple-800">Gökkuşağı (6+)</div>
      <div className="text-purple-600">Tüm Renkler</div>
    </div>
  </div>
);

export const TargetInfo = ({ score, targetScore }) => (
  <div className="mt-3 text-center">
    <div className="inline-block bg-purple-50 px-4 py-2 rounded-xl">
      <p className="text-xs text-purple-800 font-semibold">
        <Target className="inline mr-1" size={14} />
        {score >= targetScore ? '✅ Hedef Ulaşıldı!' : `${targetScore - score} puan daha gerekli`}
      </p>
    </div>
  </div>
);

export const TotalScoreBadge = ({ totalScore }) => {
  if (totalScore === 0) return null;

  return (
    <div className="mt-4 inline-block bg-yellow-100 px-6 py-2 rounded-xl">
      <Trophy className="inline mr-2 text-yellow-600" size={20} />
      <span className="font-bold text-yellow-800">Toplam Puan: {totalScore}</span>
    </div>
  );
};

export const UnlockedLevelsBadge = ({ unlockedLevels }) => (
  <div className="inline-block bg-purple-100 px-6 py-3 rounded-xl">
    <p className="text-purple-800 font-bold">
      <Crown className="inline mr-2" size={20} />
      Açılan Seviye: {unlockedLevels} / 100
    </p>
  </div>
);
