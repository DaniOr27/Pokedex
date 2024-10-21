import { createContext, useState } from "react";
import { formatStats, formatTypes, formatAbilities, getPokemonDescription, getEvolutions, getImageByPokemon } from "../helpers/pokemon";
import axios from "axios";

const PokemonContext = createContext();

const PokemonProvider = ({children}) => {

    const [pokemonDetail, setPokemonDetail] = useState();
    const [showDetailPokemon, setshowDetailPokemon] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const showPokemon = async (pokemonInfo) => {

        setIsLoading(true);

        const { data: dataSpecies } = await axios.get(pokemonInfo.species.url)
        const {data: dataEvolution} = await axios.get(dataSpecies.evolution_chain.url);

        const { id, name, height, weight, stats, types, abilities } = pokemonInfo;

        const evolutions = await getEvolutions(dataEvolution)

        setPokemonDetail({
            id,
            name,
            height,
            weight,
            stats: formatStats(stats),
            types: formatTypes(types),
            abilities: formatAbilities(abilities),
            description: getPokemonDescription(dataSpecies),
            evolutions,
            image: getImageByPokemon(pokemonInfo.sprites)
        })
        setshowDetailPokemon(true);
        setTimeout (() => {
            setIsLoading(false);
        }, 500);
    };

    const closePokemonDetail = () => {
        setshowDetailPokemon(false)
    };

    return (
        <PokemonContext.Provider value={{
                showDetailPokemon,
                showPokemon,
                closePokemonDetail,
                pokemonDetail,
                isLoading,
            }}
        >
            {children}
        </PokemonContext.Provider>
    );
}

export {PokemonContext, PokemonProvider};