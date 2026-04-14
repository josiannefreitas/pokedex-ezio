'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import PokeCard from './PokeCard'

interface Generation {
	id: number
	name: string
}

interface Pokemon {
	id: number
	name: string
	isCaptured: boolean
	generationId: number
	types: { name: string }[]
}

interface Props {
	generations: Generation[]
	pokemonList: Pokemon[]
}

export default function PokeGrid({ generations, pokemonList }: Props) {
	const [selectedGen, setSelectedGen] = useState<number | null>(null)

	const filteredPokemon = selectedGen
		? pokemonList.filter((pokemon) => pokemon.generationId === selectedGen)
		: pokemonList

	return (
		<>
			<div className="flex gap-4 justify-center mb-8 flex-wrap">
				<Button
					onClick={() => setSelectedGen(null)}
					className={`px-6 py-2 rounded-full border font-semibold transition-colors shadow-sm ${
						selectedGen === null
							? 'bg-red-500 text-white border-red-500'
							: 'bg-white text-gray-600 border-gray-300 hover:bg-red-100'
					}`}
				>
					Todos
				</Button>

				{generations.map((gen) => (
					<Button
						key={gen.id}
						onClick={() => setSelectedGen(gen.id)}
						className={`px-6 py-2 rounded-full border font-semibold transition-colors shadow-sm ${
							selectedGen === gen.id
								? 'bg-red-500 text-white border-red-500'
								: 'bg-white text-gray-600 border-gray-300 hover:bg-red-100'
						}`}
					>
						{gen.name}
					</Button>
				))}
			</div>

			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
				{filteredPokemon.length > 0 ? (
					filteredPokemon.map((pokemon) => (
						<PokeCard
							key={pokemon.id}
							id={pokemon.id}
							name={pokemon.name}
							types={pokemon.types.map((t) => t.name)}
							initialIsCaptured={pokemon.isCaptured}
						/>
					))
				) : (
					<div className="col-span-full text-center text-gray-500 mt-10">
						<p>Nenhum Pokémon encontrado para esta geração!</p>
					</div>
				)}
			</div>
		</>
	)
}
