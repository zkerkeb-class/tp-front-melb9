import { Link } from "react-router";
import { useState, useEffect } from "react";
import './index.css';
import PokeTitle from "./pokeTitle";
import PokeImage from "./pokeImage";

const PokeCard = ({ pokemon }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    useEffect(() => {
        const favorites = JSON.parse(localStorage.getItem("pokeFavorites")) || [];
        setIsFavorite(favorites.includes(pokemon.id));
    }, [pokemon.id]);

    const toggleFavorite = (e) => {
        e.preventDefault();
        let favorites = JSON.parse(localStorage.getItem("pokeFavorites")) || [];
        
        if (favorites.includes(pokemon.id)) {
            favorites = favorites.filter(id => id !== pokemon.id);
            setIsFavorite(false);
        } else {
            favorites.push(pokemon.id);
            setIsFavorite(true);
        }
        localStorage.setItem("pokeFavorites", JSON.stringify(favorites));
        window.dispatchEvent(new Event("storage"));
    };

    const mainType = pokemon.type && pokemon.type[0] ? pokemon.type[0].toLowerCase() : 'normal';

    return (
        <Link to={`/pokemonDetails/${pokemon.id}`} style={{ textDecoration: 'none', color: 'inherit', position: 'relative', display: 'block' }}>
            <div className="poke-card">
                
                {/*bouton favoris*/}
                <button 
                    onClick={toggleFavorite}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "rgba(255, 255, 255, 0.8)",
                        border: "none",
                        borderRadius: "50%",
                        width: "35px",
                        height: "35px",
                        cursor: "pointer",
                        zIndex: 10,
                        fontSize: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    {isFavorite ? "⭐" : "☆"}
                </button>

                <div className={`poke-card-header poke-type-${mainType}`}>
                    <PokeTitle name={pokemon.name.french} />
                </div>
                
                <div className="poke-image-background">
                    <PokeImage imageUrl={pokemon.image} />
                </div>
                
                <div className="stats-container">
                    {pokemon.base && Object.entries(pokemon.base).map(([key, value]) => (
                        <div className="poke-stat-row" key={key}>
                            <span className="poke-type-font">{key}</span>
                            <span className="poke-type-font poke-stat-value">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Link>
    );
}

export default PokeCard;