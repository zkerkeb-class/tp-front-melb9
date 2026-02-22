import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import './pokemonEdit.css';

const PokemonEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [pokemon, setPokemon] = useState({
        name: { french: "" },
        image: "",
        type: [],
        base: { HP: 0, Attack: 0, Defense: 0, Speed: 0, SpecialAttack: 0, SpecialDefense: 0 }
    });

    const allTypes = [
        "Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", 
        "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", 
        "Dragon", "Steel", "Fairy"
    ];

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:3000/pokemons/${id}`)
                .then(res => res.json())
                .then(data => setPokemon(data))
                .catch(err => console.error(err));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (['HP', 'Attack', 'Defense', 'Speed', 'SpecialAttack', 'SpecialDefense'].includes(name)) {
            setPokemon(prev => ({
                ...prev,
                base: { ...prev.base, [name]: parseInt(value) || 0 }
            }));
        } 
        else if (name === 'name') {
            setPokemon(prev => ({
                ...prev,
                name: { ...prev.name, french: value }
            }));
        }
        else if (name === 'type') {
            setPokemon(prev => ({ ...prev, type: [value] }));
        }
        else {
            setPokemon(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/pokemons/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pokemon)
            });
            if (response.ok) {
                navigate(`/pokemonDetails/${id}`); 
            }
        } catch (error) {
            console.error("Erreur update", error);
        }
    };

    if (!pokemon.name.french) return <p style={{color:'white', textAlign:'center'}}>Chargement...</p>;

    return (
        <div className="edit-page-container">
             <Link to={`/pokemonDetails/${id}`} className="back-link">← Annuler</Link>
            
            <div className="edit-card">
                <h2 className="edit-title">Modifier {pokemon.name.french}</h2>

                <form onSubmit={handleSubmit} className="edit-form">
                    
                    <div className="form-section">
                        <label>Nom du Pokémon</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={pokemon.name.french} 
                            onChange={handleChange} 
                            className="input-field"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-section" style={{flex: 2}}>
                            <label>URL de l'image</label>
                            <input 
                                type="text" 
                                name="image" 
                                value={pokemon.image} 
                                onChange={handleChange} 
                                className="input-field"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="image-preview">
                            {pokemon.image && <img src={pokemon.image} alt="Preview" />}
                        </div>
                    </div>

                    <div className="form-section">
                        <label>Type Principal</label>
                        <select 
                            name="type" 
                            value={pokemon.type[0] || ""} 
                            onChange={handleChange} 
                            className="input-field select-field"
                        >
                            <option value="" disabled>Choisir un type</option>
                            {allTypes.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <h3 className="section-subtitle">Statistiques de base</h3>
                    
                    <div className="stats-grid-edit">
                        {Object.keys(pokemon.base).map((stat) => (
                            <div key={stat} className="stat-input-group">
                                <label>{stat}</label>
                                <input 
                                    type="number" 
                                    name={stat} 
                                    value={pokemon.base[stat]} 
                                    onChange={handleChange} 
                                    className="input-field stat-field"
                                />
                            </div>
                        ))}
                    </div>

                    <button type="submit" className="save-button">
                         Enregistrer les modifications
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PokemonEdit;