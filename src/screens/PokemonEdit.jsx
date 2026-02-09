import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

const PokemonEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // On prépare le formulaire vide
    const [formData, setFormData] = useState({
        name: { french: "" },
        type: [],
        base: { HP: 0, Attack: 0, Defense: 0, Speed: 0 }
    });

    // 1. On récupère les infos actuelles du Pokémon
    useEffect(() => {
        fetch(`http://localhost:3000/pokemons/${id}`)
            .then(res => res.json())
            .then(data => {
                setFormData(data); 
            });
    }, [id]);

    // 2. Quand on tape dans les champs
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Si on change le nom
        if (name === "frenchName") {
            setFormData({ ...formData, name: { ...formData.name, french: value } });
        }
        // Si on change une stat
        else {
            setFormData({ ...formData, base: { ...formData.base, [name]: parseInt(value) } });
        }
    };

    // 3. Quand on clique sur "Enregistrer"
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const response = await fetch(`http://localhost:3000/pokemons/${id}`, {
            method: 'PUT', // C'est ici qu'on demande la Modification
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert("Modification réussie !");
            navigate(`/pokemonDetails/${id}`); // Retour aux détails
        } else {
            alert("Erreur lors de la modification");
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto", fontFamily: "Arial" }}>
            <h1>Modifier le Pokémon</h1>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                
                <label>
                    <strong>Nom Français :</strong>
                    <input 
                        type="text" 
                        name="frenchName" 
                        value={formData.name?.french || ""} 
                        onChange={handleChange}
                        style={{ padding: "8px", width: "100%", marginTop: "5px" }}
                    />
                </label>

                <h3>Statistiques</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    {["HP", "Attack", "Defense", "Speed"].map((stat) => (
                        <label key={stat}>
                            {stat} :
                            <input 
                                type="number" 
                                name={stat} 
                                value={formData.base?.[stat] || 0} 
                                onChange={handleChange}
                                style={{ padding: "5px", width: "100%" }}
                            />
                        </label>
                    ))}
                </div>

                <button type="submit" style={{ marginTop: "20px", padding: "15px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}>
                    💾 Enregistrer les modifications
                </button>
            </form>
        </div>
    );
};

export default PokemonEdit;