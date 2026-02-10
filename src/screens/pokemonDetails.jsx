import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import './pokemonDetails.css';

const PokemonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Nécessaire pour la redirection
    const [pokemon, setPokemon] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3000/pokemons/${id}`)
            .then(res => res.json())
            .then(data => {
                setPokemon(data);
                const favorites = JSON.parse(localStorage.getItem("pokeFavorites")) || [];
                setIsFavorite(favorites.includes(data.id));
            });
    }, [id]);

    const toggleFavorite = () => {
        let favorites = JSON.parse(localStorage.getItem("pokeFavorites")) || [];
        if (favorites.includes(pokemon.id)) {
            favorites = favorites.filter(favId => favId !== pokemon.id);
            setIsFavorite(false);
        } else {
            favorites.push(pokemon.id);
            setIsFavorite(true);
        }
        localStorage.setItem("pokeFavorites", JSON.stringify(favorites));
        window.dispatchEvent(new Event("storage"));
        setIsFavorite(!isFavorite); // Mise à jour locale pour l'affichage immédiat
    };

    // Fonction de suppression
    const handleDelete = async () => {
        if (window.confirm(`⚠️ Es-tu sûr de vouloir supprimer ${pokemon.name.french} ?`)) {
            try {
                const res = await fetch(`http://localhost:3000/pokemons/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    navigate('/'); // Retour à l'accueil après suppression
                }
            } catch (error) {
                alert("Erreur lors de la suppression");
            }
        }
    };

    if (!pokemon) return <p style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>Chargement...</p>;

    const mainType = pokemon.type[0].toLowerCase();

    return (
        <div className="details-page-container">
            <Link to="/" className="back-link">← Retour au Pokédex</Link>

            {/* On utilise une classe CSS pour gérer la couleur dynamique via une variable */}
            <div className={`details-card poke-type-${mainType}-border`}>
                
                <button onClick={toggleFavorite} className="details-fav-button">
                    {isFavorite ? "⭐" : "☆"}
                </button>

                <div className="details-image-container">
                    <img src={pokemon.image} alt={pokemon.name.french} className="details-image" />
                </div>

                <h1 className="details-title">{pokemon.name.french}</h1>

                <div className="details-types">
                    {pokemon.type.map(t => (
                        <span key={t} className={`type-badge poke-type-${t.toLowerCase()}`}>
                            {t}
                        </span>
                    ))}
                </div>

                <div className="details-stats">
                    {Object.entries(pokemon.base).map(([key, value]) => (
                        <div className="stat-row" key={key}>
                            <span className="stat-name">{key}</span>
                            <span className="stat-value">{value}</span>
                        </div>
                    ))}
                </div>

                {/* --- BOUTONS D'ACTION (Modifier / Supprimer) --- */}
                <div className="action-buttons-container">
                    <button 
                        onClick={() => navigate(`/pokemonEdit/${id}`)} 
                        className="btn-action btn-edit"
                    >
                        Modifier
                    </button>
                    <button 
                        onClick={handleDelete} 
                        className="btn-action btn-delete"
                    >
                        Supprimer
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PokemonDetails;