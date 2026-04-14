import { prisma } from '@/lib/db'

interface PokeAPIType {
	type: {
		name: string
	}
}

async function main() {
	console.log('🚀 Iniciando a magia da PokéAPI...')

	const generations = await prisma.generation.findMany()

	if (generations.length === 0) {
		console.log('❌ Ops! Nenhuma geração encontrada no banco de dados.')
		return
	}

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

main().catch((e) => {
	console.error(e)
	process.exit(1)
})
