import { prisma } from '@/lib/db'

interface PokeAPIType {
	type: {
		name: string
	}
}

const generationsData = [
	{ id: 1, name: 'Kanto', startId: 1, endId: 151 },
	{ id: 2, name: 'Johto', startId: 152, endId: 251 },
	{ id: 3, name: 'Hoenn', startId: 252, endId: 386 },
	{ id: 4, name: 'Sinnoh', startId: 387, endId: 493 },
	{ id: 5, name: 'Unova', startId: 494, endId: 649 },
	{ id: 6, name: 'Kalos', startId: 650, endId: 721 },
	{ id: 7, name: 'Alola', startId: 722, endId: 809 },
	{ id: 8, name: 'Galar', startId: 810, endId: 905 },
	{ id: 9, name: 'Paldea', startId: 906, endId: 1025 },
]

const typesData = [
	{ id: 'normal', name: 'Normal' },
	{ id: 'fighting', name: 'Lutador' },
	{ id: 'flying', name: 'Voador' },
	{ id: 'poison', name: 'Venenoso' },
	{ id: 'ground', name: 'Terra' },
	{ id: 'rock', name: 'Pedra' },
	{ id: 'bug', name: 'Inseto' },
	{ id: 'ghost', name: 'Fantasma' },
	{ id: 'steel', name: 'Aço' },
	{ id: 'fire', name: 'Fogo' },
	{ id: 'water', name: 'Água' },
	{ id: 'grass', name: 'Planta' },
	{ id: 'electric', name: 'Elétrico' },
	{ id: 'psychic', name: 'Psíquico' },
	{ id: 'ice', name: 'Gelo' },
	{ id: 'dragon', name: 'Dragão' },
	{ id: 'dark', name: 'Sombrio' },
	{ id: 'fairy', name: 'Fada' },
]

async function main() {
	console.log('🚀 Iniciando a magia da PokéAPI...')

	console.log('📦 Populando as gerações no banco de dados...')
	for (const gen of generationsData) {
		await prisma.generation.upsert({
			where: {
				id: gen.id,
			},
			update: gen,
			create: gen,
		})
	}

	console.log('⏳ Semeando os Tipos...')
	for (const type of typesData) {
		await prisma.type.upsert({
			where: { id: type.id },
			update: type,
			create: type,
		})
	}

	const generations = await prisma.generation.findMany()

	const maxLimit = 1025
	const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${maxLimit}`)
	const data = await res.json()

	console.log(
		`Baixando ${maxLimit} Pokémon... Isso vai levar uns minutinhos! ⏳`,
	)

	for (const item of data.results) {
		try {
			const pokeRes = await fetch(item.url)
			const pokeData = await pokeRes.json()

			const pokeTypes = pokeData.types.map((t: PokeAPIType) => ({
				id: t.type.name,
			}))

			const foundGeneration = generations.find(
				(g) => pokeData.id >= g.startId && pokeData.id <= g.endId,
			)
			const genId = foundGeneration ? foundGeneration.id : 1

			await prisma.pokemon.upsert({
				where: {
					id: pokeData.id,
				},
				update: {},
				create: {
					id: pokeData.id,
					name: pokeData.name,
					isCaptured: false,
					generationId: genId,
					types: {
						connect: pokeTypes,
					},
				},
			})

			if (pokeData.id % 50 === 0) {
				console.log(`✅ ${pokeData.id} Pokémon salvos no banco...`)
			}
		} catch (error) {
			console.error(`⚠️ Erro ao tentar salvar o Pokémon da URL: ${item.url}`, error)
		}
	}

	console.log('🎉 Pokédex populada com SUCESSO! A coleção já pode começar.')
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		// Desconecta graciosamente do banco após terminar
		await prisma.$disconnect()
	})
