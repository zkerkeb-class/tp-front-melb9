import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";

const PokemonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3000/pokemons/${id}`)
            .then(res => res.json())
            .then(data => {
                setPokemon(data);
                const favorites = JSON.parse(localStorage.getItem("pokeFavorites")) || [];
                setIsFavorite(favorites.includes(data.id));
            })
            .catch(err => console.error("Erreur:", err));
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
        // Force la mise à jour visuelle immédiate
        window.dispatchEvent(new Event("storage"));
    };

    const handleDelete = async () => {
        if (window.confirm(`⚠️ Es-tu sûr de vouloir supprimer ${pokemon.name.french} ?`)) {
            try {
                const res = await fetch(`http://localhost:3000/pokemons/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    alert("Pokémon supprimé !");
                    navigate('/');
                }
            } catch (error) {
                alert("Erreur serveur");
            }
        }
    };

    if (!pokemon) return <p style={{textAlign:"center", marginTop:"50px"}}>Chargement...</p>;

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", fontFamily: "Arial", textAlign: "center" }}>
            <div style={{ textAlign: "left", marginBottom: "20px" }}>
                <Link to="/" style={{ textDecoration: "none", color: "#2196F3", fontWeight: "bold" }}>← Retour à la liste</Link>
            </div>

            <div style={{ border: "1px solid #ddd", borderRadius: "15px", padding: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", backgroundColor: "#fff", position: "relative" }}>
                
                {/* BOUTON ÉTOILE DÉTAILS */}
                <button 
                    onClick={toggleFavorite}
                    style={{
                        position: "absolute", top: "20px", right: "20px",
                        background: "none", border: "none", fontSize: "30px",
                        cursor: "pointer", zIndex: 2
                    }}
                >
                    {isFavorite ? "⭐" : "☆"}
                </button>

                <img 
                    src={pokemon.image || "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png"} 
                    alt={pokemon.name.french} 
                    style={{ width: "250px", height: "250px", objectFit: "contain" }} 
                />
                
                <h1 style={{ fontSize: "2.5rem", margin: "10px 0" }}>{pokemon.name.french}</h1>
                
                <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
                    {pokemon.type.map((t, index) => (
                        <span key={index} style={{ padding: "5px 15px", borderRadius: "20px", backgroundColor: "#eee", fontSize: "14px", fontWeight: "bold" }}>
                            {t}
                        </span>
                    ))}
                </div>

                <div style={{ backgroundColor: "#f9f9f9", padding: "15px", borderRadius: "10px", textAlign: "left" }}>
                    <h3 style={{ marginTop: 0, borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Statistiques</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <p><strong>HP:</strong> {pokemon.base.HP}</p>
                        <p><strong>Attaque:</strong> {pokemon.base.Attack}</p>
                        <p><strong>Défense:</strong> {pokemon.base.Defense}</p>
                        <p><strong>Vitesse:</strong> {pokemon.base.Speed}</p>
                    </div>
                </div>

                <div style={{ marginTop: "30px", display: "flex", justifyContent: "center", gap: "15px" }}>
                    <button onClick={() => navigate(`/pokemonEdit/${id}`)} style={{ padding: "10px 20px", backgroundColor: "#FFA500", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Modifier</button>
                    <button onClick={handleDelete} style={{ padding: "10px 20px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Supprimer</button>
                </div>
            </div>
        </div>
    );
};

export default PokemonDetails;