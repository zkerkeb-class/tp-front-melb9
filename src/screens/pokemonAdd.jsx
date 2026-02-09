import { useState } from "react";
import { useNavigate } from "react-router";

const PokemonAdd = () => {
    const navigate = useNavigate();
    
    // 1. ETAT INITIAL (Avec TOUTES les stats obligatoires)
    const [formData, setFormData] = useState({
        name: { french: "" },
        type: ["Normal"], 
        base: { 
            HP: 50, 
            Attack: 50, 
            Defense: 50, 
            SpecialAttack: 50,  // <--- Champ obligatoire ajouté
            SpecialDefense: 50, // <--- Champ obligatoire ajouté
            Speed: 50 
        },
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png" 
    });

    // 2. GESTION DES CHANGEMENTS DANS LE FORMULAIRE
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "frenchName") {
            setFormData({ ...formData, name: { ...formData.name, french: value } });
        }
        else if (name === "image") {
            setFormData({ ...formData, image: value });
        }
        else if (name === "type") {
            setFormData({ ...formData, type: [value] });
        }
        else {
            // Pour les stats, on convertit en nombre entier (parseInt)
            setFormData({ ...formData, base: { ...formData.base, [name]: parseInt(value) } });
        }
    };

    // 3. ENVOI DU FORMULAIRE
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // On ajoute un ID unique basé sur l'heure
        const finalPokemon = {
            ...formData,
            id: Date.now() 
        };

        try {
            const response = await fetch(`http://localhost:3000/pokemons`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalPokemon)
            });

            if (response.ok) {
                alert("✨ Pokémon créé avec succès !");
                navigate('/'); // Retour à l'accueil
            } else {
                // Si erreur, on affiche le détail
                const errorData = await response.json();
                console.log("Erreur Back-end:", errorData);
                alert(`Erreur : ${errorData.message || "Vérifie les champs"}`);
            }
        } catch (error) {
            console.error("Erreur réseau:", error);
            alert("Erreur de connexion au serveur");
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", fontFamily: "Arial" }}>
            <h1 style={{ textAlign: "center", color: "#333" }}>Ajouter un nouveau Pokémon</h1>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                
                {/* NOM */}
                <label><strong>Nom du Pokémon :</strong>
                    <input 
                        type="text" 
                        name="frenchName" 
                        onChange={handleChange} 
                        required 
                        placeholder="Ex: Dracaufeu" 
                        style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ddd" }} 
                    />
                </label>

                {/* IMAGE */}
                <label><strong>URL de l'image (Optionnel) :</strong>
                    <input 
                        type="text" 
                        name="image" 
                        onChange={handleChange} 
                        placeholder="https://..." 
                        style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ddd" }} 
                    />
                </label>
                
                {/* TYPE */}
                <label><strong>Type principal :</strong>
                    <select name="type" onChange={handleChange} style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ddd" }}>
                        <option value="Normal">Normal</option>
                        <option value="Fire">Feu (Fire)</option>
                        <option value="Water">Eau (Water)</option>
                        <option value="Grass">Plante (Grass)</option>
                        <option value="Electric">Electrique</option>
                        <option value="Psychic">Psy</option>
                        <option value="Bug">Insecte</option>
                        <option value="Rock">Roche</option>
                        <option value="Ground">Sol</option>
                    </select>
                </label>

                {/* STATISTIQUES */}
                <h3 style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>Statistiques de combat</h3>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    {/* On boucle sur les 6 stats obligatoires */}
                    {["HP", "Attack", "Defense", "SpecialAttack", "SpecialDefense", "Speed"].map((stat) => (
                        <label key={stat} style={{ fontSize: "14px" }}>
                            {stat} :
                            <input 
                                type="number" 
                                name={stat} 
                                defaultValue="50" 
                                onChange={handleChange} 
                                style={{ width: "100%", padding: "8px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }} 
                            />
                        </label>
                    ))}
                </div>

                {/* BOUTON VALIDER */}
                <button type="submit" style={{ marginTop: "20px", padding: "15px", backgroundColor: "#4CAF50", color: "white", border: "none", cursor: "pointer", fontSize: "18px", borderRadius: "8px", fontWeight: "bold" }}>
                    ✨ Créer le Pokémon
                </button>
            </form>
        </div>
    );
};

export default PokemonAdd;