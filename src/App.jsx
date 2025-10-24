import React, { useState, useEffect } from 'react';
import './App.css';

const kitapVerisi = [
  { id: 1, baslik: 'Budala', yazar: 'F. Dostoyevski', kategori: 'Klasik' },
  { id: 2, baslik: 'İyi Geceler Punpun', yazar: 'İ. Asano', kategori: 'Manga' },
  { id: 3, baslik: 'Berserk', yazar: 'K. Miura', kategori: 'Manga' },
  { id: 4, baslik: 'Jojo', yazar: 'H. Araki', kategori: 'Manga' },
  { id: 5, baslik: 'İrade Eğitimi', yazar: 'J. Payot', kategori: 'Kişisel Gelişim' },
  { id: 6, baslik: 'Suç ve Ceza', yazar: 'F. Dostoyevski', kategori: 'Klasik' },
  { id: 7, baslik: 'Sefiller', yazar: 'Victor Hugo', kategori: 'Klasik' },
  { id: 8, baslik: 'Atomik Alışkanlıklar', yazar: 'James Clear', kategori: 'Kişisel Gelişim' },
];

const kategoriler = [
  'Tümü',
  ...new Set(kitapVerisi.map((kitap) => kitap.kategori)),
];

const getInitialState = (key, defaultValue) => {
  const storedValue = localStorage.getItem(key);
  if (storedValue) {
    try {
      return JSON.parse(storedValue);
    } catch (error) {
      console.error(`localStorage'dan ${key} okunurken hata:`, error);
      return defaultValue;
    }
  }
  return defaultValue;
};


function AramaCubugu({ aramaMetni, onAramaMetniChange }) {
  return (
    <input
      type="text"
      placeholder="Başlık veya yazar ara..."
      value={aramaMetni}
      onChange={(e) => onAramaMetniChange(e.target.value)}
    />
  );
}
function KategoriFiltre({ seciliKategori, onKategoriChange, kategoriler }) {
  return (
    <select
      value={seciliKategori}
      onChange={(e) => onKategoriChange(e.target.value)}
    >
      {kategoriler.map((kategori) => (
        <option key={kategori} value={kategori}>
          {kategori}
        </option>
      ))}
    </select>
  );
}


function KitapKarti({
  id,
  baslik,
  yazar,
  kategori,
  favorideMi,
  onToggleFavorite,
}) {
  const butonMetni = favorideMi ? 'Favoriden Çıkar' : 'Favori Ekle';

  return (
    <div className="kitap-karti">
      <div className="info">
        <h3>{baslik}</h3>
        <p>
          {yazar} - <em>{kategori}</em>
        </p>
      </div>
      <button
        onClick={() => onToggleFavorite(id)}
        className={favorideMi ? 'favori' : ''}
      >
        {butonMetni}
      </button>
    </div>
  );
}


function KitapListe({ kitaplar, onToggleFavorite, favoriIdListesi }) {
  return (
    <div className="kitap-listesi">
      {kitaplar.map((kitap) => (
        <KitapKarti
          key={kitap.id}
          {...kitap} 
          favorideMi={favoriIdListesi.includes(kitap.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
function FavoriPaneli({ favoriKitaplar }) {
  return (
    <div className="favori-paneli">
      <h2>Favoriler ({favoriKitaplar.length})</h2>
      {favoriKitaplar.length === 0 ? (
        <p className="bos-mesaj">Henüz favori kitabınız yok.</p>
      ) : (
        <ul>
          {favoriKitaplar.map((kitap) => (
            <li key={kitap.id}>{kitap.baslik}</li>
          ))}
        </ul>
      )}
    </div>
  );
}


function App() {
  
  const [aramaMetni, setAramaMetni] = useState(
    () => getInitialState('sonAramaMetni', '')
  );
  
  const [seciliKategori, setSeciliKategori] = useState('Tümü');
  
  const [favoriIdListesi, setFavoriIdListesi] = useState(
    () => getInitialState('favoriler', [])
  );

  
  useEffect(() => {
    localStorage.setItem('sonAramaMetni', JSON.stringify(aramaMetni));
  }, [aramaMetni]);

  useEffect(() => {
    localStorage.setItem('favoriler', JSON.stringify(favoriIdListesi));
  }, [favoriIdListesi]);

  
  
  const filtrelenmisKitaplar = kitapVerisi
    .filter((kitap) => {
      const aramaSorgusu = aramaMetni.toLowerCase();
      return (
        kitap.baslik.toLowerCase().includes(aramaSorgusu) ||
        kitap.yazar.toLowerCase().includes(aramaSorgusu)
      );
    })
    .filter((kitap) => {
      return seciliKategori === 'Tümü' || kitap.kategori === seciliKategori;
    });

  const favoriKitaplar = kitapVerisi.filter((kitap) =>
    favoriIdListesi.includes(kitap.id)
  );

  
  const handleToggleFavorite = (kitapId) => {
    setFavoriIdListesi((prevFavoriler) => {
      if (prevFavoriler.includes(kitapId)) {
        return prevFavoriler.filter((id) => id !== kitapId);
      } else {
        return [...prevFavoriler, kitapId];
      }
    });
  };

  
  return (
    <div className="app-container">
      <h1 className="header">Mini Kitaplık</h1>

      <div className="filter-bar">
      
        <AramaCubugu
          aramaMetni={aramaMetni}
          onAramaMetniChange={setAramaMetni}
        />
        <KategoriFiltre
          seciliKategori={seciliKategori}
          onKategoriChange={setSeciliKategori}
          kategoriler={kategoriler}
        />
      </div>

      <div className="main-content">
        <KitapListe
          kitaplar={filtrelenmisKitaplar}
          onToggleFavorite={handleToggleFavorite}
          favoriIdListesi={favoriIdListesi}
        />
        <FavoriPaneli favoriKitaplar={favoriKitaplar} />
      </div>
    </div>
  );
}

export default App;