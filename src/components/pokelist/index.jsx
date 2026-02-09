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
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        fetch(`http://localhost:3000/pokemons?page=${page}&name=${searchTerm}`)
            .then(res => res.json())
            .then(data => {
                setPokemons(data.data || []);
                setTotalPages(data.totalPages || 1);
            });
    }, [page, searchTerm]);

    useEffect(() => {
        const handleStorageChange = () => setRefresh(prev => prev + 1);
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

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
        <div className="poke-list-container" style={{ padding: "20px" }}>
            <h2 style={{ textAlign: "center" }}>Pokédex</h2>

            <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>
                <form onSubmit={triggerSearch} style={{ display: "flex", gap: "10px" }}>
                    <input 
                        type="text" 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Rechercher..."
                        style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                    />
                    <button type="submit" style={{ padding: "10px", cursor: "pointer" }}>🔍</button>
                </form>

                {/*bouton favoris*/}
                <button 
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    style={{ 
                        padding: "10px 20px", 
                        borderRadius: "5px", 
                        border: "1px solid #FFD700",
                        backgroundColor: showFavoritesOnly ? "#FFD700" : "white", 
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    {showFavoritesOnly ? "⭐ Voir Tout" : "☆ Mes Favoris"}
                </button>

                <Link to="/pokemon/add">
                    <button style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>+ Nouveau</button>
                </Link>
            </div>

            <ul className="poke-list" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", listStyle: "none", padding: 0 }}>
                {displayedPokemons.map(p => <PokeCard key={p.id} pokemon={p} />)}
            </ul>

            {!showFavoritesOnly && (
                <div style={{ textAlign: "center", marginTop: "30px" }}>
                    <button onClick={() => setPage(page-1)} disabled={page === 1} style={{padding:"10px"}}>Précédent</button>
                    <span style={{ margin: "0 15px" }}>Page {page} / {totalPages}</span>
                    <button onClick={() => setPage(page+1)} disabled={page === totalPages} style={{padding:"10px"}}>Suivant</button>
                </div>
            )}
        </div>
    );
};

export default PokeList;