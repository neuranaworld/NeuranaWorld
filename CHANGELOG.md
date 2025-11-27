# Changelog

Bu dosya projedeki tüm önemli değişiklikleri içerir.

Format [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) standardına dayanır,
ve proje [Semantic Versioning](https://semver.org/spec/v2.0.0.html) kullanır.

## [Unreleased]

### Changed
- Proje yapısı tamamen yeniden organize edildi
- Duplicate frontend uygulaması kaldırıldı
- Standalone HTML dosyaları arşivlendi

## [1.0.0] - 2025-11-27

### Added
- 🗂️ Yeni klasör yapısı (`docs/`, `scripts/`, `archive/`)
- 📝 Kapsamlı dokümantasyon (`docs/README.md`)
- 🔧 Standart proje dosyaları (LICENSE, CONTRIBUTING, CHANGELOG)
- 📋 Detaylı PR şablonu
- 🎯 .gitignore kuralları genişletildi

### Changed
- ♻️ Root README.md basitleştirildi (430+ satır → 74 satır)
- 📁 Dokümantasyon dosyaları `docs/` klasörüne taşındı
- 🔨 Script dosyaları `scripts/` klasörüne taşındı
- 🏗️ Tek React uygulaması kullanılıyor (Vite)

### Removed
- ❌ Duplicate frontend uygulaması (57,358 satır)
- ❌ Standalone HTML oyun dosyaları (25 dosya)
- ❌ Eski root dosyaları (app.js, style.css)
- 📦 Toplam 59,417 satır kod kaldırıldı

### Fixed
- 🐛 Duplicate kod sorunları
- 🧹 Proje organizasyonu iyileştirildi
- 📂 Dosya yapısı netleştirildi

## [0.1.0] - 2025-11-26

### Added
- ⚛️ React + Vite build setup
- 🚀 GitHub Pages deployment workflow
- 🎮 İlk oyun koleksiyonu
- 🛠️ İlk uygulama araçları
- 📄 .nojekyll dosyası

---

## Versiyon Formatı

**[MAJOR.MINOR.PATCH]**

- **MAJOR**: Breaking changes (uyumsuz API değişiklikleri)
- **MINOR**: Yeni özellikler (geriye uyumlu)
- **PATCH**: Bug fix'ler (geriye uyumlu)

## Değişiklik Kategorileri

- **Added**: Yeni özellikler
- **Changed**: Mevcut özelliklerdeki değişiklikler
- **Deprecated**: Yakında kaldırılacak özellikler
- **Removed**: Kaldırılan özellikler
- **Fixed**: Bug fix'ler
- **Security**: Güvenlik yamalarını
