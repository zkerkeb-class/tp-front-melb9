import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router"; 
import './pokemonDetails.css';

const PokemonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        setIsFavorite(!isFavorite); 
    };

    const executeDelete = async () => {
        try {
            const res = await fetch(`http://localhost:3000/pokemons/${id}`, { method: 'DELETE' });
            if (res.ok) {
                navigate('/'); 
            }
        } catch (error) {
            alert("Erreur lors de la suppression");
        }
    };

    if (!pokemon) return <p style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>Chargement...</p>;

    const mainType = pokemon.type[0].toLowerCase();

    return (
        <div className="details-page-container">
            <Link to="/" className="back-link">← Retour au Pokédex</Link>

            <div className={`details-card poke-type-${mainType}-border`}>
                
                <button onClick={toggleFavorite} className="details-fav-button">
                    {isFavorite ? "★" : "☆"}
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

                <div className="action-buttons-container">
                    <button 
                        onClick={() => navigate(`/pokemonEdit/${id}`)} 
                        className="btn-action btn-edit"
                    >
                        Modifier
                    </button>
                    <button 
                        onClick={() => setShowDeleteModal(true)} 
                        className="btn-action btn-delete"
                    >
                        Supprimer
                    </button>
                </div>
            </div>

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content delete-modal">
                        <div className="warning-icon" style={{color: '#ff4757', marginBottom: '15px'}}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            </svg>
                        </div>
                        
                        <h3 className="modal-title">Relâcher le Pokémon ?</h3>
                        <p style={{marginBottom: '20px'}}>Es-tu sûr de vouloir relâcher <strong>{pokemon.name.french}</strong> ?</p>
                        
                        <div className="modal-buttons-row" style={{display: 'flex', gap: '10px'}}>
                            <button 
                                className="cancel-button" 
                                onClick={() => setShowDeleteModal(false)}
                                style={{flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid gray', background: 'transparent', color: 'white', cursor: 'pointer'}}
                            >
                                Annuler
                            </button>
                            
                            <button 
                                className="confirm-delete-button" 
                                onClick={executeDelete}
                                style={{flex: 1, padding: '10px', borderRadius: '20px', border: 'none', background: '#ff4757', color: 'white', cursor: 'pointer', fontWeight: 'bold'}}
                            >
                                Relâcher
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default PokemonDetails;