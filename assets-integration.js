/**
 * Kavian Asset Management System
 * Centralized image storage and retrieval for all HTML pages
 * Save this as: assets-integration.js
 */

// ============================================
// CORE ASSET STORAGE SYSTEM
// ============================================

const AssetManager = {
    // Storage keys
    STORAGE_KEY: 'kavian_assets',
    ALBUMS_KEY: 'kavian_albums',
    
    // Initialize the system
    init() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            this.initializeSampleData();
        }
    },
    
    // Get all assets
    getAllAssets() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },
    
    // Get assets by folder
    getAssetsByFolder(folder) {
        const assets = this.getAllAssets();
        if (folder === 'all') return assets;
        return assets.filter(asset => 
            asset.folder === folder || asset.folder.startsWith(folder + '/')
        );
    },
    
    // Get assets by category
    getAssetsByCategory(category) {
        const assets = this.getAllAssets();
        return assets.filter(asset => asset.category === category);
    },
    
    // Add new asset
    addAsset(asset) {
        const assets = this.getAllAssets();
        const newAsset = {
            id: Date.now() + Math.random(),
            name: asset.name,
            folder: asset.folder || 'projects',
            category: asset.category || 'general',
            url: asset.url,
            size: asset.size || 0,
            date: new Date().toISOString().split('T')[0],
            tags: asset.tags || [],
            description: asset.description || ''
        };
        assets.push(newAsset);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(assets));
        
        // Trigger custom event for real-time updates
        window.dispatchEvent(new CustomEvent('assetsUpdated', { detail: newAsset }));
        
        return newAsset;
    },
    
    // Update asset
    updateAsset(id, updates) {
        const assets = this.getAllAssets();
        const index = assets.findIndex(a => a.id === id);
        if (index !== -1) {
            assets[index] = { ...assets[index], ...updates };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(assets));
            window.dispatchEvent(new CustomEvent('assetsUpdated'));
        }
    },
    
    // Delete asset
    deleteAsset(id) {
        const assets = this.getAllAssets();
        const filtered = assets.filter(a => a.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
        window.dispatchEvent(new CustomEvent('assetsUpdated'));
    },
    
    // Search assets
    searchAssets(query) {
        const assets = this.getAllAssets();
        const lowerQuery = query.toLowerCase();
        return assets.filter(asset => 
            asset.name.toLowerCase().includes(lowerQuery) ||
            asset.description.toLowerCase().includes(lowerQuery) ||
            asset.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    },
    
    // Get asset by ID
    getAssetById(id) {
        const assets = this.getAllAssets();
        return assets.find(a => a.id === id);
    },
    
    // Initialize with sample data
    initializeSampleData() {
        const sampleAssets = [
            {
                id: 1,
                name: 'copper-plant-exterior.jpg',
                folder: 'projects/concentration',
                category: 'concentration',
                url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
                size: 2.4,
                date: '2024-01-15',
                tags: ['copper', 'plant', 'exterior'],
                description: 'Copper concentration plant exterior view'
            },
            {
                id: 2,
                name: 'gold-leaching-operation.jpg',
                folder: 'projects/leaching',
                category: 'leaching',
                url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800',
                size: 3.1,
                date: '2024-01-16',
                tags: ['gold', 'leaching', 'heap'],
                description: 'Gold heap leaching operation'
            },
            {
                id: 3,
                name: 'crusher-equipment.jpg',
                folder: 'projects/equipment',
                category: 'equipment',
                url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800',
                size: 2.8,
                date: '2024-01-17',
                tags: ['crusher', 'equipment', 'mining'],
                description: 'Primary crusher equipment'
            },
            {
                id: 4,
                name: 'flotation-cells.jpg',
                folder: 'projects/concentration',
                category: 'concentration',
                url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800',
                size: 3.5,
                date: '2024-01-21',
                tags: ['flotation', 'cells', 'concentration'],
                description: 'Flotation cell banks'
            },
            {
                id: 5,
                name: 'sag-mill.jpg',
                folder: 'projects/equipment',
                category: 'equipment',
                url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800',
                size: 2.9,
                date: '2024-01-22',
                tags: ['sag', 'mill', 'grinding'],
                description: 'SAG mill installation'
            },
            {
                id: 6,
                name: 'company-logo.svg',
                folder: 'logos',
                category: 'branding',
                url: 'https://cdn.grapesjs.com/workspaces/cmgvbwak408ja13nsemkia83b/assets/7e057c43-5d96-4c3a-a8fc-8bd5f6589a93__kavianpremiumbadgelogo.svg',
                size: 0.5,
                date: '2024-01-20',
                tags: ['logo', 'branding'],
                description: 'Kavian company logo'
            }
        ];
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sampleAssets));
    }
};

// ============================================
// ALBUM MANAGEMENT SYSTEM
// ============================================

const AlbumManager = {
    STORAGE_KEY: 'kavian_albums',
    
    // Get all albums
    getAllAlbums() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : this.getDefaultAlbums();
    },
    
    // Get album by ID
    getAlbumById(id) {
        const albums = this.getAllAlbums();
        return albums.find(a => a.id === id);
    },
    
    // Create new album
    createAlbum(album) {
        const albums = this.getAllAlbums();
        const newAlbum = {
            id: Date.now(),
            title: album.title,
            titleFa: album.titleFa,
            description: album.description,
            descriptionFa: album.descriptionFa,
            category: album.category,
            location: album.location,
            year: album.year,
            cover: album.cover,
            imageIds: album.imageIds || [],
            count: album.imageIds ? album.imageIds.length : 0
        };
        albums.push(newAlbum);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(albums));
        window.dispatchEvent(new CustomEvent('albumsUpdated'));
        return newAlbum;
    },
    
    // Update album
    updateAlbum(id, updates) {
        const albums = this.getAllAlbums();
        const index = albums.findIndex(a => a.id === id);
        if (index !== -1) {
            albums[index] = { ...albums[index], ...updates };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(albums));
            window.dispatchEvent(new CustomEvent('albumsUpdated'));
        }
    },
    
    // Add images to album
    addImagesToAlbum(albumId, imageIds) {
        const album = this.getAlbumById(albumId);
        if (album) {
            album.imageIds = [...new Set([...album.imageIds, ...imageIds])];
            album.count = album.imageIds.length;
            this.updateAlbum(albumId, album);
        }
    },
    
    // Get album images (full asset objects)
    getAlbumImages(albumId) {
        const album = this.getAlbumById(albumId);
        if (!album) return [];
        
        return album.imageIds.map(id => AssetManager.getAssetById(id)).filter(Boolean);
    },
    
    // Default albums structure
    getDefaultAlbums() {
        return [
            {
                id: 1,
                category: 'concentration',
                title: 'Copper Concentration Plant - Chile',
                titleFa: 'کارخانه کنسانتره مس - شیلی',
                description: '50,000 TPD copper concentration facility',
                descriptionFa: 'تأسیسات کنسانتره مس 50000 تن در روز',
                location: 'Chile',
                year: '2023',
                cover: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
                imageIds: [1, 4],
                count: 2
            },
            {
                id: 2,
                category: 'leaching',
                title: 'Gold Heap Leaching Project',
                titleFa: 'پروژه لیچینگ توده‌ای طلا',
                description: 'Large-scale heap leaching operation',
                descriptionFa: 'عملیات لیچینگ توده‌ای در مقیاس بزرگ',
                location: 'Nevada, USA',
                year: '2022',
                cover: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800',
                imageIds: [2],
                count: 1
            },
            {
                id: 3,
                category: 'equipment',
                title: 'Crushing & Grinding Equipment',
                titleFa: 'تجهیزات خردایش و آسیاب',
                description: 'SAG mill and crusher installation',
                descriptionFa: 'نصب آسیاب SAG و خردکن',
                location: 'Australia',
                year: '2023',
                cover: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800',
                imageIds: [3, 5],
                count: 2
            }
        ];
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const AssetUtils = {
    // Convert File to base64 URL
    fileToDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },
    
    // Upload multiple files
    async uploadFiles(files, folder = 'projects', category = 'general') {
        const uploadedAssets = [];
        
        for (const file of files) {
            if (file.type.startsWith('image/')) {
                const url = await this.fileToDataURL(file);
                const asset = AssetManager.addAsset({
                    name: file.name,
                    folder: folder,
                    category: category,
                    url: url,
                    size: (file.size / (1024 * 1024)).toFixed(2),
                    tags: this.extractTags(file.name)
                });
                uploadedAssets.push(asset);
            }
        }
        
        return uploadedAssets;
    },
    
    // Extract tags from filename
    extractTags(filename) {
        const name = filename.toLowerCase().replace(/\.[^/.]+$/, '');
        return name.split(/[-_\s]+/).filter(tag => tag.length > 2);
    },
    
    // Format file size
    formatSize(mb) {
        return mb < 1 ? (mb * 1024).toFixed(0) + ' KB' : mb.toFixed(2) + ' MB';
    },
    
    // Get statistics
    getStatistics() {
        const assets = AssetManager.getAllAssets();
        const albums = AlbumManager.getAllAlbums();
        
        return {
            totalAssets: assets.length,
            totalAlbums: albums.length,
            totalSize: assets.reduce((sum, a) => sum + parseFloat(a.size), 0).toFixed(2),
            byCategory: this.groupByCategory(assets),
            byFolder: this.groupByFolder(assets)
        };
    },
    
    groupByCategory(assets) {
        return assets.reduce((acc, asset) => {
            acc[asset.category] = (acc[asset.category] || 0) + 1;
            return acc;
        }, {});
    },
    
    groupByFolder(assets) {
        return assets.reduce((acc, asset) => {
            acc[asset.folder] = (acc[asset.folder] || 0) + 1;
            return acc;
        }, {});
    }
};

// ============================================
// REAL-TIME SYNC SYSTEM
// ============================================

const SyncManager = {
    // Listen for storage changes across tabs
    init() {
        window.addEventListener('storage', (e) => {
            if (e.key === AssetManager.STORAGE_KEY || e.key === AlbumManager.STORAGE_KEY) {
                window.dispatchEvent(new CustomEvent('assetsUpdated'));
            }
        });
    },
    
    // Broadcast update to all open tabs
    broadcastUpdate() {
        localStorage.setItem('lastUpdate', Date.now().toString());
    }
};

// ============================================
// EXPORT/IMPORT SYSTEM
// ============================================

const ExportImport = {
    // Export all data as JSON
    exportData() {
        const data = {
            assets: AssetManager.getAllAssets(),
            albums: AlbumManager.getAllAlbums(),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kavian-assets-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },
    
    // Import data from JSON
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (data.assets) {
                        localStorage.setItem(AssetManager.STORAGE_KEY, JSON.stringify(data.assets));
                    }
                    if (data.albums) {
                        localStorage.setItem(AlbumManager.STORAGE_KEY, JSON.stringify(data.albums));
                    }
                    
                    window.dispatchEvent(new CustomEvent('assetsUpdated'));
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
};

// ============================================
// INITIALIZE ON LOAD
// ============================================

if (typeof window !== 'undefined') {
    AssetManager.init();
    SyncManager.init();
    
    // Make available globally
    window.AssetManager = AssetManager;
    window.AlbumManager = AlbumManager;
    window.AssetUtils = AssetUtils;
    window.ExportImport = ExportImport;
}

// ============================================
// USAGE EXAMPLES
// ============================================

/*

// In image-manager.html:
// Upload new image
const newAsset = AssetManager.addAsset({
    name: 'my-image.jpg',
    folder: 'projects/concentration',
    category: 'concentration',
    url: 'data:image/jpeg;base64,...',
    size: 2.5,
    tags: ['copper', 'plant']
});

// In gallery.html:
// Get all images for an album
const albumImages = AlbumManager.getAlbumImages(albumId);

// Get images by category
const concentrationImages = AssetManager.getAssetsByCategory('concentration');

// Search images
const searchResults = AssetManager.searchAssets('copper');

// Listen for updates
window.addEventListener('assetsUpdated', () => {
    // Refresh your UI
    loadImages();
});

*/
