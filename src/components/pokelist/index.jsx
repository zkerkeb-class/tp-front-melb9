import { useState, useEffect } from "react";
import PokeCard from "../pokeCard";
import { Link } from "react-router"; 
import './index.css';

const PokeList = () => {
    const [pokemons, setPokemons] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    useEffect(() => {
        // L'URL est simplifiée : plus de selectedType
        let url = `http://localhost:3000/pokemons?page=${page}&name=${searchTerm}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                setPokemons(data.data || []);
                setTotalPages(data.totalPages || 1);
            })
            .catch(err => console.error("Erreur de chargement:", err));
    }, [page, searchTerm]); 

    const triggerSearch = (e) => {
        e.preventDefault();
        setSearchTerm(inputValue);
        setPage(1);
    };

    const favorites = JSON.parse(localStorage.getItem("pokeFavorites")) || [];
    const displayedPokemons = showFavoritesOnly 
        ? pokemons.filter(p => favorites.includes(p.id))
        : pokemons;

    return (
        <div className="poke-list-container">
            <h2>Pokédex</h2>

            <div className="toolbar-container">
                
                <form onSubmit={triggerSearch} className="search-form">
                    <input 
                        type="text" 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Rechercher..."
                        className="search-input"
                    />
                    <button type="submit" className="search-button">🔍</button>
                </form>


                <button 
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`action-button favorites-button ${showFavoritesOnly ? 'active' : ''}`}
                >
                    <span style={{ marginRight: '8px' }}>
                        {showFavoritesOnly ? "★" : "☆"}
                    </span>
                    Favoris
                </button>

                <Link to="/pokemon/add" className="action-button new-button">
                    + Nouveau
                </Link>
            </div>

            {displayedPokemons.length === 0 ? (
                <div style={{color: 'white', marginTop: '50px', fontStyle: 'italic'}}>
                    Aucun Pokémon trouvé...
                </div>
            ) : (
                <ul className="poke-list">
                    {displayedPokemons.map(p => <PokeCard key={p.id} pokemon={p} />)}
                </ul>
            )}

            {!showFavoritesOnly && totalPages > 1 && (
                <div style={{ textAlign: "center", marginTop: "40px", marginBottom: "40px" }}>
                    <button onClick={() => setPage(page-1)} disabled={page === 1} className="search-button" style={{margin: "0 10px"}}>Précédent</button>
                    <span style={{ margin: "0 15px", color: "white", fontWeight: "bold" }}>Page {page} / {totalPages}</span>
                    <button onClick={() => setPage(page+1)} disabled={page === totalPages} className="search-button" style={{margin: "0 10px"}}>Suivant</button>
                </div>
            )}
        </div>
    );
};

export default PokeList;