// 'use client'

import PokeGrid from '@/components/PokeGrid'
import { prisma } from '@/lib/db'

export default async function Home() {
	const generations = await prisma.generation.findMany({
		orderBy: {
			id: 'asc',
		},
	})

	const pokemonList = await prisma.pokemon.findMany({
		include: {
			types: true,
		},
		orderBy: {
			id: 'asc',
		},
	})

	return (
		<main className="min-h-screen p-8 bg-gray-50">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
					Pokédex do Ézio
				</h1>

				<PokeGrid generations={generations} pokemonList={pokemonList} />
			</div>
		</main>
	)
}
