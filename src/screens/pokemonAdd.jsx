import { useState } from "react";

import { useNavigate, Link } from "react-router";
import './pokemonAdd.css';

const PokemonAdd = () => {
    const navigate = useNavigate();
    
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [pokemon, setPokemon] = useState({
        name: { french: "" },
        image: "",
        type: ["Normal"],
        base: { HP: 50, Attack: 50, Defense: 50, Speed: 50, SpecialAttack: 50, SpecialDefense: 50 }
    });

    const allTypes = [
        "Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", 
        "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", 
        "Dragon", "Steel", "Fairy"
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['HP', 'Attack', 'Defense', 'Speed', 'SpecialAttack', 'SpecialDefense'].includes(name)) {
            setPokemon(prev => ({ ...prev, base: { ...prev.base, [name]: parseInt(value) || 0 } }));
        } else if (name === 'name') {
            setPokemon(prev => ({ ...prev, name: { ...prev.name, french: value } }));
        } else if (name === 'type') {
            setPokemon(prev => ({ ...prev, type: [value] }));
        } else {
            setPokemon(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newId = Date.now().toString();
            const newPokemon = { ...pokemon, id: newId };

            const response = await fetch(`http://localhost:3000/pokemons`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPokemon)
            });

            if (response.ok) {
                setShowSuccessModal(true);
            }
        } catch (error) {
            console.error("Erreur création", error);
        }
    };

    return (
        <div className="add-page-container">
             <Link to="/" className="back-link">← Annuler</Link>
            
            <div className="add-card">
                <h2 className="add-title">Ajouter un nouveau Pokémon</h2>

                <form onSubmit={handleSubmit} className="add-form">
                    {/*  ... */}
                    
                    <div className="form-section">
                        <label>Nom du Pokémon</label>
                        <input type="text" name="name" value={pokemon.name.french} onChange={handleChange} className="input-field" required />
                    </div>

                    <div className="form-row">
                        <div className="form-section" style={{flex: 2}}>
                            <label>URL de l'image</label>
                            <input type="text" name="image" value={pokemon.image} onChange={handleChange} className="input-field" placeholder="https://..." />
                        </div>
                        <div className="image-preview">
                            {pokemon.image ? <img src={pokemon.image} alt="Aperçu" /> : <span>📷</span>}
                        </div>
                    </div>

                    <div className="form-section">
                        <label>Type Principal</label>
                        <select name="type" value={pokemon.type[0]} onChange={handleChange} className="input-field select-field">
                            {allTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <h3 className="section-subtitle">Statistiques</h3>
                    <div className="stats-grid-add">
                        {Object.keys(pokemon.base).map((stat) => (
                            <div key={stat} className="stat-input-group">
                                <label>{stat}</label>
                                <input type="number" name={stat} value={pokemon.base[stat]} onChange={handleChange} className="input-field stat-field" />
                            </div>
                        ))}
                    </div>

                    <button type="submit" className="create-button">✨ Créer le Pokémon</button>
                </form>
            </div>

            {/*  */}
            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal-content success-modal">
                        <div className="success-icon">🎉</div>
                        <h3 className="modal-title">Succès !</h3>
                        <p><strong>{pokemon.name.french}</strong> a bien été ajouté au Pokédex.</p>
                        
                        <div className="modal-actions">
                            <button 
                                className="create-button" 
                                style={{marginTop: '20px', width: '100%'}}
                                onClick={() => navigate('/')}
                            >
                                Retour à l'accueil
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PokemonAdd;